import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Clock, Eye, ThumbsUp, ThumbsDown, Share2, Loader2, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { entities } from '@/api/supabaseClient';

const categoryLabels = {
  visa_types: { label: '🛂 Loại Visa', color: 'blue' },
  requirements: { label: '📋 Yêu cầu', color: 'emerald' },
  interview: { label: '🎤 Phỏng vấn', color: 'purple' },
  common_mistakes: { label: '⚠️ Lỗi phổ biến', color: 'amber' },
  application_process: { label: '📝 Quy trình nộp', color: 'cyan' },
  points_system: { label: '🎯 Hệ thống điểm', color: 'indigo' },
  skills_assessment: { label: '✅ Skills Assessment', color: 'rose' },
};

export default function Article() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const slug = params.get('slug');

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [helpfulCount, setHelpfulCount] = useState(0);
  const [isHelpful, setIsHelpful] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      const articles = await entities.Article.filter({ slug }, 1).catch(() => []);
      if (articles.length > 0) {
        const art = articles[0];
        setArticle(art);
        setHelpfulCount(art.helpful_count || 0);

        // Update view count
        await entities.Article.update(art.id, {
          view_count: (art.view_count || 0) + 1,
        });
      }
      setLoading(false);
    };
    if (slug) fetchArticle();
  }, [slug]);

  const handleHelpful = async (helpful) => {
    if (!article) return;
    setIsHelpful(helpful);

    const newHelpfulCount = helpfulCount + 1;
    setHelpfulCount(newHelpfulCount);

    await entities.Article.update(article.id, {
      helpful_count: helpful ? newHelpfulCount : article.helpful_count,
      not_helpful_count: !helpful ? (article.not_helpful_count || 0) + 1 : article.not_helpful_count,
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.summary,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link đã được sao chép');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl border-2 border-red-200 p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-[#0a1628] mb-2">Bài viết không tìm thấy</h1>
            <Link to={createPageUrl('Guide')} className="text-blue-600 hover:text-blue-700 font-semibold">
              ← Quay lại Knowledge Base
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const cat = categoryLabels[article.category];
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
    amber: 'bg-amber-50 border-amber-200 text-amber-700',
    cyan: 'bg-cyan-50 border-cyan-200 text-cyan-700',
    indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700',
    rose: 'bg-rose-50 border-rose-200 text-rose-700',
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Back button */}
        <Link
          to={createPageUrl('Guide')}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-6 hover:gap-3 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại Knowledge Base
        </Link>

        {/* Article */}
        <article className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-lg">
          {/* Featured Image */}
          {article.featured_image && (
            <div className="h-80 overflow-hidden bg-gray-100">
              <img src={article.featured_image} alt={article.title} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Content */}
          <div className="p-8 md:p-10">
            {/* Category Badge */}
            <div className={`inline-block px-4 py-2 rounded-full text-sm font-bold mb-4 border ${colorClasses[cat.color]}`}>
              {cat.label}
            </div>

            {/* Title */}
            <h1 className="text-4xl font-black text-[#0a1628] mb-4">{article.title}</h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-gray-600 text-sm mb-8 pb-6 border-b border-gray-200">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" /> {article.reading_time || 3} phút đọc
              </span>
              <span className="flex items-center gap-2">
                <Eye className="w-4 h-4" /> {article.view_count} lượt xem
              </span>
              {article.created_date && (
                <span className="text-gray-500">
                  Cập nhật: {new Date(article.created_date).toLocaleDateString('vi-VN')}
                </span>
              )}
            </div>

            {/* Summary */}
            <div className="mb-8 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
              <p className="text-gray-700 font-medium">{article.summary}</p>
            </div>

            {/* Markdown Content */}
            <div className="prose prose-lg max-w-none mb-8 text-gray-800">
              <ReactMarkdown
                components={{
                  h2: ({ children }) => <h2 className="text-2xl font-bold text-[#0a1628] mt-8 mb-4">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-xl font-bold text-[#0a1628] mt-6 mb-3">{children}</h3>,
                  p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>,
                  li: ({ children }) => <li className="ml-4">{children}</li>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-amber-500 pl-4 py-2 bg-amber-50 my-4 rounded">
                      {children}
                    </blockquote>
                  ),
                  table: ({ children }) => (
                    <table className="w-full border-collapse border border-gray-300 my-4">{children}</table>
                  ),
                  th: ({ children }) => <th className="border border-gray-300 bg-gray-100 p-2 text-left">{children}</th>,
                  td: ({ children }) => <td className="border border-gray-300 p-2">{children}</td>,
                  code: ({ inline, children }) =>
                    inline ? (
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{children}</code>
                    ) : (
                      <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
                        <code>{children}</code>
                      </pre>
                    ),
                }}
              >
                {article.content}
              </ReactMarkdown>
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mb-8 pb-8 border-b border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Helpful Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <div className="font-semibold text-[#0a1628] mb-4">Bài viết này có hữu ích không?</div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleHelpful(true)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                    isHelpful === true
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:border-emerald-300 hover:text-emerald-700'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" /> Có, hữu ích ({helpfulCount})
                </button>
                <button
                  onClick={() => handleHelpful(false)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                    isHelpful === false
                      ? 'bg-red-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:border-red-300 hover:text-red-700'
                  }`}
                >
                  <ThumbsDown className="w-4 h-4" /> Không hữu ích
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium bg-white border border-gray-300 text-gray-700 hover:border-blue-300 hover:text-blue-700 transition-all ml-auto"
                >
                  <Share2 className="w-4 h-4" /> Chia sẻ
                </button>
              </div>
            </div>
          </div>
        </article>

        {/* Related Articles Placeholder */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-[#0a1628] mb-6">Bài viết liên quan</h2>
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-500">
            <p>Sắp có bài viết liên quan</p>
          </div>
        </div>
      </div>
    </div>
  );
}