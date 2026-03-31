import { useState } from "react";
import {
  BarChart3,
  FileText,
  Download,
  Filter,
  Calendar,
  Building2,
  Package,
  Users,
  TrendingUp,
  Globe,
} from "lucide-react";

export function Reports() {
  const [selectedReport, setSelectedReport] = useState("ac-registration");
  const [language, setLanguage] = useState("EN");

  const reports = [
    {
      id: "ac-registration",
      title: "AC Registration Summary",
      description: "Complete listing of all registered Agricultural Cooperatives",
      icon: Building2,
      color: "blue",
    },
    {
      id: "business-plan",
      title: "Business Plan Status",
      description: "Overview of all business plans with status and progress",
      icon: FileText,
      color: "emerald",
    },
    {
      id: "asset-inventory",
      title: "Asset Inventory",
      description: "Complete asset inventory with condition and maintenance",
      icon: Package,
      color: "purple",
    },
    {
      id: "member-demographics",
      title: "Member Demographics",
      description: "Demographic breakdown by gender, age, crops, and land area",
      icon: Users,
      color: "orange",
    },
  ];

  // Sample data for AC Registration Summary
  const acRegistrationData = [
    {
      regNumber: "AC-KT-2024-157",
      name: "Prasat Sambor Rung Roeang Modern Agricultural Cooperative",
      type: "Agricultural Cooperative",
      province: "Kampong Thom",
      district: "Baray",
      commune: "Baray Commune",
      graduationStage: "Expanding",
      status: "Active",
      registrationDate: "2015-06-15",
      totalMembers: 447,
    },
  ];

  // Sample data for Business Plan Status
  const businessPlanData = [
    {
      planName: "Rice Production Expansion 2024",
      planYear: "2024",
      planType: "Production Expansion",
      status: "Approved",
      submissionDate: "2024-01-15",
      approvalDate: "2024-02-01",
      progress: 73,
    },
  ];

  // Sample data for Asset Inventory
  const assetInventoryData = [
    {
      assetId: "AST-001",
      assetName: "Rice Mill Machine",
      type: "Equipment",
      condition: "Good",
      acquisitionSource: "Donated by PEARL",
      estimatedValue: "$12,000",
      lastMaintenance: "2024-02-15",
    },
    {
      assetId: "AST-002",
      assetName: "Delivery Truck",
      type: "Vehicle",
      condition: "Fair",
      acquisitionSource: "Own Funds",
      estimatedValue: "$28,000",
      lastMaintenance: "2024-01-20",
    },
  ];

  // Sample data for Member Demographics
  const memberDemographicsData = {
    totalMembers: 447,
    genderBreakdown: {
      male: 259,
      female: 188,
    },
    ageGroups: [
      { group: "18-25", count: 45 },
      { group: "26-35", count: 123 },
      { group: "36-45", count: 156 },
      { group: "46-55", count: 89 },
      { group: "55+", count: 34 },
    ],
    cropTypes: [
      { crop: "Rice", count: 234 },
      { crop: "Cassava", count: 156 },
      { crop: "Corn", count: 98 },
      { crop: "Vegetables", count: 76 },
    ],
    avgLandArea: 4.8,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Reporting and Analytics
          </h1>
          <p className="text-gray-600 mt-1">
            Generate standard reports and analytics for your cooperative
          </p>
        </div>
        <div className="flex gap-3">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none text-sm font-medium"
          >
            <option value="EN">English</option>
            <option value="KH">ភាសាខ្មែរ (Khmer)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Report Selection Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Standard Reports</h3>
            <div className="space-y-2">
              {reports.map((report) => {
                const Icon = report.icon;
                return (
                  <button
                    key={report.id}
                    onClick={() => setSelectedReport(report.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                      selectedReport === report.id
                        ? "bg-[#032EA1] text-white shadow-md"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{report.title}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* AC Registration Summary */}
          {selectedReport === "ac-registration" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        AC Registration Summary
                      </h2>
                      <p className="text-sm text-gray-600">
                        Complete listing of cooperative information
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                      <Filter className="w-4 h-4" />
                      Filter
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-[#0F2F8F] text-white rounded-lg text-sm font-medium hover:bg-[#0D2A7D] transition-colors">
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  </div>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                  <select className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none text-sm">
                    <option value="">All Provinces</option>
                    <option value="kampong-thom">Kampong Thom</option>
                    <option value="siem-reap">Siem Reap</option>
                  </select>
                  <select className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none text-sm">
                    <option value="">All Types</option>
                    <option value="agricultural">Agricultural Cooperative</option>
                  </select>
                  <select className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none text-sm">
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                {/* Table */}
                <div className="border border-gray-200 rounded-lg overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                          Reg Number
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                          Province/District
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                          Stage
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                          Members
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {acRegistrationData.map((ac, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {ac.regNumber}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {ac.name}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {ac.province} / {ac.district}
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded border border-purple-200">
                              {ac.graduationStage}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded border border-emerald-200">
                              {ac.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {ac.totalMembers}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">Rows per page:</label>
                    <select className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none">
                      <option value="10">10</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                    </select>
                  </div>
                  <p className="text-sm text-gray-600">
                    Showing 1-1 of 1 records
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Business Plan Status */}
          {selectedReport === "business-plan" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Business Plan Status
                      </h2>
                      <p className="text-sm text-gray-600">
                        Overview of all business plans with progress
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                      <Filter className="w-4 h-4" />
                      Filter
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-[#0F2F8F] text-white rounded-lg text-sm font-medium hover:bg-[#0D2A7D] transition-colors">
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  </div>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                  <select className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none text-sm">
                    <option value="">All Status</option>
                    <option value="approved">Approved</option>
                    <option value="under-review">Under Review</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <select className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none text-sm">
                    <option value="">All Years</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                  </select>
                  <select className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none text-sm">
                    <option value="">All Provinces</option>
                    <option value="kampong-thom">Kampong Thom</option>
                  </select>
                </div>

                {/* Table */}
                <div className="border border-gray-200 rounded-lg overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                          Plan Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                          Year
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                          Type
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                          Submission
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                          Approval
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                          Progress
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {businessPlanData.map((plan, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {plan.planName}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {plan.planYear}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {plan.planType}
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded border border-emerald-200">
                              {plan.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {plan.submissionDate}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {plan.approvalDate}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-emerald-600 h-2 rounded-full"
                                  style={{ width: `${plan.progress}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-gray-900 min-w-[3rem] text-right">
                                {plan.progress}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Asset Inventory */}
          {selectedReport === "asset-inventory" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Asset Inventory
                      </h2>
                      <p className="text-sm text-gray-600">
                        Complete asset inventory with condition details
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                      <Filter className="w-4 h-4" />
                      Filter
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-[#0F2F8F] text-white rounded-lg text-sm font-medium hover:bg-[#0D2A7D] transition-colors">
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  </div>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                  <select className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none text-sm">
                    <option value="">All Asset Types</option>
                    <option value="equipment">Equipment</option>
                    <option value="vehicle">Vehicle</option>
                  </select>
                  <select className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none text-sm">
                    <option value="">All Conditions</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                  <select className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none text-sm">
                    <option value="">All Sources</option>
                    <option value="pearl">Donated by PEARL</option>
                    <option value="own-funds">Own Funds</option>
                  </select>
                </div>

                {/* Table */}
                <div className="border border-gray-200 rounded-lg overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                          Asset ID
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                          Asset Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                          Type
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                          Condition
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                          Source
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                          Value
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                          Last Maintenance
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {assetInventoryData.map((asset, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {asset.assetId}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {asset.assetName}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {asset.type}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-medium rounded border ${
                                asset.condition === "Good"
                                  ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                  : "bg-blue-100 text-blue-700 border-blue-200"
                              }`}
                            >
                              {asset.condition}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {asset.acquisitionSource}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {asset.estimatedValue}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {asset.lastMaintenance}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Member Demographics */}
          {selectedReport === "member-demographics" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Member Demographics
                      </h2>
                      <p className="text-sm text-gray-600">
                        Demographic breakdown and statistics
                      </p>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2.5 bg-[#0F2F8F] text-white rounded-lg text-sm font-medium hover:bg-[#0D2A7D] transition-colors">
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700">Total Members</p>
                    <p className="text-3xl font-bold text-blue-900 mt-2">
                      {memberDemographicsData.totalMembers}
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <p className="text-sm text-purple-700">Male Members</p>
                    <p className="text-3xl font-bold text-purple-900 mt-2">
                      {memberDemographicsData.genderBreakdown.male}
                    </p>
                    <p className="text-xs text-purple-600 mt-1">
                      {((memberDemographicsData.genderBreakdown.male / memberDemographicsData.totalMembers) * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="p-4 bg-pink-50 border border-pink-200 rounded-lg">
                    <p className="text-sm text-pink-700">Female Members</p>
                    <p className="text-3xl font-bold text-pink-900 mt-2">
                      {memberDemographicsData.genderBreakdown.female}
                    </p>
                    <p className="text-xs text-pink-600 mt-1">
                      {((memberDemographicsData.genderBreakdown.female / memberDemographicsData.totalMembers) * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <p className="text-sm text-emerald-700">Avg Land Area</p>
                    <p className="text-3xl font-bold text-emerald-900 mt-2">
                      {memberDemographicsData.avgLandArea} Ha
                    </p>
                  </div>
                </div>

                {/* Age Distribution */}
                <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-4">Age Distribution</h3>
                  <div className="space-y-3">
                    {memberDemographicsData.ageGroups.map((group) => (
                      <div key={group.group}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-700">{group.group} years</span>
                          <span className="font-medium text-gray-900">{group.count} members</span>
                        </div>
                        <div className="bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-[#032EA1] h-2 rounded-full"
                            style={{
                              width: `${(group.count / memberDemographicsData.totalMembers) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Crop Distribution */}
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-4">Crop Type Distribution</h3>
                  <div className="space-y-3">
                    {memberDemographicsData.cropTypes.map((crop) => (
                      <div key={crop.crop}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-700">{crop.crop}</span>
                          <span className="font-medium text-gray-900">{crop.count} farmers</span>
                        </div>
                        <div className="bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-emerald-600 h-2 rounded-full"
                            style={{
                              width: `${(crop.count / 564) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
