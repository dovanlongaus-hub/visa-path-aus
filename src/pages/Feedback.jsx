import { useState } from 'react';
import { Send, Loader2, CheckCircle, AlertCircle, Lightbulb, MessageSquare } from 'lucide-react';
import { entities } from '@/api/supabaseClient';
import { invokeLLMSmart } from '@/api/aiClient';

export default function Feedback() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('improvement');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    { value: 'feature_request', label: '✨ Yêu cầu tính năng mới' },
    { value: 'improvement', label: '🎯 Cải thiện chức năng hiện tại' },
    { value: 'bug_report', label: '🐛 Báo cáo lỗi' },
    { value: 'other', label: '💬 Khác' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      // Tạo feedback record
      const feedbackData = {
        title: title.trim(),
        category,
        content: content.trim(),
        priority: 'medium',
        status: 'submitted',
      };

      const feedback = await entities.Feedback.create(feedbackData);

      // Phân tích feedback bằng AI
      const feedbackText = `[${category}] ${title.trim()}: ${content.trim()}`;
      const analysisResult = await invokeLLMSmart(feedbackText, {
        title: title.trim(),
        category,
        content: content.trim(),
      });

      // Cập nhật feedback với kết quả phân tích
      if (analysisResult.data) {
        const analysis = analysisResult.data;
        await entities.Feedback.update(feedback.id, {
          ai_analysis: analysis,
          is_feature_request: analysis.is_feature_request,
          estimated_effort: analysis.estimated_effort,
          impact_score: analysis.impact_score,
          suggested_version: analysis.suggested_version,
          status: analysis.recommendation === 'Approve' ? 'approved' : 
                  analysis.recommendation === 'Reject' ? 'rejected' : 'reviewed',
          notified_owner: analysis.recommendation === 'Approve',
        });

        // Nếu được phê duyệt, gửi email thông báo cho owner
        if (analysis.recommendation === 'Approve') {
          // Email notification: implement via Edge Function
        }
      }

      setSubmitted(true);
      setTitle('');
      setContent('');
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError('Lỗi khi gửi góp ý: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-4">
            <Lightbulb className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700">Góp ý từ bạn giúp chúng tôi tốt hơn</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-[#0a1628] mb-3">Gửi góp ý cho chúng tôi</h1>
          <p className="text-gray-600 text-lg">Ý kiến của bạn rất quan trọng. Nếu hợp lý, chúng tôi sẽ triển khai trong version tiếp theo</p>
        </div>

        {/* Success Message */}
        {submitted && (
          <div className="mb-6 bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-5 flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-emerald-900">✓ Góp ý của bạn đã được gửi thành công!</div>
              <p className="text-sm text-emerald-700 mt-1">
                Chúng tôi sẽ phân tích góp ý của bạn và gửi thông báo nếu được phê duyệt.
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-2xl p-5 flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-red-900">Lỗi</div>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border-2 border-gray-100 p-8 shadow-lg">
          {/* Category */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-[#0a1628] mb-3">
              Loại góp ý <span className="text-red-500">*</span>
            </label>
            <div className="grid md:grid-cols-2 gap-3">
              {categories.map(cat => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={`p-4 rounded-xl border-2 font-medium transition-all text-left ${
                    category === cat.value
                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-[#0a1628] mb-2">
              Tiêu đề <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: Thêm chức năng so sánh các loại visa"
              maxLength="100"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
            <div className="text-xs text-gray-400 mt-1">{title.length}/100</div>
          </div>

          {/* Content */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-[#0a1628] mb-2">
              Chi tiết góp ý <span className="text-red-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Mô tả chi tiết góp ý của bạn, tại sao nó quan trọng và nó sẽ giúp ích cho ai..."
              maxLength="1000"
              rows="6"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none"
            />
            <div className="text-xs text-gray-400 mt-1">{content.length}/1000</div>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <p className="text-xs text-blue-800 flex items-start gap-2">
              <MessageSquare className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Mẹo:</strong> Góp ý càng cụ thể, càng chi tiết về vấn đề hoặc tính năng bạn muốn, chúng tôi càng có thể đánh giá tốt hơn.
              </span>
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg disabled:opacity-60 transition-all flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Đang gửi...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Gửi góp ý
              </>
            )}
          </button>
        </form>

        {/* Benefits */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {[
            { icon: '🎯', title: 'Được lắng nghe', desc: 'Ý kiến của bạn thực sự ảnh hưởng đến sự phát triển của ứng dụng' },
            { icon: '⚡', title: 'Nhanh chóng', desc: 'Nếu hợp lý, tính năng bạn yêu cầu sẽ được triển khai trong version tiếp theo' },
            { icon: '📢', title: 'Minh bạch', desc: 'Chúng tôi sẽ thông báo cho bạn nếu góp ý của bạn được phê duyệt' },
          ].map((item, i) => (
            <div key={i} className="text-center p-6 bg-white rounded-2xl border border-gray-100">
              <div className="text-4xl mb-3">{item.icon}</div>
              <div className="font-bold text-[#0a1628] mb-2">{item.title}</div>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}