import { useState } from "react";
import { ExternalLink, ChevronDown, ChevronUp, Newspaper, AlertCircle, TrendingUp, Clock } from "lucide-react";

const NEWS = [
  {
    id: 1,
    date: "01/03/2026",
    tag: "Visa 485",
    tagColor: "violet",
    urgent: true,
    title: "Visa 485 tăng phí mạnh từ 1/3/2026 – áp dụng ngay lập tức",
    summary: "Phí nộp Visa 485 (Temporary Graduate) tăng lên AUD 4,600 cho người nộp chính và AUD 2,300 cho người đi kèm ≥18 tuổi, áp dụng với tất cả hồ sơ nộp từ 01/3/2026. Đây là tăng ngoài chu kỳ thông thường (1/7), theo lệnh sửa đổi Migration Amendment Regulations 2026.",
    detail: "Các mức phí mới (hiệu lực từ 1/3/2026):\n• Người nộp chính: AUD 4,600 (trước đây thấp hơn)\n• Người đi kèm ≥18 tuổi: AUD 2,300\n• Người đi kèm <18 tuổi: AUD 1,160\n• Đối với visa 485 lần 2 (Post-Higher Education Work stream): AUD 1,810\n\nLưu ý: Nếu nộp trước 1/3/2026 sẽ được áp dụng mức phí cũ (thấp hơn).",
    source: "Migration Alliance / DIBP",
    sourceUrl: "https://migrationalliance.com.au/immigration-daily-news/entry/2026-03-migration-amendment-temporary-graduate-visa-application-charge-regulations-2026.html",
  },
  {
    id: 2,
    date: "06/12/2024",
    tag: "Visa 858",
    tagColor: "yellow",
    urgent: false,
    title: "Global Talent Visa đóng cửa – National Innovation Visa (858) chính thức thay thế",
    summary: "Bộ Di trú Úc (DIBP) chính thức đóng cửa Global Talent Visa từ ngày 6/12/2024. National Innovation Visa (subclass 858) là visa thay thế, dành cho những cá nhân có thành tích nổi bật quốc tế trong nghề nghiệp, thể thao, nghệ thuật và nghiên cứu.",
    detail: "Những điểm khác biệt chính của NIV 858:\n• PR ngay lập tức (không qua visa tạm thời)\n• Không giới hạn tuổi\n• Cần nominator tại Úc\n• Nộp EOI → Được invited → Nộp chính thức\n• Phí từ AUD 4,985\n• Không yêu cầu skills assessment chính thức",
    source: "DIBP – immi.homeaffairs.gov.au",
    sourceUrl: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/national-innovation-visa-858",
  },
  {
    id: 3,
    date: "01/07/2024",
    tag: "Visa 485",
    tagColor: "violet",
    urgent: false,
    title: "Visa 485 tăng thời gian đáng kể từ 1/7/2024",
    summary: "Chính phủ Úc tăng thời hạn Visa 485 lên gần gấp đôi từ 1/7/2024 theo Migration Strategy mới. Cụ thể: bằng đại học tăng lên 4 năm (trước: 2 năm), bằng thạc sĩ/tiến sĩ tăng lên 5 năm; sinh viên học tại vùng địa phương được cộng thêm 2 năm.",
    detail: "Thay đổi cụ thể từ 1/7/2024:\n• Bằng bachelor (đại học): 4 năm (tăng từ 2 năm)\n• Bằng master/PhD: 5 năm (tăng từ 3-4 năm)\n• Học tại vùng địa phương (regional): +2 năm\n• Học tại Great Metropolitan Area (Sydney, Melbourne...): không được cộng thêm\n\nÁp dụng cho cả đơn nộp mới và một số trường hợp đang xét duyệt.",
    source: "DIBP – immi.homeaffairs.gov.au",
    sourceUrl: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/temporary-graduate-485/changes",
  },
  {
    id: 4,
    date: "01/07/2025",
    tag: "TSMIT",
    tagColor: "emerald",
    urgent: false,
    title: "TSMIT Visa 482 tăng lên AUD 76,515 từ 1/7/2025",
    summary: "Temporary Skilled Migration Income Threshold (TSMIT) tăng lên AUD 76,515/năm từ 1/7/2025 (từ $73,150 trước đó). Tất cả sponsor phải trả lương ≥ TSMIT cho holder Visa 482 Core Skills. Dự kiến tăng tiếp lên $79,499 từ 1/7/2026.",
    detail: "Lộ trình TSMIT:\n• 2023-2024: AUD 70,000\n• 2024-2025: AUD 73,150\n• 2025-2026 (hiện tại): AUD 76,515\n• 2026-2027 (dự kiến): AUD 79,499\n\nLưu ý: TSMIT chỉ áp dụng cho 482 Core Skills stream. Specialist Skills stream yêu cầu lương ≥ SSIT (AUD 141,210 hiện tại).",
    source: "DIBP – Skilled Migration Income Threshold",
    sourceUrl: "https://immi.homeaffairs.gov.au/visas/working-in-australia/salary-requirements",
  },
  {
    id: 5,
    date: "Tháng 3/2026",
    tag: "CSOL",
    tagColor: "blue",
    urgent: false,
    title: "Bộ Di trú sẽ công bố revised Core Skills Occupation List (CSOL) mới",
    summary: "Bộ Di trú Úc dự kiến công bố danh sách ngành nghề CSOL cập nhật vào tháng 3/2026, sau khi tham vấn các ngành và phân tích thị trường lao động. Danh sách này sẽ ảnh hưởng trực tiếp đến các visa 482, 186 và 190/491.",
    detail: "Những thay đổi dự kiến:\n• Thêm một số ngành thiếu hụt mới (healthcare, tech)\n• Một số ngành có thể bị loại khỏi CSOL nếu không còn thiếu hụt\n• Các trường đại học sẽ điều chỉnh marketing ngành học theo CSOL mới\n\nTheo dõi: immi.homeaffairs.gov.au/visas/working-in-australia/skill-occupation-list",
    source: "IDP Education / DIBP",
    sourceUrl: "https://immi.homeaffairs.gov.au/visas/working-in-australia/skill-occupation-list",
  },
];

