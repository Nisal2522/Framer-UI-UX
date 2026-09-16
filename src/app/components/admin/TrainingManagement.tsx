import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  GraduationCap,
  Plus,
  Search,
  Filter,
  Calendar,
  MapPin,
  Clock,
  User,
  Trash2,
  Edit2,
  Eye,
  X,
  CheckCircle2,
  XCircle,
  Tag,
} from "lucide-react";
import { MultiSelectCombobox } from "../ui/multi-select";
import { AVAILABLE_TAGS, AUDIENCE_OPTIONS } from "../KnowledgeUploadForm";

type TrainingStatus = "Upcoming" | "Ongoing" | "Completed";

type Attendance = "Registered" | "Attended" | "No-show";

type Participant = {
  id: string;
  name: string;
  acName: string;
  province: string;
  phone: string;
  registeredAt: string;
  attendance: Attendance;
};

type Training = {
  id: string;
  title: string;
  tags: string[];
  targetAudience: string[];
  description: string;
  trainerName: string;
  trainerOrg: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location: string;
  province: string;
  capacity: number;
  status: TrainingStatus;
  participants: Participant[];
};

const PROVINCE_OPTIONS = [
  "Phnom Penh",
  "Battambang",
  "Siem Reap",
  "Kampong Thom",
  "Kampong Cham",
  "Takeo",
  "Kampot",
  "Prey Veng",
  "Banteay Meanchey",
  "Pursat",
];

const STATUS_OPTIONS: TrainingStatus[] = ["Upcoming", "Ongoing", "Completed"];

const FARMER_NAME_POOL = [
  "Sok Pisey", "Chea Sokha", "Lim Dara", "Pich Sophea", "Keo Sothea", "Mao Vibol",
  "Yon Chanthy", "Heng Ratha", "Nget Bopha", "Ros Channak", "Sao Kimhak", "Chan Pisey",
  "Noun Sreyleak", "Kong Vanna", "Tep Sophon", "Ouk Samnang",
];

const AC_NAME_POOL = [
  "Prasat Sambor Rung Roeang MAC", "Boeung Trabek AC", "Kampong Svay AC", "Stueng Sen AC",
  "Tonle Bet AC", "Angkor Chum AC", "Sre Ambel AC", "Kandal Stueng AC",
];

function makeParticipants(
  trainingId: string,
  count: number,
  province: string,
  registeredMonth: string
): Participant[] {
  const attendanceCycle: Attendance[] = ["Attended", "Attended", "Registered", "No-show"];
  return Array.from({ length: count }, (_, i) => ({
    id: `${trainingId}-P${i + 1}`,
    name: FARMER_NAME_POOL[i % FARMER_NAME_POOL.length],
    acName: AC_NAME_POOL[i % AC_NAME_POOL.length],
    province,
    phone: `+855 12 ${String(300 + i * 13).slice(0, 3)} ${String(400 + i * 17).slice(0, 3)}`,
    registeredAt: `${registeredMonth}-${String(3 + i).padStart(2, "0")}`,
    attendance: attendanceCycle[i % attendanceCycle.length],
  }));
}

