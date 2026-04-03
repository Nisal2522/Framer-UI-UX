import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  AlertCircle,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  FileText,
  GitCompare,
  History,
  MessageSquare,
  Send,
  ShieldCheck,
} from "lucide-react";
import { useNotifications } from "../../context/NotificationContext";

type PlanStatus =
  | "submitted_support"
  | "revision_requested"
  | "pending_ministry"
  | "approved"
  | "rejected";

type Plan = {
  id: string;
  title: string;
  acCode: string;
  acName: string;
  chairman: string;
  planYear: string;
  coopType: string;
  province: string;
  status: PlanStatus;
  sections: { key: string; title: string; reviewed: boolean; comment: string }[];
};

type HistoryRow = {
  id: string;
  at: string;
  actor: string;
  status: string;
  note: string;
  planId: string;
};

const REJECTION_REASONS = [
  "Does not align with cooperative bylaws",
  "Financial projections unrealistic",
  "Environmental safeguards insufficient",
  "Other (see comments)",
];

const initialPlans: Plan[] = [
  {
    id: "bp-1001",
    title: "Business Plan FY 2026 — Rice & diversification",
    acCode: "AC-BB-2024-157",
    acName: "Prasat Sambor Rung Roeang Modern AC",
    chairman: "Sok Pisey",
    planYear: "2026",
    coopType: "Agricultural",
    province: "Battambang",
    status: "submitted_support",
    sections: [
      { key: "coop_profile", title: "1. COOPERATIVE PROFILE", reviewed: false, comment: "" },
      { key: "business_plan", title: "2. BUSINESS PLAN", reviewed: false, comment: "" },
      { key: "investment_plan", title: "3. INVESTMENT PLAN", reviewed: false, comment: "" },
      { key: "annexes", title: "4. ANNEXES", reviewed: false, comment: "" },
    ],
  },
  {
    id: "bp-1002",
    title: "Business Plan FY 2026 — Horticulture cluster",
    acCode: "AC-SR-2023-088",
    acName: "Angkor Fresh Vegetables Cooperative",
    chairman: "Keo Sothea",
    planYear: "2026",
    coopType: "Horticulture",
    province: "Siem Reap",
    status: "pending_ministry",
    sections: [
      { key: "coop_profile", title: "1. COOPERATIVE PROFILE", reviewed: true, comment: "Aligned with prior year." },
      { key: "business_plan", title: "2. BUSINESS PLAN", reviewed: true, comment: "" },
      { key: "investment_plan", title: "3. INVESTMENT PLAN", reviewed: true, comment: "" },
      { key: "annexes", title: "4. ANNEXES", reviewed: true, comment: "" },
    ],
  },
];

