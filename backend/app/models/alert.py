import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database import Base


class Alert(Base):
    """
    In-app alert generated for a matched farmer profile.
    Guaranteed idempotent via UniqueConstraint on (profile_id, notice_version_id, kind).
    """
    __tablename__ = "alerts"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    profile_id = Column(String(36), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    notice_version_id = Column(String(36), ForeignKey("notice_versions.id", ondelete="CASCADE"), nullable=False)
    kind = Column(String(32), nullable=False, default="NEW")  # NEW, CHANGED, DEADLINE_VERIFIED, WITHDRAWN
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    read_at = Column(DateTime, nullable=True)

    __table_args__ = (
        UniqueConstraint("profile_id", "notice_version_id", "kind", name="uq_profile_notice_kind"),
    )

    # Relationships
    profile = relationship("Profile", back_populates="alerts")
    notice_version = relationship("NoticeVersion")
