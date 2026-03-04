import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { GraduationCap, Award, Star, ArrowRight, BookOpen } from "lucide-react";

const PATHWAYS = [
  {
    icon: GraduationCap,
    color: "from-blue-500 to-blue-700",
    bgLight: "bg-blue-50",
    border: "border-blue-200",
    title: "Đang cân nhắc học tại Úc",
    subtitle: "Đại học / Thạc sĩ / Tiến sĩ",
    desc: "Từ visa sinh viên 500 → tốt nghiệp 485 → làm việc → PR 189/190. Hướng dẫn chọn ngành, trường và lộ trình rõ ràng nhất.",
    steps: ["Visa 500 – Sinh viên", "Chọn ngành phù hợp CSOL", "Visa 485 sau tốt nghiệp", "PR theo lộ trình skilled"],
    cta: "Xem lộ trình",
    link: "Roadmap",
  },
  {
    icon: Award,
    color: "from-violet-500 to-violet-700",
    bgLight: "bg-violet-50",
    border: "border-violet-200",
    title: "Đã có thành tích nổi bật quốc tế",
    subtitle: "Visa 858 – National Innovation Visa",
    desc: "PR ngay lập tức, không qua visa tạm thời. Dành cho nhân tài trong nghề nghiệp, nghiên cứu, thể thao, nghệ thuật được công nhận quốc tế.",
    steps: ["Nộp EOI (miễn phí)", "Được invited bởi DIBP", "Chuẩn bị hồ sơ thành tích", "PR ngay khi được chấp thuận"],
    cta: "Tìm hiểu Visa 858",
    link: "Visa858",
    highlight: true,
  },
  {
    icon: Star,
    color: "from-emerald-500 to-emerald-700",
    bgLight: "bg-emerald-50",
    border: "border-emerald-200",
    title: "Đã có employer tại Úc",
    subtitle: "Visa 482 → 186 TRT → PR",
    desc: "Được employer Úc bảo lãnh Visa 482 (2–4 năm) rồi chuyển đổi sang PR qua Visa 186 TRT sau 2 năm làm việc cùng employer.",
    steps: ["Employer nộp hồ sơ bảo lãnh", "Visa 482 (2–4 năm)", "Làm việc 2 năm cùng employer", "Nộp Visa 186 TRT → PR"],
    cta: "Xem chi tiết Visa 482",
    link: "Visa482",
  },
  {
    icon: BookOpen,
    color: "from-amber-500 to-amber-700",
    bgLight: "bg-amber-50",
    border: "border-amber-200",
    title: "Đang cân nhắc chọn ngành học",
    subtitle: "Tư vấn ngành → nghề → visa",
    desc: "Chưa biết chọn ngành nào có nhiều cơ hội visa nhất? Công cụ tư vấn ngành học → vị trí phù hợp → lương TSMIT → visa được approve.",
    steps: ["Nhập ngành đang học", "Xem vị trí nghề phù hợp", "Kiểm tra yêu cầu visa/lương", "Lên kế hoạch sớm từ năm 1"],
    cta: "Tư vấn ngành học",
    link: "Visa482",
  },
];

export default function PathwayCards() {
  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-[#0a1628] mb-2">Bạn đang ở tình huống nào?</h2>
        <p className="text-gray-500">Chọn tình huống phù hợp để nhận hướng dẫn cụ thể nhất</p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {PATHWAYS.map((p, i) => {
          const Icon = p.icon;
          return (
            <div key={i} className={`relative bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-md transition-all ${p.highlight ? "border-violet-300 ring-2 ring-violet-100" : p.border}`}>
              {p.highlight && (
                <div className="absolute top-3 right-3 text-xs bg-yellow-400 text-yellow-900 font-bold px-2 py-0.5 rounded-full">
                  ⭐ Visa ưu tiên đặc biệt
                </div>
              )}

              <div className={`h-2 bg-gradient-to-r ${p.color}`} />

              <div className="p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-[#0a1628]">{p.title}</div>
                    <div className="text-xs text-gray-500">{p.subtitle}</div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4 leading-relaxed">{p.desc}</p>

                <div className={`rounded-xl p-3 mb-4 ${p.bgLight}`}>
                  <div className="text-xs font-semibold text-gray-500 mb-2">Lộ trình nhanh:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {p.steps.map((step, j) => (
                      <div key={j} className="flex items-center gap-1">
                        <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded-lg border border-gray-100 shadow-sm">{step}</span>
                        {j < p.steps.length - 1 && <ArrowRight className="w-3 h-3 text-gray-300 flex-shrink-0" />}
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  to={createPageUrl(p.link)}
                  className={`inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2.5 rounded-xl bg-gradient-to-r ${p.color} text-white hover:opacity-90 transition-opacity`}
                >
                  {p.cta} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}