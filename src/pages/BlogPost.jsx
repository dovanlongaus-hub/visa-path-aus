import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getBlogPostBySlug, blogPosts } from '../data/blogPosts';
import { Clock, ChevronRight, ArrowLeft, BookOpen, Calculator } from 'lucide-react';

const categoryColors = {
  'Visa 189': 'bg-blue-100 text-blue-700',
  'Hướng dẫn Visa': 'bg-emerald-100 text-emerald-700',
  'Kinh nghiệm thực tế': 'bg-orange-100 text-orange-700',
};

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = getBlogPostBySlug(slug);

  useEffect(() => {
    if (post) {
      document.title = `${post.title} | VisaAus`;
      // Update meta description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = post.metaDescription;

      // Inject Schema.org JSON-LD
      const existingSchema = document.getElementById('blog-schema');
      if (existingSchema) existingSchema.remove();
      const script = document.createElement('script');
      script.id = 'blog-schema';
      script.type = 'application/ld+json';
      script.text = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.title,
        "description": post.metaDescription,
        "inLanguage": "vi",
        "datePublished": post.date,
        "dateModified": post.date,
        "author": {
          "@type": "Organization",
          "name": "VisaAus Team"
        },
        "publisher": {
          "@type": "Organization",
          "name": "VisaAus",
          "url": "https://visaaus.com.au",
          "logo": {
            "@type": "ImageObject",
            "url": "https://visaaus.com.au/logo.png"
          }
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `https://visaaus.com.au/blog/${post.slug}`
        }
      });
      document.head.appendChild(script);
    }
    return () => {
      // Cleanup schema on unmount
      const schema = document.getElementById('blog-schema');
      if (schema) schema.remove();
    };
  }, [post]);

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 text-center">
        <div className="text-6xl mb-4">📄</div>
        <h1 className="text-2xl font-bold text-[#0f2347] mb-2">Không tìm thấy bài viết</h1>
        <p className="text-slate-500 mb-6">Bài viết này không tồn tại hoặc đã bị xóa.</p>
        <Link to="/blog" className="bg-[#1a4b9b] text-white font-bold px-6 py-2.5 rounded-xl hover:bg-[#0f2347] transition-colors">
          ← Xem tất cả bài viết
        </Link>
      </div>
    );
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Related posts (exclude current)
  const relatedPosts = blogPosts.filter(p => p.slug !== slug).slice(0, 2);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-slate-500">
          <Link to="/" className="hover:text-[#1a4b9b] transition-colors">Trang chủ</Link>
          <ChevronRight className="w-4 h-4 text-slate-300" />
          <Link to="/blog" className="hover:text-[#1a4b9b] transition-colors">Blog</Link>
          <ChevronRight className="w-4 h-4 text-slate-300" />
          <span className="text-slate-700 font-medium truncate max-w-[200px]">{post.title}</span>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-4 py-8">
        {/* Back button */}
        <button
          onClick={() => navigate('/blog')}
          className="flex items-center gap-2 text-sm text-[#1a4b9b] font-medium mb-6 hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Tất cả bài viết
        </button>

        {/* Post header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[post.category] || 'bg-slate-100 text-slate-600'}`}>
              {post.category}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime}
            </span>
            <span className="text-xs text-slate-400">{formatDate(post.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>VisaAus Team</span>
          </div>
        </header>

        {/* Markdown content */}
        <div className="prose prose-slate max-w-none
          prose-headings:text-[#0f2347]
          prose-h1:text-2xl prose-h1:font-black prose-h1:leading-tight
          prose-h2:text-xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4 prose-h2:border-b prose-h2:border-slate-200 prose-h2:pb-2
          prose-h3:text-lg prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-3
          prose-p:text-slate-700 prose-p:leading-relaxed
          prose-a:text-[#1a4b9b] prose-a:no-underline hover:prose-a:underline
          prose-strong:text-[#0f2347]
          prose-table:border-collapse
          prose-th:bg-[#0f2347] prose-th:text-white prose-th:px-3 prose-th:py-2 prose-th:text-sm prose-th:font-semibold
          prose-td:border prose-td:border-slate-200 prose-td:px-3 prose-td:py-2 prose-td:text-sm
          prose-tr:even:bg-slate-50
          prose-blockquote:border-l-4 prose-blockquote:border-[#1a4b9b] prose-blockquote:bg-blue-50 prose-blockquote:py-1 prose-blockquote:rounded-r-lg
          prose-blockquote:text-slate-700 prose-blockquote:not-italic
          prose-li:text-slate-700
          prose-code:text-[#1a4b9b] prose-code:bg-blue-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
          prose-hr:border-slate-200
        ">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-br from-[#0f2347] to-[#1a4b9b] rounded-2xl p-7 text-white">
          <h3 className="font-black text-xl mb-2">🎯 Bạn đang ở đâu trong hành trình visa?</h3>
          <p className="text-blue-200 text-sm mb-5 leading-relaxed">
            Đừng đoán mò — tính điểm EOI miễn phí và biết ngay visa nào phù hợp với bạn. Hoặc book tư vấn 1-1 với chuyên gia người Việt.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/EOICalculator"
              className="flex items-center justify-center gap-2 bg-white text-[#0f2347] font-bold px-6 py-3 rounded-xl text-sm hover:bg-blue-50 transition-colors"
            >
              <Calculator className="w-4 h-4" />
              Tính điểm EOI miễn phí
            </Link>
            <a
              href="https://visaaus.com.au/consultation"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-amber-400 text-amber-900 font-bold px-6 py-3 rounded-xl text-sm hover:bg-amber-300 transition-colors"
            >
              📞 Book tư vấn $149 AUD
            </a>
          </div>
        </div>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-10">
            <h3 className="font-bold text-[#0f2347] text-lg mb-4">Bài viết liên quan</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {relatedPosts.map(rp => (
                <Link
                  key={rp.slug}
                  to={`/blog/${rp.slug}`}
                  className="block bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md hover:-translate-y-0.5 transition-all group"
                >
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mb-2 inline-block ${categoryColors[rp.category] || 'bg-slate-100 text-slate-600'}`}>
                    {rp.category}
                  </span>
                  <h4 className="font-semibold text-sm text-[#0f2347] group-hover:text-[#1a4b9b] transition-colors leading-snug mt-1 mb-2">
                    {rp.title}
                  </h4>
                  <div className="flex items-center gap-1 text-[#1a4b9b] text-xs font-medium">
                    <span>Đọc thêm</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
