from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.ml import MLStatusResponse, MLPredictionRequest, MLPredictionResponse
from app.ml.predictor import FraudPredictor
from app.ml.trainer import train_random_forest_model
from app.services.auth_service import get_current_admin

router = APIRouter(tags=["Machine Learning"])

@router.get("/ml/status", response_model=MLStatusResponse)
def get_model_status():
    status_data = FraudPredictor.get_status()
    return MLStatusResponse(
        is_trained=status_data.get("is_trained", False),
        model_version=status_data.get("model_version", "N/A"),
        trained_at=status_data.get("trained_at"),
        algorithm=status_data.get("algorithm", "RandomForestClassifier"),
        evaluation_summary=status_data.get("evaluation_summary"),
        dataset_description=status_data.get("dataset_description")
    )

@router.post("/ml/predict", response_model=MLPredictionResponse)
def predict_fraud_risk(payload: MLPredictionRequest):
    features = payload.model_dump()
    result = FraudPredictor.predict(features)
    return MLPredictionResponse(
        status=result["status"],
        model_version=result["model_version"],
        risk_label=result["risk_label"],
        fraud_probability=result.get("fraud_probability"),
        is_sufficient_data=result["is_sufficient_data"],
        explanation=result["explanation"],
        top_features=result.get("top_features")
    )

@router.post("/ml/train")
def retrain_model(admin: dict = Depends(get_current_admin)):
    result = train_random_forest_model(save_to_disk=True)
    # Refresh cache
    FraudPredictor._model = result["model"]
    FraudPredictor._metadata = result["metadata"]
    return {
        "success": True,
        "message": "Random Forest classifier successfully trained and updated.",
        "metadata": result["metadata"]
    }
