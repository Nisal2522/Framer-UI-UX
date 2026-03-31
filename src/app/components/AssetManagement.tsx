import { useMemo, useRef, useState } from "react";
import {
  Package,
  Plus,
  Filter,
  Download,
  FileText,
  X,
  Upload,
  Search,
  Edit2,
  Eye,
  Trash2,
  Calendar,
  User,
  AlertCircle,
  ChevronDown,
  CheckCircle,
  Clock,
} from "lucide-react";

const USAGE_LOGS = [
  {
    id: "UL-001",
    assetName: "Rice Mill Machine",
    periodStart: "2024-03-20",
    periodEnd: "2024-03-25",
    user: "Sok Pisey",
    duration: "4 hours",
    purpose: "Processing harvest from North Field",
  },
  {
    id: "UL-002",
    assetName: "Delivery Truck",
    periodStart: "2024-03-10",
    periodEnd: "2024-03-10",
    user: "Lim Dara",
    duration: "8 hours",
    purpose: "Transport to market",
  },
] as const;

type AssetForm = {
  type: string;
  name: string;
  serialNumber: string;
  acquisitionDate: string;
  acquisitionMethod: string;
  value: string;
  location: string;
  custodian: string;
  assetStatus: string;
  description: string;
};

const EMPTY_FORM: AssetForm = {
  type: "",
  name: "",
  serialNumber: "",
  acquisitionDate: "",
  acquisitionMethod: "",
  value: "",
  location: "",
  custodian: "",
  assetStatus: "",
  description: "",
};

type ExistingAttachment = {
  id: string;
  name: string;
  size: string;
  type: "image" | "pdf" | "doc";
  url?: string;
};

