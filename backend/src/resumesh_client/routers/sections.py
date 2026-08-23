from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query
from resumesh_core.schemas.section import SectionCreate, SectionResponse, SectionUpdate
from resumesh_storage.db import get_db
from resumesh_storage.models.section import Section

router = APIRouter(prefix="/api/v1/sections", tags=["Sections"])


@router.get("", response_model=List[SectionResponse])
async def list_sections(
    skip: int = Query(0, ge=0), limit: int = Query(100, ge=1), db=Depends(get_db)
):
    return db.query(Section).offset(skip).limit(limit).all()


@router.post("", response_model=SectionResponse)
async def create_section(payload: SectionCreate, db=Depends(get_db)):
    item = Section(**payload.model_dump(exclude_unset=True))
    db.add(item)
    db.commit()
    db.refresh(item)
    return item
