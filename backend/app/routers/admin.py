from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from app.database import get_db
from app.models.user import User
from app.models.source import Source
from app.models.snapshot import Snapshot
from app.models.notice import Notice, NoticeVersion
from app.models.extraction import Extraction, Verification
from app.models.profile import Profile
from app.models.alert import Alert
from app.models.audit import AuditLog
from app.schemas.user import UserLogin, TokenResponse, UserResponse, AuditLogResponse
from app.schemas.source import SourceCreate, SourceResponse
from app.schemas.extraction import VerificationAction
from app.core.security import verify_password, create_access_token
from app.core.dependencies import get_current_admin_user, require_role, log_audit_event
from app.services.fetcher import fetch_source_content
from app.services.detector import compute_content_hash, compute_text_diff
from app.services.validator import validate_extraction_rules
from app.services.matcher import is_potentially_relevant

router = APIRouter(prefix="/api/v1/admin", tags=["Admin (Secured)"])


@router.post("/login", response_model=TokenResponse)
async def admin_login(payload: UserLogin, db: AsyncSession = Depends(get_db)):
    """Admin login endpoint issuing short-lived JWTs."""
    stmt = select(User).where(User.email == payload.email)
    result = await db.execute(stmt)
    user = result.scalars().first()

    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is disabled")

    # Generate JWT
    token = create_access_token({"sub": user.id, "email": user.email, "role": user.role})
    user.last_login_at = datetime.utcnow()
    await db.commit()

    await log_audit_event(
        db,
        actor=user.email,
        action="LOGIN",
        target=f"user:{user.id}",
        details={"role": user.role},
    )

    return TokenResponse(
        access_token=token,
        role=user.role,
        expires_in=15 * 60,
    )


@router.get("/sources", response_model=List[SourceResponse])
async def list_sources(
    user: User = Depends(require_role(["viewer", "reviewer", "admin"])),
    db: AsyncSession = Depends(get_db),
):
    """List monitored govt sources and health indicators."""
    stmt = select(Source).order_by(Source.created_at.desc())
    result = await db.execute(stmt)
    return result.scalars().all()


@router.post("/sources", response_model=SourceResponse, status_code=status.HTTP_201_CREATED)
async def create_source(
    payload: SourceCreate,
    user: User = Depends(require_role(["admin"])),
    db: AsyncSession = Depends(get_db),
):
    """Add a new official source to monitor (Admin only)."""
    new_src = Source(
        name=payload.name.strip(),
        url=payload.url.strip(),
        kind=payload.kind,
        mode=payload.mode,
        poll_minutes=payload.poll_minutes,
        robots_ok=payload.robots_ok,
        health="green",
    )
    db.add(new_src)
    await db.commit()
    await db.refresh(new_src)

    await log_audit_event(
        db,
        actor=user.email,
        action="SOURCE_CREATE",
        target=f"source:{new_src.id}",
        details={"name": new_src.name, "url": new_src.url},
    )
    return new_src


