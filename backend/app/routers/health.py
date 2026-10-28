from datetime import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.database import get_db

router = APIRouter(tags=["Health"])


@router.get("/health")
@router.get("/api/v1/health")
async def health_check(db: AsyncSession = Depends(get_db)):
    """Health check endpoint to verify API and database connectivity."""
    db_status = "ok"
    try:
        await db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"

    return {
        "status": "healthy" if db_status == "ok" else "degraded",
        "app": "Shetkari Suchna-Setu Backend",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "database": db_status,
    }
