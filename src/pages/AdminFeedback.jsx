import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Eye, Mail, Loader2, Filter } from 'lucide-react';

const statusColors = {
  submitted: { bg: 'bg-gray-50', border: 'border-gray-300', text: 'text-gray-700', badge: 'bg-gray-100 text-gray-800' },
  reviewed: { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-800' },
  approved: { bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-800' },
  rejected: { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-700', badge: 'bg-red-100 text-red-800' },
};

function FeedbackCard({ feedback, onUpdate }) {
  const [expanded, setExpanded] = useState(false);
  const c = statusColors[feedback.status];

  const categoryLabels = {
    feature_request: '✨ Yêu cầu tính năng',
    improvement: '🎯 Cải thiện',
    bug_report: '🐛 Lỗi',
    other: '💬 Khác',
  };

  const handleStatusChange = async (newStatus) => {
    await base44.entities.Feedback.update(feedback.id, { status: newStatus });
    onUpdate();
  };

  const handleNotifyOwner = async () => {
    const analysis = feedback.ai_analysis;
    await base44.integrations.Core.SendEmail({
      to: 'admin@ucditru.ai',
      subject: `[APPROVED] ${feedback.title} - v${analysis.suggested_version}`,
      body: `Feedback được phê duyệt:\n\nTiêu đề: ${feedback.title}\nLoại: ${feedback.category}\nTác động: ${analysis.impact_score}/100\nĐộ phức tạp: ${analysis.estimated_effort}\nPhiên bản: ${analysis.suggested_version}\n\nNội dung:\n${feedback.content}\n\nGhi chú triển khai:\n${analysis.implementation_notes.join('\n')}`,
    });
    await base44.entities.Feedback.update(feedback.id, { notified_owner: true });
    onUpdate();
  };

  return (
    <div className={`border-2 ${c.border} rounded-2xl overflow-hidden transition-all`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-full p-5 flex items-start gap-4 hover:opacity-90 transition-colors ${c.bg}`}
      >
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${c.badge}`}>
              {feedback.status.toUpperCase()}
            </span>
            <span className="text-xs text-gray-500">{categoryLabels[feedback.category]}</span>
          </div>
          <div className="font-bold text-[#0a1628] text-lg">{feedback.title}</div>
          {feedback.ai_analysis && (
            <div className="text-sm text-gray-600 mt-2 flex items-center gap-4">
              <span>📊 Tác động: {feedback.ai_analysis.impact_score}/100</span>
              <span>⚙️ {feedback.ai_analysis.estimated_effort}</span>
              <span>📦 v{feedback.ai_analysis.suggested_version}</span>
            </div>
          )}
        </div>
        <Eye className="w-5 h-5 text-gray-400 flex-shrink-0" />
      </button>

      {expanded && (
        <div className={`border-t-2 ${c.border} p-6 space-y-4`}>
          {/* Original Feedback */}
          <div>
            <div className="font-bold text-gray-800 mb-2">💬 Nội dung</div>
            <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">{feedback.content}</p>
          </div>

          {/* AI Analysis */}
          {feedback.ai_analysis && (
            <>
              <div className="border-t pt-4">
                <div className="font-bold text-gray-800 mb-3">🤖 Phân tích AI</div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-semibold text-gray-700">Kết luận:</span>
                    <p className="text-gray-600">{feedback.ai_analysis.reason}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Ghi chú triển khai:</span>
                    <ul className="text-gray-600 list-disc ml-5 mt-1">
                      {feedback.ai_analysis.implementation_notes.map((note, i) => (
                        <li key={i}>{note}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Lợi ích cho người dùng:</span>
                    <p className="text-gray-600">{feedback.ai_analysis.potential_users_benefit}</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Admin Actions */}
          <div className="border-t pt-4 space-y-3">
            <div className="font-bold text-gray-800">👨‍💼 Hành động Admin</div>
            <div className="flex flex-wrap gap-2">
              {['submitted', 'reviewed', 'approved', 'rejected'].map(status => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    feedback.status === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {status === 'submitted' ? '📥'
                    : status === 'reviewed' ? '👀'
                    : status === 'approved' ? '✅'
                    : '❌'} {status}
                </button>
              ))}
            </div>
            {feedback.status === 'approved' && !feedback.notified_owner && (
              <button
                onClick={handleNotifyOwner}
                className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                📧 Thông báo cho owner
              </button>
            )}
            {feedback.notified_owner && (
              <div className="text-sm text-emerald-700 bg-emerald-50 p-2 rounded-lg">
                ✓ Đã thông báo cho owner
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const init = async () => {
      const u = await base44.auth.me().catch(() => null);
      setUser(u);
      if (u?.role !== 'admin') return;
      
      const data = filterStatus === 'all'
        ? await base44.entities.Feedback.list('-created_date', 100)
        : await base44.entities.Feedback.filter({ status: filterStatus }, '-created_date', 100);
      setFeedbacks(data);
      setLoading(false);
    };
    init();
  }, [filterStatus]);

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
          <div className="text-red-600 text-2xl mb-2">🚫</div>
          <div className="font-bold text-[#0a1628] text-lg">Truy cập bị từ chối</div>
          <p className="text-gray-600 mt-2">Bạn cần quyền admin để xem trang này</p>
        </div>
      </div>
    );
  }

  const approved = feedbacks.filter(f => f.status === 'approved').length;
  const pending = feedbacks.filter(f => f.status === 'submitted').length;
  const notNotified = feedbacks.filter(f => f.status === 'approved' && !f.notified_owner).length;

  return (
    <div className="min-h-screen bg-[#f8f9fc] py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-black text-[#0a1628] mb-4">📊 Quản lý Feedback</h1>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border-2 border-gray-200">
              <div className="text-2xl font-black text-blue-600">{feedbacks.length}</div>
              <div className="text-sm text-gray-600 mt-1">Tổng feedback</div>
            </div>
            <div className="bg-white rounded-2xl p-5 border-2 border-emerald-200">
              <div className="text-2xl font-black text-emerald-600">{approved}</div>
              <div className="text-sm text-gray-600 mt-1">Phê duyệt</div>
            </div>
            <div className="bg-white rounded-2xl p-5 border-2 border-amber-200">
              <div className="text-2xl font-black text-amber-600">{pending}</div>
              <div className="text-sm text-gray-600 mt-1">Chưa xử lý</div>
            </div>
            <div className="bg-white rounded-2xl p-5 border-2 border-violet-200">
              <div className="text-2xl font-black text-violet-600">{notNotified}</div>
              <div className="text-sm text-gray-600 mt-1">Chưa thông báo</div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6 flex gap-2 flex-wrap">
          {['all', 'submitted', 'reviewed', 'approved', 'rejected'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-300'
              }`}
            >
              <Filter className="w-4 h-4 inline mr-1" />
              {status === 'all' ? 'Tất cả' : status}
            </button>
          ))}
        </div>

        {/* Feedbacks */}
        <div className="space-y-4">
          {feedbacks.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-2xl border-2 border-gray-100">
              <p className="text-gray-500">Không có feedback nào</p>
            </div>
          ) : (
            feedbacks.map(feedback => (
              <FeedbackCard
                key={feedback.id}
                feedback={feedback}
                onUpdate={() => {
                  setLoading(true);
                  setTimeout(() => setLoading(false), 500);
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}