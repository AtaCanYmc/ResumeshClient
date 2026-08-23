from typing import List, Optional

from sqlalchemy.orm import Session

from resumesh_client.models.project import Project
from resumesh_client.repositories.project import ProjectRepository


class ProjectService:
    def __init__(self, db: Session):
        self.repo = ProjectRepository(db)

    def list_projects(self, skip: int = 0, limit: int = 100) -> List[Project]:
        return self.repo.get_all(skip=skip, limit=limit)

    def get_project(self, project_id: str) -> Optional[Project]:
        return self.repo.get_by_id(project_id)
