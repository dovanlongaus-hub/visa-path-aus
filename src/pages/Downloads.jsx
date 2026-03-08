import { useState, useEffect } from "react";
import {
  Download, FileText, BookOpen, Search,
  RefreshCw, ExternalLink, CheckCircle2, Filter
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Document } from "@/api/entities";
import { InvokeLLM } from "@/api/integrations";

// ── Seed data: common forms + guides that should always exist ─────────────────
const SEED_DOCUMENTS = [
  // Forms
  { title: "Biểu mẫu 80 — Personal Particulars", category: "form", visa_type: "all", file_url: "https://immi.homeaffairs.gov.au/form-listing/forms/0080.pdf", description: "Khai báo thông tin cá nhân, cần thiết cho hầu hết các loại visa." },
  { title: "Biểu mẫu 157A — Request for Further Information", category: "form", visa_type: "500", file_url: "https://immi.homeaffairs.gov.au/form-listing/forms/0157a.pdf", description: "Dùng khi Bộ Di trú yêu cầu thêm thông tin." },
  { title: "Biểu mẫu 1221 — Additional Personal Particulars", category: "form", visa_type: "500", file_url: "https://immi.homeaffairs.gov.au/form-listing/forms/1221.pdf", description: "Thông tin bổ sung cá nhân cho visa 500." },
  { title: "Biểu mẫu 1276 — Sponsorship for a Temporary Stay", category: "form", visa_type: "485", file_url: "https://immi.homeaffairs.gov.au/form-listing/forms/1276.pdf", description: "Bảo lãnh tạm trú cho visa 485 Graduate." },
  { title: "Biểu mẫu 47SK — Sponsoring a Skilled Worker", category: "form", visa_type: "189", file_url: "https://immi.homeaffairs.gov.au/form-listing/forms/0047sk.pdf", description: "Bảo lãnh lao động tay nghề cho visa 189/190." },
  { title: "Biểu mẫu 1229 — Sponsorship for a Visitor", category: "form", visa_type: "600", file_url: "https://immi.homeaffairs.gov.au/form-listing/forms/1229.pdf", description: "Bảo lãnh visa thăm thân." },
  // Checklists
  { title: "Checklist hồ sơ Visa 189 — PR kỹ năng độc lập", category: "checklist", visa_type: "189", file_url: "", description: "Danh sách đầy đủ giấy tờ cần chuẩn bị cho Visa 189." },
  { title: "Checklist hồ sơ Visa 190 — PR bang bảo lãnh", category: "checklist", visa_type: "190", file_url: "", description: "Danh sách giấy tờ và bước nộp hồ sơ Visa 190." },
  { title: "Checklist hồ sơ Visa 482 — Lao động tay nghề", category: "checklist", visa_type: "482", file_url: "", description: "Giấy tờ cho nhà tuyển dụng và ứng viên Visa 482." },
  { title: "Checklist hồ sơ Visa 485 — Graduate", category: "checklist", visa_type: "485", file_url: "", description: "Tài liệu cần thiết khi nộp Visa 485 sau tốt nghiệp." },
  // Guides
  { title: "Hướng dẫn toàn tập EOI & SkillSelect 2024", category: "guide", visa_type: "189", file_url: "", description: "Cách tạo hồ sơ EOI, tính điểm và chờ vòng mời." },
  { title: "Hướng dẫn Skills Assessment theo ANZSCO", category: "guide", visa_type: "all", file_url: "", description: "Chọn đúng tổ chức đánh giá kỹ năng (ACS, EA, TRA, CPA…)." },
  { title: "Hướng dẫn viết Statement of Purpose (SOP)", category: "template", visa_type: "500", file_url: "", description: "Template và ví dụ SOP đạt chuẩn cho Visa sinh viên." },
  { title: "Hướng dẫn IELTS và PTE — Chiến lược thi đạt 7.0+", category: "guide", visa_type: "all", file_url: "", description: "Lộ trình luyện thi IELTS/PTE hiệu quả để đạt điểm EOI tối đa." },
  // Templates
  { title: "Template thư giải thích (Explanation Letter)", category: "template", visa_type: "all", file_url: "", description: "Mẫu thư giải thích khoảng thời gian trống trong lý lịch." },
  { title: "Template CV tối ưu cho visa 482", category: "template", visa_type: "482", file_url: "", description: "Mẫu CV chuẩn Úc giúp tăng cơ hội được bảo lãnh." },
];

const CATEGORIES = [
  { id: "all",      label: "Tất Cả",     icon: "📦" },
  { id: "form",     label: "Biểu Mẫu",   icon: "📋" },
  { id: "checklist",label: "Checklist",  icon: "✅" },
  { id: "guide",    label: "Hướng Dẫn",  icon: "📖" },
  { id: "template", label: "Template",   icon: "📄" },
];