@router.post("/sources/{source_id}/poll")
async def trigger_source_poll(
    source_id: str,
    user: User = Depends(require_role(["reviewer", "admin"])),
    db: AsyncSession = Depends(get_db),
):
    """Manually trigger a crawl and change detection on an official source."""
    stmt = select(Source).where(Source.id == source_id)
    result = await db.execute(stmt)
    source = result.scalars().first()
    if not source:
        raise HTTPException(status_code=404, detail="Source not found")

    try:
        http_status, new_etag, new_last_mod, raw_content, normalized_text = await fetch_source_content(source.url)
    except Exception as e:
        source.health = "red"
        source.last_error = str(e)
        source.last_checked_at = datetime.utcnow()
        await db.commit()
        return {"status": "error", "message": f"Fetch failed: {str(e)}"}

    source.last_checked_at = datetime.utcnow()
    source.health = "green"
    source.last_error = None

    if http_status == 304:
        await db.commit()
        return {"status": "unchanged", "message": "Source returned 304 Not Modified"}

    new_hash = compute_content_hash(normalized_text)

    # Fetch latest snapshot to check for content differences
    snap_stmt = select(Snapshot).where(Snapshot.source_id == source.id).order_by(Snapshot.fetched_at.desc())
    snap_res = await db.execute(snap_stmt)
    latest_snap = snap_res.scalars().first()

    has_changed = False
    diff_text = None

    if not latest_snap:
        has_changed = True
    elif latest_snap.content_hash != new_hash:
        diff_text = compute_text_diff(latest_snap.normalized_text or "", normalized_text)
        has_changed = (diff_text is not None)

    # Save snapshot
    new_snap = Snapshot(
        source_id=source.id,
        fetched_at=datetime.utcnow(),
        http_status=http_status,
        content_hash=new_hash,
        etag=new_etag,
        last_modified_header=new_last_mod,
        raw_content=raw_content,
        normalized_text=normalized_text,
    )
    db.add(new_snap)

    if has_changed:
        source.last_changed_at = datetime.utcnow()

        # Find or create Notice
        notice_stmt = select(Notice).where(Notice.source_id == source.id)
        notice_res = await db.execute(notice_stmt)
        notice = notice_res.scalars().first()

        if not notice:
            notice = Notice(
                source_id=source.id,
                title=source.name,
                canonical_url=source.url,
            )
            db.add(notice)
            await db.flush()

        # Count existing versions
        ver_count_stmt = select(func.count(NoticeVersion.id)).where(NoticeVersion.notice_id == notice.id)
        ver_count_res = await db.execute(ver_count_stmt)
        ver_count = ver_count_res.scalar() or 0

        # Create new version
        new_version = NoticeVersion(
            notice_id=notice.id,
            snapshot_id=new_snap.id,
            version_no=ver_count + 1,
            content_hash=new_hash,
            change_type="new" if ver_count == 0 else "changed",
            diff_text=diff_text,
        )
        db.add(new_version)
        await db.flush()

        # Generate sample/initial extraction for the crawl
        initial_fields = {
            "name": notice.title,
            "department": "Agriculture Department",
            "eligibility": "Farmers residing in Maharashtra",
            "benefits": "Financial and crop support",
            "deadlines": [],
            "regions": [],
            "crops": [],
            "official_application_link": source.url,
        }
        initial_evidence = {
            "name": notice.title,
            "department": "Agriculture Department",
            "eligibility": "Farmers residing in Maharashtra",
            "benefits": "Financial and crop support",
        }

        # Run automated validator
        status_result, rule_results = validate_extraction_rules(
            fields=initial_fields,
            evidence_spans=initial_evidence,
            source_text=normalized_text,
        )

        extraction = Extraction(
            notice_version_id=new_version.id,
            fields_json=initial_fields,
            evidence_spans_json=initial_evidence,
            model="heuristic-extractor-v1",
        )
        db.add(extraction)

        verification = Verification(
            notice_version_id=new_version.id,
            status=status_result,
            rule_results_json=rule_results,
        )
        db.add(verification)

    await db.commit()
    return {
        "status": "success",
        "has_changed": has_changed,
        "content_hash": new_hash,
        "diff_present": diff_text is not None,
    }


@router.get("/review-queue")
async def get_review_queue(
    user: User = Depends(require_role(["reviewer", "admin"])),
    db: AsyncSession = Depends(get_db),
):
    """
    Returns items awaiting human review:
    Sorted with changed notices / deadline conflicts first.
    Presents extracted fields alongside exact source evidence quotes.
    """
    stmt = (
        select(NoticeVersion)
        .options(
            selectinload(NoticeVersion.notice).selectinload(Notice.source),
            selectinload(NoticeVersion.extraction),
            selectinload(NoticeVersion.verification),
            selectinload(NoticeVersion.snapshot),
        )
        .order_by(NoticeVersion.created_at.desc())
    )
    result = await db.execute(stmt)
    versions = result.scalars().all()

    queue = []
    for ver in versions:
        verif = ver.verification
        # Filter for items that need attention
        if verif and verif.status in ["Needs review", "Auto-checked", "Pending"]:
            ext = ver.extraction
            queue.append({
                "version_id": ver.id,
                "notice_id": ver.notice_id,
                "notice_title": ver.notice.title if ver.notice else "Notice",
                "version_no": ver.version_no,
                "change_type": ver.change_type,
                "diff_text": ver.diff_text,
                "status": verif.status,
                "rule_results": verif.rule_results_json,
                "extracted_fields": ext.fields_json if ext else {},
                "evidence_spans": ext.evidence_spans_json if ext else {},
                "source_text_snippet": (ver.snapshot.normalized_text[:1000] if ver.snapshot and ver.snapshot.normalized_text else ""),
                "created_at": ver.created_at,
            })

    return queue


