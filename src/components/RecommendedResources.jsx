import { useState } from 'react';
import { BookOpen, FileText, ChevronDown, ChevronUp } from 'lucide-react';

export default function RecommendedResources({ articles = [], documents = [] }) {
  const [expanded, setExpanded] = useState(true);

  if (!articles?.length && !documents?.length) return null;

  return (
    <div className="mt-4 bg-indigo-50 border-2 border-indigo-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between font-semibold text-indigo-900 hover:bg-indigo-100 transition-colors"
      >
        <span className="flex items-center gap-2">
          📚 Tài liệu & Bài viết liên quan ({(articles?.length || 0) + (documents?.length || 0)})
        </span>
        {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>

      {expanded && (
        <div className="p-4 bg-white border-t border-indigo-200 space-y-3">
          {/* Articles */}
          {articles?.length > 0 && (
            <div>
              <div className="text-sm font-semibold text-indigo-900 mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> Bài viết hướng dẫn
              </div>
              <ul className="space-y-1.5">
                {articles.map((article, i) => (
                  <li key={i} className="text-sm text-indigo-800 flex items-start gap-2">
                    <span className="text-indigo-600 font-bold flex-shrink-0 mt-1">→</span>
                    <span>{article}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Documents */}
          {documents?.length > 0 && (
            <div>
              <div className="text-sm font-semibold text-indigo-900 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Tài liệu tải xuống
              </div>
              <ul className="space-y-1.5">
                {documents.map((doc, i) => (
                  <li key={i} className="text-sm text-indigo-800 flex items-start gap-2">
                    <span className="text-indigo-600 font-bold flex-shrink-0 mt-1">📄</span>
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}