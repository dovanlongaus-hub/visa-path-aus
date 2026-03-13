import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Home, Bot, ChevronDown, Search, Bell, User, Crown, ArrowLeft } from "lucide-react";
import { createPageUrl } from "@/utils";
import { navGroups, PAGE_TITLES, NO_BACK_PAGES } from "./NavConfig";
import NavDropdown from "./NavDropdown";

export default function Header({ currentPageName, setSearchOpen, handleBack }) {
  const [openGroup, setOpenGroup] = useState(null);
  const navRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setOpenGroup(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isGroupActive = (group) => group.items.some(i => i.page === currentPageName);

  return (
    <header ref={navRef} className="w-full bg-white border-b border-slate-100 sticky top-0 z-50 h-[52px]">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center">
        
        {/* LOGO & BRAND */}
        <Link to={createPageUrl("Home")} className="flex items-center gap-2 mr-6 shrink-0">
          <div className="w-7 h-7 bg-[#0f2347] rounded-md flex items-center justify-center text-white font-bold text-[9px]">UC</div>
          <div className="flex flex-col leading-none">
            <span className="font-bold text-slate-900 text-[14px] tracking-tight">Di Trú AI</span>
            <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Genetic</span>
          </div>
        </Link>

        {/* NAVIGATION (Center) */}
        <nav className="hidden lg:flex items-center gap-1 flex-1">
          <NavItem to={createPageUrl("Home")} active={currentPageName === "Home"} icon={<Home size={15} />} label="Trang chủ" />
          <NavItem to={createPageUrl("Chat")} active={currentPageName === "Chat"} icon={<Bot size={15} />} label="AI Chat" isSpecial />
          
          <div className="w-px h-3 bg-slate-200 mx-2" />

          {navGroups.map((group) => (
            <div key={group.id} className="relative">
              <button 
                onClick={() => setOpenGroup(openGroup === group.id ? null : group.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
                  isGroupActive(group) || openGroup === group.id ? "text-[#1a4b9b] bg-slate-50" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <group.icon size={15} className={isGroupActive(group) ? "text-[#1a4b9b]" : "text-slate-400"} />
                <span>{group.label}</span>
                <ChevronDown size={12} className={`opacity-40 transition-transform ${openGroup === group.id ? 'rotate-180' : ''}`} />
              </button>
              {openGroup === group.id && (
                <NavDropdown group={group} currentPageName={currentPageName} onClose={() => setOpenGroup(null)} />
              )}
            </div>
          ))}
        </nav>

        {/* ACTIONS (Right) */}
        <div className="flex items-center gap-1 ml-auto">
          <ActionBtn onClick={() => setSearchOpen(true)} icon={<Search size={18} />} />
          <ActionBtn to={createPageUrl("Notifications")} icon={<Bell size={18} />} active={currentPageName === "Notifications"} />
          
          <div className="w-px h-3 bg-slate-200 mx-2 hidden sm:block" />

          <Link to={createPageUrl("Pricing")} className="p-1.5 text-amber-500 hover:text-amber-600 transition-colors">
            <Crown size={18} />
          </Link>

          <Link to={createPageUrl("Profile")} className="ml-1 p-px border border-slate-200 rounded-full hover:border-slate-400 transition-all">
            <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-slate-500"><User size={14} /></div>
          </Link>
        </div>
      </div>

      {/* MOBILE BACK OVERLAY */}
      {!NO_BACK_PAGES.includes(currentPageName) && (
        <div className="lg:hidden absolute inset-0 bg-white flex items-center px-4">
          <button onClick={handleBack} className="p-1.5 -ml-1.5 hover:bg-slate-50 rounded-full"><ArrowLeft size={18} /></button>
          <span className="font-bold text-sm ml-2 text-slate-900">{PAGE_TITLES[currentPageName]}</span>
        </div>
      )}
    </header>
  );
}

// Minimal Sub-components
const NavItem = ({ to, active, icon, label, isSpecial }) => (
  <Link to={to} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[13px] font-medium transition-all ${
    active ? (isSpecial ? "bg-[#1a4b9b] text-white shadow-sm" : "text-[#1a4b9b] bg-blue-50/50") : "text-slate-600 hover:bg-slate-50"
  }`}>
    <span className={active ? "text-current" : "text-slate-400"}>{icon}</span>
    <span>{label}</span>
  </Link>
);

const ActionBtn = ({ icon, onClick, to, active }) => {
  const css = `p-1.5 rounded-md transition-colors ${active ? "text-[#1a4b9b] bg-blue-50" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"}`;
  return to ? <Link to={to} className={css}>{icon}</Link> : <button onClick={onClick} className={css}>{icon}</button>;
};