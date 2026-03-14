import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { blogPosts } from '../data/blogPosts';
import { BookOpen, Clock, ChevronRight, ArrowRight } from 'lucide-react';

const categoryColors = {
  'Visa 189': 'bg-blue-100 text-blue-700',
  'Hướng dẫn Visa': 'bg-emerald-100 text-emerald-700',
  'Kinh nghiệm thực tế': 'bg-orange-100 text-orange-700',
};

export default function Blog() {
  const sortedPosts = [...blogPosts].sort((a, b) => new Date(b.date) - new Date(a.date));

  useEffect(() => {
    document.title = 'Blog Visa Úc Tiếng Việt | Hướng dẫn định cư Úc 2025–2026 | VisaAus';
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = 'Blog hướng dẫn visa định cư Úc bằng tiếng Việt: điểm EOI, visa 189/190/491, kinh nghiệm thực tế từ cộng đồng người Việt tại Úc.';
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0f2347] to-[#1a4b9b] py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-4">
            <BookOpen className="w-4 h-4" />
            <span>Blog Visa Úc Tiếng Việt</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-3">
            Hướng Dẫn Định Cư Úc
          </h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">
            Kiến thức thực tế về visa 189/190/491, điểm EOI, và hành trình PR — viết bằng tiếng Việt dễ hiểu.
          </p>
        </div>
      </div>

      {/* Blog posts */}
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Featured post (first) */}
        {sortedPosts.length > 0 && (
          <div className="mb-8">
            <Link
              to={`/blog/${sortedPosts[0].slug}`}
              className="block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group"
            >
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[sortedPosts[0].category] || 'bg-slate-100 text-slate-600'}`}>
                    {sortedPosts[0].category}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {sortedPosts[0].readTime}
                  </span>
                  <span className="text-xs text-slate-400">{formatDate(sortedPosts[0].date)}</span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-[#0f2347] mb-3 group-hover:text-[#1a4b9b] transition-colors leading-tight">
                  {sortedPosts[0].title}
                </h2>
                <p className="text-slate-600 mb-4 leading-relaxed">
                  {sortedPosts[0].excerpt}
                </p>
                <div className="flex items-center gap-1.5 text-[#1a4b9b] font-semibold text-sm">
                  <span>Đọc thêm</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Grid of remaining posts */}
        <div className="grid md:grid-cols-2 gap-5">
          {sortedPosts.slice(1).map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5 group"
            >
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2.5">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[post.category] || 'bg-slate-100 text-slate-600'}`}>
                    {post.category}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </span>
                </div>
                <h3 className="font-bold text-[#0f2347] mb-2 group-hover:text-[#1a4b9b] transition-colors leading-snug text-base">
                  {post.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-3 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">{formatDate(post.date)}</span>
                  <div className="flex items-center gap-1 text-[#1a4b9b] text-xs font-semibold">
                    <span>Đọc thêm</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA Box */}
        <div className="mt-10 bg-gradient-to-br from-[#0f2347] to-[#1a4b9b] rounded-2xl p-6 text-white text-center">
          <h3 className="font-black text-xl mb-2">Tính điểm EOI miễn phí</h3>
          <p className="text-blue-200 text-sm mb-4">Biết ngay điểm EOI của bạn và visa nào phù hợp nhất.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/EOICalculator"
              className="bg-white text-[#0f2347] font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-blue-50 transition-colors"
            >
              🎯 Tính điểm EOI miễn phí
            </Link>
            <a
              href="https://visaaus.com.au/consultation"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-amber-400 text-amber-900 font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-amber-300 transition-colors"
            >
              📞 Book tư vấn $149
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
