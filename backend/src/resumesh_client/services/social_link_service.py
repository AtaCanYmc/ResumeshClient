from typing import List, Optional

from sqlalchemy.orm import Session

from resumesh_client.models.social_link import SocialLink
from resumesh_client.repositories.social_link import SocialLinkRepository


class SocialLinkService:
    def __init__(self, db: Session):
        self.repo = SocialLinkRepository(db)

    def list_social_links(self, skip: int = 0, limit: int = 100) -> List[SocialLink]:
        return self.repo.get_all(skip=skip, limit=limit)

    def get_social_link(self, social_link_id: str) -> Optional[SocialLink]:
        return self.repo.get_by_id(social_link_id)
