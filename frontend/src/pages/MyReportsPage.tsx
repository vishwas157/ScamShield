import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Clock, 
  Calendar, 
  AlertTriangle, 
  PlusCircle, 
  ShieldAlert, 
  MessageSquare,
  Lock,
  Copy,
  Check,
  ShieldCheck,
  ChevronRight,
  TrendingDown,
  Info
} from 'lucide-react';
import { apiService } from '../services/api';
import { UserReportItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { RiskBadge } from '../components/RiskBadge';

export const MyReportsPage: React.FC = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [reports, setReports] = useState<UserReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
      return;
    }

    const loadUserReports = async () => {
      try {
        const data = await apiService.getMyReports();
        setReports(data || []);
      } catch (err) {
        console.error('Failed to load user reports:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      loadUserReports();
    }
  }, [isAuthenticated, authLoading, navigate]);

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
          <p className="text-sm font-semibold text-slate-200">Retrieving Personal Dossier...</p>
          <p className="text-xs text-slate-500">Decrypting reports associated with your registered citizen account</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/30 text-[11px] font-semibold text-cyan-400 uppercase tracking-wider">
            <Lock className="w-3 h-3" /> Citizen Incident Ledger
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            My Submitted Fraud Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Monitor real-time moderation lifecycle status, evidence verification progress, and official audit notes for reports you filed.
          </p>
        </div>

        <Link
          to="/report"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20 transition-all self-start sm:self-auto shrink-0"
        >
          <PlusCircle className="w-4 h-4" /> File New Report
        </Link>
      </div>

      {reports.length > 0 ? (
        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report.id || report.reference_id}
              className="p-5 sm:p-6 rounded-2xl bg-[#0a0f1d] border border-slate-800/80 space-y-4 shadow-lg hover:border-slate-700 transition-all relative overflow-hidden"
            >
              {/* Header inside card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/60">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-mono text-base font-extrabold text-white">
                    {report.masked_identifier}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono bg-slate-900 text-slate-300 border border-slate-700/60">
                    {report.identifier_type}
                  </span>
                  <div className="flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    <span className="font-mono text-xs text-cyan-400 font-bold">
                      {report.reference_id}
                    </span>
                    <button
                      onClick={() => copyToClipboard(report.reference_id, report.reference_id)}
                      title="Copy Reference ID"
                      className="text-slate-500 hover:text-slate-300 ml-1"
                    >
                      {copiedId === report.reference_id ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <RiskBadge level={report.status} size="sm" />
                </div>
              </div>

              {/* Main content body */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400">Threat Category:</span>
                  <span className="px-2 py-0.5 rounded bg-blue-950/40 border border-blue-800/50 text-cyan-300 font-semibold text-[11px]">
                    {report.scam_category}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-[11px] font-semibold text-slate-400">Incident Narrative:</div>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/70">
                    {report.description}
                  </p>
                </div>
              </div>

              {/* Moderator notes if available */}
              {report.review_notes && (
                <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-900/50 text-xs text-blue-200 flex items-start gap-2.5">
                  <MessageSquare className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-bold text-cyan-300 block">Moderator Advisory Note:</span>
                    <p className="text-slate-300 leading-relaxed">{report.review_notes}</p>
                  </div>
                </div>
              )}

              {/* Footer metadata */}
              <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/40 gap-3">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-slate-600" />
                    Submitted: {report.created_at ? report.created_at.slice(0, 10) : '—'}
                  </span>
                  <span className="flex items-center gap-1 font-mono">
                    <Calendar className="w-3 h-3 text-slate-600" />
                    Incident: {report.incident_date}
                  </span>
                </div>

                {report.amount_inr ? (
                  <span className="text-rose-400 font-bold font-mono">
                    Claimed Loss: ₹{report.amount_inr.toLocaleString('en-IN')}
                  </span>
                ) : (
                  <span className="text-slate-500 font-mono">No direct financial loss reported</span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center space-y-5 p-8 sm:p-12 rounded-3xl bg-[#0a0f1d] border border-slate-800/80">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-cyan-400 mx-auto">
            <FileText className="w-8 h-8" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-white">
              No Incident Reports Filed Yet
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              When you submit an incident concerning a suspicious phone number or UPI VPA, it will appear here with live moderation tracking.
            </p>
          </div>
          <Link
            to="/report"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-500/20 transition-all"
          >
            <PlusCircle className="w-4 h-4" /> File Your First Report
          </Link>
        </div>
      )}
    </div>
  );
};
