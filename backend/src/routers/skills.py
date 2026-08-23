from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query
from schemas.skill import SkillResponse
from db import get_db
from models.skill import Skill

router = APIRouter(prefix="/api/v1/skills", tags=["Skills"])


@router.get("", response_model=List[SkillResponse])
async def list_skills(
    skip: int = Query(0, ge=0), limit: int = Query(100, ge=1), db=Depends(get_db)
):
    return db.query(Skill).offset(skip).limit(limit).all()


@router.get("/{skill_id}", response_model=SkillResponse)
async def get_skill(skill_id: str, db=Depends(get_db)):
    item = db.query(Skill).filter(Skill.id == skill_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Skill not found")
    return item
