export interface PublicStats {
  total_reports: number;
  approved_reports: number;
  pending_reports: number;
  rejected_reports: number;
  unique_approved_identifiers: number;
  total_reported_identifiers: number;
  total_amount_reported_inr: number;
}

export interface ReportSnippet {
  reference_id: string;
  scam_category: string;
  incident_date: string;
  created_at: string;
  amount_inr?: number;
  description_snippet: string;
}

export interface MLRiskBreakdown {
  status: string;
  model_version: string;
  predicted_risk_level: 'LOW_RISK' | 'MEDIUM_RISK' | 'HIGH_RISK' | 'INSUFFICIENT_DATA';
  fraud_probability: number | null;
  data_sufficiency: 'SUFFICIENT' | 'INSUFFICIENT';
  explanation: string;
}

export interface SearchResponse {
  found: boolean;
  identifier_type: 'phone' | 'upi';
  masked_identifier: string;
  normalized_identifier: string;
  approved_reports_count: number;
  categories: string[];
  latest_report_date: string | null;
  risk_level: 'NO_REPORTS' | 'LOW_RISK' | 'MEDIUM_RISK' | 'HIGH_RISK' | 'INSUFFICIENT_DATA';
  risk_score: number;
  risk_explanation: string;
  trust_disclaimer: string;
  reports: ReportSnippet[];
  ml_assessment?: MLRiskBreakdown;
}

export interface PublicReportItem {
  reference_id: string;
  identifier_type: string;
  masked_identifier: string;
  scam_category: string;
  description: string;
  incident_date: string;
  amount_inr?: number;
  created_at: string;
  status: string;
}

export interface UserReportItem extends PublicReportItem {
  id: string;
  reviewed_at?: string;
  review_notes?: string;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  role: 'user' | 'admin';
  created_at: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface AdminStats {
  total_reports: number;
  pending_reports: number;
  approved_reports: number;
  rejected_reports: number;
  duplicate_reports: number;
  categories_distribution: Record<string, number>;
  type_distribution: Record<string, number>;
  total_amount_reported: number;
}

export interface AdminReportItem {
  id: string;
  reference_id: string;
  identifier_type: string;
  normalized_identifier: string;
  masked_identifier: string;
  scam_category: string;
  description: string;
  incident_date: string;
  amount_inr?: number;
  reporter_id: string;
  status: 'pending' | 'approved' | 'rejected' | 'duplicate';
  created_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  review_notes?: string;
}

export interface AuditLogItem {
  id: string;
  actor_id: string;
  actor_email: string;
  action: string;
  resource_id: string;
  reason: string;
  timestamp: string;
}

export interface MLEvaluationMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  confusion_matrix: number[][];
  train_samples: number;
  test_samples: number;
}

export interface MLStatusResponse {
  is_trained: boolean;
  model_version: string;
  trained_at?: string;
  algorithm: string;
  evaluation_summary?: MLEvaluationMetrics;
  dataset_description?: string;
}
