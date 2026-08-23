"""
ResuMesh Client API Entrypoint - Read-Only Visitor REST Service
"""

import resumesh_client.models  # noqa: F401
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from resumesh_client.routers import (
    app_settings,
    articles,
    avatar,
    certificates,
    cv,
    educations,
    experiences,
    health,
    packages,
    posts,
    projects,
    search,
    sections,
    seo,
    skills,
    social_links,
    videos,
)
from resumesh_client.config import settings
from resumesh_client.db import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    description="Open Source Intelligent Portfolio Visitor API Engine",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)

app.include_router(health.router)
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
app.include_router(cv.router)
app.include_router(avatar.router)
app.include_router(seo.router)


@app.get("/")
def read_root():
    return {
        "message": "Welcome to ResuMesh Visitor API Service",
        "version": "1.0.0",
        "docs": "/docs",
    }
