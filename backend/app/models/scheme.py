import uuid
from datetime import datetime, date
from sqlalchemy import Column, String, Date, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.database import Base


class Scheme(Base):
    """
    Farmer-facing published catalog table (as specified in backend.md §5).
    Crucial security / honesty guarantee:
      - 'deadline' is NULL until status == 'Verified'.
      - Prevents any unverified deadline from ever being stored or leaked to clients.
    """
    __tablename__ = "schemes"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    notice_version_id = Column(String(36), ForeignKey("notice_versions.id", ondelete="CASCADE"), nullable=False, unique=True)
    name = Column(String(512), nullable=False)
    department = Column(String(255), nullable=False)
    eligibility = Column(JSON, nullable=False, default=list)
    benefits = Column(JSON, nullable=False, default=list)
    documents = Column(JSON, nullable=False, default=list)
    districts = Column(JSON, nullable=False, default=list)  # [] = statewide
    crops = Column(JSON, nullable=False, default=list)      # [] = all crops
    deadline = Column(String(64), nullable=True)            # NULL unless Verified!
    official_url = Column(String(1024), nullable=True)
    source_url = Column(String(1024), nullable=True)
    last_verified_at = Column(DateTime, nullable=True)

    # Relationship
    notice_version = relationship("NoticeVersion", backref="scheme")
