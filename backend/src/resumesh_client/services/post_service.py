from typing import List, Optional

from sqlalchemy.orm import Session

from resumesh_client.models.post import Post
from resumesh_client.repositories.post import PostRepository


class PostService:
    def __init__(self, db: Session):
        self.repo = PostRepository(db)

    def list_posts(self, skip: int = 0, limit: int = 100) -> List[Post]:
        return self.repo.get_all(skip=skip, limit=limit)

    def get_post(self, post_id: str) -> Optional[Post]:
        return self.repo.get_by_id(post_id)
