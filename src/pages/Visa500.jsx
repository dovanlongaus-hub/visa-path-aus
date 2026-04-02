import { useState } from "react";
import { CheckCircle, ChevronDown, ChevronUp, AlertCircle, ArrowRight, Star, Clock, DollarSign, ExternalLink, BookOpen, Heart, Shield, GraduationCap, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

// ─── DATA ────────────────────────────────────────────────────────────────────

const visaStreams = [
  {
    id: "higher-ed",
    name: "Higher Education Sector",
    badge: "Phổ biến nhất",
    color: "blue",
    summary: "Dành cho sinh viên theo học chương trình Cử nhân, Thạc sĩ, Tiến sĩ tại các trường đại học Úc. Đây là diện visa phổ biến nhất cho sinh viên Việt Nam.",
    requirements: [
      "Đã nhận CoE (Confirmation of Enrolment) từ trường đại học Úc",
      "Chứng minh tài chính: AUD 29,710/năm (sinh hoạt phí) + học phí + vé máy bay",
      "Genuine Student (GS) requirement – thư trình bày mục đích học tập",
      "Tiếng Anh: IELTS 6.0 trở lên (hoặc theo yêu cầu của trường)",
      "Đáp ứng yêu cầu sức khỏe và lý lịch tư pháp",
      "Mua bảo hiểm OSHC (Overseas Student Health Cover) trong suốt thời gian học",
    ],
    duration: "Theo thời gian khóa học + 2 tháng (Cử nhân/Thạc sĩ) hoặc + 3 tháng (Nghiên cứu)",
    workRights: "48 giờ/2 tuần trong kỳ học, không giới hạn trong kỳ nghỉ",
    fee: "AUD 1,600 (từ 1/7/2024)",
  },
  {
    id: "vet",
    name: "Vocational Education & Training (VET)",
    badge: "Cao đẳng nghề",
    color: "emerald",
    summary: "Dành cho học viên theo học các khóa nghề (Certificate I-IV, Diploma, Advanced Diploma) tại các trường TAFE hoặc college tư thục.",
    requirements: [
      "Đã nhận CoE từ trường VET được registro CRICOS",
      "Chứng minh tài chính: AUD 29,710/năm + học phí + vé máy bay",
      "Genuine Student (GS) requirement",
      "Tiếng Anh: IELTS 5.5 trở lên (hoặc theo yêu cầu của trường)",
      "Đáp ứng yêu cầu sức khỏe và lý lịch tư pháp",
      "Mua bảo hiểm OSHC trong suốt thời gian học",
    ],
    duration: "Theo thời gian khóa học + 2 tháng",
    workRights: "48 giờ/2 tuần trong kỳ học, không giới hạn trong kỳ nghỉ",
    fee: "AUD 1,600",
  },
  {
    id: "schools",
    name: "School Sector (Primary & Secondary)",
    badge: "Phổ thông",
    color: "amber",
    summary: "Dành cho học viên từ 6 tuổi trở lên theo học chương trình tiểu học và trung học tại Úc.",
    requirements: [
      "Đã nhận CoE từ trường phổ thông Úc",
      "Có người giám hộ tại Úc (nếu dưới 18 tuổi) hoặc visa 590 (Guardian visa)",
      "Chứng minh tài chính: AUD 29,710/năm + học phí + vé máy bay",
      "Genuine Student (GS) requirement cho học viên từ 13 tuổi",
      "Đáp ứng yêu cầu sức khỏe và lý lịch tư pháp",
      "Mua bảo hiểm OSHC trong suốt thời gian học",
    ],
    duration: "Theo thời gian khóa học",
    workRights: "Không được làm việc (trừ khi trên 15 tuổi và trong kỳ nghỉ)",
    fee: "AUD 1,600",
  },
  {
    id: "non-award",
    name: "Non-Award Sector (ELICOS, exchange)",
    badge: "Ngôn ngữ & Trao đổi",
    color: "violet",
    summary: "Dành cho sinh viên theo học khóa tiếng Anh (ELICOS), khóa không cấp bằng, hoặc chương trình trao đổi sinh viên.",
    requirements: [
      "Đã nhận CoE từ trường có khóa ELICOS/Non-Award được CRICOS",
      "Chứng minh tài chính: AUD 29,710/năm + học phí + vé máy bay",
      "Genuine Student (GS) requirement",
      "Tiếng Anh: IELTS 4.5 trở lên hoặc theo yêu cầu khóa học",
      "Đáp ứng yêu cầu sức khỏe và lý lịch tư pháp",
      "Mua bảo hiểm OSHC trong suốt thời gian học",
    ],
    duration: "Theo thời gian khóa học",
    workRights: "48 giờ/2 tuần trong kỳ học, không giới hạn trong kỳ nghỉ",
    fee: "AUD 1,600",
  },
];

const studyFields = [
  {
    field: "Công nghệ thông tin (IT)",
    icon: "💻",
    color: "blue",
    popularCourses: ["Bachelor of IT", "Master of Data Science", "Master of Cyber Security"],
    duration: "3-4 năm (Cử nhân), 1.5-2 năm (Thạc sĩ)",
    providers: "University of Melbourne, RMIT, UTS, UNSW",
    avgTuition: "AUD 35,000–48,000/năm",
    postStudyWork: "Visa 485 – Graduate Work Stream (2-4 năm sau tốt nghiệp)",
    demand: "Rất cao",
    avgSalary: "AUD 80,000–130,000/năm sau tốt nghiệp",
  },
  {
    field: "Kế toán & Tài chính",
    icon: "💼",
    color: "emerald",
    popularCourses: ["Bachelor of Commerce (Accounting)", "Master of Professional Accounting", "Master of Finance"],
    duration: "3 năm (Cử nhân), 1.5-2 năm (Thạc sĩ)",
    providers: "UNSW, Macquarie University, Deakin, UTS",
    avgTuition: "AUD 32,000–44,000/năm",
    postStudyWork: "Visa 485 – Graduate Work Stream (2-3 năm)",
    demand: "Cao",
    avgSalary: "AUD 65,000–100,000/năm sau tốt nghiệp",
  },
  {
    field: "Kỹ thuật (Engineering)",
    icon: "⚙️",
    color: "amber",
    popularCourses: ["Bachelor of Engineering (Civil)", "Bachelor of Engineering (Electrical)", "Master of Engineering"],
    duration: "4 năm (Cử nhân), 2 năm (Thạc sĩ)",
    providers: "University of Sydney, Monash, RMIT, UQ",
    avgTuition: "AUD 38,000–50,000/năm",
    postStudyWork: "Visa 485 – Post-Study Work Stream (3-6 năm)",
    demand: "Rất cao",
    avgSalary: "AUD 85,000–135,000/năm sau tốt nghiệp",
  },
  {
    field: "Y tế & Điều dưỡng",
    icon: "🏥",
    color: "rose",
    popularCourses: ["Bachelor of Nursing", "Master of Nursing Practice", "Master of Public Health"],
    duration: "3 năm (Cử nhân), 2 năm (Thạc sĩ)",
    providers: "ACU, University of Sydney, La Trobe, Curtin",
    avgTuition: "AUD 32,000–45,000/năm",
    postStudyWork: "Visa 485 – Post-Study Work Stream (3-6 năm)",
    demand: "Rất cao",
    avgSalary: "AUD 70,000–100,000/năm sau tốt nghiệp",
  },
  {
    field: "Giáo dục (Education)",
    icon: "📚",
    color: "sky",
    popularCourses: ["Bachelor of Education", "Master of Teaching", "Master of Early Childhood Education"],
    duration: "4 năm (Cử nhân), 1.5-2 năm (Thạc sĩ)",
    providers: "Monash, Deakin, ACU, QUT",
    avgTuition: "AUD 28,000–38,000/năm",
    postStudyWork: "Visa 485 – Post-Study Work Stream (3-6 năm)",
    demand: "Rất cao",
    avgSalary: "AUD 70,000–100,000/năm sau tốt nghiệp",
  },
  {
    field: "Thương mại & Quản trị",
    icon: "🏢",
    color: "violet",
    popularCourses: ["Bachelor of Business", "MBA", "Master of Management"],
    duration: "3 năm (Cử nhân), 1-2 năm (Thạc sĩ)",
    providers: "RMIT, UTS, Deakin, Swinburne",
    avgTuition: "AUD 30,000–45,000/năm",
    postStudyWork: "Visa 485 – Graduate Work Stream (2-3 năm)",
    demand: "Trung bình",
    avgSalary: "AUD 60,000–95,000/năm sau tốt nghiệp",
  },
];

const prPathwaySteps = [
  { step: 1, title: "Học xong tại Úc (Visa 500)", desc: "Hoàn thành khóa học tối thiểu 2 năm CRICOS tại Úc. Có thể chuyển tiếp từ Diploma lên Cử nhân.", time: "2-4 năm" },
  { step: 2, title: "Xin Visa 485 – Graduate", desc: "Sau tốt nghiệp, xin Visa 485 Post-Study Work stream để có quyền làm việc toàn thời gian.", time: "2-6 năm tùy ngành" },
  { step: 3, title: "Skills Assessment + Tiếng Anh", desc: "Hoàn tất đánh giá kỹ năng bởi cơ quan đánh giá (ACS/EA/CPA/AHPRA...). Thi PTE/IELTS đạt yêu cầu.", time: "3-6 tháng" },
  { step: 4, title: "Nộp EOI – 189/190/491", desc: "Tính điểm EOI. Nộp Expression of Interest cho visa 189 (độc lập), 190 (bảo lãnh bang), hoặc 491 (vùng).", time: "Chờ invite" },
  { step: 5, title: "Nhận PR 🎉", desc: "Được mời và nhận visa thường trú. Chúc mừng bạn đã đến Úc!", time: "6-18 tháng" },
];

const gsQuestions = [
  {
    question: "Tại sao bạn muốn học khóa này tại Úc?",
    hint: "Trình bày rõ mục tiêu nghề nghiệp, sự phù hợp của khóa học với kế hoạch tương lai.",
    tips: ["Nên đề cập sự phát triển ngành nghề tại VN hoặc quốc tế", "Giải thích tại sao Úc chứ không phải nước khác", "Liên hệ kinh nghiệm học tập/làm việc trước đó với khóa học"],
  },
  {
    question: "Tại sao bạn chọn trường này?",
    hint: "Giải thích lý do chọn specific university/college (ranking, chương trình giảng dạy, cơ sở vật chất, học phí phù hợp).",
    tips: ["Nghiên cứu kỹ về trường trước khi viết", "Đề cập các môn học cụ thể trong chương trình", "Không chỉ nói 'vì trường nổi tiếng'"],
  },
  {
    question: "Bạn có kế hoạch gì sau khi tốt nghiệp?",
    hint: "Cho thấy bạn có kế hoạch rõ ràng: ở lại Úc làm việc với visa 485, hoặc về VN với kỹ năng mới – cả hai đều OK.",
    tips: ["Không cần phải về VN – nhưng cần kế hoạch hợp lý", "Trước đây bắt buộc phải về VN, nhưng GS mới linh hoạt hơn", "Có thể trình bày cả hai phương án"],
  },
  {
    question: "Khoảng trống (gap) trong học tập/làm việc của bạn?",
    hint: "Giải thích thời gian gap giữa các khóa học hoặc công việc (nếu có).",
    tips: ["Ghi rõ: làm việc gì, ở đâu, thời gian bao lâu", "Nếu không làm việc, giải thích lý do (sức khỏe, gia đình,...)", "Chuẩn bị bằng chứng (hợp đồng lao động, xác nhận công tác)"],
  },
];

const colorMap = {
  blue: { bg: "bg-blue-50", border: "border-blue-200", badge: "bg-blue-100 text-blue-700", icon: "text-blue-600", dot: "bg-blue-500" },
  emerald: { bg: "bg-emerald-50", border: "border-emerald-200", badge: "bg-emerald-100 text-emerald-700", icon: "text-emerald-600", dot: "bg-emerald-500" },
  amber: { bg: "bg-amber-50", border: "border-amber-200", badge: "bg-amber-100 text-amber-700", icon: "text-amber-600", dot: "bg-amber-500" },
  violet: { bg: "bg-violet-50", border: "border-violet-200", badge: "bg-violet-100 text-violet-700", icon: "text-violet-600", dot: "bg-violet-500" },
  rose: { bg: "bg-rose-50", border: "border-rose-200", badge: "bg-rose-100 text-rose-700", icon: "text-rose-600", dot: "bg-rose-500" },
  sky: { bg: "bg-sky-50", border: "border-sky-200", badge: "bg-sky-100 text-sky-700", icon: "text-sky-600", dot: "bg-sky-500" },
};

const demandColor = { "Rất cao": "text-emerald-600 font-bold", "Cao": "text-blue-600 font-medium", "Trung bình": "text-amber-600" };

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function StreamCard({ stream }) {
  const [open, setOpen] = useState(false);
  const c = colorMap[stream.color];
  return (
    <div className={`rounded-2xl border ${c.border} overflow-hidden shadow-sm`}>
      <button className={`w-full px-5 py-4 flex items-start justify-between gap-3 ${c.bg} text-left`} onClick={() => setOpen(!open)}>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.badge}`}>{stream.badge}</span>
            <span className="font-bold text-[#0a1628]">{stream.name}</span>
          </div>
          <div className="flex flex-wrap gap-4 mt-2 text-sm">
            <span className="flex items-center gap-1 text-gray-600"><DollarSign className="w-4 h-4 text-emerald-500" />Phí: {stream.fee}</span>
            <span className="flex items-center gap-1 text-gray-600"><Clock className="w-4 h-4 text-gray-400" />{stream.duration}</span>
          </div>
        </div>
        {open ? <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-5 py-4 bg-white border-t border-gray-100">
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">{stream.summary}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm">
              <span className="font-semibold text-blue-700">⏰ Thời hạn visa:</span>
              <span className="text-blue-600 ml-1">{stream.duration}</span>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm">
              <span className="font-semibold text-emerald-700">💼 Quyền làm việc:</span>
              <span className="text-emerald-600 ml-1">{stream.workRights}</span>
            </div>
          </div>

          <h4 className="font-semibold text-[#0a1628] mb-2 text-sm">✅ Yêu cầu</h4>
          <div className="space-y-2">
            {stream.requirements.map((req, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${c.icon}`} />
                <span className="text-gray-700">{req}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function FieldCard({ group }) {
  const [open, setOpen] = useState(false);
  const c = colorMap[group.color] || colorMap.blue;
  return (
    <div className={`rounded-2xl border ${c.border} overflow-hidden shadow-sm`}>
      <button className={`w-full px-5 py-4 flex items-center justify-between ${c.bg} text-left`} onClick={() => setOpen(!open)}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{group.icon}</span>
          <div>
            <div className="font-bold text-[#0a1628]">{group.field}</div>
            <div className="flex flex-wrap gap-2 mt-1 text-xs">
              <span className={`px-2 py-0.5 rounded-full ${c.badge}`}>Học phí: {group.avgTuition}</span>
              <span className={`px-2 py-0.5 rounded-full ${demandColor[group.demand]}`}>Nhu cầu: {group.demand}</span>
            </div>
          </div>
        </div>
        {open ? <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-5 py-4 bg-white border-t border-gray-100">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Khóa học phổ biến</div>
              <ul className="space-y-1">
                {group.popularCourses.map((course, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-start gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                    {course}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Trường đào tạo</div>
              <p className="text-sm text-gray-700">{group.providers}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 text-sm">
            <div className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
              <span className="font-medium text-gray-500">Thời gian học: </span>
              <span className="text-[#0a1628] font-medium">{group.duration}</span>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
              <span className="font-medium text-gray-500">Visa 485 sau tốt nghiệp: </span>
              <span className="text-[#0a1628] font-medium">{group.postStudyWork}</span>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
              <span className="font-medium text-emerald-600">Lương kỳ vọng: </span>
              <span className="text-emerald-700 font-medium">{group.avgSalary}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function GSQuestionCard({ q }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden">
      <button className="w-full px-5 py-4 flex items-start justify-between gap-3 bg-white text-left hover:bg-gray-50" onClick={() => setOpen(!open)}>
        <div className="flex-1">
          <div className="font-semibold text-[#0a1628] mb-1">{q.question}</div>
          <p className="text-sm text-gray-500">{q.hint}</p>
        </div>
        {open ? <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-4 bg-white border-t border-gray-100">
          <div className="mt-3">
            <div className="text-sm font-semibold text-emerald-700 mb-2">💡 Gợi ý chi tiết</div>
            <ul className="space-y-1.5">
              {q.tips.map((tip, i) => (
                <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 flex-shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function Visa500() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "📋 Tổng quan" },
    { id: "streams", label: "4 Diện visa" },
    { id: "fields", label: "🎓 Ngành học & Học phí" },
    { id: "gs", label: "Genuine Student (GS)" },
    { id: "pathway", label: "Lộ trình đến PR" },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-[#0f2347] text-white text-sm font-bold px-3 py-1 rounded-full">Visa 500</span>
            <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full">Student Visa</span>
          </div>
          <h1 className="text-3xl font-bold text-[#0a1628] mb-2">Visa 500 – Visa Du Học</h1>
          <p className="text-gray-500 leading-relaxed">
            Visa du học Úc cho phép bạn theo học các chương trình giáo dục chính thức. Đây là bước đầu tiên trên hành trình từ sinh viên quốc tế đến Thường Trú Nhân (PR).
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
            {[
              { label: "Phí visa", value: "AUD 1,600", color: "blue" },
              { label: "Yêu cầu tài chính", value: "AUD 29,710/năm", color: "emerald" },
              { label: "Quyền làm việc", value: "48h/2 tuần", color: "violet" },
              { label: "Bảo hiểm", value: "OSHC bắt buộc", color: "rose" },
            ].map((s, i) => (
              <div key={i} className={`bg-white rounded-xl border ${colorMap[s.color]?.border} p-3 text-center shadow-sm`}>
                <div className={`font-bold text-lg ${colorMap[s.color]?.icon}`}>{s.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Alert */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <span className="font-semibold">Cập nhật quan trọng (2024-2025):</span> Genuine Temporary Entrant (GTE) đã được thay thế bằng <strong>Genuine Student (GS)</strong> requirement từ 23/3/2024 – đơn giản hơn, tập trung vào lý do học tập thực sự. Mức yêu cầu tài chính tăng lên <strong>AUD 29,710/năm</strong> (từ 1/5/2024). Quyền làm việc: <strong>48 giờ/2 tuần</strong> trong kỳ học.
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-2xl border border-gray-100 p-1.5 mb-6 overflow-x-auto shadow-sm">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors flex-1 ${activeTab === tab.id ? "bg-[#0f2347] text-white" : "text-gray-600 hover:text-[#0a1628]"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}

        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h2 className="text-lg font-bold text-[#0a1628] mb-4">Visa 500 là gì?</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Visa 500 (Student Visa) là visa tạm trú cho phép bạn sang Úc học tập trong tối đa <strong>5 năm</strong> tùy chương trình. Bạn có thể học chương trình tiếng Anh, nghề, đại học, hoặc sau đại học.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Đây là cánh cửa đầu tiên cho hành trình <strong>Sinh viên → PR</strong>. Sau khi tốt nghiệp, bạn có thể xin visa 485 (Post-Study Work) và sau đó nộp EOI để xin visa thường trú 189/190/491.
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" /> Quyền lợi khi học
                  </div>
                  <ul className="space-y-1.5 text-sm text-blue-600">
                    <li>✓ Theo học chương trình CRICOS</li>
                    <li>✓ Làm việc 48h/2 tuần trong kỳ học</li>
                    <li>✓ Không giới hạn giờ trong kỳ nghỉ</li>
                    <li>✓ Bảo lãnh người giám hộ (visa 590 nếu dưới 18)</li>
                  </ul>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <div className="font-semibold text-emerald-700 mb-2 flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" /> Con đường đến PR
                  </div>
                  <ul className="space-y-1.5 text-sm text-emerald-600">
                    <li>✓ Tốt nghiệp → Visa 485 (2-6 năm)</li>
                    <li>✓ Làm việc + tích lũy kinh nghiệm</li>
                    <li>✓ Skills Assessment + EOI</li>
                    <li>✓ Visa 189/190/491 → PR</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h2 className="text-lg font-bold text-[#0a1628] mb-4">Điều kiện tổng quát</h2>
              <div className="space-y-3">
                {[
                  { icon: BookOpen, text: "Đã nhận CoE (Confirmation of Enrolment) từ trường được CRICOS" },
                  { icon: DollarSign, text: "Chứng minh tài chính: AUD 29,710/năm sinh hoạt phí + học phí + vé máy bay" },
                  { icon: Heart, text: "Đáp ứng yêu cầu sức khỏe (khám theo panel physician của DIBP)" },
                  { icon: Shield, text: "Mua bảo hiểm OSHC toàn bộ thời gian lưu trú" },
                  { icon: Users, text: "Genuine Student (GS) – thể hiện mục đích học tập thực sự" },
                  { icon: Star, text: "Điểm tiếng Anh theo yêu cầu của khóa học (tối thiểu IELTS 4.5-6.0)" },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-gray-700 text-sm">{item.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === "streams" && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 mb-2">Visa 500 có 4 diện (sector). Sinh viên Việt Nam thường theo diện <strong>Higher Education</strong> hoặc <strong>VET</strong>.</p>
            {visaStreams.map(s => <StreamCard key={s.id} stream={s} />)}
          </div>
        )}

        {activeTab === "fields" && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 mb-2">Top ngành học phổ biến cho sinh viên Việt Nam, học phí ước tính và cơ hội PR sau tốt nghiệp.</p>
            {studyFields.map(g => <FieldCard key={g.field} group={g} />)}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-xs text-gray-500 mt-2">
              * Học phí là ước tính trung bình, có thể thay đổi theo trường và năm học. Tham khảo website chính thức của trường để có thông tin chính xác.
              Tìm hiểu thêm tại{" "}
              <a href="https://www.studyinaustralia.gov.au" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline inline-flex items-center gap-1">
                studyinaustralia.gov.au <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}

        {activeTab === "gs" && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <h3 className="font-bold text-blue-800 mb-1">📝 Genuine Student (GS) Requirement</h3>
              <p className="text-sm text-blue-700">
                Thay thế GTE từ 23/3/2024. GS yêu cầu bạn trả lời 4 câu hỏi để chứng minh mục đích học tập thực sự. 
                Câu trả lời có thể viết trực tiếp trong đơn visa hoặc đính kèm thư riêng.
              </p>
            </div>

            <p className="text-sm text-gray-500 mb-2">4 câu hỏi GS và gợi ý cách trả lời:</p>
            {gsQuestions.map((q, i) => <GSQuestionCard key={i} q={q} />)}

            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-rose-700">
                <strong>Quan trọng:</strong> Không sao chép câu trả lời mẫu. Mỗi câu trả lời cần phản ánh hoàn cảnh thực tế của bạn. 
                Tham khảo MARA agent hoặc tư vấn viên giáo dục để được hướng dẫn cá nhân hóa.
              </p>
            </div>
          </div>
        )}

        {activeTab === "pathway" && (
          <div>
            <p className="text-sm text-gray-500 mb-6">Lộ trình từ Visa 500 (Du học) đến Thường Trú Nhân qua các visa phổ biến.</p>
            <div className="relative">
              {prPathwaySteps.map((step, idx) => (
                <div key={step.step} className="relative flex gap-5 mb-4">
                  {idx < prPathwaySteps.length - 1 && (
                    <div className="absolute left-5 top-12 w-0.5 h-[calc(100%+8px)] bg-blue-200" />
                  )}
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow ${idx === prPathwaySteps.length - 1 ? "bg-emerald-500 text-white" : "bg-[#0f2347] text-white"}`}>
                      {idx === prPathwaySteps.length - 1 ? "✓" : step.step}
                    </div>
                  </div>
                  <div className={`flex-1 rounded-2xl border p-4 shadow-sm ${idx === prPathwaySteps.length - 1 ? "bg-emerald-50 border-emerald-200" : "bg-white border-gray-200"}`}>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-[#0a1628]">{step.title}</h3>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{step.time}</span>
                    </div>
                    <p className="text-sm text-gray-600">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-[#0f2347] rounded-2xl p-5 text-white">
              <div className="font-semibold text-lg mb-3">📊 Mẹo để tăng cơ hội PR sau du học</div>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="font-bold text-blue-200 mb-2">Nên làm ✅</div>
                  <div className="space-y-1.5 text-blue-100">
                    <div>✓ Chọn ngành có trong danh sách skilled occupation</div>
                    <div>✓ Học regional (Melbourne, Brisbane, Adelaide...) →bonus 5 điểm EOI</div>
                    <div>✓ Tích lũy kinh nghiệm làm việc trong thời gian visa 485</div>
                    <div>✓ Thi PTE Academic (thường dễ đạt điểm cao hơn IELTS)</div>
                    <div>✓ Tham gia professional networking và certification</div>
                  </div>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="font-bold text-blue-200 mb-2">Nên tránh ❌</div>
                  <div className="space-y-1.5 text-blue-100">
                    <div>✗ Chọn ngành không có demand tại Úc</div>
                    <div>✗ Không học đủ 2 năm CRICOS (quan trọng cho visa 485)</div>
                    <div>✗ Bỏ học hoặc chuyển trường nhiều lần (ảnh hưởng GS)</div>
                    <div>✗ Vi phạm điều kiện visa (working over hours, không có OSHC)</div>
                    <div>✗ Để visa hết hạn mà không gia hạn – overstay</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 bg-white border border-gray-200 rounded-2xl p-5">
              <h3 className="font-bold text-[#0a1628] mb-3">So sánh visa sau tốt nghiệp (Visa 485)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-2 text-xs font-semibold text-gray-500 uppercase">Đặc điểm</th>
                      <th className="text-left py-2 px-2 text-xs font-semibold text-gray-500 uppercase">Graduate Work</th>
                      <th className="text-left py-2 px-2 text-xs font-semibold text-gray-500 uppercase">Post-Study Work</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-50">
                      <td className="py-2.5 px-2 font-medium text-[#0a1628]">Đối tượng</td>
                      <td className="py-2.5 px-2 text-gray-600">Ngành có trong skilled occupation list</td>
                      <td className="py-2.5 px-2 text-gray-600">Tốt nghiệp Cử nhân/Thạc sĩ/Tiến sĩ</td>
                    </tr>
                    <tr className="border-b border-gray-50">
                      <td className="py-2.5 px-2 font-medium text-[#0a1628]">Thời hạn</td>
                      <td className="py-2.5 px-2 text-gray-600">18 tháng + regional extension</td>
                      <td className="py-2.5 px-2 text-gray-600">2-6 năm tùy bằng cấp</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-2 font-medium text-[#0a1628]">Skills Assessment</td>
                      <td className="py-2.5 px-2 text-gray-600">Cần có trước khi nộp</td>
                      <td className="py-2.5 px-2 text-gray-600">Không cần khi nộp</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-8 grid md:grid-cols-2 gap-4">
          <Link to={createPageUrl("Chat")} className="bg-[#0f2347] text-white rounded-2xl p-5 hover:bg-[#1a3a6e] transition-colors flex items-start gap-3">
            <Star className="w-6 h-6 text-yellow-300 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold">Hỏi AI về Visa 500</div>
              <div className="text-blue-300 text-sm mt-1">Tư vấn ngành học phù hợp với bạn</div>
            </div>
          </Link>
          <Link to={createPageUrl("Roadmap")} className="bg-white border border-gray-200 text-[#0a1628] rounded-2xl p-5 hover:shadow-md transition-all flex items-start gap-3">
            <ArrowRight className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold">Xem toàn bộ lộ trình PR</div>
              <div className="text-gray-500 text-sm mt-1">Bao gồm tất cả các con đường đến PR</div>
            </div>
          </Link>
        </div>

        <p className="text-xs text-gray-400 text-center mt-6">
          Thông tin cập nhật theo dữ liệu DIBP tháng 3/2025. Chính sách visa có thể thay đổi – luôn kiểm tra nguồn chính thức.
        </p>
      </div>
    </div>
  );
}