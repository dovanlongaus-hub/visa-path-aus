import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { navGroups, colorConfig } from "./NavConfig";

export default function MobileMoreSheet({ currentPageName, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end" onClick={onClose}>
      {/* Backdrop mờ phía sau */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />
      
      {/* Nội dung Sheet */}
      <div 
        className="relative bg-white rounded-t-3xl px-4 pt-4 pb-10 max-h-[80vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()} // Ngăn chặn đóng khi click vào bên trong sheet
      >
        {/* Thanh kéo giả (Handlebar) */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" />

        <div className="flex items-center justify-between mb-5 px-1">
          <span className="font-bold text-lg text-slate-800">Tất cả tính năng</span>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="space-y-6">
          {navGroups.map(group => {
            const c = colorConfig[group.color];
            const GroupIcon = group.icon;
            
            return (
              <div key={group.id} className="space-y-3">
                {/* Tiêu đề nhóm */}
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border w-fit text-xs font-bold uppercase tracking-wider ${c.badge}`}>
                  <GroupIcon className="w-3.5 h-3.5" />
                  {group.label}
                </div>

                {/* Danh sách các item trong nhóm */}
                <div className="grid grid-cols-2 gap-2">
                  {group.items.map(item => {
                    const Icon = item.icon;
                    const isActive = currentPageName === item.page;
                    
                    return (
                      <Link 
                        key={item.page} 
                        to={createPageUrl(item.page)} 
                        onClick={onClose}
                        className={`flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-semibold transition-all border ${
                          isActive 
                            ? "bg-[#0f2347] text-white border-transparent shadow-md" 
                            : "bg-white text-slate-700 hover:bg-slate-50 border-slate-100"
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          isActive ? "bg-white/20" : c.icon
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="truncate">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}