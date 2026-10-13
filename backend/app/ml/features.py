from typing import List, Dict, Any
from datetime import datetime
import numpy as np
from app.services.risk_engine import CATEGORY_SEVERITY_WEIGHTS

FEATURE_NAMES = [
    "approved_reports_count",
    "distinct_reporters",
    "days_since_first_report",
    "days_since_last_report",
    "total_loss_amount",
    "category_severity_score",
    "dispute_count"
]

def extract_features_from_reports(reports: List[Dict[str, Any]]) -> Dict[str, float]:
    """
    Extracts statistical input features from a list of approved community reports.
    """
    count = len(reports)
    if count == 0:
        return {
            "approved_reports_count": 0.0,
            "distinct_reporters": 0.0,
            "days_since_first_report": 0.0,
            "days_since_last_report": 0.0,
            "total_loss_amount": 0.0,
            "category_severity_score": 1.0,
            "dispute_count": 0.0
        }

    distinct_reporters = len(set(str(r.get("reporter_id")) for r in reports))
    total_loss = sum(float(r.get("amount_inr") or 0.0) for r in reports)
    categories = [r.get("scam_category", "Other") for r in reports]
    avg_severity = sum(CATEGORY_SEVERITY_WEIGHTS.get(c, 2.5) for c in categories) / count

    now = datetime.utcnow()
    dates = []
    for r in reports:
        dt = r.get("created_at")
        if isinstance(dt, datetime):
            dates.append(dt)
        elif isinstance(dt, str):
            try:
                dates.append(datetime.fromisoformat(dt.replace("Z", "")))
            except Exception:
                pass

    if dates:
        oldest = min(dates)
        newest = max(dates)
        days_first = max((now - oldest).total_seconds() / 86400.0, 0.1)
        days_last = max((now - newest).total_seconds() / 86400.0, 0.1)
    else:
        days_first = 1.0
        days_last = 1.0

    return {
        "approved_reports_count": float(count),
        "distinct_reporters": float(distinct_reporters),
        "days_since_first_report": round(days_first, 1),
        "days_since_last_report": round(days_last, 1),
        "total_loss_amount": round(total_loss, 2),
        "category_severity_score": round(avg_severity, 2),
        "dispute_count": 0.0
    }

def vector_from_feature_dict(features_dict: Dict[str, float]) -> np.ndarray:
    return np.array([[features_dict.get(name, 0.0) for name in FEATURE_NAMES]])
