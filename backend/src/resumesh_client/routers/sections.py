from typing import List

from fastapi import APIRouter, Depends, Query

from resumesh_client.db import get_db
from resumesh_client.models.section import Section
from resumesh_client.schemas.section import SectionResponse

router = APIRouter(prefix="/api/v1/sections", tags=["Sections"])


@router.get("", response_model=List[SectionResponse])
async def list_sections(
    skip: int = Query(0, ge=0), limit: int = Query(100, ge=1), db=Depends(get_db)
):
    return db.query(Section).offset(skip).limit(limit).all()
