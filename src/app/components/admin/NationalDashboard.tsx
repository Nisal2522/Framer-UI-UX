import { useCallback, useEffect, useMemo, useRef, useState, type ComponentType, type CSSProperties } from "react";
import {
  Building2,
  Map,
  UserRound,
  Users,
  Package,
  BookOpen,
  TrendingUp,
  BadgeCheck,
  Waves,
  BarChart3,
  AlertTriangle,
  Activity,
  Download,
  Wheat,
  Carrot,
  Bean,
  Salad,
  CircleDot,
  X,
  Layers,
  ChevronDown,
  MapPin,
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
  Area,
  Line,
  LineChart,
  ComposedChart,
  ReferenceArea,
  ReferenceLine,
} from "recharts";

const COLORS = ["#0F2F8F", "#3B5FCC", "#22C55E", "#F59E0B", "#E00025", "#94A3B8"];

const provinceGeo = [
  { province: "Phnom Penh", lat: 11.5564, lon: 104.9282, acs: 142, macs: 20, members: 15200 },
  { province: "Banteay Meanchey", lat: 13.7532, lon: 102.9896, acs: 48, macs: 7, members: 4900 },
  { province: "Battambang", lat: 13.0957, lon: 103.2022, acs: 118, macs: 16, members: 12400 },
  { province: "Kampong Cham", lat: 12.0, lon: 105.45, acs: 76, macs: 10, members: 8200 },
  { province: "Kampong Chhnang", lat: 12.25, lon: 104.67, acs: 42, macs: 6, members: 4400 },
  { province: "Kampong Speu", lat: 11.45, lon: 104.52, acs: 38, macs: 6, members: 3900 },
  { province: "Kampong Thom", lat: 12.7117, lon: 104.8885, acs: 84, macs: 11, members: 8900 },
  { province: "Preah Sihanouk", lat: 10.6282, lon: 103.5234, acs: 33, macs: 5, members: 3400 },
  { province: "Kampot", lat: 10.6104, lon: 104.1815, acs: 55, macs: 8, members: 5800 },
  { province: "Kandal", lat: 11.2237, lon: 105.1259, acs: 92, macs: 13, members: 9800 },
  { province: "Kep", lat: 10.4864, lon: 104.3172, acs: 14, macs: 3, members: 1400 },
  { province: "Koh Kong", lat: 11.6154, lon: 102.9841, acs: 22, macs: 4, members: 2200 },
  { province: "Kratie", lat: 12.4888, lon: 106.0186, acs: 35, macs: 5, members: 3600 },
  { province: "Mondulkiri", lat: 12.4539, lon: 107.1874, acs: 18, macs: 3, members: 1800 },
  { province: "Oddar Meanchey", lat: 14.1601, lon: 103.4977, acs: 26, macs: 4, members: 2600 },
  { province: "Pailin", lat: 12.8494, lon: 102.6042, acs: 12, macs: 2, members: 1200 },
  { province: "Preah Vihear", lat: 13.8039, lon: 104.9803, acs: 24, macs: 4, members: 2400 },
  { province: "Pursat", lat: 12.5338, lon: 103.9192, acs: 44, macs: 7, members: 4600 },
  { province: "Prey Veng", lat: 11.4868, lon: 105.3253, acs: 51, macs: 8, members: 5300 },
  { province: "Ratanakiri", lat: 13.7283, lon: 107.0049, acs: 20, macs: 3, members: 2000 },
  { province: "Siem Reap", lat: 13.3671, lon: 103.8448, acs: 96, macs: 14, members: 10100 },
  { province: "Stung Treng", lat: 13.5237, lon: 105.9685, acs: 16, macs: 3, members: 1600 },
  { province: "Svay Rieng", lat: 11.0877, lon: 105.7997, acs: 30, macs: 5, members: 3100 },
  { province: "Takeo", lat: 10.9929, lon: 104.7847, acs: 62, macs: 9, members: 6400 },
  { province: "Tboung Khmum", lat: 11.9153, lon: 105.6459, acs: 58, macs: 8, members: 6100 },
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

type StatCard = {
  label: string;
  value: number;
  icon: ComponentType<{ className?: string }>;
  iconColor: string;
  sub?: string;
  breakdown?: { label: string; value: number; dot: string }[];
};

const cropNat = [
  { crop: "Rice", pct: 42 },
  { crop: "Cassava", pct: 22 },
  { crop: "Maize", pct: 14 },
  { crop: "Vegetables", pct: 12 },
  { crop: "Other", pct: 10 },
];

const CROP_ICONS: Record<string, ComponentType<{ className?: string; style?: CSSProperties }>> = {
  Rice: Wheat,
  Cassava: Carrot,
  Maize: Bean,
  Vegetables: Salad,
  Other: CircleDot,
};

const YIELD_3Y: Record<string, {
  y2024: { h1: number; h2: number; annual: number };
  y2025: { h1: number; h2: number; annual: number };
  y2026: { h1: number; h2: number; annual: number };
  confidence: number; color: string; bg: string; border: string;
}> = {
  Rice: { y2024: { h1: 1.56, h2: 1.91, annual: 3.47 }, y2025: { h1: 1.72, h2: 2.10, annual: 3.82 }, y2026: { h1: 1.87, h2: 2.28, annual: 4.15 }, confidence: 85, color: "#f59e0b", bg: "#fefce8", border: "#fde68a" },
  Cassava: { y2024: { h1: 8.5, h2: 11.6, annual: 20.1 }, y2025: { h1: 9.5, h2: 12.9, annual: 22.4 }, y2026: { h1: 10.5, h2: 14.3, annual: 24.8 }, confidence: 78, color: "#10b981", bg: "#f0fdf4", border: "#bbf7d0" },
  Maize: { y2024: { h1: 1.64, h2: 2.22, annual: 3.86 }, y2025: { h1: 1.78, h2: 2.40, annual: 4.18 }, y2026: { h1: 1.92, h2: 2.60, annual: 4.52 }, confidence: 82, color: "#f97316", bg: "#fff7ed", border: "#fed7aa" },
  Vegetables: { y2024: { h1: 3.56, h2: 4.36, annual: 7.92 }, y2025: { h1: 3.88, h2: 4.76, annual: 8.64 }, y2026: { h1: 4.22, h2: 5.16, annual: 9.38 }, confidence: 74, color: "#22c55e", bg: "#f0fdf4", border: "#bbf7d0" },
  Other: { y2024: { h1: 0.97, h2: 1.24, annual: 2.21 }, y2025: { h1: 1.06, h2: 1.35, annual: 2.41 }, y2026: { h1: 1.16, h2: 1.48, annual: 2.64 }, confidence: 68, color: "#94a3b8", bg: "#f8fafc", border: "#e2e8f0" },
};

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const YIELD_MONTHLY_IDX: Record<string, number[]> = {
  Rice: [0.135, 0.115, 0.075, 0.055, 0.050, 0.055, 0.065, 0.070, 0.082, 0.100, 0.113, 0.085],
  Cassava: [0.077, 0.088, 0.098, 0.108, 0.092, 0.072, 0.068, 0.072, 0.090, 0.102, 0.086, 0.047],
  Maize: [0.058, 0.068, 0.112, 0.133, 0.102, 0.058, 0.048, 0.052, 0.072, 0.122, 0.115, 0.060],
  Vegetables: [0.092, 0.100, 0.100, 0.090, 0.082, 0.072, 0.072, 0.072, 0.082, 0.090, 0.090, 0.064],
  Other: [0.088, 0.088, 0.088, 0.082, 0.082, 0.082, 0.082, 0.082, 0.082, 0.088, 0.082, 0.082],
};

const CROP_COLORS: Record<string, string> = {
  Rice: "#f59e0b",
  Cassava: "#10b981",
  Maize: "#f97316",
  Vegetables: "#22c55e",
  Other: "#94a3b8",
};

const provinceCrops: Record<string, { dominant: string; secondary: string; pct: number }> = {
  "Phnom Penh": { dominant: "Vegetables", secondary: "Other", pct: 55 },
  "Banteay Meanchey": { dominant: "Rice", secondary: "Maize", pct: 68 },
  "Battambang": { dominant: "Rice", secondary: "Maize", pct: 72 },
  "Kampong Cham": { dominant: "Cassava", secondary: "Maize", pct: 58 },
  "Kampong Chhnang": { dominant: "Rice", secondary: "Vegetables", pct: 65 },
  "Kampong Speu": { dominant: "Rice", secondary: "Maize", pct: 60 },
  "Kampong Thom": { dominant: "Rice", secondary: "Cassava", pct: 55 },
  "Preah Sihanouk": { dominant: "Vegetables", secondary: "Other", pct: 48 },
  "Kampot": { dominant: "Vegetables", secondary: "Rice", pct: 44 },
  "Kandal": { dominant: "Vegetables", secondary: "Rice", pct: 52 },
  "Kep": { dominant: "Vegetables", secondary: "Other", pct: 60 },
  "Koh Kong": { dominant: "Cassava", secondary: "Vegetables", pct: 50 },
  "Kratie": { dominant: "Cassava", secondary: "Other", pct: 62 },
  "Mondulkiri": { dominant: "Maize", secondary: "Cassava", pct: 58 },
  "Oddar Meanchey": { dominant: "Maize", secondary: "Rice", pct: 54 },
  "Pailin": { dominant: "Maize", secondary: "Cassava", pct: 65 },
  "Preah Vihear": { dominant: "Maize", secondary: "Cassava", pct: 56 },
  "Pursat": { dominant: "Rice", secondary: "Maize", pct: 62 },
  "Prey Veng": { dominant: "Rice", secondary: "Vegetables", pct: 70 },
  "Ratanakiri": { dominant: "Cassava", secondary: "Maize", pct: 64 },
  "Siem Reap": { dominant: "Rice", secondary: "Vegetables", pct: 58 },
  "Stung Treng": { dominant: "Rice", secondary: "Cassava", pct: 55 },
  "Svay Rieng": { dominant: "Rice", secondary: "Cassava", pct: 64 },
  "Takeo": { dominant: "Rice", secondary: "Vegetables", pct: 66 },
  "Tboung Khmum": { dominant: "Cassava", secondary: "Maize", pct: 60 },
};


const ASSET_TYPE_META: Record<string, { color: string; bg: string; textColor: string; pct: number }> = {
  Equipment: { color: "#032EA1", bg: "#eff6ff", textColor: "#1e40af", pct: 55 },
  Vehicle: { color: "#0891b2", bg: "#ecfeff", textColor: "#0e7490", pct: 20 },
  Building: { color: "#7c3aed", bg: "#f5f3ff", textColor: "#6d28d9", pct: 15 },
  Infrastructure: { color: "#059669", bg: "#ecfdf5", textColor: "#047857", pct: 10 },
};

const ASSET_TYPE_ICONS: Record<string, ComponentType<{ className?: string; style?: CSSProperties }>> = {
  Equipment: Package,
  Vehicle: Truck,
  Building: Warehouse,
  Infrastructure: Layers,
};

const ASSET_SUBTYPES: {
  name: string; type: string; baseCount: number; goodPct: number;
  pearlFunded: boolean; icon: ComponentType<{ className?: string; style?: CSSProperties }>;
}[] = [
    { name: "Water Pump System", type: "Equipment", baseCount: 3240, goodPct: 71, pearlFunded: true, icon: Droplets },
    { name: "Weighing Scale", type: "Equipment", baseCount: 2190, goodPct: 82, pearlFunded: true, icon: Scale },
    { name: "Rice Mill Machine", type: "Equipment", baseCount: 1860, goodPct: 68, pearlFunded: false, icon: Wheat },
    { name: "Solar Drying System", type: "Equipment", baseCount: 1420, goodPct: 79, pearlFunded: true, icon: Zap },
    { name: "Tractor", type: "Vehicle", baseCount: 1840, goodPct: 62, pearlFunded: false, icon: Wrench },
    { name: "Irrigation Pipeline", type: "Infrastructure", baseCount: 1270, goodPct: 75, pearlFunded: true, icon: Layers },
    { name: "Seed Storage Warehouse", type: "Building", baseCount: 1120, goodPct: 71, pearlFunded: false, icon: Warehouse },
    { name: "Delivery Truck", type: "Vehicle", baseCount: 980, goodPct: 58, pearlFunded: false, icon: Truck },
  ];

const ASSET_USAGE_DATA: Record<string, { utilizationPct: number; avgHoursMonth: number; idlePct: number; overused: boolean }> = {
  "Water Pump System": { utilizationPct: 78, avgHoursMonth: 140, idlePct: 12, overused: false },
  "Weighing Scale": { utilizationPct: 91, avgHoursMonth: 164, idlePct: 5, overused: true },
  "Rice Mill Machine": { utilizationPct: 63, avgHoursMonth: 113, idlePct: 24, overused: false },
  "Solar Drying System": { utilizationPct: 84, avgHoursMonth: 151, idlePct: 9, overused: false },
  "Tractor": { utilizationPct: 56, avgHoursMonth: 101, idlePct: 32, overused: false },
  "Irrigation Pipeline": { utilizationPct: 71, avgHoursMonth: 128, idlePct: 18, overused: false },
  "Seed Storage Warehouse": { utilizationPct: 88, avgHoursMonth: 158, idlePct: 7, overused: false },
  "Delivery Truck": { utilizationPct: 47, avgHoursMonth: 85, idlePct: 42, overused: false },
};

const ASSET_DISPOSAL_DATA = {
  yearly: [
    { year: "2022", count: 312, valueK: 84 },
    { year: "2023", count: 428, valueK: 112 },
    { year: "2024", count: 516, valueK: 138 },
    { year: "2025", count: 394, valueK: 105 },
    { year: "2026", count: 187, valueK: 51 },
  ],
  byReason: [
    { reason: "End-of-life", count: 892, pct: 49 },
    { reason: "Severe damage", count: 437, pct: 24 },
    { reason: "Obsolete/upgraded", count: 310, pct: 17 },
    { reason: "Lost / stolen", count: 128, pct: 7 },
    { reason: "Other", count: 70, pct: 3 },
  ],
  byType: [
    { type: "Equipment", disposed: 924, replaced: 680 },
    { type: "Vehicle", disposed: 512, replaced: 340 },
    { type: "Infrastructure", disposed: 284, replaced: 190 },
    { type: "Building", disposed: 117, replaced: 88 },
  ],
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
  const [perfChartHoverProvince, setPerfChartHoverProvince] = useState<string | null>(null);
  const [showAllGeo, setShowAllGeo] = useState(false);
  const [showAllKm, setShowAllKm] = useState(false);
  const [cropFilters, setCropFilters] = useState<string[]>([]);
  const [cropDropdownOpen, setCropDropdownOpen] = useState(false);
  const [showAllCrops, setShowAllCrops] = useState(false);
  const [cropSectionTab, setCropSectionTab] = useState<"distribution" | "yield">("distribution");
  const [showAcPins, setShowAcPins] = useState(true);
  const [showMacPins, setShowMacPins] = useState(true);
  const [yieldPeriod, setYieldPeriod] = useState<"annual" | "period-select" | "monthly" | "actual-vs-forecast">("annual");
  const [yieldMonthlyCrop, setYieldMonthlyCrop] = useState("Rice");
  const [yieldRangeFrom, setYieldRangeFrom] = useState(6);
  const [yieldRangeTo, setYieldRangeTo] = useState(11);
  const [assetTab, setAssetTab] = useState<"inventory" | "usage" | "disposal">("inventory");
  const [assetTypeChipFilter, setAssetTypeChipFilter] = useState<string | null>(null);

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

  const macsStatsNational = useMemo(
    () => ({
      active: scale(380, 1),
      inactive: scale(72, 1),
      suspended: scale(24, 1),
      withdrawn: scale(10, 1),
    }),
    []
  );

  const macsStats = macsStatsNational;

  useEffect(() => {
    setPerfChartHoverProvince(null);
  }, [selectedProvinces]);


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
      const male = Math.round(total * 0.58);
      const other = Math.round(total * 0.01);
      const female = total - male - other;
      return { month, total, male, female, other };
    });
  }, [f]);

  const [trendGranularity, setTrendGranularity] = useState<"monthly" | "quarterly">("monthly");

  const farmerTrendQuarterly = useMemo(() => {
    const quarters = [
      { label: "Q1", months: farmerTrend.slice(0, 3) },
      { label: "Q2", months: farmerTrend.slice(3, 6) },
      { label: "Q3", months: farmerTrend.slice(6, 9) },
      { label: "Q4", months: farmerTrend.slice(9, 12) },
    ];
    return quarters.map(({ label, months }) => {
      const last = months[months.length - 1];
      return {
        month: label,
        total: last?.total ?? 0,
        male: last?.male ?? 0,
        female: last?.female ?? 0,
        other: last?.other ?? 0,
      };
    });
  }, [farmerTrend]);

  const farmerTrendChartData =
    trendGranularity === "monthly" ? farmerTrend : farmerTrendQuarterly;


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

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-gray-500">Consolidated analytics for oversight and policy planning</p>
        </div>
        <div className="min-w-[200px]">
          <div className="relative">
            {dropdownOpen && (
              <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
            )}
            <button
              type="button"
              onClick={() => setDropdownOpen((v) => !v)}
              className="relative z-50 flex w-full items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm text-left hover:bg-gray-50 transition-colors"
            >
              <MapPin className="h-4 w-4 text-red-500 shrink-0" />
              <span className="truncate">
                {isNational
                  ? "All provinces"
                  : selectedProvinces.length === 1
                    ? selectedProvinces[0]
                    : `${selectedProvinces.length} provinces selected`}
              </span>
              <ChevronDown
                className={`h-4 w-4 text-gray-400 shrink-0 ml-auto transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
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
                        className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${checked ? "bg-[#032EA1] border-[#032EA1]" : "border-gray-300"
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

      {/* 1. Global pulse — Total ACs, Total MACS, Total Hectares, Asset Value */}
      <section className="space-y-6">
        <div className="rounded-xl bg-gradient-to-br from-[#032EA1] to-[#021c5e] p-4 text-white shadow-lg ring-1 ring-white/10 sm:p-5">
          <div className="grid grid-cols-1 divide-y divide-white/10 sm:grid-cols-4 sm:divide-x sm:divide-y-0">
            {([
              {
                label: "Total ACs",
                value: acStats.active + acStats.inactive + acStats.suspended + acStats.withdrawn,
                icon: Building2,
                iconColor: "text-blue-600",
                breakdown: [
                  { label: "Active", value: acStats.active, dot: "bg-emerald-400" },
                  { label: "Inactive", value: acStats.inactive, dot: "bg-amber-400" },
                  { label: "Suspended", value: acStats.suspended, dot: "bg-orange-400" },
                  { label: "Withdrawn", value: acStats.withdrawn, dot: "bg-rose-400" },
                ],
              },
              {
                label: "Total MACS",
                value: macsStats.active + macsStats.inactive + macsStats.suspended + macsStats.withdrawn,
                icon: UserRound,
                iconColor: "text-emerald-600",
                breakdown: [
                  { label: "Active", value: macsStats.active, dot: "bg-emerald-400" },
                  { label: "Inactive", value: macsStats.inactive, dot: "bg-amber-400" },
                  { label: "Suspended", value: macsStats.suspended, dot: "bg-orange-400" },
                  { label: "Withdrawn", value: macsStats.withdrawn, dot: "bg-rose-400" },
                ],
              },
              {
                label: "Total Hectares",
                value: scale(78450, f),
                sub: "Total farming area",
                icon: Layers,
                iconColor: "text-teal-600",
              },
              {
                label: "Asset Value",
                value: scale(13920, f),
                sub: "Total registered assets",
                icon: Package,
                iconColor: "text-amber-600",
              },
            ] satisfies StatCard[]).map((c) => (
              <div key={c.label} className="min-w-0 px-2.5 py-2.5 first:pt-0 sm:px-4 sm:first:pl-0 sm:py-0">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[10px] font-medium leading-tight text-white/70 sm:text-[11px]">{c.label}</p>
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/20 bg-white shadow-[0_0_8px_rgba(255,255,255,0.12)]">
                    <c.icon className={`h-3.5 w-3.5 ${c.iconColor}`} />
                  </div>
                </div>
                <p className="text-xl font-bold tabular-nums sm:text-2xl">{c.value.toLocaleString()}</p>
                {c.breakdown ? (
                  <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1">
                    {c.breakdown.map((b) => (
                      <div key={b.label} className="flex items-center gap-1.5 text-[10px] text-white/70">
                        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${b.dot}`} />
                        <span>
                          {b.label}: <span className="font-semibold text-white">{b.value.toLocaleString()}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-1 text-[10px] text-white/55">{c.sub}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Map card — 100% like attached National Map Overview */}
        <section className="rounded-2xl bg-white p-6 sm:p-8 font-sans shadow-[0_10px_15px_-3px_rgb(0_0_0/0.08)] ring-1 ring-black/[0.04]">
          <div className="mb-5 border-b border-gray-200/80 pb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Map className="h-5 w-5 text-[#0F2F8F]" />
              National Map Overview
            </h2>
            <p className="mt-1 text-sm text-gray-500">Geographic distribution of farmers and agricultural cooperatives</p>
          </div>

          <div className="relative h-[420px] min-h-[320px] rounded-xl overflow-hidden border border-gray-100 bg-white ring-1 ring-black/[0.04]">
            <MapContainer center={[12.65, 104.9]} zoom={6.6} className="h-full w-full z-0" scrollWheelZoom>
              <MapViewController selected={selectedProvinces} />
              <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {/* Farmer pins — red — increased size */}
              {provinceGeo.map((p) => {
                const iconSize = 28;
                const farmerIcon = L.divIcon({
                  html: `<svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" style="filter:drop-shadow(0 1.5px 4px rgba(0,0,0,0.32));display:block"><path fill="#E00025" stroke="#9b0018" stroke-width="1.2" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.6" fill="rgba(255,255,255,0.96)"/></svg>`,
                  className: "",
                  iconSize: [iconSize, iconSize],
                  iconAnchor: [iconSize / 2, iconSize],
                  tooltipAnchor: [0, -iconSize + 4],
                });
                return (
                  <Marker
                    key={`farmer-${p.province}`}
                    position={[p.lat - 0.07, p.lon - 0.09]}
                    icon={farmerIcon}
                    eventHandlers={{
                      click: () =>
                        setSelectedProvinces((prev) =>
                          prev.includes(p.province) ? prev.filter((x) => x !== p.province) : [...prev, p.province]
                        ),
                    }}
                  >
                    <LeafletTooltip direction="top" offset={[0, -iconSize + 4]} opacity={0.95}>
                      <div className="text-xs font-medium space-y-0.5">
                        <div className="font-bold text-gray-900">{p.province}</div>
                        <div className="flex items-center gap-1.5">
                          <span className="inline-block w-2 h-2 rounded-full bg-[#E00025]" />
                          <span className="text-gray-700">Farmer</span>
                        </div>
                        <div className="text-gray-600">Farmers in ACs: {p.members.toLocaleString()}</div>
                      </div>
                    </LeafletTooltip>
                  </Marker>
                );
              })}
              {/* Cooperative pins — blue — increased size */}
              {provinceGeo.map((p) => {
                const iconSize = 28;
                const coopIcon = L.divIcon({
                  html: `<svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" style="filter:drop-shadow(0 1.5px 4px rgba(0,0,0,0.32));display:block"><path fill="#032EA1" stroke="#001a6e" stroke-width="1.2" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.6" fill="rgba(255,255,255,0.96)"/></svg>`,
                  className: "",
                  iconSize: [iconSize, iconSize],
                  iconAnchor: [iconSize / 2, iconSize],
                  tooltipAnchor: [0, -iconSize + 4],
                });
                return (
                  <Marker
                    key={`coop-${p.province}`}
                    position={[p.lat + 0.12, p.lon + 0.14]}
                    icon={coopIcon}
                    eventHandlers={{
                      click: () =>
                        setSelectedProvinces((prev) =>
                          prev.includes(p.province) ? prev.filter((x) => x !== p.province) : [...prev, p.province]
                        ),
                    }}
                  >
                    <LeafletTooltip direction="top" offset={[0, -iconSize + 4]} opacity={0.95}>
                      <div className="text-xs font-medium space-y-0.5">
                        <div className="font-bold text-gray-900">{p.province}</div>
                        <div className="flex items-center gap-1.5">
                          <span className="inline-block w-2 h-2 rounded-full bg-[#032EA1]" />
                          <span className="text-gray-700">Cooperative</span>
                        </div>
                        <div className="text-gray-600">Cooperatives: {p.acs} · Members: {p.members.toLocaleString()}</div>
                      </div>
                    </LeafletTooltip>
                  </Marker>
                );
              })}
            </MapContainer>

            {/* Legend inside map — bottom-left like attached */}
            <div className="absolute bottom-3 left-3 z-[400] rounded-lg bg-white/95 backdrop-blur-sm px-3 py-2 shadow-md border border-gray-200">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Legend</p>
              <div className="flex flex-col gap-1.5 text-xs font-medium text-gray-700">
                <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[#E00025] border border-white shadow-sm" /> Farmer</span>
                <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[#032EA1] border border-white shadow-sm" /> Cooperative</span>
              </div>
            </div>

            {/* Fullscreen button — bottom-right like attached/Google */}
            <button
              type="button"
              className="absolute bottom-3 right-3 z-[400] flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md border border-gray-200 hover:bg-gray-50"
              aria-label="Fullscreen"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.8">
                <path d="M8 3H5a2 2 0 00-2 2v3M16 3h3a2 2 0 012 2v3M8 21H5a2 2 0 01-2-2v-3M16 21h3a2 2 0 002-2v-3" />
              </svg>
            </button>
          </div>
        </section>
        {/* <p className="text-xs text-gray-400">
          Circle size reflects relative AC density (illustrative). Click a province on the map or list to filter charts below.
        </p> */}
      </section>

      {/* Combined: Regional Crop Distribution + Annual Yield Prediction */}
      <section className="rounded-2xl bg-white p-6 sm:p-8 font-sans shadow-[0_10px_15px_-3px_rgb(0_0_0/0.08)] ring-1 ring-black/[0.04]">
        {/* Shared header with tab switcher */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-5 border-b border-gray-200/80 pb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Wheat className="h-5 w-5 text-[#0F2F8F]" />
              {cropSectionTab === "distribution" ? "Regional Crop Distribution" : "Annual Yield Prediction — 2026 Forecast"}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {cropSectionTab === "distribution"
                ? "Dominant crop per province — select one or more crops to filter"
                : yieldPeriod === "actual-vs-forecast"
                  ? `2026 H1 confirmed actuals vs H2 forecast${isNational ? "" : ` · ${provinceDisplayLabel}`}`
                  : yieldPeriod === "period-select"
                    ? `Custom period forecast — select any month range${isNational ? "" : ` · ${provinceDisplayLabel}`}`
                    : `Annual yield trend · 2024–2026 forecast${isNational ? "" : ` · ${provinceDisplayLabel}`}`}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {/* Crop filter dropdown — only visible on distribution tab */}
            {cropSectionTab === "distribution" && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setCropDropdownOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:border-gray-300 transition-colors"
                >
                  <Wheat className="h-4 w-4 text-gray-400" />
                  {cropFilters.length === 0
                    ? "All crops"
                    : cropFilters.length === 1
                      ? cropFilters[0]
                      : `${cropFilters.length} crops selected`}
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${cropDropdownOpen ? "rotate-180" : ""}`} />
                </button>
                {cropDropdownOpen && (
                  <>
                    <button
                      type="button"
                      aria-hidden
                      className="fixed inset-0 z-10 cursor-default bg-transparent"
                      onClick={() => setCropDropdownOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-1.5 z-20 w-56 rounded-xl border border-gray-200 bg-white shadow-xl py-2">
                      <button
                        type="button"
                        onClick={() => { setCropFilters([]); }}
                        className="w-full px-3 py-1.5 text-left text-xs font-medium text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Clear all
                      </button>
                      <div className="h-px bg-gray-100 mx-2 my-1" />
                      {Object.entries(CROP_COLORS).map(([crop, color]) => {
                        const Icon = CROP_ICONS[crop] ?? CircleDot;
                        const checked = cropFilters.includes(crop);
                        return (
                          <button
                            key={crop}
                            type="button"
                            onClick={() =>
                              setCropFilters((prev) =>
                                checked ? prev.filter((c) => c !== crop) : [...prev, crop]
                              )
                            }
                            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 transition-colors text-sm text-left"
                          >
                            <span
                              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${checked ? "border-transparent" : "border-gray-300 bg-white"
                                }`}
                              style={checked ? { backgroundColor: color } : {}}
                            >
                              {checked && <Check className="h-3 w-3 text-white" />}
                            </span>
                            <Icon className="h-4 w-4 shrink-0" style={{ color }} />
                            <span className="text-gray-700">{crop}</span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            )}
            {/* Tab switcher */}
            <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
              <button
                type="button"
                onClick={() => setCropSectionTab("distribution")}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${cropSectionTab === "distribution" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                Crop Distribution
              </button>
              <button
                type="button"
                onClick={() => setCropSectionTab("yield")}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${cropSectionTab === "yield" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                Yield Prediction
              </button>
            </div>
          </div>
        </div>

        {/* Tab 1: National Crop Distribution — 100% like attached */}
        {cropSectionTab === "distribution" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Map — left 2 cols */}
            <div className="lg:col-span-2">
              <div className="h-[420px] min-h-[340px] rounded-xl overflow-hidden border border-gray-100 ring-1 ring-black/[0.04] relative">
                <MapContainer center={[12.7, 104.9]} zoom={6.2} className="h-full w-full z-0" scrollWheelZoom={false}>
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {provinceGeo.map((p) => {
                    const info = provinceCrops[p.province];
                    const dominant = info?.dominant ?? "Other";
                    const color = CROP_COLORS[dominant] ?? "#9ca3af";
                    const dimmed = cropFilters.length > 0 && !cropFilters.includes(dominant);
                    const iconSize = dimmed ? 24 : 30 + Math.min(6, Math.round(p.acs / 15));
                    const pinIcon = L.divIcon({
                      html: `<svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" style="filter:drop-shadow(0 1.5px 4px rgba(0,0,0,0.35));display:block"><path fill="${dimmed ? "#d1d5db" : color}" stroke="${dimmed ? "#9ca3af" : color}" stroke-width="1.1" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.7" fill="rgba(255,255,255,0.96)"/></svg>`,
                      className: "",
                      iconSize: [iconSize, iconSize],
                      iconAnchor: [iconSize / 2, iconSize],
                      tooltipAnchor: [0, -iconSize + 4],
                    });
                    return (
                      <Marker key={p.province} position={[p.lat, p.lon]} icon={pinIcon}>
                        <LeafletTooltip direction="top" offset={[0, -iconSize + 4]} opacity={0.97}>
                          <div className="text-xs font-medium space-y-0.5">
                            <div className="font-bold text-gray-900">{p.province}</div>
                            <div className="flex items-center gap-1.5">
                              <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                              <span>Dominant: <strong>{dominant}</strong> ({info?.pct ?? "—"}%)</span>
                            </div>
                            <div className="text-gray-500">ACs: {p.acs} · Members: {p.members.toLocaleString()}</div>
                          </div>
                        </LeafletTooltip>
                      </Marker>
                    );
                  })}
                </MapContainer>
                <button
                  type="button"
                  className="absolute bottom-3 right-3 z-[400] flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-md border border-gray-200 hover:bg-gray-50"
                  aria-label="Fullscreen"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.8">
                    <path d="M8 3H5a2 2 0 00-2 2v3M16 3h3a2 2 0 012 2v3M8 21H5a2 2 0 01-2-2v-3M16 21h3a2 2 0 002-2v-3" />
                  </svg>
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-4 text-xs">
                {[
                  { label: "Rice", color: CROP_COLORS.Rice },
                  { label: "Cassava", color: CROP_COLORS.Cassava },
                  { label: "Maize", color: CROP_COLORS.Maize },
                  { label: "Vegetables", color: CROP_COLORS.Vegetables },
                  { label: "Other", color: CROP_COLORS.Other },
                ].map(({ label, color }) => (
                  <span key={label} className="inline-flex items-center gap-1.5 text-gray-600">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} /> {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Right cards — 4 crops like attached */}
            <div className="lg:col-span-1 flex flex-col gap-3">
              {[
                { crop: "Rice", farmers: 16, ha: 213, names: "Sok Dara, Pich Visal +14", barPct: 86, color: CROP_COLORS.Rice, bg: "bg-amber-50", icon: Wheat },
                { crop: "Cassava", farmers: 7, ha: 83, names: "Sok Dara, Keo Sreymom +5", barPct: 62, color: CROP_COLORS.Cassava, bg: "bg-amber-50", icon: Carrot },
                { crop: "Maize", farmers: 9, ha: 120, names: "Chea Sopheak, Heng Samnang +7", barPct: 74, color: CROP_COLORS.Maize, bg: "bg-red-50", icon: Bean },
                { crop: "Vegetables", farmers: 10, ha: 93, names: "Chea Sopheak, Neang Bopha +8", barPct: 58, color: CROP_COLORS.Vegetables, bg: "bg-emerald-50", icon: Salad },
              ].map(({ crop, farmers, ha, names, barPct, color, bg, icon: Icon }) => {
                const isActive = cropFilters.includes(crop);
                return (
                  <button
                    key={crop}
                    type="button"
                    onClick={() => setCropFilters((prev) => (isActive ? prev.filter((c) => c !== crop) : [...prev, crop]))}
                    className={`w-full rounded-xl border p-3 text-left shadow-sm transition-all ${isActive ? "ring-2 bg-white" : "bg-white hover:border-gray-300"}`}
                    style={{ borderColor: isActive ? color : "#e5e7eb" }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${bg}`}>
                          <Icon className="h-4 w-4" style={{ color }} />
                        </div>
                        <span className="text-sm font-semibold text-gray-800">{crop}</span>
                      </div>
                      <span className="text-xs font-bold tabular-nums" style={{ color }}>{farmers} farmers</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-[11px] text-gray-500">
                      <span className="tabular-nums">{farmers} farmers</span>
                      <span className="text-gray-300">·</span>
                      <span className="tabular-nums">{ha} ha</span>
                      <span className="text-gray-300">·</span>
                      <span className="truncate">{names}</span>
                    </div>
                    <div className="mt-2 h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${barPct}%`, backgroundColor: color }} />
                    </div>
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setShowAllCrops((v) => !v)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-[#0F2F8F] hover:bg-gray-50 shadow-sm"
              >
                {showAllCrops ? "Show less" : "Show more (1 more)"}
              </button>
              {showAllCrops && (
                <div className="rounded-xl border bg-white p-3 shadow-sm" style={{ borderColor: CROP_COLORS.Other }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                        <CircleDot className="h-4 w-4 text-gray-400" />
                      </div>
                      <span className="text-sm font-semibold text-gray-800">Other</span>
                    </div>
                    <span className="text-xs font-bold tabular-nums text-gray-500">6 farmers</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-[11px] text-gray-500">
                    <span>6 farmers</span>
                    <span className="text-gray-300">·</span>
                    <span>42 ha</span>
                    <span className="text-gray-300">·</span>
                    <span className="truncate">Khan Dina +5</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full rounded-full bg-gray-400" style={{ width: "38%" }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {cropSectionTab === "yield" && (() => {
          const crops = Object.keys(YIELD_3Y);
          const pKey = "annual" as const;
          const avgGrowth = (crops.reduce((s, c) => {
            const d = YIELD_3Y[c];
            return s + ((d.y2026[pKey] - d.y2025[pKey]) / d.y2025[pKey]) * 100;
          }, 0) / crops.length).toFixed(1);
          const chartData = crops.map((c) => ({
            name: c === "Vegetables" ? "Veg." : c,
            "2024 Actual": YIELD_3Y[c].y2024[pKey],
            "2025 Actual": YIELD_3Y[c].y2025[pKey],
            "2026 Forecast": YIELD_3Y[c].y2026[pKey],
          }));
          const monthlyData = MONTHS_SHORT.map((m, i) => {
            const idx = YIELD_MONTHLY_IDX[yieldMonthlyCrop]?.[i] ?? 0;
            const d = YIELD_3Y[yieldMonthlyCrop];
            return {
              month: m,
              "2024": +(d.y2024.annual * idx).toFixed(2),
              "2025": +(d.y2025.annual * idx).toFixed(2),
              "2026F": +(d.y2026.annual * idx).toFixed(2),
            };
          });
          const avfChartData = crops.map((c) => ({
            name: c === "Vegetables" ? "Veg." : c,
            "H1 Actual": YIELD_3Y[c].y2026.h1,
            "H2 Forecast": YIELD_3Y[c].y2026.h2,
          }));

          const LAST_ACTUAL_MONTH = 5; // June 2026 is the last confirmed month
          const psFrom = yieldRangeFrom;
          const psTo = Math.max(yieldRangeFrom, yieldRangeTo);
          const computePeriodYield = (crop: string, fM: number, tM: number, yr: "y2024" | "y2025" | "y2026") => {
            const idx = YIELD_MONTHLY_IDX[crop] ?? [];
            const s = idx.slice(fM, tM + 1).reduce((acc: number, v: number) => acc + v, 0);
            return +(YIELD_3Y[crop][yr].annual * s).toFixed(2);
          };
          const rangeIsAllActual = psTo <= LAST_ACTUAL_MONTH;
          const rangeIsAllForecast = psFrom > LAST_ACTUAL_MONTH;
          const psCards = crops.map((c) => {
            const v26 = computePeriodYield(c, psFrom, psTo, "y2026");
            const v25 = computePeriodYield(c, psFrom, psTo, "y2025");
            const v24 = computePeriodYield(c, psFrom, psTo, "y2024");
            return { crop: c, v26, v25, v24, growthVsLy: (((v26 - v25) / v25) * 100).toFixed(1) };
          });
          const psChartData = psCards.map((r) => ({
            name: r.crop === "Vegetables" ? "Veg." : r.crop,
            "2024": r.v24,
            "2025": r.v25,
            "2026": r.v26,
          }));

          const PERIOD_TABS = [
            { key: "annual", label: "Annual" },
            { key: "period-select", label: "Period Select" },
            { key: "actual-vs-forecast", label: "Actual vs Forecast" },
            { key: "monthly", label: "Monthly Y2Y" },
          ] as const;
          return (
            <>
              <div className="flex flex-wrap gap-2 mb-5">
                <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Avg ↑{avgGrowth}% 2025→2026
                </span>

              </div>

              <div className="flex flex-wrap gap-1 p-1 bg-gray-100 rounded-xl w-fit mb-6">
                {PERIOD_TABS.map((t) => (
                  <button key={t.key} type="button"
                    onClick={() => setYieldPeriod(t.key)}
                    className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${yieldPeriod === t.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                      }`}>
                    {t.label}
                  </button>
                ))}
              </div>

              {yieldPeriod === "actual-vs-forecast" ? (
                <>
                  {/* Context banner */}
                  <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
                    <span className="text-xs font-semibold text-blue-700">Currently in 2026 H2 (Jul–Dec)</span>
                    <span className="hidden sm:block h-3 w-px bg-blue-200" />
                    <span className="inline-flex items-center gap-1.5 text-xs text-blue-600">
                      <span className="h-2.5 w-2.5 rounded-sm bg-[#3b82f6]" />
                      H1 Jan–Jun — <strong>Actual confirmed</strong>
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                      <span className="h-2.5 w-2.5 rounded-sm bg-[#cbd5e1]" />
                      H2 Jul–Dec — <strong>Forecast</strong> (based on 2026 H1 actuals + 2025 H2 baseline)
                    </span>
                  </div>

                  {/* Crop cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
                    {crops.map((crop) => {
                      const d = YIELD_3Y[crop];
                      const Icon = CROP_ICONS[crop] ?? CircleDot;
                      const h1Act = d.y2026.h1;
                      const h2Fcast = d.y2026.h2;
                      const h2GrowthVsLy = (((h2Fcast - d.y2025.h2) / d.y2025.h2) * 100).toFixed(1);
                      const h1Pct = Math.round((h1Act / (h1Act + h2Fcast)) * 100);
                      return (
                        <div key={crop} className="rounded-xl border border-gray-200 bg-white p-4 flex flex-col gap-2.5">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 shrink-0" style={{ color: d.color }} />
                            <span className="text-xs font-semibold text-gray-600 truncate">{crop}</span>
                          </div>
                          <div className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2">
                            <p className="text-[9px] font-semibold uppercase tracking-wide text-blue-400 mb-0.5">H1 2026 Actual</p>
                            <div className="flex items-baseline gap-1">
                              <p className="text-lg font-bold tabular-nums text-blue-700">{h1Act}</p>
                              <span className="text-[9px] text-blue-400">MT/ha</span>
                            </div>
                          </div>
                          <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                            <p className="text-[9px] font-semibold uppercase tracking-wide text-gray-400 mb-0.5">H2 2026 Forecast</p>
                            <div className="flex items-baseline gap-1">
                              <p className="text-lg font-bold tabular-nums text-gray-600">{h2Fcast}</p>
                              <span className="text-[9px] text-gray-400">MT/ha</span>
                            </div>
                            <p className="text-[9px] text-gray-400 mt-0.5">↑ {h2GrowthVsLy}% vs 2025 H2</p>
                          </div>
                          <div>
                            <div className="flex justify-between text-[9px] mb-1">
                              <span className="font-medium text-blue-400">H1 {h1Pct}% actual</span>
                              <span className="text-gray-400">H2 {100 - h1Pct}% forecast</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full overflow-hidden flex">
                              <div className="h-full rounded-l-full bg-blue-500" style={{ width: `${h1Pct}%` }} />
                              <div className="h-full rounded-r-full flex-1 bg-gray-300" />
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] text-gray-400">Forecast confidence</span>
                              <span className="text-[10px] font-bold text-gray-500">{d.confidence}%</span>
                            </div>
                            <div className="h-1 w-full rounded-full bg-gray-200/80">
                              <div className="h-full rounded-full bg-gray-400" style={{ width: `${d.confidence}%` }} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Chart */}
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                      2026 H1 Actual vs H2 Forecast — by crop (MT/ha)
                    </p>
                    <div style={{ height: 220 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={avfChartData} margin={{ top: 4, right: 16, left: -12, bottom: 4 }} barCategoryGap="30%" barGap={2}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                          <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} />
                          <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
                          <Tooltip
                            contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 12 }}
                            formatter={(v: number, name: string) => [`${v} MT/ha`, name]}
                          />
                          <Legend wrapperStyle={{ paddingTop: 12, fontSize: 12 }} />
                          <Bar dataKey="H1 Actual" fill="#3b82f6" radius={[3, 3, 0, 0]} maxBarSize={20} />
                          <Bar dataKey="H2 Forecast" fill="#cbd5e1" radius={[3, 3, 0, 0]} maxBarSize={20} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-[10px] text-gray-400">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#3b82f6]" />Actual (H1 confirmed)
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#cbd5e1]" />Forecast (H1-informed H2 projection)
                      </span>
                    </div>
                  </div>
                </>
              ) : yieldPeriod === "period-select" ? (
                <>
                  {/* Month range picker */}
                  <div className="mb-6">
                    <div className="flex rounded-xl overflow-hidden border border-gray-200">
                      {MONTHS_SHORT.map((m, i) => {
                        const inRange = i >= psFrom && i <= psTo;
                        const isActual = i <= LAST_ACTUAL_MONTH;
                        const isFrom = i === psFrom;
                        const isTo = i === psTo && psTo !== psFrom;
                        return (
                          <button key={m} type="button"
                            title={`${m} 2026 — ${isActual ? "Actual" : "Forecast"}`}
                            onClick={() => {
                              if (i <= yieldRangeFrom) {
                                setYieldRangeFrom(i);
                                setYieldRangeTo(i);
                              } else {
                                setYieldRangeTo(i);
                              }
                            }}
                            className={`flex-1 py-2.5 border-r last:border-r-0 border-gray-200 transition-colors ${inRange
                                ? isActual ? "bg-blue-500 text-white" : "bg-slate-500 text-white"
                                : isActual ? "bg-blue-50 text-blue-400 hover:bg-blue-100" : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                              }`}>
                            <span className="block text-[11px] font-semibold">{m}</span>
                            <span className="block text-[8px] mt-0.5 opacity-70">
                              {isFrom ? "from" : isTo ? "to" : " "}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1 text-xs font-semibold ${rangeIsAllActual
                          ? "border-blue-200 bg-blue-50 text-blue-700"
                          : rangeIsAllForecast
                            ? "border-gray-200 bg-gray-100 text-gray-600"
                            : "border-violet-200 bg-violet-50 text-violet-700"
                        }`}>
                        {rangeIsAllActual ? "Confirmed actual data" : rangeIsAllForecast ? "Forecast data" : "Mixed: actual + forecast"}
                      </span>
                      <span className="text-xs font-medium text-gray-700">
                        {MONTHS_SHORT[psFrom]}–{MONTHS_SHORT[psTo]} 2026
                        <span className="ml-1 text-gray-400">({psTo - psFrom + 1} month{psTo - psFrom !== 0 ? "s" : ""})</span>
                      </span>
                      <span className="ml-auto hidden sm:flex items-center gap-2 text-[10px] text-gray-400">
                        <span className="inline-flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-sm bg-blue-400" />Jan–Jun = actual</span>
                        <span className="inline-flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-sm bg-slate-400" />Jul–Dec = forecast</span>
                      </span>
                    </div>
                  </div>

                  {/* Crop cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
                    {psCards.map(({ crop, v26, v25, v24, growthVsLy }) => {
                      const d = YIELD_3Y[crop];
                      const Icon = CROP_ICONS[crop] ?? CircleDot;
                      return (
                        <div key={crop} className="rounded-xl border p-4 flex flex-col gap-2"
                          style={{ backgroundColor: d.bg, borderColor: d.border }}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 shrink-0" style={{ color: d.color }} />
                            <span className="text-xs font-semibold text-gray-600 truncate">{crop}</span>
                          </div>
                          <div>
                            <div className="flex items-baseline gap-1">
                              <p className="text-2xl font-bold tabular-nums text-gray-900 leading-none">{v26}</p>
                              <span className="text-[10px] text-gray-400">MT/ha</span>
                            </div>
                            <p className="text-[10px] font-semibold text-violet-600 mt-0.5">
                              {rangeIsAllActual ? "Actual" : rangeIsAllForecast ? "2026 Forecast" : "2026 Est."}
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-1 text-[10px]">
                            <div className="bg-white/60 rounded p-1.5"><p className="text-gray-400">2024</p><p className="font-semibold text-gray-700">{v24}</p></div>
                            <div className="bg-white/60 rounded p-1.5"><p className="text-gray-400">2025</p><p className="font-semibold text-gray-700">{v25}</p></div>
                          </div>
                          <p className="text-xs font-semibold" style={{ color: d.color }}>
                            {+growthVsLy >= 0 ? "↑" : "↓"} {Math.abs(+growthVsLy)}% vs 2025
                          </p>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] text-gray-400">Confidence</span>
                              <span className="text-[10px] font-bold text-gray-500">{d.confidence}%</span>
                            </div>
                            <div className="h-1 w-full rounded-full bg-gray-200/80">
                              <div className="h-full rounded-full" style={{ width: `${d.confidence}%`, backgroundColor: d.color }} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Comparison chart */}
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                      {MONTHS_SHORT[psFrom]}–{MONTHS_SHORT[psTo]} period comparison (MT/ha)
                    </p>
                    <div style={{ height: 220 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={psChartData} margin={{ top: 4, right: 16, left: -12, bottom: 4 }} barCategoryGap="30%" barGap={2}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                          <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} />
                          <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
                          <Tooltip
                            contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 12 }}
                            formatter={(v: number, name: string) => [`${v} MT/ha`, name]}
                          />
                          <Legend wrapperStyle={{ paddingTop: 12, fontSize: 12 }} />
                          <Bar dataKey="2024" fill="#cbd5e1" radius={[3, 3, 0, 0]} maxBarSize={18} />
                          <Bar dataKey="2025" fill="#6b9bda" radius={[3, 3, 0, 0]} maxBarSize={18} />
                          <Bar dataKey="2026" fill={rangeIsAllForecast ? "#94a3b8" : "#032EA1"} radius={[3, 3, 0, 0]} maxBarSize={18} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </>
              ) : yieldPeriod !== "monthly" ? (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
                    {crops.map((crop) => {
                      const d = YIELD_3Y[crop];
                      const Icon = CROP_ICONS[crop] ?? CircleDot;
                      const v2024 = d.y2024[pKey];
                      const v2025 = d.y2025[pKey];
                      const v2026 = d.y2026[pKey];
                      const growthPct = (((v2026 - v2025) / v2025) * 100).toFixed(1);
                      const h1Pct = Math.round((d.y2026.h1 / d.y2026.annual) * 100);
                      return (
                        <div key={crop} className="rounded-xl border p-4 flex flex-col gap-2"
                          style={{ backgroundColor: d.bg, borderColor: d.border }}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 shrink-0" style={{ color: d.color }} />
                            <span className="text-xs font-semibold text-gray-600 truncate">{crop}</span>
                          </div>
                          <div>
                            <div className="flex items-baseline gap-1">
                              <p className="text-2xl font-bold tabular-nums text-gray-900 leading-none">{v2026}</p>
                              <span className="text-[10px] text-gray-400">MT/ha</span>
                            </div>
                            <p className="text-[10px] font-semibold text-violet-600 mt-0.5">2026 Forecast</p>
                          </div>
                          <div className="grid grid-cols-2 gap-1 text-[10px]">
                            <div className="bg-white/60 rounded p-1.5">
                              <p className="text-gray-400">2024</p>
                              <p className="font-semibold text-gray-700">{v2024}</p>
                            </div>
                            <div className="bg-white/60 rounded p-1.5">
                              <p className="text-gray-400">2025</p>
                              <p className="font-semibold text-gray-700">{v2025}</p>
                            </div>
                          </div>
                          <p className="text-xs font-semibold" style={{ color: d.color }}>↑ {growthPct}% vs 2025</p>
                          {pKey === "annual" && (
                            <div className="mt-0.5">
                              <div className="flex justify-between text-[9px] text-gray-400 mb-1">
                                <span>H1 {h1Pct}%</span><span>H2 {100 - h1Pct}%</span>
                              </div>
                              <div className="h-1.5 w-full rounded-full overflow-hidden flex">
                                <div className="h-full rounded-l-full"
                                  style={{ width: `${h1Pct}%`, backgroundColor: d.color, opacity: 0.6 }} />
                                <div className="h-full rounded-r-full flex-1"
                                  style={{ backgroundColor: d.color }} />
                              </div>
                            </div>
                          )}
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] text-gray-400">Confidence</span>
                              <span className="text-[10px] font-bold text-gray-500">{d.confidence}%</span>
                            </div>
                            <div className="h-1 w-full rounded-full bg-gray-200/80">
                              <div className="h-full rounded-full"
                                style={{ width: `${d.confidence}%`, backgroundColor: d.color }} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                      3-year comparison — Annual yield (MT/ha)
                    </p>
                    <div style={{ height: 220 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 4, right: 16, left: -12, bottom: 4 }} barCategoryGap="30%" barGap={2}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                          <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} />
                          <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
                          <Tooltip
                            contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 12 }}
                            formatter={(v: number, name: string) => [`${v} MT/ha`, name]}
                          />
                          <Legend wrapperStyle={{ paddingTop: 12, fontSize: 12 }} />
                          <Bar dataKey="2024 Actual" fill="#cbd5e1" radius={[3, 3, 0, 0]} maxBarSize={18} />
                          <Bar dataKey="2025 Actual" fill="#6b9bda" radius={[3, 3, 0, 0]} maxBarSize={18} />
                          <Bar dataKey="2026 Forecast" fill="#032EA1" radius={[3, 3, 0, 0]} maxBarSize={18} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {crops.map((c) => {
                      const Icon = CROP_ICONS[c] ?? CircleDot;
                      const active = yieldMonthlyCrop === c;
                      return (
                        <button key={c} type="button"
                          onClick={() => setYieldMonthlyCrop(c)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${active ? "text-white border-transparent shadow-sm" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                            }`}
                          style={active ? { backgroundColor: YIELD_3Y[c].color, borderColor: YIELD_3Y[c].color } : {}}>
                          <Icon className="h-3.5 w-3.5" />
                          {c}
                        </button>
                      );
                    })}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                      Monthly yield Y2Y — {yieldMonthlyCrop} (MT/ha · seasonal estimate)
                    </p>
                    <div style={{ height: 240 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={monthlyData} margin={{ top: 4, right: 20, left: -12, bottom: 4 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} />
                          <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
                          <Tooltip
                            contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 12 }}
                            formatter={(v: number, name: string) => [`${v} MT/ha`, name]}
                          />
                          <Legend wrapperStyle={{ paddingTop: 12, fontSize: 12 }} />
                          <ReferenceLine x="Jun" stroke="#e2e8f0" strokeDasharray="4 3"
                            label={{ value: "H1|H2", fontSize: 9, fill: "#94a3b8", position: "insideTopRight" }} />
                          <Line dataKey="2024" stroke="#cbd5e1" strokeWidth={2} dot={false} />
                          <Line dataKey="2025" stroke="#6b9bda" strokeWidth={2} dot={false} />
                          <Line dataKey="2026F" stroke="#032EA1" strokeWidth={2.5} dot={false} strokeDasharray="6 3" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-[10px] text-gray-400">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="inline-block w-5 h-0.5 bg-[#cbd5e1] rounded" />2024 Actual
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="inline-block w-5 h-0.5 bg-[#6b9bda] rounded" />2025 Actual
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="inline-block w-5 h-px border-t-2 border-dashed border-[#032EA1]" />2026 Forecast
                      </span>
                      <span className="ml-auto">H1 = Jan–Jun harvest · H2 = Jul–Dec harvest</span>
                    </div>
                  </div>
                </>
              )}

              <p className="mt-4 text-[10px] text-gray-400">
                Forecast based on cooperative field reports, seasonal rainfall index, and MAFF provincial extension data.
                2-year trend (2024–2025) applied for 2026 projection. Confidence band ±5%.
              </p>
            </>
          );
        })()}
      </section>

      {/* 2. Geographic Distribution — redesigned as Gender Distribution by Province */}
      <section className="rounded-2xl bg-white p-6 sm:p-8 font-sans shadow-[0_10px_15px_-3px_rgb(0_0_0/0.08)] ring-1 ring-black/[0.04]">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-gray-200/80 pb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Users className="h-5 w-5 text-[#0F2F8F]" />
              Gender Distribution by Province
            </h2>
            <p className="mt-1 text-sm text-gray-500">Male and female farmer members per province</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium text-gray-600">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#1e3a8a]" /> Male
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#E00025]" /> Female
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-gray-400" /> Other
            </span>
          </div>
        </div>

        {(() => {
          const sorted = [...provinceGeo].sort((a, b) => b.members - a.members);
          const exactMap: Record<string, { male: number; female: number }> = {
            "Phnom Penh": { male: 8360, female: 6688 },
            Battambang: { male: 7316, female: 4960 },
            "Siem Reap": { male: 5656, female: 4343 },
            Kandal: { male: 5488, female: 4214 },
            "Kampong Thom": { male: 5162, female: 3649 },
            "Kampong Cham": { male: 4674, female: 3444 },
            Takeo: { male: 3520, female: 2816 },
            "Tboung Khmum": { male: 3538, female: 2501 },
            Kampot: { male: 3306, female: 2436 },
            "Prey Veng": { male: 2968, female: 2279 },
          };
          const getGender = (p: (typeof provinceGeo)[0]) => {
            const exact = exactMap[p.province];
            if (exact) {
              const other = p.members - exact.male - exact.female;
              const malePct = Math.round((exact.male / p.members) * 100);
              const femalePct = Math.round((exact.female / p.members) * 100);
              const otherPct = Math.max(0, 100 - malePct - femalePct);
              return { male: exact.male, female: exact.female, other, malePct, femalePct, otherPct };
            }
            const malePct = 55 + (p.acs % 5);
            const femalePct = 99 - malePct;
            const otherPct = 1;
            const male = Math.round((p.members * malePct) / 100);
            const female = Math.round((p.members * femalePct) / 100);
            let other = p.members - male - female;
            if (other < 0) other = 0;
            return { male, female, other, malePct, femalePct, otherPct };
          };
          const visible = showAllGeo ? sorted : sorted.slice(0, 10);
          return (
            <>
              <div className="space-y-3">
                {visible.map((p) => {
                  const { male, female, malePct, femalePct, otherPct } = getGender(p);
                  return (
                    <div key={p.province} className="flex items-center gap-3">
                      <div className="w-28 sm:w-36 shrink-0 text-xs sm:text-sm font-medium text-gray-700 text-right truncate">
                        {p.province}
                      </div>
                      <div className="flex-1 h-7 rounded-lg overflow-hidden flex bg-gray-100">
                        <div
                          className="h-full flex items-center justify-end pr-1.5 text-[10px] font-bold text-white"
                          style={{ width: `${malePct}%`, backgroundColor: "#1e3a8a" }}
                        >
                          {malePct >= 14 ? `${malePct}%` : ""}
                        </div>
                        <div
                          className="h-full flex items-center justify-start pl-1.5 text-[10px] font-bold text-white"
                          style={{ width: `${femalePct}%`, backgroundColor: "#E00025" }}
                        >
                          {femalePct >= 14 ? `${femalePct}%` : ""}
                        </div>
                        {otherPct > 0 && (
                          <div className="h-full bg-gray-400 flex-1 min-w-[6px]" style={{ maxWidth: `${otherPct}%` }} />
                        )}
                      </div>
                      <div className="w-24 sm:w-[110px] shrink-0 text-right">
                        <div className="flex justify-end gap-1.5 text-xs font-semibold tabular-nums leading-none">
                          <span className="text-[#1e3a8a]">{male.toLocaleString()}</span>
                          <span className="text-[#E00025]">{female.toLocaleString()}</span>
                        </div>
                        <div className="text-[11px] text-gray-400 tabular-nums leading-none mt-1">
                          {p.members.toLocaleString()} mbrs
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {sorted.length > 10 && (
                <button
                  type="button"
                  onClick={() => setShowAllGeo((v) => !v)}
                  className="mt-5 inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-[#1e3a8a] shadow-sm hover:bg-gray-50 transition-colors"
                >
                  {showAllGeo ? "Show less" : `Show more (${sorted.length - 10} more)`}
                </button>
              )}
            </>
          );
        })()}
      </section>


      {/* 4. Farmer Membership Trend */}
      {(() => {
        const latest = farmerTrend[farmerTrend.length - 1];
        const first = farmerTrend[0];
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
              <div className="flex items-center gap-1 rounded-xl bg-gray-100 p-1">
                {(["monthly", "quarterly"] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setTrendGranularity(g)}
                    className={`rounded-lg px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
                      trendGranularity === g
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Chart */}
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={farmerTrendChartData} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
                  <defs>
                    <linearGradient id="farmerTrendMaleFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#032EA1" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#032EA1" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="farmerTrendFemaleFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E00025" stopOpacity={0.12} />
                      <stop offset="95%" stopColor="#E00025" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
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
                  <Legend wrapperStyle={{ paddingTop: 14, fontSize: 12 }} iconType="circle" />
                  <Area type="monotone" dataKey="male" name="Male" stroke="#032EA1" strokeWidth={2.5} fill="url(#farmerTrendMaleFill)" dot={false} activeDot={{ r: 4 }} />
                  <Area type="monotone" dataKey="female" name="Female" stroke="#E00025" strokeWidth={2.5} fill="url(#farmerTrendFemaleFill)" dot={false} activeDot={{ r: 4 }} />
                  <Line type="monotone" dataKey="total" name="Total" stroke="#10b981" strokeWidth={2} strokeDasharray="6 4" dot={false} />
                  <Line type="monotone" dataKey="other" name="Other" stroke="#94a3b8" strokeWidth={2} strokeDasharray="4 3" dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Gender insight strip */}
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Male farmers", value: latest?.male.toLocaleString() ?? "—", color: "#032EA1", bg: "#eff6ff" },
                { label: "Female farmers", value: latest?.female.toLocaleString() ?? "—", color: "#E00025", bg: "#fff1f2" },
                { label: "Other / prefer not", value: latest?.other.toLocaleString() ?? "—", color: "#475569", bg: "#f1f5f9" },
                { label: "New this year", value: `+${((latest?.total ?? 0) - (first?.total ?? 0)).toLocaleString()}`, color: "#059669", bg: "#ecfdf5" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl p-3" style={{ backgroundColor: s.bg }}>
                  <p className="text-lg font-bold tabular-nums" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </section>
        );
      })()}


      {/* Knowledge Material Dissemination — redesigned 100% like attached */}
      <section className="rounded-2xl bg-white p-6 sm:p-8 font-sans shadow-[0_10px_15px_-3px_rgb(0_0_0/0.06)] ring-1 ring-black/[0.04]">
        <div className="mb-5 border-b border-gray-200/80 pb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-[#0F2F8F]" />
            Knowledge Material Dissemination
          </h2>
          <p className="mt-1 text-sm text-gray-500">Materials uploaded, AC access rates, and adoption by province</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Materials */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#0F2F8F] to-[#1a2d5a] p-5 text-white shadow-md">
            <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-white/[0.08]" />
            <div className="absolute top-6 right-6 h-16 w-16 rounded-full bg-white/[0.05]" />
            <div className="relative flex items-start justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm">
                <BookOpen className="h-5 w-5 text-[#0F2F8F]" />
              </div>
              <span className="text-[10px] font-semibold tracking-widest text-white/60 uppercase mt-2">Materials</span>
            </div>
            <p className="relative mt-5 text-2xl font-bold tracking-tight">248</p>
            <p className="relative text-sm font-medium text-white/95">Total Materials Uploaded</p>
            <p className="relative mt-1 text-[11px] text-white/55">6 categories</p>
          </div>

          {/* Downloads */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#1c2545] to-[#2a3350] p-5 text-white shadow-md">
            <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-white/[0.08]" />
            <div className="absolute top-6 right-6 h-16 w-16 rounded-full bg-white/[0.05]" />
            <div className="relative flex items-start justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm">
                <Download className="h-4 w-4 text-[#1e40af]" />
              </div>
              <span className="text-[10px] font-semibold tracking-widest text-white/60 uppercase mt-2">Downloads</span>
            </div>
            <p className="relative mt-5 text-2xl font-bold tracking-tight">1,842</p>
            <p className="relative text-sm font-medium text-white/95">Total Downloads</p>
            <p className="relative mt-1 text-[11px] text-white/55">across all materials</p>
          </div>

          {/* 63% ACs accessed */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#5aa9d6] via-[#3a7ab8] to-[#1e3a5a] p-5 text-white shadow-md">
            <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-white/[0.12]" />
            <div className="absolute top-6 right-6 h-16 w-16 rounded-full bg-white/[0.06]" />
            <div className="relative flex items-start justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm">
                <BarChart3 className="h-5 w-5 text-[#1e5a8a]" />
              </div>
              <span className="text-2xl font-bold tracking-tight">63%</span>
            </div>
            <div className="relative mt-6">
              <div className="h-1.5 w-full rounded-full bg-white/25 overflow-hidden">
                <div className="h-full rounded-full bg-white" style={{ width: "63%" }} />
              </div>
              <p className="mt-2 text-xs font-medium text-white/90">676 of 1,256 ACs accessed materials</p>
            </div>
          </div>
        </div>
      </section>

      {/* Asset Management Metrics — 100% like attached */}
      <section className="rounded-2xl bg-white p-6 sm:p-8 font-sans shadow-[0_10px_15px_-3px_rgb(0_0_0/0.06)] ring-1 ring-black/[0.04]">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-5 border-b border-gray-200/80 pb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Package className="h-5 w-5 text-[#0F2F8F]" />
              Asset Management Metrics
            </h2>
            <p className="mt-1 text-sm text-gray-500">Total reported assets across all ACs — condition, type, and PEARL funding</p>
          </div>
          <div className="flex items-center gap-3 text-xs font-medium text-gray-500">
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#22c55e]" /> Good</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]" /> Fair</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#ef4444]" /> Poor</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#94a3b8]" /> Unknown</span>
          </div>
        </div>

        {/* Top 3 summary cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Total Reported Assets — pixel match attached */}
          <div className="relative overflow-hidden rounded-xl bg-[#2563eb] p-5 text-white shadow-md flex items-center">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/15">
                <Package className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold leading-none tabular-nums tracking-tight">13,920</p>
                <p className="text-xs font-medium text-white mt-1">Total Reported Assets</p>
                <p className="text-[11px] text-white/70 leading-none mt-0.5">across 8 asset types</p>
              </div>
            </div>
          </div>

          {/* Condition Overview */}
          <div className="rounded-xl bg-[#1e293b] p-5 text-white shadow-md flex flex-col justify-center">
            <p className="text-xs font-semibold text-center text-white mb-3">Condition Overview</p>
            <div className="h-3 w-full rounded-full overflow-hidden flex">
              <div className="h-full bg-[#22c55e]" style={{ width: "52%" }} />
              <div className="h-full bg-[#f59e0b]" style={{ width: "31%" }} />
              <div className="h-full bg-[#ef4444]" style={{ width: "12%" }} />
              <div className="h-full bg-[#94a3b8]" style={{ width: "5%" }} />
            </div>
            <div className="mt-2 flex flex-wrap justify-center gap-x-3 gap-y-1 text-[10px] font-medium">
              <span className="text-[#22c55e]">52% Good</span>
              <span className="text-[#fbbf24]">31% Fair</span>
              <span className="text-[#f87171]">12% Poor</span>
              <span className="text-[#94a3b8]">5% Unknown</span>
            </div>
          </div>

          {/* 58% Funded */}
          <div className="relative overflow-hidden rounded-xl bg-[#1e3a8a] p-5 text-white shadow-md">
            <div className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-white/10" />
            <div className="flex items-start justify-between">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                <BadgeCheck className="h-5 w-5 text-[#1e3a8a]" />
              </div>
              <span className="text-[10px] font-semibold tracking-widest text-white/50 uppercase mt-1.5">Funded</span>
            </div>
            <p className="mt-3 text-2xl font-bold leading-none tabular-nums">58%</p>
            <div className="mt-3 h-1.5 w-full rounded-full bg-white/20 overflow-hidden">
              <div className="h-full rounded-full bg-white" style={{ width: "58%" }} />
            </div>
            <p className="mt-1.5 text-[11px] text-white/70">8,120 of 13,920 assets are funded</p>
          </div>
        </div>

        {/* Type filter chips */}
        <div className="mt-6 flex flex-wrap gap-2">
          {[
            { label: "Equipment", count: "8,710", sub: "4", icon: Wrench, color: "#2563eb", bg: "bg-blue-50", border: "border-blue-100" },
            { label: "Vehicle", count: "2,820", sub: "2", icon: Truck, color: "#7c3aed", bg: "bg-violet-50", border: "border-violet-100" },
            { label: "Infrastructure", count: "1,270", sub: "1", icon: Waves, color: "#e11d48", bg: "bg-rose-50", border: "border-rose-100" },
            { label: "Building", count: "1,120", sub: "1", icon: Warehouse, color: "#d97706", bg: "bg-amber-50", border: "border-amber-100" },
          ].map(({ label, count, sub, icon: Icon, color, bg, border }) => {
            const active = assetTypeChipFilter === label;
            return (
              <button
                key={label}
                type="button"
                onClick={() => setAssetTypeChipFilter((prev) => (prev === label ? null : label))}
                className={`inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1.5 shadow-sm transition-all ${
                  active ? "ring-2 ring-offset-1" : border
                }`}
                style={active ? { borderColor: color, ["--tw-ring-color" as string]: color } : undefined}
              >
                <div className={`flex h-6 w-6 items-center justify-center rounded-full ${bg}`}>
                  <Icon className="h-3.5 w-3.5" style={{ color }} />
                </div>
                <span className="text-xs font-medium text-gray-700">{label}</span>
                <span className="text-xs font-bold tabular-nums text-gray-900">· {count}</span>
                <span className="text-[11px] text-gray-400">({sub})</span>
              </button>
            );
          })}
        </div>

        {/* Asset subtype grid — 2 columns like attached */}
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-3">
          {[
            { name: "Water Pump System", type: "Equipment", count: 3240, goodPct: 71, pearl: true, icon: Wrench, color: "#2563eb", typeColor: "#2563eb" },
            { name: "Weighing Scale", type: "Equipment", count: 2190, goodPct: 82, pearl: true, icon: Wrench, color: "#2563eb", typeColor: "#2563eb" },
            { name: "Rice Mill Machine", type: "Equipment", count: 1860, goodPct: 68, pearl: false, icon: Wrench, color: "#2563eb", typeColor: "#0ea5e9" },
            { name: "Solar Drying System", type: "Equipment", count: 1420, goodPct: 79, pearl: true, icon: Wrench, color: "#2563eb", typeColor: "#2563eb" },
            { name: "Tractor", type: "Vehicle", count: 1840, goodPct: 62, pearl: false, icon: Truck, color: "#7c3aed", typeColor: "#7c3aed" },
            { name: "Irrigation Pipeline", type: "Infrastructure", count: 1270, goodPct: 75, pearl: true, icon: Waves, color: "#e11d48", typeColor: "#e11d48" },
            { name: "Seed Storage Warehouse", type: "Building", count: 1120, goodPct: 71, pearl: false, icon: Warehouse, color: "#d97706", typeColor: "#d97706" },
            { name: "Delivery Truck", type: "Vehicle", count: 980, goodPct: 58, pearl: false, icon: Truck, color: "#7c3aed", typeColor: "#7c3aed" },
          ]
            .filter((row) => !assetTypeChipFilter || row.type === assetTypeChipFilter)
            .map((row) => (
            <div key={row.name} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${row.type === "Equipment" ? "bg-blue-50" : row.type === "Vehicle" ? "bg-violet-50" : row.type === "Infrastructure" ? "bg-rose-50" : "bg-amber-50"}`}>
                <row.icon className="h-4 w-4" style={{ color: row.color }} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-semibold text-gray-900 truncate">{row.name}</p>
                  {row.pearl && (
                    <span className="shrink-0 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-600 border border-emerald-100">
                      PEARL
                    </span>
                  )}
                </div>
                <p className="text-[11px] font-medium" style={{ color: row.typeColor === "#0ea5e9" ? "#0ea5e9" : row.typeColor }}>{row.type}</p>
              </div>
              <div className="shrink-0 text-right w-[120px]">
                <p className="text-sm font-bold tabular-nums text-gray-900 leading-none">{row.count.toLocaleString()} <span className="text-[10px] font-normal text-gray-400">units</span></p>
                <div className="mt-1.5 text-right">
                  <div className="flex justify-between text-[10px] leading-none mb-1">
                    <span className="text-gray-400">Condition</span>
                    <span className="font-semibold text-emerald-500">{row.goodPct}% good</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-400" style={{ width: `${row.goodPct}%` }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
