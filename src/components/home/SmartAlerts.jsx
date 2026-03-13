import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {   Bell, AlertTriangle, Clock, Zap, CheckCircle, ChevronDown, ChevronUp,
  Loader2, RefreshCw, X, Calendar, ArrowRight, Sparkles
 } from "lucide-react";
import { entities  } from '@/api/supabaseClient';
import { invokeLLMSmart  } from '@/api/aiClient';

// ──────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

// ──────────────────────────────────────────────────────────────
// Generate rule-based alerts from profile
// ──────────────────────────────────────────────────────────────

function generateAlerts(profile) {
  if (!profile) return [];
  const alerts = [];
  const now = new Date();

  // 1. Visa expiry
  const visaDays = daysUntil(profile.current_visa_expiry);
  if (visaDays !== null) {
    if (visaDays < 0) {
      alerts.push({
        id: "visa_expired",
        level: "critical",
        icon: AlertTriangle,
        title: "⚠️ Visa đã hết hạn!",
        body: `Visa ${profile.current_visa_type || ""} của bạn đã hết hạn ${Math.abs(visaDays)} ngày trước. Liên hệ MARA agent ngay lập tức.`,
        action: { label: "Tư vấn AI ngay", link: "Chat" },
      });
    } else if (visaDays <= 30) {
      alerts.push({
        id: "visa_30days",
        level: "urgent",
        icon: Clock,
        title: `Visa ${profile.current_visa_type || ""} sắp hết hạn!`,
        body: `Visa của bạn còn ${visaDays} ngày (${formatDate(profile.current_visa_expiry)}). Hãy chuẩn bị nộp visa tiếp theo hoặc gia hạn ngay.`,
        action: { label: "Xem biểu mẫu", link: "Forms" },
      });
    } else if (visaDays <= 90) {
      alerts.push({
        id: "visa_90days",
        level: "warning",
        icon: Calendar,
        title: `Visa hết hạn trong ${visaDays} ngày`,
        body: `Visa ${profile.current_visa_type || ""} hết hạn ngày ${formatDate(profile.current_visa_expiry)}. Đây là thời điểm tốt để bắt đầu chuẩn bị hồ sơ visa tiếp theo.`,
        action: { label: "Xem lộ trình", link: "Roadmap" },
      });
    }
  }

  // 2. Passport expiry
  const passportDays = daysUntil(profile.passport_expiry);
  if (passportDays !== null && passportDays <= 180) {
    alerts.push({
      id: "passport_expiry",
      level: passportDays <= 60 ? "urgent" : "warning",
      icon: AlertTriangle,
      title: passportDays <= 0 ? "Hộ chiếu đã hết hạn!" : `Hộ chiếu hết hạn trong ${passportDays} ngày`,
      body: passportDays <= 0
        ? "Hộ chiếu hết hạn có thể ảnh hưởng nghiêm trọng đến visa. Gia hạn ngay."
        : `Hộ chiếu hết hạn ngày ${formatDate(profile.passport_expiry)}. Hầu hết visa yêu cầu hộ chiếu còn hiệu lực ít nhất 6 tháng khi nộp hồ sơ.`,
      action: null,
    });
  }

  // 3. Visa 485 → Skills Assessment reminder
  if (profile.current_visa_type === "485" && !profile.skills_assessment_done) {
    const gradYear = parseInt(profile.graduation_year);
    if (gradYear && (now.getFullYear() - gradYear) >= 1) {
      alerts.push({
        id: "skills_assessment",
        level: "info",
        icon: Zap,
        title: "Chưa có Skills Assessment – Cần làm ngay",
        body: "Bạn đang ở Visa 485 và chưa có Skills Assessment. Đây là điều kiện bắt buộc để nộp EOI SkillSelect (Visa 189/190/491). Thời gian xử lý thường 2–4 tháng.",
        action: { label: "Xem hướng dẫn", link: "Checklist" },
      });
    }
  }

  // 4. Visa 485 → EOI reminder (if skills assessment done)
  if (profile.current_visa_type === "485" && profile.skills_assessment_done) {
    alerts.push({
      id: "eoi_ready",
      level: "info",
      icon: Sparkles,
      title: "Đã có Skills Assessment – Sẵn sàng nộp EOI!",
      body: "Bạn đủ điều kiện nộp EOI SkillSelect ngay. Kiểm tra điểm EOI và nộp sớm để tăng cơ hội được mời (invitation).",
      action: { label: "Tính điểm EOI", link: "Profile" },
    });
  }

  // 5. Student visa → 485 preparation
  if (profile.current_visa_type === "500") {
    const gradYear = parseInt(profile.graduation_year);
    if (gradYear) {
      const monthsToGrad = (gradYear - now.getFullYear()) * 12 + (12 - now.getMonth());
      if (monthsToGrad <= 6 && monthsToGrad >= 0) {
        alerts.push({
          id: "grad_485_prep",
          level: "warning",
          icon: Clock,
          title: "Sắp tốt nghiệp – Chuẩn bị Visa 485 ngay!",
          body: `Dự kiến bạn tốt nghiệp vào năm ${gradYear}. Hãy chuẩn bị hồ sơ Visa 485 (Temporary Graduate) ngay bây giờ. Visa 485 được nộp sau khi có kết quả tốt nghiệp chính thức.`,
          action: { label: "Xem yêu cầu 485", link: "Forms" },
        });
      }
    }
  }

  // 6. PR holders → citizenship reminder
  if (["189", "190", "491"].includes(profile.current_visa_type)) {
    const visaGrant = profile.current_visa_expiry ? new Date(profile.current_visa_expiry) : null;
    alerts.push({
      id: "pr_citizenship",
      level: "info",
      icon: CheckCircle,
      title: "Bạn đang có PR – Theo dõi điều kiện quốc tịch",
      body: "Để xin quốc tịch Úc, bạn cần sống tại Úc 4 năm, trong đó 12 tháng cuối phải là PR. Hãy ghi lại ngày được cấp PR để tính thời điểm đủ điều kiện.",
      action: { label: "Tư vấn AI", link: "Chat" },
    });
  }

  // 7. English test expiry (IELTS/PTE typically valid 3 years)
  if (profile.english_score && profile.english_test_type) {
    // We can't know exact test date, just remind if they're on visa 485/500
    if (profile.current_visa_type === "485") {
      alerts.push({
        id: "english_validity",
        level: "info",
        icon: Calendar,
        title: "Kiểm tra hiệu lực bằng tiếng Anh",
        body: `Bằng ${profile.english_test_type} thường có hiệu lực 3 năm (IELTS/PTE) hoặc 2 năm (TOEFL). Đảm bảo bằng của bạn còn hiệu lực khi nộp EOI và visa PR.`,
        action: null,
      });
    }
  }

  return alerts;
}

