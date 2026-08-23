from sqlalchemy.orm import Session

from resumesh_client.models.post import Post
from resumesh_client.repositories.base import BaseRepository


class PostRepository(BaseRepository[Post]):
    def __init__(self, db: Session):
        super().__init__(db, Post)
