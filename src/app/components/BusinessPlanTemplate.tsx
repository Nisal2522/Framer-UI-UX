import { useRef, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  Save,
  Send,
  Download,
  AlertCircle,
} from "lucide-react";

interface Section {
  id: string;
  number: string;
  title: string;
  subsections?: {
    id: string;
    number: string;
    title: string;
  }[];
}

export function BusinessPlanTemplate() {
  const [expandedSections, setExpandedSections] = useState<string[]>(["1"]);
  const [expandedSubsections, setExpandedSubsections] = useState<string[]>([]);
  const [completedSections, setCompletedSections] = useState<string[]>(["1"]);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const exportContentRef = useRef<HTMLDivElement>(null);

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
    {
      id: "4",
      number: "4",
      title: "ANNEXES",
      subsections: [],
    },
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const toggleSubsection = (subsectionId: string) => {
    setExpandedSubsections((prev) =>
      prev.includes(subsectionId)
        ? prev.filter((id) => id !== subsectionId)
        : [...prev, subsectionId]
    );
  };

  const toggleCompletedSection = (sectionId: string) => {
    setCompletedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const expandAllSections = () => {
    setExpandedSections(sections.map((section) => section.id));
  };

  const collapseAllSections = () => {
    setExpandedSections([]);
    setExpandedSubsections([]);
  };

  const sectionThemes: Record<
    string,
    { border: string; bg: string; countBadge: string; accent: string }
  > = {
    "1": {
      border: "border-l-sky-500",
      bg: "bg-sky-50/70",
      countBadge: "bg-sky-100 text-sky-700",
      accent: "text-sky-700",
    },
    "2": {
      border: "border-l-violet-500",
      bg: "bg-violet-50/70",
      countBadge: "bg-violet-100 text-violet-700",
      accent: "text-violet-700",
    },
    "3": {
      border: "border-l-emerald-500",
      bg: "bg-emerald-50/70",
      countBadge: "bg-emerald-100 text-emerald-700",
      accent: "text-emerald-700",
    },
    "4": {
      border: "border-l-amber-500",
      bg: "bg-amber-50/70",
      countBadge: "bg-amber-100 text-amber-700",
      accent: "text-amber-700",
    },
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Business Plan</h1>
        <p className="text-gray-600 mt-1">
          Create and manage your cooperative's business plan
        </p>
      </div>

      <div ref={exportContentRef} className="space-y-6">
        {/* Status Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900">
                Business Plan Status: Draft
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Complete all sections and submit for review. Your plan will go through
                multi-level review and approval process.
              </p>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
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
              ></div>
            </div>
            <p className="text-xs text-gray-500">
              Complete all sections before submitting for review
            </p>
          </div>
        </div>

        {/* Business Plan Template */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-[#032EA1]" />
                <h3 className="font-semibold text-gray-900">
                  Business Plan Template
                </h3>
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
                {/* Main Section Header */}
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
                            : `${theme.accent} border-current/30 hover:bg-white`
                        }`}
                      >
                        {isCompleted ? "Mark Incomplete" : "Mark Complete"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Subsections — collapsible; expanded body is textarea only */}
                {expandedSections.includes(section.id) && (
                  <div className="bg-gray-50 px-6 py-4">
                    {section.subsections && section.subsections.length > 0 ? (
                      <div className="space-y-1">
                        {section.subsections.map((subsection) => (
                          <div
                            key={subsection.id}
                            className="border border-gray-200 rounded-lg overflow-hidden bg-white"
                          >
                            <button
                              type="button"
                              onClick={() => toggleSubsection(subsection.id)}
                              className="w-full px-4 py-3 flex items-center justify-between gap-3 hover:bg-gray-50 transition-colors text-left"
                            >
                              <span className="flex items-center gap-2 min-w-0">
                                {expandedSubsections.includes(subsection.id) ? (
                                  <ChevronDown className="w-4 h-4 text-gray-600 shrink-0" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 text-gray-600 shrink-0" />
                                )}
                                <span className="font-medium text-gray-900 truncate">
                                  {subsection.number}. {subsection.title}
                                </span>
                              </span>
                            </button>
                            {expandedSubsections.includes(subsection.id) && (
                              <div className="px-4 pb-4">
                                <textarea
                                  placeholder={`Enter details for ${subsection.title}...`}
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
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none resize-none"
                          rows={6}
                        ></textarea>
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

    </div>
  );
}
