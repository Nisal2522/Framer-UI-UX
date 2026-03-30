import { useState } from "react";
import { X, Upload, Plus, Save, FileText, DollarSign, Calendar } from "lucide-react";

interface BusinessPlanFormProps {
  onClose: () => void;
}

export function BusinessPlanForm({ onClose }: BusinessPlanFormProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "project" | "budget">("profile");

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 bg-gradient-to-br from-[#032EA1] to-[#021c5e]">
          <h2 className="text-2xl font-bold text-white">Create New Business Plan</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-8 pt-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-6 py-3 font-medium text-sm rounded-t-lg transition-colors ${
              activeTab === "profile"
                ? "bg-[#032EA1] text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Cooperative Profile
          </button>
          <button
            onClick={() => setActiveTab("project")}
            className={`px-6 py-3 font-medium text-sm rounded-t-lg transition-colors ${
              activeTab === "project"
                ? "bg-[#032EA1] text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Business Project
          </button>
          <button
            onClick={() => setActiveTab("budget")}
            className={`px-6 py-3 font-medium text-sm rounded-t-lg transition-colors ${
              activeTab === "budget"
                ? "bg-[#032EA1] text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Budget & Timeline
          </button>
        </div>

        {/* Form Content */}
        <div className="px-8 py-6 max-h-[calc(100vh-300px)] overflow-y-auto">
          {activeTab === "profile" && (
            <div className="space-y-6">
              {/* AC Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Select Agricultural Cooperative
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Agricultural Cooperative <span className="text-red-500">*</span>
                    </label>
                    <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white">
                      <option value="">Select AC</option>
                      <option value="AC-001">AC-001 - Kampong Thom Rice Cooperative</option>
                      <option value="AC-042">AC-042 - Siem Reap Vegetable Growers</option>
                      <option value="MAC-015">MAC-015 - Battambang Modern Agriculture</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Graduation Stage
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 outline-none"
                      value="Developing"
                      disabled
                    />
                  </div>
                </div>
              </div>

              {/* Plan Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Plan Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Plan Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                      placeholder="Enter business plan title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Plan Type <span className="text-red-500">*</span>
                    </label>
                    <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white">
                      <option value="">Select Type</option>
                      <option value="annual">Annual Plan</option>
                      <option value="multi-year">Multi-Year Plan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Plan Year <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                      placeholder="2024"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Executive Summary <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none resize-none"
                      placeholder="Provide a brief overview of the business plan objectives and expected outcomes"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Target Beneficiaries */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Target Beneficiaries
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Members
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Women Members (%)
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Youth Members (%)
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "project" && (
            <div className="space-y-6">
              {/* Project Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Project Details
                </h3>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Category <span className="text-red-500">*</span>
                    </label>
                    <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white">
                      <option value="">Select Category</option>
                      <option value="production">Production Expansion</option>
                      <option value="processing">Processing & Value Addition</option>
                      <option value="marketing">Marketing & Sales</option>
                      <option value="infrastructure">Infrastructure Development</option>
                      <option value="climate">Climate Resilience</option>
                      <option value="organic">Organic Certification</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Objectives <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none resize-none"
                      placeholder="List the main objectives of this business project"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Implementation Strategy
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none resize-none"
                      placeholder="Describe how the project will be implemented"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expected Outcomes & Impact
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none resize-none"
                      placeholder="Describe the expected outcomes and measurable impact"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Production Schedule */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Production/Activity Schedule
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Production Volume
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                      placeholder="e.g., 100 tons of rice"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Market
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                      placeholder="e.g., Local market, Export"
                    />
                  </div>
                </div>
              </div>

              {/* Risk Assessment */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Risk Assessment & Mitigation
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Identified Risks
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none resize-none"
                      placeholder="List potential risks and challenges"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mitigation Strategies
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none resize-none"
                      placeholder="Describe strategies to mitigate identified risks"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "budget" && (
            <div className="space-y-6">
              {/* Budget Overview */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Budget Overview
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Budget (USD) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Funding Source <span className="text-red-500">*</span>
                    </label>
                    <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white">
                      <option value="">Select Source</option>
                      <option value="pearl">PEARL Grant</option>
                      <option value="self">Self-Funded</option>
                      <option value="loan">Bank Loan</option>
                      <option value="mixed">Mixed Sources</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Budget Breakdown */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Budget Breakdown
                  </h3>
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#032EA1] text-white rounded-lg text-sm font-medium hover:bg-[#0447D4] transition-colors">
                    <Plus className="w-4 h-4" />
                    Add Line Item
                  </button>
                </div>
                <div className="space-y-4">
                  {["Equipment & Machinery", "Seeds & Inputs", "Labor Costs", "Infrastructure"].map(
                    (item, idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-gray-200 rounded-lg"
                      >
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Item Description
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                            placeholder={item}
                            defaultValue={item}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Amount (USD)
                          </label>
                          <input
                            type="number"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                            placeholder="0.00"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Percentage
                          </label>
                          <input
                            type="number"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                            placeholder="0%"
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Implementation Timeline */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Implementation Timeline
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Milestones */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Key Milestones
                  </h3>
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#032EA1] text-white rounded-lg text-sm font-medium hover:bg-[#0447D4] transition-colors">
                    <Plus className="w-4 h-4" />
                    Add Milestone
                  </button>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3].map((num) => (
                    <div
                      key={num}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Milestone Description
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                          placeholder="Enter milestone description"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Target Date
                        </label>
                        <input
                          type="date"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Supporting Documents */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Supporting Documents
                </h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#032EA1] transition-colors cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-1">
                    Upload financial plans, feasibility studies, production schedules
                  </p>
                  <p className="text-xs text-gray-500">
                    PDF, DOC, XLSX - Max 10MB per file
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-8 py-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <div className="flex items-center gap-3">
            <button className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
              Save as Draft
            </button>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#032EA1] to-[#0447D4] text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all">
              <FileText className="w-4 h-4" />
              Submit for Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
