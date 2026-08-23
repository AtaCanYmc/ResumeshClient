from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session

from resumesh_client.db import get_db
from resumesh_client.schemas.app_settings import AppSettingsResponse
from resumesh_client.services.settings_store import get_all_settings

router = APIRouter(prefix="/api/v1/settings", tags=["Settings"])


@router.get("", response_model=AppSettingsResponse)
async def get_settings(response: Response, db: Session = Depends(get_db)):
    response.headers["Cache-Control"] = (
        "public, max-age=3600, stale-while-revalidate=60"
    )
    raw = get_all_settings(db)
    return AppSettingsResponse(
        sections=raw.get("sections"),
        socials=raw.get("socials"),
        footer=raw.get("footer"),
        marquee=raw.get("marquee"),
        en=raw.get("en"),
        tr=raw.get("tr"),
    )
