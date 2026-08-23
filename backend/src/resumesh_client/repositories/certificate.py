from typing import List

from sqlalchemy.orm import Session

from resumesh_client.models.certificate import Certificate
from resumesh_client.repositories.base import BaseRepository


class CertificateRepository(BaseRepository[Certificate]):
    def __init__(self, db: Session):
        super().__init__(db, Certificate)

    def search_by_term(self, term: str) -> List[Certificate]:
        wildcard_term = f"%{term}%"
        return (
            self.db.query(Certificate)
            .filter(Certificate.name.ilike(wildcard_term))
            .all()
        )
