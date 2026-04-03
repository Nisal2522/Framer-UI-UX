import { useCallback, useEffect, useMemo, useRef, useState, useId, type ComponentType } from "react";
import {
  Building2,
  UserRound,
  Ban,
  LogOut,
  UserPlus,
  FileText,
  Package,
  BookOpen,
  TrendingUp,
  AlertTriangle,
  Activity,
  Wheat,
  Carrot,
  Bean,
  Salad,
  CircleDot,
  X,
  ChevronRight,
} from "lucide-react";
import { cn } from "../ui/utils";
import { MapContainer, TileLayer, CircleMarker, Tooltip as LeafletTooltip, useMap } from "react-leaflet";
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
  Line,
  ComposedChart,
  ReferenceArea,
  ReferenceLine,
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

const CROP_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  Rice: Wheat,
  Cassava: Carrot,
  Maize: Bean,
  Vegetables: Salad,
  Other: CircleDot,
};

const BENTO_CARD =
  "rounded-2xl bg-white shadow-[0_10px_15px_-3px_rgb(0_0_0/0.1),0_4px_6px_-4px_rgb(0_0_0/0.08)] ring-1 ring-black/[0.03]";

/** 12px radius, soft shadow — Business plan bento cards */
const BP_CARD =
  "rounded-xl bg-white shadow-[0_10px_15px_-3px_rgb(0_0_0/0.1),0_4px_6px_-4px_rgb(0_0_0/0.08)] ring-1 ring-black/[0.03]";

const BP_REJECTION_RED = "#D00000";
const BP_PROVINCE_BLUE = "#1A365D";

type BpPipeline = {
  submitted: number;
  approved: number;
  inProgress: number;
  rejected: number;
};

function WorkflowStatusFunnel({
  bp,
  rejectedDrillOpen,
  onSegmentClick,
}: {
  bp: BpPipeline;
  rejectedDrillOpen: boolean;
  onSegmentClick: (segmentKey: string) => void;
}) {
  const { submitted, approved, inProgress, rejected } = bp;
  const accounted = approved + inProgress + rejected;
  const remainder = Math.max(0, submitted - accounted);

  const segments = [
    {
      key: "approved",
      label: "Approved",
      count: approved,
      barClass:
        "bg-gradient-to-b from-emerald-500 to-emerald-700 shadow-[inset_0_1px_0_rgb(255_255_255/0.2)]",
      dotClass: "bg-emerald-600",
    },
    {
      key: "inProgress",
      label: "In progress",
      count: inProgress,
      barClass:
        "bg-gradient-to-b from-amber-400 to-amber-600 shadow-[inset_0_1px_0_rgb(255_255_255/0.2)]",
      dotClass: "bg-amber-500",
    },
    {
      key: "rejected",
      label: "Rejected",
      count: rejected,
      barClass: "bg-gradient-to-b from-red-500 to-red-700 shadow-[inset_0_1px_0_rgb(255_255_255/0.15)]",
      dotClass: "bg-red-600",
    },
    ...(remainder > 0
      ? [
          {
            key: "remainder",
            label: "Other / pending",
            count: remainder,
            barClass:
              "bg-gradient-to-b from-slate-400 to-slate-600 shadow-[inset_0_1px_0_rgb(255_255_255/0.15)]",
            dotClass: "bg-slate-500",
          },
        ]
      : []),
  ];

  const base = submitted > 0 ? submitted : 1;

  if (submitted <= 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-8 text-center text-sm text-gray-500">
        No submitted plans in this view.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-end">
        <div className="text-right">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Total submitted</p>
          <p className="font-mono text-2xl font-bold tabular-nums text-gray-900">{submitted.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex min-h-[56px] w-full overflow-hidden rounded-xl bg-white shadow-[inset_0_2px_6px_rgb(0_0_0/0.06)] ring-1 ring-black/[0.07]">
        {segments.map((s) => {
          if (s.count <= 0) return null;
          const pct = (s.count / base) * 100;
          const isRejected = s.key === "rejected";
          const interactive = s.count > 0;
          const showFullLabel = pct >= 14 || isRejected;
          const showCountOnly = !isRejected && pct >= 7 && pct < 14;
          const narrowRejected = Boolean(isRejected && pct < 12);
          const activeRejected = isRejected && rejectedDrillOpen;
          return (
            <div
              key={s.key}
              role={interactive ? "button" : undefined}
              tabIndex={interactive ? 0 : undefined}
              onClick={() => {
                if (!interactive) return;
                onSegmentClick(s.key);
              }}
              onKeyDown={(e) => {
                if (!interactive) return;
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSegmentClick(s.key);
                }
              }}
              className={cn(
                "relative flex min-h-[56px] min-w-0 items-center justify-center border-l border-white/30 first:border-l-0",
                s.barClass,
                interactive &&
                  "motion-safe:cursor-pointer motion-safe:transition-all motion-safe:duration-200 motion-safe:hover:-translate-y-0.5 motion-safe:hover:brightness-110 motion-safe:hover:shadow-md",
                !interactive && "cursor-default",
                activeRejected &&
                  "z-10 ring-2 ring-white/95 shadow-[0_0_0_2px_rgba(220,38,38,0.5),0_10px_22px_rgba(0,0,0,0.14)] motion-safe:hover:translate-y-0"
              )}
              style={{ width: `${pct}%` }}
              title={`${s.label}: ${s.count} (${pct.toFixed(1)}% of submitted)${isRejected ? " — click for rejection reasons" : ""}`}
            >
              {showFullLabel ? (
                <div className="px-1 text-center text-white drop-shadow-sm">
                  <p
                    className={`font-mono font-bold tabular-nums ${narrowRejected ? "text-xs sm:text-sm" : "text-sm sm:text-base"}`}
                  >
                    {s.count}
                  </p>
                  <p
                    className={`font-semibold uppercase tracking-wide text-white/90 ${narrowRejected ? "text-[9px] leading-tight sm:text-[10px]" : "text-[10px] sm:text-[11px]"}`}
                  >
                    {s.label}
                  </p>
                </div>
              ) : showCountOnly ? (
                <span className="font-mono text-xs font-bold tabular-nums text-white">{s.count}</span>
              ) : null}
            </div>
          );
        })}
      </div>

      <ul className="flex flex-wrap gap-x-6 gap-y-2 border-t border-slate-100 pt-3">
        {segments
          .filter((s) => s.count > 0)
          .map((s) => {
            const pct = (s.count / base) * 100;
            return (
              <li key={s.key} className="flex items-center gap-2 text-xs text-gray-700">
                <span className={`h-2.5 w-2.5 shrink-0 rounded-sm shadow-sm ${s.dotClass}`} />
                <span className="font-medium">{s.label}</span>
                <span className="font-mono tabular-nums text-gray-900">{s.count.toLocaleString()}</span>
                <span className="text-gray-400">({pct.toFixed(1)}%)</span>
              </li>
            );
          })}
      </ul>
    </div>
  );
}

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

