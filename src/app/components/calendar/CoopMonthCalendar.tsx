import { useMemo, useState } from "react";
import {
  addWeeks,
  endOfWeek,
  format,
  isSameDay,
  isToday,
  startOfWeek,
  subWeeks,
} from "date-fns";
import { ChevronLeft, ChevronRight, Clock, MapPin, Video } from "lucide-react";
import { toast } from "sonner";
import { cn } from "../ui/utils";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";

export type CoopCalendarEvent = {
  id: string;
  date: Date;
  title: string;
  category: string;
  time?: string;
  location?: string;
  notes?: string;
  /** Optional; demo uses a placeholder link when missing */
  joinUrl?: string;
};

export type CoopCalendarCategory = {
  key: string;
  label: string;
  /** Small circle in legend */
  dotClass: string;
  /** Full day cell fill (background + readable text) */
  cellClass: string;
};

type CoopMonthCalendarProps = {
  pageTitle: string;
  pageDescription?: string;
  events: CoopCalendarEvent[];
  categories: CoopCalendarCategory[];
};

function eventsOnDay(events: CoopCalendarEvent[], day: Date) {
  return events.filter((e) => isSameDay(e.date, day));
}

function parseTimeToMinutes(text: string) {
  const match = text.trim().match(/^(\d{1,2})(?::(\d{2}))?$/);
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2] ?? "0");
  if (Number.isNaN(hour) || Number.isNaN(minute)) return null;
  return hour * 60 + minute;
}

function getDurationHours(time?: string) {
  if (!time) return 1;
  const normalized = time.replace(/\u2013/g, "-");
  const [startRaw, endRaw] = normalized.split("-").map((v) => v.trim());
  if (!startRaw || !endRaw) return 1;
  const start = parseTimeToMinutes(startRaw);
  const end = parseTimeToMinutes(endRaw);
  if (start === null || end === null) return 1;
  const diffMinutes = end >= start ? end - start : end + 24 * 60 - start;
  return Math.max(1, diffMinutes / 60);
}

function getStartHour(time?: string) {
  if (!time) return 12;
  const normalized = time.replace(/\u2013/g, "-");
  const startRaw = normalized.split("-")[0]?.trim();
  if (!startRaw) return 12;
  const start = parseTimeToMinutes(startRaw);
  if (start === null) return 12;
  return start / 60;
}

