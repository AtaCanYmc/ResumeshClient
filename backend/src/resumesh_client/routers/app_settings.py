from fastapi import APIRouter, Depends
from resumesh_core.schemas.app_settings import AppSettingsResponse
from resumesh_storage.db import get_db
from resumesh_storage.models.app_settings import AppSetting

router = APIRouter(prefix="/api/v1/settings", tags=["Settings"])


@router.get("", response_model=AppSettingsResponse)
async def get_settings(db=Depends(get_db)):
    item = db.query(AppSetting).first()
    if not item:
        return AppSettingsResponse()
    return item
