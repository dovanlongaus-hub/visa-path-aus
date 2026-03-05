import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowRight, UserCircle, Upload, Bot, Map, CheckCircle2, Sparkles } from "lucide-react";

const steps = [
  {
    step: 1,
    icon: UserCircle,
    color: "from-blue-500 to-blue-600",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    title: "Tạo hồ sơ cá nhân",
    desc: "Điền thông tin visa hiện tại, bằng cấp, điểm tiếng Anh để AI tư vấn chính xác hơn.",
    link: createPageUrl("Profile"),
    linkLabel: "Điền ngay →",
    tip: "Chỉ mất ~3 phút"
  },
  {
    step: 2,
    icon: Upload,
    color: "from-violet-500 to-violet-600",
    bg: "bg-violet-50",
    text: "text-violet-700",
    border: "border-violet-200",
    title: "Upload CV của bạn",
    desc: "AI tự động trích xuất kinh nghiệm, kỹ năng và gợi ý visa pathway phù hợp nhất.",
    link: createPageUrl("CVUpload"),
    linkLabel: "Upload CV →",
    tip: "Hỗ trợ PDF, DOCX"
  },
  {
    step: 3,
    icon: Bot,
    color: "from-amber-500 to-amber-600",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    title: "Hỏi tư vấn AI 24/7",
    desc: "Đặt bất kỳ câu hỏi về visa, điểm EOI, skills assessment, tiểu bang bảo lãnh…",
    link: createPageUrl("Chat"),
    linkLabel: "Hỏi ngay →",
    tip: "Không giới hạn câu hỏi"
  },
  {
    step: 4,
    icon: Map,
    color: "from-emerald-500 to-emerald-600",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    title: "Theo dõi lộ trình PR",
    desc: "Xem checklist từng giai đoạn và theo dõi tiến trình từ visa sinh viên đến Thường Trú Nhân.",
    link: createPageUrl("Roadmap"),
    linkLabel: "Xem lộ trình →",
    tip: "6 giai đoạn chi tiết"
  },
];

const tips = [
  { emoji: "🎯", title: "Điểm EOI tối thiểu 65", desc: "Cần ít nhất 65 điểm để nộp hồ sơ EOI. Tuổi 25-32 cho 30 điểm, IELTS 8.0+ cho 20 điểm." },
  { emoji: "⏱️", title: "Visa 485 chỉ có 1 lần", desc: "Visa tốt nghiệp 485 chỉ được cấp một lần duy nhất. Hãy chuẩn bị Skills Assessment sớm nhất." },
  { emoji: "🗺️", title: "Regional tăng 15 điểm", desc: "Học và làm việc ở vùng regional (491) cho thêm 15 điểm EOI – cơ hội PR cao hơn rất nhiều." },
  { emoji: "📋", title: "Skills Assessment mất 2-4 tháng", desc: "Nộp skills assessment càng sớm càng tốt. Engineers Australia, ACS, VETASSESS… mỗi loại khác nhau." },
  { emoji: "🏆", title: "EOI không phải application", desc: "EOI là 'thể hiện quan tâm', không phải nộp visa thật. Không có phí và không ảnh hưởng nếu thất bại." },
  { emoji: "🤝", title: "Bảo lãnh tiểu bang 190", desc: "Mỗi tiểu bang có danh sách nghề khác nhau. NSW, VIC, QLD, SA đang mở nhiều ngành cho người Việt." },
];

export default function GuestOnboarding() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-12">

      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-[#0f2347] to-[#1a3a6e] rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <span className="text-sm font-bold text-yellow-300 uppercase tracking-wider">Chào mừng bạn mới!</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black mb-3">Bắt đầu hành trình PR Úc của bạn</h2>
          <p className="text-blue-200 text-base mb-6 max-w-xl">
            Nền tảng hoàn toàn miễn phí. Không cần đăng ký để sử dụng. Làm theo 4 bước dưới đây để nhận tư vấn cá nhân hóa tốt nhất.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to={createPageUrl("Chat")} className="inline-flex items-center gap-2 bg-white text-[#0f2347] font-bold px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-all shadow-md text-sm">
              <Bot className="w-4 h-4" /> Hỏi AI ngay
            </Link>
            <Link to={createPageUrl("Profile")} className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-white/20 transition-all text-sm">
              Tạo hồ sơ <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* 4-Step Guide */}
      <div>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#0a1628] mb-2">Bắt đầu trong 4 bước đơn giản</h2>
          <p className="text-gray-500">Làm từng bước để nhận tư vấn chính xác và cá nhân hóa hơn</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.step} className={`bg-white rounded-2xl border ${s.border} p-5 shadow-sm hover:shadow-md transition-all relative`}>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-4 shadow-sm`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className={`absolute top-4 right-4 w-7 h-7 ${s.bg} rounded-full flex items-center justify-center`}>
                  <span className={`text-xs font-black ${s.text}`}>{s.step}</span>
                </div>
                <h3 className="font-bold text-[#0a1628] text-sm mb-2">{s.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed mb-3">{s.desc}</p>
                <div className="flex items-center justify-between">
                  <Link to={s.link} className={`text-xs font-bold ${s.text} hover:underline`}>{s.linkLabel}</Link>
                  <span className={`text-[10px] ${s.bg} ${s.text} px-2 py-0.5 rounded-full font-medium`}>{s.tip}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key Tips */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
            <span className="text-amber-600 text-lg">💡</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#0a1628]">6 điều cần biết ngay</h2>
            <p className="text-gray-400 text-sm">Thông tin đắt giá giúp bạn tránh sai lầm tốn kém</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tips.map((t, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{t.emoji}</span>
                <div>
                  <div className="font-bold text-[#0a1628] text-sm mb-1">{t.title}</div>
                  <p className="text-gray-500 text-xs leading-relaxed">{t.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Login */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-8 h-8 text-blue-500 flex-shrink-0" />
          <div>
            <div className="font-bold text-[#0a1628]">Đăng ký miễn phí để lưu tiến trình</div>
            <p className="text-sm text-gray-500">Lưu checklist, lịch sử chat AI, bookmark bài viết và nhận thông báo visa</p>
          </div>
        </div>
        <button
          onClick={() => { const { base44: b } = require("@/api/base44Client"); b.auth.redirectToLogin(window.location.pathname); }}
          className="flex-shrink-0 bg-[#0f2347] text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#1a3a6e] transition-colors whitespace-nowrap"
        >
          Đăng ký miễn phí →
        </button>
      </div>

    </div>
  );
}