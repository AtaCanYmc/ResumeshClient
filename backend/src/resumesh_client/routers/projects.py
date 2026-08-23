from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query

from resumesh_client.db import get_db
from resumesh_client.models.project import Project
from resumesh_client.schemas.project import ProjectResponse

router = APIRouter(prefix="/api/v1/projects", tags=["Projects"])


@router.get("", response_model=List[ProjectResponse])
async def list_projects(
    skip: int = Query(0, ge=0), limit: int = Query(100, ge=1), db=Depends(get_db)
):
    return db.query(Project).offset(skip).limit(limit).all()


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(project_id: str, db=Depends(get_db)):
    item = db.query(Project).filter(Project.id == project_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Project not found")
    return item
