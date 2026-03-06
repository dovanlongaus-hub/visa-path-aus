import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Home, Map, CheckSquare, FileText, MessageCircle, Upload,
  User, Menu, X, Briefcase, Award, Sparkles,
  ChevronDown, Bot, Target, Crown, Shield, Lightbulb, BookOpen,
  HelpCircle, Bookmark, Download, Users, Bell, Settings as SettingsIcon,
  Search, Plane, Star, BarChart2, Globe, ClipboardList, Headphones
} from "lucide-react";
import GlobalSearch from "./components/GlobalSearch";

// ── Navigation structure ──────────────────────────────────────
const navGroups = [
  {
    id: "visa",
    label: "Visa & Lộ trình",
    emoji: "🛂",
    icon: Globe,
    color: "blue",
    items: [
      { label: "Lộ trình PR", icon: Map, page: "Roadmap", desc: "500 → 485 → 189/190" },
      { label: "Visa 482", icon: Briefcase, page: "Visa482", desc: "Employer Sponsored" },
      { label: "Visa 858", icon: Award, page: "Visa858", desc: "National Innovation" },
    ],
  },
  {
    id: "tools",
    label: "Hồ sơ & Công cụ",
    emoji: "📁",
    icon: ClipboardList,
    color: "violet",
    items: [
      { label: "Hồ sơ cá nhân", icon: User, page: "Profile", desc: "Thông tin & điểm EOI" },
      { label: "Kế hoạch cá nhân", icon: Target, page: "MyPlan", desc: "Task list AI" },
      { label: "Checklist PR", icon: CheckSquare, page: "Checklist", desc: "Tiến trình PR" },
      { label: "Chuẩn bị qua Úc", icon: Plane, page: "ArrivalGuide", desc: "Checklist khi đến Úc" },
      { label: "Upload CV", icon: Upload, page: "CVUpload", desc: "Trích xuất bằng AI" },
    ],
  },
  {
    id: "forms",
    label: "Biểu mẫu & EOI",
    emoji: "📝",
    icon: FileText,
    color: "emerald",
    items: [
      { label: "Biểu mẫu di trú", icon: FileText, page: "Forms", desc: "Form DIBP chính thức" },
      { label: "EOI & CV AI", icon: Sparkles, page: "EOIGenerator", desc: "Tạo EOI tự động" },
    ],
  },
  {
    id: "knowledge",
    label: "Kiến thức & Hỗ trợ",
    emoji: "📚",
    icon: BookOpen,
    color: "indigo",
    items: [
      { label: "Knowledge Base", icon: BookOpen, page: "Guide", desc: "Hướng dẫn chi tiết" },
      { label: "FAQ", icon: HelpCircle, page: "FAQ", desc: "Câu hỏi thường gặp" },
      { label: "Câu chuyện thành công", icon: Users, page: "Testimonials", desc: "Kinh nghiệm thực tế" },
      { label: "Liên hệ", icon: Headphones, page: "Contact", desc: "Hỗ trợ trực tiếp" },
    ],
  },
  {
    id: "library",
    label: "Thư viện",
    emoji: "⭐",
    icon: Star,
    color: "amber",
    items: [
      { label: "Bookmarks", icon: Bookmark, page: "Bookmarks", desc: "Lưu bài yêu thích" },
      { label: "Tải xuống", icon: Download, page: "Downloads", desc: "Templates & guides" },
    ],
  },
];

const colorConfig = {
  blue:   { dot: "bg-blue-500",   badge: "bg-blue-50 text-blue-700 border-blue-200",   item: "text-blue-600",   icon: "bg-blue-100 text-blue-600",   activeItem: "bg-blue-50 text-blue-800" },
  violet: { dot: "bg-violet-500", badge: "bg-violet-50 text-violet-700 border-violet-200", item: "text-violet-600", icon: "bg-violet-100 text-violet-600", activeItem: "bg-violet-50 text-violet-800" },
  emerald:{ dot: "bg-emerald-500",badge: "bg-emerald-50 text-emerald-700 border-emerald-200", item: "text-emerald-600", icon: "bg-emerald-100 text-emerald-600", activeItem: "bg-emerald-50 text-emerald-800" },
  indigo: { dot: "bg-indigo-500", badge: "bg-indigo-50 text-indigo-700 border-indigo-200", item: "text-indigo-600", icon: "bg-indigo-100 text-indigo-600", activeItem: "bg-indigo-50 text-indigo-800" },
  amber:  { dot: "bg-amber-500",  badge: "bg-amber-50 text-amber-700 border-amber-200",  item: "text-amber-600",  icon: "bg-amber-100 text-amber-600",  activeItem: "bg-amber-50 text-amber-800" },
};

