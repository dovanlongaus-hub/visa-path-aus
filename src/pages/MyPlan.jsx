import { useState, useEffect } from "react";
import PremiumGate from "@/components/PremiumGate";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Clock, AlertTriangle, Zap, Sparkles,
  ChevronDown, ChevronUp, ArrowRight, User, Loader2, RefreshCw,
  Target, BookOpen, Award, Briefcase, FileText, Calendar, Star
} from "lucide-react";
import { entities } from '@/api/supabaseClient';
import { invokeLLMSmart } from '@/api/aiClient';

// ──────────────────────────────────────────────────────────────
// Task engine: generates personalised tasks based on profile
// ──────────────────────────────────────────────────────────────

function getAge(dob) {
  if (!dob) return null;
  return Math.floor((new Date() - new Date(dob)) / (365.25 * 24 * 60 * 60 * 1000));
}
function daysUntil(dateStr) {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
}

function buildTaskList(profile) {
  if (!profile) return [];
  const tasks = [];
  const visa = profile.current_visa_type;
  const age = getAge(profile.date_of_birth);
  const visaDays = daysUntil(profile.current_visa_expiry);
  const passportDays = daysUntil(profile.passport_expiry);
  const score = parseFloat(profile.english_score) || 0;
  const auYears = parseInt(profile.australia_work_years) || 0;

  // ── IELTS / PTE score quality
  const ieltsGood = profile.english_test_type === "IELTS" && score >= 7.0;
  const ptEgood = profile.english_test_type === "PTE" && score >= 65;
  const englishGood = ieltsGood || ptEgood;
  const englishSuperior = (profile.english_test_type === "IELTS" && score >= 8.0) || (profile.english_test_type === "PTE" && score >= 79);

  // ── Visa 500
  if (visa === "500") {
    tasks.push({
      id: "ielts_485",
      urgency: englishGood ? "done" : "high",
      category: "Tiếng Anh",
      icon: BookOpen,
      title: englishGood ? `✅ Tiếng Anh ${profile.english_test_type} ${score} – Đủ điều kiện 485` : `📚 Thi ${profile.english_test_type || "IELTS"} đạt 6.0+ cho Visa 485`,
      detail: "Visa 485 yêu cầu IELTS 6.0 mỗi kỹ năng (PTE 50+). Cần thi và có kết quả trước khi tốt nghiệp.",
      action: { label: "Hỏi AI về IELTS", page: "Chat" },
      timeframe: "Trong kỳ học",
    });

    tasks.push({
      id: "ielts_eoi",
      urgency: englishSuperior ? "done" : englishGood ? "medium" : "high",
      category: "Tiếng Anh",
      icon: Star,
      title: englishSuperior ? `✅ Tiếng Anh Superior – Tối đa điểm EOI!` : "🎯 Thi IELTS 8.0+ (PTE 79+) để đạt Superior – +20 điểm EOI",
      detail: "Superior English mang lại 20 điểm EOI (cao nhất). Đây là 1 trong những cách tăng điểm hiệu quả nhất.",
      action: { label: "Tính điểm EOI", page: "Profile" },
      timeframe: "Ưu tiên cao – trước khi nộp EOI",
    });

    tasks.push({
      id: "anzsco_research",
      urgency: profile.occupation_code ? "done" : "high",
      category: "Nghề nghiệp",
      icon: Briefcase,
      title: profile.occupation_code ? `✅ ANZSCO ${profile.occupation_code} đã xác định` : "🔍 Xác định ANZSCO code & cơ quan Skills Assessment",
      detail: "Mỗi ngành nghề có ANZSCO riêng. Cần biết sớm để chọn đúng cơ quan đánh giá (ACS, Engineers Australia, VETASSESS, v.v.).",
      action: { label: "Hỏi AI về ANZSCO", page: "Chat" },
      timeframe: "Càng sớm càng tốt",
    });

    tasks.push({
      id: "regional_study",
      urgency: profile.regional_study === "yes" ? "done" : "medium",
      category: "Điểm EOI",
      icon: Target,
      title: profile.regional_study === "yes" ? "✅ Đã học regional – +5 điểm EOI" : "📍 Xem xét học tại regional university (+5 điểm EOI)",
      detail: "Học tại vùng regional của Úc mang lại +5 điểm EOI. Nếu chưa bắt đầu, đây là cơ hội tốt.",
      action: { label: "Xem lộ trình", page: "Roadmap" },
      timeframe: "Trước khi tốt nghiệp",
    });

    const gradYear = parseInt(profile.graduation_year);
    if (gradYear && (gradYear - new Date().getFullYear()) <= 1) {
      tasks.push({
        id: "prepare_485",
        urgency: "high",
        category: "Visa tiếp theo",
        icon: FileText,
        title: "⏳ Chuẩn bị hồ sơ Visa 485 – Sắp đến lúc nộp",
        detail: "Visa 485 phải nộp trong 6 tháng sau khi tốt nghiệp. Cần có IELTS 6.0, xác nhận tốt nghiệp và nộp trước khi Visa 500 hết hạn.",
        action: { label: "Xem biểu mẫu 485", page: "Forms" },
        timeframe: "Trong 6 tháng tới",
      });
    }
  }

  // ── Visa 485
  if (visa === "485") {
    if (!profile.skills_assessment_done) {
      tasks.push({
        id: "skills_assessment",
        urgency: "high",
        category: "Skills Assessment",
        icon: Award,
        title: "🚨 Làm Skills Assessment ngay – bắt buộc để nộp EOI",
        detail: `Với ANZSCO ${profile.occupation_code || "của bạn"}, bạn cần nộp hồ sơ Skills Assessment đến cơ quan phù hợp. Thời gian xử lý thường 2–4 tháng. Đây là điều kiện bắt buộc trước khi nộp EOI.`,
        action: { label: "Hỏi AI ngay", page: "Chat" },
        timeframe: "Ưu tiên cao – làm ngay",
      });
    } else {
      tasks.push({
        id: "skills_assessment",
        urgency: "done",
        category: "Skills Assessment",
        icon: Award,
        title: "✅ Skills Assessment hoàn thành",
        detail: "Bạn đã hoàn thành Skills Assessment. Sẵn sàng nộp EOI SkillSelect.",
        action: null,
        timeframe: "",
      });
    }

    if (!englishGood) {
      tasks.push({
        id: "english_upgrade",
        urgency: "high",
        category: "Tiếng Anh",
        icon: BookOpen,
        title: `📚 Cần cải thiện ${profile.english_test_type || "IELTS"} lên 7.0+ để tăng điểm EOI`,
        detail: "Proficient English (IELTS 7.0+) = +10 điểm EOI. Superior (IELTS 8.0+) = +20 điểm. Đây là mức tăng điểm hiệu quả nhất.",
        action: { label: "Hỏi chiến lược IELTS", page: "Chat" },
        timeframe: "Trước khi nộp EOI",
      });
    }

    tasks.push({
      id: "eoi_submit",
      urgency: profile.skills_assessment_done && englishGood ? "high" : "medium",
      category: "EOI SkillSelect",
      icon: Target,
      title: profile.skills_assessment_done ? "🎯 Nộp EOI SkillSelect ngay" : "📋 Chuẩn bị nộp EOI SkillSelect",
      detail: "EOI cần điểm tối thiểu 65 và Skills Assessment positive. Càng nhiều điểm, càng nhanh được ITA (invitation to apply).",
      action: { label: "Tính điểm EOI", page: "EOIGenerator" },
      timeframe: "Sau khi đủ điều kiện",
    });

    if (auYears < 3) {
      tasks.push({
        id: "au_work_exp",
        urgency: "medium",
        category: "Điểm EOI",
        icon: Briefcase,
        title: `⏱ Tích lũy kinh nghiệm làm việc tại Úc (+5–20 điểm EOI)`,
        detail: `Hiện tại: ${auYears} năm. 1–2 năm = +5đ, 3–4 năm = +10đ, 5–7 năm = +15đ, 8+ năm = +20đ. Làm việc toàn thời gian (skilled work) để tích lũy.`,
        action: { label: "Xem thang điểm", page: "Profile" },
        timeframe: "Liên tục",
      });
    }

    if (visaDays !== null && visaDays <= 180) {
      tasks.push({
        id: "visa_renew_plan",
        urgency: visaDays <= 60 ? "high" : "medium",
        category: "Visa",
        icon: Calendar,
        title: `⚠️ Visa 485 còn ${visaDays} ngày – Lên kế hoạch visa tiếp theo`,
        detail: "Nếu chưa đủ điểm EOI để nộp PR, có thể xem xét: Visa 482 (nhờ employer), Visa 858 (nếu có thành tích xuất sắc), hoặc 491 vùng.",
        action: { label: "Tư vấn AI về visa kế tiếp", page: "Chat" },
        timeframe: "Khẩn cấp",
      });
    }
  }

  // ── Visa 858 preparation (any visa)
  tasks.push({
    id: "visa858_check",
    urgency: "info",
    category: "Visa 858 – National Innovation",
    icon: Sparkles,
    title: "💡 Kiểm tra điều kiện Visa 858 (National Innovation Visa)",
    detail: "Nếu bạn có thành tích xuất sắc trong nghiên cứu, khoa học, thể thao, nghệ thuật, hoặc kinh doanh – Visa 858 không cần qua EOI và không giới hạn tuổi. Cần xây dựng hồ sơ thành tích từ bây giờ.",
    action: { label: "Xem Visa 858", page: "Visa858" },
    timeframe: "Chuẩn bị hồ sơ từ sớm",
  });

  // ── Passport
  if (passportDays !== null && passportDays <= 365) {
    tasks.push({
      id: "passport_renew",
      urgency: passportDays <= 90 ? "high" : "medium",
      category: "Tài liệu",
      icon: FileText,
      title: `🛂 Hộ chiếu hết hạn trong ${passportDays} ngày – Gia hạn sớm`,
      detail: "Visa yêu cầu hộ chiếu còn hiệu lực ít nhất 6 tháng tại thời điểm nộp. Gia hạn hộ chiếu qua Lãnh sự quán Việt Nam tại Úc (mất 1–3 tháng).",
      action: { label: "Hỏi AI về thủ tục", page: "Chat" },
      timeframe: passportDays <= 90 ? "Khẩn cấp" : "Trong 3 tháng",
    });
  }

  // ── Age warning for EOI
  if (age !== null && age >= 32 && age <= 39 && visa !== "189" && visa !== "190") {
    tasks.push({
      id: "age_eoi",
      urgency: "high",
      category: "Điểm EOI",
      icon: Clock,
      title: `⏰ Tuổi ${age} – Điểm EOI sẽ giảm sau 33/40/45 tuổi`,
      detail: "Tuổi 25–32 = 30 điểm, 33–39 = 25 điểm, 40–44 = 15 điểm, 45+ = 0 điểm. Nếu có thể, hãy nộp EOI và nhận ITA trước sinh nhật tiếp theo.",
      action: { label: "Tính điểm EOI ngay", page: "EOIGenerator" },
      timeframe: "Ưu tiên cao theo tuổi",
    });
  }

  return tasks;
}

