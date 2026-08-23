from typing import List, Optional

from sqlalchemy.orm import Session

from resumesh_client.models.experience import Experience
from resumesh_client.repositories.experience import ExperienceRepository


class ExperienceService:
    def __init__(self, db: Session):
        self.repo = ExperienceRepository(db)

    def list_experiences(self, skip: int = 0, limit: int = 100) -> List[Experience]:
        return self.repo.get_all(skip=skip, limit=limit)

    def get_experience(self, experience_id: str) -> Optional[Experience]:
        return self.repo.get_by_id(experience_id)
