import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { BarChart3, Users, Sprout, Package, GraduationCap } from "lucide-react";

const COLORS = ["#0F2F8F", "#E00025", "#22C55E", "#F59E0B"];

const profileByAgeGender = [
  { bracket: "18–29", m: 12400, f: 10800 },
  { bracket: "30–44", m: 18200, f: 16100 },
  { bracket: "45–59", m: 15600, f: 13900 },
  { bracket: "60+", m: 9800, f: 8600 },
];

const bpYouth = [
  { segment: "Youth-led milestones", pct: 34 },
  { segment: "Mixed-age committees", pct: 52 },
  { segment: "No youth indicator", pct: 14 },
];

const trainingByGender = [
  { module: "GAP basics", m: 4200, f: 5100 },
  { module: "Financial literacy", m: 3100, f: 3800 },
  { module: "GESI mainstreaming", m: 1800, f: 2400 },
  { module: "Post-harvest", m: 2900, f: 3200 },
];

const assetsByGenderHead = [
  { name: "Male-headed AC reporting", value: 54 },
  { name: "Female-headed AC reporting", value: 28 },
  { name: "Mixed / rotating", value: 18 },
];

export function AdminReportingDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#0F2F8F]">
          <BarChart3 className="h-3.5 w-3.5" />
          GESI & inclusive monitoring
        </div>
        <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Reporting dashboard</h1>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Users className="h-5 w-5 text-[#0F2F8F]" />
          Profiles — national age × gender
        </h2>
        <div className="h-72 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={profileByAgeGender}>
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
      </section>

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Sprout className="h-5 w-5 text-[#0F2F8F]" />
            Business plans — youth participation
          </h2>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={bpYouth} dataKey="pct" nameKey="segment" cx="50%" cy="50%" outerRadius={88} label>
                  {bpYouth.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Package className="h-5 w-5 text-[#0F2F8F]" />
            Assets — reporting by committee gender mix
          </h2>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={assetsByGenderHead} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={88}>
                  {assetsByGenderHead.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-[#0F2F8F]" />
          Training modules — uptake by gender
        </h2>
        <div className="h-80 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trainingByGender}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="module" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="m" name="Male participants" fill="#0F2F8F" radius={[4, 4, 0, 0]} />
              <Bar dataKey="f" name="Female participants" fill="#E00025" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
