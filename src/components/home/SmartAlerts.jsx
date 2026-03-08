import { useState, useEffect } from "react";
import { AlertCircle, Bell, X, CheckCircle2, RefreshCw } from "lucide-react";
import { Notification } from "@/api/entities";

const DEFAULT_ALERTS = [
  {
    id: "skills_assessment",
    type: "warning",
    title: "Nhắc nhở: Skills Assessment",
    message: "Hãy đảm bảo bạn đã nộp Skills Assessment trước khi nộp EOI vào SkillSelect.",
  },
  {
    id: "skillselect_round",
    type: "info",
    title: "SkillSelect — Vòng mời mới",
    message: "Vòng mời SkillSelect diễn ra hàng tháng. Theo dõi điểm cutoff để chuẩn bị.",
  },
];

export default function SmartAlerts({ user }) {
  const storageKey = `smartAlerts_dismissed_${user?.id || "guest"}`;
  const getDismissed = () => {
    try { return JSON.parse(localStorage.getItem(storageKey) || "[]"); } catch { return []; }
  };

  const [dismissed, setDismissed] = useState(getDismissed);
  const [liveAlerts, setLiveAlerts] = useState([]);

  // Fetch unread urgent notifications from DB
  useEffect(() => {
    if (!user?.id) return;
    Notification.filter({ user_id: user.id, is_read: false })
      .then((rows) => {
        const urgent = (rows || [])
          .filter((n) => n.urgent || n.type === "alert")
          .slice(0, 3)
          .map((n) => ({
            id: `notif_${n.id}`,
            type: n.type === "alert" ? "warning" : "info",
            title: n.title,
            message: n.message,
            notifId: n.id,
          }));
        setLiveAlerts(urgent);
      })
      .catch(() => {});
  }, [user?.id]);

  const dismiss = (id, notifId) => {
    const next = [...dismissed, id];
    setDismissed(next);
    try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch {}
    // Mark the notification as read in DB
    if (notifId) {
      Notification.update(notifId, { is_read: true }).catch(() => {});
    }
  };

  const allAlerts = [
    ...liveAlerts,
    ...DEFAULT_ALERTS,
  ];
  const visible = allAlerts.filter((a) => !dismissed.includes(a.id));
  if (!visible.length) return null;

  return (
    <div className="space-y-3">
      {visible.map((alert) => (
        <div
          key={alert.id}
          className={`flex items-start gap-3 rounded-xl p-4 border ${
            alert.type === "warning"
              ? "bg-amber-50 border-amber-200"
              : "bg-blue-50 border-blue-200"
          }`}
        >
          {alert.type === "warning" ? (
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          ) : (
            <Bell className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900">{alert.title}</p>
            <p className="text-xs text-gray-600 mt-0.5">{alert.message}</p>
          </div>
          <button
            onClick={() => dismiss(alert.id, alert.notifId)}
            className="p-1 rounded-lg hover:bg-black/5 flex-shrink-0"
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      ))}
    </div>
  );
}