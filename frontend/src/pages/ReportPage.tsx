import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  AlertTriangle, 
  ShieldCheck, 
  Phone, 
  CreditCard, 
  CheckCircle2, 
  Info,
  ShieldAlert,
  Lock,
  ArrowRight
} from 'lucide-react';
import { apiService } from '../services/api';

const scamCategories = [
  'UPI Payment Fraud',
  'Phishing',
  'Fake Customer Care',
  'OTP Scam',
  'Impersonation',
  'Investment Scam',
  'Job Scam',
  'Shopping Scam',
  'Loan Scam',
  'Other'
] as const;

const reportSchema = z.object({
  identifier_type: z.enum(['phone', 'upi']),
  identifier_value: z.string().min(3, 'Identifier is required').refine((val) => {
    const cleaned = val.replace(/[\s\-\(\)\+]/g, '');
    if (cleaned.length >= 10 && /^[6-9]\d{9}$/.test(cleaned.slice(-10))) return true;
    if (val.includes('@') && /^[a-zA-Z0-9.\-_]{2,64}@[a-zA-Z0-9]{2,32}$/.test(val.trim())) return true;
    return false;
  }, 'Must be a valid 10-digit Indian phone number or valid UPI address (name@bank)'),
  scam_category: z.enum(scamCategories, {
    errorMap: () => ({ message: 'Please select a valid scam category' })
  }),
  incident_date: z.string().min(1, 'Incident date is required').refine((val) => {
    const d = new Date(val);
    const today = new Date();
    return d <= today;
  }, 'Incident date cannot be in the future'),
  amount_inr: z.preprocess((val) => {
    if (val === '' || val === undefined || val === null) return undefined;
    const num = Number(val);
    return isNaN(num) ? undefined : num;
  }, z.number().min(0, 'Amount cannot be negative').optional()),
  description: z.string()
    .min(20, 'Please provide at least 20 characters explaining how the scam took place.')
    .max(2000, 'Description cannot exceed 2000 characters.'),
  consent_given: z.boolean().refine((val) => val === true, {
    message: 'You must confirm that this report is accurate and in good faith.'
  })
});

type ReportFormValues = z.infer<typeof reportSchema>;

