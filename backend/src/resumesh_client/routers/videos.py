from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from resumesh_client.db import get_db
from resumesh_client.schemas.video import VideoResponse
from resumesh_client.services.video_service import VideoService

router = APIRouter(prefix="/api/v1/videos", tags=["Videos"])


def get_video_service(db: Session = Depends(get_db)) -> VideoService:
    return VideoService(db)


@router.get("", response_model=List[VideoResponse])
async def list_videos(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1),
    service: VideoService = Depends(get_video_service),
):
    return service.list_videos(skip=skip, limit=limit)


@router.get("/{video_id}", response_model=VideoResponse)
async def get_video(video_id: str, service: VideoService = Depends(get_video_service)):
    item = service.get_video(video_id)
    if not item:
        raise HTTPException(status_code=404, detail="Video not found")
    return item
