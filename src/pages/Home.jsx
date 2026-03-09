import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";
import { ArrowRight, FileText, Map, MessageCircle, CheckSquare, Upload, Star, Sparkles, FileUp, Newspaper, ExternalLink } from "lucide-react";
import PathwayCards from "../components/home/PathwayCards";
import AINewsWidget from "../components/home/AINewsWidget";
import OpenClawImmigrationCharts from "../components/home/OpenClawImmigrationCharts";
import SmartAlerts from "../components/home/SmartAlerts";
import DashboardSummary from "../components/home/DashboardSummary";
import RecommendedContent from "../components/home/RecommendedContent";
import AdminFeedbackSummary from "../components/home/AdminFeedbackSummary";
import GuestOnboarding from "../components/home/GuestOnboarding";

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const features = [
    {
      icon: Map,
      title: "Lộ trình PR",
      desc: "Hành trình từng bước từ visa sinh viên đến Thường trú nhân tại Úc",
      color: "from-[#1c4b82] to-[#163a63]",
      link: createPageUrl("Roadmap"),
      img: "https://images.unsplash.com/photo-1524820197278-540916411003?w=600&q=80",
      imgAlt: "Sydney Harbour Bridge aerial view",
      tag: "Bản đồ hành trình",
    },
    {
      icon: CheckSquare,
      title: "Checklist điều kiện",
      desc: "Danh sách điều kiện cụ thể cho từng giai đoạn visa và di trú",
      color: "from-[#2f6b4a] to-[#26563c]",
      link: createPageUrl("Checklist"),
      img: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&q=80",
      imgAlt: "Checklist planning notebook",
      tag: "Tiến trình",
    },
    {
      icon: FileText,
      title: "Biểu mẫu di trú",
      desc: "Các form chuẩn của Lãnh sự quán Úc, tự động điền từ hồ sơ của bạn",
      color: "from-[#0f6b6f] to-[#0f5458]",
      link: createPageUrl("Forms"),
      img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80",
      imgAlt: "Official documents and forms",
      tag: "Tài liệu",
    },
    {
      icon: MessageCircle,
      title: "Hỏi đáp AI",
      desc: "Tư vấn trực tuyến 24/7 về luật di trú, visa và các thủ tục liên quan",
      color: "from-[#7a5f40] to-[#654e36]",
      link: createPageUrl("Chat"),
      img: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80",
      imgAlt: "AI chat assistant interface",
      tag: "24/7 Trực tuyến",
    },
    {
      icon: Upload,
      title: "Upload CV & Điền form",
      desc: "Tải CV lên để AI tự động điền các biểu mẫu di trú cho bạn",
      color: "from-[#1f5f73] to-[#184a5a]",
      link: createPageUrl("CVUpload"),
      img: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&q=80",
      imgAlt: "Resume and CV documents",
      tag: "AI Tự động",
    },
    {
      icon: Star,
      title: "Hồ sơ cá nhân",
      desc: "Quản lý thông tin cá nhân, visa, điểm EOI và tiến trình di trú",
      color: "from-[#325a88] to-[#254466]",
      link: createPageUrl("Profile"),
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
      imgAlt: "Personal profile portrait",
      tag: "Hồ sơ",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      {/* Hero */}
      <section className="relative overflow-hidden text-white" style={{minHeight: "580px"}}>
        {/* Background image – Sydney Opera House at golden hour */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1800&q=85"
            alt="Australia"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050e1f]/95 via-[#0f2347]/85 to-[#0f2347]/40" />
        </div>

        {/* Floating image mosaic – right side */}
        <div className="absolute right-0 top-0 bottom-0 w-[38%] hidden lg:grid grid-rows-3 gap-0.5 overflow-hidden">
          <div className="relative overflow-hidden">
            <img src="https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?w=500&q=75" alt="Melbourne CBD" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-[#0f2347]/40" />
          </div>
          <div className="relative overflow-hidden">
            <img src="https://images.unsplash.com/photo-1545158535-c3f7168c28b6?w=500&q=75" alt="Sydney Opera House close-up" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-[#0f2347]/30" />
          </div>
          <div className="relative overflow-hidden">
            <img src="https://images.unsplash.com/photo-1529108190281-9a4f620bc2d8?w=500&q=75" alt="Australia landmark" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-[#0f2347]/40" />
          </div>
        </div>

        <div className="relative max-w-5xl mx-auto px-6 py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm mb-8">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              Nền tảng tư vấn di trú Úc số 1 cho người Việt
            </div>
            <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4">
              Con đường đến
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-violet-300 mt-1">
                Thường Trú Nhân Úc 🦘
              </span>
            </h1>
            <p className="text-lg text-blue-100 mb-8 leading-relaxed">
              Hướng dẫn chi tiết từng bước từ visa sinh viên → Visa 485 → PR 189/190/491. Biểu mẫu tự động, EOI & CV AI, tư vấn 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Link
                to={createPageUrl("Roadmap")}
                className="inline-flex items-center gap-2 bg-white text-[#0f2347] font-bold px-7 py-3.5 rounded-2xl hover:bg-blue-50 transition-all shadow-lg hover:-translate-y-0.5"
              >
                Xem lộ trình PR <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to={createPageUrl("Chat")}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold px-7 py-3.5 rounded-2xl hover:bg-white/20 transition-all"
              >
                <MessageCircle className="w-5 h-5" /> Hỏi tư vấn AI
              </Link>
            </div>

            {/* Benefits chips */}
            <div className="flex flex-wrap gap-2">
              {[
                "🎓 Bằng cấp được công nhận quốc tế",
                "💰 Lương trung bình AUD 85,000+/năm",
                "🏥 Medicare & phúc lợi xã hội",
                "🌏 Môi trường đa văn hóa",
                "🏠 Chất lượng sống top 5 thế giới",
                "👨‍👩‍👧 Gia đình được bảo lãnh PR",
              ].map((b, i) => (
                <span key={i} className="bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs px-3 py-1.5 rounded-full font-medium">
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Headline: Latest updates from Australian Home Affairs */}
      <section className="max-w-5xl mx-auto px-6 pt-6">
        <div className="rounded-2xl border border-[#c8d9ea] bg-gradient-to-r from-[#eaf1f8] via-[#f4f8fc] to-[#edf4fb] px-4 py-3 md:px-5 md:py-3.5 shadow-sm">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[#d9e7f5] text-[#123a67]">
                <Newspaper className="h-4 w-4" />
              </div>
              <p className="text-sm md:text-[15px] font-semibold text-[#102f52] leading-relaxed">
                Tin mới nhất từ Bộ Di trú Úc (Home Affairs): chính sách visa và lệ phí có thể thay đổi theo từng đợt công bố. Vui lòng theo dõi mục Tin tức để cập nhật kịp thời.
              </p>
            </div>
            <a
              href="https://immi.homeaffairs.gov.au/news-media/archive"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs md:text-sm font-semibold text-[#174a7e] hover:text-[#123a67]"
            >
              Xem thông báo chính thức <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {[
            { num: "6+", label: "Loại visa được hỗ trợ", emoji: "🛂", bg: "from-[#eaf1f8] to-[#edf4fb]", border: "border-[#c8d9ea]" },
            { num: "50+", label: "Biểu mẫu di trú", emoji: "📋", bg: "from-[#e8f4f4] to-[#eff7f7]", border: "border-[#c7e3e4]" },
            { num: "24/7", label: "Tư vấn AI", emoji: "🤖", bg: "from-[#f6f1ea] to-[#faf6f1]", border: "border-[#e7dccf]" },
            { num: "100%", label: "Miễn phí cơ bản", emoji: "✨", bg: "from-[#edf4ef] to-[#f3f8f4]", border: "border-[#cfe1d3]" },
          ].map((s, i) => (
            <div key={i} className={`bg-gradient-to-br ${s.bg} rounded-2xl p-5 text-center border ${s.border} shadow-sm`}>
              <div className="text-2xl mb-1">{s.emoji}</div>
              <div className="text-3xl font-black text-[#0f2347]">{s.num}</div>
              <div className="text-xs text-gray-500 mt-1 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Admin Feedback Summary – Only for admin */}
      <AdminFeedbackSummary />

      {/* Guest Onboarding – shown to non-logged-in users */}
      {!user && <GuestOnboarding />}

      {/* Dashboard Summary – Only for logged in users */}
      {user && (
        <section className="max-w-5xl mx-auto px-6 py-12">
          <DashboardSummary />
        </section>
      )}

      {/* Smart Alerts */}
      {user && (
        <section className="max-w-5xl mx-auto px-6 pt-0 pb-4">
          <SmartAlerts />
        </section>
      )}

      {/* Recommended Content – Only for logged in users */}
      {user && (
        <section className="max-w-5xl mx-auto px-6 py-12">
          <RecommendedContent />
        </section>
      )}

      {/* Upload CV & Get Advice */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 rounded-3xl border-2 border-blue-100 p-8 md:p-10 shadow-lg">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left: Content */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <FileUp className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Bước tiếp theo</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-[#0a1628] mb-4 leading-tight">
                Upload CV và nhận tư vấn chuyên sâu
              </h2>
              <p className="text-gray-600 text-base leading-relaxed mb-2">
                AI sẽ phân tích CV của bạn, trích xuất thông tin, và đề xuất điều chỉnh phù hợp nhất cho từng visa pathway. Tạo CV chuyên nghiệp tối ưu hóa cho di trú Úc.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                ✅ Tự động trích xuất dữ liệu • ✅ Gợi ý cải thiện • ✅ Tạo CV chuyên sâu
              </p>
              <Link
                to={createPageUrl("CVUpload")}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-7 py-3.5 rounded-2xl hover:shadow-xl hover:-translate-y-0.5 transition-all shadow-lg"
              >
                <Sparkles className="w-5 h-5" /> Tải CV lên ngay
              </Link>
            </div>
            {/* Right: Visual */}
            <div className="relative hidden md:flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&q=85"
                alt="CV and resume documents"
                className="rounded-2xl shadow-lg w-full max-w-sm object-cover h-72"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent rounded-2xl" />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm border border-white/50 rounded-xl px-4 py-2 shadow-md flex items-center gap-2">
                <span className="text-xs font-bold text-blue-700">⚡ AI Tự động phân tích</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pathway Cards */}
      <section className="max-w-5xl mx-auto px-6 pb-10">
        <PathwayCards />
      </section>

      {/* News */}
      <section className="max-w-5xl mx-auto px-6 pb-12">
        <AINewsWidget />
      </section>

      {/* OpenClaw AI Charts */}
      <section className="max-w-5xl mx-auto px-6 pb-12">
        <OpenClawImmigrationCharts />
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#0a1628] mb-4">Tất cả công cụ bạn cần</h2>
          <p className="text-gray-500 text-lg">Từ thông tin đến biểu mẫu, mọi thứ trong một nơi</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <Link
                key={i}
                to={f.link}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
              >
                {/* Card image */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={f.img}
                    alt={f.imgAlt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-50 group-hover:opacity-40 transition-opacity`} />
                  {/* Tag pill */}
                  <span className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
                    {f.tag}
                  </span>
                  {/* Icon badge */}
                  <div className={`absolute bottom-3 right-3 w-10 h-10 rounded-xl bg-gradient-to-br ${f.color} shadow-lg flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                {/* Card body */}
                <div className="p-5">
                  <h3 className="font-bold text-[#0a1628] text-base mb-1.5">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                  <div className="flex items-center gap-1 mt-3 text-blue-600 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    Khám phá <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}