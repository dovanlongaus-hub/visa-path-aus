import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function Contact() {
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('support');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    { value: 'support', label: '🆘 Hỗ trợ kỹ thuật' },
    { value: 'billing', label: '💳 Hóa đơn & Thanh toán' },
    { value: 'technical', label: '⚙️ Vấn đề kỹ thuật' },
    { value: 'feedback', label: '💬 Góp ý & Đề nghị' },
    { value: 'other', label: '📝 Khác' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim() || !email.trim()) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await base44.entities.Contact.create({
        subject: subject.trim(),
        category,
        message: message.trim(),
        email: email.trim(),
        phone: phone.trim() || null,
      });

      setSubmitted(true);
      setSubject('');
      setMessage('');
      setPhone('');
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError('Lỗi khi gửi: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-[#0a1628] mb-2">Liên hệ với chúng tôi</h1>
          <p className="text-gray-600">Chúng tôi sẵn sàng giúp bạn. Gửi tin nhắn bất cứ lúc nào</p>
        </div>

        {submitted && (
          <div className="mb-6 bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-5 flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-emerald-900">✓ Tin nhắn đã được gửi!</div>
              <p className="text-sm text-emerald-700 mt-1">Chúng tôi sẽ phản hồi sớm nhất có thể.</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-2xl p-5 flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border-2 border-gray-100 p-8">
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-900 mb-2">Loại liên hệ *</label>
            <div className="grid md:grid-cols-2 gap-3">
              {categories.map(cat => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={`p-3 rounded-lg border-2 font-medium transition-all text-left ${
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

          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-900 mb-2">Tiêu đề *</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Ví dụ: Tôi cần giúp đỡ với visa 189"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Số điện thoại (tùy chọn)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+61 412 345 678"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-900 mb-2">Tin nhắn *</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Mô tả chi tiết vấn đề hoặc câu hỏi của bạn..."
              rows="6"
              maxLength="1000"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 resize-none"
            />
            <div className="text-xs text-gray-400 mt-1">{message.length}/1000</div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-lg font-bold hover:shadow-lg disabled:opacity-60 transition-all flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Đang gửi...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Gửi tin nhắn
              </>
            )}
          </button>
        </form>

        <div className="mt-10 grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border-2 border-gray-100 p-6 text-center">
            <div className="text-4xl mb-3">📧</div>
            <div className="font-bold text-gray-900">Email</div>
            <p className="text-sm text-gray-600 mt-1">admin@ucditru.ai</p>
          </div>
          <div className="bg-white rounded-2xl border-2 border-gray-100 p-6 text-center">
            <div className="text-4xl mb-3">💬</div>
            <div className="font-bold text-gray-900">Live Chat</div>
            <p className="text-sm text-gray-600 mt-1">Thứ 2-6, 9AM-5PM AEDT</p>
          </div>
        </div>
      </div>
    </div>
  );
}