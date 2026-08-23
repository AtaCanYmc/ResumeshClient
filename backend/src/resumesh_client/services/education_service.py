from typing import List, Optional

from sqlalchemy.orm import Session

from resumesh_client.models.education import Education
from resumesh_client.repositories.education import EducationRepository


class EducationService:
    def __init__(self, db: Session):
        self.repo = EducationRepository(db)

    def list_educations(self, skip: int = 0, limit: int = 100) -> List[Education]:
        return self.repo.get_all(skip=skip, limit=limit)

    def get_education(self, education_id: str) -> Optional[Education]:
        return self.repo.get_by_id(education_id)
