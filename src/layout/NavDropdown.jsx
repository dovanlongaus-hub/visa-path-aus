import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { colorConfig } from "./NavConfig";

export default function NavDropdown({ group, currentPageName, onClose }) {
  const c = colorConfig[group.color];
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 z-50 nav-dropdown-enter">
      <div className="px-4 pb-2 mb-1 border-b border-gray-50">
        <div className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${c.badge}`}>
          {group.label}
        </div>
      </div>
      {group.items.map(item => {
        const Icon = item.icon;
        const isActive = currentPageName === item.page;
        return (
          <Link key={item.page} to={createPageUrl(item.page)} onClick={onClose}
            className={`flex items-center gap-3 mx-2 px-3 py-2.5 rounded-xl transition-colors ${isActive ? `${c.activeItem} font-medium` : "hover:bg-gray-50 text-gray-700"}`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isActive ? c.icon : "bg-gray-100 text-gray-500"}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium leading-tight">{item.label}</div>
              <div className="text-xs text-gray-400 truncate">{item.desc}</div>
            </div>
            {isActive && <div className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />}
          </Link>
        );
      })}
    </div>
  );
}