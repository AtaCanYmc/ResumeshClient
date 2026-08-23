from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from resumesh_core.schemas.article import ArticleCreate, ArticleResponse, ArticleUpdate
from resumesh_client.auth import get_current_admin
from resumesh_storage.db import get_db
from resumesh_storage.models.article import Article

router = APIRouter(prefix="/api/v1/articles", tags=["Articles"])


@router.get("", response_model=List[ArticleResponse])
async def list_articles(skip: int = Query(0, ge=0), limit: int = Query(100, ge=1), db=Depends(get_db)):
    return db.query(Article).offset(skip).limit(limit).all()


@router.post("", response_model=ArticleResponse)
async def create_article(payload: ArticleCreate, db=Depends(get_db), admin=Depends(get_current_admin)):
    item = Article(**payload.model_dump(exclude_unset=True))
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/{article_id}", response_model=ArticleResponse)
async def update_article(article_id: str, payload: ArticleUpdate, db=Depends(get_db), admin=Depends(get_current_admin)):
    item = db.query(Article).filter(Article.id == article_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Article not found")
    for k, v in payload.model_dump(exclude_unset=True).items():
        setattr(item, k, v)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{article_id}")
async def delete_article(article_id: str, db=Depends(get_db), admin=Depends(get_current_admin)):
    item = db.query(Article).filter(Article.id == article_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Article not found")
    db.delete(item)
    db.commit()
    return {"message": "Article deleted successfully"}
