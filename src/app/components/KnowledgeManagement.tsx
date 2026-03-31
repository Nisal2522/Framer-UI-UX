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
    documentType: "Video",
    targetCrop: "Rice",
    uploadDate: "2024-03-21",
    uploadedBy: "Extension Media Unit",
    uploaderRole: "Agricultural Officer",
    status: "Published",
    downloads: 234,
    views: 764,
    fileSize: "1.3 MB",
    tags: ["Irrigation", "Visual", "Guide"],
    coverKind: "video",
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
    coverImageUrl:
      "https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&w=600&h=400&q=80",
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
    coverKind: "video",
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
    coverImageUrl:
      "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=600&h=400&q=80",
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
    coverImageUrl:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&h=400&q=80",
    stagePill: "All Stages",
  },
  {
    id: "KM-006",
    title: "Government Subsidy Program 2024",
    description:
      "Official announcement and application guidelines for the 2024 agricultural subsidy program",
    contentType: "Government Program Announcement",
    documentType: "Video",
    targetCrop: "All Crop Types",
    uploadDate: "2024-03-10",
    uploadedBy: "Ministry Committee",
    uploaderRole: "Ministry Committee",
    status: "Published",
    downloads: 892,
    views: 1567,
    fileSize: "560 KB",
    tags: ["Training", "Certification"],
    coverKind: "video",
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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredMaterials.map((material) => (
          <article
            key={material.id}
            className="flex flex-col bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md hover:border-gray-300/80 transition-shadow"
          >
            {/* Media */}
            <div className="relative aspect-[16/9] w-full bg-gray-100 shrink-0 overflow-hidden rounded-t-lg">
              {material.coverKind === "pdf" && !material.coverImageUrl ? (
                <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-red-600 to-red-700">
                  <FileText className="w-12 h-12 text-white opacity-95" strokeWidth={1.5} />
                </div>
              ) : material.coverImageUrl ? (
                <>
                  <img
                    src={material.coverImageUrl}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  {material.coverKind === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-white/90 shadow-lg">
                        <svg viewBox="0 0 24 24" fill="#032EA1" className="w-7 h-7 ml-1">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  )}
                  {material.coverKind === "pdf" && (
                    <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-red-600/90 backdrop-blur-sm text-white text-[11px] font-semibold px-2 py-1 rounded-md shadow">
                      <FileText className="w-3 h-3" />
                      PDF
                    </div>
                  )}
                </>
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                  <BookOpen className="w-10 h-10 text-gray-500" />
                </div>
              )}
            </div>

            <div className="flex flex-col flex-1 p-3 sm:p-4">
              <h2 className="text-[15px] sm:text-base font-bold text-[#032EA1] leading-snug line-clamp-2">
                {material.title}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">{mediaLabel(material)}</p>

              <div className="flex flex-wrap gap-1.5 mt-2.5">
                <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium bg-sky-100 text-sky-800 border border-sky-200/60">
                  {material.contentType}
                </span>
                <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium bg-violet-100 text-violet-800 border border-violet-200/60">
                  {material.stagePill}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {material.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[11px] font-medium bg-gray-100 text-gray-700 border border-gray-200/90"
                  >
                    <Tag className="w-3 h-3 opacity-70 shrink-0" aria-hidden />
                    {tag}
                  </span>
                ))}
              </div>

              <div className="my-3 border-t border-b border-gray-200 py-3">
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div>
                    <div className="flex justify-center text-gray-400 mb-1">
                      <Eye className="w-4 h-4" aria-hidden />
                    </div>
                    <p className="text-xs text-gray-500">Views</p>
                    <p className="text-lg font-bold text-gray-900 tabular-nums">
                      {material.views.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <div className="flex justify-center text-gray-400 mb-1">
                      <Download className="w-4 h-4" aria-hidden />
                    </div>
                    <p className="text-xs text-gray-500">Downloads</p>
                    <p className="text-lg font-bold text-gray-900 tabular-nums">
                      {material.downloads.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-gray-600">
                <Calendar className="w-3.5 h-3.5 shrink-0 text-gray-400" aria-hidden />
                <span>
                  {material.uploadDate}
                  <span className="mx-1.5 text-gray-300">•</span>
                  {material.fileSize}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                By <span className="text-gray-700">{material.uploadedBy}</span>
              </p>

              <div className="mt-3 pt-0.5 flex gap-2">
                <button
                  type="button"
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border-2 border-[#032EA1] text-[#032EA1] text-xs font-semibold hover:bg-[#032EA1]/5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View
                </button>
                <button
                  type="button"
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#032EA1] text-white text-xs font-semibold hover:bg-[#0447D4] transition-colors shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
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
          of <span className="font-medium">{materials.length}</span> materials
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
