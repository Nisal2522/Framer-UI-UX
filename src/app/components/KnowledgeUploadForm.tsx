import { useEffect, useState } from "react";
import { X, Upload, Save } from "lucide-react";
import { MultiSelectCombobox } from "./ui/multi-select";
import { SingleSelectCombobox } from "./ui/single-select";
import {
  RESOURCE_TYPE_OPTIONS,
  TOPIC_OPTIONS,
  CROP_GROUPS,
  PROVINCE_OPTIONS,
  LANGUAGE_OPTIONS,
  type ResourceType,
  type ResourceLanguage,
} from "./KnowledgeManagement";

export type KnowledgeResourceFormData = {
  title: string;
  description: string;
  resourceType: ResourceType;
  topic: string;
  cropCommodity: string[];
  province: string[];
  language: ResourceLanguage;
  organizationSource: string;
  year: number;
  /** Only set when resourceType is Video. */
  videoType?: string;
};

export const VIDEO_TYPE_OPTIONS = [
  "Training/Tutorial",
  "Field Demonstration",
  "Farmer Story/Testimonial",
  "Project Activity/Event",
  "Interview",
  "Technical Lecture",
  "Other",
];

interface KnowledgeUploadFormProps {
  onClose: () => void;
  onSave: (data: KnowledgeResourceFormData) => void;
  /** When present, the form opens pre-filled for editing an existing resource. */
  initialData?: KnowledgeResourceFormData;
}

// Illustrative option lists (prototype values; large enough to exercise the searchable picker UX)
export const AVAILABLE_TAGS = [
  "Rice", "Maize", "Cassava", "Vegetables", "Fruits", "Coffee", "Rubber", "Cashew", "Pepper",
  "Livestock", "Poultry", "Aquaculture", "Beekeeping", "Organic", "Climate Resilience",
  "Drought Management", "Flood Management", "Pest Management", "Disease Control", "Fertilizer",
  "Composting", "Irrigation", "Water Management", "Soil Health", "Seed Selection",
  "Post-Harvest Handling", "Storage", "Market Prices", "Value Addition", "Processing",
  "Packaging", "Export Standards", "Certification", "GLOBAL G.A.P.", "USDA-NOP", "EU Organic",
  "Food Safety", "Training", "Best Practices", "Financial Literacy", "Microfinance",
  "Cooperative Governance", "Gender Equity", "Youth Engagement", "Digital Tools",
  "Mobile Banking", "Supply Chain", "Cold Chain", "Renewable Energy", "Solar Drying",
  "Mechanization",
];

export const AUDIENCE_OPTIONS = [
  "AC Committee Members", "Commune Agricultural Officers", "All Farmer Members",
  "Ministry/FAO Users", "Provincial Officers", "National Admins", "MAC Committee Members",
  "Youth Farmers", "Women Farmers", "Smallholder Farmers", "Cooperative Managers",
  "Field Extension Officers", "NGO Partners", "Development Partners",
  "Private Sector Partners", "Agribusiness Investors", "Input Suppliers",
  "Financial Institutions", "Microfinance Institutions", "Insurance Providers",
  "Certification Bodies", "Research Institutions", "Universities", "Students/Trainees",
  "Media/Communications", "Local Government Officials", "District Agriculture Offices",
  "Provincial Departments of Agriculture", "Export/Import Agencies", "Logistics Providers",
  "Cold Storage Operators", "Equipment Vendors", "Seed Companies", "Fertilizer Companies",
  "Veterinary Services", "Irrigation Authorities", "Water Management Boards",
  "Climate/Weather Services", "Disaster Management Agencies", "Rural Development Agencies",
  "Gender Focal Points", "Youth Development Programs", "Community Health Workers",
  "Nutrition Program Officers", "Market Vendors/Traders", "Transport Cooperatives",
  "Village Chiefs", "Commune Councils",
];

/** Which crop group a crop belongs to, so editing a resource can pre-select the right group. */
function groupForCrop(crop: string): string {
  return CROP_GROUPS.find((g) => g.crops.includes(crop))?.name ?? "";
}

