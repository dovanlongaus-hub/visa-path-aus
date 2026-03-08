import { Link } from "react-router-dom";
import { ArrowRight, Bot, FileText, Map, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createPageUrl } from "@/utils";

const QUICK_ACTIONS = [
  { icon: Bot, label: "Tư Vấn AI", page: "Chat", color: "bg-emerald-50 text-emerald-700" },
  { icon: Map, label: "Lộ Trình", page: "Roadmap", color: "bg-blue-50 text-blue-700" },
  { icon: FileText, label: "Upload CV", page: "CVUpload", color: "bg-purple-50 text-purple-700" },
];

export default function DashboardSummary({ user }) {
  const name = user?.full_name || user?.email?.split("@")[0] || "Bạn";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Xin chào,</p>
          <h3 className="text-xl font-bold text-gray-900">{name} 👋</h3>
        </div>
        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
          Đang hoạt động
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {QUICK_ACTIONS.map(({ icon: Icon, label, page, color }) => (
          <Link key={page} to={createPageUrl(page)}>
            <div className={`rounded-xl p-3 flex flex-col items-center gap-2 hover:opacity-80 transition-opacity ${color}`}>
              <Icon className="h-5 w-5" />
              <span className="text-xs font-semibold text-center">{label}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
        <CheckCircle2 className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700">Bước tiếp theo của bạn</p>
          <p className="text-xs text-gray-500 mt-1">
            Hoàn thiện hồ sơ để nhận phân tích lộ trình cá nhân hoá từ AI.
          </p>
        </div>
        <Link to={createPageUrl("Profile")}>
          <Button size="sm" variant="ghost" className="text-gray-600 hover:text-gray-900 p-1">
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}