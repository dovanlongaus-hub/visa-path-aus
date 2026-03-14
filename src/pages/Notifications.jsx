import { useState, useEffect } from 'react';
import { Bell, Check, Trash2, ToggleLeft, ToggleRight, ExternalLink, TrendingUp, TrendingDown } from 'lucide-react';

const typeLabels = {
  visa_update: '🛂 Cập nhật visa',
  deadline: '⏰ Thời hạn',
  reminder: '📌 Nhắc nhở',
  success: '✅ Thành công',
  alert: '⚠️ Cảnh báo',
};

const ALERT_RULES = [
  { key: "eoi_round", label: "EOI invitation round mới", desc: "Nhận thông báo khi có round mời EOI mới", icon: "🎯" },
  { key: "processing_time", label: "Thay đổi processing time", desc: "Khi DHA cập nhật thời gian xử lý visa", icon: "⏱️" },
  { key: "doc_expiry", label: "Nhắc hạn giấy tờ", desc: "Trước khi passport, IELTS, skills assessment hết hạn", icon: "📄" },
];

const EOI_HISTORY = [
  { date: "2026-03-01", visa: "189", minScore: 70, invitations: 1200 },
  { date: "2026-02-15", visa: "189", minScore: 68, invitations: 1450 },
  { date: "2026-02-01", visa: "189", minScore: 71, invitations: 980 },
  { date: "2026-01-15", visa: "190", state: "NSW", minScore: 80, invitations: 320 },
  { date: "2026-01-01", visa: "491", state: "TAS", minScore: 60, invitations: 450 },
];

const LAST_EOI_ROUND = EOI_HISTORY[0];

