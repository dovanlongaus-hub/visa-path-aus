import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Home, Map, CheckSquare, FileText, MessageCircle, Upload,
  User, Menu, X, Flag, Briefcase, Award, Sparkles,
  ChevronDown, Bot, ClipboardList, Target, Crown, Shield, Lightbulb, BookOpen,
  HelpCircle, Bookmark, Download, Users, Bell, Settings as SettingsIcon, Search
} from "lucide-react";
import GlobalSearch from "./components/GlobalSearch";

// ── Nav structure ──────────────────────────────────────────────
// Priority items shown always; grouped items in dropdown
const primaryItems = [
  { label: "Trang chủ", icon: Home, page: "Home", emoji: "🏠" },
  { label: "Tư vấn AI", icon: Bot, page: "Chat", emoji: "🤖", highlight: true },
  { label: "Lộ trình PR", icon: Map, page: "Roadmap", emoji: "🗺️" },
  { label: "Hồ sơ", icon: User, page: "Profile", emoji: "👤" },
  { label: "Góp ý", icon: MessageCircle, page: "Feedback", emoji: "💬" },
];

const groups = [
  {
    label: "Visa & Thông tin",
    emoji: "🛂",
    color: "blue",
    items: [
      { label: "Lộ trình PR", icon: Map, page: "Roadmap", desc: "500→485→189/190" },
      { label: "Visa 482", icon: Briefcase, page: "Visa482", desc: "Employer Sponsored" },
      { label: "Visa 858", icon: Award, page: "Visa858", desc: "National Innovation" },
    ],
  },
  {
    label: "Hồ sơ & Công cụ",
    emoji: "📁",
    color: "violet",
    items: [
      { label: "Hồ sơ cá nhân", icon: User, page: "Profile", desc: "Lưu thông tin cá nhân" },
      { label: "Kế hoạch cá nhân", icon: Target, page: "MyPlan", desc: "Task list & lộ trình AI" },
      { label: "Checklist PR", icon: CheckSquare, page: "Checklist", desc: "Theo dõi tiến trình PR" },
      { label: "Chuẩn bị qua Úc", icon: Plane, page: "ArrivalGuide", desc: "Checklist khi mới đến Úc" },
      { label: "Upload CV", icon: Upload, page: "CVUpload", desc: "Trích xuất bằng AI" },
    ],
  },
  {
    label: "Biểu mẫu & EOI",
    emoji: "📝",
    color: "emerald",
    items: [
      { label: "Biểu mẫu di trú", icon: FileText, page: "Forms", desc: "Form chính thức DIBP" },
      { label: "EOI & CV AI", icon: Sparkles, page: "EOIGenerator", desc: "Tạo EOI/CV tự động" },
    ],
  },
  {
    label: "Hướng dẫn & Hỗ trợ",
    emoji: "📚",
    color: "indigo",
    items: [
      { label: "Knowledge Base", icon: BookOpen, page: "Guide", desc: "Bài viết hướng dẫn chi tiết" },
      { label: "FAQ", icon: HelpCircle, page: "FAQ", desc: "Câu hỏi thường gặp" },
      { label: "Liên hệ", icon: MessageCircle, page: "Contact", desc: "Gửi tin nhắn hỗ trợ" },
    ],
  },
  {
    label: "Tài liệu & Yêu thích",
    emoji: "⭐",
    color: "rose",
    items: [
      { label: "Bookmarks", icon: Bookmark, page: "Bookmarks", desc: "Lưu bài viết yêu thích" },
      { label: "Tải xuống", icon: Download, page: "Downloads", desc: "Templates & guides" },
      { label: "Câu chuyện thành công", icon: Users, page: "Testimonials", desc: "Chia sẻ kinh nghiệm" },
    ],
  },
];

