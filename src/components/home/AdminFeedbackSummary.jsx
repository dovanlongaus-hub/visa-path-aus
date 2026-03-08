import { Link } from "react-router-dom";
import { MessageSquare, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";

const MOCK_STATS = { total: 42, pending: 7, approved: 35 };

export default function AdminFeedbackSummary() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Phản Hồi Người Dùng</h3>
          <Badge className="bg-amber-50 text-amber-700 border-amber-200">Admin</Badge>
        </div>
        <Link to={createPageUrl("AdminFeedback")}>
          <Button size="sm" variant="ghost" className="text-gray-500">
            Xem tất cả <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Tổng phản hồi", value: MOCK_STATS.total, Icon: MessageSquare, color: "text-blue-600 bg-blue-50" },
          { label: "Chờ xét duyệt", value: MOCK_STATS.pending, Icon: Clock, color: "text-amber-600 bg-amber-50" },
          { label: "Đã duyệt", value: MOCK_STATS.approved, Icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
        ].map(({ label, value, Icon, color }) => (
          <div key={label} className={`rounded-xl p-3 flex flex-col items-center gap-1 ${color}`}>
            <Icon className="h-4 w-4" />
            <span className="text-xl font-bold">{value}</span>
            <span className="text-xs text-center opacity-80">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}