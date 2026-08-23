from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from resumesh_core.schemas.education import EducationCreate, EducationResponse, EducationUpdate
from resumesh_client.auth import get_current_admin
from resumesh_storage.db import get_db
from resumesh_storage.models.education import Education

router = APIRouter(prefix="/api/v1/educations", tags=["Educations"])


@router.get("", response_model=List[EducationResponse])
async def list_educations(skip: int = Query(0, ge=0), limit: int = Query(100, ge=1), db=Depends(get_db)):
    return db.query(Education).offset(skip).limit(limit).all()


@router.post("", response_model=EducationResponse)
async def create_education(payload: EducationCreate, db=Depends(get_db), admin=Depends(get_current_admin)):
    item = Education(**payload.model_dump(exclude_unset=True))
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/{education_id}", response_model=EducationResponse)
async def update_education(education_id: str, payload: EducationUpdate, db=Depends(get_db), admin=Depends(get_current_admin)):
    item = db.query(Education).filter(Education.id == education_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Education not found")
    for k, v in payload.model_dump(exclude_unset=True).items():
        setattr(item, k, v)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{education_id}")
async def delete_education(education_id: str, db=Depends(get_db), admin=Depends(get_current_admin)):
    item = db.query(Education).filter(Education.id == education_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Education not found")
    db.delete(item)
    db.commit()
    return {"message": "Education deleted successfully"}
