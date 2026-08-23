from fastapi import APIRouter, Depends, HTTPException
from resumesh_core.schemas.app_settings import AppSettingsResponse, AppSettingsUpdate
from resumesh_client.auth import get_current_admin
from resumesh_storage.db import get_db
from resumesh_storage.models.app_settings import AppSetting

router = APIRouter(prefix="/api/v1/settings", tags=["Settings"])


@router.get("", response_model=AppSettingsResponse)
async def get_settings(db=Depends(get_db)):
    item = db.query(AppSetting).first()
    if not item:
        return AppSettingsResponse(theme="dark", site_name="ResuMesh Portfolio")
    return item


@router.put("", response_model=AppSettingsResponse)
async def update_settings(payload: AppSettingsUpdate, db=Depends(get_db), admin=Depends(get_current_admin)):
    item = db.query(AppSetting).first()
    if not item:
        item = AppSetting()
        db.add(item)
    for k, v in payload.model_dump(exclude_unset=True).items():
        setattr(item, k, v)
    db.commit()
    db.refresh(item)
    return item
