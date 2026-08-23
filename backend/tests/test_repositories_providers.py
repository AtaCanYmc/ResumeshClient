import pytest
from unittest.mock import patch

from resumesh_client.db import SessionLocal
from resumesh_client.providers.supabase.client import SupabaseClientManager
from resumesh_client.repositories.article import ArticleRepository
from resumesh_client.repositories.project import ProjectRepository
from resumesh_client.schemas.article import ArticleCreate
from resumesh_client.schemas.project import ProjectCreate


@pytest.mark.anyio
async def test_project_repository_upsert_and_fetch():
    """Verify ProjectRepository creates and retrieves projects from DB."""
    db = SessionLocal()
    try:
        repo = ProjectRepository(db=db)
        project_in = ProjectCreate(
            name="Repo Integration Project",
            title="Repo Title",
            description="Testing ProjectRepository",
            url="https://github.com/test/repo",
            stars=10,
        )
        created = await repo.upsert_project(project_in)
        assert created is not None
        assert created.name == "Repo Integration Project"

        fetched = await repo.get_project_by_id(created.id)
        assert fetched is not None
        assert fetched.name == "Repo Integration Project"
    finally:
        db.close()


@pytest.mark.anyio
async def test_article_repository_upsert_and_fetch():
    """Verify ArticleRepository creates and retrieves articles from DB."""
    db = SessionLocal()
    try:
        repo = ArticleRepository(db=db)
        article_in = ArticleCreate(
            title="Repo Integration Article",
            summary="Testing ArticleRepository",
            platform="DEV_TO",
            url="https://dev.to/test/article",
        )
        created = await repo.upsert_article(article_in)
        assert created is not None
        assert created.title == "Repo Integration Article"

        all_articles = await repo.list_articles(skip=0, limit=10)
        assert len(all_articles) > 0
    finally:
        db.close()


def test_supabase_client_manager_initialization():
    """Verify SupabaseClientManager retrieves or raises error if unconfigured."""
    with patch("resumesh_client.config.settings.SUPABASE_URL", "https://test.supabase.co"), \
         patch("resumesh_client.config.settings.SUPABASE_KEY", "test-key-123"):
        SupabaseClientManager._client = None
        client = SupabaseClientManager.get_client()
        assert client is not None

    with patch("resumesh_client.config.settings.SUPABASE_URL", None), \
         patch("resumesh_client.config.settings.SUPABASE_KEY", None), \
         patch("os.getenv", return_value=None):
        SupabaseClientManager._client = None
        with pytest.raises(ValueError, match="SUPABASE_URL and SUPABASE_KEY must be defined"):
            SupabaseClientManager.get_client()
