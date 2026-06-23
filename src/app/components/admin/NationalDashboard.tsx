import { useCallback, useEffect, useMemo, useRef, useState, type ComponentType } from "react";
import {
  Building2,
  UserRound,
  FileText,
  Package,
  BookOpen,
  TrendingUp,
  AlertTriangle,
  Activity,
  Download,
  Wheat,
  Carrot,
  Bean,
  Salad,
  CircleDot,
  X,
  ChevronRight,
  Layers,
  ChevronDown,
  Check,
  Truck,
  Droplets,
  Scale,
  Zap,
  Warehouse,
  Wrench,
} from "lucide-react";
import { cn } from "../ui/utils";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, CircleMarker, Tooltip as LeafletTooltip, useMap } from "react-leaflet";
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
  Line,
  LineChart,
  ComposedChart,
  ReferenceArea,
  ReferenceLine,
} from "recharts";

const COLORS = ["#0F2F8F", "#3B5FCC", "#22C55E", "#F59E0B", "#E00025", "#94A3B8"];

const provinceGeo = [
  { province: "Phnom Penh", lat: 11.5564, lon: 104.9282, acs: 142, members: 15200 },
  { province: "Banteay Meanchey", lat: 13.7532, lon: 102.9896, acs: 48, members: 4900 },
  { province: "Battambang", lat: 13.0957, lon: 103.2022, acs: 118, members: 12400 },
  { province: "Kampong Cham", lat: 12.0, lon: 105.45, acs: 76, members: 8200 },
  { province: "Kampong Chhnang", lat: 12.25, lon: 104.67, acs: 42, members: 4400 },
  { province: "Kampong Speu", lat: 11.45, lon: 104.52, acs: 38, members: 3900 },
  { province: "Kampong Thom", lat: 12.7117, lon: 104.8885, acs: 84, members: 8900 },
  { province: "Preah Sihanouk", lat: 10.6282, lon: 103.5234, acs: 33, members: 3400 },
  { province: "Kampot", lat: 10.6104, lon: 104.1815, acs: 55, members: 5800 },
  { province: "Kandal", lat: 11.2237, lon: 105.1259, acs: 92, members: 9800 },
  { province: "Kep", lat: 10.4864, lon: 104.3172, acs: 14, members: 1400 },
  { province: "Koh Kong", lat: 11.6154, lon: 102.9841, acs: 22, members: 2200 },
  { province: "Kratie", lat: 12.4888, lon: 106.0186, acs: 35, members: 3600 },
  { province: "Mondulkiri", lat: 12.4539, lon: 107.1874, acs: 18, members: 1800 },
  { province: "Oddar Meanchey", lat: 14.1601, lon: 103.4977, acs: 26, members: 2600 },
  { province: "Pailin", lat: 12.8494, lon: 102.6042, acs: 12, members: 1200 },
  { province: "Preah Vihear", lat: 13.8039, lon: 104.9803, acs: 24, members: 2400 },
  { province: "Pursat", lat: 12.5338, lon: 103.9192, acs: 44, members: 4600 },
  { province: "Prey Veng", lat: 11.4868, lon: 105.3253, acs: 51, members: 5300 },
  { province: "Ratanakiri", lat: 13.7283, lon: 107.0049, acs: 20, members: 2000 },
  { province: "Siem Reap", lat: 13.3671, lon: 103.8448, acs: 96, members: 10100 },
  { province: "Stung Treng", lat: 13.5237, lon: 105.9685, acs: 16, members: 1600 },
  { province: "Svay Rieng", lat: 11.0877, lon: 105.7997, acs: 30, members: 3100 },
  { province: "Takeo", lat: 10.9929, lon: 104.7847, acs: 62, members: 6400 },
  { province: "Tboung Khmum", lat: 11.9153, lon: 105.6459, acs: 58, members: 6100 },
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

const CROP_COLORS: Record<string, string> = {
  Rice: "#f59e0b",
  Cassava: "#10b981",
  Maize: "#f97316",
  Vegetables: "#22c55e",
  Other: "#94a3b8",
};

const provinceCrops: Record<string, { dominant: string; secondary: string; pct: number }> = {
  "Phnom Penh":       { dominant: "Vegetables", secondary: "Other",      pct: 55 },
  "Banteay Meanchey": { dominant: "Rice",        secondary: "Maize",      pct: 68 },
  "Battambang":       { dominant: "Rice",        secondary: "Maize",      pct: 72 },
  "Kampong Cham":     { dominant: "Cassava",     secondary: "Maize",      pct: 58 },
  "Kampong Chhnang":  { dominant: "Rice",        secondary: "Vegetables", pct: 65 },
  "Kampong Speu":     { dominant: "Rice",        secondary: "Maize",      pct: 60 },
  "Kampong Thom":     { dominant: "Rice",        secondary: "Cassava",    pct: 55 },
  "Preah Sihanouk":   { dominant: "Vegetables",  secondary: "Other",      pct: 48 },
  "Kampot":           { dominant: "Vegetables",  secondary: "Rice",       pct: 44 },
  "Kandal":           { dominant: "Vegetables",  secondary: "Rice",       pct: 52 },
  "Kep":              { dominant: "Vegetables",  secondary: "Other",      pct: 60 },
  "Koh Kong":         { dominant: "Cassava",     secondary: "Vegetables", pct: 50 },
  "Kratie":           { dominant: "Cassava",     secondary: "Other",      pct: 62 },
  "Mondulkiri":       { dominant: "Maize",       secondary: "Cassava",    pct: 58 },
  "Oddar Meanchey":   { dominant: "Maize",       secondary: "Rice",       pct: 54 },
  "Pailin":           { dominant: "Maize",       secondary: "Cassava",    pct: 65 },
  "Preah Vihear":     { dominant: "Maize",       secondary: "Cassava",    pct: 56 },
  "Pursat":           { dominant: "Rice",        secondary: "Maize",      pct: 62 },
  "Prey Veng":        { dominant: "Rice",        secondary: "Vegetables", pct: 70 },
  "Ratanakiri":       { dominant: "Cassava",     secondary: "Maize",      pct: 64 },
  "Siem Reap":        { dominant: "Rice",        secondary: "Vegetables", pct: 58 },
  "Stung Treng":      { dominant: "Rice",        secondary: "Cassava",    pct: 55 },
  "Svay Rieng":       { dominant: "Rice",        secondary: "Cassava",    pct: 64 },
  "Takeo":            { dominant: "Rice",        secondary: "Vegetables", pct: 66 },
  "Tboung Khmum":     { dominant: "Cassava",     secondary: "Maize",      pct: 60 },
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

const ASSET_TYPE_META: Record<string, { color: string; bg: string; textColor: string; pct: number }> = {
  Equipment:      { color: "#032EA1", bg: "#eff6ff", textColor: "#1e40af", pct: 55 },
  Vehicle:        { color: "#0891b2", bg: "#ecfeff", textColor: "#0e7490", pct: 20 },
  Building:       { color: "#7c3aed", bg: "#f5f3ff", textColor: "#6d28d9", pct: 15 },
  Infrastructure: { color: "#059669", bg: "#ecfdf5", textColor: "#047857", pct: 10 },
};

const ASSET_TYPE_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  Equipment:      Package,
  Vehicle:        Truck,
  Building:       Warehouse,
  Infrastructure: Layers,
};

const ASSET_SUBTYPES: {
  name: string; type: string; baseCount: number; goodPct: number;
  pearlFunded: boolean; icon: ComponentType<{ className?: string }>;
}[] = [
  { name: "Water Pump System",      type: "Equipment",      baseCount: 3240, goodPct: 71, pearlFunded: true,  icon: Droplets },
  { name: "Weighing Scale",         type: "Equipment",      baseCount: 2190, goodPct: 82, pearlFunded: true,  icon: Scale    },
  { name: "Rice Mill Machine",      type: "Equipment",      baseCount: 1860, goodPct: 68, pearlFunded: false, icon: Wheat    },
  { name: "Solar Drying System",    type: "Equipment",      baseCount: 1420, goodPct: 79, pearlFunded: true,  icon: Zap      },
  { name: "Tractor",                type: "Vehicle",        baseCount: 1840, goodPct: 62, pearlFunded: false, icon: Wrench   },
  { name: "Irrigation Pipeline",    type: "Infrastructure", baseCount: 1270, goodPct: 75, pearlFunded: true,  icon: Layers   },
  { name: "Seed Storage Warehouse", type: "Building",       baseCount: 1120, goodPct: 71, pearlFunded: false, icon: Warehouse},
  { name: "Delivery Truck",         type: "Vehicle",        baseCount:  980, goodPct: 58, pearlFunded: false, icon: Truck    },
];

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


function scale(n: number, f: number) {
  return Math.max(0, Math.round(n * f));
}

const TOTAL_MEMBERS_EST = provinceGeo.reduce((s, p) => s + p.members, 0);

function drillDownFactor(selected: string[]): number {
  if (selected.length === 0) return 1;
  const total = selected.reduce((sum, name) => {
    const row = provinceGeo.find((p) => p.province === name);
    return sum + (row ? row.members / TOTAL_MEMBERS_EST : 0);
  }, 0);
  return Math.min(1, Math.max(0.05, total));
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

function MapViewController({ selected }: { selected: string[] }) {
  const map = useMap();
  useEffect(() => {
    if (selected.length === 0) {
      map.setView([12.7, 104.9], 6.3);
    } else if (selected.length === 1) {
      const p = provinceGeo.find((x) => x.province === selected[0]);
      if (p) map.setView([p.lat, p.lon], 8.5);
    } else {
      const pts = selected.flatMap((name) => {
        const p = provinceGeo.find((x) => x.province === name);
        return p ? [[p.lat, p.lon] as [number, number]] : [];
      });
      if (pts.length > 0) {
        const avgLat = pts.reduce((s, pt) => s + pt[0], 0) / pts.length;
        const avgLon = pts.reduce((s, pt) => s + pt[1], 0) / pts.length;
        map.setView([avgLat, avgLon], 7);
      }
    }
  }, [selected, map]);
  return null;
}

type Props = {
  scope?: "national" | "provincial";
  provinceLabel?: string;
};

export function NationalDashboard({ scope = "national", provinceLabel = "Battambang" }: Props) {
  const [selectedProvinces, setSelectedProvinces] = useState<string[]>(
    scope === "provincial" ? [provinceLabel] : []
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const isNational = selectedProvinces.length === 0;
  const f = drillDownFactor(selectedProvinces);
  const provinceDisplayLabel =
    selectedProvinces.length === 0 ? "National" :
    selectedProvinces.length === 1 ? selectedProvinces[0] :
    selectedProvinces.length <= 3 ? selectedProvinces.join(", ") :
    `${selectedProvinces.length} provinces`;
  const [bpRejectedDrillOpen, setBpRejectedDrillOpen] = useState(false);
  const [perfChartHoverProvince, setPerfChartHoverProvince] = useState<string | null>(null);
  const [showAllGeo, setShowAllGeo] = useState(false);
  const [showAllKm, setShowAllKm] = useState(false);
  const [cropFilter, setCropFilter] = useState<string | null>(null);
  const [bpPage, setBpPage] = useState(0);

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
  }, [selectedProvinces]);

  useEffect(() => {
    if (bp.rejected <= 0) setBpRejectedDrillOpen(false);
  }, [bp.rejected]);

  useEffect(() => {
    setPerfChartHoverProvince(null);
    setBpPage(0);
  }, [selectedProvinces]);

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

  const assetSubtypeRows = useMemo(
    () => ASSET_SUBTYPES.map((s) => ({ ...s, count: Math.round(s.baseCount * f) })),
    [f]
  );

  const farmerTrend = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const peakTotal = Math.round(TOTAL_MEMBERS_EST * f);
    const startFactor = 0.86;
    return months.map((month, i) => {
      const progress = i / 11;
      const smoothed = startFactor + (1 - startFactor) * (progress * progress * (3 - 2 * progress));
      const variance = Math.sin(i * 1.1) * 0.008;
      const total = Math.round(peakTotal * (smoothed + variance));
      const male = Math.round(total * 0.578);
      const female = total - male;
      return { month, total, male, female };
    });
  }, [f]);


