import {
  Users,
  TrendingUp,
  FileText,
  Package,
  BookOpen,
  Award,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const genderData = [
  { name: "Male", value: 258, percent: 58, color: "#032EA1" },
  { name: "Female", value: 186, percent: 42, color: "#E00025" },
  { name: "Other", value: 3, percent: 1, color: "#9CA3AF" },
];

const ageGroupData = [
  { group: "18-25", Male: 25, Female: 18, Other: 2 },
  { group: "26-35", Male: 71, Female: 50, Other: 2 },
  { group: "36-45", Male: 91, Female: 63, Other: 2 },
  { group: "46-55", Male: 52, Female: 36, Other: 1 },
  { group: "55+", Male: 20, Female: 21, Other: 0 },
];

const cropDistributionData = [
  { crop: "Rice", farmers: 234 },
  { crop: "Cassava", farmers: 156 },
  { crop: "Corn", farmers: 98 },
  { crop: "Vegetables", farmers: 76 },
];

const livestockData = [
  { type: "Cattle", count: 128 },
  { type: "Poultry", count: 312 },
  { type: "Pigs", count: 89 },
  { type: "Goats", count: 45 },
];

export function ACDashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">AC Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Monitor your cooperative's performance, assets, and progress in one place.
        </p>
      </div>

      {/* 1. Total Membership Display - Critical Priority */}
      <div className="bg-[#032EA1] rounded-xl p-8 shadow-lg text-white">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-white/20 rounded-lg flex items-center justify-center">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm opacity-90">Total Membership</p>
              <p className="text-4xl font-bold mt-1">447</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">This Year</p>
            <div className="flex items-center gap-2 mt-1">
              <TrendingUp className="w-5 h-5" />
              <span className="text-2xl font-bold">+12.3%</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/20">
          <div>
            <p className="text-xs opacity-75">Active Members</p>
            <p className="text-2xl font-bold mt-1">447</p>
          </div>
          <div>
            <p className="text-xs opacity-75">New This Year</p>
            <p className="text-2xl font-bold mt-1">49</p>
          </div>
          <div>
            <p className="text-xs opacity-75">Dropout Rate</p>
            <p className="text-2xl font-bold mt-1">3.2%</p>
          </div>
        </div>
      </div>

      {/* 3. Business Plan Status Widget - Critical Priority */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            Business Plan Status
          </h3>
          <FileText className="w-6 h-6 text-[#032EA1]" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Overview */}
          <div>
            <div className="flex items-center justify-between mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Current Status</p>
                <p className="text-2xl font-bold text-emerald-700 mt-1">Approved</p>
              </div>
              <CheckCircle className="w-12 h-12 text-emerald-600" />
            </div>

            <div className="space-y-3">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Implementation Progress
                  </span>
                  <span className="text-lg font-bold text-[#032EA1]">73%</span>
                </div>
                <div className="bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-[#032EA1] to-[#0447D4] h-3 rounded-full"
                    style={{ width: "73%" }}
                  ></div>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Approved Date
                </p>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">March 15, 2024</span>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Milestones & Alerts */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              Upcoming Milestones
            </h4>
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-900">Equipment Purchase</span>
                </div>
                <span className="text-xs text-gray-600">Due: Apr 30</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-900">Training Session</span>
                </div>
                <span className="text-xs text-gray-600">Due: May 15</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-900">Crop Expansion</span>
                </div>
                <span className="text-xs text-gray-600">Due: Jun 20</span>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-orange-900">
                    2 Activities Overdue
                  </p>
                  <p className="text-xs text-orange-700 mt-1">
                    Progress report submission and farmer training completion require
                    immediate attention.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Member Demographics Visualization - High Priority */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gender Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Gender Distribution
          </h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-gray-600">Male</p>
              <p className="text-xl font-bold text-[#032EA1] mt-1">258 (58%)</p>
            </div>
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-xs text-gray-600">Female</p>
              <p className="text-xl font-bold text-[#E00025] mt-1">186 (42%)</p>
            </div>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg sm:col-span-1 col-span-2">
              <p className="text-xs text-gray-600">Other</p>
              <p className="text-xl font-bold text-gray-700 mt-1">3 (1%)</p>
            </div>
          </div>
        </div>

        {/* Age Group Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Age Group Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={ageGroupData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="group" tick={{ fontSize: 12 }} stroke="#6B7280" />
              <YAxis tick={{ fontSize: 12 }} stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="Male" fill="#032EA1" name="Male" />
              <Bar dataKey="Female" fill="#E00025" name="Female" />
              <Bar dataKey="Other" fill="#9CA3AF" name="Other" />
              <Legend />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Crop Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Crop Type Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={cropDistributionData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis type="number" tick={{ fontSize: 12 }} stroke="#6B7280" />
              <YAxis
                dataKey="crop"
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
              <Bar dataKey="farmers" fill="#032EA1" name="Farmers by crop" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Livestock Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Livestock Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={livestockData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="type" tick={{ fontSize: 12 }} stroke="#6B7280" />
              <YAxis tick={{ fontSize: 12 }} stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="count" fill="#0447D4" name="Headcount" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Asset Overview Widget - High Priority */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Asset Overview</h3>
          <Package className="w-6 h-6 text-[#032EA1]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-600">Total Assets</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">28</p>
          </div>
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <p className="text-sm text-gray-600">Good Condition</p>
            <p className="text-3xl font-bold text-emerald-600 mt-2">18</p>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-gray-600">Fair Condition</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">7</p>
          </div>
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-gray-600">Needs Attention</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">3</p>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-900">
                2 Assets Overdue for Maintenance
              </p>
              <ul className="text-xs text-red-700 mt-2 space-y-1">
                <li>• Rice Mill Machine - Last serviced 8 months ago</li>
                <li>• Water Pump System - Maintenance due 15 days ago</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Knowledge & Training Metrics - Medium Priority */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Knowledge & Training Metrics
          </h3>
          <BookOpen className="w-6 h-6 text-[#032EA1]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <BookOpen className="w-8 h-8 text-blue-600 mb-3" />
            <p className="text-sm text-gray-600">Materials Received</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">47</p>
            <p className="text-xs text-gray-500 mt-2">+5 this month</p>
          </div>
          <div className="p-6 bg-purple-50 border border-purple-200 rounded-lg">
            <CheckCircle className="w-8 h-8 text-purple-600 mb-3" />
            <p className="text-sm text-gray-600">Activity Completion</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">89%</p>
            <p className="text-xs text-gray-500 mt-2">Above target (75%)</p>
          </div>
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-lg">
            <Users className="w-8 h-8 text-emerald-600 mb-3" />
            <p className="text-sm text-gray-600">Training Participation</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">342</p>
            <p className="text-xs text-gray-500 mt-2">Members participated</p>
          </div>
        </div>
      </div>
    </div>
  );
}