import axios from 'axios';
import {
  PublicStats,
  SearchResponse,
  PublicReportItem,
  UserReportItem,
  TokenResponse,
  User,
  AdminStats,
  AdminReportItem,
  AuditLogItem,
  MLStatusResponse
} from '../types';

// Determine production API Base URL:
// - Supports cross-origin backend deployments (e.g., Render/Railway) via VITE_API_BASE_URL
// - Falls back cleanly to '/api' for same-origin or local reverse proxy development
const rawBaseURL = (import.meta.env.VITE_API_BASE_URL as string) || '/api';
const cleanBaseURL = rawBaseURL.endsWith('/') && rawBaseURL !== '/' ? rawBaseURL.slice(0, -1) : rawBaseURL;

const api = axios.create({
  baseURL: cleanBaseURL,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('scamshield_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiService = {
  // System & Stats
  getHealth: async () => {
    const res = await api.get('/health');
    return res.data;
  },
  getStats: async (): Promise<PublicStats> => {
    const res = await api.get('/stats');
    return res.data;
  },

  // Search
  searchIdentifier: async (type: 'phone' | 'upi', query: string): Promise<SearchResponse> => {
    const res = await api.get('/search', { params: { type, query } });
    return res.data;
  },

  // Reports
  getReports: async (params: {
    page?: number;
    limit?: number;
    category?: string;
    type?: string;
    query?: string;
    sort?: string;
  }): Promise<{ items: PublicReportItem[]; total: number; page: number; limit: number; total_pages: number }> => {
    const res = await api.get('/reports', { params });
    return res.data;
  },
  getReportDetail: async (id: string): Promise<PublicReportItem> => {
    const res = await api.get(`/reports/${id}`);
    return res.data;
  },
  submitReport: async (data: {
    identifier_type: string;
    identifier_value: string;
    scam_category: string;
    description: string;
    incident_date: string;
    amount_inr?: number;
    consent_given: boolean;
  }) => {
    const res = await api.post('/reports', data);
    return res.data;
  },

  // Auth
  login: async (email: string, password: string): Promise<TokenResponse> => {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },
  register: async (email: string, password: string, full_name?: string): Promise<TokenResponse> => {
    const res = await api.post('/auth/register', { email, password, full_name });
    return res.data;
  },
  getMe: async (): Promise<User> => {
    const res = await api.get('/auth/me');
    return res.data;
  },

  // User
  getMyReports: async (): Promise<UserReportItem[]> => {
    const res = await api.get('/users/me/reports');
    return res.data;
  },

  // Admin
  getAdminStats: async (): Promise<AdminStats> => {
    const res = await api.get('/admin/stats');
    return res.data;
  },
  getAdminReports: async (status?: string): Promise<AdminReportItem[]> => {
    const res = await api.get('/admin/reports', { params: { status: status || 'all' } });
    return res.data;
  },
  moderateReport: async (id: string, action: string, reason: string) => {
    const res = await api.post(`/admin/reports/${id}/moderate`, { action, reason });
    return res.data;
  },
  getAuditLogs: async (limit = 50): Promise<AuditLogItem[]> => {
    const res = await api.get('/admin/audit-logs', { params: { limit } });
    return res.data;
  },

  // ML
  getMLStatus: async (): Promise<MLStatusResponse> => {
    const res = await api.get('/ml/status');
    return res.data;
  },
  retrainML: async () => {
    const res = await api.post('/ml/train');
    return res.data;
  }
};
