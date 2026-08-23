from sqlalchemy.orm import Session

from resumesh_client.models.section import Section
from resumesh_client.repositories.base import BaseRepository


class SectionRepository(BaseRepository[Section]):
    def __init__(self, db: Session):
        super().__init__(db, Section)
