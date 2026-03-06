import { useState } from "react";
import { Check, Copy, CheckCircle, ArrowRight, Shield, MessageCircle, FileText, Sparkles, Target, Crown, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

// ── Duration options ──────────────────────────────────────────
const DURATIONS = [
  { id: "monthly", label: "1 tháng", months: 1, discount: 0 },
  { id: "quarterly", label: "3 tháng", months: 3, discount: 15 },
  { id: "biannual", label: "6 tháng", months: 6, discount: 25 },
  { id: "annual", label: "1 năm", months: 12, discount: 35 },
];

// ── Base monthly prices (VND) ─────────────────────────────────
const BASE_PRICES = {
  basic: 199000,
  pro: 399000,
  expert: 699000,
};

// ── Plans ─────────────────────────────────────────────────────
const PLANS = [
  {
    id: "free",
    name: "Miễn phí",
    color: "gray",
    badge: null,
    basePrice: 0,
    features: [
      "3 câu hỏi AI miễn phí",
      "Xem lộ trình PR tổng quan",
      "Checklist cơ bản",
      "Thông tin visa công khai",
    ],
    locked: [
      "Tư vấn AI không giới hạn",
      "Kế hoạch cá nhân (MyPlan)",
      "EOI & CV tự động",
      "Biểu mẫu đầy đủ",
    ],
    cta: "Đang dùng",
    disabled: true,
  },
  {
    id: "basic",
    name: "Cơ bản",
    color: "blue",
    badge: "Phổ biến nhất",
    baseKey: "basic",
    features: [
      "Tư vấn AI không giới hạn",
      "Lộ trình tùy biến theo hồ sơ",
      "Checklist & nhắc nhở thông minh",
      "Lịch sử hội thoại lưu trữ",
      "Upload & phân tích CV",
      "Thông báo tin tức di trú tự động",
    ],
    locked: ["MyPlan AI cá nhân hoá", "EOI & CV tự động", "Biểu mẫu đầy đủ"],
    cta: "Đăng ký ngay",
    disabled: false,
  },
  {
    id: "pro",
    name: "Chuyên nghiệp",
    color: "violet",
    badge: "Tốt nhất",
    baseKey: "pro",
    features: [
      "Tất cả tính năng Cơ bản",
      "MyPlan AI cá nhân hoá",
      "Tạo EOI & CV tự động",
      "Biểu mẫu di trú đầy đủ",
      "Báo cáo lộ trình PDF cá nhân",
      "Gợi ý tiểu bang phù hợp nhất",
    ],
    locked: [],
    cta: "Mua ngay",
    disabled: false,
  },
  {
    id: "expert",
    name: "Chuyên sâu",
    color: "amber",
    badge: null,
    baseKey: "expert",
    features: [
      "Tất cả tính năng Chuyên nghiệp",
      "1 buổi review hồ sơ AI toàn diện",
      "Checklist tuỳ chỉnh theo ngành",
      "Review EOI/Skills Assessment",
      "Hỗ trợ ưu tiên 24/7",
      "Cập nhật CSOL & visa policy realtime",
    ],
    locked: [],
    cta: "Mua ngay",
    disabled: false,
  },
];

const colorMap = {
  gray:   { border: "border-gray-200", badge: "", btn: "bg-gray-100 text-gray-400 cursor-default", header: "bg-gray-50", priceText: "text-gray-700" },
  blue:   { border: "border-blue-400 ring-2 ring-blue-100", badge: "bg-blue-600 text-white", btn: "bg-blue-600 text-white hover:bg-blue-700 hover:-translate-y-0.5", header: "bg-gradient-to-br from-blue-50 to-indigo-50", priceText: "text-blue-700" },
  violet: { border: "border-violet-400 ring-2 ring-violet-100", badge: "bg-violet-600 text-white", btn: "bg-violet-600 text-white hover:bg-violet-700 hover:-translate-y-0.5", header: "bg-gradient-to-br from-violet-50 to-purple-50", priceText: "text-violet-700" },
  amber:  { border: "border-amber-300 ring-2 ring-amber-100", badge: "bg-amber-500 text-white", btn: "bg-amber-500 text-white hover:bg-amber-600 hover:-translate-y-0.5", header: "bg-gradient-to-br from-amber-50 to-orange-50", priceText: "text-amber-700" },
};

// ── Bank Transfer ─────────────────────────────────────────────
const BANKS = [
  {
    flag: "🇦🇺", label: "Tài khoản Úc", bank: "Commonwealth Bank (CBA)",
    fields: [
      { label: "Ngân hàng", value: "Commonwealth Bank (CBA)" },
      { label: "BSB", value: "067 873", copy: "067873" },
      { label: "Số tài khoản", value: "1154 7224", copy: "11547224" },
      { label: "Tên tài khoản", value: "Van Long DO" },
    ],
    qr: (amount) => `BSB: 067873\nAccount: 11547224\nName: Van Long DO\nAmount: AUD ${Math.round(amount/25000)}\nReference: Email + Plan`,
  },
  {
    flag: "🇻🇳", label: "Tài khoản Việt Nam", bank: "Vietcombank (VCB)",
    fields: [
      { label: "Ngân hàng", value: "Vietcombank (VCB)" },
      { label: "Số tài khoản", value: "0071000985789", copy: "0071000985789" },
      { label: "Tên tài khoản", value: "Đỗ Văn Long" },
    ],
    qr: (amount) => `https://img.vietqr.io/image/VCB-0071000985789-compact2.png?amount=${amount}&addInfo=DitruAI&accountName=Do Van Long`,
  },
];

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="ml-2 text-gray-400 hover:text-blue-600">
      {copied ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
    </button>
  );
}

