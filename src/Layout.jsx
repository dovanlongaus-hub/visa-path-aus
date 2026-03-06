import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Home, Map, CheckSquare, FileText, MessageCircle, Upload,
  User, Menu, X, Briefcase, Award, Sparkles,
  ChevronDown, Bot, Target, Crown, Shield, Lightbulb, BookOpen,
  HelpCircle, Bookmark, Download, Users, Bell, Settings as SettingsIcon,
  Search, Plane, Star, Globe, ClipboardList, Headphones, ArrowLeft
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
  blue:    { dot: "bg-blue-500",    badge: "bg-blue-50 text-blue-700 border-blue-200",    icon: "bg-blue-100 text-blue-600",    activeItem: "bg-blue-50 text-blue-800" },
  violet:  { dot: "bg-violet-500",  badge: "bg-violet-50 text-violet-700 border-violet-200",  icon: "bg-violet-100 text-violet-600",  activeItem: "bg-violet-50 text-violet-800" },
  emerald: { dot: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: "bg-emerald-100 text-emerald-600", activeItem: "bg-emerald-50 text-emerald-800" },
  indigo:  { dot: "bg-indigo-500",  badge: "bg-indigo-50 text-indigo-700 border-indigo-200",  icon: "bg-indigo-100 text-indigo-600",  activeItem: "bg-indigo-50 text-indigo-800" },
  amber:   { dot: "bg-amber-500",   badge: "bg-amber-50 text-amber-700 border-amber-200",   icon: "bg-amber-100 text-amber-600",   activeItem: "bg-amber-50 text-amber-800" },
};

// Bottom tab bar items (mobile)
const bottomTabs = [
  { label: "Trang chủ", icon: Home, page: "Home" },
  { label: "Tư vấn AI", icon: Bot, page: "Chat" },
  { label: "Lộ trình", icon: Map, page: "Roadmap" },
  { label: "Hồ sơ", icon: User, page: "Profile" },
  { label: "Thêm", icon: Menu, page: "__more__" },
];

// Pages that show a Back button instead of full nav context
const NO_BACK_PAGES = ["Home", "Chat"];

// Page title map for back button header
const PAGE_TITLES = {
  Roadmap: "Lộ trình PR",
  Visa482: "Visa 482",
  Visa858: "Visa 858",
  Profile: "Hồ sơ cá nhân",
  MyPlan: "Kế hoạch cá nhân",
  Checklist: "Checklist PR",
  ArrivalGuide: "Chuẩn bị qua Úc",
  CVUpload: "Upload CV",
  Forms: "Biểu mẫu di trú",
  EOIGenerator: "EOI & CV AI",
  Guide: "Knowledge Base",
  FAQ: "FAQ",
  Testimonials: "Câu chuyện thành công",
  Contact: "Liên hệ",
  Bookmarks: "Bookmarks",
  Downloads: "Tải xuống",
  Pricing: "Nâng cấp Premium",
  Notifications: "Thông báo",
  Settings: "Cài đặt",
  Feedback: "Góp ý",
  Article: "Bài viết",
  AdminActivate: "Admin – Kích hoạt",
  AdminFeedback: "Admin – Feedback",
  AdminGuide: "Admin – Knowledge Base",
};

// ── Dropdown ──────────────────────────────────────────────────
function NavDropdown({ group, currentPageName, onClose }) {
  const c = colorConfig[group.color];
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 z-50 overflow-hidden"
      style={{ boxShadow: "0 8px 40px rgba(15,35,71,0.12)" }}>
      <div className="px-4 pb-2 mb-1 border-b border-gray-50">
        <div className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${c.badge}`}>
          <span>{group.emoji}</span> {group.label}
        </div>
      </div>
      {group.items.map(item => {
        const Icon = item.icon;
        const isActive = currentPageName === item.page;
        return (
          <Link key={item.page} to={createPageUrl(item.page)} onClick={onClose}
            className={`flex items-center gap-3 mx-2 px-3 py-2.5 rounded-xl transition-colors duration-150 cursor-pointer ${
              isActive ? `${c.activeItem} font-medium` : "hover:bg-gray-50 text-gray-700"
            }`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isActive ? c.icon : "bg-gray-100 text-gray-500"}`}>
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

