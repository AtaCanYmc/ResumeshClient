import mimetypes
from typing import Dict

from fastapi import APIRouter, Response
from fastapi.responses import RedirectResponse

from resumesh_client.config import settings
from resumesh_client.providers.supabase.client import SupabaseClientManager

router = APIRouter(prefix="/api/v1/avatar", tags=["Avatar Storage"])

# In-memory byte cache for fast instant serving (<1ms)
_AVATAR_BYTE_CACHE: Dict[str, bytes] = {}


@router.get("/{filename:path}")
async def get_avatar(filename: str):
    clean_filename = filename.replace("/url", "")

    cache_headers = {
        "Cache-Control": "public, max-age=604800, stale-while-revalidate=86400, immutable"
    }

    # Serve from in-memory cache if available
    if clean_filename in _AVATAR_BYTE_CACHE:
        content_type, _ = mimetypes.guess_type(clean_filename)
        return Response(
            content=_AVATAR_BYTE_CACHE[clean_filename],
            media_type=content_type or "image/jpeg",
            headers=cache_headers,
        )

    try:
        client = SupabaseClientManager.get_client()
        file_bytes = await client.storage.from_("avatars").download(clean_filename)
        if file_bytes:
            _AVATAR_BYTE_CACHE[clean_filename] = file_bytes
        content_type, _ = mimetypes.guess_type(clean_filename)
        return Response(
            content=file_bytes,
            media_type=content_type or "image/jpeg",
            headers=cache_headers,
        )
    except Exception:
        if settings.SUPABASE_URL:
            base_url = settings.SUPABASE_URL.rstrip("/")
            public_url = f"{base_url}/storage/v1/object/public/avatars/{clean_filename}"
            return RedirectResponse(
                url=public_url, status_code=307, headers=cache_headers
            )
        return RedirectResponse(
            url="/images/profile_pic.jpeg", status_code=307, headers=cache_headers
        )
