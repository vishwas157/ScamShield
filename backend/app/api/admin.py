from typing import List, Optional
from fastapi import APIRouter, Depends, Query, HTTPException, status
from app.services.auth_service import get_current_admin
from app.services.admin_service import AdminService
from app.schemas.admin import AdminStats, AdminReportItem, ModerationRequest, AuditLogItem

router = APIRouter(tags=["Admin Moderation"])

@router.get("/admin/stats", response_model=AdminStats)
def get_admin_dashboard_stats(admin: dict = Depends(get_current_admin)):
    return AdminService.get_dashboard_stats()

@router.get("/admin/reports", response_model=List[AdminReportItem])
def list_reports_for_moderation(
    status: Optional[str] = Query(None, description="Filter by status: pending, approved, rejected, duplicate, or all"),
    admin: dict = Depends(get_current_admin)
):
    return AdminService.get_all_reports(status_filter=status)

@router.post("/admin/reports/{report_id}/approve")
def approve_report(
    report_id: str,
    payload: ModerationRequest,
    admin: dict = Depends(get_current_admin)
):
    return AdminService.moderate_report(
        report_id=report_id,
        action="approve",
        reason=payload.reason,
        admin_id=admin["id"],
        admin_email=admin["email"]
    )

@router.post("/admin/reports/{report_id}/reject")
def reject_report(
    report_id: str,
    payload: ModerationRequest,
    admin: dict = Depends(get_current_admin)
):
    return AdminService.moderate_report(
        report_id=report_id,
        action="reject",
        reason=payload.reason,
        admin_id=admin["id"],
        admin_email=admin["email"]
    )

@router.post("/admin/reports/{report_id}/moderate")
def moderate_report_action(
    report_id: str,
    payload: ModerationRequest,
    admin: dict = Depends(get_current_admin)
):
    return AdminService.moderate_report(
        report_id=report_id,
        action=payload.action,
        reason=payload.reason,
        admin_id=admin["id"],
        admin_email=admin["email"]
    )

@router.get("/admin/audit-logs", response_model=List[AuditLogItem])
def get_audit_trail(
    limit: int = Query(50, ge=1, le=200),
    admin: dict = Depends(get_current_admin)
):
    return AdminService.get_audit_logs(limit=limit)
