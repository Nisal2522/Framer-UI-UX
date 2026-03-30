import { Outlet, NavLink, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Building2,
  FileText,
  Package,
  BookOpen,
  Users,
  BarChart3,
  Bell,
  LogOut,
  Menu,
  X,
  UserCircle,
  Languages,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { ChatbotWidget } from "./ChatbotWidget";
import faoLogo from "../../assets/fao.jpg";

type LangCode = "EN" | "KH" | "FR" | "ZH" | "TH";

const LANGUAGE_OPTIONS: { code: LangCode; label: string; native: string }[] = [
  { code: "EN", label: "English", native: "English" },
  { code: "KH", label: "Khmer", native: "ភាសាខ្មែរ" },
  { code: "FR", label: "French", native: "Français" },
  { code: "ZH", label: "Chinese", native: "中文" },
  { code: "TH", label: "Thai", native: "ภาษาไทย" },
];

const navigation = [
  { name: "AC Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "AC Profile", path: "/dashboard/ac-profile", icon: Building2 },
  { name: "Committee Structure", path: "/dashboard/committee-structure", icon: UserCircle },
  { name: "Members", path: "/dashboard/farmer-members", icon: Users },
  { name: "Business Plans", path: "/dashboard/business-plans", icon: FileText },
  { name: "Assets", path: "/dashboard/assets", icon: Package },
  { name: "Knowledge Hub", path: "/dashboard/knowledge", icon: BookOpen },
  { name: "Reporting and Analytics", path: "/dashboard/reports", icon: BarChart3 },
];

const profileImageUrl =
  "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=160&h=160&q=80";

export function Root() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<LangCode>("EN");
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const languageMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!languageMenuOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      const el = languageMenuRef.current;
      if (el && !el.contains(e.target as Node)) setLanguageMenuOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLanguageMenuOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [languageMenuOpen]);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside
        className={`relative hidden lg:flex lg:flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
          desktopSidebarCollapsed ? "w-[72px]" : "w-64"
        }`}
      >
        {/* Floating collapse toggle button on right edge */}
        <button
          type="button"
          onClick={() => setDesktopSidebarCollapsed((prev) => !prev)}
          aria-label={desktopSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute -right-3.5 top-5 z-50 flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white shadow-md text-[#0F2F8F] hover:bg-[#0F2F8F] hover:text-white hover:border-[#0F2F8F] transition-all duration-200"
        >
          {desktopSidebarCollapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </button>

        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-4 h-[69px] overflow-hidden">
          <div className="w-9 h-9 shrink-0 rounded-lg overflow-hidden border border-blue-100 bg-white shadow-md shadow-blue-500/20">
            <img src={faoLogo} alt="FAO logo" className="h-full w-full object-cover" />
          </div>
          <div
            className={`min-w-0 overflow-hidden transition-all duration-300 ${
              desktopSidebarCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            }`}
          >
            <h1 className="text-base font-bold whitespace-nowrap bg-gradient-to-r from-[#0F2F8F] to-[#3B5FCC] bg-clip-text text-transparent">
              FOMMP
            </h1>
            <p className="text-[9px] text-gray-400 whitespace-nowrap leading-tight">
              Farmer Organizations Platform
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden px-2.5">
          <ul className="space-y-0.5">
            {navigation.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  end={item.path === "/dashboard"}
                  title={desktopSidebarCollapsed ? item.name : undefined}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-200 px-2.5 py-2.5 ${
                      isActive
                        ? "bg-[#0F2F8F] text-white shadow-sm"
                        : "text-gray-600 hover:bg-blue-50 hover:text-[#0F2F8F]"
                    }`
                  }
                >
                  <item.icon className="w-[18px] h-[18px] shrink-0" />
                  <span
                    className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${
                      desktopSidebarCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                    }`}
                  >
                    {item.name}
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="px-2.5 py-3 border-t border-gray-200">
          <div
            className="flex items-center gap-3 rounded-lg hover:bg-blue-50 cursor-pointer px-2 py-2 overflow-hidden"
            title={desktopSidebarCollapsed ? "AC User - President" : undefined}
          >
            <img
              src={profileImageUrl}
              alt="AC User profile"
              className="w-8 h-8 shrink-0 rounded-full object-cover border border-gray-200"
              loading="lazy"
            />
            <div
              className={`min-w-0 overflow-hidden transition-all duration-300 ${
                desktopSidebarCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
              }`}
            >
              <p className="text-sm font-medium text-gray-900 truncate whitespace-nowrap">AC User</p>
              <p className="text-xs text-gray-500 truncate whitespace-nowrap">President</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>

          {/* Sidebar */}
          <aside className="fixed inset-y-0 left-0 w-64 bg-white z-50 flex flex-col lg:hidden shadow-2xl">
            {/* Logo */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg overflow-hidden border border-blue-100 bg-white shadow-md shadow-blue-500/20">
                  <img
                    src={faoLogo}
                    alt="FAO logo"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-[#032EA1] to-[#0447D4] bg-clip-text text-transparent">
                    FOMMP
                  </h1>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 overflow-y-auto">
              <ul className="space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <NavLink
                      to={item.path}
                      end={item.path === "/dashboard"}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? "bg-[#032EA1] text-white shadow-md"
                            : "text-gray-700 hover:bg-gray-100"
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5" />
                      {item.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                <img
                  src={profileImageUrl}
                  alt="AC User profile"
                  className="w-10 h-10 rounded-full object-cover border border-gray-200"
                  loading="lazy"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    AC User
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    President
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header — horizontal padding matches main content so the bar aligns with the sidebar divider */}
        <header className="bg-white border-b border-gray-200 py-4 px-4 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left: Mobile Menu & AC Name */}
            <div className="flex items-center gap-4 flex-1">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu className="w-6 h-6 text-gray-700" />
              </button>

              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-3">
                  <Building2 className="w-6 h-6 text-[#032EA1]" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Baray Organic Farmers Cooperative
                    </p>
                    <p className="text-xs text-gray-500">AC-KT-2024-157</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              <div className="relative" ref={languageMenuRef}>
                <button
                  type="button"
                  onClick={() => setLanguageMenuOpen((o) => !o)}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-700 transition-colors hover:bg-gray-50"
                  aria-expanded={languageMenuOpen}
                  aria-haspopup="dialog"
                  aria-label="Display language"
                >
                  <Languages className="h-4 w-4 shrink-0" aria-hidden />
                  <span className="text-sm font-medium tabular-nums">
                    {selectedLanguage}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 opacity-70 transition-transform ${
                      languageMenuOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden
                  />
                </button>
                {languageMenuOpen && (
                  <div
                    className="absolute right-0 z-50 mt-1.5 w-64 rounded-xl border border-gray-200 bg-white py-0.5 shadow-lg"
                    role="radiogroup"
                    aria-label="Display language"
                  >
                    <p className="border-b border-gray-100 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                      Display language
                    </p>
                    <fieldset className="m-0 border-0 p-0">
                      <legend className="sr-only">Choose display language</legend>
                      {LANGUAGE_OPTIONS.map((opt) => {
                        const checked = selectedLanguage === opt.code;
                        return (
                          <label
                            key={opt.code}
                            className={`flex cursor-pointer items-center gap-2 px-2.5 py-1.5 text-left text-sm leading-tight transition-colors hover:bg-gray-50 ${
                              checked ? "bg-[#032EA1]/[0.06]" : ""
                            }`}
                          >
                            <input
                              type="radio"
                              name="navbar-display-language"
                              value={opt.code}
                              checked={checked}
                              onChange={() => {
                                setSelectedLanguage(opt.code);
                                setLanguageMenuOpen(false);
                              }}
                              className="h-3.5 w-3.5 shrink-0 cursor-pointer accent-[#032EA1] border-gray-300 focus:ring-2 focus:ring-[#032EA1] focus:ring-offset-0"
                            />
                            <span className="min-w-0 flex-1">
                              <span className="block font-medium text-gray-800 leading-tight">
                                {opt.label}
                              </span>
                              <span className="mt-0.5 block text-[11px] leading-tight text-gray-500">
                                {opt.native}
                              </span>
                            </span>
                          </label>
                        );
                      })}
                    </fieldset>
                    <p className="border-t border-gray-100 px-2.5 py-1.5 text-[10px] leading-snug text-gray-500">
                      Select one language. The app UI can be wired to this choice later.
                    </p>
                  </div>
                )}
              </div>
              <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Bell className="w-5 h-5 text-gray-700" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#E00025] rounded-full"></span>
              </button>
              <button
                onClick={() => navigate("/login")}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 hover:text-[#E00025]"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-8">
          <Outlet />
        </main>
        <ChatbotWidget />
      </div>
    </div>
  );
}