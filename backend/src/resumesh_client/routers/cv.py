from fastapi import APIRouter, HTTPException, Response
from resumesh_storage.providers.supabase.client import SupabaseClientManager

router = APIRouter(prefix="/api/v1/cv", tags=["CV Storage"])


@router.get("/list")
async def list_cvs():
    try:
        client = SupabaseClientManager.get_client()
        files = await client.storage.from_("cvs").list()
        return {"status": "success", "files": files}
    except Exception:
        return {"status": "success", "files": []}


@router.get("/{filename}")
async def get_cv(filename: str):
    try:
        client = SupabaseClientManager.get_client()
        file_bytes = await client.storage.from_("cvs").download(filename)
        return Response(
            content=file_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f"inline; filename={filename}"},
        )
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"CV not found: {str(e)}")
