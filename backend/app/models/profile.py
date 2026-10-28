import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, JSON
from sqlalchemy.orm import relationship
from app.database import Base


class Profile(Base):
    """
    Farmer Profile: Completely anonymous profile.
    Complies strictly with privacy.md and DPDP guidelines.
    Contains zero PII (no phone, no name, no Aadhaar, no GPS).
    Authenticated via bearer SHA-256 token hash.
    """
    __tablename__ = "profiles"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    token_hash = Column(String(64), nullable=False, unique=True, index=True)
    district = Column(String(128), nullable=False)
    taluka = Column(String(128), nullable=True)
    crops = Column(JSON, nullable=False, default=list)  # list of crop names, e.g. ["Soybean", "Cotton"]
    lang = Column(String(10), nullable=False, default="mr")  # mr or en
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    last_seen_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    alerts = relationship("Alert", back_populates="profile", cascade="all, delete-orphan")
