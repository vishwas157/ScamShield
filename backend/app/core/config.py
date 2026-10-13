import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

# Base directories to accurately locate .env regardless of working directory
BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
PROJECT_ROOT = os.path.dirname(BACKEND_DIR)

class Settings(BaseSettings):
    PROJECT_NAME: str = "ScamShield — Scam Number & UPI Community Database"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    ENVIRONMENT: str = "development"
    PORT: int = 8000
    
    # Database Configuration (Single source of truth via settings)
    MONGODB_URI: str = "mongodb://127.0.0.1:27017"
    DATABASE_NAME: str = "scamshield_db"
    MONGODB_TIMEOUT_MS: int = 5000
    
    # Security & Auth
    JWT_SECRET: str = "scamshield-secure-jwt-academic-secret-key-2026"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # CORS Configuration
    CORS_ORIGINS: str = ""
    FRONTEND_ORIGIN: str = "http://localhost:5173"
    
    # Bootstrap Admin (Used on first run if admin not present)
    DEFAULT_ADMIN_EMAIL: str = "admin@scamshield.org"
    DEFAULT_ADMIN_PASSWORD: str = "Admin@ScamShield2026"
    
    # Machine Learning Paths
    ML_MODEL_PATH: str = "app/ml/saved_model.joblib"
    ML_METADATA_PATH: str = "app/ml/saved_metadata.json"

    model_config = SettingsConfigDict(
        env_file=(
            os.path.join(BACKEND_DIR, ".env"),
            os.path.join(PROJECT_ROOT, ".env"),
            ".env"
        ),
        env_file_encoding="utf-8",
        extra="ignore"
    )

    def get_cors_origins(self) -> List[str]:
        """
        Parses comma-separated origins from CORS_ORIGINS and FRONTEND_ORIGIN,
        returning a clean deduplicated list of allowed domains for CORS middleware.
        """
        origins = set()
        
        # 1. Check CORS_ORIGINS environment variable
        if self.CORS_ORIGINS:
            for item in self.CORS_ORIGINS.split(","):
                clean = item.strip().rstrip("/")
                if clean:
                    origins.add(clean)
                    
        # 2. Check FRONTEND_ORIGIN environment variable
        if self.FRONTEND_ORIGIN:
            for item in self.FRONTEND_ORIGIN.split(","):
                clean = item.strip().rstrip("/")
                if clean:
                    origins.add(clean)
                    
        # 3. Always allow standard local development origins
        default_local = [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:3000",
            "http://127.0.0.1:3000",
        ]
        for loc in default_local:
            origins.add(loc)
            
        return list(origins)

settings = Settings()
