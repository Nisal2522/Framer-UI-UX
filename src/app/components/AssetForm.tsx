import { useState } from "react";
import { X, Upload, Save, Image as ImageIcon, Calendar } from "lucide-react";

interface AssetFormProps {
  onClose: () => void;
}

export function AssetForm({ onClose }: AssetFormProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-[#032EA1] to-[#0447D4]">
          <h2 className="text-2xl font-bold text-white">Register New Asset</h2>
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
            {/* AC Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Cooperative Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Agricultural Cooperative <span className="text-red-500">*</span>
                  </label>
                  <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white">
                    <option value="">Select AC</option>
                    <option value="AC-001">AC-001 - Kampong Thom Rice Cooperative</option>
                    <option value="AC-042">AC-042 - Siem Reap Vegetable Growers</option>
                    <option value="MAC-015">MAC-015 - Battambang Modern Agriculture</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    AC Location
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 outline-none"
                    value="Kampong Thom, Baray"
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* Asset Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Asset Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Asset Name/Description <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                    placeholder="e.g., Rice Milling Machine, Tractor, Storage Facility"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Asset Type <span className="text-red-500">*</span>
                  </label>
                  <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white">
                    <option value="">Select Type</option>
                    <option value="machinery">Machinery</option>
                    <option value="equipment">Processing Equipment</option>
                    <option value="infrastructure">Infrastructure</option>
                    <option value="vehicle">Vehicle</option>
                    <option value="tools">Tools & Equipment</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Serial Number / ID
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                    placeholder="Enter serial or identification number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand/Manufacturer
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                    placeholder="Enter brand or manufacturer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Model/Specifications
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                    placeholder="Enter model or specifications"
                  />
                </div>
              </div>
            </div>

            {/* Acquisition Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Acquisition Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Acquisition Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Source of Asset <span className="text-red-500">*</span>
                  </label>
                  <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white">
                    <option value="">Select Source</option>
                    <option value="purchased">Purchased by AC</option>
                    <option value="grant">Grant/Donation</option>
                    <option value="pearl">PEARL Project</option>
                    <option value="government">Government Support</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Donor/Program (if applicable)
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                    placeholder="e.g., PEARL, FAO, GIZ"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Asset Value (USD) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* Condition & Location */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Current Condition & Location
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Condition <span className="text-red-500">*</span>
                  </label>
                  <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white">
                    <option value="">Select Condition</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                    <option value="out-of-service">Out of Service</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Physical Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                    placeholder="e.g., Main Warehouse, Field Site A"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Condition Notes
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none resize-none"
                    placeholder="Provide additional notes about the asset condition"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Maintenance Schedule */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Maintenance Schedule
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Maintenance Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Next Scheduled Maintenance
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maintenance Notes
                  </label>
                  <textarea
                    rows={2}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none resize-none"
                    placeholder="Details about maintenance requirements or history"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Usage Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Usage Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Asset Usage Type
                  </label>
                  <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none bg-white">
                    <option value="">Select Usage Type</option>
                    <option value="communal">Communal/Shared</option>
                    <option value="rental">Available for Rental</option>
                    <option value="cooperative">Cooperative Use Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Responsible Person
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
                    placeholder="Name of person responsible for asset"
                  />
                </div>
              </div>
            </div>

            {/* Asset Photos */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Asset Photos
              </h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#032EA1] transition-colors cursor-pointer">
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-1">
                  Upload photos of the asset
                </p>
                <p className="text-xs text-gray-500">
                  JPG, PNG - Max 5MB per photo, up to 5 photos
                </p>
              </div>
            </div>

            {/* Supporting Documents */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Supporting Documents
              </h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#032EA1] transition-colors cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-1">
                  Upload purchase receipts, warranty documents, manuals
                </p>
                <p className="text-xs text-gray-500">
                  PDF, DOC, JPG - Max 10MB
                </p>
              </div>
            </div>

            {/* Eligibility Check */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">
                Eligibility Check
              </h4>
              <div className="space-y-2 text-sm text-blue-700">
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 rounded" />
                  <label>AC graduation level meets requirements for this asset</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 rounded" />
                  <label>Business plan approved for asset acquisition</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 rounded" />
                  <label>Asset ownership documents verified</label>
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
              <Save className="w-4 h-4" />
              Register Asset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
