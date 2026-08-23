from sqlalchemy.orm import Session

from resumesh_client.models.video import Video
from resumesh_client.repositories.base import BaseRepository


class VideoRepository(BaseRepository[Video]):
    def __init__(self, db: Session):
        super().__init__(db, Video)
