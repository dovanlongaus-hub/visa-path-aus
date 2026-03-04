import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Search, Filter, Loader2, BookOpen, Eye, ThumbsUp, Clock, ChevronRight } from 'lucide-react';

const categoryLabels = {
  visa_types: { label: '🛂 Loại Visa', color: 'blue' },
  requirements: { label: '📋 Yêu cầu', color: 'emerald' },
  interview: { label: '🎤 Phỏng vấn', color: 'purple' },
  common_mistakes: { label: '⚠️ Lỗi phổ biến', color: 'amber' },
  application_process: { label: '📝 Quy trình nộp', color: 'cyan' },
  points_system: { label: '🎯 Hệ thống điểm', color: 'indigo' },
  skills_assessment: { label: '✅ Skills Assessment', color: 'rose' },
};

const colorClasses = {
  blue: 'bg-blue-50 border-blue-200 text-blue-700',
  emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  purple: 'bg-purple-50 border-purple-200 text-purple-700',
  amber: 'bg-amber-50 border-amber-200 text-amber-700',
  cyan: 'bg-cyan-50 border-cyan-200 text-cyan-700',
  indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700',
  rose: 'bg-rose-50 border-rose-200 text-rose-700',
};

function ArticleCard({ article }) {
  const cat = categoryLabels[article.category];
  const colorClass = colorClasses[cat.color];

  return (
    <Link
      to={createPageUrl(`Article?slug=${article.slug}`)}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1"
    >
      {article.featured_image && (
        <div className="h-48 overflow-hidden bg-gray-100">
          <img src={article.featured_image} alt={article.title} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-5">
        <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 border ${colorClass}`}>
          {cat.label}
        </div>
        <h3 className="font-bold text-[#0a1628] text-lg mb-2 line-clamp-2">{article.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{article.summary}</p>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> {article.reading_time || 3} phút
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" /> {article.view_count || 0} lượt xem
          </span>
          <span className="flex items-center gap-1">
            <ThumbsUp className="w-3 h-3" /> {article.helpful_count || 0}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function Guide() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedVisa, setSelectedVisa] = useState('all');

  useEffect(() => {
    const fetchArticles = async () => {
      const data = await base44.entities.Article.filter({ status: 'published' }, '-created_date', 100).catch(() => []);
      setArticles(data);
      setLoading(false);
    };
    fetchArticles();
  }, []);

  const filteredArticles = articles.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) || 
                       a.summary.toLowerCase().includes(search.toLowerCase()) ||
                       (a.tags && a.tags.some(t => t.toLowerCase().includes(search.toLowerCase())));
    const matchCategory = selectedCategory === 'all' || a.category === selectedCategory;
    const matchVisa = selectedVisa === 'all' || a.visa_code === selectedVisa;
    return matchSearch && matchCategory && matchVisa;
  });

  const visas = ['189', '190', '485', '482', '858', '500'];
  const categories = Object.entries(categoryLabels);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-[#0a1628]">Knowledge Base</h1>
              <p className="text-gray-600">Hướng dẫn chi tiết về visa, yêu cầu, quy trình di trú Úc</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Category Filter */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-4 h-4 text-gray-600" />
              <span className="font-semibold text-gray-700">Danh mục</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                Tất cả
              </button>
              {categories.map(([key, { label }]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Visa Filter */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-4 h-4 text-gray-600" />
              <span className="font-semibold text-gray-700">Visa</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedVisa('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedVisa === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                Tất cả
              </button>
              {visas.map(visa => (
                <button
                  key={visa}
                  onClick={() => setSelectedVisa(visa)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedVisa === visa
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Visa {visa}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border-2 border-gray-100">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 text-lg">Không tìm thấy bài viết nào</p>
            <p className="text-gray-400 text-sm mt-1">Vui lòng thử tìm kiếm hoặc lọc khác</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}

        {/* Total count */}
        <div className="text-center mt-10 text-gray-600">
          Hiển thị {filteredArticles.length} / {articles.length} bài viết
        </div>
      </div>
    </div>
  );
}