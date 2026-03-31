import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Plus,
  MapPin,
  Edit2,
  Trash2,
  Upload,
  FileText,
  Camera,
  User,
  X,
} from "lucide-react";
import { useNavigate, useLocation, useParams } from "react-router";
import { farmerMemberPortraitUrl } from "../utils/committeePortraits";

type MemberTab = "profile" | "land" | "crops" | "dossier";

type MemberData = {
  id: string;
  fullName: string;
  nationalId: string;
  gender: string;
  dateOfBirth: string;
  age: number;
  village: string;
  phone: string;
  landArea: number;
  crops: string[];
  livestock: { type: string; count: number }[];
  membershipStartDate: string;
  status: string;
};

type FormData = {
  nameWithInitial: string;
  fullName: string;
  fixedPhone: string;
  mobilePhone: string;
  nicPpNo: string;
  address: string;
  country: string;
  city: string;
  fieldOfficer: string;
  gender: string;
  contactPerson: string;
  contactPersonPhone: string;
};

export function Member360Form() {
  const navigate = useNavigate();
  const location = useLocation();
  const { memberId } = useParams();
  
  const memberData = location.state?.member as MemberData | undefined;
  const isEditMode = !!memberId && !!memberData;

  const [activeTab, setActiveTab] = useState<MemberTab>("profile");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const certOptions = ["USDA-NOP", "EU Organic", "JAS", "GLOBAL G.A.P."];
  const [selectedCerts, setSelectedCerts] = useState<string[]>([]);
  const [certDropdownOpen, setCertDropdownOpen] = useState(false);

  type LandRow = { name: string; extend: string; status: string; certifications: string[] };
  const EMPTY_LAND: LandRow = { name: "", extend: "", status: "", certifications: [] };
  const [landRows, setLandRows] = useState<LandRow[]>(
    isEditMode ? [{ name: "North Rice Field", extend: "5.2", status: "Active", certifications: ["USDA-NOP"] }] : []
  );
  const [landPanelOpen, setLandPanelOpen] = useState(false);
  const [landEditRow, setLandEditRow] = useState<number | null>(null);
  const [landForm, setLandForm] = useState<LandRow>(EMPTY_LAND);

  type CropRow = { landName: string; cropName: string; yield: string; plants: string };
  const EMPTY_CROP: CropRow = { landName: "", cropName: "", yield: "", plants: "" };
  const [cropRows, setCropRows] = useState<CropRow[]>(
    isEditMode ? [{ landName: "North Rice Field", cropName: "Rice", yield: "3.5 tons/ha", plants: "N/A" }] : []
  );
  const [cropPanelOpen, setCropPanelOpen] = useState(false);
  const [cropEditRow, setCropEditRow] = useState<number | null>(null);
  const [cropForm, setCropForm] = useState<CropRow>(EMPTY_CROP);

  type DocRow = { docName: string; landName: string; uploadDate: string; fileSize: string; fileName: string };
  const EMPTY_DOC: DocRow = { docName: "", landName: "", uploadDate: "", fileSize: "", fileName: "" };
  const [docRows, setDocRows] = useState<DocRow[]>(
    isEditMode ? [{ docName: "Land Certificate", landName: "North Rice Field", uploadDate: "Mar 15, 2024", fileSize: "2.3 MB", fileName: "land_certificate.pdf" }] : []
  );
  const [docPanelOpen, setDocPanelOpen] = useState(false);
  const [docEditRow, setDocEditRow] = useState<number | null>(null);
  const [docForm, setDocForm] = useState<DocRow>(EMPTY_DOC);
  const certDropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (certDropdownRef.current && !certDropdownRef.current.contains(e.target as Node)) {
        setCertDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const toggleCert = (cert: string) =>
    setSelectedCerts((prev) => prev.includes(cert) ? prev.filter((c) => c !== cert) : [...prev, cert]);
  
  const [formData, setFormData] = useState<FormData>({
    nameWithInitial: "",
    fullName: "",
    fixedPhone: "",
    mobilePhone: "",
    nicPpNo: "",
    address: "",
    country: "",
    city: "",
    fieldOfficer: "",
    gender: "",
    contactPerson: "",
    contactPersonPhone: "",
  });

  useEffect(() => {
    if (isEditMode && memberData) {
      const nameParts = memberData.fullName.split(" ");
      const initials = nameParts.map(p => p[0]).join(". ") + ".";
      
      setFormData({
        nameWithInitial: `${initials} ${nameParts[nameParts.length - 1]}`,
        fullName: memberData.fullName,
        fixedPhone: "",
        mobilePhone: memberData.phone,
        nicPpNo: memberData.nationalId,
        address: memberData.village,
        country: "Cambodia",
        city: memberData.village.replace(" Village", ""),
        fieldOfficer: "",
        gender: memberData.gender.toLowerCase(),
        contactPerson: "",
        contactPersonPhone: "",
      });
      
      setProfileImage(farmerMemberPortraitUrl(memberData));
    }
  }, [isEditMode, memberData]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeImage = () => {
    setProfileImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode ? "Edit Member Profile" : "Member Profile"}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditMode 
              ? `Update profile for ${memberData?.fullName}` 
              : "Create a complete member profile with land and crop details."}
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/dashboard/farmer-members")}
          className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Members
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {[
              { id: "profile" as const, label: "Profile" },
              { id: "land" as const, label: "Land" },
              { id: "crops" as const, label: "Crops" },
              { id: "dossier" as const, label: "Dossier" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
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
          {activeTab === "profile" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Profile Records</h3>
              
              <div className="flex gap-6">
                {/* Profile Image Upload - 1/4 width */}
                <div className="w-1/4 flex-shrink-0">
                  <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-[#032EA1] to-[#021c5e] p-5 shadow-sm h-full">
                    <p className="mb-4 text-sm font-semibold text-white text-center">Profile Photo</p>
                    
                    <div
                      className={`relative mx-auto w-40 h-40 rounded-full overflow-hidden border-2 border-dashed transition-all duration-200 ${
                        isDragging
                          ? "border-[#032EA1] bg-blue-50 scale-105"
                          : profileImage
                          ? "border-transparent"
                          : "border-slate-300 hover:border-[#032EA1]/60"
                      }`}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                    >
                      {profileImage ? (
                        <>
                          <img
                            src={profileImage}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 hover:from-slate-50 hover:to-slate-100 transition-all cursor-pointer"
                        >
                          <div className="w-16 h-16 rounded-full bg-white shadow-inner flex items-center justify-center mb-2">
                            <User className="w-8 h-8 text-slate-400" />
                          </div>
                          <Camera className="w-5 h-5 text-slate-500" />
                        </button>
                      )}
                    </div>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file);
                      }}
                    />
                    
                    <div className="mt-4 text-center">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#032EA1] bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                        {profileImage ? "Change Photo" : "Upload Photo"}
                      </button>
                      <p className="text-xs text-slate-500 mt-2">
                        JPG, PNG or GIF
                        <br />
                        Max 5MB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Form Fields - 3/4 width */}
                <div className="flex-1 space-y-4">
                  <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 shadow-sm">
                    <p className="mb-3 text-sm font-semibold text-slate-800">Identity & Contacts</p>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">
                          Name w/ initial <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Enter name with initials"
                          value={formData.nameWithInitial}
                          onChange={(e) => handleInputChange("nameWithInitial", e.target.value)}
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[#032EA1] outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Enter full name"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange("fullName", e.target.value)}
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[#032EA1] outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">Phone No</label>
                        <input
                          type="tel"
                          placeholder="Enter mobile phone"
                          value={formData.mobilePhone}
                          onChange={(e) => handleInputChange("mobilePhone", e.target.value)}
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[#032EA1] outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">NIC/PP No</label>
                        <input
                          type="text"
                          placeholder="Enter NIC/PP number"
                          value={formData.nicPpNo}
                          onChange={(e) => handleInputChange("nicPpNo", e.target.value)}
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[#032EA1] outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">Gender</label>
                        <select
                          value={formData.gender}
                          onChange={(e) => handleInputChange("gender", e.target.value)}
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[#032EA1] outline-none"
                        >
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 shadow-sm">
                    <p className="mb-3 text-sm font-semibold text-slate-800">Location & Reference</p>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">Address <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          placeholder="Enter address"
                          value={formData.address}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[#032EA1] outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">City</label>
                        <input
                          type="text"
                          placeholder="Enter city"
                          value={formData.city}
                          onChange={(e) => handleInputChange("city", e.target.value)}
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[#032EA1] outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">Zip</label>
                        <input
                          type="text"
                          placeholder="Enter zip code"
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[#032EA1] outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">Country</label>
                        <input
                          type="text"
                          placeholder="Enter country"
                          value={formData.country}
                          onChange={(e) => handleInputChange("country", e.target.value)}
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[#032EA1] outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "land" && (
            <div className="flex gap-0 min-h-[420px]">
              {/* ── Master: Table ── */}
              <div className={`flex flex-col transition-all duration-300 ${landPanelOpen ? "w-[55%]" : "w-full"}`}>
                <div className="flex items-center justify-between pb-3">
                  <h3 className="text-base font-semibold text-gray-900">Land Records</h3>
                  {!landPanelOpen && (
                    <button
                      type="button"
                      onClick={() => { setLandEditRow(null); setLandForm(EMPTY_LAND); setLandPanelOpen(true); }}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#032EA1] text-white rounded-lg hover:bg-[#0447D4] transition-colors text-sm font-medium"
                    >
                      <Plus className="w-4 h-4" /> Add Land
                    </button>
                  )}
                </div>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex-1">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Land Name</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Extend (Ha)</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Certification</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {landRows.map((row, i) => (
                        <tr
                          key={i}
                          className={`hover:bg-blue-50/40 cursor-pointer transition-colors ${landEditRow === i && landPanelOpen ? "bg-blue-50" : ""}`}
                          onClick={() => { setLandEditRow(i); setLandForm({ ...row }); setLandPanelOpen(true); }}
                        >
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{row.extend}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded border ${row.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-gray-100 text-gray-600 border-gray-200"}`}>
                              {row.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{row.certifications.join(", ") || "—"}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                              <button className="p-1.5 rounded hover:bg-blue-100 text-[#032EA1] transition-colors" onClick={() => { setLandEditRow(i); setLandForm({ ...row }); setLandPanelOpen(true); }}>
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button className="p-1.5 rounded hover:bg-red-100 text-red-500 transition-colors" onClick={() => setLandRows((prev) => prev.filter((_, idx) => idx !== i))}>
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {landRows.length === 0 && (
                        <tr><td colSpan={5} className="px-4 py-10 text-center text-sm text-gray-400">No land records yet. Click "Add Land" to get started.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ── Detail: Sidebar form ── */}
              {landPanelOpen && (
                <div className="w-[45%] border-l border-gray-200 bg-gray-50 flex flex-col rounded-r-lg">
                  <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-white rounded-tr-lg">
                    <h4 className="text-sm font-semibold text-gray-800">{landEditRow !== null ? "Edit Land Record" : "New Land Record"}</h4>
                    <button onClick={() => { setLandPanelOpen(false); setLandEditRow(null); setLandForm(EMPTY_LAND); }} className="p-1 rounded hover:bg-gray-100 text-gray-400">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Land Name <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="e.g., North Rice Field" value={landForm.name} onChange={(e) => setLandForm((f) => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Land Extend (Ha) <span className="text-red-500">*</span></label>
                      <input type="number" step="0.01" placeholder="0.00" value={landForm.extend} onChange={(e) => setLandForm((f) => ({ ...f, extend: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Status <span className="text-red-500">*</span></label>
                      <select value={landForm.status} onChange={(e) => setLandForm((f) => ({ ...f, status: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white">
                        <option value="">Select Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Certifications</label>
                      <div className="relative" ref={certDropdownRef}>
                        <button type="button" onClick={() => setCertDropdownOpen((o) => !o)} className="w-full flex items-center justify-between px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#032EA1] outline-none text-left">
                          <span className={landForm.certifications.length === 0 ? "text-gray-400" : "text-gray-800 truncate"}>
                            {landForm.certifications.length === 0 ? "Select certifications" : landForm.certifications.join(", ")}
                          </span>
                          <svg className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${certDropdownOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </button>
                        {certDropdownOpen && (
                          <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                            {certOptions.map((cert) => (
                              <label key={cert} className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-blue-50 transition-colors select-none">
                                <input type="checkbox" checked={landForm.certifications.includes(cert)} onChange={() => setLandForm((f) => ({ ...f, certifications: f.certifications.includes(cert) ? f.certifications.filter((c) => c !== cert) : [...f.certifications, cert] }))} className="h-4 w-4 rounded border-gray-300 accent-[#032EA1]" />
                                <span className="text-sm text-gray-700">{cert}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <button type="button" className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-xs font-medium w-fit">
                      <MapPin className="w-3.5 h-3.5" /> Mark location on map
                    </button>
                  </div>
                  <div className="px-5 py-3 border-t border-gray-200 bg-white flex justify-end gap-2 rounded-br-lg">
                    <button type="button" onClick={() => { setLandPanelOpen(false); setLandEditRow(null); setLandForm(EMPTY_LAND); }} className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">Cancel</button>
                    <button type="button" onClick={() => { if (landEditRow !== null) { setLandRows((prev) => prev.map((r, i) => i === landEditRow ? { ...landForm } : r)); } else { setLandRows((prev) => [...prev, { ...landForm }]); } setLandPanelOpen(false); setLandEditRow(null); setLandForm(EMPTY_LAND); }} className="px-4 py-1.5 text-sm bg-[#032EA1] text-white rounded-lg hover:bg-[#0447D4] transition-colors font-medium">
                      {landEditRow !== null ? "Update" : "Add Land"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "crops" && (
            <div className="flex gap-0 min-h-[420px]">
              {/* ── Master: Table ── */}
              <div className={`flex flex-col transition-all duration-300 ${cropPanelOpen ? "w-[55%]" : "w-full"}`}>
                <div className="flex items-center justify-between pb-3">
                  <h3 className="text-base font-semibold text-gray-900">Crop Records</h3>
                  {!cropPanelOpen && (
                    <button type="button" onClick={() => { setCropEditRow(null); setCropForm(EMPTY_CROP); setCropPanelOpen(true); }} className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#032EA1] text-white rounded-lg hover:bg-[#0447D4] transition-colors text-sm font-medium">
                      <Plus className="w-4 h-4" /> Add Crop
                    </button>
                  )}
                </div>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex-1">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Land Name</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Crop Name</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Expected Yield / Year</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">No. of Plants</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {cropRows.map((row, i) => (
                        <tr key={i} className={`hover:bg-blue-50/40 cursor-pointer transition-colors ${cropEditRow === i && cropPanelOpen ? "bg-blue-50" : ""}`} onClick={() => { setCropEditRow(i); setCropForm({ ...row }); setCropPanelOpen(true); }}>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.landName}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{row.cropName}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{row.yield}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{row.plants || "—"}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                              <button className="p-1.5 rounded hover:bg-blue-100 text-[#032EA1] transition-colors" onClick={() => { setCropEditRow(i); setCropForm({ ...row }); setCropPanelOpen(true); }}><Edit2 className="w-3.5 h-3.5" /></button>
                              <button className="p-1.5 rounded hover:bg-red-100 text-red-500 transition-colors" onClick={() => setCropRows((prev) => prev.filter((_, idx) => idx !== i))}><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {cropRows.length === 0 && (
                        <tr><td colSpan={5} className="px-4 py-10 text-center text-sm text-gray-400">No crop records yet. Click "Add Crop" to get started.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ── Detail: Sidebar form ── */}
              {cropPanelOpen && (
                <div className="w-[45%] border-l border-gray-200 bg-gray-50 flex flex-col rounded-r-lg">
                  <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-white rounded-tr-lg">
                    <h4 className="text-sm font-semibold text-gray-800">{cropEditRow !== null ? "Edit Crop Record" : "New Crop Record"}</h4>
                    <button onClick={() => { setCropPanelOpen(false); setCropEditRow(null); setCropForm(EMPTY_CROP); }} className="p-1 rounded hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Land Name <span className="text-red-500">*</span></label>
                      <select value={cropForm.landName} onChange={(e) => setCropForm((f) => ({ ...f, landName: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white">
                        <option value="">Select Land</option>
                        {landRows.map((l) => <option key={l.name} value={l.name}>{l.name}</option>)}
                        <option value="North Rice Field">North Rice Field</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Crop Name <span className="text-red-500">*</span></label>
                      <select value={cropForm.cropName} onChange={(e) => setCropForm((f) => ({ ...f, cropName: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white">
                        <option value="">Select Crop</option>
                        {["Rice","Cassava","Corn","Coconut","Banana","Pepper","Vegetables"].map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Expected Yield Per Year <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="e.g., 3.5 tons/ha" value={cropForm.yield} onChange={(e) => setCropForm((f) => ({ ...f, yield: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Number of Plants</label>
                      <input type="text" placeholder="e.g., 1000 plants or 500 kg/ha" value={cropForm.plants} onChange={(e) => setCropForm((f) => ({ ...f, plants: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white" />
                    </div>
                  </div>
                  <div className="px-5 py-3 border-t border-gray-200 bg-white flex justify-end gap-2 rounded-br-lg">
                    <button type="button" onClick={() => { setCropPanelOpen(false); setCropEditRow(null); setCropForm(EMPTY_CROP); }} className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">Cancel</button>
                    <button type="button" onClick={() => { if (cropEditRow !== null) { setCropRows((prev) => prev.map((r, i) => i === cropEditRow ? { ...cropForm } : r)); } else { setCropRows((prev) => [...prev, { ...cropForm }]); } setCropPanelOpen(false); setCropEditRow(null); setCropForm(EMPTY_CROP); }} className="px-4 py-1.5 text-sm bg-[#032EA1] text-white rounded-lg hover:bg-[#0447D4] transition-colors font-medium">
                      {cropEditRow !== null ? "Update" : "Add Crop"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "dossier" && (
            <div className="flex gap-0 min-h-[420px]">
              {/* ── Master: Table ── */}
              <div className={`flex flex-col transition-all duration-300 ${docPanelOpen ? "w-[55%]" : "w-full"}`}>
                <div className="flex items-center justify-between pb-3">
                  <h3 className="text-base font-semibold text-gray-900">Document Dossier</h3>
                  {!docPanelOpen && (
                    <button type="button" onClick={() => { setDocEditRow(null); setDocForm(EMPTY_DOC); setDocPanelOpen(true); }} className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#032EA1] text-white rounded-lg hover:bg-[#0447D4] transition-colors text-sm font-medium">
                      <Plus className="w-4 h-4" /> Add Document
                    </button>
                  )}
                </div>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex-1">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Document Name</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Land Name</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Upload Date</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">File Size</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {docRows.map((row, i) => (
                        <tr key={i} className={`hover:bg-blue-50/40 cursor-pointer transition-colors ${docEditRow === i && docPanelOpen ? "bg-blue-50" : ""}`} onClick={() => { setDocEditRow(i); setDocForm({ ...row }); setDocPanelOpen(true); }}>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            <div className="flex items-center gap-2"><FileText className="w-4 h-4 text-[#032EA1] shrink-0" />{row.docName}</div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{row.landName || "—"}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{row.uploadDate || "—"}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{row.fileSize || "—"}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                              <button className="p-1.5 rounded hover:bg-blue-100 text-[#032EA1] transition-colors" onClick={() => { setDocEditRow(i); setDocForm({ ...row }); setDocPanelOpen(true); }}><Edit2 className="w-3.5 h-3.5" /></button>
                              <button className="p-1.5 rounded hover:bg-red-100 text-red-500 transition-colors" onClick={() => setDocRows((prev) => prev.filter((_, idx) => idx !== i))}><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {docRows.length === 0 && (
                        <tr><td colSpan={5} className="px-4 py-10 text-center text-sm text-gray-400">No documents yet. Click "Add Document" to upload one.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ── Detail: Sidebar form ── */}
              {docPanelOpen && (
                <div className="w-[45%] border-l border-gray-200 bg-gray-50 flex flex-col rounded-r-lg">
                  <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-white rounded-tr-lg">
                    <h4 className="text-sm font-semibold text-gray-800">{docEditRow !== null ? "Edit Document" : "New Document"}</h4>
                    <button onClick={() => { setDocPanelOpen(false); setDocEditRow(null); setDocForm(EMPTY_DOC); }} className="p-1 rounded hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Document Name <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="e.g., Land Certificate" value={docForm.docName} onChange={(e) => setDocForm((f) => ({ ...f, docName: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Land Name</label>
                      <select value={docForm.landName} onChange={(e) => setDocForm((f) => ({ ...f, landName: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white">
                        <option value="">Select Land</option>
                        {landRows.map((l) => <option key={l.name} value={l.name}>{l.name}</option>)}
                        <option value="North Rice Field">North Rice Field</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">File</label>
                      <label className="block cursor-pointer">
                        <input type="file" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; if (f) setDocForm((prev) => ({ ...prev, fileName: f.name, fileSize: `${(f.size / 1024 / 1024).toFixed(1)} MB` })); }} />
                        <div className="rounded-lg border border-dashed border-slate-300 bg-white px-4 py-5 text-center hover:border-[#032EA1]/60 transition-colors">
                          <Upload className="w-6 h-6 mx-auto text-gray-400 mb-1.5" />
                          {docForm.fileName ? (
                            <p className="text-sm font-medium text-[#032EA1]">{docForm.fileName}</p>
                          ) : (
                            <>
                              <p className="text-sm text-gray-600">Drag & drop or click to select</p>
                              <p className="text-xs text-gray-400 mt-0.5">PDF, DOC, DOCX, JPG, PNG (Max 10MB)</p>
                            </>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>
                  <div className="px-5 py-3 border-t border-gray-200 bg-white flex justify-end gap-2 rounded-br-lg">
                    <button type="button" onClick={() => { setDocPanelOpen(false); setDocEditRow(null); setDocForm(EMPTY_DOC); }} className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">Cancel</button>
                    <button type="button" onClick={() => { const now = new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }); const entry = { ...docForm, uploadDate: docForm.uploadDate || now }; if (docEditRow !== null) { setDocRows((prev) => prev.map((r, i) => i === docEditRow ? entry : r)); } else { setDocRows((prev) => [...prev, entry]); } setDocPanelOpen(false); setDocEditRow(null); setDocForm(EMPTY_DOC); }} className="px-4 py-1.5 text-sm bg-[#032EA1] text-white rounded-lg hover:bg-[#0447D4] transition-colors font-medium">
                      {docEditRow !== null ? "Update" : "Add Document"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={() => navigate("/dashboard/farmer-members")}
            className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <div className="flex items-center gap-3">
            {activeTab === "profile" && (
              <button
                type="button"
                onClick={() => setActiveTab("land")}
                className="px-6 py-2 bg-[#032EA1] text-white rounded-lg text-sm font-medium hover:bg-[#0447D4] transition-colors"
              >
                {isEditMode ? "Update Member" : "Save & Next"}
              </button>
            )}
            {activeTab === "land" && (
              <button
                type="button"
                onClick={() => setActiveTab("crops")}
                className="px-6 py-2 bg-[#032EA1] text-white rounded-lg text-sm font-medium hover:bg-[#0447D4] transition-colors"
              >
                Next
              </button>
            )}
            {activeTab === "crops" && (
              <button
                type="button"
                onClick={() => setActiveTab("dossier")}
                className="px-6 py-2 bg-[#032EA1] text-white rounded-lg text-sm font-medium hover:bg-[#0447D4] transition-colors"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
