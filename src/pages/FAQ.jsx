import { useState } from 'react';
import { Search, ChevronDown, ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { entities } from '@/api/supabaseClient';

const categoryLabels = {
  visa: '🛂 Loại Visa',
  application: '📝 Quy trình nộp',
  payment: '💳 Thanh toán',
  account: '👤 Tài khoản',
  technical: '⚙️ Kỹ thuật',
};

export default function FAQ() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expanded, setExpanded] = useState(null);

  useState(() => {
    const fetchFAQs = async () => {
      const data = await entities.FAQ.list('order', 100).catch(() => []);
      setFaqs(data);
      setLoading(false);
    };
    fetchFAQs();
  }, []);

  const filtered = faqs.filter(faq => {
    const matchSearch = faq.question.toLowerCase().includes(search.toLowerCase()) ||
                       faq.answer.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const handleHelpful = async (faqId, helpful) => {
    const faq = faqs.find(f => f.id === faqId);
    if (helpful) {
      await entities.FAQ.update(faqId, {
        helpful_count: (faq.helpful_count || 0) + 1,
      });
    } else {
      await entities.FAQ.update(faqId, {
        not_helpful_count: (faq.not_helpful_count || 0) + 1,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-[#0a1628] mb-2">Câu hỏi thường gặp</h1>
          <p className="text-gray-600">Tìm câu trả lời cho các câu hỏi phổ biến về di trú Úc</p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm câu hỏi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-blue-400"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-300'
            }`}
          >
            Tất cả
          </button>
          {Object.entries(categoryLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* FAQs */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border-2 border-gray-100">
              <p className="text-gray-500">Không tìm thấy câu hỏi nào</p>
            </div>
          ) : (
            filtered.map((faq) => (
              <div
                key={faq.id}
                className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all"
              >
                <button
                  onClick={() => setExpanded(expanded === faq.id ? null : faq.id)}
                  className="w-full p-5 flex items-start gap-4 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex-1">
                    <div className="font-bold text-[#0a1628]">{faq.question}</div>
                    <div className="text-xs text-gray-500 mt-1">{categoryLabels[faq.category]}</div>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                      expanded === faq.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {expanded === faq.id && (
                  <div className="border-t-2 border-gray-200 p-5 bg-gray-50">
                    <div className="prose prose-sm max-w-none mb-4 text-gray-800">
                      <ReactMarkdown>{faq.answer}</ReactMarkdown>
                    </div>
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      <span className="text-xs text-gray-600">Hữu ích?</span>
                      <button
                        onClick={() => handleHelpful(faq.id, true)}
                        className="flex items-center gap-1 text-sm text-gray-600 hover:text-emerald-600 transition-colors"
                      >
                        <ThumbsUp className="w-4 h-4" /> {faq.helpful_count || 0}
                      </button>
                      <button
                        onClick={() => handleHelpful(faq.id, false)}
                        className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600 transition-colors"
                      >
                        <ThumbsDown className="w-4 h-4" /> {faq.not_helpful_count || 0}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}