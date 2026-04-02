import { useEffect, useState } from "react";
import {
  Plus,
  Users,
  Calendar,
  User,
  X,
  Trash2,
  Pencil,
} from "lucide-react";
import { committeeMemberPortraitUrl } from "../utils/committeePortraits";

interface CommitteeMember {
  id: string;
  fullName: string;
  nationalId: string;
  gender: string;
  dateOfBirth: string;
  phoneNumber: string;
  roleTitle: string;
  appointmentDate: string;
  termEndDate: string;
  email?: string;
}

interface CommitteeAssignmentRow {
  role: string;
  memberId: string;
}

const committeePeriods = [
  {
    id: "current",
    label: "Jan 15, 2024 - Dec 31, 2026",
    from: "2024-01-15",
    to: "2026-12-31",
    assignments: [
      { role: "chairman",      memberId: "1" },
      { role: "vice-chairman", memberId: "2" },
      { role: "treasurer",     memberId: "3" },
      { role: "secretary",     memberId: "4" },
      { role: "member",        memberId: "5" },
      { role: "member",        memberId: "6" },
    ],
  },
  {
    id: "2021-2023",
    label: "Jan 10, 2021 - Dec 31, 2023",
    from: "2021-01-10",
    to: "2023-12-31",
    assignments: [
      { role: "chairman",      memberId: "3" },
      { role: "vice-chairman", memberId: "1" },
      { role: "treasurer",     memberId: "4" },
      { role: "secretary",     memberId: "2" },
      { role: "auditor",       memberId: "5" },
    ],
  },
  {
    id: "2018-2020",
    label: "Jan 05, 2018 - Dec 31, 2020",
    from: "2018-01-05",
    to: "2020-12-31",
    assignments: [
      { role: "chairman",      memberId: "5" },
      { role: "vice-chairman", memberId: "3" },
      { role: "treasurer",     memberId: "6" },
      { role: "secretary",     memberId: "1" },
    ],
  },
];

