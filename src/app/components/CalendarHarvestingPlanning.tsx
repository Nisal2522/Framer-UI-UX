import { useMemo, useState } from "react";
import { AlertTriangle, Bug, ChevronDown, ChevronUp, CloudRain, Droplets, Leaf, Plus, Sprout, SunMedium, Tractor, Wheat, X } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "./ui/sheet";
import { cn } from "./ui/utils";

type Season = "Wet" | "Dry";
type CycleStatus = "Planned" | "Ongoing" | "Completed";
type WaterSource = "Rain-fed" | "Irrigated";
type CalendarView = "Monthly" | "Seasonal" | "Yearly";
type TimelineFilter = "Full cycle" | "Planting only" | "Harvesting only";
type CropType = "Rice" | "Cassava" | "Maize" | "Vegetables" | "Rubber";

type CropCycle = {
  id: string;
  crop: CropType;
  variety: string;
  season: Season;
  plantingStart: string;
  plantingEnd: string;
  harvestStart: string;
  harvestEnd: string;
  durationDays: number;
  landPlotId: string;
  farmer: string;
  province: string;
  waterSource: WaterSource;
  status: CycleStatus;
  expectedYield: string;
  notes: string;
};

type CreateCycleForm = {
  crop: CropType;
  variety: string;
  season: Season;
  plantingStart: string;
  plantingEnd: string;
  harvestStart: string;
  harvestEnd: string;
  landPlotId: string;
  farmer: string;
  province: string;
  waterSource: WaterSource;
  expectedYield: string;
  notes: string;
  repeatYears: number;
};

const INITIAL_CYCLES: CropCycle[] = [
  { id: "c1", crop: "Rice", variety: "Phka Rumduol", season: "Wet", plantingStart: "2026-05-12", plantingEnd: "2026-06-08", harvestStart: "2026-10-05", harvestEnd: "2026-11-02", durationDays: 140, landPlotId: "R-12", farmer: "Sok Pisey", province: "Battambang", waterSource: "Rain-fed", status: "Planned", expectedYield: "4.6 t/ha", notes: "Main wet-season rice block." },
  { id: "c2", crop: "Rice", variety: "IR504", season: "Dry", plantingStart: "2026-11-20", plantingEnd: "2026-12-15", harvestStart: "2027-03-15", harvestEnd: "2027-04-12", durationDays: 115, landPlotId: "R-03", farmer: "Chan Pisey", province: "Takeo", waterSource: "Irrigated", status: "Planned", expectedYield: "5.5 t/ha", notes: "Dry-season irrigated rice." },
  { id: "c3", crop: "Cassava", variety: "KU50", season: "Wet", plantingStart: "2026-05-01", plantingEnd: "2026-06-20", harvestStart: "2027-01-10", harvestEnd: "2027-03-05", durationDays: 300, landPlotId: "C-04", farmer: "Keo Sothea", province: "Kampong Thom", waterSource: "Rain-fed", status: "Ongoing", expectedYield: "22 t/ha", notes: "Monitor root rot in low areas." },
  { id: "c4", crop: "Maize", variety: "CP888", season: "Dry", plantingStart: "2026-12-01", plantingEnd: "2026-12-22", harvestStart: "2027-03-01", harvestEnd: "2027-03-25", durationDays: 105, landPlotId: "M-09", farmer: "Lim Dara", province: "Siem Reap", waterSource: "Irrigated", status: "Planned", expectedYield: "4.8 t/ha", notes: "Follow split fertilizer schedule." },
  { id: "c5", crop: "Vegetables", variety: "Cucumber + long bean", season: "Dry", plantingStart: "2026-01-08", plantingEnd: "2026-01-25", harvestStart: "2026-03-02", harvestEnd: "2026-04-01", durationDays: 65, landPlotId: "V-02", farmer: "Chea Sokha", province: "Kandal", waterSource: "Irrigated", status: "Completed", expectedYield: "12 t/ha", notes: "Good market price period." },
  { id: "c6", crop: "Rubber", variety: "GT1", season: "Wet", plantingStart: "2026-06-05", plantingEnd: "2026-07-10", harvestStart: "2032-01-01", harvestEnd: "2032-12-31", durationDays: 2200, landPlotId: "RB-01", farmer: "Pen Virak", province: "Ratanakiri", waterSource: "Rain-fed", status: "Ongoing", expectedYield: "Long-term tapping", notes: "Perennial crop; yearly maintenance focus." },
];

