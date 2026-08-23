from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from resumesh_client.db import get_db
from resumesh_client.schemas.package import PackageResponse
from resumesh_client.services.package_service import PackageService

router = APIRouter(prefix="/api/v1/packages", tags=["Packages"])


def get_package_service(db: Session = Depends(get_db)) -> PackageService:
    return PackageService(db)


@router.get("", response_model=List[PackageResponse])
async def list_packages(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1),
    service: PackageService = Depends(get_package_service),
):
    return service.list_packages(skip=skip, limit=limit)


@router.get("/{package_id}", response_model=PackageResponse)
async def get_package(
    package_id: str, service: PackageService = Depends(get_package_service)
):
    item = service.get_package(package_id)
    if not item:
        raise HTTPException(status_code=404, detail="Package not found")
    return item
