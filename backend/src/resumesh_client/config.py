"""
ResuMesh Client Configuration Settings
"""

from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class CoreSettings(BaseSettings):
    APP_NAME: str = "ResuMesh Client"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    LOG_LEVEL: str = "INFO"
    CORS_ORIGINS: List[str] = ["*"]
    SENTRY_DSN: Optional[str] = None

    # Database & Storage
    SUPABASE_URL: Optional[str] = None
    SUPABASE_KEY: Optional[str] = None
    SUPABASE_SERVICE_ROLE_KEY: Optional[str] = None
    SUPABASE_JWT_SECRET: Optional[str] = None
    DATABASE_URL: Optional[str] = None

    # Scrapers
    GITHUB_PAT: Optional[str] = None
    DEVTO_API_KEY: Optional[str] = None
    BEHANCE_API_KEY: Optional[str] = None

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = CoreSettings()
