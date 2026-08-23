from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from resumesh_client.db import get_db
from resumesh_client.schemas.section import SectionResponse
from resumesh_client.services.section_service import SectionService

router = APIRouter(prefix="/api/v1/sections", tags=["Sections"])


def get_section_service(db: Session = Depends(get_db)) -> SectionService:
    return SectionService(db)


@router.get("", response_model=List[SectionResponse])
async def list_sections(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1),
    service: SectionService = Depends(get_section_service),
):
    return service.list_sections(skip=skip, limit=limit)


@router.get("/{section_id}", response_model=SectionResponse)
async def get_section(
    section_id: str, service: SectionService = Depends(get_section_service)
):
    item = service.get_section(section_id)
    if not item:
        raise HTTPException(status_code=404, detail="Section not found")
    return item
