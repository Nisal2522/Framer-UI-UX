import { useState } from "react";
import { X, Upload, Save, FileText, Video, Image as ImageIcon, Tag } from "lucide-react";

interface KnowledgeUploadFormProps {
  onClose: () => void;
}

export function KnowledgeUploadForm({ onClose }: KnowledgeUploadFormProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

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

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-[#032EA1] to-[#0447D4]">
          <h2 className="text-2xl font-bold text-white">Upload Knowledge Material</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Form Content */}
        <div className="px-8 py-6 max-h-[calc(100vh-300px)] overflow-y-auto">
          <div className="space-y-6">
            {/* Material Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Material Information
              </h3>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Material Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                    placeholder="Enter a descriptive title for the knowledge material"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none resize-none"
                    placeholder="Provide a detailed description of the content and its purpose"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Categorization */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Categorization
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content Type <span className="text-red-500">*</span>
                  </label>
                  <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document Type <span className="text-red-500">*</span>
                  </label>
                  <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white">
                    <option value="">Select Document Type</option>
                    <option value="pdf">PDF Document</option>
                    <option value="video">Video</option>
                    <option value="image">Image/Infographic</option>
                    <option value="word">Word Document</option>
                    <option value="presentation">Presentation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Crop Type
                  </label>
                  <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white">
                    <option value="">All Crop Types</option>
                    <option value="rice">Rice</option>
                    <option value="vegetables">Vegetables</option>
                    <option value="fruits">Fruits</option>
                    <option value="livestock">Livestock</option>
                    <option value="mixed">Mixed Farming</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Graduation Stage
                  </label>
                  <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white">
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Tags (Select all that apply)
              </h3>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <button
                    key={tag}
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Language & Localization
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Language <span className="text-red-500">*</span>
                  </label>
                  <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white">
                    <option value="">Select Language</option>
                    <option value="khmer">Khmer</option>
                    <option value="english">English</option>
                    <option value="both">Bilingual (Khmer & English)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Province/Region
                  </label>
                  <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white">
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Publishing Options
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Publish Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                  />
                  <p className="text-xs text-gray-600 mt-1">Leave blank to publish immediately</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Visibility
                  </label>
                  <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white">
                    <option value="public">Public (All Users)</option>
                    <option value="restricted">Restricted (Selected Roles)</option>
                    <option value="province">Province Specific</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Version Control */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Version Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Version Number
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                    placeholder="e.g., 1.0, 2.1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Replaces Previous Version
                  </label>
                  <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white">
                    <option value="">None (New Material)</option>
                    <option value="KM-001">KM-001 - Rice Cultivation Guide v1.0</option>
                    <option value="KM-042">KM-042 - Pest Management Manual v2.0</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Version Notes / Change Log
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none resize-none"
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

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-8 py-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <div className="flex items-center gap-3">
            <button className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
              Save as Draft
            </button>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#032EA1] to-[#0447D4] text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all">
              <Upload className="w-4 h-4" />
              Publish Material
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
