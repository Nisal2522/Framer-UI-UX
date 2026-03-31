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
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Land Records</h3>
              <div className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Land Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., North Rice Field"
                      className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
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
                      className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none">
                      <option value="">Select Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Certifications
                    </label>
                    <div className="relative" ref={certDropdownRef}>
                      <button
                        type="button"
                        onClick={() => setCertDropdownOpen((o) => !o)}
                        className="w-full flex items-center justify-between px-3.5 py-2 border border-gray-300 rounded-lg bg-white text-sm text-left focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                      >
                        <span className={selectedCerts.length === 0 ? "text-gray-400" : "text-gray-800"}>
                          {selectedCerts.length === 0
                            ? "Select certifications"
                            : selectedCerts.join(", ")}
                        </span>
                        <svg className={`w-4 h-4 text-gray-400 transition-transform ${certDropdownOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </button>
                      {certDropdownOpen && (
                        <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                          {certOptions.map((cert) => (
                            <label key={cert} className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-blue-50 transition-colors select-none">
                              <input
                                type="checkbox"
                                checked={selectedCerts.includes(cert)}
                                onChange={() => toggleCert(cert)}
                                className="h-4 w-4 rounded border-gray-300 accent-[#032EA1]"
                              />
                              <span className="text-sm text-gray-700">{cert}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2.5 pt-1 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 px-3.5 py-1.5 bg-blue-100 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors w-fit self-start text-sm"
                  >
                    <MapPin className="w-4 h-4" />
                    Mark the location in the map
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 px-5 py-2 bg-[#032EA1] text-white rounded-lg hover:bg-[#0447D4] transition-colors font-medium w-fit self-end sm:self-auto shrink-0 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Land
                  </button>
                </div>
              </div>

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

          {activeTab === "crops" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Crop Records</h3>
              <div className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Land Name <span className="text-red-500">*</span>
                    </label>
                    <select className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none">
                      <option value="">Select Land</option>
                      <option value="north-rice-field">North Rice Field</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Crop Name <span className="text-red-500">*</span>
                    </label>
                    <select className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none">
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
                      className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Number of Plants
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 1000 plants or 500 kg/ha"
                      className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                    />
                  </div>
                </div>
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    className="flex items-center gap-2 px-5 py-2 bg-[#032EA1] text-white rounded-lg hover:bg-[#0447D4] transition-colors font-medium text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Crop
                  </button>
                </div>
              </div>

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
                        Number of Plants
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

          {activeTab === "dossier" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Document Dossier</h3>

              <div className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Land Name</label>
                    <select className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none">
                      <option value="">Select Land</option>
                      <option value="north-rice-field">North Rice Field</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Document Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Land Certificate"
                      className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <label className="block cursor-pointer">
                  <input type="file" className="sr-only" />
                  <div className="rounded-lg border border-dashed border-slate-300 bg-white px-5 py-6 text-center hover:border-[#032EA1]/60 transition-colors">
                    <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-700">Drag and drop to upload here or select file</p>
                    <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX, JPG, PNG (Max 10MB)</p>
                  </div>
                </label>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    className="flex items-center gap-2 px-5 py-2 bg-[#032EA1] text-white rounded-lg hover:bg-[#0447D4] transition-colors font-medium text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Document
                  </button>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Document Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Land Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Upload Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        File Size
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">Land Certificate</td>
                      <td className="px-4 py-3 text-sm text-gray-700">North Rice Field</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Mar 15, 2024</td>
                      <td className="px-4 py-3 text-sm text-gray-700">2.3 MB</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button className="p-1 hover:bg-gray-200 rounded" aria-label="View document">
                            <FileText className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-1 hover:bg-gray-200 rounded" aria-label="Delete document">
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
