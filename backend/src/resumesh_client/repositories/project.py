from abc import ABC, abstractmethod
from typing import List, Optional

from sqlalchemy.orm import Session

from resumesh_client.models.project import Project
from resumesh_client.schemas.project import (
    ProjectCreate,
    ProjectResponse,
    ProjectUpdate,
)


class IProjectRepository(ABC):
    @abstractmethod
    async def create_project(self, project: ProjectCreate) -> ProjectResponse:
        pass

    @abstractmethod
    async def get_projects(
        self, skip: int = 0, limit: int = 100
    ) -> List[ProjectResponse]:
        pass

    @abstractmethod
    async def get_project_by_id(self, project_id: str) -> Optional[ProjectResponse]:
        pass

    @abstractmethod
    async def upsert_project(self, project: ProjectCreate) -> ProjectResponse:
        pass

    @abstractmethod
    async def update_project(
        self, project_id: str, project: ProjectUpdate
    ) -> Optional[ProjectResponse]:
        pass

    @abstractmethod
    async def delete_project(self, project_id: str) -> bool:
        pass


class ProjectRepository(IProjectRepository):
    def __init__(self, db: Session):
        self.db = db

    async def create_project(self, project: ProjectCreate) -> ProjectResponse:
        item = Project(**project.model_dump(exclude_unset=True))
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return ProjectResponse.model_validate(item)

    async def get_projects(
        self, skip: int = 0, limit: int = 100
    ) -> List[ProjectResponse]:
        items = self.db.query(Project).offset(skip).limit(limit).all()
        return [ProjectResponse.model_validate(i) for i in items]

    async def get_project_by_id(self, project_id: str) -> Optional[ProjectResponse]:
        item = self.db.query(Project).filter(Project.id == project_id).first()
        if not item:
            return None
        return ProjectResponse.model_validate(item)

    async def upsert_project(self, project: ProjectCreate) -> ProjectResponse:
        existing = self.db.query(Project).filter(Project.name == project.name).first()
        if existing:
            for k, v in project.model_dump(exclude_unset=True).items():
                setattr(existing, k, v)
            item = existing
        else:
            item = Project(**project.model_dump(exclude_unset=True))
            self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return ProjectResponse.model_validate(item)

    async def update_project(
        self, project_id: str, project: ProjectUpdate
    ) -> Optional[ProjectResponse]:
        item = self.db.query(Project).filter(Project.id == project_id).first()
        if not item:
            return None
        for k, v in project.model_dump(exclude_unset=True).items():
            setattr(item, k, v)
        self.db.commit()
        self.db.refresh(item)
        return ProjectResponse.model_validate(item)

    async def delete_project(self, project_id: str) -> bool:
        item = self.db.query(Project).filter(Project.id == project_id).first()
        if not item:
            return False
        self.db.delete(item)
        self.db.commit()
        return True
