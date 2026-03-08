import { useState } from "react";
import {
  Target, CheckCircle2, Circle, Clock, AlertTriangle,
  BrainCircuit, ChevronDown, ChevronUp, Zap, Bell,
  Star, Calendar, Award, TrendingUp, FileText, MessageCircle,
  Play, Lock, CheckCheck, BarChart2, Flame, RefreshCw
} from "lucide-react";

// ─── Mock Tasks ──────────────────────────────────────────────────────────────
const INITIAL_TASKS = [
  {
    id: 1,
    category: "english",
    title: "Đạt IELTS ≥ 7.0 mỗi band",
    detail:
      "Điểm IELTS 7.0+ trong từng kỹ năng cho thêm 10 điểm EOI. Đạt 8+ cho thêm 20 điểm – đây là cách tăng điểm EOI nhanh nhất.",
    urgency: "high",
    deadline: "3 tháng",
    points: 10,
    done: false,
    stage: "student",
  },
  {
    id: 2,
    category: "skills",
    title: "Nộp Skills Assessment (ACS / EA / TRA)",
    detail:
      "Skills Assessment là bắt buộc để nộp EOI. Cần nộp sớm vì thời gian xử lý 6–12 tuần. Xác định đúng tổ chức theo ANZSCO code của bạn.",
    urgency: "high",
    deadline: "6 tháng",
    points: 0,
    done: false,
    stage: "graduate",
  },
  {
    id: 3,
    category: "experience",
    title: "Tích lũy 3 năm kinh nghiệm Úc",
    detail:
      "Kinh nghiệm làm việc tại Úc ≥ 3 năm cho thêm 5 điểm EOI. ≥ 5 năm cho 10 điểm. ≥ 8 năm cho 20 điểm.",
    urgency: "medium",
    deadline: "3 năm",
    points: 5,
    done: false,
    stage: "graduate",
  },
  {
    id: 4,
    category: "eoi",
    title: "Tạo hồ sơ EOI trên SkillSelect",
    detail:
      "Sau khi có Skills Assessment dương tính, tạo ngay hồ sơ EOI trên SkillSelect.gov.au. Cập nhật thông tin chính xác để tối đa điểm.",
    urgency: "high",
    deadline: "Sau skills assessment",
    points: 0,
    done: false,
    stage: "eoi",
  },
  {
    id: 5,
    category: "education",
    title: "Nâng trình độ học vấn (PhD / Master)",
    detail:
      "Bằng tiến sĩ cho thêm 20 điểm EOI. Thạc sĩ cho 15 điểm. Xem xét học thêm nếu điểm hiện tại chưa đủ cao.",
    urgency: "low",
    deadline: "Tuỳ quyết định",
    points: 15,
    done: false,
    stage: "student",
  },
  {
    id: 6,
    category: "state",
    title: "Nghiên cứu State Nomination phù hợp",
    detail:
      "Đề cử bang (190) cho thêm 5 điểm, đề cử regional (491) cho thêm 15 điểm. Kiểm tra occupation list và quota của từng bang.",
    urgency: "medium",
    deadline: "Khi EOI đang mở",
    points: 5,
    done: false,
    stage: "state",
  },
  {
    id: 7,
    category: "health",
    title: "Đặt lịch khám sức khoẻ di trú (eMedical)",
    detail:
      "Khám sức khoẻ cần thiết khi nộp hồ sơ PR. Kết quả có giá trị 12 tháng. Đặt lịch qua ImmiAccount sau khi nhận ITA.",
    urgency: "high",
    deadline: "Trong 60 ngày sau ITA",
    points: 0,
    done: false,
    stage: "pr",
  },
  {
    id: 8,
    category: "police",
    title: "Xin Police Clearance từ VN và Úc",
    detail:
      "Cần lý lịch tư pháp từ mọi quốc gia đã sống > 12 tháng. Từ Việt Nam mất 1–2 tuần. Từ Úc qua AFP mất 2–4 tuần.",
    urgency: "high",
    deadline: "Trong 60 ngày sau ITA",
    points: 0,
    done: false,
    stage: "pr",
  },
];

