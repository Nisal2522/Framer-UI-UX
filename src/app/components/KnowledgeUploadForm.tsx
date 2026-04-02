import { useEffect, useState } from "react";
import { X, Upload, FileText, Tag } from "lucide-react";

interface KnowledgeUploadFormProps {
  onClose: () => void;
}

export function KnowledgeUploadForm({ onClose }: KnowledgeUploadFormProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const ANIM_MS = 240;

  const availableTags = [
    "Rice", "Vegetables", "Livestock", "Organic", "Climate Resilience",
    "Pest Management", "Fertilizer", "Irrigation", "Market Prices",
    "Training", "Best Practices", "Certification"
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    window.setTimeout(() => onClose(), ANIM_MS);
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
            Upload Knowledge Material
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
                    Content Type <span className="text-red-500">*</span>
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white">
                    <option value="">Select Type</option>
                    <option value="manual">User Manual</option>
                    <option value="technique">Agricultural Technique</option>
                    <option value="price">Market Price Update</option>
                    <option value="program">Government Program Announcement</option>
                    <option value="alert">Pest/Disease Alert</option>
                    <option value="video">Training Video</option>
                    <option value="guideline">Fertilizer/Seed Guideline</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Document Type <span className="text-red-500">*</span>
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white">
                    <option value="">Select Document Type</option>
                    <option value="pdf">PDF Document</option>
                    <option value="video">Video</option>
                    <option value="image">Image/Infographic</option>
                    <option value="word">Word Document</option>
                    <option value="presentation">Presentation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Crop Type
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white">
                    <option value="">All Crop Types</option>
                    <option value="rice">Rice</option>
                    <option value="vegetables">Vegetables</option>
                    <option value="fruits">Fruits</option>
                    <option value="livestock">Livestock</option>
                    <option value="mixed">Mixed Farming</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Graduation Stage
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white">
                    <option value="">All Stages</option>
                    <option value="startup">Startup</option>
                    <option value="developing">Developing</option>
                    <option value="expanding">Expanding</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">
                Tags (Select all that apply)
              </h3>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedTags.includes(tag)
                        ? "bg-[#032EA1] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <Tag className="w-3.5 h-3.5" />
                    {tag}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Selected tags: {selectedTags.length > 0 ? selectedTags.join(", ") : "None"}
              </p>
            </div>

            {/* Target Audience */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">
                Target Audience
              </h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-[#032EA1] focus:ring-[#032EA1]"
                  />
                  <span className="text-sm text-gray-700">AC Committee Members</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-[#032EA1] focus:ring-[#032EA1]"
                  />
                  <span className="text-sm text-gray-700">Commune Agricultural Officers</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-[#032EA1] focus:ring-[#032EA1]"
                  />
                  <span className="text-sm text-gray-700">All Farmer Members</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-[#032EA1] focus:ring-[#032EA1]"
                  />
                  <span className="text-sm text-gray-700">Ministry/FAO Users</span>
                </label>
              </div>
            </div>

            {/* Language */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">
                Language & Localization
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Primary Language <span className="text-red-500">*</span>
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white">
                    <option value="">Select Language</option>
                    <option value="khmer">Khmer</option>
                    <option value="english">English</option>
                    <option value="both">Bilingual (Khmer & English)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Province/Region
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white">
                    <option value="">All Provinces</option>
                    <option value="kampong-thom">Kampong Thom</option>
                    <option value="siem-reap">Siem Reap</option>
                    <option value="battambang">Battambang</option>
                    <option value="pursat">Pursat</option>
                  </select>
                </div>
              </div>
            </div>

            {/* File Upload */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">
                Upload File(s) <span className="text-red-500">*</span>
              </h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center hover:border-[#032EA1] transition-colors cursor-pointer">
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-base text-gray-700 mb-2 font-medium">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  Supported formats: PDF, Word (DOC/DOCX), Video (MP4, AVI), Images (JPG, PNG)
                </p>
                <p className="text-xs text-gray-500">
                  Maximum file size: 500MB for videos, 50MB for documents
                </p>
              </div>
              <div className="mt-3 flex items-start gap-2 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg p-3">
                <FileText className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">File Requirements:</p>
                  <ul className="mt-1 space-y-1 text-xs">
                    <li>• Videos should include Khmer subtitles when possible</li>
                    <li>• PDFs should be searchable and accessible</li>
                    <li>• Use clear, high-quality images and graphics</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Publishing Options */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                Publishing Options
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Publish Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                  />
                  <p className="text-xs text-gray-600 mt-1">Leave blank to publish immediately</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Visibility
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white">
                    <option value="public">Public (All Users)</option>
                    <option value="restricted">Restricted (Selected Roles)</option>
                    <option value="province">Province Specific</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Version Control */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">
                Version Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Version Number
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                    placeholder="e.g., 1.0, 2.1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Replaces Previous Version
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white">
                    <option value="">None (New Material)</option>
                    <option value="KM-001">KM-001 - Rice Cultivation Guide v1.0</option>
                    <option value="KM-042">KM-042 - Pest Management Manual v2.0</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Version Notes / Change Log
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none resize-none"
                    placeholder="Describe what has changed in this version (optional)"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Notification */}
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
            <button
              type="button"
              className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
            >
              Save as Draft
            </button>
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-1.5 text-sm bg-[#032EA1] text-white rounded-lg hover:bg-[#0447D4] transition-colors font-medium"
            >
              <Upload className="w-4 h-4" />
              Publish Material
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
