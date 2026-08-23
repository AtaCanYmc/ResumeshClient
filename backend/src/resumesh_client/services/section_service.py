from typing import List, Optional

from sqlalchemy.orm import Session

from resumesh_client.models.section import Section
from resumesh_client.repositories.section import SectionRepository


class SectionService:
    def __init__(self, db: Session):
        self.repo = SectionRepository(db)

    def list_sections(self, skip: int = 0, limit: int = 100) -> List[Section]:
        return self.repo.get_all(skip=skip, limit=limit)

    def get_section(self, section_id: str) -> Optional[Section]:
        return self.repo.get_by_id(section_id)