const FILTERS = [
  { id: "all", label: "Tất cả", icon: Target },
  { id: "high", label: "Ưu tiên cao", icon: Flame },
  { id: "medium", label: "Trung bình", icon: Clock },
  { id: "low", label: "Thấp", icon: Circle },
];

const CATEGORY_COLORS = {
  english: "text-blue-600 bg-blue-50",
  skills: "text-purple-600 bg-purple-50",
  experience: "text-emerald-600 bg-emerald-50",
  eoi: "text-amber-600 bg-amber-50",
  education: "text-indigo-600 bg-indigo-50",
  state: "text-rose-600 bg-rose-50",
  health: "text-teal-600 bg-teal-50",
  police: "text-gray-600 bg-gray-100",
};

const URGENCY_CONFIG = {
  high: { label: "Ưu tiên cao", color: "text-rose-600 bg-rose-50 border-rose-200", dot: "bg-rose-500" },
  medium: { label: "Trung bình", color: "text-amber-600 bg-amber-50 border-amber-200", dot: "bg-amber-500" },
  low: { label: "Ưu tiên thấp", color: "text-gray-600 bg-gray-50 border-gray-200", dot: "bg-gray-400" },
};

// ─── Sub-components ──────────────────────────────────────────────────────────
function EoiScoreBadge({ score }) {
  const color =
    score >= 90 ? "from-emerald-400 to-emerald-600" :
    score >= 75 ? "from-blue-400 to-blue-600" :
    score >= 65 ? "from-amber-400 to-orange-500" :
    "from-rose-400 to-rose-600";

  return (
    <div className={`bg-gradient-to-br ${color} rounded-2xl p-5 text-white text-center`}>
      <p className="text-xs font-semibold text-white/80 mb-1">Điểm EOI ước tính</p>
      <p className="text-5xl font-extrabold mb-1">{score}</p>
      <p className="text-xs text-white/70">
        {score >= 90 ? "Xuất sắc – Chờ ITA sớm" :
         score >= 75 ? "Tốt – Theo dõi SkillSelect" :
         score >= 65 ? "Đủ điều kiện – Cần cải thiện" :
         "Chưa đủ – Cần nâng điểm"}
      </p>
    </div>
  );
}

function TaskCard({ task, onToggle, onExpand, isExpanded }) {
  const urgency = URGENCY_CONFIG[task.urgency];
  const catColor = CATEGORY_COLORS[task.category] || "text-gray-600 bg-gray-50";

  return (
    <div
      className={`rounded-2xl border-2 transition-all duration-200 overflow-hidden ${
        task.done
          ? "border-gray-200 opacity-60"
          : `border-${task.urgency === "high" ? "rose" : task.urgency === "medium" ? "amber" : "gray"}-200`
      } bg-white`}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <button
            onClick={() => onToggle(task.id)}
            className="flex-shrink-0 mt-0.5"
          >
            {task.done ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            ) : (
              <Circle className={`w-5 h-5 ${
                task.urgency === "high" ? "text-rose-400" :
                task.urgency === "medium" ? "text-amber-400" :
                "text-gray-300"
              }`} />
            )}
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3
                className={`font-semibold text-sm ${task.done ? "line-through text-gray-400" : "text-gray-900"}`}
              >
                {task.title}
              </h3>
              {task.points > 0 && (
                <span className="flex-shrink-0 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                  +{task.points} điểm
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${urgency.color}`}>
                <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${urgency.dot}`} />
                {urgency.label}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3.5 h-3.5" />
                {task.deadline}
              </span>
            </div>
          </div>
          <button
            onClick={() => onExpand(task.id)}
            className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-lg"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>
        </div>
      </div>
      {isExpanded && (
        <div className="border-t border-gray-100 px-4 pb-4 pt-3">
          <p className="text-sm text-gray-700 leading-relaxed">{task.detail}</p>
        </div>
      )}
    </div>
  );
}

