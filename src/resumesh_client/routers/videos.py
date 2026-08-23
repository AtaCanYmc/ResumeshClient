from typing import List

from fastapi import APIRouter, Depends, Query
from resumesh_core.schemas.video import VideoCreate, VideoResponse
from resumesh_storage.db import get_db
from resumesh_storage.models.video import Video

router = APIRouter(prefix="/api/v1/videos", tags=["Videos"])


@router.get("", response_model=List[VideoResponse])
async def list_videos(
    skip: int = Query(0, ge=0), limit: int = Query(100, ge=1), db=Depends(get_db)
):
    return db.query(Video).offset(skip).limit(limit).all()


@router.post("", response_model=VideoResponse)
async def create_video(payload: VideoCreate, db=Depends(get_db)):
    item = Video(**payload.model_dump(exclude_unset=True))
    db.add(item)
    db.commit()
    db.refresh(item)
    return item
