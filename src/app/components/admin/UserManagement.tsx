import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  UserCog,
  Plus,
  Search,
  Filter,
  X,
  Edit2,
  Trash2,
  CheckCircle,
  MinusCircle,
  Mail,
  Phone,
  MapPin,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";

type UserStatus = "Active" | "Inactive";

type ManagedUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  province: string;
  status: UserStatus;
  permissions: string[];
};

const PROVINCE_OPTIONS = [
  "Phnom Penh",
  "Battambang",
  "Siem Reap",
  "Kampong Thom",
  "Kampong Cham",
  "Takeo",
  "Kampot",
  "Prey Veng",
  "Banteay Meanchey",
  "Pursat",
];

/** Mirrors the admin sidebar sections in Root.tsx — the real modules a Government Admin account can be granted. */
const PERMISSION_MODULES = [
  { key: "national-dashboard", label: "National Dashboard" },
  { key: "ac-profiles", label: "AC Profiles" },
  { key: "commune-verification", label: "Commune Verification" },
  { key: "business-plan", label: "Business Plan" },
  { key: "progress-reporting", label: "Progress Reporting" },
  { key: "knowledge-hub", label: "Knowledge Hub" },
  { key: "training-management", label: "Training Management" },
  { key: "gesi-reporting", label: "GESI / Reporting" },
  { key: "user-management", label: "User Management" },
];

const ALL_PERMISSION_KEYS = PERMISSION_MODULES.map((m) => m.key);

const SEED_USERS: ManagedUser[] = [
  {
    id: "U-001",
    name: "Sok Vanna",
    email: "sok.vanna@gda.gov.kh",
    phone: "+855 12 456 789",
    country: "Cambodia",
    province: "Phnom Penh",
    status: "Active",
    permissions: ALL_PERMISSION_KEYS,
  },
  {
    id: "U-002",
    name: "Ly Sopheak",
    email: "ly.sopheak@fao.org",
    phone: "+855 12 654 321",
    country: "Cambodia",
    province: "Phnom Penh",
    status: "Active",
    permissions: ["training-management", "knowledge-hub", "national-dashboard"],
  },
  {
    id: "U-003",
    name: "Meas Ratanak",
    email: "meas.ratanak@gda.gov.kh",
    phone: "+855 12 220 015",
    country: "Cambodia",
    province: "Kampong Cham",
    status: "Active",
    permissions: ALL_PERMISSION_KEYS,
  },
  {
    id: "U-004",
    name: "Chan Dalis",
    email: "chan.dalis@maff.gov.kh",
    phone: "+855 12 340 118",
    country: "Cambodia",
    province: "Phnom Penh",
    status: "Inactive",
    permissions: ["business-plan", "progress-reporting"],
  },
  {
    id: "U-005",
    name: "Prak Ratha",
    email: "prak.ratha@dacp.gov.kh",
    phone: "+855 12 773 402",
    country: "Cambodia",
    province: "Battambang",
    status: "Active",
    permissions: ["ac-profiles", "commune-verification", "gesi-reporting"],
  },
];

type UserFormState = {
  name: string;
  email: string;
  phone: string;
  country: string;
  province: string;
  active: boolean;
  permissions: string[];
};

const EMPTY_FORM: UserFormState = {
  name: "",
  email: "",
  phone: "",
  country: "Cambodia",
  province: "",
  active: true,
  permissions: [],
};

const PAGE_SIZE = 10;