// ── Mobile More Sheet ─────────────────────────────────────────
function MobileMoreSheet({ currentPageName, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-white rounded-t-3xl px-4 pt-4 pb-8 max-h-[75vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}>
        <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-4" />
        <div className="flex items-center justify-between mb-3">
          <span className="font-bold text-slate-800">Tất cả tính năng</span>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"><X className="w-4 h-4 text-slate-500" /></button>
        </div>

        {navGroups.map(group => {
          const c = colorConfig[group.color];
          const GroupIcon = group.icon;
          return (
            <div key={group.id} className="mb-4">
              <div className={`flex items-center gap-1.5 px-2.5 py-1.5 mb-1.5 rounded-lg border text-xs font-bold ${c.badge}`}>
                <GroupIcon className="w-3.5 h-3.5" /> {group.label}
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {group.items.map(item => {
                  const Icon = item.icon;
                  const isActive = currentPageName === item.page;
                  return (
                    <Link key={item.page} to={createPageUrl(item.page)} onClick={onClose}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer border ${
                        isActive ? "bg-[#0f2347] text-white border-transparent" : "text-slate-700 hover:bg-slate-50 border-slate-100"
                      }`}>
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${isActive ? "bg-white/20" : c.icon}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}

        <div className="border-t border-slate-100 pt-3 grid grid-cols-2 gap-1.5">
          {[
            { label: "Nâng cấp", icon: Crown, page: "Pricing" },
            { label: "Thông báo", icon: Bell, page: "Notifications" },
            { label: "Góp ý", icon: Lightbulb, page: "Feedback" },
            { label: "Cài đặt", icon: SettingsIcon, page: "Settings" },
          ].map(item => {
            const Icon = item.icon;
            const isActive = currentPageName === item.page;
            return (
              <Link key={item.page} to={createPageUrl(item.page)} onClick={onClose}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer border ${
                  isActive ? "bg-[#0f2347] text-white border-transparent" : "text-slate-700 hover:bg-slate-50 border-slate-100"
                }`}>
                <Icon className="w-4 h-4" /> {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Main Layout ────────────────────────────────────────────────
export default function Layout({ children, currentPageName }) {
  const [openGroup, setOpenGroup] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [showMoreSheet, setShowMoreSheet] = useState(false);
  const navRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Track history for back button (exclude Chat so it's preserved)
  const [historyStack, setHistoryStack] = useState([]);
  useEffect(() => {
    setHistoryStack(prev => {
      const last = prev[prev.length - 1];
      if (last !== currentPageName) {
        return [...prev, currentPageName].slice(-20);
      }
      return prev;
    });
  }, [currentPageName]);

  const handleBack = () => {
    // Find previous page that is not current
    const prev = [...historyStack].reverse().find(p => p !== currentPageName);
    if (prev) {
      navigate(createPageUrl(prev));
    } else {
      navigate(createPageUrl("Home"));
    }
  };

  useEffect(() => {
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setOpenGroup(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "k" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); setSearchOpen(true); }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const isGroupActive = (group) => group.items.some(i => i.page === currentPageName);
  const showBackButton = !NO_BACK_PAGES.includes(currentPageName);
  const pageTitle = PAGE_TITLES[currentPageName] || currentPageName;

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
        @keyframes dropIn { from { opacity:0; transform:translateX(-50%) translateY(-6px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }
        body { padding-bottom: 64px; }
        @media(min-width:1024px) { body { padding-bottom: 0; } }
      `}</style>

      {/* ── Desktop Top Nav ── */}
      <nav ref={navRef} className="bg-white border-b border-slate-200 sticky top-0 z-40 hidden lg:block"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-3">

          {/* Logo */}
          <Link to={createPageUrl("Home")} className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-8 h-8 bg-gradient-to-br from-[#1a4b9b] to-[#0f2347] rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <span className="text-white font-black text-[11px] tracking-tight">ÚC</span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-black text-[#0f2347] text-sm tracking-tight">Di Trú <span className="text-[#1a4b9b]">AI</span></span>
              <span className="text-[9px] text-slate-400 font-medium tracking-widest uppercase">by Genetic AI</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="flex items-center gap-0.5 flex-1 justify-center">
            <Link to={createPageUrl("Home")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 cursor-pointer ${
                currentPageName === "Home" ? "bg-[#0f2347] text-white" : "text-slate-600 hover:text-[#0f2347] hover:bg-slate-100"
              }`}>
              <Home className="w-4 h-4" /><span>Trang chủ</span>
            </Link>

            <Link to={createPageUrl("Chat")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 cursor-pointer mx-1 ${
                currentPageName === "Chat"
                  ? "bg-[#1a4b9b] text-white shadow-md"
                  : "bg-gradient-to-r from-[#1a4b9b] to-[#0f2347] text-white shadow-sm hover:shadow-md hover:opacity-95"
              }`}>
              <Bot className="w-4 h-4" /><span>Tư vấn AI</span>
            </Link>

            {navGroups.map((group) => {
              const isOpen = openGroup === group.id;
              const isActive = isGroupActive(group);
              const GroupIcon = group.icon;
              return (
                <div key={group.id} className="relative">
                  <button onClick={() => setOpenGroup(isOpen ? null : group.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 cursor-pointer ${
                      isActive || isOpen ? "bg-slate-100 text-[#0f2347]" : "text-slate-600 hover:text-[#0f2347] hover:bg-slate-100"
                    }`}>
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
            <button onClick={() => setSearchOpen(true)}
              className="p-2 rounded-lg text-slate-500 hover:text-[#0f2347] hover:bg-slate-100 transition-colors cursor-pointer" aria-label="Tìm kiếm">
              <Search className="w-4 h-4" />
            </button>
            <Link to={createPageUrl("Notifications")}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${currentPageName === "Notifications" ? "bg-[#1a4b9b] text-white" : "text-slate-500 hover:text-[#0f2347] hover:bg-slate-100"}`}
              aria-label="Thông báo"><Bell className="w-4 h-4" /></Link>
            <Link to={createPageUrl("Settings")}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${currentPageName === "Settings" ? "bg-[#1a4b9b] text-white" : "text-slate-500 hover:text-[#0f2347] hover:bg-slate-100"}`}
              aria-label="Cài đặt"><SettingsIcon className="w-4 h-4" /></Link>
            <Link to={createPageUrl("Profile")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                currentPageName === "Profile" ? "bg-[#0f2347] text-white" : "text-slate-600 hover:text-[#0f2347] hover:bg-slate-100"
              }`}>
              <User className="w-4 h-4" /><span>Hồ sơ</span>
            </Link>
            <Link to={createPageUrl("Pricing")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                currentPageName === "Pricing" ? "bg-amber-500 text-white" : "text-amber-600 hover:bg-amber-50 border border-amber-200"
              }`}>
              <Crown className="w-4 h-4" /><span>Nâng cấp</span>
            </Link>
            <div className="flex items-center gap-0.5 ml-1 pl-2 border-l border-slate-200">
              {adminPages.map(({ page, icon: Icon, title }) => (
                <Link key={page} to={createPageUrl(page)}
                  className={`p-2 rounded-lg transition-colors cursor-pointer ${currentPageName === page ? "bg-slate-700 text-white" : "text-slate-300 hover:text-slate-600 hover:bg-slate-100"}`}
                  aria-label={`Admin – ${title}`}><Icon className="w-3.5 h-3.5" /></Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile Top Bar ── */}
      <div className="lg:hidden bg-white border-b border-slate-200 sticky top-0 z-40 h-14 flex items-center px-4"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        {showBackButton ? (
          /* Sub-page: show back button + title */
          <div className="flex items-center gap-3 w-full">
            <button onClick={handleBack}
              className="p-2 -ml-1 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer flex-shrink-0"
              aria-label="Quay lại">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="font-bold text-[#0f2347] text-base truncate flex-1">{pageTitle}</span>
            {/* Right: search + notifications */}
            <button onClick={() => setSearchOpen(true)} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 cursor-pointer"><Search className="w-4 h-4" /></button>
            <Link to={createPageUrl("Notifications")} className={`p-2 rounded-xl cursor-pointer ${currentPageName === "Notifications" ? "text-[#1a4b9b]" : "text-slate-400 hover:bg-slate-100"}`}><Bell className="w-4 h-4" /></Link>
          </div>
        ) : currentPageName === "Chat" ? (
          /* Chat page: logo + status */
          <div className="flex items-center gap-3 w-full">
            <div className="w-9 h-9 bg-gradient-to-br from-[#1a4b9b] to-[#0f2347] rounded-xl flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-[#0f2347] text-sm">AI Tư vấn Di trú</div>
              <div className="text-xs text-emerald-600 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />Đang hoạt động</div>
            </div>
            <button onClick={() => setSearchOpen(true)} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 cursor-pointer"><Search className="w-4 h-4" /></button>
          </div>
        ) : (
          /* Home: logo */
          <div className="flex items-center justify-between w-full">
            <Link to={createPageUrl("Home")} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#1a4b9b] to-[#0f2347] rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-[11px]">ÚC</span>
              </div>
              <div>
                <span className="font-black text-[#0f2347] text-sm">Di Trú <span className="text-[#1a4b9b]">AI</span></span>
              </div>
            </Link>
            <div className="flex items-center gap-1">
              <button onClick={() => setSearchOpen(true)} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 cursor-pointer"><Search className="w-4 h-4" /></button>
              <Link to={createPageUrl("Notifications")} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 cursor-pointer"><Bell className="w-4 h-4" /></Link>
              <Link to={createPageUrl("Settings")} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 cursor-pointer"><SettingsIcon className="w-4 h-4" /></Link>
            </div>
          </div>
        )}
      </div>

      {/* Global Search */}
      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* More sheet */}
      {showMoreSheet && <MobileMoreSheet currentPageName={currentPageName} onClose={() => setShowMoreSheet(false)} />}

      {/* Page content */}
      <main>{children}</main>

      {/* Footer – desktop only */}
      <footer className="hidden lg:block bg-white border-t border-slate-200 mt-16">
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

      {/* ── Mobile Bottom Tab Bar ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200"
        style={{ boxShadow: "0 -1px 8px rgba(0,0,0,0.08)" }}>
        <div className="flex items-stretch h-16">
          {bottomTabs.map(tab => {
            const Icon = tab.icon;
            const isMore = tab.page === "__more__";
            const isActive = !isMore && currentPageName === tab.page;
            const isMoreActive = isMore && showMoreSheet;

            return (
              <button key={tab.page}
                onClick={() => {
                  if (isMore) {
                    setShowMoreSheet(s => !s);
                  } else {
                    setShowMoreSheet(false);
                    navigate(createPageUrl(tab.page));
                  }
                }}
                className={`flex-1 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors ${
                  isActive || isMoreActive ? "text-[#1a4b9b]" : "text-slate-400 hover:text-slate-600"
                }`}>
                <div className={`p-1.5 rounded-xl transition-colors ${isActive || isMoreActive ? "bg-blue-50" : ""}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium leading-none">{tab.label}</span>
                {isActive && <span className="absolute bottom-0 w-8 h-0.5 bg-[#1a4b9b] rounded-full" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}