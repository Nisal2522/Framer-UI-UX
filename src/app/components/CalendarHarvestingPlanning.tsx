import type { CSSProperties } from "react";

type PhaseBand = {
  start: number;
  end: number;
};

type CropCycle = {
  id: string;
  cycle: string;
  details: string;
  planting: PhaseBand;
  growing: PhaseBand;
  harvesting: PhaseBand;
};

type CropPlan = {
  id: string;
  region: string;
  crop: string;
  cycles: CropCycle[];
};

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

const PLANS: CropPlan[] = [
  {
    id: "p1",
    region: "Battambang",
    crop: "Rice",
    cycles: [
      { id: "p1-a", cycle: "A-Cycle", details: "Lowland field (rain-fed)", planting: { start: 4, end: 5 }, growing: { start: 5, end: 8 }, harvesting: { start: 9, end: 10 } },
      { id: "p1-c", cycle: "B-Cycle", details: "Midland plot (short-cycle)", planting: { start: 2, end: 2 }, growing: { start: 3, end: 4 }, harvesting: { start: 5, end: 5 } },
    ],
  },
  {
    id: "p2",
    region: "Kampong Thom",
    crop: "Cassava",
    cycles: [
      { id: "p2-b", cycle: "A-Cycle", details: "Upland block (savanna)", planting: { start: 8, end: 9 }, growing: { start: 9, end: 10 }, harvesting: { start: 10, end: 11 } },
    ],
  },
  {
    id: "p3",
    region: "Siem Reap",
    crop: "Maize",
    cycles: [
      { id: "p3-a", cycle: "A-Cycle", details: "High land (rain-fed)", planting: { start: 4, end: 4 }, growing: { start: 5, end: 7 }, harvesting: { start: 8, end: 9 } },
      { id: "p3-b", cycle: "B-Cycle", details: "Irrigated plain", planting: { start: 9, end: 9 }, growing: { start: 10, end: 10 }, harvesting: { start: 11, end: 11 } },
    ],
  },
  {
    id: "p4",
    region: "Kandal",
    crop: "Vegetables",
    cycles: [{ id: "p4-a", cycle: "A-Cycle", details: "Lowland garden plot", planting: { start: 0, end: 0 }, growing: { start: 1, end: 2 }, harvesting: { start: 2, end: 3 } }],
  },
  {
    id: "p5",
    region: "Kampot",
    crop: "Beans",
    cycles: [{ id: "p5-a", cycle: "A-Cycle", details: "High land terrace", planting: { start: 5, end: 5 }, growing: { start: 6, end: 7 }, harvesting: { start: 8, end: 9 } }],
  },
];

const getBandMetrics = (phase: PhaseBand) => {
  const startsInYear = phase.start <= phase.end;
  const leftPct = (phase.start / 12) * 100;
  const widthPct = (((startsInYear ? phase.end - phase.start : 12 - phase.start + phase.end) + 1) / 12) * 100;
  return { leftPct, widthPct };
};

const segmentStyle = (phase: PhaseBand, topPx: number, color: string): CSSProperties => {
  const { leftPct, widthPct } = getBandMetrics(phase);
  return {
    top: `${topPx}px`,
    left: `${leftPct}%`,
    width: `${widthPct}%`,
    backgroundColor: color,
  };
};

const dotStyleByPercent = (leftPercent: number, topPx: number, color: string): CSSProperties => ({
  left: `calc(${leftPercent}% - 3px)`,
  top: `${topPx}px`,
  backgroundColor: color,
});

