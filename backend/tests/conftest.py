import pytest
import models  # noqa: F401
from fastapi.testclient import TestClient
from main import app
from db import Base, engine


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield


@pytest.fixture
def client():
    return TestClient(app)
