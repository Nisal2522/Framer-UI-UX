import { useState, useMemo } from "react";
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  FileText,
  Calendar,
  Tag,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { KnowledgeUploadForm } from "./KnowledgeUploadForm";

type KnowledgeMaterial = {
  id: string;
  title: string;
  description: string;
  contentType: string;
  documentType: string;
  targetCrop: string;
  uploadDate: string;
  uploadedBy: string;
  uploaderRole: string;
  status: string;
  downloads: number;
  views: number;
  fileSize: string;
  tags: string[];
  /** "image" | "pdf" | "video" */
  coverKind: "image" | "pdf" | "video";
  coverImageUrl?: string;
  /** Second pill (e.g. stage / audience) */
  stagePill: string;
};

const materials: KnowledgeMaterial[] = [
  {
    id: "KM-001",
    title: "Farm Irrigation Visual Guide",
    description:
      "Comprehensive guide for organic rice cultivation techniques and pest management",
    contentType: "Agricultural Techniques",
    documentType: "PDF Document",
    targetCrop: "Rice",
    uploadDate: "2024-03-21",
    uploadedBy: "Extension Media Unit",
    uploaderRole: "Agricultural Officer",
    status: "Published",
    downloads: 234,
    views: 764,
    fileSize: "1.3 MB",
    tags: ["Irrigation", "Visual", "Guide"],
    coverKind: "image",
    coverImageUrl:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&h=400&q=80",
    stagePill: "Developing",
  },
  {
    id: "KM-002",
    title: "Market Price Analysis - March 2024",
    description:
      "Monthly analysis of agricultural commodity prices across Cambodia including rice, cassava, and vegetables",
    contentType: "Market Price Update",
    documentType: "PDF Document",
    targetCrop: "All Crop Types",
    uploadDate: "2024-03-01",
    uploadedBy: "Ministry Committee",
    uploaderRole: "Ministry Committee",
    status: "Published",
    downloads: 456,
    views: 1204,
    fileSize: "890 KB",
    tags: ["Market Prices", "Rice", "Vegetables"],
    coverKind: "pdf",
    stagePill: "All Stages",
  },
  {
    id: "KM-003",
    title: "Organic Fertilizer Production Training",
    description:
      "Step-by-step video tutorial on producing organic compost and bio-fertilizers for sustainable farming",
    contentType: "Training Video",
    documentType: "Video",
    targetCrop: "All Crop Types",
    uploadDate: "2024-02-20",
    uploadedBy: "Training Coordinator",
    uploaderRole: "FAO/PEARL Officer",
    status: "Published",
    downloads: 189,
    views: 542,
    fileSize: "124 MB",
    tags: ["Training", "Fertilizer", "Organic"],
    coverKind: "image",
    coverImageUrl:
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=600&h=400&q=80",
    stagePill: "All Stages",
  },
  {
    id: "KM-004",
    title: "Pest Management Alert: Brown Planthopper",
    description:
      "Emergency alert and prevention measures for brown planthopper outbreak affecting northern provinces",
    contentType: "Pest/Disease Alert",
    documentType: "PDF Document",
    targetCrop: "Rice",
    uploadDate: "2024-03-22",
    uploadedBy: "Plant Protection Office",
    uploaderRole: "Agricultural Officer",
    status: "Published",
    downloads: 678,
    views: 2103,
    fileSize: "420 KB",
    tags: ["Pest Management", "Rice", "Alert"],
    coverKind: "pdf",
    stagePill: "Developing",
  },
  {
    id: "KM-005",
    title: "FOMMP User Manual - AC Module",
    description:
      "Complete user manual for Agricultural Cooperatives covering all platform features and functions",
    contentType: "User Manual",
    documentType: "PDF Document",
    targetCrop: "All Crop Types",
    uploadDate: "2024-01-15",
    uploadedBy: "System Administrator",
    uploaderRole: "FAO/PEARL Officer",
    status: "Published",
    downloads: 523,
    views: 892,
    fileSize: "3.1 MB",
    tags: ["Training", "Best Practices"],
    coverKind: "pdf",
    stagePill: "All Stages",
  },
  {
    id: "KM-006",
    title: "Government Subsidy Program 2024",
    description:
      "Official announcement and application guidelines for the 2024 agricultural subsidy program",
    contentType: "Government Program Announcement",
    documentType: "PDF Document",
    targetCrop: "All Crop Types",
    uploadDate: "2024-03-10",
    uploadedBy: "Ministry Committee",
    uploaderRole: "Ministry Committee",
    status: "Published",
    downloads: 892,
    views: 1567,
    fileSize: "560 KB",
    tags: ["Training", "Certification"],
    coverKind: "image",
    coverImageUrl:
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=600&h=400&q=80",
    stagePill: "Developing",
  },
];

