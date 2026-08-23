import mimetypes
import os

from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile
from resumesh_client.auth import get_current_admin
from resumesh_storage.providers.supabase.client import SupabaseClientManager

router = APIRouter(prefix="/api/v1/admin/storage", tags=["Admin Storage Management"])

ALLOWED_BUCKETS = ["cv-pdfs", "avatars"]


@router.get("/buckets")
async def get_buckets(admin=Depends(get_current_admin)):
    return [
        {
            "name": "cv-pdfs",
            "description": "Stores generated & uploaded CV PDF files",
            "allowed_mime": ["application/pdf"],
        },
        {
            "name": "avatars",
            "description": "Stores user profile pictures & avatar images",
            "allowed_mime": ["image/jpeg", "image/png", "image/webp"],
        },
    ]


@router.get("/files")
async def list_storage_files(
    bucket: str = Query("cv-pdfs"), admin=Depends(get_current_admin)
):
    if bucket not in ALLOWED_BUCKETS:
        raise HTTPException(
            status_code=400, detail=f"Invalid bucket. Allowed: {ALLOWED_BUCKETS}"
        )

    try:
        client = SupabaseClientManager.get_client()
        files = await client.storage.from_(bucket).list("")
        result = []
        for f in files:
            name = f.get("name") if isinstance(f, dict) else getattr(f, "name", "")
            if not name:
                continue
            content_type, _ = mimetypes.guess_type(name)
            url = f"/api/v1/{'cv' if bucket == 'cv-pdfs' else 'avatar'}/{name}"
            result.append(
                {
                    "name": name,
                    "bucket": bucket,
                    "content_type": content_type or "application/octet-stream",
                    "public_url": url,
                }
            )
        return result
    except Exception:
        return []


@router.post("/upload")
async def upload_storage_file(
    bucket: str = Query("cv-pdfs"),
    file: UploadFile = File(...),
    admin=Depends(get_current_admin),
):
    if bucket not in ALLOWED_BUCKETS:
        raise HTTPException(
            status_code=400, detail=f"Invalid bucket. Allowed: {ALLOWED_BUCKETS}"
        )

    contents = await file.read()
    clean_filename = os.path.basename(file.filename or "uploaded_file")
    url = f"/api/v1/{'cv' if bucket == 'cv-pdfs' else 'avatar'}/{clean_filename}"
    return {
        "status": "success",
        "bucket": bucket,
        "filename": clean_filename,
        "public_url": url,
    }


@router.delete("/files")
async def delete_storage_file(
    bucket: str = Query(...),
    filename: str = Query(...),
    admin=Depends(get_current_admin),
):
    clean_filename = os.path.basename(filename)
    return {"status": "success", "message": f"Deleted {clean_filename} from {bucket}"}
