import mimetypes

from fastapi import APIRouter, Response
from fastapi.responses import RedirectResponse

from resumesh_client.config import settings
from resumesh_client.providers.supabase.client import SupabaseClientManager

router = APIRouter(prefix="/api/v1/avatar", tags=["Avatar Storage"])


@router.get("/{filename:path}")
async def get_avatar(filename: str):
    clean_filename = filename.replace("/url", "")
    try:
        client = SupabaseClientManager.get_client()
        file_bytes = await client.storage.from_("avatars").download(clean_filename)
        content_type, _ = mimetypes.guess_type(clean_filename)
        return Response(content=file_bytes, media_type=content_type or "image/jpeg")
    except Exception:
        if settings.SUPABASE_URL:
            base_url = settings.SUPABASE_URL.rstrip("/")
            public_url = f"{base_url}/storage/v1/object/public/avatars/{clean_filename}"
            return RedirectResponse(url=public_url, status_code=307)
        return RedirectResponse(url="/images/profile_pic.jpeg", status_code=307)
