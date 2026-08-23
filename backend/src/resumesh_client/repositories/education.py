from sqlalchemy.orm import Session

from resumesh_client.models.education import Education
from resumesh_client.repositories.base import BaseRepository


class EducationRepository(BaseRepository[Education]):
    def __init__(self, db: Session):
        super().__init__(db, Education)
