import { Outlet, NavLink } from "react-router";
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
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useState } from "react";
import { ChatbotWidget } from "./ChatbotWidget";

const navigation = [
  { name: "AC Dashboard", path: "/", icon: LayoutDashboard },
  { name: "AC Profile", path: "/ac-profile", icon: Building2 },
  { name: "Committee Structure", path: "/committee-structure", icon: UserCircle },
  { name: "Farmer Members", path: "/farmer-members", icon: Users },
  { name: "Business Plans", path: "/business-plans", icon: FileText },
  { name: "Assets", path: "/assets", icon: Package },
  { name: "Knowledge Hub", path: "/knowledge", icon: BookOpen },
  { name: "Reporting and Analytics", path: "/reports", icon: BarChart3 },
];

const profileImageUrl =
  "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=160&h=160&q=80";

export function Root() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("EN");

  const toggleLanguage = () => {
    setCurrentLanguage(currentLanguage === "EN" ? "KH" : "EN");
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside
        className={`hidden lg:flex lg:flex-col bg-white border-r border-gray-200 transition-all duration-300 ${
          desktopSidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Logo */}
        <div
          className={`flex items-center py-4 border-b border-gray-200 ${
            desktopSidebarCollapsed ? "justify-center px-3" : "gap-3 px-6"
          }`}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-[#032EA1] to-[#0447D4] rounded-lg flex items-center justify-center shadow-md shadow-blue-500/20">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div className={desktopSidebarCollapsed ? "hidden" : ""}>
            <h1 className="text-xl font-bold bg-gradient-to-r from-[#032EA1] to-[#0447D4] bg-clip-text text-transparent">
              FOMMP
            </h1>
          </div>
          <button
            onClick={() => setDesktopSidebarCollapsed((prev) => !prev)}
            className={`hidden lg:inline-flex p-2 rounded-lg hover:bg-gray-100 border border-gray-300 transition-colors ${
              desktopSidebarCollapsed ? "ml-0" : "ml-auto"
            }`}
            aria-label={desktopSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={desktopSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {desktopSidebarCollapsed ? (
              <PanelLeftOpen className="w-5 h-5 text-gray-700" />
            ) : (
              <PanelLeftClose className="w-5 h-5 text-gray-700" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className={`flex-1 py-4 overflow-y-auto ${desktopSidebarCollapsed ? "px-2" : "px-3"}`}>
          <ul className="space-y-1">
            {navigation.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  end={item.path === "/"}
                  title={desktopSidebarCollapsed ? item.name : undefined}
                  className={({ isActive }) =>
                    `flex items-center rounded-lg text-sm font-medium transition-all duration-200 ${
                      desktopSidebarCollapsed
                        ? "justify-center px-2 py-2.5"
                        : "gap-3 px-3 py-2.5"
                    } ${
                      isActive
                        ? "bg-[#032EA1] text-white shadow-md"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  {!desktopSidebarCollapsed && item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div
            className={`flex items-center rounded-lg hover:bg-gray-100 cursor-pointer ${
              desktopSidebarCollapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2"
            }`}
            title={desktopSidebarCollapsed ? "AC User - President" : undefined}
          >
            <img
              src={profileImageUrl}
              alt="AC User profile"
              className="w-10 h-10 rounded-full object-cover border border-gray-200"
              loading="lazy"
            />
            <div className={`flex-1 min-w-0 ${desktopSidebarCollapsed ? "hidden" : ""}`}>
              <p className="text-sm font-medium text-gray-900 truncate">
                AC User
              </p>
              <p className="text-xs text-gray-500 truncate">President</p>
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
                <div className="w-10 h-10 bg-gradient-to-br from-[#032EA1] to-[#0447D4] rounded-lg flex items-center justify-center shadow-md shadow-blue-500/20">
                  <Building2 className="w-6 h-6 text-white" />
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
                      end={item.path === "/"}
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
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors border border-gray-300"
              >
                <Languages className="w-4 h-4 text-gray-700" />
                <span className="text-sm font-medium text-gray-700">
                  {currentLanguage}
                </span>
              </button>
              <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Bell className="w-5 h-5 text-gray-700" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#E00025] rounded-full"></span>
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 hover:text-[#E00025]">
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