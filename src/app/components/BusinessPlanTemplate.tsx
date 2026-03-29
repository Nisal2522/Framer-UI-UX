import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  Save,
  Send,
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Business Plan</h1>
          <p className="text-gray-600 mt-1">
            Create and manage your cooperative's business plan
          </p>
        </div>
        <div className="flex gap-3">
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

      {/* Business Plan Template */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-[#032EA1]" />
            <h3 className="font-semibold text-gray-900">
              Standardized Business Plan Template
            </h3>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {sections.map((section) => (
            <div key={section.id}>
              {/* Main Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {expandedSections.includes(section.id) ? (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  )}
                  <span className="font-semibold text-gray-900 text-left">
                    {section.number}. {section.title}
                  </span>
                </div>
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                  {section.subsections ? section.subsections.length : 0} subsections
                </span>
              </button>

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
                            <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded shrink-0">
                              Incomplete
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
          ))}
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Completion Progress</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700">Sections Completed</span>
            <span className="font-semibold text-gray-900">0 / 4</span>
          </div>
          <div className="bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-[#032EA1] to-[#0447D4] h-3 rounded-full transition-all duration-500"
              style={{ width: "0%" }}
            ></div>
          </div>
          <p className="text-xs text-gray-500">
            Complete all sections before submitting for review
          </p>
        </div>
      </div>
    </div>
  );
}
