import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Copy, 
  Eye, 
  ShieldAlert, 
  History, 
  Cpu, 
  Lock, 
  MessageSquare,
  Search,
  Check,
  TrendingUp,
  FileCheck2,
  AlertOctagon,
  ArrowUpRight,
  ShieldCheck,
  Layers,
  Database
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { apiService } from '../services/api';
import { AdminStats, AdminReportItem, AuditLogItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { RiskBadge } from '../components/RiskBadge';

const DONUT_COLORS = ['#38bdf8', '#3b82f6', '#818cf8', '#a855f7', '#f59e0b', '#10b981'];

export const AdminDashboardPage: React.FC = () => {
  const { isAdmin, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [reports, setReports] = useState<AdminReportItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [viewingReport, setViewingReport] = useState<AdminReportItem | null>(null);
  const [moderationTarget, setModerationTarget] = useState<{
    report: AdminReportItem;
    action: 'approve' | 'reject' | 'duplicate';
  } | null>(null);
  const [moderationReason, setModerationReason] = useState('');
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsData, reportsData, logsData] = await Promise.all([
        apiService.getAdminStats(),
        apiService.getAdminReports(statusFilter),
        apiService.getAuditLogs(30)
      ]);
      setStats(statsData);
      setReports(reportsData || []);
      setAuditLogs(logsData || []);
    } catch (err) {
      console.error('Failed to load admin dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated || !isAdmin) {
        navigate('/login');
        return;
      }
      loadAdminData();
    }
  }, [isAuthenticated, isAdmin, authLoading, statusFilter]);

  const handleModerationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moderationTarget || !moderationReason.trim()) return;

    setIsSubmittingAction(true);
    try {
      await apiService.moderateReport(
        moderationTarget.report.id,
        moderationTarget.action,
        moderationReason.trim()
      );
      setModerationTarget(null);
      setModerationReason('');
      loadAdminData();
    } catch (err: any) {
      console.error('Moderation action failed:', err);
      alert(err.response?.data?.detail || 'Moderation action failed');
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20" />
          <div className="absolute inset-0 rounded-full border-2 border-t-cyan-400 animate-spin" />
          <div className="absolute inset-3 rounded-full bg-cyan-400/10 flex items-center justify-center">
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
          </div>
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-semibold text-slate-200">Authenticating Security Clearance...</p>
          <p className="text-xs text-slate-500">Loading moderation queue, audit logs, and analytics telemetry</p>
        </div>
      </div>
    );
  }

  // Filter reports by search term
  const filteredReports = reports.filter((r) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      r.reference_id?.toLowerCase().includes(term) ||
      r.masked_identifier?.toLowerCase().includes(term) ||
      r.scam_category?.toLowerCase().includes(term) ||
      r.identifier_type?.toLowerCase().includes(term)
    );
  });

  // Prepare Recharts data
  const categoryChartData = stats?.categories_distribution
    ? Object.entries(stats.categories_distribution).map(([name, count]) => ({
        name: name.length > 13 ? name.slice(0, 13) + '…' : name,
        full: name,
        count
      }))
    : [];

  const typeChartData = [
    { name: 'Phone', value: stats?.type_distribution?.phone || 0 },
    { name: 'UPI ID', value: stats?.type_distribution?.upi || 0 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-[11px] font-bold text-amber-400 uppercase tracking-wider">
              <Lock className="w-3 h-3 text-amber-400" /> Moderator Clearance Active
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-[11px] font-mono text-cyan-400">
              <Database className="w-3 h-3" /> MongoDB Connected
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Administrative Moderation Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Review community incident submissions, cross-examine evidence, commit immutable audit trails, and inspect Random Forest ML weights.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/ml"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 transition-all shadow-sm"
          >
            <Cpu className="w-4 h-4 text-cyan-400" />
            Inspect ML Pipeline
          </Link>
          <button
            onClick={loadAdminData}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-all"
          >
            Refresh Queue
          </button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        {/* Total Reports */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0a0f1d] border border-slate-800/80 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Submissions</div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-2 font-mono">
            {stats?.total_reports ?? 0}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <Layers className="w-3 h-3 text-slate-400" /> All lifecycle states
          </div>
        </div>

        {/* Pending Review */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0a0f1d] border border-amber-500/20 relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">Pending Review</div>
          <div className="text-2xl sm:text-3xl font-black text-amber-300 mt-2 font-mono">
            {stats?.pending_reports ?? 0}
          </div>
          <div className="text-[11px] text-amber-500/80 mt-1 flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-400" /> Action required
          </div>
        </div>

        {/* Approved Live */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0a0f1d] border border-emerald-500/20 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Approved Live</div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-300 mt-2 font-mono">
            {stats?.approved_reports ?? 0}
          </div>
          <div className="text-[11px] text-emerald-500/80 mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" /> Live in public registry
          </div>
        </div>

        {/* Rejected */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0a0f1d] border border-rose-500/20 relative overflow-hidden group hover:border-rose-500/40 transition-all">
          <div className="absolute top-0 right-0 w-20 h-20 bg-rose-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider">Rejected</div>
          <div className="text-2xl sm:text-3xl font-black text-rose-300 mt-2 font-mono">
            {stats?.rejected_reports ?? 0}
          </div>
          <div className="text-[11px] text-rose-500/80 mt-1 flex items-center gap-1">
            <XCircle className="w-3 h-3 text-rose-400" /> Insufficient evidence
          </div>
        </div>

        {/* Reported Losses */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0a0f1d] border border-cyan-500/20 relative overflow-hidden col-span-2 md:col-span-1 group hover:border-cyan-500/40 transition-all">
          <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider">Reported Losses</div>
          <div className="text-2xl sm:text-3xl font-black text-cyan-300 mt-2 font-mono truncate">
            ₹{stats?.total_amount_reported ? stats.total_amount_reported.toLocaleString('en-IN') : '0'}
          </div>
          <div className="text-[11px] text-cyan-500/80 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-cyan-400" /> Community claims
          </div>
        </div>
      </div>

      {/* Analytics Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Bar Chart */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-[#0a0f1d] border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                Reports Distributed by Fraud Category
              </h3>
              <p className="text-xs text-slate-500">Live breakdown across community allegations</p>
            </div>
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-500/20 px-2.5 py-1 rounded-md">
              Recharts Engine
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData} margin={{ top: 10, right: 10, left: -20, bottom: 24 }}>
                <XAxis 
                  dataKey="name" 
                  stroke="#475569" 
                  fontSize={11} 
                  angle={-18} 
                  textAnchor="end" 
                  interval={0}
                />
                <YAxis stroke="#475569" fontSize={11} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0c1222', 
                    borderColor: '#1e293b', 
                    borderRadius: '10px', 
                    fontSize: '12px',
                    color: '#f8fafc',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)'
                  }}
                  formatter={(value: any) => [`${value} incidents`, 'Reports']}
                />
                <Bar dataKey="count" fill="#38bdf8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Type Distribution Donut Chart */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#0a0f1d] border border-slate-800/80 space-y-4 flex flex-col justify-between">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-400" />
              Identifier Distribution
            </h3>
            <p className="text-xs text-slate-500">Mobile numbers vs UPI VPAs</p>
          </div>

          <div className="h-44 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={72}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {typeChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} stroke="#060913" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0c1222', 
                    borderColor: '#1e293b', 
                    borderRadius: '10px', 
                    fontSize: '12px',
                    color: '#f8fafc'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/60 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400">Phone Numbers</div>
                <div className="font-mono font-bold text-white">{stats?.type_distribution?.phone || 0}</div>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400">UPI Handles</div>
                <div className="font-mono font-bold text-white">{stats?.type_distribution?.upi || 0}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Moderation Queue Section */}
      <div className="rounded-2xl bg-[#0a0f1d] border border-slate-800/80 overflow-hidden shadow-xl space-y-0">
        {/* Table Filter & Search Controls */}
        <div className="p-5 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-cyan-400" />
              Community Report Moderation Queue
            </h3>
            <p className="text-xs text-slate-400">
              Cross-examine allegations, verify evidence integrity, and approve or dismiss entries
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search filter */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter Ref ID / Identifier..."
                className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-full sm:w-48"
              />
            </div>

            {/* Status pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              {['all', 'pending', 'approved', 'rejected', 'duplicate'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                    statusFilter === st
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800/80'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#060913]/90 text-slate-400 uppercase font-semibold text-[11px] border-b border-slate-800/80 tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Ref ID</th>
                <th className="px-5 py-3.5">Target Identifier</th>
                <th className="px-5 py-3.5">Scam Category</th>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5">Reported Loss</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Moderator Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredReports.length > 0 ? (
                filteredReports.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-850/40 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-cyan-400">
                      <div className="flex items-center gap-1.5">
                        <span>{r.reference_id}</span>
                        <button
                          onClick={() => copyToClipboard(r.reference_id, r.id)}
                          title="Copy reference ID"
                          className="text-slate-500 hover:text-slate-300"
                        >
                          {copiedId === r.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-mono text-white font-semibold">{r.masked_identifier}</div>
                      <span className="inline-block text-[10px] text-slate-400 uppercase font-mono">
                        {r.identifier_type}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-300 font-medium">
                      {r.scam_category}
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 font-mono text-[11px]">
                      {r.created_at ? r.created_at.slice(0, 10) : '—'}
                    </td>
                    <td className="px-5 py-3.5">
                      {r.amount_inr ? (
                        <span className="text-rose-400 font-bold font-mono">
                          ₹{r.amount_inr.toLocaleString('en-IN')}
                        </span>
                      ) : (
                        <span className="text-slate-500 font-mono">₹0</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <RiskBadge level={r.status} size="sm" />
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingReport(r)}
                          title="View Full Incident Dossier"
                          className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 font-semibold text-[11px] inline-flex items-center gap-1 transition-all"
                        >
                          <Eye className="w-3 h-3" /> Inspect
                        </button>

                        {r.status === 'pending' && (
                          <>
                            <button
                              onClick={() => {
                                setModerationTarget({ report: r, action: 'approve' });
                                setModerationReason('Verified against corroborating community evidence and legitimate transaction trail.');
                              }}
                              title="Approve Report into Public Database"
                              className="px-2.5 py-1 rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30 font-semibold text-[11px] inline-flex items-center gap-1 transition-all"
                            >
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Approve
                            </button>
                            <button
                              onClick={() => {
                                setModerationTarget({ report: r, action: 'reject' });
                                setModerationReason('Insufficient corroborating evidence or unrelated civil dispute.');
                              }}
                              title="Dismiss / Reject Report"
                              className="px-2.5 py-1 rounded-lg bg-rose-600/20 text-rose-300 border border-rose-500/30 hover:bg-rose-600/30 font-semibold text-[11px] inline-flex items-center gap-1 transition-all"
                            >
                              <XCircle className="w-3 h-3 text-rose-400" /> Reject
                            </button>
                          </>
                        )}

                        <button
                          onClick={() => {
                            setModerationTarget({ report: r, action: 'duplicate' });
                            setModerationReason('Duplicate submission of an existing community incident.');
                          }}
                          title="Mark Duplicate"
                          className="p-1 rounded-lg bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-700 border border-slate-800 transition-all"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-500 text-xs">
                    No incident records matching the selected status or query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Immutable Audit Trail Log */}
      <div className="rounded-2xl bg-[#0a0f1d] border border-slate-800/80 p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Immutable Moderation Audit Log</h3>
          </div>
          <span className="text-xs font-mono text-slate-500">
            Backed by MongoDB `audit_logs` collection
          </span>
        </div>

        <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
          {auditLogs.length > 0 ? (
            auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs hover:border-slate-700 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-white">{log.actor_email}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      log.action === 'approve'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : log.action === 'reject'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : 'bg-blue-500/10 text-cyan-300 border border-blue-500/20'
                    }`}>
                      {log.action}
                    </span>
                    <span className="font-mono text-cyan-400">{log.resource_id}</span>
                  </div>
                  <p className="text-slate-400 italic">"{log.reason}"</p>
                </div>
                <div className="text-[11px] text-slate-500 font-mono whitespace-nowrap">
                  {log.timestamp ? log.timestamp.replace('T', ' ').slice(0, 19) : ''}
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-500 py-4 text-center">
              No moderation audit entries recorded yet. Decisions will be captured here in real-time.
            </p>
          )}
        </div>
      </div>

      {/* Modal: View Incident Dossier */}
      {viewingReport && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-xl w-full rounded-2xl bg-[#0c1222] border border-slate-700/80 p-6 space-y-5 shadow-2xl animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400">
                  Incident Evidence Dossier
                </span>
                <h3 className="text-lg font-bold text-white font-mono">{viewingReport.reference_id}</h3>
              </div>
              <button
                onClick={() => setViewingReport(null)}
                className="text-slate-400 hover:text-white text-sm p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                <div>
                  <span className="text-slate-500 block text-[11px]">Reported Identifier:</span>
                  <span className="font-mono font-bold text-white text-sm">{viewingReport.masked_identifier}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Fraud Category:</span>
                  <span className="font-bold text-cyan-300">{viewingReport.scam_category}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Incident Date:</span>
                  <span className="font-semibold text-white">{viewingReport.incident_date}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Reported Financial Loss:</span>
                  <span className="font-bold text-rose-400 font-mono">
                    {viewingReport.amount_inr ? `₹${viewingReport.amount_inr.toLocaleString('en-IN')}` : 'None reported'}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-slate-400 font-semibold block">Citizen Narrative / Evidence Statement:</span>
                <p className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 leading-relaxed max-h-48 overflow-y-auto">
                  {viewingReport.description}
                </p>
              </div>

              <div className="pt-2 text-[11px] text-slate-500 font-mono space-y-1 border-t border-slate-800/60">
                <div>Reporter UID: {viewingReport.reporter_id}</div>
                <div>Timestamp: {viewingReport.created_at}</div>
                {viewingReport.reviewed_by && (
                  <div className="text-cyan-400">
                    Reviewed By: {viewingReport.reviewed_by} on {viewingReport.reviewed_at}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setViewingReport(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Moderation Confirmation */}
      {moderationTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleModerationSubmit}
            className="max-w-md w-full rounded-2xl bg-[#0c1222] border border-slate-700/80 p-6 space-y-5 shadow-2xl animate-in fade-in duration-150"
          >
            <div className="space-y-1">
              <span className="text-xs uppercase font-bold tracking-wider text-amber-400">
                Moderator Action Confirmation
              </span>
              <h3 className="text-lg font-bold text-white capitalize">
                Confirm {moderationTarget.action} Decision
              </h3>
              <p className="text-xs text-slate-400">
                Target: <strong className="font-mono text-cyan-400">{moderationTarget.report.reference_id}</strong> ({moderationTarget.report.masked_identifier})
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Audit Trail Justification (Committed to MongoDB)
              </label>
              <textarea
                required
                rows={3}
                value={moderationReason}
                onChange={(e) => setModerationReason(e.target.value)}
                placeholder="Enter regulatory / verification justification for this action..."
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setModerationTarget(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmittingAction || !moderationReason.trim()}
                className={`px-5 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-md ${
                  moderationTarget.action === 'approve'
                    ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20'
                    : moderationTarget.action === 'reject'
                    ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/20'
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                {isSubmittingAction ? 'Committing...' : `Commit ${moderationTarget.action}`}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
