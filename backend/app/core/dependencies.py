from datetime import datetime
from typing import Optional, List, Callable
from fastapi import Depends, HTTPException, Header, Cookie, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.profile import Profile
from app.models.user import User
from app.models.audit import AuditLog
from app.core.security import hash_token, decode_access_token

admin_bearer_scheme = HTTPBearer(auto_error=False)


async def get_current_farmer_profile(
    x_profile_token: Optional[str] = Header(None, alias="X-Profile-Token"),
    profile_token: Optional[str] = Cookie(None, alias="profile_token"),
    db: AsyncSession = Depends(get_db),
) -> Profile:
    """
    Authenticate an anonymous farmer via their 256-bit bearer token.
    The raw token is provided via HTTP header or secure cookie.
    Matches SHA-256(token) against stored token_hash.
    """
    raw_token = x_profile_token or profile_token
    if not raw_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing farmer profile token. Please create or supply your profile token.",
        )

    computed_hash = hash_token(raw_token)
    stmt = select(Profile).where(Profile.token_hash == computed_hash)
    result = await db.execute(stmt)
    profile = result.scalars().first()

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired profile token.",
        )

    # Touch last_seen_at timestamp
    profile.last_seen_at = datetime.utcnow()
    await db.commit()
    return profile


async def get_current_admin_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(admin_bearer_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    """
    Authenticate an administrative user via short-lived JWT.
    """
    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Admin authentication credentials required.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    payload = decode_access_token(credentials.credentials)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired admin access token.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = payload["sub"]
    stmt = select(User).where(User.id == user_id)
    result = await db.execute(stmt)
    user = result.scalars().first()

    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account is inactive or not found.",
        )

    return user


def require_role(allowed_roles: List[str]) -> Callable:
    """
    Role-Based Access Control (RBAC) dependency factory.
    Roles: viewer, reviewer, admin.
    """
    async def role_checker(current_user: User = Depends(get_current_admin_user)) -> User:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Operation not permitted. Required role: {', '.join(allowed_roles)}. Your role: {current_user.role}",
            )
        return current_user

    return role_checker


async def log_audit_event(
    db: AsyncSession,
    actor: str,
    action: str,
    target: str,
    details: Optional[dict] = None,
) -> None:
    """Append-only audit trail helper."""
    entry = AuditLog(
        actor=actor,
        action=action,
        target=target,
        details_json=details,
        created_at=datetime.utcnow(),
    )
    db.add(entry)
    await db.commit()
