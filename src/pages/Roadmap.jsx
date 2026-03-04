import { useState } from "react";
import { CheckCircle, Circle, ChevronDown, ChevronUp, Clock, ArrowRight, User, Zap } from "lucide-react";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";
import { useUserProfile } from "../components/useUserProfile";

const stages = [
  {
    id: "student",
    code: "Visa 500",
    title: "Visa Du Học Sinh",
    subtitle: "Student Visa",
    color: "blue",
    duration: "Trong thời gian học",
    description: "Visa dành cho sinh viên học tại các trường đăng ký (CRICOS). Thời hạn theo thời gian khóa học + thêm 1 tháng.",
    conditions: [
      "Thư nhập học (CoE) từ trường được CRICOS đăng ký",
      "Chứng minh tài chính: đủ tiền trang trải học phí + sinh hoạt phí (~AUD 21,041/năm)",
      "IELTS 5.5+ hoặc tương đương (PTE 42+)",
      "Bảo hiểm y tế OSHC trong suốt thời gian học",
      "Hồ sơ sức khỏe (Health Examination)",
      "Lý lịch tư pháp sạch (Police Clearance)",
      "Đơn xin visa Form 157A hoặc nộp online (ImmiAccount)",
      "Phí visa: AUD 650",
    ],
    forms: ["Form 157A – Student Visa Application", "Form 1221 – Additional Personal Particulars"],
    tips: "Nên nộp ít nhất 8-12 tuần trước khi khóa học bắt đầu.",
  },
  {
    id: "graduate",
    code: "Visa 485",
    title: "Visa Tốt Nghiệp",
    subtitle: "Temporary Graduate Visa",
    color: "violet",
    duration: "2 – 4 năm",
    description: "Cho phép sinh viên tốt nghiệp ở lại Úc làm việc sau khi hoàn thành bằng từ 2 năm trở lên tại Úc.",
    conditions: [
      "Tốt nghiệp bằng từ trường CRICOS trong 6 tháng gần nhất",
      "Đã học ít nhất 2 năm tại Úc (16 tháng học thực tế)",
      "Tuổi dưới 50 (tại thời điểm nộp đơn)",
      "IELTS 6.0 trung bình (mỗi kỹ năng không dưới 5.0) hoặc PTE 50+",
      "Còn trong hạn visa sinh viên khi nộp đơn",
      "Hồ sơ sức khỏe mới nếu cần",
      "Phí visa: AUD 1,840",
    ],
    forms: ["Form 1276 – Temporary Graduate Visa Application"],
    tips: "Nộp đơn trước khi visa sinh viên hết hạn. Sau khi có 485, bắt đầu tích lũy điểm EOI.",
  },
  {
    id: "skills",
    title: "Đánh giá kỹ năng",
    subtitle: "Skills Assessment",
    color: "amber",
    duration: "3 – 6 tháng",
    description: "Bước quan trọng để xác nhận kỹ năng nghề nghiệp của bạn phù hợp với tiêu chuẩn Úc.",
    conditions: [
      "Xác định ANZSCO code của nghề nghiệp bạn muốn di trú",
      "Nộp hồ sơ đến cơ quan đánh giá phù hợp (Engineers Australia, ACS, VETASSESS,...)",
      "Bằng cấp phải được công nhận (thường cần bằng Úc hoặc tương đương)",
      "Kinh nghiệm làm việc liên quan (tùy ngành 1-3 năm)",
      "Phí đánh giá kỹ năng: AUD 500 – 1,500",
      "IELTS 6.0 – 7.0 tùy ngành nghề",
    ],
    forms: [],
    tips: "Tham khảo Skilled Occupation List (SOL) và danh sách nghề của từng tiểu bang.",
  },
  {
    id: "eoi",
    title: "Nộp EOI SkillSelect",
    subtitle: "Expression of Interest",
    color: "emerald",
    duration: "1 – 24 tháng chờ mời",
    description: "Hệ thống SkillSelect để bày tỏ nguyện vọng xin visa skilled independent hoặc visa tiểu bang.",
    conditions: [
      "Đạt đủ điểm tối thiểu (65 điểm cho visa 189/190/491)",
      "Tuổi: 18 – 44 (điểm cao nhất 18-24 tuổi: 25 điểm)",
      "English: IELTS 7.0+ (điểm Competent 10đ, Proficient 20đ, Superior 30đ)",
      "Bằng cấp được công nhận (tương đương AQF: tiến sĩ 20đ, thạc sĩ 15đ, đại học 10đ)",
      "Kinh nghiệm làm việc tại Úc (8+ năm: 20đ, 5-7 năm: 15đ, 3-4 năm: 10đ, 1-2 năm: 5đ)",
      "Đã có kết quả đánh giá kỹ năng positive",
      "Học tập tại vùng Úc (regional study bonus 5đ)",
      "Partner skills (5 – 10 điểm)",
    ],
    forms: [],
    tips: "Càng nhiều điểm EOI càng nhanh được mời. Cập nhật EOI thường xuyên khi điểm thay đổi.",
  },
  {
    id: "state",
    title: "Visa bảo lãnh Tiểu bang",
    subtitle: "State Nomination (190/491)",
    color: "sky",
    duration: "3 – 12 tháng",
    description: "Tiểu bang bảo lãnh giúp tăng 5-15 điểm EOI. Visa 190 cho PR trực tiếp, visa 491 cần ở vùng 3 năm.",
    conditions: [
      "Chọn tiểu bang phù hợp với ngành nghề và nơi cư trú",
      "Ngành nghề phải nằm trong danh sách nghề của tiểu bang đó",
      "Thường yêu cầu có liên kết với tiểu bang (đang sống, học, làm việc tại đó)",
      "IELTS theo yêu cầu từng tiểu bang (thường 6.0 – 7.0)",
      "Đủ điểm base EOI (65+) trước khi cộng điểm bảo lãnh",
      "Visa 190: +5 điểm (có thể xin PR ngay sau 2 năm)",
      "Visa 491: +15 điểm (phải sống & làm việc vùng 3 năm trước khi xin PR 191)",
    ],
    forms: ["Form 1276 – State Nomination Application (tùy tiểu bang)"],
    tips: "Các tiểu bang hot: Victoria, Queensland, NSW, SA. Mỗi tiểu bang có portal riêng để đăng ký.",
  },
  {
    id: "pr",
    title: "Thường Trú Nhân (PR)",
    subtitle: "Permanent Residency",
    color: "rose",
    duration: "Vĩnh viễn (5 năm gia hạn)",
    description: "Được nhận lời mời (ITA) từ SkillSelect và nộp hồ sơ PR hoàn chỉnh.",
    conditions: [
      "Nhận Invitation to Apply (ITA) từ SkillSelect",
      "Nộp hồ sơ visa trong 60 ngày sau ITA",
      "Cung cấp toàn bộ tài liệu: passport, bằng cấp, kinh nghiệm, IELTS, skills assessment",
      "Khám sức khỏe diện di trú (Panel doctor được DIBP công nhận)",
      "Lý lịch tư pháp tất cả các quốc gia từng sống 12 tháng+ từ 16 tuổi",
      "Phí visa 189: AUD 4,640 / visa 190: AUD 4,640",
      "Thời gian xử lý: 6 – 18 tháng",
      "Biometrics nếu yêu cầu",
    ],
    forms: [
      "Form 47SK – Skilled Migration Application",
      "Form 80 – Personal Particulars",
      "Form 888 – Sponsorship",
      "Form 1229 – Health Examination",
    ],
    tips: "Chuẩn bị sẵn mọi tài liệu trước khi nhận ITA vì chỉ có 60 ngày để nộp hồ sơ đầy đủ.",
  },
];

