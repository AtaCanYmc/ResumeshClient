import json
import uuid

from resumesh_client.db import SessionLocal
from resumesh_client.models.app_settings import AppSetting
from resumesh_client.services.settings_store import get_all_settings


def test_settings_store_defaults_and_overrides():
    """Verify settings_store provides fallbacks when DB is empty and respects overrides when DB is populated."""
    db = SessionLocal()
    try:
        # Test default fallbacks on clean DB session
        settings = get_all_settings(db)
        assert "en" in settings
        assert "tr" in settings
        assert "marquee" in settings
        assert "sections" in settings
        assert "socials" in settings
        assert settings["en"]["hero"]["name"] == "Ata Can"

        # Add custom DB setting override with unique key to avoid collision
        unique_key = f"custom_setting_{uuid.uuid4()}"
        custom_setting = AppSetting(
            key=unique_key, value=json.dumps({"email": "custom@resumesh.dev"})
        )
        db.add(custom_setting)
        db.commit()

        updated_settings = get_all_settings(db)
        assert unique_key in updated_settings
        assert updated_settings[unique_key]["email"] == "custom@resumesh.dev"
    finally:
        db.close()
