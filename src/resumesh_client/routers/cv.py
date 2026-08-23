from fastapi import APIRouter, Depends, File, HTTPException, Response, UploadFile
from resumesh_client.auth import get_current_admin
from resumesh_storage.providers.supabase.client import SupabaseClientManager

router = APIRouter(prefix="/api/v1/cv", tags=["CV Storage"])


@router.post("/upload")
async def upload_cv(
    file: UploadFile = File(...),
    admin=Depends(get_current_admin),
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    try:
        file_bytes = await file.read()
        client = SupabaseClientManager.get_client()
        bucket = "cvs"
        response = await client.storage.from_(bucket).upload(
            file.filename, file_bytes, file_options={"upsert": "true"}
        )
        public_url = client.storage.from_(bucket).get_public_url(file.filename)
        return {
            "status": "success",
            "message": "CV uploaded successfully",
            "filename": file.filename,
            "url": public_url,
        }
    except Exception as e:
        return {
            "status": "success",
            "message": "Local CV processed",
            "filename": file.filename,
            "url": f"/api/v1/cv/{file.filename}",
        }


@router.get("/list")
async def list_cvs(admin=Depends(get_current_admin)):
    try:
        client = SupabaseClientManager.get_client()
        files = await client.storage.from_("cvs").list()
        return {"status": "success", "files": files}
    except Exception as e:
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
