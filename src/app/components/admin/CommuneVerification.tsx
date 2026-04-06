import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Building2,
  CheckCircle,
  ClipboardList,
  History,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { useNotifications } from "../../context/NotificationContext";

type QueueItem = {
  id: string;
  acName: string;
  acCode: string;
  commune: string;
  district: string;
  province: string;
  pendingReason: "initial" | "reverification";
  submittedAt: string;
};

type VerificationLogEntry = {
  id: string;
  at: string;
  officer: string;
  action: "approved" | "returned";
  acName: string;
  acCode: string;
  comments: string;
};

const OFFICER = "Commune Officer — Chea Sopheak (CAO-01042)";

const initialQueue: QueueItem[] = [
  {
    id: "vq-1",
    acName: "Anlong Vil Rice Growers Cooperative",
    acCode: "AC-BB-2024-089",
    commune: "Anlong Vil",
    district: "Sangkae",
    province: "Battambang",
    pendingReason: "initial",
    submittedAt: "2026-03-28",
  },
  {
    id: "vq-2",
    acName: "Stueng Saen Horticulture AC",
    acCode: "AC-KT-2025-012",
    commune: "Stueng Saen",
    district: "Stueng Saen",
    province: "Kampong Thom",
    pendingReason: "reverification",
    submittedAt: "2026-03-30",
  },
  {
    id: "vq-3",
    acName: "Prey Veng Aquaculture Cooperative",
    acCode: "AC-PV-2026-003",
    commune: "Ba Phnom",
    district: "Ba Phnom",
    province: "Prey Veng",
    pendingReason: "initial",
    submittedAt: "2026-03-31",
  },
];

const profileSections = [
  { key: "identity", title: "Legal identity & registration" },
  { key: "governance", title: "Governance & committee" },
  { key: "operations", title: "Operations & membership rules" },
  { key: "land", title: "Land & assets (summary)" },
  { key: "contacts", title: "Contacts & signatories" },
];

