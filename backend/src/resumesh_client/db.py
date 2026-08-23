"""
Database connection and session factory configured strictly for Supabase PostgreSQL.
"""

import os
from resumesh_client.config import settings
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

Base = declarative_base()

# Default to Supabase PostgreSQL (Cloud or Local Supabase CLI on port 54322)
DEFAULT_SUPABASE_POSTGRES = "postgresql://postgres:postgres@127.0.0.1:54322/postgres"

raw_db_url = (
    os.getenv("SUPABASE_DATABASE_URL")
    or settings.DATABASE_URL
    or os.getenv("DATABASE_URL", DEFAULT_SUPABASE_POSTGRES)
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
