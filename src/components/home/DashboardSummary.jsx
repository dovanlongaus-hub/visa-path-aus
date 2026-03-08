import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Bot, FileText, Map, CheckCircle2, TrendingUp, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createPageUrl } from "@/utils";
import { UserProfile } from "@/api/entities";

const QUICK_ACTIONS = [
  { icon: Bot, label: "Tư Vấn AI", page: "Chat", color: "bg-emerald-50 text-emerald-700" },
  { icon: Map, label: "Lộ Trình", page: "Roadmap", color: "bg-blue-50 text-blue-700" },
  { icon: FileText, label: "Upload CV", page: "CVUpload", color: "bg-purple-50 text-purple-700" },
];

export default function DashboardSummary({ user }) {
  const name = user?.full_name || user?.email?.split("@")[0] || "Bạn";
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!user?.id) return;
    UserProfile.filter({ user_id: user.id })
      .then((rows) => { if (rows?.length) setProfile(rows[0]); })
      .catch(() => {});
  }, [user?.id]);

  // Determine next step from profile completeness
  const getNextStep = () => {
    if (!profile) return { text: "Hoàn thiện hồ sơ để nhận phân tích lộ trình cá nhân hoá từ AI.", page: "Profile" };
    if (!profile.occupation) return { text: "Thêm nghề nghiệp & mã ANZSCO để nhận tư vấn visa phù hợp.", page: "Profile" };
    if (!profile.target_visa) return { text: "Chọn visa mục tiêu trong hồ sơ để AI tạo lộ trình chi tiết.", page: "Profile" };
    if (!profile.ielts_overall) return { text: "Cập nhật điểm IELTS/PTE để tính điểm EOI chính xác.", page: "Profile" };
    return { text: `Bạn đang hướng tới ${profile.target_visa}. Xem lộ trình chi tiết của bạn.`, page: "Roadmap" };
  };

  const nextStep = getNextStep();
  const eoiEstimate = profile ? (() => {
    let pts = 0;
    const age = parseInt(profile.age);
    if (age >= 25 && age <= 32) pts += 30;
    else if (age >= 18 && age <= 24) pts += 25;
    else if (age >= 33 && age <= 39) pts += 25;
    else if (age >= 40 && age <= 44) pts += 15;
    pts += parseInt(profile.english_points || 0);
    pts += parseInt(profile.education_points || 0);
    pts += parseInt(profile.aus_work_years_points || 0);
    if (profile.regional_study) pts += 5;
    if (profile.naati) pts += 5;
    return pts;
  })() : null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Xin chào,</p>
          <h3 className="text-xl font-bold text-gray-900">{name} 👋</h3>
        </div>
        <div className="flex items-center gap-2">
          {eoiEstimate !== null && (
            <Badge className="bg-blue-50 text-blue-700 border-blue-200">
              EOI ~{eoiEstimate} điểm
            </Badge>
          )}
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
            Đang hoạt động
          </Badge>
        </div>
      </div>

      {/* Profile summary pills */}
      {profile && (profile.target_visa || profile.occupation) && (
        <div className="flex flex-wrap gap-2">
          {profile.target_visa && (
            <span className="text-xs bg-gray-100 text-gray-700 rounded-full px-3 py-1 font-medium">
              🎯 {profile.target_visa}
            </span>
          )}
          {profile.occupation && (
            <span className="text-xs bg-gray-100 text-gray-700 rounded-full px-3 py-1 font-medium">
              💼 {profile.occupation}
            </span>
          )}
          {profile.current_visa && (
            <span className="text-xs bg-gray-100 text-gray-700 rounded-full px-3 py-1 font-medium">
              🛂 {profile.current_visa}
            </span>
          )}
        </div>
      )}

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
          <p className="text-xs text-gray-500 mt-1">{nextStep.text}</p>
        </div>
        <Link to={createPageUrl(nextStep.page)}>
          <Button size="sm" variant="ghost" className="text-gray-600 hover:text-gray-900 p-1">
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}