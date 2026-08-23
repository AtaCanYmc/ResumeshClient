from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from resumesh_client.db import get_db
from resumesh_client.schemas.post import PostResponse
from resumesh_client.services.post_service import PostService

router = APIRouter(prefix="/api/v1/posts", tags=["Posts"])


def get_post_service(db: Session = Depends(get_db)) -> PostService:
    return PostService(db)


@router.get("", response_model=List[PostResponse])
async def list_posts(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1),
    service: PostService = Depends(get_post_service),
):
    return service.list_posts(skip=skip, limit=limit)


@router.get("/{post_id}", response_model=PostResponse)
async def get_post(post_id: str, service: PostService = Depends(get_post_service)):
    item = service.get_post(post_id)
    if not item:
        raise HTTPException(status_code=404, detail="Post not found")
    return item
