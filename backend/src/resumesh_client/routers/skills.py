from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from resumesh_core.schemas.skill import SkillCreate, SkillResponse, SkillUpdate
from resumesh_client.auth import get_current_admin
from resumesh_storage.db import get_db
from resumesh_storage.models.skill import Skill

router = APIRouter(prefix="/api/v1/skills", tags=["Skills"])


@router.get("", response_model=List[SkillResponse])
async def list_skills(skip: int = Query(0, ge=0), limit: int = Query(100, ge=1), db=Depends(get_db)):
    return db.query(Skill).offset(skip).limit(limit).all()


@router.post("", response_model=SkillResponse)
async def create_skill(payload: SkillCreate, db=Depends(get_db), admin=Depends(get_current_admin)):
    item = Skill(**payload.model_dump(exclude_unset=True))
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.get("/{skill_id}", response_model=SkillResponse)
async def get_skill(skill_id: str, db=Depends(get_db)):
    item = db.query(Skill).filter(Skill.id == skill_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Skill not found")
    return item


@router.put("/{skill_id}", response_model=SkillResponse)
async def update_skill(skill_id: str, payload: SkillUpdate, db=Depends(get_db), admin=Depends(get_current_admin)):
    item = db.query(Skill).filter(Skill.id == skill_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Skill not found")
    for k, v in payload.model_dump(exclude_unset=True).items():
        setattr(item, k, v)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{skill_id}")
async def delete_skill(skill_id: str, db=Depends(get_db), admin=Depends(get_current_admin)):
    item = db.query(Skill).filter(Skill.id == skill_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Skill not found")
    db.delete(item)
    db.commit()
    return {"message": "Skill deleted successfully"}