const SEED_TRAININGS: Training[] = [
  {
    id: "TR-001",
    title: "GAP Refresher on Record Keeping",
    tags: ["Best Practices", "Certification"],
    targetAudience: ["AC Committee Members", "Field Extension Officers"],
    description: "Refresher session on Good Agricultural Practices record-keeping requirements for AC committee members.",
    trainerName: "Sok Vanna",
    trainerOrg: "GDA",
    startDate: "2026-10-09",
    endDate: "2026-10-09",
    startTime: "08:30",
    endTime: "12:00",
    location: "AC Meeting Hall",
    province: "Kampong Thom",
    capacity: 40,
    status: "Upcoming",
    participants: makeParticipants("TR-001", 28, "Kampong Thom", "2026-09"),
  },
  {
    id: "TR-002",
    title: "District Extension for Pest Scouting",
    tags: ["Pest Management", "Rice"],
    targetAudience: ["Smallholder Farmers", "Field Extension Officers"],
    description: "Field-based extension visit covering integrated pest scouting techniques for rice clusters.",
    trainerName: "Ly Sopheak",
    trainerOrg: "FAO",
    startDate: "2026-09-20",
    endDate: "2026-09-20",
    startTime: "09:00",
    endTime: "13:00",
    location: "Maize Demonstration Plot",
    province: "Battambang",
    capacity: 35,
    status: "Ongoing",
    participants: makeParticipants("TR-002", 31, "Battambang", "2026-09"),
  },
  {
    id: "TR-003",
    title: "Financial Literacy for Savings Circles",
    tags: ["Financial Literacy", "Microfinance"],
    targetAudience: ["Women Farmers", "Smallholder Farmers"],
    description: "Introductory workshop on savings circle models and household budgeting for member farmers.",
    trainerName: "Chan Dalis",
    trainerOrg: "MAFF",
    startDate: "2026-08-14",
    endDate: "2026-08-14",
    startTime: "14:00",
    endTime: "16:30",
    location: "Commune Office (Annex)",
    province: "Kampot",
    capacity: 50,
    status: "Completed",
    participants: makeParticipants("TR-003", 47, "Kampot", "2026-08"),
  },
  {
    id: "TR-004",
    title: "Post-Harvest Handling Demo",
    tags: ["Post-Harvest Handling", "Storage"],
    targetAudience: ["All Farmer Members", "Cooperative Managers"],
    description: "Hands-on demonstration of moisture testing and hermetic storage bags for post-harvest loss reduction.",
    trainerName: "Prak Ratha",
    trainerOrg: "DACP",
    startDate: "2026-07-28",
    endDate: "2026-07-28",
    startTime: "07:00",
    endTime: "11:00",
    location: "Central Warehouse Apron",
    province: "Battambang",
    capacity: 45,
    status: "Completed",
    participants: makeParticipants("TR-004", 45, "Battambang", "2026-07"),
  },
  {
    id: "TR-005",
    title: "Board & Committee Orientation",
    tags: ["Cooperative Governance", "Best Practices"],
    targetAudience: ["AC Committee Members", "MAC Committee Members"],
    description: "Governance orientation covering updated bylaws and committee responsibilities for new AC boards.",
    trainerName: "Sok Vanna",
    trainerOrg: "GDA",
    startDate: "2026-11-05",
    endDate: "2026-11-05",
    startTime: "13:00",
    endTime: "17:00",
    location: "AC Meeting Hall",
    province: "Siem Reap",
    capacity: 30,
    status: "Upcoming",
    participants: makeParticipants("TR-005", 12, "Siem Reap", "2026-10"),
  },
  {
    id: "TR-006",
    title: "Safe Pesticide Use in Field School",
    tags: ["Pest Management", "Food Safety"],
    targetAudience: ["Smallholder Farmers", "Youth Farmers"],
    description: "Practical field school on personal protective equipment and safe pesticide handling procedures.",
    trainerName: "Prak Ratha",
    trainerOrg: "DACP",
    startDate: "2026-09-15",
    endDate: "2026-09-15",
    startTime: "06:30",
    endTime: "10:00",
    location: "Vegetable Cluster (East)",
    province: "Takeo",
    capacity: 40,
    status: "Ongoing",
    participants: makeParticipants("TR-006", 33, "Takeo", "2026-09"),
  },
  {
    id: "TR-007",
    title: "Certification Readiness Review",
    tags: ["Certification", "GLOBAL G.A.P."],
    targetAudience: ["AC Committee Members", "Certification Bodies"],
    description: "Pre-audit review session preparing AC committees for GLOBAL G.A.P. certification renewal.",
    trainerName: "Meas Ratanak",
    trainerOrg: "GDA",
    startDate: "2026-11-20",
    endDate: "2026-11-20",
    startTime: "10:00",
    endTime: "15:00",
    location: "AC Office",
    province: "Kampong Cham",
    capacity: 25,
    status: "Upcoming",
    participants: makeParticipants("TR-007", 6, "Kampong Cham", "2026-10"),
  },
  {
    id: "TR-008",
    title: "Youth Agri-Entrepreneur Workshop",
    tags: ["Youth Engagement", "Financial Literacy"],
    targetAudience: ["Youth Farmers", "Youth Development Programs"],
    description: "Pitch-style workshop introducing market linkage strategies for youth-led agribusiness ideas.",
    trainerName: "Chan Dalis",
    trainerOrg: "MAFF",
    startDate: "2026-06-02",
    endDate: "2026-06-02",
    startTime: "09:00",
    endTime: "12:00",
    location: "Online + Hall Hybrid",
    province: "Prey Veng",
    capacity: 40,
    status: "Completed",
    participants: makeParticipants("TR-008", 38, "Prey Veng", "2026-05"),
  },
];

