from typing import List, Optional, Dict, Any
from pydantic import BaseModel

class ReportSnippet(BaseModel):
    reference_id: str
    scam_category: str
    incident_date: str
    created_at: str
    amount_inr: Optional[float] = None
    description_snippet: str

class MLRiskBreakdown(BaseModel):
    status: str
    model_version: str
    predicted_risk_level: str
    fraud_probability: Optional[float] = None
    data_sufficiency: str
    explanation: str

class SearchResponse(BaseModel):
    found: bool
    identifier_type: str
    masked_identifier: str
    normalized_identifier: str
    approved_reports_count: int
    categories: List[str]
    latest_report_date: Optional[str] = None
    risk_level: str  # NO_REPORTS, LOW_RISK, MEDIUM_RISK, HIGH_RISK, INSUFFICIENT_DATA
    risk_score: float
    risk_explanation: str
    trust_disclaimer: str
    reports: List[ReportSnippet]
    ml_assessment: Optional[MLRiskBreakdown] = None
