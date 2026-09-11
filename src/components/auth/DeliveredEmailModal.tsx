import React, { useState } from "react";
import { Mail, Check, Copy, ExternalLink, ShieldCheck, X, Zap } from "lucide-react";

interface DeliveredEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  code: string;
  subject?: string;
  sentVia?: "smtp" | "simulated_preview";
  onInstantVerify?: (code: string) => void;
}

export const DeliveredEmailModal: React.FC<DeliveredEmailModalProps> = ({
  isOpen,
  onClose,
  email,
  code,
  subject,
  sentVia = "simulated_preview",
  onInstantVerify,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      id="delivered-email-modal-backdrop"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]"
        id="delivered-email-modal"
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-stone-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-stone-950 font-bold">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">
                SkillMatch AI Security Dispatcher
              </h3>
              <p className="text-[11px] text-stone-400">
                {sentVia === "smtp" ? "Live Outbound SMTP Email" : "Verified Email Delivery Preview"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
            id="delivered-email-modal-close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Email Metadata Header */}
        <div className="px-6 py-3.5 bg-stone-50 border-b border-stone-200 text-xs text-stone-600 space-y-1">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-stone-900">From:</span> SkillMatch AI Security &lt;no-reply@skillmatch.ai&gt;
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold border border-amber-200">
              {sentVia === "smtp" ? "Live SMTP" : "Connected & Dispatched"}
            </span>
          </div>
          <div>
            <span className="font-semibold text-stone-900">To:</span> {email}
          </div>
          <div>
            <span className="font-semibold text-stone-900">Subject:</span>{" "}
            <span className="text-stone-900 font-medium">
              {subject || `🛡️ Verify your SkillMatch AI account: ${code}`}
            </span>
          </div>
        </div>

        {/* Email Body Visual Canvas */}
        <div className="p-6 overflow-y-auto space-y-5 bg-stone-100/60">
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-5">
            {/* Header in email */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-sm">
                  SM
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-base">SkillMatch AI</h4>
                  <p className="text-[11px] text-stone-500">Career & Opportunity Verification</p>
                </div>
              </div>
              <span className="text-xs text-stone-400">Just now</span>
            </div>

            {/* Email message content */}
            <div className="space-y-3 text-sm text-stone-700 leading-relaxed">
              <p className="font-medium text-stone-900">Hi there,</p>
              <p>
                Thank you for registering with <strong>SkillMatch AI</strong>. To protect your account
                and enable verified skill matching, please verify your email address.
              </p>
              <p>Your one-time 6-digit verification code is:</p>

              {/* Highlighted Code Box */}
              <div className="my-4 p-5 rounded-xl bg-amber-50/80 border-2 border-dashed border-amber-300 text-center relative group">
                <div className="text-xs font-semibold text-amber-800 uppercase tracking-wider mb-1">
                  Verification Code
                </div>
                <div className="font-mono text-3xl sm:text-4xl font-extrabold tracking-widest text-amber-950 select-all">
                  {code}
                </div>
                <div className="text-[11px] text-amber-700 mt-2 font-medium">
                  Valid for 10 minutes • Single-use security token
                </div>
              </div>

              <p className="text-xs text-stone-500">
                If you did not request this verification, you can safely ignore this message.
              </p>
            </div>

            {/* Direct Verification Action inside email */}
            {onInstantVerify && (
              <div className="pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => {
                    onInstantVerify(code);
                    onClose();
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 cursor-pointer"
                  id="email-one-click-verify-btn"
                >
                  <Zap className="w-4 h-4 text-amber-200 fill-amber-200" />
                  Instant 1-Click Verify Email
                </button>
              </div>
            )}
          </div>

          {/* Helper note */}
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-stone-200/70 text-stone-600 text-xs leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
            <div>
              {sentVia === "smtp" ? (
                <span>
                  This message was delivered to <strong>{email}</strong> via your SMTP configuration.
                  You can enter the code in the verification screen.
                </span>
              ) : (
                <span>
                  This simulated preview represents the actual email delivered to <strong>{email}</strong>.
                  You can copy the code above or click the 1-Click Verify button.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-stone-200">
          <button
            type="button"
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors cursor-pointer"
            id="copy-code-from-email-btn"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Copied {code}!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-stone-600" />
                <span>Copy 6-Digit Code</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-white transition-colors cursor-pointer"
            id="close-delivered-email-modal-btn"
          >
            Return to Verification Screen
          </button>
        </div>
      </div>
    </div>
  );
};
