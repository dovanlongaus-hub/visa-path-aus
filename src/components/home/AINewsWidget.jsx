import { useState, useEffect } from "react";
import { RefreshCw, ExternalLink, AlertCircle, Newspaper } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InvokeLLM } from "@/api/integrations";

const CACHE_KEY = "aiNewsWidget_cache";
const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours

const DEFAULT_NEWS = [
  {
    title: "Tăng phí Visa 485 (Tốt nghiệp) từ tháng 7/2024",
    summary:
      "Phí nộp đơn cho Visa Graduate 485 tăng đáng kể, ảnh hưởng đến sinh viên quốc tế sau tốt nghiệp tại Úc.",
    date: "2024-07-01",
    urgent: true,
    source: "DOHA",
  },
  {
    title: "Chương trình NIV 858 mở rộng danh sách nghề nghiệp",
    summary:
      "Bộ Di trú mở rộng danh sách ngành nghề được bảo lãnh theo diện Global Talent Visa 858 trong năm 2024.",
    date: "2024-06-15",
    urgent: false,
    source: "immi.homeaffairs.gov.au",
  },
  {
    title: "Visa 485 gia hạn thêm 2 năm cho sinh viên STEM",
    summary:
      "Sinh viên tốt nghiệp ngành STEM tại Úc được gia hạn Visa 485 thêm 2 năm từ năm 2024.",
    date: "2024-05-20",
    urgent: false,
    source: "DOHA",
  },
  {
    title: "Tăng mức lương TSMIT lên $73,150/năm",
    summary:
      "Mức lương tối thiểu bảo lãnh (TSMIT) cho Visa 482 tăng lên $73,150/năm từ 1/7/2024.",
    date: "2024-04-10",
    urgent: true,
    source: "DOHA",
  },
  {
    title: "Cập nhật danh sách CSOL cho Visa 190 & 491",
    summary:
      "Nhiều bang cập nhật Danh sách Nghề Nghiệp Tài Trợ (CSOL) — một số ngành mới được thêm vào danh sách ưu tiên.",
    date: "2024-03-05",
    urgent: false,
    source: "Chính phủ Tiểu bang",
  },
];

export default function AINewsWidget() {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          setNews(data);
          setLastUpdated(new Date(timestamp));
          return;
        }
      }
    } catch {}
    await fetchNews();
  };

  const fetchNews = async () => {
    setIsLoading(true);
    try {
      const result = await InvokeLLM({
        prompt: `Tìm kiếm và liệt kê 5 tin tức mới nhất về visa Úc (Australian immigration visa) trong 30 ngày qua.
Tập trung vào: thay đổi chính sách, phí visa, điểm EOI, các loại visa 189/190/491/485/482/858.
Trả về JSON với format đúng: { "news": [ { "title": "...", "summary": "...", "date": "YYYY-MM-DD", "urgent": true/false, "source": "..." } ] }`,
        response_json_schema: {
          type: "object",
          properties: {
            news: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  summary: { type: "string" },
                  date: { type: "string" },
                  urgent: { type: "boolean" },
                  source: { type: "string" },
                },
              },
            },
          },
        },
        add_context_from_internet: true,
      });

      const newsData = result?.news?.length ? result.news : DEFAULT_NEWS;
      setNews(newsData);
      setLastUpdated(new Date());
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ data: newsData, timestamp: Date.now() })
      );
    } catch {
      setNews(DEFAULT_NEWS);
    } finally {
      setIsLoading(false);
    }
  };

  const displayNews = news.length > 0 ? news : DEFAULT_NEWS;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gray-900 flex items-center justify-center">
            <Newspaper className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Tin Tức Di Trú Mới Nhất</h3>
            {lastUpdated && (
              <p className="text-xs text-gray-400">
                Cập nhật:{" "}
                {lastUpdated.toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchNews}
          disabled={isLoading}
          className="text-gray-500 hover:text-gray-900"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      <div className="divide-y divide-gray-50">
        {isLoading ? (
          <div className="p-8 text-center">
            <RefreshCw className="h-6 w-6 animate-spin text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-400">Đang tìm kiếm tin tức mới nhất...</p>
          </div>
        ) : (
          displayNews.map((item, i) => (
            <div
              key={i}
              className="p-5 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => setExpanded(expanded === i ? null : i)}
            >
              <div className="flex items-start gap-3">
                {item.urgent && (
                  <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-1" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {item.urgent && (
                      <Badge className="bg-red-50 text-red-700 border-red-200 text-xs">
                        Khẩn
                      </Badge>
                    )}
                    <span className="text-xs text-gray-400">{item.date}</span>
                    <span className="text-xs text-gray-400">• {item.source}</span>
                  </div>
                  <h4 className="font-medium text-gray-900 text-sm leading-snug">
                    {item.title}
                  </h4>
                  {expanded === i && (
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                      {item.summary}
                    </p>
                  )}
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-gray-300 flex-shrink-0 mt-1" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}