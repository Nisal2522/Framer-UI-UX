import { useState } from "react";
import {
  MapPin,
  Users,
  Calendar,
  Search,
  Filter,
  Plus,
  MoreVertical,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { ACProfileForm } from "./ACProfileForm";

const cooperatives = [
  {
    id: "AC-001",
    name: "Kampong Thom Rice Cooperative",
    province: "Kampong Thom",
    district: "Baray",
    members: 234,
    stage: "Advanced",
    status: "Active",
    registered: "2022-03-15",
    chairman: "Sok Pisey",
  },
  {
    id: "AC-042",
    name: "Siem Reap Vegetable Growers",
    province: "Siem Reap",
    district: "Angkor Chum",
    members: 156,
    stage: "Expanding",
    status: "Active",
    registered: "2023-01-20",
    chairman: "Chan Dara",
  },
  {
    id: "MAC-015",
    name: "Battambang Modern Agriculture",
    province: "Battambang",
    district: "Moung Ruessei",
    members: 412,
    stage: "Advanced",
    status: "Verification Pending",
    registered: "2021-08-10",
    chairman: "Keo Sophea",
  },
  {
    id: "AC-128",
    name: "Pursat Livestock Cooperative",
    province: "Pursat",
    district: "Krakor",
    members: 189,
    stage: "Developing",
    status: "Active",
    registered: "2023-05-22",
    chairman: "Lim Veasna",
  },
  {
    id: "AC-089",
    name: "Kampong Thom Organic Farmers",
    province: "Kampong Thom",
    district: "Stoung",
    members: 98,
    stage: "Startup",
    status: "Active",
    registered: "2024-02-10",
    chairman: "Ny Chamroeun",
  },
];

const stageColors: Record<string, string> = {
  Startup: "bg-blue-100 text-blue-700 border-blue-200",
  Developing: "bg-purple-100 text-purple-700 border-purple-200",
  Expanding: "bg-orange-100 text-orange-700 border-orange-200",
  Advanced: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

const statusIcons: Record<string, any> = {
  Active: { icon: CheckCircle, color: "text-emerald-600" },
  "Verification Pending": { icon: Clock, color: "text-orange-600" },
  Suspended: { icon: AlertCircle, color: "text-red-600" },
};

export function ACProfiles() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStage, setSelectedStage] = useState("All");
  const [showForm, setShowForm] = useState(false);

  const filteredCooperatives = cooperatives.filter((coop) => {
    const matchesSearch =
      coop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coop.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage =
      selectedStage === "All" || coop.stage === selectedStage;
    return matchesSearch && matchesStage;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            AC Profile Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and monitor all Agricultural Cooperatives
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#032EA1] text-white rounded-lg hover:bg-[#0447D4] transition-colors shadow-md shrink-0"
        >
          <Plus className="w-5 h-5" />
          Register New AC
        </button>
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
              placeholder="Search by name or AC ID..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
            />
          </div>

          {/* Stage Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white"
            >
              <option value="All">All Stages</option>
              <option value="Startup">Startup</option>
              <option value="Developing">Developing</option>
              <option value="Expanding">Expanding</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cooperatives List — Asset Management table styles */}
      <div className="w-full min-w-0 rounded-2xl border border-gray-200/80 bg-white shadow-[0_4px_24px_-4px_rgba(3,46,161,0.08),0_2px_8px_-2px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="w-full min-w-0 overflow-hidden">
          <table className="w-full table-fixed border-collapse text-left">
            <colgroup>
              <col className="w-[24%]" />
              <col className="w-[16%]" />
              <col className="w-[10%]" />
              <col className="w-[12%]" />
              <col className="w-[14%]" />
              <col className="w-[12%]" />
              <col className="w-[12%]" />
            </colgroup>
            <thead>
              <tr className="bg-gradient-to-r from-[#032EA1]/[0.07] via-[#032EA1]/[0.04] to-transparent border-b border-[#032EA1]/15">
                <th className="px-2 sm:px-3 py-2.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#032EA1]">
                  AC Information
                </th>
                <th className="px-2 sm:px-3 py-2.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#032EA1]">
                  Location
                </th>
                <th className="px-2 sm:px-3 py-2.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#032EA1]">
                  Members
                </th>
                <th className="px-2 sm:px-3 py-2.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#032EA1]">
                  Stage
                </th>
                <th className="px-2 sm:px-3 py-2.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#032EA1]">
                  Status
                </th>
                <th className="px-2 sm:px-3 py-2.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#032EA1]">
                  Registered
                </th>
                <th className="px-2 sm:px-3 py-2.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#032EA1] text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCooperatives.map((coop, rowIdx) => {
                const StatusIcon = statusIcons[coop.status]?.icon || CheckCircle;
                const statusColor = statusIcons[coop.status]?.color || "text-gray-600";

                return (
                  <tr
                    key={coop.id}
                    className={`group transition-colors ${
                      rowIdx % 2 === 0 ? "bg-white" : "bg-slate-50/60"
                    } hover:bg-[#032EA1]/[0.04]`}
                  >
                    <td className="px-2 sm:px-3 py-2.5 align-middle max-w-0">
                      <div className="min-w-0 flex flex-col gap-1">
                        <span
                          className="text-xs sm:text-sm font-semibold text-gray-900 leading-snug line-clamp-2"
                          title={coop.name}
                        >
                          {coop.name}
                        </span>
                        <span className="flex flex-wrap items-center gap-1 text-[11px] text-gray-600">
                          <span className="inline-flex font-mono text-[10px] sm:text-xs font-semibold text-[#032EA1] bg-[#032EA1]/8 px-2 py-0.5 rounded-md border border-[#032EA1]/10 whitespace-nowrap">
                            {coop.id}
                          </span>
                          <span className="truncate">
                            • Chairman: {coop.chairman}
                          </span>
                        </span>
                      </div>
                    </td>
                    <td className="px-2 sm:px-3 py-2.5 align-middle max-w-0">
                      <div className="flex items-center gap-1.5 text-gray-700 min-w-0">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-medium truncate">
                            {coop.province}
                          </p>
                          <p className="text-[11px] text-gray-500 truncate">
                            {coop.district}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 sm:px-3 py-2.5 align-middle whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-gray-700">
                        <Users className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                        <span className="text-xs sm:text-sm font-medium tabular-nums">
                          {coop.members}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 sm:px-3 py-2.5 align-middle max-w-0">
                      <span
                        className={`inline-flex max-w-full items-center px-2 py-0.5 text-[10px] sm:text-xs font-semibold rounded-full border ${
                          stageColors[coop.stage]
                        }`}
                      >
                        {coop.stage}
                      </span>
                    </td>
                    <td className="px-2 sm:px-3 py-2.5 align-middle max-w-0">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <StatusIcon
                          className={`w-3.5 h-3.5 shrink-0 ${statusColor}`}
                        />
                        <span className="text-xs text-gray-700 truncate">
                          {coop.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 sm:px-3 py-2.5 align-middle max-w-0">
                      <div className="flex items-center gap-1.5 text-gray-600 min-w-0">
                        <Calendar className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                        <span className="text-xs tabular-nums truncate">
                          {coop.registered}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 sm:px-3 py-2.5 align-middle max-w-0">
                      <div className="flex items-center justify-center gap-0.5">
                        <button
                          type="button"
                          className="p-1.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                          aria-label="More actions"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing {filteredCooperatives.length} of {cooperatives.length}{" "}
            cooperatives
          </p>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Previous
            </button>
            <button className="px-4 py-2 bg-[#032EA1] text-white rounded-lg text-sm font-medium hover:bg-[#0447D4] transition-colors">
              1
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              2
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              3
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && <ACProfileForm onClose={() => setShowForm(false)} />}
    </div>
  );
}