function mediaLabel(m: KnowledgeMaterial): string {
  if (m.documentType.includes("PDF")) return "PDF Document";
  if (m.documentType.includes("Video")) return "Video";
  return "Image";
}

export function KnowledgeManagement() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMaterials = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return materials;
    return materials.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.tags.some((t) => t.toLowerCase().includes(q)) ||
        m.contentType.toLowerCase().includes(q)
    );
  }, [searchTerm]);

  return (
    <div className="space-y-6 min-w-0 max-w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Knowledge Hub</h1>
          <p className="text-gray-600 mt-1">
            Centralized digital library for agricultural knowledge and resources
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#032EA1] text-white rounded-lg hover:bg-[#0447D4] transition-colors shadow-md shrink-0"
        >
          <Plus className="w-5 h-5" />
          Upload Material
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Materials</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">127</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-emerald-600 mt-2">↑ 12% from last month</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Downloads</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">3,972</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Download className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <p className="text-sm text-emerald-600 mt-2">↑ 23% from last month</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">847</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-emerald-600 mt-2">↑ 8% from last month</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Rating</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">4.7</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">Out of 5 stars</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search materials by title, description, or tags..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
            />
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Materials — card grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredMaterials.map((material) => (
          <article
            key={material.id}
            className="flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md hover:border-gray-300/80 transition-shadow"
          >
            {/* Media */}
            <div className="relative aspect-[4/3] w-full bg-gray-100 shrink-0 overflow-hidden rounded-t-xl">
              {material.coverKind === "pdf" ? (
                <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-red-600 to-red-700">
                  <FileText className="w-16 h-16 text-white opacity-95" strokeWidth={1.5} />
                </div>
              ) : material.coverImageUrl ? (
                <img
                  src={material.coverImageUrl}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                  <BookOpen className="w-14 h-14 text-gray-500" />
                </div>
              )}
            </div>

            <div className="flex flex-col flex-1 p-4 sm:p-5">
              <h2 className="text-base sm:text-lg font-bold text-[#032EA1] leading-snug line-clamp-2">
                {material.title}
              </h2>
              <p className="text-sm text-gray-500 mt-1">{mediaLabel(material)}</p>

              <div className="flex flex-wrap gap-2 mt-3">
                <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-sky-100 text-sky-800 border border-sky-200/60">
                  {material.contentType}
                </span>
                <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-violet-100 text-violet-800 border border-violet-200/60">
                  {material.stagePill}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {material.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200/90"
                  >
                    <Tag className="w-3 h-3 opacity-70 shrink-0" aria-hidden />
                    {tag}
                  </span>
                ))}
              </div>

              <div className="my-4 border-t border-b border-gray-200 py-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="flex justify-center text-gray-400 mb-1">
                      <Eye className="w-4 h-4" aria-hidden />
                    </div>
                    <p className="text-xs text-gray-500">Views</p>
                    <p className="text-xl font-bold text-gray-900 tabular-nums">
                      {material.views.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <div className="flex justify-center text-gray-400 mb-1">
                      <Download className="w-4 h-4" aria-hidden />
                    </div>
                    <p className="text-xs text-gray-500">Downloads</p>
                    <p className="text-xl font-bold text-gray-900 tabular-nums">
                      {material.downloads.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Calendar className="w-3.5 h-3.5 shrink-0 text-gray-400" aria-hidden />
                <span>
                  {material.uploadDate}
                  <span className="mx-1.5 text-gray-300">•</span>
                  {material.fileSize}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                By <span className="text-gray-700">{material.uploadedBy}</span>
              </p>

              <div className="mt-4 pt-1 flex gap-3">
                <button
                  type="button"
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border-2 border-[#032EA1] text-[#032EA1] text-sm font-semibold hover:bg-[#032EA1]/5 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button
                  type="button"
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-[#032EA1] text-white text-sm font-semibold hover:bg-[#0447D4] transition-colors shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {filteredMaterials.length === 0 && (
        <div className="text-center py-12 text-gray-500 border border-dashed border-gray-300 rounded-xl">
          No materials match your search.
        </div>
      )}

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-1">
        <p className="text-sm text-gray-600">
          Showing{" "}
          <span className="font-medium">
            {filteredMaterials.length > 0 ? `1-${filteredMaterials.length}` : "0"}
          </span>{" "}
          of <span className="font-medium">127</span> materials
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Previous
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-[#032EA1] text-white rounded-lg text-sm font-medium hover:bg-[#0447D4] transition-colors"
          >
            Next
          </button>
        </div>
      </div>

      {showUploadModal && (
        <KnowledgeUploadForm onClose={() => setShowUploadModal(false)} />
      )}
    </div>
  );
}
