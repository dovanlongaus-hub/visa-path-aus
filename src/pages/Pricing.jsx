import { useState } from "react";
import { Check, CheckCircle, ArrowRight, Shield, MessageCircle, FileText, Sparkles, Target, Crown, CreditCard, Loader2, X } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// ── Pricing tiers (AUD) ───────────────────────────────────────
const PLANS_CONFIG = [
  {
    id: "free",
    name: "Miễn phí",
    nameEn: "Free",
    monthlyPrice: 0,
    annualPrice: 0,
    color: "gray",
    badge: null,
    features: [
      "3 câu hỏi AI/ngày",
      "EOI Calculator",
      "Tra cứu nghề cơ bản",
      "Checklist visa cơ bản",
    ],
    locked: [
      "AI không giới hạn",
      "Document Tracker",
      "Email Alerts",
      "Visa Timeline Tracker",
      "Priority Support",
      "Agent Tools",
    ],
  },
  {
    id: "basic",
    name: "Cơ bản",
    nameEn: "Basic",
    monthlyPrice: 12,
    annualPrice: 115, // 12 * 12 * 0.8 = $115.20 rounded
    color: "blue",
    badge: "Phổ biến nhất",
    popular: true,
    trialBadge: "7 ngày miễn phí",
    features: [
      "AI không giới hạn",
      "Document Tracker",
      "Email Alerts",
      "EOI Calculator",
      "Tra cứu nghề nghiệp",
      "Checklist đầy đủ",
    ],
    locked: [
      "Visa Timeline Tracker",
      "Priority Support",
      "Agent Tools",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    nameEn: "Premium",
    monthlyPrice: 25,
    annualPrice: 240, // 25 * 12 * 0.8 = $240
    color: "violet",
    badge: "Đề xuất",
    features: [
      "Tất cả tính năng Basic",
      "Visa Timeline Tracker",
      "Priority Support",
      "EOI Generator",
      "CV Upload & Analysis",
      "Consultation call 30 phút",
    ],
    locked: [
      "Agent Tools",
      "Client Management",
    ],
  },
  {
    id: "professional",
    name: "Chuyên nghiệp",
    nameEn: "Professional",
    monthlyPrice: 45,
    annualPrice: 432, // 45 * 12 * 0.8 = $432
    color: "amber",
    badge: "Cho Agents",
    features: [
      "Tất cả tính năng Premium",
      "Agent/Migration Consultant Tools",
      "Client Management",
      "Multi-client Dashboard",
      "Custom Branding",
      "API Access",
    ],
    locked: [],
  },
];

// Feature comparison table data
const FEATURE_COMPARISON = [
  { feature: "Câu hỏi AI/ngày", free: "3", basic: "∞", premium: "∞", professional: "∞" },
  { feature: "EOI Calculator", free: true, basic: true, premium: true, professional: true },
  { feature: "Tra cứu nghề nghiệp", free: "Cơ bản", basic: true, premium: true, professional: true },
  { feature: "Document Tracker", free: false, basic: true, premium: true, professional: true },
  { feature: "Email Alerts", free: false, basic: true, premium: true, professional: true },
  { feature: "Visa Timeline Tracker", free: false, basic: false, premium: true, professional: true },
  { feature: "Priority Support", free: false, basic: false, premium: true, professional: true },
  { feature: "EOI Generator", free: false, basic: false, premium: true, professional: true },
  { feature: "CV Upload & Analysis", free: false, basic: true, premium: true, professional: true },
  { feature: "Client Management", free: false, basic: false, premium: false, professional: true },
  { feature: "API Access", free: false, basic: false, premium: false, professional: true },
];

const colorMap = {
  gray:   { border: "border-gray-200", badge: "", btn: "bg-gray-100 text-gray-400 cursor-default", header: "bg-gray-50", priceText: "text-gray-700" },
  blue:   { border: "border-blue-400 ring-2 ring-blue-200", badge: "bg-blue-600 text-white", btn: "bg-blue-600 text-white hover:bg-blue-700 hover:-translate-y-0.5", header: "bg-gradient-to-br from-blue-50 to-indigo-50", priceText: "text-blue-700" },
  violet: { border: "border-violet-400 ring-2 ring-violet-100", badge: "bg-violet-600 text-white", btn: "bg-violet-600 text-white hover:bg-violet-700 hover:-translate-y-0.5", header: "bg-gradient-to-br from-violet-50 to-purple-50", priceText: "text-violet-700" },
  amber:  { border: "border-amber-300 ring-2 ring-amber-100", badge: "bg-amber-500 text-white", btn: "bg-amber-500 text-white hover:bg-amber-600 hover:-translate-y-0.5", header: "bg-gradient-to-br from-amber-50 to-orange-50", priceText: "text-amber-700" },
};

// ── Main Page ─────────────────────────────────────────────────
export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [stripeLoading, setStripeLoading] = useState(false);
  const STRIPE_ADMIN_EMAIL = "info@longcare.au";

  const getPrice = (plan) => {
    return isAnnual ? plan.annualPrice : plan.monthlyPrice;
  };

  const getSavings = (plan) => {
    if (plan.monthlyPrice === 0) return 0;
    const annualCost = plan.monthlyPrice * 12;
    return annualCost - plan.annualPrice;
  };

  const handleSelect = (plan) => {
    if (plan.id === "free") return;
    const totalAmount = isAnnual ? plan.annualPrice : plan.monthlyPrice;
    setSelectedPlan({ ...plan, totalAmount, isAnnual });
    setShowPayment(true);
    setTimeout(() => document.getElementById("payment-section")?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const handleConsultationCheckout = async () => {
    setStripeLoading(true);
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: "consultation",
          isAnnual: false,
          email: STRIPE_ADMIN_EMAIL,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Không thể tạo phiên thanh toán. Vui lòng thử lại.");
        setStripeLoading(false);
      }
    } catch {
      alert("Lỗi kết nối. Vui lòng thử lại sau hoặc liên hệ support@longcare.au");
      setStripeLoading(false);
    }
  };

  const handleStripeCheckout = async () => {
    if (!selectedPlan?.id || selectedPlan.id === "free") return;
    setStripeLoading(true);
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: selectedPlan.id,
          isAnnual: isAnnual,
          email: STRIPE_ADMIN_EMAIL,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Không thể tạo phiên thanh toán. Vui lòng thử lại.");
        setStripeLoading(false);
      }
    } catch {
      alert("Lỗi kết nối. Vui lòng thử lại sau.");
      setStripeLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      <div className="max-w-6xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 text-sm text-blue-700 mb-4">
            <Shield className="w-4 h-4" /> Nền tảng tư vấn di trú Úc cho người Việt
          </div>
          <h1 className="text-4xl font-black text-[#0a1628] mb-3">Chọn gói phù hợp với bạn</h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">Bắt đầu miễn phí · Tiết kiệm 20% với thanh toán annual</p>
        </div>

        {/* Annual/Monthly toggle */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-white border border-gray-200 rounded-2xl p-1.5 shadow-sm">
            <button
              onClick={() => setIsAnnual(false)}
              className={`relative px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${!isAnnual ? "bg-[#0f2347] text-white shadow-md" : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"}`}
            >
              Tháng
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`relative px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${isAnnual ? "bg-[#0f2347] text-white shadow-md" : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"}`}
            >
              Năm
              <span className={`absolute -top-2 -right-2 text-[9px] font-black px-1.5 py-0.5 rounded-full ${isAnnual ? "bg-emerald-400 text-white" : "bg-emerald-100 text-emerald-700"}`}>
                -20%
              </span>
            </button>
          </div>
        </div>

        {/* Plans grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {PLANS_CONFIG.map(plan => {
            const c = colorMap[plan.color];
            const price = getPrice(plan);
            const savings = getSavings(plan);
            const isFree = plan.id === "free";
            return (
              <div key={plan.id} className={`relative bg-white rounded-2xl border ${plan.popular ? c.border : "border-gray-200"} overflow-hidden flex flex-col transition-shadow hover:shadow-lg ${plan.popular ? "scale-105 z-10" : ""}`}>
                {plan.badge && (
                  <div className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full ${c.badge}`}>
                    {plan.badge}
                  </div>
                )}
                {plan.trialBadge && (
                  <div className="absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                    {plan.trialBadge}
                  </div>
                )}
                <div className={`px-5 pt-5 pb-4 ${c.header}`}>
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{plan.name}</div>
                  {isFree ? (
                    <div className="text-3xl font-black text-gray-700">Miễn phí</div>
                  ) : (
                    <div>
                      <div className="flex items-end gap-1">
                        <span className={`text-3xl font-black ${c.priceText}`}>${price}</span>
                        <span className="text-gray-400 text-base mb-1">/tháng</span>
                      </div>
                      {isAnnual && savings > 0 && (
                        <div className="text-xs font-semibold text-emerald-600 mt-0.5">
                          Tiết kiệm ${savings}/năm
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="px-5 py-4 flex-1">
                  <ul className="space-y-2">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                    {plan.locked.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-gray-300 line-through">
                        <Check className="w-3.5 h-3.5 text-gray-200 flex-shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="px-5 pb-5">
                  <button
                    onClick={() => handleSelect(plan)}
                    disabled={isFree}
                    className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all ${isFree ? c.btn : c.btn}`}
                  >
                    {isFree ? "Đang dùng" : "Bắt đầu 7 ngày miễn phí"} {!isFree && <ArrowRight className="inline w-3.5 h-3.5 ml-0.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Consultation Section */}
        <div id="consultation" className="mt-4 mb-14 max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Cần tư vấn cá nhân?</h2>
            <p className="text-gray-600 mt-2">Chuyên gia visa người Việt, hiểu rõ hệ thống Úc</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 rounded-2xl p-8 relative">
            <span className="absolute -top-3 right-6 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">🔥 Tiết kiệm 60%</span>
            <div className="flex items-start gap-4">
              <div className="text-4xl">👨‍💼</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">Tư vấn 1-1 với Chuyên gia Visa</h3>
                <p className="text-gray-600 mt-1 text-sm">Review hồ sơ cá nhân — 30 phút Zoom, tiếng Việt</p>
                <ul className="mt-4 space-y-2">
                  {["Review EOI score & điểm mạnh/yếu", "Lộ trình tùy chỉnh theo case của bạn", "Giải đáp mọi câu hỏi cụ thể", "30 phút Zoom + follow-up email"].map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="text-green-500">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-3xl font-bold text-gray-900">$149</span>
                      <span className="text-gray-500 text-sm ml-1">AUD / buổi</span>
                      <p className="text-xs text-gray-400 mt-0.5">Thị trường: $200-500/buổi</p>
                    </div>
                  </div>
                  {/* Calendly embed section */}
                  <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-sm text-gray-600 mb-3">
                      📅 <strong>Bước 1:</strong> Chọn giờ phù hợp
                    </p>
                    <a
                      href="REPLACE_WITH_CALENDLY_URL"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center py-2 px-4 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium hover:bg-orange-200 transition"
                    >
                      📅 Xem lịch trống →
                    </a>
                    <p className="text-sm text-gray-600 mt-3 mb-3">
                      💳 <strong>Bước 2:</strong> Thanh toán $149 AUD
                    </p>
                    <button
                      onClick={() => handleConsultationCheckout()}
                      disabled={stripeLoading}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {stripeLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Đang xử lý...</> : "Thanh toán ngay →"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="text-center text-xs text-gray-400 mt-3">Sau khi thanh toán, chúng tôi sẽ liên hệ để sắp xếp lịch Zoom trong 24h</p>
        </div>

        {/* Feature Comparison Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-12 overflow-x-auto">
          <h3 className="font-bold text-[#0a1628] mb-4 flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-500" /> So sánh tính năng
          </h3>
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 text-gray-500 font-medium">Tính năng</th>
                <th className="text-center py-3 text-gray-500 font-medium">Miễn phí</th>
                <th className="text-center py-3 text-blue-600 font-bold">Basic</th>
                <th className="text-center py-3 text-violet-600 font-bold">Premium</th>
                <th className="text-center py-3 text-amber-600 font-bold">Professional</th>
              </tr>
            </thead>
            <tbody>
              {FEATURE_COMPARISON.map((row, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 text-gray-700">{row.feature}</td>
                  <td className="py-3 text-center">
                    {typeof row.free === "boolean" ? (
                      row.free ? <CheckCircle className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-gray-300 mx-auto" />
                    ) : <span className="text-xs text-gray-500">{row.free}</span>}
                  </td>
                  <td className="py-3 text-center">
                    {typeof row.basic === "boolean" ? (
                      row.basic ? <CheckCircle className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-gray-300 mx-auto" />
                    ) : <span className="text-xs text-blue-600 font-medium">{row.basic}</span>}
                  </td>
                  <td className="py-3 text-center">
                    {typeof row.premium === "boolean" ? (
                      row.premium ? <CheckCircle className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-gray-300 mx-auto" />
                    ) : <span className="text-xs text-violet-600 font-medium">{row.premium}</span>}
                  </td>
                  <td className="py-3 text-center">
                    {typeof row.professional === "boolean" ? (
                      row.professional ? <CheckCircle className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-gray-300 mx-auto" />
                    ) : <span className="text-xs text-amber-600 font-medium">{row.professional}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Why upgrade */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-10">
          <h2 className="text-xl font-bold text-[#0a1628] mb-6 text-center">Tại sao dùng gói trả phí?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: MessageCircle, color: "blue", title: "AI không giới hạn", desc: "Hỏi bao nhiêu cũng được, AI trả lời cụ thể theo hồ sơ cá nhân" },
              { icon: Target, color: "violet", title: "Visa Timeline Tracker", desc: "Theo dõi tiến trình visa từng bước, biết mình đang ở đâu" },
              { icon: Sparkles, color: "amber", title: "EOI & CV tự động", desc: "Tạo EOI SkillSelect và CV chuẩn Úc chỉ bằng 1 nút bấm" },
              { icon: FileText, color: "emerald", title: "Document Tracker", desc: "Theo dõi tài liệu, nhắc nhở deadline quan trọng" },
            ].map((item, i) => {
              const Icon = item.icon;
              const bg = { blue: "bg-blue-100 text-blue-600", violet: "bg-violet-100 text-violet-600", amber: "bg-amber-100 text-amber-600", emerald: "bg-emerald-100 text-emerald-600" }[item.color];
              return (
                <div key={i} className="text-center">
                  <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center mx-auto mb-3`}><Icon className="w-6 h-6" /></div>
                  <div className="font-semibold text-[#0a1628] text-sm mb-1">{item.title}</div>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment section */}
        {showPayment && selectedPlan && (
          <div id="payment-section" className="mb-10">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-[#0a1628]">Thanh toán – Gói {selectedPlan.name} · {isAnnual ? "Annual" : "Monthly"}</h2>
              <p className="text-gray-500 mt-1">Tổng: <strong className="text-blue-600">${selectedPlan.totalAmount}{isAnnual ? "/năm" : "/tháng"}</strong></p>
            </div>
            <div className="max-w-md mx-auto space-y-4">
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="w-5 h-5 text-[#635BFF]" />
                  <span className="font-bold text-[#0a1628]">Thanh toán bằng thẻ (Stripe)</span>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={handleStripeCheckout}
                    disabled={stripeLoading}
                    className="w-full py-2.5 rounded-xl font-semibold text-sm bg-[#635BFF] text-white hover:bg-[#5851E0] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
                  >
                    {stripeLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Đang chuyển hướng...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        Thanh toán ngay
                      </>
                    )}
                  </button>
                  <p className="text-xs text-gray-400 text-center">
                    Thanh toán an toàn qua Stripe
                  </p>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                <div className="font-semibold text-blue-800 text-sm mb-2">Sau khi thanh toán:</div>
                <ol className="space-y-1.5 text-xs text-blue-700">
                  <li className="flex items-start gap-2"><span className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-blue-700 mt-0.5">1</span>Tài khoản kích hoạt tức thì</li>
                  <li className="flex items-start gap-2"><span className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-blue-700 mt-0.5">2</span>Email xác nhận gửi về hộp thư của bạn</li>
                </ol>
              </div>
              <button onClick={() => setShowPayment(false)} className="w-full py-3 border border-gray-200 rounded-xl text-sm text-gray-400 hover:text-gray-600 transition-colors">
                Đóng
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-400">
            Có câu hỏi? <Link to={createPageUrl("Chat")} className="text-blue-600 font-medium hover:underline">Hỏi AI ngay</Link>
          </p>
          <p className="text-xs text-gray-300 mt-2">Thông tin mang tính tham khảo. Tạo bởi DVLong &amp; Genetic AI.</p>
        </div>
      </div>
    </div>
  );
}