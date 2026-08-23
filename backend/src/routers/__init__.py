from routers.articles import router as articles_router
from routers.health import router as health_router
from routers.projects import router as projects_router

__all__ = [
    "health_router",
    "projects_router",
    "articles_router",
]