const CROP_COLORS: Record<CropCycle["crop"], string> = {
  Rice: "bg-emerald-100 text-emerald-800",
  Cassava: "bg-violet-100 text-violet-800",
  Maize: "bg-amber-100 text-amber-800",
  Vegetables: "bg-sky-100 text-sky-800",
  Rubber: "bg-gray-200 text-gray-800",
};

const STATUS_COLORS: Record<CycleStatus, string> = {
  Planned: "bg-slate-100 text-slate-700 border-slate-200",
  Ongoing: "bg-blue-50 text-blue-700 border-blue-200",
  Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const SEASON_MONTHS: Record<Season, number[]> = {
  Wet: [4, 5, 6, 7, 8, 9],
  Dry: [10, 11, 0, 1, 2, 3],
};

const dateText = (v: string) => new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const isInSeasonWindow = (dateStr: string, season: Season) => SEASON_MONTHS[season].includes(new Date(dateStr).getMonth());

export function CalendarHarvestingPlanning() {
  const [cycles, setCycles] = useState<CropCycle[]>(INITIAL_CYCLES);
  const [selectedId, setSelectedId] = useState<string | null>(INITIAL_CYCLES[0]?.id ?? null);
  const [view, setView] = useState<CalendarView>("Monthly");
  const [timelineFilter, setTimelineFilter] = useState<TimelineFilter>("Full cycle");
  const [year, setYear] = useState(2026);
  const [cropFilter, setCropFilter] = useState<string>("All crops");
  const [farmerFilter, setFarmerFilter] = useState<string>("All farmers");
  const [provinceFilter, setProvinceFilter] = useState<string>("All provinces");
  const [seasonFilter, setSeasonFilter] = useState<string>("All seasons");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isRecommendationsOpen, setIsRecommendationsOpen] = useState(false);
  const [createErrors, setCreateErrors] = useState<Record<string, string>>({});
  const [createForm, setCreateForm] = useState<CreateCycleForm>({
    crop: "Rice",
    variety: "",
    season: "Wet",
    plantingStart: "",
    plantingEnd: "",
    harvestStart: "",
    harvestEnd: "",
    landPlotId: "",
    farmer: "",
    province: "",
    waterSource: "Rain-fed",
    expectedYield: "",
    notes: "",
    repeatYears: 0,
  });

  const farmerOptions = useMemo(() => ["All farmers", ...Array.from(new Set(cycles.map((c) => c.farmer)))], [cycles]);
  const provinceOptions = useMemo(() => ["All provinces", ...Array.from(new Set(cycles.map((c) => c.province)))], [cycles]);
  const cropOptions = useMemo(() => ["All crops", ...Array.from(new Set(cycles.map((c) => c.crop)))], [cycles]);

  const filtered = useMemo(
    () =>
      cycles.filter((c) => {
        if (cropFilter !== "All crops" && c.crop !== cropFilter) return false;
        if (farmerFilter !== "All farmers" && c.farmer !== farmerFilter) return false;
        if (provinceFilter !== "All provinces" && c.province !== provinceFilter) return false;
        if (seasonFilter !== "All seasons" && c.season !== seasonFilter) return false;
        return new Date(c.plantingStart).getFullYear() <= year && new Date(c.harvestEnd).getFullYear() >= year;
      }),
    [cycles, cropFilter, farmerFilter, provinceFilter, seasonFilter, year]
  );

  const selected = filtered.find((c) => c.id === selectedId) ?? filtered[0] ?? null;

  const alerts = useMemo(() => {
    const rows: string[] = [];
    filtered.forEach((c) => {
      if (!isInSeasonWindow(c.plantingStart, c.season)) rows.push(`${c.crop} (${c.landPlotId}) planting season mismatch.`);
      if (new Date(c.plantingEnd).getMonth() > (c.season === "Wet" ? 6 : 1)) rows.push(`${c.crop} (${c.landPlotId}) late planting risk.`);
      if (new Date(c.harvestEnd).getMonth() > (c.season === "Wet" ? 10 : 4)) rows.push(`${c.crop} (${c.landPlotId}) late harvest risk.`);
    });
    return rows.slice(0, 6);
  }, [filtered]);

  const recommendations = useMemo(() => {
    const rows: string[] = [];
    if (seasonFilter === "All seasons" || seasonFilter === "Wet") {
      rows.push("Wet season (May-Oct): prioritize rain-fed rice and maintain drainage channels before peak rainfall.");
      rows.push("Use early-maturing rice varieties in flood-prone plots to reduce late-harvest risk.");
    }
    if (seasonFilter === "All seasons" || seasonFilter === "Dry") {
      rows.push("Dry season (Nov-Apr): plan irrigated rice/maize where water reliability is strong.");
      rows.push("Schedule fertilizer splits around irrigation cycles to reduce nutrient loss.");
    }
    rows.push("For rotation planning, use rice -> maize -> vegetables on the same plot to balance soil and labor.");
    return rows.slice(0, 4);
  }, [seasonFilter]);

  const overlapCount = useMemo(() => {
    let overlaps = 0;
    for (let i = 0; i < filtered.length; i += 1) {
      for (let j = i + 1; j < filtered.length; j += 1) {
        const a = filtered[i];
        const b = filtered[j];
        if (a.landPlotId !== b.landPlotId) continue;
        const aStart = new Date(a.plantingStart).getTime();
        const aEnd = new Date(a.harvestEnd).getTime();
        const bStart = new Date(b.plantingStart).getTime();
        const bEnd = new Date(b.harvestEnd).getTime();
        if (Math.max(aStart, bStart) <= Math.min(aEnd, bEnd)) overlaps += 1;
      }
    }
    return overlaps;
  }, [filtered]);

  const productivity = useMemo(() => {
    const wet = filtered.filter((c) => c.season === "Wet").length;
    const dry = filtered.filter((c) => c.season === "Dry").length;
    return { wet, dry, total: filtered.length };
  }, [filtered]);

  const statusCounts = useMemo(() => {
    const planned = filtered.filter((c) => c.status === "Planned").length;
    const ongoing = filtered.filter((c) => c.status === "Ongoing").length;
    const completed = filtered.filter((c) => c.status === "Completed").length;
    return { planned, ongoing, completed };
  }, [filtered]);

  const moveSelectedByDays = (days: number) => {
    if (!selected) return;
    const shift = (value: string) => {
      const d = new Date(value);
      d.setDate(d.getDate() + days);
      return d.toISOString().slice(0, 10);
    };
    setCycles((prev) =>
      prev.map((c) =>
        c.id === selected.id
          ? { ...c, plantingStart: shift(c.plantingStart), plantingEnd: shift(c.plantingEnd), harvestStart: shift(c.harvestStart), harvestEnd: shift(c.harvestEnd) }
          : c
      )
    );
  };

  const duplicateToNextYear = () => {
    if (!selected) return;
    const shiftYear = (value: string) => {
      const d = new Date(value);
      d.setFullYear(d.getFullYear() + 1);
      return d.toISOString().slice(0, 10);
    };
    setCycles((prev) => [...prev, { ...selected, id: `${selected.id}-y${Date.now()}`, status: "Planned", plantingStart: shiftYear(selected.plantingStart), plantingEnd: shiftYear(selected.plantingEnd), harvestStart: shiftYear(selected.harvestStart), harvestEnd: shiftYear(selected.harvestEnd) }]);
  };

  const validateCreateForm = () => {
    const errors: Record<string, string> = {};
    if (!createForm.variety.trim()) errors.variety = "Variety is required.";
    if (!createForm.plantingStart) errors.plantingStart = "Planting start is required.";
    if (!createForm.plantingEnd) errors.plantingEnd = "Planting end is required.";
    if (!createForm.harvestStart) errors.harvestStart = "Harvest start is required.";
    if (!createForm.harvestEnd) errors.harvestEnd = "Harvest end is required.";
    if (!createForm.farmer.trim()) errors.farmer = "Farmer name is required.";
    if (!createForm.province.trim()) errors.province = "Province is required.";
    if (!createForm.landPlotId.trim()) errors.landPlotId = "Land/plot ID is required.";
    if (!createForm.expectedYield.trim()) errors.expectedYield = "Expected yield is required.";

    if (createForm.plantingStart && createForm.plantingEnd && new Date(createForm.plantingStart) > new Date(createForm.plantingEnd)) {
      errors.plantingEnd = "Planting end must be after planting start.";
    }
    if (createForm.harvestStart && createForm.harvestEnd && new Date(createForm.harvestStart) > new Date(createForm.harvestEnd)) {
      errors.harvestEnd = "Harvest end must be after harvest start.";
    }
    if (createForm.plantingEnd && createForm.harvestStart && new Date(createForm.plantingEnd) > new Date(createForm.harvestStart)) {
      errors.harvestStart = "Harvest should start after planting window.";
    }
    return errors;
  };

  const handleCreateCycle = () => {
    const errors = validateCreateForm();
    setCreateErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const buildCycle = (offsetYear: number): CropCycle => {
      const shiftYear = (value: string) => {
        const d = new Date(value);
        d.setFullYear(d.getFullYear() + offsetYear);
        return d.toISOString().slice(0, 10);
      };
      const plantingStart = shiftYear(createForm.plantingStart);
      const plantingEnd = shiftYear(createForm.plantingEnd);
      const harvestStart = shiftYear(createForm.harvestStart);
      const harvestEnd = shiftYear(createForm.harvestEnd);
      const durationDays = Math.max(1, Math.ceil((new Date(harvestEnd).getTime() - new Date(plantingStart).getTime()) / (1000 * 60 * 60 * 24)));
      return {
        id: `cycle-${Date.now()}-${offsetYear}`,
        crop: createForm.crop,
        variety: createForm.variety.trim(),
        season: createForm.season,
        plantingStart,
        plantingEnd,
        harvestStart,
        harvestEnd,
        durationDays,
        landPlotId: createForm.landPlotId.trim(),
        farmer: createForm.farmer.trim(),
        province: createForm.province.trim(),
        waterSource: createForm.waterSource,
        status: "Planned",
        expectedYield: createForm.expectedYield.trim(),
        notes: createForm.notes.trim() || "Created via + Create Crop Cycle.",
      };
    };

    const newItems = Array.from({ length: createForm.repeatYears + 1 }, (_, i) => buildCycle(i));
    setCycles((prev) => [...newItems, ...prev]);
    setSelectedId(newItems[0].id);
    setIsCreateOpen(false);
    setCreateErrors({});
    setCreateForm({
      crop: "Rice",
      variety: "",
      season: "Wet",
      plantingStart: "",
      plantingEnd: "",
      harvestStart: "",
      harvestEnd: "",
      landPlotId: "",
      farmer: "",
      province: "",
      waterSource: "Rain-fed",
      expectedYield: "",
      notes: "",
      repeatYears: 0,
    });
  };

  /** Matches AssetManagement “Register New Asset” drawer (compact) */
  const assetFormFieldClass =
    "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white";
  const assetFormLabelClass = "block text-xs font-medium text-gray-600 mb-1";

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-br from-slate-50 via-white to-slate-100/70 p-4 shadow-[0_4px_32px_-8px_rgba(3,46,161,0.15),0_0_0_1px_rgba(255,255,255,0.8)_inset] sm:p-6">
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#032EA1]/[0.06] blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" aria-hidden />

        <div className="relative flex w-full flex-wrap items-center justify-end gap-2 border-b border-slate-200/80 pb-4">
            {[
              { icon: Sprout, label: "Planting", accent: "from-emerald-400 to-emerald-600", glow: "shadow-emerald-500/20" },
              { icon: Leaf, label: "Growing", accent: "from-sky-400 to-blue-600", glow: "shadow-sky-500/20" },
              { icon: Wheat, label: "Harvesting", accent: "from-amber-400 to-orange-500", glow: "shadow-amber-500/20" },
              { icon: Droplets, label: "Fertilizer", accent: "from-violet-400 to-purple-600", glow: "shadow-violet-500/20" },
              { icon: Bug, label: "Pest risk", accent: "from-rose-400 to-rose-600", glow: "shadow-rose-500/20" },
              { icon: Tractor, label: "Post-harvest", accent: "from-slate-400 to-slate-600", glow: "shadow-slate-500/15" },
            ].map(({ icon: Icon, label, accent, glow }) => (
              <span
                key={label}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg border border-white/80 bg-white/60 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 backdrop-blur-sm",
                  "shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(3,46,161,0.08)]",
                  glow
                )}
              >
                <span className={cn("flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br text-white shadow-sm", accent)}>
                  <Icon className="h-3.5 w-3.5" />
                </span>
                {label}
              </span>
            ))}
        </div>

        <div className="relative mt-5">
          <h1 className="bg-gradient-to-r from-slate-900 via-[#032EA1] to-slate-800 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl">
            Planting and Harvesting Calendar
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
            Cambodia-focused cooperative planning with seasonal intelligence, smart alerts, multi-year planning, and farmer-level crop timelines.
          </p>
        </div>

        <div className="relative mt-6 rounded-2xl border border-[#0d48ce] bg-gradient-to-r from-[#032EA1] via-[#033ab8] to-[#022c8e] p-2 shadow-[0_8px_30px_-12px_rgba(2,44,142,0.8)]">
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-6">
            {[
              { title: "Wet season", value: String(productivity.wet), sub: "May-Oct", trend: "Rain", icon: CloudRain },
              { title: "Dry season", value: String(productivity.dry), sub: "Nov-Apr", trend: "Irrigated", icon: SunMedium },
              { title: "Total cycles", value: String(productivity.total), sub: "Current view", trend: "All", icon: Sprout },
              { title: "Planned", value: String(statusCounts.planned), sub: "Upcoming", trend: "Ready", icon: Leaf },
              { title: "Ongoing", value: String(statusCounts.ongoing), sub: "In field", trend: "Live", icon: Tractor },
              { title: "Overlap risk", value: String(overlapCount), sub: "Plot conflicts", trend: "Check", icon: AlertTriangle },
            ].map((tile) => (
              <div
                key={tile.title}
                className="relative overflow-hidden rounded-xl border border-white/12 bg-[#03339f]/70 px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-sm"
              >
                <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-white/95 text-[#0F2F8F]">
                  <tile.icon className="h-3 w-3" />
                </div>
                <p className="pr-6 text-[10px] font-medium text-blue-100/95">{tile.title}</p>
                <p className="mt-1 text-3xl font-bold leading-none tracking-tight text-white tabular-nums">{tile.value}</p>
                <div className="mt-1 flex items-center gap-1">
                  <span className="rounded-full bg-emerald-300/20 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-100">{tile.trend}</span>
                  <span className="text-[10px] text-blue-100/90">{tile.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mt-5 rounded-xl border border-slate-200/80 bg-white/50 p-3 backdrop-blur-sm sm:p-4">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">Filters</p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <select value={cropFilter} onChange={(e) => setCropFilter(e.target.value)} className="rounded-lg border border-slate-200 bg-white/90 px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none ring-[#032EA1]/0 transition focus:border-[#032EA1]/40 focus:ring-2 focus:ring-[#032EA1]/15">{cropOptions.map((o) => <option key={o}>{o}</option>)}</select>
            <select value={farmerFilter} onChange={(e) => setFarmerFilter(e.target.value)} className="rounded-lg border border-slate-200 bg-white/90 px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none focus:border-[#032EA1]/40 focus:ring-2 focus:ring-[#032EA1]/15">{farmerOptions.map((o) => <option key={o}>{o}</option>)}</select>
            <select value={provinceFilter} onChange={(e) => setProvinceFilter(e.target.value)} className="rounded-lg border border-slate-200 bg-white/90 px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none focus:border-[#032EA1]/40 focus:ring-2 focus:ring-[#032EA1]/15">{provinceOptions.map((o) => <option key={o}>{o}</option>)}</select>
            <select value={seasonFilter} onChange={(e) => setSeasonFilter(e.target.value)} className="rounded-lg border border-slate-200 bg-white/90 px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none focus:border-[#032EA1]/40 focus:ring-2 focus:ring-[#032EA1]/15"><option>All seasons</option><option>Wet</option><option>Dry</option></select>
          </div>
        </div>

        <div className="relative mt-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <div className="inline-flex rounded-xl border border-slate-200/90 bg-slate-100/80 p-1 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]">
              {(["Monthly", "Seasonal", "Yearly"] as CalendarView[]).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setView(v)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
                    view === v
                      ? "bg-white text-[#032EA1] shadow-[0_1px_3px_rgba(0,0,0,0.08),0_0_0_1px_rgba(3,46,161,0.08)]"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
            <div className="inline-flex rounded-xl border border-slate-200/90 bg-slate-100/80 p-1 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]">
              {(["Full cycle", "Planting only", "Harvesting only"] as TimelineFilter[]).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setTimelineFilter(v)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
                    timelineFilter === v
                      ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-[0_2px_8px_-2px_rgba(16,185,129,0.45)]"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <div className="flex items-center gap-1 rounded-xl border border-slate-200/90 bg-white/80 px-1 py-1 shadow-sm backdrop-blur-sm">
              <button type="button" onClick={() => setYear((y) => Math.max(new Date().getFullYear() - 2, y - 1))} className="rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100">−</button>
              <span className="min-w-[3.25rem] text-center text-sm font-bold tabular-nums text-slate-900">{year}</span>
              <button type="button" onClick={() => setYear((y) => Math.min(new Date().getFullYear() + 5, y + 1))} className="rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100">+</button>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsCreateOpen(true);
                setCreateErrors({});
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-[#032EA1] px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0447D4]"
            >
              <Plus className="h-4 w-4" />
              Create Crop Cycle
            </button>
          </div>
        </div>
      </section>

      <Sheet
        open={isCreateOpen}
        onOpenChange={(open) => {
          setIsCreateOpen(open);
          if (open) setCreateErrors({});
        }}
      >
        <SheetContent
          side="right"
          className={cn(
            "flex h-full w-full max-w-3xl flex-col gap-0 border-l border-gray-200 bg-gray-50 p-0 sm:max-w-3xl",
            "[&>button]:hidden"
          )}
        >
          <SheetHeader className="flex shrink-0 flex-row items-center justify-between gap-3 space-y-0 border-b border-white/10 bg-gradient-to-br from-[#032EA1] to-[#021c5e] px-5 py-3">
            <SheetTitle className="text-sm font-semibold text-white">Create Crop Cycle</SheetTitle>
            <SheetClose className="rounded-lg p-1.5 text-white/90 transition-colors hover:bg-white/15 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-[#032EA1]">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </SheetClose>
          </SheetHeader>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
            <div className="space-y-3">
              <div>
                <h3 className="mb-2 text-sm font-semibold text-gray-800">Crop details</h3>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div>
                    <label htmlFor="create-cycle-crop" className={assetFormLabelClass}>
                      Crop <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="create-cycle-crop"
                      value={createForm.crop}
                      onChange={(e) => setCreateForm((f) => ({ ...f, crop: e.target.value as CropType }))}
                      className={assetFormFieldClass}
                    >
                      <option>Rice</option>
                      <option>Cassava</option>
                      <option>Maize</option>
                      <option>Vegetables</option>
                      <option>Rubber</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="create-cycle-season" className={assetFormLabelClass}>
                      Season <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="create-cycle-season"
                      value={createForm.season}
                      onChange={(e) => setCreateForm((f) => ({ ...f, season: e.target.value as Season }))}
                      className={assetFormFieldClass}
                    >
                      <option>Wet</option>
                      <option>Dry</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="create-cycle-variety" className={assetFormLabelClass}>
                      Crop variety <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="create-cycle-variety"
                      value={createForm.variety}
                      onChange={(e) => setCreateForm((f) => ({ ...f, variety: e.target.value }))}
                      placeholder="e.g. Phka Rumduol"
                      className={assetFormFieldClass}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold text-gray-800">Planting &amp; harvest dates</h3>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div>
                    <label htmlFor="create-cycle-plant-start" className={assetFormLabelClass}>
                      Planting start <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="create-cycle-plant-start"
                      type="date"
                      value={createForm.plantingStart}
                      onChange={(e) => setCreateForm((f) => ({ ...f, plantingStart: e.target.value }))}
                      className={assetFormFieldClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="create-cycle-plant-end" className={assetFormLabelClass}>
                      Planting end <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="create-cycle-plant-end"
                      type="date"
                      value={createForm.plantingEnd}
                      onChange={(e) => setCreateForm((f) => ({ ...f, plantingEnd: e.target.value }))}
                      className={assetFormFieldClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="create-cycle-harvest-start" className={assetFormLabelClass}>
                      Harvest start <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="create-cycle-harvest-start"
                      type="date"
                      value={createForm.harvestStart}
                      onChange={(e) => setCreateForm((f) => ({ ...f, harvestStart: e.target.value }))}
                      className={assetFormFieldClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="create-cycle-harvest-end" className={assetFormLabelClass}>
                      Harvest end <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="create-cycle-harvest-end"
                      type="date"
                      value={createForm.harvestEnd}
                      onChange={(e) => setCreateForm((f) => ({ ...f, harvestEnd: e.target.value }))}
                      className={assetFormFieldClass}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold text-gray-800">Farmer &amp; land</h3>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div>
                    <label htmlFor="create-cycle-farmer" className={assetFormLabelClass}>
                      Farmer / member <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="create-cycle-farmer"
                      value={createForm.farmer}
                      onChange={(e) => setCreateForm((f) => ({ ...f, farmer: e.target.value }))}
                      placeholder="Enter name"
                      className={assetFormFieldClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="create-cycle-province" className={assetFormLabelClass}>
                      Province / region <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="create-cycle-province"
                      value={createForm.province}
                      onChange={(e) => setCreateForm((f) => ({ ...f, province: e.target.value }))}
                      placeholder="Province"
                      className={assetFormFieldClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="create-cycle-plot" className={assetFormLabelClass}>
                      Land / plot ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="create-cycle-plot"
                      value={createForm.landPlotId}
                      onChange={(e) => setCreateForm((f) => ({ ...f, landPlotId: e.target.value }))}
                      placeholder="Plot ID"
                      className={assetFormFieldClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="create-cycle-water" className={assetFormLabelClass}>
                      Water source
                    </label>
                    <select
                      id="create-cycle-water"
                      value={createForm.waterSource}
                      onChange={(e) => setCreateForm((f) => ({ ...f, waterSource: e.target.value as WaterSource }))}
                      className={assetFormFieldClass}
                    >
                      <option>Rain-fed</option>
                      <option>Irrigated</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="create-cycle-yield" className={assetFormLabelClass}>
                      Expected yield <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="create-cycle-yield"
                      value={createForm.expectedYield}
                      onChange={(e) => setCreateForm((f) => ({ ...f, expectedYield: e.target.value }))}
                      placeholder="e.g. 5.0 t/ha"
                      className={assetFormFieldClass}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <span className={assetFormLabelClass}>Recurring years</span>
                    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2">
                      <input
                        type="number"
                        min={0}
                        max={5}
                        value={createForm.repeatYears}
                        onChange={(e) => setCreateForm((f) => ({ ...f, repeatYears: Math.max(0, Math.min(5, Number(e.target.value) || 0)) }))}
                        className="w-20 rounded-md border border-gray-200 px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-[#032EA1]/30"
                      />
                      <span className="text-xs text-gray-500">0 = this year only</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                <p className="text-xs text-blue-900 sm:text-sm">
                  <strong>Note:</strong> Align planting dates with the wet season (May–Oct) or dry season (Nov–Apr) window for your area to reduce seasonal mismatch alerts.
                </p>
              </div>

              <div>
                <label htmlFor="create-cycle-notes" className={assetFormLabelClass}>
                  Notes (optional)
                </label>
                <textarea
                  id="create-cycle-notes"
                  value={createForm.notes}
                  onChange={(e) => setCreateForm((f) => ({ ...f, notes: e.target.value }))}
                  placeholder="Any extra context for this cycle"
                  rows={3}
                  className={cn(assetFormFieldClass, "resize-none")}
                />
              </div>

              {Object.keys(createErrors).length > 0 && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700 sm:text-sm">
                  {Object.values(createErrors).map((err) => (
                    <p key={err}>- {err}</p>
                  ))}
                </div>
              )}
            </div>
          </div>

          <SheetFooter className="mt-0 shrink-0 flex-row items-center justify-end gap-2 border-t border-gray-200 bg-white px-5 py-3">
            <SheetClose asChild>
              <button
                type="button"
                className="rounded-lg border border-gray-300 px-4 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-100"
              >
                Cancel
              </button>
            </SheetClose>
            <button
              type="button"
              onClick={handleCreateCycle}
              className="rounded-lg bg-[#032EA1] px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#0447D4]"
            >
              Save crop cycle
            </button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {alerts.length > 0 && (
        <section className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-rose-800"><AlertTriangle className="h-4 w-4" /> Smart alerts</p>
            <button
              type="button"
              onClick={() => setIsAlertsOpen((v) => !v)}
              className="inline-flex items-center gap-1 rounded-md border border-rose-200 bg-white/70 px-2 py-1 text-xs font-semibold text-rose-700 hover:bg-white"
            >
              {isAlertsOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              {isAlertsOpen ? "Hide" : "Show"}
            </button>
          </div>
          {isAlertsOpen && (
            <ul className="mt-2 space-y-1 text-sm text-rose-700">
              {alerts.map((a) => <li key={a}>- {a}</li>)}
            </ul>
          )}
        </section>
      )}

      <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-800">
            <Sprout className="h-4 w-4" /> Seasonal recommendations
          </p>
          <button
            type="button"
            onClick={() => setIsRecommendationsOpen((v) => !v)}
            className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-white/70 px-2 py-1 text-xs font-semibold text-emerald-700 hover:bg-white"
          >
            {isRecommendationsOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            {isRecommendationsOpen ? "Hide" : "Show"}
          </button>
        </div>
        {isRecommendationsOpen && (
          <ul className="mt-2 space-y-1 text-sm text-emerald-800">
            {recommendations.map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{view} timeline</h2>
            <p className="mt-0.5 text-xs text-slate-500">{filtered.length} cycles in current filters</p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 font-medium text-emerald-700"><Sprout className="h-3.5 w-3.5" /> Planting</span>
            <span className="inline-flex items-center gap-1 rounded-md bg-sky-50 px-2 py-1 font-medium text-sky-700"><Leaf className="h-3.5 w-3.5" /> Growing</span>
            <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 font-medium text-amber-700"><Wheat className="h-3.5 w-3.5" /> Harvesting</span>
          </div>
        </div>

        <div className="space-y-3">
          {filtered.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedId(c.id)}
              className={cn(
                "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-left shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-all",
                "hover:border-[#032EA1]/35 hover:shadow-[0_6px_18px_-10px_rgba(3,46,161,0.4)]",
                selected?.id === c.id ? "border-[#032EA1]/45 ring-2 ring-[#032EA1]/15" : ""
              )}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${CROP_COLORS[c.crop]}`}>{c.crop}</span>
                <span className="text-xs text-slate-500">{c.variety}</span>
                <span className={cn("ml-auto rounded-full border px-2 py-0.5 text-xs font-semibold", STATUS_COLORS[c.status])}>{c.status}</span>
              </div>

              <p className="mt-2 text-sm font-semibold text-slate-900">{c.landPlotId} - {c.farmer} ({c.province})</p>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                <span>{c.season} season</span>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span>{c.waterSource}</span>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span>Yield: {c.expectedYield}</span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {timelineFilter !== "Harvesting only" && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-emerald-700">
                    <Sprout className="h-3.5 w-3.5" /> {dateText(c.plantingStart)} to {dateText(c.plantingEnd)}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 rounded-md bg-sky-50 px-2 py-1 text-sky-700">
                  <Leaf className="h-3.5 w-3.5" /> {c.durationDays} days
                </span>
                {timelineFilter !== "Planting only" && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-amber-700">
                    <Wheat className="h-3.5 w-3.5" /> {dateText(c.harvestStart)} to {dateText(c.harvestEnd)}
                  </span>
                )}
              </div>
            </button>
          ))}
          {filtered.length === 0 && <p className="rounded-lg border border-dashed border-slate-300 px-3 py-5 text-center text-sm text-slate-500">No cycles match current filters.</p>}
        </div>
      </section>
    </div>
  );
}
