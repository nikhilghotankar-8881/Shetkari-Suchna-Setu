from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from sqlalchemy.orm import selectinload
from app.database import get_db
from app.models.profile import Profile
from app.models.alert import Alert
from app.models.notice import Notice, NoticeVersion
from app.schemas.profile import ProfileCreate, ProfileUpdate, ProfileResponse
from app.schemas.notice import SchemeCardResponse
from app.schemas.alert import AlertResponse
from app.core.security import generate_profile_token, hash_token
from app.core.dependencies import get_current_farmer_profile
from app.services.matcher import is_potentially_relevant

router = APIRouter(prefix="/api/v1", tags=["Farmer (Anonymous)"])


@router.post("/profile", response_model=ProfileResponse, status_code=status.HTTP_201_CREATED)
@router.post("/farmer/profile", response_model=ProfileResponse, status_code=status.HTTP_201_CREATED)
async def create_profile(
    payload: ProfileCreate,
    response: Response,
    db: AsyncSession = Depends(get_db),
):
    """
    Onboarding: Create an anonymous farmer profile without name, password, or phone.
    Generates a 256-bit random opaque token; stores only its SHA-256 hash.
    Sets HttpOnly cookie and returns the raw token once for the client storage.
    """
    raw_token = generate_profile_token()
    token_hash = hash_token(raw_token)

    new_profile = Profile(
        token_hash=token_hash,
        district=payload.district.strip(),
        taluka=payload.taluka.strip() if payload.taluka else None,
        crops=[c.strip() for c in payload.crops],
        lang=payload.lang,
        created_at=datetime.utcnow(),
        last_seen_at=datetime.utcnow(),
    )
    db.add(new_profile)
    await db.commit()
    await db.refresh(new_profile)

    # Set secure cookie on response
    response.set_cookie(
        key="profile_token",
        value=raw_token,
        httponly=True,
        samesite="lax",
        max_age=31536000,  # 1 year
    )

    resp = ProfileResponse.model_validate(new_profile)
    resp.token = raw_token
    return resp


@router.get("/profile", response_model=ProfileResponse)
async def get_my_profile(profile: Profile = Depends(get_current_farmer_profile)):
    """Fetch the authenticated farmer's own profile."""
    return profile


@router.put("/profile", response_model=ProfileResponse)
async def update_my_profile(
    payload: ProfileUpdate,
    profile: Profile = Depends(get_current_farmer_profile),
    db: AsyncSession = Depends(get_db),
):
    """Update district, taluka, or crops for the authenticated profile."""
    if payload.district is not None:
        profile.district = payload.district.strip()
    if payload.taluka is not None:
        profile.taluka = payload.taluka.strip()
    if payload.crops is not None:
        profile.crops = [c.strip() for c in payload.crops]
    if payload.lang is not None:
        profile.lang = payload.lang

    profile.last_seen_at = datetime.utcnow()
    await db.commit()
    await db.refresh(profile)
    return profile


