// Testimonials.jsx - Social proof component
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Anh Minh T.",
    role: "IT Engineer, Melbourne",
    visa: "Visa 189 — Đã nhận Invitation",
    quote: "Nhờ EOI Calculator của visa-path-aus, tôi biết chính xác cần thêm 5 điểm nữa. Sau 3 tháng cải thiện IELTS, tôi nhận invitation 189 với 80 điểm!",
    avatar: "MT",
    stars: 5,
    color: "from-blue-500 to-blue-600",
  },
  {
    name: "Chị Linh N.",
    role: "Registered Nurse, Sydney",
    visa: "Visa 190 NSW — Đang xử lý",
    quote: "Trước đây tôi rất mơ hồ về quy trình ANMAC assessment. Document Tracker giúp tôi không bỏ sót bất kỳ giấy tờ nào. Hồ sơ của tôi hiện đang ở bước cuối cùng!",
    avatar: "LN",
    stars: 5,
    color: "from-emerald-500 to-emerald-600",
  },
  {
    name: "Anh Hoàng D.",
    role: "Accountant, Brisbane",
    visa: "Visa 482 → 186 — Đang chuyển đổi",
    quote: "AI Chat trả lời được những câu hỏi rất cụ thể về case của tôi. Tiết kiệm được hàng triệu đồng tư vấn agent mà vẫn tự tin về hồ sơ.",
    avatar: "HD",
    stars: 5,
    color: "from-violet-500 to-violet-600",
  },
];

export default function Testimonials() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
          <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
          Câu chuyện thành công
        </div>
        <h2 className="text-2xl font-bold text-[#0a1628] mb-2">Người Việt đã thành công với visa-path-aus</h2>
        <p className="text-gray-500">Dựa trên trải nghiệm thực tế của cộng đồng người dùng</p>
      </div>
      <div className="grid md:grid-cols-3 gap-5">
        {testimonials.map((t, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-1">
              {[...Array(t.stars)].map((_, j) => (
                <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <div className="relative">
              <Quote className="w-6 h-6 text-gray-200 absolute -top-1 -left-1" />
              <p className="text-gray-600 text-sm leading-relaxed pl-4 italic">"{t.quote}"</p>
            </div>
            <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-50">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                {t.avatar}
              </div>
              <div>
                <p className="font-semibold text-[#0a1628] text-sm">{t.name}</p>
                <p className="text-xs text-gray-400">{t.role}</p>
                <span className="inline-block mt-1 text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">{t.visa}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
