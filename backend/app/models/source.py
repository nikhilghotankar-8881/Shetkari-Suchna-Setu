import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Boolean, DateTime
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base


class Source(Base):
    __tablename__ = "sources"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    url = Column(String(1024), nullable=False)
    kind = Column(String(32), nullable=False, default="html")  # html, pdf, rss
    mode = Column(String(32), nullable=False, default="auto")  # auto, manual
    poll_minutes = Column(Integer, default=360)  # default 6 hours
    robots_ok = Column(Boolean, default=True)
    health = Column(String(32), default="green")  # green, yellow, red
    last_error = Column(String(1024), nullable=True)
    last_checked_at = Column(DateTime, nullable=True)
    last_changed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
