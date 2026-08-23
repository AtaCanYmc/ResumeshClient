from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from resumesh_client.db import get_db
from resumesh_client.schemas.certificate import CertificateResponse
from resumesh_client.services.certificate_service import CertificateService

router = APIRouter(prefix="/api/v1/certificates", tags=["Certificates"])


def get_certificate_service(db: Session = Depends(get_db)) -> CertificateService:
    return CertificateService(db)


@router.get("", response_model=List[CertificateResponse])
async def list_certificates(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1),
    service: CertificateService = Depends(get_certificate_service),
):
    return service.list_certificates(skip=skip, limit=limit)


@router.get("/{certificate_id}", response_model=CertificateResponse)
async def get_certificate(
    certificate_id: str, service: CertificateService = Depends(get_certificate_service)
):
    item = service.get_certificate(certificate_id)
    if not item:
        raise HTTPException(status_code=404, detail="Certificate not found")
    return item