// ── Mega Dropdown ─────────────────────────────────────────────
function NavDropdown({ group, currentPageName, onClose }) {
  const c = colorConfig[group.color];
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 z-50 overflow-hidden"
      style={{ boxShadow: "0 8px 40px rgba(15,35,71,0.12)" }}>
      {/* Group header */}
      <div className="px-4 pb-2 mb-1 border-b border-gray-50">
        <div className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${c.badge}`}>
          <span>{group.emoji}</span> {group.label}
        </div>
      </div>
      {group.items.map(item => {
        const Icon = item.icon;
        const isActive = currentPageName === item.page;
        return (
          <Link
            key={item.page}
            to={createPageUrl(item.page)}
            onClick={onClose}
            className={`flex items-center gap-3 mx-2 px-3 py-2.5 rounded-xl transition-colors duration-150 cursor-pointer ${
              isActive ? `${c.activeItem} font-medium` : "hover:bg-gray-50 text-gray-700"
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
              isActive ? c.icon : "bg-gray-100 text-gray-500"
            }`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium leading-tight">{item.label}</div>
              {item.desc && <div className="text-xs text-gray-400 leading-tight mt-0.5">{item.desc}</div>}
            </div>
            {isActive && <div className={`ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.dot}`} />}
          </Link>
        );
      })}
    </div>
  );
}

// ── Main Layout ────────────────────────────────────────────────
export default function Layout({ children, currentPageName }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setOpenGroup(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === "k" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); setSearchOpen(true); }};
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const isGroupActive = (group) => group.items.some(i => i.page === currentPageName);

  const adminPages = [
    { page: "AdminActivate", icon: Shield, title: "Kích hoạt" },
    { page: "AdminFeedback", icon: Lightbulb, title: "Feedback" },
    { page: "AdminGuide", icon: BookOpen, title: "Knowledge Base" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <style>{`
        :root { --color-primary: #0f2347; }
        * { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        .nav-dropdown-enter { animation: dropIn 0.15s ease-out; }
        @keyframes dropIn { from { opacity: 0; transform: translateX(-50%) translateY(-6px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
      `}</style>

      {/* ── Top Nav ── */}
      <nav ref={navRef} className="bg-white border-b border-slate-200 sticky top-0 z-40"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-3">

          {/* Logo */}
          <Link to={createPageUrl("Home")} className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-8 h-8 bg-gradient-to-br from-[#1a4b9b] to-[#0f2347] rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <span className="text-white font-black text-[11px] tracking-tight">ÚC</span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-black text-[#0f2347] text-sm tracking-tight">Di Trú <span className="text-[#1a4b9b]">AI</span></span>
              <span className="text-[9px] text-slate-400 font-medium tracking-widest uppercase hidden sm:block">by Genetic AI</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">

            {/* Home */}
            <Link to={createPageUrl("Home")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 cursor-pointer ${
                currentPageName === "Home"
                  ? "bg-[#0f2347] text-white"
                  : "text-slate-600 hover:text-[#0f2347] hover:bg-slate-100"
              }`}>
              <Home className="w-4 h-4" />
              <span>Trang chủ</span>
            </Link>

            {/* AI CTA */}
            <Link to={createPageUrl("Chat")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 cursor-pointer mx-1 ${
                currentPageName === "Chat"
                  ? "bg-[#1a4b9b] text-white shadow-md"
                  : "bg-gradient-to-r from-[#1a4b9b] to-[#0f2347] text-white shadow-sm hover:shadow-md hover:opacity-95"
              }`}>
              <Bot className="w-4 h-4" />
              <span>Tư vấn AI</span>
            </Link>

            {/* Group dropdowns */}
            {navGroups.map((group) => {
              const isOpen = openGroup === group.id;
              const isActive = isGroupActive(group);
              const GroupIcon = group.icon;
              return (
                <div key={group.id} className="relative">
                  <button
                    onClick={() => setOpenGroup(isOpen ? null : group.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 cursor-pointer ${
                      isActive || isOpen
                        ? "bg-slate-100 text-[#0f2347]"
                        : "text-slate-600 hover:text-[#0f2347] hover:bg-slate-100"
                    }`}
                  >
                    <GroupIcon className="w-4 h-4" />
                    <span>{group.label}</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                    {isActive && !isOpen && <span className={`w-1.5 h-1.5 rounded-full ml-0.5 ${colorConfig[group.color].dot}`} />}
                  </button>
                  {isOpen && (
                    <div className="nav-dropdown-enter">
                      <NavDropdown group={group} currentPageName={currentPageName} onClose={() => setOpenGroup(null)} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <button onClick={() => setSearchOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-slate-500 hover:text-[#0f2347] hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Tìm kiếm">
              <Search className="w-4 h-4" />
            </button>

            {/* Notifications */}
            <Link to={createPageUrl("Notifications")}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                currentPageName === "Notifications"
                  ? "bg-[#1a4b9b] text-white"
                  : "text-slate-500 hover:text-[#0f2347] hover:bg-slate-100"
              }`}
              aria-label="Thông báo">
              <Bell className="w-4 h-4" />
            </Link>

            {/* Settings */}
            <Link to={createPageUrl("Settings")}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                currentPageName === "Settings"
                  ? "bg-[#1a4b9b] text-white"
                  : "text-slate-500 hover:text-[#0f2347] hover:bg-slate-100"
              }`}
              aria-label="Cài đặt">
              <SettingsIcon className="w-4 h-4" />
            </Link>

            {/* Profile */}
            <Link to={createPageUrl("Profile")}
              className={`hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                currentPageName === "Profile"
                  ? "bg-[#0f2347] text-white"
                  : "text-slate-600 hover:text-[#0f2347] hover:bg-slate-100"
              }`}>
              <User className="w-4 h-4" />
              <span>Hồ sơ</span>
            </Link>

            {/* Upgrade */}
            <Link to={createPageUrl("Pricing")}
              className={`hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                currentPageName === "Pricing"
                  ? "bg-amber-500 text-white"
                  : "text-amber-600 hover:bg-amber-50 border border-amber-200"
              }`}>
              <Crown className="w-4 h-4" />
              <span>Nâng cấp</span>
            </Link>

            {/* Admin icons – desktop only, subtle */}
            <div className="hidden lg:flex items-center gap-0.5 ml-1 pl-2 border-l border-slate-200">
              {adminPages.map(({ page, icon: Icon, title }) => (
                <Link key={page} to={createPageUrl(page)}
                  className={`p-2 rounded-lg transition-colors cursor-pointer ${
                    currentPageName === page
                      ? "bg-slate-700 text-white"
                      : "text-slate-300 hover:text-slate-600 hover:bg-slate-100"
                  }`}
                  aria-label={`Admin – ${title}`}>
                  <Icon className="w-3.5 h-3.5" />
                </Link>
              ))}
            </div>

            {/* Mobile hamburger */}
            <button className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer ml-1" aria-label="Menu"
              onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white max-h-[80vh] overflow-y-auto">
            <div className="px-3 pt-3 pb-4 space-y-1">

              {/* AI CTA */}
              <Link to={createPageUrl("Chat")} onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-[#1a4b9b] to-[#0f2347] text-white font-semibold mb-3">
                <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold">Tư vấn AI</div>
                  <div className="text-xs text-blue-200">Hỏi đáp trực tuyến 24/7</div>
                </div>
              </Link>

              {/* Home */}
              <Link to={createPageUrl("Home")} onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  currentPageName === "Home" ? "bg-[#0f2347] text-white" : "text-slate-700 hover:bg-slate-50"
                }`}>
                <Home className="w-4 h-4" /> Trang chủ
              </Link>

              {/* Groups */}
              {navGroups.map(group => {
                const c = colorConfig[group.color];
                const GroupIcon = group.icon;
                return (
                  <div key={group.id} className="mt-2">
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 mb-1 rounded-lg border text-xs font-bold ${c.badge}`}>
                      <GroupIcon className="w-3.5 h-3.5" /> {group.label}
                    </div>
                    {group.items.map(item => {
                      const Icon = item.icon;
                      const isActive = currentPageName === item.page;
                      return (
                        <Link key={item.page} to={createPageUrl(item.page)} onClick={() => setMobileOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer mb-0.5 ${
                            isActive ? "bg-[#0f2347] text-white" : "text-slate-600 hover:bg-slate-50"
                          }`}>
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${isActive ? "bg-white/20" : c.icon}`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div>{item.label}</div>
                            {item.desc && <div className={`text-xs mt-0.5 ${isActive ? "text-white/60" : "text-slate-400"}`}>{item.desc}</div>}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                );
              })}

              {/* Divider + utilities */}
              <div className="border-t border-slate-100 mt-3 pt-3 space-y-0.5">
                {[
                  { label: "Hồ sơ cá nhân", icon: User, page: "Profile" },
                  { label: "Nâng cấp Premium", icon: Crown, page: "Pricing", highlight: true },
                  { label: "Thông báo", icon: Bell, page: "Notifications" },
                  { label: "Góp ý", icon: Lightbulb, page: "Feedback" },
                  { label: "Cài đặt", icon: SettingsIcon, page: "Settings" },
                ].map(item => {
                  const Icon = item.icon;
                  const isActive = currentPageName === item.page;
                  return (
                    <Link key={item.page} to={createPageUrl(item.page)} onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                        item.highlight && !isActive
                          ? "text-amber-600 hover:bg-amber-50"
                          : isActive
                          ? "bg-[#0f2347] text-white"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}>
                      <Icon className="w-4 h-4" /> {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Global Search Modal */}
      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Page content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-[#1a4b9b] to-[#0f2347] rounded-md flex items-center justify-center">
              <span className="text-white font-black text-[10px]">ÚC</span>
            </div>
            <span className="text-sm font-bold text-slate-800">Úc Di Trú <span className="text-[#1a4b9b]">AI</span></span>
          </div>
          <p className="text-xs text-slate-400 text-center max-w-sm">
            Thông tin mang tính tham khảo. Luôn tham vấn MARA agent được đăng ký cho các quyết định di trú quan trọng.
          </p>
          <div className="text-xs text-slate-400">
            Tạo bởi <span className="font-semibold text-slate-500">DVLong</span> &amp; <span className="font-semibold text-violet-500">Genetic AI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}