import pytest


def test_api_root_and_openapi_docs(client):
    """Verify root endpoint, OpenAPI schema, and Swagger UI accessibility."""
    root_res = client.get("/")
    assert root_res.status_code == 200
    assert "message" in root_res.json()

    openapi_res = client.get("/openapi.json")
    assert openapi_res.status_code == 200
    openapi_data = openapi_res.json()
    assert openapi_data["openapi"].startswith("3.")
    assert "paths" in openapi_data

    docs_res = client.get("/docs")
    assert docs_res.status_code == 200


@pytest.mark.parametrize(
    "endpoint",
    [
        "/api/v1/projects",
        "/api/v1/articles",
        "/api/v1/educations",
        "/api/v1/experiences",
        "/api/v1/certificates",
        "/api/v1/skills",
        "/api/v1/packages",
        "/api/v1/posts",
        "/api/v1/videos",
        "/api/v1/social-links",
        "/api/v1/sections",
    ],
)
def test_pagination_parameters(client, endpoint):
    """Verify skip and limit query parameters for all resource endpoints."""
    res = client.get(f"{endpoint}?skip=0&limit=5")
    assert res.status_code == 200
    assert isinstance(res.json(), list)


@pytest.mark.parametrize(
    "endpoint",
    [
        "/api/v1/projects/non-existent-uuid-123",
        "/api/v1/articles/non-existent-uuid-123",
        "/api/v1/educations/non-existent-uuid-123",
        "/api/v1/experiences/non-existent-uuid-123",
        "/api/v1/certificates/non-existent-uuid-123",
        "/api/v1/skills/non-existent-uuid-123",
        "/api/v1/packages/non-existent-uuid-123",
        "/api/v1/posts/non-existent-uuid-123",
    ],
)
def test_non_existent_resource_404(client, endpoint):
    """Verify 404 response when querying invalid resource IDs."""
    res = client.get(endpoint)
    assert res.status_code == 404


def test_settings_cache_headers(client):
    """Verify Cache-Control headers on settings endpoint response."""
    res = client.get("/api/v1/settings")
    assert res.status_code == 200
    assert "Cache-Control" in res.headers
    assert "max-age=" in res.headers["Cache-Control"]
