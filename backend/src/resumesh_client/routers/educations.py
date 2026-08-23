from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query
from resumesh_client.schemas.education import EducationResponse
from resumesh_client.db import get_db
from resumesh_client.models.education import Education

router = APIRouter(prefix="/api/v1/educations", tags=["Educations"])


@router.get("", response_model=List[EducationResponse])
async def list_educations(
    skip: int = Query(0, ge=0), limit: int = Query(100, ge=1), db=Depends(get_db)
):
    return db.query(Education).offset(skip).limit(limit).all()


@router.get("/{education_id}", response_model=EducationResponse)
async def get_education(education_id: str, db=Depends(get_db)):
    item = db.query(Education).filter(Education.id == education_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Education not found")
    return item
