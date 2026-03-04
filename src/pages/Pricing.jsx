import { useState } from "react";
import { Check, Zap, Star, Crown, Copy, CheckCircle, ArrowRight, Shield, MessageCircle, FileText, Sparkles, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const PLANS = [
  {
    id: "free",
    name: "Miễn phí",
    price: "0",
    unit: "",
    badge: null,
    color: "gray",
    features: [
      "3 câu hỏi AI miễn phí",
      "Xem lộ trình PR tổng quan",
      "Checklist cơ bản",
      "Thông tin visa công khai",
    ],
    locked: [
      "Tư vấn AI không giới hạn",
      "Kế hoạch cá nhân (MyPlan)",
      "Tạo EOI & CV tự động",
      "Biểu mẫu di trú đầy đủ",
    ],
    cta: "Đang dùng",
    ctaLink: "Chat",
    disabled: true,
  },
  {
    id: "monthly",
    name: "Cơ bản",
    price: "29",
    unit: "AUD / tháng",
    badge: "Phổ biến nhất",
    color: "blue",
    features: [
      "Tư vấn AI không giới hạn",
      "Kế hoạch cá nhân (MyPlan AI)",
      "Lộ trình tùy biến theo hồ sơ",
      "Tạo EOI & CV tự động",
      "Biểu mẫu di trú đầy đủ",
      "Cảnh báo & nhắc nhở thông minh",
      "Upload & phân tích CV",
      "Lịch sử hội thoại lưu trữ",
    ],
    locked: [],
    cta: "Đăng ký ngay",
    ctaLink: "Checkout",
    amount: 29,
    disabled: false,
  },
  {
    id: "oneoff",
    name: "Tư vấn chuyên sâu",
    price: "99",
    unit: "AUD / 1 lần",
    badge: "Tốt nhất",
    color: "violet",
    features: [
      "Tất cả tính năng Cơ bản",
      "1 buổi phân tích AI sâu toàn diện",
      "Báo cáo lộ trình PDF cá nhân hoá",
      "Review hồ sơ EOI/Skills Assessment",
      "Gợi ý tiểu bang phù hợp nhất",
      "Checklist tuỳ chỉnh theo ngành",
      "Hỗ trợ ưu tiên 30 ngày",
    ],
    locked: [],
    cta: "Mua ngay",
    ctaLink: "Checkout",
    amount: 99,
    disabled: false,
  },
];

// ── Bank Transfer Details ──────────────────────────────────────
const BANKS = [
  {
    flag: "🇦🇺",
    label: "Tài khoản Úc",
    bank: "Commonwealth Bank (CBA)",
    fields: [
      { label: "Ngân hàng", value: "Commonwealth Bank (CBA)" },
      { label: "BSB", value: "067 873", copy: "067873" },
      { label: "Số tài khoản", value: "1154 7224", copy: "11547224" },
      { label: "Tên tài khoản", value: "Van Long DO" },
    ],
  },
  {
    flag: "🇻🇳",
    label: "Tài khoản Việt Nam",
    bank: "Vietcombank (VCB)",
    fields: [
      { label: "Ngân hàng", value: "Vietcombank (VCB)" },
      { label: "Số tài khoản", value: "0071000985789", copy: "0071000985789" },
      { label: "Tên tài khoản", value: "Đỗ Văn Long" },
    ],
  },
];

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="text-gray-400 hover:text-blue-600 transition-colors ml-2">
      {copied ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
    </button>
  );
}

