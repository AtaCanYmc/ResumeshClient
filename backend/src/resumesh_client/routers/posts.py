from typing import List
from fastapi import APIRouter, Depends, Query
from resumesh_core.schemas.post import PostCreate, PostResponse
from resumesh_client.auth import get_current_admin
from resumesh_storage.db import get_db
from resumesh_storage.models.post import Post

router = APIRouter(prefix="/api/v1/posts", tags=["Posts"])


@router.get("", response_model=List[PostResponse])
async def list_posts(skip: int = Query(0, ge=0), limit: int = Query(100, ge=1), db=Depends(get_db)):
    return db.query(Post).offset(skip).limit(limit).all()


@router.post("", response_model=PostResponse)
async def create_post(payload: PostCreate, db=Depends(get_db), admin=Depends(get_current_admin)):
    item = Post(**payload.model_dump(exclude_unset=True))
    db.add(item)
    db.commit()
    db.refresh(item)
    return item
