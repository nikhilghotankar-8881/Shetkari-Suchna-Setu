from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.database import get_db
from app.models.notice import Notice, NoticeVersion
from app.models.source import Source
from app.schemas.notice import SchemeCardResponse
from app.schemas.source import SourceResponse

router = APIRouter(prefix="/api/v1", tags=["Public Data"])


@router.get("/sources", response_model=List[SourceResponse])
async def list_public_sources(db: AsyncSession = Depends(get_db)):
    """Public list of official government sources being monitored."""
    stmt = select(Source).order_by(Source.name)
    result = await db.execute(stmt)
    return result.scalars().all()


@router.get("/schemes", response_model=List[SchemeCardResponse])
async def list_public_schemes(db: AsyncSession = Depends(get_db)):
    """
    Public catalog of government schemes derived from verified or auto-checked notices.
    Enforces honest deadline disclosure:
    - Deadlines are ONLY displayed if status == 'Verified'.
    - If status == 'Auto-checked', deadline is masked with 'Not yet verified'.
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

    cards: List[SchemeCardResponse] = []
    for ver in versions:
        # Only show verified or auto-checked versions; skip rejected/superseded in main view
        verif = ver.verification
        status = verif.status if verif else "Pending"
        if status not in ["Verified", "Auto-checked"]:
            continue

        ext = ver.extraction
        fields = ext.fields_json if ext else {}

        # HONESTY RULE: Deadlines are shown ONLY when verified by a human reviewer
        raw_deadlines = fields.get("deadlines", [])
        is_verified = (status == "Verified")

        if is_verified and raw_deadlines:
            deadline_str = ", ".join(raw_deadlines)
        else:
            deadline_str = "Not yet verified"

        source = ver.notice.source if ver.notice else None

        cards.append(
            SchemeCardResponse(
                id=ver.id,
                notice_id=ver.notice_id,
                version_id=ver.id,
                scheme_name=fields.get("name", ver.notice.title if ver.notice else "Government Notice"),
                department=fields.get("department", "Agriculture Department, Maharashtra"),
                eligibility=fields.get("eligibility", "Refer to official notice"),
                benefits=fields.get("benefits", "Refer to official scheme details"),
                deadline=deadline_str,
                deadline_is_verified=is_verified,
                documents=fields.get("documents", []),
                official_application_link=fields.get("official_application_link") or (ver.notice.canonical_url if ver.notice else ""),
                source_name=source.name if source else "Official Government Portal",
                source_url=source.url if source else (ver.notice.canonical_url if ver.notice else ""),
                last_verified_at=verif.reviewed_at if verif else None,
                verification_badge=status,
                change_type=ver.change_type,
                diff_text=ver.diff_text,
            )
        )

    return cards
