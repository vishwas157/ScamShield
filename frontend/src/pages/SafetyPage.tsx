import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Lock, 
  Smartphone, 
  CreditCard, 
  ExternalLink, 
  PhoneCall, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  TrendingUp, 
  Eye, 
  Search,
  Shield,
  HelpCircle,
  FileText,
  AlertOctagon
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface ArticleItem {
  id: string;
  category: string;
  title: string;
  icon: any;
  summary: string;
  howItWorks: string;
  warningSigns: string[];
  preventionSteps: string[];
  recommendedActions: string[];
}

export const SafetyPage: React.FC = () => {
  const [openArticle, setOpenArticle] = useState<string | null>('upi');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const articles: ArticleItem[] = [
    {
      id: 'upi',
      category: 'Digital Payments',
      title: 'UPI "Scan QR to Receive Money" Deception',
      icon: CreditCard,
      summary: 'Scammers exploit misunderstandings of UPI PIN mechanics to trick sellers into sending money instead of receiving it.',
      howItWorks: 'A fraudster posing as an online buyer or landlord offers to make an advance transfer. They send a QR code or payment request link stating: "Scan this QR code and enter your UPI PIN to accept the funds into your bank account." In reality, UPI PIN is ONLY required to deduct money from your account, never to receive.',
      warningSigns: [
        'Anyone claiming you must enter your UPI PIN or scan a QR code to RECEIVE money.',
        'Buyer is overly eager and refuses physical inspection or telephonic call.',
        'Payment requests generated from unfamiliar apps with text stating "Refund approved".'
      ],
      preventionSteps: [
        'Rule #1 of UPI: Entering a UPI PIN ALWAYS deducts money from your account.',
        'Direct UPI payments to your mobile number or VPA credit instantly without any scan.',
        'Reject and report any payment request received on Google Pay, PhonePe, or Paytm.'
      ],
      recommendedActions: [
        'Never scan incoming QR codes for sale listings.',
        'Immediately report the sender UPI VPA on ScamShield and inside your UPI banking app.',
        'Contact your bank immediately if funds were deducted.'
      ]
    },
    {
      id: 'otp',
      category: 'Identity Fraud',
      title: 'Urgent Electricity / Utility Cutoff & OTP Extortion',
      icon: Lock,
      summary: 'Attackers create panic through automated SMS or calls threatening immediate loss of utility services.',
      howItWorks: 'An SMS arrives: "Dear consumer, your electricity/SIM card will be disconnected tonight at 9:30 PM due to unpaid bill. Immediately contact power officer on 98XXXXXXXX." When the victim calls in panic, the caller requests remote access or bank card OTP under the guise of an "update fee".',
      warningSigns: [
        'Threats of immediate same-day service cutoffs sent from personal 10-digit mobile numbers rather than official header codes (e.g. VM-MSEB).',
        'Caller demanding you download screen-sharing tools like AnyDesk or QuickSupport.',
        'Caller asking for one-time passwords (OTP) sent to your phone.'
      ],
      preventionSteps: [
        'Utility companies always issue written notices and bill invoices, never instant cutoff SMS from personal mobile numbers.',
        'Always pay utility bills directly through official utility portals or official BBPS biller apps.',
        'Never disclose OTPs to any caller regardless of their claimed authority.'
      ],
      recommendedActions: [
        'Disconnect the call immediately and block the phone number.',
        'Check your real utility account status on your state electricity board website.',
        'Search the caller’s number on ScamShield to see corroborating reports.'
      ]
    },
    {
      id: 'customercare',
      category: 'Social Engineering',
      title: 'Manipulated SEO Fake Customer-Care Numbers',
      icon: Smartphone,
      summary: 'Cyber syndicates manipulate search engine listings and Google Maps to inject their fraud numbers as bank helplines.',
      howItWorks: 'When a citizen searches for "Swiggy refund customer care" or "SBI card support number" on Google, fraudsters post SEO-poisoned phone numbers. When called, the fake agent promises a refund and sends an APK link or payment link that drains the victim’s account.',
      warningSigns: [
        'Customer care numbers listed as personal 10-digit mobile numbers rather than standard 1800 toll-free numbers.',
        'Support executive insists on sending you an APK link via WhatsApp or Telegram.',
        'Support agent asks for debit card expiration dates and CVVs.'
      ],
      preventionSteps: [
        'Only obtain helpline numbers directly from the official verified mobile application or the back of your physical debit card.',
        'Never trust phone numbers found in unverified Google search snippets or Google Maps comments.',
        'Legitimate companies never use WhatsApp to provide banking customer support.'
      ],
      recommendedActions: [
        'Hang up immediately if customer care asks you to transfer a "test amount".',
        'Verify numbers via official verified websites ending in official domains.',
        'Submit the fraudulent customer-care number on ScamShield.'
      ]
    },
    {
      id: 'job',
      category: 'Employment Scams',
      title: 'Work-From-Home & Telegram Rating Investment Traps',
      icon: TrendingUp,
      summary: 'Fraudsters offer lucrative pay for easy tasks like liking YouTube videos, then lure victims into high-stakes "prepaid tasks".',
      howItWorks: 'The victim receives an unsolicited WhatsApp message offering ₹2,000 to ₹5,000 daily for liking videos or rating hotels on Google Maps. Initial small rewards (₹150 to ₹300) are paid to establish trust. The victim is then added to a Telegram group and asked to invest higher sums in "crypto merchant tasks" where withdrawals are permanently locked.',
      warningSigns: [
        'Unsolicited job offers sent via WhatsApp or SMS from international numbers (+84, +62, +234).',
        'Requests to communicate exclusively on Telegram.',
        'Requirement to pay money upfront to "recharge" or "unlock" earned commissions.'
      ],
      preventionSteps: [
        'Legitimate companies never ask employees to pay money to receive salaries or commissions.',
        'No legitimate company pays ₹5,000 a day for watching videos or clicking like buttons.',
        'Block and report unsolicited recruiters on messaging platforms.'
      ],
      recommendedActions: [
        'Do not deposit additional funds to "recover" previous deposits.',
        'Preserve all Telegram chat transcripts, transaction UTR numbers, and bank account details.',
        'File an emergency cyber complaint on 1930 and cybercrime.gov.in.'
      ]
    },
    {
      id: 'remote',
      category: 'Device Compromise',
      title: 'Remote-Access Tool Exploits (AnyDesk / RustDesk / QuickSupport)',
      icon: Eye,
      summary: 'Scammers trick victims into installing legitimate remote screen-sharing applications to view passwords and OTPs live.',
      howItWorks: 'The fraudster instructs the victim to download AnyDesk, TeamViewer QuickSupport, or RustDesk from the Play Store to "assist with technical verification". Once the victim shares the 9-digit session code, the attacker views the victim\'s screen, captures net banking credentials, and intercepts OTPs in real-time.',
      warningSigns: [
        'Any caller asking you to download screen sharing or device access software.',
        'Caller requesting you to read out a 9-digit access code from an app.',
        'Caller asking you to log into your net banking while they "remain on the line to monitor".'
      ],
      preventionSteps: [
        'Never install AnyDesk or remote tools on request from an incoming telephone caller.',
        'Banks and telecom providers NEVER require remote screen access to resolve issues.',
        'If already installed, immediately turn off Wi-Fi/Mobile Data and uninstall the application.'
      ],
      recommendedActions: [
        'Immediately disable Wi-Fi and disconnect cellular data to terminate the active session.',
        'Uninstall the remote app immediately.',
        'Change all banking and email passwords from a different, clean device.'
      ]
    }
  ];

  const categories = ['all', 'Digital Payments', 'Identity Fraud', 'Social Engineering', 'Employment Scams', 'Device Compromise'];

  const filteredArticles = articles.filter(a => 
    selectedCategory === 'all' || a.category === selectedCategory
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-semibold text-cyan-400">
          <ShieldCheck className="w-3.5 h-3.5" /> Cybercrime Defense & Advisory Center
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Digital Fraud Prevention & Safety Center
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Master the psychological triggers and deceptive technical methods used by modern financial cyber syndicates operating across India.
        </p>
      </div>

      {/* Emergency Action Plan: The Golden 2-Hour Protocol */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-rose-950/40 via-[#0a0f1d] to-[#0a0f1d] border border-rose-800/50 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-inner">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                Emergency Fraud Response Protocol
              </h2>
              <p className="text-xs text-rose-300/90 font-medium">
                Immediate actions within the critical "Golden 2-Hour" transaction window
              </p>
            </div>
          </div>

          <a
            href="tel:1930"
            className="px-5 py-2.5 rounded-xl font-extrabold text-sm text-white bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition-all self-start sm:self-auto shrink-0"
          >
            <PhoneCall className="w-4 h-4" /> Dial 1930 Helpline
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
          {/* Step 1 */}
          <div className="p-4 rounded-2xl bg-[#060913]/90 border border-slate-800/80 space-y-2 hover:border-rose-500/30 transition-all">
            <div className="text-xs font-bold text-rose-400 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-300 text-[11px] flex items-center justify-center font-bold">1</span>
              Freeze Bank / UPI VPA
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Call your bank hotline immediately. Request an urgent debit freeze on cards and UPI VPAs to halt subsequent fund transfers.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-2xl bg-[#060913]/90 border border-slate-800/80 space-y-2 hover:border-amber-500/30 transition-all">
            <div className="text-xs font-bold text-amber-400 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] flex items-center justify-center font-bold">2</span>
              Dial Helpline 1930
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Contact the National Cybercrime Helpline (1930) operated by I4C, MHA. Provide transaction UTR numbers to initiate bank freezes.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-2xl bg-[#060913]/90 border border-slate-800/80 space-y-2 hover:border-cyan-500/30 transition-all">
            <div className="text-xs font-bold text-cyan-400 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 text-[11px] flex items-center justify-center font-bold">3</span>
              File National Portal FIR
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Submit a formal cybercrime report at <a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer" className="text-cyan-400 underline font-semibold">cybercrime.gov.in</a> attaching screenshots and chat transcripts.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-2xl bg-[#060913]/90 border border-slate-800/80 space-y-2 hover:border-emerald-500/30 transition-all">
            <div className="text-xs font-bold text-emerald-400 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] flex items-center justify-center font-bold">4</span>
              Report to ScamShield
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Log the fraudster's phone or UPI identifier in our database to protect fellow citizens and strengthen community threat intelligence.
            </p>
          </div>
        </div>
      </div>

      {/* Category filter pills */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            In-Depth Modus Operandi & Defense Dossiers
          </h2>
          <span className="text-xs text-slate-500 font-medium">Click any dossier to view details</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-[#0a0f1d] text-slate-400 hover:text-white border border-slate-800/80'
              }`}
            >
              {cat === 'all' ? 'All Guides' : cat}
            </button>
          ))}
        </div>

        {/* Educational Fraud Modules Accordion */}
        <div className="space-y-3 pt-2">
          {filteredArticles.map((item) => {
            const Icon = item.icon;
            const isOpen = openArticle === item.id;

            return (
              <div
                key={item.id}
                className={`rounded-2xl bg-[#0a0f1d] border transition-all overflow-hidden shadow-md ${
                  isOpen ? 'border-cyan-500/40 shadow-cyan-950/20' : 'border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {/* Header Accordion trigger */}
                <button
                  type="button"
                  onClick={() => setOpenArticle(isOpen ? null : item.id)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-850/30 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`p-2.5 rounded-xl border transition-colors ${
                      isOpen 
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' 
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 font-mono">
                        {item.category}
                      </div>
                      <h3 className="text-base font-bold text-white mt-0.5">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  <div className="text-slate-400 p-1 rounded-lg bg-slate-900 border border-slate-800">
                    {isOpen ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {/* Collapsible Content */}
                {isOpen && (
                  <div className="px-5 pb-6 pt-1 border-t border-slate-800/80 space-y-5 animate-in fade-in duration-150">
                    <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                      <strong className="text-white block mb-1">Deception Anatomy:</strong>
                      {item.howItWorks}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                      {/* Warning signs */}
                      <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/30 space-y-2">
                        <div className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" /> Warning Indicators
                        </div>
                        <ul className="space-y-1.5 text-[11px] text-slate-300 leading-relaxed">
                          {item.warningSigns.map((w, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-rose-400 font-bold shrink-0">•</span>
                              <span>{w}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Prevention */}
                      <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/30 space-y-2">
                        <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Prevention Protocol
                        </div>
                        <ul className="space-y-1.5 text-[11px] text-slate-300 leading-relaxed">
                          {item.preventionSteps.map((p, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-emerald-400 font-bold shrink-0">•</span>
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Recommended actions */}
                      <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-900/30 space-y-2">
                        <div className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> Immediate Checklist
                        </div>
                        <ul className="space-y-1.5 text-[11px] text-slate-300 leading-relaxed">
                          {item.recommendedActions.map((a, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-cyan-400 font-bold shrink-0">•</span>
                              <span>{a}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
