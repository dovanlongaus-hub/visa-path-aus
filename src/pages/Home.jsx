import { useState, useEffect } from "react";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";
import { ArrowRight, FileText, Map, MessageCircle, CheckSquare, Upload, Star, Sparkles, FileUp, Newspaper, ExternalLink, Calculator, Shield, Clock, Users, Mail, Check, ChevronDown, Quote } from "lucide-react";
import PathwayCards from "../components/home/PathwayCards";
import AINewsWidget from "../components/home/AINewsWidget";
import OpenClawImmigrationCharts from "../components/home/OpenClawImmigrationCharts";
import SmartAlerts from "../components/home/SmartAlerts";
import DashboardSummary from "../components/home/DashboardSummary";
import RecommendedContent from "../components/home/RecommendedContent";
import AdminFeedbackSummary from "../components/home/AdminFeedbackSummary";
import GuestOnboarding from "../components/home/GuestOnboarding";
import { auth } from '@/api/supabaseClient';

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    auth.me().then(setUser).catch(() => {});
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
        {/* Background image */}
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
              Nền tảng tư vấn di trú Úc cho người Việt
            </div>
            <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4">
              Hành trình đến
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-violet-300 mt-1">
                Thường Trú Nhân Úc
              </span>
            </h1>
            <p className="text-lg text-blue-100 mb-8 leading-relaxed">
              Lộ trình PR chi tiết, tính điểm EOI chính xác, tư vấn AI 24/7, biểu mẫu tự động. Tất cả trong một nền tảng duy nhất.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Link
                to={createPageUrl("Roadmap")}
                className="inline-flex items-center gap-2 bg-white text-[#0f2347] font-bold px-7 py-3.5 rounded-2xl hover:bg-blue-50 transition-all shadow-lg hover:-translate-y-0.5"
              >
                Xem lộ trình PR <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to={createPageUrl("EOICalculator")}
                className="inline-flex items-center gap-2 bg-emerald-500 text-white font-bold px-7 py-3.5 rounded-2xl hover:bg-emerald-600 transition-all shadow-lg hover:-translate-y-0.5"
              >
                <Calculator className="w-5 h-5" /> Tính điểm EOI
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
                "Lương trung bình AUD 85,000+/năm",
                "Medicare & phúc lợi xã hội",
                "Chất lượng sống top 5 thế giới",
                "Gia đình được bảo lãnh PR",
              ].map((b, i) => (
                <span key={i} className="bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs px-3 py-1.5 rounded-full font-medium">
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="max-w-5xl mx-auto px-6 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Map, title: "Lộ trình PR", desc: "Từng bước từ visa sinh viên đến PR", link: "Roadmap", gradient: "from-[#1c4b82] to-[#163a63]" },
            { icon: Calculator, title: "Tính điểm EOI", desc: "Tính chính xác theo Home Affairs", link: "EOICalculator", gradient: "from-emerald-600 to-emerald-700" },
            { icon: MessageCircle, title: "Tư vấn AI 24/7", desc: "Hỏi đáp luật di trú trực tuyến", link: "Chat", gradient: "from-violet-600 to-violet-700" },
            { icon: Shield, title: "Hồ sơ & Biểu mẫu", desc: "Form DIBP chính thức, tự động điền", link: "Forms", gradient: "from-[#0f6b6f] to-[#0f5458]" },
          ].map((f, i) => {
            const Icon = f.icon;
            return (
              <Link key={i} to={createPageUrl(f.link)}
                className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all group">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-[#0a1628] text-sm mb-1">{f.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
              </Link>
            );
          })}
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

      {/* Visa 189 Timeline Overview */}
      <section className="max-w-5xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#0a1628] mb-2">Lộ trình PR Visa 189</h2>
          <p className="text-gray-500">Quy trình từ đánh giá kỹ năng đến nhận visa</p>
        </div>
        <div className="relative">
          {/* Timeline connector line - desktop */}
          <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-emerald-200 to-violet-200" />
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { step: "1", title: "Skills Assessment", time: "2-4 tháng", icon: "📋", color: "from-blue-500 to-blue-600" },
              { step: "2", title: "Nộp EOI", time: "1-2 tuần", icon: "📝", color: "from-emerald-500 to-emerald-600" },
              { step: "3", title: "Nhận Invitation", time: "1-6 tháng", icon: "📩", color: "from-violet-500 to-violet-600" },
              { step: "4", title: "Nộp Visa", time: "4-8 tháng", icon: "📄", color: "from-amber-500 to-amber-600" },
              { step: "5", title: "Visa Granted", time: "—", icon: "🎉", color: "from-rose-500 to-rose-600" },
            ].map((s, i) => (
              <div key={i} className="relative text-center">
                <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center text-2xl shadow-lg mb-3 relative z-10`}>
                  {s.icon}
                </div>
                <h4 className="font-bold text-[#0a1628] text-sm mb-1">{s.title}</h4>
                <p className="text-xs text-gray-500">{s.time}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="text-center mt-6">
          <Link to={createPageUrl("VisaTimeline")} className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:underline text-sm">
            Xem chi tiết tiến trình <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Recent Invite Rounds */}
      <section className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#0a1628] text-lg">Điểm mời gần nhất (SkillSelect)</h3>
            <span className="text-xs text-gray-400">Cập nhật: Tháng 3/2026</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="pb-3 font-semibold">Đợt mời</th>
                  <th className="pb-3 text-center font-semibold">Visa 189</th>
                  <th className="pb-3 text-center font-semibold">Visa 190</th>
                  <th className="pb-3 text-center font-semibold">Visa 491</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { round: "Mar 2026", v189: 85, v190: 75, v491: 65 },
                  { round: "Feb 2026", v189: 90, v190: 80, v491: 70 },
                  { round: "Jan 2026", v189: 85, v190: 75, v491: 65 },
                  { round: "Dec 2025", v189: 90, v190: 80, v491: 65 },
                ].map((r, i) => (
                  <tr key={i} className="border-b border-gray-50 last:border-0">
                    <td className="py-3 text-gray-600 font-medium">{r.round}</td>
                    <td className="py-3 text-center"><span className="bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded-lg">{r.v189}</span></td>
                    <td className="py-3 text-center"><span className="bg-violet-50 text-violet-700 font-bold px-2.5 py-1 rounded-lg">{r.v190}</span></td>
                    <td className="py-3 text-center"><span className="bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-lg">{r.v491}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <p className="text-xs text-gray-400">Nguồn: SkillSelect Invitation Rounds (tham khảo)</p>
            <Link to={createPageUrl("EOICalculator")} className="inline-flex items-center gap-2 text-emerald-600 font-semibold text-sm hover:underline">
              <Calculator className="w-4 h-4" /> Tính điểm EOI của bạn
            </Link>
          </div>
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

      {/* Trust Banner */}
      <section className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                <Shield className="w-5 h-5 text-emerald-600" />
              </div>
              <h4 className="font-bold text-sm text-[#0a1628]">Thông tin chính thức</h4>
              <p className="text-xs text-gray-500">Dựa trên dữ liệu từ Home Affairs & SkillSelect</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <h4 className="font-bold text-sm text-[#0a1628]">Cập nhật liên tục</h4>
              <p className="text-xs text-gray-500">Chính sách visa mới nhất, điểm mời EOI theo đợt</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-violet-50 flex items-center justify-center">
                <Users className="w-5 h-5 text-violet-600" />
              </div>
              <h4 className="font-bold text-sm text-[#0a1628]">Cộng đồng người Việt</h4>
              <p className="text-xs text-gray-500">Nội dung tiếng Việt, phù hợp hoàn cảnh thực tế</p>
            </div>
          </div>
        </div>
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

      {/* Trust Counter */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="bg-gradient-to-br from-[#0f2347] to-[#1a4b9b] rounded-3xl p-8 md:p-12 text-white text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Được tin tưởng bởi hàng nghìn người Việt</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-4xl md:text-5xl font-black mb-2">2,500+</div>
              <div className="text-blue-200 text-sm">Người dùng đã đăng ký</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black mb-2">1,200+</div>
              <div className="text-blue-200 text-sm">Hồ sơ EOI nộp thành công</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black mb-2">850+</div>
              <div className="text-blue-200 text-sm">Visa được cấp</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black mb-2">4.8/5</div>
              <div className="text-blue-200 text-sm">Đánh giá từ người dùng</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#0a1628] mb-2">Câu chuyện thành công</h2>
          <p className="text-gray-500">Hành trình của người Việt tại Úc</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              name: "Nguyễn Thị Hương",
              role: "Software Engineer",
              visa: "Visa 189",
              avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
              quote: "Cảm ơn Úc Di Trú AI đã giúp mình hiểu rõ lộ trình từ visa 485 đến 189. Đặc biệt là tính điểm EOI rất chính xác!",
            },
            {
              name: "Trần Văn Minh",
              role: "Accountant",
              visa: "Visa 190",
              avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
              quote: "Mình apply visa 190 qua Victoria nhờ hướng dẫn chi tiết trên web. AI chat cũng trả lời rất nhanh và chính xác.",
            },
            {
              name: "Lê Thị Mai",
              role: "Nurse",
              visa: "Visa 491",
              avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
              quote: "Từ Úc Di Trú AI mình biết được mình cần làm skills assessment và apply state nomination. Giờ đã có PR rồi!",
            },
          ].map((testimonial, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
              <Quote className="w-8 h-8 text-blue-200 mb-3" />
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">"{testimonial.quote}"</p>
              <div className="flex items-center gap-3">
                <img src={testimonial.avatar} alt={testimonial.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <div className="font-bold text-[#0a1628] text-sm">{testimonial.name}</div>
                  <div className="text-xs text-gray-500">{testimonial.role} · {testimonial.visa}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-5xl mx-auto px-6 py-12 bg-white">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#0a1628] mb-2">Câu hỏi thường gặp</h2>
          <p className="text-gray-500">Giải đáp thắc mắc về di trú Úc</p>
        </div>
        <div className="max-w-3xl mx-auto space-y-4">
          {[
            {
              q: "Điểm EOI tối thiểu để nộp visa 189 là bao nhiêu?",
              a: "Điểm EOI tối thiểu là 65 điểm theo quy định của Bộ Nội vụ Úc. Tuy nhiên, để nhận được lời mời, bạn cần điểm cao hơn tùy theo ngành nghề và đợt mời. Thông thường các ngành hot cần 90-100 điểm.",
            },
            {
              q: "Skills Assessment là gì và mất bao lâu?",
              a: "Skills Assessment là quá trình đánh giá kỹ năng nghề nghiệp của bạn bởi các authorities được công nhận (Engineers Australia, ACS, VETASSESS, v.v.). Thời gian xử lý thường từ 2-4 tháng tùy ngành nghề và authority.",
            },
            {
              q: "Visa 189 và 190 khác nhau như thế nào?",
              a: "Visa 189 (Skilled Independent) không cần bảo lãnh, trong khi visa 190 (Skilled Nominated) cần được bảo lãnh bởi tiểu bang. Visa 190 có điểm EOI thấp hơn (cộng 5 điểm từ nomination) nhưng yêu cầu cư trú tại tiểu bang bảo lãnh 2 năm.",
            },
            {
              q: "Tôi cần bao nhiêu tiền để移民 Úc?",
              a: "Bạn cần chứng minh tài chính khoảng AUD 20,000-30,000 cho cá nhân (bao gồm chi phí di chuyển, sinh hoạt ban đầu). Phí visa 189 khoảng AUD 4,000-5,000. Ngoài ra cần tính chi phí Skills Assessment (AUD 500-1,500) và tiếng Anh (IELTS ~AUD 350).",
            },
            {
              q: "Có cần thuê agent di trú không?",
              a: "Không bắt buộc, nhưng nếu hồ sơ phức tạp (không có bằng đúng ngành, gia đình phức tạp), thuê MARA agent có thể giúp tăng tỷ lệ thành công. Phí agent thường từ AUD 3,000-8,000. Bạn có thể tự nộp nếu hồ sơ đơn giản và có thời gian nghiên cứu kỹ.",
            },
          ].map((faq, i) => (
            <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
              <details className="group">
                <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                  <span className="font-semibold text-[#0a1628] pr-4">{faq.q}</span>
                  <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0" />
                </summary>
                <div className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">
                  {faq.a}
                </div>
              </details>
            </div>
          ))}
        </div>
        <div className="text-center mt-6">
          <Link to={createPageUrl("FAQ")} className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:underline">
            Xem tất cả câu hỏi <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl border border-emerald-200 p-8 md:p-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Mail className="w-7 h-7 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#0a1628] mb-2">Nhận tin tức visa mới nhất</h2>
            <p className="text-gray-500 mb-6">Đăng ký nhận bản tin cập nhật chính sách visa, điểm EOI mới nhất và mẹo di trú Úc</p>
            <NewsletterForm />
          </div>
        </div>
      </section>
    </div>
  );
}

// Newsletter Signup Form Component
function NewsletterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success, error

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setStatus("loading");

    // Simulate API call - log to console
    setTimeout(() => {
      console.log("Newsletter signup:", { name, email, date: new Date().toISOString() });
      setStatus("success");
      setName("");
      setEmail("");
    }, 1000);
  };

  if (status === "success") {
    return (
      <div className="bg-white rounded-xl p-6 text-center">
        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Check className="w-6 h-6 text-emerald-600" />
        </div>
        <h3 className="font-bold text-[#0a1628] mb-1">Đăng ký thành công!</h3>
        <p className="text-sm text-gray-500">Cảm ơn bạn đã đăng ký. Chúng tôi sẽ gửi tin tức mới nhất vào email của bạn.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Tên của bạn"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          required
        />
        <input
          type="email"
          placeholder="Email của bạn"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          required
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-emerald-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "loading" ? "Đang đăng ký..." : "Đăng ký ngay"}
      </button>
      <p className="text-xs text-gray-400">Chúng tôi cam kết không gửi spam. Hủy đăng ký bất cứ lúc nào.</p>
    </form>
  );
}