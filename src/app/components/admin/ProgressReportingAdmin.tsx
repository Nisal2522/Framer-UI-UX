import { useState } from "react";
import { Calendar, FileImage, Paperclip, Target } from "lucide-react";

type Row = {
  id: string;
  acCode: string;
  acName: string;
  planYear: string;
  milestone: string;
  period: string;
  pct: number;
  activities: string;
  resources: string;
  challenges: string;
  attachments: number;
};

const rows: Row[] = [
  {
    id: "pu-1",
    acCode: "AC-BB-2024-157",
    acName: "Prasat Sambor Rung Roeang Modern AC",
    planYear: "2026",
    milestone: "M3 — Input bundling & training",
    period: "2026-Q1",
    pct: 72,
    activities: "2 field schools, 1 demo plot visit",
    resources: "Seed co-fund 62%, extension days 18",
    challenges: "Delayed fertilizer delivery (2 weeks)",
    attachments: 4,
  },
  {
    id: "pu-2",
    acCode: "AC-KT-2025-012",
    acName: "Stueng Saen Horticulture AC",
    planYear: "2026",
    milestone: "M1 — Nursery establishment",
    period: "2026-03 (monthly)",
    pct: 55,
    activities: "Shade net repair, seedling count QA",
    resources: "Labor 120 person-days, water 14 tankers",
    challenges: "Staff illness — temporary gap",
    attachments: 2,
  },
  {
    id: "pu-3",
    acCode: "AC-SR-2023-088",
    acName: "Angkor Fresh Vegetables Cooperative",
    planYear: "2025",
    milestone: "M5 — Market linkage",
    period: "2025-Q4",
    pct: 88,
    activities: "3 buyer meetings, cold chain trial",
    resources: "Transport grant drawdown 40%",
    challenges: "Price volatility on leafy greens",
    attachments: 6,
  },
];

export function ProgressReportingAdmin() {
  const [periodMode, setPeriodMode] = useState<"all" | "quarterly" | "monthly">("all");

  const visible =
    periodMode === "all"
      ? rows
      : periodMode === "quarterly"
        ? rows.filter((r) => r.period.includes("Q"))
        : rows.filter((r) => r.period.toLowerCase().includes("monthly"));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Progress reporting & monitoring</h1>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm text-gray-500">Reporting period:</span>
        {(
          [
            ["all", "All submissions"],
            ["quarterly", "Quarterly only"],
            ["monthly", "Monthly only"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setPeriodMode(key)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
              periodMode === key
                ? "border-[#0F2F8F] bg-blue-50 text-[#0F2F8F]"
                : "border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-sm min-w-[960px]">
          <thead className="bg-gradient-to-r from-[#0F2F8F] to-[#1e4aa8] text-white text-left">
            <tr>
              <th className="px-4 py-3 font-semibold">AC</th>
              <th className="px-4 py-3 font-semibold">Plan / milestone</th>
              <th className="px-4 py-3 font-semibold">Period</th>
              <th className="px-4 py-3 font-semibold">% complete</th>
              <th className="px-4 py-3 font-semibold">Activities</th>
              <th className="px-4 py-3 font-semibold">Resources</th>
              <th className="px-4 py-3 font-semibold">Challenges</th>
              <th className="px-4 py-3 font-semibold">Evidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {visible.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50/80 align-top">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">{r.acCode}</p>
                  <p className="text-xs text-gray-500 mt-0.5 max-w-[200px]">{r.acName}</p>
                </td>
                <td className="px-4 py-3 text-gray-700">
                  <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                    <Target className="h-3.5 w-3.5" />
                    {r.planYear}
                  </span>
                  <p className="mt-1">{r.milestone}</p>
                </td>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-gray-400" />
                    {r.period}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="w-24 h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full bg-[#0F2F8F] rounded-full" style={{ width: `${r.pct}%` }} />
                  </div>
                  <span className="text-xs text-gray-600 mt-1 block">{r.pct}%</span>
                </td>
                <td className="px-4 py-3 text-gray-600 max-w-[220px]">{r.activities}</td>
                <td className="px-4 py-3 text-gray-600 max-w-[200px]">{r.resources}</td>
                <td className="px-4 py-3 text-gray-600 max-w-[200px]">{r.challenges}</td>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1">
                    <Paperclip className="h-3.5 w-3.5" />
                    {r.attachments}
                  </span>
                  <span className="inline-flex items-center gap-1 ml-2 text-gray-400">
                    <FileImage className="h-3.5 w-3.5" />
                    photos
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
