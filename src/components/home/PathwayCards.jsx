import { Link } from "react-router-dom";
import { ArrowRight, GraduationCap, Globe, Briefcase, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createPageUrl } from "@/utils";

const PATHWAYS = [
  {
    icon: GraduationCap,
    badge: null,
    title: "Con Đường Sinh Viên",
    visa: "Visa 500",
    desc: "Du học Úc rồi chuyển sang PR — lộ trình phổ biến nhất cho người trẻ.",
    steps: ["Nhập học trường được công nhận", "Hoàn thành khoá học", "Xin visa 485 sau tốt nghiệp", "Tích lũy kinh nghiệm → xin PR"],
    link: createPageUrl("Guide"),
    linkLabel: "Tìm Hiểu Thêm",
    highlight: false,
  },
  {
    icon: Globe,
    badge: "Ưu tiên 2024",
    title: "Global Talent",
    visa: "Visa 858",
    desc: "Dành cho chuyên gia hàng đầu trong các lĩnh vực công nghệ, nghiên cứu, kinh doanh.",
    steps: ["Nhận đề cử từ tổ chức được công nhận", "Nộp EOI trực tiếp", "Không cần Skills Assessment", "Xét duyệt nhanh — ưu tiên cao"],
    link: createPageUrl("Visa858"),
    linkLabel: "Xem Visa 858",
    highlight: true,
  },
  {
    icon: Briefcase,
    badge: null,
    title: "Employer Sponsored",
    visa: "Visa 482",
    desc: "Được nhà tuyển dụng Úc bảo lãnh — con đường thực tế và ổn định.",
    steps: ["Tìm nhà tuyển dụng Úc phù hợp", "Nhà tuyển dụng nộp hồ sơ sponsor", "Xin visa làm việc", "Đủ 2 năm → xin PR (186)"],
    link: createPageUrl("Visa482"),
    linkLabel: "Xem Visa 482",
    highlight: false,
  },
  {
    icon: UserCheck,
    badge: null,
    title: "Tư Vấn Cá Nhân",
    visa: "AI Advisor",
    desc: "Không chắc con đường nào phù hợp? Hãy để AI phân tích hồ sơ của bạn.",
    steps: ["Upload CV và điền hồ sơ", "AI phân tích điểm mạnh/yếu", "Nhận lộ trình cá nhân hoá", "Chat với AI cố vấn 24/7"],
    link: createPageUrl("Chat"),
    linkLabel: "Chat Với AI",
    highlight: false,
  },
];

export default function PathwayCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {PATHWAYS.map(({ icon: Icon, badge, title, visa, desc, steps, link, linkLabel, highlight }) => (
        <div
          key={visa}
          className={`rounded-2xl border p-6 flex flex-col transition-shadow hover:shadow-md ${
            highlight
              ? "bg-gray-950 border-gray-800 text-white"
              : "bg-white border-gray-100"
          }`}
        >
          <div className="flex items-start justify-between mb-4">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                highlight ? "bg-white/10" : "bg-gray-100"
              }`}
            >
              <Icon className={`h-5 w-5 ${highlight ? "text-white" : "text-gray-700"}`} />
            </div>
            {badge && (
              <Badge className={highlight ? "bg-white/10 text-white border-white/20" : "bg-gray-900 text-white"}>
                {badge}
              </Badge>
            )}
          </div>

          <div className="mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              {visa}
            </span>
          </div>
          <h3 className={`text-lg font-bold mb-2 ${highlight ? "text-white" : "text-gray-900"}`}>
            {title}
          </h3>
          <p className={`text-sm mb-5 leading-relaxed ${highlight ? "text-gray-300" : "text-gray-500"}`}>
            {desc}
          </p>

          <ul className="space-y-2 mb-6 flex-1">
            {steps.map((step, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="font-bold text-xs mt-0.5 flex-shrink-0 text-gray-400">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={highlight ? "text-gray-300" : "text-gray-600"}>{step}</span>
              </li>
            ))}
          </ul>

          <Link to={link}>
            <Button
              size="sm"
              className={`w-full ${
                highlight
                  ? "bg-white text-gray-900 hover:bg-gray-100"
                  : "bg-gray-900 text-white hover:bg-gray-800"
              }`}
            >
              {linkLabel} <ArrowRight className="ml-2 h-3 w-3" />
            </Button>
          </Link>
        </div>
      ))}
    </div>
  );
}