from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from resumesh_core.schemas.package import PackageCreate, PackageResponse, PackageUpdate
from resumesh_client.auth import get_current_admin
from resumesh_storage.db import get_db
from resumesh_storage.models.package import Package

router = APIRouter(prefix="/api/v1/packages", tags=["Packages"])


@router.get("", response_model=List[PackageResponse])
async def list_packages(skip: int = Query(0, ge=0), limit: int = Query(100, ge=1), db=Depends(get_db)):
    return db.query(Package).offset(skip).limit(limit).all()


@router.post("", response_model=PackageResponse)
async def create_package(payload: PackageCreate, db=Depends(get_db), admin=Depends(get_current_admin)):
    item = Package(**payload.model_dump(exclude_unset=True))
    db.add(item)
    db.commit()
    db.refresh(item)
    return item
