import { useState, useEffect } from "react";
import {
  Bell, BellOff, Check, Trash2, RefreshCw,
  AlertCircle, Info, CheckCircle2, Clock, Zap
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Notification, User } from "@/api/entities";

const TYPE_CONFIG = {
  visa_update: { icon: Bell,         color: "text-blue-600",   bg: "bg-blue-50",   border: "border-blue-100", label: "Visa" },
  deadline:    { icon: Clock,        color: "text-amber-600",  bg: "bg-amber-50",  border: "border-amber-100", label: "Deadline" },
  reminder:    { icon: Info,         color: "text-gray-600",   bg: "bg-gray-50",   border: "border-gray-100",  label: "Nhắc nhở" },
  success:     { icon: CheckCircle2, color: "text-emerald-600",bg: "bg-emerald-50",border: "border-emerald-100",label: "Thành công" },
  alert:       { icon: AlertCircle,  color: "text-red-600",    bg: "bg-red-50",    border: "border-red-100",   label: "Cảnh báo" },
};

export default function Notifications() {
  const [user, setUser]           = useState(null);
  const [notifications, setNots]  = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter]       = useState("all"); // "all" | "unread"

  useEffect(() => {
    (async () => {
      try {
        const u = await User.me();
        setUser(u);
        await loadNotifications(u.id);
      } catch {
        setIsLoading(false);
      }
    })();
  }, []);

  const loadNotifications = async (userId) => {
    setIsLoading(true);
    try {
      const all = await Notification.filter({ user_id: userId });
      const sorted = (all || []).sort(
        (a, b) => new Date(b.created_date || b.date || 0) - new Date(a.created_date || a.date || 0)
      );
      setNots(sorted);
    } catch {
      setNots([]);
    } finally {
      setIsLoading(false);
    }
  };

  const markRead = async (id) => {
    try {
      await Notification.update(id, { is_read: true });
      setNots((prev) => prev.map((n) => n.id === id ? { ...n, is_read: true } : n));
    } catch {}
  };

  const markAllRead = async () => {
    const unread = notifications.filter((n) => !n.is_read);
    for (const n of unread) {
      try { await Notification.update(n.id, { is_read: true }); } catch {}
    }
    setNots((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const deleteNotification = async (id) => {
    try {
      await Notification.delete(id);
      setNots((prev) => prev.filter((n) => n.id !== id));
    } catch {}
  };

  const deleteAll = async () => {
    for (const n of notifications) {
      try { await Notification.delete(n.id); } catch {}
    }
    setNots([]);
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const displayed = filter === "unread" ? notifications.filter((n) => !n.is_read) : notifications;

  if (!user && !isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 px-4">
        <BellOff className="h-10 w-10 text-gray-300" />
        <p className="text-gray-500">Đăng nhập để xem thông báo.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <div className="bg-gray-950 text-white px-4 py-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <Bell className="h-5 w-5 text-white" />
              </div>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold">Thông Báo</h1>
              <p className="text-xs text-gray-400">
                {unreadCount > 0 ? `${unreadCount} chưa đọc` : "Không có thông báo mới"}
              </p>
            </div>
          </div>
          {notifications.length > 0 && (
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={markAllRead}
                  className="text-gray-300 hover:text-white hover:bg-white/10 text-xs"
                >
                  <Check className="h-3.5 w-3.5 mr-1" /> Đọc tất cả
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={deleteAll}
                className="text-gray-400 hover:text-red-400 hover:bg-white/10 text-xs"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4">
        {/* Filter tabs */}
        <div className="flex gap-2 mb-4">
          {[
            { id: "all",    label: `Tất Cả (${notifications.length})` },
            { id: "unread", label: `Chưa Đọc (${unreadCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filter === tab.id
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* List */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
            <p className="text-gray-500 text-sm">Đang tải thông báo...</p>
          </div>
        ) : displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <BellOff className="h-12 w-12 text-gray-200" />
            <p className="text-gray-400 font-medium">
              {filter === "unread" ? "Không có thông báo chưa đọc." : "Chưa có thông báo nào."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayed.map((notif) => {
              const cfg = TYPE_CONFIG[notif.type] || TYPE_CONFIG.reminder;
              const Icon = cfg.icon;
              return (
                <div
                  key={notif.id}
                  className={`bg-white rounded-2xl border ${cfg.border} shadow-sm p-4 flex gap-3 ${!notif.is_read ? "ring-2 ring-blue-100" : ""}`}
                >
                  <div className={`w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center ${cfg.bg}`}>
                    <Icon className={`h-4 w-4 ${cfg.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <Badge className={`text-xs border-0 ${cfg.bg} ${cfg.color}`}>{cfg.label}</Badge>
                      {!notif.is_read && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                      )}
                    </div>
                    <p className={`text-sm font-semibold text-gray-900 leading-snug ${!notif.is_read ? "font-bold" : ""}`}>
                      {notif.title}
                    </p>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">{notif.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {notif.date || notif.created_date
                        ? new Date(notif.date || notif.created_date).toLocaleDateString("vi-VN")
                        : ""}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 flex-shrink-0">
                    {!notif.is_read && (
                      <button
                        onClick={() => markRead(notif.id)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                        title="Đánh dấu đã đọc"
                      >
                        <Check className="h-3.5 w-3.5 text-gray-400" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notif.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      title="Xóa thông báo"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-gray-400 hover:text-red-500" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}