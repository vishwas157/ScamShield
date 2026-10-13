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

/**
 * Resolves and normalizes the production API base URL:
 * - When VITE_API_BASE_URL is 'https://scamshield-api-7z20.onrender.com', resolves to 'https://scamshield-api-7z20.onrender.com/api'.
 * - When VITE_API_BASE_URL is 'https://scamshield-api-7z20.onrender.com/api', preserves it without duplicating '/api'.
 * - When VITE_API_BASE_URL is unset, empty, or '/api', resolves to '/api' for local Vite dev server proxy.
 */
export function getApiBaseUrl(): string {
  const envUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim();

  // If not provided or empty, fallback cleanly to relative '/api'
  if (!envUrl) {
    return '/api';
  }

  // Strip trailing slashes
  let trimmed = envUrl.replace(/\/+$/, '');

  // Handle root slash
  if (trimmed === '' || trimmed === '/') {
    return '/api';
  }

  // Absolute URL (production cross-origin deployment, e.g. Render)
  if (/^https?:\/\//i.test(trimmed)) {
    // If it already ends with /api (case-insensitive), preserve it
    if (trimmed.toLowerCase().endsWith('/api')) {
      return trimmed;
    }
    // Append /api so all apiService paths (e.g. /auth/register) route to FastAPI's mounted /api router
    return `${trimmed}/api`;
  }

  // Relative path (e.g. '/api' or 'api')
  if (trimmed === '/api' || trimmed.toLowerCase().endsWith('/api')) {
    return trimmed;
  }

  return trimmed.startsWith('/') ? `${trimmed}/api` : `/${trimmed}/api`;
}

export const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
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