function QRCode({ data, size = 160 }) {
  const isUrl = data.startsWith("http");
  const src = isUrl ? data : `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}&margin=10`;
  return <img src={src} alt="QR" width={size} height={size} className="rounded-xl border border-gray-200 shadow-sm" />;
}

function BankCard({ bank, totalAmount }) {
  const [showQR, setShowQR] = useState(true);
  const qrData = bank.qr(totalAmount);
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{bank.flag}</span>
          <div>
            <div className="font-bold text-[#0a1628] text-sm">{bank.label}</div>
            <div className="text-xs text-gray-400">{bank.bank}</div>
          </div>
        </div>
        <button onClick={() => setShowQR(!showQR)} className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${showQR ? "bg-blue-600 text-white border-blue-600" : "border-blue-200 text-blue-600 hover:bg-blue-50"}`}>
          {showQR ? "Ẩn QR" : "Quét QR"}
        </button>
      </div>
      {showQR && (
        <div className="flex flex-col items-center gap-2 py-4 mb-3 bg-gray-50 rounded-xl">
          <QRCode data={qrData} size={180} />
          <p className="text-xs text-gray-500 text-center px-4">📱 Mở app ngân hàng → Quét QR → Xác nhận</p>
          <div className="bg-white border border-blue-200 rounded-lg px-4 py-2">
            <span className="text-xs text-gray-500">Số tiền: </span>
            <span className="text-sm font-black text-blue-600">₫{totalAmount.toLocaleString("vi-VN")}</span>
          </div>
        </div>
      )}
      <div className="space-y-2">
        {bank.fields.map((f, i) => (
          <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
            <span className="text-xs text-gray-500">{f.label}</span>
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold text-[#0a1628] font-mono">{f.value}</span>
              {f.copy && <CopyButton text={f.copy} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export default function Pricing() {
  const [selectedDuration, setSelectedDuration] = useState("monthly");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  const dur = DURATIONS.find(d => d.id === selectedDuration);

  const getPrice = (baseKey) => {
    if (!baseKey) return 0;
    const base = BASE_PRICES[baseKey];
    const total = base * dur.months * (1 - dur.discount / 100);
    return Math.round(total / 1000) * 1000;
  };

  const getMonthlyEquiv = (baseKey) => {
    if (!baseKey) return 0;
    const total = getPrice(baseKey);
    return Math.round(total / dur.months / 1000) * 1000;
  };

  const handleSelect = (plan) => {
    if (plan.disabled) return;
    const totalAmount = getPrice(plan.baseKey);
    setSelectedPlan({ ...plan, totalAmount, months: dur.months });
    setShowPayment(true);
    setTimeout(() => document.getElementById("payment-section")?.scrollIntoView({ behavior: "smooth" }), 100);
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
          <p className="text-gray-500 text-lg max-w-xl mx-auto">Bắt đầu miễn phí · Tiết kiệm hơn khi đăng ký dài hạn</p>
        </div>

        {/* Duration switcher */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-white border border-gray-200 rounded-2xl p-1.5 shadow-sm gap-1">
            {DURATIONS.map(d => (
              <button
                key={d.id}
                onClick={() => setSelectedDuration(d.id)}
                className={`relative px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${selectedDuration === d.id ? "bg-[#0f2347] text-white shadow-md" : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"}`}
              >
                {d.label}
                {d.discount > 0 && (
                  <span className={`absolute -top-2 -right-2 text-[9px] font-black px-1.5 py-0.5 rounded-full ${selectedDuration === d.id ? "bg-emerald-400 text-white" : "bg-emerald-100 text-emerald-700"}`}>
                    -{d.discount}%
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Plans grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {PLANS.map(plan => {
            const c = colorMap[plan.color];
            const totalPrice = getPrice(plan.baseKey);
            const monthlyEquiv = getMonthlyEquiv(plan.baseKey);
            return (
              <div key={plan.id} className={`relative bg-white rounded-2xl border ${c.border} overflow-hidden flex flex-col transition-shadow hover:shadow-lg`}>
                {plan.badge && (
                  <div className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full ${c.badge}`}>
                    {plan.badge}
                  </div>
                )}
                <div className={`px-5 pt-5 pb-4 ${c.header}`}>
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{plan.name}</div>
                  {plan.disabled ? (
                    <div className="text-3xl font-black text-gray-700">Miễn phí</div>
                  ) : (
                    <div>
                      <div className="flex items-end gap-1">
                        <span className={`text-3xl font-black ${c.priceText}`}>₫{totalPrice.toLocaleString("vi-VN")}</span>
                      </div>
                      {dur.months > 1 ? (
                        <div className="text-xs text-gray-400 mt-1">
                          ≈ ₫{monthlyEquiv.toLocaleString("vi-VN")}/tháng · {dur.months} tháng
                        </div>
                      ) : (
                        <div className="text-xs text-gray-400 mt-1">/ tháng</div>
                      )}
                      {dur.discount > 0 && (
                        <div className="text-xs font-semibold text-emerald-600 mt-0.5">
                          🎉 Tiết kiệm {dur.discount}% so với tháng lẻ
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
                    disabled={plan.disabled}
                    className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all ${c.btn}`}
                  >
                    {plan.cta} {!plan.disabled && <ArrowRight className="inline w-3.5 h-3.5 ml-0.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Savings summary table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-12 overflow-x-auto">
          <h3 className="font-bold text-[#0a1628] mb-4 flex items-center gap-2"><Crown className="w-4 h-4 text-amber-500" /> So sánh tiết kiệm theo thời hạn – Gói Cơ bản (₫199.000/tháng)</h3>
          <table className="w-full text-sm min-w-[400px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 text-gray-500 font-medium">Thời hạn</th>
                <th className="text-center py-2 text-gray-500 font-medium">Giảm giá</th>
                <th className="text-center py-2 text-gray-500 font-medium">Giá/tháng</th>
                <th className="text-center py-2 text-gray-500 font-medium">Tổng thanh toán</th>
                <th className="text-center py-2 text-gray-500 font-medium">Tiết kiệm</th>
              </tr>
            </thead>
            <tbody>
              {DURATIONS.map(d => {
                const base = BASE_PRICES.basic;
                const total = Math.round(base * d.months * (1 - d.discount / 100) / 1000) * 1000;
                const perMonth = Math.round(total / d.months / 1000) * 1000;
                const saved = base * d.months - total;
                return (
                  <tr key={d.id} className={`border-b border-gray-50 ${selectedDuration === d.id ? "bg-blue-50" : ""}`}>
                    <td className="py-2.5 font-semibold text-[#0a1628]">
                      {d.label}
                      {selectedDuration === d.id && <span className="ml-2 text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded-full">Đang chọn</span>}
                    </td>
                    <td className="py-2.5 text-center">
                      {d.discount > 0 ? <span className="text-emerald-600 font-bold">-{d.discount}%</span> : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="py-2.5 text-center font-medium">₫{perMonth.toLocaleString("vi-VN")}</td>
                    <td className="py-2.5 text-center font-bold text-[#0a1628]">₫{total.toLocaleString("vi-VN")}</td>
                    <td className="py-2.5 text-center">
                      {saved > 0 ? <span className="text-emerald-600 font-semibold">₫{saved.toLocaleString("vi-VN")}</span> : <span className="text-gray-400">—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Why upgrade */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-10">
          <h2 className="text-xl font-bold text-[#0a1628] mb-6 text-center">Tại sao dùng gói trả phí?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: MessageCircle, color: "blue", title: "AI không giới hạn", desc: "Hỏi bao nhiêu cũng được, AI trả lời cụ thể theo hồ sơ cá nhân" },
              { icon: Target, color: "violet", title: "MyPlan cá nhân hoá", desc: "Lộ trình và danh sách việc cần làm tự động theo visa, tuổi, điểm số" },
              { icon: Sparkles, color: "amber", title: "EOI & CV tự động", desc: "Tạo EOI SkillSelect và CV chuẩn Úc chỉ bằng 1 nút bấm" },
              { icon: FileText, color: "emerald", title: "Biểu mẫu đầy đủ", desc: "Toàn bộ form visa chính thức, tự điền từ hồ sơ, xuất file PDF" },
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
              <h2 className="text-2xl font-bold text-[#0a1628]">Thanh toán – Gói {selectedPlan.name} · {dur.label}</h2>
              <p className="text-gray-500 mt-1">Tổng: <strong className="text-blue-600">₫{selectedPlan.totalAmount.toLocaleString("vi-VN")}</strong> · Kích hoạt trong 2–4 giờ</p>
            </div>
            <div className="max-w-md mx-auto space-y-4">
              {BANKS.map((bank, i) => <BankCard key={i} bank={bank} totalAmount={selectedPlan.totalAmount} />)}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                <p className="text-xs text-amber-700">
                  <strong>Nội dung CK:</strong> Ghi email + gói (VD: <em>email@gmail.com Basic 3T</em>)
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                <div className="font-semibold text-blue-800 text-sm mb-2">Sau khi chuyển khoản:</div>
                <ol className="space-y-1.5 text-xs text-blue-700">
                  <li className="flex items-start gap-2"><span className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-blue-700 mt-0.5">1</span>Chụp màn hình biên lai</li>
                  <li className="flex items-start gap-2"><span className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-blue-700 mt-0.5">2</span>Gửi email về <strong>admin@ucditru.ai</strong> kèm ảnh biên lai</li>
                  <li className="flex items-start gap-2"><span className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-blue-700 mt-0.5">3</span>Tài khoản kích hoạt trong <strong>2–4 giờ</strong></li>
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
            Có câu hỏi? <Link to={createPageUrl("Chat")} className="text-blue-600 font-medium hover:underline">Hỏi AI ngay</Link> · Email <a href="mailto:admin@ucditru.ai" className="text-blue-600 font-medium hover:underline">admin@ucditru.ai</a>
          </p>
          <p className="text-xs text-gray-300 mt-2">Thông tin mang tính tham khảo. Tạo bởi DVLong &amp; Genetic AI.</p>
        </div>
      </div>
    </div>
  );
}