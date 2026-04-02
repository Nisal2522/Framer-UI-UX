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

type UsageLogRow = {
  id: string;
  assetName: string;
  periodStart: string;
  periodEnd: string;
  user: string;
  duration: string;
  purpose: string;
};

const INITIAL_USAGE_LOGS: UsageLogRow[] = [
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
    periodStart: "2024-03-08",
    periodEnd: "2024-03-10",
    user: "Lim Dara",
    duration: "8 hours",
    purpose: "Transport to market",
  },
  {
    id: "UL-003",
    assetName: "Water Pump System",
    periodStart: "2024-03-15",
    periodEnd: "2024-03-16",
    user: "Chea Sokha",
    duration: "6 hours",
    purpose: "Irrigation support during dry spell at North Field",
  },
  {
    id: "UL-004",
    assetName: "Tractor (25HP)",
    periodStart: "2024-03-04",
    periodEnd: "2024-03-05",
    user: "Meas Sothea",
    duration: "5 hours",
    purpose: "Land preparation and plowing for spring planting",
  },
  {
    id: "UL-005",
    assetName: "Solar Drying System",
    periodStart: "2024-03-12",
    periodEnd: "2024-03-14",
    user: "Keo Vanna",
    duration: "12 hours",
    purpose: "Drying cassava chips for cooperative storage",
  },
];

/** Renders ISO YYYY-MM-DD as a readable period (compact range when same month/year). */
function formatUsagePeriodRange(isoStart: string, isoEnd: string): string {
  const startRaw = isoStart.trim();
  const endRaw = (isoEnd.trim() || startRaw).trim();
  const iso = /^\d{4}-\d{2}-\d{2}$/;
  const parse = (s: string) => {
    if (!iso.test(s)) return null;
    const d = new Date(`${s}T12:00:00`);
    return Number.isNaN(d.getTime()) ? null : d;
  };
  const s = parse(startRaw);
  const e = parse(endRaw);
  if (!s || !e) return `${startRaw} — ${endRaw}`;

  const sameDay = s.getTime() === e.getTime();
  const sameMonth =
    s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();
  const sameYear = s.getFullYear() === e.getFullYear();

  const mdn: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  const mdy: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };

  if (sameDay) return s.toLocaleDateString("en-US", mdy);
  if (sameMonth && sameYear) {
    return `${s.toLocaleDateString("en-US", mdn)} – ${e.getDate()}, ${e.getFullYear()}`;
  }
  if (sameYear) {
    return `${s.toLocaleDateString("en-US", mdn)} – ${e.toLocaleDateString("en-US", mdy)}`;
  }
  return `${s.toLocaleDateString("en-US", mdy)} – ${e.toLocaleDateString("en-US", mdy)}`;
}

type UsageFormState = {
  assetId: string;
  periodStart: string;
  periodEnd: string;
  user: string;
  duration: string;
  purpose: string;
};

const EMPTY_USAGE_FORM: UsageFormState = {
  assetId: "",
  periodStart: "",
  periodEnd: "",
  user: "",
  duration: "",
  purpose: "",
};

type DisposalRequestRow = {
  id: string;
  assetName: string;
  justification: string;
  disposalMethod: string;
  submittedDate: string;
  status: string;
};

const INITIAL_DISPOSAL_REQUESTS: DisposalRequestRow[] = [
  {
    id: "DR-001",
    assetName: "Old Harvester",
    justification: "Equipment is beyond repair and no longer functional",
    disposalMethod: "Scrap",
    submittedDate: "2024-03-20",
    status: "Pending",
  },
  {
    id: "DR-002",
    assetName: "Weighing Scale (500kg)",
    justification: "Calibration failed repeatedly; replacement parts unavailable",
    disposalMethod: "Write Off",
    submittedDate: "2024-03-18",
    status: "Pending",
  },
  {
    id: "DR-003",
    assetName: "Irrigation Pipeline (500m)",
    justification: "Section damaged by flooding; uneconomical to restore full length",
    disposalMethod: "Scrap",
    submittedDate: "2024-03-14",
    status: "Approved",
  },
  {
    id: "DR-004",
    assetName: "Seed Storage Warehouse",
    justification: "Structural issues identified; asset transferred to district authority",
    disposalMethod: "Transfer",
    submittedDate: "2024-03-11",
    status: "Pending",
  },
  {
    id: "DR-005",
    assetName: "Water Pump System",
    justification: "Surplus unit after upgrade; sale proceeds for cooperative fund",
    disposalMethod: "Sell",
    submittedDate: "2024-03-08",
    status: "Pending",
  },
];

