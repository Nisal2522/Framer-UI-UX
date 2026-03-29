import { useState } from "react";
import {
  Plus,
  Users,
  Calendar,
  User,
  Edit2,
  Trash2,
  X,
  Phone,
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

export function CommitteeStructure() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("current");

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
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#032EA1] text-white rounded-lg hover:bg-[#0447D4] transition-colors shadow-md"
        >
          <Plus className="w-5 h-5" />
          Add New Committee Member
        </button>
      </div>

      {/* Period Selector - Committee Version Tracking */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex items-center gap-4">
          <Calendar className="w-5 h-5 text-gray-400" />
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Committee Version History
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white"
            >
              <option value="current">
                ✓ Current Committee (Jan 15, 2024 - Dec 31, 2026) - Active
              </option>
              <option value="2021-2023">Previous Committee (Jan 10, 2021 - Dec 31, 2023)</option>
              <option value="2018-2020">Historical Committee (Jan 05, 2018 - Dec 31, 2020)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Committee Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#032EA1] rounded-xl p-6 shadow-lg text-white">
          <Users className="w-10 h-10 opacity-80 mb-3" />
          <p className="text-sm opacity-90">Total Committee Members</p>
          <p className="text-3xl font-bold mt-2">{currentCommittee.length}</p>
        </div>
        <div className="bg-[#032EA1] rounded-xl p-6 shadow-lg text-white">
          <Calendar className="w-10 h-10 opacity-80 mb-3" />
          <p className="text-sm opacity-90">Term Period</p>
          <p className="text-2xl font-bold mt-2">2024 - 2026</p>
        </div>
        <div className="bg-[#032EA1] rounded-xl p-6 shadow-lg text-white">
          <User className="w-10 h-10 opacity-80 mb-3" />
          <p className="text-sm opacity-90">Term Remaining</p>
          <p className="text-2xl font-bold mt-2">22 months</p>
        </div>
      </div>

      {/* Organizational chart — hierarchy & reporting lines */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-900">
            Committee organizational chart
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Reporting lines and hanging branches (assistant layout). Portraits are real stock
            headshots (gender-matched); replace with your own files or cloud URLs when available.
          </p>
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

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Member details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentCommittee.map((member) => (
                <div
                  key={member.id}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex gap-3"
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-white border border-gray-200 shrink-0">
                    <img
                      src={committeeMemberPortraitUrl(member)}
                      alt={member.fullName}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-[#032EA1] font-medium">{member.roleTitle}</p>
                    <p className="font-semibold text-gray-900">{member.fullName}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {member.gender}, Age {calculateAge(member.dateOfBirth)} · {member.phoneNumber}
                    </p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button type="button" className="p-1.5 hover:bg-gray-200 rounded transition-colors">
                      <Edit2 className="w-4 h-4 text-gray-600" />
                    </button>
                    <button type="button" className="p-1.5 hover:bg-gray-200 rounded transition-colors">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Committee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8">
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 bg-[#032EA1]">
              <h2 className="text-2xl font-bold text-white">
                Add New Committee Member
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Form */}
            <div className="px-8 py-6 space-y-6 max-h-[calc(100vh-250px)] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Member <span className="text-red-500">*</span>
                  </label>
                  <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none">
                    <option value="">Select from Farmer Members</option>
                    <option value="1">Sok Pisey - ID: 010234567</option>
                    <option value="2">Chea Sokha - ID: 010345678</option>
                    <option value="3">Lim Dara - ID: 010456789</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-2">
                    Member details will be auto-populated from their farmer profile
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role Title <span className="text-red-500">*</span>
                  </label>
                  <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none">
                    <option value="">Select Role</option>
                    <option value="chairman">Chairman</option>
                    <option value="vice-chairman">Vice Chairman</option>
                    <option value="treasurer">Treasurer</option>
                    <option value="secretary">Secretary</option>
                    <option value="member-relations">Member Relations Officer</option>
                    <option value="training">Training Coordinator</option>
                    <option value="marketing">Marketing Officer</option>
                    <option value="quality-control">Quality Control Officer</option>
                    <option value="procurement">Procurement Officer</option>
                    <option value="custom">Custom Role</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="+855 XX XXX XXX"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Appointment Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Term End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Note:</strong> The new committee member will be added to the
                  current committee structure. Full member details (name, national ID, gender,
                  date of birth) will be pulled from their farmer member profile. All changes
                  are logged for audit purposes with version tracking.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-8 py-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button className="px-6 py-2.5 bg-[#032EA1] text-white rounded-lg text-sm font-medium hover:bg-[#0447D4] transition-colors">
                Add Committee Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}