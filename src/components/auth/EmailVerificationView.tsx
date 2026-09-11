import React, { useState, useEffect, useRef } from "react";
import {
  Mail,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  Inbox,
  Sparkles,
  Zap,
} from "lucide-react";
import { UserRole } from "../../types";
import { markUserEmailVerified } from "../../utils/storage";
import { DeliveredEmailModal } from "./DeliveredEmailModal";

interface EmailVerificationViewProps {
  email: string;
  fullName: string;
  role: UserRole;
  initialCode?: string;
  initialSentVia?: "smtp" | "simulated_preview";
  onVerifiedSuccess: (verifiedEmail: string) => void;
  onBackToAccountDetails: () => void;
}

export const EmailVerificationView: React.FC<EmailVerificationViewProps> = ({
  email,
  fullName,
  role,
  initialCode = "",
  initialSentVia = "simulated_preview",
  onVerifiedSuccess,
  onBackToAccountDetails,
}) => {
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState<number>(60);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Email preview inspection modal
  const [currentCode, setCurrentCode] = useState<string>(initialCode);
  const [sentVia, setSentVia] = useState<"smtp" | "simulated_preview">(initialSentVia);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  // Input refs for 6-box OTP navigation
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 60-second countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  // Initial focus on first box
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Handle single digit input
  const handleDigitChange = (index: number, val: string) => {
    const clean = val.replace(/\D/g, "");
    if (!clean) {
      const copy = [...digits];
      copy[index] = "";
      setDigits(copy);
      return;
    }

    // Single digit input
    const char = clean.slice(-1);
    const copy = [...digits];
    copy[index] = char;
    setDigits(copy);
    setErrorMessage(null);

    // Auto advance focus to next box
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste full 6-digit code
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const copy = [...digits];
    for (let i = 0; i < 6; i++) {
      copy[i] = pasted[i] || "";
    }
    setDigits(copy);
    setErrorMessage(null);

    const focusIdx = Math.min(pasted.length, 5);
    inputRefs.current[focusIdx]?.focus();
  };

  // Submission handler
  const handleVerifySubmit = async (codeToVerify?: string) => {
    const finalCode = (codeToVerify || digits.join("")).trim();

    if (finalCode.length !== 6) {
      setErrorMessage("Please enter the complete 6-digit verification code.");
      return;
    }

    setIsVerifying(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          code: finalCode,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        // Mark verified in local storage account registry
        markUserEmailVerified(email.trim());
        setSuccessMessage("Email verified successfully! Setting up your profile...");
        setTimeout(() => {
          onVerifiedSuccess(email.trim());
        }, 800);
      } else {
        setErrorMessage(data.message || "Invalid or expired verification code.");
      }
    } catch (err: any) {
      // Fallback: check against stored current code
      if (currentCode && finalCode === currentCode) {
        markUserEmailVerified(email.trim());
        setSuccessMessage("Email verified successfully! Setting up your profile...");
        setTimeout(() => {
          onVerifiedSuccess(email.trim());
        }, 800);
      } else {
        setErrorMessage("Verification server is unreachable. Please check the code.");
      }
    } finally {
      setIsVerifying(false);
    }
  };

  // Resend code handler
  const handleResendCode = async () => {
    if (countdown > 0 || isResending) return;

    setIsResending(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/auth/resend-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          fullName,
          type: "signup",
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setCurrentCode(data.code);
        setSentVia(data.sentVia || "simulated_preview");
        setCountdown(60);
        setSuccessMessage("A fresh 6-digit code has been dispatched to your email!");
      } else {
        setErrorMessage(data.error || "Could not resend verification code.");
      }
    } catch (err: any) {
      setErrorMessage("Failed to dispatch code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const isComplete = digits.every((d) => d.length === 1);

  return (
    <div className="p-6 sm:p-8 space-y-6" id="email-verification-view">
      {/* Visual Header */}
      <div className="text-center space-y-3">
        <div className="relative inline-flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-200/80 flex items-center justify-center">
            <Mail className="w-8 h-8" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            Verify your email address
          </h2>
          <p className="text-sm text-stone-600 mt-1 max-w-md mx-auto">
            We sent a 6-digit security code to{" "}
            <span className="font-semibold text-stone-900 underline underline-offset-2">
              {email}
            </span>
          </p>
        </div>

        <button
          type="button"
          onClick={onBackToAccountDetails}
          className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-stone-900 transition-colors font-medium cursor-pointer"
        >
          <ArrowLeft className="w-3 h-3" />
          <span>Wrong email? Edit details</span>
        </button>
      </div>

      {/* Alerts */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* 6-Box OTP Pin Input */}
      <div className="space-y-4">
        <label className="block text-center text-xs font-semibold uppercase tracking-wider text-stone-500">
          Enter 6-digit confirmation code
        </label>

        <div className="flex justify-center items-center gap-2 sm:gap-3">
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => {
                inputRefs.current[idx] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              onPaste={idx === 0 ? handlePaste : undefined}
              className={`w-11 h-13 sm:w-13 sm:h-15 text-center text-xl sm:text-2xl font-mono font-bold rounded-xl border transition-all ${
                digit
                  ? "border-amber-600 bg-amber-50/50 text-stone-900 shadow-xs ring-2 ring-amber-500/20"
                  : "border-stone-300 bg-white text-stone-900 hover:border-stone-400 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
              }`}
              id={`otp-box-${idx}`}
            />
          ))}
        </div>
      </div>

      {/* Live Email Inspector / Instant Preview Card */}
      <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <Inbox className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-stone-900 flex items-center gap-1.5">
              <span>Delivered to Email Inbox</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-200/80 text-amber-900 font-bold">
                Live
              </span>
            </div>
            <p className="text-stone-500 text-[11px]">
              Inspect the exact HTML email message dispatched to your inbox.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsEmailModalOpen(true)}
          className="w-full sm:w-auto px-3.5 py-2 rounded-lg bg-white border border-stone-300 hover:bg-stone-100 text-stone-800 font-semibold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          id="open-delivered-email-preview-btn"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>View Delivered Email</span>
        </button>
      </div>

      {/* Actions */}
      <div className="space-y-3 pt-2">
        <button
          type="button"
          onClick={() => handleVerifySubmit()}
          disabled={!isComplete || isVerifying}
          className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          id="verify-email-submit-btn"
        >
          {isVerifying ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying Code...</span>
            </>
          ) : (
            <>
              <span>Verify Email & Complete Profile</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Resend Code Section with 60s countdown */}
        <div className="text-center">
          {countdown > 0 ? (
            <p className="text-xs text-stone-500">
              Didn't receive the email? Resend code in{" "}
              <span className="font-semibold text-stone-800">{countdown}s</span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResendCode}
              disabled={isResending}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-900 transition-colors cursor-pointer"
              id="resend-verification-code-btn"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isResending ? "animate-spin" : ""}`} />
              <span>Resend Verification Code</span>
            </button>
          )}
        </div>
      </div>

      {/* Delivered Email Inspection Modal */}
      <DeliveredEmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        email={email}
        code={currentCode || digits.join("") || "742918"}
        subject={`🛡️ Verify your SkillMatch AI account: ${currentCode || digits.join("")}`}
        sentVia={sentVia}
        onInstantVerify={(deliveredCode) => {
          const arr = deliveredCode.split("").slice(0, 6);
          setDigits(arr);
          setIsEmailModalOpen(false);
          handleVerifySubmit(deliveredCode);
        }}
      />
    </div>
  );
};
