import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, Loader2, CheckCircle, Mail, Bell, FileText } from 'lucide-react';
import { entities, auth } from '@/api/supabaseClient';

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
      const u = await auth.me().catch(() => null);
      setUser(u);

      if (u?.settings) setSettings(u.settings);

      const profiles = await entities.UserProfile.list('-created_date', 1).catch(() => []);
      if (profiles[0]) {
        setProfile(profiles[0]);
        setNotifPrefs({
          email_notifications: profiles[0].email_notifications || false,
          notify_sol_changes: profiles[0].notify_sol_changes !== false,
          notify_visa_updates: profiles[0].notify_visa_updates !== false,
        });
      }
      setLoading(false);
    };
    init();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await auth.updateMe({ settings });
    if (profile) {
      await entities.UserProfile.update(profile.id, notifPrefs);
    } else {
      const p = await entities.UserProfile.create({ ...notifPrefs, email: user.email });
      setProfile(p);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    setSaving(false);
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
            <div className="font-bold text-lg text-[#0a1628] mb-1 flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600" /> Thông báo tự động
            </div>
            <p className="text-sm text-gray-500 mb-4">Hệ thống tự động kiểm tra tin tức di trú Úc mỗi ngày và thông báo cho bạn.</p>

            <div className="space-y-4">
              {/* Email toggle */}
              <div className={`p-4 rounded-xl border-2 transition-all ${notifPrefs.email_notifications ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifPrefs.email_notifications}
                    onChange={(e) => setNotifPrefs({ ...notifPrefs, email_notifications: e.target.checked })}
                    className="w-5 h-5 rounded border-2 border-gray-300 accent-blue-600"
                  />
                  <div>
                    <div className="flex items-center gap-2 font-semibold text-gray-800">
                      <Mail className="w-4 h-4 text-blue-600" /> Nhận email thông báo
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">Gửi email khi có tin tức quan trọng về di trú, SOL, visa mới</p>
                  </div>
                </label>
              </div>

              {notifPrefs.email_notifications && (
                <div className="ml-4 space-y-3 border-l-2 border-blue-200 pl-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifPrefs.notify_sol_changes}
                      onChange={(e) => setNotifPrefs({ ...notifPrefs, notify_sol_changes: e.target.checked })}
                      className="w-4 h-4 accent-blue-600"
                    />
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <FileText className="w-4 h-4 text-emerald-600" />
                      Thay đổi danh sách nghề nghiệp (SOL/CSOL)
                    </div>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifPrefs.notify_visa_updates}
                      onChange={(e) => setNotifPrefs({ ...notifPrefs, notify_visa_updates: e.target.checked })}
                      className="w-4 h-4 accent-blue-600"
                    />
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Bell className="w-4 h-4 text-indigo-600" />
                      Cập nhật chính sách visa từ Home Affairs
                    </div>
                  </label>
                </div>
              )}

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
                📧 Email được gửi đến: <strong>{user?.email}</strong>. Hệ thống kiểm tra tin tức <strong>mỗi ngày lúc 8:00 sáng</strong> (giờ Sydney).
              </div>
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