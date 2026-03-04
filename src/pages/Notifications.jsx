import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Bell, Loader2, Check, Trash2 } from 'lucide-react';

const typeLabels = {
  visa_update: '🛂 Cập nhật visa',
  deadline: '⏰ Thời hạn',
  reminder: '📌 Nhắc nhở',
  success: '✅ Thành công',
  alert: '⚠️ Cảnh báo',
};

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      const data = await base44.entities.Notification.list('-created_date', 50).catch(() => []);
      setNotifications(data);
      setLoading(false);
    };
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (notifId) => {
    await base44.entities.Notification.update(notifId, { read: true });
    setNotifications(notifications.map(n => n.id === notifId ? { ...n, read: true } : n));
  };

  const handleDelete = async (notifId) => {
    await base44.entities.Notification.delete(notifId);
    setNotifications(notifications.filter(n => n.id !== notifId));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-[#0a1628] mb-2 flex items-center gap-2">
            <Bell className="w-8 h-8" /> Thông báo
            {unreadCount > 0 && (
              <span className="ml-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                {unreadCount} mới
              </span>
            )}
          </h1>
          <p className="text-gray-600">Quản lý tất cả thông báo của bạn</p>
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border-2 border-gray-100">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">Không có thông báo nào</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map(notif => (
              <div
                key={notif.id}
                className={`rounded-lg border-2 overflow-hidden transition-all ${
                  notif.read
                    ? 'bg-white border-gray-200'
                    : 'bg-blue-50 border-blue-300'
                }`}
              >
                <div className="p-5 flex items-start gap-4">
                  <div className="text-2xl flex-shrink-0 mt-1">{typeLabels[notif.type]?.charAt(0) || '📌'}</div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className={`font-bold ${notif.read ? 'text-gray-900' : 'text-blue-900'}`}>
                          {notif.title}
                        </h3>
                        <p className={`text-sm mt-1 ${notif.read ? 'text-gray-600' : 'text-blue-800'}`}>
                          {notif.message}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {!notif.read && (
                          <button
                            onClick={() => handleMarkAsRead(notif.id)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Đánh dấu đã đọc"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notif.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
                      <span>{typeLabels[notif.type]}</span>
                      <span>•</span>
                      <span>{new Date(notif.created_date).toLocaleDateString('vi-VN')}</span>
                    </div>

                    {notif.action_url && (
                      <a
                        href={notif.action_url}
                        className="mt-3 inline-block text-blue-600 font-semibold text-sm hover:text-blue-700"
                      >
                        Chi tiết →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}