// ──────────────────────────────────────────────────────────────
// Urgency config
// ──────────────────────────────────────────────────────────────
const urgencyConfig = {
  high:   { bg: "bg-rose-50",    border: "border-rose-200",    dot: "bg-rose-500",    badge: "bg-rose-100 text-rose-700",    label: "🚨 Làm ngay" },
  medium: { bg: "bg-amber-50",   border: "border-amber-200",   dot: "bg-amber-400",   badge: "bg-amber-100 text-amber-700",   label: "⏳ Chuẩn bị" },
  info:   { bg: "bg-blue-50",    border: "border-blue-200",    dot: "bg-blue-400",    badge: "bg-blue-100 text-blue-700",    label: "💡 Tìm hiểu" },
  done:   { bg: "bg-emerald-50", border: "border-emerald-200", dot: "bg-emerald-500", badge: "bg-emerald-100 text-emerald-700", label: "✅ Hoàn thành" },
};

// ──────────────────────────────────────────────────────────────
// AI Deep Advice
// ──────────────────────────────────────────────────────────────
function AIDeepAdvice({ profile }) {
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState(null);
  const [open, setOpen] = useState(false);

  const generate = async () => {
    setLoading(true);
    setOpen(true);
    const result = await invokeLLMSmart(prompt, {
      prompt: `Bạn là chuyên gia tư vấn di trú Úc. Dựa trên hồ sơ người dùng bên dưới, hãy phân tích và đưa ra lộ trình tùy biến chi tiết nhất có thể, bao gồm:
1. Đánh giá tình trạng hiện tại (điểm mạnh/yếu)
2. Lộ trình được đề xuất cụ thể (gồm visa nào, thứ tự nào, mốc thời gian)
3. Top 3 hành động NGAY LẬP TỨC quan trọng nhất
4. Cơ hội đặc biệt (Visa 858, tiểu bang đang mở, ngành hot, v.v.)
5. Rủi ro cần tránh

Hồ sơ:
- Visa: ${profile.current_visa_type}, hết hạn: ${profile.current_visa_expiry || "chưa rõ"}
- Tuổi: ${profile.date_of_birth ? Math.floor((new Date()-new Date(profile.date_of_birth))/(365.25*24*60*60*1000)) : "chưa rõ"}
- Trường: ${profile.university || "chưa rõ"}, ngành: ${profile.course || "chưa rõ"}, tốt nghiệp: ${profile.graduation_year || "chưa rõ"}
- Tiếng Anh: ${profile.english_test_type || ""} ${profile.english_score || "chưa có"}
- Skills Assessment: ${profile.skills_assessment_done ? "Đã hoàn thành" : "Chưa làm"}
- ANZSCO: ${profile.occupation_code || "chưa rõ"}
- Kinh nghiệm Úc: ${profile.australia_work_years || 0} năm
- Học regional: ${profile.regional_study === "yes" ? "Có" : "Không"}
- Điểm EOI ước tính: ${profile.points_score || "chưa tính"}

Trả lời bằng tiếng Việt, cụ thể, thực tế. Đừng nói chung chung.`,
      response_json_schema: {
        type: "object",
        properties: {
          current_assessment: { type: "string" },
          recommended_pathway: { type: "string" },
          immediate_actions: { type: "array", items: { type: "string" } },
          special_opportunities: { type: "string" },
          risks_to_avoid: { type: "string" },
          estimated_timeline: { type: "string" },
        }
      }
    });
    setAdvice(result);
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-[#0f2347] to-[#1a3a6e] rounded-2xl overflow-hidden text-white">
      <button
        onClick={() => { if (!advice && !loading) generate(); else setOpen(!open); }}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-yellow-300" />
          </div>
          <div className="text-left">
            <div className="font-bold text-sm">🤖 Phân tích AI sâu – Lộ trình cá nhân hoá</div>
            <div className="text-xs text-blue-300">Nhận tư vấn chi tiết nhất dựa trên hồ sơ của bạn</div>
          </div>
        </div>
        {loading ? <Loader2 className="w-4 h-4 animate-spin text-blue-300" />
          : open ? <ChevronUp className="w-4 h-4 text-blue-300" />
          : <ChevronDown className="w-4 h-4 text-blue-300" />}
      </button>

      {(loading || (advice && open)) && (
        <div className="px-5 pb-5 border-t border-white/10">
          {loading && (
            <div className="flex items-center gap-3 py-6 text-blue-200">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">AI đang phân tích hồ sơ và chuẩn bị lộ trình cho bạn...</span>
            </div>
          )}
          {advice && !loading && (
            <div className="mt-4 space-y-4">
              {advice.current_assessment && (
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="text-xs font-bold text-blue-300 mb-1">📊 ĐÁNH GIÁ HIỆN TẠI</div>
                  <p className="text-sm text-white/90 leading-relaxed">{advice.current_assessment}</p>
                </div>
              )}
              {advice.recommended_pathway && (
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="text-xs font-bold text-emerald-300 mb-1">🗺️ LỘ TRÌNH ĐỀ XUẤT</div>
                  <p className="text-sm text-white/90 leading-relaxed">{advice.recommended_pathway}</p>
                </div>
              )}
              {advice.immediate_actions?.length > 0 && (
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="text-xs font-bold text-yellow-300 mb-2">⚡ HÀNH ĐỘNG NGAY LẬP TỨC</div>
                  <ul className="space-y-2">
                    {advice.immediate_actions.map((a, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-white/90">
                        <span className="text-yellow-300 font-bold flex-shrink-0">{i + 1}.</span>
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {advice.special_opportunities && (
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="text-xs font-bold text-violet-300 mb-1">✨ CƠ HỘI ĐẶC BIỆT</div>
                  <p className="text-sm text-white/90 leading-relaxed">{advice.special_opportunities}</p>
                </div>
              )}
              {advice.risks_to_avoid && (
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="text-xs font-bold text-rose-300 mb-1">⚠️ RỦI RO CẦN TRÁNH</div>
                  <p className="text-sm text-white/90 leading-relaxed">{advice.risks_to_avoid}</p>
                </div>
              )}
              {advice.estimated_timeline && (
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="text-xs font-bold text-sky-300 mb-1">📅 ƯỚC TÍNH TIMELINE</div>
                  <p className="text-sm text-white/90 leading-relaxed">{advice.estimated_timeline}</p>
                </div>
              )}
              <button onClick={generate} className="flex items-center gap-1.5 text-xs text-blue-300 hover:text-white transition-colors">
                <RefreshCw className="w-3 h-3" /> Phân tích lại
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Task Card
// ──────────────────────────────────────────────────────────────
function TaskCard({ task }) {
  const uc = urgencyConfig[task.urgency];
  const Icon = task.icon;
  const [open, setOpen] = useState(false);

  return (
    <div className={`rounded-2xl border ${uc.bg} ${uc.border} overflow-hidden`}>
      <button
        className="w-full px-4 py-3.5 flex items-start gap-3 text-left hover:bg-black/5 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${task.urgency === "done" ? "bg-emerald-100" : task.urgency === "high" ? "bg-rose-100" : task.urgency === "medium" ? "bg-amber-100" : "bg-blue-100"}`}>
          <Icon className={`w-4 h-4 ${task.urgency === "done" ? "text-emerald-600" : task.urgency === "high" ? "text-rose-600" : task.urgency === "medium" ? "text-amber-600" : "text-blue-600"}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${uc.badge}`}>{uc.label}</span>
            <span className="text-xs text-gray-400">{task.category}</span>
          </div>
          <div className="text-sm font-semibold text-[#0a1628] leading-snug">{task.title}</div>
          {task.timeframe && task.urgency !== "done" && (
            <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-1"><Clock className="w-3 h-3" />{task.timeframe}</div>
          )}
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />}
      </button>
      {open && (
        <div className="px-4 pb-4 pt-1 border-t border-black/5">
          <p className="text-sm text-gray-600 leading-relaxed mb-3">{task.detail}</p>
          {task.action && (
            <Link to={createPageUrl(task.action.page)}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0f2347] hover:text-blue-600 transition-colors">
              {task.action.label} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Progress Dashboard
// ──────────────────────────────────────────────────────────────
function ProgressDashboard({ profile }) {
  if (!profile) return null;

  // Determine milestones completed
  const milestones = [
    { id: "profile", label: "Hoàn thiện hồ sơ", done: !!(profile.current_visa_type && profile.occupation_code) },
    { id: "english", label: "Kết quả tiếng Anh", done: !!(profile.english_score && parseFloat(profile.english_score) >= 6) },
    { id: "skills_assess", label: "Skills Assessment", done: !!profile.skills_assessment_done },
    { id: "eoi", label: "Nộp EOI SkillSelect", done: !!profile.eoi_submitted },
    { id: "invitation", label: "Nhận Invitation to Apply", done: !!profile.invitation_received },
    { id: "lodge", label: "Nộp hồ sơ visa", done: !!profile.visa_lodged },
    { id: "health", label: "Khám sức khỏe", done: !!profile.health_exam_done },
    { id: "grant", label: "Visa được cấp 🎉", done: !!profile.visa_granted },
  ];

  const completedCount = milestones.filter(m => m.done).length;
  const progressPct = Math.round((completedCount / milestones.length) * 100);
  const nextMilestone = milestones.find(m => !m.done);

  // EOI score from localStorage
  let eoiScore = null;
  try {
    const stored = localStorage.getItem("eoi_calc_result");
    if (stored) eoiScore = JSON.parse(stored)?.totalPoints;
  } catch(e) {}

  return (
    <div className="bg-gradient-to-br from-[#0f2347] to-[#1a3a6b] rounded-2xl p-6 text-white mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold">Lộ trình của bạn</h2>
          <p className="text-white/60 text-sm">{completedCount}/{milestones.length} bước hoàn thành</p>
        </div>
        {eoiScore && (
          <div className="text-center bg-white/10 rounded-xl px-4 py-3">
            <p className="text-2xl font-black">{eoiScore}</p>
            <p className="text-xs text-white/60">điểm EOI</p>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-full h-2.5 bg-white/20 rounded-full mb-5 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-400 to-emerald-400 rounded-full transition-all duration-700" style={{ width: `${progressPct}%` }} />
      </div>

      {/* Milestones */}
      <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mb-5">
        {milestones.map((m, i) => (
          <div key={m.id} className="flex flex-col items-center gap-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${m.done ? "bg-emerald-500 text-white" : i === completedCount ? "bg-blue-400 text-white animate-pulse ring-2 ring-blue-300/50" : "bg-white/10 text-white/30"}`}>
              {m.done ? "✓" : i + 1}
            </div>
            <p className="text-[9px] text-white/50 text-center leading-tight hidden md:block">{m.label.split(" ")[0]}</p>
          </div>
        ))}
      </div>

      {/* Next action */}
      {nextMilestone && (
        <div className="bg-white/10 border border-white/20 rounded-xl p-3 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-400 rounded-lg flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-white/50 font-semibold uppercase tracking-wide">Bước tiếp theo</p>
            <p className="text-sm font-semibold">{nextMilestone.label}</p>
          </div>
          <Link to={createPageUrl("Chat")} className="text-xs bg-blue-500 hover:bg-blue-400 text-white px-3 py-1.5 rounded-lg font-semibold transition-colors flex-shrink-0">
            Hỏi AI →
          </Link>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Score bar
// ──────────────────────────────────────────────────────────────
function EOIScoreBadge({ profile }) {
  const score = parseFloat(profile.points_score) || 0;
  const pct = Math.min((score / 90) * 100, 100);
  const color = score >= 80 ? "emerald" : score >= 65 ? "blue" : "amber";
  return (
    <div className={`rounded-2xl border p-4 ${color === "emerald" ? "bg-emerald-50 border-emerald-200" : color === "blue" ? "bg-blue-50 border-blue-200" : "bg-amber-50 border-amber-200"}`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs font-bold ${color === "emerald" ? "text-emerald-700" : color === "blue" ? "text-blue-700" : "text-amber-700"}`}>Điểm EOI ước tính</span>
        <span className={`text-2xl font-black ${color === "emerald" ? "text-emerald-600" : color === "blue" ? "text-blue-600" : "text-amber-600"}`}>{score > 0 ? score : "?"}</span>
      </div>
      {score > 0 && (
        <div className="h-2 bg-white/60 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all ${color === "emerald" ? "bg-emerald-500" : color === "blue" ? "bg-blue-500" : "bg-amber-400"}`} style={{ width: `${pct}%` }} />
        </div>
      )}
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>Min 65 điểm</span>
        <span>{score >= 65 ? "✅ Đủ nộp EOI" : "⚠️ Cần thêm điểm"}</span>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Main Page
// ──────────────────────────────────────────────────────────────
export default function MyPlan() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    entities.UserProfile.list("-created_date", 1)
      .then(list => setProfile(list[0] || null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
    </div>
  );

  if (!profile) return (
    <div className="min-h-screen bg-[#f8f9fc]">
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <User className="w-10 h-10 text-blue-500" />
        </div>
        <h1 className="text-2xl font-bold text-[#0a1628] mb-3">Điền hồ sơ để xem kế hoạch cá nhân</h1>
        <p className="text-gray-500 mb-6">MyPlan phân tích hồ sơ của bạn và tạo ra danh sách việc cần làm, lộ trình và cảnh báo tùy biến theo tình trạng thực tế.</p>
        <Link to={createPageUrl("Profile")} className="inline-flex items-center gap-2 bg-[#0f2347] text-white px-8 py-3.5 rounded-2xl font-semibold hover:bg-[#1a3a6e] transition-colors">
          <User className="w-4 h-4" /> Điền hồ sơ ngay
        </Link>
      </div>
    </div>
  );

  const allTasks = buildTaskList(profile);
  const filters = [
    { key: "all", label: "Tất cả", count: allTasks.length },
    { key: "high", label: "🚨 Làm ngay", count: allTasks.filter(t => t.urgency === "high").length },
    { key: "medium", label: "⏳ Chuẩn bị", count: allTasks.filter(t => t.urgency === "medium").length },
    { key: "done", label: "✅ Hoàn thành", count: allTasks.filter(t => t.urgency === "done").length },
  ];
  const tasks = filter === "all" ? allTasks : allTasks.filter(t => t.urgency === filter);

  const urgentCount = allTasks.filter(t => t.urgency === "high").length;
  const doneCount = allTasks.filter(t => t.urgency === "done").length;
  const progress = Math.round((doneCount / allTasks.length) * 100);

  return (
    <PremiumGate featureName="Kế hoạch cá nhân">
      <div className="min-h-screen bg-[#f8f9fc]">
      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#0a1628] mb-1">Kế hoạch cá nhân 🎯</h1>
          <p className="text-gray-500">
            Xin chào <span className="font-semibold text-[#0f2347]">{profile.full_name || "bạn"}</span>!
            Đây là lộ trình được tùy biến theo hồ sơ của bạn (Visa {profile.current_visa_type}).
          </p>
        </div>

        {/* Progress Dashboard */}
        <ProgressDashboard profile={profile} />

        {/* Progress + EOI score */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-[#0a1628]">Tiến độ chuẩn bị</span>
              <span className="text-lg font-black text-blue-600">{progress}%</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>{doneCount}/{allTasks.length} mục hoàn thành</span>
              {urgentCount > 0 && <span className="text-rose-500 font-semibold">{urgentCount} việc cần làm ngay</span>}
            </div>
          </div>
          <EOIScoreBadge profile={profile} />
        </div>

        {/* Urgent banner */}
        {urgentCount > 0 && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-rose-700 text-sm">Bạn có {urgentCount} việc cần xử lý ngay</div>
              <div className="text-xs text-rose-500">Những mục này có thể ảnh hưởng đến lộ trình PR nếu bị bỏ qua</div>
            </div>
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`flex-shrink-0 text-sm px-4 py-2 rounded-full font-medium transition-colors ${filter === f.key ? "bg-[#0f2347] text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
            >
              {f.label} {f.count > 0 && <span className="ml-1 opacity-70">({f.count})</span>}
            </button>
          ))}
        </div>

        {/* Task list */}
        <div className="space-y-3 mb-8">
          {tasks.map(task => <TaskCard key={task.id} task={task} />)}
        </div>

        {/* AI Deep Advice */}
        <AIDeepAdvice profile={profile} />

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <Link to={createPageUrl("Profile")} className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-sm transition-all flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="text-sm font-semibold text-[#0a1628]">Cập nhật hồ sơ</div>
              <div className="text-xs text-gray-400">Plan tự động cập nhật</div>
            </div>
          </Link>
          <Link to={createPageUrl("Chat")} className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-4 hover:opacity-90 transition-all flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Hỏi AI ngay</div>
              <div className="text-xs text-blue-200">Tư vấn chi tiết hơn</div>
            </div>
          </Link>
        </div>
      </div>
      </div>
    </PremiumGate>
  );
}