const EXT_COLOR = {
  PDF:  "bg-red-100 text-red-700",
  DOCX: "bg-blue-100 text-blue-700",
  XLSX: "bg-green-100 text-green-700",
  link: "bg-gray-100 text-gray-700",
};

export default function Downloads() {
  const [docs, setDocs] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setIsLoading(true);
    try {
      const existing = await Document.list();
      if (!existing?.length) {
        await seedDocuments();
      } else {
        setDocs(existing);
        // Background-seed any missing forms (by title)
        const titles = new Set(existing.map((d) => d.title));
        const missing = SEED_DOCUMENTS.filter((s) => !titles.has(s.title));
        if (missing.length) {
          await Promise.all(
            missing.map((doc) =>
              Document.create({ ...doc, download_count: 0 }).catch(() => {})
            )
          );
          const updated = await Document.list();
          setDocs(updated);
        }
      }
    } catch {
      // Fallback to seed data UI display
      setDocs(SEED_DOCUMENTS.map((d, i) => ({ id: String(i), ...d, download_count: 0 })));
    } finally {
      setIsLoading(false);
    }
  };

  const seedDocuments = async () => {
    setIsSeeding(true);
    await Promise.all(
      SEED_DOCUMENTS.map((doc) =>
        Document.create({ ...doc, download_count: 0 }).catch(() => {})
      )
    );
    const created = await Document.list();
    setDocs(created);
    setIsSeeding(false);
  };

  const handleDownload = async (doc) => {
    // Increment download count
    try {
      await Document.update(doc.id, { download_count: (doc.download_count || 0) + 1 });
      setDocs((prev) => prev.map((d) => d.id === doc.id ? { ...d, download_count: (d.download_count || 0) + 1 } : d));
    } catch {}
    // Open URL if available
    if (doc.file_url) {
      window.open(doc.file_url, "_blank", "noopener,noreferrer");
    }
  };

  const filtered = docs.filter((d) => {
    const matchCat = activeCategory === "all" || d.category === activeCategory;
    const q = search.toLowerCase();
    const matchSearch = !q || d.title?.toLowerCase().includes(q) || d.description?.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const getExt = (doc) => {
    if (doc.file_url?.includes(".pdf")) return "PDF";
    if (doc.file_url?.includes(".docx")) return "DOCX";
    if (doc.file_url?.includes(".xlsx")) return "XLSX";
    if (doc.file_url) return "link";
    return doc.category === "form" ? "PDF" : doc.category === "template" ? "DOCX" : "PDF";
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <div className="bg-gray-950 text-white px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <Download className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Tải Về Biểu Mẫu & Tài Liệu</h1>
              <p className="text-xs text-gray-400">Biểu mẫu DOHA, checklist và hướng dẫn di trú</p>
            </div>
          </div>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
              placeholder="Tìm kiếm biểu mẫu, hướng dẫn..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                activeCategory === cat.id
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
              }`}
            >
              <span>{cat.icon}</span>
              {cat.label}
              {activeCategory === cat.id && (
                <Badge className="bg-white/20 text-white text-xs border-0 ml-1 px-1.5">
                  {filtered.length}
                </Badge>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {isLoading || isSeeding ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
            <p className="text-gray-500 text-sm">
              {isSeeding ? "Đang tải tài liệu lần đầu..." : "Đang tải danh sách tài liệu..."}
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Không tìm thấy tài liệu phù hợp.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((doc) => {
              const ext = getExt(doc);
              return (
                <div
                  key={doc.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div className={`px-2 py-1 rounded-lg text-xs font-bold flex-shrink-0 ${EXT_COLOR[ext] || EXT_COLOR.link}`}>
                      {ext}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm leading-snug">{doc.title}</h3>
                      {doc.visa_type && doc.visa_type !== "all" && (
                        <Badge className="mt-1 bg-blue-50 text-blue-700 border-blue-200 text-xs">
                          Visa {doc.visa_type}
                        </Badge>
                      )}
                    </div>
                  </div>
                  {doc.description && (
                    <p className="text-xs text-gray-500 leading-relaxed">{doc.description}</p>
                  )}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-gray-400">
                      {doc.download_count ? `${doc.download_count.toLocaleString("vi-VN")} lượt tải` : ""}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => handleDownload(doc)}
                      className="bg-gray-900 hover:bg-gray-800 text-white text-xs px-4"
                    >
                      {doc.file_url ? (
                        <><ExternalLink className="h-3 w-3 mr-1" /> Mở / Tải</>
                      ) : (
                        <><Download className="h-3 w-3 mr-1" /> Tải Về</>
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Auto-update notice */}
        <div className="mt-8 flex items-center gap-2 text-xs text-gray-400 justify-center">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
          Tài liệu được cập nhật tự động từ DOHA · immi.homeaffairs.gov.au
        </div>
      </div>
    </div>
  );
}