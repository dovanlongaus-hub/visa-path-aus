import { Link } from "react-router-dom";
import { BookOpen, Download, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";

const ARTICLES = [
  { title: "Hướng dẫn toàn tập Visa 189 — Skilled Independent", tag: "PR" },
  { title: "Skills Assessment 2024: Nộp ở đâu & mất bao lâu?", tag: "Kỹ năng" },
  { title: "Tăng điểm EOI lên 90+ — Chiến lược chi tiết", tag: "EOI" },
];

const DOCUMENTS = [
  { title: "Biểu mẫu 80 — Personal Particulars", ext: "PDF" },
  { title: "Checklist hồ sơ Visa 190", ext: "PDF" },
  { title: "Template thư giải thích (SOP)", ext: "DOCX" },
];

export default function RecommendedContent() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Articles */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Bài Viết Nổi Bật</h3>
          </div>
          <Link to={createPageUrl("Guide")}>
            <Button size="sm" variant="ghost" className="text-gray-500">
              Tất cả <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </Link>
        </div>
        <div className="space-y-3">
          {ARTICLES.map((a, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
              <span className="text-xs bg-gray-200 text-gray-600 font-semibold px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5">
                {a.tag}
              </span>
              <p className="text-sm text-gray-700 font-medium leading-snug">{a.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Documents */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Download className="h-5 w-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Tài Liệu Tải Về</h3>
          </div>
          <Link to={createPageUrl("Downloads")}>
            <Button size="sm" variant="ghost" className="text-gray-500">
              Tất cả <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </Link>
        </div>
        <div className="space-y-3">
          {DOCUMENTS.map((d, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                d.ext === "PDF" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
              }`}>
                {d.ext}
              </span>
              <p className="text-sm text-gray-700 font-medium leading-snug flex-1">{d.title}</p>
              <Download className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}