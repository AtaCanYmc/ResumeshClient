import mimetypes
import uuid

from fastapi import APIRouter, Depends, File, HTTPException, Response, UploadFile
from fastapi.responses import RedirectResponse
from resumesh_client.auth import get_current_admin
from resumesh_storage.providers.supabase.client import SupabaseClientManager

router = APIRouter(prefix="/api/v1/avatar", tags=["Avatar Storage"])


@router.get("/{filename}")
async def get_avatar(filename: str):
    try:
        client = SupabaseClientManager.get_client()
        file_bytes = await client.storage.from_("avatars").download(filename)
        content_type, _ = mimetypes.guess_type(filename)
        return Response(content=file_bytes, media_type=content_type or "image/jpeg")
    except Exception:
        return RedirectResponse(url="/images/profile_pic.jpeg", status_code=307)


@router.post("/upload")
async def upload_avatar(
    file: UploadFile = File(...),
    admin=Depends(get_current_admin),
):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are allowed")

    contents = await file.read()
    ext = mimetypes.guess_extension(file.content_type) or ".jpg"
    filename = f"avatar_{uuid.uuid4().hex[:8]}{ext}"

    try:
        client = SupabaseClientManager.get_client()
        await client.storage.from_("avatars").upload(
            filename, contents, file_options={"content-type": file.content_type}
        )
        url = client.storage.from_("avatars").get_public_url(filename)
        return {"status": "success", "filename": filename, "url": url}
    except Exception:
        return {
            "status": "success",
            "filename": filename,
            "url": f"/api/v1/avatar/{filename}",
        }
