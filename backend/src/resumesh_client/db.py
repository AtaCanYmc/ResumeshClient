"""
Database connection and session factory.
Database connection settings are loaded exclusively from environment variables / .env files.
Defaults to sqlite:///:memory: if no DATABASE_URL is configured (e.g., test environments).
"""

import os

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from resumesh_client.config import settings

Base = declarative_base()

raw_db_url = (
    os.getenv("DATABASE_URL")
    or os.getenv("SUPABASE_DATABASE_URL")
    or settings.DATABASE_URL
    or "sqlite:///:memory:"
)

# Normalize legacy postgres:// scheme to postgresql:// required by SQLAlchemy 2.0
if raw_db_url.startswith("postgres://"):
    raw_db_url = raw_db_url.replace("postgres://", "postgresql://", 1)

DATABASE_URL = raw_db_url

engine_kwargs = {}
if DATABASE_URL.startswith("postgresql"):
    engine_kwargs.update(
        {
            "pool_pre_ping": True,
            "pool_size": 10,
            "max_overflow": 20,
        }
    )

engine = create_engine(
    DATABASE_URL,
    **engine_kwargs,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
