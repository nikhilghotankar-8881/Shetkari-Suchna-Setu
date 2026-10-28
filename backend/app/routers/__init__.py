from app.routers.health import router as health_router
from app.routers.public import router as public_router
from app.routers.farmer import router as farmer_router
from app.routers.admin import router as admin_router

__all__ = [
    "health_router",
    "public_router",
    "farmer_router",
    "admin_router",
]
