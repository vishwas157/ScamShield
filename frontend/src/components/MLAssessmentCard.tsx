import React from 'react';
import { Cpu, Info, CheckCircle2, AlertTriangle, ShieldAlert, Layers } from 'lucide-react';
import { MLRiskBreakdown } from '../types';

interface MLAssessmentCardProps {
  mlAssessment?: MLRiskBreakdown;
}

export const MLAssessmentCard: React.FC<MLAssessmentCardProps> = ({ mlAssessment }) => {
  if (!mlAssessment) {
    return null;
  }

  const isSufficient = mlAssessment.data_sufficiency === 'SUFFICIENT';
  const prob = mlAssessment.fraud_probability !== null ? Math.round(mlAssessment.fraud_probability * 100) : null;

  return (
    <div className="rounded-2xl bg-[#091120] border border-slate-800 p-5 sm:p-6 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
              <span>Random Forest ML Risk Inference</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-750">
                {mlAssessment.model_version}
              </span>
            </h4>
            <p className="text-[10px] text-slate-400">
              Scikit-learn RandomForestClassifier evaluating behavioral fraud vectors
            </p>
          </div>
        </div>

        <div>
          {isSufficient ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <CheckCircle2 className="w-3 h-3" />
              Sufficient Historical Data
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <Info className="w-3 h-3" />
              Insufficient Community Data
            </span>
          )}
        </div>
      </div>

      {/* Main Body */}
      {isSufficient ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Probability Metric */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-850 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Model Fraud Probability</span>
                <span className="font-mono font-bold text-white text-sm">{prob}%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                <div
                  className={`h-full transition-all duration-700 ${
                    prob && prob > 70
                      ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                      : prob && prob > 40
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${prob || 0}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>0% Low</span>
                <span>50% Threshold</span>
                <span>100% Severe</span>
              </div>
            </div>

            {/* Classification */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-850 flex flex-col justify-between">
              <div className="text-xs text-slate-400">Model Predicted Classification</div>
              <div className="flex items-center gap-2 mt-1">
                {mlAssessment.predicted_risk_level === 'HIGH_RISK' ? (
                  <ShieldAlert className="w-4.5 h-4.5 text-rose-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4.5 h-4.5 text-amber-400 shrink-0" />
                )}
                <span className="text-sm sm:text-base font-extrabold text-white tracking-wide">
                  {mlAssessment.predicted_risk_level.replace('_', ' ')}
                </span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                Distinguished from final community evidence label
              </div>
            </div>
          </div>

          {/* Explanation */}
          <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-900/30 text-xs text-blue-200 leading-relaxed flex items-start gap-2.5">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>{mlAssessment.explanation}</span>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-850 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-slate-200 font-semibold">
            <Info className="w-4 h-4 text-blue-400" />
            <span>Ethical Academic Machine Learning Handling</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            {mlAssessment.explanation}
          </p>
          <div className="pt-1.5 text-[10px] text-slate-500 italic">
            * Note: To prevent hallucinated risk assessments, our Random Forest classifier strictly requires confirmed historical victim velocity signals before computing a classification probability.
          </div>
        </div>
      )}
    </div>
  );
};