export function CalendarHarvestingPlanning() {
  return (
    <section className="space-y-3">
      <header className="px-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Crop Calendar</h1>
        <p className="mt-1 text-sm text-slate-500">Seasonal planting, growing, and harvesting timeline by region and crop cycle.</p>
      </header>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_30px_-16px_rgba(15,23,42,0.35)]">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-gradient-to-r from-[#f8fbff] to-[#eef4ff] px-4 py-3.5">
          <p className="text-sm font-semibold text-[#1f3d7a]">Annual Cycle Overview</p>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5">
              <span className="h-2.5 w-7 rounded-sm bg-[#1f6f43]" />
              <span>Planting</span>
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5">
              <span className="h-2.5 w-7 rounded-sm bg-[#6c4a2f]" />
              <span>Harvesting</span>
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5">
              <span className="relative inline-block h-[8px] w-7">
                <span className="absolute left-0 top-[3px] h-[2px] w-7 bg-[#4b5563]" />
                <span className="absolute left-0 top-[1px] h-[6px] w-[6px] rounded-full bg-[#374151]" />
                <span className="absolute right-0 top-[1px] h-[6px] w-[6px] rounded-full bg-[#374151]" />
              </span>
              <span>Growing</span>
            </span>
          </div>
        </header>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1180px] border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="w-44 bg-[#1b3768] px-3 py-2.5 text-left text-sm font-semibold text-white">Region</th>
                <th className="w-28 bg-[#1b3768] px-3 py-2.5 text-left text-sm font-semibold text-white">Crop</th>
                <th className="w-24 bg-[#1b3768] px-3 py-2.5 text-left text-sm font-semibold text-white">Cycle</th>
                <th className="w-56 bg-[#1b3768] px-3 py-2.5 text-left text-sm font-semibold text-white">Details</th>
                <th className="bg-[#1b3768] p-0">
                  <div className="grid grid-cols-12">
                    {MONTHS.map((month) => (
                      <span key={month} className="border-l border-white/25 px-1 py-2.5 text-center text-xs font-semibold tracking-wide text-white first:border-l-0">
                        {month}
                      </span>
                    ))}
                  </div>
                </th>
              </tr>
            </thead>

            <tbody>
              {PLANS.map((plan, planIndex) =>
                plan.cycles.map((cycle, cycleIndex) => (
                  <tr key={cycle.id} className="transition-colors hover:bg-[#f8fbff]/70">
                    {cycleIndex === 0 && (
                      <td rowSpan={plan.cycles.length} className={`border-t border-slate-200 px-3 py-3 align-top text-sm font-medium text-slate-800 ${planIndex % 2 === 0 ? "bg-[#edf3ff]" : "bg-[#f7faff]"}`}>
                        {plan.region}
                      </td>
                    )}
                    {cycleIndex === 0 && (
                      <td rowSpan={plan.cycles.length} className={`border-t border-slate-200 px-3 py-3 align-top text-sm font-semibold text-[#1f3d7a] ${planIndex % 2 === 0 ? "bg-[#f3f7ff]" : "bg-[#fafcff]"}`}>
                        {plan.crop}
                        <p className="mt-1 text-[11px] font-medium text-slate-500">{plan.cycles.length} cycle{plan.cycles.length > 1 ? "s" : ""}</p>
                      </td>
                    )}
                    <td className={`border-t border-slate-200 px-3 py-3 text-sm font-medium text-slate-800 ${cycleIndex % 2 === 0 ? "bg-[#f8f1de]" : "bg-[#fcf8ec]"}`}>{cycle.cycle}</td>
                    <td className={`border-t border-slate-200 px-3 py-3 text-sm text-slate-700 ${cycleIndex % 2 === 0 ? "bg-[#fbf6e7]" : "bg-[#fefbf2]"}`}>{cycle.details}</td>

                    <td className="border-t border-slate-200 p-0">
                      {(() => {
                        // Growing line connects exact edges:
                        // planting end edge -> harvesting start edge.
                        const growingStartPct = ((cycle.planting.end + 1) / 12) * 100;
                        const growingEndPct = (cycle.harvesting.start / 12) * 100;
                        const growingLeftPct = Math.min(growingStartPct, growingEndPct);
                        const growingWidthPct = Math.abs(growingEndPct - growingStartPct);

                        return (
                      <div className="relative h-[64px] bg-gradient-to-b from-[#ffffff] to-[#f7faff]">
                        <div className="absolute inset-0 grid grid-cols-12">
                          {MONTHS.map((month) => (
                            <span key={`${cycle.id}-${month}`} className="border-l border-slate-200/90 first:border-l-0" />
                          ))}
                        </div>

                        <div className="pointer-events-none absolute inset-y-[22px] left-0 right-0 rounded-md bg-gradient-to-r from-slate-100/50 via-slate-100/70 to-slate-100/50" />

                        <div className="absolute h-5 rounded-md shadow-[0_2px_8px_-2px_rgba(31,111,67,0.55)]" style={segmentStyle(cycle.planting, 24, "#1f6f43")} />
                        <div className="absolute h-5 rounded-md shadow-[0_2px_8px_-2px_rgba(108,74,47,0.55)]" style={segmentStyle(cycle.harvesting, 24, "#6c4a2f")} />
                        <div
                          className="absolute h-[3px] rounded-full bg-[#4b5563] shadow-[0_2px_4px_rgba(15,23,42,0.25)]"
                          style={{
                            top: "31px",
                            left: `${growingLeftPct}%`,
                            width: `${growingWidthPct}%`,
                          }}
                        />

                        <span className="absolute h-[7px] w-[7px] rounded-full ring-1 ring-white shadow-[0_1px_4px_rgba(15,23,42,0.35)]" style={dotStyleByPercent(growingStartPct, 29.5, "#374151")} />
                        <span className="absolute h-[7px] w-[7px] rounded-full ring-1 ring-white shadow-[0_1px_4px_rgba(15,23,42,0.35)]" style={dotStyleByPercent(growingEndPct, 29.5, "#374151")} />
                      </div>
                        );
                      })()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