type TrainingFormState = {
  title: string;
  tags: string[];
  targetAudience: string[];
  description: string;
  trainerName: string;
  trainerOrg: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location: string;
  province: string;
  capacity: string;
  status: TrainingStatus;
};

const EMPTY_FORM: TrainingFormState = {
  title: "",
  tags: [],
  targetAudience: [],
  description: "",
  trainerName: "",
  trainerOrg: "",
  startDate: "",
  endDate: "",
  startTime: "",
  endTime: "",
  location: "",
  province: PROVINCE_OPTIONS[0],
  capacity: "",
  status: "Upcoming",
};

function statusBadgeClasses(status: TrainingStatus): string {
  switch (status) {
    case "Upcoming":
      return "bg-blue-50 text-blue-800 border-blue-200";
    case "Ongoing":
      return "bg-teal-50 text-teal-800 border-teal-200";
    case "Completed":
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
}

function attendanceBadgeClasses(attendance: Attendance): string {
  switch (attendance) {
    case "Attended":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "No-show":
      return "bg-red-50 text-red-600 border-red-200";
    case "Registered":
      return "bg-amber-50 text-amber-700 border-amber-200";
  }
}

export function TrainingManagement() {
  const [trainings, setTrainings] = useState<Training[]>(SEED_TRAININGS);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<TrainingStatus | "all">("all");
  const [tagFilter, setTagFilter] = useState<string[]>([]);

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formState, setFormState] = useState<TrainingFormState>(EMPTY_FORM);

  const [participantsDrawerId, setParticipantsDrawerId] = useState<string | null>(null);

  const activeFilterCount = (statusFilter !== "all" ? 1 : 0) + tagFilter.length;

  const filteredTrainings = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    const statusPriority: Record<TrainingStatus, number> = {
      Upcoming: 0,
      Ongoing: 1,
      Completed: 2,
    };
    return trainings
      .filter((t) => {
        const matchesSearch =
          !q ||
          t.title.toLowerCase().includes(q) ||
          t.trainerName.toLowerCase().includes(q) ||
          t.location.toLowerCase().includes(q) ||
          t.province.toLowerCase().includes(q);
        const matchesStatus = statusFilter === "all" || t.status === statusFilter;
        const matchesTags =
          tagFilter.length === 0 || t.tags.some((c) => tagFilter.includes(c));
        return matchesSearch && matchesStatus && matchesTags;
      })
      .sort((a, b) => statusPriority[a.status] - statusPriority[b.status]);
  }, [trainings, searchTerm, statusFilter, tagFilter]);

  const closeForm = () => {
    setFormOpen(false);
    setEditingId(null);
    setFormState(EMPTY_FORM);
  };

  const openNewForm = () => {
    setFormState(EMPTY_FORM);
    setEditingId(null);
    setFormOpen(true);
  };

  const openEditForm = (t: Training) => {
    setFormState({
      title: t.title,
      tags: t.tags,
      targetAudience: t.targetAudience,
      description: t.description,
      trainerName: t.trainerName,
      trainerOrg: t.trainerOrg,
      startDate: t.startDate,
      endDate: t.endDate,
      startTime: t.startTime,
      endTime: t.endTime,
      location: t.location,
      province: t.province,
      capacity: String(t.capacity),
      status: t.status,
    });
    setEditingId(t.id);
    setFormOpen(true);
  };

  const handleSubmitTraining = () => {
    if (!formState.title.trim() || !formState.trainerName.trim() || !formState.startDate || !formState.location.trim()) {
      return;
    }
    const capacityNum = Math.max(0, Number(formState.capacity) || 0);

    if (editingId) {
      setTrainings((prev) =>
        prev.map((t) => (t.id === editingId ? { ...t, ...formState, capacity: capacityNum } : t))
      );
      toast.success("Training updated.");
    } else {
      const newTraining: Training = {
        id: `TR-${Date.now()}`,
        ...formState,
        capacity: capacityNum,
        participants: [],
      };
      setTrainings((prev) => [newTraining, ...prev]);
      toast.success("Training created.");
    }
    closeForm();
  };

  const deleteTraining = (t: Training) => {
    const confirmed = window.confirm(
      `Delete "${t.title}"? This will also remove its ${t.participants.length} registered participant(s). This cannot be undone.`
    );
    if (!confirmed) return;
    setTrainings((prev) => prev.filter((tr) => tr.id !== t.id));
    if (participantsDrawerId === t.id) setParticipantsDrawerId(null);
    toast.success(`"${t.title}" was deleted.`);
  };

  const updateAttendance = (trainingId: string, participantId: string, attendance: Attendance) => {
    setTrainings((prev) =>
      prev.map((t) =>
        t.id === trainingId
          ? {
              ...t,
              participants: t.participants.map((p) =>
                p.id === participantId ? { ...p, attendance } : p
              ),
            }
          : t
      )
    );
  };

  const participantsTraining = trainings.find((t) => t.id === participantsDrawerId) ?? null;

  return (
    <div className="space-y-6 min-w-0 max-w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <GraduationCap className="h-7 w-7 text-[#032EA1]" />
            Training Management
          </h1>
          <p className="text-gray-600 mt-1">
            Create, manage, and monitor training programs across all cooperatives
          </p>
        </div>
        <button
          type="button"
          onClick={openNewForm}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#032EA1] text-white rounded-lg hover:bg-[#0447D4] transition-colors shadow-md shrink-0"
        >
          <Plus className="w-5 h-5" />
          Add New Training
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search trainings by title, trainer, location, or province..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
            />
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowFilters((v) => !v)}
              className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors ${
                showFilters || activeFilterCount > 0
                  ? "border-[#032EA1] text-[#032EA1] bg-[#032EA1]/5"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Filter className="w-4 h-4" />
              Filter
              {activeFilterCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[#032EA1] text-white text-[10px] font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Refine Results</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as TrainingStatus | "all")}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white"
                >
                  <option value="all">All</option>
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Tags</label>
                <MultiSelectCombobox
                  options={AVAILABLE_TAGS}
                  selected={tagFilter}
                  onChange={setTagFilter}
                  placeholder="Any tag"
                  searchPlaceholder="Search tags..."
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Trainings Table */}
      <div className="w-full min-w-0 rounded-2xl border border-gray-200/80 bg-white shadow-[0_4px_24px_-4px_rgba(3,46,161,0.08),0_2px_8px_-2px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="w-full min-w-0 overflow-hidden">
          <table className="w-full table-fixed border-collapse text-left">
            <colgroup>
              <col className="w-[26%]" />
              <col className="w-[13%]" />
              <col className="w-[14%]" />
              <col className="w-[14%]" />
              <col className="w-[13%]" />
              <col className="w-[9%]" />
              <col className="w-[11%]" />
            </colgroup>
            <thead>
              <tr className="bg-gradient-to-r from-[#032EA1]/[0.07] via-[#032EA1]/[0.04] to-transparent border-b border-[#032EA1]/15">
                <th className="px-2 sm:px-3 py-2.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#032EA1]">
                  Training
                </th>
                <th className="px-2 sm:px-3 py-2.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#032EA1]">
                  Tags
                </th>
                <th className="px-2 sm:px-3 py-2.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#032EA1]">
                  Trainer
                </th>
                <th className="px-2 sm:px-3 py-2.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#032EA1]">
                  Schedule
                </th>
                <th className="px-2 sm:px-3 py-2.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#032EA1]">
                  Registrations
                </th>
                <th className="px-2 sm:px-3 py-2.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#032EA1]">
                  Status
                </th>
                <th className="px-2 sm:px-3 py-2.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#032EA1]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTrainings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-gray-400">
                    No trainings match your search or filters.
                  </td>
                </tr>
              ) : (
                filteredTrainings.map((t, rowIdx) => {
                  const fillPct = t.capacity > 0 ? Math.min(100, Math.round((t.participants.length / t.capacity) * 100)) : 0;
                  return (
                    <tr
                      key={t.id}
                      className={`group transition-colors ${
                        rowIdx % 2 === 0 ? "bg-white" : "bg-slate-50/60"
                      } hover:bg-[#032EA1]/[0.04]`}
                    >
                      <td className="px-2 sm:px-3 py-2.5 align-middle max-w-0">
                        <div className="min-w-0 flex flex-col gap-1">
                          <span
                            className="text-xs sm:text-sm font-semibold text-gray-900 leading-snug line-clamp-2"
                            title={t.title}
                          >
                            {t.title}
                          </span>
                          <span className="flex items-center gap-1 text-[11px] text-gray-500">
                            <MapPin className="w-3 h-3 shrink-0 text-red-500" />
                            <span className="truncate">{t.location}, {t.province}</span>
                          </span>
                        </div>
                      </td>
                      <td className="px-2 sm:px-3 py-2.5 align-middle max-w-0">
                        <div className="flex flex-wrap gap-1">
                          {t.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[11px] font-medium bg-gray-100 text-gray-700 border border-gray-200/90"
                            >
                              <Tag className="w-3 h-3 opacity-70 shrink-0" aria-hidden />
                              {tag}
                            </span>
                          ))}
                          {t.tags.length > 2 && (
                            <span
                              className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[11px] font-medium bg-gray-50 text-gray-500 border border-gray-200/90"
                              title={t.tags.slice(2).join(", ")}
                            >
                              +{t.tags.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-2 sm:px-3 py-2.5 align-top max-w-0">
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-900">
                          <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="truncate">{t.trainerName}</span>
                        </span>
                        <span className="block text-[11px] text-gray-500 mt-0.5 ml-5 truncate">{t.trainerOrg}</span>
                      </td>
                      <td className="px-2 sm:px-3 py-2.5 align-middle max-w-0">
                        <span className="flex items-center gap-1.5 text-xs text-gray-700">
                          <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          {t.startDate}
                        </span>
                        <span className="flex items-center gap-1.5 text-[11px] text-gray-500 mt-1">
                          <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          {t.startTime} – {t.endTime}
                        </span>
                      </td>
                      <td className="px-2 sm:px-3 py-2.5 align-middle max-w-0">
                        <div className="h-1 w-3/5 rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#032EA1]"
                            style={{ width: `${fillPct}%` }}
                          />
                        </div>
                        <div className="flex items-center text-xs gap-1 mt-1">
                          <span className="font-semibold text-gray-900 tabular-nums">{t.participants.length}</span>
                          <span className="text-gray-400 tabular-nums">/ {t.capacity}</span>
                        </div>
                      </td>
                      <td className="px-2 sm:px-3 py-2.5 align-middle max-w-0">
                        <span className={`inline-flex max-w-full items-center px-2 py-0.5 text-[10px] sm:text-xs font-semibold rounded-full border ${statusBadgeClasses(t.status)}`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="px-2 sm:px-3 py-2.5 align-middle max-w-0">
                        <div className="flex items-center gap-0.5">
                          <button
                            type="button"
                            onClick={() => setParticipantsDrawerId(t.id)}
                            className="p-1.5 rounded-lg text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                            aria-label="View participants"
                            title="View / manage participants"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditForm(t)}
                            className="p-1.5 rounded-lg text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                            aria-label="Edit training"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteTraining(t)}
                            className="p-1.5 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                            aria-label="Delete training"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Training drawer */}
      {formOpen && (
        <>
          <div
            className="fixed inset-0 z-[100] bg-black/40 transition-opacity duration-200"
            aria-hidden
            onClick={closeForm}
          />
          <div
            className="fixed inset-y-0 right-0 z-[110] flex w-full max-w-2xl flex-col border-l border-gray-200 bg-gray-50 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="training-form-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-gradient-to-br from-[#032EA1] to-[#021c5e] shrink-0">
              <h2 id="training-form-title" className="text-sm font-semibold text-white">
                {editingId ? "Edit Training" : "Add New Training"}
              </h2>
              <button
                type="button"
                onClick={closeForm}
                className="p-1.5 rounded-lg hover:bg-white/15 text-white/90 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4 space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Training Details</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formState.title}
                      onChange={(e) => setFormState((f) => ({ ...f, title: e.target.value }))}
                      placeholder="e.g., GAP Refresher — Record Keeping"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Tags</label>
                    <MultiSelectCombobox
                      options={AVAILABLE_TAGS}
                      selected={formState.tags}
                      onChange={(next) => setFormState((f) => ({ ...f, tags: next }))}
                      placeholder="Select tags..."
                      searchPlaceholder="Search tags..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Target Audience</label>
                    <MultiSelectCombobox
                      options={AUDIENCE_OPTIONS}
                      selected={formState.targetAudience}
                      onChange={(next) => setFormState((f) => ({ ...f, targetAudience: next }))}
                      placeholder="Select target audience..."
                      searchPlaceholder="Search audience..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                    <select
                      value={formState.status}
                      onChange={(e) => setFormState((f) => ({ ...f, status: e.target.value as TrainingStatus }))}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={formState.description}
                      onChange={(e) => setFormState((f) => ({ ...f, description: e.target.value }))}
                      placeholder="Briefly describe the training content and objectives"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none resize-none bg-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Trainer Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Trainer Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formState.trainerName}
                      onChange={(e) => setFormState((f) => ({ ...f, trainerName: e.target.value }))}
                      placeholder="e.g., Sok Vanna"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Organization</label>
                    <input
                      type="text"
                      value={formState.trainerOrg}
                      onChange={(e) => setFormState((f) => ({ ...f, trainerOrg: e.target.value }))}
                      placeholder="e.g., GDA, FAO, MAFF"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Schedule & Location</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formState.startDate}
                      onChange={(e) => setFormState((f) => ({ ...f, startDate: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">End Date</label>
                    <input
                      type="date"
                      value={formState.endDate}
                      onChange={(e) => setFormState((f) => ({ ...f, endDate: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Start Time</label>
                    <input
                      type="time"
                      value={formState.startTime}
                      onChange={(e) => setFormState((f) => ({ ...f, startTime: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">End Time</label>
                    <input
                      type="time"
                      value={formState.endTime}
                      onChange={(e) => setFormState((f) => ({ ...f, endTime: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formState.location}
                      onChange={(e) => setFormState((f) => ({ ...f, location: e.target.value }))}
                      placeholder="e.g., AC Meeting Hall"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Participant Capacity</label>
                    <input
                      type="number"
                      min={0}
                      value={formState.capacity}
                      onChange={(e) => setFormState((f) => ({ ...f, capacity: e.target.value }))}
                      placeholder="e.g., 40"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-gray-200 bg-white flex justify-end gap-2 shrink-0">
              <button
                type="button"
                onClick={closeForm}
                className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitTraining}
                disabled={!formState.title.trim() || !formState.trainerName.trim() || !formState.startDate || !formState.location.trim()}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm bg-[#032EA1] text-white rounded-lg hover:bg-[#0447D4] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingId ? "Save Changes" : "Add Training"}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Participants drawer */}
      {participantsTraining && (
        <>
          <div
            className="fixed inset-0 z-[100] bg-black/40 transition-opacity duration-200"
            aria-hidden
            onClick={() => setParticipantsDrawerId(null)}
          />
          <div
            className="fixed inset-y-0 right-0 z-[110] flex w-full max-w-2xl flex-col border-l border-gray-200 bg-gray-50 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="participants-drawer-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-gradient-to-br from-[#032EA1] to-[#021c5e] shrink-0">
              <div className="min-w-0">
                <h2 id="participants-drawer-title" className="text-sm font-semibold text-white truncate">
                  {participantsTraining.title}
                </h2>
                <p className="text-xs text-white/70 mt-0.5">
                  {participantsTraining.participants.length} of {participantsTraining.capacity} registered
                </p>
              </div>
              <button
                type="button"
                onClick={() => setParticipantsDrawerId(null)}
                className="p-1.5 rounded-lg hover:bg-white/15 text-white/90 transition-colors shrink-0"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4">
              {participantsTraining.participants.length === 0 ? (
                <div className="text-center py-12 text-sm text-gray-400 border border-dashed border-gray-300 rounded-xl">
                  No participants have registered yet.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {participantsTraining.participants.map((p) => (
                    <div key={p.id} className="rounded-xl border border-gray-200 bg-white p-3.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{p.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{p.acName}</p>
                        </div>
                        <span className={`shrink-0 inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium border ${attendanceBadgeClasses(p.attendance)}`}>
                          {p.attendance}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {p.province}</span>
                        <span>{p.phone}</span>
                        <span>Registered {p.registeredAt}</span>
                      </div>
                      <div className="mt-2.5 flex gap-2">
                        <button
                          type="button"
                          onClick={() => updateAttendance(participantsTraining.id, p.id, "Attended")}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition-colors"
                        >
                          <CheckCircle2 className="w-3 h-3" /> Mark Attended
                        </button>
                        <button
                          type="button"
                          onClick={() => updateAttendance(participantsTraining.id, p.id, "No-show")}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <XCircle className="w-3 h-3" /> Mark No-show
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
