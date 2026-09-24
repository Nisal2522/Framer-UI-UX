import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Plus,
  Search,
  SlidersHorizontal,
  Download,
  Eye,
  FileText,
  Video,
  Database,
  Map,
  Link2,
  Calendar,
  Globe,
  MapPin,
  RotateCcw,
  Edit2,
  Trash2,
  Archive,
  ArchiveRestore,
  X,
} from "lucide-react";
import { KnowledgeUploadForm, type KnowledgeResourceFormData } from "./KnowledgeUploadForm";
import { MultiSelectCombobox } from "./ui/multi-select";
import { SingleSelectCombobox } from "./ui/single-select";
import { isGovernmentAdmin } from "../auth/portalUser";

/** PEARL KM requirements (Sep 2026): resource types, topics, crops, provinces and
 *  languages below mirror the agreed taxonomy so the browse UI and upload form stay
 *  in sync (sections 6-8 of the requirements doc). */
export type ResourceType = "Document" | "Video" | "Dataset" | "Map" | "Link";
export type ResourceLanguage = "Khmer" | "English" | "Khmer & English";

export const RESOURCE_TYPE_OPTIONS: ResourceType[] = ["Document", "Video", "Dataset", "Map", "Link"];

export const TOPIC_OPTIONS = [
  "Agricultural Finance",
  "Agricultural Research",
  "Climate & Resilience",
  "Crop Production",
  "Extension & Training",
  "Fisheries & Aquaculture",
  "Forestry & Agroforestry",
  "Innovation & Technology",
  "Livestock",
  "Markets & Value Chains",
  "Pest & Disease",
  "Policy & Regulation",
  "Post-Harvest",
  "Soil & Land",
  "Sustainable Agriculture",
];

const CROP_PRIORITY = ["Rice", "Cashew", "Mango", "Vegetables"];
const CROP_OTHER_RAW = [
  "Maize / Corn", "Flowers",
  "Banana", "Citrus", "Coconut", "Dragon Fruit", "Durian", "Guava", "Jackfruit", "Longan",
  "Lychee", "Papaya", "Pineapple", "Rambutan", "Sugar Apple", "Watermelon",
  "Pepper", "Rubber", "Sugarcane",
  "Beans / Legumes", "Sesame",
  "Mixed Crops", "Multiple / All", "Other Crops",
  "Cassava / Root Crops", "Taro",
  "Bamboo Shoot", "Moringa", "Mushroom",
  "Bitter Melon", "Bottle Gourd", "Carrot", "Chili", "Cucumber", "Eggplant", "Kale", "Lettuce",
  "Luffa", "Mustard / Leafy Greens", "Onion / Garlic", "Other Vegetables", "Pumpkin", "Radish",
  "Tomato", "Water Spinach", "Winter Melon",
];
export const CROP_OPTIONS = [
  ...CROP_PRIORITY,
  ...Array.from(new Set(CROP_OTHER_RAW)).sort((a, b) => a.localeCompare(b)),
];

/** Crop groups exactly as listed in section 7 of the PEARL KM requirements. */
export const CROP_GROUPS: { name: string; crops: string[] }[] = [
  { name: "PEARL Priority", crops: ["Rice", "Cashew", "Mango", "Vegetables"] },
  { name: "Cereals", crops: ["Maize / Corn", "Rice"] },
  { name: "Floriculture", crops: ["Flowers"] },
  {
    name: "Fruit Crops",
    crops: [
      "Banana", "Citrus", "Coconut", "Dragon Fruit", "Durian", "Guava", "Jackfruit", "Longan",
      "Lychee", "Mango", "Papaya", "Pineapple", "Rambutan", "Sugar Apple", "Watermelon",
    ],
  },
  { name: "Industrial / Commercial", crops: ["Cashew", "Pepper", "Rubber", "Sugarcane"] },
  { name: "Legumes & Field Crops", crops: ["Beans / Legumes", "Sesame"] },
  { name: "Mixed / Other Crops", crops: ["Mixed Crops", "Multiple / All", "Other Crops"] },
  { name: "Root & Tuber Crops", crops: ["Cassava / Root Crops", "Taro"] },
  { name: "Specialty Crops", crops: ["Bamboo Shoot", "Moringa", "Mushroom"] },
  {
    name: "Vegetable Crops",
    crops: [
      "Bitter Melon", "Bottle Gourd", "Carrot", "Chili", "Cucumber", "Eggplant", "Kale", "Lettuce",
      "Luffa", "Mustard / Leafy Greens", "Onion / Garlic", "Other Vegetables", "Pumpkin", "Radish",
      "Tomato", "Water Spinach", "Winter Melon",
    ],
  },
];

