from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query
from schemas.package import PackageResponse
from db import get_db
from models.package import Package

router = APIRouter(prefix="/api/v1/packages", tags=["Packages"])


@router.get("", response_model=List[PackageResponse])
async def list_packages(
    skip: int = Query(0, ge=0), limit: int = Query(100, ge=1), db=Depends(get_db)
):
    return db.query(Package).offset(skip).limit(limit).all()


@router.get("/{package_id}", response_model=PackageResponse)
async def get_package(package_id: str, db=Depends(get_db)):
    item = db.query(Package).filter(Package.id == package_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Package not found")
    return item
