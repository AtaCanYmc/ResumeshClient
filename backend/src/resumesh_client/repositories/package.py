from sqlalchemy.orm import Session

from resumesh_client.models.package import Package
from resumesh_client.repositories.base import BaseRepository


class PackageRepository(BaseRepository[Package]):
    def __init__(self, db: Session):
        super().__init__(db, Package)
