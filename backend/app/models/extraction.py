import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.database import Base


class Extraction(Base):
    __tablename__ = "extractions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    notice_version_id = Column(String(36), ForeignKey("notice_versions.id", ondelete="CASCADE"), nullable=False, unique=True)
    # Stored extracted schema fields: name, department, eligibility, benefits, documents, deadlines[], regions[], crops[]
    fields_json = Column(JSON, nullable=False, default=dict)
    # Evidence quote mapping: field_name -> quote string from original source
    evidence_spans_json = Column(JSON, nullable=False, default=dict)
    model = Column(String(64), nullable=False, default="regex-and-rules-v1")
    prompt_ver = Column(String(32), nullable=False, default="1.0.0")
    confidence = Column(Float, default=1.0)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationship
    notice_version = relationship("NoticeVersion", back_populates="extraction")


class Verification(Base):
    __tablename__ = "verifications"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    notice_version_id = Column(String(36), ForeignKey("notice_versions.id", ondelete="CASCADE"), nullable=False, unique=True)
    # Status: 'Pending', 'Auto-checked', 'Needs review', 'Verified', 'Rejected', 'Superseded'
    status = Column(String(32), nullable=False, default="Pending")
    rule_results_json = Column(JSON, nullable=False, default=dict)
    reviewer_id = Column(String(36), nullable=True)  # Admin user who approved/rejected
    reviewed_at = Column(DateTime, nullable=True)
    note = Column(Text, nullable=True)

    # Relationship
    notice_version = relationship("NoticeVersion", back_populates="verification")
