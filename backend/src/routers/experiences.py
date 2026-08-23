from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query
from schemas.experience import ExperienceResponse
from db import get_db
from models.experience import Experience

router = APIRouter(prefix="/api/v1/experiences", tags=["Experiences"])


@router.get("", response_model=List[ExperienceResponse])
async def list_experiences(
    skip: int = Query(0, ge=0), limit: int = Query(100, ge=1), db=Depends(get_db)
):
    return db.query(Experience).offset(skip).limit(limit).all()


@router.get("/{experience_id}", response_model=ExperienceResponse)
async def get_experience(experience_id: str, db=Depends(get_db)):
    item = db.query(Experience).filter(Experience.id == experience_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Experience not found")
    return item
