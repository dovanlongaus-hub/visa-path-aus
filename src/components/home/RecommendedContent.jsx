import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader2, BookOpen, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function RecommendedContent() {
  const [profile, setProfile] = useState(null);
  const [articles, setArticles] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        // Fetch user profile
        const profiles = await base44.entities.UserProfile.list('-created_date', 1);
        if (profiles.length > 0) {
          const prof = profiles[0];
          setProfile(prof);

          // Fetch relevant articles based on visa stage
          const visaCode = prof.current_visa_type || '';
          const relevantArticles = await base44.entities.Article.filter(
            { status: 'published' },
            '-view_count',
            6
          );
          setArticles(relevantArticles);

          // Fetch relevant documents
          const relevantDocs = await base44.entities.Document.list('-download_count', 4);
          setDocuments(relevantDocs);
        }
      } catch (error) {
        console.error('Error loading recommended content:', error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border-2 border-gray-100 p-8 flex items-center justify-center gap-3">
        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
        <span className="text-gray-600">Đang tải nội dung...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-100 p-6">
      <div className="font-bold text-lg text-[#0a1628] mb-6 flex items-center gap-2">
        📚 Nội dung gợi ý dành cho {profile?.current_visa_type ? `Visa ${profile.current_visa_type}` : 'bạn'}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Articles */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-gray-900">Bài viết hướng dẫn</span>
          </div>
          <div className="space-y-2">
            {articles.slice(0, 3).map(article => (
              <Link
                key={article.id}
                to={createPageUrl('Article')}
                className="block p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
              >
                <h4 className="font-semibold text-sm text-[#0a1628] group-hover:text-blue-600 line-clamp-2">
                  {article.title}
                </h4>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {article.category}
                  </span>
                  <span className="text-xs text-gray-500">👁️ {article.view_count || 0}</span>
                </div>
              </Link>
            ))}
          </div>
          <Link
            to={createPageUrl('Guide')}
            className="mt-3 text-blue-600 font-semibold text-sm hover:text-blue-700 inline-flex items-center gap-1"
          >
            Khám phá thêm →
          </Link>
        </div>

        {/* Documents */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-emerald-600" />
            <span className="font-semibold text-gray-900">Tài liệu tải xuống</span>
          </div>
          <div className="space-y-2">
            {documents.slice(0, 3).map(doc => (
              <div
                key={doc.id}
                className="p-3 rounded-lg border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all group cursor-pointer"
              >
                <h4 className="font-semibold text-sm text-[#0a1628] group-hover:text-emerald-600 line-clamp-2">
                  {doc.title}
                </h4>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
                    {doc.file_type.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-500">⬇️ {doc.download_count || 0}</span>
                </div>
              </div>
            ))}
          </div>
          <Link
            to={createPageUrl('Downloads')}
            className="mt-3 text-blue-600 font-semibold text-sm hover:text-blue-700 inline-flex items-center gap-1"
          >
            Khám phá thêm →
          </Link>
        </div>
      </div>
    </div>
  );
}