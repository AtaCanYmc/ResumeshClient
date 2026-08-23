from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query
from resumesh_core.schemas.social_link import (
    SocialLinkCreate,
    SocialLinkResponse,
    SocialLinkUpdate,
)
from resumesh_storage.db import get_db
from resumesh_storage.models.social_link import SocialLink

router = APIRouter(prefix="/api/v1/social-links", tags=["Social Links"])


@router.get("", response_model=List[SocialLinkResponse])
async def list_social_links(
    skip: int = Query(0, ge=0), limit: int = Query(100, ge=1), db=Depends(get_db)
):
    return db.query(SocialLink).offset(skip).limit(limit).all()


@router.post("", response_model=SocialLinkResponse)
async def create_social_link(payload: SocialLinkCreate, db=Depends(get_db)):
    item = SocialLink(**payload.model_dump(exclude_unset=True))
    db.add(item)
    db.commit()
    db.refresh(item)
    return item
