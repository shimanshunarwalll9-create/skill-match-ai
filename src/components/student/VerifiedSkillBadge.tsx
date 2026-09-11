import React, { useState } from "react";
import { ShieldCheck, Clock, UserCheck, Star, Sparkles, ChevronRight } from "lucide-react";
import { SkillEndorsement } from "../../types";
import { getSkillVerification } from "../../utils/matchingEngine";

interface VerifiedSkillBadgeProps {
  skill: string;
  endorsements?: SkillEndorsement[];
  size?: "sm" | "md" | "lg";
  onRequestEndorsement?: (skill: string) => void;
  onViewVerificationDetails?: (skill: string) => void;
  allowRequest?: boolean;
  className?: string;
}

export const VerifiedSkillBadge: React.FC<VerifiedSkillBadgeProps> = ({
  skill,
  endorsements = [],
  size = "md",
  onRequestEndorsement,
  onViewVerificationDetails,
  allowRequest = true,
  className = "",
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const verification = getSkillVerification(skill, endorsements);
  const { isVerified, count, pendingCount, endorsements: endorsersList, averageRating } = verification;

  const sizeClasses = {
    sm: "text-[11px] px-2 py-0.5 gap-1.5",
    md: "text-xs px-2.5 py-1 gap-1.5",
    lg: "text-sm px-3.5 py-1.5 gap-2",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-3.5 h-3.5",
    lg: "w-4 h-4",
  };

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div
        className={`inline-flex items-center rounded-xl font-semibold transition-all border shadow-2xs ${
          isVerified
            ? "bg-linear-to-r from-emerald-50/90 to-emerald-100/50 text-emerald-950 border-emerald-300/80 hover:border-emerald-400"
            : pendingCount > 0
            ? "bg-amber-50 text-amber-900 border-amber-300/70"
            : "bg-white text-stone-700 border-stone-200 hover:border-stone-300"
        } ${sizeClasses[size]} ${className}`}
      >
        <span>{skill}</span>

        {isVerified ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onViewVerificationDetails?.(skill);
            }}
            className="inline-flex items-center gap-1 bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md hover:bg-emerald-700 transition-colors shadow-2xs cursor-pointer"
            title={`${count} verified teammate endorsement${count > 1 ? "s" : ""}`}
          >
            <ShieldCheck className={iconSizes[size]} />
            <span>Verified</span>
            {count > 1 && <span className="opacity-90">({count})</span>}
          </button>
        ) : pendingCount > 0 ? (
          <span
            className="inline-flex items-center gap-0.5 text-[10px] font-medium text-amber-700 bg-amber-100/80 px-1.5 py-0.5 rounded-md"
            title="Endorsement request pending teammate review"
          >
            <Clock className="w-2.5 h-2.5 animate-spin-slow" />
            <span>Pending</span>
          </span>
        ) : (
          allowRequest &&
          onRequestEndorsement && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRequestEndorsement(skill);
              }}
              className="text-[10px] font-bold text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-1.5 py-0.5 rounded-md border border-amber-200 transition-colors cursor-pointer"
              title="Request endorsement from teammates"
            >
              + Verify
            </button>
          )
        )}
      </div>

      {/* Hover popover for verified proof / details */}
      {showTooltip && (isVerified || pendingCount > 0) && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-stone-900 text-white rounded-xl p-3 shadow-xl z-50 text-xs border border-stone-700 pointer-events-none animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between border-b border-stone-800 pb-1.5 mb-1.5">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-emerald-300">
                {isVerified ? "Teammate Verified Skill" : "Verification Pending"}
              </span>
            </div>
            {isVerified && averageRating && (
              <div className="flex items-center text-amber-400 font-bold text-[10px]">
                <Star className="w-3 h-3 fill-amber-400 mr-0.5" />
                {averageRating}
              </div>
            )}
          </div>

          {isVerified ? (
            <div className="space-y-1.5">
              <p className="text-[11px] text-stone-300">
                Endorsed by {count} collaborator{count > 1 ? "s" : ""} across verified hackathons & projects:
              </p>
              {endorsersList.slice(0, 2).map((end) => (
                <div key={end.id} className="bg-stone-800/80 p-2 rounded-lg border border-stone-700">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-stone-200">{end.endorserName}</span>
                    <span className="text-[9px] text-stone-400">{end.projectOrEvent}</span>
                  </div>
                  {end.comment && (
                    <p className="text-[10px] text-stone-300 italic mt-0.5 line-clamp-2">
                      "{end.comment}"
                    </p>
                  )}
                </div>
              ))}
              {count > 2 && (
                <div className="text-[10px] text-emerald-400 text-center font-medium">
                  + {count - 2} more verified endorsement{count - 2 > 1 ? "s" : ""}
                </div>
              )}
            </div>
          ) : (
            <p className="text-[11px] text-amber-200">
              Endorsement request is currently pending review by your project collaborator.
            </p>
          )}

          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-stone-900" />
        </div>
      )}
    </div>
  );
};
