import { useState, useMemo } from "react";
import {
  Zap, Star, Crown, Gift, CreditCard, CheckCircle2,
  Info, MessageCircle, FileText, BrainCircuit,
  Building2, ChevronDown, ChevronUp,
  Users, Database, Award, TrendingUp, HelpCircle, X,
  RefreshCw, AlertTriangle, Calculator
} from "lucide-react";

// ─── Constants ──────────────────────────────────────────────────────────────

/** Subscription plans — monthly base prices */
const SUBSCRIPTION_PLANS = [
  {
    id: "basic",
    name: "Gói Cơ Bản",
    credits: 50,
    monthlyPrice: 49000,
    icon: Zap,
    color: "from-blue-400 to-blue-600",
    badge: null,
    highlight: false,
    features: [
      "50 tín dụng/tháng",
      "1 câu hỏi AI = 1 tín dụng",
      "Lộ trình cơ bản",
      "Tra cứu Knowledge Base",
      "Phí vượt mức: 1,200₫/tín dụng",
    ],
  },
  {
    id: "standard",
    name: "Gói Tiêu Chuẩn",
    credits: 150,
    monthlyPrice: 99000,
    icon: Star,
    color: "from-emerald-400 to-emerald-600",
    badge: "Phổ biến nhất",
    highlight: true,
    features: [
      "150 tín dụng/tháng",
      "Lộ trình cá nhân hoá đầy đủ",
      "MyPlan + nhắc nhở deadline",
      "Tải xuống biểu mẫu tự điền",
      "Phí vượt mức: 1,000₫/tín dụng",
    ],
  },
  {
    id: "professional",
    name: "Gói Chuyên Nghiệp",
    credits: 500,
    monthlyPrice: 249000,
    icon: Crown,
    color: "from-purple-400 to-purple-600",
    badge: null,
    highlight: false,
    features: [
      "500 tín dụng/tháng",
      "Phân tích CV chuyên sâu",
      "Tạo EOI & CV Úc chuẩn",
      "Cảnh báo thông minh",
      "Hỗ trợ ưu tiên qua chat",
      "Phí vượt mức: 800₫/tín dụng",
    ],
  },
];

/** Billing period multipliers and discounts */
const BILLING_PERIODS = [
  { id: "monthly",   label: "Hàng tháng",  months: 1,  discount: 0,    badge: null },
  { id: "quarterly", label: "Hàng quý",    months: 3,  discount: 0.10, badge: "Tiết kiệm 10%" },
  { id: "annual",    label: "Hàng năm",    months: 12, discount: 0.20, badge: "Tiết kiệm 20%" },
];

/** Overage rates per plan (VND per extra credit) */
const OVERAGE_RATES = { basic: 1200, standard: 1000, professional: 800 };

const CREDIT_PACKS = [
  {
    id: "starter",
    name: "Gói Khởi Đầu",
    credits: 30,
    price: 29000,
    icon: Zap,
    color: "from-blue-400 to-blue-600",
    badge: null,
    perCredit: 967,
    highlight: false,
    validity: "30 ngày",
    features: [
      "30 lượt tư vấn AI",
      "Truy cập Knowledge Base",
      "Xem lộ trình cơ bản",
      "Hiệu lực 30 ngày",
    ],
  },
  {
    id: "standard",
    name: "Gói Tiêu Chuẩn",
    credits: 100,
    price: 79000,
    icon: Star,
    color: "from-emerald-400 to-emerald-600",
    badge: "Phổ biến nhất",
    perCredit: 790,
    highlight: true,
    validity: "90 ngày",
    features: [
      "100 lượt tư vấn AI",
      "Lộ trình cá nhân hoá đầy đủ",
      "MyPlan + nhắc nhở deadline",
      "Tải xuống biểu mẫu tự điền",
      "Hiệu lực 90 ngày",
    ],
  },
  {
    id: "professional",
    name: "Gói Chuyên Nghiệp",
    credits: 300,
    price: 199000,
    icon: Crown,
    color: "from-purple-400 to-purple-600",
    badge: "Tiết kiệm 32%",
    perCredit: 663,
    highlight: false,
    validity: "180 ngày",
    features: [
      "300 lượt tư vấn AI",
      "Phân tích CV chuyên sâu",
      "Tạo EOI & CV Úc chuẩn",
      "Cảnh báo thông minh (visa, hộ chiếu)",
      "Hỗ trợ ưu tiên qua chat",
      "Hiệu lực 180 ngày",
    ],
  },
  {
    id: "elite",
    name: "Gói Toàn Diện",
    credits: 1000,
    price: 499000,
    icon: Gift,
    color: "from-amber-400 to-orange-500",
    badge: "Tiết kiệm 48%",
    perCredit: 499,
    highlight: false,
    validity: "365 ngày",
    features: [
      "1,000 lượt tư vấn AI",
      "Tất cả tính năng Pro",
      "Ưu tiên phân tích trường hợp phức tạp",
      "Báo cáo lộ trình hàng tháng",
      "Lưu trữ hồ sơ vĩnh viễn",
      "Hiệu lực 365 ngày",
    ],
  },
];

