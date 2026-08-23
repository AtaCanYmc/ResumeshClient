from typing import List, Optional

from sqlalchemy.orm import Session

from resumesh_client.models.skill import Skill
from resumesh_client.repositories.skill import SkillRepository


class SkillService:
    def __init__(self, db: Session):
        self.repo = SkillRepository(db)

    def list_skills(self, skip: int = 0, limit: int = 100) -> List[Skill]:
        return self.repo.get_all(skip=skip, limit=limit)

    def get_skill(self, skill_id: str) -> Optional[Skill]:
        return self.repo.get_by_id(skill_id)