const bpChartData = useMemo(() => {
    const generate = (name: string) => {
      const geo = provinceGeo.find((p) => p.province === name);
      if (!geo) return null;
      const rate = Math.min(88, 68 + (geo.acs % 12));
      const submitted = Math.max(12, Math.round(geo.acs * 0.75));
      const approved = Math.max(10, Math.round(geo.acs * 0.6));
      return { province: geo.province, submitted, approved, rate };
    };

    if (isNational) {
      return provinceGeo.map((p) => {
        const existing = bpByProvince.find((b) => b.province === p.province);
        return existing ?? generate(p.province)!;
      });
    }

    const hits = bpByProvince.filter((b) => selectedProvinces.includes(b.province));
    const missing = selectedProvinces.filter((name) => !bpByProvince.some((b) => b.province === name));
    return [...hits, ...missing.flatMap((name) => { const e = generate(name); return e ? [e] : []; })];
  }, [isNational, selectedProvinces]);

  /** Ascending so highest rate renders at top of horizontal bar chart (Recharts category order). */
  const bpChartSorted = useMemo(
    () => [...bpChartData].sort((a, b) => a.rate - b.rate),
    [bpChartData]
  );

  const perfHeatFiltered = useMemo(() => {
    if (isNational) return perfHeat;
    const hits = perfHeat.filter((h) => selectedProvinces.includes(h.province));
    const missing = selectedProvinces.filter((name) => !perfHeat.some((h) => h.province === name));
    const generated = missing.flatMap((name) => {
      const geo = provinceGeo.find((p) => p.province === name);
      if (!geo) return [];
      const composite = Math.min(92, 58 + (geo.acs % 25));
      const band: "High" | "Medium" | "Intervention" = composite >= 75 ? "High" : composite >= 60 ? "Medium" : "Intervention";
      return [{ province: geo.province, composite, band }];
    });
    return [...hits, ...generated];
  }, [isNational, selectedProvinces]);

  const perfHeatSorted = useMemo(
    () => [...perfHeatFiltered].sort((a, b) => b.composite - a.composite),
    [perfHeatFiltered]
  );

