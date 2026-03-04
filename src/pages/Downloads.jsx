import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Download, Filter, Loader2, FileText, Eye } from 'lucide-react';

const categoryLabels = {
  template: '📄 Template',
  guide: '📖 Hướng dẫn',
  checklist: '✅ Checklist',
  form: '📝 Biểu mẫu',
  resource: '📚 Tài nguyên',
};

export default function Downloads() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchDocuments = async () => {
      const data = await base44.entities.Document.list('-created_date', 100).catch(() => []);
      setDocuments(data);
      setLoading(false);
    };
    fetchDocuments();
  }, []);

  const filtered = documents.filter(d =>
    selectedCategory === 'all' || d.category === selectedCategory
  );

  const handleDownload = async (doc) => {
    await base44.entities.Document.update(doc.id, {
      download_count: (doc.download_count || 0) + 1,
    });
    window.location.href = doc.file_url;
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
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-[#0a1628] mb-2 flex items-center gap-2">
            <Download className="w-8 h-8" /> Tài liệu tải xuống
          </h1>
          <p className="text-gray-600">Templates, guides, checklists cho quá trình di trú</p>
        </div>

        {/* Filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white border-2 border-gray-200 text-gray-700'
            }`}
          >
            <Filter className="w-4 h-4" /> Tất cả
          </button>
          {Object.entries(categoryLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border-2 border-gray-200 text-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Documents */}
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border-2 border-gray-100">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">Chưa có tài liệu nào</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filtered.map(doc => (
              <div
                key={doc.id}
                className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 inline-block mb-2">
                      {categoryLabels[doc.category]}
                    </div>
                    <h3 className="font-bold text-[#0a1628]">{doc.title}</h3>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">{doc.description}</p>

                {doc.visa_code && (
                  <div className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full inline-block mb-4">
                    Visa {doc.visa_code}
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Eye className="w-3 h-3" /> {doc.download_count || 0} lượt tải
                  </span>
                  <button
                    onClick={() => handleDownload(doc)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:shadow-lg transition-all flex items-center gap-1"
                  >
                    <Download className="w-4 h-4" />
                    Tải {doc.file_type.toUpperCase()}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}