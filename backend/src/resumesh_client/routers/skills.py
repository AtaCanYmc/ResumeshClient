from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from resumesh_client.db import get_db
from resumesh_client.schemas.skill import SkillResponse
from resumesh_client.services.skill_service import SkillService

router = APIRouter(prefix="/api/v1/skills", tags=["Skills"])


def get_skill_service(db: Session = Depends(get_db)) -> SkillService:
    return SkillService(db)


@router.get("", response_model=List[SkillResponse])
async def list_skills(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1),
    service: SkillService = Depends(get_skill_service),
):
    return service.list_skills(skip=skip, limit=limit)


@router.get("/{skill_id}", response_model=SkillResponse)
async def get_skill(skill_id: str, service: SkillService = Depends(get_skill_service)):
    item = service.get_skill(skill_id)
    if not item:
        raise HTTPException(status_code=404, detail="Skill not found")
    return item