const topRejectionsTotal = topRejections.reduce((s, r) => s + r.count, 0);
const topRejectionsWithPct = topRejections.map((r) => ({
  ...r,
  pct: Math.round((r.count / topRejectionsTotal) * 100),
}));

function BpRejectionReasonsList({ className, dense }: { className?: string; dense?: boolean }) {
  return (
    <ul className={cn(dense ? "space-y-3" : "mt-5 space-y-4", className)}>
      {topRejectionsWithPct.map((row) => (
        <li key={row.reason}>
          <div className="flex items-start justify-between gap-3 text-sm">
            <span className="min-w-0 leading-snug text-gray-800">{row.reason}</span>
            <span className="shrink-0 font-mono text-sm font-semibold tabular-nums text-[#D00000]">
              {row.pct}%
            </span>
          </div>
          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-[#D00000] shadow-sm transition-[width] duration-500"
              style={{ width: `${row.pct}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

function BpRejectionDrillPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="relative flex min-h-[220px] flex-col rounded-xl border-l-4 border-[#D00000] bg-[#FFF5F5] p-5 shadow-lg ring-1 ring-red-100/90">
      <button
        type="button"
        onClick={onClose}
        className="absolute right-3 top-3 rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-red-100/90 hover:text-gray-900"
        aria-label="Close rejection details"
      >
        <X className="h-4 w-4" />
      </button>
      <p className="pr-10 text-sm font-semibold text-gray-900">Top rejection reasons</p>
      <p className="mt-0.5 text-xs text-gray-500">Share of recorded rejections (illustrative)</p>
      <BpRejectionReasonsList dense className="mt-4 flex-1" />
    </div>
  );
}

const assetConditions = [
  { name: "Good", value: 52 },
  { name: "Fair", value: 31 },
  { name: "Poor", value: 12 },
  { name: "Unknown", value: 5 },
];

/** Navy / slate / green / amber — executive condition palette */
const ASSET_CONDITION_COLORS: Record<string, string> = {
  Good: "#0f172a",
  Fair: "#475569",
  Poor: "#16a34a",
  Unknown: "#d97706",
};

const ASSET_KPI_CARD =
  "relative rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_15px_-3px_rgb(0_0_0/0.08),0_4px_6px_-4px_rgb(0_0_0/0.06)] ring-1 ring-black/[0.02]";

const ASSET_MAINT_TARGET_PCT = 90;

function AssetPerformanceSummaryCard({
  valueUsd,
  maintenancePct,
  valueSpark,
  sparkGradientId,
}: {
  valueUsd: number;
  maintenancePct: number;
  valueSpark: { period: string; m: number }[];
  sparkGradientId: string;
}) {
  const valueM = valueUsd / 1_000_000;
  return (
    <div className={cn(ASSET_KPI_CARD, "flex h-full flex-col p-6")}>
      <p className="text-sm font-semibold text-gray-900">Asset performance & value</p>
      <p className="mt-0.5 text-xs text-slate-500">Indicative value trend and maintenance vs target</p>

      <div className="mt-5 flex-1 flex flex-col">
        <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-4">
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
            Est. total value (USD, illustrative)
          </p>
          <p
            className="mt-1 font-mono text-3xl font-bold tabular-nums tracking-tight text-gray-900 cursor-default"
            title="Breakdown (illustrative): Machinery & equipment ~58% • Buildings & structures ~28% • Vehicles & other ~14%"
          >
            ${valueM.toFixed(1)}M
          </p>
          <p className="mt-1 text-[11px] text-emerald-700 font-medium">+3.1% vs prior year (illustrative)</p>
          <div className="mt-3 h-[72px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={valueSpark} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={sparkGradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#93c5fd" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#93c5fd" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="period" hide />
                <YAxis hide domain={["auto", "auto"]} />
                <Tooltip
                  formatter={(v: number) => [`$${v.toFixed(2)}M`, "Trailing trend"]}
                  labelFormatter={() => "Value trend"}
                />
                <Area
                  type="monotone"
                  dataKey="m"
                  stroke="#2563eb"
                  strokeWidth={2}
                  fill={`url(#${sparkGradientId})`}
                  dot={false}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-slate-100 bg-white p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Maintenance compliance</p>
            <span className="font-mono text-sm font-bold tabular-nums text-[#0f172a]">{maintenancePct}%</span>
          </div>
          <p className="mt-0.5 text-[11px] text-slate-400">Target {ASSET_MAINT_TARGET_PCT}%</p>
          <div className="relative mt-3 h-3 w-full rounded-full bg-slate-200">
            <div
              className="absolute left-0 top-0 h-full rounded-full bg-[#0f172a] transition-[width] duration-500"
              style={{ width: `${Math.min(100, maintenancePct)}%` }}
            />
            <div
              className="absolute top-1/2 z-10 h-5 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500 shadow-sm ring-2 ring-white"
              style={{ left: `${ASSET_MAINT_TARGET_PCT}%` }}
              title={`Target ${ASSET_MAINT_TARGET_PCT}%`}
            />
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
            <span className="text-slate-600">Last updated ~2 hours ago</span>
            <span className="mx-1.5 text-slate-300">·</span>
            <span className="text-emerald-700 font-medium">+3% vs last month (illustrative)</span>
          </p>
        </div>
      </div>
    </div>
  );
}

const perfHeat = [
  { province: "Battambang", composite: 86, band: "High" },
  { province: "Kandal", composite: 83, band: "High" },
  { province: "Siem Reap", composite: 78, band: "Medium" },
  { province: "Kampong Thom", composite: 71, band: "Medium" },
  { province: "Prey Veng", composite: 54, band: "Intervention" },
  { province: "Takeo", composite: 49, band: "Intervention" },
];

const NATIONAL_COMPOSITE_AVG = Math.round(
  perfHeat.reduce((s, r) => s + r.composite, 0) / perfHeat.length
);

function perfBandFill(band: string) {
  return band === "High" ? "#16a34a" : band === "Medium" ? "#ca8a04" : "#e11d48";
}

function PerfHeatYAxisTick({
  x,
  y,
  payload,
  rows,
}: {
  x: number;
  y: number;
  payload: { value: string };
  rows: { province: string; band: string }[];
}) {
  const row = rows.find((r) => r.province === payload.value);
  const band = row?.band ?? "Medium";
  const Icon = band === "High" ? TrendingUp : band === "Intervention" ? AlertTriangle : Activity;
  const iconClass =
    band === "High" ? "text-emerald-600" : band === "Intervention" ? "text-red-600" : "text-amber-600";
  return (
    <g transform={`translate(${x},${y})`}>
      <foreignObject x={-132} y={-12} width={128} height={24} className="overflow-visible">
        <div className="flex h-6 items-center justify-end gap-1.5 pr-1 text-right">
          <span className="truncate text-xs font-semibold text-gray-900">{payload.value}</span>
          <Icon className={`h-3.5 w-3.5 shrink-0 ${iconClass}`} aria-hidden />
        </div>
      </foreignObject>
    </g>
  );
}

function PerfLollipopBarShape(
  props: {
    x?: number | string;
    y?: number | string;
    width?: number | string;
    height?: number | string;
    payload?: { province: string; composite: number; band: string };
    fill?: string;
    onProvinceHover?: (p: string | null) => void;
  }
) {
  const x = Number(props.x ?? 0);
  const y = Number(props.y ?? 0);
  const width = Number(props.width ?? 0);
  const height = Number(props.height ?? 0);
  const { payload, fill = "#16a34a", onProvinceHover } = props;
  const val = payload?.composite ?? 0;
  const cy = y + height / 2;
  const r = 12;
  const sw = 8;
  const lineX2 = Math.max(x + sw / 2, x + width - r);
  const cx = x + width;
  const textFill = payload?.band === "Medium" ? "#422006" : "#ffffff";
  return (
    <g
      onMouseEnter={() => payload?.province && onProvinceHover?.(payload.province)}
      style={{ cursor: "pointer" }}
    >
      <line
        x1={x}
        y1={cy}
        x2={lineX2}
        y2={cy}
        stroke={fill}
        strokeWidth={sw}
        strokeLinecap="round"
      />
      <circle cx={cx} cy={cy} r={r} fill={fill} stroke="#ffffff" strokeWidth={2} />
      <text
        x={cx}
        y={cy}
        dy="0.35em"
        textAnchor="middle"
        fill={textFill}
        fontSize={11}
        fontWeight={700}
        style={{ fontFamily: "ui-monospace, monospace" }}
      >
        {val}
      </text>
    </g>
  );
}

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

const TOTAL_MEMBERS_EST = provinceGeo.reduce((s, p) => s + p.members, 0);

function drillDownFactor(provinceFilter: string): number {
  if (provinceFilter === "All") return 1;
  const row = provinceGeo.find((p) => p.province === provinceFilter);
  if (!row) return 1;
  return Math.max(0.05, row.members / TOTAL_MEMBERS_EST);
}

/** Count-up runs only in this subtree so the dashboard (map + charts) does not re-render every frame. */
function CountUpInteger({ value, className }: { value: number; className?: string }) {
  const lastShownRef = useRef(value);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const reduceMotion =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      lastShownRef.current = value;
      setDisplay(value);
      return;
    }
    const from = lastShownRef.current;
    const to = value;
    if (from === to) {
      setDisplay(to);
      return;
    }
    const start = performance.now();
    const dur = 520;
    let raf = 0;
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - (1 - p) ** 3;
      const next = Math.round(from + (to - from) * eased);
      lastShownRef.current = next;
      setDisplay(next);
      if (p < 1) raf = requestAnimationFrame(step);
      else {
        lastShownRef.current = to;
        setDisplay(to);
      }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return <span className={className}>{display.toLocaleString()}</span>;
}

function MapViewController({ provinceFilter }: { provinceFilter: string }) {
  const map = useMap();
  useEffect(() => {
    if (provinceFilter === "All") {
      map.setView([12.7, 104.9], 6.3);
    } else {
      const p = provinceGeo.find((x) => x.province === provinceFilter);
      if (p) map.setView([p.lat, p.lon], 8.5);
    }
  }, [provinceFilter, map]);
  return null;
}

type Props = {
  scope?: "national" | "provincial";
  provinceLabel?: string;
};

export function NationalDashboard({ scope = "national", provinceLabel = "Battambang" }: Props) {
  const initialProvince = scope === "provincial" ? provinceLabel : "All";
  const [provinceFilter, setProvinceFilter] = useState<string>(initialProvince);
  const f = drillDownFactor(provinceFilter);
  const [granularity, setGranularity] = useState<"monthly" | "quarterly">("monthly");
  const [bpRejectedDrillOpen, setBpRejectedDrillOpen] = useState(false);
  const [perfChartHoverProvince, setPerfChartHoverProvince] = useState<string | null>(null);

  const acStatsNational = useMemo(
    () => ({
      active: scale(892, 1),
      inactive: scale(124, 1),
      suspended: scale(36, 1),
      withdrawn: scale(18, 1),
      newYtd: scale(64, 1),
    }),
    []
  );

  const acStats = acStatsNational;

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

  const handleBpSegmentClick = useCallback(
    (segmentKey: string) => {
      if (segmentKey === "rejected") {
        if (bp.rejected <= 0) return;
        setBpRejectedDrillOpen((v) => !v);
      } else {
        setBpRejectedDrillOpen(false);
      }
    },
    [bp.rejected]
  );

  useEffect(() => {
    setBpRejectedDrillOpen(false);
  }, [provinceFilter]);

  useEffect(() => {
    if (bp.rejected <= 0) setBpRejectedDrillOpen(false);
  }, [bp.rejected]);

  useEffect(() => {
    setPerfChartHoverProvince(null);
  }, [provinceFilter]);

  const assets = useMemo(
    () => ({
      count: scale(18420, f),
      valueUsd: scale(42_800_000, f),
      maintenanceCompliance: 81,
    }),
    [f]
  );

  const assetConditionSlices = useMemo(
    () =>
      assetConditions.map((row) => ({
        ...row,
        fill: ASSET_CONDITION_COLORS[row.name] ?? "#94a3b8",
        estCount: Math.round(assets.count * (row.value / 100)),
      })),
    [assets.count]
  );

  const assetValueSparkSeries = useMemo(() => {
    const endM = assets.valueUsd / 1_000_000;
    const startM = Math.max(0.3, endM * 0.78);
    const months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
    return months.map((period, i) => ({
      period,
      m: Math.round((startM + ((endM - startM) * i) / 11 + Math.sin(i * 0.6) * 0.06 * endM) * 100) / 100,
    }));
  }, [assets.valueUsd]);

  const assetSparkGradientId = useId().replace(/:/g, "");

  const km = useMemo(
    () => ({
      materials: provinceFilter === "All" ? 186 : Math.round(24 + (186 - 24) * f),
      acsAccessPct: provinceFilter === "All" ? 68 : Math.min(92, 62 + Math.round(10 * f)),
    }),
    [provinceFilter, f]
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

  const enrollmentDualData = useMemo(
    () =>
      trendData.map((d) => ({
        period: d.period,
        national: d.enrolled,
        provincial: provinceFilter === "All" ? d.enrolled : scale(d.enrolled, f),
      })),
    [trendData, provinceFilter, f]
  );

  const chartUid = useId().replace(/:/g, "");

  const bpChartData = useMemo(() => {
    if (provinceFilter === "All") return bpByProvince;
    const hit = bpByProvince.find((b) => b.province === provinceFilter);
    if (hit) return [hit];
    const geo = provinceGeo.find((p) => p.province === provinceFilter);
    if (!geo) return bpByProvince;
    const rate = Math.min(88, 68 + (geo.acs % 12));
    return [
      {
        province: geo.province,
        submitted: Math.max(12, Math.round(geo.acs * 0.75)),
        approved: Math.max(10, Math.round(geo.acs * 0.6)),
        rate,
      },
    ];
  }, [provinceFilter]);

  /** Ascending so highest rate renders at top of horizontal bar chart (Recharts category order). */
  const bpChartSorted = useMemo(
    () => [...bpChartData].sort((a, b) => a.rate - b.rate),
    [bpChartData]
  );

  const perfHeatFiltered = useMemo(() => {
    if (provinceFilter === "All") return perfHeat;
    const hit = perfHeat.find((h) => h.province === provinceFilter);
    if (hit) return [hit];
    const geo = provinceGeo.find((p) => p.province === provinceFilter);
    if (!geo) return perfHeat;
    const composite = Math.min(92, 58 + (geo.acs % 25));
    const band: "High" | "Medium" | "Intervention" =
      composite >= 75 ? "High" : composite >= 60 ? "Medium" : "Intervention";
    return [{ province: geo.province, composite, band }];
  }, [provinceFilter]);

  const perfHeatSorted = useMemo(
    () => [...perfHeatFiltered].sort((a, b) => b.composite - a.composite),
    [perfHeatFiltered]
  );

  const kmByProvinceFiltered = useMemo(() => {
    if (provinceFilter === "All") return kmByProvince;
    const hit = kmByProvince.find((k) => k.province === provinceFilter);
    if (hit) return [hit];
    const geo = provinceGeo.find((p) => p.province === provinceFilter);
    if (!geo) return kmByProvince;
    const adoption = Math.min(90, 55 + (geo.members % 18));
    return [{ province: geo.province, adoption }];
  }, [provinceFilter]);

  const title =
    provinceFilter === "All" ? "National Dashboard" : `National Dashboard — ${provinceFilter}`;
  const scopeLabel = provinceFilter === "All" ? "National" : "Provincial";
  const membershipPlace =
    provinceFilter === "All" ? "national level" : provinceFilter;

  const leaderboardRows = useMemo(
    () =>
      [...provinceGeo]
        .sort((a, b) => b.acs - a.acs)
        .map((p) => {
          const bpRow = bpByProvince.find((b) => b.province === p.province);
          return {
            province: p.province,
            acs: p.acs,
            members: p.members,
            approvalRate: bpRow?.rate ?? null,
          };
        }),
    []
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-gray-500 max-w-2xl">
            National totals at a glance; drill into any province from the map, leaderboard, or filter below.
          </p>
        </div>
        <div className="flex flex-col gap-1.5 min-w-[200px]">
          <label htmlFor="province-scope" className="text-xs font-medium text-gray-500">
            Province focus
          </label>
          <select
            id="province-scope"
            value={provinceFilter}
            onChange={(e) => setProvinceFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white shadow-sm"
          >
            <option value="All">All provinces (national trends)</option>
            {provinceGeo.map((p) => (
              <option key={p.province} value={p.province}>
                {p.province}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 1. Global pulse — national KPIs only */}
      <section className="space-y-6">
        <div className="rounded-xl bg-gradient-to-br from-[#032EA1] to-[#021c5e] p-4 text-white shadow-lg ring-1 ring-white/10 sm:p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-white/60 mb-3">National totals</p>
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

        {/* Map + provincial leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          <div className="lg:col-span-2 h-[min(420px,55vh)] min-h-[280px] rounded-xl overflow-hidden border border-gray-100 bg-white ring-1 ring-black/[0.04]">
            <MapContainer center={[12.7, 104.9]} zoom={6.3} className="h-full w-full z-0" scrollWheelZoom>
              <MapViewController provinceFilter={provinceFilter} />
              <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {provinceGeo.map((p) => {
                const selected = provinceFilter === p.province;
                const perfHover = perfChartHoverProvince === p.province;
                const baseR = 12 + Math.min(28, p.acs / 4);
                return (
                  <CircleMarker
                    key={p.province}
                    center={[p.lat, p.lon]}
                    radius={perfHover ? baseR + 8 : baseR}
                    pathOptions={{
                      color: selected ? "#E00025" : perfHover ? "#059669" : "#0F2F8F",
                      fillColor: selected ? "#E00025" : perfHover ? "#10b981" : "#3B5FCC",
                      fillOpacity: selected ? 0.55 : perfHover ? 0.62 : 0.45,
                      weight: selected ? 4 : perfHover ? 3 : 2,
                    }}
                    eventHandlers={{
                      click: () => setProvinceFilter(p.province),
                    }}
                  >
                    <LeafletTooltip direction="top" offset={[0, -6]} opacity={0.95}>
                      <div className="text-xs font-medium">
                        <div>{p.province}</div>
                        <div>ACs: {p.acs}</div>
                        <div>Members (approx.): {p.members.toLocaleString()}</div>
                        <div className="text-[10px] text-gray-500 mt-1">Click to filter dashboard</div>
                      </div>
                    </LeafletTooltip>
                  </CircleMarker>
                );
              })}
            </MapContainer>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col min-h-[280px] lg:min-h-0 lg:max-h-[min(420px,55vh)]">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/80">
              <h2 className="text-sm font-semibold text-gray-900">Provincial leaderboard</h2>
              <p className="text-xs text-gray-500 mt-0.5">By AC count — click a row to focus</p>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
              {leaderboardRows.map((row) => {
                const active = provinceFilter === row.province;
                return (
                  <button
                    key={row.province}
                    type="button"
                    onClick={() => setProvinceFilter(row.province)}
                    className={`w-full text-left px-4 py-3 transition-colors hover:bg-blue-50/50 ${
                      active ? "bg-blue-50 border-l-4 border-l-[#032EA1]" : "border-l-4 border-l-transparent"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-gray-900">{row.province}</span>
                      {row.approvalRate != null && (
                        <span className="text-xs tabular-nums text-emerald-700 font-medium">{row.approvalRate}% BP</span>
                      )}
                    </div>
                    <div className="mt-1 flex gap-3 text-xs text-gray-500">
                      <span>
                        <span className="font-semibold text-gray-700">{row.acs}</span> ACs
                      </span>
                      <span>
                        <span className="font-semibold text-gray-700">{row.members.toLocaleString()}</span> members
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="px-4 py-2 border-t border-gray-100 bg-gray-50/50">
              <button
                type="button"
                onClick={() => setProvinceFilter("All")}
                className="text-xs font-medium text-[#032EA1] hover:text-[#0447D4]"
              >
                Clear focus — show all provinces
              </button>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-400">
          Circle size reflects relative AC density (illustrative). Click a province on the map or list to filter charts below.
        </p>
      </section>

      {/* 2. Membership statistics — bento grid */}
      <section className="rounded-2xl bg-[#F3F4F6] p-6 sm:p-8 font-sans shadow-[0_10px_15px_-3px_rgb(0_0_0/0.08)] ring-1 ring-black/[0.04]">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-gray-200/80 pb-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <UserRound className="h-5 w-5 text-[#0F2F8F]" />
              {scopeLabel} membership statistics
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Enrolled farmers, trends, and demographics at {membershipPlace}.
            </p>
          </div>
          <select
            value={granularity}
            onChange={(e) => setGranularity(e.target.value as "monthly" | "quarterly")}
            className="text-sm rounded-xl border-0 bg-white/90 px-3 py-2 shadow-[0_4px_6px_-1px_rgb(0_0_0/0.08)] ring-1 ring-black/[0.06]"
          >
            <option value="monthly">Monthly trend</option>
            <option value="quarterly">Quarterly trend</option>
          </select>
        </div>

        <div className="grid grid-cols-12 gap-5 lg:gap-6">
          {/* Row 1: total + trend */}
          <div
            className={`col-span-12 lg:col-span-3 relative overflow-hidden rounded-2xl p-6 text-white shadow-[0_10px_15px_-3px_rgb(0_0_0/0.2)] ring-1 ring-white/20 bg-gradient-to-br from-[#021c5e] via-[#032EA1] to-[#1e4aa8]`}
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
            <div className="relative flex items-start justify-between gap-2">
              <p className="text-xs font-medium uppercase tracking-wide text-white/75">
                Total enrolled ({provinceFilter === "All" ? "National" : provinceFilter})
              </p>
              <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-200 ring-1 ring-white/20">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                Live
              </span>
            </div>
            <p className="relative mt-3 text-3xl font-bold tabular-nums tracking-tight sm:text-4xl">
              <CountUpInteger value={enrolled} />
            </p>
            <p className="relative mt-3 flex items-center gap-1.5 text-xs text-blue-100/90">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 shadow-inner ring-1 ring-white/15">
                <TrendingUp className="h-4 w-4 text-emerald-300 drop-shadow-sm" />
              </span>
              +2.1% vs prior year (illustrative)
            </p>
          </div>

          <div className={`col-span-12 lg:col-span-9 ${BENTO_CARD} p-5`}>
            <p className="text-sm font-medium text-gray-800 mb-1">
              Enrollment trend
              {provinceFilter !== "All" && (
                <span className="font-normal text-gray-500"> — {provinceFilter} vs national</span>
              )}
            </p>
            <div
              key={`trend-${provinceFilter}-${granularity}`}
              className="h-56 animate-in fade-in-0 duration-300"
            >
              <ResponsiveContainer width="100%" height="100%">
                {provinceFilter === "All" ? (
                  <AreaChart data={enrollmentDualData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id={`${chartUid}-areaNat`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3B5FCC" stopOpacity={0.1} />
                        <stop offset="100%" stopColor="#3B5FCC" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                    <XAxis dataKey="period" tick={{ fontSize: 11 }} tickLine={false} axisLine={{ stroke: "#E5E7EB" }} />
                    <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={{ stroke: "#E5E7EB" }} />
                    <Tooltip />
                    <Area
                      type="basis"
                      dataKey="national"
                      name="Enrolled"
                      stroke="#0F2F8F"
                      strokeWidth={2.5}
                      fill={`url(#${chartUid}-areaNat)`}
                    />
                  </AreaChart>
                ) : (
                  <ComposedChart data={enrollmentDualData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id={`${chartUid}-areaProv`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0F2F8F" stopOpacity={0.1} />
                        <stop offset="100%" stopColor="#0F2F8F" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                    <XAxis dataKey="period" tick={{ fontSize: 11 }} tickLine={false} axisLine={{ stroke: "#E5E7EB" }} />
                    <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={{ stroke: "#E5E7EB" }} />
                    <Tooltip />
                    <Area
                      type="basis"
                      dataKey="provincial"
                      name={provinceFilter}
                      stroke="#0F2F8F"
                      strokeWidth={2.5}
                      fill={`url(#${chartUid}-areaProv)`}
                    />
                    <Line
                      type="basis"
                      dataKey="national"
                      name="National avg."
                      stroke="#94A3B8"
                      strokeWidth={2}
                      strokeDasharray="6 5"
                      dot={false}
                    />
                  </ComposedChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Row 2: gender + age */}
          <div className={`col-span-12 md:col-span-4 ${BENTO_CARD} p-5`}>
            <p className="text-sm font-medium text-gray-800 mb-3">
              {provinceFilter === "All"
                ? "Gender distribution (national)"
                : `Gender distribution in ${provinceFilter}`}
            </p>
            <div
              key={`gender-${provinceFilter}`}
              className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-in fade-in-0 duration-300"
            >
              <div className="relative mx-auto h-[200px] w-[200px] shrink-0 sm:mx-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genderNat}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius="58%"
                      outerRadius="82%"
                      paddingAngle={2}
                      cornerRadius={6}
                    >
                      {genderNat.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: number) => [`${v}%`, "Share"]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Total</p>
                  <p className="text-lg font-bold tabular-nums text-gray-900">
                    <CountUpInteger value={enrolled} />
                  </p>
                </div>
              </div>
              <ul className="flex flex-1 flex-col justify-center gap-2.5 text-sm">
                {genderNat.map((g, i) => (
                  <li key={g.name} className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-gray-700">
                      <span className="font-medium text-gray-900">{g.name}</span>
                      <span className="text-gray-500"> — {g.value}%</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={`col-span-12 md:col-span-8 ${BENTO_CARD} p-5`}>
            <p className="text-sm font-medium text-gray-800 mb-1">
              {provinceFilter === "All"
                ? "Age bands (national, disaggregated)"
                : `Age bands in ${provinceFilter} (disaggregated)`}
            </p>
            <div
              key={`age-${provinceFilter}`}
              className="h-56 animate-in fade-in-0 duration-300"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ageNat.map((r) => ({ ...r, m: scale(r.m, f), f: scale(r.f, f) }))} barGap={4} barCategoryGap="18%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                  <XAxis dataKey="bracket" tick={{ fontSize: 11 }} tickLine={false} axisLine={{ stroke: "#E5E7EB" }} />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={{ stroke: "#E5E7EB" }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ paddingTop: 8 }} />
                  <Bar dataKey="m" name="Male" fill="#0F2F8F" maxBarSize={28} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="f" name="Female" fill="#E00025" maxBarSize={28} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Row 3: crops */}
          <div className={`col-span-12 ${BENTO_CARD} p-5`}>
            <p className="text-sm font-medium text-gray-800 mb-4">
              {provinceFilter === "All"
                ? "Primary crop focus (national mix)"
                : `Primary crop focus in ${provinceFilter}`}
            </p>
            <ul
              key={`crops-${provinceFilter}`}
              className="space-y-4 animate-in fade-in-0 duration-300"
            >
              {cropNat.map((row) => {
                const Icon = CROP_ICONS[row.crop] ?? CircleDot;
                return (
                  <li key={row.crop} className="flex items-center gap-3 sm:gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 shadow-sm ring-1 ring-emerald-100">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-sm font-medium text-gray-900">{row.crop}</span>
                        <span className="text-sm tabular-nums text-gray-600">{row.pct}%</span>
                      </div>
                      <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-[width] duration-700 ease-out motion-reduce:transition-none"
                          style={{ width: `${row.pct}%` }}
                        />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* 3. Business plan analytics — bento + lifecycle KPIs */}
      <section className="rounded-2xl bg-slate-50 p-6 sm:p-8 font-sans shadow-[0_10px_15px_-3px_rgb(0_0_0/0.06)] ring-1 ring-black/[0.04]">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <FileText className="h-5 w-5 text-[#0F2F8F]" />
          Business plan analytics
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Pipeline lifecycle and provincial approval performance; click <span className="font-medium text-gray-700">Rejected</span>{" "}
          on the workflow bar for rejection reasons
          {provinceFilter === "All" ? "" : ` (${provinceFilter} focus where applicable)`}.
        </p>

        <div className="mt-6 space-y-5">
          {/* Card 1 — workflow funnel + optional rejection drill-down */}
          <div className={`${BP_CARD} p-5`}>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-4">Workflow status</p>
            <div
              className={cn(
                "flex flex-col gap-5 lg:flex-row lg:items-stretch",
                bpRejectedDrillOpen && bp.rejected > 0 ? "lg:gap-3" : ""
              )}
            >
              <div
                className={cn(
                  "min-w-0 motion-safe:transition-[width,max-width] motion-safe:duration-500 motion-safe:ease-out",
                  bpRejectedDrillOpen && bp.rejected > 0
                    ? "lg:w-3/5 lg:max-w-[60%] lg:flex-shrink-0"
                    : "w-full"
                )}
              >
                <WorkflowStatusFunnel
                  bp={{
                    submitted: bp.submitted,
                    approved: bp.approved,
                    inProgress: bp.inProgress,
                    rejected: bp.rejected,
                  }}
                  rejectedDrillOpen={bpRejectedDrillOpen}
                  onSegmentClick={handleBpSegmentClick}
                />
              </div>
              {bpRejectedDrillOpen && bp.rejected > 0 && (
                <>
                  <div
                    className="hidden shrink-0 flex-col items-center justify-center gap-1 self-center text-red-400 lg:flex"
                    aria-hidden
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-500 shadow-sm ring-2 ring-white">
                      <ChevronRight className="h-5 w-5" strokeWidth={2.5} />
                    </div>
                    <div className="h-6 w-0.5 rounded-full bg-gradient-to-b from-red-300/80 to-transparent" />
                  </div>
                  <div
                    className={cn(
                      "min-w-0 w-full motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-right-6 motion-safe:duration-500",
                      "lg:w-2/5 lg:max-w-[40%]"
                    )}
                  >
                    <BpRejectionDrillPanel onClose={() => setBpRejectedDrillOpen(false)} />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Provincial comparison (rejection reasons: drill-down from Rejected segment only) */}
          <div className={`${BP_CARD} p-5`}>
            <p className="text-sm font-semibold text-gray-900">Provincial comparison</p>
            <p className="text-xs text-gray-500 mt-0.5">Approval rate — highest to lowest</p>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={bpChartSorted}
                  layout="vertical"
                  margin={{ left: 4, right: 12, top: 8, bottom: 8 }}
                  barCategoryGap={14}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="province"
                    width={108}
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip formatter={(val: number) => [`${val}%`, "Approval rate"]} />
                  <Bar
                    dataKey="rate"
                    name="Approval rate"
                    fill={BP_PROVINCE_BLUE}
                    radius={[0, 6, 6, 0]}
                    maxBarSize={14}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Asset management — bento KPIs + donut condition mix */}
      <section className="rounded-2xl bg-slate-50 p-6 sm:p-8 font-sans shadow-[0_10px_15px_-3px_rgb(0_0_0/0.06)] ring-1 ring-black/[0.04]">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Package className="h-5 w-5 text-[#0F2F8F]" />
          Asset management ({provinceFilter === "All" ? "national" : "provincial"})
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Condition distribution, indicative portfolio value trend, and maintenance vs target
          {provinceFilter === "All" ? "" : ` (${provinceFilter})`}.
        </p>

        <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-stretch">
          <div className="w-full min-w-0 lg:w-1/2">
            <div className={cn(ASSET_KPI_CARD, "h-full p-6")}>
              <p className="text-sm font-semibold text-gray-900">Condition mix</p>
              <p className="mt-0.5 text-xs text-slate-500">Share by reported condition (illustrative %)</p>
              <div className="mt-6 flex flex-col items-stretch gap-8 lg:flex-row lg:items-center lg:gap-10">
                <div className="relative mx-auto h-[260px] w-full max-w-[300px] shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={assetConditionSlices}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius="58%"
                        outerRadius="88%"
                        paddingAngle={2.5}
                        cornerRadius={7}
                        stroke="#ffffff"
                        strokeWidth={2}
                      >
                        {assetConditionSlices.map((entry, i) => (
                          <Cell key={i} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v: number, name) => [`${v}%`, name]} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center pr-1">
                    <div className="text-center">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Total assets</p>
                      <p className="font-mono text-2xl font-bold tabular-nums text-gray-900 sm:text-3xl">
                        {assets.count.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
                <ul className="min-w-0 flex-1 space-y-3">
                  {assetConditionSlices.map((row) => (
                    <li
                      key={row.name}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3 sm:flex-nowrap"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span
                          className="h-3.5 w-3.5 shrink-0 rounded-full shadow-sm ring-2 ring-white"
                          style={{ backgroundColor: row.fill }}
                        />
                        <span className="font-semibold text-gray-900">{row.name}</span>
                      </div>
                      <p className="text-sm text-slate-600">
                        <span className="font-mono font-semibold tabular-nums text-gray-900">
                          {row.estCount.toLocaleString()}
                        </span>
                        <span className="text-slate-400"> ({row.value}%)</span>
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="w-full min-w-0 lg:w-1/2">
            <AssetPerformanceSummaryCard
              valueUsd={assets.valueUsd}
              maintenancePct={assets.maintenanceCompliance}
              valueSpark={assetValueSparkSeries}
              sparkGradientId={assetSparkGradientId}
            />
          </div>
        </div>
      </section>

      {/* 5. Performance heatmap — lollipop + band shading + national avg */}
      <section className="rounded-2xl bg-slate-50 p-6 sm:p-8 font-sans shadow-[0_10px_15px_-3px_rgb(0_0_0/0.06)] ring-1 ring-black/[0.04]">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Activity className="h-5 w-5 text-[#0F2F8F]" />
          Performance heatmap (province / district lens)
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Composite score (leaderboard). Shaded bands: intervention (0–50), medium (50–75), high (75–100). Hover a row to
          highlight the province on the map. Dashed line: national average ({NATIONAL_COMPOSITE_AVG}).
        </p>
        <div
          className="mt-6 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500"
          key={provinceFilter}
          onMouseLeave={() => setPerfChartHoverProvince(null)}
          style={{ height: Math.max(300, perfHeatSorted.length * 56 + 80) }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              layout="vertical"
              data={perfHeatSorted}
              margin={{ left: 4, right: 28, top: 28, bottom: 8 }}
            >
              <ReferenceArea x1={0} x2={50} fill="#fecaca" fillOpacity={0.35} ifOverflow="visible" />
              <ReferenceArea x1={50} x2={75} fill="#fde68a" fillOpacity={0.3} ifOverflow="visible" />
              <ReferenceArea x1={75} x2={100} fill="#bbf7d0" fillOpacity={0.35} ifOverflow="visible" />
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
              <XAxis
                type="number"
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: "#475569", fontFamily: "ui-monospace, monospace" }}
                tickFormatter={(v) => `${v}`}
              />
              <YAxis
                type="category"
                dataKey="province"
                width={136}
                interval={0}
                tickLine={false}
                axisLine={false}
                tick={(props) => <PerfHeatYAxisTick {...props} rows={perfHeatSorted} />}
              />
              <Tooltip
                formatter={(v: number) => [`${v}`, "Composite score"]}
                labelFormatter={(_, p) => (p?.[0]?.payload?.province as string) ?? ""}
              />
              <ReferenceLine
                x={NATIONAL_COMPOSITE_AVG}
                stroke="#64748b"
                strokeWidth={1.5}
                strokeDasharray="5 5"
                label={{
                  value: `National avg ${NATIONAL_COMPOSITE_AVG}`,
                  position: "top",
                  fill: "#64748b",
                  fontSize: 10,
                  fontWeight: 600,
                }}
              />
              <Bar
                dataKey="composite"
                name="Score"
                shape={(shapeProps: unknown) => (
                  <PerfLollipopBarShape
                    {...(shapeProps as {
                      x?: number | string;
                      y?: number | string;
                      width?: number | string;
                      height?: number | string;
                      fill?: string;
                      payload?: { province: string; composite: number; band: string };
                    })}
                    onProvinceHover={setPerfChartHoverProvince}
                  />
                )}
                isAnimationActive={false}
              >
                {perfHeatSorted.map((e, i) => (
                  <Cell key={i} fill={perfBandFill(e.band)} />
                ))}
              </Bar>
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-600">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" /> High (75+)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-600" /> Medium (50–75)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-600" /> Intervention (&lt;50)
          </span>
          <span className="flex items-center gap-1.5 text-slate-500">
            <span className="h-0 w-6 border-t-2 border-dashed border-slate-500" /> National average
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
            <BarChart data={kmByProvinceFiltered}>
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
