from abc import ABC, abstractmethod
from typing import List, Optional
from sqlalchemy.orm import Session
from resumesh_client.models.article import Article
from resumesh_client.schemas.article import ArticleCreate, ArticleResponse, ArticleUpdate


class IArticleRepository(ABC):
    @abstractmethod
    async def upsert_article(self, article: ArticleCreate) -> ArticleResponse:
        pass

    @abstractmethod
    async def get_all_articles(
        self, skip: int = 0, limit: int = 100
    ) -> List[ArticleResponse]:
        pass

    @abstractmethod
    async def update_article(
        self, article_id: str, article: ArticleUpdate
    ) -> Optional[ArticleResponse]:
        pass

    @abstractmethod
    async def delete_article(self, article_id: str) -> bool:
        pass


class ArticleRepository(IArticleRepository):
    def __init__(self, db: Session):
        self.db = db

    async def upsert_article(self, article: ArticleCreate) -> ArticleResponse:
        existing = self.db.query(Article).filter(Article.url == article.url).first()
        if existing:
            for k, v in article.model_dump(exclude_unset=True).items():
                setattr(existing, k, v)
            item = existing
        else:
            item = Article(**article.model_dump(exclude_unset=True))
            self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return ArticleResponse.model_validate(item)

    async def get_all_articles(
        self, skip: int = 0, limit: int = 100
    ) -> List[ArticleResponse]:
        items = self.db.query(Article).offset(skip).limit(limit).all()
        return [ArticleResponse.model_validate(i) for i in items]

    async def list_articles(
        self, skip: int = 0, limit: int = 100
    ) -> List[ArticleResponse]:
        return await self.get_all_articles(skip=skip, limit=limit)

    async def update_article(
        self, article_id: str, article: ArticleUpdate
    ) -> Optional[ArticleResponse]:
        item = self.db.query(Article).filter(Article.id == article_id).first()
        if not item:
            return None
        for k, v in article.model_dump(exclude_unset=True).items():
            setattr(item, k, v)
        self.db.commit()
        self.db.refresh(item)
        return ArticleResponse.model_validate(item)

    async def delete_article(self, article_id: str) -> bool:
        item = self.db.query(Article).filter(Article.id == article_id).first()
        if not item:
            return False
        self.db.delete(item)
        self.db.commit()
        return True