const tagColors = {
  violet: "bg-violet-100 text-violet-700",
  yellow: "bg-yellow-100 text-yellow-700",
  emerald: "bg-emerald-100 text-emerald-700",
  blue: "bg-blue-100 text-blue-700",
  rose: "bg-rose-100 text-rose-700",
};

function NewsItem({ item }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`bg-white rounded-2xl border overflow-hidden shadow-sm ${item.urgent ? "border-rose-200 ring-1 ring-rose-100" : "border-gray-100"}`}>
      <div className="px-4 py-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex flex-wrap items-center gap-2">
            {item.urgent && (
              <span className="text-xs bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Mới & Quan trọng
              </span>
            )}
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tagColors[item.tagColor]}`}>{item.tag}</span>
            <span className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" />{item.date}</span>
          </div>
        </div>
        <h3 className="font-semibold text-[#0a1628] text-sm mb-1 leading-snug">{item.title}</h3>
        <p className="text-xs text-gray-500 leading-relaxed">{item.summary}</p>
      </div>
      <div className="border-t border-gray-100 px-4 py-2 flex items-center justify-between">
        <button onClick={() => setOpen(!open)} className="text-xs text-blue-600 font-medium flex items-center gap-1 hover:text-blue-700">
          {open ? <><ChevronUp className="w-3 h-3" /> Ẩn chi tiết</> : <><ChevronDown className="w-3 h-3" /> Xem chi tiết</>}
        </button>
        <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">
          Nguồn: {item.source} <ExternalLink className="w-3 h-3" />
        </a>
      </div>
      {open && (
        <div className="px-4 pb-4 bg-gray-50 border-t border-gray-100">
          <pre className="text-xs text-gray-600 whitespace-pre-wrap leading-relaxed font-sans mt-3">{item.detail}</pre>
        </div>
      )}
    </div>
  );
}

export default function NewsWidget() {
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? NEWS : NEWS.slice(0, 3);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-[#0f2347]" />
          <h2 className="text-xl font-bold text-[#0a1628]">Tin tức Di trú mới nhất</h2>
          <span className="text-xs bg-rose-100 text-rose-600 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> {NEWS.filter(n => n.urgent).length} mới
          </span>
        </div>
        <a href="https://immi.homeaffairs.gov.au/news-media/archive" target="_blank" rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:underline flex items-center gap-1">
          DIBP chính thức <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <div className="space-y-3">
        {displayed.map(item => <NewsItem key={item.id} item={item} />)}
      </div>

      {NEWS.length > 3 && (
        <button onClick={() => setShowAll(!showAll)} className="mt-3 w-full py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors font-medium">
          {showAll ? "Thu gọn" : `Xem thêm ${NEWS.length - 3} tin`}
        </button>
      )}
    </div>
  );
}