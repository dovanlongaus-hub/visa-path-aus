import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Search, Loader2, X, Sparkles } from 'lucide-react';

const typeIcons = {
  article: '📄',
  document: '📋',
  faq: '❓',
  feedback: '💬',
};

const typeLabels = {
  article: 'Bài viết',
  document: 'Tài liệu',
  faq: 'Câu hỏi thường gặp',
  feedback: 'Góp ý/Thảo luận',
};

export default function GlobalSearch({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    try {
      const response = await base44.functions.invoke('smartSearch', { query });
      setResults(response.data);
    } catch (err) {
      setError('Không thể thực hiện tìm kiếm. Vui lòng thử lại.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="sticky top-0 p-6 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-[#0a1628]">Tìm kiếm thông minh</div>
              <div className="text-xs text-gray-500">Bằng ngôn ngữ tự nhiên (AI)</div>
            </div>
            <button onClick={onClose} className="ml-auto p-2 hover:bg-gray-100 rounded-lg transition">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Search Input */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                placeholder="Ví dụ: tài liệu visa 190 cho kỹ sư, hoặc khóa học nâng cao kỹ năng..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                autoFocus
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading || !query.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {loading ? 'Tìm kiếm...' : 'Tìm'}
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {!results && !loading && !error && (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-3">🔍</div>
              <p className="font-medium">Nhập câu hỏi hoặc nội dung bạn muốn tìm</p>
              <p className="text-sm mt-2">AI sẽ hiểu ngữ cảnh di trú để tìm kết quả chính xác nhất</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          {results && (
            <div className="space-y-6">
              {/* Query Analysis */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="text-sm font-semibold text-blue-900 mb-1">📌 Tôi hiểu bạn đang tìm:</div>
                <p className="text-blue-800 text-sm">{results.query_analysis}</p>
              </div>

              {/* Search Results */}
              {results.results && results.results.length > 0 ? (
                <div>
                  <div className="font-bold text-gray-900 mb-3">
                    Kết quả tìm kiếm ({results.results.length})
                  </div>
                  <div className="space-y-3">
                    {results.results.map((result, i) => (
                      <div
                        key={i}
                        className="p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl flex-shrink-0">{typeIcons[result.type]}</span>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-[#0a1628] mb-1">{result.title}</div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                {typeLabels[result.type]}
                              </span>
                              {result.category && (
                                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                  {result.category}
                                </span>
                              )}
                              <span className="text-xs font-bold text-emerald-600 ml-auto">
                                ⭐ {result.relevance_score}%
                              </span>
                            </div>
                            {result.summary && (
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{result.summary}</p>
                            )}
                            {result.answer_preview && (
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{result.answer_preview}</p>
                            )}
                            <p className="text-xs text-gray-500 italic">💡 {result.reason}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : results.results && results.results.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>Không tìm thấy kết quả chính xác</p>
                </div>
              )}

              {/* Related Searches */}
              {results.related_searches && results.related_searches.length > 0 && (
                <div>
                  <div className="font-bold text-gray-900 mb-2">🔗 Tìm kiếm liên quan:</div>
                  <div className="flex flex-wrap gap-2">
                    {results.related_searches.map((search, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setQuery(search);
                          setResults(null);
                        }}
                        className="text-xs bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 px-3 py-1.5 rounded-full font-medium transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tips */}
              {results.tips && results.tips.length > 0 && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <div className="font-bold text-amber-900 mb-2">💡 Gợi ý:</div>
                  <ul className="space-y-1">
                    {results.tips.map((tip, i) => (
                      <li key={i} className="text-sm text-amber-800 flex gap-2">
                        <span>→</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <p className="text-gray-600">AI đang tìm kiếm...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}