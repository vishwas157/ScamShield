from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class MLPredictionRequest(BaseModel):
    approved_reports_count: int = Field(0, ge=0)
    distinct_reporters: int = Field(0, ge=0)
    days_since_first_report: float = Field(0.0, ge=0.0)
    days_since_last_report: float = Field(0.0, ge=0.0)
    total_loss_amount: float = Field(0.0, ge=0.0)
    category_severity_score: float = Field(1.0, ge=0.0, le=5.0)
    dispute_count: int = Field(0, ge=0)

class MLPredictionResponse(BaseModel):
    status: str
    model_version: str
    risk_label: str  # LOW, MEDIUM, HIGH, INSUFFICIENT_DATA
    fraud_probability: Optional[float] = None
    is_sufficient_data: bool
    explanation: str
    top_features: Optional[Dict[str, float]] = None

class MLEvaluationMetrics(BaseModel):
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    confusion_matrix: List[List[int]]
    train_samples: int
    test_samples: int

class MLStatusResponse(BaseModel):
    is_trained: bool
    model_version: str
    trained_at: Optional[str] = None
    algorithm: str
    evaluation_summary: Optional[MLEvaluationMetrics] = None
    dataset_description: Optional[str] = None
