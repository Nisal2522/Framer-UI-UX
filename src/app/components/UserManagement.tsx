import { useState } from "react";
import {
  Users,
  Plus,
  Search,
  Filter,
  Shield,
  UserCheck,
  UserX,
  Mail,
  Phone,
  MapPin,
  MoreVertical,
  Edit,
  Trash2,
} from "lucide-react";
import { UserForm } from "./UserForm";

const users = [
  {
    id: "USR-001",
    name: "Sok Pisey",
    email: "sok.pisey@kampongthom-ac001.org",
    phone: "+855 12 345 678",
    role: "AC Committee Member",
    organization: "Kampong Thom Rice Cooperative",
    province: "Kampong Thom",
    status: "Active",
    lastLogin: "2024-03-20 14:23",
    registeredDate: "2022-03-15",
  },
  {
    id: "USR-042",
    name: "Chea Sokha",
    email: "chea.sokha@commune-baray.gov.kh",
    phone: "+855 23 456 789",
    role: "Commune Agricultural Officer",
    organization: "Baray Commune Office",
    province: "Kampong Thom",
    status: "Active",
    lastLogin: "2024-03-21 09:15",
    registeredDate: "2021-06-20",
  },
  {
    id: "USR-015",
    name: "Lim Dara",
    email: "lim.dara@gda.gov.kh",
    phone: "+855 23 567 890",
    role: "Business Plan Support Team",
    organization: "GDA/DACP",
    province: "Phnom Penh",
    status: "Active",
    lastLogin: "2024-03-21 11:42",
    registeredDate: "2021-01-10",
  },
  {
    id: "USR-128",
    name: "Keo Sophea",
    email: "keo.sophea@maff.gov.kh",
    phone: "+855 23 678 901",
    role: "Ministry Committee",
    organization: "MAFF",
    province: "Phnom Penh",
    status: "Active",
    lastLogin: "2024-03-20 16:30",
    registeredDate: "2020-11-05",
  },
  {
    id: "USR-089",
    name: "Sarah Johnson",
    email: "sarah.johnson@fao.org",
    phone: "+855 23 789 012",
    role: "FAO Project Officer",
    organization: "FAO Cambodia",
    province: "Phnom Penh",
    status: "Active",
    lastLogin: "2024-03-21 08:55",
    registeredDate: "2021-08-15",
  },
  {
    id: "USR-201",
    name: "Ny Chamroeun",
    email: "ny.chamroeun@kampongthom-ac089.org",
    phone: "+855 12 890 123",
    role: "AC Committee Member",
    organization: "Kampong Thom Organic Farmers",
    province: "Kampong Thom",
    status: "Inactive",
    lastLogin: "2024-02-15 10:20",
    registeredDate: "2024-02-10",
  },
];

const roleColors: Record<string, string> = {
  "AC Committee Member": "bg-blue-100 text-blue-700 border-blue-200",
  "Commune Agricultural Officer": "bg-emerald-100 text-emerald-700 border-emerald-200",
  "Business Plan Support Team": "bg-purple-100 text-purple-700 border-purple-200",
  "Ministry Committee": "bg-orange-100 text-orange-700 border-orange-200",
  "FAO Project Officer": "bg-pink-100 text-pink-700 border-pink-200",
  "System Administrator": "bg-red-100 text-red-700 border-red-200",
};

export function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [showForm, setShowForm] = useState(false);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.organization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === "All" || user.role === selectedRole;
    const matchesStatus =
      selectedStatus === "All" || user.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            User Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage user accounts and access control
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-[#032EA1] to-[#0447D4] text-white px-6 py-3 rounded-lg font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
          Add New User
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">2,847</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-emerald-600 mt-2">2,691</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Inactive Users</p>
              <p className="text-2xl font-bold text-orange-600 mt-2">156</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
              <UserX className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Admin Users</p>
              <p className="text-2xl font-bold text-purple-600 mt-2">42</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or organization..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
            />
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white"
            >
              <option value="All">All Roles</option>
              <option value="AC Committee Member">AC Committee Member</option>
              <option value="Commune Agricultural Officer">
                Commune Agricultural Officer
              </option>
              <option value="Business Plan Support Team">
                Business Plan Support Team
              </option>
              <option value="Ministry Committee">Ministry Committee</option>
              <option value="FAO Project Officer">FAO Project Officer</option>
              <option value="System Administrator">
                System Administrator
              </option>
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  User Information
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Organization
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#032EA1] to-[#0447D4] flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-600">ID: {user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        <span className="truncate max-w-[200px]">
                          {user.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        <span>{user.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                        roleColors[user.role]
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {user.organization}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
                        <MapPin className="w-3 h-3" />
                        {user.province}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                        user.status === "Active"
                          ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                          : "bg-gray-100 text-gray-700 border-gray-200"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          user.status === "Active"
                            ? "bg-emerald-600"
                            : "bg-gray-600"
                        }`}
                      ></span>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-700">{user.lastLogin}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors group">
                        <Edit className="w-4 h-4 text-gray-600 group-hover:text-[#032EA1]" />
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded-lg transition-colors group">
                        <Trash2 className="w-4 h-4 text-gray-600 group-hover:text-[#E00025]" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing {filteredUsers.length} of {users.length} users
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
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No users found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      {/* Form Modal */}
      {showForm && <UserForm onClose={() => setShowForm(false)} />}
    </div>
  );
}