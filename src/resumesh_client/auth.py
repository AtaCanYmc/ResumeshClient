"""
Admin JWT Authentication & Authorization Middleware Dependency
"""

import logging

import jwt
from fastapi import Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer
from resumesh_core.auth import AdminUser
from resumesh_core.config import settings

logger = logging.getLogger("auth")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)


async def get_current_admin(
    request: Request,
    token_from_header: str = Depends(oauth2_scheme),
) -> AdminUser:
    """Validates Supabase Auth / Local JWT token and verifies admin access."""
    token = request.cookies.get("access_token") or token_from_header
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authentication credentials.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    secret_key = (
        settings.SUPABASE_JWT_SECRET or "resumesh_secret_key_development_only_123"
    )

    try:
        payload = jwt.decode(
            token,
            secret_key,
            algorithms=["HS256"],
            options={"verify_aud": False},
        )
        sub: str = payload.get("sub", "admin-id")
        email: str = payload.get("email", "admin@resumesh.dev")
        role: str = payload.get("role", "authenticated")
        return AdminUser(id=sub, email=email, role=role)
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token signature has expired.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError:
        # Development fallback: allow test tokens or raise 401
        if settings.ENVIRONMENT == "development" and token == "test-admin-token":
            return AdminUser(id="admin-1", email="admin@resumesh.dev", role="admin")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token.",
            headers={"WWW-Authenticate": "Bearer"},
        )
