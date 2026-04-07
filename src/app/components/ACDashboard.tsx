import { useMemo, useState } from "react";
import { toast } from "sonner";
import { cn } from "./ui/utils";
import {
  Users,
  TrendingUp,
  FileText,
  Package,
  BookOpen,
  Award,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  MapPinned,
  UserCheck,
  UserX,
  Activity,
  Heart,
  GraduationCap,
  UserPlus,
  BadgeCheck,
  Search,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Tooltip as LeafletTooltip, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const redPinIcon = L.divIcon({
  className: "",
  html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 24 12 24S24 21 24 12C24 5.373 18.627 0 12 0z" fill="#EF4444" stroke="#991B1B" stroke-width="1.5"/>
    <circle cx="12" cy="12" r="4.5" fill="white" opacity="0.9"/>
  </svg>`,
  iconSize: [24, 36],
  iconAnchor: [12, 36],
  popupAnchor: [0, -36],
  tooltipAnchor: [12, -20],
});
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
  LabelList,
  RadialBarChart,
  RadialBar,
} from "recharts";

const genderData = [
  { name: "Male", value: 258, percent: 58, color: "#0F2F8F" },
  { name: "Female", value: 186, percent: 42, color: "#E00025" },
  { name: "Other", value: 3, percent: 1, color: "#94A3B8" },
];

const ageGroupData = [
  { group: "18-25", Male: 25, Female: 18, Other: 2 },
  { group: "26-35", Male: 71, Female: 50, Other: 2 },
  { group: "36-45", Male: 91, Female: 63, Other: 2 },
  { group: "46-55", Male: 52, Female: 36, Other: 1 },
  { group: "55+", Male: 20, Female: 21, Other: 0 },
];

// Expected yield breakdown (prototype values; integrate with real business plan / progress data later)
const cropDistributionData = [
  { crop: "Rice", expectedYield: 234 }, // tons/year (illustrative)
  { crop: "Cassava", expectedYield: 156 },
  { crop: "Corn", expectedYield: 98 },
  { crop: "Vegetables", expectedYield: 76 },
];

const livestockData = [
  { type: "Cattle", expectedYield: 128 }, // tons/yr (illustrative projection)
  { type: "Poultry", expectedYield: 312 },
  { type: "Pigs", expectedYield: 89 },
  { type: "Goats", expectedYield: 45 },
];

const farmerAreaData = [
  { area: "Battambang", lat: 13.0957, lon: 103.2022, members: 78 },
  { area: "Siem Reap", lat: 13.3671, lon: 103.8448, members: 62 },
  { area: "Kampong Thom", lat: 12.7117, lon: 104.8885, members: 55 },
  { area: "Kampong Cham", lat: 12.0000, lon: 105.4500, members: 49 },
  { area: "Takeo", lat: 10.9929, lon: 104.7847, members: 41 },
  { area: "Kampot", lat: 10.6104, lon: 104.1815, members: 37 },
  { area: "Prey Veng", lat: 11.4868, lon: 105.3253, members: 33 },
  { area: "Banteay Meanchey", lat: 13.7532, lon: 102.9896, members: 29 },
  { area: "Pursat", lat: 12.5338, lon: 103.9192, members: 26 },
  { area: "Kandal", lat: 11.2237, lon: 105.1259, members: 24 },
  { area: "Kep", lat: 10.4829, lon: 104.3167, members: 13 },
];

const farmerMapMembers = [
  { id: "FM-001", name: "Sok Pisey",        lat: 13.11, lon: 103.18, landArea: 5.2, area: "Battambang",       address: "Sangkat Ratanak, Khan Battambang",             image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80" },
  { id: "FM-002", name: "Chea Sokha",       lat: 13.08, lon: 103.25, landArea: 3.8, area: "Battambang",       address: "Phum Prey, Commune Anlong Vil",                 image: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=80&q=80" },
  { id: "FM-003", name: "Lim Dara",         lat: 13.05, lon: 103.22, landArea: 6.1, area: "Battambang",       address: "Sangkat Svay Por, Battambang",                  image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80" },
  { id: "FM-004", name: "Pich Sophea",      lat: 13.40, lon: 103.80, landArea: 2.5, area: "Siem Reap",        address: "Sangkat Svay Dangkum, Siem Reap City",          image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&q=80" },
  { id: "FM-005", name: "Keo Sothea",       lat: 13.35, lon: 103.88, landArea: 4.0, area: "Siem Reap",        address: "Phum Angkor Thom, Siem Reap",                   image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?auto=format&fit=crop&w=80&q=80" },
  { id: "FM-006", name: "Mao Vibol",        lat: 13.38, lon: 103.75, landArea: 3.2, area: "Siem Reap",        address: "Commune Chreav, District Siem Reap",            image: "https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=80&q=80" },
  { id: "FM-007", name: "Yon Chanthy",      lat: 12.72, lon: 104.90, landArea: 7.4, area: "Kampong Thom",     address: "Sangkat Kampong Thom, Stueng Saen",             image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80" },
  { id: "FM-008", name: "Heng Ratha",       lat: 12.68, lon: 104.85, landArea: 5.0, area: "Kampong Thom",     address: "Phum Prek, Commune Roka, Kampong Thom",         image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=80&q=80" },
  { id: "FM-009", name: "Nget Bopha",       lat: 12.00, lon: 105.46, landArea: 2.9, area: "Kampong Cham",     address: "Sangkat Veal Vong, Kampong Cham City",          image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80" },
  { id: "FM-010", name: "Ros Channak",      lat: 12.04, lon: 105.42, landArea: 4.5, area: "Kampong Cham",     address: "Commune Kdei Chong, Kampong Cham",              image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=80&q=80" },
  { id: "FM-011", name: "Sao Kimhak",       lat: 10.99, lon: 104.79, landArea: 3.1, area: "Takeo",            address: "Sangkat Roka Knong, Takeo City",                image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=80&q=80" },
  { id: "FM-012", name: "Chan Pisey",       lat: 10.95, lon: 104.82, landArea: 2.7, area: "Takeo",            address: "Phum Trea, Commune Samraong, Takeo",            image: "https://images.unsplash.com/photo-1542206395-9feb3edaa68d?auto=format&fit=crop&w=80&q=80" },
  { id: "FM-013", name: "Noun Sreyleak",    lat: 10.61, lon: 104.19, landArea: 1.8, area: "Kampot",           address: "Sangkat Kampong Kandal, Kampot City",           image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=80&q=80" },
  { id: "FM-014", name: "Kong Vanna",       lat: 10.65, lon: 104.17, landArea: 3.6, area: "Kampot",           address: "Commune Tuek Chhou, District Kampot",           image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=80&q=80" },
  { id: "FM-015", name: "Tep Sophon",       lat: 11.49, lon: 105.32, landArea: 4.2, area: "Prey Veng",        address: "Sangkat Prey Veng, Prey Veng City",             image: "https://images.unsplash.com/photo-1500048993953-d23a436266cf?auto=format&fit=crop&w=80&q=80" },
  { id: "FM-016", name: "Ouk Samnang",      lat: 13.76, lon: 102.98, landArea: 5.5, area: "Banteay Meanchey", address: "Sangkat Serei Saophoan, Sisophon",              image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=80&q=80" },
  { id: "FM-017", name: "Meas Sothea",      lat: 12.54, lon: 103.93, landArea: 3.9, area: "Pursat",           address: "Sangkat Phsar Chas, Pursat City",               image: "https://images.unsplash.com/photo-1520409364224-63400afe26e5?auto=format&fit=crop&w=80&q=80" },
  { id: "FM-018", name: "Pen Virak",        lat: 11.22, lon: 105.13, landArea: 2.3, area: "Kandal",           address: "Commune Koh Thom, District Koh Thom, Kandal",  image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=80&q=80" },
  { id: "FM-019", name: "Yorn Dara",        lat: 10.48, lon: 104.32, landArea: 1.5, area: "Kep",              address: "Sangkat Kep, Kep City",                         image: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=80&q=80" },
  { id: "FM-020", name: "Sim Borey",        lat: 13.14, lon: 103.20, landArea: 6.8, area: "Battambang",       address: "Commune Ek Phnom, District Ek Phnom",           image: "https://images.unsplash.com/photo-1474978528675-4a50a4508dc6?auto=format&fit=crop&w=80&q=80" },
];

/** Scheduled trainings — joinedCount updates when members register (demo; wire to API later) */
type TrainingRow = {
  id: string;
  title: string;
  month: string;
  day: number;
  year: number;
  time: string;
  location: string;
  joinedCount: number;
  capacity: number;
};

type JoinedMember = {
  id: string;
  memberId: string;
  trainingId: string;
  name: string;
  registeredAt: string;
};

const upcomingTrainings: TrainingRow[] = [
  {
    id: "tr-1",
    title: "GAP refresher — record keeping",
    month: "Apr",
    day: 9,
    year: 2026,
    time: "08:30 – 12:00",
    location: "AC meeting hall",
    joinedCount: 28,
    capacity: 40,
  },
  {
    id: "tr-2",
    title: "Post-harvest handling demo",
    month: "Apr",
    day: 19,
    year: 2026,
    time: "07:00 – 11:00",
    location: "Central warehouse apron",
    joinedCount: 45,
    capacity: 45,
  },
  {
    id: "tr-3",
    title: "Financial literacy — savings circles",
    month: "Apr",
    day: 16,
    year: 2026,
    time: "14:00 – 16:30",
    location: "Commune office (Annex)",
    joinedCount: 18,
    capacity: 35,
  },
];

export function ACDashboard() {
  const [trainingRows, setTrainingRows] = useState(upcomingTrainings);
  const [trainingMembers, setTrainingMembers] = useState<JoinedMember[]>([
    {
      id: "jm-1",
      memberId: "FM-001",
      trainingId: "tr-1",
      name: "Sok Pisey",
      registeredAt: "Apr 4, 2026",
    },
    {
      id: "jm-2",
      memberId: "FM-012",
      trainingId: "tr-3",
      name: "Chan Pisey",
      registeredAt: "Apr 3, 2026",
    },
  ]);
  const [registerTrainingId, setRegisterTrainingId] = useState<string | null>(null);
  const [memberSearch, setMemberSearch] = useState("");

  const selectedTraining = useMemo(
    () => trainingRows.find((t) => t.id === registerTrainingId) ?? null,
    [trainingRows, registerTrainingId]
  );
  const selectedTrainingMembers = useMemo(
    () => trainingMembers.filter((m) => m.trainingId === registerTrainingId),
    [trainingMembers, registerTrainingId]
  );
  const memberDirectory = useMemo(
    () => farmerMapMembers.map((member) => ({ id: member.id, name: member.name })),
    []
  );
  const selectedTrainingMemberIds = useMemo(
    () => new Set(selectedTrainingMembers.map((member) => member.memberId)),
    [selectedTrainingMembers]
  );
  const filteredMembers = useMemo(() => {
    const keyword = memberSearch.trim().toLowerCase();
    return memberDirectory.filter((member) => {
      if (selectedTrainingMemberIds.has(member.id)) return false;
      if (!keyword) return true;
      return member.name.toLowerCase().includes(keyword);
    });
  }, [memberDirectory, memberSearch, selectedTrainingMemberIds]);

  const availableSeats = selectedTraining
    ? Math.max(selectedTraining.capacity - selectedTraining.joinedCount, 0)
    : 0;

  const adjustJoinedCount = (trainingId: string, change: number) => {
    setTrainingRows((prev) =>
      prev.map((row) => {
        if (row.id !== trainingId) return row;
        const joinedCount = Math.min(row.capacity, Math.max(0, row.joinedCount + change));
        return { ...row, joinedCount };
      })
    );
  };

  const openRegisterModal = (trainingId: string) => {
    setRegisterTrainingId(trainingId);
    setMemberSearch("");
  };

  const addMemberToTraining = (memberId: string) => {
    if (!selectedTraining) return;
    if (availableSeats <= 0) {
      toast.error("This training is already full.");
      return;
    }

    if (selectedTrainingMemberIds.has(memberId)) {
      toast.error("This member is already registered for the selected training.");
      return;
    }

    const member = memberDirectory.find((item) => item.id === memberId);
    if (!member) return;

    setTrainingMembers((prev) => [
      {
        id: `jm-${Date.now()}`,
        memberId: member.id,
        trainingId: selectedTraining.id,
        name: member.name,
        registeredAt: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      },
      ...prev,
    ]);

    adjustJoinedCount(selectedTraining.id, 1);
    toast.success(`Added ${member.name} to ${selectedTraining.title}.`);
  };

  const addAllMembersToTraining = () => {
    if (!selectedTraining) return;
    if (availableSeats <= 0) {
      toast.error("This training is already full.");
      return;
    }
    if (filteredMembers.length === 0) {
      toast.message("No members available to add.");
      return;
    }

    const membersToAdd = filteredMembers.slice(0, availableSeats);
    const today = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    setTrainingMembers((prev) => [
      ...membersToAdd.map((member, index) => ({
        id: `jm-${Date.now()}-${index}`,
        memberId: member.id,
        trainingId: selectedTraining.id,
        name: member.name,
        registeredAt: today,
      })),
      ...prev,
    ]);
    adjustJoinedCount(selectedTraining.id, membersToAdd.length);
    toast.success(
      membersToAdd.length === filteredMembers.length
        ? `Added ${membersToAdd.length} members.`
        : `Added ${membersToAdd.length} members until capacity was reached.`
    );
  };

  const removeMemberFromTraining = (joinedMemberId: string) => {
    if (!selectedTraining) return;
    const memberToRemove = selectedTrainingMembers.find((member) => member.id === joinedMemberId);
    if (!memberToRemove) return;

    setTrainingMembers((prev) => prev.filter((member) => member.id !== joinedMemberId));
    adjustJoinedCount(selectedTraining.id, -1);
    toast.message(`${memberToRemove.name} removed from this training.`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">AC Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Monitor your cooperative's performance, assets, and progress in one place.
        </p>
      </div>

      {/* 1. Membership + key stats — compact card */}
      <div className="rounded-xl bg-gradient-to-br from-[#032EA1] to-[#021c5e] p-4 text-white shadow-lg ring-1 ring-white/10 sm:p-5">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6 sm:gap-3">

          {/* Active members */}
          <div className="min-w-0 rounded-lg bg-white/5 px-2.5 py-2.5 ring-1 ring-white/10">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-medium leading-tight text-white/70 sm:text-[11px]">Active members</p>
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-amber-200/70 bg-white shadow-[0_0_0_1px_rgba(251,191,36,0.18),0_0_10px_rgba(251,191,36,0.28)] transition-transform duration-200 hover:scale-110">
                <Users className="w-3.5 h-3.5 text-blue-600" />
              </div>
            </div>
            <p className="text-xl font-bold tabular-nums sm:text-2xl">447</p>
          </div>

          {/* Male Members */}
          <div className="min-w-0 rounded-lg bg-white/5 px-2.5 py-2.5 ring-1 ring-white/10">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-medium leading-tight text-white/70 sm:text-[11px]">Male Members</p>
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-amber-200/70 bg-white shadow-[0_0_0_1px_rgba(251,191,36,0.18),0_0_10px_rgba(251,191,36,0.28)] transition-transform duration-200 hover:scale-110">
                <UserCheck className="w-3.5 h-3.5 text-sky-500" />
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <p className="text-xl font-bold tabular-nums sm:text-2xl">258</p>
              <span className="text-[10px] text-white/50 font-medium">57.7%</span>
            </div>
          </div>

          {/* Female Members */}
          <div className="min-w-0 rounded-lg bg-white/5 px-2.5 py-2.5 ring-1 ring-white/10">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-medium leading-tight text-white/70 sm:text-[11px]">Female Members</p>
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-amber-200/70 bg-white shadow-[0_0_0_1px_rgba(251,191,36,0.18),0_0_10px_rgba(251,191,36,0.28)] transition-transform duration-200 hover:scale-110">
                <Heart className="w-3.5 h-3.5 text-rose-500" />
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <p className="text-xl font-bold tabular-nums sm:text-2xl">186</p>
              <span className="text-[10px] text-white/50 font-medium">41.6%</span>
            </div>
          </div>

          {/* New this year */}
          <div className="min-w-0 rounded-lg bg-white/5 px-2.5 py-2.5 ring-1 ring-white/10">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-medium leading-tight text-white/70 sm:text-[11px]">New this year</p>
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-amber-200/70 bg-white shadow-[0_0_0_1px_rgba(251,191,36,0.18),0_0_10px_rgba(251,191,36,0.28)] transition-transform duration-200 hover:scale-110">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xl font-bold tabular-nums sm:text-2xl">49</span>
              <span className="inline-flex items-center gap-0.5 rounded-md bg-emerald-400/20 px-1.5 py-0.5 text-[11px] font-bold tabular-nums text-emerald-100 ring-1 ring-emerald-300/30 sm:text-xs">
                <TrendingUp className="h-3 w-3 shrink-0" strokeWidth={2.5} aria-hidden />
                +12.3%
              </span>
            </div>
          </div>

          {/* Dropout rate */}
          <div className="min-w-0 rounded-lg bg-white/5 px-2.5 py-2.5 ring-1 ring-white/10">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-medium leading-tight text-white/70 sm:text-[11px]">Dropout rate</p>
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-amber-200/70 bg-white shadow-[0_0_0_1px_rgba(251,191,36,0.18),0_0_10px_rgba(251,191,36,0.28)] transition-transform duration-200 hover:scale-110">
                <UserX className="w-3.5 h-3.5 text-orange-500" />
              </div>
            </div>
            <p className="text-xl font-bold tabular-nums sm:text-2xl">3.2%</p>
          </div>

          {/* Business plans approved */}
          <div className="min-w-0 rounded-lg bg-white/5 px-2.5 py-2.5 ring-1 ring-white/10">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-medium leading-tight text-white/70 sm:text-[11px]">Business plans approved</p>
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-amber-200/70 bg-white shadow-[0_0_0_1px_rgba(251,191,36,0.18),0_0_10px_rgba(251,191,36,0.28)] transition-transform duration-200 hover:scale-110">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              </div>
            </div>
            <p className="text-xl font-bold tabular-nums sm:text-2xl">1</p>
          </div>

        </div>
      </div>

      {/* Upcoming trainings — executive registration overview */}
      <section
        className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-sm"
        aria-labelledby="upcoming-trainings-heading"
      >
        <div className="relative border-b border-slate-100 bg-white px-3.5 py-3 sm:px-4 sm:py-3.5">
          <div className="relative flex flex-col gap-3">
            <div className="min-w-0 flex-1">
              <h2 id="upcoming-trainings-heading" className="text-xl font-semibold tracking-tight text-slate-900">
                Upcoming trainings
              </h2>
            </div>
          </div>
        </div>

        <div className="space-y-2 p-2.5 sm:p-3">
          {trainingRows.map((t) => {
            return (
              <article
                key={t.id}
                className="group relative overflow-hidden rounded-lg border border-slate-200/90 bg-white transition duration-200 hover:border-[#032EA1]/25 hover:shadow-sm"
              >
                <div className="flex flex-col gap-2.5 p-3 sm:p-3.5 lg:flex-row lg:items-center lg:gap-4">
                  <div className="flex shrink-0 items-center gap-3 lg:w-[76px] lg:flex-col lg:items-stretch lg:gap-0 lg:pl-0">
                    <div className="flex h-[4rem] w-[4rem] flex-col items-center justify-center rounded-lg bg-gradient-to-br from-[#032EA1] to-[#0447D4] text-white shadow-sm ring-1 ring-[#032EA1]/25 lg:h-auto lg:min-h-[4.5rem] lg:w-full">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">{t.month}</span>
                      <span className="text-xl font-bold tabular-nums leading-none">{t.day}</span>
                      <span className="text-[10px] font-medium tabular-nums text-white/60">{t.year}</span>
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold leading-snug text-slate-900 sm:text-base">{t.title}</h3>
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#032EA1]/8 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#032EA1] ring-1 ring-[#032EA1]/15">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#032EA1]" aria-hidden />
                        Open
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 ring-1 ring-slate-200/80">
                        <Clock className="h-3.5 w-3.5 text-[#032EA1]" aria-hidden />
                        {t.time}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 ring-1 ring-slate-200/80">
                        <MapPinned className="h-3.5 w-3.5 text-[#032EA1]" aria-hidden />
                        <span className="max-w-[220px] truncate sm:max-w-none">{t.location}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => openRegisterModal(t.id)}
                        className="inline-flex items-center gap-1.5 rounded-md border border-[#032EA1]/20 bg-[#032EA1] px-2.5 py-0.5 text-xs font-semibold text-white transition hover:bg-[#0a3cb0]"
                      >
                        <UserPlus className="h-3.5 w-3.5" />
                        Register
                      </button>
                    </div>
                  </div>

                  <div className="w-full shrink-0 border-t border-slate-100 pt-2.5 lg:w-[210px] lg:border-t-0 lg:pt-0 lg:text-right">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 lg:text-right">Registered members</p>
                    <p className="mt-0.5 text-slate-900">
                      <span className="text-2xl font-bold tabular-nums text-[#032EA1]">{t.joinedCount}</span>
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {registerTrainingId !== null && (
        <>
          <div
            className="fixed inset-0 z-[100] bg-black/45"
            onClick={() => setRegisterTrainingId(null)}
            aria-hidden
          />
          <aside className="fixed inset-y-0 right-0 z-[110] w-full max-w-[720px] border-l border-gray-200 bg-white shadow-2xl">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between bg-[#032EA1] px-5 py-3.5 text-white">
                <div>
                  <h3 className="text-sm font-semibold">Register member for training</h3>
                  <p className="text-xs text-blue-100 mt-0.5">
                    {selectedTraining
                      ? `${selectedTraining.title} • ${selectedTraining.month} ${selectedTraining.day}, ${selectedTraining.year} • ${selectedTraining.time}`
                      : "Select a training session"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setRegisterTrainingId(null)}
                  className="rounded-md p-1 text-white/90 hover:bg-white/10 hover:text-white"
                  aria-label="Close registration panel"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid flex-1 gap-4 overflow-y-auto p-4 lg:grid-cols-2">
                <section className="rounded-lg border border-gray-200 bg-slate-50/60 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="text-sm font-semibold text-gray-900">Add members</h4>
                    <button
                      type="button"
                      onClick={addAllMembersToTraining}
                      disabled={!selectedTraining || availableSeats <= 0 || filteredMembers.length === 0}
                      className="inline-flex items-center gap-1 rounded-md border border-[#032EA1]/25 bg-white px-2.5 py-1.5 text-xs font-semibold text-[#032EA1] transition hover:bg-[#032EA1]/5 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add All
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">{availableSeats} seats available</p>
                  <div className="mt-3">
                    <label className="block">
                      <span className="mb-1 block text-xs font-medium text-gray-600">Search members</span>
                      <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                          value={memberSearch}
                          onChange={(e) => setMemberSearch(e.target.value)}
                          placeholder="Search by member name"
                          className="w-full rounded-md border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-[#032EA1] focus:ring-2 focus:ring-[#032EA1]/20"
                        />
                      </div>
                    </label>
                  </div>
                  <div className="mt-3 max-h-[320px] space-y-2 overflow-y-auto pr-1">
                    {filteredMembers.length === 0 ? (
                      <p className="rounded-md border border-dashed border-gray-300 bg-white px-3 py-4 text-center text-sm text-gray-500">
                        No available members match your search.
                      </p>
                    ) : (
                      filteredMembers.map((member) => (
                        <div key={member.id} className="flex items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{member.name}</p>
                            <p className="text-[11px] text-gray-500">{member.id}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => addMemberToTraining(member.id)}
                            disabled={!selectedTraining || availableSeats <= 0}
                            className="inline-flex items-center gap-1 rounded-md border border-[#032EA1]/25 bg-[#032EA1] px-2.5 py-1 text-xs font-semibold text-white transition hover:bg-[#0a3cb0] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            Add
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </section>

                <section className="rounded-lg border border-gray-200 bg-white p-4">
                  <h4 className="text-sm font-semibold text-gray-900">Added members</h4>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {selectedTraining ? `${selectedTraining.joinedCount}/${selectedTraining.capacity} registered members` : "No training selected"}
                  </p>
                  <div className="mt-3 max-h-[320px] space-y-2 overflow-y-auto pr-1">
                    {selectedTrainingMembers.length === 0 ? (
                      <p className="rounded-md border border-dashed border-gray-300 bg-slate-50 px-3 py-4 text-center text-sm text-gray-500">
                        No member records yet.
                      </p>
                    ) : (
                      selectedTrainingMembers.map((m) => (
                        <div key={m.id} className="rounded-md border border-gray-200 px-3 py-2">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-semibold text-gray-900">{m.name}</p>
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700 ring-1 ring-emerald-200">
                                <BadgeCheck className="h-3 w-3" />
                                Added
                              </span>
                              <button
                                type="button"
                                onClick={() => removeMemberFromTraining(m.id)}
                                className="inline-flex items-center gap-1 rounded-md border border-rose-200 bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-700 transition hover:bg-rose-100"
                              >
                                <Trash2 className="h-3 w-3" />
                                Remove
                              </button>
                            </div>
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-600">
                            <span>{m.memberId}</span>
                            <span className="text-gray-400">{m.registeredAt}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </section>
              </div>

              <div className="border-t border-gray-200 bg-white px-5 py-3">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setRegisterTrainingId(null)}
                    className="inline-flex items-center gap-1.5 rounded-md bg-[#032EA1] px-3 py-2 text-sm font-semibold text-white hover:bg-[#0a3cb0]"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </>
      )}

      {/* 3. Business Plan Status Widget - Critical Priority */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            Business Plan Status
          </h3>
          <FileText className="w-6 h-6 text-[#032EA1]" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Overview */}
          <div>
            <div className="flex items-center justify-between mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Current Status</p>
                <p className="text-2xl font-bold text-emerald-700 mt-1">Approved</p>
              </div>
              <CheckCircle className="w-12 h-12 text-emerald-600" />
            </div>

            <div className="space-y-3">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Implementation Progress
                  </span>
                  <span className="text-lg font-bold text-[#032EA1]">73%</span>
                </div>
                <div className="bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-[#032EA1] to-[#0447D4] h-3 rounded-full"
                    style={{ width: "73%" }}
                  ></div>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Approved Date
                </p>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">March 15, 2024</span>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Milestones & Alerts */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              Upcoming Milestones
            </h4>
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-900">Equipment Purchase</span>
                </div>
                <span className="text-xs text-gray-600">Due: Apr 30</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-900">Training Session</span>
                </div>
                <span className="text-xs text-gray-600">Due: May 15</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-900">Crop Expansion</span>
                </div>
                <span className="text-xs text-gray-600">Due: Jun 20</span>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-orange-900">
                    2 Activities Overdue
                  </p>
                  <p className="text-xs text-orange-700 mt-1">
                    Progress report submission and farmer training completion require
                    immediate attention.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Member Demographics Visualization - High Priority */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Farmer Member Distribution Map */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Members by Area</h3>
              <p className="text-sm text-gray-500 mt-1">
                Geographic spread of registered members across Cambodia.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-lg bg-blue-50 border border-blue-200 px-3 py-1.5 text-sm text-[#0F2F8F]">
              <MapPinned className="w-4 h-4" />
              Total mapped members: {farmerAreaData.reduce((sum, item) => sum + item.members, 0)}
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
            <div className="xl:col-span-3 h-[420px] rounded-xl overflow-hidden border border-[#0F2F8F]/20">
              <MapContainer
                center={[12.6, 104.2]}
                zoom={7}
                scrollWheelZoom={false}
                className="h-full w-full z-0"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {farmerMapMembers.map((farmer) => (
                  <Marker
                    key={farmer.id}
                    position={[farmer.lat, farmer.lon]}
                    icon={redPinIcon}
                  >
                    <LeafletTooltip direction="top" offset={[0, -6]} opacity={1}>
                      <span className="text-xs font-semibold">{farmer.name}</span>
                    </LeafletTooltip>
                    <Popup minWidth={220} maxWidth={240}>
                      <div style={{ fontFamily: "inherit", padding: "4px 2px 2px" }}>
                        {/* Header: avatar + name */}
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                          <img
                            src={farmer.image}
                            alt={farmer.name}
                            style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", border: "2px solid #0F2F8F33", flexShrink: 0 }}
                          />
                          <div>
                            <p style={{ fontWeight: 700, fontSize: 14, color: "#111827", lineHeight: 1.3, margin: 0 }}>{farmer.name}</p>
                            <p style={{ fontSize: 11, color: "#6B7280", margin: "2px 0 0", fontWeight: 500 }}>{farmer.id}</p>
                          </div>
                        </div>
                        {/* Divider */}
                        <div style={{ borderTop: "1px solid #E5E7EB", marginBottom: 8 }} />
                        {/* Details rows — all labels aligned */}
                        <div style={{ display: "grid", gridTemplateColumns: "16px 1fr", rowGap: 6, columnGap: 8, alignItems: "start" }}>
                          {/* Location */}
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#0F2F8F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 13, height: 13, marginTop: 1 }}><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                          <div>
                            <p style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", margin: 0 }}>Location</p>
                            <p style={{ fontSize: 12, color: "#374151", fontWeight: 500, margin: "1px 0 0", lineHeight: 1.4 }}>{farmer.address}</p>
                          </div>
                          {/* Province */}
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#0F2F8F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 13, height: 13, marginTop: 1 }}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
                          <div>
                            <p style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", margin: 0 }}>Province</p>
                            <p style={{ fontSize: 12, color: "#374151", fontWeight: 500, margin: "1px 0 0" }}>{farmer.area}</p>
                          </div>
                          {/* Land Area */}
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#0F2F8F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 13, height: 13, marginTop: 1 }}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                          <div>
                            <p style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", margin: 0 }}>Land Area</p>
                            <p style={{ fontSize: 12, color: "#0F2F8F", fontWeight: 700, margin: "1px 0 0" }}>{farmer.landArea} Ha</p>
                          </div>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>

            <div className="xl:col-span-1 rounded-xl border border-gray-200 bg-gradient-to-b from-white to-blue-50/40 p-4">
              <h4 className="text-sm font-semibold text-gray-800 mb-3">Top Coverage Areas</h4>
              <div className="space-y-2.5">
                {[...farmerAreaData]
                  .sort((a, b) => b.members - a.members)
                  .slice(0, 6)
                  .map((area) => (
                    <div key={area.area} className="rounded-lg border border-blue-100 bg-white px-3 py-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-gray-800">{area.area}</span>
                        <span className="text-xs font-semibold text-[#0F2F8F]">{area.members}</span>
                      </div>
                      <div className="mt-1.5 h-1.5 rounded-full bg-blue-100">
                        <div
                          className="h-1.5 rounded-full bg-[#0F2F8F]"
                          style={{ width: `${Math.min(100, (area.members / 80) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Gender Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Gender Distribution</h3>
              <p className="text-xs text-gray-400 mt-0.5">All registered members</p>
            </div>
            <span className="text-xs font-semibold text-[#0F2F8F] bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">
              447 total
            </span>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative flex-shrink-0">
              <ResponsiveContainer width={170} height={170}>
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={78}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {genderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: "10px", border: "1px solid #E5E7EB", fontSize: 12 }}
                    formatter={(val: number) => [`${val} members`]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-gray-900">447</span>
                <span className="text-[10px] text-gray-400">members</span>
              </div>
            </div>
            <div className="flex-1 space-y-3">
              {genderData.map((g) => (
                <div key={g.name}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: g.color }} />
                      <span className="text-sm font-medium text-gray-700">{g.name}</span>
                    </div>
                    <span className="text-sm font-bold" style={{ color: g.color }}>{g.value} <span className="text-gray-400 font-normal">({g.percent}%)</span></span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-100">
                    <div className="h-1.5 rounded-full" style={{ width: `${g.percent}%`, backgroundColor: g.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Age Group Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Age Group Distribution</h3>
              <p className="text-xs text-gray-400 mt-0.5">Breakdown by age & gender</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm inline-block bg-[#0F2F8F]" />Male</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm inline-block bg-[#E00025]" />Female</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm inline-block bg-[#94A3B8]" />Other</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={ageGroupData} barCategoryGap="28%" barGap={3}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="group" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: "10px", border: "1px solid #E5E7EB", fontSize: 12, boxShadow: "0 4px 16px 0 rgba(0,0,0,0.08)" }}
                cursor={{ fill: "#F8FAFC" }}
              />
              <Bar dataKey="Male" fill="#0F2F8F" name="Male" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Female" fill="#E00025" name="Female" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Other" fill="#94A3B8" name="Other" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Crop Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Crop Distribution</h3>
              <p className="text-xs text-gray-400 mt-0.5">Expected Yield per Year</p>
            </div>
          </div>
          <div className="space-y-4">
            {(() => {
              const cropColors = ["#0F2F8F", "#0D2A7D", "#3B5FCC", "#6B8EFF"];
              const max = Math.max(...cropDistributionData.map(d => d.expectedYield));
              return cropDistributionData.map((item, i) => (
                <div key={item.crop}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: cropColors[i] }} />
                      <span className="text-sm font-medium text-gray-700">{item.crop}</span>
                    </div>
                    <span className="text-sm font-bold" style={{ color: cropColors[i] }}>
                      {item.expectedYield}
                      <span className="text-xs text-gray-400 font-normal ml-1">tons/yr</span>
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full bg-gray-100">
                    <div
                      className="h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${(item.expectedYield / max) * 100}%`, backgroundColor: cropColors[i] }}
                    />
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>

        {/* Livestock Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Livestock Distribution</h3>
              <p className="text-xs text-gray-400 mt-0.5">Expected Yield per Year</p>
            </div>
          </div>
          <div className="space-y-4">
            {(() => {
              const livestockColors = ["#0F2F8F", "#0D2A7D", "#3B5FCC", "#6B8EFF"];
              const max = Math.max(...livestockData.map(d => d.expectedYield));
              return livestockData.map((item, i) => (
                <div key={item.type}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: livestockColors[i] }} />
                      <span className="text-sm font-medium text-gray-700">{item.type}</span>
                    </div>
                    <span className="text-sm font-bold" style={{ color: livestockColors[i] }}>
                      {item.expectedYield}
                      <span className="text-xs text-gray-400 font-normal ml-1">tons/yr</span>
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full bg-gray-100">
                    <div
                      className="h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${(item.expectedYield / max) * 100}%`, backgroundColor: livestockColors[i] }}
                    />
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
      </div>

      {/* 4. Asset Overview Widget - High Priority */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Asset Overview</h3>
          <Package className="w-6 h-6 text-[#032EA1]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-600">Total Assets</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">28</p>
          </div>
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <p className="text-sm text-gray-600">Good Condition</p>
            <p className="text-3xl font-bold text-emerald-600 mt-2">18</p>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-gray-600">Fair Condition</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">7</p>
          </div>
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-gray-600">Needs Attention</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">3</p>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-900">
                2 Assets Overdue for Maintenance
              </p>
              <ul className="text-xs text-red-700 mt-2 space-y-1">
                <li>• Rice Mill Machine - Last serviced 8 months ago</li>
                <li>• Water Pump System - Maintenance due 15 days ago</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Knowledge & Training Metrics - Medium Priority */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Knowledge & Training Metrics
          </h3>
          <BookOpen className="w-6 h-6 text-[#032EA1]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <BookOpen className="w-8 h-8 text-blue-600 mb-3" />
            <p className="text-sm text-gray-600">Materials Received</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">47</p>
            <p className="text-xs text-gray-500 mt-2">+5 this month</p>
          </div>
          <div className="p-6 bg-purple-50 border border-purple-200 rounded-lg">
            <CheckCircle className="w-8 h-8 text-purple-600 mb-3" />
            <p className="text-sm text-gray-600">Activity Completion</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">89%</p>
            <p className="text-xs text-gray-500 mt-2">Above target (75%)</p>
          </div>
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-lg">
            <Users className="w-8 h-8 text-emerald-600 mb-3" />
            <p className="text-sm text-gray-600">Training Participation</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">342</p>
            <p className="text-xs text-gray-500 mt-2">Members participated</p>
          </div>
        </div>
      </div>
    </div>
  );
}