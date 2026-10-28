from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class SchemeCardResponse(BaseModel):
    id: str
    notice_id: str
    version_id: str
    scheme_name: str
    department: str
    eligibility: str
    benefits: str
    # HONESTY RULE: Deadline only populated if status == 'Verified'; otherwise explicitly 'Not yet verified'
    deadline: str
    deadline_is_verified: bool
    documents: List[str]
    official_application_link: Optional[str]
    source_name: str
    source_url: str
    last_verified_at: Optional[datetime]
    verification_badge: str  # 'Verified', 'Auto-checked', 'Superseded'
    change_type: str  # 'new', 'changed', 'superseded'
    diff_text: Optional[str] = None


class NoticeVersionResponse(BaseModel):
    id: str
    notice_id: str
    version_no: int
    content_hash: str
    change_type: str
    diff_text: Optional[str] = None
    created_at: datetime
    verification_status: Optional[str] = None
    fields: Optional[Dict[str, Any]] = None
    evidence_spans: Optional[Dict[str, str]] = None

    class Config:
        from_attributes = True


class NoticeResponse(BaseModel):
    id: str
    source_id: str
    source_name: Optional[str] = None
    title: str
    canonical_url: str
    first_seen_at: datetime
    is_active: bool
    latest_version: Optional[NoticeVersionResponse] = None

    class Config:
        from_attributes = True