export function KnowledgeUploadForm({ onClose, onSave, initialData }: KnowledgeUploadFormProps) {
  const isEditing = Boolean(initialData);

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [resourceType, setResourceType] = useState<string>(initialData?.resourceType ?? "");
  const [videoType, setVideoType] = useState(initialData?.videoType ?? "");
  const [topic, setTopic] = useState(initialData?.topic ?? "");
  const [selectedProvinces, setSelectedProvinces] = useState<string[]>(initialData?.province ?? []);
  const [language, setLanguage] = useState<string>(initialData?.language ?? "");
  const [organizationSource, setOrganizationSource] = useState(initialData?.organizationSource ?? "");
  const [publishDate, setPublishDate] = useState(
    initialData ? `${initialData.year}-01-01` : ""
  );
  const [externalUrl, setExternalUrl] = useState("");
  const [selectedAudience, setSelectedAudience] = useState<string[]>([]);
  const [cropGroup, setCropGroup] = useState(
    initialData && initialData.cropCommodity.length > 0
      ? groupForCrop(initialData.cropCommodity[0])
      : ""
  );
  const [selectedCrops, setSelectedCrops] = useState<string[]>(initialData?.cropCommodity ?? []);
  const [isVisible, setIsVisible] = useState(false);
  const ANIM_MS = 240;

  const cropGroupOptions = CROP_GROUPS.map((g) => g.name);

  const cropOptionsForGroup =
    CROP_GROUPS.find((g) => g.name === cropGroup)?.crops ??
    Array.from(new Set(CROP_GROUPS.flatMap((g) => g.crops))).sort((a, b) => a.localeCompare(b));

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    window.setTimeout(() => onClose(), ANIM_MS);
  };

  const handleResourceTypeChange = (next: string) => {
    setResourceType(next);
    if (next !== "Video") setVideoType("");
  };

  const isValid =
    title.trim() &&
    description.trim() &&
    resourceType &&
    (resourceType !== "Video" || videoType) &&
    topic &&
    selectedProvinces.length > 0 &&
    language &&
    organizationSource.trim() &&
    (resourceType !== "Link" || externalUrl.trim());

  const handleSubmit = () => {
    if (!isValid) return;
    const year = publishDate ? new Date(publishDate).getFullYear() : new Date().getFullYear();
    onSave({
      title: title.trim(),
      description: description.trim(),
      resourceType: resourceType as ResourceType,
      topic,
      cropCommodity: selectedCrops,
      province: selectedProvinces,
      language: language as ResourceLanguage,
      organizationSource: organizationSource.trim(),
      year,
      videoType: resourceType === "Video" ? videoType || undefined : undefined,
    });
    handleClose();
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-[100] bg-black/40 transition-opacity duration-200 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden
        onClick={handleClose}
      />
      <div
        className={`fixed inset-y-0 right-0 z-[110] flex w-full max-w-2xl flex-col border-l border-gray-200 bg-gray-50 shadow-2xl transition-transform duration-200 ease-in-out ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="km-upload-drawer-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-gradient-to-br from-[#032EA1] to-[#021c5e] shrink-0">
          <h2 id="km-upload-drawer-title" className="text-sm font-semibold text-white">
            {isEditing ? "Edit Knowledge Material" : "Upload Knowledge Material"}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-lg hover:bg-white/15 text-white/90 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4">
          <div className="space-y-4">
            {/* Material Information */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">
                Material Information
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Material Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                    placeholder="Enter a descriptive title for the knowledge material"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none resize-none"
                    placeholder="Provide a detailed description of the content and its purpose"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Categorization */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">
                Categorization
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Resource Type <span className="text-red-500">*</span>
                  </label>
                  <SingleSelectCombobox
                    options={[...RESOURCE_TYPE_OPTIONS]}
                    value={resourceType}
                    onChange={handleResourceTypeChange}
                    placeholder="Select Resource Type"
                    searchPlaceholder="Search resource types..."
                    emptyText="No matching resource types."
                    allowClear={false}
                  />
                </div>
                {resourceType === "Video" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Video Type <span className="text-red-500">*</span>
                    </label>
                    <SingleSelectCombobox
                      options={VIDEO_TYPE_OPTIONS}
                      value={videoType}
                      onChange={setVideoType}
                      placeholder="Select Video Type"
                      searchPlaceholder="Search video types..."
                      emptyText="No matching video types."
                      allowClear={false}
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Topic <span className="text-red-500">*</span>
                  </label>
                  <SingleSelectCombobox
                    options={[...TOPIC_OPTIONS]}
                    value={topic}
                    onChange={setTopic}
                    placeholder="Select Topic"
                    searchPlaceholder="Search topics..."
                    emptyText="No matching topics."
                    allowClear={false}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Province / Coverage <span className="text-red-500">*</span>
                  </label>
                  <MultiSelectCombobox
                    options={[...PROVINCE_OPTIONS]}
                    selected={selectedProvinces}
                    onChange={setSelectedProvinces}
                    placeholder="Select provinces..."
                    searchPlaceholder="Search provinces..."
                    emptyText="No matching provinces."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Language <span className="text-red-500">*</span>
                  </label>
                  <SingleSelectCombobox
                    options={[...LANGUAGE_OPTIONS]}
                    value={language}
                    onChange={setLanguage}
                    placeholder="Select Language"
                    searchPlaceholder="Search languages..."
                    emptyText="No matching languages."
                    allowClear={false}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Organization / Source <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={organizationSource}
                    onChange={(e) => setOrganizationSource(e.target.value)}
                    placeholder="e.g., FAO/PEARL, MAFF, GDA"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                  />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Crop Group
                  </label>
                  <SingleSelectCombobox
                    options={cropGroupOptions}
                    value={cropGroup}
                    onChange={(next) => {
                      setCropGroup(next);
                      setSelectedCrops([]);
                    }}
                    placeholder="All groups"
                    searchPlaceholder="Search crop groups..."
                    emptyText="No matching crop groups."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Crop / Commodity
                  </label>
                  <MultiSelectCombobox
                    options={cropOptionsForGroup}
                    selected={selectedCrops}
                    onChange={setSelectedCrops}
                    placeholder="Select crops/commodities..."
                    searchPlaceholder="Search crops..."
                    emptyText="No matching crops."
                  />
                </div>
              </div>
            </div>

            {/* Target Audience */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">
                Target Audience
              </h3>
              <MultiSelectCombobox
                options={AUDIENCE_OPTIONS}
                selected={selectedAudience}
                onChange={setSelectedAudience}
                placeholder="Select target audience..."
                searchPlaceholder="Search audience..."
                emptyText="No matching audience."
              />
            </div>

            {/* File Upload — 2-box layout matching attachment */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                {resourceType === "Link" ? "Resource URL" : "Upload file"}
                <span className="text-red-500">*</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-[1.9fr_1fr] gap-4">
                {resourceType === "Link" ? (
                  <div className="border border-gray-300 rounded-lg p-4 bg-white flex flex-col justify-center min-h-[148px]">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Approved external URL
                    </label>
                    <input
                      type="url"
                      value={externalUrl}
                      onChange={(e) => setExternalUrl(e.target.value)}
                      placeholder="https://example.gov.kh/policy-document"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                    />
                    <p className="text-xs text-gray-400 mt-2">
                      Must be an approved HTTP/HTTPS link to an official or external resource.
                    </p>
                  </div>
                ) : (
                  /* Main file drop zone */
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#032EA1] transition-colors cursor-pointer bg-white flex flex-col items-center justify-center min-h-[148px]">
                    <p className="text-sm text-gray-600 font-medium">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-400 mt-1 leading-snug">
                      Supported formats: PDF, Word (DOC/DOCX), Video (MP4,
                      <br className="hidden sm:block" />
                      AVI), Images (JPG, PNG)
                    </p>
                    <p className="text-xs text-gray-400 leading-snug">
                      Maximum file size: 500MB For vedios, 50MB For documents
                    </p>
                    {isEditing && (
                      <p className="text-xs text-[#032EA1] mt-2 font-medium">
                        Leave empty to keep the currently published file.
                      </p>
                    )}
                  </div>
                )}
                {/* Thumbnail upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-[#032EA1] transition-colors cursor-pointer bg-white min-h-[148px]">
                  <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                    <span className="text-base font-light text-gray-500 leading-none">+</span>
                  </div>
                  <p className="text-sm font-medium text-gray-700">Thumbnail</p>
                  <p className="text-xs text-gray-400 mt-0.5">JPG, PNG (Max</p>
                  <p className="text-xs text-gray-400">5MB)</p>
                </div>
              </div>
            </div>

            {/* Publishing Options */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                Publishing Options
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Publish Date
                  </label>
                  <input
                    type="date"
                    value={publishDate}
                    onChange={(e) => setPublishDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Notification — only relevant when publishing something new */}
            {!isEditing && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    className="w-4 h-4 mt-1 rounded border-gray-300 text-[#032EA1] focus:ring-[#032EA1]"
                  />
                  <div>
                    <p className="text-sm font-medium text-green-900">
                      Send notification to target audience
                    </p>
                    <p className="text-xs text-green-700 mt-1">
                      Users will receive an email and in-app notification about this new material
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="px-5 py-3 border-t border-gray-200 bg-white flex flex-wrap items-center justify-between gap-2 shrink-0">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <div className="flex flex-wrap items-center justify-end gap-2">
            {!isEditing && (
              <button
                type="button"
                className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
              >
                Save as Draft
              </button>
            )}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isValid}
              className="flex items-center gap-2 px-4 py-1.5 text-sm bg-[#032EA1] text-white rounded-lg hover:bg-[#0447D4] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEditing ? <Save className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
              {isEditing ? "Save Changes" : "Publish Material"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
