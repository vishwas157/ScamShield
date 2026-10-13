from fastapi import APIRouter
from app.db.mongodb import get_reports_collection

router = APIRouter(tags=["Statistics"])

@router.get("/stats")
def get_public_stats():
    reports_col = get_reports_collection()
    all_reports = list(reports_col.find({}))
    
    total = len(all_reports)
    approved = sum(1 for r in all_reports if r.get("status") == "approved")
    pending = sum(1 for r in all_reports if r.get("status") == "pending")
    rejected = sum(1 for r in all_reports if r.get("status") == "rejected")
    
    # Unique approved identifiers
    approved_identifiers = set(r.get("normalized_identifier") for r in all_reports if r.get("status") == "approved")
    all_identifiers = set(r.get("normalized_identifier") for r in all_reports)
    
    total_loss_approved = sum(float(r.get("amount_inr") or 0.0) for r in all_reports if r.get("status") == "approved")
    
    return {
        "total_reports": total,
        "approved_reports": approved,
        "pending_reports": pending,
        "rejected_reports": rejected,
        "unique_approved_identifiers": len(approved_identifiers),
        "total_reported_identifiers": len(all_identifiers),
        "total_amount_reported_inr": round(total_loss_approved, 2)
    }
