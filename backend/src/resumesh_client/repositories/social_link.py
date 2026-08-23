from sqlalchemy.orm import Session

from resumesh_client.models.social_link import SocialLink
from resumesh_client.repositories.base import BaseRepository


class SocialLinkRepository(BaseRepository[SocialLink]):
    def __init__(self, db: Session):
        super().__init__(db, SocialLink)
