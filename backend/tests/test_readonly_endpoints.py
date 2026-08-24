import pytest

READONLY_ENDPOINTS = [
    "/",
    "/health",
    "/api/v1/projects/",
    "/api/v1/articles/",
    "/api/v1/educations/",
    "/api/v1/experiences/",
    "/api/v1/skills/",
    "/api/v1/certificates/",
    "/api/v1/packages/",
    "/api/v1/posts/",
    "/api/v1/videos/",
    "/api/v1/social-links",
    "/api/v1/sections/",
    "/api/v1/settings/",
    "/sitemap.xml",
    "/robots.txt",
]


@pytest.mark.parametrize("endpoint", READONLY_ENDPOINTS)
def test_readonly_get_endpoints_status_200(client, endpoint):
    res = client.get(endpoint)
    assert res.status_code == 200


@pytest.mark.parametrize(
    "endpoint",
    [
        "/api/v1/projects/",
        "/api/v1/articles/",
        "/api/v1/educations/",
        "/api/v1/experiences/",
        "/api/v1/skills/",
        "/api/v1/certificates/",
    ],
)
def test_disallow_post_mutations(client, endpoint):
    res = client.post(endpoint, json={"name": "Forbidden Test"})
    assert res.status_code == 405


@pytest.mark.parametrize(
    "endpoint",
    [
        "/api/v1/projects/1",
        "/api/v1/articles/1",
        "/api/v1/educations/1",
        "/api/v1/experiences/1",
        "/api/v1/certificates/1",
        "/api/v1/skills/1",
    ],
)
def test_disallow_put_mutations(client, endpoint):
    res = client.put(endpoint, json={"name": "Forbidden Test"})
    assert res.status_code == 405


@pytest.mark.parametrize(
    "endpoint",
    [
        "/api/v1/projects/1",
        "/api/v1/articles/1",
        "/api/v1/educations/1",
        "/api/v1/experiences/1",
        "/api/v1/certificates/1",
        "/api/v1/skills/1",
    ],
)
def test_disallow_delete_mutations(client, endpoint):
    res = client.delete(endpoint)
    assert res.status_code == 405


def test_get_settings(client):
    res = client.get("/api/v1/settings")
    assert res.status_code == 200
    assert isinstance(res.json(), dict)


def test_disallow_put_settings(client):
    res = client.put("/api/v1/settings", json={"theme": "dark"})
    assert res.status_code == 405


def test_search_endpoint(client):
    res = client.get("/api/v1/search?q=python")
    assert res.status_code == 200


def test_cv_routes(client):
    res = client.get("/api/v1/cv/list")
    assert res.status_code == 200
    assert res.json()["status"] == "success"


def test_avatar_route(client):
    res = client.get("/api/v1/avatar/profile.jpg", follow_redirects=False)
    assert res.status_code in [200, 307, 404]
