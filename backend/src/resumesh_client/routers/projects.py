from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from resumesh_client.db import get_db
from resumesh_client.schemas.project import ProjectResponse
from resumesh_client.services.project_service import ProjectService

router = APIRouter(prefix="/api/v1/projects", tags=["Projects"])


def get_project_service(db: Session = Depends(get_db)) -> ProjectService:
    return ProjectService(db)


@router.get("", response_model=List[ProjectResponse])
async def list_projects(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1),
    service: ProjectService = Depends(get_project_service),
):
    return service.list_projects(skip=skip, limit=limit)


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: str, service: ProjectService = Depends(get_project_service)
):
    item = service.get_project(project_id)
    if not item:
        raise HTTPException(status_code=404, detail="Project not found")
    return item
