from datetime import datetime
from typing import Optional
from pydantic import BaseModel, HttpUrl, Field


class SourceBase(BaseModel):
    name: str = Field(..., max_length=255)
    url: str = Field(..., max_length=1024)
    kind: str = Field(default="html", pattern="^(html|pdf|rss)$")
    mode: str = Field(default="auto", pattern="^(auto|manual)$")
    poll_minutes: int = Field(default=360, ge=1)
    robots_ok: bool = True


class SourceCreate(SourceBase):
    pass


class SourceUpdate(BaseModel):
    name: Optional[str] = None
    url: Optional[str] = None
    kind: Optional[str] = None
    mode: Optional[str] = None
    poll_minutes: Optional[int] = None
    robots_ok: Optional[bool] = None
    health: Optional[str] = None


class SourceResponse(SourceBase):
    id: str
    health: str
    last_error: Optional[str] = None
    last_checked_at: Optional[datetime] = None
    last_changed_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True
