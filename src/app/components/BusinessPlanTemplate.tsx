import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  Save,
  Send,
  Download,
  AlertCircle,
  Plus,
  ArrowLeft,
  CheckCircle2,
  Clock,
  XCircle,
  FileEdit,
  Eye,
  Calendar,
  TrendingUp,
  Search,
  Filter,
} from "lucide-react";

// ─── Past plans data ───────────────────────────────────────────────────────────

const pastPlans = [
  {
    id: "BP-2025-001",
    title: "Agricultural Growth Plan 2025",
    status: "Draft",
    submittedDate: null,
    approvedDate: null,
    budget: "$55,000",
    progress: 0,
    reviewer: "Not Assigned",
  },
  {
    id: "BP-2023-001",
    title: "Rice Production Expansion 2023",
    status: "Approved",
    submittedDate: "2023-02-10",
    approvedDate: "2023-03-01",
    budget: "$42,000",
    progress: 100,
    reviewer: "Ministry Committee",
  },
  {
    id: "BP-2022-047",
    title: "Organic Certification Drive 2022",
    status: "Approved",
    submittedDate: "2022-04-15",
    approvedDate: "2022-05-20",
    budget: "$19,500",
    progress: 100,
    reviewer: "Business Plan Support Team",
  },
  {
    id: "BP-2023-089",
    title: "Irrigation Infrastructure Upgrade",
    status: "Rejected",
    submittedDate: "2023-09-05",
    approvedDate: null,
    budget: "$67,000",
    progress: 0,
    reviewer: "Ministry Committee",
  },
  {
    id: "BP-2024-015",
    title: "Climate-Resilient Farming Initiative",
    status: "Approved",
    submittedDate: "2024-02-20",
    approvedDate: "2024-03-05",
    budget: "$62,000",
    progress: 42,
    reviewer: "Ministry Committee",
  },
  {
    id: "BP-2024-042",
    title: "Organic Vegetable Production",
    status: "Under Review",
    submittedDate: "2024-03-10",
    approvedDate: null,
    budget: "$28,500",
    progress: 0,
    reviewer: "Business Plan Support Team",
  },
];

const planPrefillById: Record<string, Record<string, string>> = {
  "BP-2025-001": {
    "1.1": "Prasat Sambor Rung Roeang Modern AC is a farmer-led cooperative focused on rice and mixed-crop production in Kampong Thom.",
    "1.2": "We aggregate produce, provide member services, and coordinate input purchasing for 447 active members.",
    "2.1": "2025 objective: improve productivity by 12% while reducing post-harvest losses through better handling.",
    "2.2": "Primary buyers include district millers and two provincial wholesalers under seasonal agreements.",
    "2.3": "Estimated annual budget: $55,000 with co-financing from member contributions and retained surplus.",
    "2.4": "Key milestones include irrigation schedule rollout, farmer training cycles, and quality checks by quarter.",
    "2.5": "Top risks: weather variability, pest pressure, and transport disruptions during peak season.",
    "2.6": "Plan follows environmental safeguards, efficient water use, and inclusive participation targets.",
    "2.7": "Progress tracked monthly using yield, member participation, and financial performance indicators.",
    "2.8": "After review approval, implementation begins with procurement and training mobilization.",
    "3.1": "Investment request prioritizes productivity assets aligned with approved business activities.",
    "3.2": "Asset list includes irrigation upgrades, storage improvements, and quality control tools.",
    "3.3": "Members contribute labor, in-kind materials, and partial cost sharing where feasible.",
    "3.4": "Maintenance plan assigns custodians and quarterly servicing schedules for all assets.",
    "3.5": "Safeguards ensure equitable access for women, youth, and vulnerable member households.",
    "3.6": "Committee confirms accountability and signs implementation commitments.",
    "4": "Annexes include member registry summary, market assumptions, and costing worksheets.",
  },
  "BP-2023-001": {
    "1.1": "Rice Production Expansion 2023 targeted improved paddy productivity and milling efficiency.",
    "2.1": "Approved plan reached 100% completion with all milestones delivered on time.",
    "2.3": "Total approved budget execution: $42,000.",
    "2.7": "Performance monitoring closed with expected outputs achieved and verified.",
  },
};

const statusConfig: Record<
  string,
  {
    bg: string;
    text: string;
    border: string;
    icon: React.ElementType;
  }
> = {
  Approved: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    border: "border-emerald-200",
    icon: CheckCircle2,
  },
  "Under Review": {
    bg: "bg-orange-100",
    text: "text-orange-700",
    border: "border-orange-200",
    icon: Clock,
  },
  Rejected: {
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-200",
    icon: XCircle,
  },
  Draft: {
    bg: "bg-gray-100",
    text: "text-gray-700",
    border: "border-gray-200",
    icon: FileEdit,
  },
};

