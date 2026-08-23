from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from resumesh_client.db import get_db
from resumesh_client.schemas.article import ArticleResponse
from resumesh_client.services.article_service import ArticleService

router = APIRouter(prefix="/api/v1/articles", tags=["Articles"])


def get_article_service(db: Session = Depends(get_db)) -> ArticleService:
    return ArticleService(db)


@router.get("", response_model=List[ArticleResponse])
async def list_articles(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1),
    service: ArticleService = Depends(get_article_service),
):
    return service.list_articles(skip=skip, limit=limit)


@router.get("/{article_id}", response_model=ArticleResponse)
async def get_article(
    article_id: str, service: ArticleService = Depends(get_article_service)
):
    item = service.get_article(article_id)
    if not item:
        raise HTTPException(status_code=404, detail="Article not found")
    return item
