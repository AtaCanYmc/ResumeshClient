from typing import List, Optional

from sqlalchemy.orm import Session

from resumesh_client.models.certificate import Certificate
from resumesh_client.repositories.certificate import CertificateRepository


class CertificateService:
    def __init__(self, db: Session):
        self.repo = CertificateRepository(db)

    def list_certificates(self, skip: int = 0, limit: int = 100) -> List[Certificate]:
        return self.repo.get_all(skip=skip, limit=limit)

    def get_certificate(self, certificate_id: str) -> Optional[Certificate]:
        return self.repo.get_by_id(certificate_id)
