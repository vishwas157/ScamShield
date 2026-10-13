from datetime import datetime
from typing import Dict, Any, List, Optional
from bson import ObjectId
from fastapi import HTTPException, status

from app.db.mongodb import get_reports_collection, get_audit_logs_collection

class AdminService:
    @staticmethod
    def get_dashboard_stats() -> Dict[str, Any]:
        reports_col = get_reports_collection()
        all_reports = list(reports_col.find({}))
        
        total = len(all_reports)
        pending = sum(1 for r in all_reports if r.get("status") == "pending")
        approved = sum(1 for r in all_reports if r.get("status") == "approved")
        rejected = sum(1 for r in all_reports if r.get("status") == "rejected")
        duplicate = sum(1 for r in all_reports if r.get("status") == "duplicate")
        
        categories_dist: Dict[str, int] = {}
        type_dist: Dict[str, int] = {"phone": 0, "upi": 0}
        total_amount = 0.0

        for r in all_reports:
            cat = r.get("scam_category", "Other")
            categories_dist[cat] = categories_dist.get(cat, 0) + 1
            
            t = r.get("identifier_type", "phone").lower()
            type_dist[t] = type_dist.get(t, 0) + 1
            
            if r.get("status") == "approved":
                total_amount += float(r.get("amount_inr") or 0.0)

        return {
            "total_reports": total,
            "pending_reports": pending,
            "approved_reports": approved,
            "rejected_reports": rejected,
            "duplicate_reports": duplicate,
            "categories_distribution": categories_dist,
            "type_distribution": type_dist,
            "total_amount_reported": round(total_amount, 2)
        }

    @staticmethod
    def get_all_reports(status_filter: Optional[str] = None) -> List[Dict[str, Any]]:
        reports_col = get_reports_collection()
        query = {}
        if status_filter and status_filter != "all":
            query["status"] = status_filter
            
        cursor = reports_col.find(query).sort("created_at", -1)
        res = []
        for r in cursor:
            res.append({
                "id": str(r["_id"]),
                "reference_id": r["reference_id"],
                "identifier_type": r["identifier_type"],
                "normalized_identifier": r["normalized_identifier"],
                "masked_identifier": r["masked_identifier"],
                "scam_category": r["scam_category"],
                "description": r["description"],
                "incident_date": r["incident_date"],
                "amount_inr": r.get("amount_inr", 0.0),
                "reporter_id": str(r.get("reporter_id")),
                "status": r["status"],
                "created_at": r["created_at"],
                "reviewed_at": r.get("reviewed_at"),
                "reviewed_by": r.get("reviewed_by"),
                "review_notes": r.get("review_notes")
            })
        return res

    @classmethod
    def moderate_report(
        cls,
        report_id: str,
        action: str,  # 'approve', 'reject', 'duplicate'
        reason: str,
        admin_id: str,
        admin_email: str
    ) -> Dict[str, Any]:
        reports_col = get_reports_collection()
        audit_col = get_audit_logs_collection()

        obj_id = ObjectId(report_id) if ObjectId.is_valid(report_id) else report_id
        report = reports_col.find_one({"_id": obj_id})
        if not report:
            # Try searching by reference_id
            report = reports_col.find_one({"reference_id": report_id})
            if not report:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found.")

        target_status = {
            "approve": "approved",
            "reject": "rejected",
            "duplicate": "duplicate"
        }.get(action.lower())

        if not target_status:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid moderation action. Must be 'approve', 'reject', or 'duplicate'."
            )

        now_str = datetime.utcnow().isoformat()
        reports_col.update_one(
            {"_id": report["_id"]},
            {"$set": {
                "status": target_status,
                "reviewed_at": now_str,
                "reviewed_by": admin_email,
                "review_notes": reason.strip()
            }}
        )

        # Record Audit Log
        audit_entry = {
            "actor_id": str(admin_id),
            "actor_email": admin_email,
            "action": action.lower(),
            "resource_id": report["reference_id"],
            "reason": reason.strip(),
            "timestamp": now_str
        }
        audit_col.insert_one(audit_entry)

        return {
            "success": True,
            "report_id": str(report["_id"]),
            "reference_id": report["reference_id"],
            "new_status": target_status,
            "reviewed_at": now_str,
            "reviewed_by": admin_email
        }

    @staticmethod
    def get_audit_logs(limit: int = 50) -> List[Dict[str, Any]]:
        audit_col = get_audit_logs_collection()
        cursor = audit_col.find({}).sort("timestamp", -1).limit(limit)
        res = []
        for a in cursor:
            res.append({
                "id": str(a["_id"]),
                "actor_id": a.get("actor_id"),
                "actor_email": a.get("actor_email"),
                "action": a.get("action"),
                "resource_id": a.get("resource_id"),
                "reason": a.get("reason"),
                "timestamp": a.get("timestamp")
            })
        return res