const PROVINCE_PRIORITY = ["Kampong Thom", "Oddar Meanchey", "Preah Vihear", "Siem Reap"];
const PROVINCE_OTHER = [
  "Banteay Meanchey", "Battambang", "Kampong Cham", "Kampong Chhnang", "Kampong Speu",
  "Kampot", "Kandal", "Kep", "Koh Kong", "Kratie", "Mondulkiri", "Pailin", "Phnom Penh",
  "Preah Sihanouk", "Pursat", "Ratanakiri", "Stung Treng", "Svay Rieng", "Takeo", "Tboung Khmum",
];
export const PROVINCE_OPTIONS = [
  ...PROVINCE_PRIORITY,
  ...PROVINCE_OTHER,
  "Multiple Provinces / 4 PEARL Provinces",
  "Cambodia / National",
];

export const LANGUAGE_OPTIONS: ResourceLanguage[] = ["Khmer", "English", "Khmer & English"];

export type KnowledgeResource = {
  id: string;
  title: string;
  description: string;
  resourceType: ResourceType;
  topic: string;
  cropCommodity: string[];
  province: string[];
  year: number;
  language: ResourceLanguage;
  organizationSource: string;
  uploadDate: string;
  fileSize?: string;
  views: number;
  downloads: number;
  coverImageUrl?: string;
  archived: boolean;
  /** Only set for Video resources. */
  videoType?: string;
};

