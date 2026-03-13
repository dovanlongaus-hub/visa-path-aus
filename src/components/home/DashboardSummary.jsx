import { useState, useEffect } from 'react';
import { Loader2, CheckCircle, AlertCircle, Clock, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { entities } from '@/api/supabaseClient';

const stageLabels = {
  '500': { label: 'Sinh viên', emoji: '🎓', color: 'from-blue-500 to-cyan-500' },
  '485': { label: 'Tốt nghiệp', emoji: '🎯', color: 'from-purple-500 to-pink-500' },
  '189': { label: 'PR (189)', emoji: '🦘', color: 'from-emerald-500 to-teal-500' },
  '190': { label: 'PR (190)', emoji: '🏠', color: 'from-orange-500 to-amber-500' },
  '491': { label: 'PR (491)', emoji: '🌏', color: 'from-indigo-500 to-purple-500' },
};

export default function DashboardSummary() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        // Fetch profile
        const profiles = await entities.UserProfile.list('-created_date', 1);
        if (profiles.length > 0) {
          setProfile(profiles[0]);
        }

        // Fetch tasks/checklist
        const checklistItems = await entities.Checklist.filter(
          { completed: false },
          'created_date',
          5
        );
        setTasks(checklistItems);

        // Fetch notifications
        const notifs = await entities.Notification.filter(
          { read: false },
          '-created_date',
          3
        );
        setNotifications(notifs);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
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
        <span className="text-gray-600">Đang tải dashboard...</span>
      </div>
    );
  }

  const currentStage = profile?.current_visa_type || 'unknown';
  const stageInfo = stageLabels[currentStage] || { label: 'Chưa xác định', emoji: '❓', color: 'from-gray-500 to-gray-600' };
  const pointsScore = profile?.points_score || 0;

  return (
    <div className="space-y-6">
      {/* Current Stage Summary */}
      <div className={`bg-gradient-to-r ${stageInfo.color} rounded-2xl p-6 text-white shadow-lg`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-4xl mb-2">{stageInfo.emoji}</div>
            <div className="font-bold text-sm opacity-90">Giai đoạn hiện tại</div>
            <h2 className="text-2xl font-black mt-1">Visa {currentStage} - {stageInfo.label}</h2>
            
            {profile?.current_visa_expiry && (
              <div className="mt-3 flex items-center gap-2 text-white/90 text-sm">
                <Clock className="w-4 h-4" />
                <span>Hết hạn: {new Date(profile.current_visa_expiry).toLocaleDateString('vi-VN')}</span>
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="text-sm opacity-90">Điểm EOI ước tính</div>
            <div className="text-4xl font-black mt-1">{pointsScore}</div>
            <div className="text-xs opacity-75 mt-1">
              {pointsScore >= 65 ? '✓ Đủ điểm' : '⚠️ Cần cải thiện'}
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <div className="bg-white rounded-2xl border-2 border-gray-100 p-6">
          <div className="font-bold text-lg text-[#0a1628] mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-blue-600" /> Nhiệm vụ sắp tới
          </div>
          {tasks.length === 0 ? (
            <p className="text-gray-500 text-sm">Không có nhiệm vụ chưa hoàn thành</p>
          ) : (
            <ul className="space-y-2">
              {tasks.slice(0, 4).map((task, i) => (
                <li key={i} className="flex items-start gap-3 pb-2 border-b border-gray-100 last:border-b-0">
                  <span className="text-blue-600 font-bold flex-shrink-0 mt-0.5">✓</span>
                  <div className="text-sm text-gray-700 flex-1">{task.item}</div>
                </li>
              ))}
            </ul>
          )}
          <Link
            to={createPageUrl('Checklist')}
            className="mt-4 text-blue-600 font-semibold text-sm hover:text-blue-700 inline-flex items-center gap-1"
          >
            Xem tất cả →
          </Link>
        </div>

        {/* Recent Notifications */}
        <div className="bg-white rounded-2xl border-2 border-gray-100 p-6">
          <div className="font-bold text-lg text-[#0a1628] mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600" /> Thông báo mới
          </div>
          {notifications.length === 0 ? (
            <p className="text-gray-500 text-sm">Không có thông báo mới</p>
          ) : (
            <ul className="space-y-2">
              {notifications.slice(0, 3).map((notif, i) => (
                <li key={i} className="flex items-start gap-3 pb-2 border-b border-gray-100 last:border-b-0">
                  <span className="text-amber-600 font-bold flex-shrink-0 mt-0.5">•</span>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{notif.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{notif.message}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <Link
            to={createPageUrl('Notifications')}
            className="mt-4 text-blue-600 font-semibold text-sm hover:text-blue-700 inline-flex items-center gap-1"
          >
            Xem tất cả →
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200 p-6">
        <div className="font-bold text-[#0a1628] mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" /> Hành động tiếp theo
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          <Link
            to={createPageUrl('CVUpload')}
            className="bg-white border-2 border-blue-200 rounded-lg p-4 hover:shadow-md transition-all text-center"
          >
            <div className="text-2xl mb-2">📄</div>
            <div className="font-semibold text-sm text-[#0a1628]">Upload CV</div>
            <div className="text-xs text-gray-500 mt-1">Nhận lộ trình AI</div>
          </Link>
          <Link
            to={createPageUrl('Chat')}
            className="bg-white border-2 border-blue-200 rounded-lg p-4 hover:shadow-md transition-all text-center"
          >
            <div className="text-2xl mb-2">💬</div>
            <div className="font-semibold text-sm text-[#0a1628]">Hỏi AI</div>
            <div className="text-xs text-gray-500 mt-1">24/7 tư vấn</div>
          </Link>
          <Link
            to={createPageUrl('Roadmap')}
            className="bg-white border-2 border-blue-200 rounded-lg p-4 hover:shadow-md transition-all text-center"
          >
            <div className="text-2xl mb-2">🗺️</div>
            <div className="font-semibold text-sm text-[#0a1628]">Lộ trình</div>
            <div className="text-xs text-gray-500 mt-1">PR pathway</div>
          </Link>
        </div>
      </div>
    </div>
  );
}