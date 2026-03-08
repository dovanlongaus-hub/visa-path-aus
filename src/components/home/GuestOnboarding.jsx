import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, FileText, BrainCircuit, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createPageUrl } from "@/utils";

const STEPS = [
  {
    icon: FileText,
    step: "01",
    title: "Tạo Hồ Sơ",
    desc: "Nhập thông tin học vấn, ngành nghề, kinh nghiệm và trình độ tiếng Anh của bạn.",
  },
  {
    icon: FileText,
    step: "02",
    title: "Upload CV",
    desc: "Tải lên CV của bạn để AI phân tích điểm mạnh/yếu và đề xuất cải thiện.",
  },
  {
    icon: BrainCircuit,
    step: "03",
    title: "AI Phân Tích",
    desc: "Hệ thống AI đánh giá hồ sơ, tính điểm EOI và xác định visa phù hợp nhất.",
  },
  {
    icon: Map,
    step: "04",
    title: "Nhận Lộ Trình",
    desc: "Xem lộ trình chi tiết từng bước cùng danh sách bang đang mở cửa cho ngành của bạn.",
  },
];

const TIPS = [
  {
    emoji: "🎯",
    title: "Điểm EOI quan trọng hơn bạn nghĩ",
    desc: "Điểm Biểu Thị Quan Tâm (EOI) quyết định thứ tự ưu tiên xét duyệt hồ sơ PR. Hãy tối ưu mọi yếu tố có thể.",
  },
  {
    emoji: "⏱️",
    title: "Visa 485 — cơ hội vàng sau tốt nghiệp",
    desc: "Tốt nghiệp tại Úc? Visa 485 cho phép bạn ở lại làm việc 2–6 năm, tích lũy kinh nghiệm để xin PR.",
  },
  {
    emoji: "🗺️",
    title: "Các bang vùng xa thưởng thêm 5 điểm",
    desc: "Định cư ở vùng regional (VIC/SA/WA/TAS...) tặng thêm 5–10 điểm EOI — lợi thế cực lớn cho visa 491/190.",
  },
];

export default function GuestOnboarding() {
  return (
    <div className="space-y-10">
      {/* Welcome Banner */}
      <div className="bg-gray-950 rounded-2xl p-8 md:p-10 text-white text-center">
        <Badge className="mb-4 bg-white/10 text-white border-white/20">
          Chào mừng bạn đến với Úc Di Trú AI
        </Badge>
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Bắt đầu hành trình định cư Úc của bạn
        </h2>
        <p className="text-gray-300 max-w-xl mx-auto mb-8 leading-relaxed">
          Chúng tôi hiểu rằng bạn đang đối mặt với một hệ thống luật di trú
          phức tạp và thay đổi liên tục. Hãy để chúng tôi giúp bạn{" "}
          <strong className="text-white">tìm ra con đường ngắn nhất và an toàn nhất</strong>{" "}
          để đạt được mục tiêu.
        </p>
        <Link to={createPageUrl("Profile")}>
          <Button
            size="lg"
            className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-8"
          >
            Tạo Hồ Sơ Ngay <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* 4-Step Guide */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
          Chỉ 4 bước để có lộ trình rõ ràng
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {STEPS.map(({ icon: Icon, step, title, desc }) => (
            <div
              key={step}
              className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">
                  {step}
                </span>
                <Icon className="h-4 w-4 text-gray-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Key Tips */}
      <div className="bg-gray-50 rounded-2xl p-6 md:p-8">
        <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-gray-700" />
          Những điều bạn cần biết ngay hôm nay
        </h3>
        <div className="space-y-4">
          {TIPS.map((tip, i) => (
            <div key={i} className="flex items-start gap-4 bg-white rounded-xl p-4 border border-gray-100">
              <span className="text-2xl">{tip.emoji}</span>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{tip.title}</p>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}