const INITIAL_RESOURCES: KnowledgeResource[] = [
  {
    id: "KM-001",
    title: "Climate-Smart Rice Production Guide",
    description: "A practical guide for farmers on climate-resilient rice production techniques and pest management.",
    resourceType: "Document",
    topic: "Crop Production",
    cropCommodity: ["Rice"],
    province: ["Kampong Thom"],
    year: 2024,
    language: "English",
    organizationSource: "FAO/PEARL",
    uploadDate: "2024-03-21",
    fileSize: "1.3 MB",
    views: 764,
    downloads: 234,
    archived: false,
    coverImageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&h=400&q=80",
  },
  {
    id: "KM-002",
    title: "Good Practices for Cashew Production",
    description: "Video on improved cashew production techniques from farmers in Kampong Thom.",
    resourceType: "Video",
    topic: "Crop Production",
    cropCommodity: ["Cashew"],
    province: ["Kampong Thom"],
    year: 2023,
    language: "Khmer",
    organizationSource: "Extension Media Unit",
    uploadDate: "2023-11-08",
    fileSize: "124 MB",
    views: 542,
    downloads: 189,
    archived: false,
    coverImageUrl: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=600&h=400&q=80",
  },
  {
    id: "KM-003",
    title: "Soil Quality Data (2020-2024)",
    description: "Dataset on soil quality indicators across PEARL target provinces.",
    resourceType: "Dataset",
    topic: "Soil & Land",
    cropCommodity: ["Multiple / All"],
    province: ["Multiple Provinces / 4 PEARL Provinces"],
    year: 2024,
    language: "English",
    organizationSource: "MAFF",
    uploadDate: "2024-01-15",
    fileSize: "3.1 MB",
    views: 892,
    downloads: 523,
    archived: false,
  },
  {
    id: "KM-004",
    title: "Pest Management Alert: Brown Planthopper",
    description: "Emergency alert and prevention measures for brown planthopper outbreak affecting northern provinces.",
    resourceType: "Document",
    topic: "Pest & Disease",
    cropCommodity: ["Rice"],
    province: ["Preah Vihear"],
    year: 2024,
    language: "Khmer & English",
    organizationSource: "Plant Protection Office",
    uploadDate: "2024-03-22",
    fileSize: "420 KB",
    views: 2103,
    downloads: 678,
    archived: false,
    coverImageUrl: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=600&h=400&q=80",
  },
  {
    id: "KM-005",
    title: "Agricultural Suitability Map",
    description: "Map showing agricultural suitability zones in Cambodia.",
    resourceType: "Map",
    topic: "Soil & Land",
    cropCommodity: ["Multiple / All"],
    province: ["Cambodia / National"],
    year: 2023,
    language: "English",
    organizationSource: "MAFF",
    uploadDate: "2023-06-12",
    views: 301,
    downloads: 88,
    archived: false,
  },
  {
    id: "KM-006",
    title: "MAFF Policy on Climate Resilient Agriculture",
    description: "Link to the MAFF policy document on climate resilient agriculture.",
    resourceType: "Link",
    topic: "Policy & Regulation",
    cropCommodity: ["Multiple / All"],
    province: ["Cambodia / National"],
    year: 2022,
    language: "English",
    organizationSource: "MAFF",
    uploadDate: "2022-09-05",
    views: 156,
    downloads: 0,
    archived: false,
  },
  {
    id: "KM-007",
    title: "Post-Harvest Handling for Vegetables",
    description: "Guide on post-harvest handling to reduce losses and improve market access.",
    resourceType: "Document",
    topic: "Post-Harvest",
    cropCommodity: ["Vegetables", "Tomato"],
    province: ["Siem Reap"],
    year: 2024,
    language: "Khmer",
    organizationSource: "System Administrator",
    uploadDate: "2024-01-15",
    fileSize: "2.1 MB",
    views: 892,
    downloads: 445,
    archived: false,
    coverImageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&h=400&q=80",
  },
  {
    id: "KM-008",
    title: "Financial Literacy for Savings Circles",
    description: "Introductory workshop video on savings circle models and household budgeting for member farmers.",
    resourceType: "Video",
    topic: "Agricultural Finance",
    cropCommodity: ["Multiple / All"],
    province: ["Kampot"],
    year: 2026,
    language: "Khmer",
    organizationSource: "MAFF",
    uploadDate: "2026-08-14",
    fileSize: "88 MB",
    views: 388,
    downloads: 102,
    archived: false,
    coverImageUrl: "https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&w=600&h=400&q=80",
  },
  {
    id: "KM-009",
    title: "Market Price Dataset — March 2024",
    description: "Monthly dataset of agricultural commodity prices across Cambodia including rice, cassava and vegetables.",
    resourceType: "Dataset",
    topic: "Markets & Value Chains",
    cropCommodity: ["Rice", "Cassava / Root Crops", "Vegetables"],
    province: ["Cambodia / National"],
    year: 2024,
    language: "Khmer & English",
    organizationSource: "Ministry Committee",
    uploadDate: "2024-03-01",
    fileSize: "890 KB",
    views: 1204,
    downloads: 456,
    archived: false,
  },
  {
    id: "KM-010",
    title: "Organic Fertilizer Production Training",
    description: "Step-by-step video tutorial on producing organic compost and bio-fertilizers for sustainable farming.",
    resourceType: "Video",
    topic: "Sustainable Agriculture",
    cropCommodity: ["Multiple / All"],
    province: ["Oddar Meanchey"],
    year: 2024,
    language: "Khmer",
    organizationSource: "Training Coordinator",
    uploadDate: "2024-02-20",
    fileSize: "112 MB",
    views: 542,
    downloads: 189,
    archived: false,
    coverImageUrl: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=600&h=400&q=80",
  },
  {
    id: "KM-011",
    title: "GDA Cashew Certification Portal",
    description: "Approved external portal for GLOBAL G.A.P. cashew certification guidance and applications.",
    resourceType: "Link",
    topic: "Innovation & Technology",
    cropCommodity: ["Cashew"],
    province: ["Cambodia / National"],
    year: 2023,
    language: "English",
    organizationSource: "GDA",
    uploadDate: "2023-04-18",
    views: 210,
    downloads: 0,
    archived: false,
  },
  {
    id: "KM-012",
    title: "Flood Risk Map — Northern Tonle Sap Basin",
    description: "Static map product showing flood risk zones across the Northern Tonle Sap Basin.",
    resourceType: "Map",
    topic: "Climate & Resilience",
    cropCommodity: ["Multiple / All"],
    province: ["Siem Reap"],
    year: 2024,
    language: "Khmer & English",
    organizationSource: "FAO/PEARL",
    uploadDate: "2024-05-30",
    views: 178,
    downloads: 64,
    archived: false,
  },
];