const CREDIT_USAGE = [
  { icon: MessageCircle, label: "1 câu hỏi AI tư vấn", cost: 1, color: "text-blue-600 bg-blue-50" },
  { icon: BrainCircuit, label: "Phân tích lộ trình cá nhân", cost: 5, color: "text-purple-600 bg-purple-50" },
  { icon: FileText, label: "Tạo/điền biểu mẫu tự động", cost: 3, color: "text-emerald-600 bg-emerald-50" },
  { icon: TrendingUp, label: "Tính điểm EOI đầy đủ", cost: 2, color: "text-amber-600 bg-amber-50" },
  { icon: Award, label: "Tối ưu hóa CV theo visa", cost: 8, color: "text-rose-600 bg-rose-50" },
  { icon: BrainCircuit, label: "AI Deep Advice (MyPlan)", cost: 10, color: "text-indigo-600 bg-indigo-50" },
];

const COST_BREAKDOWN = [
  { icon: Database, label: "Lưu trữ hồ sơ & lịch sử tư vấn", pct: 30 },
  { icon: BrainCircuit, label: "Chi phí vận hành AI (OpenAI/LLM)", pct: 45 },
  { icon: Users, label: "Hỗ trợ & phát triển tính năng mới", pct: 15 },
  { icon: Award, label: "Phần thưởng cho tư vấn viên cộng đồng", pct: 10 },
];

const BANK_ACCOUNTS = [
  {
    id: "cba",
    name: "Commonwealth Bank (CBA)",
    account: "1234 5678 90",
    bsb: "062-000",
    holder: "DVLong Visa Path",
    country: "🇦🇺 Úc",
  },
  {
    id: "vcb",
    name: "Vietcombank (VCB)",
    account: "1234567890123",
    branch: "TP.HCM",
    holder: "NGUYEN VAN A",
    country: "🇻🇳 Việt Nam",
  },
];

/** Credits consumed per action type */
const CREDITS_PER_QUESTION = 1;
const CREDITS_PER_PATHWAY_ANALYSIS = 5;
const CREDITS_PER_CV_OPTIMIZATION = 8;
function calcSubscriptionPrice(plan, period) {
  const base = plan.monthlyPrice * period.months;
  return Math.round(base * (1 - period.discount));
}

