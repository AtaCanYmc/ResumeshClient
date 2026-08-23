from fastapi import APIRouter, BackgroundTasks, HTTPException
from pydantic import BaseModel
from resumesh_scrapers import DevToScraper, GitHubScraper, MediumScraper

router = APIRouter(prefix="/api/v1/admin", tags=["Admin Ingestion"])


class RefreshRequest(BaseModel):
    platform: str
    username: str


@router.post("/refresh-data")
async def trigger_refresh(req: RefreshRequest, background_tasks: BackgroundTasks):
    platform = req.platform.upper()
    if platform == "GITHUB":
        scraper = GitHubScraper()
        items = await scraper.fetch_data(req.username)
        return {"status": "success", "count": len(items), "platform": platform}
    elif platform == "MEDIUM":
        scraper = MediumScraper()
        items = await scraper.fetch_data(req.username)
        return {"status": "success", "count": len(items), "platform": platform}
    elif platform == "DEV_TO":
        scraper = DevToScraper()
        items = await scraper.fetch_data(req.username)
        return {"status": "success", "count": len(items), "platform": platform}
    else:
        raise HTTPException(
            status_code=400, detail=f"Unsupported platform: {req.platform}"
        )
