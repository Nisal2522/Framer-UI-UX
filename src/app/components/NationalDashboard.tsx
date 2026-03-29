import { useState } from "react";
import {
  TrendingUp,
  Users,
  Building2,
  FileText,
  Package,
  BookOpen,
  MapPin,
  Filter,
  Download,
  Calendar,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#032EA1", "#0447D4", "#1E5EDD", "#3B7BE6", "#5898EF"];

const provinceMemberData = [
  { province: "Kampong Thom", members: 12543, acs: 423 },
  { province: "Siem Reap", members: 9876, acs: 356 },
  { province: "Battambang", members: 11234, acs: 389 },
  { province: "Pursat", members: 8654, acs: 262 },
];

const memberTrendData = [
  { month: "Jan", members: 38200 },
  { month: "Feb", members: 39100 },
  { month: "Mar", members: 40300 },
  { month: "Apr", members: 41200 },
  { month: "May", members: 41800 },
  { month: "Jun", members: 42307 },
];

const businessPlanStatusData = [
  { name: "Approved", value: 342, color: "#10B981" },
  { name: "Under Review", value: 156, color: "#F59E0B" },
  { name: "Revision Required", value: 89, color: "#EF4444" },
  { name: "Draft", value: 234, color: "#6B7280" },
];

const genderDistributionData = [
  { name: "Male", value: 58, color: "#032EA1" },
  { name: "Female", value: 42, color: "#E00025" },
];

const ageGroupData = [
  { group: "18-25", value: 12 },
  { group: "26-35", value: 28 },
  { group: "36-45", value: 34 },
  { group: "46-55", value: 18 },
  { group: "55+", value: 8 },
];

export function NationalDashboard() {
  const [selectedProvince, setSelectedProvince] = useState("All");
  const [selectedPeriod, setSelectedPeriod] = useState("current-year");

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            National Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Nationwide consolidated analytics and monitoring
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center gap-2 flex-1">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white"
            >
              <option value="All">All Provinces</option>
              <option value="Kampong Thom">Kampong Thom</option>
              <option value="Siem Reap">Siem Reap</option>
              <option value="Battambang">Battambang</option>
              <option value="Pursat">Pursat</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white"
            >
              <option value="current-month">Current Month</option>
              <option value="current-quarter">Current Quarter</option>
              <option value="current-year">Current Year</option>
              <option value="all-time">All Time</option>
            </select>
          </div>
        </div>
      </div>

      {/* National Overview KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 shadow-lg text-white">
          <div className="flex items-center justify-between mb-4">
            <Building2 className="w-10 h-10 opacity-80" />
            <div className="flex items-center gap-1 text-sm bg-white/20 px-2 py-1 rounded">
              <ArrowUp className="w-3 h-3" />
              <span>8.2%</span>
            </div>
          </div>
          <p className="text-sm opacity-90">Total Agricultural Cooperatives</p>
          <p className="text-3xl font-bold mt-2">1,430</p>
          <p className="text-xs opacity-80 mt-1">342 Active | 89 New This Year</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 shadow-lg text-white">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-10 h-10 opacity-80" />
            <div className="flex items-center gap-1 text-sm bg-white/20 px-2 py-1 rounded">
              <ArrowUp className="w-3 h-3" />
              <span>5.4%</span>
            </div>
          </div>
          <p className="text-sm opacity-90">Total Farmer Members</p>
          <p className="text-3xl font-bold mt-2">42,307</p>
          <p className="text-xs opacity-80 mt-1">24,458 Male | 17,849 Female</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 shadow-lg text-white">
          <div className="flex items-center justify-between mb-4">
            <FileText className="w-10 h-10 opacity-80" />
            <div className="flex items-center gap-1 text-sm bg-white/20 px-2 py-1 rounded">
              <ArrowUp className="w-3 h-3" />
              <span>12.1%</span>
            </div>
          </div>
          <p className="text-sm opacity-90">Business Plans Approved</p>
          <p className="text-3xl font-bold mt-2">342</p>
          <p className="text-xs opacity-80 mt-1">Approval Rate: 79.3%</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 shadow-lg text-white">
          <div className="flex items-center justify-between mb-4">
            <Package className="w-10 h-10 opacity-80" />
            <div className="flex items-center gap-1 text-sm bg-white/20 px-2 py-1 rounded">
              <ArrowUp className="w-3 h-3" />
              <span>6.7%</span>
            </div>
          </div>
          <p className="text-sm opacity-90">Total Asset Value</p>
          <p className="text-3xl font-bold mt-2">$8.7M</p>
          <p className="text-xs opacity-80 mt-1">2,847 Active Assets</p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Provincial Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Provincial Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={provinceMemberData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="province"
                tick={{ fontSize: 12 }}
                stroke="#6B7280"
              />
              <YAxis tick={{ fontSize: 12 }} stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="members" fill="#032EA1" name="Total Members" />
              <Bar dataKey="acs" fill="#0447D4" name="Number of ACs" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Membership Trend */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Membership Growth Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={memberTrendData}>
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
                dataKey="members"
                stroke="#032EA1"
                strokeWidth={3}
                name="Total Members"
                dot={{ fill: "#032EA1", r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 - Business Plans & Gender Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Business Plan Status */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Business Plan Status
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={businessPlanStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {businessPlanStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {businessPlanStatusData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-gray-700">{item.name}</span>
                </div>
                <span className="font-semibold text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Gender Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Gender Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={genderDistributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {genderDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#032EA1]"></div>
                <span className="text-gray-700">Male Members</span>
              </div>
              <span className="font-semibold text-gray-900">24,458 (58%)</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#E00025]"></div>
                <span className="text-gray-700">Female Members</span>
              </div>
              <span className="font-semibold text-gray-900">17,849 (42%)</span>
            </div>
          </div>
        </div>

        {/* Age Group Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Age Group Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={ageGroupData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis type="number" tick={{ fontSize: 12 }} stroke="#6B7280" />
              <YAxis
                dataKey="group"
                type="category"
                tick={{ fontSize: 12 }}
                stroke="#6B7280"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="value" fill="#032EA1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance Heatmap */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Provincial Performance Heatmap
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              province: "Kampong Thom",
              score: 87,
              status: "High Performing",
              color: "bg-emerald-500",
            },
            {
              province: "Siem Reap",
              score: 72,
              status: "Moderate",
              color: "bg-blue-500",
            },
            {
              province: "Battambang",
              score: 91,
              status: "High Performing",
              color: "bg-emerald-500",
            },
            {
              province: "Pursat",
              score: 58,
              status: "Needs Support",
              color: "bg-orange-500",
            },
          ].map((item) => (
            <div
              key={item.province}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div
                  className={`${item.color} text-white px-3 py-1 rounded-full text-xs font-semibold`}
                >
                  {item.score}%
                </div>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">
                {item.province}
              </h4>
              <p className="text-sm text-gray-600">{item.status}</p>
              <div className="mt-3 bg-gray-200 rounded-full h-2">
                <div
                  className={`${item.color} h-2 rounded-full`}
                  style={{ width: `${item.score}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Knowledge Dissemination & Asset Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Knowledge Dissemination */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Knowledge Dissemination Metrics
            </h3>
            <BookOpen className="w-6 h-6 text-[#032EA1]" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">
                  Total Materials Uploaded
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">847</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-xl font-semibold text-blue-600 mt-1">
                  +42
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">ACs Accessed Materials</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">1,247</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Adoption Rate</p>
                <p className="text-xl font-semibold text-emerald-600 mt-1">
                  87.2%
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Training Completion</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  12,543
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Avg. per AC</p>
                <p className="text-xl font-semibold text-purple-600 mt-1">
                  8.8
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Asset Management Metrics */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Asset Management Overview
            </h3>
            <Package className="w-6 h-6 text-[#032EA1]" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Total Assets Registered</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">2,847</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-xl font-semibold text-blue-600 mt-1">
                  $8.7M
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Good Condition</span>
                <span className="font-semibold text-emerald-600">
                  1,847 (65%)
                </span>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full w-[65%]"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Fair Condition</span>
                <span className="font-semibold text-blue-600">
                  723 (25%)
                </span>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full w-[25%]"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Needs Attention</span>
                <span className="font-semibold text-orange-600">
                  277 (10%)
                </span>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full w-[10%]"></div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-orange-900">
                  142 assets overdue for maintenance
                </p>
                <p className="text-xs text-orange-700 mt-1">
                  Action required across 78 cooperatives
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts & Notifications */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              System Alerts & Action Required
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 border border-orange-200">
                <p className="text-sm text-gray-600">
                  Business Plans Pending Review
                </p>
                <p className="text-2xl font-bold text-orange-600 mt-1">156</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-orange-200">
                <p className="text-sm text-gray-600">Overdue Progress Reports</p>
                <p className="text-2xl font-bold text-red-600 mt-1">43</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-orange-200">
                <p className="text-sm text-gray-600">
                  Profiles Pending Verification
                </p>
                <p className="text-2xl font-bold text-orange-600 mt-1">89</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