function calcMonthlyEquivalent(plan, period) {
  return Math.round(calcSubscriptionPrice(plan, period) / period.months);
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SubscriptionPlanCard({ plan, period, onSelect }) {
  const Icon = plan.icon;
  const totalPrice = calcSubscriptionPrice(plan, period);
  const monthlyEq = calcMonthlyEquivalent(plan, period);
  const overageRate = OVERAGE_RATES[plan.id];

  return (
    <div
      className={`relative rounded-2xl border-2 transition-all duration-200 hover:shadow-xl cursor-pointer ${
        plan.highlight
          ? "border-emerald-400 shadow-lg shadow-emerald-100 scale-105"
          : "border-gray-200 hover:border-gray-300"
      } bg-white overflow-hidden`}
      onClick={() => onSelect({ ...plan, totalPrice, period })}
    >
      {plan.badge && (
        <div className={`absolute top-0 right-0 bg-gradient-to-r ${plan.color} text-white text-xs font-bold px-3 py-1 rounded-bl-xl`}>
          {plan.badge}
        </div>
      )}
      <div className={`bg-gradient-to-r ${plan.color} p-5`}>
        <Icon className="w-8 h-8 text-white mb-2" />
        <h3 className="text-white font-bold text-lg">{plan.name}</h3>
        <div className="flex items-end gap-1 mt-1">
          <span className="text-white text-3xl font-extrabold">{plan.credits}</span>
          <span className="text-white/80 text-sm mb-1">tín dụng/tháng</span>
        </div>
      </div>
      <div className="p-5">
        <div className="mb-1">
          <span className="text-2xl font-bold text-gray-900">
            {totalPrice.toLocaleString("vi-VN")}₫
          </span>
          {period.months > 1 && (
            <span className="text-xs text-gray-400 ml-1">/{period.label.toLowerCase()}</span>
          )}
        </div>
        <p className="text-sm text-gray-500 mb-1">
          ≈ {monthlyEq.toLocaleString("vi-VN")}₫/tháng
        </p>
        {period.discount > 0 && (
          <p className="text-xs text-emerald-600 font-semibold mb-3">
            ✓ {period.badge}
          </p>
        )}
        <ul className="space-y-2 mb-4">
          {plan.features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              {f}
            </li>
          ))}
        </ul>
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mb-4">
          <p className="text-xs text-amber-700 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 flex-shrink-0" />
            Vượt mức: <strong>{overageRate.toLocaleString("vi-VN")}₫/tín dụng</strong>
          </p>
        </div>
        <button
          className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all ${
            plan.highlight
              ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700"
              : "bg-gray-900 text-white hover:bg-gray-700"
          }`}
        >
          Đăng ký ngay
        </button>
      </div>
    </div>
  );
}

function CreditPackCard({ pack, onSelect }) {
  const Icon = pack.icon;
  return (
    <div
      className={`relative rounded-2xl border-2 transition-all duration-200 hover:shadow-xl cursor-pointer ${
        pack.highlight
          ? "border-emerald-400 shadow-lg shadow-emerald-100 scale-105"
          : "border-gray-200 hover:border-gray-300"
      } bg-white overflow-hidden`}
      onClick={() => onSelect(pack)}
    >
      {pack.badge && (
        <div className={`absolute top-0 right-0 bg-gradient-to-r ${pack.color} text-white text-xs font-bold px-3 py-1 rounded-bl-xl`}>
          {pack.badge}
        </div>
      )}
      <div className={`bg-gradient-to-r ${pack.color} p-5`}>
        <Icon className="w-8 h-8 text-white mb-2" />
        <h3 className="text-white font-bold text-lg">{pack.name}</h3>
        <div className="flex items-end gap-1 mt-1">
          <span className="text-white text-3xl font-extrabold">{pack.credits.toLocaleString()}</span>
          <span className="text-white/80 text-sm mb-1">tín dụng</span>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-baseline justify-between mb-4">
          <span className="text-2xl font-bold text-gray-900">{pack.price.toLocaleString("vi-VN")}₫</span>
          <span className="text-sm text-gray-500">≈ {pack.perCredit.toLocaleString()}₫/lượt</span>
        </div>
        <ul className="space-y-2 mb-5">
          {pack.features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              {f}
            </li>
          ))}
        </ul>
        <button
          className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all ${
            pack.highlight
              ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700"
              : "bg-gray-900 text-white hover:bg-gray-700"
          }`}
        >
          Mua ngay
        </button>
      </div>
    </div>
  );
}

