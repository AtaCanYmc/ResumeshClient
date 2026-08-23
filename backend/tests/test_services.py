import json
import uuid
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from resumesh_client.db import SessionLocal
from resumesh_client.models.app_settings import AppSetting
from resumesh_client.repositories.article import ArticleRepository
from resumesh_client.repositories.project import ProjectRepository
from resumesh_client.services.ingestion import IngestionService
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
        custom_setting = AppSetting(key=unique_key, value=json.dumps({"email": "custom@resumesh.dev"}))
        db.add(custom_setting)
        db.commit()

        updated_settings = get_all_settings(db)
        assert unique_key in updated_settings
        assert updated_settings[unique_key]["email"] == "custom@resumesh.dev"
    finally:
        db.close()


@pytest.mark.anyio
async def test_ingestion_service_github_flow():
    """Verify IngestionService fetches items from GitHub scraper and persists via ProjectRepository."""
    db = SessionLocal()
    try:
        repo = ProjectRepository(db=db)
        mock_item = MagicMock()
        mock_item.name = "Mock Ingestion Repo"
        mock_item.title = "Mock Ingestion Repo"
        mock_item.description = "Test Description"
        mock_item.html_url = "https://github.com/test/mock-repo"
        mock_item.url = "https://github.com/test/mock-repo"
        mock_item.stargazers_count = 15
        mock_item.stars = 15
        mock_item.watchers_count = 5
        mock_item.watchers = 5
        mock_item.forks_count = 2
        mock_item.forks = 2
        mock_item.languages = ["Python", "TypeScript"]
        mock_item.language = "Python"
        mock_item.tags = ["ai", "fastapi"]

        with patch("resumesh_scrapers.GitHubScraper.fetch_data", new_callable=AsyncMock) as mock_fetch:
            mock_fetch.return_value = [mock_item]
            await IngestionService.fetch_github_repos("testuser", repo)

        fetched = await repo.get_projects()
        names = [p.name for p in fetched]
        assert "Mock Ingestion Repo" in names
    finally:
        db.close()


@pytest.mark.anyio
async def test_ingestion_service_devto_flow():
    """Verify IngestionService fetches items from DevTo scraper and persists via ArticleRepository."""
    db = SessionLocal()
    try:
        repo = ArticleRepository(db=db)
        mock_item = MagicMock()
        mock_item.title = "Mock DevTo Article"
        mock_item.summary = "Summary of article"
        mock_item.url = "https://dev.to/test/article-unique-123"

        with patch("resumesh_scrapers.DevToScraper.fetch_data", new_callable=AsyncMock) as mock_fetch:
            mock_fetch.return_value = [mock_item]
            await IngestionService.fetch_devto_articles("testuser", repo)

        fetched = await repo.get_all_articles()
        titles = [a.title for a in fetched]
        assert "Mock DevTo Article" in titles
    finally:
        db.close()