const ASSET_ATTACHMENTS: Record<string, ExistingAttachment[]> = {
  "AST-001": [
    { id: "a1", name: "rice-mill-machine.jpg", size: "1.4 MB", type: "image", url: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=300&q=80" },
    { id: "a2", name: "purchase-receipt.pdf", size: "234 KB", type: "pdf" },
  ],
  "AST-002": [
    { id: "b1", name: "delivery-truck-front.jpg", size: "2.1 MB", type: "image", url: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=300&q=80" },
    { id: "b2", name: "delivery-truck-side.jpg", size: "1.8 MB", type: "image", url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=300&q=80" },
    { id: "b3", name: "vehicle-registration.pdf", size: "312 KB", type: "pdf" },
  ],
  "AST-003": [
    { id: "c1", name: "water-pump-installed.jpg", size: "980 KB", type: "image", url: "https://images.unsplash.com/photo-1558618047-3f5e21f3e8a9?auto=format&fit=crop&w=300&q=80" },
    { id: "c2", name: "pump-manual.pdf", size: "1.2 MB", type: "pdf" },
  ],
  "AST-004": [
    { id: "d1", name: "irrigation-pipeline.jpg", size: "1.6 MB", type: "image", url: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=300&q=80" },
  ],
  "AST-005": [
    { id: "e1", name: "tractor-field.jpg", size: "2.3 MB", type: "image", url: "https://images.unsplash.com/photo-1530267981375-f0de937f5f13?auto=format&fit=crop&w=300&q=80" },
    { id: "e2", name: "tractor-docs.pdf", size: "560 KB", type: "pdf" },
  ],
  "AST-006": [
    { id: "f1", name: "solar-drying-setup.jpg", size: "1.1 MB", type: "image", url: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=300&q=80" },
  ],
  "AST-007": [
    { id: "g1", name: "warehouse-exterior.jpg", size: "1.9 MB", type: "image", url: "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=300&q=80" },
    { id: "g2", name: "warehouse-interior.jpg", size: "1.5 MB", type: "image", url: "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=300&q=80" },
    { id: "g3", name: "land-title.pdf", size: "445 KB", type: "pdf" },
  ],
  "AST-008": [
    { id: "h1", name: "weighing-scale.jpg", size: "760 KB", type: "image", url: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=300&q=80" },
    { id: "h2", name: "calibration-cert.pdf", size: "180 KB", type: "pdf" },
  ],
};

const typeToSelect = (t: string) => t.toLowerCase().replace(/ /g, "-") as string;
const methodToSelect = (m: string): string => {
  const map: Record<string, string> = {
    "Donated by PEARL": "pearl",
    "Own Funds": "own-funds",
    "Purchased": "purchased",
    "Donated by Other Program": "other-program",
    "Government Grant": "government",
  };
  return map[m] ?? m.toLowerCase();
};
const statusToSelect = (s: string) => s.toLowerCase();

export function AssetManagement() {
  const [activeTab, setActiveTab] = useState("inventory");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState<null | string>(null);
  const [assetForm, setAssetForm] = useState<AssetForm>(EMPTY_FORM);
  const [existingAttachments, setExistingAttachments] = useState<ExistingAttachment[]>([]);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [registerAssetFiles, setRegisterAssetFiles] = useState<File[]>([]);
  const registerFileInputRef = useRef<HTMLInputElement>(null);
  const [usageHistorySearch, setUsageHistorySearch] = useState("");
  const [showConditionModal, setShowConditionModal] = useState(false);
  const [conditionFormAssetId, setConditionFormAssetId] = useState("");
  const [conditionFormRating, setConditionFormRating] = useState("");
  const [conditionPhotoFiles, setConditionPhotoFiles] = useState<File[]>([]);
  const conditionPhotoInputRef = useRef<HTMLInputElement>(null);

  const setField = (field: keyof AssetForm, value: string) =>
    setAssetForm((prev) => ({ ...prev, [field]: value }));

  const conditionToSelectValue = (condition: string) => {
    const m: Record<string, string> = {
      Good: "good",
      Fair: "fair",
      Poor: "poor",
      "Out of Service": "out-of-service",
    };
    return m[condition] ?? "";
  };

  const addConditionPhotoFiles = (fileList: FileList | null) => {
    if (!fileList?.length) return;
    setConditionPhotoFiles((prev) => {
      const next = [...prev];
      for (let i = 0; i < fileList.length; i++) {
        const f = fileList[i];
        if (!next.some((x) => x.name === f.name && x.size === f.size)) next.push(f);
      }
      return next;
    });
  };

  const removeConditionPhotoFile = (index: number) => {
    setConditionPhotoFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const closeConditionModal = () => {
    setShowConditionModal(false);
    setConditionFormAssetId("");
    setConditionFormRating("");
    setConditionPhotoFiles([]);
    if (conditionPhotoInputRef.current) conditionPhotoInputRef.current.value = "";
  };

  const addRegisterAssetFiles = (fileList: FileList | null) => {
    if (!fileList?.length) return;
    setRegisterAssetFiles((prev) => {
      const next = [...prev];
      for (let i = 0; i < fileList.length; i++) {
        const f = fileList[i];
        if (!next.some((x) => x.name === f.name && x.size === f.size)) next.push(f);
      }
      return next;
    });
  };

  const removeRegisterAssetFile = (index: number) => {
    setRegisterAssetFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setEditingAsset(null);
    setAssetForm(EMPTY_FORM);
    setRegisterAssetFiles([]);
    setExistingAttachments([]);
    if (registerFileInputRef.current) registerFileInputRef.current.value = "";
  };

  const openEditModal = (asset: (typeof assets)[number]) => {
    setEditingAsset(asset.id);
    setAssetForm({
      type: typeToSelect(asset.type),
      name: asset.name,
      serialNumber: asset.serialNumber,
      acquisitionDate: asset.acquisitionDate,
      acquisitionMethod: methodToSelect(asset.acquisitionMethod),
      value: asset.value,
      location: asset.location,
      custodian: asset.custodian,
      assetStatus: statusToSelect(asset.assetStatus),
      description: "",
    });
    setExistingAttachments(ASSET_ATTACHMENTS[asset.id] ?? []);
    setRegisterAssetFiles([]);
    setShowAddModal(true);
  };

  const assets = [
    {
      id: "AST-001",
      name: "Rice Mill Machine",
      type: "Equipment",
      serialNumber: "RMM-2024-001",
      acquisitionDate: "2024-01-15",
      acquisitionMethod: "Donated by PEARL",
      value: "$12,000",
      location: "Main Storage Facility",
      custodian: "Sok Pisey",
      condition: "Good",
      pearlFunded: true,
      assetStatus: "Active" as const,
      status: "Verified",
    },
    {
      id: "AST-002",
      name: "Delivery Truck",
      type: "Vehicle",
      serialNumber: "DT-2023-045",
      acquisitionDate: "2023-08-20",
      acquisitionMethod: "Own Funds",
      value: "$28,000",
      location: "Vehicle Depot",
      custodian: "Lim Dara",
      condition: "Fair",
      pearlFunded: false,
      assetStatus: "Active" as const,
      status: "Verified",
    },
    {
      id: "AST-003",
      name: "Water Pump System",
      type: "Equipment",
      serialNumber: "WPS-2024-012",
      acquisitionDate: "2024-03-10",
      acquisitionMethod: "Donated by PEARL",
      value: "$3,500",
      location: "North Field",
      custodian: "Chea Sokha",
      condition: "Good",
      pearlFunded: true,
      assetStatus: "Inactive" as const,
      status: "Pending Verification",
    },
    {
      id: "AST-004",
      name: "Irrigation Pipeline (500m)",
      type: "Infrastructure",
      serialNumber: "IPL-2023-007",
      acquisitionDate: "2023-05-18",
      acquisitionMethod: "Donated by PEARL",
      value: "$8,200",
      location: "East Paddy Field",
      custodian: "Meas Sothea",
      condition: "Good",
      pearlFunded: true,
      assetStatus: "Active" as const,
      status: "Verified",
    },
    {
      id: "AST-005",
      name: "Tractor (25HP)",
      type: "Vehicle",
      serialNumber: "TRC-2022-019",
      acquisitionDate: "2022-11-05",
      acquisitionMethod: "Own Funds",
      value: "$15,500",
      location: "Vehicle Depot",
      custodian: "Sok Pisey",
      condition: "Fair",
      pearlFunded: false,
      assetStatus: "Active" as const,
      status: "Verified",
    },
    {
      id: "AST-006",
      name: "Solar Drying System",
      type: "Equipment",
      serialNumber: "SDS-2024-003",
      acquisitionDate: "2024-02-28",
      acquisitionMethod: "Donated by PEARL",
      value: "$5,800",
      location: "Post-Harvest Center",
      custodian: "Keo Vanna",
      condition: "Good",
      pearlFunded: true,
      assetStatus: "Active" as const,
      status: "Verified",
    },
    {
      id: "AST-007",
      name: "Seed Storage Warehouse",
      type: "Building",
      serialNumber: "SSW-2021-001",
      acquisitionDate: "2021-07-12",
      acquisitionMethod: "Own Funds",
      value: "$22,000",
      location: "Cooperative Compound",
      custodian: "Lim Dara",
      condition: "Poor",
      pearlFunded: false,
      assetStatus: "Active" as const,
      status: "Pending Verification",
    },
    {
      id: "AST-008",
      name: "Weighing Scale (500kg)",
      type: "Equipment",
      serialNumber: "WSC-2023-031",
      acquisitionDate: "2023-09-14",
      acquisitionMethod: "Donated by PEARL",
      value: "$950",
      location: "Main Storage Facility",
      custodian: "Chea Sokha",
      condition: "Good",
      pearlFunded: true,
      assetStatus: "Active" as const,
      status: "Verified",
    },
  ];

  const openConditionModal = (asset: (typeof assets)[number]) => {
    setConditionFormAssetId(asset.id);
    setConditionFormRating(conditionToSelectValue(asset.condition));
    setConditionPhotoFiles([]);
    if (conditionPhotoInputRef.current) conditionPhotoInputRef.current.value = "";
    setShowConditionModal(true);
  };

  const filteredUsageLogs = useMemo(() => {
    const q = usageHistorySearch.trim().toLowerCase();
    if (!q) return [...USAGE_LOGS];
    return USAGE_LOGS.filter((log) => {
      const periodStr = `${log.periodStart} ${log.periodEnd}`;
      return (
        log.assetName.toLowerCase().includes(q) ||
        log.user.toLowerCase().includes(q) ||
        log.purpose.toLowerCase().includes(q) ||
        log.duration.toLowerCase().includes(q) ||
        periodStr.includes(q)
      );
    });
  }, [usageHistorySearch]);

  const disposalRequests = [
    {
      id: "DR-001",
      assetName: "Old Harvester",
      justification: "Equipment is beyond repair and no longer functional",
      disposalMethod: "Scrap",
      submittedDate: "2024-03-20",
      status: "Pending",
    },
  ];

  return (
    <div className="space-y-6 min-w-0 max-w-full">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Asset Management</h1>
          <p className="text-gray-600 mt-1">
            Digital lifecycle management for all cooperative assets
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#032EA1] text-white rounded-lg hover:bg-[#0447D4] transition-colors shadow-md"
        >
          <Plus className="w-5 h-5" />
          Register New Asset
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {[
              { id: "inventory", label: "Asset Inventory" },
              { id: "usage-log", label: "Usage Log" },
              { id: "disposal", label: "Disposal Request" },
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

        {/* Tab Content */}
        <div className="p-6">
          {/* Asset Inventory Tab */}
          {activeTab === "inventory" && (
            <div className="space-y-6">
              {/* Filters and Actions */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search assets..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                  />
                </div>
                <div className="flex gap-2 items-center">
                  <button
                    type="button"
                    className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Filter className="w-4 h-4" />
                    Filter
                  </button>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setExportMenuOpen((o) => !o)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-[#032EA1] text-white rounded-lg text-sm font-medium hover:bg-[#0447D4] transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Export
                      <ChevronDown className="w-4 h-4 opacity-90" />
                    </button>
                    {exportMenuOpen && (
                      <>
                        <button
                          type="button"
                          aria-hidden
                          className="fixed inset-0 z-10 cursor-default bg-transparent"
                          onClick={() => setExportMenuOpen(false)}
                        />
                        <div className="absolute right-0 top-full mt-1 w-44 rounded-lg border border-gray-200 bg-white shadow-lg z-20 py-1">
                          <button
                            type="button"
                            className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setExportMenuOpen(false)}
                          >
                            Export as PDF
                          </button>
                          <button
                            type="button"
                            className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setExportMenuOpen(false)}
                          >
                            Export as Excel
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Assets Table */}
              <div className="w-full min-w-0 rounded-2xl border border-gray-200/80 bg-white shadow-[0_4px_24px_-4px_rgba(3,46,161,0.08),0_2px_8px_-2px_rgba(0,0,0,0.06)] overflow-hidden">
                <div className="w-full min-w-0 overflow-hidden">
                  <table className="w-full table-fixed border-collapse text-left">
                    <colgroup>
                      <col className="w-[10%]" />
                      <col className="w-[22%]" />
                      <col className="w-[12%]" />
                      <col className="w-[14%]" />
                      <col className="w-[9%]" />
                      <col className="w-[9%]" />
                      <col className="w-[9%]" />
                      <col className="w-[10%]" />
                      <col className="w-[5%]" />
                    </colgroup>
                    <thead>
                      <tr className="bg-gradient-to-r from-[#032EA1]/[0.07] via-[#032EA1]/[0.04] to-transparent border-b border-[#032EA1]/15">
                        <th className="px-2 sm:px-3 py-2.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#032EA1]">
                          Asset ID
                        </th>
                        <th className="px-2 sm:px-3 py-2.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#032EA1]">
                          Asset
                        </th>
                        <th className="px-2 sm:px-3 py-2.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#032EA1]">
                          Type
                        </th>
                        <th className="px-2 sm:px-3 py-2.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#032EA1]">
                          Acquisition
                        </th>
                        <th className="px-2 sm:px-3 py-2.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#032EA1] text-right">
                          Value
                        </th>
                        <th className="px-2 sm:px-3 py-2.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#032EA1]">
                          Condition
                        </th>
                        <th className="px-2 sm:px-3 py-2.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#032EA1]">
                          Asset Status
                        </th>
                        <th className="px-2 sm:px-3 py-2.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#032EA1]">
                          Status
                        </th>
                        <th className="px-2 sm:px-3 py-2.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#032EA1] text-center">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {assets.map((asset, rowIdx) => (
                        <tr
                          key={asset.id}
                          className={`group transition-colors ${
                            rowIdx % 2 === 0 ? "bg-white" : "bg-slate-50/60"
                          } hover:bg-[#032EA1]/[0.04]`}
                        >
                          <td className="px-2 sm:px-3 py-2.5 align-middle whitespace-nowrap min-w-[5.5rem]">
                            <span className="inline-flex font-mono text-[10px] sm:text-xs font-semibold text-[#032EA1] bg-[#032EA1]/8 px-2 py-0.5 rounded-md border border-[#032EA1]/10 whitespace-nowrap">
                              {asset.id}
                            </span>
                          </td>
                          <td className="px-2 sm:px-3 py-2.5 align-middle max-w-0">
                            <div className="min-w-0 flex flex-col gap-1">
                              <span
                                className="text-xs sm:text-sm font-semibold text-gray-900 leading-snug line-clamp-2"
                                title={asset.name}
                              >
                                {asset.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-2 sm:px-3 py-2.5 align-middle max-w-0">
                            <span className="inline-flex items-center gap-1.5 rounded-md bg-gray-100 px-2 py-1 text-[11px] font-medium text-gray-800 border border-gray-200/90 whitespace-normal">
                              <Package className="w-3.5 h-3.5 shrink-0 opacity-70" aria-hidden />
                              <span>{asset.type}</span>
                            </span>
                          </td>
                          <td className="px-2 sm:px-3 py-2.5 align-middle max-w-0">
                            <span
                              className="block text-xs text-gray-700 leading-snug line-clamp-2"
                              title={asset.acquisitionMethod}
                            >
                              {asset.acquisitionMethod}
                            </span>
                          </td>
                          <td className="px-2 sm:px-3 py-2.5 align-middle max-w-0 text-right">
                            <span className="text-xs sm:text-sm font-semibold text-gray-900 tabular-nums">
                              {asset.value}
                            </span>
                          </td>
                          <td className="px-2 sm:px-3 py-2.5 align-middle max-w-0">
                            <button
                              type="button"
                              onClick={() => openConditionModal(asset)}
                              className={`inline-flex max-w-full items-center px-2 py-0.5 text-[10px] sm:text-xs font-semibold rounded-full border cursor-pointer transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#032EA1]/40 focus-visible:ring-offset-1 ${
                                asset.condition === "Good"
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                  : asset.condition === "Fair"
                                    ? "bg-blue-50 text-blue-800 border-blue-200"
                                    : "bg-orange-50 text-orange-800 border-orange-200"
                              }`}
                              aria-label={`Update condition for ${asset.name}`}
                            >
                              {asset.condition}
                            </button>
                          </td>
                          <td className="px-2 sm:px-3 py-2.5 align-middle max-w-0">
                            <span
                              className={`inline-flex max-w-full items-center px-2 py-0.5 text-[10px] sm:text-xs font-semibold rounded-full border ${
                                asset.assetStatus === "Active"
                                  ? "bg-teal-50 text-teal-800 border-teal-200"
                                  : "bg-red-50 text-red-800 border-red-200"
                              }`}
                            >
                              {asset.assetStatus}
                            </span>
                          </td>
                          <td className="px-2 sm:px-3 py-2.5 align-middle max-w-0">
                            {asset.status === "Verified" ? (
                              <span className="inline-flex items-center gap-0.5 px-1.5 sm:px-2 py-0.5 bg-emerald-500 text-white rounded-full text-[10px] sm:text-xs font-semibold shadow-sm">
                                <CheckCircle className="w-3 h-3 shrink-0" aria-hidden />
                                <span className="truncate">Verified</span>
                              </span>
                            ) : (
                              <span
                                className="inline-flex items-center gap-0.5 px-1.5 sm:px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full text-[10px] sm:text-xs font-semibold border border-amber-200 max-w-full"
                                title="Pending"
                              >
                                <Clock className="w-3 h-3 shrink-0" aria-hidden />
                                <span className="truncate">Pending</span>
                              </span>
                            )}
                          </td>
                          <td className="px-2 sm:px-3 py-2.5 align-middle max-w-0">
                            <div className="flex items-center justify-center gap-0.5">
                              <button
                                type="button"
                                className="p-1.5 rounded-lg text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                                aria-label="View asset"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => openEditModal(asset)}
                                className="p-1.5 rounded-lg text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                                aria-label="Edit asset"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Verification Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-900">
                    <strong>Note:</strong> Newly registered assets must be verified by the
                    Commune Officer before being marked as "Verified" in the system. Assets
                    pending verification will only be displayed in the inventory after
                    approval.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Usage Log Tab */}
          {activeTab === "usage-log" && (
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Record Asset Usage
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Asset <span className="text-red-500">*</span>
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white">
                      <option value="">Select asset</option>
                      {assets.map((asset) => (
                        <option key={asset.id} value={asset.id}>
                          {asset.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Period <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="date"
                        aria-label="Period start"
                        className="w-full min-w-0 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none text-sm"
                      />
                      <input
                        type="date"
                        aria-label="Period end"
                        className="w-full min-w-0 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      User (Member Name or Group) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter member name or group"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 4 hours"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Purpose <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Describe the purpose of asset use..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none resize-none"
                    ></textarea>
                  </div>
                </div>
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    className="px-6 py-2.5 bg-[#032EA1] text-white rounded-lg hover:bg-[#0447D4] transition-colors font-medium shadow-sm"
                  >
                    Record Usage
                  </button>
                </div>
              </div>

              {/* Usage Log List */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                  <h4 className="font-semibold text-gray-900 shrink-0">
                    Usage History
                  </h4>
                  <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type="search"
                      value={usageHistorySearch}
                      onChange={(e) => setUsageHistorySearch(e.target.value)}
                      placeholder="Search usage records..."
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                      aria-label="Search usage history"
                    />
                  </div>
                </div>
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Asset Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Select Period
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        User
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Duration
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Purpose
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredUsageLogs.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-4 py-8 text-center text-sm text-gray-500"
                        >
                          No usage records match your search.
                        </td>
                      </tr>
                    ) : (
                      filteredUsageLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {log.assetName}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 tabular-nums">
                          {log.periodStart === log.periodEnd
                            ? log.periodStart
                            : `${log.periodStart} — ${log.periodEnd}`}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {log.user}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {log.duration}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {log.purpose}
                        </td>
                        <td className="px-4 py-3">
                          <button className="p-1.5 hover:bg-gray-200 rounded transition-colors">
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </td>
                      </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Disposal Request Tab */}
          {activeTab === "disposal" && (
            <div className="space-y-6">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-orange-900">
                    <strong>Note:</strong> All disposal requests must receive approval from
                    the Commune Officer before proceeding with asset disposal.
                  </p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Submit Disposal Request
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Asset <span className="text-red-500">*</span>
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white">
                      <option value="">Select asset for disposal</option>
                      {assets.map((asset) => (
                        <option key={asset.id} value={asset.id}>
                          {asset.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Justification for Disposal <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Explain why this asset needs to be disposed..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none resize-none"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Proposed Disposal Method <span className="text-red-500">*</span>
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white">
                      <option value="">Select disposal method</option>
                      <option value="sell">Sell</option>
                      <option value="scrap">Scrap</option>
                      <option value="transfer">Transfer</option>
                      <option value="write-off">Write Off</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Upload Valuation Document (Optional)
                    </label>
                    <button className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                      <Upload className="w-4 h-4" />
                      Choose File
                    </button>
                  </div>
                </div>
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    className="px-6 py-2.5 bg-[#032EA1] text-white rounded-lg hover:bg-[#0447D4] transition-colors font-medium shadow-sm"
                  >
                    Submit Disposal Request
                  </button>
                </div>
              </div>

              {/* Disposal Requests List */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <h4 className="font-semibold text-gray-900">
                    Submitted Disposal Requests
                  </h4>
                </div>
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Request ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Asset Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Disposal Method
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Submitted Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {disposalRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {request.id}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {request.assetName}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {request.disposalMethod}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {request.submittedDate}
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded border border-yellow-200">
                            {request.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button className="p-1.5 rounded-lg text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Asset Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-br from-[#032EA1] to-[#021c5e]">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {editingAsset ? "Edit Asset" : "Register New Asset"}
                </h2>
                {editingAsset && (
                  <p className="text-blue-200 text-sm mt-0.5">ID: {editingAsset}</p>
                )}
              </div>
              <button
                type="button"
                onClick={closeAddModal}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Form */}
            <div className="px-6 py-4 space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Asset Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={assetForm.type}
                    onChange={(e) => setField("type", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                  >
                    <option value="">Select type</option>
                    <option value="equipment">Equipment</option>
                    <option value="vehicle">Vehicle</option>
                    <option value="building">Building</option>
                    <option value="infrastructure">Infrastructure</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Asset Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter asset name"
                    value={assetForm.name}
                    onChange={(e) => setField("name", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Serial/Identification Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter serial number"
                    value={assetForm.serialNumber}
                    onChange={(e) => setField("serialNumber", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Acquisition Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={assetForm.acquisitionDate}
                    onChange={(e) => setField("acquisitionDate", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Acquisition Method <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={assetForm.acquisitionMethod}
                    onChange={(e) => setField("acquisitionMethod", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                  >
                    <option value="">Select method</option>
                    <option value="purchased">Purchased</option>
                    <option value="pearl">Donated by PEARL</option>
                    <option value="other-program">Donated by Other Program</option>
                    <option value="government">Government Grant</option>
                    <option value="own-funds">Own Funds</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Acquisition Cost or Estimated Value <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., $12,000"
                    value={assetForm.value}
                    onChange={(e) => setField("value", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter location"
                    value={assetForm.location}
                    onChange={(e) => setField("location", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Responsible Custodian Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter custodian name"
                    value={assetForm.custodian}
                    onChange={(e) => setField("custodian", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Asset Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={assetForm.assetStatus}
                    onChange={(e) => setField("assetStatus", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                  >
                    <option value="">Select status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe the asset..."
                    value={assetForm.description}
                    onChange={(e) => setField("description", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none resize-none"
                  ></textarea>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Asset Photo/Documentation
                  </label>

                  {/* Existing attachments (edit mode) */}
                  {existingAttachments.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-2 font-medium">Existing Attachments</p>
                      <div className="flex flex-wrap gap-3">
                        {existingAttachments.map((att) => (
                          <div key={att.id} className="relative group">
                            {att.type === "image" && att.url ? (
                              <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-blue-100 shadow-sm">
                                <img
                                  src={att.url}
                                  alt={att.name}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                                  <button
                                    type="button"
                                    onClick={() => setExistingAttachments((prev) => prev.filter((a) => a.id !== att.id))}
                                    className="opacity-0 group-hover:opacity-100 p-1.5 bg-red-500 text-white rounded-full transition-opacity shadow"
                                    aria-label={`Remove ${att.name}`}
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                <p className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[9px] px-1 py-0.5 truncate">{att.name}</p>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 pl-3 pr-2 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                                <FileText className="w-5 h-5 text-red-400 shrink-0" />
                                <div className="min-w-0">
                                  <p className="text-xs font-medium text-gray-800 truncate max-w-[120px]">{att.name}</p>
                                  <p className="text-[10px] text-gray-400">{att.size}</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setExistingAttachments((prev) => prev.filter((a) => a.id !== att.id))}
                                  className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                                  aria-label={`Remove ${att.name}`}
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <input
                    ref={registerFileInputRef}
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx"
                    className="sr-only"
                    onChange={(e) => {
                      addRegisterAssetFiles(e.target.files);
                      e.target.value = "";
                    }}
                  />
                  <div
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        registerFileInputRef.current?.click();
                      }
                    }}
                    onClick={() => registerFileInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addRegisterAssetFiles(e.dataTransfer.files);
                    }}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#032EA1] transition-colors cursor-pointer"
                  >
                    <Upload className="w-7 h-7 text-gray-400 mx-auto mb-1.5" />
                    <p className="text-sm text-gray-600">
                      Drag and drop files here or click to browse
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Multiple files supported — add photos or documents
                    </p>
                  </div>
                  {registerAssetFiles.length > 0 && (
                    <ul className="mt-2 flex flex-wrap gap-2" aria-label="Selected files">
                      {registerAssetFiles.map((file, i) => (
                        <li
                          key={`${file.name}-${file.size}-${i}`}
                          className="inline-flex items-center gap-1.5 pl-2.5 pr-1 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-800 max-w-full"
                        >
                          <span className="truncate max-w-[220px]" title={file.name}>
                            {file.name}
                          </span>
                          <span className="text-gray-500 shrink-0 tabular-nums">
                            {file.size >= 1024 * 1024
                              ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
                              : `${Math.max(1, Math.round(file.size / 1024))} KB`}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeRegisterAssetFile(i);
                            }}
                            className="p-1 rounded-md hover:bg-gray-200 text-gray-600 transition-colors"
                            aria-label={`Remove ${file.name}`}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-900">
                  <strong>Note:</strong> This asset will be submitted for verification by
                  the Commune Officer. It will only appear in the asset inventory after
                  approval.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button
                type="button"
                onClick={closeAddModal}
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button className="px-6 py-2.5 bg-[#032EA1] text-white rounded-lg text-sm font-medium hover:bg-[#0447D4] transition-colors">
                {editingAsset ? "Update Asset" : "Register Asset"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showConditionModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl my-8"
            role="dialog"
            aria-modal="true"
            aria-labelledby="condition-modal-title"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gradient-to-br from-[#032EA1] to-[#021c5e]">
              <h2
                id="condition-modal-title"
                className="text-xl font-bold text-white"
              >
                Update Asset Condition
              </h2>
              <button
                type="button"
                onClick={closeConditionModal}
                className="p-2 rounded-lg text-white hover:bg-white/20 transition-colors"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="px-6 py-4 max-h-[calc(100vh-220px)] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Asset
                  </label>
                  <select
                    value={conditionFormAssetId}
                    onChange={(e) => setConditionFormAssetId(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white"
                  >
                    <option value="">Choose an asset</option>
                    {assets.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Condition Rating
                  </label>
                  <select
                    value={conditionFormRating}
                    onChange={(e) => setConditionFormRating(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white"
                  >
                    <option value="">Select condition</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                    <option value="out-of-service">Out of Service</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Assessed
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Photos (Optional)
                  </label>
                  <input
                    ref={conditionPhotoInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => {
                      addConditionPhotoFiles(e.target.files);
                      e.target.value = "";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => conditionPhotoInputRef.current?.click()}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Choose Files
                  </button>
                  {conditionPhotoFiles.length > 0 && (
                    <ul
                      className="mt-2 flex flex-wrap gap-2"
                      aria-label="Selected photos"
                    >
                      {conditionPhotoFiles.map((file, i) => (
                        <li
                          key={`${file.name}-${file.size}-${i}`}
                          className="inline-flex items-center gap-1 pl-2 pr-1 py-0.5 bg-gray-50 border border-gray-200 rounded-md text-xs text-gray-800 max-w-full"
                        >
                          <span className="truncate max-w-[160px]" title={file.name}>
                            {file.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeConditionPhotoFile(i)}
                            className="p-0.5 rounded hover:bg-gray-200 text-gray-600"
                            aria-label={`Remove ${file.name}`}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Add any notes about the asset condition..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none resize-none"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button
                type="button"
                onClick={closeConditionModal}
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={closeConditionModal}
                className="px-6 py-2.5 bg-[#032EA1] text-white rounded-lg text-sm font-medium hover:bg-[#0447D4] transition-colors shadow-sm"
              >
                Update Condition
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