export function UserManagement() {
  const [users, setUsers] = useState<ManagedUser[]>(SEED_USERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<UserStatus | "all">("all");
  const [page, setPage] = useState(1);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formState, setFormState] = useState<UserFormState>(EMPTY_FORM);
  const [permissionError, setPermissionError] = useState(false);

  const activeFilterCount = statusFilter !== "all" ? 1 : 0;

  const filteredUsers = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return users.filter((u) => {
      const matchesSearch =
        !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || u.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [users, searchTerm, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedUsers = filteredUsers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingId(null);
    setFormState(EMPTY_FORM);
    setPermissionError(false);
  };

  const openNewUser = () => {
    setFormState(EMPTY_FORM);
    setEditingId(null);
    setPermissionError(false);
    setDrawerOpen(true);
  };

  const openEditUser = (u: ManagedUser) => {
    setFormState({
      name: u.name,
      email: u.email,
      phone: u.phone,
      country: u.country,
      province: u.province,
      active: u.status === "Active",
      permissions: u.permissions,
    });
    setEditingId(u.id);
    setPermissionError(false);
    setDrawerOpen(true);
  };

  const detailsValid =
    formState.name.trim() &&
    formState.email.trim() &&
    formState.country.trim() &&
    formState.province.trim();

  const togglePermission = (key: string) => {
    setFormState((f) => ({
      ...f,
      permissions: f.permissions.includes(key)
        ? f.permissions.filter((p) => p !== key)
        : [...f.permissions, key],
    }));
    setPermissionError(false);
  };

  const handleSubmitUser = () => {
    if (!detailsValid) return;
    if (formState.permissions.length === 0) {
      setPermissionError(true);
      return;
    }
    const status: UserStatus = formState.active ? "Active" : "Inactive";

    if (editingId) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingId
            ? {
                ...u,
                name: formState.name,
                email: formState.email,
                phone: formState.phone,
                country: formState.country,
                province: formState.province,
                status,
                permissions: formState.permissions,
              }
            : u
        )
      );
      toast.success("User updated.");
    } else {
      const newUser: ManagedUser = {
        id: `U-${Date.now()}`,
        name: formState.name,
        email: formState.email,
        phone: formState.phone,
        country: formState.country,
        province: formState.province,
        status,
        permissions: formState.permissions,
      };
      setUsers((prev) => [newUser, ...prev]);
      toast.success("User created.");
    }
    closeDrawer();
  };

  const handleDelete = (u: ManagedUser) => {
    const confirmed = window.confirm(`Delete ${u.name} (${u.email})? This cannot be undone.`);
    if (!confirmed) return;
    setUsers((prev) => prev.filter((usr) => usr.id !== u.id));
    toast.success(`${u.name} was deleted.`);
  };

  return (
    <div className="space-y-6 min-w-0 max-w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <UserCog className="h-7 w-7 text-[#032EA1]" />
            User Management
          </h1>
          <p className="text-gray-600 mt-1">
            Create and manage Government Admin accounts for the Ministry / FAO team, and control what each user can see.
          </p>
        </div>
        <button
          type="button"
          onClick={openNewUser}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#032EA1] text-white rounded-lg hover:bg-[#0447D4] transition-colors shadow-md shrink-0"
        >
          <Plus className="w-5 h-5" />
          New User
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search users by name or email..."
              className="w-full pl-10 pr-9 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
            />
            {searchTerm && (
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
          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowFilters((v) => !v)}
              className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors ${
                showFilters || activeFilterCount > 0
                  ? "border-[#032EA1] text-[#032EA1] bg-[#032EA1]/5"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Filter className="w-4 h-4" />
              Filter
              {activeFilterCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[#032EA1] text-white text-[10px] font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Refine Results</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value as UserStatus | "all");
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white"
                >
                  <option value="all">All</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="w-full min-w-0 rounded-2xl border border-gray-200/80 bg-white shadow-[0_4px_24px_-4px_rgba(3,46,161,0.08),0_2px_8px_-2px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="w-full min-w-0 overflow-hidden">
          <table className="w-full table-fixed border-collapse text-left">
            <colgroup>
              <col className="w-[30%]" />
              <col className="w-[18%]" />
              <col className="w-[22%]" />
              <col className="w-[16%]" />
              <col className="w-[14%]" />
            </colgroup>
            <thead>
              <tr className="bg-gradient-to-r from-[#032EA1]/[0.07] via-[#032EA1]/[0.04] to-transparent border-b border-[#032EA1]/15">
                <th className="px-2 sm:px-3 py-2.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#032EA1]">
                  Name
                </th>
                <th className="px-2 sm:px-3 py-2.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#032EA1]">
                  Province
                </th>
                <th className="px-2 sm:px-3 py-2.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#032EA1]">
                  Access
                </th>
                <th className="px-2 sm:px-3 py-2.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#032EA1]">
                  Status
                </th>
                <th className="px-2 sm:px-3 py-2.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#032EA1] text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pagedUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-sm text-gray-400">
                    No users match your search or filters.
                  </td>
                </tr>
              ) : (
                pagedUsers.map((u, rowIdx) => {
                  const StatusIcon = u.status === "Active" ? CheckCircle : MinusCircle;
                  const statusColor = u.status === "Active" ? "text-emerald-600" : "text-gray-500";
                  const fullAccess = u.permissions.length === PERMISSION_MODULES.length;
                  return (
                    <tr
                      key={u.id}
                      onClick={() => openEditUser(u)}
                      className={`group cursor-pointer transition-colors ${
                        rowIdx % 2 === 0 ? "bg-white" : "bg-slate-50/60"
                      } hover:bg-[#032EA1]/[0.04]`}
                    >
                      <td className="px-2 sm:px-3 py-2.5 align-middle max-w-0">
                        <div className="min-w-0 flex flex-col gap-0.5">
                          <span className="text-xs sm:text-sm font-semibold text-gray-900 truncate" title={u.name}>
                            {u.name}
                          </span>
                          <span className="text-[11px] text-gray-500 truncate">{u.email}</span>
                        </div>
                      </td>
                      <td className="px-2 sm:px-3 py-2.5 align-middle max-w-0">
                        <div className="flex items-center gap-1.5 text-gray-700 min-w-0">
                          <MapPin className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                          <span className="text-xs sm:text-sm truncate">{u.province}</span>
                        </div>
                      </td>
                      <td className="px-2 sm:px-3 py-2.5 align-middle max-w-0">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                          <span className="text-xs sm:text-sm text-gray-700 truncate">
                            {fullAccess ? "Full access" : `${u.permissions.length} module${u.permissions.length === 1 ? "" : "s"}`}
                          </span>
                        </div>
                      </td>
                      <td className="px-2 sm:px-3 py-2.5 align-middle max-w-0">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <StatusIcon className={`w-3.5 h-3.5 shrink-0 ${statusColor}`} />
                          <span className="text-xs text-gray-700 truncate">{u.status}</span>
                        </div>
                      </td>
                      <td className="px-2 sm:px-3 py-2.5 align-middle max-w-0">
                        <div className="flex items-center justify-center gap-0.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditUser(u);
                            }}
                            className="p-1.5 rounded-lg text-amber-600 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                            aria-label="Edit user"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(u);
                            }}
                            className="p-1.5 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                            aria-label="Delete user"
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
            {filteredUsers.length === 0
              ? "Showing 0 users"
              : `Showing ${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(
                  currentPage * PAGE_SIZE,
                  filteredUsers.length
                )} of ${filteredUsers.length} users`}
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

      {/* New / Edit User drawer */}
      {drawerOpen && (
        <>
          <div
            className="fixed inset-0 z-[100] bg-black/40 transition-opacity duration-200"
            aria-hidden
            onClick={closeDrawer}
          />
          <div
            className="fixed inset-y-0 right-0 z-[110] flex w-full max-w-2xl flex-col border-l border-gray-200 bg-gray-50 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="user-form-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-gradient-to-br from-[#032EA1] to-[#021c5e] shrink-0">
              <h2 id="user-form-title" className="text-sm font-semibold text-white">
                {editingId ? "Edit Government Admin" : "New Government Admin"}
              </h2>
              <button
                type="button"
                onClick={closeDrawer}
                className="p-1.5 rounded-lg hover:bg-white/15 text-white/90 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4 space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">User Details</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formState.name}
                        onChange={(e) => setFormState((f) => ({ ...f, name: e.target.value }))}
                        placeholder="e.g., Sok Vanna"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input
                          type="email"
                          value={formState.email}
                          onChange={(e) => setFormState((f) => ({ ...f, email: e.target.value }))}
                          placeholder="name@gda.gov.kh"
                          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        type="tel"
                        value={formState.phone}
                        onChange={(e) => setFormState((f) => ({ ...f, phone: e.target.value }))}
                        placeholder="+855 XX XXX XXX"
                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Country <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formState.country}
                        onChange={(e) => setFormState((f) => ({ ...f, country: e.target.value }))}
                        placeholder="e.g., Cambodia"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Province <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <select
                          value={formState.province}
                          onChange={(e) => setFormState((f) => ({ ...f, province: e.target.value }))}
                          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white appearance-none"
                        >
                          <option value="" disabled>Select province</option>
                          {PROVINCE_OPTIONS.map((p) => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setFormState((f) => ({ ...f, active: !f.active }))
                    }
                    className="w-full flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span>
                      <span className="block text-sm font-semibold text-gray-900">Active Status</span>
                      <span className="block text-xs text-gray-500 mt-0.5">User will have access to the system.</span>
                    </span>
                    <span
                      role="switch"
                      aria-checked={formState.active}
                      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                        formState.active ? "bg-[#032EA1]" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                          formState.active ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Permissions</h3>
                <div className="space-y-3">
                  {PERMISSION_MODULES.map((mod) => {
                    const enabled = formState.permissions.includes(mod.key);
                    return (
                      <button
                        key={mod.key}
                        type="button"
                        role="switch"
                        aria-checked={enabled}
                        onClick={() => togglePermission(mod.key)}
                        className="w-full flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-sm font-semibold text-gray-900">{mod.label}</span>
                        <span
                          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                            enabled ? "bg-[#032EA1]" : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                              enabled ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </span>
                      </button>
                    );
                  })}

                  {permissionError && (
                    <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      At least one permission must be selected.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-gray-200 bg-white flex justify-end gap-2 shrink-0">
              <button
                type="button"
                onClick={closeDrawer}
                className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitUser}
                disabled={!detailsValid}
                className="px-4 py-1.5 text-sm bg-[#032EA1] text-white rounded-lg hover:bg-[#0447D4] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingId ? "Save Changes" : "Create User"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
