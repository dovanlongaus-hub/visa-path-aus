import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home, Map, FileText, Download, Bell, User, Search,
  Menu, X, ChevronDown, LogOut, Settings, MessageCircle,
  BookOpen, CheckSquare, BarChart2, Star, Info, Phone,
  CreditCard, Clipboard, Newspaper
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createPageUrl } from "@/utils";
import { User as UserEntity, Notification } from "@/api/entities";

// ── Navigation structure ──────────────────────────────────────────────────────

/** Returns a formatted notification count string like "9+" for large numbers */
const fmtCount = (n) => (n > 9 ? "9+" : String(n));

const NAV_GROUPS = [
  {
    id: "visa",
    label: "Visa",
    icon: Map,
    items: [
      { label: "Lộ Trình",           page: "Roadmap",    icon: Map },
      { label: "Visa 482",            page: "Visa482",    icon: Clipboard },
      { label: "Visa 858",            page: "Visa858",    icon: Star },
      { label: "Kế Hoạch Của Tôi",   page: "MyPlan",     icon: CheckSquare },
      { label: "Checklist",           page: "Checklist",  icon: CheckSquare },
    ],
  },
  {
    id: "tools",
    label: "Công Cụ",
    icon: BarChart2,
    items: [
      { label: "Tư Vấn AI",          page: "Chat",         icon: MessageCircle },
      { label: "Upload CV",           page: "CVUpload",     icon: FileText },
      { label: "Tạo EOI",            page: "EOIGenerator", icon: BarChart2 },
    ],
  },
  {
    id: "forms",
    label: "Biểu Mẫu",
    icon: FileText,
    items: [
      { label: "Biểu Mẫu Di Trú",   page: "Forms",     icon: FileText },
      { label: "Tải Về Tài Liệu",   page: "Downloads", icon: Download },
    ],
  },
  {
    id: "knowledge",
    label: "Kiến Thức",
    icon: BookOpen,
    items: [
      { label: "Hướng Dẫn",          page: "Guide",        icon: BookOpen },
      { label: "FAQ",                 page: "FAQ",          icon: Info },
      { label: "Tin Tức",            page: "Home",         icon: Newspaper },
      { label: "Hướng Dẫn Đến Úc",  page: "ArrivalGuide", icon: Map },
    ],
  },
];

// Bottom tab bar for mobile (5 main items)
const BOTTOM_TABS = [
  { label: "Trang Chủ", page: "Home",         icon: Home },
  { label: "Lộ Trình",  page: "Roadmap",      icon: Map },
  { label: "Tư Vấn",   page: "Chat",          icon: MessageCircle },
  { label: "Thông Báo", page: "Notifications", icon: Bell },
  { label: "Hồ Sơ",    page: "Profile",       icon: User },
];

function useUnreadCount(userId) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!userId) return;
    Notification.filter({ user_id: userId, is_read: false })
      .then((rows) => setCount(rows?.length || 0))
      .catch(() => {});
  }, [userId]);
  return count;
}

