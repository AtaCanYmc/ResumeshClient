from typing import List, Optional

from sqlalchemy.orm import Session

from resumesh_client.models.package import Package
from resumesh_client.repositories.package import PackageRepository


class PackageService:
    def __init__(self, db: Session):
        self.repo = PackageRepository(db)

    def list_packages(self, skip: int = 0, limit: int = 100) -> List[Package]:
        return self.repo.get_all(skip=skip, limit=limit)

    def get_package(self, package_id: str) -> Optional[Package]:
        return self.repo.get_by_id(package_id)