const RESOURCE_TYPE_META: Record<
  ResourceType,
  { icon: typeof FileText; badgeClass: string }
> = {
  Document: { icon: FileText, badgeClass: "bg-[#032EA1]/10 text-[#032EA1] border-[#032EA1]/20" },
  Video: { icon: Video, badgeClass: "bg-red-50 text-red-700 border-red-200" },
  Dataset: { icon: Database, badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  Map: { icon: Map, badgeClass: "bg-purple-50 text-purple-700 border-purple-200" },
  Link: { icon: Link2, badgeClass: "bg-amber-50 text-amber-700 border-amber-200" },
};

type SortOption = "newest" | "oldest" | "title";

export function KnowledgeManagement() {
  const admin = isGovernmentAdmin();
  const [resources, setResources] = useState<KnowledgeResource[]>(INITIAL_RESOURCES);
  const [uploadDrawerOpen, setUploadDrawerOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<KnowledgeResource | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [resourceTypeFilter, setResourceTypeFilter] = useState<ResourceType | "All">("All");
  const [topicFilter, setTopicFilter] = useState<string[]>([]);
  const [cropGroupFilter, setCropGroupFilter] = useState<string>("");
  const [cropFilter, setCropFilter] = useState<string[]>([]);
  const [provinceFilter, setProvinceFilter] = useState<string[]>([]);
  const [yearFilter, setYearFilter] = useState<string>("");
  const [languageFilter, setLanguageFilter] = useState<string>("");

  const activeFilterCount =
    topicFilter.length +
    (cropGroupFilter ? 1 : 0) +
    cropFilter.length +
    provinceFilter.length +
    (yearFilter ? 1 : 0) +
    (languageFilter ? 1 : 0) +
    (resourceTypeFilter !== "All" ? 1 : 0);

  const resetFilters = () => {
    setSearchTerm("");
    setResourceTypeFilter("All");
    setTopicFilter([]);
    setCropGroupFilter("");
    setCropFilter([]);
    setProvinceFilter([]);
    setYearFilter("");
    setLanguageFilter("");
  };

  const closeUploadDrawer = () => {
    setUploadDrawerOpen(false);
    setEditingResource(null);
  };

  const handleSaveResource = (data: KnowledgeResourceFormData) => {
    if (editingResource) {
      setResources((prev) =>
        prev.map((r) => (r.id === editingResource.id ? { ...r, ...data } : r))
      );
      toast.success("Knowledge material updated.");
    } else {
      const newResource: KnowledgeResource = {
        ...data,
        id: `KM-${Date.now()}`,
        uploadDate: new Date().toISOString().slice(0, 10),
        views: 0,
        downloads: 0,
        archived: false,
      };
      setResources((prev) => [newResource, ...prev]);
      toast.success("Knowledge material published.");
    }
  };

  const handleEditResource = (resource: KnowledgeResource) => {
    setEditingResource(resource);
    setUploadDrawerOpen(true);
  };

  const handleDeleteResource = (resource: KnowledgeResource) => {
    const confirmed = window.confirm(`Delete "${resource.title}"? This cannot be undone.`);
    if (!confirmed) return;
    setResources((prev) => prev.filter((r) => r.id !== resource.id));
    toast.success(`"${resource.title}" was deleted.`);
  };

  const handleToggleArchive = (resource: KnowledgeResource) => {
    setResources((prev) =>
      prev.map((r) => (r.id === resource.id ? { ...r, archived: !r.archived } : r))
    );
    toast.success(
      resource.archived ? `"${resource.title}" was restored.` : `"${resource.title}" was archived.`
    );
  };

  const yearOptions = useMemo(
    () => Array.from(new Set(resources.map((r) => r.year))).sort((a, b) => b - a),
    [resources]
  );

  const cropGroupOptions = useMemo(() => CROP_GROUPS.map((g) => g.name), []);
  const cropGroupCrops = useMemo(() => {
    const map: Record<string, Set<string>> = {};
    for (const g of CROP_GROUPS) map[g.name] = new Set(g.crops);
    return map;
  }, []);
  const cropOptionsForFilter = cropGroupFilter
    ? (CROP_GROUPS.find((g) => g.name === cropGroupFilter)?.crops ?? CROP_OPTIONS)
    : CROP_OPTIONS;

  const handleCropGroupFilterChange = (next: string) => {
    setCropGroupFilter(next);
    if (!next) return;
    const allowed = cropGroupCrops[next];
    if (!allowed) return;
    setCropFilter((prev) => prev.filter((c) => allowed.has(c)));
  };

  /** Matches every active filter EXCEPT resource type. Archived resources are only
   *  visible to admins (they stay searchable/editable there, but never appear publicly). */
  const baseFiltered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    const groupCrops = cropGroupFilter ? cropGroupCrops[cropGroupFilter] : undefined;
    return resources.filter((r) => {
      if (r.archived && !admin) return false;
      const matchesSearch =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.topic.toLowerCase().includes(q) ||
        r.cropCommodity.some((c) => c.toLowerCase().includes(q)) ||
        r.province.some((p) => p.toLowerCase().includes(q)) ||
        r.organizationSource.toLowerCase().includes(q);
      const matchesTopic = topicFilter.length === 0 || topicFilter.includes(r.topic);
      const matchesCropGroup =
        !groupCrops || r.cropCommodity.some((c) => groupCrops.has(c));
      const matchesCrop = cropFilter.length === 0 || r.cropCommodity.some((c) => cropFilter.includes(c));
      const matchesProvince = provinceFilter.length === 0 || r.province.some((p) => provinceFilter.includes(p));
      const matchesYear = !yearFilter || String(r.year) === yearFilter;
      const matchesLanguage = !languageFilter || r.language === languageFilter;
      return matchesSearch && matchesTopic && matchesCropGroup && matchesCrop && matchesProvince && matchesYear && matchesLanguage;
    });
  }, [resources, admin, searchTerm, topicFilter, cropGroupFilter, cropGroupCrops, cropFilter, provinceFilter, yearFilter, languageFilter]);

  const filteredResources = useMemo(() => {
    const filtered =
      resourceTypeFilter === "All"
        ? baseFiltered
        : baseFiltered.filter((r) => r.resourceType === resourceTypeFilter);

    const sorted = [...filtered];
    switch (sortBy) {
      case "oldest":
        sorted.sort((a, b) => (a.uploadDate > b.uploadDate ? 1 : -1));
        break;
      case "title":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        sorted.sort((a, b) => (a.uploadDate < b.uploadDate ? 1 : -1));
    }
    return sorted;
  }, [baseFiltered, resourceTypeFilter, sortBy]);

  return (
    <div className="space-y-6 min-w-0 max-w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Knowledge Hub</h1>
          <p className="text-gray-600 mt-1">
            Discover approved agricultural documents, videos, datasets, maps and links.
          </p>
        </div>
        {admin && (
          <button
            type="button"
            onClick={() => {
              setEditingResource(null);
              setUploadDrawerOpen(true);
            }}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#032EA1] text-white rounded-lg hover:bg-[#0447D4] transition-colors shadow-md shrink-0"
          >
            <Plus className="w-5 h-5" />
            Upload Material
          </button>
        )}
      </div>

      {/* Search + filter toggle */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search documents, videos, crops, topics..."
              className="w-full pl-10 pr-9 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => setShowFilters((v) => !v)}
            aria-label={showFilters ? "Hide filters" : "Show filters"}
            aria-expanded={showFilters}
            title={showFilters ? "Hide filters" : "Show filters"}
            className={`relative flex items-center justify-center w-[46px] h-[46px] shrink-0 rounded-lg border transition-colors ${
              showFilters
                ? "bg-[#032EA1] border-[#032EA1] text-white shadow-md"
                : "bg-white border-gray-300 text-gray-500 hover:border-[#032EA1]/40 hover:text-[#032EA1]"
            }`}
          >
            <SlidersHorizontal className="w-5 h-5" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[#032EA1] text-white text-[10px] font-bold border-2 border-white">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Resource cards — full width; filters open as a right side panel */}
      <div className="min-w-0 space-y-4">
        {/* Filter side panel — same slide-over style as Upload Knowledge Material */}
        {showFilters && (
        <>
        <div
          className="fixed inset-0 z-[100] bg-black/40"
          aria-hidden
          onClick={() => setShowFilters(false)}
        />
        <aside
          className="fixed inset-y-0 right-0 z-[110] flex w-full max-w-md flex-col border-l border-gray-200 bg-gray-50 shadow-2xl"
          role="dialog"
          aria-modal="true"
          aria-label="Filter resources"
        >
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-gradient-to-br from-[#032EA1] to-[#021c5e] shrink-0">
            <h3 className="text-sm font-semibold text-white">
              Filter Resources
              {activeFilterCount > 0 && (
                <span className="ml-2 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-white text-[#032EA1] text-[10px] font-bold align-middle">
                  {activeFilterCount}
                </span>
              )}
            </h3>
            <button
              type="button"
              onClick={() => setShowFilters(false)}
              className="p-1.5 rounded-lg hover:bg-white/15 text-white/90 transition-colors"
              aria-label="Close filters"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4">
          <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Topic</label>
            <MultiSelectCombobox
              options={TOPIC_OPTIONS}
              selected={topicFilter}
              onChange={setTopicFilter}
              placeholder="All topics"
              searchPlaceholder="Search topics..."
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Crop Group</label>
            <SingleSelectCombobox
              options={cropGroupOptions}
              value={cropGroupFilter}
              onChange={handleCropGroupFilterChange}
              placeholder="All groups"
              searchPlaceholder="Search crop groups..."
              emptyText="No matching crop groups."
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Crop / Commodity</label>
            <MultiSelectCombobox
              options={cropOptionsForFilter}
              selected={cropFilter}
              onChange={setCropFilter}
              placeholder="All crops"
              searchPlaceholder="Search crops..."
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Province</label>
            <MultiSelectCombobox
              options={PROVINCE_OPTIONS}
              selected={provinceFilter}
              onChange={setProvinceFilter}
              placeholder="All provinces"
              searchPlaceholder="Search provinces..."
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Year</label>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white"
            >
              <option value="">All years</option>
              {yearOptions.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Resource Type</label>
            <select
              value={resourceTypeFilter}
              onChange={(e) => setResourceTypeFilter(e.target.value as ResourceType | "All")}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white"
            >
              <option value="All">All types</option>
              {RESOURCE_TYPE_OPTIONS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Language</label>
            <select
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white"
            >
              <option value="">All languages</option>
              {LANGUAGE_OPTIONS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="km-sort-by" className="block text-xs font-medium text-gray-500 mb-1">Sort By</label>
            <select
              id="km-sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>

          </div>
          </div>

          <div className="px-5 py-3 border-t border-gray-200 bg-white flex items-center justify-between gap-2 shrink-0">
            <button
              type="button"
              onClick={resetFilters}
              className="flex items-center justify-center gap-1.5 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(false)}
              className="px-4 py-2 text-sm bg-[#032EA1] text-white rounded-lg hover:bg-[#0447D4] transition-colors font-medium"
            >
              Show {filteredResources.length} resource{filteredResources.length === 1 ? "" : "s"}
            </button>
          </div>
        </aside>
        </>
        )}

        {/* Resource cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {filteredResources.map((resource) => {
              const meta = RESOURCE_TYPE_META[resource.resourceType];
              const Icon = meta.icon;
              return (
                <article
                  key={resource.id}
                  className={`flex flex-col bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md hover:border-gray-300/80 transition-shadow ${
                    resource.archived ? "opacity-60" : ""
                  }`}
                >
                  <div className="relative aspect-[16/9] w-full bg-gray-100 shrink-0 overflow-hidden rounded-t-lg">
                    {resource.coverImageUrl ? (
                      <>
                        <img
                          src={resource.coverImageUrl}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                        {resource.resourceType === "Video" && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-white/90 shadow-lg">
                              <svg viewBox="0 0 24 24" fill="#032EA1" className="w-7 h-7 ml-1">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                        <Icon className="w-10 h-10 text-gray-500" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2 flex items-center gap-1.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border shadow-sm bg-white/95 ${meta.badgeClass}`}
                      >
                        <Icon className="w-3 h-3" />
                        {resource.resourceType}
                      </span>
                      {resource.archived && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border border-gray-300 shadow-sm bg-white/95 text-gray-600">
                          Archived
                        </span>
                      )}
                    </div>

                    {admin && (
                      <div className="absolute top-2 right-2 flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleEditResource(resource)}
                          className="flex items-center justify-center w-7 h-7 rounded-full bg-white/95 text-amber-600 shadow-sm hover:bg-amber-50 transition-colors"
                          aria-label="Edit material"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleArchive(resource)}
                          className="flex items-center justify-center w-7 h-7 rounded-full bg-white/95 text-gray-600 shadow-sm hover:bg-gray-100 transition-colors"
                          aria-label={resource.archived ? "Restore material" : "Archive material"}
                          title={resource.archived ? "Restore" : "Archive"}
                        >
                          {resource.archived ? (
                            <ArchiveRestore className="w-3.5 h-3.5" />
                          ) : (
                            <Archive className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteResource(resource)}
                          className="flex items-center justify-center w-7 h-7 rounded-full bg-white/95 text-red-600 shadow-sm hover:bg-red-50 transition-colors"
                          aria-label="Delete material"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col flex-1 p-3 sm:p-4">
                    <h2 className="text-[15px] sm:text-base font-bold text-[#032EA1] leading-snug line-clamp-2">
                      {resource.title}
                    </h2>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{resource.description}</p>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2.5 text-[11px] text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        {resource.year}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Globe className="w-3 h-3 text-gray-400" />
                        {resource.language}
                      </span>
                      <span className="inline-flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                        <span className="truncate">{resource.province.join(", ")}</span>
                      </span>
                    </div>

                    <p className="text-[11px] text-gray-400 mt-1.5">
                      {resource.topic}
                      {resource.cropCommodity.length > 0 && (
                        <span className="text-gray-300"> • {resource.cropCommodity.join(", ")}</span>
                      )}
                    </p>

                    <div className="mt-auto pt-3 flex items-center justify-between gap-2">
                      <p className="text-[11px] text-gray-500 truncate">
                        {resource.organizationSource}
                      </p>
                      <div className="flex gap-1.5 shrink-0">
                        <button
                          type="button"
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border-2 border-[#032EA1] text-[#032EA1] text-xs font-semibold hover:bg-[#032EA1]/5 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </button>
                        <button
                          type="button"
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#032EA1] text-white text-xs font-semibold hover:bg-[#0447D4] transition-colors shadow-sm"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {filteredResources.length === 0 && (
            <div className="text-center py-12 text-gray-500 border border-dashed border-gray-300 rounded-xl">
              No resources match your search and filters.
              <button
                type="button"
                onClick={resetFilters}
                className="block mx-auto mt-2 text-sm font-medium text-[#032EA1] hover:underline"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>

      {uploadDrawerOpen && (
        <KnowledgeUploadForm
          onClose={closeUploadDrawer}
          onSave={handleSaveResource}
          initialData={
            editingResource
              ? {
                  title: editingResource.title,
                  description: editingResource.description,
                  resourceType: editingResource.resourceType,
                  topic: editingResource.topic,
                  cropCommodity: editingResource.cropCommodity,
                  province: editingResource.province,
                  language: editingResource.language,
                  organizationSource: editingResource.organizationSource,
                  year: editingResource.year,
                  videoType: editingResource.videoType,
                }
              : undefined
          }
        />
      )}
    </div>
  );
}
