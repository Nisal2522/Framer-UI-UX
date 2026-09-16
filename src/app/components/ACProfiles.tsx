import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import {
  MapPin,
  Users,
  Calendar,
  Search,
  Filter,
  Plus,
  Eye,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
  MinusCircle,
  X,
} from "lucide-react";

const INITIAL_COOPERATIVES = [
  {
    id: "AC-001",
    name: "Kampong Thom Rice Cooperative",
    province: "Kampong Thom",
    district: "Baray",
    members: 234,
    acType: "AC",
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
    acType: "PG",
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
    acType: "MAC",
    stage: "Advanced",
    status: "Inactive",
    registered: "2021-08-10",
    chairman: "Keo Sophea",
  },
  {
    id: "AC-128",
    name: "Pursat Livestock Cooperative",
    province: "Pursat",
    district: "Krakor",
    members: 189,
    acType: "AC",
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
    acType: "PG",
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

const typeLabels: Record<string, string> = {
  AC: "Agricultural Cooperative",
  MAC: "Modern Agriculture Community",
  PG: "Producer Group",
};

const typeColors: Record<string, string> = {
  AC: "bg-sky-100 text-sky-700 border-sky-200",
  MAC: "bg-indigo-100 text-indigo-700 border-indigo-200",
  PG: "bg-teal-100 text-teal-700 border-teal-200",
};

const statusIcons: Record<string, any> = {
  Active: { icon: CheckCircle, color: "text-emerald-600" },
  Inactive: { icon: MinusCircle, color: "text-gray-500" },
  Suspended: { icon: AlertCircle, color: "text-red-600" },
};

const PAGE_SIZE = 10;

export function ACProfiles() {
  const navigate = useNavigate();
  const [cooperatives, setCooperatives] = useState(INITIAL_COOPERATIVES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [showStageFilter, setShowStageFilter] = useState(false);
  const [page, setPage] = useState(1);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showStageFilter) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setShowStageFilter(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowStageFilter(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showStageFilter]);

  const filteredCooperatives = cooperatives.filter((coop) => {
    const matchesSearch =
      coop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coop.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      selectedType === "All" || coop.acType === selectedType;
    return matchesSearch && matchesType;
  });

  const totalPages = Math.max(1, Math.ceil(filteredCooperatives.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedCooperatives = filteredCooperatives.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  const handleTypeFilterChange = (value: string) => {
    setSelectedType(value);
    setPage(1);
  };

  const handleDelete = (coop: { id: string; name: string }) => {
    const confirmed = window.confirm(
      `Delete ${coop.name} (${coop.id})? This cannot be undone.`
    );
    if (!confirmed) return;
    setCooperatives((prev) => prev.filter((c) => c.id !== coop.id));
    toast.success(`${coop.name} was deleted.`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            AC Profile Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and monitor all Agricultural Cooperatives
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard/admin/ac-profiles/new")}
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
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by name or AC ID..."
              aria-label="Search cooperatives by name or AC ID"
              className="w-full pl-10 pr-9 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => handleSearchChange("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Icon Button */}
          <div className="relative" ref={filterRef}>
            <button
              type="button"
              onClick={() => setShowStageFilter(!showStageFilter)}
              aria-expanded={showStageFilter}
              aria-haspopup="true"
              aria-label="Filter cooperatives by type"
              className={`flex items-center justify-center gap-2 px-4 py-2.5 border rounded-lg transition-colors ${
                showStageFilter || selectedType !== "All"
                  ? "bg-[#032EA1] border-[#032EA1] text-white hover:bg-[#0447D4]"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Filter className="w-5 h-5" />
              {selectedType !== "All" && (
                <span className="text-sm font-medium">{selectedType}</span>
              )}
            </button>

            {/* Stage Filter Dropdown */}
            {showStageFilter && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden">
                {/* Type Filter */}
                <div className="p-3 border-b border-gray-100 bg-gray-50">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Filter by Type
                  </p>
                </div>
                <div className="p-2">
                  {[
                    { value: "All", label: "All Types" },
                    { value: "AC", label: "AC" },
                    { value: "MAC", label: "MAC" },
                    { value: "PG", label: "PG" },
                  ].map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => handleTypeFilterChange(type.value)}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                        selectedType === type.value
                          ? "bg-[#032EA1]/10 text-[#032EA1] font-medium"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {selectedType === type.value && (
                        <CheckCircle className="w-4 h-4 text-[#032EA1]" />
                      )}
                      {type.label}
                    </button>
                  ))}
                </div>

                {/* Clear */}
                {selectedType !== "All" && (
                  <div className="p-2 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => {
                        handleTypeFilterChange("All");
                        setShowStageFilter(false);
                      }}
                      className="w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Clear Filter
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cooperatives List — Asset Management table styles */}
      <div className="w-full min-w-0 rounded-2xl border border-gray-200/80 bg-white shadow-[0_4px_24px_-4px_rgba(3,46,161,0.08),0_2px_8px_-2px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="w-full min-w-0 overflow-hidden">
          <table className="w-full table-fixed border-collapse text-left">
            <colgroup>
              <col className="w-[22%]" />
              <col className="w-[8%]" />
              <col className="w-[14%]" />
              <col className="w-[8%]" />
              <col className="w-[14%]" />
              <col className="w-[14%]" />
              <col className="w-[12%]" />
            </colgroup>
            <thead>
              <tr className="bg-gradient-to-r from-[#032EA1]/[0.07] via-[#032EA1]/[0.04] to-transparent border-b border-[#032EA1]/15">
                <th className="px-2 sm:px-3 py-2.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#032EA1]">
                  AC Information
                </th>
                <th className="px-2 sm:px-3 py-2.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#032EA1]">
                  Type
                </th>
                <th className="px-2 sm:px-3 py-2.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#032EA1]">
                  Location
                </th>
                <th className="px-2 sm:px-3 py-2.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#032EA1]">
                  Members
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
              {pagedCooperatives.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-gray-400">
                    No cooperatives match your search or filters.
                  </td>
                </tr>
              ) : (
              pagedCooperatives.map((coop, rowIdx) => {
                const StatusIcon = statusIcons[coop.status]?.icon || CheckCircle;
                const statusColor = statusIcons[coop.status]?.color || "text-gray-600";

                return (
                  <tr
                    key={coop.id}
                    onClick={() => navigate(`/dashboard/admin/ac-profiles/${coop.id}`)}
                    className={`group cursor-pointer transition-colors ${
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
                        </span>
                      </div>
                    </td>
                    <td className="px-2 sm:px-3 py-2.5 align-middle max-w-0">
                      <span
                        title={typeLabels[coop.acType]}
                        className={`inline-flex max-w-full items-center px-2 py-0.5 text-[10px] sm:text-xs font-semibold rounded-full border ${
                          typeColors[coop.acType]
                        }`}
                      >
                        {coop.acType}
                      </span>
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
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/dashboard/admin/ac-profiles/${coop.id}`);
                          }}
                          className="p-1.5 rounded-lg text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                          aria-label="View AC profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/dashboard/admin/ac-profiles/${coop.id}`, {
                              state: { autoEdit: true },
                            });
                          }}
                          className="p-1.5 rounded-lg text-amber-600 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                          aria-label="Edit AC profile"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(coop);
                          }}
                          className="p-1.5 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                          aria-label="Delete AC profile"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            {filteredCooperatives.length === 0
              ? "Showing 0 cooperatives"
              : `Showing ${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(
                  currentPage * PAGE_SIZE,
                  filteredCooperatives.length
                )} of ${filteredCooperatives.length} cooperatives`}
          </p>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setPage(pageNum)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === pageNum
                      ? "bg-[#032EA1] text-white"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}