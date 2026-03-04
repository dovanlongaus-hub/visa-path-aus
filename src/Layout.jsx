import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, Map, CheckSquare, FileText, MessageCircle, Upload, User, Menu, X, Flag, Briefcase, Award } from "lucide-react";

const navItems = [
  { label: "Trang chủ", icon: Home, page: "Home" },
  { label: "Lộ trình PR", icon: Map, page: "Roadmap" },
  { label: "Visa 482", icon: Briefcase, page: "Visa482" },
  { label: "Visa 858", icon: Award, page: "Visa858" },
  { label: "Checklist", icon: CheckSquare, page: "Checklist" },
  { label: "Biểu mẫu", icon: FileText, page: "Forms" },
  { label: "Upload CV", icon: Upload, page: "CVUpload" },
  { label: "Tư vấn AI", icon: MessageCircle, page: "Chat" },
  { label: "Hồ sơ", icon: User, page: "Profile" },
];

export default function Layout({ children, currentPageName }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      <style>{`
        :root {
          --color-primary: #0f2347;
          --color-primary-light: #1a3a6e;
        }
        * { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
      `}</style>

      {/* Top nav */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to={createPageUrl("Home")} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
              <Flag className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-[#0f2347] text-lg">Úc Di Trú AI</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPageName === item.page;
              return (
                <Link
                  key={item.page}
                  to={createPageUrl(item.page)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#0f2347] text-white"
                      : "text-gray-600 hover:text-[#0f2347] hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
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
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPageName === item.page;
              return (
                <Link
                  key={item.page}
                  to={createPageUrl(item.page)}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive ? "bg-[#0f2347] text-white" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {/* Page content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-md flex items-center justify-center">
              <Flag className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">Úc Di Trú AI</span>
          </div>
          <p className="text-xs text-gray-400 text-center">
            Thông tin mang tính tham khảo. Luôn tham vấn MARA agent được đăng ký cho các quyết định di trú quan trọng.
          </p>
        </div>
      </footer>
    </div>
  );
}