export function CommuneVerification() {
  const { addNotification } = useNotifications();
  const [queue, setQueue] = useState<QueueItem[]>(initialQueue);
  const [selectedId, setSelectedId] = useState<string | null>(initialQueue[0]?.id ?? null);
  const [sectionNotes, setSectionNotes] = useState<Record<string, string>>({});
  const [returnComments, setReturnComments] = useState("");
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [log, setLog] = useState<VerificationLogEntry[]>([
    {
      id: "log-0",
      at: "2026-03-15T09:12:00",
      officer: "Commune Officer — Lim Dara (CAO-00891)",
      action: "approved",
      acName: "Samlot Cassava Cooperative",
      acCode: "AC-BB-2023-044",
      comments: "All sections verified against supporting documents.",
    },
  ]);

  const selected = useMemo(() => queue.find((q) => q.id === selectedId) ?? null, [queue, selectedId]);

  const appendLog = (entry: Omit<VerificationLogEntry, "id">) => {
    setLog((prev) => [{ id: `log-${Date.now()}`, ...entry }, ...prev]);
  };

  const notifyCommittee = (title: string, body: string) => {
    addNotification({
      title,
      body,
      audience: "AC Committee",
    });
    toast.success("Committee notified (in-app notification queued).");
  };

  const handleApprove = () => {
    if (!selected) return;
    appendLog({
      at: new Date().toISOString(),
      officer: OFFICER,
      action: "approved",
      acName: selected.acName,
      acCode: selected.acCode,
      comments: Object.entries(sectionNotes)
        .filter(([, v]) => v.trim())
        .map(([k, v]) => `${k}: ${v}`)
        .join(" | ") || "Approved with no section notes.",
    });
    setQueue((q) => q.filter((x) => x.id !== selected.id));
    notifyCommittee(
      `Profile approved: ${selected.acCode}`,
      `${selected.acName} is now Active. Verification completed by commune officer.`
    );
    setSelectedId(queue.find((x) => x.id !== selected.id)?.id ?? null);
    setSectionNotes({});
    toast.success("Profile approved and logged.");
  };

  const handleReturn = () => {
    if (!selected || !returnComments.trim()) {
      toast.error("Return requires mandatory written comments.");
      return;
    }
    appendLog({
      at: new Date().toISOString(),
      officer: OFFICER,
      action: "returned",
      acName: selected.acName,
      acCode: selected.acCode,
      comments: returnComments.trim(),
    });
    setQueue((q) => q.filter((x) => x.id !== selected.id));
    notifyCommittee(
      `Profile returned: ${selected.acCode}`,
      `Your AC profile requires corrections before activation. Officer comments: ${returnComments.trim()}`
    );
    setShowReturnModal(false);
    setReturnComments("");
    setSelectedId(queue.find((x) => x.id !== selected.id)?.id ?? null);
    setSectionNotes({});
    toast.message("Profile returned to AC Committee.");
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Commune officer verification</h1>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* 1. Verification queue */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <ClipboardList className="h-4 w-4 text-[#0F2F8F]" />
            Verification queue
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm divide-y divide-gray-100 max-h-[520px] overflow-y-auto">
            {queue.length === 0 ? (
              <p className="p-6 text-sm text-gray-500">No pending profiles in your commune queue.</p>
            ) : (
              queue.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                  className={`w-full text-left p-4 transition-colors hover:bg-blue-50/50 ${
                    selectedId === item.id ? "bg-blue-50 border-l-4 border-l-[#0F2F8F]" : "border-l-4 border-l-transparent"
                  }`}
                >
                  <p className="font-medium text-gray-900 text-sm">{item.acName}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.acCode}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="text-[10px] uppercase tracking-wide font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      {item.pendingReason === "initial" ? "Initial" : "Reverification"}
                    </span>
                    <span className="text-[10px] text-gray-500">{item.submittedAt}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {item.commune}, {item.district}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* 2–3. Profile review + actions */}
        <div className="lg:col-span-8 space-y-4">
          {!selected ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 p-12 text-center text-gray-500 text-sm">
              Select a cooperative from the queue to open the read-only profile review.
            </div>
          ) : (
            <>
              <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0F2F8F]/10 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-[#0F2F8F]" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">{selected.acName}</h2>
                      <p className="text-sm text-gray-500">
                        {selected.acCode} · {selected.commune}, {selected.district}, {selected.province}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handleApprove}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 text-white text-sm font-medium px-4 py-2 hover:bg-emerald-700"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Approve (Active)
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowReturnModal(true)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 text-red-700 text-sm font-medium px-4 py-2 hover:bg-red-50"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Return to committee
                    </button>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mt-4">
                  Read-only submitted data (illustrative). Add verification notes per section; they are stored with the approval log.
                </p>

                <div className="mt-6 space-y-4">
                  {profileSections.map((s) => (
                    <div key={s.key} className="rounded-xl border border-gray-100 bg-gray-50/40 p-4">
                      <p className="text-sm font-semibold text-gray-800">{s.title}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Submitted fields match AC registration workflow (demo). No edits permitted at verification stage.
                      </p>
                      <label className="block mt-2">
                        <span className="text-xs font-medium text-gray-600">Verification notes</span>
                        <textarea
                          value={sectionNotes[s.key] ?? ""}
                          onChange={(e) => setSectionNotes((prev) => ({ ...prev, [s.key]: e.target.value }))}
                          rows={2}
                          className="mt-1 w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white"
                          placeholder="Optional notes for this section…"
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Permanent log preview (ministry view uses same store in production) */}
              <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <History className="h-4 w-4 text-[#0F2F8F]" />
                  Verification audit log (visible to Ministry / Admin)
                </div>
                <ul className="mt-4 space-y-3 max-h-56 overflow-y-auto">
                  {log.slice(0, 6).map((row) => (
                    <li key={row.id} className="text-sm border-l-2 border-gray-200 pl-3">
                      <span className="text-xs text-gray-400">{new Date(row.at).toLocaleString()}</span>
                      <span className="mx-2 text-gray-300">·</span>
                      <span className="font-medium text-gray-800">{row.officer}</span>
                      <span
                        className={`ml-2 text-xs font-semibold uppercase ${
                          row.action === "approved" ? "text-emerald-600" : "text-red-600"
                        }`}
                      >
                        {row.action}
                      </span>
                      <p className="text-gray-700 mt-0.5">
                        {row.acName} ({row.acCode})
                      </p>
                      <p className="text-gray-500 text-xs mt-1">{row.comments}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>

      {showReturnModal && selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/45">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 border border-gray-200">
            <div className="flex items-center gap-2 text-red-700 font-semibold">
              <XCircle className="h-5 w-5" />
              Return profile to AC Committee
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Mandatory written comments explaining required corrections for <strong>{selected.acCode}</strong>.
            </p>
            <textarea
              value={returnComments}
              onChange={(e) => setReturnComments(e.target.value)}
              rows={5}
              className="mt-4 w-full text-sm border border-gray-200 rounded-lg px-3 py-2"
              placeholder="Describe required corrections…"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowReturnModal(false)}
                className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReturn}
                className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Confirm return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