export default function Layout({ children }) {
  const location  = useLocation();
  const navigate  = useNavigate();
  const [user, setUser]         = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroup, setOpenGroup]   = useState(null);
  const [searchQ, setSearchQ]       = useState("");
  const searchRef = useRef(null);

  useEffect(() => {
    UserEntity.me()
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  // Cmd+K shortcut for search
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const unreadCount = useUnreadCount(user?.id);
  const isAdmin = user?.email?.includes("admin") || user?.role === "admin";

  const isActive = (page) =>
    location.pathname === createPageUrl(page) || location.pathname.startsWith(createPageUrl(page) + "/");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQ.trim()) {
      navigate(`${createPageUrl("Guide")}?q=${encodeURIComponent(searchQ.trim())}`);
      setSearchQ("");
    }
  };

  const handleLogout = async () => {
    try { await UserEntity.logout(); } catch {}
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ── Desktop / Tablet Top Nav ─────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 hidden md:block">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-4">
          {/* Logo */}
          <Link to={createPageUrl("Home")} className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xl">🇦🇺</span>
            <span className="font-bold text-gray-900 text-sm leading-tight">
              Visa<br /><span className="text-gray-500 font-normal">Path Aus</span>
            </span>
          </Link>

          {/* Nav Groups */}
          <nav className="flex items-center gap-1 flex-1">
            {NAV_GROUPS.map((group) => (
              <div key={group.id} className="relative">
                <button
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    openGroup === group.id ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                  onClick={() => setOpenGroup(openGroup === group.id ? null : group.id)}
                >
                  <group.icon className="h-4 w-4" />
                  {group.label}
                  <ChevronDown className={`h-3 w-3 transition-transform ${openGroup === group.id ? "rotate-180" : ""}`} />
                </button>
                {openGroup === group.id && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpenGroup(null)} />
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 z-20 min-w-[180px]">
                      {group.items.map((item) => (
                        <Link
                          key={item.page}
                          to={createPageUrl(item.page)}
                          className={`flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${
                            isActive(item.page) ? "bg-gray-50 text-gray-900 font-medium" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                          onClick={() => setOpenGroup(null)}
                        >
                          <item.icon className="h-4 w-4 flex-shrink-0" />
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
            {isAdmin && (
              <Link
                to={createPageUrl("AdminGuide")}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-amber-600 hover:bg-amber-50 transition-colors"
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Search */}
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              ref={searchRef}
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              className="pl-8 pr-10 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 w-48 transition-all focus:w-64"
              placeholder="Tìm kiếm... (⌘K)"
            />
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-300 hidden">⌘K</kbd>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <Link to={createPageUrl("Notifications")} className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Bell className="h-4 w-4 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold leading-none">
                  {fmtCount(unreadCount)}
                </span>
              )}
            </Link>
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-1.5 pl-2 pr-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-gray-900 text-white text-xs flex items-center justify-center font-semibold">
                    {(user.full_name || user.email || "U")[0].toUpperCase()}
                  </div>
                  <ChevronDown className="h-3 w-3 text-gray-400" />
                </button>
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 min-w-[160px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
                  <Link to={createPageUrl("Profile")} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50">
                    <User className="h-4 w-4" /> Hồ sơ
                  </Link>
                  <Link to={createPageUrl("Settings")} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50">
                    <Settings className="h-4 w-4" /> Cài đặt
                  </Link>
                  <Link to={createPageUrl("Pricing")} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50">
                    <CreditCard className="h-4 w-4" /> Nâng cấp
                  </Link>
                  <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                    <LogOut className="h-4 w-4" /> Đăng xuất
                  </button>
                </div>
              </div>
            ) : (
              <Link to={createPageUrl("Profile")}>
                <Button size="sm" className="bg-gray-900 hover:bg-gray-800 text-white text-xs px-4">
                  Đăng nhập
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ── Mobile Top Bar ───────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 md:hidden">
        <div className="px-4 h-14 flex items-center justify-between">
          <Link to={createPageUrl("Home")} className="flex items-center gap-2">
            <span className="text-xl">🇦🇺</span>
            <span className="font-bold text-gray-900 text-sm">Visa Path Aus</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to={createPageUrl("Notifications")} className="relative p-2 rounded-lg hover:bg-gray-100">
              <Bell className="h-5 w-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold leading-none">
                  {fmtCount(unreadCount)}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Drawer ────────────────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-2xl flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <span className="font-bold text-gray-900">Menu</span>
              <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg hover:bg-gray-100">
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Search in drawer */}
            <form onSubmit={(e) => { handleSearch(e); setMobileOpen(false); }} className="p-4 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  placeholder="Tìm kiếm..."
                />
              </div>
            </form>

            {/* User info */}
            {user && (
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold">
                    {(user.full_name || user.email || "U")[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{user.full_name || user.email}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Nav items */}
            <nav className="flex-1 p-3 space-y-1">
              {NAV_GROUPS.map((group) => (
                <div key={group.id}>
                  <p className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">{group.label}</p>
                  {group.items.map((item) => (
                    <Link
                      key={item.page}
                      to={createPageUrl(item.page)}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                        isActive(item.page) ? "bg-gray-900 text-white font-medium" : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  ))}
                </div>
              ))}
            </nav>

            {/* Bottom actions */}
            <div className="p-3 border-t border-gray-100 space-y-1">
              <Link to={createPageUrl("Settings")} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-100">
                <Settings className="h-4 w-4" /> Cài đặt
              </Link>
              {user ? (
                <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50">
                  <LogOut className="h-4 w-4" /> Đăng xuất
                </button>
              ) : (
                <Link to={createPageUrl("Profile")} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-100">
                  <User className="h-4 w-4" /> Đăng nhập
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Page Content ─────────────────────────────────────────────────────── */}
      <main className="flex-1 pb-20 md:pb-0">
        {children}
      </main>

      {/* ── Mobile Bottom Tab Bar ────────────────────────────────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 md:hidden">
        <div className="grid grid-cols-5 h-16">
          {BOTTOM_TABS.map((tab) => {
            const active = isActive(tab.page);
            const isNotif = tab.page === "Notifications";
            return (
              <Link
                key={tab.page}
                to={createPageUrl(tab.page)}
                className={`flex flex-col items-center justify-center gap-0.5 relative transition-colors ${
                  active ? "text-gray-900" : "text-gray-400"
                }`}
              >
                <div className="relative">
                  <tab.icon className={`h-5 w-5 ${active ? "text-gray-900" : "text-gray-400"}`} />
                  {isNotif && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold leading-none">
                      {fmtCount(unreadCount)}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium">{tab.label}</span>
                {active && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gray-900 rounded-full" />}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}