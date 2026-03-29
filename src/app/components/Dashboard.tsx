import {
  Users,
  Building2,
  FileCheck,
  Package,
  TrendingUp,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Target,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
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

const stats = [
  {
    name: "Total Cooperatives",
    value: "1,430",
    change: "+12.5%",
    trend: "up",
    icon: Building2,
    color: "from-blue-500 to-blue-600",
  },
  {
    name: "Active Members",
    value: "45,682",
    change: "+8.3%",
    trend: "up",
    icon: Users,
    color: "from-emerald-500 to-emerald-600",
  },
  {
    name: "Approved Plans",
    value: "856",
    change: "+15.2%",
    trend: "up",
    icon: FileCheck,
    color: "from-purple-500 to-purple-600",
  },
  {
    name: "Assets Registered",
    value: "3,245",
    change: "-2.4%",
    trend: "down",
    icon: Package,
    color: "from-orange-500 to-orange-600",
  },
];

const membershipData = [
  { month: "Jan", members: 38000, new: 2100 },
  { month: "Feb", members: 39500, new: 1900 },
  { month: "Mar", members: 41200, new: 2300 },
  { month: "Apr", members: 42800, new: 2100 },
  { month: "May", members: 44100, new: 1800 },
  { month: "Jun", members: 45682, new: 2200 },
];

const businessPlanData = [
  { name: "Approved", value: 856, color: "#10b981" },
  { name: "Under Review", value: 234, color: "#f59e0b" },
  { name: "Rejected", value: 45, color: "#E00025" },
  { name: "Draft", value: 167, color: "#6b7280" },
];

const provinceData = [
  { province: "Kampong Thom", acs: 340, members: 12450 },
  { province: "Siem Reap", acs: 298, members: 10890 },
  { province: "Battambang", acs: 275, members: 9760 },
  { province: "Pursat", acs: 256, members: 8920 },
  { province: "Others", acs: 261, members: 3662 },
];

const alerts = [
  {
    title: "Business Plan Overdue",
    cooperative: "Kampong Thom AC-042",
    type: "warning",
    time: "2 hours ago",
  },
  {
    title: "Profile Verification Pending",
    cooperative: "Siem Reap MAC-015",
    type: "info",
    time: "5 hours ago",
  },
  {
    title: "Asset Maintenance Required",
    cooperative: "Battambang AC-128",
    type: "alert",
    time: "1 day ago",
  },
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          National Dashboard
        </h1>
        <p className="text-gray-600 mt-1">
          Real-time overview of all Agricultural Cooperatives nationwide
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center shadow-lg shadow-${stat.color}/20`}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div
                className={`flex items-center gap-1 text-sm font-medium ${
                  stat.trend === "up" ? "text-emerald-600" : "text-[#E00025]"
                }`}
              >
                {stat.trend === "up" ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {stat.change}
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600 mt-1">{stat.name}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Membership Growth Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Membership Growth
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Total and new members over time
              </p>
            </div>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={membershipData}>
              <defs>
                <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#032EA1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#032EA1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="members"
                stroke="#032EA1"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorMembers)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Business Plan Status */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Business Plan Status
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Distribution of plan statuses
              </p>
            </div>
            <Target className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex items-center gap-8">
            <ResponsiveContainer width="50%" height={250}>
              <PieChart>
                <Pie
                  data={businessPlanData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {businessPlanData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-3">
              {businessPlanData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-gray-700">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Province Performance & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Province Performance */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Provincial Distribution
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                ACs and members by province
              </p>
            </div>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={provinceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="province" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="acs" fill="#032EA1" radius={[8, 8, 0, 0]} />
              <Bar dataKey="members" fill="#E00025" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Alerts & Notifications */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Alerts
            </h3>
            <AlertCircle className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-gray-200 hover:border-[#032EA1] transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      alert.type === "warning"
                        ? "bg-yellow-500"
                        : alert.type === "alert"
                        ? "bg-[#E00025]"
                        : "bg-blue-500"
                    }`}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {alert.title}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {alert.cooperative}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">{alert.time}</p>
                  </div>
                </div>
              </div>
            ))}
            <button className="w-full py-2 text-sm font-medium text-[#032EA1] hover:text-[#0447D4] transition-colors">
              View All Alerts →
            </button>
          </div>
        </div>
      </div>

      {/* GESI Indicators */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Gender & Youth Inclusion Metrics (GESI)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <p className="text-sm text-gray-600">Women Members</p>
            <p className="text-2xl font-bold text-[#032EA1] mt-2">42.3%</p>
            <p className="text-xs text-emerald-600 mt-1">↑ 3.2% from last quarter</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <p className="text-sm text-gray-600">Women in Leadership</p>
            <p className="text-2xl font-bold text-[#032EA1] mt-2">28.7%</p>
            <p className="text-xs text-emerald-600 mt-1">↑ 5.1% from last quarter</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <p className="text-sm text-gray-600">Youth Members (Under 35)</p>
            <p className="text-2xl font-bold text-[#032EA1] mt-2">34.5%</p>
            <p className="text-xs text-emerald-600 mt-1">↑ 2.8% from last quarter</p>
          </div>
        </div>
      </div>
    </div>
  );
}
