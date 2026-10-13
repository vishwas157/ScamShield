from fastapi import APIRouter
from app.db.mongodb import db_manager
from app.ml.predictor import FraudPredictor
from app.core.config import settings

router = APIRouter(tags=["System"])

@router.get("/health")
def health_check():
    """
    Production health-check endpoint for container orchestrators,
    load balancers, and frontend telemetry.
    """
    ml_status = FraudPredictor.get_status()
    db_health = db_manager.get_health_info()
    
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "database": db_health,
        "machine_learning": {
            "engine": "RandomForestClassifier (Scikit-Learn)",
            "trained": ml_status.get("is_trained", False),
            "version": ml_status.get("model_version", "N/A"),
            "algorithm": ml_status.get("algorithm", "RandomForestClassifier")
        }
    }