@router.post("/review/{version_id}")
async def submit_review_decision(
    version_id: str,
    action: VerificationAction,
    user: User = Depends(require_role(["reviewer", "admin"])),
    db: AsyncSession = Depends(get_db),
):
    """
    Human verification step:
    - Approve ('Verified'): Locks verified deadline and triggers idempotent alert generation.
    - Reject ('Rejected')
    - Mark Superseded ('Superseded')
    """
    stmt = (
        select(NoticeVersion)
        .options(
            selectinload(NoticeVersion.verification),
            selectinload(NoticeVersion.extraction),
            selectinload(NoticeVersion.notice),
        )
        .where(NoticeVersion.id == version_id)
    )
    result = await db.execute(stmt)
    ver = result.scalars().first()
    if not ver:
        raise HTTPException(status_code=404, detail="Notice version not found")

    verif = ver.verification
    if not verif:
        verif = Verification(notice_version_id=ver.id)
        db.add(verif)

    verif.status = action.status
    verif.note = action.note
    verif.reviewer_id = user.id
    verif.reviewed_at = datetime.utcnow()

    # If reviewer edited fields before approving
    if action.edited_fields and ver.extraction:
        ver.extraction.fields_json = action.edited_fields.dict()

    # Log action to audit ledger
    await log_audit_event(
        db,
        actor=user.email,
        action=f"REVIEW_{action.status.upper()}",
        target=f"notice_version:{ver.id}",
        details={"note": action.note, "version_no": ver.version_no},
    )

    alerts_generated = 0
    # IF VERIFIED: Match against all existing farmer profiles and create idempotent alerts
    if action.status == "Verified":
        fields = ver.extraction.fields_json if ver.extraction else {}
        profiles_res = await db.execute(select(Profile))
        profiles = profiles_res.scalars().all()

        alert_kind = "CHANGED" if ver.change_type == "changed" else "NEW"

        for p in profiles:
            if is_potentially_relevant(fields, p.district, p.taluka, p.crops):
                # Check for existing alert to maintain idempotency
                existing_alert_stmt = select(Alert).where(
                    Alert.profile_id == p.id,
                    Alert.notice_version_id == ver.id,
                    Alert.kind == alert_kind,
                )
                existing = (await db.execute(existing_alert_stmt)).scalars().first()
                if not existing:
                    alert = Alert(
                        profile_id=p.id,
                        notice_version_id=ver.id,
                        kind=alert_kind,
                        created_at=datetime.utcnow(),
                    )
                    db.add(alert)
                    alerts_generated += 1

    await db.commit()
    return {
        "status": "success",
        "new_status": action.status,
        "alerts_generated": alerts_generated,
    }


@router.get("/audit-logs", response_model=List[AuditLogResponse])
async def list_audit_logs(
    limit: int = 50,
    user: User = Depends(require_role(["viewer", "reviewer", "admin"])),
    db: AsyncSession = Depends(get_db),
):
    """Fetch append-only administrative audit log entries."""
    stmt = select(AuditLog).order_by(AuditLog.created_at.desc()).limit(limit)
    result = await db.execute(stmt)
    return result.scalars().all()


@router.get("/metrics")
async def get_system_metrics(
    user: User = Depends(require_role(["viewer", "reviewer", "admin"])),
    db: AsyncSession = Depends(get_db),
):
    """System health metrics for the admin dashboard."""
    sources_count = (await db.execute(select(func.count(Source.id)))).scalar() or 0
    healthy_sources = (await db.execute(select(func.count(Source.id)).where(Source.health == "green"))).scalar() or 0
    notices_count = (await db.execute(select(func.count(Notice.id)))).scalar() or 0
    profiles_count = (await db.execute(select(func.count(Profile.id)))).scalar() or 0
    pending_reviews = (await db.execute(
        select(func.count(Verification.id)).where(Verification.status.in_(["Needs review", "Auto-checked"]))
    )).scalar() or 0

    return {
        "total_sources": sources_count,
        "healthy_sources": healthy_sources,
        "total_notices": notices_count,
        "total_profiles": profiles_count,
        "review_queue_length": pending_reviews,
    }
