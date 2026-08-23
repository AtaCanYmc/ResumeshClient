from resumesh_client.routers.admin import router as admin_router
from resumesh_client.routers.articles import router as articles_router
from resumesh_client.routers.health import router as health_router
from resumesh_client.routers.projects import router as projects_router

__all__ = [
    "health_router",
    "projects_router",
    "articles_router",
    "admin_router",
]