const DISPOSAL_METHOD_OPTIONS = [
  { value: "sell", label: "Sell" },
  { value: "scrap", label: "Scrap" },
  { value: "transfer", label: "Transfer" },
  { value: "write-off", label: "Write Off" },
] as const;

type DisposalFormState = {
  assetId: string;
  justification: string;
  disposalMethod: string;
};

const EMPTY_DISPOSAL_FORM: DisposalFormState = {
  assetId: "",
  justification: "",
  disposalMethod: "",
};

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
  const [usageLogs, setUsageLogs] = useState<UsageLogRow[]>(INITIAL_USAGE_LOGS);
  const [usageDrawerOpen, setUsageDrawerOpen] = useState(false);
  const [usageForm, setUsageForm] = useState<UsageFormState>(EMPTY_USAGE_FORM);
  const [disposalRequests, setDisposalRequests] = useState<DisposalRequestRow[]>(
    INITIAL_DISPOSAL_REQUESTS
  );
  const [disposalDrawerOpen, setDisposalDrawerOpen] = useState(false);
  const [disposalForm, setDisposalForm] = useState<DisposalFormState>(EMPTY_DISPOSAL_FORM);
  const [disposalValuationFiles, setDisposalValuationFiles] = useState<File[]>([]);
  const disposalValuationInputRef = useRef<HTMLInputElement>(null);
  const [disposalSearch, setDisposalSearch] = useState("");

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
    if (!q) return usageLogs;
    return usageLogs.filter((log) => {
      const periodStr = `${log.periodStart} ${log.periodEnd}`;
      return (
        log.assetName.toLowerCase().includes(q) ||
        log.user.toLowerCase().includes(q) ||
        log.purpose.toLowerCase().includes(q) ||
        log.duration.toLowerCase().includes(q) ||
        periodStr.includes(q) ||
        log.id.toLowerCase().includes(q)
      );
    });
  }, [usageHistorySearch, usageLogs]);

  const closeUsageDrawer = () => {
    setUsageDrawerOpen(false);
    setUsageForm(EMPTY_USAGE_FORM);
  };

  const submitUsageRecord = () => {
    const asset = assets.find((a) => a.id === usageForm.assetId);
    if (
      !asset ||
      !usageForm.periodStart.trim() ||
      !usageForm.user.trim() ||
      !usageForm.duration.trim() ||
      !usageForm.purpose.trim()
    )
      return;
    setUsageLogs((prev) => {
      const maxNum = prev.reduce((acc, row) => {
        const m = /^UL-(\d+)$/i.exec(row.id);
        const n = m ? parseInt(m[1], 10) : 0;
        return Math.max(acc, n);
      }, 0);
      const nextId = `UL-${String(maxNum + 1).padStart(3, "0")}`;
      return [
        ...prev,
        {
          id: nextId,
          assetName: asset.name,
          periodStart: usageForm.periodStart,
          periodEnd: usageForm.periodEnd.trim() || usageForm.periodStart,
          user: usageForm.user.trim(),
          duration: usageForm.duration.trim(),
          purpose: usageForm.purpose.trim(),
        },
      ];
    });
    closeUsageDrawer();
  };

  const filteredDisposalRequests = useMemo(() => {
    const q = disposalSearch.trim().toLowerCase();
    if (!q) return disposalRequests;
    return disposalRequests.filter(
      (row) =>
        row.id.toLowerCase().includes(q) ||
        row.assetName.toLowerCase().includes(q) ||
        row.disposalMethod.toLowerCase().includes(q) ||
        row.status.toLowerCase().includes(q) ||
        row.submittedDate.includes(q) ||
        row.justification.toLowerCase().includes(q)
    );
  }, [disposalSearch, disposalRequests]);

  const closeDisposalDrawer = () => {
    setDisposalDrawerOpen(false);
    setDisposalForm(EMPTY_DISPOSAL_FORM);
    setDisposalValuationFiles([]);
    if (disposalValuationInputRef.current) disposalValuationInputRef.current.value = "";
  };

  const submitDisposalRequest = () => {
    const asset = assets.find((a) => a.id === disposalForm.assetId);
    const methodLabel =
      DISPOSAL_METHOD_OPTIONS.find((o) => o.value === disposalForm.disposalMethod)?.label ?? "";
    if (!asset || !disposalForm.justification.trim() || !methodLabel) return;
    const submittedDate = new Date().toISOString().slice(0, 10);
    setDisposalRequests((prev) => {
      const maxNum = prev.reduce((acc, row) => {
        const m = /^DR-(\d+)$/i.exec(row.id);
        const n = m ? parseInt(m[1], 10) : 0;
        return Math.max(acc, n);
      }, 0);
      const nextId = `DR-${String(maxNum + 1).padStart(3, "0")}`;
      return [
        ...prev,
        {
          id: nextId,
          assetName: asset.name,
          justification: disposalForm.justification.trim(),
          disposalMethod: methodLabel,
          submittedDate,
      status: "Pending",
    },
  ];
    });
    closeDisposalDrawer();
  };

  return (
    <div className="space-y-6 min-w-0 max-w-full">
      {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Asset Management</h1>
          <p className="text-gray-600 mt-1">
            Digital lifecycle management for all cooperative assets
          </p>
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
            <div className="relative min-h-[420px] space-y-6">
              {/* Title + search + filter + export + register — single toolbar row */}
              <div className="flex flex-wrap items-center gap-3 min-w-0">
                <h3 className="text-base font-semibold text-gray-900 shrink-0">
                  Asset Inventory
                </h3>
                <div className="flex flex-1 flex-wrap items-center justify-end gap-2 min-w-0">
                  <button
                    type="button"
                    className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Filter className="w-4 h-4" />
                    Filter
                  </button>
                  <div className="relative w-[220px] sm:w-[260px] min-w-[10rem] max-w-full shrink-0">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Search assets..."
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                    />
                  </div>
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
                  {!showAddModal && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingAsset(null);
                        setAssetForm(EMPTY_FORM);
                        setExistingAttachments([]);
                        setRegisterAssetFiles([]);
                        if (registerFileInputRef.current)
                          registerFileInputRef.current.value = "";
                        setShowAddModal(true);
                      }}
                      className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-[#032EA1] text-white rounded-lg hover:bg-[#0447D4] transition-colors text-sm font-medium whitespace-nowrap"
                    >
                      <Plus className="w-4 h-4" /> Register New Asset
                    </button>
                  )}
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
                        <th className="px-2 sm:px-3 py-2.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#032EA1]">
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
                          <td className="px-2 sm:px-3 py-2.5 align-middle max-w-0">
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
            <div className="relative min-h-[420px]">
              <div className="flex flex-col w-full">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-3">
                  <h3 className="text-base font-semibold text-gray-900">Usage History</h3>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3 w-full sm:w-auto">
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
                    {!usageDrawerOpen && (
                      <button
                        type="button"
                        onClick={() => {
                          setUsageForm(EMPTY_USAGE_FORM);
                          setUsageDrawerOpen(true);
                        }}
                        className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-[#032EA1] text-white rounded-lg hover:bg-[#0447D4] transition-colors text-sm font-medium whitespace-nowrap shrink-0"
                      >
                        <Plus className="w-4 h-4" /> Record Usage
                      </button>
                    )}
                  </div>
                </div>

                <div className="w-full min-w-0 rounded-2xl border border-gray-200/80 bg-white shadow-[0_4px_24px_-4px_rgba(3,46,161,0.08),0_2px_8px_-2px_rgba(0,0,0,0.06)] overflow-hidden flex-1">
                  <div className="w-full min-w-0 overflow-hidden">
                    <table className="w-full table-fixed border-collapse text-left">
                      <colgroup>
                        <col className="w-[20%]" />
                        <col className="w-[18%]" />
                        <col className="w-[14%]" />
                        <col className="w-[10%]" />
                        <col className="w-[30%]" />
                        <col className="w-[8%]" />
                      </colgroup>
                      <thead>
                        <tr className="bg-gradient-to-r from-[#032EA1]/[0.07] via-[#032EA1]/[0.04] to-transparent border-b border-[#032EA1]/15">
                          <th className="px-2 sm:px-3 py-2.5 text-left text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#032EA1]">
                            Asset Name
                          </th>
                          <th className="px-2 sm:px-3 py-2.5 text-left text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#032EA1]">
                            Select Period
                          </th>
                          <th className="px-2 sm:px-3 py-2.5 text-left text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#032EA1]">
                            User
                          </th>
                          <th className="px-2 sm:px-3 py-2.5 text-left text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#032EA1]">
                            Duration
                          </th>
                          <th className="px-2 sm:px-3 py-2.5 text-left text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#032EA1]">
                            Purpose
                          </th>
                          <th className="px-2 sm:px-3 py-2.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#032EA1] text-center">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredUsageLogs.length === 0 ? (
                          <tr>
                            <td
                              colSpan={6}
                              className="px-4 py-10 text-center text-sm text-gray-400"
                            >
                              {usageLogs.length === 0
                                ? 'No usage records yet. Click "Record Usage" to get started.'
                                : "No usage records match your search."}
                            </td>
                          </tr>
                        ) : (
                          filteredUsageLogs.map((log, rowIdx) => (
                            <tr
                              key={log.id}
                              className={`group transition-colors ${
                                rowIdx % 2 === 0 ? "bg-white" : "bg-slate-50/60"
                              } hover:bg-[#032EA1]/[0.04]`}
                            >
                              <td className="px-2 sm:px-3 py-2.5 align-middle max-w-0">
                                <span
                                  className="text-xs sm:text-sm font-semibold text-gray-900 leading-snug line-clamp-2"
                                  title={log.assetName}
                                >
                                  {log.assetName}
                                </span>
                              </td>
                              <td className="px-2 sm:px-3 py-2.5 align-middle max-w-0">
                                <span className="block text-xs text-gray-700 leading-snug line-clamp-2">
                                  {formatUsagePeriodRange(log.periodStart, log.periodEnd)}
                                </span>
                              </td>
                              <td className="px-2 sm:px-3 py-2.5 align-middle max-w-0">
                                <span className="text-xs text-gray-700 line-clamp-2" title={log.user}>
                                  {log.user}
                                </span>
                              </td>
                              <td className="px-2 sm:px-3 py-2.5 align-middle whitespace-nowrap">
                                <span className="text-xs text-gray-700">{log.duration}</span>
                              </td>
                              <td className="px-2 sm:px-3 py-2.5 align-middle max-w-0">
                                <span
                                  className="block text-xs text-gray-700 leading-snug line-clamp-2"
                                  title={log.purpose}
                                >
                                  {log.purpose}
                                </span>
                              </td>
                              <td className="px-2 sm:px-3 py-2.5 align-middle text-center">
                                <div className="flex items-center justify-center">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setUsageLogs((prev) => prev.filter((r) => r.id !== log.id))
                                    }
                                    className="p-1.5 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                                    aria-label="Delete usage record"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {usageDrawerOpen && (
                <>
                  <div
                    className="fixed inset-0 z-[100] bg-black/40"
                    aria-hidden
                    onClick={closeUsageDrawer}
                  />
                  <div
                    className="fixed inset-y-0 right-0 z-[110] flex w-full max-w-md flex-col border-l border-gray-200 bg-gray-50 shadow-2xl"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="usage-drawer-title"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-gradient-to-br from-[#032EA1] to-[#021c5e] shrink-0">
                      <h4 id="usage-drawer-title" className="text-sm font-semibold text-white">
                  Record Asset Usage
                </h4>
                      <button
                        type="button"
                        onClick={closeUsageDrawer}
                        className="p-1.5 rounded-lg hover:bg-white/15 text-white/90 transition-colors"
                        aria-label="Close"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4 space-y-3">
                  <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                      Asset <span className="text-red-500">*</span>
                    </label>
                        <select
                          value={usageForm.assetId}
                          onChange={(e) =>
                            setUsageForm((f) => ({ ...f, assetId: e.target.value }))
                          }
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white"
                        >
                      <option value="">Select asset</option>
                      {assets.map((asset) => (
                        <option key={asset.id} value={asset.id}>
                          {asset.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                      Select Period <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="date"
                        aria-label="Period start"
                            value={usageForm.periodStart}
                            onChange={(e) =>
                              setUsageForm((f) => ({ ...f, periodStart: e.target.value }))
                            }
                            className="w-full min-w-0 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white"
                      />
                      <input
                        type="date"
                        aria-label="Period end"
                            value={usageForm.periodEnd}
                            onChange={(e) =>
                              setUsageForm((f) => ({ ...f, periodEnd: e.target.value }))
                            }
                            className="w-full min-w-0 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white"
                      />
                    </div>
                  </div>
                  <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                      User (Member Name or Group) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter member name or group"
                          value={usageForm.user}
                          onChange={(e) =>
                            setUsageForm((f) => ({ ...f, user: e.target.value }))
                          }
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white"
                    />
                  </div>
                  <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                      Duration <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 4 hours"
                          value={usageForm.duration}
                          onChange={(e) =>
                            setUsageForm((f) => ({ ...f, duration: e.target.value }))
                          }
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white"
                    />
                  </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                      Purpose <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Describe the purpose of asset use..."
                          value={usageForm.purpose}
                          onChange={(e) =>
                            setUsageForm((f) => ({ ...f, purpose: e.target.value }))
                          }
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none resize-none bg-white"
                        />
                  </div>
                </div>
                    <div className="px-5 py-3 border-t border-gray-200 bg-white flex justify-end gap-2 shrink-0">
                  <button
                    type="button"
                        onClick={closeUsageDrawer}
                        className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={submitUsageRecord}
                        className="px-4 py-1.5 text-sm bg-[#032EA1] text-white rounded-lg hover:bg-[#0447D4] transition-colors font-medium"
                  >
                    Record Usage
                  </button>
                </div>
              </div>
                </>
              )}
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

              <div className="relative min-h-[420px]">
                <div className="flex flex-col w-full">
                  <div className="flex flex-wrap items-center justify-between gap-3 min-w-0 pb-3 w-full">
                    <h3 className="text-base font-semibold text-gray-900 shrink-0">
                      Submitted Disposal Requests
                    </h3>
                    <div className="flex flex-wrap items-center justify-end gap-2 shrink-0 min-w-0">
                      <button
                        type="button"
                        className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Filter className="w-4 h-4" />
                        Filter
                      </button>
                      <div className="relative w-[220px] sm:w-[260px] min-w-[10rem] max-w-full shrink-0">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        <input
                          type="search"
                          value={disposalSearch}
                          onChange={(e) => setDisposalSearch(e.target.value)}
                          placeholder="Search requests..."
                          className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                          aria-label="Search disposal requests"
                        />
                      </div>
                      {!disposalDrawerOpen && (
                        <button
                          type="button"
                          onClick={() => {
                            setDisposalForm(EMPTY_DISPOSAL_FORM);
                            setDisposalValuationFiles([]);
                            if (disposalValuationInputRef.current)
                              disposalValuationInputRef.current.value = "";
                            setDisposalDrawerOpen(true);
                          }}
                          className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-[#032EA1] text-white rounded-lg hover:bg-[#0447D4] transition-colors text-sm font-medium whitespace-nowrap"
                        >
                          <Plus className="w-4 h-4" /> New Disposal Request
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="w-full min-w-0 rounded-2xl border border-gray-200/80 bg-white shadow-[0_4px_24px_-4px_rgba(3,46,161,0.08),0_2px_8px_-2px_rgba(0,0,0,0.06)] overflow-hidden flex-1">
                    <div className="w-full min-w-0 overflow-hidden">
                      <table className="w-full table-fixed border-collapse text-left">
                        <colgroup>
                          <col className="w-[11%]" />
                          <col className="w-[24%]" />
                          <col className="w-[14%]" />
                          <col className="w-[12%]" />
                          <col className="w-[15%]" />
                          <col className="w-[10%]" />
                        </colgroup>
                        <thead>
                          <tr className="bg-gradient-to-r from-[#032EA1]/[0.07] via-[#032EA1]/[0.04] to-transparent border-b border-[#032EA1]/15">
                            <th className="px-2 sm:px-3 py-2.5 text-left text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#032EA1]">
                              Request ID
                            </th>
                            <th className="px-2 sm:px-3 py-2.5 text-left text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#032EA1]">
                        Asset Name
                      </th>
                            <th className="px-2 sm:px-3 py-2.5 text-left text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#032EA1]">
                              Disposal Method
                      </th>
                            <th className="px-2 sm:px-3 py-2.5 text-left text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#032EA1]">
                              Submitted Date
                      </th>
                            <th className="px-2 sm:px-3 py-2.5 text-left text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#032EA1]">
                              Status
                      </th>
                            <th className="px-2 sm:px-3 py-2.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#032EA1] text-center">
                        Actions
                      </th>
                    </tr>
                  </thead>
                        <tbody className="divide-y divide-gray-100">
                          {filteredDisposalRequests.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                                className="px-4 py-10 text-center text-sm text-gray-400"
                        >
                                {disposalRequests.length === 0
                                  ? 'No disposal requests yet. Click "New Disposal Request" to get started.'
                                  : "No requests match your search."}
                        </td>
                      </tr>
                    ) : (
                            filteredDisposalRequests.map((request, rowIdx) => (
                              <tr
                                key={request.id}
                                className={`group transition-colors ${
                                  rowIdx % 2 === 0 ? "bg-white" : "bg-slate-50/60"
                                } hover:bg-[#032EA1]/[0.04]`}
                              >
                                <td className="px-2 sm:px-3 py-2.5 align-middle whitespace-nowrap">
                                  <span className="inline-flex font-mono text-[10px] sm:text-xs font-semibold text-[#032EA1] bg-[#032EA1]/8 px-2 py-0.5 rounded-md border border-[#032EA1]/10 whitespace-nowrap">
                                    {request.id}
                                  </span>
                        </td>
                                <td className="px-2 sm:px-3 py-2.5 align-middle max-w-0">
                                  <span
                                    className="text-xs sm:text-sm font-semibold text-gray-900 leading-snug line-clamp-2"
                                    title={request.assetName}
                                  >
                                    {request.assetName}
                                  </span>
                        </td>
                                <td className="px-2 sm:px-3 py-2.5 align-middle max-w-0">
                                  <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-[11px] font-medium text-gray-800 border border-gray-200/90 line-clamp-2">
                                    {request.disposalMethod}
                                  </span>
                        </td>
                                <td className="px-2 sm:px-3 py-2.5 align-middle whitespace-nowrap">
                                  <span className="text-xs text-gray-700 tabular-nums">
                                    {request.submittedDate}
                                  </span>
                        </td>
                                <td className="px-2 sm:px-3 py-2.5 align-middle max-w-0">
                                  {request.status === "Approved" ? (
                                    <span className="inline-flex items-center gap-0.5 px-1.5 sm:px-2 py-0.5 bg-emerald-500 text-white rounded-full text-[10px] sm:text-xs font-semibold shadow-sm">
                                      <CheckCircle className="w-3 h-3 shrink-0" aria-hidden />
                                      <span className="truncate">Approved</span>
                                    </span>
                                  ) : (
                                    <span
                                      className="inline-flex items-center gap-0.5 px-1.5 sm:px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full text-[10px] sm:text-xs font-semibold border border-amber-200 max-w-full"
                                      title={request.status}
                                    >
                                      <Clock className="w-3 h-3 shrink-0" aria-hidden />
                                      <span className="truncate">{request.status}</span>
                                    </span>
                                  )}
                        </td>
                                <td className="px-2 sm:px-3 py-2.5 align-middle text-center">
                                  <div className="flex items-center justify-center">
                                    <button
                                      type="button"
                                      className="p-1.5 rounded-lg text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                                      aria-label="View request"
                                    >
                                      <Eye className="w-4 h-4" />
                          </button>
                                  </div>
                        </td>
                      </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
                </div>
              </div>

                {disposalDrawerOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-[100] bg-black/40"
                      aria-hidden
                      onClick={closeDisposalDrawer}
                    />
                    <div
                      className="fixed inset-y-0 right-0 z-[110] flex w-full max-w-md flex-col border-l border-gray-200 bg-gray-50 shadow-2xl"
                      role="dialog"
                      aria-modal="true"
                      aria-labelledby="disposal-drawer-title"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-gradient-to-br from-[#032EA1] to-[#021c5e] shrink-0">
                        <h4
                          id="disposal-drawer-title"
                          className="text-sm font-semibold text-white"
                        >
                  Submit Disposal Request
                </h4>
                        <button
                          type="button"
                          onClick={closeDisposalDrawer}
                          className="p-1.5 rounded-lg hover:bg-white/15 text-white/90 transition-colors"
                          aria-label="Close"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4 space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                      Asset <span className="text-red-500">*</span>
                    </label>
                          <select
                            value={disposalForm.assetId}
                            onChange={(e) =>
                              setDisposalForm((f) => ({ ...f, assetId: e.target.value }))
                            }
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white"
                          >
                      <option value="">Select asset for disposal</option>
                      {assets.map((asset) => (
                        <option key={asset.id} value={asset.id}>
                          {asset.name}
                        </option>
                      ))}
                    </select>
                  </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                      Justification for Disposal <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Explain why this asset needs to be disposed..."
                            value={disposalForm.justification}
                            onChange={(e) =>
                              setDisposalForm((f) => ({ ...f, justification: e.target.value }))
                            }
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none resize-none bg-white"
                          />
                  </div>
                  <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                      Proposed Disposal Method <span className="text-red-500">*</span>
                    </label>
                          <select
                            value={disposalForm.disposalMethod}
                            onChange={(e) =>
                              setDisposalForm((f) => ({
                                ...f,
                                disposalMethod: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white"
                          >
                      <option value="">Select disposal method</option>
                            {DISPOSAL_METHOD_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                    </select>
                  </div>
                  <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                      Upload Valuation Document (Optional)
                    </label>
                          <input
                            ref={disposalValuationInputRef}
                            type="file"
                            className="sr-only"
                            accept=".pdf,.doc,.docx,image/*"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              setDisposalValuationFiles(f ? [f] : []);
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => disposalValuationInputRef.current?.click()}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 bg-white"
                          >
                      <Upload className="w-4 h-4" />
                            {disposalValuationFiles[0]?.name ?? "Choose File"}
                    </button>
                  </div>
                </div>
                      <div className="px-5 py-3 border-t border-gray-200 bg-white flex justify-end gap-2 shrink-0">
                  <button
                    type="button"
                          onClick={closeDisposalDrawer}
                          className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={submitDisposalRequest}
                          className="px-4 py-1.5 text-sm bg-[#032EA1] text-white rounded-lg hover:bg-[#0447D4] transition-colors font-medium"
                  >
                    Submit Disposal Request
                  </button>
                </div>
              </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Register / Edit Asset — overlay drawer (same pattern as Usage / Disposal) */}
      {showAddModal && (
        <>
          <div
            className="fixed inset-0 z-[100] bg-black/40"
            aria-hidden
            onClick={closeAddModal}
          />
          <div
            className="fixed inset-y-0 right-0 z-[110] flex w-full max-w-3xl flex-col border-l border-gray-200 bg-gray-50 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="asset-drawer-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-gradient-to-br from-[#032EA1] to-[#021c5e] shrink-0">
              <div>
                <h2 id="asset-drawer-title" className="text-sm font-semibold text-white">
                  {editingAsset ? "Edit Asset" : "Register New Asset"}
                </h2>
                {editingAsset && (
                  <p className="text-xs text-white/80 mt-0.5 font-mono">ID: {editingAsset}</p>
                )}
              </div>
              <button
                type="button"
                onClick={closeAddModal}
                className="p-1.5 rounded-lg hover:bg-white/15 text-white/90 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Asset Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={assetForm.type}
                    onChange={(e) => setField("type", e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white"
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
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Asset Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter asset name"
                    value={assetForm.name}
                    onChange={(e) => setField("name", e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Serial/Identification Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter serial number"
                    value={assetForm.serialNumber}
                    onChange={(e) => setField("serialNumber", e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Acquisition Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={assetForm.acquisitionDate}
                    onChange={(e) => setField("acquisitionDate", e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Acquisition Method <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={assetForm.acquisitionMethod}
                    onChange={(e) => setField("acquisitionMethod", e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white"
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
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Acquisition Cost or Estimated Value <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., $12,000"
                    value={assetForm.value}
                    onChange={(e) => setField("value", e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Current Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter location"
                    value={assetForm.location}
                    onChange={(e) => setField("location", e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Responsible Custodian Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter custodian name"
                    value={assetForm.custodian}
                    onChange={(e) => setField("custodian", e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Asset Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={assetForm.assetStatus}
                    onChange={(e) => setField("assetStatus", e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white"
                  >
                    <option value="">Select status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe the asset..."
                    value={assetForm.description}
                    onChange={(e) => setField("description", e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none resize-none bg-white"
                  ></textarea>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
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
                    className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#032EA1] transition-colors cursor-pointer bg-white"
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

            <div className="px-5 py-3 border-t border-gray-200 bg-white flex justify-end gap-2 shrink-0">
              <button
                type="button"
                onClick={closeAddModal}
                className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-1.5 text-sm bg-[#032EA1] text-white rounded-lg hover:bg-[#0447D4] transition-colors font-medium"
              >
                {editingAsset ? "Update Asset" : "Register Asset"}
              </button>
            </div>
          </div>
        </>
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
