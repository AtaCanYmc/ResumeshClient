from sqlalchemy.orm import Session

from resumesh_client.models.skill import Skill
from resumesh_client.repositories.base import BaseRepository


class SkillRepository(BaseRepository[Skill]):
    def __init__(self, db: Session):
        super().__init__(db, Skill)
