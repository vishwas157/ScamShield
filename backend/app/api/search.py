from fastapi import APIRouter, Query, HTTPException, status
from typing import Optional, List
from datetime import datetime

from app.services.normalization import NormalizationService
from app.services.risk_engine import RiskEngine
from app.ml.features import extract_features_from_reports
from app.ml.predictor import FraudPredictor
from app.db.mongodb import get_reports_collection
from app.schemas.search import SearchResponse, ReportSnippet, MLRiskBreakdown

router = APIRouter(tags=["Search"])

@router.get("/search", response_model=SearchResponse)
def search_scam_identifier(
    type: str = Query(..., description="'phone' or 'upi'"),
    query: str = Query(..., min_length=2, description="Indian mobile number or UPI ID")
):
    type_clean = type.strip().lower()
    if type_clean not in ["phone", "upi"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Identifier type must be either 'phone' or 'upi'."
        )

    # 1. Validation & Normalization
    is_valid, normalized_id, masked_id, err_msg = NormalizationService.normalize_identifier(type_clean, query)
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=err_msg
        )

    # 2. Query Approved Reports Only
    reports_col = get_reports_collection()
    cursor = reports_col.find({
        "normalized_identifier": normalized_id,
        "status": "approved"
    }).sort("created_at", -1)

    approved_reports = list(cursor)
    count = len(approved_reports)

    # 3. Community Evidence-Based Risk Calculation
    risk_level, risk_score, risk_explanation = RiskEngine.calculate_evidence_risk(approved_reports)

    # 4. Machine Learning Inference
    features = extract_features_from_reports(approved_reports)
    ml_result = FraudPredictor.predict(features)

    ml_breakdown = MLRiskBreakdown(
        status=ml_result["status"],
        model_version=ml_result["model_version"],
        predicted_risk_level=ml_result["risk_label"],
        fraud_probability=ml_result["fraud_probability"],
        data_sufficiency="SUFFICIENT" if ml_result["is_sufficient_data"] else "INSUFFICIENT",
        explanation=ml_result["explanation"]
    )

    # 5. Extract snippets & categories
    categories = sorted(list(set(r.get("scam_category", "Other") for r in approved_reports)))
    latest_date = approved_reports[0].get("created_at") if count > 0 else None

    snippets: List[ReportSnippet] = []
    for r in approved_reports[:5]:  # Top 5 most recent approved snippets
        desc = r.get("description", "")
        snippet = (desc[:160] + "...") if len(desc) > 160 else desc
        snippets.append(ReportSnippet(
            reference_id=r.get("reference_id", "N/A"),
            scam_category=r.get("scam_category", "Other"),
            incident_date=r.get("incident_date", "N/A"),
            created_at=r.get("created_at", "N/A"),
            amount_inr=r.get("amount_inr"),
            description_snippet=snippet
        ))

    disclaimer = (
        "No verified community reports found. This does not guarantee that this identifier is safe or legitimate."
        if count == 0 else
        "Risk scores reflect approved community submissions verified by moderation. Treat unverified requests with extreme vigilance."
    )

    return SearchResponse(
        found=(count > 0),
        identifier_type=type_clean,
        masked_identifier=masked_id,
        normalized_identifier=normalized_id,
        approved_reports_count=count,
        categories=categories,
        latest_report_date=latest_date,
        risk_level=risk_level,
        risk_score=risk_score,
        risk_explanation=risk_explanation,
        trust_disclaimer=disclaimer,
        reports=snippets,
        ml_assessment=ml_breakdown
    )
