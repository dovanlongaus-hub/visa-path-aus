import { useState, useEffect } from "react";
import { getImmigrationInsights } from "@/lib/immigrationInsights";
import { ExternalLink, ChevronDown, ChevronUp, Newspaper, AlertCircle, TrendingUp, Clock, RefreshCw, Sparkles } from "lucide-react";

const tagColors = {
  visa_485: "bg-violet-100 text-violet-700",
  visa_189: "bg-blue-100 text-blue-700",
  visa_190: "bg-indigo-100 text-indigo-700",
  visa_491: "bg-sky-100 text-sky-700",
  visa_482: "bg-cyan-100 text-cyan-700",
  visa_858: "bg-yellow-100 text-yellow-700",
  sol: "bg-emerald-100 text-emerald-700",
  csol: "bg-teal-100 text-teal-700",
  policy: "bg-rose-100 text-rose-700",
  general: "bg-gray-100 text-gray-700",
};

function NewsItem({ item }) {
  const [open, setOpen] = useState(false);
  const tagKey = (item.tag || "general").toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
  const tagClass = tagColors[tagKey] || tagColors.general;

  return (
    <div className={`bg-white rounded-2xl border overflow-hidden shadow-sm ${item.urgent ? "border-rose-200 ring-1 ring-rose-100" : "border-gray-100"}`}>
      <div className="px-4 py-4">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {item.urgent && (
            <span className="text-xs bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Quan trọng
            </span>
          )}
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tagClass}`}>{item.tag}</span>
          <span className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" />{item.date}</span>
        </div>
        <h3 className="font-semibold text-[#0a1628] text-sm mb-1 leading-snug">{item.title}</h3>
        <p className="text-xs text-gray-500 leading-relaxed">{item.summary}</p>
      </div>
      {item.detail && (
        <>
          <div className="border-t border-gray-100 px-4 py-2 flex items-center justify-between">
            <button onClick={() => setOpen(!open)} className="text-xs text-blue-600 font-medium flex items-center gap-1 hover:text-blue-700">
              {open ? <><ChevronUp className="w-3 h-3" /> Ẩn chi tiết</> : <><ChevronDown className="w-3 h-3" /> Xem chi tiết</>}
            </button>
            {item.sourceUrl && (
              <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">
                {item.source} <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
          {open && (
            <div className="px-4 pb-4 bg-gray-50 border-t border-gray-100">
              <pre className="text-xs text-gray-600 whitespace-pre-wrap leading-relaxed font-sans mt-3">{item.detail}</pre>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function AINewsWidget() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchNews = async (force = false) => {
    setRefreshing(true);
    try {
      const result = await getImmigrationInsights(force);
      setNews(result.news || []);
      setLastUpdated(result.timestamp ? new Date(result.timestamp) : null);
    } catch (error) {
      console.error("Failed to load immigration insights:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchNews(); }, []);

  const displayed = showAll ? news : news.slice(0, 3);
  const urgentCount = news.filter(n => n.urgent).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-[#0f2347]" />
          <h2 className="text-xl font-bold text-[#0a1628]">Tin tức Di trú mới nhất</h2>
          <span className="text-xs bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> AI cập nhật
          </span>
          {urgentCount > 0 && (
            <span className="text-xs bg-rose-100 text-rose-600 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> {urgentCount} quan trọng
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-[10px] text-gray-400 hidden sm:block">
              Cập nhật: {lastUpdated.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
          <button
            onClick={() => fetchNews(true)}
            disabled={refreshing}
            className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 disabled:opacity-40"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Đang cập nhật..." : "Làm mới"}
          </button>
          <a href="https://immi.homeaffairs.gov.au/news-media/archive" target="_blank" rel="noopener noreferrer"
            className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">
            DIBP chính thức <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse">
              <div className="flex gap-2 mb-3">
                <div className="h-4 bg-gray-100 rounded-full w-20" />
                <div className="h-4 bg-gray-100 rounded-full w-16" />
              </div>
              <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-full mb-1" />
              <div className="h-3 bg-gray-100 rounded w-5/6" />
            </div>
          ))}
          <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 animate-pulse" /> AI đang tổng hợp tin tức mới nhất...
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {displayed.map((item, i) => <NewsItem key={i} item={item} />)}
          </div>
          {news.length > 3 && (
            <button onClick={() => setShowAll(!showAll)} className="mt-3 w-full py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors font-medium">
              {showAll ? "Thu gọn" : `Xem thêm ${news.length - 3} tin`}
            </button>
          )}
        </>
      )}
    </div>
  );
}