// ──────────────────────────────────────────────────────────────
// Level config
// ──────────────────────────────────────────────────────────────

const levelConfig = {
  critical: { bg: "bg-rose-50", border: "border-rose-300", ring: "ring-rose-200", dot: "bg-rose-500", label: "bg-rose-100 text-rose-700", labelText: "Khẩn cấp" },
  urgent:   { bg: "bg-orange-50", border: "border-orange-300", ring: "ring-orange-200", dot: "bg-orange-500", label: "bg-orange-100 text-orange-700", labelText: "Cần xử lý sớm" },
  warning:  { bg: "bg-amber-50", border: "border-amber-200", ring: "ring-amber-100", dot: "bg-amber-400", label: "bg-amber-100 text-amber-700", labelText: "Lưu ý" },
  info:     { bg: "bg-blue-50", border: "border-blue-200", ring: "ring-blue-100", dot: "bg-blue-400", label: "bg-blue-100 text-blue-700", labelText: "Nhắc nhở" },
};

// ──────────────────────────────────────────────────────────────
// AI Reminder Panel
// ──────────────────────────────────────────────────────────────

function AIReminders({ profile }) {
  const [loading, setLoading] = useState(false);
  const [reminders, setReminders] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const generateAIReminders = async () => {
    setLoading(true);
    setExpanded(true);
    const profileSummary = `
Tình trạng hồ sơ di trú:
- Visa hiện tại: ${profile.current_visa_type || "chưa rõ"}
- Visa hết hạn: ${profile.current_visa_expiry || "chưa điền"}
- Năm tốt nghiệp: ${profile.graduation_year || "chưa điền"}
- Tiếng Anh: ${profile.english_test_type || ""} ${profile.english_score || "chưa điền"}
- Skills Assessment: ${profile.skills_assessment_done ? "Đã hoàn thành" : "Chưa làm"}
- Occupation: ${profile.occupation_code || "chưa rõ"}
- Giai đoạn hiện tại: ${profile.current_stage || "chưa xác định"}
    `.trim();

    try {
      const result = await invokeLLMSmart(prompt, {
        prompt: `Bạn là chuyên gia tư vấn di trú Úc cho người Việt. Dựa trên tình trạng hồ sơ bên dưới, hãy đưa ra 3-4 lời nhắc hành động CỤ THỂ và THỰC TẾ nhất mà người dùng nên làm NGAY TRONG 30 NGÀY TỚI.

${profileSummary}

Ngày hôm nay: ${new Date().toLocaleDateString("vi-VN")}

Yêu cầu:
- Mỗi nhắc nhở cần cụ thể, có thể hành động được ngay
- Ưu tiên theo mức độ khẩn cấp
- Trả lời bằng tiếng Việt
- Ngắn gọn, thực tế`,
        response_json_schema: {
          type: "object",
          properties: {
            reminders: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  priority: { type: "string", enum: ["cao", "trung bình", "thấp"] },
                  action: { type: "string" },
                  reason: { type: "string" },
                  timeline: { type: "string" },
                }
              }
            },
            overall_status: { type: "string" },
          }
        }
      });
      setReminders(result);
    } catch (e) {
      setReminders({ error: true });
    }
    setLoading(false);
  };

  const priorityColor = { "cao": "rose", "trung bình": "amber", "thấp": "blue" };
  const pColor = (p) => ({
    cao: "bg-rose-100 text-rose-700",
    "trung bình": "bg-amber-100 text-amber-700",
    thấp: "bg-blue-100 text-blue-700",
  })[p] || "bg-gray-100 text-gray-600";

  return (
    <div className="bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200 rounded-2xl overflow-hidden">
      <button
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/30 transition-colors"
        onClick={() => { if (!reminders && !loading) generateAIReminders(); else setExpanded(!expanded); }}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="text-left">
            <div className="font-semibold text-[#0a1628] text-sm">AI nhắc nhở chủ động</div>
            <div className="text-xs text-violet-600">Phân tích hồ sơ & đưa ra việc cần làm trong 30 ngày tới</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {reminders && !loading && (
            <button onClick={(e) => { e.stopPropagation(); generateAIReminders(); }} className="p-1.5 rounded-lg hover:bg-white/50 text-violet-400">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
          {loading ? <Loader2 className="w-4 h-4 animate-spin text-violet-500" /> : expanded ? <ChevronUp className="w-4 h-4 text-violet-400" /> : <ChevronDown className="w-4 h-4 text-violet-400" />}
        </div>
      </button>

      {(loading || (reminders && expanded)) && (
        <div className="px-5 pb-5 border-t border-violet-100">
          {loading && (
            <div className="flex items-center gap-3 py-6 text-violet-600">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">AI đang phân tích hồ sơ của bạn...</span>
            </div>
          )}

          {reminders && !loading && !reminders.error && (
            <div className="mt-4 space-y-3">
              {reminders.overall_status && (
                <div className="text-xs text-violet-700 bg-violet-100 rounded-xl px-3 py-2 font-medium">
                  📊 {reminders.overall_status}
                </div>
              )}
              {reminders.reminders?.map((r, i) => (
                <div key={i} className="bg-white rounded-xl border border-violet-100 p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="font-semibold text-[#0a1628] text-sm leading-snug">{r.action}</div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${pColor(r.priority)}`}>{r.priority}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-1">{r.reason}</p>
                  {r.timeline && <p className="text-xs text-violet-600 font-medium">⏰ {r.timeline}</p>}
                </div>
              ))}
            </div>
          )}

          {reminders?.error && (
            <div className="mt-4 text-sm text-gray-500 py-2">Không thể tải nhắc nhở. <button onClick={generateAIReminders} className="text-violet-600 underline">Thử lại</button></div>
          )}
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Alert Item
// ──────────────────────────────────────────────────────────────

function AlertItem({ alert, onDismiss }) {
  const lc = levelConfig[alert.level];
  const Icon = alert.icon;
  return (
    <div className={`relative rounded-2xl border p-4 ${lc.bg} ${lc.border} ring-1 ${lc.ring}`}>
      <button onClick={() => onDismiss(alert.id)} className="absolute top-3 right-3 text-gray-300 hover:text-gray-500 transition-colors">
        <X className="w-3.5 h-3.5" />
      </button>
      <div className="flex items-start gap-3 pr-5">
        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${lc.dot} animate-pulse`} />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${lc.label}`}>{lc.labelText}</span>
            <span className="font-semibold text-[#0a1628] text-sm">{alert.title}</span>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed mb-2">{alert.body}</p>
          {alert.action && (
            <Link to={createPageUrl(alert.action.link)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#0f2347] hover:text-blue-700 transition-colors">
              {alert.action.label} <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Main SmartAlerts Component
// ──────────────────────────────────────────────────────────────

export default function SmartAlerts() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(() => {
    try { return JSON.parse(localStorage.getItem("dismissed_alerts") || "[]"); } catch { return []; }
  });
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    entities.UserProfile.list("-created_date", 1)
      .then(list => setProfile(list[0] || null))
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, []);

  const dismissAlert = (id) => {
    const next = [...dismissed, id];
    setDismissed(next);
    localStorage.setItem("dismissed_alerts", JSON.stringify(next));
  };

  if (loading) return null;

  if (!profile) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center gap-3">
        <Bell className="w-5 h-5 text-blue-400 flex-shrink-0" />
        <p className="text-sm text-blue-700">
          <Link to={createPageUrl("Profile")} className="font-semibold underline">Điền hồ sơ cá nhân</Link> để nhận thông báo và nhắc nhở tự động về các mốc thời gian quan trọng trong hành trình di trú.
        </p>
      </div>
    );
  }

  const allAlerts = generateAlerts(profile).filter(a => !dismissed.includes(a.id));
  const criticalUrgent = allAlerts.filter(a => a.level === "critical" || a.level === "urgent");
  const others = allAlerts.filter(a => a.level !== "critical" && a.level !== "urgent");
  const displayed = showAll ? allAlerts : [...criticalUrgent, ...others.slice(0, 1)];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-[#0f2347]" />
          <h2 className="text-xl font-bold text-[#0a1628]">Thông báo & Nhắc nhở</h2>
          {allAlerts.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-xs font-bold flex items-center justify-center">
              {allAlerts.length}
            </span>
          )}
        </div>
        {dismissed.length > 0 && (
          <button onClick={() => { setDismissed([]); localStorage.removeItem("dismissed_alerts"); }}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
            Hiện lại tất cả
          </button>
        )}
      </div>

      {/* Rule-based alerts */}
      {allAlerts.length === 0 ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          <p className="text-sm text-emerald-700">Không có cảnh báo khẩn cấp. Hồ sơ của bạn đang ổn định.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map(alert => <AlertItem key={alert.id} alert={alert} onDismiss={dismissAlert} />)}
          {allAlerts.length > displayed.length && (
            <button onClick={() => setShowAll(true)} className="w-full py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors">
              Xem thêm {allAlerts.length - displayed.length} thông báo
            </button>
          )}
        </div>
      )}

      {/* AI Reminders */}
      <AIReminders profile={profile} />
    </div>
  );
}