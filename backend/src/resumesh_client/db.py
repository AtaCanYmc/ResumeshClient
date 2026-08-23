"""
Database connection and session factory configured strictly for Supabase PostgreSQL.
"""

import os
from resumesh_client.config import settings
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

Base = declarative_base()

DEFAULT_SUPABASE_POSTGRES = "postgresql://postgres:postgres@127.0.0.1:54322/postgres"

is_in_docker = os.path.exists("/.dockerenv") or os.getenv("DOCKER_CONTAINER") == "true"

raw_db_url = (
    os.getenv("DATABASE_URL")
    or os.getenv("SUPABASE_DATABASE_URL")
    or settings.DATABASE_URL
    or DEFAULT_SUPABASE_POSTGRES
)

# If running inside Docker and database URL references localhost/127.0.0.1, auto-route to docker compose db container
if is_in_docker:
    if "127.0.0.1:54322" in raw_db_url or "localhost:54322" in raw_db_url:
        raw_db_url = raw_db_url.replace("127.0.0.1:54322", "db:5432").replace("localhost:54322", "db:5432")
    elif "127.0.0.1:5432" in raw_db_url or "localhost:5432" in raw_db_url:
        raw_db_url = raw_db_url.replace("127.0.0.1:5432", "db:5432").replace("localhost:5432", "db:5432")

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
