import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base


class Snapshot(Base):
    __tablename__ = "snapshots"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    source_id = Column(String(36), ForeignKey("sources.id", ondelete="CASCADE"), nullable=False)
    fetched_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    http_status = Column(Integer, nullable=False)
    content_hash = Column(String(64), nullable=False)  # SHA-256 of normalized text
    etag = Column(String(255), nullable=True)
    last_modified_header = Column(String(255), nullable=True)
    raw_content = Column(Text, nullable=True)  # Raw body/text content
    normalized_text = Column(Text, nullable=True)  # Normalized text used for diff & extraction

    # Relationship
    source = relationship("Source", backref="snapshots")
