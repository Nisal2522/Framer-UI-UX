import { useState } from "react";
import {
  Building2,
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
  TrendingUp,
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
          className="flex items-center gap-2 bg-gradient-to-r from-[#032EA1] to-[#0447D4] text-white px-6 py-3 rounded-lg font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
          Register New AC
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total ACs</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">1,430</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Status</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">1,356</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Members</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">45,682</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Advanced Stage</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">342</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
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

      {/* Cooperatives List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  AC Information
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Members
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Stage
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Registered
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCooperatives.map((coop) => {
                const StatusIcon = statusIcons[coop.status]?.icon || CheckCircle;
                const statusColor = statusIcons[coop.status]?.color || "text-gray-600";

                return (
                  <tr
                    key={coop.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {coop.name}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          ID: {coop.id} • Chairman: {coop.chairman}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium">{coop.province}</p>
                          <p className="text-xs text-gray-600">
                            {coop.district}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{coop.members}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                          stageColors[coop.stage]
                        }`}
                      >
                        {coop.stage}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <StatusIcon className={`w-4 h-4 ${statusColor}`} />
                        <span className="text-sm text-gray-700">
                          {coop.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{coop.registered}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                      </button>
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