export function CommitteeStructure() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editingPeriodId, setEditingPeriodId] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState("current");
  const [committeeAssignments, setCommitteeAssignments] = useState<CommitteeAssignmentRow[]>([
    { role: "", memberId: "" },
  ]);
  const [periodFrom, setPeriodFrom] = useState("");
  const [periodTo, setPeriodTo] = useState("");

  const currentCommittee: CommitteeMember[] = [
    {
      id: "1",
      fullName: "Sok Pisey",
      nationalId: "010234567",
      gender: "Male",
      dateOfBirth: "1979-03-15",
      phoneNumber: "+855 12 345 678",
      roleTitle: "Chairman",
      appointmentDate: "2024-01-15",
      termEndDate: "2026-12-31",
      email: "sok.pisey@example.com",
    },
    {
      id: "2",
      fullName: "Chea Sokha",
      nationalId: "010345678",
      gender: "Female",
      dateOfBirth: "1986-07-22",
      phoneNumber: "+855 23 456 789",
      roleTitle: "Vice Chairman",
      appointmentDate: "2024-01-15",
      termEndDate: "2026-12-31",
    },
    {
      id: "3",
      fullName: "Lim Dara",
      nationalId: "010456789",
      gender: "Male",
      dateOfBirth: "1972-11-08",
      phoneNumber: "+855 34 567 890",
      roleTitle: "Treasurer",
      appointmentDate: "2024-01-15",
      termEndDate: "2026-12-31",
    },
    {
      id: "4",
      fullName: "Pich Sophea",
      nationalId: "010567890",
      gender: "Female",
      dateOfBirth: "1990-05-30",
      phoneNumber: "+855 45 678 901",
      roleTitle: "Secretary",
      appointmentDate: "2024-01-15",
      termEndDate: "2026-12-31",
    },
    {
      id: "5",
      fullName: "Keo Sothea",
      nationalId: "010678901",
      gender: "Male",
      dateOfBirth: "1985-09-12",
      phoneNumber: "+855 56 789 012",
      roleTitle: "Member Relations Officer",
      appointmentDate: "2024-01-15",
      termEndDate: "2026-12-31",
    },
    {
      id: "6",
      fullName: "Mao Vibol",
      nationalId: "010789012",
      gender: "Male",
      dateOfBirth: "1988-02-18",
      phoneNumber: "+855 67 890 123",
      roleTitle: "Training Coordinator",
      appointmentDate: "2024-01-15",
      termEndDate: "2026-12-31",
    },
  ];

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const openAddModal = () => {
    setEditingPeriodId(null);
    setPeriodFrom("");
    setPeriodTo("");
    setCommitteeAssignments([{ role: "", memberId: "" }]);
    setShowAddModal(true);
  };

  const openEditModal = (periodId: string) => {
    const period = committeePeriods.find((p) => p.id === periodId);
    if (!period) return;
    setEditingPeriodId(periodId);
    setPeriodFrom(period.from);
    setPeriodTo(period.to);
    setCommitteeAssignments(period.assignments.map((a) => ({ ...a })));
    setShowAddModal(true);
  };

  const DRAWER_ANIM_MS = 200;

  useEffect(() => {
    if (!showAddModal) return;
    const frame = requestAnimationFrame(() => setAddModalVisible(true));
    return () => cancelAnimationFrame(frame);
  }, [showAddModal]);

  const closeAddModal = () => {
    setAddModalVisible(false);
    window.setTimeout(() => {
      setShowAddModal(false);
      setEditingPeriodId(null);
    }, DRAWER_ANIM_MS);
  };

  const addAssignmentRow = () => {
    setCommitteeAssignments((prev) => [...prev, { role: "", memberId: "" }]);
  };

  const removeAssignmentRow = (index: number) => {
    setCommitteeAssignments((prev) => prev.filter((_, i) => i !== index));
  };

  const updateAssignmentRow = (
    index: number,
    key: keyof CommitteeAssignmentRow,
    value: string
  ) => {
    setCommitteeAssignments((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [key]: value } : row))
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Committee Structure
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your cooperative's leadership and committee hierarchy
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#032EA1] text-white rounded-lg hover:bg-[#0447D4] transition-colors shadow-md"
        >
          <Plus className="w-5 h-5" />
          Add New Committee Member
        </button>
      </div>

      {/* Period Selector - Committee Version Tracking */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex items-start gap-4">
          <Calendar className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <label
              htmlFor="committee-version-history"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Committee Version History
            </label>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <select
                id="committee-version-history"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full sm:flex-1 sm:max-w-xl min-w-0 px-3 py-2.5 text-sm font-medium text-gray-900 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-[#032EA1] focus:border-[#032EA1] outline-none cursor-pointer"
                aria-label="Select committee term period"
              >
                {committeePeriods.map((period) => (
                  <option key={period.id} value={period.id}>
                    {period.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => openEditModal(selectedPeriod)}
                className="flex shrink-0 items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-medium text-[#0F2F8F] border border-[#0F2F8F]/30 rounded-lg hover:bg-[#0F2F8F] hover:text-white transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Committee Summary */}
      <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-[#032EA1] to-[#021c5e] p-3 shadow-sm">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          <div className="flex items-center justify-center gap-2 rounded-lg bg-white/12 px-3 py-2 text-white ring-1 ring-white/20">
            <Users className="h-4 w-4 opacity-90" />
            <span className="text-xs font-medium text-white/90">Total Committee Members</span>
            <span className="text-sm font-bold">{currentCommittee.length}</span>
          </div>
          <div className="flex items-center justify-center gap-2 rounded-lg bg-white/12 px-3 py-2 text-white ring-1 ring-white/20">
            <Calendar className="h-4 w-4 opacity-90" />
            <span className="text-xs font-medium text-white/90">Term Period</span>
            <span className="text-sm font-bold">2024 - 2026</span>
          </div>
          <div className="flex items-center justify-center gap-2 rounded-lg bg-white/12 px-3 py-2 text-white ring-1 ring-white/20">
            <User className="h-4 w-4 opacity-90" />
            <span className="text-xs font-medium text-white/90">Term Remaining</span>
            <span className="text-sm font-bold">22 months</span>
          </div>
        </div>
      </div>

      {/* Organizational chart — hierarchy & reporting lines */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-900">
            Committee organizational chart
          </h3>
        </div>
        <div className="p-6 overflow-x-auto">
          <div className="min-w-[720px] flex flex-col items-center gap-0">
            {(() => {
              const chair = currentCommittee[0];
              const vice = currentCommittee[1];
              const treasurer = currentCommittee[2];
              const secretary = currentCommittee[3];
              const mro = currentCommittee[4];
              const training = currentCommittee[5];

              const Node = ({
                member,
                assistant,
              }: {
                member: CommitteeMember;
                assistant?: boolean;
              }) => (
                <div
                  className={`bg-white border-2 border-[#032EA1] rounded-xl shadow-md text-center ${
                    assistant ? "w-36 px-2 py-3 border-dashed" : "w-44 px-3 py-4"
                  }`}
                >
                  <div
                    className={`mx-auto rounded-full overflow-hidden bg-gray-100 border border-gray-200 ${
                      assistant ? "w-12 h-12" : "w-16 h-16"
                    }`}
                  >
                    <img
                      src={committeeMemberPortraitUrl(member)}
                      alt={member.fullName}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-[11px] font-medium text-[#032EA1] mt-2 leading-tight">
                    {member.roleTitle}
                  </p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5 leading-snug">
                    {member.fullName}
                  </p>
                </div>
              );

              return (
                <>
                  <Node member={chair} />
                  <div className="w-px h-6 bg-gray-300" />
                  <div className="w-full max-w-2xl h-px bg-gray-300 relative">
                    <div className="absolute left-1/4 top-0 w-px h-4 bg-gray-300 -translate-x-1/2" />
                    <div className="absolute right-1/4 top-0 w-px h-4 bg-gray-300 translate-x-1/2" />
                  </div>
                  <div className="flex flex-row justify-center gap-16 w-full max-w-3xl items-start">
                    <div className="flex flex-col items-center">
                      <div className="w-px h-4 bg-gray-300" />
                      <Node member={vice} />
                      <div className="w-px h-4 bg-gray-300" />
                      <div className="flex gap-3 relative pt-2">
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-24 h-px bg-gray-300" />
                        <Node member={treasurer} />
                        <Node member={training} />
                      </div>
                      <p className="text-[10px] text-gray-500 mt-2 text-center max-w-[200px]">
                        Hanging layout: reports to Vice Chairman
                      </p>
                    </div>
                    <div className="flex flex-col items-center pt-0">
                      <div className="w-px h-4 bg-gray-300" />
                      <Node member={secretary} />
                      <div className="w-px h-4 bg-gray-300" />
                      <Node member={mro} assistant />
                      <p className="text-[10px] text-gray-500 mt-2">Assistant branch under Secretary</p>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>

      {/* Member details section removed (cards removed per UI request) */}
        </div>
      </div>

      {/* Add / Edit Committee — overlay drawer (same pattern as Usage History in Asset Management) */}
      {showAddModal && (
        <>
          <div
            className={`fixed inset-0 z-[100] bg-black/40 transition-opacity duration-200 ${
              addModalVisible ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden
            onClick={closeAddModal}
          />
          <div
            className={`fixed inset-y-0 right-0 z-[110] flex w-full max-w-2xl flex-col border-l border-gray-200 bg-gray-50 shadow-2xl transition-transform duration-200 ease-in-out ${
              addModalVisible ? "translate-x-0" : "translate-x-full"
            }`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="committee-drawer-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-gradient-to-br from-[#032EA1] to-[#021c5e] shrink-0">
              <div>
                <h2 id="committee-drawer-title" className="text-sm font-semibold text-white">
                  {editingPeriodId ? "Edit Committee" : "Add New Committee Member"}
                </h2>
                {editingPeriodId && (
                  <p className="text-xs text-white/80 mt-0.5">
                    {committeePeriods.find((p) => p.id === editingPeriodId)?.label}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={closeAddModal}
                className="p-1.5 rounded-lg hover:bg-white/15 text-white/90 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4 space-y-4">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                <p className="text-sm font-semibold text-gray-900 mb-2">Committee Period</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">From</label>
                    <input
                      type="date"
                      value={periodFrom}
                      onChange={(e) => setPeriodFrom(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                      aria-label="Committee period start date"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">To</label>
                    <input
                      type="date"
                      value={periodTo}
                      onChange={(e) => setPeriodTo(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                      aria-label="Committee period end date"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 overflow-hidden">
                {committeeAssignments.map((row, index) => (
                  <div
                    key={index}
                    className="grid border-b border-gray-200 last:border-b-0"
                    style={{ gridTemplateColumns: "2rem 1fr 1fr 2.5rem" }}
                  >
                    {/* Row number */}
                    <div className="flex items-center justify-center bg-gray-50 border-r border-gray-200 text-xs font-semibold text-gray-400 select-none">
                      {index + 1}
                    </div>

                    {/* Role */}
                    <div className="px-3 py-2.5 border-r border-gray-200">
                      <select
                        value={row.role}
                        onChange={(e) => updateAssignmentRow(index, "role", e.target.value)}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white text-sm"
                      >
                        <option value="">Role List</option>
                        <option value="chairman">Chairman</option>
                        <option value="secretary">Secretary</option>
                        <option value="treasurer">Treasurer</option>
                        <option value="auditor">Auditor</option>
                        <option value="vice-chairman">Vice Chairman</option>
                        <option value="member">Member</option>
                      </select>
                    </div>

                    {/* Member */}
                    <div className="px-3 py-2.5 border-r border-gray-200">
                      <select
                        value={row.memberId}
                        onChange={(e) => updateAssignmentRow(index, "memberId", e.target.value)}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white text-sm"
                      >
                        <option value="">Member List</option>
                        <option value="1">Sok Pisey</option>
                        <option value="2">Chea Sokha</option>
                        <option value="3">Lim Dara</option>
                        <option value="4">Pich Sophea</option>
                        <option value="5">Keo Sothea</option>
                        <option value="6">Mao Vibol</option>
                      </select>
                    </div>

                    {/* Delete button */}
                    <div className="flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeAssignmentRow(index)}
                        disabled={committeeAssignments.length === 1}
                        className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
                        aria-label={`Remove row ${index + 1}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-start">
                <button
                  type="button"
                  onClick={addAssignmentRow}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#032EA1] border border-[#032EA1]/30 rounded-lg hover:bg-[#032EA1]/5 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Row
                </button>
              </div>

              <div className="rounded-xl border border-gray-200 p-3 bg-gray-50">
                <label className="inline-flex items-center gap-3 text-sm font-medium text-gray-800">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-[#032EA1] focus:ring-[#032EA1]"
                  />
                  <span>Set Active Committee</span>
                </label>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-gray-200 bg-white flex justify-end gap-2 shrink-0">
              <button
                type="button"
                onClick={closeAddModal}
                className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-1.5 text-sm bg-[#032EA1] text-white rounded-lg hover:bg-[#0447D4] transition-colors font-medium"
              >
                {editingPeriodId ? "Update Committee" : "Submit"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}