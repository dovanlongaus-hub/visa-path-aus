import { useState } from "react";
import {
  Zap, Star, Crown, Gift, CreditCard, CheckCircle2,
  Info, MessageCircle, FileText, BrainCircuit, Clock,
  QrCode, Building2, Banknote, ChevronDown, ChevronUp,
  Users, Database, Award, TrendingUp, HelpCircle, X
} from "lucide-react";

// ─── Constants ──────────────────────────────────────────────────────────────
const CREDIT_PACKS = [
  {
    id: "starter",
    name: "Gói Khởi Đầu",
    credits: 30,
    price: 29000,
    priceUSD: null,
    icon: Zap,
    color: "from-blue-400 to-blue-600",
    badge: null,
    perCredit: 967,
    highlight: false,
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
    priceUSD: null,
    icon: Star,
    color: "from-emerald-400 to-emerald-600",
    badge: "Phổ biến nhất",
    perCredit: 790,
    highlight: true,
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
    priceUSD: null,
    icon: Crown,
    color: "from-purple-400 to-purple-600",
    badge: "Tiết kiệm 32%",
    perCredit: 663,
    highlight: false,
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
    priceUSD: null,
    icon: Gift,
    color: "from-amber-400 to-orange-500",
    badge: "Tiết kiệm 48%",
    perCredit: 499,
    highlight: false,
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

// ─── Sub-components ──────────────────────────────────────────────────────────
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
        <div
          className={`absolute top-0 right-0 bg-gradient-to-r ${pack.color} text-white text-xs font-bold px-3 py-1 rounded-bl-xl`}
        >
          {pack.badge}
        </div>
      )}
      <div className={`bg-gradient-to-r ${pack.color} p-5`}>
        <Icon className="w-8 h-8 text-white mb-2" />
        <h3 className="text-white font-bold text-lg">{pack.name}</h3>
        <div className="flex items-end gap-1 mt-1">
          <span className="text-white text-3xl font-extrabold">
            {pack.credits.toLocaleString()}
          </span>
          <span className="text-white/80 text-sm mb-1">tín dụng</span>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-baseline justify-between mb-4">
          <span className="text-2xl font-bold text-gray-900">
            {pack.price.toLocaleString("vi-VN")}₫
          </span>
          <span className="text-sm text-gray-500">
            ≈ {pack.perCredit.toLocaleString()}₫/lượt
          </span>
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

function PaymentModal({ pack, onClose }) {
  const [bank, setBank] = useState("cba");
  const selected = BANK_ACCOUNTS.find((b) => b.id === bank);
  const ref = `VISA${Date.now().toString().slice(-6)}${Math.random().toString(36).slice(2, 5).toUpperCase()}`;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="font-bold text-lg text-gray-900">
            Thanh toán – {pack.name}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          {/* Summary */}
          <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center">
            <div>
              <p className="font-semibold text-gray-900">{pack.name}</p>
              <p className="text-sm text-gray-500">{pack.credits} tín dụng tư vấn</p>
            </div>
            <span className="text-xl font-bold text-emerald-600">
              {pack.price.toLocaleString("vi-VN")}₫
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
                    bank === b.id
                      ? "border-emerald-400 bg-emerald-50"
                      : "border-gray-200 hover:border-gray-300"
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
              <span className="font-bold text-emerald-700">
                {pack.price.toLocaleString("vi-VN")}₫
              </span>
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

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function Pricing() {
  const [selectedPack, setSelectedPack] = useState(null);
  const [showBreakdown, setShowBreakdown] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      {/* Header */}
      <div className="text-center py-14 px-4">
        <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
          <Zap className="w-3.5 h-3.5" /> Thanh toán theo nhu cầu thực tế
        </span>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
          Trả tiền theo những gì bạn dùng
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Không mất phí cố định hàng tháng. Mua tín dụng một lần, sử dụng khi cần.
          Mỗi tín dụng = 1 lượt tư vấn AI về visa, lộ trình, hồ sơ.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-16 space-y-14">
        {/* Credit Pack Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CREDIT_PACKS.map((pack) => (
            <CreditPackCard key={pack.id} pack={pack} onSelect={setSelectedPack} />
          ))}
        </div>

        {/* Free tier note */}
        <div className="flex items-center justify-center gap-3 text-sm text-gray-600 bg-white border border-gray-200 rounded-xl p-4 max-w-lg mx-auto">
          <Gift className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          <span>
            <strong>Miễn phí:</strong> 5 câu hỏi AI mỗi ngày, xem lộ trình cơ bản,
            tra cứu Knowledge Base – không cần đăng nhập.
          </span>
        </div>

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
                      <div
                        className="bg-emerald-500 h-2 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
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
              q: "Tín dụng có hết hạn không?",
              a: "Có, mỗi gói có thời hạn từ 30–365 ngày. Tuy nhiên tín dụng chưa dùng hết sẽ được bảo lưu thêm 30 ngày sau khi hết hạn.",
            },
            {
              q: "Tôi có thể xem lịch sử sử dụng không?",
              a: "Có. Vào Cài đặt > Lịch sử tín dụng để xem chi tiết từng lượt tư vấn đã tiêu thụ.",
            },
            {
              q: "Có hoàn tiền nếu tôi không dùng không?",
              a: "Chúng tôi hoàn tiền 100% trong vòng 7 ngày nếu bạn chưa sử dụng bất kỳ tín dụng nào.",
            },
          ].map(({ q, a }) => (
            <FAQItem key={q} q={q} a={a} />
          ))}
        </div>
      </div>

      {/* Payment Modal */}
      {selectedPack && (
        <PaymentModal pack={selectedPack} onClose={() => setSelectedPack(null)} />
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