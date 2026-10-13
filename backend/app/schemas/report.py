from datetime import datetime, date
from typing import Optional, List
from pydantic import BaseModel, Field

class ReportCreate(BaseModel):
    identifier_type: str = Field(..., description="'phone' or 'upi'")
    identifier_value: str = Field(..., description="Raw phone number or UPI ID")
    scam_category: str = Field(..., description="Category of scam")
    description: str = Field(..., min_length=20, max_length=2000, description="Detailed account of incident")
    incident_date: date = Field(..., description="Date when scam took place")
    amount_inr: Optional[float] = Field(None, ge=0, description="Loss amount in INR if applicable")
    consent_given: bool = Field(..., description="Confirmation that information is accurate")

class PublicReportItem(BaseModel):
    reference_id: str
    identifier_type: str
    masked_identifier: str
    scam_category: str
    description: str
    incident_date: str
    amount_inr: Optional[float] = None
    created_at: str
    status: str

class UserReportItem(PublicReportItem):
    id: str
    status: str
    reviewed_at: Optional[str] = None
    review_notes: Optional[str] = None

class ReportSubmissionResponse(BaseModel):
    success: bool
    message: str
    reference_id: str
    status: str
    masked_identifier: str
    identifier_type: str
