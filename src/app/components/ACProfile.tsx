import { useEffect, useRef, useState } from "react";
import {
  Mail,
  Phone,
  CheckCircle,
  MapPin,
  Calendar,
  Edit2,
  Plus,
  FileText,
  Upload,
  Trash2,
  X,
} from "lucide-react";
import { CooperativeLocationMap } from "./CooperativeLocationMap";

/** Public asset; must use Vite base URL so GitHub Pages (`/repo/`) resolves correctly. */
const COOPERATIVE_LOGO_URL = `${import.meta.env.BASE_URL}cooperative-logo.svg`;

type DossierDocRow = {
  id: string;
  name: string;
  uploadDate: string;
  fileSize: string;
};

function formatDossierFileSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export function ACProfile() {
  const [activeTab, setActiveTab] = useState("cooperative-info");
  const [isEditing, setIsEditing] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [dossierDocs, setDossierDocs] = useState<DossierDocRow[]>([
    {
      id: "d1",
      name: "Constitution",
      uploadDate: "Mar 15, 2024",
      fileSize: "2.3 MB",
    },
    {
      id: "d2",
      name: "Meeting Minutes - 2026",
      uploadDate: "Feb 2, 2026",
      fileSize: "1.1 MB",
    },
  ]);
  const [dossierDrawerOpen, setDossierDrawerOpen] = useState(false);
  const [dossierDrawerVisible, setDossierDrawerVisible] = useState(false);
  const [dossierDocName, setDossierDocName] = useState("");
  const [dossierSelectedFile, setDossierSelectedFile] = useState<File | null>(null);
  const dossierFileInputRef = useRef<HTMLInputElement>(null);

  const DRAWER_ANIM_MS = 200;

  useEffect(() => {
    if (!dossierDrawerOpen) return;
    const frame = requestAnimationFrame(() => setDossierDrawerVisible(true));
    return () => cancelAnimationFrame(frame);
  }, [dossierDrawerOpen]);

  const closeDossierDrawer = () => {
    setDossierDrawerVisible(false);
    window.setTimeout(() => {
      setDossierDrawerOpen(false);
      setDossierDocName("");
      setDossierSelectedFile(null);
      if (dossierFileInputRef.current)
        dossierFileInputRef.current.value = "";
    }, DRAWER_ANIM_MS);
  };

  const submitDossierDocument = () => {
    if (!dossierDocName.trim() || !dossierSelectedFile) return;
    const maxBytes = 10 * 1024 * 1024;
    if (dossierSelectedFile.size > maxBytes) return;
    const uploadDate = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    setDossierDocs((prev) => [
      ...prev,
      {
        id: `d-${Date.now()}`,
        name: dossierDocName.trim(),
        uploadDate,
        fileSize: formatDossierFileSize(dossierSelectedFile.size),
      },
    ]);
    closeDossierDrawer();
  };

  return (
    <div className="space-y-6">
      {/* Profile Banner */}
      <div className="bg-gradient-to-br from-[#032EA1] to-[#021c5e] rounded-2xl p-8 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Cooperative logo (sample) */}
          <div className="relative shrink-0">
            <div className="w-32 h-32 rounded-full bg-white/20 border-4 border-white/30 flex items-center justify-center overflow-hidden">
              <img
                src={COOPERATIVE_LOGO_URL}
                alt="Prasat Sambor Rung Roeang Modern Agricultural Cooperative logo"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              type="button"
              className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
              aria-label="Change cooperative logo"
            >
              <Edit2 className="w-5 h-5 text-[#032EA1]" />
            </button>
          </div>

          {/* Info */}
          <div className="flex-1 text-white min-w-0">
            <div className="flex flex-col gap-3 mb-3">
              <h1 className="text-3xl font-bold">Prasat Sambor Rung Roeang Modern Agricultural Cooperative</h1>
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500 rounded-full shadow-sm">
                  <CheckCircle className="w-4 h-4 text-white shrink-0" />
                  <span className="text-xs font-semibold text-white">Verified</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500 rounded-full shadow-sm">
                  <span className="relative flex h-3 w-3 shrink-0">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-200 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
                  </span>
                  <span className="text-xs font-semibold text-white">Active</span>
                </div>
                <div className="inline-flex items-center px-3 py-1 bg-emerald-500 rounded-full shadow-sm">
                  <span className="text-xs font-semibold text-white">MAC</span>
                </div>
              </div>
            </div>
            
            <p className="text-sm opacity-90 mb-4 max-w-2xl">
              A community-driven agricultural cooperative focused on organic farming practices,
              sustainable agriculture, and improving the livelihoods of smallholder farmers in
              Kampong Thom province.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 min-w-0">
                <Mail className="w-4 h-4 opacity-80 shrink-0" />
                <a
                  href="mailto:baray.coop@example.com"
                  className="text-sm font-medium underline decoration-white/70 underline-offset-2 hover:decoration-white hover:text-white/95 transition-colors truncate"
                >
                  baray.coop@example.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 opacity-80" />
                <span className="text-sm">+855 12 345 678</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 opacity-80" />
                <span className="text-sm">AC-KT-2024-157</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {pendingVerification && (
        <div
          className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
          role="status"
        >
          <strong className="font-semibold">Submitted for verification.</strong> Your changes
          have been sent to the Commune Officer for review. Updates will appear after approval.
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {[
              { id: "cooperative-info", label: "Cooperative Info" },
              { id: "dossier", label: "Dossier" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "text-[#032EA1] border-b-2 border-[#032EA1]"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Cooperative Info Tab */}
          {activeTab === "cooperative-info" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Cooperative Information
                </h3>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#032EA1] text-white rounded-lg hover:bg-[#0447D4] transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  {isEditing ? "Cancel" : "Edit Information"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Address */}
                <div className="md:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        defaultValue="Kampong Thom"
                        disabled={!isEditing}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500"
                        placeholder="Address"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        defaultValue="Baray Commune"
                        disabled={!isEditing}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500"
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Zip
                      </label>
                      <input
                        type="text"
                        defaultValue="06401"
                        disabled={!isEditing}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500"
                        placeholder="Zip"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Region
                      </label>
                      <input
                        type="text"
                        defaultValue="Cambodia"
                        disabled={!isEditing}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500"
                        placeholder="Region"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Establishment Date
                  </label>
                  <input
                    type="date"
                    defaultValue="2015-06-15"
                    disabled={!isEditing}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Legal Status
                  </label>
                  <select
                    defaultValue="registered"
                    disabled={!isEditing}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500"
                  >
                    <option value="registered">Registered</option>
                    <option value="pending">Pending Registration</option>
                    <option value="renewal">Under Renewal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Primary Contact Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Sok Pisey"
                    disabled={!isEditing}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    defaultValue="+855 12 345 678"
                    disabled={!isEditing}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue="baray.coop@example.com"
                    disabled={!isEditing}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="Enter cooperative email"
                  />
                </div>

                {/* GPS Location — OpenStreetMap of Cambodia with land pin */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    GPS Location
                  </label>
                  <CooperativeLocationMap />
                  <p className="text-xs text-gray-500 mt-2">
                    Map data © OpenStreetMap contributors. Pin: Lat 12.5867° N, Lon 104.8667° E
                    (Kampong Thom area).
                  </p>
                </div>
              </div>

              {isEditing && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900">
                    <strong>Note:</strong> Changes will be submitted for verification by the
                    Commune Officer. Updates will only be displayed after verification.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setPendingVerification(true);
                      setIsEditing(false);
                    }}
                    className="mt-3 px-6 py-2.5 bg-[#032EA1] text-white rounded-lg hover:bg-[#0447D4] transition-colors font-medium"
                  >
                    Submit for Verification
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Land Tab */}
          {activeTab === "land" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Land Records</h3>

              {/* Add Land Form */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Land Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., North Rice Field"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Land Extend (Ha) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none">
                      <option value="">Select Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Certifications
                    </label>
                    <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none">
                      <option value="">Select Certification</option>
                      <option value="usda-nop">USDA-NOP</option>
                      <option value="eu">EU Organic</option>
                      <option value="jas">JAS</option>
                      <option value="global-gap">GLOBAL G.A.P.</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ref Number (Deed Number) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter deed number"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors w-fit self-start"
                  >
                    <MapPin className="w-4 h-4" />
                    Mark the location in the map
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#032EA1] text-white rounded-lg hover:bg-[#0447D4] transition-colors font-medium w-fit self-end sm:self-auto shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    Add Land
                  </button>
                </div>
              </div>

              {/* Land List */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Land Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Extend (Ha)
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Certification
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Ref Number
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">North Rice Field</td>
                      <td className="px-4 py-3 text-sm text-gray-700">5.2</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded border border-emerald-200">
                          Active
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">USDA-NOP</td>
                      <td className="px-4 py-3 text-sm text-gray-700">DEED-001-2024</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button className="p-1 hover:bg-gray-200 rounded">
                            <Edit2 className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-1 hover:bg-gray-200 rounded">
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Crops Tab */}
          {activeTab === "crops" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Crop Records</h3>

              {/* Add Crop Form */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Land Name <span className="text-red-500">*</span>
                    </label>
                    <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none">
                      <option value="">Select Land</option>
                      <option value="north-rice-field">North Rice Field</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Crop Name <span className="text-red-500">*</span>
                    </label>
                    <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none">
                      <option value="">Select Crop</option>
                      <option value="rice">Rice</option>
                      <option value="cassava">Cassava</option>
                      <option value="corn">Corn</option>
                      <option value="coconut">Coconut</option>
                      <option value="banana">Banana</option>
                      <option value="pepper">Pepper</option>
                      <option value="vegetables">Vegetables</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expected Yield <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 3.5 tons/ha"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Number of Plants/area
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 1000 plants or 500 kg/ha"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                    />
                  </div>
                </div>
                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#032EA1] text-white rounded-lg hover:bg-[#0447D4] transition-colors font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Add Crop
                  </button>
                </div>
              </div>

              {/* Crop List */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Land Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Crop Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Expected Yield
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Number of Plants/area
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">North Rice Field</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Rice</td>
                      <td className="px-4 py-3 text-sm text-gray-700">3.5 tons/ha</td>
                      <td className="px-4 py-3 text-sm text-gray-700">N/A</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button className="p-1 hover:bg-gray-200 rounded">
                            <Edit2 className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-1 hover:bg-gray-200 rounded">
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Dossier Tab */}
          {activeTab === "dossier" && (
            <div className="relative min-h-[420px] space-y-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Document Dossier</h3>
                {!dossierDrawerOpen && (
                  <button
                    type="button"
                    onClick={() => {
                      setDossierDocName("");
                      setDossierSelectedFile(null);
                      if (dossierFileInputRef.current) dossierFileInputRef.current.value = "";
                      setDossierDrawerOpen(true);
                    }}
                    className="flex items-center justify-center gap-2 px-3.5 py-1.5 bg-[#032EA1] text-white rounded-lg hover:bg-[#0447D4] transition-colors text-sm font-medium whitespace-nowrap shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    Add Document
                  </button>
                )}
              </div>

              {/* Document List */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Document Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Upload Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        File Size
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {dossierDocs.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-4 py-10 text-center text-sm text-gray-400"
                        >
                          No documents yet. Click &quot;Add Document&quot; to upload.
                        </td>
                      </tr>
                    ) : (
                      dossierDocs.map((doc) => (
                        <tr key={doc.id} className="hover:bg-blue-50/40 transition-colors">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {doc.name}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">{doc.uploadDate}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{doc.fileSize}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                className="p-1 hover:bg-gray-200 rounded"
                                aria-label="View document"
                              >
                                <FileText className="w-4 h-4 text-gray-600" />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setDossierDocs((prev) => prev.filter((d) => d.id !== doc.id))
                                }
                                className="p-1 hover:bg-gray-200 rounded"
                                aria-label="Remove document"
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Add document — overlay drawer (same pattern as Usage History) */}
              {dossierDrawerOpen && (
                <>
                  <div
                    className={`fixed inset-0 z-[100] bg-black/40 transition-opacity duration-200 ${
                      dossierDrawerVisible ? "opacity-100" : "opacity-0"
                    }`}
                    aria-hidden
                    onClick={closeDossierDrawer}
                  />
                  <div
                    className={`fixed inset-y-0 right-0 z-[110] flex w-full max-w-md flex-col border-l border-gray-200 bg-gray-50 shadow-2xl transition-transform duration-200 ease-in-out ${
                      dossierDrawerVisible ? "translate-x-0" : "translate-x-full"
                    }`}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="dossier-drawer-title"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-gradient-to-br from-[#032EA1] to-[#021c5e] shrink-0">
                      <h2
                        id="dossier-drawer-title"
                        className="text-sm font-semibold text-white"
                      >
                        Add Document
                      </h2>
                      <button
                        type="button"
                        onClick={closeDossierDrawer}
                        className="p-1.5 rounded-lg hover:bg-white/15 text-white/90 transition-colors"
                        aria-label="Close"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4 space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Document Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., Land Certificate"
                          value={dossierDocName}
                          onChange={(e) => setDossierDocName(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white"
                        />
                      </div>

                      <input
                        ref={dossierFileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx,image/jpeg,image/png,.jpg,.png"
                        className="sr-only"
                        onChange={(e) => {
                          const f = e.target.files?.[0] ?? null;
                          setDossierSelectedFile(f);
                        }}
                      />
                      <div
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            dossierFileInputRef.current?.click();
                          }
                        }}
                        onClick={() => dossierFileInputRef.current?.click()}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const f = e.dataTransfer.files?.[0];
                          if (f) setDossierSelectedFile(f);
                        }}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#032EA1] transition-colors cursor-pointer bg-white"
                      >
                        <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Drag and drop to upload here or select file
                        </p>
                        <p className="text-xs text-gray-500">
                          PDF, DOC, DOCX, JPG, PNG (Max 10MB)
                        </p>
                        {dossierSelectedFile && (
                          <p className="text-xs text-[#032EA1] font-medium mt-3 truncate px-2">
                            {dossierSelectedFile.name}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="px-5 py-3 border-t border-gray-200 bg-white flex justify-end gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={closeDossierDrawer}
                        className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={submitDossierDocument}
                        disabled={
                          !dossierDocName.trim() ||
                          !dossierSelectedFile ||
                          dossierSelectedFile.size > 10 * 1024 * 1024
                        }
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm bg-[#032EA1] text-white rounded-lg hover:bg-[#0447D4] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-4 h-4" />
                        Add Document
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
