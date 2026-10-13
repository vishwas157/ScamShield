from typing import List, Optional, Dict
from pydantic import BaseModel, Field

class ModerationRequest(BaseModel):
    action: str = Field(..., description="'approve', 'reject', or 'duplicate'")
    reason: str = Field(..., min_length=3, max_length=500, description="Reason for moderation action")

class AdminReportItem(BaseModel):
    id: str
    reference_id: str
    identifier_type: str
    normalized_identifier: str
    masked_identifier: str
    scam_category: str
    description: str
    incident_date: str
    amount_inr: Optional[float] = None
    reporter_id: str
    status: str
    created_at: str
    reviewed_at: Optional[str] = None
    reviewed_by: Optional[str] = None
    review_notes: Optional[str] = None

class AdminStats(BaseModel):
    total_reports: int
    pending_reports: int
    approved_reports: int
    rejected_reports: int
    duplicate_reports: int
    categories_distribution: Dict[str, int]
    type_distribution: Dict[str, int]
    total_amount_reported: float

class AuditLogItem(BaseModel):
    id: str
    actor_id: str
    actor_email: str
    action: str
    resource_id: str
    reason: str
    timestamp: str
