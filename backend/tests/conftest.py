import pytest
import resumesh_client.models  # noqa: F401
from fastapi.testclient import TestClient
from resumesh_client.db import Base, engine
from resumesh_client.main import app


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield


@pytest.fixture
def client():
    return TestClient(app)
