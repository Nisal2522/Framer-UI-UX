import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  Download,
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
      {
        key: "coop_profile",
        title: "1. COOPERATIVE PROFILE",
        reviewed: false,
        comment:
          "Prasat Sambor Rung Roeang Modern AC represents 447 active members across 8 communes. Core operations include collective input purchasing and seasonal rice aggregation.",
      },
      {
        key: "business_plan",
        title: "2. BUSINESS PLAN",
        reviewed: false,
        comment:
          "FY2026 plan targets 12% productivity growth via improved seed packages, training cycles, and buyer contracts with two regional millers.",
      },
      {
        key: "investment_plan",
        title: "3. INVESTMENT PLAN",
        reviewed: false,
        comment:
          "Priority investments: post-harvest dryers, moisture meters, and warehouse handling tools. Co-financing split: 70% grant / 30% member contribution.",
      },
      {
        key: "annexes",
        title: "4. ANNEXES",
        reviewed: false,
        comment:
          "Annex includes member registry summary, baseline yield table, draft procurement schedule, and quotation references.",
      },
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
      {
        key: "coop_profile",
        title: "1. COOPERATIVE PROFILE",
        reviewed: false,
        comment: "Stung Sen Agro Cooperative serves 382 members focused on maize and cassava rotation systems.",
      },
      {
        key: "business_plan",
        title: "2. BUSINESS PLAN",
        reviewed: false,
        comment: "Plan expands contract farming and introduces collective drying to reduce post-harvest losses by 10%.",
      },
      {
        key: "investment_plan",
        title: "3. INVESTMENT PLAN",
        reviewed: false,
        comment: "Requested assets include shelling machine upgrades, drying floor extension, and shared transport tools.",
      },
      {
        key: "annexes",
        title: "4. ANNEXES",
        reviewed: false,
        comment: "Supporting docs: buyer MoU draft, baseline production records, and training attendance sheet.",
      },
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
      {
        key: "annexes",
        title: "4. ANNEXES",
        reviewed: true,
        comment: "Annex packet uploaded with water-user committee minutes and site photos.",
      },
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
      {
        key: "coop_profile",
        title: "1. COOPERATIVE PROFILE",
        reviewed: false,
        comment: "Mekong Harvest Cooperative coordinates post-harvest handling services for 265 rice-producing households.",
      },
      {
        key: "business_plan",
        title: "2. BUSINESS PLAN",
        reviewed: false,
        comment: "Business model introduces village-level collection points and moisture-based pricing incentives.",
      },
      {
        key: "investment_plan",
        title: "3. INVESTMENT PLAN",
        reviewed: false,
        comment: "Proposed budget covers sorting tables, protective storage bins, and quality inspection equipment.",
      },
      {
        key: "annexes",
        title: "4. ANNEXES",
        reviewed: false,
        comment: "Annex includes logistics map, operational calendar, and partnership letters from three buyers.",
      },
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
      {
        key: "coop_profile",
        title: "1. COOPERATIVE PROFILE",
        reviewed: true,
        comment: "Prey Veng Seed Producer AC has 311 members and a certified local seed producer group.",
      },
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
      {
        key: "coop_profile",
        title: "1. COOPERATIVE PROFILE",
        reviewed: false,
        comment: "Takeo FreshLink Cooperative links 298 vegetable farmers to district and Phnom Penh wholesale markets.",
      },
      {
        key: "business_plan",
        title: "2. BUSINESS PLAN",
        reviewed: false,
        comment: "Core strategy is to improve shelf-life and scheduling with cold-chain handling and coordinated dispatch.",
      },
      {
        key: "investment_plan",
        title: "3. INVESTMENT PLAN",
        reviewed: false,
        comment: "Investment package requests modular cold rooms, crates, and handling equipment for two hubs.",
      },
      {
        key: "annexes",
        title: "4. ANNEXES",
        reviewed: false,
        comment: "Annex includes produce volume trend, route plan, and letters of intent from buyers.",
      },
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
      {
        key: "coop_profile",
        title: "1. COOPERATIVE PROFILE",
        reviewed: false,
        comment: "Banteay Meanchey Agro Cluster AC organizes cassava collection and primary processing for 340 members.",
      },
      {
        key: "business_plan",
        title: "2. BUSINESS PLAN",
        reviewed: false,
        comment: "Plan aims to increase value retention via improved chip quality and better negotiated offtake terms.",
      },
      {
        key: "investment_plan",
        title: "3. INVESTMENT PLAN",
        reviewed: false,
        comment: "Requested equipment includes chipping line upgrades, moisture control tools, and yard paving.",
      },
      {
        key: "annexes",
        title: "4. ANNEXES",
        reviewed: false,
        comment: "Annex set contains production baselines, environmental checklist, and indicative quotations.",
      },
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
      {
        key: "investment_plan",
        title: "3. INVESTMENT PLAN",
        reviewed: false,
        comment: "Provide revised capex table with seed-cleaning line maintenance and depreciation assumptions.",
      },
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
      {
        key: "coop_profile",
        title: "1. COOPERATIVE PROFILE",
        reviewed: false,
        comment: "Kampong Speu Green Water AC serves 226 members in dry-season cropping zones using shared pump assets.",
      },
      {
        key: "business_plan",
        title: "2. BUSINESS PLAN",
        reviewed: false,
        comment: "Business plan scales solar pumping to cut fuel cost and stabilize water availability in peak periods.",
      },
      {
        key: "investment_plan",
        title: "3. INVESTMENT PLAN",
        reviewed: false,
        comment: "Requested support covers pump arrays, control units, and technician training with O&M scheduling.",
      },
      {
        key: "annexes",
        title: "4. ANNEXES",
        reviewed: false,
        comment: "Annex includes borehole mapping, usage projections, and safeguard screening notes.",
      },
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
      {
        key: "coop_profile",
        title: "1. COOPERATIVE PROFILE",
        reviewed: true,
        comment: "Pursat Collective Storage AC coordinates temporary storage and aggregation for 289 member households.",
      },
      { key: "business_plan", title: "2. BUSINESS PLAN", reviewed: true, comment: "Clarify utilization assumptions." },
      { key: "investment_plan", title: "3. INVESTMENT PLAN", reviewed: false, comment: "Update unit cost references." },
      {
        key: "annexes",
        title: "4. ANNEXES",
        reviewed: false,
        comment: "Attach final warehouse layout, insurance details, and service fee policy.",
      },
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
  {
    id: "bp-1012",
    title: "Business Plan FY 2026 — Mechanized land prep",
    acCode: "AC-KT-2022-114",
    acName: "Baray Mechanization Cooperative",
    chairman: "Thy Chansok",
    planYear: "2026",
    coopType: "Agricultural",
    province: "Kampong Thom",
    status: "pending_ministry",
    sections: [
      { key: "coop_profile", title: "1. COOPERATIVE PROFILE", reviewed: true, comment: "Verified member register and governance structure." },
      { key: "business_plan", title: "2. BUSINESS PLAN", reviewed: true, comment: "Demand forecast validated with service booking records." },
      { key: "investment_plan", title: "3. INVESTMENT PLAN", reviewed: true, comment: "Capex and O&M assumptions reviewed and accepted." },
      { key: "annexes", title: "4. ANNEXES", reviewed: true, comment: "Annex pack complete with quotations and safeguards checklist." },
    ],
  },
  {
    id: "bp-1013",
    title: "Business Plan FY 2026 — Dry-season rice expansion",
    acCode: "AC-PV-2023-173",
    acName: "Prey Veng Delta Rice AC",
    chairman: "Kosal Mean",
    planYear: "2026",
    coopType: "Rice",
    province: "Prey Veng",
    status: "pending_ministry",
    sections: [
      { key: "coop_profile", title: "1. COOPERATIVE PROFILE", reviewed: true, comment: "Committee profile and member contribution records confirmed." },
      { key: "business_plan", title: "2. BUSINESS PLAN", reviewed: true, comment: "Buyer commitments and revenue model checked by support team." },
      { key: "investment_plan", title: "3. INVESTMENT PLAN", reviewed: true, comment: "Irrigation and storage investments aligned with workplan." },
      { key: "annexes", title: "4. ANNEXES", reviewed: true, comment: "All annex attachments validated and signed." },
    ],
  },
  {
    id: "bp-1014",
    title: "Business Plan FY 2026 — Feed mill modernization",
    acCode: "AC-BB-2021-061",
    acName: "Battambang Feed Producers AC",
    chairman: "Vireak Neary",
    planYear: "2026",
    coopType: "Livestock",
    province: "Battambang",
    status: "pending_ministry",
    sections: [
      { key: "coop_profile", title: "1. COOPERATIVE PROFILE", reviewed: true, comment: "Legal profile and board approvals complete." },
      { key: "business_plan", title: "2. BUSINESS PLAN", reviewed: true, comment: "Market and pricing assumptions cross-checked with prior year data." },
      { key: "investment_plan", title: "3. INVESTMENT PLAN", reviewed: true, comment: "Equipment specification and financing terms finalized." },
      { key: "annexes", title: "4. ANNEXES", reviewed: true, comment: "Compliance documents and supplier letters attached." },
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
    {
      id: "h1",
      at: "2026-03-20T13:25:00",
      actor: "Support Team — Nget Bopha",
      status: "Under review",
      note: "Eligibility and mandatory annex checklist started.",
      planId: "bp-1001",
    },
    {
      id: "h2",
      at: "2026-03-21T09:18:00",
      actor: "Support Team — Somaly Chenda",
      status: "Revision requested",
      note: "Please revise cashflow assumptions and attach supplier quotation for warehouse materials.",
      planId: "bp-1001",
    },
    {
      id: "h3",
      at: "2026-03-22T16:45:00",
      actor: "Chairman — Sokha Dara",
      status: "Resubmitted → Support queue",
      note: "Updated 3-year cashflow and uploaded signed supplier quotations.",
      planId: "bp-1001",
    },
    {
      id: "h4",
      at: "2026-03-23T10:32:00",
      actor: "Support Team — Nget Bopha",
      status: "Forwarded to Ministry / FAO",
      note: "All section reviews completed and recommendation submitted.",
      planId: "bp-1001",
    },
    {
      id: "h5",
      at: "2026-03-24T14:10:00",
      actor: "Ministry / FAO — Vanna Meas",
      status: "Approved",
      note: "Approved for FY 2026 implementation and disbursement planning.",
      planId: "bp-1001",
    },
    {
      id: "h6",
      at: "2026-03-24T09:05:00",
      actor: "Support Team — Chan Sreypov",
      status: "Submitted → Support queue",
      note: "Business plan package received with board signatures.",
      planId: "bp-1008",
    },
    {
      id: "h7",
      at: "2026-03-25T11:40:00",
      actor: "Support Team — Chan Sreypov",
      status: "Forwarded to Ministry / FAO",
      note: "Support due diligence passed with minor formatting corrections.",
      planId: "bp-1008",
    },
    {
      id: "h8",
      at: "2026-03-26T15:20:00",
      actor: "Ministry / FAO — Channary Keo",
      status: "Rejected",
      note: "Rejected due to unresolved co-financing commitment letter.",
      planId: "bp-1008",
    },
    {
      id: "h9",
      at: "2026-03-27T08:55:00",
      actor: "Support Team — Vichea Rath",
      status: "Under review",
      note: "Cross-checking member contribution records before ministry submission.",
      planId: "bp-1012",
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
  const [expandedHistoryPlans, setExpandedHistoryPlans] = useState<string[]>(["bp-1001"]);
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
  const historyByPlan = useMemo(() => {
    const planMap = new Map(plans.map((p) => [p.id, p]));
    const grouped = new Map<string, HistoryRow[]>();
    for (const row of history) {
      if (!grouped.has(row.planId)) grouped.set(row.planId, []);
      grouped.get(row.planId)!.push(row);
    }
    const planHistory = Array.from(grouped.entries())
      .map(([planId, rows]) => {
        const timeline = [...rows]
          .sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime())
          .map((row, index, arr) => {
            const priorRevisions = arr
              .slice(0, index + 1)
              .filter((x) => x.status.toLowerCase().includes("revision requested")).length;
            const revisionNo = row.status.toLowerCase().includes("revision requested") ? priorRevisions : null;
            return { ...row, revisionNo, stepNo: index + 1 };
          });
        const latestAt = timeline[timeline.length - 1]?.at ?? "";
        return { plan: planMap.get(planId), timeline, latestAt };
      })
      .filter((entry) => entry.plan)
      .sort((a, b) => new Date(b.latestAt).getTime() - new Date(a.latestAt).getTime());
    return planHistory;
  }, [history, plans]);

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

  const getHistoryVisual = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("approved")) {
      return {
        nodeClass: "bg-emerald-600",
        cardBorder: "border-emerald-200",
        cardBg: "bg-emerald-50/50",
        titleClass: "text-emerald-900",
        Icon: CheckCircle2,
      };
    }
    if (s.includes("rejected")) {
      return {
        nodeClass: "bg-red-600",
        cardBorder: "border-red-200",
        cardBg: "bg-red-50/50",
        titleClass: "text-red-900",
        Icon: AlertCircle,
      };
    }
    if (s.includes("revision")) {
      return {
        nodeClass: "bg-amber-500",
        cardBorder: "border-amber-200",
        cardBg: "bg-amber-50/50",
        titleClass: "text-amber-900",
        Icon: FileText,
      };
    }
    return {
      nodeClass: "bg-[#0F2F8F]",
      cardBorder: "border-blue-200",
      cardBg: "bg-blue-50/50",
      titleClass: "text-[#0F2F8F]",
      Icon: Clock3,
    };
  };

  const initialsFromActor = (actor: string) => {
    const clean = actor.split("—").pop()?.trim() ?? actor;
    const parts = clean.split(" ").filter(Boolean);
    if (parts.length === 0) return "NA";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
  };
  const toggleHistoryPlan = (planId: string) => {
    setExpandedHistoryPlans((prev) => (prev.includes(planId) ? prev.filter((id) => id !== planId) : [...prev, planId]));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Business plan management</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {(
              [
                ["support", "Support Team Review", MessageSquare],
                ["ministry", "Ministry / FAO Decision", ShieldCheck],
                ["history", "Approval History", History],
                ["compare", "Plan Comparison", GitCompare],
              ] as const
            ).map(([key, label, Icon]) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={`inline-flex items-center gap-1.5 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                  tab === key
                    ? "text-[#032EA1] border-b-2 border-[#032EA1]"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="p-4 sm:p-6">

      {tab === "support" && (
        <div className="flex overflow-x-auto">
          <div className="grid w-full min-w-[980px] lg:min-w-0 lg:grid-cols-12 gap-6">
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
        </div>
      )}

      {tab === "ministry" && (
        <div className="w-full min-w-0 rounded-2xl border border-gray-200/80 bg-white shadow-[0_4px_24px_-4px_rgba(3,46,161,0.08),0_2px_8px_-2px_rgba(0,0,0,0.06)] overflow-hidden">
          <table className="w-full table-fixed border-collapse text-left text-sm">
            <colgroup>
              <col className="w-[30%]" />
              <col className="w-[14%]" />
              <col className="w-[20%]" />
              <col className="w-[12%]" />
              <col className="w-[24%]" />
            </colgroup>
            <thead>
              <tr className="bg-gradient-to-r from-[#032EA1]/[0.07] via-[#032EA1]/[0.04] to-transparent border-b border-[#032EA1]/15">
                <th className="px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#032EA1]">Plan</th>
                <th className="px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#032EA1]">AC</th>
                <th className="px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#032EA1]">AC Name</th>
                <th className="px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#032EA1]">Province</th>
                <th className="px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#032EA1]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {ministryQueue.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No plans pending ministry approval.
                  </td>
                </tr>
              ) : (
                ministryQueue.map((p, rowIdx) => (
                  <tr
                    key={p.id}
                    className={`${rowIdx % 2 === 0 ? "bg-white" : "bg-slate-50/60"} hover:bg-[#032EA1]/[0.04]`}
                  >
                    <td className="px-3 py-2.5 align-middle">
                      <span className="text-sm font-semibold text-gray-900">{p.title}</span>
                    </td>
                    <td className="px-3 py-2.5 align-middle">
                      <span className="inline-flex font-mono text-xs font-semibold text-[#032EA1] bg-[#032EA1]/8 px-2 py-0.5 rounded-md border border-[#032EA1]/10">
                        {p.acCode}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 align-middle text-gray-700">{p.acName}</td>
                    <td className="px-3 py-2.5 align-middle text-gray-700">{p.province}</td>
                    <td className="px-3 py-2.5 align-middle">
                      <div className="flex flex-col gap-1.5">
                        <select
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          className="w-56 text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white text-gray-700"
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
                          className="w-56 text-xs border border-gray-200 rounded-lg px-2.5 py-1.5"
                        />
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => ministryApprove(p)}
                            className="rounded-lg bg-emerald-600 text-white text-xs font-medium px-3 py-1.5 hover:bg-emerald-700 shadow-sm"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => ministryReject(p)}
                            className="rounded-lg bg-red-600 text-white text-xs font-medium px-3 py-1.5 hover:bg-red-700 shadow-sm"
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
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-800">Permanent workflow history</h2>
            <button
              type="button"
              onClick={() => toast.message("History export prepared (demo).")}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              <Download className="h-3.5 w-3.5" />
              Download report
            </button>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {historyByPlan.length === 0 ? (
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
                No workflow history yet.
              </div>
            ) : (
              historyByPlan.map(({ plan, timeline }) => {
                const isOpen = expandedHistoryPlans.includes(plan!.id);
                const latest = timeline[timeline.length - 1];
                return (
                  <div key={plan!.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                    <button
                      type="button"
                      onClick={() => toggleHistoryPlan(plan!.id)}
                      className="flex w-full items-center justify-between gap-3 bg-slate-50 px-4 py-3 text-left hover:bg-slate-100"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-900">{plan!.title}</p>
                        <p className="mt-0.5 text-xs text-gray-500">
                          <span className="font-mono">{plan!.id}</span> • {plan!.acCode} • {timeline.length} events
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="hidden rounded-md bg-white px-2 py-0.5 text-[11px] text-slate-600 sm:inline">
                          Last update: {new Date(latest.at).toLocaleDateString()}
                        </span>
                        {isOpen ? (
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-gray-500" />
                        )}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="p-3">
                        <div className="relative space-y-2">
                          <div className="absolute bottom-2 left-[13px] top-2 w-px bg-slate-200" />
                          {timeline.map((h) => {
                          const visual = getHistoryVisual(h.status);
                          const StatusIcon = visual.Icon;
                          return (
                            <div key={h.id} className="relative flex gap-3">
                              <span
                                className={`relative z-10 mt-3 inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full ring-2 ring-white ${visual.nodeClass}`}
                              />
                              <div className={`flex-1 rounded-lg border p-3 ${visual.cardBorder} ${visual.cardBg}`}>
                                <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                                  <p className={`inline-flex items-center gap-1.5 text-sm font-semibold ${visual.titleClass}`}>
                                    <StatusIcon className="h-3.5 w-3.5" />
                                    {h.status}
                                    {h.revisionNo ? (
                                      <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                                        Revision {h.revisionNo}
                                      </span>
                                    ) : null}
                                  </p>
                                  <time className="text-xs text-slate-500">{new Date(h.at).toLocaleString()}</time>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-100 px-1 font-semibold text-blue-700">
                                    {initialsFromActor(h.actor)}
                                  </span>
                                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-slate-600">{h.actor}</span>
                                  <span className="text-slate-300">•</span>
                                  <span className="font-mono text-slate-500">Step {h.stepNo}</span>
                                </div>
                                <p className="mt-2 text-xs italic text-slate-500">{h.note}</p>
                              </div>
                            </div>
                          );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
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
      </div>
    </div>
  );
}
