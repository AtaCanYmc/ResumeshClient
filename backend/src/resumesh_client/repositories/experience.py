from typing import List

from sqlalchemy.orm import Session

from resumesh_client.models.experience import Experience
from resumesh_client.repositories.base import BaseRepository


class ExperienceRepository(BaseRepository[Experience]):
    def __init__(self, db: Session):
        super().__init__(db, Experience)

    def search_by_term(self, term: str) -> List[Experience]:
        wildcard_term = f"%{term}%"
        return (
            self.db.query(Experience)
            .filter(
                Experience.company_name.ilike(wildcard_term)
                | Experience.title.ilike(wildcard_term)
            )
            .all()
        )
