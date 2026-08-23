from typing import Any, Dict

from sqlalchemy.orm import Session

from resumesh_client.repositories.article import ArticleRepository
from resumesh_client.repositories.certificate import CertificateRepository
from resumesh_client.repositories.experience import ExperienceRepository
from resumesh_client.repositories.project import ProjectRepository


class SearchRepository:
    def __init__(self, db: Session):
        self.project_repo = ProjectRepository(db)
        self.article_repo = ArticleRepository(db)
        self.exp_repo = ExperienceRepository(db)
        self.cert_repo = CertificateRepository(db)

    def search_all(self, term: str) -> Dict[str, Any]:
        return {
            "projects": self.project_repo.search_by_term(term),
            "articles": self.article_repo.search_by_term(term),
            "experiences": self.exp_repo.search_by_term(term),
            "certificates": self.cert_repo.search_by_term(term),
        }