function DeadlineReminders() {
  const reminders = [
    { icon: Bell, text: "Visa 485 hết hạn trong 8 tháng – cần nộp EOI sớm", color: "text-rose-500 bg-rose-50", urgent: true },
    { icon: Calendar, text: "Skills Assessment: nộp trong tháng tới", color: "text-amber-500 bg-amber-50", urgent: true },
    { icon: TrendingUp, text: "Điểm cutoff EOI 189 tháng này: 85 điểm", color: "text-blue-500 bg-blue-50", urgent: false },
  ];
  return (
    <div className="space-y-2">
      <h3 className="flex items-center gap-2 font-semibold text-gray-800 text-sm">
        <Bell className="w-4 h-4 text-amber-500" />
        Nhắc nhở deadline
      </h3>
      {reminders.map((r, i) => (
        <div
          key={i}
          className={`flex items-start gap-3 p-3 rounded-xl border ${r.urgent ? "border-orange-200 bg-orange-50" : "border-gray-200 bg-gray-50"}`}
        >
          <r.icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${r.urgent ? "text-orange-500" : "text-gray-500"}`} />
          <p className="text-sm text-gray-800">{r.text}</p>
        </div>
      ))}
    </div>
  );
}

function AIAdviceSection({ loading, onGenerate }) {
  const [advice] = useState(`
**Đánh giá hồ sơ của bạn:**

Dựa trên hồ sơ hiện tại, điểm EOI ước tính của bạn là **72 điểm**. Đây là mức tốt nhưng chưa đủ cạnh tranh cho visa 189 (cutoff thường 85+). Dưới đây là các bước ưu tiên để tối ưu lộ trình:

**1. Nâng IELTS lên 8.0+ (ưu tiên #1)**
Đây là cách nhanh nhất và rẻ nhất để tăng 10 điểm EOI. Tập trung vào Writing và Speaking – hai band thường thấp nhất.

**2. Hoàn thành Skills Assessment trong 3 tháng**
Nộp hồ sơ ACS ngay sau khi tốt nghiệp. Chuẩn bị reference letters từ 2 employer với chi tiết tasks và responsibilities.

**3. Xem xét State Nomination (190 hoặc 491)**
Với điểm 72, bạn có thể được đề cử bởi SA hoặc TAS. Điều này tăng ngay 5–15 điểm và giảm áp lực cạnh tranh ở cấp liên bang.

**4. Tích lũy kinh nghiệm Úc**
Làm đúng ngành ANZSCO để mỗi năm kinh nghiệm được tính điểm. Sau 3 năm bạn nhận thêm 5 điểm.
  `);

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-100 rounded-xl">
            <BrainCircuit className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">AI Deep Advice</h3>
            <p className="text-xs text-gray-500">Phân tích cá nhân hoá từ AI</p>
          </div>
        </div>
        <button
          onClick={onGenerate}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs bg-indigo-500 text-white px-3 py-1.5 rounded-xl hover:bg-indigo-600 disabled:opacity-50 transition-colors font-medium"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Đang phân tích..." : "Cập nhật"}
        </button>
      </div>
      <div className="prose prose-sm max-w-none">
        {advice.split("\n").map((line, i) => {
          if (line.startsWith("**") && line.endsWith("**")) {
            return <p key={i} className="font-bold text-gray-900 mt-3 mb-1">{line.replace(/\*\*/g, "")}</p>;
          }
          if (line.match(/^\*\*(.*)\*\*(.*)/) ) {
            return <p key={i} className="text-gray-700 text-sm mb-1">{line.replace(/\*\*(.*?)\*\*/g, "$1")}</p>;
          }
          if (line.trim() === "") return <br key={i} />;
          return <p key={i} className="text-gray-700 text-sm mb-1">{line}</p>;
        })}
      </div>
    </div>
  );
}

function RoadmapTimeline({ completedStages }) {
  const stages = [
    { id: "student", label: "Sinh viên", icon: "🎓" },
    { id: "graduate", label: "Tốt nghiệp", icon: "💼" },
    { id: "skills", label: "Skills SA", icon: "📋" },
    { id: "eoi", label: "EOI", icon: "📊" },
    { id: "state", label: "Bang đề cử", icon: "📍" },
    { id: "pr", label: "PR", icon: "🏆" },
  ];
  const currentIdx = 1; // graduate stage

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5">
      <h3 className="flex items-center gap-2 font-semibold text-gray-800 text-sm mb-4">
        <BarChart2 className="w-4 h-4 text-emerald-500" />
        Vị trí trong lộ trình
      </h3>
      <div className="flex items-center justify-between gap-1">
        {stages.map((s, i) => (
          <div key={s.id} className="flex-1 flex flex-col items-center">
            <div className="flex items-center w-full">
              {i > 0 && (
                <div
                  className={`flex-1 h-0.5 ${
                    i <= currentIdx ? "bg-emerald-400" : "bg-gray-200"
                  }`}
                />
              )}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
                  i < currentIdx
                    ? "bg-emerald-500 text-white"
                    : i === currentIdx
                    ? "bg-blue-500 text-white ring-4 ring-blue-100"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {i < currentIdx ? "✓" : s.icon}
              </div>
              {i < stages.length - 1 && (
                <div
                  className={`flex-1 h-0.5 ${
                    i < currentIdx ? "bg-emerald-400" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
            <p className="text-xs text-gray-600 mt-1.5 text-center leading-tight">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function MyPlan() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const toggleExpand = (id) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  const generateAdvice = () => {
    setAiLoading(true);
    setTimeout(() => setAiLoading(false), 2000);
  };

  const filtered =
    filter === "all"
      ? tasks
      : tasks.filter((t) => t.urgency === filter && !t.done);

  const doneTasks = tasks.filter((t) => t.done).length;
  const totalTasks = tasks.length;
  const pct = Math.round((doneTasks / totalTasks) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
                <BrainCircuit className="w-3.5 h-3.5" /> AI Personal Plan
              </span>
              <h1 className="text-2xl font-extrabold text-gray-900">Kế Hoạch Của Tôi</h1>
              <p className="text-gray-500 text-sm mt-1">
                Cá nhân hoá theo hồ sơ – việc cần làm – deadline – điểm EOI
              </p>
            </div>
            <EoiScoreBadge score={72} />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Progress */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-500" />
              <span className="font-semibold text-gray-900">Tiến độ hoàn thành</span>
            </div>
            <span className="text-lg font-bold text-emerald-600">{pct}%</span>
          </div>
          <div className="bg-gray-100 rounded-full h-3 mb-2">
            <div
              className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-xs text-gray-500">
            {doneTasks} / {totalTasks} nhiệm vụ hoàn thành
          </p>
        </div>

        {/* Roadmap timeline */}
        <RoadmapTimeline completedStages={["student"]} />

        {/* Deadline reminders */}
        <DeadlineReminders />

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {FILTERS.map((f) => {
            const Icon = f.icon;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  filter === f.id
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Task cards */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <CheckCheck className="w-10 h-10 mx-auto mb-2 text-emerald-400" />
              <p className="font-medium text-gray-600">Tất cả nhiệm vụ đã hoàn thành!</p>
            </div>
          ) : (
            filtered.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onExpand={toggleExpand}
                isExpanded={expanded === task.id}
              />
            ))
          )}
        </div>

        {/* AI Deep Advice */}
        <AIAdviceSection loading={aiLoading} onGenerate={generateAdvice} />

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: MessageCircle, label: "Hỏi AI tư vấn", href: "/chat", color: "bg-blue-500 hover:bg-blue-600" },
            { icon: FileText, label: "Điền biểu mẫu", href: "/forms", color: "bg-purple-500 hover:bg-purple-600" },
            { icon: BarChart2, label: "Tính điểm EOI", href: "/profile", color: "bg-amber-500 hover:bg-amber-600" },
            { icon: Award, label: "Xem lộ trình", href: "/roadmap", color: "bg-emerald-500 hover:bg-emerald-600" },
          ].map(({ icon: Icon, label, href, color }) => (
            <a
              key={label}
              href={href}
              className={`flex items-center gap-3 p-4 rounded-2xl ${color} text-white font-semibold text-sm transition-colors`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}