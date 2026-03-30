import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  Users,
  Plus,
  Search,
  Filter,
  Download,
  Edit2,
  Eye,
  UserCircle,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import { farmerMemberPortraitUrl } from "../utils/committeePortraits";

const PAGE_SIZE = 100;
const TOTAL_MEMBERS = 447;
const MALE_COUNT = 258;
const FEMALE_COUNT = 186;
const OTHER_COUNT = TOTAL_MEMBERS - MALE_COUNT - FEMALE_COUNT;

type MemberRow = {
  id: string;
  fullName: string;
  nationalId: string;
  gender: string;
  dateOfBirth: string;
  age: number;
  village: string;
  phone: string;
  landArea: number;
  crops: string[];
  livestock: { type: string; count: number }[];
  membershipStartDate: string;
  status: string;
};

const seedMembers: MemberRow[] = [
  {
    id: "FM-001",
    fullName: "Sok Pisey",
    nationalId: "010234567",
    gender: "Male",
    dateOfBirth: "1979-03-15",
    age: 45,
    village: "Baray Village",
    phone: "+855 12 345 678",
    landArea: 5.2,
    crops: ["Rice", "Cassava"],
    livestock: [{ type: "Cattle", count: 3 }, { type: "Chickens", count: 20 }],
    membershipStartDate: "2015-06-15",
    status: "Active",
  },
  {
    id: "FM-002",
    fullName: "Chea Sokha",
    nationalId: "010345678",
    gender: "Female",
    dateOfBirth: "1986-07-22",
    age: 38,
    village: "Baray Village",
    phone: "+855 23 456 789",
    landArea: 3.8,
    crops: ["Cassava", "Vegetables"],
    livestock: [{ type: "Pigs", count: 5 }],
    membershipStartDate: "2016-03-10",
    status: "Active",
  },
  {
    id: "FM-003",
    fullName: "Lim Dara",
    nationalId: "010456789",
    gender: "Male",
    dateOfBirth: "1972-11-08",
    age: 52,
    village: "North Village",
    phone: "+855 34 567 890",
    landArea: 7.5,
    crops: ["Rice", "Corn"],
    livestock: [{ type: "Cattle", count: 5 }, { type: "Buffalo", count: 2 }],
    membershipStartDate: "2015-06-15",
    status: "Active",
  },
];

