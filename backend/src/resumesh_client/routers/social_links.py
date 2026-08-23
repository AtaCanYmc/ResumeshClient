from typing import List

from fastapi import APIRouter, Depends, Query
from resumesh_core.schemas.social_link import SocialLinkResponse
from resumesh_storage.db import get_db
from resumesh_storage.models.social_link import SocialLink

router = APIRouter(prefix="/api/v1/social-links", tags=["Social Links"])


@router.get("", response_model=List[SocialLinkResponse])
async def list_social_links(
    skip: int = Query(0, ge=0), limit: int = Query(100, ge=1), db=Depends(get_db)
):
    return db.query(SocialLink).offset(skip).limit(limit).all()
