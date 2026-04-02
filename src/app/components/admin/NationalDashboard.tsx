import { useMemo, useState } from "react";
import {
  Building2,
  UserRound,
  Ban,
  LogOut,
  UserPlus,
  FileText,
  Package,
  BookOpen,
  MapPinned,
  TrendingUp,
  Activity,
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
  Area,
  AreaChart,
} from "recharts";

const COLORS = ["#0F2F8F", "#3B5FCC", "#22C55E", "#F59E0B", "#E00025", "#94A3B8"];

const provinceGeo = [
  { province: "Battambang", lat: 13.0957, lon: 103.2022, acs: 118, members: 12400 },
  { province: "Siem Reap", lat: 13.3671, lon: 103.8448, acs: 96, members: 10100 },
  { province: "Kampong Thom", lat: 12.7117, lon: 104.8885, acs: 84, members: 8900 },
  { province: "Kampong Cham", lat: 12.0, lon: 105.45, acs: 76, members: 8200 },
  { province: "Takeo", lat: 10.9929, lon: 104.7847, acs: 62, members: 6400 },
  { province: "Kampot", lat: 10.6104, lon: 104.1815, acs: 55, members: 5800 },
  { province: "Prey Veng", lat: 11.4868, lon: 105.3253, acs: 51, members: 5300 },
  { province: "Banteay Meanchey", lat: 13.7532, lon: 102.9896, acs: 48, members: 4900 },
  { province: "Pursat", lat: 12.5338, lon: 103.9192, acs: 44, members: 4600 },
  { province: "Kandal", lat: 11.2237, lon: 105.1259, acs: 92, members: 9800 },
];

const memberTrend = [
  { period: "Jan", enrolled: 118200 },
  { period: "Feb", enrolled: 119400 },
  { period: "Mar", enrolled: 120800 },
  { period: "Apr", enrolled: 122100 },
  { period: "May", enrolled: 123500 },
  { period: "Jun", enrolled: 124800 },
  { period: "Jul", enrolled: 126200 },
  { period: "Aug", enrolled: 127400 },
  { period: "Sep", enrolled: 128600 },
  { period: "Oct", enrolled: 129800 },
  { period: "Nov", enrolled: 131000 },
  { period: "Dec", enrolled: 132400 },
];

const genderNat = [
  { name: "Male", value: 58 },
  { name: "Female", value: 41 },
  { name: "Other / prefer not", value: 1 },
];

const ageNat = [
  { bracket: "18–29", m: 18500, f: 16200 },
  { bracket: "30–44", m: 22400, f: 19800 },
  { bracket: "45–59", m: 19600, f: 17100 },
  { bracket: "60+", m: 12400, f: 10600 },
];

const cropNat = [
  { crop: "Rice", pct: 42 },
  { crop: "Cassava", pct: 22 },
  { crop: "Maize", pct: 14 },
  { crop: "Vegetables", pct: 12 },
  { crop: "Other", pct: 10 },
];

const bpByProvince = [
  { province: "Battambang", submitted: 98, approved: 82, rate: 84 },
  { province: "Siem Reap", submitted: 76, approved: 61, rate: 80 },
  { province: "Kandal", submitted: 112, approved: 88, rate: 79 },
  { province: "Kampong Cham", submitted: 71, approved: 52, rate: 73 },
  { province: "Takeo", submitted: 54, approved: 38, rate: 70 },
];

const topRejections = [
  { reason: "Incomplete financial annex", count: 38 },
  { reason: "Milestones not measurable", count: 27 },
  { reason: "Missing risk mitigation", count: 19 },
  { reason: "Governance section insufficient", count: 14 },
];

const assetConditions = [
  { name: "Good", value: 52 },
  { name: "Fair", value: 31 },
  { name: "Poor", value: 12 },
  { name: "Unknown", value: 5 },
];

const perfHeat = [
  { province: "Battambang", composite: 86, band: "High" },
  { province: "Kandal", composite: 83, band: "High" },
  { province: "Siem Reap", composite: 78, band: "Medium" },
  { province: "Kampong Thom", composite: 71, band: "Medium" },
  { province: "Prey Veng", composite: 54, band: "Intervention" },
  { province: "Takeo", composite: 49, band: "Intervention" },
];

