import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Settings as SettingsIcon, Save, Loader2, CheckCircle, Mail, Bell, FileText } from 'lucide-react';

export default function Settings() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [settings, setSettings] = useState({
    language: 'vi',
    notifications_email: true,
    notifications_push: true,
    theme: 'light',
  });
  const [notifPrefs, setNotifPrefs] = useState({
    email_notifications: false,
    notify_sol_changes: true,
    notify_visa_updates: true,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const u = await base44.auth.me().catch(() => null);
      setUser(u);

      const savedSettings = await base44.auth.me().catch(() => ({}));
      if (savedSettings.settings) {
        setSettings(savedSettings.settings);
      }
      setLoading(false);
    };
    init();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await base44.auth.updateMe({
        settings,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Vui lòng đăng nhập để truy cập cài đặt</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-[#0a1628] mb-2 flex items-center gap-2">
            <SettingsIcon className="w-8 h-8" /> Cài đặt
          </h1>
          <p className="text-gray-600">Quản lý cài đặt tài khoản và thông báo</p>
        </div>

        {saved && (
          <div className="mb-6 bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <p className="text-emerald-700 font-medium">Cài đặt đã được lưu thành công</p>
          </div>
        )}

        <div className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden">
          {/* Profile Section */}
          <div className="p-6 border-b-2 border-gray-100">
            <div className="font-bold text-lg text-[#0a1628] mb-4">👤 Thông tin tài khoản</div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tên</label>
                <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">{user.full_name || 'N/A'}</div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">{user.email}</div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Vai trò</label>
                <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900 capitalize">{user.role}</div>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="p-6 border-b-2 border-gray-100">
            <div className="font-bold text-lg text-[#0a1628] mb-4">⚙️ Tùy chọn</div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ngôn ngữ</label>
                <select
                  value={settings.language}
                  onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
                >
                  <option value="vi">Tiếng Việt</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Giao diện</label>
                <select
                  value={settings.theme}
                  onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
                >
                  <option value="light">Sáng</option>
                  <option value="dark">Tối</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="p-6">
            <div className="font-bold text-lg text-[#0a1628] mb-4">🔔 Thông báo</div>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications_email}
                  onChange={(e) => setSettings({ ...settings, notifications_email: e.target.checked })}
                  className="w-5 h-5 rounded border-2 border-gray-300"
                />
                <span className="text-gray-700 font-medium">Nhận thông báo qua email</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications_push}
                  onChange={(e) => setSettings({ ...settings, notifications_push: e.target.checked })}
                  className="w-5 h-5 rounded border-2 border-gray-300"
                />
                <span className="text-gray-700 font-medium">Nhận thông báo push</span>
              </label>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-lg font-bold hover:shadow-lg disabled:opacity-60 transition-all flex items-center justify-center gap-2"
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Đang lưu...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Lưu cài đặt
            </>
          )}
        </button>
      </div>
    </div>
  );
}