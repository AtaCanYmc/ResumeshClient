from sqlalchemy.orm import Session

from resumesh_client.repositories.search import SearchRepository
from resumesh_client.schemas.search import GlobalSearchResponse, SearchResultItem


class SearchService:
    def __init__(self, db: Session):
        self.repo = SearchRepository(db)

    def global_search(self, term: str) -> GlobalSearchResponse:
        raw_results = self.repo.search_all(term)

        return GlobalSearchResponse(
            query=term,
            projects=[
                SearchResultItem(
                    id=p.id, title=p.name, subtitle=p.description, url=p.url
                )
                for p in raw_results["projects"]
            ],
            articles=[
                SearchResultItem(id=a.id, title=a.title, subtitle=a.summary, url=a.url)
                for a in raw_results["articles"]
            ],
            experiences=[
                SearchResultItem(
                    id=e.id,
                    title=f"{e.title} at {e.company_name}",
                    subtitle=e.description,
                )
                for e in raw_results["experiences"]
            ],
            certificates=[
                SearchResultItem(
                    id=c.id,
                    title=c.name,
                    subtitle=c.issuing_organization,
                    url=c.credential_url,
                )
                for c in raw_results["certificates"]
            ],
        )
