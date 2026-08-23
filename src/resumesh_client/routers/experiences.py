from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from resumesh_core.schemas.experience import ExperienceCreate, ExperienceResponse, ExperienceUpdate
from resumesh_client.auth import get_current_admin
from resumesh_storage.db import get_db
from resumesh_storage.models.experience import Experience

router = APIRouter(prefix="/api/v1/experiences", tags=["Experiences"])


@router.get("", response_model=List[ExperienceResponse])
async def list_experiences(skip: int = Query(0, ge=0), limit: int = Query(100, ge=1), db=Depends(get_db)):
    return db.query(Experience).offset(skip).limit(limit).all()


@router.post("", response_model=ExperienceResponse)
async def create_experience(payload: ExperienceCreate, db=Depends(get_db), admin=Depends(get_current_admin)):
    item = Experience(**payload.model_dump(exclude_unset=True))
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/{experience_id}", response_model=ExperienceResponse)
async def update_experience(experience_id: str, payload: ExperienceUpdate, db=Depends(get_db), admin=Depends(get_current_admin)):
    item = db.query(Experience).filter(Experience.id == experience_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Experience not found")
    for k, v in payload.model_dump(exclude_unset=True).items():
        setattr(item, k, v)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{experience_id}")
async def delete_experience(experience_id: str, db=Depends(get_db), admin=Depends(get_current_admin)):
    item = db.query(Experience).filter(Experience.id == experience_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Experience not found")
    db.delete(item)
    db.commit()
    return {"message": "Experience deleted successfully"}
