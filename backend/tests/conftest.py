import pytest
import resumesh_client.models  # noqa: F401
from fastapi.testclient import TestClient
from resumesh_client.db import Base, engine
from resumesh_client.main import app


@pytest.fixture(autouse=True)
def setup_db():
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as exc:
        pytest.skip(f"Supabase PostgreSQL database connection unavailable for test: {exc}")
    yield


@pytest.fixture
def client():
    return TestClient(app)
