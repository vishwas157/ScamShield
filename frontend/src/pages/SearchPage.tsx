import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  ShieldCheck, 
  FileText, 
  Calendar, 
  HelpCircle, 
  ArrowRight, 
  Phone,
  CreditCard,
  AlertOctagon,
  Info,
  Shield,
  Layers
} from 'lucide-react';
import { apiService } from '../services/api';
import { SearchResponse } from '../types';
import { RiskBadge } from '../components/RiskBadge';
import { MLAssessmentCard } from '../components/MLAssessmentCard';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialType = (searchParams.get('type') as 'phone' | 'upi') || 'phone';
  const initialQuery = searchParams.get('query') || '';

  const [type, setType] = useState<'phone' | 'upi'>(initialType);
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SearchResponse | null>(null);

  const executeSearch = async (targetType: 'phone' | 'upi', targetQuery: string) => {
    if (!targetQuery.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const data = await apiService.searchIdentifier(targetType, targetQuery.trim());
      setResult(data);
      setSearchParams({ type: targetType, query: targetQuery.trim() });
    } catch (err: any) {
      console.error('Search error:', err);
      const detail = err.response?.data?.detail || 'Failed to search identifier. Please check input format.';
      setError(detail);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery.trim()) {
      executeSearch(initialType, initialQuery);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(type, query);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-cyan-400">
          <Shield className="w-3.5 h-3.5" /> Threat Verification Terminal
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Verify Phone Number or UPI ID
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
          Query the community intelligence database before transferring funds, scanning payment QR codes, or sharing sensitive OTPs.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#091120] border border-slate-800 shadow-xl space-y-4">
        {/* Type toggle */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950/80 border border-slate-850 w-full sm:w-fit">
          <button
            type="button"
            onClick={() => setType('phone')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
              type === 'phone'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Phone className="w-3 h-3" />
            <span>Mobile (+91)</span>
          </button>
          <button
            type="button"
            onClick={() => setType('upi')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
              type === 'upi'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CreditCard className="w-3 h-3" />
            <span>UPI ID (@handle)</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2.5">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                type === 'phone'
                  ? 'Enter 10-digit number (e.g., 9876543210 or +91 9876543210)'
                  : 'Enter UPI address (e.g., refund.support@okhdfcbank)'
              }
              className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="w-full sm:w-auto px-6 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-md shadow-blue-600/30 whitespace-nowrap disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            <span>Run Verification</span>
          </button>
        </form>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex items-start gap-2">
            <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Investigation Dossier Display */}
      {result && (
        <div className="space-y-6">
          {/* Main Risk Overview Banner */}
          <div
            className={`p-5 sm:p-6 rounded-2xl border shadow-xl relative overflow-hidden ${
              result.risk_level === 'HIGH_RISK'
                ? 'bg-rose-950/25 border-rose-800/50'
                : result.risk_level === 'MEDIUM_RISK'
                ? 'bg-amber-950/25 border-amber-800/50'
                : result.risk_level === 'LOW_RISK'
                ? 'bg-emerald-950/20 border-emerald-800/40'
                : 'bg-slate-900/90 border-slate-800'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                  Intelligence Query Result
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xl sm:text-2xl font-black text-white">
                    {result.masked_identifier}
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-900 text-slate-300 uppercase border border-slate-750 font-mono">
                    {result.identifier_type}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <RiskBadge level={result.risk_level} size="lg" />
              </div>
            </div>

            {/* Assessment Details */}
            <div className="pt-4 space-y-3.5">
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-850 space-y-2">
                <div className="text-xs font-bold text-slate-200 flex items-center gap-2">
                  <Info className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Evidence Assessment Rationale</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {result.risk_explanation}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3 text-[11px] text-slate-400 border-t border-slate-850/80 mt-2">
                  <span>
                    Verified Reports: <strong className="text-white font-mono">{result.approved_reports_count}</strong>
                  </span>
                  {result.latest_report_date && (
                    <span>
                      Latest Incident: <strong className="text-white font-mono">{result.latest_report_date.slice(0, 10)}</strong>
                    </span>
                  )}
                  {result.categories.length > 0 && (
                    <span>
                      Categories: <strong className="text-cyan-300">{result.categories.join(', ')}</strong>
                    </span>
                  )}
                </div>
              </div>

              {/* Legal Disclaimer */}
              <div className="text-xs text-slate-400 italic bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 flex items-start gap-2">
                <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{result.trust_disclaimer}</span>
              </div>
            </div>
          </div>

          {/* Random Forest Machine Learning Card */}
          <MLAssessmentCard mlAssessment={result.ml_assessment} />

          {/* Verified Community Evidence History */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Corroborating Community Reports ({result.reports.length})</span>
              </h3>
              <Link
                to={`/report?type=${result.identifier_type}&value=${encodeURIComponent(query)}`}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 inline-flex items-center gap-1 hover:underline"
              >
                <span>Report with new evidence</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {result.reports.length > 0 ? (
              <div className="space-y-3">
                {result.reports.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#091120] border border-slate-800 space-y-2 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-cyan-400 font-bold text-[11px]">
                        {item.reference_id}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 text-cyan-300 font-semibold border border-blue-500/20 text-[10px]">
                        {item.scam_category}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      "{item.description_snippet}"
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-850">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" /> Incident Date: {item.incident_date}
                      </span>
                      {item.amount_inr && item.amount_inr > 0 ? (
                        <span className="text-rose-400 font-bold">
                          ₹{item.amount_inr.toLocaleString('en-IN')} Loss
                        </span>
                      ) : (
                        <span className="text-slate-500">Unsuccessful attempt</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-[#091120]/60 border border-slate-800 text-center space-y-3">
                <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto" />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">
                    No verified reports found in database
                  </h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    "No reports found. This does not guarantee that the number or UPI ID is safe." Newly established fraud entities may not yet have community records.
                  </p>
                </div>
                <div className="pt-2">
                  <Link
                    to={`/report?type=${type}&value=${encodeURIComponent(query)}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 transition-all"
                  >
                    <span>Were you scammed by this number? File a report</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
