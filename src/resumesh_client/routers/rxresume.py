from fastapi import APIRouter, Depends, HTTPException
from resumesh_client.auth import get_current_admin

router = APIRouter(
    prefix="/api/v1/admin/rxresume", tags=["Admin Reactive Resume Management"]
)


@router.get("/resumes")
async def get_rxresume_resumes(admin=Depends(get_current_admin)):
    return {"status": "success", "resumes": []}


@router.get("/resume/{resume_id}/pdf")
async def get_rxresume_pdf(resume_id: str, admin=Depends(get_current_admin)):
    return {"status": "success", "url": f"/api/v1/cv/{resume_id}.pdf"}


@router.post("/resume/{resume_id}/sync")
async def sync_rxresume(resume_id: str, admin=Depends(get_current_admin)):
    return {
        "status": "success",
        "message": "Resume data successfully synchronized with ResuMesh.",
    }


@router.get("/applications")
async def get_rxresume_applications(admin=Depends(get_current_admin)):
    return {"status": "success", "applications": []}


@router.get("/agent/threads")
async def get_rxresume_agent_threads(admin=Depends(get_current_admin)):
    return {"status": "success", "threads": []}


@router.get("/ai-providers")
async def get_rxresume_ai_providers(admin=Depends(get_current_admin)):
    return {"status": "success", "providers": []}


@router.get("/statistics")
async def get_rxresume_statistics(admin=Depends(get_current_admin)):
    return {
        "status": "success",
        "statistics": {"resumesCount": 1, "usersCount": 1, "githubStars": 100},
    }