export function CoopMonthCalendar({
  pageTitle,
  pageDescription,
  events,
  categories,
}: CoopMonthCalendarProps) {
  const [viewStart, setViewStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [selected, setSelected] = useState<Date>(() => new Date());

  const categoryCell = useMemo(() => {
    const m: Record<string, string> = {};
    for (const c of categories) m[c.key] = c.cellClass;
    return m;
  }, [categories]);

  const categoryLabel = useMemo(() => {
    const m: Record<string, string> = {};
    for (const c of categories) m[c.key] = c.label;
    return m;
  }, [categories]);

  const [meetingModal, setMeetingModal] = useState<{ day: Date; events: CoopCalendarEvent[] } | null>(null);

  const openMeetingModal = (day: Date, dayEvents: CoopCalendarEvent[]) => {
    if (dayEvents.length === 0) return;
    setSelected(day);
    setMeetingModal({ day, events: dayEvents });
  };

  const handleJoinMeeting = (e: CoopCalendarEvent) => {
    const url = e.joinUrl ?? `https://meet.google.com/lookup/${encodeURIComponent(e.id)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    toast.message("Opening meeting", { description: "Demo link — replace with your video provider URL." });
  };

  const workDays = useMemo(() => {
    const monday = startOfWeek(viewStart, { weekStartsOn: 1 });
    return [0, 1, 2, 3, 4].map(
      (offset) => new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + offset)
    );
  }, [viewStart]);
  const timeSlots = useMemo(() => Array.from({ length: 11 }, (_, i) => 8 + i), []);

  const goToday = () => {
    const t = new Date();
    setViewStart(startOfWeek(t, { weekStartsOn: 1 }));
    setSelected(t);
  };
  const rangeLabel = `${format(workDays[0], "MMMM d")}–${format(workDays[4], "d, yyyy")}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">{pageTitle}</h1>
        {pageDescription?.trim() ? (
          <p className="mt-1 max-w-2xl text-sm text-gray-600 leading-relaxed">{pageDescription}</p>
        ) : null}
      </div>

      <div className="w-full">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white text-gray-900 shadow-[0_4px_24px_-4px_rgba(3,46,161,0.08),0_2px_8px_-2px_rgba(0,0,0,0.06)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 bg-slate-50 px-4 py-2.5 sm:px-5">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setViewStart((w) => subWeeks(w, 1))}
                className="rounded-lg p-2 text-gray-600 hover:bg-[#032EA1]/10 hover:text-[#032EA1] transition-colors"
                aria-label="Previous week"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => setViewStart((w) => addWeeks(w, 1))}
                className="rounded-lg p-2 text-gray-600 hover:bg-[#032EA1]/10 hover:text-[#032EA1] transition-colors"
                aria-label="Next week"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900 tabular-nums">{rangeLabel}</h2>
            <button
              type="button"
              onClick={goToday}
              className="rounded-lg border border-[#032EA1]/20 bg-white px-3 py-1.5 text-xs font-semibold text-[#032EA1] hover:bg-[#032EA1]/5 transition-colors"
            >
              Today
            </button>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[840px]">
              <div className="grid grid-cols-[56px_repeat(5,minmax(0,1fr))] border-b border-gray-200 bg-slate-50">
                <div />
                {workDays.map((day) => (
                  <div key={day.toISOString()} className="border-l border-gray-200 px-2 py-2">
                    <p className={cn("text-xl font-semibold leading-none", isToday(day) ? "text-emerald-600" : "text-[#032EA1]")}>{format(day, "d")}</p>
                    <p className="text-xs text-gray-500">{format(day, "EEE")}</p>
                  </div>
                ))}
              </div>

              <div className="relative">
                <div className="grid grid-cols-[56px_repeat(5,minmax(0,1fr))]">
                  <div className="bg-white">
                    {timeSlots.map((h) => (
                      <div key={h} className="h-16 border-t border-gray-200 px-2 pt-1 text-[11px] text-gray-500">
                        {h <= 12 ? `${h} AM` : `${h - 12} PM`}
                      </div>
                    ))}
                  </div>
                  {workDays.map((day) => (
                    <div key={day.toISOString()} className="relative border-l border-gray-200">
                      {timeSlots.map((h) => (
                        <div key={`${day.toISOString()}-${h}`} className="h-16 border-t border-gray-200" />
                      ))}
                      {eventsOnDay(events, day).map((e, idx) => {
                        const startHour = getStartHour(e.time);
                        const duration = getDurationHours(e.time);
                        const top = (startHour - 8) * 64;
                        const height = Math.max(38, duration * 64);
                        const tinted = Boolean(categoryCell[e.category]);
                        return (
                          <button
                            key={e.id}
                            type="button"
                            onClick={() => {
                              setSelected(day);
                              openMeetingModal(day, [e]);
                            }}
                            className={cn(
                              "absolute left-1.5 right-1.5 rounded-md border px-2 py-1.5 text-left shadow-md transition hover:brightness-110",
                              tinted ? cn(categoryCell[e.category], "border-black/30") : "bg-indigo-600 text-white border-indigo-400"
                            )}
                            style={{ top: `${top + idx * 2}px`, height: `${height}px` }}
                          >
                            <p className="line-clamp-2 text-[11px] font-semibold leading-tight">{e.title}</p>
                            {e.time ? <p className="mt-1 text-[10px] text-white/85">{e.time}</p> : null}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 px-4 py-3 sm:px-5 bg-slate-50">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">Legend</p>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {categories.map((c) => (
                <span key={c.key} className="inline-flex items-center gap-1.5 text-xs text-gray-600">
                  <span className={cn("h-2 w-2 rounded-full shrink-0", c.dotClass)} />
                  {c.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={meetingModal !== null} onOpenChange={(open) => !open && setMeetingModal(null)}>
        <DialogContent className="sm:max-w-lg bg-white border-gray-200 text-gray-900">
          <DialogHeader>
            <DialogTitle className="text-[#032EA1]">Meeting details</DialogTitle>
            <DialogDescription className="text-gray-600">
              {meetingModal ? format(meetingModal.day, "EEEE, MMMM d, yyyy") : ""}
            </DialogDescription>
          </DialogHeader>
          {meetingModal && (
            <div className="space-y-4 max-h-[min(60vh,420px)] overflow-y-auto pr-1">
              {meetingModal.events.map((e) => {
                const tinted = Boolean(categoryCell[e.category]);
                return (
                  <div
                    key={e.id}
                    className={cn(
                      "rounded-xl border p-4 space-y-3",
                      tinted ? cn(categoryCell[e.category], "border-black/15") : "border-gray-200 bg-slate-50"
                    )}
                  >
                    <div>
                      <p
                        className={cn(
                          "text-xs font-semibold uppercase tracking-wide",
                          tinted ? "text-white/85" : "text-gray-500"
                        )}
                      >
                        {categoryLabel[e.category] ?? e.category}
                      </p>
                      <p className={cn("text-base font-bold leading-snug mt-0.5", tinted ? "text-white" : "text-gray-900")}>
                        {e.title}
                      </p>
                    </div>
                    {e.time ? (
                      <p className={cn("flex items-center gap-2 text-sm", tinted ? "text-white/90" : "text-gray-600")}>
                        <Clock className="h-4 w-4 shrink-0 opacity-90" />
                        {e.time}
                      </p>
                    ) : null}
                    {e.location ? (
                      <p className={cn("flex items-center gap-2 text-sm", tinted ? "text-white/90" : "text-gray-600")}>
                        <MapPin className="h-4 w-4 shrink-0 opacity-90" />
                        {e.location}
                      </p>
                    ) : null}
                    {e.notes ? (
                      <p
                        className={cn(
                          "text-sm leading-relaxed border-t pt-3",
                          tinted ? "text-white/90 border-white/25" : "text-gray-600 border-gray-200"
                        )}
                      >
                        {e.notes}
                      </p>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => handleJoinMeeting(e)}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-[#032EA1] shadow-sm ring-1 ring-black/5 hover:bg-gray-50 transition-colors"
                    >
                      <Video className="h-4 w-4" />
                      Join meeting
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
