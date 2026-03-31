import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Building2,
  MapPin,
  Calendar,
  Users,
  FileText,
  AlertCircle,
} from "lucide-react";

interface VerificationItemProps {
  onClose: () => void;
  acData: any;
}

function VerificationDetailModal({ onClose, acData }: VerificationItemProps) {
  const [verificationNotes, setVerificationNotes] = useState("");
  const [action, setAction] = useState<"approve" | "return" | null>(null);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-[#032EA1] to-[#0447D4]">
          <h2 className="text-2xl font-bold text-white">AC Profile Verification</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <XCircle className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 py-6 max-h-[calc(100vh-300px)] overflow-y-auto">
          <div className="space-y-6">
            {/* Status Banner */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-orange-900">
                  Pending Verification
                </p>
                <p className="text-sm text-orange-700 mt-1">
                  Submitted on {acData.submittedDate} - Please review all information carefully before approval
                </p>
              </div>
            </div>

            {/* AC Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Cooperative Information
              </h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">AC Name</p>
                    <p className="font-semibold text-gray-900">{acData.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Registration Number</p>
                    <p className="font-semibold text-gray-900">{acData.regNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">AC Type</p>
                    <p className="font-semibold text-gray-900">{acData.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Registration Date</p>
                    <p className="font-semibold text-gray-900">{acData.registrationDate}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600 mb-1">Location</p>
                    <p className="font-semibold text-gray-900">{acData.location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Contact Information
              </h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Primary Contact</p>
                    <p className="font-semibold text-gray-900">{acData.contactPerson}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Phone Number</p>
                    <p className="font-semibold text-gray-900">{acData.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email Address</p>
                    <p className="font-semibold text-gray-900">{acData.email || "Not provided"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Committee Members */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Committee Structure
              </h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Role</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Contact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {["Chairman", "Vice Chairman", "Treasurer", "Secretary"].map((role, idx) => (
                      <tr key={role}>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{role}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">Sample Name {idx + 1}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">+855 XX XXX XXX</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Verification Notes */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Verification Notes <span className="text-red-500">*</span>
              </h3>
              <textarea
                value={verificationNotes}
                onChange={(e) => setVerificationNotes(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none resize-none"
                placeholder={action === "approve" 
                  ? "Provide verification notes (optional)"
                  : "Provide detailed comments explaining why the profile needs corrections (required)"}
              ></textarea>
            </div>

            {/* Action Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Verification Decision
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setAction("approve")}
                  className={`flex items-center justify-center gap-3 p-6 border-2 rounded-lg transition-all ${
                    action === "approve"
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-200 hover:border-emerald-300"
                  }`}
                >
                  <CheckCircle className={`w-8 h-8 ${action === "approve" ? "text-emerald-600" : "text-gray-400"}`} />
                  <div className="text-left">
                    <p className={`font-semibold ${action === "approve" ? "text-emerald-900" : "text-gray-900"}`}>
                      Approve Profile
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Make AC active in system
                    </p>
                  </div>
                </button>
                <button
                  onClick={() => setAction("return")}
                  className={`flex items-center justify-center gap-3 p-6 border-2 rounded-lg transition-all ${
                    action === "return"
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:border-orange-300"
                  }`}
                >
                  <XCircle className={`w-8 h-8 ${action === "return" ? "text-orange-600" : "text-gray-400"}`} />
                  <div className="text-left">
                    <p className={`font-semibold ${action === "return" ? "text-orange-900" : "text-gray-900"}`}>
                      Return for Corrections
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Send back to AC with comments
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-8 py-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={!action || (action === "return" && !verificationNotes)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              action === "approve"
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : action === "return"
                ? "bg-orange-600 text-white hover:bg-orange-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {action === "approve" && <CheckCircle className="w-4 h-4" />}
            {action === "return" && <XCircle className="w-4 h-4" />}
            {action === "approve" ? "Approve Profile" : action === "return" ? "Return for Corrections" : "Select Action"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function VerificationQueue() {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAC, setSelectedAC] = useState<any>(null);

  const pendingVerifications = [
    {
      id: "AC-157",
      name: "Prasat Sambor Rung Roeang Modern Agricultural Cooperative",
      type: "AC",
      location: "Kampong Thom, Baray, Baray Commune",
      contactPerson: "Sok Pisey",
      phone: "+855 12 345 678",
      email: "sok.pisey@baray-ac.org",
      regNumber: "AC-157-KT-2024",
      registrationDate: "2024-02-15",
      submittedDate: "2024-03-10",
      status: "Pending",
      daysWaiting: 5,
    },
    {
      id: "AC-158",
      name: "Stoung Rice Growers Association",
      type: "AC",
      location: "Kampong Thom, Stoung, Stoung Commune",
      contactPerson: "Chea Sokha",
      phone: "+855 23 456 789",
      email: "",
      regNumber: "AC-158-KT-2024",
      registrationDate: "2024-02-20",
      submittedDate: "2024-03-12",
      status: "Pending",
      daysWaiting: 3,
    },
    {
      id: "MAC-042",
      name: "Kampong Svay Modern Agriculture Community",
      type: "MAC",
      location: "Kampong Thom, Kampong Svay, Kampong Svay Commune",
      contactPerson: "Lim Dara",
      phone: "+855 34 567 890",
      email: "lim.dara@kampong-svay.org",
      regNumber: "MAC-042-KT-2024",
      registrationDate: "2024-02-25",
      submittedDate: "2024-03-14",
      status: "Pending",
      daysWaiting: 1,
    },
  ];

  const handleViewDetails = (ac: any) => {
    setSelectedAC(ac);
    setShowDetailModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Verification Queue
          </h1>
          <p className="text-gray-600 mt-1">
            Review and verify AC profiles pending approval
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-orange-100 border border-orange-200 px-4 py-2 rounded-lg">
            <p className="text-sm text-orange-900">
              <span className="font-bold text-2xl">{pendingVerifications.length}</span> pending
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Verification</p>
              <p className="text-2xl font-bold text-orange-600 mt-2">{pendingVerifications.length}</p>
            </div>
            <Clock className="w-10 h-10 text-orange-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Verified This Month</p>
              <p className="text-2xl font-bold text-emerald-600 mt-2">42</p>
            </div>
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Returned for Corrections</p>
              <p className="text-2xl font-bold text-red-600 mt-2">8</p>
            </div>
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
        </div>
      </div>

      {/* Verification List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-900">
            Profiles Awaiting Verification
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {pendingVerifications.map((ac) => (
            <div
              key={ac.id}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#032EA1] to-[#0447D4] rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg">
                        {ac.name}
                      </h4>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-gray-600">
                          ID: {ac.regNumber}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded border border-blue-200">
                          {ac.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-15">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-600">Location</p>
                        <p className="text-sm font-medium text-gray-900">
                          {ac.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Users className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-600">Contact Person</p>
                        <p className="text-sm font-medium text-gray-900">
                          {ac.contactPerson}
                        </p>
                        <p className="text-xs text-gray-600">{ac.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Calendar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-600">Submitted</p>
                        <p className="text-sm font-medium text-gray-900">
                          {ac.submittedDate}
                        </p>
                        <p className="text-xs text-orange-600 font-medium">
                          {ac.daysWaiting} days ago
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 ml-4">
                  <button
                    onClick={() => handleViewDetails(ac)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#032EA1] to-[#0447D4] text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all"
                  >
                    <Eye className="w-4 h-4" />
                    Review & Verify
                  </button>
                  <div className="flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium border border-orange-200">
                    <Clock className="w-3 h-3" />
                    Pending
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {pendingVerifications.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            All caught up!
          </h3>
          <p className="text-gray-600">
            There are no AC profiles pending verification at this time.
          </p>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedAC && (
        <VerificationDetailModal
          onClose={() => {
            setShowDetailModal(false);
            setSelectedAC(null);
          }}
          acData={selectedAC}
        />
      )}
    </div>
  );
}
