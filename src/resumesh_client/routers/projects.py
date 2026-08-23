from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from resumesh_core.schemas.project import ProjectCreate, ProjectResponse, ProjectUpdate
from resumesh_client.auth import get_current_admin
from resumesh_storage.db import get_db
from resumesh_storage.models.project import Project

router = APIRouter(prefix="/api/v1/projects", tags=["Projects"])


@router.get("", response_model=List[ProjectResponse])
async def list_projects(skip: int = Query(0, ge=0), limit: int = Query(100, ge=1), db=Depends(get_db)):
    return db.query(Project).offset(skip).limit(limit).all()


@router.post("", response_model=ProjectResponse)
async def create_project(payload: ProjectCreate, db=Depends(get_db), admin=Depends(get_current_admin)):
    item = Project(**payload.model_dump(exclude_unset=True))
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(project_id: str, db=Depends(get_db)):
    item = db.query(Project).filter(Project.id == project_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Project not found")
    return item


@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(project_id: str, payload: ProjectUpdate, db=Depends(get_db), admin=Depends(get_current_admin)):
    item = db.query(Project).filter(Project.id == project_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Project not found")
    for k, v in payload.model_dump(exclude_unset=True).items():
        setattr(item, k, v)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{project_id}")
async def delete_project(project_id: str, db=Depends(get_db), admin=Depends(get_current_admin)):
    item = db.query(Project).filter(Project.id == project_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(item)
    db.commit()
    return {"message": "Project deleted successfully"}
