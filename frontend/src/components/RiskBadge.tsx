import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Clock 
} from 'lucide-react';

interface RiskBadgeProps {
  level: string;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'md', showDot = true }) => {
  const norm = level.toUpperCase().replace(/\s+/g, '_');

  const config: Record<string, { label: string; bg: string; dot: string; icon: any }> = {
    NO_REPORTS: {
      label: 'No Reports Found',
      bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
      dot: 'bg-emerald-400',
      icon: ShieldCheck,
    },
    LOW_RISK: {
      label: 'Low Risk',
      bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
      dot: 'bg-emerald-400',
      icon: ShieldCheck,
    },
    MEDIUM_RISK: {
      label: 'Medium Risk',
      bg: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
      dot: 'bg-amber-400',
      icon: AlertTriangle,
    },
    HIGH_RISK: {
      label: 'High Risk',
      bg: 'bg-rose-500/15 border-rose-500/30 text-rose-400',
      dot: 'bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.6)]',
      icon: AlertOctagon,
    },
    INSUFFICIENT_DATA: {
      label: 'Insufficient Data',
      bg: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
      dot: 'bg-blue-400',
      icon: HelpCircle,
    },
    APPROVED: {
      label: 'Verified & Approved',
      bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
      dot: 'bg-emerald-400',
      icon: CheckCircle2,
    },
    PENDING: {
      label: 'Pending Moderation',
      bg: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
      dot: 'bg-amber-400 animate-pulse',
      icon: Clock,
    },
    REJECTED: {
      label: 'Rejected',
      bg: 'bg-rose-500/15 border-rose-500/30 text-rose-400',
      dot: 'bg-rose-400',
      icon: XCircle,
    },
    DUPLICATE: {
      label: 'Duplicate',
      bg: 'bg-slate-500/15 border-slate-500/30 text-slate-400',
      dot: 'bg-slate-400',
      icon: HelpCircle,
    },
  };

  const current = config[norm] || {
    label: level,
    bg: 'bg-slate-800/80 border-slate-700 text-slate-300',
    dot: 'bg-slate-400',
    icon: HelpCircle,
  };

  const Icon = current.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[11px] font-medium gap-1.5',
    md: 'px-2.5 py-1 text-xs font-semibold gap-2',
    lg: 'px-3.5 py-1.5 text-xs font-bold gap-2',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-sm backdrop-blur-sm transition-all ${current.bg} ${sizeClasses}`}
    >
      {showDot ? (
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${current.dot}`} />
      ) : (
        <Icon className={size === 'lg' ? 'w-3.5 h-3.5' : 'w-3 h-3'} />
      )}
      <span>{current.label}</span>
    </span>
  );
};
