from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from resumesh_core.schemas.certificate import CertificateCreate, CertificateResponse, CertificateUpdate
from resumesh_client.auth import get_current_admin
from resumesh_storage.db import get_db
from resumesh_storage.models.certificate import Certificate

router = APIRouter(prefix="/api/v1/certificates", tags=["Certificates"])


@router.get("", response_model=List[CertificateResponse])
async def list_certificates(skip: int = Query(0, ge=0), limit: int = Query(100, ge=1), db=Depends(get_db)):
    return db.query(Certificate).offset(skip).limit(limit).all()


@router.post("", response_model=CertificateResponse)
async def create_certificate(payload: CertificateCreate, db=Depends(get_db), admin=Depends(get_current_admin)):
    item = Certificate(**payload.model_dump(exclude_unset=True))
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{certificate_id}")
async def delete_certificate(certificate_id: str, db=Depends(get_db), admin=Depends(get_current_admin)):
    item = db.query(Certificate).filter(Certificate.id == certificate_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Certificate not found")
    db.delete(item)
    db.commit()
    return {"message": "Certificate deleted successfully"}
