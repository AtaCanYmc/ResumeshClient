from typing import List, Optional

from sqlalchemy.orm import Session

from resumesh_client.models.article import Article
from resumesh_client.repositories.article import ArticleRepository


class ArticleService:
    def __init__(self, db: Session):
        self.repo = ArticleRepository(db)

    def list_articles(self, skip: int = 0, limit: int = 100) -> List[Article]:
        return self.repo.get_all(skip=skip, limit=limit)

    def get_article(self, article_id: str) -> Optional[Article]:
        return self.repo.get_by_id(article_id)