const kmByProvince = [
  { province: "Battambang", adoption: 78 },
  { province: "Siem Reap", adoption: 71 },
  { province: "Kandal", adoption: 84 },
  { province: "Kampong Cham", adoption: 62 },
  { province: "Takeo", adoption: 55 },
];

function scale(n: number, f: number) {
  return Math.max(0, Math.round(n * f));
}

type Props = {
  scope?: "national" | "provincial";
  provinceLabel?: string;
};

export function NationalDashboard({ scope = "national", provinceLabel = "Battambang" }: Props) {
  const f = scope === "national" ? 1 : 0.13;
  const [granularity, setGranularity] = useState<"monthly" | "quarterly">("monthly");
  const [geoFilter, setGeoFilter] = useState<string>("National");

  const acStats = useMemo(
    () => ({
      active: scale(892, f),
      inactive: scale(124, f),
      suspended: scale(36, f),
      withdrawn: scale(18, f),
      newYtd: scale(64, f),
    }),
    [f]
  );

  const bp = useMemo(
    () => ({
      submitted: scale(428, f),
      approved: scale(312, f),
      rejected: scale(41, f),
      inProgress: scale(75, f),
      approvalRate: 73,
    }),
    [f]
  );

  const assets = useMemo(
    () => ({
      count: scale(18420, f),
      valueUsd: scale(42_800_000, f),
      maintenanceCompliance: 81,
    }),
    [f]
  );

  const km = useMemo(
    () => ({
      materials: scope === "national" ? 186 : 24,
      acsAccessPct: scope === "national" ? 68 : 72,
    }),
    [scope]
  );

  const enrolled = scale(132_400, f);
  const trendData =
    granularity === "monthly"
      ? memberTrend
      : [
          { period: "Q1", enrolled: 121500 },
          { period: "Q2", enrolled: 125200 },
          { period: "Q3", enrolled: 128900 },
          { period: "Q4", enrolled: 132400 },
        ];

  const heatColor = (band: string) =>
    band === "High" ? "#16A34A" : band === "Medium" ? "#EAB308" : "#E00025";

  const title =
    scope === "national"
      ? "National Dashboard"
      : `Provincial Dashboard — ${provinceLabel}`;
  const subtitle =
    scope === "national"
      ? "Ministry / FAO consolidated analytics across all agricultural cooperatives"
      : `PDAFF view: metrics scoped to ${provinceLabel} province (sample assignment)`;
  const scopeLabel = scope === "national" ? "National" : "Provincial";

  const mapProvinces = scope === "national" ? provinceGeo : provinceGeo.filter((p) => p.province === provinceLabel);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">{title}</h1>
      </div>

      {/* 1. National AC Overview */}
      <section className="space-y-6">
        <div className="rounded-xl bg-gradient-to-br from-[#032EA1] to-[#021c5e] p-4 text-white shadow-lg ring-1 ring-white/10 sm:p-5">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5 sm:gap-3">
          {[
            { label: "Active", value: acStats.active, icon: Building2, iconColor: "text-emerald-600" },
            { label: "Inactive", value: acStats.inactive, icon: Activity, iconColor: "text-slate-600" },
            { label: "Suspended", value: acStats.suspended, icon: Ban, iconColor: "text-amber-600" },
            { label: "Withdrawn", value: acStats.withdrawn, icon: LogOut, iconColor: "text-red-600" },
            { label: "New ACs (YTD)", value: acStats.newYtd, icon: UserPlus, iconColor: "text-blue-600" },
          ].map((c) => (
            <div key={c.label} className="min-w-0 rounded-lg bg-white/5 px-2.5 py-2.5 ring-1 ring-white/10">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[10px] font-medium leading-tight text-white/70 sm:text-[11px]">{c.label}</p>
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-amber-200/70 bg-white shadow-[0_0_0_1px_rgba(251,191,36,0.18),0_0_10px_rgba(251,191,36,0.28)] transition-transform duration-200 hover:scale-110">
                  <c.icon className={`h-3.5 w-3.5 ${c.iconColor}`} />
                </div>
              </div>
              <p className="text-xl font-bold tabular-nums sm:text-2xl">{c.value.toLocaleString()}</p>
            </div>
          ))}
        </div>
        </div>
        <div className="h-[320px] rounded-xl overflow-hidden border border-gray-100 bg-white ring-1 ring-black/[0.04]">
          <MapContainer center={[12.7, 104.9]} zoom={scope === "national" ? 6.3 : 8} className="h-full w-full z-0" scrollWheelZoom>
            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {mapProvinces.map((p) => (
              <CircleMarker
                key={p.province}
                center={[p.lat, p.lon]}
                radius={12 + Math.min(28, p.acs / (scope === "national" ? 4 : 2))}
                pathOptions={{
                  color: "#0F2F8F",
                  fillColor: "#3B5FCC",
                  fillOpacity: 0.45,
                  weight: 2,
                }}
              >
                <LeafletTooltip direction="top" offset={[0, -6]} opacity={0.95}>
                  <div className="text-xs font-medium">
                    <div>{p.province}</div>
                    <div>ACs: {scale(p.acs, f)}</div>
                    <div>Members (approx.): {scale(p.members, f).toLocaleString()}</div>
                  </div>
                </LeafletTooltip>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Circle size reflects relative AC density (illustrative). Use ministry GIS layers when integrating production data.
        </p>
      </section>

      {/* 2. Membership statistics */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <UserRound className="h-5 w-5 text-[#0F2F8F]" />
              {scopeLabel} membership statistics
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Enrolled farmers, trends, and demographics{scope === "national" ? " at national level" : ` within ${provinceLabel}`}.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={granularity}
              onChange={(e) => setGranularity(e.target.value as "monthly" | "quarterly")}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white"
            >
              <option value="monthly">Monthly trend</option>
              <option value="quarterly">Quarterly trend</option>
            </select>
            {scope === "national" && (
              <select
                value={geoFilter}
                onChange={(e) => setGeoFilter(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white"
              >
                <option>National</option>
                {provinceGeo.map((p) => (
                  <option key={p.province} value={p.province}>
                    {p.province} (provincial drill-down preview)
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
        <div className="mt-4 grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 rounded-xl bg-gradient-to-br from-[#0F2F8F] to-[#1e4aa8] p-6 text-white">
            <p className="text-sm text-blue-100">
              Total enrolled farmers ({scope === "national" ? geoFilter : provinceLabel})
            </p>
            <p className="text-4xl font-bold mt-2 tabular-nums">{enrolled.toLocaleString()}</p>
            <p className="text-xs text-blue-200 mt-2 flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5" /> +2.1% vs prior year (illustrative)
            </p>
          </div>
          <div className="lg:col-span-2 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData.map((d) => ({ ...d, enrolled: scale(d.enrolled, f) }))}>
                <defs>
                  <linearGradient id="memFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B5FCC" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#3B5FCC" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="enrolled" stroke="#0F2F8F" fill="url(#memFill)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          <div className="h-56">
            <p className="text-sm font-medium text-gray-700 mb-2">Gender</p>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={genderNat} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={2}>
                  {genderNat.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="h-56 md:col-span-2">
            <p className="text-sm font-medium text-gray-700 mb-2">Age bands (disaggregated)</p>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageNat.map((r) => ({ ...r, m: scale(r.m, f), f: scale(r.f, f) }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="bracket" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="m" name="Male" fill="#0F2F8F" radius={[4, 4, 0, 0]} />
                <Bar dataKey="f" name="Female" fill="#E00025" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="md:col-span-3 h-52">
            <p className="text-sm font-medium text-gray-700 mb-2">Primary crop focus ({scope === "national" ? "national" : "provincial"} mix)</p>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={cropNat} margin={{ left: 72 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="crop" width={88} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => [`${v}%`, "Share"]} />
                <Bar dataKey="pct" fill="#22C55E" radius={[0, 6, 6, 0]} name="Share %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* 3. Business plan analytics */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <FileText className="h-5 w-5 text-[#0F2F8F]" />
          Business plan analytics
        </h2>
        <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { label: "Submitted", v: bp.submitted },
            { label: "Approved", v: bp.approved },
            { label: "Rejected", v: bp.rejected },
            { label: "In progress", v: bp.inProgress },
            { label: "Approval rate (KPI)", v: `${bp.approvalRate}%`, highlight: true },
          ].map((x) => (
            <div
              key={x.label}
              className={`rounded-xl border p-4 ${x.highlight ? "border-[#0F2F8F] bg-blue-50/50" : "border-gray-100 bg-gray-50/80"}`}
            >
              <p className="text-xs text-gray-500 font-medium">{x.label}</p>
              <p className="text-xl font-bold text-gray-900 mt-1 tabular-nums">{typeof x.v === "number" ? x.v.toLocaleString() : x.v}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 grid lg:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Top rejection reasons</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topRejections} layout="vertical" margin={{ left: 8, right: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="reason" width={200} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#E00025" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Provincial comparison (approval rate %)</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bpByProvince}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="province" tick={{ fontSize: 10 }} angle={-18} textAnchor="end" height={64} />
                  <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                  <Tooltip />
                  <Bar dataKey="rate" fill="#0F2F8F" name="Approval rate" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Asset management */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Package className="h-5 w-5 text-[#0F2F8F]" />
          Asset management ({scope === "national" ? "national" : "provincial"})
        </h2>
        <div className="mt-4 grid md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-gray-100 p-4">
            <p className="text-xs text-gray-500">Total reported assets</p>
            <p className="text-2xl font-bold text-gray-900">{assets.count.toLocaleString()}</p>
          </div>
          <div className="rounded-xl border border-gray-100 p-4">
            <p className="text-xs text-gray-500">Estimated total value (USD, illustrative)</p>
            <p className="text-2xl font-bold text-gray-900">${(assets.valueUsd / 1_000_000).toFixed(1)}M</p>
          </div>
          <div className="rounded-xl border border-[#0F2F8F]/30 bg-blue-50/40 p-4">
            <p className="text-xs text-gray-600">Maintenance compliance rate</p>
            <p className="text-2xl font-bold text-[#0F2F8F]">{assets.maintenanceCompliance}%</p>
          </div>
        </div>
        <div className="mt-4 h-56 max-w-md">
          <p className="text-sm font-medium text-gray-700 mb-2">Condition mix</p>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={assetConditions} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={88} label>
                {assetConditions.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* 5. Performance heatmap */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Activity className="h-5 w-5 text-[#0F2F8F]" />
          Performance heatmap (province / district lens)
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Composite score from graduation stage, business plan compliance, and membership activity. Bands: high, medium, intervention.
        </p>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={perfHeat} layout="vertical" margin={{ left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis type="category" dataKey="province" width={120} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="composite" name="Score" radius={[0, 6, 6, 0]}>
                {perfHeat.map((e, i) => (
                  <Cell key={i} fill={heatColor(e.band)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-600">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-green-600" /> High performing
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-yellow-500" /> Medium
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-red-600" /> Intervention
          </span>
        </div>
      </section>

      {/* 6. Knowledge management */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-[#0F2F8F]" />
          Knowledge management
        </h2>
        <div className="mt-4 grid sm:grid-cols-3 gap-4">
          <div className="rounded-xl bg-slate-50 border border-gray-100 p-4">
            <p className="text-xs text-gray-500">Materials in system</p>
            <p className="text-2xl font-bold">{km.materials}</p>
          </div>
          <div className="rounded-xl bg-slate-50 border border-gray-100 p-4">
            <p className="text-xs text-gray-500">ACs with at least one download</p>
            <p className="text-2xl font-bold">{km.acsAccessPct}%</p>
          </div>
          <div className="rounded-xl bg-slate-50 border border-gray-100 p-4">
            <p className="text-xs text-gray-500">Dissemination adoption (avg.)</p>
            <p className="text-2xl font-bold">61%</p>
          </div>
        </div>
        <div className="mt-4 h-52">
          <p className="text-sm font-medium text-gray-700 mb-2">Adoption rate by province (%)</p>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={kmByProvince}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="province" tick={{ fontSize: 10 }} angle={-16} textAnchor="end" height={58} />
              <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip />
              <Bar dataKey="adoption" fill="#3B5FCC" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
