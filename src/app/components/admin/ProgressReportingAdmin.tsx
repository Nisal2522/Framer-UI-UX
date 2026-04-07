import { useState } from "react";
import { Activity, AlertCircle, Calendar, FileImage, Paperclip, Target } from "lucide-react";

type Row = {
  id: string;
  acCode: string;
  acName: string;
  province: string;
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
    province: "Kampong Thom",
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
    province: "Kampong Thom",
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
    province: "Siem Reap",
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
    (periodMode === "all"
      ? rows
      : periodMode === "quarterly"
        ? rows.filter((r) => r.period.includes("Q"))
        : rows.filter((r) => r.period.toLowerCase().includes("monthly")));

  const getProgressClass = (pct: number) => {
    if (pct > 80) return "bg-emerald-500";
    if (pct >= 50) return "bg-[#0F2F8F]";
    return "bg-amber-500";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Progress reporting & monitoring</h1>
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex min-w-[280px] flex-col">
          <select
            value={periodMode}
            onChange={(e) => setPeriodMode(e.target.value as "all" | "quarterly" | "monthly")}
            className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-800 shadow-sm outline-none transition focus:border-[#0F2F8F]/35 focus:ring-2 focus:ring-[#0F2F8F]/15"
          >
            <option value="all">All submissions</option>
            <option value="quarterly">Quarterly only</option>
            <option value="monthly">Monthly only</option>
          </select>
          </label>
        </div>
      </div>

      <div className="space-y-3">
        {visible.map((r) => (
          <article
            key={r.id}
            className="rounded-2xl border border-white/20 bg-white/70 p-4 shadow-[0_8px_28px_-18px_rgba(15,47,143,0.45)] backdrop-blur-md transition-all duration-200 hover:scale-[1.01] hover:border-[#0F2F8F]/25 hover:shadow-[0_14px_34px_-20px_rgba(15,47,143,0.55)]"
          >
            <div className="grid gap-4 lg:grid-cols-[1.15fr_0.95fr_1.2fr]">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#0F2F8F]/10 px-2.5 py-1 text-xs font-semibold text-[#0F2F8F]">{r.acCode}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">{r.planYear}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{r.acName}</h3>
                <p className="text-sm font-medium text-slate-700">{r.milestone}</p>

                <div className="rounded-xl border border-slate-200/80 bg-white/70 p-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-600">% complete</span>
                    <span className="font-bold text-slate-800">{r.pct}%</span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className={`h-full rounded-full ${getProgressClass(r.pct)}`} style={{ width: `${r.pct}%` }} />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-xl border border-slate-200/80 bg-white/70 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Period</p>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    {r.period}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200/80 bg-white/70 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Plan / milestone</p>
                  <p className="mt-1 inline-flex items-start gap-1.5 text-sm text-slate-700">
                    <Target className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    <span>{r.milestone}</span>
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                <div className="rounded-xl border border-slate-200/80 bg-white/70 p-3">
                  <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <Activity className="h-3.5 w-3.5" /> Activities
                  </p>
                  <p className="mt-1.5 text-sm text-slate-700">{r.activities}</p>
                </div>
                <div className="rounded-xl border border-slate-200/80 bg-white/70 p-3">
                  <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <AlertCircle className="h-3.5 w-3.5" /> Challenges
                  </p>
                  <p className="mt-1.5 text-sm text-slate-700">{r.challenges}</p>
                </div>
                <div className="rounded-xl border border-slate-200/80 bg-white/70 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Evidence</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-slate-700">
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold">
                      <Paperclip className="h-3.5 w-3.5 text-slate-500" />
                      {r.attachments}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                      <FileImage className="h-3.5 w-3.5" />
                      photos
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-700">{r.resources}</p>
                </div>
              </div>
            </div>
          </article>
        ))}
        {visible.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-8 text-center text-sm text-slate-500 backdrop-blur-md">
            No submissions found for this reporting period.
          </div>
        )}
      </div>
    </div>
  );
}
