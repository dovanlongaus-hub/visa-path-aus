import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Plus, Edit, Trash2, Loader2, Sparkles, Eye, BookOpen, AlertCircle } from 'lucide-react';

const categoryLabels = {
  visa_types: '🛂 Loại Visa',
  requirements: '📋 Yêu cầu',
  interview: '🎤 Phỏng vấn',
  common_mistakes: '⚠️ Lỗi phổ biến',
  application_process: '📝 Quy trình nộp',
  points_system: '🎯 Hệ thống điểm',
  skills_assessment: '✅ Skills Assessment',
};

function CreateArticleModal({ onClose, onCreated }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('visa_types');
  const [visaCode, setVisaCode] = useState('');
  const [topic, setTopic] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(null);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!title.trim() || !category) {
      setError('Vui lòng điền tiêu đề và chọn danh mục');
      return;
    }

    setGenerating(true);
    setError('');
    try {
      const result = await base44.functions.invoke('generateArticle', {
        title: title.trim(),
        category,
        visaCode: visaCode.trim() || null,
        topic: topic.trim() || null,
      });

      if (result.data) {
        setGenerated(result.data);
      }
    } catch (err) {
      setError('Lỗi khi tạo bài viết: ' + err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handlePublish = async () => {
    if (!generated) return;

    try {
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      
      await base44.entities.Article.create({
        title: generated.title || title,
        slug,
        category,
        visa_code: visaCode || null,
        summary: generated.summary,
        content: generated.content,
        tags: generated.tags || [],
        reading_time: generated.reading_time || 5,
        ai_generated: true,
        status: 'published',
      });

      onCreated();
      onClose();
    } catch (err) {
      setError('Lỗi khi lưu bài viết: ' + err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#0a1628]">Tạo bài viết mới</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {!generated ? (
            <>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Tiêu đề bài viết *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ví dụ: Hướng dẫn chi tiết về Visa 189"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Danh mục *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.entries(categoryLabels).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Mã Visa (tùy chọn)</label>
                  <input
                    type="text"
                    value={visaCode}
                    onChange={(e) => setVisaCode(e.target.value)}
                    placeholder="189, 190, 485, ..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Chủ đề cụ thể (tùy chọn)</label>
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Mô tả thêm chủ đề bạn muốn, ví dụ: Những yêu cầu về kinh nghiệm làm việc..."
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={generating}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-bold hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2 transition-all"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Đang tạo bài viết bằng AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Tạo bài viết bằng AI
                  </>
                )}
              </button>
            </>
          ) : (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <p className="text-emerald-700 font-semibold">✓ AI đã tạo bài viết thành công!</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Tiêu đề</label>
                <p className="text-gray-900 font-semibold">{generated.title}</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Tóm tắt</label>
                <p className="text-gray-700 text-sm">{generated.summary}</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nội dung (preview)</label>
                <div className="max-h-60 overflow-y-auto bg-gray-50 p-4 rounded-lg text-sm text-gray-700 whitespace-pre-wrap">
                  {generated.content.substring(0, 500)}...
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {generated.tags?.map((tag, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setGenerated(null)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Chỉnh sửa & Tạo lại
                </button>
                <button
                  onClick={handlePublish}
                  className="flex-1 bg-emerald-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                >
                  Xuất bản bài viết
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ArticleItem({ article, onDelete, onRefresh }) {
  const handleDelete = async () => {
    if (confirm('Bạn có chắc muốn xóa bài viết này?')) {
      await base44.entities.Article.delete(article.id);
      onRefresh();
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-start gap-4 hover:shadow-md transition-all">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold px-2 py-1 rounded-full bg-gray-100 text-gray-700">
            {categoryLabels[article.category]}
          </span>
          {article.ai_generated && <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">🤖 AI</span>}
          <span className={`text-xs px-2 py-1 rounded-full ${
            article.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
          }`}>
            {article.status === 'published' ? '📤 Published' : '📝 Draft'}
          </span>
        </div>
        <h3 className="font-bold text-[#0a1628] mb-1">{article.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{article.summary}</p>
        <div className="flex gap-3 mt-2 text-xs text-gray-500">
          <span>👁️ {article.view_count} xem</span>
          <span>👍 {article.helpful_count} hữu ích</span>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => window.open(`${window.location.origin}${createPageUrl(`Article?slug=${article.slug}`)}`, '_blank')}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={handleDelete}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function AdminGuide() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const init = async () => {
      const u = await base44.auth.me().catch(() => null);
      setUser(u);
      if (u?.role !== 'admin') return;

      const data = await base44.entities.Article.list('-created_date', 100).catch(() => []);
      setArticles(data);
      setLoading(false);
    };
    init();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
          <div className="font-bold text-[#0a1628] text-lg">Truy cập bị từ chối</div>
          <p className="text-gray-600 mt-2">Bạn cần quyền admin để xem trang này</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc] py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-black text-[#0a1628]">Knowledge Base</h1>
            </div>
            <p className="text-gray-600">Quản lý bài viết hướng dẫn di trú</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-bold hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            Tạo bài viết
          </button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-3xl font-black text-blue-600">{articles.length}</div>
            <p className="text-sm text-gray-600 mt-1">Tổng bài viết</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-3xl font-black text-emerald-600">
              {articles.filter(a => a.status === 'published').length}
            </div>
            <p className="text-sm text-gray-600 mt-1">Đã xuất bản</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-3xl font-black text-purple-600">
              {articles.filter(a => a.ai_generated).length}
            </div>
            <p className="text-sm text-gray-600 mt-1">AI tạo</p>
          </div>
        </div>

        {/* Articles List */}
        <div className="space-y-3">
          {articles.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">Chưa có bài viết nào</p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-4 text-blue-600 hover:text-blue-700 font-semibold"
              >
                + Tạo bài viết đầu tiên
              </button>
            </div>
          ) : (
            articles.map(article => (
              <ArticleItem
                key={article.id}
                article={article}
                onRefresh={() => {
                  setLoading(true);
                  setTimeout(() => setLoading(false), 500);
                }}
              />
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <CreateArticleModal
          onClose={() => setShowModal(false)}
          onCreated={() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 500);
          }}
        />
      )}
    </div>
  );
}