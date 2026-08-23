from typing import List

from fastapi import APIRouter, Depends, Query
from schemas.video import VideoResponse
from db import get_db
from models.video import Video

router = APIRouter(prefix="/api/v1/videos", tags=["Videos"])


@router.get("", response_model=List[VideoResponse])
async def list_videos(
    skip: int = Query(0, ge=0), limit: int = Query(100, ge=1), db=Depends(get_db)
):
    return db.query(Video).offset(skip).limit(limit).all()
