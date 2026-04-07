import { Outlet, NavLink, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Building2,
  FileText,
  Package,
  BookOpen,
  Users,
  Bell,
  LogOut,
  Menu,
  X,
  UserCircle,
  Languages,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Sprout,
  Shield,
  UserCheck,
  Activity,
  BarChart3,
  Calendar,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { ChatbotWidget } from "./ChatbotWidget";
import { clearPortalUser, getPortalUser, isGovernmentAdmin } from "../auth/portalUser";
import { useNotifications } from "../context/NotificationContext";
type LangCode = "EN" | "KH" | "FR" | "ZH" | "TH";

const LANGUAGE_OPTIONS: { code: LangCode; label: string; native: string }[] = [
  { code: "EN", label: "English", native: "English" },
  { code: "KH", label: "Khmer", native: "ភាសាខ្មែរ" },
  { code: "FR", label: "French", native: "Français" },
  { code: "ZH", label: "Chinese", native: "中文" },
  { code: "TH", label: "Thai", native: "ภาษาไทย" },
];

type CoopNavIcon = typeof LayoutDashboard;

type CooperativeNavEntry =
  | { kind: "link"; name: string; path: string; icon: CoopNavIcon; end?: boolean }
  | {
      kind: "calendar";
      name: string;
      icon: typeof Calendar;
      children: { name: string; path: string }[];
    };

const cooperativeNav: CooperativeNavEntry[] = [
  { kind: "link", name: "AC Dashboard", path: "/dashboard", icon: LayoutDashboard, end: true },
  { kind: "link", name: "AC Profile", path: "/dashboard/ac-profile", icon: Building2 },
  { kind: "link", name: "Committee Structure", path: "/dashboard/committee-structure", icon: UserCircle },
  { kind: "link", name: "Members", path: "/dashboard/farmer-members", icon: Users },
  { kind: "link", name: "Assets", path: "/dashboard/assets", icon: Package },
  { kind: "link", name: "Business Plans", path: "/dashboard/business-plans", icon: FileText },
  {
    kind: "calendar",
    name: "Calendar",
    icon: Calendar,
    children: [
      { name: "Planting and Harvesting", path: "/dashboard/calendar/harvesting-planning" },
      { name: "Training", path: "/dashboard/calendar/training" },
    ],
  },
  { kind: "link", name: "Knowledge Hub", path: "/dashboard/knowledge", icon: BookOpen },
];

const adminNavigation = [
  { name: "National Dashboard", path: "/dashboard/admin", icon: LayoutDashboard },
  { name: "Commune Verification", path: "/dashboard/admin/commune-verification", icon: UserCheck },
  { name: "Business Plan", path: "/dashboard/admin/business-plans", icon: FileText },
  { name: "Progress Reporting", path: "/dashboard/admin/progress-reporting", icon: Activity },
  { name: "Knowledge Hub", path: "/dashboard/admin/knowledge", icon: BookOpen },
  { name: "GESI / Reporting", path: "/dashboard/admin/reporting", icon: BarChart3 },
];

const profileImageUrl =
  "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=160&h=160&q=80";

export function Root() {
  const navigate = useNavigate();
  const location = useLocation();
  const { notifications, unreadCount, markAllRead } = useNotifications();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<LangCode>("EN");
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [calendarExpanded, setCalendarExpanded] = useState(() =>
    location.pathname.startsWith("/dashboard/calendar")
  );
  const languageMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const portalUser = getPortalUser();
  const admin = isGovernmentAdmin();
  useEffect(() => {
    if (admin && location.pathname.startsWith("/dashboard/") && !location.pathname.startsWith("/dashboard/admin")) {
      navigate("/dashboard/admin", { replace: true });
    }
  }, [admin, location.pathname, navigate]);

  useEffect(() => {
    if (!admin && location.pathname.startsWith("/dashboard/admin")) {
      navigate("/dashboard", { replace: true });
    }
  }, [admin, location.pathname, navigate]);

  useEffect(() => {
    if (location.pathname.startsWith("/dashboard/calendar")) setCalendarExpanded(true);
  }, [location.pathname]);

  useEffect(() => {
    if (!notifOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      const el = notifRef.current;
      if (el && !el.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [notifOpen]);

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
          <div className="w-9 h-9 shrink-0 rounded-lg bg-[#032EA1] border border-blue-300 shadow-md shadow-blue-500/20 flex items-center justify-center">
            <Sprout className="w-5 h-5 text-green-400" />
          </div>
          <div
            className={`min-w-0 overflow-hidden transition-all duration-300 ${
              desktopSidebarCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            }`}
          >
            <h1 className="text-base font-bold whitespace-nowrap bg-gradient-to-r from-[#0F2F8F] to-[#3B5FCC] bg-clip-text text-transparent">
              AgriCoop Portal
            </h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden px-2.5">
          <ul className="space-y-0.5">
            {admin
              ? adminNavigation.map((item) => (
                  <li key={item.name}>
                    <NavLink
                      to={item.path}
                      end={item.path === "/dashboard/admin"}
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
                ))
              : cooperativeNav.map((entry) => {
                  if (entry.kind === "link") {
                    return (
                      <li key={entry.path}>
                        <NavLink
                          to={entry.path}
                          end={entry.end === true}
                          title={desktopSidebarCollapsed ? entry.name : undefined}
                          className={({ isActive }) =>
                            `flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-200 px-2.5 py-2.5 ${
                              isActive
                                ? "bg-[#0F2F8F] text-white shadow-sm"
                                : "text-gray-600 hover:bg-blue-50 hover:text-[#0F2F8F]"
                            }`
                          }
                        >
                          <entry.icon className="w-[18px] h-[18px] shrink-0" />
                          <span
                            className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${
                              desktopSidebarCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                            }`}
                          >
                            {entry.name}
                          </span>
                        </NavLink>
                      </li>
                    );
                  }
                  const calendarActive = location.pathname.startsWith("/dashboard/calendar");
                  return (
                    <li key="calendar" className="space-y-0.5">
                      <button
                        type="button"
                        title={desktopSidebarCollapsed ? entry.name : undefined}
                        onClick={() => {
                          if (desktopSidebarCollapsed) {
                            setDesktopSidebarCollapsed(false);
                            setCalendarExpanded(true);
                          } else {
                            setCalendarExpanded((e) => !e);
                          }
                        }}
                        className={`flex w-full items-center gap-3 rounded-lg text-sm font-medium transition-all duration-200 px-2.5 py-2.5 ${
                          calendarActive
                            ? "bg-[#0F2F8F]/12 text-[#0F2F8F]"
                            : "text-gray-600 hover:bg-blue-50 hover:text-[#0F2F8F]"
                        }`}
                      >
                        <entry.icon className="w-[18px] h-[18px] shrink-0" />
                        <span
                          className={`flex-1 min-w-0 text-left whitespace-nowrap overflow-hidden transition-all duration-300 ${
                            desktopSidebarCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                          }`}
                        >
                          {entry.name}
                        </span>
                        {!desktopSidebarCollapsed && (
                          <ChevronDown
                            className={`h-4 w-4 shrink-0 transition-transform ${calendarExpanded ? "rotate-180" : ""}`}
                            aria-hidden
                          />
                        )}
                      </button>
                      {calendarExpanded && !desktopSidebarCollapsed && (
                        <ul className="ml-2 mt-0.5 space-y-0.5 border-l border-gray-200 pl-2.5">
                          {entry.children.map((child) => (
                            <li key={child.path}>
                              <NavLink
                                to={child.path}
                                className={({ isActive }) =>
                                  `block rounded-lg text-xs font-medium transition-all duration-200 px-2 py-2 ${
                                    isActive
                                      ? "bg-[#0F2F8F] text-white shadow-sm"
                                      : "text-gray-600 hover:bg-blue-50 hover:text-[#0F2F8F]"
                                  }`
                                }
                              >
                                {child.name}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="px-2.5 py-3 border-t border-gray-200">
          <div
            className="flex items-center gap-3 rounded-lg hover:bg-blue-50 cursor-pointer px-2 py-2 overflow-hidden"
            title={desktopSidebarCollapsed ? (admin ? "Government Admin" : "Sok Pisey - Chairman") : undefined}
          >
            <img
              src={profileImageUrl}
              alt="User profile"
              className="w-8 h-8 shrink-0 rounded-full object-cover border border-gray-200"
              loading="lazy"
            />
            <div
              className={`min-w-0 overflow-hidden transition-all duration-300 ${
                desktopSidebarCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
              }`}
            >
              <p className="text-sm font-medium text-gray-900 truncate whitespace-nowrap">
                {admin ? "Government Admin" : "Sok Pisey"}
              </p>
              <p className="text-xs text-gray-500 truncate whitespace-nowrap">
                {admin ? portalUser?.email ?? "Ministry / FAO" : "Chairman"}
              </p>
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
                <div className="w-10 h-10 rounded-lg bg-[#032EA1] border border-blue-100 shadow-md shadow-blue-500/20 flex items-center justify-center">
                  <Sprout className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-[#032EA1] to-[#0447D4] bg-clip-text text-transparent">
                    AgriCoop Portal
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
                {admin
                  ? adminNavigation.map((item) => (
                      <li key={item.name}>
                        <NavLink
                          to={item.path}
                          end={item.path === "/dashboard/admin"}
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
                    ))
                  : cooperativeNav.map((entry) => {
                      if (entry.kind === "link") {
                        return (
                          <li key={entry.path}>
                            <NavLink
                              to={entry.path}
                              end={entry.end === true}
                              onClick={() => setSidebarOpen(false)}
                              className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                  isActive
                                    ? "bg-[#032EA1] text-white shadow-md"
                                    : "text-gray-700 hover:bg-gray-100"
                                }`
                              }
                            >
                              <entry.icon className="w-5 h-5" />
                              {entry.name}
                            </NavLink>
                          </li>
                        );
                      }
                      const calendarActive = location.pathname.startsWith("/dashboard/calendar");
                      return (
                        <li key="calendar" className="space-y-0.5">
                          <button
                            type="button"
                            onClick={() => setCalendarExpanded((e) => !e)}
                            className={`flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                              calendarActive
                                ? "bg-[#032EA1]/10 text-[#032EA1]"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            <entry.icon className="w-5 h-5 shrink-0" />
                            <span className="flex-1 text-left">{entry.name}</span>
                            <ChevronDown
                              className={`h-4 w-4 shrink-0 transition-transform ${calendarExpanded ? "rotate-180" : ""}`}
                              aria-hidden
                            />
                          </button>
                          {calendarExpanded && (
                            <ul className="ml-4 mt-0.5 space-y-0.5 border-l border-gray-200 pl-3">
                              {entry.children.map((child) => (
                                <li key={child.path}>
                                  <NavLink
                                    to={child.path}
                                    onClick={() => setSidebarOpen(false)}
                                    className={({ isActive }) =>
                                      `block rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                                        isActive
                                          ? "bg-[#032EA1] text-white shadow-md"
                                          : "text-gray-700 hover:bg-gray-100"
                                      }`
                                    }
                                  >
                                    {child.name}
                                  </NavLink>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      );
                    })}
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
                    {admin ? "Government Admin" : "AC User"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {admin ? portalUser?.email ?? "Ministry / FAO" : "President"}
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
                  {admin ? (
                    <Shield className="w-6 h-6 text-[#032EA1]" />
                  ) : (
                    <Building2 className="w-6 h-6 text-[#032EA1]" />
                  )}
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {admin ? "Ministry / FAO" : "Prasat Sambor Rung Roeang Modern Agricultural Cooperative"}
                    </p>
                    {!admin && <p className="text-xs text-gray-500">AC-KT-2024-157</p>}
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
              <div className="relative" ref={notifRef}>
                <button
                  type="button"
                  onClick={() => {
                    setNotifOpen((o) => {
                      const next = !o;
                      if (next && unreadCount > 0) markAllRead();
                      return next;
                    });
                  }}
                  className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-expanded={notifOpen}
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5 text-gray-700" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 min-w-[8px] h-2 px-0.5 bg-[#E00025] rounded-full" />
                  )}
                </button>
                {notifOpen && (
                  <div className="absolute right-0 z-50 mt-1.5 w-80 max-h-96 overflow-y-auto rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
                    <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                      In-app notifications
                    </p>
                    {notifications.length === 0 ? (
                      <p className="px-3 py-4 text-sm text-gray-500">No notifications yet.</p>
                    ) : (
                      <ul className="divide-y divide-gray-100">
                        {notifications.map((n) => (
                          <li key={n.id} className="px-3 py-2.5 text-sm">
                            <p className="font-medium text-gray-900 leading-tight">{n.title}</p>
                            <p className="text-gray-600 text-xs mt-1 leading-snug">{n.body}</p>
                            {n.audience && (
                              <p className="text-[10px] text-gray-400 mt-1">To: {n.audience}</p>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  clearPortalUser();
                  navigate("/login");
                }}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 hover:text-[#E00025]"
                aria-label="Log out"
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