const title = isNational ? "National Dashboard" : `National Dashboard — ${provinceDisplayLabel}`;

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
          <p className="mt-1 text-sm text-gray-500">Consolidated analytics for oversight and policy planning</p>
        </div>
        <div className="flex flex-col gap-1.5 min-w-[240px]">
          <span className="text-xs font-medium text-gray-500">Province focus</span>
          <div className="relative">
            {dropdownOpen && (
              <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
            )}
            <button
              type="button"
              onClick={() => setDropdownOpen((v) => !v)}
              className="relative z-50 w-full flex items-center justify-between gap-2 text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white shadow-sm text-left"
            >
              <span className="truncate text-gray-800">
                {isNational
                  ? "All provinces"
                  : selectedProvinces.length === 1
                  ? selectedProvinces[0]
                  : `${selectedProvinces.length} provinces selected`}
              </span>
              <ChevronDown
                className={`h-4 w-4 text-gray-500 shrink-0 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
              />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-1 z-50 bg-white border border-gray-200 rounded-xl shadow-lg w-64 max-h-72 overflow-y-auto">
                <button
                  type="button"
                  onClick={() => { setSelectedProvinces([]); setDropdownOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors hover:bg-blue-50 ${isNational ? "bg-blue-50 text-blue-700" : "text-gray-700"}`}
                >
                  All provinces
                </button>
                <div className="h-px bg-gray-100 mx-2" />
                {provinceGeo.map((p) => {
                  const checked = selectedProvinces.includes(p.province);
                  return (
                    <button
                      key={p.province}
                      type="button"
                      onClick={() =>
                        setSelectedProvinces((prev) =>
                          prev.includes(p.province)
                            ? prev.filter((x) => x !== p.province)
                            : [...prev, p.province]
                        )
                      }
                      className="w-full text-left px-4 py-2 text-sm flex items-center gap-2.5 transition-colors hover:bg-blue-50"
                    >
                      <div
                        className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                          checked ? "bg-[#032EA1] border-[#032EA1]" : "border-gray-300"
                        }`}
                      >
                        {checked && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className={checked ? "font-medium text-[#032EA1]" : "text-gray-700"}>
                        {p.province}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 1. Global pulse — Total ACs, Total MACS, Total Hectares */}
      <section className="space-y-6">
        <div className="rounded-xl bg-gradient-to-br from-[#032EA1] to-[#021c5e] p-4 text-white shadow-lg ring-1 ring-white/10 sm:p-5">
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3">
            {[
              {
                label: "Total ACs",
                value: acStats.active + acStats.inactive + acStats.suspended + acStats.withdrawn,
                sub: `${acStats.active.toLocaleString()} active`,
                icon: Building2,
                iconColor: "text-blue-600",
              },
              {
                label: "Total MACS",
                value: scale(486, f),
                sub: "Member cooperatives",
                icon: UserRound,
                iconColor: "text-emerald-600",
              },
              {
                label: "Total Hectares",
                value: scale(78450, f),
                sub: "Total farming area",
                icon: Layers,
                iconColor: "text-teal-600",
              },
            ].map((c) => (
              <div key={c.label} className="min-w-0 rounded-lg bg-white/5 px-2.5 py-2.5 ring-1 ring-white/10">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[10px] font-medium leading-tight text-white/70 sm:text-[11px]">{c.label}</p>
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-amber-200/70 bg-white shadow-[0_0_0_1px_rgba(251,191,36,0.18),0_0_10px_rgba(251,191,36,0.28)] transition-transform duration-200 hover:scale-110">
                    <c.icon className={`h-3.5 w-3.5 ${c.iconColor}`} />
                  </div>
                </div>
                <p className="text-xl font-bold tabular-nums sm:text-2xl">{c.value.toLocaleString()}</p>
                <p className="mt-1 text-[10px] text-white/55">{c.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Map card — aligned with membership statistics card style */}
        <section className="rounded-2xl bg-white p-6 sm:p-8 font-sans shadow-[0_10px_15px_-3px_rgb(0_0_0/0.08)] ring-1 ring-black/[0.04]">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-gray-200/80 pb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-[#0F2F8F]" />
                National map overview
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Click a province pin to filter the dashboard.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:gap-6">
            <div className="h-[min(420px,55vh)] min-h-[280px] rounded-xl overflow-hidden border border-gray-100 bg-white ring-1 ring-black/[0.04]">
              <MapContainer center={[12.7, 104.9]} zoom={6.3} className="h-full w-full z-0" scrollWheelZoom>
                <MapViewController selected={selectedProvinces} />
                <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {provinceGeo.map((p) => {
                  const isSelected = selectedProvinces.includes(p.province);
                  const perfHover = perfChartHoverProvince === p.province;
                  const iconSize = Math.round(24 + Math.min(20, p.acs / 6));
                  const fill = isSelected ? "#032EA1" : perfHover ? "#10b981" : "#E00025";
                  const stroke = isSelected ? "#001a6e" : perfHover ? "#059669" : "#9b0018";
                  const pinIcon = L.divIcon({
                    html: `<svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" style="filter:drop-shadow(0 2px 5px rgba(0,0,0,0.38));display:block">
                      <path fill="${fill}" stroke="${stroke}" stroke-width="1.4" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                      <circle cx="12" cy="9" r="2.8" fill="rgba(255,255,255,0.88)"/>
                    </svg>`,
                    className: "",
                    iconSize: [iconSize, iconSize],
                    iconAnchor: [iconSize / 2, iconSize],
                    tooltipAnchor: [0, -iconSize + 4],
                  });
                  return (
                    <Marker
                      key={p.province}
                      position={[p.lat, p.lon]}
                      icon={pinIcon}
                      eventHandlers={{
                        click: () =>
                          setSelectedProvinces((prev) =>
                            prev.includes(p.province) ? prev.filter((x) => x !== p.province) : [...prev, p.province]
                          ),
                      }}
                    >
                      {/* tooltip placeholder — closed below */}
                      <LeafletTooltip direction="top" offset={[0, -iconSize + 4]} opacity={0.95}>
                        <div className="text-xs font-medium">
                          <div>{p.province}</div>
                          <div>ACs: {p.acs}</div>
                          <div>Members (approx.): {p.members.toLocaleString()}</div>
                          <div className="text-[10px] text-gray-500 mt-1">Click to filter dashboard</div>
                        </div>
                      </LeafletTooltip>
                    </Marker>
                  );
                })}
              </MapContainer>
            </div>
          </div>
          {/* <div className="rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col min-h-[280px] lg:min-h-0 lg:max-h-[min(420px,55vh)]">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/80">
              <h2 className="text-sm font-semibold text-gray-900">Provincial leaderboard</h2>
              <p className="text-xs text-gray-500 mt-0.5">By AC count — click a row to focus</p>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
              {leaderboardRows.map((row) => {
                const active = selectedProvinces.includes(row.province);
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
          </div> */}
        </section>
        {/* <p className="text-xs text-gray-400">
          Circle size reflects relative AC density (illustrative). Click a province on the map or list to filter charts below.
        </p> */}
      </section>

      {/* 1b. Regional Crop Distribution Map */}
      <section className="rounded-2xl bg-white p-6 sm:p-8 font-sans shadow-[0_10px_15px_-3px_rgb(0_0_0/0.08)] ring-1 ring-black/[0.04]">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Wheat className="h-5 w-5 text-[#0F2F8F]" />
              Regional Crop Distribution
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Dominant crop per province based on cooperative registrations — click a crop to filter
            </p>
          </div>
          {/* Crop filter pills */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCropFilter(null)}
              className={`rounded-full px-3 py-1 text-xs font-semibold border transition-colors ${
                cropFilter === null
                  ? "bg-gray-900 border-gray-900 text-white"
                  : "bg-white border-gray-200 text-gray-600 hover:border-gray-400"
              }`}
            >
              All crops
            </button>
            {Object.entries(CROP_COLORS).map(([crop, color]) => {
              const Icon = CROP_ICONS[crop] ?? CircleDot;
              const active = cropFilter === crop;
              return (
                <button
                  key={crop}
                  type="button"
                  onClick={() => setCropFilter(active ? null : crop)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
                    active ? "text-white border-transparent" : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                  style={active ? { backgroundColor: color, borderColor: color } : {}}
                >
                  <Icon className="h-3 w-3" style={active ? {} : { color }} />
                  {crop}
                </button>
              );
            })}
          </div>
        </div>

        {/* Map + sidebar grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Leaflet map — 2/3 width */}
          <div className="lg:col-span-2">
            <div className="h-[min(400px,52vh)] min-h-[260px] rounded-xl overflow-hidden border border-gray-100 ring-1 ring-black/[0.04]">
              <MapContainer center={[12.7, 104.9]} zoom={6.3} className="h-full w-full z-0" scrollWheelZoom={false}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {provinceGeo.map((p) => {
                  const info = provinceCrops[p.province];
                  const dominant = info?.dominant ?? "Other";
                  const color = CROP_COLORS[dominant] ?? "#94a3b8";
                  const dimmed = cropFilter !== null && cropFilter !== dominant;
                  const r = 7 + Math.min(14, p.acs / 9);
                  return (
                    <CircleMarker
                      key={p.province}
                      center={[p.lat, p.lon]}
                      radius={dimmed ? r * 0.55 : r}
                      pathOptions={{
                        color: "#fff",
                        fillColor: dimmed ? "#d1d5db" : color,
                        fillOpacity: dimmed ? 0.35 : 0.88,
                        weight: dimmed ? 1 : 2,
                      }}
                    >
                      <LeafletTooltip direction="top" offset={[0, -4]} opacity={0.97}>
                        <div className="text-xs font-medium space-y-0.5">
                          <div className="font-bold text-gray-900">{p.province}</div>
                          <div className="flex items-center gap-1.5">
                            <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                            <span>Dominant: <strong>{dominant}</strong> ({info?.pct ?? "—"}%)</span>
                          </div>
                          <div className="text-gray-500">Secondary: {info?.secondary ?? "—"}</div>
                          <div className="text-gray-500">ACs: {p.acs} · Members: {p.members.toLocaleString()}</div>
                        </div>
                      </LeafletTooltip>
                    </CircleMarker>
                  );
                })}
              </MapContainer>
            </div>
            {/* Legend row */}
            <div className="mt-3 flex flex-wrap gap-4">
              {Object.entries(CROP_COLORS).map(([crop, color]) => {
                const count = Object.values(provinceCrops).filter((v) => v.dominant === crop).length;
                return (
                  <div key={crop} className="flex items-center gap-1.5 text-xs text-gray-600">
                    <span className="inline-block w-3 h-3 rounded-full border border-white shadow-sm" style={{ backgroundColor: color }} />
                    <span className="font-medium">{crop}</span>
                    <span className="text-gray-400">({count} prov.)</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right sidebar — province list by dominant crop */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            {/* Crop summary cards */}
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(CROP_COLORS).map(([crop, color]) => {
                const Icon = CROP_ICONS[crop] ?? CircleDot;
                const provinces = Object.entries(provinceCrops)
                  .filter(([, v]) => v.dominant === crop)
                  .map(([name]) => name);
                const totalAcs = provinces.reduce((s, name) => {
                  const geo = provinceGeo.find((p) => p.province === name);
                  return s + (geo?.acs ?? 0);
                }, 0);
                const isActive = cropFilter === crop;
                return (
                  <button
                    key={crop}
                    type="button"
                    onClick={() => setCropFilter(isActive ? null : crop)}
                    className={`w-full rounded-xl border p-3 text-left transition-all ${
                      isActive ? "ring-2" : "hover:border-gray-300"
                    }`}
                    style={
                      isActive
                        ? { backgroundColor: `${color}12`, borderColor: color, ringColor: color }
                        : { borderColor: "#e5e7eb", backgroundColor: "#fafafa" }
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                          style={{ backgroundColor: `${color}22` }}
                        >
                          <Icon className="h-4 w-4" style={{ color }} />
                        </div>
                        <span className="text-sm font-semibold text-gray-800">{crop}</span>
                      </div>
                      <span className="text-xs font-bold tabular-nums" style={{ color }}>
                        {provinces.length} prov.
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                      <span>{totalAcs} ACs</span>
                      <span className="text-gray-300">·</span>
                      <span className="truncate text-[11px]">{provinces.slice(0, 2).join(", ")}{provinces.length > 2 ? ` +${provinces.length - 2}` : ""}</span>
                    </div>
                    <div className="mt-2 h-1 w-full rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.round((provinces.length / 25) * 100)}%`,
                          backgroundColor: color,
                        }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Geographic Distribution */}
      <section className="rounded-2xl bg-white p-6 sm:p-8 font-sans shadow-[0_10px_15px_-3px_rgb(0_0_0/0.08)] ring-1 ring-black/[0.04]">
        <div className="mb-5 border-b border-gray-200/80 pb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <UserRound className="h-5 w-5 text-[#0F2F8F]" />
            Geographic Distribution
          </h2>
          <p className="mt-1 text-sm text-gray-500">Agricultural cooperatives and farmer members by province</p>
        </div>

        {(() => {
          const sorted = [...provinceGeo].sort((a, b) => b.acs - a.acs);
          const maxAcs = sorted[0]?.acs ?? 1;
          const visible = showAllGeo ? sorted : sorted.slice(0, 10);
          return (
            <>
              <div className="space-y-2">
                {visible.map((p) => {
                  const pct = (p.acs / maxAcs) * 100;
                  const isHighlighted = selectedProvinces.length === 0 || selectedProvinces.includes(p.province);
                  return (
                    <div key={p.province} className="flex items-center gap-3">
                      <div className="w-36 shrink-0 text-sm font-semibold text-gray-700 text-right truncate">
                        {p.province}
                      </div>
                      <div className="flex-1 h-8 bg-gray-200/60 rounded-lg overflow-hidden">
                        <div
                          className="h-full rounded-lg flex items-center justify-end pr-3 transition-all duration-500"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: isHighlighted ? "#032EA1" : "#cbd5e1",
                          }}
                        >
                          <span className="text-xs font-bold text-white whitespace-nowrap">{p.acs}</span>
                        </div>
                      </div>
                      <div className="w-24 shrink-0 text-sm tabular-nums text-right" style={{ color: isHighlighted ? "#6b7280" : "#d1d5db" }}>
                        {p.members.toLocaleString()} mbrs
                      </div>
                    </div>
                  );
                })}
              </div>
              {sorted.length > 10 && (
                <button
                  type="button"
                  onClick={() => setShowAllGeo((v) => !v)}
                  className="mt-4 text-sm font-medium text-[#032EA1] hover:text-[#0447D4] transition-colors"
                >
                  {showAllGeo ? `Show less` : `Show more (${sorted.length - 10} more)`}
                </button>
              )}
            </>
          );
        })()}
      </section>

      {/* 3. Annual Yield Prediction */}
      {(() => {
        const yieldRows = [
          { crop: "Rice",       predicted: 3.82, actual: 3.51, confidence: 85, color: "#f59e0b", bg: "#fefce8", border: "#fde68a" },
          { crop: "Cassava",    predicted: 22.4, actual: 20.1, confidence: 78, color: "#10b981", bg: "#f0fdf4", border: "#bbf7d0" },
          { crop: "Maize",      predicted: 4.18, actual: 3.90, confidence: 82, color: "#f97316", bg: "#fff7ed", border: "#fed7aa" },
          { crop: "Vegetables", predicted: 8.64, actual: 7.92, confidence: 74, color: "#22c55e", bg: "#f0fdf4", border: "#bbf7d0" },
          { crop: "Other",      predicted: 2.41, actual: 2.20, confidence: 68, color: "#94a3b8", bg: "#f8fafc", border: "#e2e8f0" },
        ];
        const avgConfidence = Math.round(yieldRows.reduce((s, r) => s + r.confidence, 0) / yieldRows.length);
        const avgGrowth = (
          yieldRows.reduce((s, r) => s + ((r.predicted - r.actual) / r.actual) * 100, 0) / yieldRows.length
        ).toFixed(1);
        const chartRows = yieldRows.map((r) => ({
          name: r.crop === "Vegetables" ? "Veg." : r.crop,
          "2024 Actual": r.actual,
          "2025 Forecast": r.predicted,
          color: r.color,
        }));
        return (
          <section className="rounded-2xl bg-white p-6 sm:p-8 font-sans shadow-[0_10px_15px_-3px_rgb(0_0_0/0.08)] ring-1 ring-black/[0.04]">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Wheat className="h-5 w-5 text-[#0F2F8F]" />
                  Annual Yield Prediction — 2025
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Forecast harvest yield per crop for cooperative-registered farmland
                  {isNational ? "" : ` (${provinceDisplayLabel})`}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                  <Layers className="h-3.5 w-3.5" />
                  {yieldRows.length} crops tracked
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Avg ↑{avgGrowth}% growth
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                  <CircleDot className="h-3.5 w-3.5" />
                  {avgConfidence}% avg confidence
                </span>
              </div>
            </div>

            {/* Crop cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
              {yieldRows.map((r) => {
                const Icon = CROP_ICONS[r.crop] ?? CircleDot;
                const growthPct = (((r.predicted - r.actual) / r.actual) * 100).toFixed(1);
                return (
                  <div
                    key={r.crop}
                    className="rounded-xl border p-4 flex flex-col gap-2"
                    style={{ backgroundColor: r.bg, borderColor: r.border }}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 shrink-0" style={{ color: r.color }} />
                      <span className="text-xs font-semibold text-gray-600 truncate">{r.crop}</span>
                    </div>
                    <div>
                      <p className="text-2xl font-bold tabular-nums text-gray-900 leading-none">
                        {r.predicted}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">MT / ha</p>
                    </div>
                    <p className="text-xs font-semibold" style={{ color: r.color }}>
                      ↑ {growthPct}% vs 2024
                    </p>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-gray-400">Confidence</span>
                        <span className="text-[10px] font-bold text-gray-500">{r.confidence}%</span>
                      </div>
                      <div className="h-1 w-full rounded-full bg-gray-200/80">
                        <div
                          className="h-full rounded-full transition-[width] duration-700"
                          style={{ width: `${r.confidence}%`, backgroundColor: r.color }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Grouped bar chart — Predicted vs Actual */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                Predicted vs Actual yield (MT/ha)
              </p>
              <div style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartRows} margin={{ top: 4, right: 16, left: -12, bottom: 4 }} barCategoryGap="35%" barGap={3}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 12 }}
                      formatter={(v: number, name: string) => [`${v} MT/ha`, name]}
                    />
                    <Legend wrapperStyle={{ paddingTop: 12, fontSize: 12 }} />
                    <Bar dataKey="2024 Actual"   fill="#cbd5e1" radius={[3, 3, 0, 0]} maxBarSize={22} />
                    <Bar dataKey="2025 Forecast" fill="#032EA1" radius={[3, 3, 0, 0]} maxBarSize={22} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-3 text-[10px] text-gray-400">
                Forecast based on cooperative field reports, seasonal rainfall index, and MAFF provincial extension data. Confidence band ±5%.
              </p>
            </div>
          </section>
        );
      })()}

      {/* 4. Farmer Membership Trend */}
      {(() => {
        const ytdGrowth =
          farmerTrend.length >= 2
            ? Math.round(((farmerTrend[farmerTrend.length - 1].total / farmerTrend[0].total) - 1) * 1000) / 10
            : 0;
        const latestTotal = farmerTrend[farmerTrend.length - 1]?.total ?? 0;
        const latestFemale = farmerTrend[farmerTrend.length - 1]?.female ?? 0;
        const femalePct = latestTotal > 0 ? Math.round((latestFemale / latestTotal) * 100) : 0;
        return (
          <section className="rounded-2xl bg-white p-6 sm:p-8 font-sans shadow-[0_10px_15px_-3px_rgb(0_0_0/0.08)] ring-1 ring-black/[0.04]">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[#0F2F8F]" />
                  Farmer Membership Trend
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  12-month enrollment — {isNational ? "all 25 provinces" : provinceDisplayLabel}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-center min-w-[100px]">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">Total Members</p>
                  <p className="text-xl font-bold tabular-nums text-gray-900 mt-0.5">{latestTotal.toLocaleString()}</p>
                </div>
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-center min-w-[100px]">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-emerald-500">YTD Growth</p>
                  <p className="text-xl font-bold tabular-nums text-emerald-700 mt-0.5">+{ytdGrowth}%</p>
                </div>
                <div className="rounded-xl border border-pink-200 bg-pink-50 px-4 py-2 text-center min-w-[100px]">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-pink-400">Female Share</p>
                  <p className="text-xl font-bold tabular-nums text-pink-700 mt-0.5">{femalePct}%</p>
                </div>
              </div>
            </div>

            {/* Line chart */}
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={farmerTrend} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v: number) => v >= 1000 ? `${Math.round(v / 1000)}K` : String(v)}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 12 }}
                    formatter={(value: number, name: string) => [value.toLocaleString(), name]}
                  />
                  <Legend wrapperStyle={{ paddingTop: 14, fontSize: 12 }} />
                  <Line type="monotone" dataKey="total"  name="Total"  stroke="#10b981" strokeWidth={2}   strokeDasharray="6 4" dot={false} />
                  <Line type="monotone" dataKey="male"   name="Male"   stroke="#032EA1" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
                  <Line type="monotone" dataKey="female" name="Female" stroke="#E00025" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Gender insight strip */}
            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                { label: "Male farmers",   value: farmerTrend[farmerTrend.length - 1]?.male.toLocaleString() ?? "—",   color: "#032EA1", bg: "#eff6ff", border: "#bfdbfe" },
                { label: "Female farmers", value: farmerTrend[farmerTrend.length - 1]?.female.toLocaleString() ?? "—", color: "#E00025", bg: "#fff1f2", border: "#fecdd3" },
                { label: "New this year",  value: `+${(farmerTrend[farmerTrend.length - 1]?.total - farmerTrend[0]?.total).toLocaleString()}`, color: "#059669", bg: "#f0fdf4", border: "#bbf7d0" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl p-3 border" style={{ backgroundColor: s.bg, borderColor: s.border }}>
                  <p className="text-lg font-bold tabular-nums" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </section>
        );
      })()}

      {/* 4. Business Plan Analytics */}
      <section className="rounded-2xl bg-white p-6 sm:p-8 font-sans shadow-[0_10px_15px_-3px_rgb(0_0_0/0.08)] ring-1 ring-black/[0.04]">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#0F2F8F]" />
              Business Plan Analytics
            </h2>
            <p className="mt-1 text-sm text-gray-500">Provincial comparison of business plan performance</p>
          </div>
          <div className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700">
            <TrendingUp className="h-4 w-4" />
            {bp.approvalRate}% Approval Rate
          </div>
        </div>

        {/* Paginated grouped bar chart */}
        {(() => {
          const BP_PAGE_SIZE = 8;
          const chartRows = bpChartData.map((d) => {
            const leftover = d.submitted - d.approved;
            return {
              province: d.province.split(" ").pop(),
              Approved: d.approved,
              "In Progress": Math.round(leftover * 0.45),
              Rejected: Math.round(leftover * 0.55),
            };
          });
          const totalPages = Math.ceil(chartRows.length / BP_PAGE_SIZE);
          const pageRows = chartRows.slice(bpPage * BP_PAGE_SIZE, (bpPage + 1) * BP_PAGE_SIZE);
          return (
            <>
              <div style={{ height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={pageRows}
                    margin={{ top: 4, right: 8, left: -16, bottom: 4 }}
                    barCategoryGap="30%"
                    barGap={2}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="province" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: 8 }} />
                    <Legend wrapperStyle={{ paddingTop: 12, fontSize: 12 }} />
                    <Bar dataKey="Approved" fill="#38bdf8" radius={[3, 3, 0, 0]} maxBarSize={20} />
                    <Bar dataKey="In Progress" fill="#1e293b" radius={[3, 3, 0, 0]} maxBarSize={20} />
                    <Bar dataKey="Rejected" fill="#64748b" radius={[3, 3, 0, 0]} maxBarSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {totalPages > 1 && (
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    Showing {bpPage * BP_PAGE_SIZE + 1}–{Math.min((bpPage + 1) * BP_PAGE_SIZE, chartRows.length)} of {chartRows.length} provinces
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setBpPage((p) => Math.max(0, p - 1))}
                      disabled={bpPage === 0}
                      className="px-3 py-1 text-xs font-medium rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      ← Prev
                    </button>
                    <span className="text-xs font-semibold text-gray-600">
                      {bpPage + 1} / {totalPages}
                    </span>
                    <button
                      type="button"
                      onClick={() => setBpPage((p) => Math.min(totalPages - 1, p + 1))}
                      disabled={bpPage === totalPages - 1}
                      className="px-3 py-1 text-xs font-medium rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
            </>
          );
        })()}

        {/* Stat cards */}
        <div className="mt-5 grid grid-cols-3 gap-4">
          {[
            { label: "Submitted", value: bp.submitted, pct: 100, barColor: "#1e293b", border: "border-gray-200", bg: "bg-white", textColor: "text-gray-900" },
            { label: "Approved", value: bp.approved, pct: Math.round((bp.approved / Math.max(1, bp.submitted)) * 100), barColor: "#3b82f6", border: "border-blue-200 ring-1 ring-blue-200", bg: "bg-blue-50", textColor: "text-blue-600" },
            { label: "Rejected", value: bp.rejected, pct: Math.round((bp.rejected / Math.max(1, bp.submitted)) * 100), barColor: "#94a3b8", border: "border-gray-200", bg: "bg-white", textColor: "text-gray-900" },
          ].map((s) => (
            <div key={s.label} className={`rounded-xl p-5 border ${s.border} ${s.bg}`}>
              <p className={`text-3xl font-bold tabular-nums tracking-tight ${s.textColor}`}>
                {s.value.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              <div className="mt-4 h-1.5 w-full rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full transition-[width] duration-700"
                  style={{ width: `${s.pct}%`, backgroundColor: s.barColor }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Asset management + Knowledge Management Stats — side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* Asset management */}
      <section className="rounded-2xl bg-white p-6 sm:p-8 font-sans shadow-[0_10px_15px_-3px_rgb(0_0_0/0.06)] ring-1 ring-black/[0.04]">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-[#0F2F8F]" />
          <h2 className="text-lg font-semibold text-gray-900">Asset Management Overview</h2>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          Reported assets across all cooperatives{isNational ? "" : ` (${provinceDisplayLabel})`}
        </p>

        {/* Top stat tiles */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-[#032EA1] p-4 text-white">
            <p className="text-xs font-medium opacity-75">Total Assets</p>
            <p className="mt-1 text-3xl font-bold tabular-nums tracking-tight">{assets.count.toLocaleString()}</p>
            <p className="mt-1 text-xs opacity-60">Across {isNational ? 25 : selectedProvinces.length} province(s)</p>
          </div>
          <div className="rounded-xl bg-[#0f172a] p-4 text-white">
            <p className="text-xs font-medium opacity-75">Est. Total Value</p>
            <p className="mt-1 text-3xl font-bold tabular-nums tracking-tight">
              USD {Math.round(assets.valueUsd / 1_000).toLocaleString()}K
            </p>
            <p className="mt-1 text-xs opacity-60">Estimated market value</p>
          </div>
        </div>

        {/* Maintenance + at risk */}
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100">
              <Activity className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-700 tabular-nums">{assets.maintenanceCompliance}%</p>
              <p className="text-xs text-emerald-600">Maintenance compliance</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-red-50 border border-red-100 px-4 py-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100">
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600 tabular-nums">
                {assetConditionSlices
                  .filter((s) => s.name === "Poor" || s.name === "Unknown")
                  .reduce((sum, s) => sum + s.estCount, 0)
                  .toLocaleString()}
              </p>
              <p className="text-xs text-red-500">Assets at risk</p>
            </div>
          </div>
        </div>

        {/* Condition breakdown */}
        <div className="mt-6">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-3">Condition Breakdown</p>
          {(() => {
            const condMap: Record<string, { bar: string; bg: string }> = {
              Good:    { bar: "#22c55e", bg: "#dcfce7" },
              Fair:    { bar: "#f59e0b", bg: "#fef3c7" },
              Poor:    { bar: "#ef4444", bg: "#fee2e2" },
              Unknown: { bar: "#94a3b8", bg: "#f1f5f9" },
            };
            return (
              <>
                <div className="space-y-2.5">
                  {assetConditionSlices.map((row) => {
                    const c = condMap[row.name] ?? { bar: "#94a3b8", bg: "#f1f5f9" };
                    const label = row.name === "Unknown" ? "Under Repair" : row.name;
                    return (
                      <div key={row.name} className="flex items-center gap-3">
                        <span className="w-24 shrink-0 text-sm font-medium text-gray-600">{label}</span>
                        <div className="flex-1 h-4 rounded-full overflow-hidden" style={{ backgroundColor: c.bg }}>
                          <div
                            className="h-full rounded-full transition-[width] duration-700"
                            style={{ width: `${row.value}%`, backgroundColor: c.bar }}
                          />
                        </div>
                        <span className="w-9 shrink-0 text-right text-sm font-bold tabular-nums" style={{ color: c.bar }}>
                          {row.value}%
                        </span>
                      </div>
                    );
                  })}
                </div>
                {/* Combined stacked bar */}
                <div className="mt-3 flex h-3 w-full overflow-hidden rounded-full">
                  {assetConditionSlices.map((row) => (
                    <div
                      key={row.name}
                      style={{ width: `${row.value}%`, backgroundColor: condMap[row.name]?.bar ?? "#94a3b8" }}
                    />
                  ))}
                </div>
              </>
            );
          })()}
        </div>
      </section>

      {/* Knowledge Management Stats */}
      <section className="rounded-2xl bg-white p-6 sm:p-8 font-sans shadow-[0_10px_15px_-3px_rgb(0_0_0/0.06)] ring-1 ring-black/[0.04]">
        <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-[#0F2F8F]" />
          Knowledge Management Stats
        </h2>

        {/* 2×2 stat tiles */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: BookOpen,   iconBg: "bg-blue-100",    iconColor: "text-blue-600",    value: "127",   label: "Total Materials" },
            { icon: Activity,   iconBg: "bg-emerald-100", iconColor: "text-emerald-600", value: "74%",   label: "ACs Accessed" },
            { icon: Download,   iconBg: "bg-violet-100",  iconColor: "text-violet-600",  value: "3,972", label: "Total Downloads" },
            { icon: TrendingUp, iconBg: "bg-orange-100",  iconColor: "text-orange-500",  value: "4.7/5", label: "Avg Rating" },
          ].map(({ icon: Icon, iconBg, iconColor, value, label }) => (
            <div key={label} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/60 p-4">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
                <Icon className={`h-5 w-5 ${iconColor}`} />
              </div>
              <div>
                <p className="text-xl font-bold tabular-nums text-gray-900">{value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Dissemination Adoption by Province — all 25, show more/less */}
        <div className="mt-6">
          <p className="text-sm font-semibold text-gray-900 mb-4">Dissemination Adoption by Province</p>
          {(() => {
            const kmAll = [...provinceGeo]
              .map((p) => ({
                province: p.province,
                pct: Math.min(92, 55 + (p.members % 18) + (p.acs % 12)),
              }))
              .sort((a, b) => b.pct - a.pct);
            const KM_INITIAL = 4;
            const visible = showAllKm ? kmAll : kmAll.slice(0, KM_INITIAL);
            return (
              <>
                <div className="space-y-3">
                  {visible.map(({ province, pct }) => {
                    const isHighlighted = selectedProvinces.length === 0 || selectedProvinces.includes(province);
                    return (
                      <div key={province} className="flex items-center gap-3">
                        <span
                          className="w-32 shrink-0 text-sm font-medium truncate"
                          style={{ color: isHighlighted ? "#032EA1" : "#9ca3af" }}
                        >
                          {province}
                        </span>
                        <div className="flex-1 h-3 rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-[width] duration-700"
                            style={{ width: `${pct}%`, backgroundColor: isHighlighted ? "#032EA1" : "#cbd5e1" }}
                          />
                        </div>
                        <span
                          className="w-10 shrink-0 text-right text-sm font-semibold tabular-nums"
                          style={{ color: isHighlighted ? "#374151" : "#d1d5db" }}
                        >
                          {pct}%
                        </span>
                      </div>
                    );
                  })}
                </div>
                {kmAll.length > KM_INITIAL && (
                  <button
                    type="button"
                    onClick={() => setShowAllKm((v) => !v)}
                    className="mt-4 text-sm font-medium text-[#032EA1] hover:text-[#0447D4] transition-colors"
                  >
                    {showAllKm ? "Show less" : `Show more (${kmAll.length - KM_INITIAL} more)`}
                  </button>
                )}
              </>
            );
          })()}
        </div>
      </section>

      </div>{/* end 2-col grid */}

      {/* Asset Type Overview */}
      <section className="rounded-2xl bg-white p-6 sm:p-8 font-sans shadow-[0_10px_15px_-3px_rgb(0_0_0/0.08)] ring-1 ring-black/[0.04]">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Package className="h-5 w-5 text-[#0F2F8F]" />
              Asset Type Overview
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Equipment count by category across all cooperatives{isNational ? "" : ` · ${provinceDisplayLabel}`}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700 border border-blue-100">
              PEARL funded
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-600 border border-gray-200">
              Own / Other
            </span>
          </div>
        </div>

        {/* Type category tiles */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.entries(ASSET_TYPE_META).map(([type, meta]) => {
            const Icon = ASSET_TYPE_ICONS[type] ?? Package;
            const typeCount = Math.round(assets.count * (meta.pct / 100));
            return (
              <div
                key={type}
                className="rounded-xl border p-4 flex flex-col gap-2"
                style={{ backgroundColor: meta.bg, borderColor: `${meta.color}22` }}
              >
                <div className="flex items-center justify-between">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${meta.color}18` }}
                  >
                    <Icon className="h-4 w-4" style={{ color: meta.color }} />
                  </div>
                  <span
                    className="text-[11px] font-bold tabular-nums"
                    style={{ color: meta.color }}
                  >
                    {meta.pct}%
                  </span>
                </div>
                <div>
                  <p className="text-2xl font-bold tabular-nums tracking-tight" style={{ color: meta.textColor }}>
                    {typeCount.toLocaleString()}
                  </p>
                  <p className="text-xs font-medium text-gray-500 mt-0.5">{type}</p>
                </div>
                {/* mini fill bar */}
                <div className="h-1 w-full rounded-full bg-gray-200/60">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${meta.pct}%`, backgroundColor: meta.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Stacked distribution bar */}
        <div className="mt-3 flex h-2.5 w-full overflow-hidden rounded-full">
          {Object.entries(ASSET_TYPE_META).map(([type, meta]) => (
            <div key={type} style={{ width: `${meta.pct}%`, backgroundColor: meta.color }} />
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
          {Object.entries(ASSET_TYPE_META).map(([type, meta]) => (
            <span key={type} className="flex items-center gap-1.5 text-[11px] text-gray-500">
              <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: meta.color }} />
              {type}
            </span>
          ))}
        </div>

        {/* Key asset subtypes grid */}
        <div className="mt-7">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-4">
            Key Asset Categories
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {assetSubtypeRows.map((row) => {
              const Icon = row.icon;
              const meta = ASSET_TYPE_META[row.type] ?? ASSET_TYPE_META["Equipment"];
              const atRisk = Math.round(row.count * ((100 - row.goodPct) / 100));
              return (
                <div
                  key={row.name}
                  className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 flex flex-col gap-3"
                >
                  {/* Icon + pearl badge */}
                  <div className="flex items-start justify-between">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-lg"
                      style={{ backgroundColor: meta.bg }}
                    >
                      <Icon className="h-4.5 w-4.5 h-[18px] w-[18px]" style={{ color: meta.color }} />
                    </div>
                    {row.pearlFunded && (
                      <span className="rounded-full bg-blue-50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-blue-600 border border-blue-100">
                        PEARL
                      </span>
                    )}
                  </div>

                  {/* Count + name */}
                  <div>
                    <p className="text-2xl font-bold tabular-nums tracking-tight text-gray-900">
                      {row.count.toLocaleString()}
                    </p>
                    <p className="text-xs font-medium text-gray-500 mt-0.5 leading-snug">{row.name}</p>
                    <p
                      className="text-[10px] mt-0.5 font-medium"
                      style={{ color: meta.color }}
                    >
                      {row.type}
                    </p>
                  </div>

                  {/* Condition bar */}
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
                      <span>Good condition</span>
                      <span className="font-semibold text-gray-600">{row.goodPct}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${row.goodPct}%`,
                          backgroundColor: row.goodPct >= 75 ? "#22c55e" : row.goodPct >= 60 ? "#f59e0b" : "#ef4444",
                        }}
                      />
                    </div>
                    <p className="text-[10px] text-red-400 mt-1">{atRisk.toLocaleString()} need attention</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Horizontal count bar chart */}
        <div className="mt-7">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-4">
            Count Comparison
          </p>
          <div className="space-y-2.5">
            {[...assetSubtypeRows]
              .sort((a, b) => b.count - a.count)
              .map((row) => {
                const meta = ASSET_TYPE_META[row.type] ?? ASSET_TYPE_META["Equipment"];
                const maxCount = assetSubtypeRows.reduce((m, r) => Math.max(m, r.count), 0);
                const barW = maxCount > 0 ? Math.round((row.count / maxCount) * 100) : 0;
                return (
                  <div key={row.name} className="flex items-center gap-3">
                    <span className="w-40 shrink-0 text-xs font-medium text-gray-600 truncate">{row.name}</span>
                    <div className="flex-1 h-5 rounded-md overflow-hidden bg-gray-100 relative">
                      <div
                        className="h-full rounded-md transition-[width] duration-700"
                        style={{ width: `${barW}%`, backgroundColor: meta.color }}
                      />
                      <span className="absolute inset-y-0 right-2 flex items-center text-[11px] font-bold text-gray-700 tabular-nums">
                        {row.count.toLocaleString()}
                      </span>
                    </div>
                    <div
                      className="shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold"
                      style={{ backgroundColor: meta.bg, color: meta.color }}
                    >
                      {row.type.slice(0, 4)}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </section>

      {/* 5. Performance heatmap — lollipop + band shading + national avg */}
      <section className="rounded-2xl bg-white p-6 sm:p-8 font-sans shadow-[0_10px_15px_-3px_rgb(0_0_0/0.06)] ring-1 ring-black/[0.04]">
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
          key={selectedProvinces.join(",")}
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

    </div>
  );
}
