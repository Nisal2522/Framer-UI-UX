import { CoopMonthCalendar, type CoopCalendarCategory, type CoopCalendarEvent } from "./calendar/CoopMonthCalendar";

const TRAINING_CATEGORIES: CoopCalendarCategory[] = [
  { key: "classroom", label: "Group training", dotClass: "bg-[#032EA1]", cellClass: "bg-[#032EA1] text-white" },
  { key: "extension", label: "Extension visit", dotClass: "bg-sky-500", cellClass: "bg-sky-500 text-white" },
  { key: "demo", label: "Demo / field day", dotClass: "bg-emerald-500", cellClass: "bg-emerald-500 text-white" },
  { key: "cert", label: "Assessment / certification", dotClass: "bg-amber-500", cellClass: "bg-amber-500 text-white" },
];

const TRAINING_EVENTS: CoopCalendarEvent[] = [
  {
    id: "t1",
    date: new Date(2026, 3, 9),
    title: "GAP refresher — record keeping",
    category: "classroom",
    time: "08:30 – 12:00",
    location: "AC meeting hall",
    notes: "Bring member ID lists; certificates issued same day (demo).",
  },
  {
    id: "t2",
    date: new Date(2026, 3, 11),
    title: "District extension — pest scouting",
    category: "extension",
    time: "09:00",
    location: "Maize demonstration plot",
    notes: "Joint visit with PDA; photo documentation for reporting.",
  },
  {
    id: "t3",
    date: new Date(2026, 3, 16),
    title: "Financial literacy — savings circles",
    category: "classroom",
    time: "14:00 – 16:30",
    location: "Commune office (Annex)",
    notes: "Women’s committee priority slots; interpreter on request.",
  },
  {
    id: "t4",
    date: new Date(2026, 3, 19),
    title: "Post-harvest handling demo",
    category: "demo",
    time: "07:00 – 11:00",
    location: "Central warehouse apron",
    notes: "Moisture meters + hermetic bags; Q&A with storage officer.",
  },
  {
    id: "t5",
    date: new Date(2026, 3, 24),
    title: "Board & committee orientation",
    category: "classroom",
    time: "13:00 – 17:00",
    location: "AC meeting hall",
    notes: "Governance module; new bylaws overview.",
  },
  {
    id: "t6",
    date: new Date(2026, 3, 25),
    title: "Internal GAP self-assessment",
    category: "cert",
    time: "08:00 – 15:00",
    location: "Multiple sites",
    notes: "Checklist v2; findings feed into Ministry reporting template.",
  },
  {
    id: "t7",
    date: new Date(2026, 4, 2),
    title: "Youth agri-entrepreneur workshop",
    category: "classroom",
    time: "09:00 – 12:00",
    location: "Online + hall hybrid",
    notes: "Market linkage pitch training; max 40 participants.",
  },
  {
    id: "t8",
    date: new Date(2026, 4, 7),
    title: "Safe pesticide use — field school",
    category: "demo",
    time: "06:30 – 10:00",
    location: "Vegetable cluster (east)",
    notes: "PPE distribution; sign-in for attendance records.",
  },
  {
    id: "t9",
    date: new Date(2026, 4, 15),
    title: "Certification readiness review",
    category: "cert",
    time: "10:00",
    location: "AC office",
    notes: "Pre-audit with support partner; gaps logged as actions.",
  },
];

export function CalendarTraining() {
  return (
    <CoopMonthCalendar
      pageTitle="Training"
      events={TRAINING_EVENTS}
      categories={TRAINING_CATEGORIES}
    />
  );
}
