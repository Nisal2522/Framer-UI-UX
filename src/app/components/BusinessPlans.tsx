import { useState } from "react";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  FileEdit,
  Eye,
  Download,
  TrendingUp,
} from "lucide-react";
import { BusinessPlanForm } from "./BusinessPlanForm";

const plans = [
  {
    id: "BP-2024-001",
    cooperative: "Kampong Thom Rice Cooperative",
    acId: "AC-001",
    title: "Rice Production Expansion 2024",
    status: "Approved",
    submittedDate: "2024-01-15",
    approvedDate: "2024-02-01",
    budget: "$45,000",
    progress: 65,
    reviewer: "Ministry Committee",
  },
  {
    id: "BP-2024-042",
    cooperative: "Siem Reap Vegetable Growers",
    acId: "AC-042",
    title: "Organic Vegetable Production",
    status: "Under Review",
    submittedDate: "2024-03-10",
    approvedDate: null,
    budget: "$28,500",
    progress: 0,
    reviewer: "Business Plan Support Team",
  },
  {
    id: "BP-2024-015",
    cooperative: "Battambang Modern Agriculture",
    acId: "MAC-015",
    title: "Climate-Resilient Farming Initiative",
    status: "Approved",
    submittedDate: "2024-02-20",
    approvedDate: "2024-03-05",
    budget: "$62,000",
    progress: 42,
    reviewer: "Ministry Committee",
  },
  {
    id: "BP-2024-128",
    cooperative: "Pursat Livestock Cooperative",
    acId: "AC-128",
    title: "Livestock Development Program",
    status: "Rejected",
    submittedDate: "2024-02-28",
    approvedDate: null,
    budget: "$35,000",
    progress: 0,
    reviewer: "Ministry Committee",
  },
  {
    id: "BP-2024-089",
    cooperative: "Kampong Thom Organic Farmers",
    acId: "AC-089",
    title: "Organic Certification Program",
    status: "Draft",
    submittedDate: null,
    approvedDate: null,
    budget: "$18,500",
    progress: 0,
    reviewer: "Not Assigned",
  },
];

const statusConfig: Record<
  string,
  { bg: string; text: string; icon: any; border: string }
> = {
  Approved: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    icon: CheckCircle2,
    border: "border-emerald-200",
  },
  "Under Review": {
    bg: "bg-orange-100",
    text: "text-orange-700",
    icon: Clock,
    border: "border-orange-200",
  },
  Rejected: {
    bg: "bg-red-100",
    text: "text-red-700",
    icon: XCircle,
    border: "border-red-200",
  },
  Draft: {
    bg: "bg-gray-100",
    text: "text-gray-700",
    icon: FileEdit,
    border: "border-gray-200",
  },
};

export function BusinessPlans() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [showForm, setShowForm] = useState(false);

  const filteredPlans = plans.filter((plan) => {
    const matchesSearch =
      plan.cooperative.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "All" || plan.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Business Plan Management
          </h1>
          <p className="text-gray-600 mt-1">
            Create, review, and monitor cooperative business plans
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-[#032EA1] to-[#0447D4] text-white px-6 py-3 rounded-lg font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
          Create New Plan
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Plans</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">1,302</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-emerald-600 mt-2">856</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Under Review</p>
              <p className="text-2xl font-bold text-orange-600 mt-2">234</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Progress</p>
              <p className="text-2xl font-bold text-purple-600 mt-2">58%</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by cooperative, plan title, or ID..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white"
            >
              <option value="All">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Under Review">Under Review</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 gap-6">
        {filteredPlans.map((plan) => {
          const config = statusConfig[plan.status];
          const StatusIcon = config.icon;

          return (
            <div
              key={plan.id}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Plan Info */}
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#032EA1] to-[#0447D4] rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {plan.title}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}
                        >
                          <StatusIcon className="w-3.5 h-3.5" />
                          {plan.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {plan.cooperative} • {plan.acId} • Plan ID: {plan.id}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>
                            Submitted:{" "}
                            {plan.submittedDate || "Not yet submitted"}
                          </span>
                        </div>
                        {plan.approvedDate && (
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span>Approved: {plan.approvedDate}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Budget:</span>
                          <span className="text-[#032EA1] font-semibold">
                            {plan.budget}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress & Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-6">
                  {/* Progress */}
                  {plan.status === "Approved" && (
                    <div className="w-full sm:w-40">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-600">
                          Progress
                        </span>
                        <span
                          className={`text-xs font-semibold ${
                            plan.progress === 100 ? "text-emerald-600" : "text-[#032EA1]"
                          }`}
                        >
                          {plan.progress}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            plan.progress === 100
                              ? "bg-gradient-to-r from-emerald-500 to-emerald-600"
                              : "bg-gradient-to-r from-[#032EA1] to-[#0447D4]"
                          }`}
                          style={{ width: `${plan.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button className="p-2.5 rounded-lg bg-[#032EA1]/10 text-[#032EA1] border border-[#032EA1]/20 hover:bg-[#032EA1]/15 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors group">
                      <FileEdit className="w-4 h-4 text-gray-600 group-hover:text-[#032EA1]" />
                    </button>
                    <button className="p-2.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Reviewer Info */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-600">
                  Reviewer: <span className="font-medium">{plan.reviewer}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredPlans.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No plans found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      {/* Form Modal */}
      {showForm && <BusinessPlanForm onClose={() => setShowForm(false)} />}
    </div>
  );
}