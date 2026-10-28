import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, JSON, Text
from app.database import Base


class AuditLog(Base):
    """
    Append-only audit trail. Never updated or deleted.
    Logs all administrative decisions (approvals, rejections, source updates).
    """
    __tablename__ = "audit_log"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    actor = Column(String(255), nullable=False)  # User ID, email, or "system"
    action = Column(String(64), nullable=False)  # e.g., APPROVE, REJECT, EDIT, PUBLISH, SOURCE_CREATE
    target = Column(String(255), nullable=False)  # e.g., notice_version:<id>, source:<id>
    details_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
