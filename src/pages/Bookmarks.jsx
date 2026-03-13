import { useState, useEffect } from 'react';
import { Bookmark, Trash2, ExternalLink, Loader2, Search } from 'lucide-react';
import { entities } from '@/api/supabaseClient';

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    const fetchBookmarks = async () => {
      const data = await entities.Bookmark.list('-created_date', 100).catch(() => []);
      setBookmarks(data);
      setLoading(false);
    };
    fetchBookmarks();
  }, []);

  const filtered = bookmarks.filter(b => {
    const matchSearch = b.title.toLowerCase().includes(search.toLowerCase());
    const matchType = selectedType === 'all' || b.type === selectedType;
    return matchSearch && matchType;
  });

  const handleDelete = async (id) => {
    if (confirm('Xóa bookmark này?')) {
      await entities.Bookmark.delete(id);
      setBookmarks(bookmarks.filter(b => b.id !== id));
    }
  };

  const typeLabels = { article: 'Bài viết', visa: 'Visa', guide: 'Hướng dẫn', form: 'Biểu mẫu' };

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
            <Bookmark className="w-8 h-8" /> Bookmarks của tôi
          </h1>
          <p className="text-gray-600">Các bài viết, visa và hướng dẫn đã lưu</p>
        </div>

        {/* Search & Filter */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm bookmark..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-blue-400"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedType === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border-2 border-gray-200 text-gray-700'
              }`}
            >
              Tất cả
            </button>
            {Object.entries(typeLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedType(key)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedType === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border-2 border-gray-200 text-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Bookmarks List */}
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border-2 border-gray-100">
            <Bookmark className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">Chưa có bookmark nào</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filtered.map(bookmark => (
              <div
                key={bookmark.id}
                className="bg-white rounded-lg border-2 border-gray-200 p-5 hover:shadow-lg transition-all group"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1">
                    <div className="text-xs font-bold px-2 py-1 rounded-full bg-blue-100 text-blue-700 inline-block mb-2">
                      {typeLabels[bookmark.type]}
                    </div>
                    <h3 className="font-bold text-[#0a1628] line-clamp-2">{bookmark.title}</h3>
                  </div>
                  <button
                    onClick={() => handleDelete(bookmark.id)}
                    className="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {bookmark.notes && (
                  <p className="text-sm text-gray-600 mb-3 italic">"{bookmark.notes}"</p>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <span className="text-xs text-gray-500">
                    {new Date(bookmark.created_date).toLocaleDateString('vi-VN')}
                  </span>
                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}