const colorMap = {
  blue: { bg: "bg-blue-50", border: "border-blue-200", badge: "bg-blue-100 text-blue-700", dot: "bg-blue-500", icon: "text-blue-600", line: "bg-blue-300" },
  violet: { bg: "bg-violet-50", border: "border-violet-200", badge: "bg-violet-100 text-violet-700", dot: "bg-violet-500", icon: "text-violet-600", line: "bg-violet-300" },
  amber: { bg: "bg-amber-50", border: "border-amber-200", badge: "bg-amber-100 text-amber-700", dot: "bg-amber-500", icon: "text-amber-600", line: "bg-amber-300" },
  emerald: { bg: "bg-emerald-50", border: "border-emerald-200", badge: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500", icon: "text-emerald-600", line: "bg-emerald-300" },
  sky: { bg: "bg-sky-50", border: "border-sky-200", badge: "bg-sky-100 text-sky-700", dot: "bg-sky-500", icon: "text-sky-600", line: "bg-sky-300" },
  rose: { bg: "bg-rose-50", border: "border-rose-200", badge: "bg-rose-100 text-rose-700", dot: "bg-rose-500", icon: "text-rose-600", line: "bg-rose-300" },
};

// Maps visa type to stage ids that are "completed" or "current"
const stageOrder = ["student", "graduate", "skills", "eoi", "state", "pr"];

function getStageStatus(stageId, currentVisa) {
  const stageMap = { "500": "student", "485": "graduate", "189": "pr", "190": "pr", "491": "pr" };
  const currentIdx = stageOrder.indexOf(stageMap[currentVisa] || "student");
  const thisIdx = stageOrder.indexOf(stageId);
  if (thisIdx < currentIdx) return "done";
  if (thisIdx === currentIdx) return "current";
  return "upcoming";
}

export default function Roadmap() {
  const { profile, loading, getCurrentStage, getEnglishLevel } = useUserProfile();
  const currentStage = profile ? (getCurrentStage() || "student") : null;
  const [expanded, setExpanded] = useState(null);

  // Auto-expand the current stage when profile loads
  useState(() => { if (currentStage) setExpanded(currentStage); });

  const englishLevel = getEnglishLevel();
  const needsEnglish = englishLevel === "below" || englishLevel === null;

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0a1628] mb-3">Lộ trình đến PR tại Úc</h1>
          <p className="text-gray-500 text-lg">Từng bước từ visa sinh viên đến Thường trú nhân – dành riêng cho sinh viên Việt tại Úc</p>
        </div>

        {/* Personalized banner */}
        {profile ? (
          <div className="bg-gradient-to-r from-[#0f2347] to-[#1a3a6e] rounded-2xl p-5 mb-8 text-white flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-yellow-300" />
              </div>
              <div>
                <div className="font-semibold">Lộ trình được cá nhân hóa cho bạn</div>
                <div className="text-blue-200 text-sm mt-0.5">
                  {profile.full_name && <span>Xin chào {profile.full_name}! • </span>}
                  Visa hiện tại: <span className="text-white font-medium">Visa {profile.current_visa_type}</span>
                  {profile.english_score && <span> • IELTS/PTE: <span className="text-white font-medium">{profile.english_score}</span></span>}
                </div>
              </div>
            </div>
            {needsEnglish && (
              <div className="bg-amber-400/20 border border-amber-400/30 rounded-xl px-4 py-2 text-sm text-amber-200 flex-shrink-0">
                ⚠️ Cần cải thiện tiếng Anh để đạt điểm EOI cao hơn
              </div>
            )}
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-8 flex items-center gap-3">
            <User className="w-5 h-5 text-blue-500 flex-shrink-0" />
            <p className="text-sm text-blue-700">
              <Link to={createPageUrl("Profile")} className="font-semibold underline">Điền hồ sơ cá nhân</Link> để lộ trình được cá nhân hóa theo visa và điểm tiếng Anh của bạn.
            </p>
          </div>
        )}

        {/* Timeline */}
        <div className="relative">
          {stages.map((stage, idx) => {
            const c = colorMap[stage.color];
            const isOpen = expanded === stage.id;
            const status = profile ? getStageStatus(stage.id, profile.current_visa_type) : "upcoming";
            const isCurrent = status === "current";
            const isDone = status === "done";
            return (
              <div key={stage.id} className="relative flex gap-6 mb-4">
                {/* Line */}
                {idx < stages.length - 1 && (
                  <div className={`absolute left-5 top-12 w-0.5 h-[calc(100%+8px)] ${isDone ? "bg-emerald-400" : c.line} opacity-40`} />
                )}
                {/* Dot */}
                <div className="flex-shrink-0 mt-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md ${isDone ? "bg-emerald-500" : isCurrent ? c.dot + " ring-4 ring-offset-2 ring-blue-300" : "bg-gray-300"}`}>
                    {isDone ? "✓" : idx + 1}
                  </div>
                </div>
                {/* Card */}
                <div className={`flex-1 rounded-2xl border shadow-sm overflow-hidden mb-2 ${isCurrent ? "bg-white border-blue-300 ring-2 ring-blue-100" : isDone ? "bg-white border-emerald-200" : "bg-gray-50 border-gray-200"}`}>
                  <button
                    className="w-full px-6 py-4 flex items-start justify-between gap-4 text-left"
                    onClick={() => setExpanded(isOpen ? null : stage.id)}
                  >
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        {stage.code && (
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.badge}`}>{stage.code}</span>
                        )}
                        {isCurrent && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white animate-pulse">▶ Giai đoạn hiện tại</span>}
                        {isDone && <span className="text-xs font-medium text-emerald-600">✓ Đã hoàn thành</span>}
                        <span className={`text-xs flex items-center gap-1 ${c.icon}`}>
                          <Clock className="w-3 h-3" />{stage.duration}
                        </span>
                      </div>
                      <h3 className={`font-bold text-lg ${isDone ? "text-gray-400" : "text-[#0a1628]"}`}>{stage.title}</h3>
                      <p className="text-gray-400 text-sm">{stage.subtitle}</p>
                    </div>
                    {isOpen ? <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" /> : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />}
                  </button>

                  {isOpen && (
                    <div className={`px-6 pb-6 ${c.bg} border-t ${c.border}`}>
                      <p className="text-gray-600 text-sm mt-4 mb-4 leading-relaxed">{stage.description}</p>

                      <h4 className="font-semibold text-[#0a1628] mb-3">✅ Điều kiện & Checklist</h4>
                      <div className="space-y-2 mb-4">
                        {stage.conditions.map((cond, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${c.icon}`} />
                            <span className="text-sm text-gray-700">{cond}</span>
                          </div>
                        ))}
                      </div>

                      {stage.forms.length > 0 && (
                        <>
                          <h4 className="font-semibold text-[#0a1628] mb-2">📄 Biểu mẫu liên quan</h4>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {stage.forms.map((f, i) => (
                              <Link
                                key={i}
                                to={createPageUrl("Forms")}
                                className={`text-xs px-3 py-1.5 rounded-lg border ${c.border} ${c.badge} hover:opacity-80 transition-opacity flex items-center gap-1`}
                              >
                                <span>{f}</span> <ArrowRight className="w-3 h-3" />
                              </Link>
                            ))}
                          </div>
                        </>
                      )}

                      <div className="bg-white/80 rounded-xl p-3 border border-yellow-200">
                        <p className="text-xs text-amber-700"><span className="font-semibold">💡 Mẹo:</span> {stage.tips}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-8 grid md:grid-cols-2 gap-4">
          <Link to={createPageUrl("Checklist")} className="bg-[#0f2347] text-white rounded-2xl p-6 hover:bg-[#1a3a6e] transition-colors">
            <CheckCircle className="w-6 h-6 mb-3" />
            <div className="font-semibold text-lg">Xem Checklist cá nhân</div>
            <div className="text-blue-300 text-sm mt-1">Theo dõi tiến trình của bạn</div>
          </Link>
          <Link to={createPageUrl("Chat")} className="bg-white border border-gray-200 text-[#0a1628] rounded-2xl p-6 hover:shadow-md transition-all">
            <Circle className="w-6 h-6 mb-3 text-blue-600" />
            <div className="font-semibold text-lg">Hỏi AI tư vấn</div>
            <div className="text-gray-500 text-sm mt-1">Giải đáp thắc mắc cụ thể</div>
          </Link>
        </div>
      </div>
    </div>
  );
}