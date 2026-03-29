import { useState } from "react";
import {
  MapPin,
  Users,
  Building2,
  FileText,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Filter,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const districtData = [
  { district: "Baray", acs: 156, members: 4523, activePlans: 142 },
  { district: "Stoung", acs: 134, members: 3987, activePlans: 121 },
  { district: "Kampong Svay", acs: 89, members: 2654, activePlans: 78 },
  { district: "Prasat Balangk", acs: 44, members: 1379, activePlans: 38 },
];

const monthlyProgressData = [
  { month: "Jan", target: 85, actual: 78 },
  { month: "Feb", target: 85, actual: 82 },
  { month: "Mar", target: 85, actual: 88 },
  { month: "Apr", target: 85, actual: 91 },
  { month: "May", target: 85, actual: 87 },
  { month: "Jun", target: 85, actual: 89 },
];

export function ProvincialDashboard() {
  const [selectedDistrict, setSelectedDistrict] = useState("All");

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <MapPin className="w-8 h-8 text-[#032EA1]" />
            <h1 className="text-3xl font-bold text-gray-900">
              Kampong Thom Province Dashboard
            </h1>
          </div>
          <p className="text-gray-600">
            Provincial-level analytics and cooperative monitoring
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="flex-1 md:flex-initial px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white"
          >
            <option value="All">All Districts</option>
            <option value="Baray">Baray</option>
            <option value="Stoung">Stoung</option>
            <option value="Kampong Svay">Kampong Svay</option>
            <option value="Prasat Balangk">Prasat Balangk</option>
          </select>
          <select className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white">
            <option value="current-quarter">Current Quarter</option>
            <option value="current-year">Current Year</option>
            <option value="all-time">All Time</option>
          </select>
        </div>
      </div>

      {/* Province KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 shadow-lg text-white">
          <div className="flex items-center justify-between mb-4">
            <Building2 className="w-10 h-10 opacity-80" />
            <div className="flex items-center gap-1 text-sm bg-white/20 px-2 py-1 rounded">
              <ArrowUp className="w-3 h-3" />
              <span>6.2%</span>
            </div>
          </div>
          <p className="text-sm opacity-90">Total ACs in Province</p>
          <p className="text-3xl font-bold mt-2">423</p>
          <p className="text-xs opacity-80 mt-1">389 Active | 34 New</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 shadow-lg text-white">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-10 h-10 opacity-80" />
            <div className="flex items-center gap-1 text-sm bg-white/20 px-2 py-1 rounded">
              <ArrowUp className="w-3 h-3" />
              <span>4.8%</span>
            </div>
          </div>
          <p className="text-sm opacity-90">Total Farmer Members</p>
          <p className="text-3xl font-bold mt-2">12,543</p>
          <p className="text-xs opacity-80 mt-1">7,274 Male | 5,269 Female</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 shadow-lg text-white">
          <div className="flex items-center justify-between mb-4">
            <FileText className="w-10 h-10 opacity-80" />
            <div className="flex items-center gap-1 text-sm bg-white/20 px-2 py-1 rounded">
              <ArrowUp className="w-3 h-3" />
              <span>11.3%</span>
            </div>
          </div>
          <p className="text-sm opacity-90">Approved Business Plans</p>
          <p className="text-3xl font-bold mt-2">142</p>
          <p className="text-xs opacity-80 mt-1">Implementation: 87%</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 shadow-lg text-white">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-10 h-10 opacity-80" />
            <div className="flex items-center gap-1 text-sm bg-white/20 px-2 py-1 rounded">
              <ArrowUp className="w-3 h-3" />
              <span>8.9%</span>
            </div>
          </div>
          <p className="text-sm opacity-90">Performance Score</p>
          <p className="text-3xl font-bold mt-2">87%</p>
          <p className="text-xs opacity-80 mt-1">Rank: #1 of 4 Provinces</p>
        </div>
      </div>

      {/* District Comparison */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          District-Level Comparison
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={districtData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="district" tick={{ fontSize: 12 }} stroke="#6B7280" />
            <YAxis tick={{ fontSize: 12 }} stroke="#6B7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFF",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar dataKey="acs" fill="#032EA1" name="Number of ACs" />
            <Bar dataKey="members" fill="#0447D4" name="Total Members" />
            <Bar dataKey="activePlans" fill="#10B981" name="Active Plans" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Performance Trend */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Provincial Performance Trend
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyProgressData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#6B7280" />
            <YAxis tick={{ fontSize: 12 }} stroke="#6B7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFF",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="target"
              stroke="#94A3B8"
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Target"
            />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#032EA1"
              strokeWidth={3}
              name="Actual Performance"
              dot={{ fill: "#032EA1", r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* District Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {districtData.map((district) => (
          <div
            key={district.district}
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <MapPin className="w-6 h-6 text-[#032EA1]" />
              <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-200">
                Active
              </div>
            </div>
            <h4 className="font-semibold text-gray-900 mb-4">
              {district.district}
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">ACs</span>
                <span className="font-semibold text-gray-900">
                  {district.acs}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Members</span>
                <span className="font-semibold text-gray-900">
                  {district.members.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Active Plans</span>
                <span className="font-semibold text-gray-900">
                  {district.activePlans}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Pending Actions
            </h3>
            <AlertTriangle className="w-5 h-5 text-orange-600" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Profiles Pending Verification
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Require commune officer review
                </p>
              </div>
              <div className="text-2xl font-bold text-orange-600">23</div>
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Business Plans Under Review
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Awaiting support team feedback
                </p>
              </div>
              <div className="text-2xl font-bold text-blue-600">34</div>
            </div>
            <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Overdue Progress Reports
                </p>
                <p className="text-xs text-gray-600 mt-1">Require AC follow-up</p>
              </div>
              <div className="text-2xl font-bold text-red-600">12</div>
            </div>
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Achievements
            </h3>
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <Calendar className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  18 Business Plans Approved
                </p>
                <p className="text-xs text-gray-600 mt-1">This month</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <Users className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  543 New Farmer Members
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Across 34 cooperatives
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <Building2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  12 ACs Graduated to Next Stage
                </p>
                <p className="text-xs text-gray-600 mt-1">This quarter</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}