function CostCalculator() {
  const [planId, setPlanId] = useState("standard");
  const [periodId, setPeriodId] = useState("monthly");
  const [questionsPerMonth, setQuestionsPerMonth] = useState(80);
  const [pathwayAnalyses, setPathwayAnalyses] = useState(2);
  const [cvOptimizations, setCvOptimizations] = useState(1);

  const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planId);
  const period = BILLING_PERIODS.find((p) => p.id === periodId);

  const creditsUsedPerMonth = useMemo(
    () => questionsPerMonth * CREDITS_PER_QUESTION + pathwayAnalyses * CREDITS_PER_PATHWAY_ANALYSIS + cvOptimizations * CREDITS_PER_CV_OPTIMIZATION,
    [questionsPerMonth, pathwayAnalyses, cvOptimizations]
  );

  const overageCredits = Math.max(0, creditsUsedPerMonth - plan.credits);
  const overageRate = OVERAGE_RATES[plan.id];
  const overageCost = overageCredits * overageRate;

  const subscriptionTotal = calcSubscriptionPrice(plan, period);
  const monthlyEq = calcMonthlyEquivalent(plan, period);
  const overageTotalPeriod = overageCost * period.months;
  const grandTotal = subscriptionTotal + overageTotalPeriod;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-5 text-white">
        <div className="flex items-center gap-3">
          <Calculator className="w-6 h-6" />
          <div>
            <h2 className="font-bold text-lg">Tính toán chi phí</h2>
            <p className="text-indigo-100 text-sm">Ước tính chính xác chi phí hàng tháng của bạn</p>
          </div>
        </div>
      </div>

      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Inputs */}
        <div className="space-y-5">
          {/* Plan selector */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Gói đăng ký</label>
            <div className="grid grid-cols-3 gap-2">
              {SUBSCRIPTION_PLANS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPlanId(p.id)}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold border-2 transition-all ${
                    planId === p.id
                      ? "border-indigo-400 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {p.name.replace("Gói ", "")}
                </button>
              ))}
            </div>
          </div>

          {/* Period selector */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Chu kỳ thanh toán</label>
            <div className="grid grid-cols-3 gap-2">
              {BILLING_PERIODS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPeriodId(p.id)}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold border-2 transition-all ${
                    periodId === p.id
                      ? "border-indigo-400 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {p.label}
                  {p.discount > 0 && (
                    <span className="block text-emerald-600">-{p.discount * 100}%</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Usage inputs */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-3 block">
              Nhu cầu sử dụng mỗi tháng
            </label>
            <div className="space-y-4">
              {[
                {
                  label: "Câu hỏi AI tư vấn",
                  value: questionsPerMonth,
                  setter: setQuestionsPerMonth,
                  min: 0, max: 300, creditPer: CREDITS_PER_QUESTION,
                },
                {
                  label: "Phân tích lộ trình",
                  value: pathwayAnalyses,
                  setter: setPathwayAnalyses,
                  min: 0, max: 20, creditPer: CREDITS_PER_PATHWAY_ANALYSIS,
                },
                {
                  label: "Tối ưu hóa CV",
                  value: cvOptimizations,
                  setter: setCvOptimizations,
                  min: 0, max: 10, creditPer: CREDITS_PER_CV_OPTIMIZATION,
                },
              ].map(({ label, value, setter, min, max, creditPer }) => (
                <div key={label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{label}</span>
                    <span className="font-semibold text-gray-900">
                      {value} lần × {creditPer} = <span className="text-indigo-600">{value * creditPer} tín dụng</span>
                    </span>
                  </div>
                  <input
                    type="range"
                    min={min}
                    max={max}
                    value={value}
                    onChange={(e) => setter(Number(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Result */}
        <div className="space-y-4">
          {/* Credit usage summary */}
          <div className={`rounded-xl p-4 border-2 ${
            overageCredits > 0 ? "border-amber-300 bg-amber-50" : "border-emerald-300 bg-emerald-50"
          }`}>
            <p className="text-sm font-semibold text-gray-700 mb-2">Tín dụng cần mỗi tháng</p>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-extrabold text-gray-900">{creditsUsedPerMonth}</span>
              <span className="text-gray-500 mb-1">/ {plan.credits} tín dụng gói</span>
            </div>
            <div className="mt-2 h-3 bg-white rounded-full overflow-hidden border border-gray-200">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  overageCredits > 0 ? "bg-amber-500" : "bg-emerald-500"
                }`}
                style={{ width: `${Math.min(100, (creditsUsedPerMonth / plan.credits) * 100)}%` }}
              />
            </div>
            {overageCredits > 0 ? (
              <p className="text-xs text-amber-700 mt-2 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Vượt <strong>{overageCredits} tín dụng</strong> → phí thêm{" "}
                <strong>{overageCost.toLocaleString("vi-VN")}₫/tháng</strong>
              </p>
            ) : (
              <p className="text-xs text-emerald-700 mt-2 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Trong giới hạn gói — không phí vượt mức
              </p>
            )}
          </div>

          {/* Cost breakdown */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <p className="text-sm font-semibold text-gray-700">Chi phí {period.label.toLowerCase()}</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Phí đăng ký ({plan.name})</span>
                <span className="font-semibold">{subscriptionTotal.toLocaleString("vi-VN")}₫</span>
              </div>
              {period.discount > 0 && (
                <div className="flex justify-between text-emerald-600 text-xs">
                  <span>Giảm {period.discount * 100}% ({period.label.toLowerCase()})</span>
                  <span>-{(plan.monthlyPrice * period.months * period.discount).toLocaleString("vi-VN")}₫</span>
                </div>
              )}
              {overageCredits > 0 && (
                <div className="flex justify-between text-amber-700">
                  <span>
                    Phí vượt mức ({overageCredits} × {period.months} tháng × {overageRate.toLocaleString()}₫)
                  </span>
                  <span className="font-semibold">{overageTotalPeriod.toLocaleString("vi-VN")}₫</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-2 flex justify-between text-gray-900 font-bold">
                <span>Tổng cộng</span>
                <span className="text-indigo-600 text-lg">{grandTotal.toLocaleString("vi-VN")}₫</span>
              </div>
              <div className="flex justify-between text-gray-500 text-xs">
                <span>Quy đổi mỗi tháng</span>
                <span>{Math.round(grandTotal / period.months).toLocaleString("vi-VN")}₫/tháng</span>
              </div>
            </div>
          </div>

          {overageCredits > 0 && (
            <div className="bg-blue-50 rounded-xl p-3 flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700">
                Bạn thường xuyên vượt mức? Hãy nâng lên{" "}
                <strong>
                  {SUBSCRIPTION_PLANS.find(
                    (p) => p.credits > plan.credits && p.credits >= creditsUsedPerMonth
                  )?.name || "gói tín dụng lẻ phù hợp"}
                </strong>{" "}
                để tiết kiệm hơn so với phí vượt mức.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PaymentModal({ item, onClose }) {
  const [bank, setBank] = useState("cba");
  const selected = BANK_ACCOUNTS.find((b) => b.id === bank);
  const ref = `VISA${Date.now().toString().slice(-6)}${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
  const displayPrice = item.totalPrice !== undefined && item.totalPrice !== null ? item.totalPrice : item.price;
  const isSubscription = !!item.monthlyPrice;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="font-bold text-lg text-gray-900">
            Thanh toán – {item.name}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          {/* Summary */}
          <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center">
            <div>
              <p className="font-semibold text-gray-900">{item.name}</p>
              <p className="text-sm text-gray-500">
                {isSubscription
                  ? `${item.credits} tín dụng/tháng · ${item.period?.label}`
                  : `${item.credits} tín dụng · Hiệu lực ${item.validity}`}
              </p>
            </div>
            <span className="text-xl font-bold text-emerald-600">
              {displayPrice.toLocaleString("vi-VN")}₫
            </span>
          </div>

          {/* Bank selector */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Chọn ngân hàng:</p>
            <div className="grid grid-cols-2 gap-2">
              {BANK_ACCOUNTS.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setBank(b.id)}
                  className={`p-3 rounded-xl border-2 text-left text-sm transition-all ${
                    bank === b.id ? "border-emerald-400 bg-emerald-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="font-semibold">{b.country}</span>
                  <br />
                  <span className="text-gray-600">{b.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Bank details */}
          <div className="bg-blue-50 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-blue-800">{selected.name}</span>
            </div>
            {selected.bsb && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">BSB:</span>
                <span className="font-mono font-bold">{selected.bsb}</span>
              </div>
            )}
            {selected.branch && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Chi nhánh:</span>
                <span className="font-mono font-bold">{selected.branch}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Số tài khoản:</span>
              <span className="font-mono font-bold">{selected.account}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Chủ tài khoản:</span>
              <span className="font-bold">{selected.holder}</span>
            </div>
            <div className="border-t border-blue-200 pt-2 flex justify-between text-sm">
              <span className="text-gray-600">Số tiền:</span>
              <span className="font-bold text-emerald-700">{displayPrice.toLocaleString("vi-VN")}₫</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Nội dung CK:</span>
              <span className="font-mono font-bold text-blue-700">{ref}</span>
            </div>
          </div>

          <div className="flex items-start gap-2 text-xs text-gray-500 bg-yellow-50 rounded-xl p-3">
            <Info className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p>
              Sau khi chuyển khoản, tín dụng sẽ được cộng vào tài khoản trong vòng
              <strong> 2–4 giờ làm việc</strong>. Vui lòng ghi đúng nội dung chuyển
              khoản <strong>{ref}</strong>.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-colors"
          >
            Đã chuyển khoản – Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}

function BillingPeriodToggle({ activePeriod, onChange }) {
  return (
    <div className="flex items-center justify-center gap-2 flex-wrap">
      {BILLING_PERIODS.map((p) => (
        <button
          key={p.id}
          onClick={() => onChange(p.id)}
          className={`relative px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
            activePeriod === p.id
              ? "border-emerald-400 bg-emerald-50 text-emerald-700"
              : "border-gray-200 text-gray-600 hover:border-gray-300"
          }`}
        >
          {p.label}
          {p.badge && (
            <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap">
              {p.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function Pricing() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [pricingMode, setPricingMode] = useState("subscription"); // "subscription" | "onetime"
  const [billingPeriod, setBillingPeriod] = useState("monthly");

  const activePeriod = BILLING_PERIODS.find((p) => p.id === billingPeriod);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      {/* Header */}
      <div className="text-center py-14 px-4">
        <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
          <Zap className="w-3.5 h-3.5" /> Linh hoạt theo nhu cầu thực tế
        </span>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
          Chọn gói phù hợp với bạn
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Đăng ký hàng tháng, hàng quý hoặc hàng năm để sử dụng tín dụng AI định kỳ — hoặc mua lẻ khi cần. Vượt mức? Chỉ trả thêm phần bạn dùng.
        </p>

        {/* Mode toggle */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={() => setPricingMode("subscription")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm border-2 transition-all ${
              pricingMode === "subscription"
                ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                : "border-gray-200 text-gray-500 hover:border-gray-300"
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            Đăng ký định kỳ
          </button>
          <button
            onClick={() => setPricingMode("onetime")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm border-2 transition-all ${
              pricingMode === "onetime"
                ? "border-indigo-400 bg-indigo-50 text-indigo-700"
                : "border-gray-200 text-gray-500 hover:border-gray-300"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Mua tín dụng một lần
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-16 space-y-14">

        {/* ── Subscription plans ── */}
        {pricingMode === "subscription" && (
          <>
            <div>
              <BillingPeriodToggle activePeriod={billingPeriod} onChange={setBillingPeriod} />
              {activePeriod.discount > 0 && (
                <p className="text-center text-emerald-600 text-sm font-semibold mt-3">
                  🎉 Tiết kiệm {activePeriod.discount * 100}% khi thanh toán {activePeriod.label.toLowerCase()}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
              {SUBSCRIPTION_PLANS.map((plan) => (
                <SubscriptionPlanCard
                  key={plan.id}
                  plan={plan}
                  period={activePeriod}
                  onSelect={setSelectedItem}
                />
              ))}
            </div>

            {/* Overage pricing table */}
            <div className="bg-white rounded-2xl border border-amber-200 overflow-hidden shadow-sm">
              <div className="bg-amber-50 border-b border-amber-200 px-5 py-4 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <div>
                  <p className="font-semibold text-amber-900">Phí vượt mức tín dụng</p>
                  <p className="text-xs text-amber-700">
                    Khi tín dụng gói đã hết, mỗi tín dụng thêm sẽ tính phí theo bảng sau:
                  </p>
                </div>
              </div>
              <div className="p-5">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left py-2 text-gray-500 font-semibold">Gói</th>
                        <th className="text-left py-2 text-gray-500 font-semibold">Tín dụng gói/tháng</th>
                        <th className="text-left py-2 text-gray-500 font-semibold">Phí vượt mức</th>
                        <th className="text-left py-2 text-gray-500 font-semibold">Ví dụ: 20 tín dụng thêm</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SUBSCRIPTION_PLANS.map((plan) => (
                        <tr key={plan.id} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="py-3 font-semibold text-gray-900">{plan.name}</td>
                          <td className="py-3 text-gray-600">{plan.credits} tín dụng</td>
                          <td className="py-3 text-amber-700 font-semibold">
                            {OVERAGE_RATES[plan.id].toLocaleString("vi-VN")}₫/tín dụng
                          </td>
                          <td className="py-3 text-gray-600">
                            {(OVERAGE_RATES[plan.id] * 20).toLocaleString("vi-VN")}₫
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-400 mt-3 flex items-start gap-1">
                  <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  Phí vượt mức được tính tự động cuối mỗi chu kỳ và trừ vào phương thức thanh toán đã lưu.
                  Bạn có thể đặt giới hạn chi tiêu tối đa trong phần Cài đặt.
                </p>
              </div>
            </div>
          </>
        )}

        {/* ── One-time credit packs ── */}
        {pricingMode === "onetime" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CREDIT_PACKS.map((pack) => (
              <CreditPackCard key={pack.id} pack={pack} onSelect={setSelectedItem} />
            ))}
          </div>
        )}

        {/* Free tier note */}
        <div className="flex items-center justify-center gap-3 text-sm text-gray-600 bg-white border border-gray-200 rounded-xl p-4 max-w-lg mx-auto">
          <Gift className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          <span>
            <strong>Miễn phí:</strong> 5 câu hỏi AI mỗi ngày, xem lộ trình cơ bản,
            tra cứu Knowledge Base – không cần đăng nhập.
          </span>
        </div>

        {/* Cost Calculator */}
        <CostCalculator />

        {/* Credit Usage Table */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
            1 Tín dụng dùng để làm gì?
          </h2>
          <p className="text-gray-500 text-center text-sm mb-8">
            Chi phí được tính minh bạch dựa trên tài nguyên AI thực tế tiêu thụ
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CREDIT_USAGE.map(({ icon: Icon, label, cost, color }) => (
              <div
                key={label}
                className="flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className={`p-3 rounded-xl ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">{label}</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-gray-900">{cost}</span>
                  <p className="text-xs text-gray-500">tín dụng</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cost breakdown (transparent) */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <button
            className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
            onClick={() => setShowBreakdown(!showBreakdown)}
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-gray-500" />
              <div className="text-left">
                <p className="font-semibold text-gray-900">Tiền của bạn đi đâu?</p>
                <p className="text-xs text-gray-500">
                  Chúng tôi cam kết minh bạch về cách sử dụng doanh thu
                </p>
              </div>
            </div>
            {showBreakdown ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          {showBreakdown && (
            <div className="border-t border-gray-100 p-5 space-y-4">
              {COST_BREAKDOWN.map(({ icon: Icon, label, pct }) => (
                <div key={label} className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">{label}</span>
                      <span className="font-bold text-gray-900">{pct}%</span>
                    </div>
                    <div className="bg-gray-100 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
              ))}
              <p className="text-xs text-gray-500 border-t pt-3">
                * 10% doanh thu được dùng để thưởng cho những cộng tác viên đã
                đóng góp tình huống thực tế giúp AI tư vấn chính xác hơn.
              </p>
            </div>
          )}
        </div>

        {/* FAQ mini */}
        <div className="max-w-2xl mx-auto space-y-3">
          <h2 className="text-xl font-bold text-gray-900 text-center mb-5">
            Câu hỏi thường gặp
          </h2>
          {[
            {
              q: "Gói đăng ký định kỳ có tự gia hạn không?",
              a: "Có. Gói đăng ký tự động gia hạn mỗi tháng/quý/năm. Bạn có thể hủy bất kỳ lúc nào trong Cài đặt > Gói & Thanh toán, và tín dụng còn lại sẽ được dùng đến hết chu kỳ hiện tại.",
            },
            {
              q: "Điều gì xảy ra khi tôi vượt quá tín dụng gói?",
              a: "Khi tín dụng gói đã hết, bạn vẫn có thể tiếp tục sử dụng và mỗi tín dụng thêm sẽ tính theo mức phí vượt mức của gói. Bạn có thể đặt giới hạn chi tiêu tối đa để tránh bị tính phí quá mức.",
            },
            {
              q: "Gói tháng khác gói quý và gói năm như thế nào?",
              a: "Nội dung tính năng giống nhau. Gói quý tiết kiệm 10% và gói năm tiết kiệm 20% so với thanh toán hàng tháng. Phí vượt mức (overcharge) không thay đổi theo chu kỳ thanh toán.",
            },
            {
              q: "Tín dụng có chuyển sang tháng sau không?",
              a: "Không. Tín dụng gói đăng ký reset mỗi đầu chu kỳ. Tuy nhiên, tín dụng mua lẻ (one-time) sẽ được lưu đến hết hạn của gói đó.",
            },
            {
              q: "Có hoàn tiền nếu tôi không dùng không?",
              a: "Chúng tôi hoàn tiền 100% trong vòng 7 ngày kể từ ngày thanh toán nếu bạn chưa sử dụng quá 10 tín dụng.",
            },
          ].map(({ q, a }) => (
            <FAQItem key={q} q={q} a={a} />
          ))}
        </div>
      </div>

      {/* Payment Modal */}
      {selectedItem && (
        <PaymentModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
        onClick={() => setOpen(!open)}
      >
        <span className="font-medium text-gray-900 text-sm">{q}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-4 pb-4 text-sm text-gray-600 border-t border-gray-100 pt-3">
          {a}
        </div>
      )}
    </div>
  );
}
