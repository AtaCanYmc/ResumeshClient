import logging
import mimetypes
from typing import Dict

import httpx
from fastapi import APIRouter, Response

from resumesh_client.config import settings
from resumesh_client.providers.supabase.client import SupabaseClientManager

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/avatar", tags=["Avatar Storage"])

# In-memory byte cache for backend caching
_AVATAR_BYTE_CACHE: Dict[str, bytes] = {}


@router.get("/{filename:path}")
async def get_avatar(filename: str):
    clean_filename = filename.replace("/url", "")

    cache_headers = {
        "Cache-Control": "public, max-age=604800, stale-while-revalidate=86400, immutable"
    }

    # 1. Serve from in-memory cache if already pulled
    if clean_filename in _AVATAR_BYTE_CACHE:
        content_type, _ = mimetypes.guess_type(clean_filename)
        return Response(
            content=_AVATAR_BYTE_CACHE[clean_filename],
            media_type=content_type or "image/jpeg",
            headers=cache_headers,
        )

    file_bytes = None

    # 2. Try downloading via Supabase SDK Client
    try:
        client = SupabaseClientManager.get_client()
        file_bytes = await client.storage.from_("avatars").download(clean_filename)
    except Exception as exc:
        logger.warning(
            f"Supabase SDK download failed for avatar {clean_filename}: {exc}"
        )

    # 3. Fallback: Download via httpx if SDK fails, but SUPABASE_URL is configured
    if not file_bytes and settings.SUPABASE_URL:
        try:
            base_url = settings.SUPABASE_URL.rstrip("/")
            public_url = f"{base_url}/storage/v1/object/public/avatars/{clean_filename}"
            async with httpx.AsyncClient(timeout=10.0) as http_client:
                res = await http_client.get(public_url)
                if res.status_code == 200:
                    file_bytes = res.content
        except Exception as exc:
            logger.warning(
                f"HTTP fallback fetch failed for avatar {clean_filename}: {exc}"
            )

    # 4. Cache bytes in memory if fetched successfully
    if file_bytes:
        _AVATAR_BYTE_CACHE[clean_filename] = file_bytes
        content_type, _ = mimetypes.guess_type(clean_filename)
        return Response(
            content=file_bytes,
            media_type=content_type or "image/jpeg",
            headers=cache_headers,
        )

    # 5. Fallback for tests/unconfigured environments: redirect to static placeholder asset
    return Response(
        status_code=307,
        headers={"Location": "/images/profile_pic.jpeg"},
    )