// QR code using Google Charts API (no extra package needed)
function QRCode({ data, size = 160 }) {
  const encoded = encodeURIComponent(data);
  const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}&margin=10`;
  return (
    <img src={url} alt="QR chuyển khoản" width={size} height={size} className="rounded-xl border border-gray-200 shadow-sm" />
  );
}

function BankCard({ bank, plan }) {
  const [showQR, setShowQR] = useState(false);

  // Build QR data per bank type
  const qrData = bank.qr
    ? bank.qr(plan)
    : `${bank.bank}\n${bank.fields.find(f => f.label === "Số tài khoản")?.value || ""}`;

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
        <button
          onClick={() => setShowQR(!showQR)}
          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all border ${showQR ? "bg-blue-600 text-white border-blue-600" : "border-blue-200 text-blue-600 hover:bg-blue-50"}`}
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            <rect x="5" y="5" width="3" height="3" fill="currentColor" stroke="none"/>
            <rect x="16" y="5" width="3" height="3" fill="currentColor" stroke="none"/>
            <rect x="5" y="16" width="3" height="3" fill="currentColor" stroke="none"/>
            <path d="M14 14h3v3h-3zM17 17h3v3h-3zM14 20h3"/>
          </svg>
          {showQR ? "Ẩn QR" : "Quét QR"}
        </button>
      </div>

      {showQR && (
        <div className="flex flex-col items-center gap-2 py-4 mb-3 bg-gray-50 rounded-xl border border-gray-100">
          <QRCode data={qrData} size={180} />
          <p className="text-xs text-gray-500 text-center px-4">
            📱 Mở app ngân hàng → Quét QR → Kiểm tra thông tin → Xác nhận
          </p>
          {plan && (
            <div className="flex items-center gap-2 bg-white border border-blue-200 rounded-lg px-4 py-2">
              <span className="text-xs text-gray-500">Số tiền:</span>
              <span className="text-sm font-black text-blue-600">
                {bank.flag === "🇦🇺" ? `AUD ${plan.amount}` : `VND (tương đương AUD ${plan.amount})`}
              </span>
            </div>
          )}
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

function BankTransferCard({ plan }) {
  return (
    <div className="space-y-4">
      {BANKS.map((bank, i) => <BankCard key={i} bank={bank} plan={plan} />)}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
        <p className="text-xs text-amber-700">
          <strong>Nội dung chuyển khoản:</strong> Ghi email + gói dịch vụ (ví dụ: <em>nguyenvana@email.com Monthly</em>).
          Tài khoản được kích hoạt trong vòng <strong>2–4 giờ</strong> sau khi nhận thanh toán.
        </p>
      </div>
    </div>
  );
}

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  const colorMap = {
    gray:   { border: "border-gray-200",   badge: "",                            btn: "bg-gray-100 text-gray-500",           header: "bg-gray-50" },
    blue:   { border: "border-blue-400 ring-2 ring-blue-100", badge: "bg-blue-600 text-white", btn: "bg-blue-600 text-white hover:bg-blue-700", header: "bg-gradient-to-br from-blue-50 to-indigo-50" },
    violet: { border: "border-violet-400 ring-2 ring-violet-100", badge: "bg-violet-600 text-white", btn: "bg-violet-600 text-white hover:bg-violet-700", header: "bg-gradient-to-br from-violet-50 to-purple-50" },
  };

  const handleSelect = (plan) => {
    if (plan.disabled) return;
    setSelectedPlan(plan);
    setShowPayment(true);
    setTimeout(() => document.getElementById("payment-section")?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      <div className="max-w-5xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 text-sm text-blue-700 mb-4">
            <Shield className="w-4 h-4" /> Nền tảng tư vấn di trú Úc cho người Việt
          </div>
          <h1 className="text-4xl font-black text-[#0a1628] mb-3">Chọn gói phù hợp với bạn</h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">Bắt đầu miễn phí, nâng cấp khi cần tư vấn chuyên sâu hơn</p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {PLANS.map(plan => {
            const c = colorMap[plan.color];
            return (
              <div key={plan.id} className={`relative bg-white rounded-2xl border ${c.border} overflow-hidden flex flex-col`}>
                {plan.badge && (
                  <div className={`absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full ${c.badge}`}>
                    {plan.badge}
                  </div>
                )}
                <div className={`px-6 pt-6 pb-4 ${c.header}`}>
                  <div className="text-sm font-semibold text-gray-500 mb-1">{plan.name}</div>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-black text-[#0a1628]">{plan.price === "0" ? "Miễn phí" : `$${plan.price}`}</span>
                    {plan.unit && <span className="text-sm text-gray-400 mb-1">{plan.unit}</span>}
                  </div>
                </div>

                <div className="px-6 py-4 flex-1">
                  <ul className="space-y-2.5">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                    {plan.locked.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-300 line-through">
                        <Check className="w-4 h-4 text-gray-200 flex-shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="px-6 pb-6">
                  <button
                    onClick={() => handleSelect(plan)}
                    disabled={plan.disabled}
                    className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${c.btn} ${plan.disabled ? "cursor-default" : "hover:opacity-90 hover:-translate-y-0.5"}`}
                  >
                    {plan.cta} {!plan.disabled && <ArrowRight className="inline w-4 h-4 ml-1" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* What's included section */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-10">
          <h2 className="text-xl font-bold text-[#0a1628] mb-6 text-center">Tại sao dùng gói trả phí?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: MessageCircle, color: "blue", title: "AI không giới hạn", desc: "Hỏi bao nhiêu cũng được, AI trả lời cụ thể theo hồ sơ cá nhân bạn" },
              { icon: Target, color: "violet", title: "MyPlan cá nhân hoá", desc: "Danh sách việc cần làm và lộ trình tự động theo visa, tuổi, điểm số" },
              { icon: Sparkles, color: "amber", title: "EOI & CV tự động", desc: "Tạo EOI SkillSelect và CV chuẩn Úc chỉ bằng 1 nút bấm" },
              { icon: FileText, color: "emerald", title: "Biểu mẫu đầy đủ", desc: "Toàn bộ form visa chính thức, tự điền từ hồ sơ, xuất file PDF" },
            ].map((item, i) => {
              const Icon = item.icon;
              const bg = { blue: "bg-blue-100 text-blue-600", violet: "bg-violet-100 text-violet-600", amber: "bg-amber-100 text-amber-600", emerald: "bg-emerald-100 text-emerald-600" }[item.color];
              return (
                <div key={i} className="text-center">
                  <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center mx-auto mb-3`}>
                    <Icon className="w-6 h-6" />
                  </div>
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
              <h2 className="text-2xl font-bold text-[#0a1628]">Thanh toán – Gói {selectedPlan.name}</h2>
              <p className="text-gray-500 mt-1">Chuyển khoản ngân hàng Úc · Kích hoạt trong 2–4 giờ</p>
            </div>
            <div className="max-w-md mx-auto">
              <BankTransferCard plan={selectedPlan} />

              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-2xl p-4">
                <div className="font-semibold text-blue-800 text-sm mb-2">Sau khi chuyển khoản:</div>
                <ol className="space-y-1.5 text-xs text-blue-700">
                  <li className="flex items-start gap-2"><span className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-blue-700 mt-0.5">1</span>Chụp màn hình biên lai chuyển khoản</li>
                  <li className="flex items-start gap-2"><span className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-blue-700 mt-0.5">2</span>Gửi email về <strong>admin@ucditru.ai</strong> kèm email đăng ký và ảnh biên lai</li>
                  <li className="flex items-start gap-2"><span className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-blue-700 mt-0.5">3</span>Tài khoản sẽ được kích hoạt trong <strong>2–4 giờ</strong></li>
                </ol>
              </div>

              <button
                onClick={() => setShowPayment(false)}
                className="w-full mt-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        )}

        {/* FAQ */}
        <div className="text-center">
          <p className="text-sm text-gray-400">
            Có câu hỏi? <Link to={createPageUrl("Chat")} className="text-blue-600 font-medium hover:underline">Hỏi AI ngay</Link> · Hoặc email <a href="mailto:admin@ucditru.ai" className="text-blue-600 font-medium hover:underline">admin@ucditru.ai</a>
          </p>
          <p className="text-xs text-gray-300 mt-2">Thông tin chỉ mang tính tham khảo. Tạo bởi DVLong &amp; Genetic AI.</p>
        </div>
      </div>
    </div>
  );
}