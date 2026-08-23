from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from resumesh_client.db import get_db
from resumesh_client.schemas.search import GlobalSearchResponse
from resumesh_client.services.search_service import SearchService

router = APIRouter(prefix="/api/v1/search", tags=["Search"])


def get_search_service(db: Session = Depends(get_db)) -> SearchService:
    return SearchService(db)


@router.get("", response_model=GlobalSearchResponse)
async def global_search(
    q: str = Query("", min_length=1),
    service: SearchService = Depends(get_search_service),
):
    return service.global_search(q)
