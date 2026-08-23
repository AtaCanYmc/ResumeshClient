from typing import List, Optional

from sqlalchemy.orm import Session

from resumesh_client.models.video import Video
from resumesh_client.repositories.video import VideoRepository


class VideoService:
    def __init__(self, db: Session):
        self.repo = VideoRepository(db)

    def list_videos(self, skip: int = 0, limit: int = 100) -> List[Video]:
        return self.repo.get_all(skip=skip, limit=limit)

    def get_video(self, video_id: str) -> Optional[Video]:
        return self.repo.get_by_id(video_id)
