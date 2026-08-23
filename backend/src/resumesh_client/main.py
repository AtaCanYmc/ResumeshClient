"""
ResuMesh API Entrypoint - Fast REST API
"""

import resumesh_storage.models  # noqa: F401
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from resumesh_client.routers import (
    admin,
    app_settings,
    articles,
    auth,
    avatar,
    certificates,
    cv,
    educations,
    experiences,
    health,
    packages,
    posts,
    projects,
    rxresume,
    search,
    sections,
    seo,
    skills,
    social_links,
    storage,
    videos,
)
from resumesh_core.config import settings
from resumesh_storage.db import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    description="Open Source Intelligent Portfolio and CV Management Engine",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(articles.router)
app.include_router(educations.router)
app.include_router(experiences.router)
app.include_router(skills.router)
app.include_router(certificates.router)
app.include_router(packages.router)
app.include_router(posts.router)
app.include_router(videos.router)
app.include_router(social_links.router)
app.include_router(sections.router)
app.include_router(app_settings.router)
app.include_router(search.router)
app.include_router(admin.router)
app.include_router(cv.router)
app.include_router(avatar.router)
app.include_router(storage.router)
app.include_router(rxresume.router)
app.include_router(seo.router)


@app.get("/")
def read_root():
    return {
        "message": "Welcome to ResuMesh API Core Engine",
        "version": "1.0.0",
        "docs": "/docs",
    }