export const ReportPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialType = (searchParams.get('type') as 'phone' | 'upi') || 'phone';
  const initialValue = searchParams.get('value') || '';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [submissionResult, setSubmissionResult] = useState<{
    reference_id: string;
    masked_identifier: string;
    status: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<any>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      identifier_type: initialType,
      identifier_value: initialValue,
      scam_category: 'UPI Payment Fraud',
      incident_date: new Date().toISOString().slice(0, 10),
      amount_inr: undefined,
      description: '',
      consent_given: false
    }
  });

  const selectedType = watch('identifier_type');

  const onSubmit = async (values: ReportFormValues) => {
    setIsSubmitting(true);
    setApiError(null);

    try {
      const response = await apiService.submitReport({
        identifier_type: values.identifier_type,
        identifier_value: values.identifier_value,
        scam_category: values.scam_category,
        description: values.description,
        incident_date: values.incident_date,
        amount_inr: values.amount_inr,
        consent_given: values.consent_given
      });

      setSubmissionResult({
        reference_id: response.reference_id,
        masked_identifier: response.masked_identifier,
        status: response.status
      });
    } catch (err: any) {
      console.error('Submission failed:', err);
      const detail = err.response?.data?.detail || 'Failed to submit report. Please try again.';
      setApiError(detail);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submissionResult) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Report Registered for Moderation
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
            Your incident has been securely recorded and queued for administrative review.
          </p>
        </div>

        {/* Reference Dossier */}
        <div className="p-6 rounded-2xl bg-[#091120] border border-slate-800 text-left space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-[11px] uppercase text-slate-400 font-bold">Tracking Reference</span>
            <span className="font-mono text-xs sm:text-sm font-bold text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-lg border border-cyan-800/80">
              {submissionResult.reference_id}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="text-slate-400">Masked Identifier:</span>
            <span className="font-mono font-bold text-white">{submissionResult.masked_identifier}</span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="text-slate-400">Moderation State:</span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 border border-amber-500/30 text-amber-400">
              Pending Review
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-900/30 text-xs text-blue-200 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-cyan-300">
              <Info className="w-3.5 h-3.5" /> What happens next?
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              A moderator will review your submission against fraud patterns and corroborate the details. Once approved, the record is published to the public database to protect other users.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setSubmissionResult(null)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-colors"
          >
            File Another Report
          </button>
          <button
            onClick={() => navigate('/database')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 transition-all"
          >
            Explore Public Database
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-400">
          <AlertTriangle className="w-3.5 h-3.5" /> Community Incident Submission
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Report a Scam Mobile Number or UPI ID
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
          Help protect others from digital fraud. Every report undergoes administrative verification before inclusion in our public intelligence database.
        </p>
      </div>

      {/* Safety Notice Warning */}
      <div className="p-4 rounded-2xl bg-amber-950/25 border border-amber-800/40 flex items-start gap-3">
        <ShieldAlert className="w-4.5 h-4.5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-200 space-y-0.5">
          <div className="font-bold text-amber-300">Critical Privacy & Security Policy</div>
          <p className="leading-relaxed text-[11px] text-amber-200/90">
            Do <strong>NOT</strong> enter your bank account passwords, UPI PINs, OTPs, or debit card CVVs. ScamShield will never ask for confidential security credentials.
          </p>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8 rounded-3xl bg-[#091120] border border-slate-800 shadow-2xl space-y-6">
        {/* Step 1: Identifier Type */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span>1. Identifier Type</span>
            <span className="text-[10px] text-slate-500 lowercase">Select format</span>
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setValue('identifier_type', 'phone')}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold border transition-all ${
                selectedType === 'phone'
                  ? 'bg-blue-600/20 border-blue-500 text-cyan-300 shadow-inner'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Mobile (+91)</span>
            </button>
            <button
              type="button"
              onClick={() => setValue('identifier_type', 'upi')}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold border transition-all ${
                selectedType === 'upi'
                  ? 'bg-blue-600/20 border-blue-500 text-cyan-300 shadow-inner'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>UPI ID (@handle)</span>
            </button>
          </div>
        </div>

        {/* Identifier Value */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300">
            {selectedType === 'phone' ? 'Phone Number to Report' : 'UPI Address to Report'}
          </label>
          <input
            type="text"
            {...register('identifier_value')}
            placeholder={
              selectedType === 'phone'
                ? 'e.g. 9876543210 or +91 9876543210'
                : 'e.g. refund.dept@okhdfcbank or merchant@paytm'
            }
            className="w-full px-4 py-2.5 sm:py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors font-mono"
          />
          {errors.identifier_value && (
            <p className="text-xs text-rose-400">{String(errors.identifier_value.message)}</p>
          )}
        </div>

        {/* Category & Date Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Scam Category</label>
            <select
              {...register('scam_category')}
              className="w-full px-3.5 py-2.5 sm:py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
            >
              {scamCategories.map((c) => (
                <option key={c} value={c} className="bg-slate-900 text-white">
                  {c}
                </option>
              ))}
            </select>
            {errors.scam_category && (
              <p className="text-xs text-rose-400">{String(errors.scam_category.message)}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Incident Date</label>
            <input
              type="date"
              {...register('incident_date')}
              max={new Date().toISOString().slice(0, 10)}
              className="w-full px-3.5 py-2.5 sm:py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
            />
            {errors.incident_date && (
              <p className="text-xs text-rose-400">{String(errors.incident_date.message)}</p>
            )}
          </div>
        </div>

        {/* Amount involved in INR */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label className="font-bold text-slate-300">
              Amount Involved (INR) <span className="text-slate-500 font-normal">(Optional)</span>
            </label>
            <span className="text-slate-500 text-[11px]">Leave empty if no financial loss occurred</span>
          </div>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xs">₹</span>
            <input
              type="number"
              step="any"
              {...register('amount_inr')}
              placeholder="e.g. 5000"
              className="w-full pl-8 pr-4 py-2.5 sm:py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors font-mono"
            />
          </div>
          {errors.amount_inr && (
            <p className="text-xs text-rose-400">{String(errors.amount_inr.message)}</p>
          )}
        </div>

        {/* Modus Operandi Narrative */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label className="font-bold text-slate-300">Incident Narrative / Modus Operandi</label>
            <span className="text-slate-500 text-[11px]">Minimum 20 characters</span>
          </div>
          <textarea
            rows={4}
            {...register('description')}
            placeholder="Describe what occurred. E.g.: 'Received a call claiming my electricity bill was pending. Caller sent a link to download an APK file and asked for a ₹10 recharge to verify...'"
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors leading-relaxed"
          />
          {errors.description && (
            <p className="text-xs text-rose-400">{String(errors.description.message)}</p>
          )}
        </div>

        {/* Good faith consent */}
        <div className="pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              {...register('consent_given')}
              className="mt-0.5 w-4 h-4 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
            />
            <span className="text-xs text-slate-300 leading-relaxed group-hover:text-white transition-colors">
              I certify under good-faith community disclosure that this report describes a real fraudulent incident or unsolicited scam attempt, and does not constitute harassment or personal dispute.
            </span>
          </label>
          {errors.consent_given && (
            <p className="text-xs text-rose-400 mt-1">{String(errors.consent_given.message)}</p>
          )}
        </div>

        {apiError && (
          <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300">
            {apiError}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2 border border-blue-400/20"
        >
          {isSubmitting ? (
            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <ShieldCheck className="w-4 h-4" />
          )}
          <span>Submit Report for Moderator Verification</span>
        </button>
      </form>
    </div>
  );
};
