from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query
from resumesh_core.schemas.post import PostResponse
from resumesh_storage.db import get_db
from resumesh_storage.models.post import Post

router = APIRouter(prefix="/api/v1/posts", tags=["Posts"])


@router.get("", response_model=List[PostResponse])
async def list_posts(
    skip: int = Query(0, ge=0), limit: int = Query(100, ge=1), db=Depends(get_db)
):
    return db.query(Post).offset(skip).limit(limit).all()


@router.get("/{post_id}", response_model=PostResponse)
async def get_post(post_id: str, db=Depends(get_db)):
    item = db.query(Post).filter(Post.id == post_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Post not found")
    return item