export function AdminBusinessPlanWorkflow() {
  const { addNotification } = useNotifications();
  const [tab, setTab] = useState<"support" | "ministry" | "history" | "compare">("support");
  const [plans, setPlans] = useState<Plan[]>(initialPlans);
  const [history, setHistory] = useState<HistoryRow[]>([
    {
      id: "h0",
      at: "2026-03-20T11:00:00",
      actor: "Support Team — Nget Bopha",
      status: "Submitted → Support queue",
      note: "Chairman formal submission",
      planId: "bp-1001",
    },
  ]);
  const [selectedId, setSelectedId] = useState<string | null>("bp-1001");
  const [revisionText, setRevisionText] = useState("");
  const [rejectReason, setRejectReason] = useState(REJECTION_REASONS[0]);
  const [rejectText, setRejectText] = useState("");
  const [compareA, setCompareA] = useState("AC-BB-2024-157");
  const [compareB, setCompareB] = useState("AC-SR-2023-088");
  const [compareYear, setCompareYear] = useState("2026");
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "coop_profile",
    "business_plan",
    "investment_plan",
    "annexes",
  ]);

  const selected = useMemo(() => plans.find((p) => p.id === selectedId) ?? null, [plans, selectedId]);

  const pushHistory = (row: Omit<HistoryRow, "id">) => {
    setHistory((h) => [{ id: `h-${Date.now()}`, ...row }, ...h]);
  };

  const notify = (title: string, body: string) => {
    addNotification({ title, body, audience: "AC Committee & Support" });
    toast.message(title, { description: body });
  };

  const updatePlan = (id: string, patch: Partial<Plan>) => {
    setPlans((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  };

  const toggleSectionReviewed = (planId: string, key: string, reviewed: boolean) => {
    setPlans((prev) =>
      prev.map((p) => {
        if (p.id !== planId) return p;
        return {
          ...p,
          sections: p.sections.map((s) => (s.key === key ? { ...s, reviewed } : s)),
        };
      })
    );
  };

  const setSectionComment = (planId: string, key: string, comment: string) => {
    setPlans((prev) =>
      prev.map((p) => {
        if (p.id !== planId) return p;
        return {
          ...p,
          sections: p.sections.map((s) => (s.key === key ? { ...s, comment } : s)),
        };
      })
    );
  };

  const requestRevision = () => {
    if (!selected || !revisionText.trim()) {
      toast.error("Revision request requires mandatory comments.");
      return;
    }
    updatePlan(selected.id, { status: "revision_requested" });
    pushHistory({
      at: new Date().toISOString(),
      actor: "Support Team",
      status: "Revision requested",
      note: revisionText.trim(),
      planId: selected.id,
    });
    notify(
      `Plan ${selected.acCode}: Revision requested`,
      `Status: Revision requested. ${revisionText.trim()}`
    );
    setRevisionText("");
    toast.success("AC Committee notified.");
  };

  const forwardMinistry = () => {
    if (!selected) return;
    const allReviewed = selected.sections.every((s) => s.reviewed);
    if (!allReviewed) {
      toast.error("Mark all sections as reviewed before forwarding.");
      return;
    }
    updatePlan(selected.id, { status: "pending_ministry" });
    pushHistory({
      at: new Date().toISOString(),
      actor: "Support Team",
      status: "Pending Ministry / FAO approval",
      note: "Forwarded for final decision",
      planId: selected.id,
    });
    notify(
      `Plan ${selected.acCode}: Pending Ministry / FAO approval`,
      "Support team forwarded this plan. Ministry action required."
    );
    toast.success("Forwarded to Ministry / FAO.");
  };

  const ministryApprove = (plan: Plan) => {
    updatePlan(plan.id, { status: "approved" });
    pushHistory({
      at: new Date().toISOString(),
      actor: "Ministry / FAO Committee",
      status: "Approved",
      note: "Final approval recorded",
      planId: plan.id,
    });
    notify(`Plan ${plan.acCode}: Approved`, "Business plan approved. AC Committee and Support Team informed.");
  };

  const ministryReject = (plan: Plan) => {
    if (!rejectText.trim()) {
      toast.error("Rejection requires free-text explanation.");
      return;
    }
    updatePlan(plan.id, { status: "rejected" });
    pushHistory({
      at: new Date().toISOString(),
      actor: "Ministry / FAO Committee",
      status: "Rejected",
      note: `${rejectReason} — ${rejectText.trim()}`,
      planId: plan.id,
    });
    notify(
      `Plan ${plan.acCode}: Rejected`,
      `Reason: ${rejectReason}. ${rejectText.trim()}`
    );
    setRejectText("");
    toast.message("Rejection logged; notifications sent.");
  };

  const supportQueue = plans.filter((p) => p.status === "submitted_support" || p.status === "revision_requested");
  const ministryQueue = plans.filter((p) => p.status === "pending_ministry");

  const acOptions = [...new Set(plans.map((p) => p.acCode))];
  const reviewedCount = selected ? selected.sections.filter((s) => s.reviewed).length : 0;
  const completionPct = selected ? Math.round((reviewedCount / selected.sections.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Business plan management</h1>
        <p className="mt-1 text-gray-600 max-w-3xl">
          Support team review queue, revision requests, ministry approval, full history, and multi-cooperative comparison.
          Notifications fire on every workflow transition (demo: in-app feed + toasts).
        </p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        {(
          [
            ["support", "Support team review", MessageSquare],
            ["ministry", "Ministry / FAO decision", ShieldCheck],
            ["history", "Approval history", History],
            ["compare", "Plan comparison", GitCompare],
          ] as const
        ).map(([key, label, Icon]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              tab === key ? "bg-[#0F2F8F] text-white" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {tab === "support" && (
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-2">
            <h2 className="text-sm font-semibold text-gray-900">Review queue</h2>
            <div className="rounded-2xl border border-gray-200 bg-white divide-y divide-gray-100 shadow-sm max-h-[560px] overflow-y-auto">
              {supportQueue.length === 0 ? (
                <p className="p-4 text-sm text-gray-500">No plans in support review.</p>
              ) : (
                supportQueue.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedId(p.id)}
                    className={`w-full text-left p-4 hover:bg-blue-50/40 ${selectedId === p.id ? "bg-blue-50" : ""}`}
                  >
                    <p className="text-sm font-medium text-gray-900">{p.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {p.acCode} · Chairman: {p.chairman}
                    </p>
                    <span className="mt-2 inline-block text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      {p.status === "revision_requested" ? "Revision cycle" : "Submitted"}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
          <div className="lg:col-span-8 rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
            {!selected || !supportQueue.find((p) => p.id === selected.id) ? (
              <p className="text-sm text-gray-500">Select a submitted plan from the queue.</p>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-[#0F2F8F]" />
                    {selected.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {selected.acName} · {selected.province} · Year {selected.planYear}
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-blue-900">Business Plan Status: Under Support Review</p>
                      <p className="text-xs text-blue-700 mt-1">
                        Review all sections using the same AC plan template flow, then forward to Ministry / FAO.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-2">Completion Progress</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-700">Sections Reviewed</span>
                      <span className="font-semibold text-gray-900">
                        {reviewedCount} / {selected.sections.length}
                      </span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${completionPct}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500">Complete all sections before forwarding for final decision.</p>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-[#032EA1]" />
                        <h3 className="font-semibold text-gray-900">Business Plan Template</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setExpandedSections(selected.sections.map((s) => s.key))}
                          className="px-2.5 py-1 text-xs font-medium border border-gray-300 rounded-md text-gray-700 hover:bg-white transition-colors"
                        >
                          Expand all
                        </button>
                        <button
                          type="button"
                          onClick={() => setExpandedSections([])}
                          className="px-2.5 py-1 text-xs font-medium border border-gray-300 rounded-md text-gray-700 hover:bg-white transition-colors"
                        >
                          Collapse all
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="divide-y divide-gray-200">
                    {selected.sections.map((s) => {
                      const isOpen = expandedSections.includes(s.key);
                      return (
                        <div key={s.key}>
                          <div className={`w-full px-4 py-3 border-l-4 ${isOpen ? "bg-slate-50" : "bg-white"}`}>
                            <div className="flex items-center justify-between gap-3">
                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedSections((prev) =>
                                    prev.includes(s.key) ? prev.filter((k) => k !== s.key) : [...prev, s.key]
                                  )
                                }
                                className="min-w-0 flex-1 flex items-center gap-3 text-left hover:opacity-90 transition-opacity"
                              >
                                {isOpen ? (
                                  <ChevronDown className="w-5 h-5 text-gray-600 shrink-0" />
                                ) : (
                                  <ChevronRight className="w-5 h-5 text-gray-600 shrink-0" />
                                )}
                                <span className="font-semibold text-gray-900 truncate">{s.title}</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => toggleSectionReviewed(selected.id, s.key, !s.reviewed)}
                                className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium ${
                                  s.reviewed
                                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                    : "border-amber-200 bg-amber-50 text-amber-700"
                                }`}
                              >
                                {s.reviewed ? "Completed" : "Pending"}
                              </button>
                            </div>
                          </div>
                          {isOpen && (
                            <div className="px-4 py-4 bg-white border-t border-gray-100">
                              <div className="flex items-center justify-end mb-2">
                                <label className="flex items-center gap-2 text-sm text-gray-600">
                                  <input
                                    type="checkbox"
                                    checked={s.reviewed}
                                    onChange={(e) => toggleSectionReviewed(selected.id, s.key, e.target.checked)}
                                    className="rounded border-gray-300 accent-[#0F2F8F]"
                                  />
                                  Reviewed
                                </label>
                              </div>
                              <textarea
                                value={s.comment}
                                onChange={(e) => setSectionComment(selected.id, s.key, e.target.value)}
                                rows={2}
                                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white"
                                placeholder="Section comments / revision hints…"
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-4 space-y-3">
                  <p className="text-sm font-medium text-gray-800">Send back for revision</p>
                  <textarea
                    value={revisionText}
                    onChange={(e) => setRevisionText(e.target.value)}
                    rows={3}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2"
                    placeholder="Mandatory comments for AC Committee…"
                  />
                  <button
                    type="button"
                    onClick={requestRevision}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 text-white text-sm font-medium px-4 py-2 hover:bg-amber-700"
                  >
                    <Send className="h-4 w-4" />
                    Request revision
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={forwardMinistry}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#0F2F8F] text-white text-sm font-medium px-4 py-2 hover:bg-[#0D2A7D]"
                  >
                    <ArrowRight className="h-4 w-4" />
                    Forward to Ministry / FAO
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "ministry" && (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gradient-to-r from-slate-800 to-slate-700 text-white text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Plan</th>
                <th className="px-4 py-3 font-semibold">AC</th>
                <th className="px-4 py-3 font-semibold">Province</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {ministryQueue.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    No plans pending ministry approval.
                  </td>
                </tr>
              ) : (
                ministryQueue.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/80">
                    <td className="px-4 py-3 font-medium text-gray-900">{p.title}</td>
                    <td className="px-4 py-3 text-gray-600">{p.acCode}</td>
                    <td className="px-4 py-3 text-gray-600">{p.province}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => ministryApprove(p)}
                          className="rounded-lg bg-emerald-600 text-white text-xs font-medium px-3 py-1.5 hover:bg-emerald-700"
                        >
                          Approve
                        </button>
                        <div className="flex flex-col gap-1">
                          <select
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            className="text-xs border border-gray-200 rounded-lg px-2 py-1"
                          >
                            {REJECTION_REASONS.map((r) => (
                              <option key={r} value={r}>
                                {r}
                              </option>
                            ))}
                          </select>
                          <input
                            value={rejectText}
                            onChange={(e) => setRejectText(e.target.value)}
                            placeholder="Explanation (required)"
                            className="text-xs border border-gray-200 rounded-lg px-2 py-1 w-56"
                          />
                          <button
                            type="button"
                            onClick={() => ministryReject(p)}
                            className="rounded-lg bg-red-600 text-white text-xs font-medium px-3 py-1.5 hover:bg-red-700 w-fit"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {tab === "history" && (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 max-h-[520px] overflow-y-auto">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Permanent workflow history</h2>
          <ul className="space-y-4">
            {history.map((h) => (
              <li key={h.id} className="border-l-4 border-[#0F2F8F]/30 pl-4 text-sm">
                <span className="text-xs text-gray-400">{new Date(h.at).toLocaleString()}</span>
                <p className="font-medium text-gray-900 mt-1">{h.status}</p>
                <p className="text-gray-600 text-xs mt-0.5">{h.actor} · Plan {h.planId}</p>
                <p className="text-gray-500 mt-2">{h.note}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === "compare" && (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-900">Side-by-side target vs actual (illustrative)</h2>
          <div className="flex flex-wrap gap-3">
            <select
              value={compareA}
              onChange={(e) => setCompareA(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2"
            >
              {acOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              value={compareB}
              onChange={(e) => setCompareB(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2"
            >
              {acOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              value={compareYear}
              onChange={(e) => setCompareYear(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2"
            >
              <option>2026</option>
              <option>2025</option>
              <option>2024</option>
            </select>
            <select className="text-sm border border-gray-200 rounded-lg px-3 py-2">
              <option>All cooperative types</option>
              <option>Agricultural</option>
              <option>Horticulture</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-100 rounded-xl overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left px-3 py-2">Indicator</th>
                  <th className="text-left px-3 py-2">{compareA} target</th>
                  <th className="text-left px-3 py-2">{compareA} actual</th>
                  <th className="text-left px-3 py-2">{compareB} target</th>
                  <th className="text-left px-3 py-2">{compareB} actual</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  ["Member outreach (households)", "320", "298", "180", "172"],
                  ["Production volume (t)", "1,200", "1,050", "640", "610"],
                  ["Training sessions held", "12", "11", "8", "8"],
                  ["On-time milestone %", "90%", "84%", "88%", "82%"],
                ].map(([label, aT, aA, bT, bA]) => (
                  <tr key={label as string} className="hover:bg-gray-50/50">
                    <td className="px-3 py-2 font-medium text-gray-800">{label}</td>
                    <td className="px-3 py-2 text-gray-600">{aT}</td>
                    <td className="px-3 py-2 text-emerald-700">{aA}</td>
                    <td className="px-3 py-2 text-gray-600">{bT}</td>
                    <td className="px-3 py-2 text-emerald-700">{bA}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400">
            Filter by province, plan year, and cooperative type when connected to live analytics services.
          </p>
        </div>
      )}
    </div>
  );
}
