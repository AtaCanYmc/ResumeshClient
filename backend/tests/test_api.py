import pytest
import resumesh_storage.models  # noqa: F401
from fastapi.testclient import TestClient
from resumesh_client.main import app
from resumesh_storage.db import Base, engine


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield


client = TestClient(app)


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"


def test_auth_flow():
    login_res = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@resumesh.dev", "password": "password123"},
    )
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]
    assert token is not None

    verify_res = client.get(
        "/api/v1/auth/verify", headers={"Authorization": f"Bearer {token}"}
    )
    assert verify_res.status_code == 200

    logout_res = client.post("/api/v1/auth/logout")
    assert logout_res.status_code == 200


def test_projects_endpoint():
    response = client.get("/api/v1/projects")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_skills_endpoint():
    response = client.get("/api/v1/skills")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_seo_sitemap():
    response = client.get("/sitemap.xml")
    assert response.status_code == 200
    assert "xml" in response.headers["content-type"]


def test_seo_robots():
    response = client.get("/robots.txt")
    assert response.status_code == 200
    assert "User-agent" in response.text


def test_storage_buckets():
    response = client.get(
        "/api/v1/admin/storage/buckets",
        headers={"Authorization": "Bearer test-admin-token"},
    )
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_rxresume_statistics():
    response = client.get(
        "/api/v1/admin/rxresume/statistics",
        headers={"Authorization": "Bearer test-admin-token"},
    )
    assert response.status_code == 200
    assert response.json()["status"] == "success"
