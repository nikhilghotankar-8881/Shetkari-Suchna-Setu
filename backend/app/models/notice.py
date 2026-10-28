import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base


class Notice(Base):
    __tablename__ = "notices"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    source_id = Column(String(36), ForeignKey("sources.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(512), nullable=False)
    canonical_url = Column(String(1024), nullable=False)
    first_seen_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    is_active = Column(Integer, default=1)  # 1 for active, 0 for withdrawn

    # Relationships
    source = relationship("Source", backref="notices")
    versions = relationship("NoticeVersion", back_populates="notice", cascade="all, delete-orphan", order_by="NoticeVersion.version_no.desc()")


class NoticeVersion(Base):
    __tablename__ = "notice_versions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    notice_id = Column(String(36), ForeignKey("notices.id", ondelete="CASCADE"), nullable=False)
    snapshot_id = Column(String(36), ForeignKey("snapshots.id", ondelete="SET NULL"), nullable=True)
    version_no = Column(Integer, nullable=False, default=1)
    content_hash = Column(String(64), nullable=False)  # SHA-256
    change_type = Column(String(32), nullable=False, default="new")  # new, changed, superseded, withdrawn
    diff_text = Column(Text, nullable=True)  # Unified diff from previous version
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    notice = relationship("Notice", back_populates="versions")
    snapshot = relationship("Snapshot")
    extraction = relationship("Extraction", uselist=False, back_populates="notice_version", cascade="all, delete-orphan")
    verification = relationship("Verification", uselist=False, back_populates="notice_version", cascade="all, delete-orphan")
