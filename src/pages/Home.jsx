import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Users, Shield, Zap, MapPin, BookOpen, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createPageUrl } from "@/utils";
import { User } from "@/api/entities";
import GuestOnboarding from "../components/home/GuestOnboarding";
import DashboardSummary from "../components/home/DashboardSummary";
import SmartAlerts from "../components/home/SmartAlerts";
import PathwayCards from "../components/home/PathwayCards";
import AINewsWidget from "../components/home/AINewsWidget";
import RecommendedContent from "../components/home/RecommendedContent";
import AdminFeedbackSummary from "../components/home/AdminFeedbackSummary";
import MagicMomentQuiz from "../components/home/MagicMomentQuiz";

export default function Home() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    User.me()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  const isAdmin = user?.email?.includes("admin") || user?.role === "admin";

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative bg-gray-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-950 to-black" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative max-w-5xl mx-auto px-4 py-20 md:py-32 text-center">
          <Badge className="mb-6 bg-white/10 text-white border-white/20 hover:bg-white/20">
            🇦🇺 Nền tảng di trú Úc #1 dành cho người Việt
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Lộ Trình Định Cư Úc
            <br />
            <span className="text-gray-300">Rõ Ràng &amp; Đáng Tin Cậy</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Nhập thông tin học vấn, kinh nghiệm và tiếng Anh — nhận ngay lộ trình
            visa chi tiết cùng danh sách các bang đang mở cửa cho ngành nghề của bạn.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link to={createPageUrl("Roadmap")}>
                <Button
                  size="lg"
                  className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-8"
                >
                  Xem Lộ Trình Của Tôi <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Link to={createPageUrl("Profile")}>
                <Button
                  size="lg"
                  className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-8"
                >
                  Bắt Đầu Miễn Phí <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}
            <Link to={createPageUrl("Guide")}>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-8"
              >
                Tìm Hiểu Thêm
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Magic Moment ──────────────────────────────────────── */}
      <section className="bg-gray-950 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <Badge className="mb-4 bg-white/10 text-white border-white/20">
            ✨ Khoảnh Khắc Kỳ Diệu
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Tương lai mù mờ bỗng trở nên rõ ràng
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            Nhập thông tin của bạn — chúng tôi sẽ cho bạn biết ngay lộ trình visa
            phù hợp nhất và các bang đang mở cửa cho ngành nghề của bạn.
          </p>
        </div>
        <MagicMomentQuiz user={user} />
      </section>

      {/* ── Guest Onboarding / Dashboard ──────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {!isLoading && (
          <>
            {!user ? (
              <GuestOnboarding />
            ) : (
              <div className="space-y-6">
                <SmartAlerts user={user} />
                <DashboardSummary user={user} />
                <RecommendedContent />
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Pathway Cards ─────────────────────────────────────── */}
      <section className="bg-gray-50 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Các Lộ Trình Phổ Biến
            </h2>
            <p className="text-gray-500 mt-2">Chọn con đường phù hợp với bạn</p>
          </div>
          <PathwayCards />
        </div>
      </section>

      {/* ── AI News ────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <AINewsWidget />
      </div>

      {/* ── CV Upload CTA ──────────────────────────────────────── */}
      <section className="bg-white py-12 px-4 border-y border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-4xl mb-4">📄</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Upload CV để nhận phân tích AI
          </h2>
          <p className="text-gray-600 mb-6">
            AI sẽ phân tích CV của bạn và đề xuất các cải tiến để tối ưu hoá cơ hội
            được chấp nhận visa.
          </p>
          <Link to={createPageUrl("CVUpload")}>
            <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white px-8">
              Upload CV Ngay <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────── */}
      <section className="bg-white py-12 px-4 border-b border-gray-100">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "6+", label: "Loại Visa", icon: "🛂" },
            { value: "50+", label: "Biểu Mẫu", icon: "📄" },
            { value: "24/7", label: "Tư Vấn AI", icon: "🤖" },
            { value: "100%", label: "Miễn Phí", icon: "✅" },
          ].map((stat, i) => (
            <div key={i} className="p-4">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Who & Why ─────────────────────────────────────────── */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <Badge className="mb-4 bg-gray-900 text-white">Dành Cho Ai?</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              App này dành cho bạn
            </h2>
          </div>

          <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-gray-100">
            <div className="flex items-start gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-lg md:text-xl text-gray-800 leading-relaxed">
                  App này dành cho những{" "}
                  <strong>người Việt trẻ có ước mơ định cư Úc</strong> nhưng đang bị
                  choáng ngợp bởi hàng trăm loại visa và những thay đổi luật liên tục
                  của Bộ Di trú.
                </p>
                <p className="text-gray-600 mt-4 leading-relaxed">
                  Họ cần một nơi tin cậy để biết chính xác{" "}
                  <strong>mình nên bắt đầu từ đâu</strong> — không phải đọc hàng trăm
                  trang luật, không phải tốn tiền tư vấn mà vẫn nhận được câu trả lời
                  mơ hồ.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  icon: "😓",
                  title: "Bối rối trước ma trận luật di trú?",
                  desc: "Hàng trăm loại visa, điểm EOI, Skills Assessment — không biết bắt đầu từ đâu.",
                },
                {
                  icon: "😰",
                  title: "Lo sợ bị từ chối visa?",
                  desc: "Thiếu thông tin chính xác, sợ nộp hồ sơ sai dẫn đến bị từ chối.",
                },
                {
                  icon: "💸",
                  title: "Tốn kém chi phí tư vấn?",
                  desc: "Chi phí luật sư di trú đắt đỏ trong khi vẫn chưa chắc chắn về lộ trình.",
                },
              ].map((item, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-5">
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Grid ──────────────────────────────────────── */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Tại Sao Chọn Chúng Tôi?
            </h2>
            <p className="text-gray-500 mt-2">Được xây dựng để giúp bạn thành công</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                Icon: Shield,
                title: "Chuyên Nghiệp & Đáng Tin",
                desc: "Thông tin luôn được cập nhật theo quy định mới nhất của Bộ Di Trú Úc (DOHA).",
                img: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&q=80",
              },
              {
                Icon: Zap,
                title: "Lộ Trình Cá Nhân Hoá",
                desc: "AI phân tích hồ sơ của bạn và tạo ra kế hoạch chi tiết theo từng bước thực tế.",
                img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80",
              },
              {
                Icon: MapPin,
                title: "Bang & Ngành Nghề Phù Hợp",
                desc: "Cập nhật realtime về các bang đang mở cửa sponsor cho ngành nghề của bạn.",
                img: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&q=80",
              },
              {
                Icon: BookOpen,
                title: "Kiến Thức Đầy Đủ",
                desc: "Hơn 50 hướng dẫn chi tiết về từng loại visa, biểu mẫu và quy trình nộp hồ sơ.",
                img: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&q=80",
              },
              {
                Icon: Star,
                title: "Tối Giản & Dễ Dùng",
                desc: "Giao diện được thiết kế tinh tế — phức tạp nhất cũng trở nên đơn giản, rõ ràng.",
                img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&q=80",
              },
              {
                Icon: Users,
                title: "Cộng Đồng Việt tại Úc",
                desc: "Chia sẻ kinh nghiệm, hỗ trợ lẫn nhau trên con đường định cư Úc.",
                img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80",
              },
            ].map(({ Icon, title, desc, img }, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <img src={img} alt={title} className="w-full h-40 object-cover" />
                <div className="p-5">
                  <Icon className="h-5 w-5 text-gray-700 mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                  <p className="text-sm text-gray-600">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Admin Feedback Summary ─────────────────────────────── */}
      {isAdmin && (
        <div className="max-w-5xl mx-auto px-4 py-6">
          <AdminFeedbackSummary />
        </div>
      )}
    </div>
  );
}