def test_health_endpoint(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"


def test_seo_sitemap(client):
    response = client.get("/sitemap.xml")
    assert response.status_code == 200
    assert "xml" in response.headers["content-type"]


def test_seo_robots(client):
    response = client.get("/robots.txt")
    assert response.status_code == 200
    assert "User-agent" in response.text
