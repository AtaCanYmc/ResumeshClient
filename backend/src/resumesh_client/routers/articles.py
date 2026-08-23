from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query

from resumesh_client.db import get_db
from resumesh_client.models.article import Article
from resumesh_client.schemas.article import ArticleResponse

router = APIRouter(prefix="/api/v1/articles", tags=["Articles"])


@router.get("", response_model=List[ArticleResponse])
async def list_articles(skip: int = Query(0, ge=0), limit: int = Query(100, ge=1), db=Depends(get_db)):
    return db.query(Article).offset(skip).limit(limit).all()


@router.get("/{article_id}", response_model=ArticleResponse)
async def get_article(article_id: str, db=Depends(get_db)):
    item = db.query(Article).filter(Article.id == article_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Article not found")
    return item
