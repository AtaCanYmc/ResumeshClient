from fastapi import APIRouter, Depends, Query

from resumesh_client.db import get_db
from resumesh_client.models.article import Article
from resumesh_client.models.certificate import Certificate
from resumesh_client.models.experience import Experience
from resumesh_client.models.project import Project
from resumesh_client.schemas.search import GlobalSearchResponse, SearchResultItem

router = APIRouter(prefix="/api/v1/search", tags=["Search"])


@router.get("", response_model=GlobalSearchResponse)
async def global_search(q: str = Query("", min_length=1), db=Depends(get_db)):
    term = f"%{q}%"

    projects_db = db.query(Project).filter(Project.name.ilike(term) | Project.description.ilike(term)).all()
    articles_db = db.query(Article).filter(Article.title.ilike(term) | Article.summary.ilike(term)).all()
    exp_db = db.query(Experience).filter(Experience.company_name.ilike(term) | Experience.title.ilike(term)).all()
    cert_db = db.query(Certificate).filter(Certificate.name.ilike(term)).all()

    return GlobalSearchResponse(
        query=q,
        projects=[SearchResultItem(id=p.id, title=p.name, subtitle=p.description, url=p.url) for p in projects_db],
        articles=[SearchResultItem(id=a.id, title=a.title, subtitle=a.summary, url=a.url) for a in articles_db],
        experiences=[
            SearchResultItem(id=e.id, title=f"{e.title} at {e.company_name}", subtitle=e.description) for e in exp_db
        ],
        certificates=[
            SearchResultItem(
                id=c.id,
                title=c.name,
                subtitle=c.issuing_organization,
                url=c.credential_url,
            )
            for c in cert_db
        ],
    )
