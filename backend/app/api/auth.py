from fastapi import APIRouter, HTTPException, status, Depends
from app.schemas.auth import UserRegister, UserLogin, TokenResponse, UserResponse
from app.services.auth_service import AuthService, get_current_user
from app.core.security import create_access_token

router = APIRouter(tags=["Authentication"])

@router.post("/auth/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(payload: UserRegister):
    user = AuthService.register_user(
        email=payload.email,
        password=payload.password,
        full_name=payload.full_name
    )
    token = create_access_token(subject=user["_id"], role=user["role"])
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse(
            id=str(user["_id"]),
            email=user["email"],
            full_name=user.get("full_name"),
            role=user["role"],
            created_at=user["created_at"]
        )
    )

@router.post("/auth/login", response_model=TokenResponse)
def login(payload: UserLogin):
    user = AuthService.authenticate_user(email=payload.email, password=payload.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email address or password.",
            headers={"WWW-Authenticate": "Bearer"}
        )
    token = create_access_token(subject=user["id"], role=user.get("role", "user"))
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse(
            id=user["id"],
            email=user["email"],
            full_name=user.get("full_name"),
            role=user.get("role", "user"),
            created_at=user.get("created_at", "")
        )
    )

@router.get("/auth/me", response_model=UserResponse)
def get_current_profile(user: dict = Depends(get_current_user)):
    return UserResponse(
        id=user["id"],
        email=user["email"],
        full_name=user.get("full_name"),
        role=user.get("role", "user"),
        created_at=user.get("created_at", "")
    )
