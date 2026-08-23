"""
ResuMesh Client Configuration Settings
"""

import json
from typing import Any, List, Optional, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class CoreSettings(BaseSettings):
    APP_NAME: str = "ResuMesh Client"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    LOG_LEVEL: str = "INFO"
    CORS_ORIGINS: Union[List[str], str] = ["*"]
    SENTRY_DSN: Optional[str] = None

    # Supabase Database & Storage
    SUPABASE_URL: Optional[str] = "https://ahrbyydizkchgoocsifx.supabase.co"
    SUPABASE_KEY: Optional[str] = "sb_publishable_dJd-NCXuVoECVs4o4uvmKQ_MDp-KSw1"
    SUPABASE_SERVICE_ROLE_KEY: Optional[str] = None
    SUPABASE_JWT_SECRET: Optional[str] = None
    DATABASE_URL: str = "postgresql://postgres:postgres@db.ahrbyydizkchgoocsifx.supabase.co:5432/postgres"

    # Scrapers
    GITHUB_PAT: Optional[str] = None
    DEVTO_API_KEY: Optional[str] = None
    BEHANCE_API_KEY: Optional[str] = None

    @field_validator("CORS_ORIGINS", mode="after")
    @classmethod
    def parse_cors_origins(cls, v: Any) -> List[str]:
        if isinstance(v, str):
            if v.startswith("[") and v.endswith("]"):
                return json.loads(v)
            return [item.strip() for item in v.split(",") if item.strip()]
        return v

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = CoreSettings()