@router.delete("/profile", status_code=status.HTTP_204_NO_CONTENT)
async def delete_my_profile(
    response: Response,
    profile: Profile = Depends(get_current_farmer_profile),
    db: AsyncSession = Depends(get_db),
):
    """
    DPDP Compliance: Hard-deletes farmer profile and all corresponding in-app alerts.
    Clears device authentication cookie.
    """
    await db.delete(profile)
    await db.commit()
    response.delete_cookie("profile_token")
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/schemes", response_model=List[SchemeCardResponse])
async def get_matched_schemes(
    profile: Profile = Depends(get_current_farmer_profile),
    db: AsyncSession = Depends(get_db),
):
    """
    Returns schemes marked 'potentially relevant' to this specific farmer's
    district, taluka, and selected crops.
    """
    stmt = (
        select(NoticeVersion)
        .options(
            selectinload(NoticeVersion.notice).selectinload(Notice.source),
            selectinload(NoticeVersion.extraction),
            selectinload(NoticeVersion.verification),
        )
        .order_by(NoticeVersion.created_at.desc())
    )
    result = await db.execute(stmt)
    versions = result.scalars().all()

    matched_cards: List[SchemeCardResponse] = []
    for ver in versions:
        verif = ver.verification
        status_val = verif.status if verif else "Pending"
        if status_val not in ["Verified", "Auto-checked"]:
            continue

        ext = ver.extraction
        fields = ext.fields_json if ext else {}

        # Evaluate relevance
        if not is_potentially_relevant(fields, profile.district, profile.taluka, profile.crops):
            continue

        # Format honesty deadline
        is_verified = (status_val == "Verified")
        raw_deadlines = fields.get("deadlines", [])
        deadline_text = ", ".join(raw_deadlines) if (is_verified and raw_deadlines) else "Not yet verified"
        source = ver.notice.source if ver.notice else None

        matched_cards.append(
            SchemeCardResponse(
                id=ver.id,
                notice_id=ver.notice_id,
                version_id=ver.id,
                scheme_name=fields.get("name", ver.notice.title if ver.notice else "Notice"),
                department=fields.get("department", "Agriculture Department, Maharashtra"),
                eligibility=fields.get("eligibility", "Refer to official notice"),
                benefits=fields.get("benefits", "Refer to official scheme details"),
                deadline=deadline_text,
                deadline_is_verified=is_verified,
                documents=fields.get("documents", []),
                official_application_link=fields.get("official_application_link") or (ver.notice.canonical_url if ver.notice else ""),
                source_name=source.name if source else "Official Government Portal",
                source_url=source.url if source else (ver.notice.canonical_url if ver.notice else ""),
                last_verified_at=verif.reviewed_at if verif else None,
                verification_badge=status_val,
                change_type=ver.change_type,
                diff_text=ver.diff_text,
            )
        )

    return matched_cards


@router.get("/alerts", response_model=List[AlertResponse])
async def get_farmer_alerts(
    profile: Profile = Depends(get_current_farmer_profile),
    db: AsyncSession = Depends(get_db),
):
    """Retrieve all in-app notifications generated for this profile."""
    stmt = (
        select(Alert)
        .options(
            selectinload(Alert.notice_version).selectinload(NoticeVersion.notice),
            selectinload(Alert.notice_version).selectinload(NoticeVersion.extraction),
            selectinload(Alert.notice_version).selectinload(NoticeVersion.verification),
        )
        .where(Alert.profile_id == profile.id)
        .order_by(Alert.created_at.desc())
    )
    result = await db.execute(stmt)
    alerts = result.scalars().all()

    alert_responses = []
    for a in alerts:
        nv = a.notice_version
        notice = nv.notice if nv else None
        ext = nv.extraction if nv else None
        fields = ext.fields_json if ext else {}

        verif = nv.verification if nv else None
        is_verified = (verif and verif.status == "Verified")
        raw_deadlines = fields.get("deadlines", [])
        deadline_text = ", ".join(raw_deadlines) if (is_verified and raw_deadlines) else "Not yet verified"

        alert_responses.append(
            AlertResponse(
                id=a.id,
                kind=a.kind,
                notice_version_id=a.notice_version_id,
                title=notice.title if notice else "Notice Update",
                department=fields.get("department", "Agriculture Department"),
                change_summary=nv.diff_text[:200] if nv and nv.diff_text else None,
                deadline_text=deadline_text,
                created_at=a.created_at,
                read_at=a.read_at,
                is_read=a.read_at is not None,
            )
        )

    return alert_responses


@router.patch("/alerts/{alert_id}/read", status_code=status.HTTP_204_NO_CONTENT)
@router.post("/alerts/{alert_id}/read", status_code=status.HTTP_204_NO_CONTENT)
async def mark_alert_as_read(
    alert_id: str,
    profile: Profile = Depends(get_current_farmer_profile),
    db: AsyncSession = Depends(get_db),
):
    """Mark an in-app alert as read."""
    stmt = select(Alert).where(Alert.id == alert_id, Alert.profile_id == profile.id)
    result = await db.execute(stmt)
    alert = result.scalars().first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    alert.read_at = datetime.utcnow()
    await db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
