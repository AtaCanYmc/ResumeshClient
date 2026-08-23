from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from resumesh_client.db import get_db
from resumesh_client.schemas.social_link import SocialLinkResponse
from resumesh_client.services.social_link_service import SocialLinkService

router = APIRouter(prefix="/api/v1/social-links", tags=["SocialLinks"])


def get_social_link_service(db: Session = Depends(get_db)) -> SocialLinkService:
    return SocialLinkService(db)


@router.get("", response_model=List[SocialLinkResponse])
async def list_social_links(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1),
    service: SocialLinkService = Depends(get_social_link_service),
):
    return service.list_social_links(skip=skip, limit=limit)


@router.get("/{social_link_id}", response_model=SocialLinkResponse)
async def get_social_link(
    social_link_id: str, service: SocialLinkService = Depends(get_social_link_service)
):
    item = service.get_social_link(social_link_id)
    if not item:
        raise HTTPException(status_code=404, detail="SocialLink not found")
    return item
