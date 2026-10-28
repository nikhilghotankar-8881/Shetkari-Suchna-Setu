from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from sqlalchemy import select
from app.config import settings
from app.database import init_db, AsyncSessionLocal
from app.models.user import User
from app.models.source import Source
from app.core.security import get_password_hash
from app.routers import health_router, public_router, farmer_router, admin_router


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Applies security headers required by encryption.md:
    - X-Content-Type-Options: nosniff
    - X-Frame-Options: DENY
    - Referrer-Policy: strict-origin-when-cross-origin
    """
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        return response


async def seed_initial_data():
    """Seed initial administrator and default authoritative govt sources if DB is fresh."""
    async with AsyncSessionLocal() as session:
        # 1. Seed Bootstrap Admin User
        admin_stmt = select(User).where(User.email == settings.ADMIN_BOOTSTRAP_EMAIL)
        existing_admin = (await session.execute(admin_stmt)).scalars().first()
        if not existing_admin:
            bootstrap_admin = User(
                email=settings.ADMIN_BOOTSTRAP_EMAIL,
                password_hash=get_password_hash(settings.ADMIN_BOOTSTRAP_PASSWORD),
                role="admin",
                is_active=True,
            )
            session.add(bootstrap_admin)

        # 2. Seed Initial 3 Authoritative Maharashtra Agriculture Sources
        sources_stmt = select(Source)
        existing_sources = (await session.execute(sources_stmt)).scalars().all()
        if not existing_sources:
            initial_sources = [
                Source(
                    name="Maharashtra Krishi Vibhag (कृषी विभाग महाराष्ट्र)",
                    url="https://krishi.maharashtra.gov.in",
                    kind="html",
                    mode="auto",
                    poll_minutes=360,
                    robots_ok=True,
                    health="green",
                ),
                Source(
                    name="MahaDBT Farmer Schemes (महाडीबीटी शेतकरी योजना)",
                    url="https://mahadbt.maharashtra.gov.in",
                    kind="html",
                    mode="auto",
                    poll_minutes=360,
                    robots_ok=True,
                    health="green",
                ),
                Source(
                    name="Pradhan Mantri Fasal Bima Yojana (पंतप्रधान पीक विमा योजना)",
                    url="https://pmfby.gov.in",
                    kind="html",
                    mode="auto",
                    poll_minutes=720,
                    robots_ok=True,
                    health="green",
                ),
            ]
            session.add_all(initial_sources)

        await session.commit()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure tables exist and seed default admin + sources
    await init_db()
    await seed_initial_data()
    yield
    # Shutdown logic if needed


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API for Shetkari Suchna-Setu — Real-time authoritative government agricultural notices & verified scheme alerts for farmers.",
    version="0.1.0",
    lifespan=lifespan,
)

# Apply Security Headers
app.add_middleware(SecurityHeadersMiddleware)

# Apply CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
app.include_router(health_router)
app.include_router(public_router)
app.include_router(farmer_router)
app.include_router(admin_router)
