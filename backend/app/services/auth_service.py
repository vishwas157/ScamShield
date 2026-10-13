import logging
from datetime import datetime
from typing import Optional, Dict, Any
from bson import ObjectId
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.core.security import verify_password, get_password_hash, create_access_token, decode_access_token
from app.db.mongodb import get_users_collection
from app.core.config import settings

logger = logging.getLogger("scamshield.auth")
security = HTTPBearer(auto_error=False)

class AuthService:
    @staticmethod
    def register_user(email: str, password: str, full_name: Optional[str] = None) -> Dict[str, Any]:
        users_col = get_users_collection()
        email_clean = email.strip().lower()

        existing = users_col.find_one({"email": email_clean})
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="An account with this email address already exists."
            )

        password_hash = get_password_hash(password)
        new_user = {
            "email": email_clean,
            "password_hash": password_hash,
            "full_name": full_name.strip() if full_name else None,
            "role": "user",  # Self-assigning admin is strictly prohibited
            "created_at": datetime.utcnow().isoformat()
        }

        res = users_col.insert_one(new_user)
        new_user["_id"] = str(res.inserted_id)
        return new_user

    @staticmethod
    def authenticate_user(email: str, password: str) -> Optional[Dict[str, Any]]:
        users_col = get_users_collection()
        email_clean = email.strip().lower()
        user = users_col.find_one({"email": email_clean})
        if not user:
            return None

        if not verify_password(password, user["password_hash"]):
            return None

        user["id"] = str(user["_id"])
        return user

    @staticmethod
    def bootstrap_default_admin():
        """
        Initializes the initial administrative moderator account if not present.
        """
        users_col = get_users_collection()
        admin_email = settings.DEFAULT_ADMIN_EMAIL.strip().lower()
        existing = users_col.find_one({"email": admin_email})
        if not existing:
            admin_user = {
                "email": admin_email,
                "password_hash": get_password_hash(settings.DEFAULT_ADMIN_PASSWORD),
                "full_name": "Chief Moderator",
                "role": "admin",
                "created_at": datetime.utcnow().isoformat()
            }
            users_col.insert_one(admin_user)
            logger.info(f"Initialized administrative account: {admin_email}")

def get_current_user_optional(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)) -> Optional[Dict[str, Any]]:
    if not credentials:
        return None
    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        return None

    users_col = get_users_collection()
    user_id = payload["sub"]
    user = users_col.find_one({"_id": ObjectId(user_id) if ObjectId.is_valid(user_id) else user_id})
    if not user:
        return None
    user["id"] = str(user["_id"])
    return user

def get_current_user(user: Optional[Dict[str, Any]] = Depends(get_current_user_optional)) -> Dict[str, Any]:
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication credentials required or token expired.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

def get_current_admin(user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
    if user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrative privileges required to access this resource."
        )
    return user
