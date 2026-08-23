import mimetypes

from fastapi import APIRouter, Response
from fastapi.responses import RedirectResponse
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