export function Members() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const allMembers = useMemo(() => {
    const list: MemberRow[] = [];
    for (let i = 0; i < TOTAL_MEMBERS; i++) {
      const seed = seedMembers[i % 3];
      let gender: string;
      if (i < MALE_COUNT) gender = "Male";
      else if (i < MALE_COUNT + FEMALE_COUNT) gender = "Female";
      else gender = "Other";
      list.push({
        ...seed,
        id: `FM-${String(i + 1).padStart(3, "0")}`,
        fullName: i < 3 ? seed.fullName : `Member ${i + 1}`,
        nationalId: `${String(100000000 + i).slice(0, 9)}`,
        gender,
        age: 18 + (i % 50),
      });
    }
    return list;
  }, []);

  const filteredMembers = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return allMembers;
    return allMembers.filter(
      (m) =>
        m.fullName.toLowerCase().includes(q) ||
        m.nationalId.includes(q) ||
        m.gender.toLowerCase().includes(q) ||
        m.crops.some((c) => c.toLowerCase().includes(q))
    );
  }, [allMembers, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / PAGE_SIZE));
  const page = Math.min(currentPage, totalPages);
  const pageSlice = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredMembers.slice(start, start + PAGE_SIZE);
  }, [filteredMembers, page]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Calculate demographics (banner)
  const totalMembers = TOTAL_MEMBERS;
  const maleCount = MALE_COUNT;
  const femaleCount = FEMALE_COUNT;
  const avgLandArea = 4.8;

  return (
    <div className="space-y-6 min-w-0 max-w-full">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Members</h1>
          <p className="text-gray-600 mt-1">
            Manage your cooperative&apos;s member database
          </p>
        </div>
        <button
          onClick={() => navigate("/farmer-members/new")}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#032EA1] text-white rounded-lg hover:bg-[#0447D4] transition-colors shadow-md"
        >
          <Plus className="w-5 h-5" />
          Add New Member
        </button>
      </div>

      {/* Demographics Banner */}
      <div className="bg-gradient-to-br from-[#032EA1] to-[#021c5e] rounded-xl p-4 shadow-lg text-white">
        <h3 className="text-base font-semibold mb-2.5">Membership Overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <p className="text-xs opacity-90">Total Members</p>
            <p className="text-2xl font-bold mt-0.5">{totalMembers}</p>
          </div>
          <div>
            <TrendingUp className="w-5 h-5 text-purple-300" />
            <p className="text-xs opacity-90 mt-1">New This Year</p>
            <p className="text-2xl font-bold mt-0.5">49</p>
          </div>
          <div>
            <p className="text-xs opacity-90">Gender ratio</p>
            <ul className="text-[11px] opacity-90 mt-1.5 space-y-0.5">
              <li>
                <span className="font-medium">Male:</span> {maleCount} (
                {((maleCount / totalMembers) * 100).toFixed(1)}%)
              </li>
              <li>
                <span className="font-medium">Female:</span> {femaleCount} (
                {((femaleCount / totalMembers) * 100).toFixed(1)}%)
              </li>
              <li>
                <span className="font-medium">Other:</span> {OTHER_COUNT} (
                {((OTHER_COUNT / totalMembers) * 100).toFixed(1)}%)
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs opacity-90">Total Land Area</p>
            <p className="text-2xl font-bold mt-0.5">{avgLandArea} Ha</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, national ID, gender, or crop type..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#032EA1] focus:border-transparent outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              Filters
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">
              <Download className="w-4 h-4" />
              Export to Excel
            </button>
          </div>
        </div>
      </div>

      {/* Members Table — full width, no horizontal scroll (table-fixed + truncate) */}
      <div className="w-full min-w-0 rounded-2xl border border-gray-200/80 bg-white shadow-[0_4px_24px_-4px_rgba(3,46,161,0.08),0_2px_8px_-2px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="w-full min-w-0 overflow-hidden">
          <table className="w-full table-fixed border-collapse text-left">
            <colgroup>
              <col className="w-[9%]" />
              <col className="w-[24%]" />
              <col className="w-[10%]" />
              <col className="w-[8%]" />
              <col className="w-[13%]" />
              <col className="w-[7%]" />
              <col className="w-[13%]" />
              <col className="w-[9%]" />
              <col className="w-[7%]" />
            </colgroup>
            <thead>
              <tr className="bg-gradient-to-r from-[#032EA1]/[0.07] via-[#032EA1]/[0.04] to-transparent border-b border-[#032EA1]/15">
                <th className="px-2 sm:px-3 py-2.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#032EA1]">
                  Member ID
                </th>
                <th className="px-2 sm:px-3 py-2.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#032EA1]">
                  Full Name
                </th>
                <th className="px-2 sm:px-3 py-2.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#032EA1]">
                  National ID
                </th>
                <th className="px-2 sm:px-3 py-2.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#032EA1]">
                  Gender
                </th>
                <th className="px-2 sm:px-3 py-2.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#032EA1]">
                  Village
                </th>
                <th className="px-2 sm:px-3 py-2.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#032EA1] text-center">
                  Land
                </th>
                <th className="px-2 sm:px-3 py-2.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#032EA1]">
                  Crops
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
              {pageSlice.map((member, rowIdx) => (
                <tr
                  key={member.id}
                  className={`group transition-colors ${
                    rowIdx % 2 === 0 ? "bg-white" : "bg-slate-50/60"
                  } hover:bg-[#032EA1]/[0.04]`}
                >
                  <td className="px-2 sm:px-3 py-2 align-middle max-w-0">
                    <span className="inline-flex max-w-full font-mono text-[10px] sm:text-xs font-semibold text-[#032EA1] bg-[#032EA1]/8 px-1.5 sm:px-2 py-0.5 rounded-md border border-[#032EA1]/10 truncate">
                      {member.id}
                    </span>
                  </td>
                  <td className="px-2 sm:px-3 py-2 align-middle max-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="relative shrink-0">
                        <img
                          src={farmerMemberPortraitUrl(member)}
                          alt={member.fullName}
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          className="h-8 w-8 sm:h-9 sm:w-9 rounded-full object-cover ring-2 ring-white shadow ring-offset-1 ring-offset-white group-hover:ring-[#032EA1]/20 transition-shadow"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                          {member.fullName}
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-500 truncate tabular-nums">
                          {member.phone}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 sm:px-3 py-2 align-middle max-w-0">
                    <span className="block text-xs text-gray-600 tabular-nums truncate">
                      {member.nationalId}
                    </span>
                  </td>
                  <td className="px-2 sm:px-3 py-2 align-middle max-w-0">
                    <span className="block text-xs text-gray-800 truncate font-medium">
                      {member.gender}
                    </span>
                  </td>
                  <td className="px-2 sm:px-3 py-2 align-middle max-w-0">
                    <span className="block text-xs text-gray-700 truncate" title={member.village}>
                      {member.village}
                    </span>
                  </td>
                  <td className="px-2 sm:px-3 py-2 align-middle max-w-0 text-center">
                    <span className="block text-xs text-gray-800 font-medium tabular-nums truncate">
                      {member.landArea} hectare
                    </span>
                  </td>
                  <td className="px-2 sm:px-3 py-2 align-middle max-w-0">
                    <span
                      className="block text-xs text-gray-700 truncate"
                      title={member.crops.join(", ")}
                    >
                      {member.crops.join(", ")}
                    </span>
                  </td>
                  <td className="px-2 sm:px-3 py-2 align-middle max-w-0">
                    <span className="inline-flex items-center gap-0.5 px-1.5 sm:px-2 py-0.5 bg-emerald-500 text-white rounded-full text-[10px] sm:text-xs font-semibold shadow-sm max-w-full truncate">
                      <CheckCircle className="w-3 h-3 shrink-0 opacity-95" aria-hidden />
                      <span className="truncate">{member.status}</span>
                    </span>
                  </td>
                  <td className="px-2 sm:px-3 py-2 align-middle max-w-0">
                    <div className="flex items-center justify-center gap-0.5">
                      <button
                        type="button"
                        className="p-1.5 rounded-lg text-gray-500 hover:text-[#032EA1] hover:bg-[#032EA1]/10 transition-colors"
                        aria-label="View member"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate(`/farmer-members/edit/${member.id}`, { state: { member } })}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-[#032EA1] hover:bg-[#032EA1]/10 transition-colors"
                        aria-label="Edit member"
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

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-medium">
              {filteredMembers.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(page * PAGE_SIZE, filteredMembers.length)}
            </span>{" "}
            of <span className="font-medium">{filteredMembers.length}</span> members
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-4 py-2 bg-[#032EA1] text-white rounded-lg text-sm font-medium hover:bg-[#0447D4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
