import React, { useState } from "react";
import {
  X,
  ShieldCheck,
  Star,
  UserCheck,
  Clock,
  CheckCircle2,
  Plus,
  Send,
  MessageSquare,
  Sparkles,
  Award,
  Users,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  ThumbsUp,
  ExternalLink,
} from "lucide-react";
import {
  StudentProfile,
  SkillEndorsement,
  PeerEndorsementRequest,
} from "../../types";
import { getSkillVerification } from "../../utils/matchingEngine";

interface SkillVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  peerRequests: PeerEndorsementRequest[];
  onOpenRequestModal: (skill?: string) => void;
  onApprovePendingEndorsement: (endorsementId: string) => void;
  onSubmitPeerEndorsement: (requestId: string, comment: string, rating: number) => void;
  onAddSkill: (skill: string) => void;
}

export const SkillVerificationModal: React.FC<SkillVerificationModalProps> = ({
  isOpen,
  onClose,
  profile,
  peerRequests,
  onOpenRequestModal,
  onApprovePendingEndorsement,
  onSubmitPeerEndorsement,
  onAddSkill,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<"verified" | "outgoing" | "incoming">("verified");
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);

  // Peer endorsement modal state
  const [activeEndorsingRequest, setActiveEndorsingRequest] = useState<PeerEndorsementRequest | null>(
    null
  );
  const [peerRating, setPeerRating] = useState(5);
  const [peerComment, setPeerComment] = useState("");
  const [remindedIds, setRemindedIds] = useState<Record<string, boolean>>({});

  const endorsements = profile.endorsements || [];
  const verifiedEndorsements = endorsements.filter((e) => e.status === "verified");
  const pendingEndorsements = endorsements.filter((e) => e.status === "pending");

  const skills = profile.skills || [];
  const verifiedSkillsCount = skills.filter(
    (s) => getSkillVerification(s, endorsements).isVerified
  ).length;

  const pendingPeerRequests = peerRequests.filter((r) => r.status === "pending");

  const handleStartPeerEndorsement = (req: PeerEndorsementRequest) => {
    setActiveEndorsingRequest(req);
    setPeerRating(5);
    setPeerComment(
      `Strong execution in ${req.skill} during our ${req.projectOrEvent} collaboration. Highly reliable teammate!`
    );
  };

  const handleConfirmPeerEndorsement = () => {
    if (!activeEndorsingRequest) return;
    onSubmitPeerEndorsement(activeEndorsingRequest.id, peerComment, peerRating);
    setActiveEndorsingRequest(null);
  };

  const handleRemind = (id: string) => {
    setRemindedIds((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setRemindedIds((prev) => ({ ...prev, [id]: false }));
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-stone-900">
                  Skill Verification & Peer Endorsements
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Live Verified Badges
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Peer-verified skills provide proof to hackathon recruiters and elevate your Career Readiness Score.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenRequestModal()}
              className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
              id="header-request-endorsement-btn"
            >
              <Plus className="w-3.5 h-3.5" />
              Request Endorsement
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-6 py-4 bg-stone-100/60 border-b border-stone-200">
          <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-2xs">
            <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-tight">
              Verified Skills
            </div>
            <div className="text-xl font-black text-emerald-700 flex items-center gap-1.5 mt-0.5">
              <span>{verifiedSkillsCount}</span>
              <span className="text-xs font-semibold text-stone-400">/ {skills.length}</span>
            </div>
          </div>

          <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-2xs">
            <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-tight">
              Total Endorsements
            </div>
            <div className="text-xl font-black text-stone-900 flex items-center gap-1.5 mt-0.5">
              <span>{verifiedEndorsements.length}</span>
              <span className="text-xs font-semibold text-stone-400">received</span>
            </div>
          </div>

          <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-2xs">
            <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-tight">
              Avg Peer Rating
            </div>
            <div className="text-xl font-black text-amber-600 flex items-center gap-1 mt-0.5">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>4.9</span>
              <span className="text-xs font-semibold text-stone-400">/ 5.0</span>
            </div>
          </div>

          <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-2xs">
            <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-tight">
              Pending Action
            </div>
            <div className="text-xl font-black text-stone-900 flex items-center gap-1.5 mt-0.5">
              <span>{pendingEndorsements.length + pendingPeerRequests.length}</span>
              <span className="text-[11px] font-medium text-stone-400">requests</span>
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-stone-200 px-6 bg-white gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("verified")}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "verified"
                ? "border-amber-600 text-amber-900"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            My Skills & Verified Badges ({skills.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("outgoing")}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "outgoing"
                ? "border-amber-600 text-amber-900"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            Outgoing Requests ({endorsements.length})
            {pendingEndorsements.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
                {pendingEndorsements.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("incoming")}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "incoming"
                ? "border-amber-600 text-amber-900"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            <Users className="w-3.5 h-3.5 text-blue-600" />
            Endorse Teammates ({peerRequests.length})
            {pendingPeerRequests.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                {pendingPeerRequests.length}
              </span>
            )}
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TAB 1: MY SKILLS & VERIFIED BADGES */}
          {activeTab === "verified" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-stone-900">
                    Your Skill Credentials & Badges
                  </h3>
                  <p className="text-xs text-stone-500">
                    Verified badges are earned when teammates confirm your hackathon contributions.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenRequestModal()}
                  className="text-xs text-amber-700 font-bold hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Request New Verification
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skills.map((skill) => {
                  const v = getSkillVerification(skill, endorsements);
                  const isExpanded = expandedSkill === skill;

                  return (
                    <div
                      key={skill}
                      className={`p-4 rounded-2xl border transition-all ${
                        v.isVerified
                          ? "bg-white border-emerald-200/80 shadow-xs hover:border-emerald-300"
                          : v.pendingCount > 0
                          ? "bg-amber-50/50 border-amber-200"
                          : "bg-white border-stone-200 hover:border-stone-300"
                      }`}
                      id={`skill-card-${skill}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-bold text-stone-900">{skill}</h4>
                            {v.isVerified ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 text-[10px] font-bold border border-emerald-200 shadow-2xs">
                                <ShieldCheck className="w-3 h-3 text-emerald-700" />
                                Verified ✓
                              </span>
                            ) : v.pendingCount > 0 ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-semibold border border-amber-200">
                                <Clock className="w-3 h-3 text-amber-600" />
                                Review Pending
                              </span>
                            ) : (
                              <span className="text-[10px] text-stone-400 font-medium px-2 py-0.5 rounded bg-stone-100">
                                Unverified
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-stone-500">
                            {v.isVerified
                              ? `Verified by ${v.count} teammate${v.count > 1 ? "s" : ""} · Average rating: ${v.averageRating} ★`
                              : v.pendingCount > 0
                              ? "Awaiting confirmation from your project partner"
                              : "Self-declared. Request endorsement to verify."}
                          </p>
                        </div>

                        {v.isVerified ? (
                          <button
                            type="button"
                            onClick={() => setExpandedSkill(isExpanded ? null : skill)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors"
                            title="Toggle endorsement proof"
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onOpenRequestModal(skill)}
                            className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition-colors shrink-0"
                          >
                            + Request
                          </button>
                        )}
                      </div>

                      {/* Verified Endorser Quotes & Proof */}
                      {v.isVerified && (
                        <div className="mt-3 pt-3 border-t border-stone-100 space-y-2">
                          <div className="flex items-center justify-between text-[11px] font-semibold text-stone-600">
                            <span>Endorsers & Context</span>
                            <button
                              type="button"
                              onClick={() => onOpenRequestModal(skill)}
                              className="text-amber-700 hover:underline text-[10px] font-bold"
                            >
                              + Add more
                            </button>
                          </div>

                          <div className="space-y-1.5">
                            {v.endorsements.map((end) => (
                              <div
                                key={end.id}
                                className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 text-xs space-y-1"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px] flex items-center justify-center">
                                      {end.endorserName.charAt(0)}
                                    </div>
                                    <span className="font-bold text-stone-900">
                                      {end.endorserName}
                                    </span>
                                    <span className="text-[10px] text-stone-400 font-normal">
                                      ({end.endorserRole})
                                    </span>
                                  </div>
                                  <div className="flex items-center text-amber-500 text-[10px] font-bold">
                                    <Star className="w-2.5 h-2.5 fill-amber-500 mr-0.5" />
                                    {end.proficiencyRating || 5}.0
                                  </div>
                                </div>
                                <div className="text-[10px] font-semibold text-amber-800">
                                  📍 {end.projectOrEvent}
                                </div>
                                {end.comment && (
                                  <p className="text-[11px] text-stone-600 italic">
                                    "{end.comment}"
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: OUTGOING REQUESTS */}
          {activeTab === "outgoing" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-stone-900">
                    Endorsement Requests You've Sent
                  </h3>
                  <p className="text-xs text-stone-500">
                    Track collaborator responses or test verification approval.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenRequestModal()}
                  className="px-3 py-1.5 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 transition-colors flex items-center gap-1 shadow-xs"
                >
                  <Plus className="w-3 h-3" /> New Request
                </button>
              </div>

              {endorsements.length === 0 ? (
                <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200">
                  <ShieldCheck className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                  <p className="text-sm font-bold text-stone-700">No endorsement requests yet</p>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Request teammates to verify your technical abilities.
                  </p>
                  <button
                    type="button"
                    onClick={() => onOpenRequestModal()}
                    className="mt-3 px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold"
                  >
                    Request First Endorsement
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {endorsements.map((item) => {
                    const isVerified = item.status === "verified";
                    const isReminded = remindedIds[item.id];

                    return (
                      <div
                        key={item.id}
                        className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                          isVerified
                            ? "bg-white border-stone-200"
                            : "bg-amber-50/60 border-amber-200"
                        }`}
                        id={`endorsement-item-${item.id}`}
                      >
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-bold text-stone-900">
                              Skill: {item.skill}
                            </span>
                            {isVerified ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-200 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                                Verified by {item.endorserName}
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1">
                                <Clock className="w-3 h-3 text-amber-700 animate-pulse" />
                                Pending Teammate Review
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-stone-600">
                            Requested from: <span className="font-semibold">{item.endorserName}</span> ({item.endorserRole}) · Project: <span className="font-semibold">{item.projectOrEvent}</span>
                          </p>

                          {item.comment && (
                            <p className="text-[11px] text-stone-500 italic line-clamp-1">
                              "{item.comment}"
                            </p>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          {!isVerified ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleRemind(item.id)}
                                disabled={isReminded}
                                className="px-3 py-1.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold transition-colors"
                              >
                                {isReminded ? "Ping Sent! 🔔" : "Remind"}
                              </button>

                              <button
                                type="button"
                                onClick={() => onApprovePendingEndorsement(item.id)}
                                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-1 shadow-2xs"
                                title="Approve now to test verified badge display"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Approve & Verify Badge
                              </button>
                            </>
                          ) : (
                            <span className="text-xs text-stone-400 font-medium">
                              Verified on {item.verifiedAt || "Platform"}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: INCOMING PEER ENDORSEMENTS TO GIVE */}
          {activeTab === "incoming" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-stone-900">
                    Peer Verification Requests from Collaborators
                  </h3>
                  <p className="text-xs text-stone-500">
                    Teammates you've worked with are requesting your endorsement for their profiles.
                  </p>
                </div>
              </div>

              {peerRequests.length === 0 ? (
                <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200">
                  <Users className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                  <p className="text-sm font-bold text-stone-700">No incoming endorsement requests</p>
                  <p className="text-xs text-stone-500 mt-0.5">
                    When project collaborators request your endorsement, they will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {peerRequests.map((req) => {
                    const isEndorsed = req.status === "endorsed";

                    return (
                      <div
                        key={req.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          isEndorsed ? "bg-white border-stone-200" : "bg-blue-50/40 border-blue-200"
                        }`}
                        id={`peer-request-${req.id}`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-900 font-bold text-xs flex items-center justify-center border border-blue-200">
                                {req.requesterName.charAt(0)}
                              </div>
                              <span className="text-sm font-bold text-stone-900">
                                {req.requesterName}
                              </span>
                              <span className="text-xs text-stone-500">
                                ({req.requesterRole})
                              </span>
                              {isEndorsed && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                                  You Endorsed ✓
                                </span>
                              )}
                            </div>

                            <div className="text-xs text-stone-700">
                              Requested endorsement for: <span className="font-bold text-stone-900">{req.skill}</span> · Context: <span className="font-semibold text-amber-800">{req.projectOrEvent}</span>
                            </div>

                            {req.note && (
                              <p className="text-xs text-stone-600 italic bg-white/80 p-2 rounded-lg border border-stone-200 mt-1">
                                "{req.note}"
                              </p>
                            )}

                            {isEndorsed && req.givenComment && (
                              <div className="text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-200 mt-1">
                                <span className="font-semibold">Your testimonial:</span> "{req.givenComment}" ({req.givenRating || 5} ★)
                              </div>
                            )}
                          </div>

                          {!isEndorsed && (
                            <button
                              type="button"
                              onClick={() => handleStartPeerEndorsement(req)}
                              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs self-end sm:self-center shrink-0"
                            >
                              <ThumbsUp className="w-3.5 h-3.5" />
                              Endorse Teammate
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Endorse Peer Sub-Modal / Drawer */}
        {activeEndorsingRequest && (
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-60 animate-in fade-in">
            <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div className="flex items-center gap-2">
                  <ThumbsUp className="w-5 h-5 text-blue-600" />
                  <h3 className="text-base font-bold text-stone-900">
                    Endorse {activeEndorsingRequest.requesterName}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveEndorsingRequest(null)}
                  className="p-1.5 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-xs text-stone-500">Skill being verified:</div>
                  <div className="text-sm font-bold text-stone-900">
                    {activeEndorsingRequest.skill}
                  </div>
                  <div className="text-xs text-amber-800">
                    Collaboration: {activeEndorsingRequest.projectOrEvent}
                  </div>
                </div>

                {/* Rating selection */}
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Proficiency Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setPeerRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= peerRating
                              ? "fill-amber-400 text-amber-500"
                              : "text-stone-300"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-stone-700 ml-2">
                      {peerRating}.0 / 5.0
                    </span>
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Endorsement Testimonial
                  </label>
                  <textarea
                    rows={3}
                    value={peerComment}
                    onChange={(e) => setPeerComment(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Write a brief comment on their work and strengths..."
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setActiveEndorsingRequest(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmPeerEndorsement}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs"
                >
                  Confirm & Submit Endorsement
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <span className="text-xs text-stone-500">
            Verified skills grant a +12% boost to your Career Readiness score.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
