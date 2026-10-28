from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class AlertResponse(BaseModel):
    id: str
    kind: str  # NEW, CHANGED, DEADLINE_VERIFIED, WITHDRAWN
    notice_version_id: str
    title: str
    department: Optional[str] = None
    change_summary: Optional[str] = None
    deadline_text: Optional[str] = None
    created_at: datetime
    read_at: Optional[datetime] = None
    is_read: bool

    class Config:
        from_attributes = True
