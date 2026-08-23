from unittest.mock import patch

from resumesh_client.config import CoreSettings
from resumesh_client.core.exceptions import (
    DatabaseError,
    DomainException,
    ProjectNotFoundError,
    ResourceNotFoundError,
    ResuMeshError,
    ScraperDomainError,
)


def test_core_settings_defaults_and_env():
    """Verify CoreSettings loads default configuration and respects environment overrides."""
    with patch.dict("os.environ", {"APP_NAME": "Custom App", "DEBUG": "false"}):
        custom_settings = CoreSettings()
        assert custom_settings.APP_NAME == "Custom App"
        assert custom_settings.DEBUG is False


def test_custom_exceptions_hierarchy():
    """Verify custom domain exception inheritance and status code attributes."""
    err = ResourceNotFoundError("TestResource", "id-123")
    assert isinstance(err, DomainException)
    assert isinstance(err, ResuMeshError)
    assert err.status_code == 404
    assert "TestResource not found (ID: id-123)" in str(err)

    proj_err = ProjectNotFoundError("proj-999")
    assert isinstance(proj_err, ResourceNotFoundError)
    assert proj_err.status_code == 404

    db_err = DatabaseError("Connection timeout")
    assert db_err.status_code == 500

    scraper_err = ScraperDomainError("GitHub", "Rate limited", status_code=429)
    assert scraper_err.status_code == 429
    assert "GitHub: Rate limited" in str(scraper_err)
