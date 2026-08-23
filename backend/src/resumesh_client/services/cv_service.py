from typing import List, Optional

from sqlalchemy.orm import Session

from resumesh_client.models.generated_cv import GeneratedCV
from resumesh_client.repositories.cv import CVRepository


class CVService:
    def __init__(self, db: Session):
        self.repo = CVRepository(db)

    def list_cvs(self, skip: int = 0, limit: int = 100) -> List[GeneratedCV]:
        return self.repo.get_all(skip=skip, limit=limit)

    def get_cv(self, cv_id: str) -> Optional[GeneratedCV]:
        return self.repo.get_by_id(cv_id)
