from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel, EmailStr, Field


class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    totp_code: Optional[str] = None


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    role: str = Field(default="reviewer", pattern="^(viewer|reviewer|admin)$")


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    expires_in: int


class UserResponse(BaseModel):
    id: str
    email: str
    role: str
    is_active: bool
    mfa_enabled: bool
    created_at: datetime
    last_login_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class AuditLogResponse(BaseModel):
    id: str
    actor: str
    action: str
    target: str
    details_json: Optional[Dict[str, Any]] = None
    created_at: datetime

    class Config:
        from_attributes = True