const MOCK_NOTIFICATIONS = [
  { id: "n1", type: "visa_update", title: "Visa 189 - Round mới tháng 3/2026", message: "SkillSelect vừa mời 1,200 ứng viên với điểm tối thiểu 70. Kiểm tra hồ sơ của bạn ngay.", read: false, created_date: "2026-03-01T10:00:00Z" },
  { id: "n2", type: "reminder", title: "Nhắc nhở: Kiểm tra điểm EOI", message: "Bạn chưa cập nhật điểm EOI trong 30 ngày. Hãy kiểm tra lại để đảm bảo thông tin chính xác.", read: true, created_date: "2026-02-20T08:00:00Z" },
  { id: "n3", type: "alert", title: "Thay đổi processing time Visa 190", message: "DHA vừa cập nhật: Visa 190 NSW hiện xử lý trong 12-18 tháng (tăng so với 9-12 tháng trước).", read: true, created_date: "2026-02-10T06:00:00Z" },
];

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function Notifications() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [alertPrefs, setAlertPrefs] = useState({ eoi_round: true, processing_time: true, doc_expiry: false });
  const [userScore, setUserScore] = useState(null);

  useEffect(() => {
    // Load alert prefs
    try {
      const saved = JSON.parse(localStorage.getItem("alert_prefs") || "{}");
      setAlertPrefs(prev => ({ ...prev, ...saved }));
    } catch {}

    // Load user EOI score
    try {
      const wizardResult = JSON.parse(localStorage.getItem("eligibility_wizard_result") || "{}");
      if (wizardResult.totalScore) setUserScore(wizardResult.totalScore);
    } catch {}

    // Load saved notifications from localStorage
    try {
      const saved = JSON.parse(localStorage.getItem("user_notifications") || "[]");
      if (saved.length > 0) setNotifications(saved);
    } catch {}
  }, []);

  const toggleAlert = (key) => {
    const updated = { ...alertPrefs, [key]: !alertPrefs[key] };
    setAlertPrefs(updated);
    localStorage.setItem("alert_prefs", JSON.stringify(updated));
  };

  const handleMarkAsRead = (notifId) => {
    const updated = notifications.map(n => n.id === notifId ? { ...n, read: true } : n);
    setNotifications(updated);
    localStorage.setItem("user_notifications", JSON.stringify(updated));
  };

  const handleDelete = (notifId) => {
    const updated = notifications.filter(n => n.id !== notifId);
    setNotifications(updated);
    localStorage.setItem("user_notifications", JSON.stringify(updated));
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const scoreDiff = userScore ? userScore - LAST_EOI_ROUND.minScore : null;

  return (
    <div className="min-h-screen bg-[#f8f9fc] py-6 px-4 pb-16">
      <div className="max-w-3xl mx-auto space-y-5">

        {/* Header */}
        <div className="mb-2">
          <h1 className="text-2xl font-black text-[#0a1628] mb-1 flex items-center gap-2">
            <Bell className="w-6 h-6" /> Thông báo
            {unreadCount > 0 && (
              <span className="ml-1 bg-red-500 text-white px-2.5 py-0.5 rounded-full text-sm font-bold">
                {unreadCount} mới
              </span>
            )}
          </h1>
          <p className="text-gray-500 text-sm">Cập nhật EOI rounds, processing time & nhắc nhở hồ sơ</p>
        </div>

        {/* Personalized EOI Alert Banner */}
        {userScore !== null && (
          <div className={`rounded-2xl p-4 border ${scoreDiff >= 0 ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}`}>
            {scoreDiff >= 0 ? (
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-green-800 text-sm">
                    🎉 Điểm của bạn ({userScore}) đủ điều kiện trong round gần nhất!
                  </p>
                  <p className="text-green-700 text-xs mt-1">
                    Round {formatDate(LAST_EOI_ROUND.date)}: Visa {LAST_EOI_ROUND.visa} mời điểm tối thiểu {LAST_EOI_ROUND.minScore}. Kiểm tra EOI ngay.
                  </p>
                  <a href="https://online.immi.gov.au/ola/app" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-green-700 font-semibold text-xs mt-2 hover:underline">
                    Kiểm tra EOI ngay <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <TrendingDown className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-amber-800 text-sm">
                    📈 Round gần nhất mời {LAST_EOI_ROUND.minScore} điểm. Bạn còn thiếu {Math.abs(scoreDiff)} điểm.
                  </p>
                  <p className="text-amber-700 text-xs mt-1">
                    Round {formatDate(LAST_EOI_ROUND.date)}: Visa {LAST_EOI_ROUND.visa} — {LAST_EOI_ROUND.invitations.toLocaleString()} lượt mời.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Smart Alert Rules */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            🔔 Cài đặt thông báo thông minh
          </h2>
          <div className="space-y-3">
            {ALERT_RULES.map(rule => (
              <div key={rule.key} className="flex items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="text-xl">{rule.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{rule.label}</p>
                    <p className="text-xs text-gray-400">{rule.desc}</p>
                  </div>
                </div>
                <button onClick={() => toggleAlert(rule.key)}
                  className={`flex-shrink-0 transition-colors ${alertPrefs[rule.key] ? "text-indigo-600" : "text-gray-300"}`}>
                  {alertPrefs[rule.key]
                    ? <ToggleRight className="w-8 h-8" />
                    : <ToggleLeft className="w-8 h-8" />}
                </button>
              </div>
            ))}
          </div>

          {/* Telegram subscribe */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <a href="https://t.me/visapathaus" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[#0088cc] text-white rounded-xl px-4 py-3 hover:bg-[#0077bb] transition-colors">
              <span className="text-lg">📱</span>
              <div className="flex-1">
                <p className="font-bold text-sm">Theo dõi trên Telegram</p>
                <p className="text-xs text-white/80">Nhận thông báo ngay khi có round mới</p>
              </div>
              <ExternalLink className="w-4 h-4 opacity-70" />
            </a>
          </div>
        </div>

        {/* EOI Round History */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-bold text-gray-800 mb-4">📊 Lịch sử EOI Rounds</h2>
          <div className="space-y-3">
            {EOI_HISTORY.map((round, idx) => {
              const userQualifies = userScore !== null && userScore >= round.minScore;
              const isLatest = idx === 0;
              return (
                <div key={idx}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    userQualifies
                      ? "bg-green-50 border-green-200"
                      : isLatest
                        ? "bg-blue-50 border-blue-200"
                        : "bg-gray-50 border-gray-100"
                  }`}>
                  {/* Timeline dot */}
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                    userQualifies ? "bg-green-500" : isLatest ? "bg-blue-500" : "bg-gray-300"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-gray-700">{formatDate(round.date)}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        round.visa === "189" ? "bg-blue-100 text-blue-700" :
                        round.visa === "190" ? "bg-purple-100 text-purple-700" :
                        "bg-orange-100 text-orange-700"
                      }`}>
                        Visa {round.visa}{round.state ? ` (${round.state})` : ""}
                      </span>
                      {isLatest && <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded">Mới nhất</span>}
                      {userQualifies && <span className="text-xs bg-green-500 text-white px-1.5 py-0.5 rounded">✓ Đủ điểm</span>}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span>Điểm tối thiểu: <strong className="text-gray-700">{round.minScore}</strong></span>
                      <span>·</span>
                      <span>{round.invitations.toLocaleString()} lượt mời</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Notification List */}
        <div>
          <h2 className="font-bold text-gray-800 mb-3">📬 Thông báo hệ thống</h2>
          {notifications.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border-2 border-gray-100">
              <Bell className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 font-medium mb-1">Không có thông báo nào</p>
              <p className="text-sm text-gray-400">Bạn sẽ nhận thông báo khi có cập nhật visa hoặc nhắc nhở quan trọng</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map(notif => (
                <div key={notif.id}
                  className={`rounded-xl border-2 overflow-hidden transition-all ${
                    notif.read ? "bg-white border-gray-100" : "bg-blue-50 border-blue-200"
                  }`}>
                  <div className="p-4 flex items-start gap-3">
                    <div className="text-xl flex-shrink-0">{typeLabels[notif.type]?.charAt(0) || '📌'}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className={`font-bold text-sm ${notif.read ? "text-gray-900" : "text-blue-900"}`}>
                            {notif.title}
                          </h3>
                          <p className={`text-xs mt-1 ${notif.read ? "text-gray-600" : "text-blue-800"}`}>
                            {notif.message}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {!notif.read && (
                            <button onClick={() => handleMarkAsRead(notif.id)}
                              className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                              title="Đánh dấu đã đọc">
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button onClick={() => handleDelete(notif.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                        <span>{typeLabels[notif.type]}</span>
                        <span>•</span>
                        <span>{formatDate(notif.created_date)}</span>
                      </div>
                      {notif.action_url && (
                        <a href={notif.action_url}
                          className="mt-2 inline-block text-blue-600 font-semibold text-xs hover:text-blue-700">
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
    </div>
  );
}
