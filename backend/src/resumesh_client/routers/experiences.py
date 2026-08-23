from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from resumesh_client.db import get_db
from resumesh_client.schemas.experience import ExperienceResponse
from resumesh_client.services.experience_service import ExperienceService

router = APIRouter(prefix="/api/v1/experiences", tags=["Experiences"])


def get_experience_service(db: Session = Depends(get_db)) -> ExperienceService:
    return ExperienceService(db)


@router.get("", response_model=List[ExperienceResponse])
async def list_experiences(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1),
    service: ExperienceService = Depends(get_experience_service),
):
    return service.list_experiences(skip=skip, limit=limit)


@router.get("/{experience_id}", response_model=ExperienceResponse)
async def get_experience(
    experience_id: str, service: ExperienceService = Depends(get_experience_service)
):
    item = service.get_experience(experience_id)
    if not item:
        raise HTTPException(status_code=404, detail="Experience not found")
    return item
