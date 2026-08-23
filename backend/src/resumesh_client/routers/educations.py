from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from resumesh_client.db import get_db
from resumesh_client.schemas.education import EducationResponse
from resumesh_client.services.education_service import EducationService

router = APIRouter(prefix="/api/v1/educations", tags=["Educations"])


def get_education_service(db: Session = Depends(get_db)) -> EducationService:
    return EducationService(db)


@router.get("", response_model=List[EducationResponse])
async def list_educations(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1),
    service: EducationService = Depends(get_education_service),
):
    return service.list_educations(skip=skip, limit=limit)


@router.get("/{education_id}", response_model=EducationResponse)
async def get_education(
    education_id: str, service: EducationService = Depends(get_education_service)
):
    item = service.get_education(education_id)
    if not item:
        raise HTTPException(status_code=404, detail="Education not found")
    return item
