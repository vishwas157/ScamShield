import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.db.mongodb import db_manager
from app.db.seed import seed_initial_demo_data
from app.ml.predictor import FraudPredictor

from app.api.health import router as health_router, health_check
from app.api.stats import router as stats_router
from app.api.search import router as search_router
from app.api.reports import router as reports_router
from app.api.auth import router as auth_router
from app.api.users import router as users_router
from app.api.admin import router as admin_router
from app.api.ml_routes import router as ml_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("scamshield")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info(f"Starting {settings.PROJECT_NAME} v{settings.VERSION} [{settings.ENVIRONMENT} mode]")
    db_manager.connect()
    seed_initial_demo_data()
    try:
        FraudPredictor.load_model()
    except Exception as e:
        logger.warning(f"ML initialization notice: {e}")
    yield
    # Shutdown
    logger.info("Shutting down ScamShield backend...")
    db_manager.close()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description=(
        "ScamShield is an academic undergraduate cybersecurity platform "
        "providing community-driven scam mobile number and UPI ID reporting, "
        "multi-factor risk evaluation, admin moderation, and Random Forest machine learning classification."
    ),
    version=settings.VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Production CORS Configuration
cors_origins = settings.get_cors_origins()
logger.info(f"Configuring CORS with allowed origins: {cors_origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
)

# Root-level health check for cloud load balancers and orchestrator probes
@app.get("/health", tags=["System"])
def root_health():
    return health_check()

# Mount API Routers under /api
app.include_router(health_router, prefix=settings.API_V1_STR)
app.include_router(stats_router, prefix=settings.API_V1_STR)
app.include_router(search_router, prefix=settings.API_V1_STR)
app.include_router(reports_router, prefix=settings.API_V1_STR)
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(users_router, prefix=settings.API_V1_STR)
app.include_router(admin_router, prefix=settings.API_V1_STR)
app.include_router(ml_router, prefix=settings.API_V1_STR)

@app.get("/", tags=["System"])
def root():
    return {
        "project": settings.PROJECT_NAME,
        "academic_purpose": "B.Tech IT Semester 7 Academic Demonstration",
        "documentation": "/docs",
        "health": "/health",
        "api_health": f"{settings.API_V1_STR}/health",
        "status": "operational"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", settings.PORT))
    host = os.getenv("HOST", "0.0.0.0")
    uvicorn.run("app.main:app", host=host, port=port, reload=(settings.ENVIRONMENT == "development"))
