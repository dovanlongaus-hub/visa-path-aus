import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader2, MessageSquare, TrendingUp, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function AdminFeedbackSummary() {
  const [feedbackStats, setFeedbackStats] = useState(null);
  const [recentFeedback, setRecentFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const u = await base44.auth.me();
        setUser(u);

        if (u?.role !== 'admin') {
          setLoading(false);
          return;
        }

        // Fetch all feedback
        const allFeedback = await base44.entities.Feedback.list('-created_date', 100);
        
        // Calculate stats
        const stats = {
          total: allFeedback.length,
          submitted: allFeedback.filter(f => f.status === 'submitted').length,
          reviewed: allFeedback.filter(f => f.status === 'reviewed').length,
          approved: allFeedback.filter(f => f.status === 'approved').length,
          rejected: allFeedback.filter(f => f.status === 'rejected').length,
        };
        setFeedbackStats(stats);

        // Get recent pending feedback
        const pending = allFeedback.filter(f => f.status === 'submitted').slice(0, 3);
        setRecentFeedback(pending);
      } catch (error) {
        console.error('Error loading feedback summary:', error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  if (loading || !user || user.role !== 'admin') return null;
  if (!feedbackStats) return null;

  const hasPending = feedbackStats.submitted > 0;

  return (
    <section className="max-w-5xl mx-auto px-6 py-8">
      <div className={`rounded-2xl border-2 p-6 ${hasPending ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'}`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className={`w-5 h-5 ${hasPending ? 'text-amber-600' : 'text-emerald-600'}`} />
              <span className="font-bold text-xs uppercase tracking-wider text-gray-600">Admin Panel – Góp ý người dùng</span>
            </div>
            <h3 className={`text-2xl font-black mb-4 ${hasPending ? 'text-amber-900' : 'text-emerald-900'}`}>
              {feedbackStats.total} góp ý nhận được
            </h3>

            {hasPending && (
              <div className="mb-4 p-3 bg-amber-100 rounded-lg border border-amber-300">
                <div className="flex items-center gap-2 text-amber-900 font-semibold">
                  <AlertCircle className="w-4 h-4" />
                  {feedbackStats.submitted} góp ý chờ xử lý
                </div>
              </div>
            )}

            {recentFeedback.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-semibold text-gray-700 mb-2">Góp ý mới nhất:</div>
                {recentFeedback.map(feedback => (
                  <div key={feedback.id} className="bg-white/60 rounded-lg p-2.5 text-sm">
                    <div className="font-medium text-gray-900">{feedback.title}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {feedback.category} • {new Date(feedback.created_date).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 text-right">
            <div className="text-center">
              <div className="text-2xl font-black text-amber-600">{feedbackStats.submitted}</div>
              <div className="text-xs text-gray-600 font-medium">Chờ xử lý</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-emerald-600">{feedbackStats.approved}</div>
              <div className="text-xs text-gray-600 font-medium">Đã phê duyệt</div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Link
            to={createPageUrl('AdminFeedback')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${
              hasPending
                ? 'bg-amber-600 text-white hover:bg-amber-700'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            <TrendingUp className="w-4 h-4" /> Quản lý góp ý
          </Link>
        </div>
      </div>
    </section>
  );
}