const colorMap = {
  blue:    { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200",    dot: "bg-blue-500" },
  violet:  { bg: "bg-violet-50",  text: "text-violet-700",  border: "border-violet-200",  dot: "bg-violet-500" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
  indigo:  { bg: "bg-indigo-50",  text: "text-indigo-700",  border: "border-indigo-200",  dot: "bg-indigo-500" },
  rose:    { bg: "bg-rose-50",    text: "text-rose-700",    border: "border-rose-200",    dot: "bg-rose-500" },
};

// ── Dropdown ───────────────────────────────────────────────────
function NavDropdown({ group, currentPageName, onClose }) {
  const c = colorMap[group.color];
  return (
    <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden">
      <div className={`px-4 py-2 mb-1 ${c.bg} border-b ${c.border}`}>
        <span className={`text-xs font-bold ${c.text}`}>{group.emoji} {group.label}</span>
      </div>
      {group.items.map(item => {
        const Icon = item.icon;
        const isActive = currentPageName === item.page;
        return (
          <Link
            key={item.page}
            to={createPageUrl(item.page)}
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors ${isActive ? "bg-gray-50" : ""}`}
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${isActive ? `${c.bg}` : "bg-gray-100"}`}>
              <Icon className={`w-3.5 h-3.5 ${isActive ? c.text : "text-gray-500"}`} />
            </div>
            <div>
              <div className={`text-sm font-medium ${isActive ? "text-[#0f2347]" : "text-gray-700"}`}>{item.label}</div>
              {item.desc && <div className="text-xs text-gray-400">{item.desc}</div>}
            </div>
            {isActive && <div className={`ml-auto w-1.5 h-1.5 rounded-full ${c.dot}`} />}
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

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setOpenGroup(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Check if any item in a group is active
  const isGroupActive = (group) => group.items.some(i => i.page === currentPageName);

  // All pages for mobile
  const allMobileItems = [
    { label: "Trang chủ", icon: Home, page: "Home" },
    { label: "Tư vấn AI", icon: Bot, page: "Chat" },
    { label: "Lộ trình PR", icon: Map, page: "Roadmap" },
    { label: "Visa 482", icon: Briefcase, page: "Visa482" },
    { label: "Visa 858", icon: Award, page: "Visa858" },
    { label: "Hồ sơ", icon: User, page: "Profile" },
    { label: "Checklist", icon: CheckSquare, page: "Checklist" },
    { label: "Upload CV", icon: Upload, page: "CVUpload" },
    { label: "Biểu mẫu", icon: FileText, page: "Forms" },
    { label: "EOI & CV", icon: Sparkles, page: "EOIGenerator" },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      <style>{`
        :root { --color-primary: #0f2347; --color-primary-light: #1a3a6e; }
        * { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
      `}</style>

      {/* Top nav */}
      <nav ref={navRef} className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to={createPageUrl("Home")} className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 via-indigo-600 to-violet-700 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-black text-sm tracking-tight">ÚC</span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-black text-[#0f2347] text-base tracking-tight">Di Trú <span className="text-blue-600">AI</span></span>
              <span className="text-[9px] text-gray-400 font-medium tracking-widest uppercase">by Genetic AI</span>
            </div>
          </Link>

          {/* Global Search */}
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            title="Tìm kiếm (Ctrl+K)"
          >
            <Search className="w-4 h-4" />
            <span className="text-sm">Tìm kiếm</span>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1 flex-1 justify-center">

            {/* Home */}
            <Link
              to={createPageUrl("Home")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPageName === "Home" ? "bg-[#0f2347] text-white" : "text-gray-600 hover:text-[#0f2347] hover:bg-gray-100"
              }`}
            >
              <Home className="w-4 h-4" /> Trang chủ
            </Link>

            {/* 🔥 CTA – Tư vấn AI (highlighted) */}
            <Link
              to={createPageUrl("Chat")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                currentPageName === "Chat"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90 shadow-sm hover:shadow-md hover:-translate-y-0.5"
              }`}
            >
              <Bot className="w-4 h-4" /> 🤖 Tư vấn AI
            </Link>

            {/* Grouped dropdowns */}
            {groups.map((group) => {
              const isOpen = openGroup === group.label;
              const isActive = isGroupActive(group);
              return (
                <div key={group.label} className="relative">
                  <button
                    onClick={() => setOpenGroup(isOpen ? null : group.label)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive || isOpen ? "bg-gray-100 text-[#0f2347]" : "text-gray-600 hover:text-[#0f2347] hover:bg-gray-100"
                    }`}
                  >
                    <span>{group.emoji}</span>
                    {group.label}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                  </button>
                  {isOpen && (
                    <NavDropdown
                      group={group}
                      currentPageName={currentPageName}
                      onClose={() => setOpenGroup(null)}
                    />
                  )}
                </div>
              );
            })}

            {/* Profile */}
            <Link
              to={createPageUrl("Profile")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPageName === "Profile" ? "bg-[#0f2347] text-white" : "text-gray-600 hover:text-[#0f2347] hover:bg-gray-100"
              }`}
            >
              <User className="w-4 h-4" /> Hồ sơ
            </Link>

            {/* Feedback */}
            <Link
              to={createPageUrl("Feedback")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPageName === "Feedback" ? "bg-[#0f2347] text-white" : "text-gray-600 hover:text-[#0f2347] hover:bg-gray-100"
              }`}
            >
              <Lightbulb className="w-4 h-4" /> Góp ý
            </Link>

            {/* Notifications */}
            <Link
              to={createPageUrl("Notifications")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                currentPageName === "Notifications" ? "bg-blue-600 text-white" : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
              }`}
            >
              <Bell className="w-4 h-4" />
              <span className="hidden md:inline">Thông báo</span>
            </Link>

            {/* Settings */}
            <Link
              to={createPageUrl("Settings")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPageName === "Settings" ? "bg-blue-600 text-white" : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
              }`}
            >
              <SettingsIcon className="w-4 h-4" />
              <span className="hidden md:inline">Cài đặt</span>
            </Link>

            {/* Pricing CTA */}
            <Link
              to={createPageUrl("Pricing")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPageName === "Pricing" ? "bg-violet-700 text-white" : "text-violet-600 hover:text-violet-700 hover:bg-violet-50"
              }`}
            >
              <Crown className="w-4 h-4" /> Nâng cấp
            </Link>

            {/* Admin only */}
            <Link
              to={createPageUrl("AdminActivate")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPageName === "AdminActivate" ? "bg-gray-800 text-white" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              }`}
              title="Admin – Kích hoạt Premium"
            >
              <Shield className="w-4 h-4" />
            </Link>

            {/* Admin Feedback */}
            <Link
              to={createPageUrl("AdminFeedback")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPageName === "AdminFeedback" ? "bg-gray-800 text-white" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              }`}
              title="Admin – Quản lý Feedback"
            >
              <Lightbulb className="w-4 h-4" />
            </Link>

            {/* Admin Guide */}
            <Link
              to={createPageUrl("AdminGuide")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPageName === "AdminGuide" ? "bg-gray-800 text-white" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              }`}
              title="Admin – Knowledge Base"
            >
              <BookOpen className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3">
            {/* CTA first */}
            <Link
              to={createPageUrl("Chat")}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold mb-3"
            >
              <Bot className="w-5 h-5" />
              <div>
                <div className="text-sm font-bold">🤖 Tư vấn AI</div>
                <div className="text-xs text-blue-200">Hỏi đáp trực tuyến 24/7</div>
              </div>
            </Link>

            {/* Groups */}
            {groups.map(group => {
              const c = colorMap[group.color];
              return (
                <div key={group.label} className="mb-3">
                  <div className={`px-3 py-1.5 rounded-lg mb-1 ${c.bg}`}>
                    <span className={`text-xs font-bold ${c.text}`}>{group.emoji} {group.label}</span>
                  </div>
                  {group.items.map(item => {
                    const Icon = item.icon;
                    const isActive = currentPageName === item.page;
                    return (
                      <Link
                        key={item.page}
                        to={createPageUrl(item.page)}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors mb-0.5 ${
                          isActive ? "bg-[#0f2347] text-white" : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <div>
                          <div>{item.label}</div>
                          {item.desc && <div className={`text-xs ${isActive ? "text-white/60" : "text-gray-400"}`}>{item.desc}</div>}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              );
            })}

            {/* Pricing mobile */}
            <Link
              to={createPageUrl("Pricing")}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold mb-3"
            >
              <Crown className="w-4 h-4" />
              <div>
                <div className="text-sm font-bold">👑 Nâng cấp gói dịch vụ</div>
                <div className="text-xs text-violet-200">Mở khóa AI chuyên sâu từ $29/tháng</div>
              </div>
            </Link>

            {/* Home & Other quick links */}
            {[
              { label: "Trang chủ", icon: Home, page: "Home" },
              { label: "Knowledge Base", icon: BookOpen, page: "Guide" },
              { label: "FAQ", icon: HelpCircle, page: "FAQ" },
              { label: "Hồ sơ cá nhân", icon: User, page: "Profile" },
              { label: "Thông báo", icon: Bell, page: "Notifications" },
              { label: "Cài đặt", icon: SettingsIcon, page: "Settings" },
              { label: "Góp ý", icon: Lightbulb, page: "Feedback" },
            ].map(item => {
              const Icon = item.icon;
              const isActive = currentPageName === item.page;
              return (
                <Link
                  key={item.page}
                  to={createPageUrl(item.page)}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors mb-0.5 ${
                    isActive ? "bg-[#0f2347] text-white" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-4 h-4" /> {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {/* Global Search Modal */}
      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Page content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-blue-500 via-indigo-600 to-violet-700 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-black text-xs tracking-tight">ÚC</span>
            </div>
            <span className="text-sm font-bold text-gray-800">Úc Di Trú <span className="text-blue-600">AI</span></span>
          </div>
          <p className="text-xs text-gray-400 text-center">
            Thông tin mang tính tham khảo. Luôn tham vấn MARA agent được đăng ký cho các quyết định di trú quan trọng.
          </p>
          <div className="text-xs text-gray-400 text-center">
            Tạo bởi <span className="font-semibold text-gray-500">DVLong</span> &amp; <span className="font-semibold text-violet-500">Genetic AI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}