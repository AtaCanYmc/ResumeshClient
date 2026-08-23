from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query
from schemas.certificate import CertificateResponse
from db import get_db
from models.certificate import Certificate

router = APIRouter(prefix="/api/v1/certificates", tags=["Certificates"])


@router.get("", response_model=List[CertificateResponse])
async def list_certificates(
    skip: int = Query(0, ge=0), limit: int = Query(100, ge=1), db=Depends(get_db)
):
    return db.query(Certificate).offset(skip).limit(limit).all()


@router.get("/{certificate_id}", response_model=CertificateResponse)
async def get_certificate(certificate_id: str, db=Depends(get_db)):
    item = db.query(Certificate).filter(Certificate.id == certificate_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Certificate not found")
    return item
