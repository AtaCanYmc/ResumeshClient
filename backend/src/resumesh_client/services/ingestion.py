"""
Ingestion Service in resumesh-api
Orchestrates platform scrapers and persists data to database/storage repositories.
"""

import logging
from typing import Optional

from resumesh_scrapers import (
    DevToScraper,
    GitHubScraper,
    MediumScraper,
    ScraperError,
)

from resumesh_client.repositories.article import IArticleRepository
from resumesh_client.repositories.project import IProjectRepository
from resumesh_client.schemas.article import ArticleCreate
from resumesh_client.schemas.project import ProjectCreate

logger = logging.getLogger(__name__)


class IngestionService:
    @staticmethod
    async def fetch_github_repos(
        username: str,
        provider: IProjectRepository,
        pat: Optional[str] = None,
        include_forks: bool = False,
    ):
        scraper = GitHubScraper()
        try:
            items = await scraper.fetch_data(username, pat=pat, include_forks=include_forks)
            for item in items:
                proj = ProjectCreate(
                    name=item.name or item.title or "",
                    title=item.name or item.title or "",
                    description=item.description,
                    url=item.html_url or item.url,
                    stars=item.stargazers_count or item.stars or 0,
                    watchers=item.watchers_count or item.watchers or 0,
                    forks=item.forks_count or item.forks or 0,
                    languages=item.languages or ([item.language] if item.language else []),
                    tags=item.tags or [],
                )
                await provider.upsert_project(proj)
        except ScraperError as exc:
            logger.warning(f"GitHub scraper error for {username}: {exc}")

    @staticmethod
    async def fetch_devto_articles(username: str, provider: IArticleRepository, api_key: Optional[str] = None):
        scraper = DevToScraper()
        try:
            items = await scraper.fetch_data(username, api_key=api_key)
            for item in items:
                art = ArticleCreate(
                    title=item.title,
                    summary=item.summary,
                    platform="DEV_TO",
                    url=item.url or item.link or "",
                )
                await provider.upsert_article(art)
        except ScraperError as exc:
            logger.warning(f"Dev.to scraper error for {username}: {exc}")

    @staticmethod
    async def fetch_medium_articles(username: str, provider: IArticleRepository):
        scraper = MediumScraper()
        try:
            items = await scraper.fetch_data(username)
            for item in items:
                art = ArticleCreate(
                    title=item.title,
                    summary=item.summary,
                    platform="MEDIUM",
                    url=item.url or item.link or "",
                )
                await provider.upsert_article(art)
        except ScraperError as exc:
            logger.warning(f"Medium scraper error for {username}: {exc}")
