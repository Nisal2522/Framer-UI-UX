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
  Search,
  Send,
  ShieldCheck,
  User,
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
    title: "Business Plan FY 2026 — Maize value chain",
    acCode: "AC-KT-2024-091",
    acName: "Stung Sen Agro Cooperative",
    chairman: "Chhorn Dara",
    planYear: "2026",
    coopType: "Agricultural",
    province: "Kampong Thom",
    status: "submitted_support",
    sections: [
      { key: "coop_profile", title: "1. COOPERATIVE PROFILE", reviewed: false, comment: "" },
      { key: "business_plan", title: "2. BUSINESS PLAN", reviewed: false, comment: "" },
      { key: "investment_plan", title: "3. INVESTMENT PLAN", reviewed: false, comment: "" },
      { key: "annexes", title: "4. ANNEXES", reviewed: false, comment: "" },
    ],
  },
  {
    id: "bp-1003",
    title: "Business Plan FY 2026 — Irrigation upgrade",
    acCode: "AC-KD-2023-031",
    acName: "Kandal Green Water Users AC",
    chairman: "Vannak Kim",
    planYear: "2026",
    coopType: "Agricultural",
    province: "Kandal",
    status: "revision_requested",
    sections: [
      { key: "coop_profile", title: "1. COOPERATIVE PROFILE", reviewed: true, comment: "Member records updated." },
      { key: "business_plan", title: "2. BUSINESS PLAN", reviewed: false, comment: "Revise market assumptions." },
      { key: "investment_plan", title: "3. INVESTMENT PLAN", reviewed: false, comment: "Clarify procurement timeline." },
      { key: "annexes", title: "4. ANNEXES", reviewed: true, comment: "" },
    ],
  },
  {
    id: "bp-1004",
    title: "Business Plan FY 2026 — Post-harvest handling",
    acCode: "AC-KC-2022-204",
    acName: "Mekong Harvest Cooperative",
    chairman: "Srey Pov",
    planYear: "2026",
    coopType: "Rice",
    province: "Kampong Cham",
    status: "submitted_support",
    sections: [
      { key: "coop_profile", title: "1. COOPERATIVE PROFILE", reviewed: false, comment: "" },
      { key: "business_plan", title: "2. BUSINESS PLAN", reviewed: false, comment: "" },
      { key: "investment_plan", title: "3. INVESTMENT PLAN", reviewed: false, comment: "" },
      { key: "annexes", title: "4. ANNEXES", reviewed: false, comment: "" },
    ],
  },
  {
    id: "bp-1005",
    title: "Business Plan FY 2026 — Seed multiplication",
    acCode: "AC-PV-2024-066",
    acName: "Prey Veng Seed Producer AC",
    chairman: "Leng Sopheak",
    planYear: "2026",
    coopType: "Seeds",
    province: "Prey Veng",
    status: "revision_requested",
    sections: [
      { key: "coop_profile", title: "1. COOPERATIVE PROFILE", reviewed: true, comment: "" },
      { key: "business_plan", title: "2. BUSINESS PLAN", reviewed: true, comment: "Add updated pricing scenario." },
      { key: "investment_plan", title: "3. INVESTMENT PLAN", reviewed: false, comment: "Missing maintenance costs." },
      { key: "annexes", title: "4. ANNEXES", reviewed: false, comment: "Upload supporting quotations." },
    ],
  },
  {
    id: "bp-1006",
    title: "Business Plan FY 2026 — Vegetable cold chain",
    acCode: "AC-TO-2023-077",
    acName: "Takeo FreshLink Cooperative",
    chairman: "Sokha Ry",
    planYear: "2026",
    coopType: "Horticulture",
    province: "Takeo",
    status: "submitted_support",
    sections: [
      { key: "coop_profile", title: "1. COOPERATIVE PROFILE", reviewed: false, comment: "" },
      { key: "business_plan", title: "2. BUSINESS PLAN", reviewed: false, comment: "" },
      { key: "investment_plan", title: "3. INVESTMENT PLAN", reviewed: false, comment: "" },
      { key: "annexes", title: "4. ANNEXES", reviewed: false, comment: "" },
    ],
  },
  {
    id: "bp-1008",
    title: "Business Plan FY 2026 — Cassava processing unit",
    acCode: "AC-BM-2024-052",
    acName: "Banteay Meanchey Agro Cluster AC",
    chairman: "Narin Chenda",
    planYear: "2026",
    coopType: "Cassava",
    province: "Banteay Meanchey",
    status: "submitted_support",
    sections: [
      { key: "coop_profile", title: "1. COOPERATIVE PROFILE", reviewed: false, comment: "" },
      { key: "business_plan", title: "2. BUSINESS PLAN", reviewed: false, comment: "" },
      { key: "investment_plan", title: "3. INVESTMENT PLAN", reviewed: false, comment: "" },
      { key: "annexes", title: "4. ANNEXES", reviewed: false, comment: "" },
    ],
  },
  {
    id: "bp-1009",
    title: "Business Plan FY 2026 — Rice seed center",
    acCode: "AC-KP-2023-119",
    acName: "Kampot Seed Improvement AC",
    chairman: "Sokun Thy",
    planYear: "2026",
    coopType: "Seeds",
    province: "Kampot",
    status: "revision_requested",
    sections: [
      { key: "coop_profile", title: "1. COOPERATIVE PROFILE", reviewed: true, comment: "Update member share table." },
      { key: "business_plan", title: "2. BUSINESS PLAN", reviewed: false, comment: "Need stronger buyer contracts." },
      { key: "investment_plan", title: "3. INVESTMENT PLAN", reviewed: false, comment: "" },
      { key: "annexes", title: "4. ANNEXES", reviewed: false, comment: "Attach quotation sheets." },
    ],
  },
  {
    id: "bp-1010",
    title: "Business Plan FY 2026 — Solar pumping expansion",
    acCode: "AC-KM-2022-043",
    acName: "Kampong Speu Green Water AC",
    chairman: "Ratha Lim",
    planYear: "2026",
    coopType: "Irrigation",
    province: "Kampong Speu",
    status: "submitted_support",
    sections: [
      { key: "coop_profile", title: "1. COOPERATIVE PROFILE", reviewed: false, comment: "" },
      { key: "business_plan", title: "2. BUSINESS PLAN", reviewed: false, comment: "" },
      { key: "investment_plan", title: "3. INVESTMENT PLAN", reviewed: false, comment: "" },
      { key: "annexes", title: "4. ANNEXES", reviewed: false, comment: "" },
    ],
  },
  {
    id: "bp-1011",
    title: "Business Plan FY 2026 — Community storage hubs",
    acCode: "AC-PS-2024-208",
    acName: "Pursat Collective Storage AC",
    chairman: "Mony Rath",
    planYear: "2026",
    coopType: "Post-harvest",
    province: "Pursat",
    status: "revision_requested",
    sections: [
      { key: "coop_profile", title: "1. COOPERATIVE PROFILE", reviewed: true, comment: "" },
      { key: "business_plan", title: "2. BUSINESS PLAN", reviewed: true, comment: "Clarify utilization assumptions." },
      { key: "investment_plan", title: "3. INVESTMENT PLAN", reviewed: false, comment: "Update unit cost references." },
      { key: "annexes", title: "4. ANNEXES", reviewed: false, comment: "" },
    ],
  },
  {
    id: "bp-1007",
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
  const [supportSearch, setSupportSearch] = useState("");
  const [supportPage, setSupportPage] = useState(1);
  // BusinessPlanTemplate accordion state (matches AC user's template structure)
  const [expandedSections, setExpandedSections] = useState<string[]>(["1"]);
  const [expandedSubsections, setExpandedSubsections] = useState<string[]>([]);

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

  const toggleSubsection = (id: string) =>
    setExpandedSubsections((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));

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
  const supportQueueFiltered = useMemo(() => {
    const q = supportSearch.trim().toLowerCase();
    if (!q) return supportQueue;
    return supportQueue.filter((p) =>
      [p.title, p.acCode, p.chairman, p.province].join(" ").toLowerCase().includes(q)
    );
  }, [supportQueue, supportSearch]);

  // Show up to 10 at once; if there are more, keep navigation clean with paging.
  const supportPageSize = 10;
  const supportTotalPages = Math.max(1, Math.ceil(supportQueueFiltered.length / supportPageSize));
  const currentSupportPage = Math.min(supportPage, supportTotalPages);
  const supportQueuePage = supportQueueFiltered.slice(
    (currentSupportPage - 1) * supportPageSize,
    currentSupportPage * supportPageSize
  );
  const supportRangeStart =
    supportQueueFiltered.length === 0 ? 0 : (currentSupportPage - 1) * supportPageSize + 1;
  const supportRangeEnd = Math.min(currentSupportPage * supportPageSize, supportQueueFiltered.length);

  const acOptions = [...new Set(plans.map((p) => p.acCode))];
  const reviewedCount = selected ? selected.sections.filter((s) => s.reviewed).length : 0;
  const completionPct = selected ? Math.round((reviewedCount / selected.sections.length) * 100) : 0;

  type TemplateSubsection = { id: string; number: string; title: string };
  type TemplateSection = { id: string; number: string; title: string; subsections: TemplateSubsection[] };

  // Keep the admin template UI identical to the AC user's BusinessPlanTemplate structure.
  const templateSections: TemplateSection[] = [
    {
      id: "1",
      number: "1",
      title: "COOPERATIVE PROFILE",
      subsections: [
        { id: "1.1", number: "1.1", title: "WHO WE ARE" },
        { id: "1.2", number: "1.2", title: "WHAT WE DO" },
      ],
    },
    {
      id: "2",
      number: "2",
      title: "BUSINESS PLAN",
      subsections: [
        { id: "2.1", number: "2.1", title: "BUSINESS OVERVIEW" },
        { id: "2.2", number: "2.2", title: "OUR MARKET & BUYERS" },
        { id: "2.3", number: "2.3", title: "FINANCE" },
        { id: "2.4", number: "2.4", title: "IMPLEMENTATION PLAN" },
        { id: "2.5", number: "2.5", title: "MANAGING RISKS" },
        { id: "2.6", number: "2.6", title: "ENVIRONMENT & SOCIAL RESPONSIBILITY" },
        { id: "2.7", number: "2.7", title: "HOW WE'LL TRACK PROGRESS" },
        { id: "2.8", number: "2.8", title: "WHAT HAPPENS NEXT?" },
      ],
    },
    {
      id: "3",
      number: "3",
      title: "INVESTMENT PLAN",
      subsections: [
        { id: "3.1", number: "3.1", title: "APPLICATION SUMMARY" },
        { id: "3.2", number: "3.2", title: "ASSET DETAILS" },
        { id: "3.3", number: "3.3", title: "CONTRIBUTION OF MEMBERS" },
        { id: "3.4", number: "3.4", title: "MAINTENANCE OF THE EQUIPMENT" },
        { id: "3.5", number: "3.5", title: "SAFEGUARDS & ACCESS" },
        { id: "3.6", number: "3.6", title: "COMMITMENTS & APPROVAL" },
      ],
    },
    { id: "4", number: "4", title: "ANNEXES", subsections: [] },
  ];

  const sectionThemes: Record<
    string,
    { border: string; bg: string; accent: string }
  > = {
    "1": { border: "border-l-sky-500", bg: "bg-sky-50/70", accent: "text-sky-700" },
    "2": { border: "border-l-violet-500", bg: "bg-violet-50/70", accent: "text-violet-700" },
    "3": { border: "border-l-emerald-500", bg: "bg-emerald-50/70", accent: "text-emerald-700" },
    "4": { border: "border-l-amber-500", bg: "bg-amber-50/70", accent: "text-amber-700" },
  };

  const adminKeyByTemplateId: Record<string, string> = {
    "1": "coop_profile",
    "2": "business_plan",
    "3": "investment_plan",
    "4": "annexes",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Business plan management</h1>
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
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 shadow-sm">
              <div className="mb-3 flex items-center gap-2 px-1">
                <h2 className="text-sm font-semibold text-gray-900">Review Queue</h2>
              </div>
              <div className="relative mb-3">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={supportSearch}
                  onChange={(e) => {
                    setSupportSearch(e.target.value);
                    setSupportPage(1);
                  }}
                  placeholder="Search plan, AC code, chairman..."
                  className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 outline-none ring-0 placeholder:text-slate-400 focus:border-[#0F2F8F]/40"
                />
              </div>

              <div className="space-y-2">
                {supportQueueFiltered.length === 0 ? (
                  <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-gray-500">
                    No matching plans in support review.
                  </p>
                ) : (
                  supportQueuePage.map((p) => {
                    const active = selectedId === p.id;
                    const isRevision = p.status === "revision_requested";
                    const statusText = isRevision ? "Revision cycle" : "Submitted";
                    const statusTone = isRevision
                      ? "bg-amber-100 text-amber-800 border-amber-200"
                      : "bg-emerald-100 text-emerald-800 border-emerald-200";
                    const leftStripe = isRevision ? "border-l-amber-500" : "border-l-emerald-500";
                    const shortTitle = p.title.replace(/^Business Plan FY \d{4}\s+—\s+/i, "");
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedId(p.id)}
                        className={`w-full rounded-xl border border-slate-200 border-l-4 ${leftStripe} bg-white p-3 text-left transition-all ${
                          active
                            ? "shadow-[0_10px_15px_-3px_rgb(0_0_0/0.10)] ring-1 ring-[#0F2F8F]/25"
                            : "hover:shadow-sm hover:border-slate-300"
                        }`}
                      >
                        <div className="mb-1.5 flex items-start justify-between gap-3">
                          <p className="min-w-0 truncate text-[15px] font-semibold text-slate-900">{shortTitle}</p>
                          <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${statusTone}`}>
                            {statusText}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-1.5">
                          <FileText className="h-3.5 w-3.5 text-slate-400" />
                          <span className="tabular-nums">{p.acCode}</span>
                          <span className="text-slate-300">•</span>
                          <User className="h-3.5 w-3.5 text-slate-400" />
                          <span>{p.chairman}</span>
                        </p>
                      </button>
                    );
                  })
                )}
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3 text-xs text-slate-500">
                <button
                  type="button"
                  onClick={() => setSupportPage((p) => Math.max(1, p - 1))}
                  disabled={currentSupportPage <= 1}
                  className="rounded-md border border-slate-200 bg-white px-2.5 py-1 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>
                <span>
                  {supportRangeStart}-{supportRangeEnd} of {supportQueueFiltered.length}
                </span>
                <button
                  type="button"
                  onClick={() => setSupportPage((p) => Math.min(supportTotalPages, p + 1))}
                  disabled={currentSupportPage >= supportTotalPages}
                  className="rounded-md border border-slate-200 bg-white px-2.5 py-1 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
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
                  <h3 className="font-semibold text-gray-900 mb-2">Review Progress</h3>
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
                          onClick={() => {
                            setExpandedSections(templateSections.map((s) => s.id));
                            setExpandedSubsections([]);
                          }}
                          className="px-2.5 py-1 text-xs font-medium border border-gray-300 rounded-md text-gray-700 hover:bg-white transition-colors"
                        >
                          Expand all
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setExpandedSections([]);
                            setExpandedSubsections([]);
                          }}
                          className="px-2.5 py-1 text-xs font-medium border border-gray-300 rounded-md text-gray-700 hover:bg-white transition-colors"
                        >
                          Collapse all
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="divide-y divide-gray-200">
                    {templateSections.map((section) => {
                      const adminKey = adminKeyByTemplateId[section.id];
                      const adminSection = selected.sections.find((s) => s.key === adminKey) ?? null;
                      const isOpen = expandedSections.includes(section.id);
                      const isCompleted = Boolean(adminSection?.reviewed);
                      const theme = sectionThemes[section.id];

                      return (
                        <div key={section.id}>
                          <div
                            className={`w-full px-4 py-3 border-l-4 ${theme.border} ${
                              isOpen ? theme.bg : "bg-white"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedSections((prev) =>
                                    prev.includes(section.id)
                                      ? prev.filter((k) => k !== section.id)
                                      : [...prev, section.id]
                                  )
                                }
                                className="min-w-0 flex-1 flex items-center gap-3 text-left hover:opacity-90 transition-opacity"
                              >
                                {isOpen ? (
                                  <ChevronDown className="w-5 h-5 text-gray-600 shrink-0" />
                                ) : (
                                  <ChevronRight className="w-5 h-5 text-gray-600 shrink-0" />
                                )}
                                <span className="font-semibold text-gray-900 truncate">
                                  {section.number}. {section.title}
                                </span>
                              </button>

                              <div className="flex items-center gap-2 shrink-0">
                                <span
                                  className={`text-[11px] px-2 py-1 rounded-md font-medium ${
                                    isCompleted ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                                  }`}
                                >
                                  {isCompleted ? "Completed" : "Pending"}
                                </span>

                                <button
                                  type="button"
                                  onClick={() =>
                                    toggleSectionReviewed(selected.id, adminKey, !isCompleted)
                                  }
                                  className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${
                                    isCompleted
                                      ? "text-amber-700 border-amber-300 hover:bg-amber-50"
                                      : "text-emerald-700 border-emerald-400 hover:bg-emerald-50"
                                  }`}
                                >
                                  {isCompleted ? "Mark Unreview" : "Mark Review"}
                                </button>
                              </div>
                            </div>
                          </div>

                          {isOpen && (
                            <div className="bg-gray-50 px-6 py-4">
                              {section.subsections && section.subsections.length > 0 ? (
                                <div className="space-y-1">
                                  {section.subsections.map((sub) => {
                                    const isSubOpen = expandedSubsections.includes(sub.id);
                                    return (
                                      <div
                                        key={sub.id}
                                        className="border border-gray-200 rounded-lg overflow-hidden bg-white"
                                      >
                                        <button
                                          type="button"
                                          onClick={() => toggleSubsection(sub.id)}
                                          className="w-full px-4 py-3 flex items-center justify-between gap-3 hover:bg-gray-50 transition-colors text-left"
                                        >
                                          <span className="flex items-center gap-2 min-w-0">
                                            {isSubOpen ? (
                                              <ChevronDown className="w-4 h-4 text-gray-600 shrink-0" />
                                            ) : (
                                              <ChevronRight className="w-4 h-4 text-gray-600 shrink-0" />
                                            )}
                                            <span className="font-medium text-gray-900 truncate">
                                              {sub.number}. {sub.title}
                                            </span>
                                          </span>
                                        </button>

                                        {isSubOpen && (
                                          <div className="px-4 pb-4">
                                            <textarea
                                              placeholder={`Enter details for ${sub.title}...`}
                                              value={adminSection?.comment ?? ""}
                                              onChange={(e) =>
                                                setSectionComment(selected.id, adminKey, e.target.value)
                                              }
                                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none resize-none"
                                              rows={4}
                                            />
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                  <textarea
                                    placeholder={`Enter details for ${section.title}...`}
                                    value={adminSection?.comment ?? ""}
                                    onChange={(e) =>
                                      setSectionComment(selected.id, adminKey, e.target.value)
                                    }
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none resize-none"
                                    rows={6}
                                  />
                                </div>
                              )}
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
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={requestRevision}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 text-white text-sm font-medium px-4 py-2 hover:bg-amber-700"
                    >
                      <Send className="h-4 w-4" />
                      Request revision
                    </button>
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
