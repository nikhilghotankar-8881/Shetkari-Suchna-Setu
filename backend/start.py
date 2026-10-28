"""
Entrypoint to run the Shetkari Suchna-Setu FastAPI backend server locally.
Usage:
    python start.py
"""
import sys
import uvicorn
from app.config import settings

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

if __name__ == "__main__":
    print(f"Starting {settings.PROJECT_NAME} on {settings.HOST}:{settings.PORT} ...")
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
    )
