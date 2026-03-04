import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";
import { ArrowRight, FileText, Map, MessageCircle, CheckSquare, Upload, Star } from "lucide-react";
import PathwayCards from "../components/home/PathwayCards";
import NewsWidget from "../components/home/NewsWidget";
import SmartAlerts from "../components/home/SmartAlerts";

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
      color: "from-blue-500 to-blue-600",
      link: createPageUrl("Roadmap"),
      img: "https://images.unsplash.com/photo-1524820197278-540916411003?w=600&q=80",
      imgAlt: "Sydney Harbour Bridge aerial view",
      tag: "Bản đồ hành trình",
    },
    {
      icon: CheckSquare,
      title: "Checklist điều kiện",
      desc: "Danh sách điều kiện cụ thể cho từng giai đoạn visa và di trú",
      color: "from-emerald-500 to-emerald-600",
      link: createPageUrl("Checklist"),
      img: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&q=80",
      imgAlt: "Checklist planning notebook",
      tag: "Tiến trình",
    },
    {
      icon: FileText,
      title: "Biểu mẫu di trú",
      desc: "Các form chuẩn của Lãnh sự quán Úc, tự động điền từ hồ sơ của bạn",
      color: "from-violet-500 to-violet-600",
      link: createPageUrl("Forms"),
      img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80",
      imgAlt: "Official documents and forms",
      tag: "Tài liệu",
    },
    {
      icon: MessageCircle,
      title: "Hỏi đáp AI",
      desc: "Tư vấn trực tuyến 24/7 về luật di trú, visa và các thủ tục liên quan",
      color: "from-amber-500 to-amber-600",
      link: createPageUrl("Chat"),
      img: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80",
      imgAlt: "AI chat assistant interface",
      tag: "24/7 Trực tuyến",
    },
    {
      icon: Upload,
      title: "Upload CV & Điền form",
      desc: "Tải CV lên để AI tự động điền các biểu mẫu di trú cho bạn",
      color: "from-rose-500 to-rose-600",
      link: createPageUrl("CVUpload"),
      img: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&q=80",
      imgAlt: "Resume and CV documents",
      tag: "AI Tự động",
    },
    {
      icon: Star,
      title: "Hồ sơ cá nhân",
      desc: "Quản lý thông tin cá nhân, visa, điểm EOI và tiến trình di trú",
      color: "from-sky-500 to-sky-600",
      link: createPageUrl("Profile"),
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
      imgAlt: "Personal profile portrait",
      tag: "Hồ sơ",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      {/* Hero */}
      <section className="relative overflow-hidden text-white" style={{minHeight: "560px"}}>
        {/* Background image – Sydney Opera House */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80"
            alt="Australia"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628]/90 via-[#0f2347]/80 to-[#1a3a6e]/70" />
        </div>

        {/* Floating image strips */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 hidden lg:flex flex-col gap-1 overflow-hidden opacity-30">
          <img src="https://images.unsplash.com/photo-1529108190281-9a4f620bc2d8?w=400&q=60" alt="" className="h-1/3 w-full object-cover" />
          <img src="https://images.unsplash.com/photo-1574068468668-a05a11f871da?w=400&q=60" alt="" className="h-1/3 w-full object-cover" />
          <img src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?w=400&q=60" alt="" className="h-1/3 w-full object-cover" />
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

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { num: "6+", label: "Loại visa được hỗ trợ" },
            { num: "50+", label: "Biểu mẫu di trú" },
            { num: "24/7", label: "Tư vấn AI" },
            { num: "100%", label: "Miễn phí sử dụng" },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-[#0f2347]">{s.num}</div>
              <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Smart Alerts */}
      <section className="max-w-5xl mx-auto px-6 pt-8 pb-4">
        <SmartAlerts />
      </section>

      {/* Pathway Cards */}
      <section className="max-w-5xl mx-auto px-6 pb-10">
        <PathwayCards />
      </section>

      {/* News */}
      <section className="max-w-5xl mx-auto px-6 pb-12">
        <NewsWidget />
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
                className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-[#0a1628] text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                <div className="flex items-center gap-1 mt-4 text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Khám phá <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}