import { Home, Bot, Map, User, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

const tabs = [
  { label: "Trang chủ", icon: Home, page: "Home", color: "text-[#18406e] bg-[#e9f0f7]" },
  { label: "Tư vấn AI", icon: Bot, page: "Chat", color: "text-[#0f6b6f] bg-[#e8f4f4]" },
  { label: "Lộ trình", icon: Map, page: "Roadmap", color: "text-[#2f6b4a] bg-[#edf4ef]" },
  { label: "Hồ sơ", icon: User, page: "Profile", color: "text-[#654e36] bg-[#f6f1ea]" },
  { label: "Thêm", icon: Menu, page: "__more__", color: "text-[#49566b] bg-[#eff3f7]" },
];

export default function MobileBottomBar({ currentPageName, onMoreClick, showMoreSheet }) {
  const navigate = useNavigate();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 h-16 flex">
      {tabs.map(tab => {
        const isActive = (tab.page === "__more__" ? showMoreSheet : currentPageName === tab.page);
        return (
          <button key={tab.label} onClick={() => tab.page === "__more__" ? onMoreClick() : navigate(createPageUrl(tab.page))}
            className={`flex-1 flex flex-col items-center justify-center gap-1 ${isActive ? "text-[#1a4b9b]" : "text-slate-500"}`}>
            <div className={`p-1.5 rounded-xl ${isActive ? tab.color : ""}`}><tab.icon className="w-5 h-5" /></div>
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}