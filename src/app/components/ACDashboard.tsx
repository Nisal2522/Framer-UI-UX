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
  MapPinned,
} from "lucide-react";
import { MapContainer, TileLayer, CircleMarker, Tooltip as LeafletTooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
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
  LabelList,
  RadialBarChart,
  RadialBar,
} from "recharts";

const genderData = [
  { name: "Male", value: 258, percent: 58, color: "#0F2F8F" },
  { name: "Female", value: 186, percent: 42, color: "#E00025" },
  { name: "Other", value: 3, percent: 1, color: "#94A3B8" },
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

const farmerAreaData = [
  { area: "Battambang", lat: 13.0957, lon: 103.2022, members: 78 },
  { area: "Siem Reap", lat: 13.3671, lon: 103.8448, members: 62 },
  { area: "Kampong Thom", lat: 12.7117, lon: 104.8885, members: 55 },
  { area: "Kampong Cham", lat: 12.0000, lon: 105.4500, members: 49 },
  { area: "Takeo", lat: 10.9929, lon: 104.7847, members: 41 },
  { area: "Kampot", lat: 10.6104, lon: 104.1815, members: 37 },
  { area: "Prey Veng", lat: 11.4868, lon: 105.3253, members: 33 },
  { area: "Banteay Meanchey", lat: 13.7532, lon: 102.9896, members: 29 },
  { area: "Pursat", lat: 12.5338, lon: 103.9192, members: 26 },
  { area: "Kandal", lat: 11.2237, lon: 105.1259, members: 24 },
  { area: "Kep", lat: 10.4829, lon: 104.3167, members: 13 },
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

      {/* 1. Membership + key stats — compact card */}
      <div className="rounded-xl bg-gradient-to-br from-[#032EA1] to-[#021c5e] p-4 text-white shadow-lg ring-1 ring-white/10 sm:p-5">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white/15 sm:h-12 sm:w-12">
            <Users className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-white/75">Total members</p>
            <p className="mt-0.5 text-3xl font-bold tabular-nums sm:text-4xl">447</p>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2.5 border-t border-white/15 pt-3 sm:grid-cols-4 sm:gap-3">
          <div className="min-w-0 rounded-lg bg-white/5 px-2 py-2 ring-1 ring-white/10 sm:px-2.5">
            <p className="text-[10px] font-medium leading-tight text-white/70 sm:text-[11px]">
              Active members
            </p>
            <p className="mt-1 text-xl font-bold tabular-nums sm:text-2xl">447</p>
          </div>
          <div className="min-w-0 rounded-lg bg-white/5 px-2 py-2 ring-1 ring-white/10 sm:px-2.5">
            <p className="text-[10px] font-medium leading-tight text-white/70 sm:text-[11px]">
              New this year
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              <span className="text-xl font-bold tabular-nums sm:text-2xl">49</span>
              <span className="inline-flex items-center gap-0.5 rounded-md bg-emerald-400/20 px-1.5 py-0.5 text-[11px] font-bold tabular-nums text-emerald-100 ring-1 ring-emerald-300/30 sm:text-xs">
                <TrendingUp className="h-3 w-3 shrink-0" strokeWidth={2.5} aria-hidden />
                +12.3%
              </span>
            </div>
          </div>
          <div className="min-w-0 rounded-lg bg-white/5 px-2 py-2 ring-1 ring-white/10 sm:px-2.5">
            <p className="text-[10px] font-medium leading-tight text-white/70 sm:text-[11px]">
              Dropout rate
            </p>
            <p className="mt-1 text-xl font-bold tabular-nums sm:text-2xl">3.2%</p>
          </div>
          <div className="min-w-0 rounded-lg bg-white/5 px-2 py-2 ring-1 ring-white/10 sm:px-2.5">
            <p className="text-[10px] font-medium leading-tight text-white/70 sm:text-[11px]">
              Business plans approved
            </p>
            <p className="mt-1 text-xl font-bold tabular-nums sm:text-2xl">1</p>
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
        {/* Farmer Member Distribution Map */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Farmer Members by Area</h3>
              <p className="text-sm text-gray-500 mt-1">
                Geographic spread of registered members across Cambodia.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-lg bg-blue-50 border border-blue-200 px-3 py-1.5 text-sm text-[#0F2F8F]">
              <MapPinned className="w-4 h-4" />
              Total mapped members: {farmerAreaData.reduce((sum, item) => sum + item.members, 0)}
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
            <div className="xl:col-span-3 h-[420px] rounded-xl overflow-hidden border border-[#0F2F8F]/20">
              <MapContainer
                center={[12.6, 104.9]}
                zoom={7}
                scrollWheelZoom={false}
                className="h-full w-full z-0"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {farmerAreaData.map((point) => (
                  <CircleMarker
                    key={point.area}
                    center={[point.lat, point.lon]}
                    radius={Math.max(7, Math.round(point.members / 6))}
                    pathOptions={{
                      color: "#0D2A7D",
                      weight: 1.5,
                      fillColor: "#0F2F8F",
                      fillOpacity: 0.52,
                    }}
                  >
                    <LeafletTooltip direction="top" offset={[0, -2]} opacity={1}>
                      <div className="text-xs leading-tight">
                        <p className="font-semibold text-gray-900">{point.area}</p>
                        <p className="text-gray-600">{point.members} members</p>
                      </div>
                    </LeafletTooltip>
                  </CircleMarker>
                ))}
              </MapContainer>
            </div>

            <div className="xl:col-span-1 rounded-xl border border-gray-200 bg-gradient-to-b from-white to-blue-50/40 p-4">
              <h4 className="text-sm font-semibold text-gray-800 mb-3">Top Coverage Areas</h4>
              <div className="space-y-2.5">
                {[...farmerAreaData]
                  .sort((a, b) => b.members - a.members)
                  .slice(0, 6)
                  .map((area) => (
                    <div key={area.area} className="rounded-lg border border-blue-100 bg-white px-3 py-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-gray-800">{area.area}</span>
                        <span className="text-xs font-semibold text-[#0F2F8F]">{area.members}</span>
                      </div>
                      <div className="mt-1.5 h-1.5 rounded-full bg-blue-100">
                        <div
                          className="h-1.5 rounded-full bg-[#0F2F8F]"
                          style={{ width: `${Math.min(100, (area.members / 80) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Gender Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Gender Distribution</h3>
              <p className="text-xs text-gray-400 mt-0.5">All registered members</p>
            </div>
            <span className="text-xs font-semibold text-[#0F2F8F] bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">
              447 total
            </span>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative flex-shrink-0">
              <ResponsiveContainer width={170} height={170}>
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={78}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {genderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: "10px", border: "1px solid #E5E7EB", fontSize: 12 }}
                    formatter={(val: number) => [`${val} members`]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-gray-900">447</span>
                <span className="text-[10px] text-gray-400">members</span>
              </div>
            </div>
            <div className="flex-1 space-y-3">
              {genderData.map((g) => (
                <div key={g.name}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: g.color }} />
                      <span className="text-sm font-medium text-gray-700">{g.name}</span>
                    </div>
                    <span className="text-sm font-bold" style={{ color: g.color }}>{g.value} <span className="text-gray-400 font-normal">({g.percent}%)</span></span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-100">
                    <div className="h-1.5 rounded-full" style={{ width: `${g.percent}%`, backgroundColor: g.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Age Group Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Age Group Distribution</h3>
              <p className="text-xs text-gray-400 mt-0.5">Breakdown by age & gender</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm inline-block bg-[#0F2F8F]" />Male</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm inline-block bg-[#E00025]" />Female</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm inline-block bg-[#94A3B8]" />Other</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={ageGroupData} barCategoryGap="28%" barGap={3}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="group" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: "10px", border: "1px solid #E5E7EB", fontSize: 12, boxShadow: "0 4px 16px 0 rgba(0,0,0,0.08)" }}
                cursor={{ fill: "#F8FAFC" }}
              />
              <Bar dataKey="Male" fill="#0F2F8F" name="Male" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Female" fill="#E00025" name="Female" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Other" fill="#94A3B8" name="Other" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Crop Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Crop Type Distribution</h3>
              <p className="text-xs text-gray-400 mt-0.5">Farmers per crop category</p>
            </div>
          </div>
          <div className="space-y-4">
            {(() => {
              const cropColors = ["#0F2F8F", "#0D2A7D", "#3B5FCC", "#6B8EFF"];
              const max = Math.max(...cropDistributionData.map(d => d.farmers));
              return cropDistributionData.map((item, i) => (
                <div key={item.crop}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: cropColors[i] }} />
                      <span className="text-sm font-medium text-gray-700">{item.crop}</span>
                    </div>
                    <span className="text-sm font-bold" style={{ color: cropColors[i] }}>
                      {item.farmers}
                      <span className="text-xs text-gray-400 font-normal ml-1">farmers</span>
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full bg-gray-100">
                    <div
                      className="h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${(item.farmers / max) * 100}%`, backgroundColor: cropColors[i] }}
                    />
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>

        {/* Livestock Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Livestock Distribution</h3>
              <p className="text-xs text-gray-400 mt-0.5">Total headcount by type</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={livestockData} barCategoryGap="35%">
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="type" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: "10px", border: "1px solid #E5E7EB", fontSize: 12, boxShadow: "0 4px 16px 0 rgba(0,0,0,0.08)" }}
                cursor={{ fill: "#F8FAFC" }}
                formatter={(val: number) => [`${val} head`]}
              />
              <Bar dataKey="count" name="Headcount" radius={[6, 6, 0, 0]}>
                {livestockData.map((_, i) => (
                  <Cell key={i} fill={["#0F2F8F", "#3B5FCC", "#0D2A7D", "#6B8EFF"][i % 4]} />
                ))}
                <LabelList dataKey="count" position="top" style={{ fontSize: 11, fontWeight: 600, fill: "#374151" }} />
              </Bar>
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