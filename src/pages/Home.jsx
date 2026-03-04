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
    },
    {
      icon: CheckSquare,
      title: "Checklist điều kiện",
      desc: "Danh sách điều kiện cụ thể cho từng giai đoạn visa và di trú",
      color: "from-emerald-500 to-emerald-600",
      link: createPageUrl("Checklist"),
    },
    {
      icon: FileText,
      title: "Biểu mẫu di trú",
      desc: "Các form chuẩn của Lãnh sự quán Úc, tự động điền từ hồ sơ của bạn",
      color: "from-violet-500 to-violet-600",
      link: createPageUrl("Forms"),
    },
    {
      icon: MessageCircle,
      title: "Hỏi đáp AI",
      desc: "Tư vấn trực tuyến 24/7 về luật di trú, visa và các thủ tục liên quan",
      color: "from-amber-500 to-amber-600",
      link: createPageUrl("Chat"),
    },
    {
      icon: Upload,
      title: "Upload CV & Điền form",
      desc: "Tải CV lên để AI tự động điền các biểu mẫu di trú cho bạn",
      color: "from-rose-500 to-rose-600",
      link: createPageUrl("CVUpload"),
    },
    {
      icon: Star,
      title: "Hồ sơ cá nhân",
      desc: "Quản lý thông tin cá nhân, visa, điểm EOI và tiến trình di trú",
      color: "from-sky-500 to-sky-600",
      link: createPageUrl("Profile"),
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0a1628] via-[#0f2347] to-[#1a3a6e] text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm mb-8">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            Nền tảng tư vấn di trú Úc số 1 cho sinh viên
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Con đường đến
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300 mt-2">
              Thường Trú Nhân Úc
            </span>
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            Hướng dẫn chi tiết từng bước từ visa sinh viên (500) đến PR, với checklist điều kiện, biểu mẫu tự động và tư vấn AI 24/7.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={createPageUrl("Roadmap")}
              className="inline-flex items-center gap-2 bg-white text-[#0f2347] font-semibold px-8 py-4 rounded-2xl hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Xem lộ trình PR <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to={createPageUrl("Chat")}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white/20 transition-all"
            >
              <MessageCircle className="w-5 h-5" /> Hỏi tư vấn AI
            </Link>
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