import datetime

import jwt
from fastapi import APIRouter, Depends, HTTPException, Response, status
from pydantic import BaseModel
from resumesh_client.auth import get_current_admin
from resumesh_core.auth import AdminUser
from resumesh_core.config import settings

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])


class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


@router.post("/login", response_model=TokenResponse)
async def login(payload: LoginRequest, response: Response):
    # Admin login verification
    secret_key = (
        settings.SUPABASE_JWT_SECRET or "resumesh_secret_key_development_only_123"
    )
    exp = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=7)
    token_payload = {
        "sub": "admin-1",
        "email": payload.email,
        "role": "admin",
        "exp": exp,
    }
    token = jwt.encode(token_payload, secret_key, algorithm="HS256")
    response.set_cookie(key="access_token", value=token, httponly=True)
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user={"id": "admin-1", "email": payload.email, "role": "admin"},
    )


@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie(key="access_token")
    return {"message": "Successfully logged out"}


@router.get("/verify")
async def verify_token(current_admin: AdminUser = Depends(get_current_admin)):
    return {"status": "valid", "email": current_admin.email, "role": current_admin.role}


@router.get("/me")
async def get_me(current_admin: AdminUser = Depends(get_current_admin)):
    return {
        "id": current_admin.id,
        "email": current_admin.email,
        "role": current_admin.role,
    }
