import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime
from app.database import Base


class User(Base):
    """
    Administrative accounts with Role-Based Access Control (RBAC).
    Roles:
      - 'viewer': can view dashboard and reports
      - 'reviewer': can approve/reject/edit extractions
      - 'admin': can manage sources, users, and publish alerts
    """
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(32), nullable=False, default="reviewer")  # viewer, reviewer, admin
    is_active = Column(Boolean, default=True, nullable=False)
    mfa_enabled = Column(Boolean, default=False, nullable=False)
    mfa_secret = Column(String(64), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    last_login_at = Column(DateTime, nullable=True)