// ─── Section types ──────────────────────────────────────────────────────────

interface Section {
  id: string;
  number: string;
  title: string;
  subsections?: { id: string; number: string; title: string }[];
}

// ─── Component ──────────────────────────────────────────────────────────────

export function BusinessPlanTemplate() {
  const location = useLocation();
  const navigate = useNavigate();

  // Derive which view to show from the URL — no local tab state needed
  const isNewPlan = location.pathname.endsWith("/new");

  // ── History tab state ──
  const [historySearch, setHistorySearch] = useState("");
  const [historyStatusFilter, setHistoryStatusFilter] = useState("All");

  // ── New-plan form state ──
  const [expandedSections, setExpandedSections] = useState<string[]>(["1"]);
  const [expandedSubsections, setExpandedSubsections] = useState<string[]>([]);
  const [completedSections, setCompletedSections] = useState<string[]>(["1"]);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const exportContentRef = useRef<HTMLDivElement>(null);
  const selectedPlan = (location.state as { fromPlan?: (typeof pastPlans)[number] } | null)?.fromPlan;
  const [sectionContent, setSectionContent] = useState<Record<string, string>>({});

  const initialPrefill = useMemo(
    () => (selectedPlan ? planPrefillById[selectedPlan.id] ?? {} : {}),
    [selectedPlan]
  );

  useEffect(() => {
    setSectionContent(initialPrefill);
  }, [initialPrefill]);

  const sections: Section[] = [
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

  const toggleSection = (id: string) =>
    setExpandedSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );

  const toggleSubsection = (id: string) =>
    setExpandedSubsections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );

  const toggleCompletedSection = (id: string) =>
    setCompletedSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );

  const expandAllSections = () =>
    setExpandedSections(sections.map((s) => s.id));

  const collapseAllSections = () => {
    setExpandedSections([]);
    setExpandedSubsections([]);
  };

  const sectionThemes: Record<
    string,
    { border: string; bg: string; countBadge: string; accent: string }
  > = {
    "1": { border: "border-l-sky-500", bg: "bg-sky-50/70", countBadge: "bg-sky-100 text-sky-700", accent: "text-sky-700" },
    "2": { border: "border-l-violet-500", bg: "bg-violet-50/70", countBadge: "bg-violet-100 text-violet-700", accent: "text-violet-700" },
    "3": { border: "border-l-emerald-500", bg: "bg-emerald-50/70", countBadge: "bg-emerald-100 text-emerald-700", accent: "text-emerald-700" },
    "4": { border: "border-l-amber-500", bg: "bg-amber-50/70", countBadge: "bg-amber-100 text-amber-700", accent: "text-amber-700" },
  };

  const completedCount = completedSections.length;
  const completionPct = Math.round((completedCount / sections.length) * 100);

  const handleExportPdf = async () => {
    if (!exportContentRef.current || isExportingPdf) return;
    setIsExportingPdf(true);
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);
      const canvas = await html2canvas(exportContentRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const imageData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imageWidth = pageWidth;
      const imageHeight = (canvas.height * imageWidth) / canvas.width;
      let heightLeft = imageHeight;
      let position = 0;
      pdf.addImage(imageData, "PNG", 0, position, imageWidth, imageHeight);
      heightLeft -= pageHeight;
      while (heightLeft > 0) {
        position = heightLeft - imageHeight;
        pdf.addPage();
        pdf.addImage(imageData, "PNG", 0, position, imageWidth, imageHeight);
        heightLeft -= pageHeight;
      }
      const date = new Date().toISOString().slice(0, 10);
      pdf.save(`business-plan-${date}.pdf`);
    } catch (error) {
      console.error("Failed to export business plan PDF:", error);
    } finally {
      setIsExportingPdf(false);
    }
  };

  // ── Filtered past plans ──
  const filteredPastPlans = pastPlans.filter((p) => {
    const q = historySearch.trim().toLowerCase();
    const matchesSearch =
      !q || p.title.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
    const matchesStatus =
      historyStatusFilter === "All" || p.status === historyStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const approvedCount = pastPlans.filter((p) => p.status === "Approved").length;
  const reviewCount  = pastPlans.filter((p) => p.status === "Under Review").length;
  const rejectedCount = pastPlans.filter((p) => p.status === "Rejected").length;

  // ────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ────────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Business Plan</h1>
          <p className="text-gray-600 mt-1">
            Create and manage your cooperative's business plan
          </p>
        </div>
        {isNewPlan && (
          <button
            onClick={() => navigate("/dashboard/business-plans")}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-[#032EA1] transition-colors group shrink-0"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            Back
          </button>
        )}
        {!isNewPlan && (
          <button
            onClick={() => navigate("/dashboard/business-plans/new", { state: null })}
            className="flex items-center gap-2 bg-gradient-to-r from-[#032EA1] to-[#0447D4] text-white px-5 py-2.5 rounded-lg font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 shrink-0 text-sm"
          >
            <Plus className="w-4 h-4" />
            Create New Plan
          </button>
        )}
      </div>


      {/* ── HISTORY VIEW (/dashboard/business-plans) ── */}
      {!isNewPlan && (
        <div className="space-y-6">
          {/* Summary Banner */}
          <div className="rounded-xl bg-gradient-to-br from-[#032EA1] to-[#021c5e] p-4 text-white shadow-lg ring-1 ring-white/10 sm:p-5">
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
              <div className="min-w-0 rounded-lg bg-white/5 px-2.5 py-2.5 ring-1 ring-white/10">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-medium leading-tight text-white/70 sm:text-[11px]">
                    Total Submitted
                  </p>
                  <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center shrink-0">
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                </div>
                <p className="text-xl font-bold tabular-nums sm:text-2xl">{pastPlans.length}</p>
              </div>
              <div className="min-w-0 rounded-lg bg-white/5 px-2.5 py-2.5 ring-1 ring-white/10">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-medium leading-tight text-white/70 sm:text-[11px]">
                    Approved
                  </p>
                  <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                </div>
                <p className="text-xl font-bold tabular-nums sm:text-2xl">{approvedCount}</p>
              </div>
              <div className="min-w-0 rounded-lg bg-white/5 px-2.5 py-2.5 ring-1 ring-white/10">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-medium leading-tight text-white/70 sm:text-[11px]">
                    Under Review
                  </p>
                  <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center shrink-0">
                    <Clock className="w-3.5 h-3.5 text-orange-500" />
                  </div>
                </div>
                <p className="text-xl font-bold tabular-nums sm:text-2xl">{reviewCount}</p>
              </div>
              <div className="min-w-0 rounded-lg bg-white/5 px-2.5 py-2.5 ring-1 ring-white/10">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-medium leading-tight text-white/70 sm:text-[11px]">
                    Rejected
                  </p>
                  <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center shrink-0">
                    <XCircle className="w-3.5 h-3.5 text-red-500" />
                  </div>
                </div>
                <p className="text-xl font-bold tabular-nums sm:text-2xl">{rejectedCount}</p>
              </div>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  placeholder="Search by plan title or ID..."
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400 shrink-0" />
                <select
                  value={historyStatusFilter}
                  onChange={(e) => setHistoryStatusFilter(e.target.value)}
                  className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white text-sm"
                >
                  <option value="All">All Statuses</option>
                  <option value="Approved">Approved</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
            </div>
          </div>

          {/* Plans list */}
          <div className="space-y-4">
            {filteredPastPlans.map((plan) => {
              const cfg = statusConfig[plan.status];
              const StatusIcon = cfg.icon;
              return (
                <div
                  key={plan.id}
                  className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-11 h-11 bg-gradient-to-br from-[#032EA1] to-[#0447D4] rounded-lg flex items-center justify-center shadow flex-shrink-0">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="text-base font-semibold text-gray-900 truncate">
                            {plan.title}
                          </h3>
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${cfg.bg} ${cfg.text} ${cfg.border}`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {plan.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">Plan ID: {plan.id}</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            Submitted: {plan.submittedDate ?? "—"}
                          </span>
                          {plan.approvedDate && (
                            <span className="flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                              Approved: {plan.approvedDate}
                            </span>
                          )}
                          <span className="flex items-center gap-1 font-medium text-[#032EA1]">
                            Budget: {plan.budget}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:shrink-0">
                      {plan.status === "Approved" && (
                        <div className="w-full sm:w-36">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-500 flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              Progress
                            </span>
                            <span className="font-semibold text-[#032EA1]">{plan.progress}%</span>
                          </div>
                          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#032EA1] to-[#0447D4] rounded-full transition-all duration-500"
                              style={{ width: `${plan.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          title="View plan"
                          onClick={() =>
                            navigate("/dashboard/business-plans/new", {
                              state: { fromPlan: plan },
                            })
                          }
                          className="p-2.5 rounded-lg bg-[#032EA1]/10 text-[#032EA1] border border-[#032EA1]/20 hover:bg-[#032EA1]/15 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          title="Download plan"
                          className="p-2.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                    Reviewer:{" "}
                    <span className="font-medium text-gray-700">{plan.reviewer}</span>
                  </div>
                </div>
              );
            })}

            {filteredPastPlans.length === 0 && (
              <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No plans match your search</p>
                <p className="text-xs text-gray-400 mt-1">
                  Try adjusting filters or search terms
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── CREATE NEW PLAN VIEW (/dashboard/business-plans/new) ── */}
      {isNewPlan && (
        <>
          <div ref={exportContentRef} className="space-y-6">
            {/* Status Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-blue-900">
                    Business Plan Status: {selectedPlan ? `${selectedPlan.status} (Loaded)` : "Draft"}
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    {selectedPlan
                      ? `Loaded from ${selectedPlan.id} — ${selectedPlan.title}. You can review and update before resubmission.`
                      : "Complete all sections and submit for review. Your plan will go through multi-level review and approval process."}
                  </p>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Completion Progress</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-700">Sections Completed</span>
                  <span className="font-semibold text-gray-900">
                    {completedCount} / {sections.length}
                  </span>
                </div>
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${completionPct}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Complete all sections before submitting for review
                </p>
              </div>
            </div>

            {/* Template */}
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
                      onClick={expandAllSections}
                      className="px-2.5 py-1 text-xs font-medium border border-gray-300 rounded-md text-gray-700 hover:bg-white transition-colors"
                    >
                      Expand all
                    </button>
                    <button
                      type="button"
                      onClick={collapseAllSections}
                      className="px-2.5 py-1 text-xs font-medium border border-gray-300 rounded-md text-gray-700 hover:bg-white transition-colors"
                    >
                      Collapse all
                    </button>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {sections.map((section) => {
                  const theme = sectionThemes[section.id];
                  const isCompleted = completedSections.includes(section.id);
                  return (
                    <div key={section.id}>
                      <div
                        className={`w-full px-4 py-3 border-l-4 ${theme.border} ${
                          expandedSections.includes(section.id) ? theme.bg : "bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <button
                            onClick={() => toggleSection(section.id)}
                            className="min-w-0 flex-1 flex items-center gap-3 text-left hover:opacity-90 transition-opacity"
                          >
                            {expandedSections.includes(section.id) ? (
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
                                isCompleted
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {isCompleted ? "Completed" : "Pending"}
                            </span>
                            <button
                              type="button"
                              onClick={() => toggleCompletedSection(section.id)}
                              className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${
                                isCompleted
                                  ? "text-amber-700 border-amber-300 hover:bg-amber-50"
                                  : "text-emerald-700 border-emerald-400 hover:bg-emerald-50"
                              }`}
                            >
                              {isCompleted ? "Mark Incomplete" : "Mark Complete"}
                            </button>
                          </div>
                        </div>
                      </div>

                      {expandedSections.includes(section.id) && (
                        <div className="bg-gray-50 px-6 py-4">
                          {section.subsections && section.subsections.length > 0 ? (
                            <div className="space-y-1">
                              {section.subsections.map((sub) => (
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
                                      {expandedSubsections.includes(sub.id) ? (
                                        <ChevronDown className="w-4 h-4 text-gray-600 shrink-0" />
                                      ) : (
                                        <ChevronRight className="w-4 h-4 text-gray-600 shrink-0" />
                                      )}
                                      <span className="font-medium text-gray-900 truncate">
                                        {sub.number}. {sub.title}
                                      </span>
                                    </span>
                                  </button>
                                  {expandedSubsections.includes(sub.id) && (
                                    <div className="px-4 pb-4">
                                      <textarea
                                        placeholder={`Enter details for ${sub.title}...`}
                                        value={sectionContent[sub.id] ?? ""}
                                        onChange={(e) =>
                                          setSectionContent((prev) => ({
                                            ...prev,
                                            [sub.id]: e.target.value,
                                          }))
                                        }
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none resize-none"
                                        rows={4}
                                      />
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                              <textarea
                                placeholder={`Enter details for ${section.title}...`}
                                value={sectionContent[section.id] ?? ""}
                                onChange={(e) =>
                                  setSectionContent((prev) => ({
                                    ...prev,
                                    [section.id]: e.target.value,
                                  }))
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
          </div>

          <div className="flex flex-wrap justify-end gap-3">
            <button
              onClick={handleExportPdf}
              disabled={isExportingPdf}
              className="flex items-center gap-2 px-4 py-2.5 border border-[#032EA1] rounded-lg text-sm font-medium text-[#032EA1] hover:bg-[#032EA1]/5 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              {isExportingPdf ? "Exporting..." : "Export PDF"}
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <Save className="w-4 h-4" />
              Save Draft
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-[#032EA1] text-white rounded-lg hover:bg-[#0447D4] transition-colors shadow-md">
              <Send className="w-4 h-4" />
              Submit for Review
            </button>
          </div>
        </>
      )}
    </div>
  );
}
