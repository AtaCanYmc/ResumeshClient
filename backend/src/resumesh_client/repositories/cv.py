from sqlalchemy.orm import Session

from resumesh_client.models.generated_cv import GeneratedCV
from resumesh_client.repositories.base import BaseRepository


class CVRepository(BaseRepository[GeneratedCV]):
    def __init__(self, db: Session):
        super().__init__(db, GeneratedCV)
