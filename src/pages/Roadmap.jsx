import { useState } from "react";
import {
  GraduationCap, Briefcase, ClipboardList, BarChart2,
  MapPin, Award, CheckCircle2, Circle, ChevronDown,
  ChevronUp, FileText, Bell, Clock, AlertTriangle,
  BookOpen, ExternalLink, Lightbulb, ChevronRight,
  CheckCheck, Calendar, Star, Target, ArrowRight
} from "lucide-react";

// ─── Stage Data ──────────────────────────────────────────────────────────────
const STAGES = [
  {
    id: "student",
    code: "500",
    label: "Visa Sinh Viên",
    sublabel: "Subclass 500",
    icon: GraduationCap,
    color: "blue",
    gradient: "from-blue-500 to-blue-700",
    lightBg: "bg-blue-50",
    border: "border-blue-200",
    textColor: "text-blue-700",
    badgeBg: "bg-blue-100",
    durationMonths: "24–48 tháng",
    description:
      "Học tập tại trường được công nhận CRICOS, tích lũy điểm số, kỹ năng Anh ngữ và kinh nghiệm sống tại Úc.",
    conditions: [
      "Nhập học trường CRICOS được công nhận",
      "Duy trì điểm danh ≥ 80%",
      "Không vi phạm điều kiện visa",
      "Mua OSHC (bảo hiểm y tế sinh viên)",
    ],
    documents: [
      { name: "CoE – Confirmation of Enrolment", form: null },
      { name: "Hộ chiếu còn hạn > 6 tháng", form: null },
      { name: "Bảo hiểm y tế OSHC", form: null },
      { name: "Bằng IELTS/PTE (nếu yêu cầu)", form: null },
      { name: "Biểu mẫu 157A (nếu nộp giấy tờ bổ sung)", form: "157A" },
    ],
    tasks: [
      { text: "Chọn ngành học phù hợp với ANZSCO mục tiêu", urgent: true },
      { text: "Đạt IELTS ≥ 6.0 overall (hoặc PTE 50+)", urgent: true },
      { text: "Nộp đơn vào trường và nhận CoE", urgent: false },
      { text: "Mua OSHC đủ thời gian học", urgent: false },
      { text: "Nộp hồ sơ visa 500 trên ImmiAccount", urgent: false },
      { text: "Tích lũy kinh nghiệm làm việc part-time liên quan ngành", urgent: false },
    ],
    tips: [
      "Chọn ngành thuộc MLTSSL hoặc STSOL để dễ xin PR sau này.",
      "Học tại vùng nông thôn (regional) giúp tăng điểm cho visa 491.",
      "Ghi chép kỹ payslip và employment contract để minh chứng kinh nghiệm.",
    ],
    forms: [
      { name: "Form 157A – Supplementary evidence", url: "#" },
    ],
  },
  {
    id: "graduate",
    code: "485",
    label: "Visa Sau Tốt Nghiệp",
    sublabel: "Subclass 485",
    icon: Briefcase,
    color: "indigo",
    gradient: "from-indigo-500 to-indigo-700",
    lightBg: "bg-indigo-50",
    border: "border-indigo-200",
    textColor: "text-indigo-700",
    badgeBg: "bg-indigo-100",
    durationMonths: "18–36 tháng",
    description:
      "Cho phép ở lại và làm việc toàn thời gian sau khi tốt nghiệp. Cơ hội lý tưởng để tích lũy kinh nghiệm Úc.",
    conditions: [
      "Tốt nghiệp từ trường CRICOS tại Úc",
      "Dưới 50 tuổi tại thời điểm nộp đơn",
      "IELTS ≥ 6.0 (hoặc tương đương)",
      "Đăng ký Skills Assessment nếu áp dụng",
    ],
    documents: [
      { name: "Bằng tốt nghiệp + bảng điểm chính thức", form: null },
      { name: "Kết quả IELTS/PTE (trong vòng 3 năm)", form: null },
      { name: "Kết quả Skills Assessment (nếu cần)", form: null },
      { name: "Biểu mẫu 1229 (Aged Parent/Address)", form: "1229" },
    ],
    tasks: [
      { text: "Hoàn thành khoá học và nhận kết quả tốt nghiệp", urgent: true },
      { text: "Nâng IELTS lên ≥ 7.0 để tăng điểm EOI", urgent: true },
      { text: "Nộp đơn Skills Assessment với tổ chức phù hợp (ACS, EA, CPA...)", urgent: true },
      { text: "Nộp hồ sơ visa 485 trên ImmiAccount", urgent: false },
      { text: "Bắt đầu tìm việc làm đúng ngành", urgent: false },
      { text: "Ghi lại tất cả payslip và reference letters", urgent: false },
    ],
    tips: [
      "Nộp Skills Assessment sớm – thường mất 6–12 tuần.",
      "Đạt IELTS 8+ trong từng band sẽ cho 20 điểm EOI.",
      "Làm việc đúng ANZSCO mã nghề nghiệp để tính kinh nghiệm hợp lệ.",
    ],
    forms: [
      { name: "Form 1229 – Sponsorship", url: "#" },
    ],
  },
  {
    id: "skills",
    code: "SA",
    label: "Đánh Giá Kỹ Năng",
    sublabel: "Skills Assessment",
    icon: ClipboardList,
    color: "violet",
    gradient: "from-violet-500 to-violet-700",
    lightBg: "bg-violet-50",
    border: "border-violet-200",
    textColor: "text-violet-700",
    badgeBg: "bg-violet-100",
    durationMonths: "1–6 tháng",
    description:
      "Tổ chức đánh giá kỹ năng xác nhận trình độ chuyên môn của bạn đáp ứng yêu cầu Úc.",
    conditions: [
      "Chọn đúng tổ chức đánh giá theo nghề ANZSCO",
      "Cung cấp bằng cấp, transcript đã hợp lệ hoá",
      "Cung cấp hồ sơ kinh nghiệm làm việc được xác nhận",
    ],
    documents: [
      { name: "Bằng đại học + bảng điểm (công chứng + dịch thuật)", form: null },
      { name: "Reference letters từ employer", form: null },
      { name: "Payslips / employment contracts", form: null },
      { name: "Kết quả IELTS/PTE", form: null },
      { name: "Hộ chiếu", form: null },
    ],
    tasks: [
      { text: "Xác định ANZSCO code nghề nghiệp", urgent: true },
      { text: "Nộp hồ sơ cho đúng tổ chức (ACS/EA/TRA/VETASSESS...)", urgent: true },
      { text: "Dịch thuật và công chứng toàn bộ tài liệu", urgent: false },
      { text: "Theo dõi tiến trình xử lý qua portal", urgent: false },
      { text: "Chuẩn bị kháng cáo nếu kết quả không thuận lợi", urgent: false },
    ],
    tips: [
      "ACS cho IT, EA cho kỹ sư, CPA/CAANZ cho kế toán, TRA cho kỹ thuật.",
      "RPL (Recognition of Prior Learning) giúp nếu thiếu bằng cấp chính quy.",
      "Skills Assessment hợp lệ 3 năm tính từ ngày cấp.",
    ],
    forms: [],
  },
  {
    id: "eoi",
    code: "EOI",
    label: "Nộp EOI",
    sublabel: "SkillSelect",
    icon: BarChart2,
    color: "amber",
    gradient: "from-amber-500 to-orange-600",
    lightBg: "bg-amber-50",
    border: "border-amber-200",
    textColor: "text-amber-700",
    badgeBg: "bg-amber-100",
    durationMonths: "3–18 tháng",
    description:
      "Đăng ký EOI trên SkillSelect và chờ được mời nộp đơn (ITA) dựa trên điểm số.",
    conditions: [
      "Có Skills Assessment dương tính",
      "Điểm EOI ≥ 65 (189), ≥ 65 (190), ≥ 45 (491)",
      "Dưới 45 tuổi",
      "Tiếng Anh đạt chuẩn",
    ],
    documents: [
      { name: "Skills Assessment (bản chính)", form: null },
      { name: "Kết quả IELTS/PTE (trong vòng 3 năm)", form: null },
      { name: "Bằng cấp đại học", form: null },
      { name: "Hồ sơ kinh nghiệm làm việc (employer letter + payslips)", form: null },
    ],
    tasks: [
      { text: "Tính điểm EOI chính xác trên VisaPath AI", urgent: true },
      { text: "Tạo hồ sơ EOI trên SkillSelect.gov.au", urgent: true },
      { text: "Nâng điểm EOI: Anh ngữ, kinh nghiệm, học vấn", urgent: false },
      { text: "Theo dõi điểm cutoff hàng tháng qua bản tin", urgent: false },
      { text: "Chuẩn bị hồ sơ sẵn sàng khi nhận ITA", urgent: false },
    ],
    tips: [
      "Điểm cutoff 189 thường dao động 65–90+. Cần theo dõi liên tục.",
      "Đạt IELTS 8 mỗi band = 20 điểm – đây là cách nhanh nhất tăng điểm.",
      "Kinh nghiệm Úc 8+ năm = 20 điểm.",
    ],
    forms: [],
  },
  {
    id: "state",
    code: "190/491",
    label: "Đề Cử Bang",
    sublabel: "State Nomination",
    icon: MapPin,
    color: "rose",
    gradient: "from-rose-500 to-rose-700",
    lightBg: "bg-rose-50",
    border: "border-rose-200",
    textColor: "text-rose-700",
    badgeBg: "bg-rose-100",
    durationMonths: "3–12 tháng",
    description:
      "Nộp đơn đề cử từ bang/vùng lãnh thổ để nhận thêm 5–15 điểm EOI.",
    conditions: [
      "EOI đang mở trên SkillSelect",
      "Đáp ứng yêu cầu riêng của từng bang",
      "Có kế hoạch sinh sống/làm việc tại bang đó",
    ],
    documents: [
      { name: "Hồ sơ EOI đã submit", form: null },
      { name: "Bằng chứng liên kết với bang (CV, employment offer)", form: null },
      { name: "Statement of Purpose / Cover Letter", form: null },
    ],
    tasks: [
      { text: "Nghiên cứu chương trình đề cử của từng bang (VIC, NSW, QLD, SA, WA...)", urgent: true },
      { text: "Kiểm tra occupation list của từng bang", urgent: true },
      { text: "Nộp Expression of Interest cho bang mục tiêu", urgent: false },
      { text: "Chuẩn bị Statement of Purpose thuyết phục", urgent: false },
    ],
    tips: [
      "NSW và VIC có quota lớn nhất nhưng cạnh tranh cao.",
      "SA, TAS, NT thường dễ nhận nomination hơn cho nghề thiếu hụt.",
      "491 cho phép ở vùng regional – sau 3 năm có thể xin 191 (PR).",
    ],
    forms: [],
  },
  {
    id: "pr",
    code: "189/190/191",
    label: "Thường Trú Nhân",
    sublabel: "Permanent Residency",
    icon: Award,
    color: "emerald",
    gradient: "from-emerald-500 to-emerald-700",
    lightBg: "bg-emerald-50",
    border: "border-emerald-200",
    textColor: "text-emerald-700",
    badgeBg: "bg-emerald-100",
    durationMonths: "6–24 tháng sau ITA",
    description:
      "Nhận Thường Trú Nhân Úc – sống và làm việc vĩnh viễn không giới hạn.",
    conditions: [
      "Nhận được ITA (Invitation to Apply)",
      "Điểm EOI đủ cutoff tại thời điểm invite",
      "Hồ sơ hoàn chỉnh và chính xác",
      "Health & Character checks đạt",
    ],
    documents: [
      { name: "ITA (Invitation to Apply)", form: null },
      { name: "Skills Assessment (còn hạn)", form: null },
      { name: "IELTS/PTE (còn hạn)", form: null },
      { name: "Kết quả khám sức khoẻ di trú", form: null },
      { name: "Lý lịch tư pháp / Police Clearance", form: null },
      { name: "Biểu mẫu 80 (Personal particulars)", form: "80" },
      { name: "Biểu mẫu 1085 (Supplementary visa 189/190)", form: "1085" },
    ],
    tasks: [
      { text: "Nộp hồ sơ visa trong 60 ngày sau ITA", urgent: true },
      { text: "Đặt lịch khám sức khoẻ di trú (eMedical)", urgent: true },
      { text: "Xin Police Clearance từ mọi quốc gia đã sống > 12 tháng", urgent: true },
      { text: "Cập nhật và hoàn thiện toàn bộ hồ sơ trên ImmiAccount", urgent: false },
      { text: "Kiểm tra lại điểm EOI và cập nhật nếu có thay đổi", urgent: false },
      { text: "Chuẩn bị tài chính cho phí visa", urgent: false },
    ],
    tips: [
      "Phí visa 189: ~AUD 4,640. Nộp đầy đủ ngay lần đầu để tránh delay.",
      "Khám sức khoẻ: dùng eMedical trên ImmiAccount. Kết quả có giá trị 12 tháng.",
      "Sau khi có PR, bạn có thể bảo lãnh người thân và nộp đơn quốc tịch sau 4 năm.",
    ],
    forms: [
      { name: "Form 80 – Personal particulars", url: "#" },
      { name: "Form 1085 – Supplementary (189/190)", url: "#" },
    ],
  },
];

const COLOR_MAP = {
  blue: { dot: "bg-blue-500", connector: "bg-blue-200", ring: "ring-blue-200" },
  indigo: { dot: "bg-indigo-500", connector: "bg-indigo-200", ring: "ring-indigo-200" },
  violet: { dot: "bg-violet-500", connector: "bg-violet-200", ring: "ring-violet-200" },
  amber: { dot: "bg-amber-500", connector: "bg-amber-200", ring: "ring-amber-200" },
  rose: { dot: "bg-rose-500", connector: "bg-rose-200", ring: "ring-rose-200" },
  emerald: { dot: "bg-emerald-500", connector: "bg-emerald-200", ring: "ring-emerald-200" },
};

// ─── Sub-components ──────────────────────────────────────────────────────────
function TaskItem({ task, stageColor }) {
  const [done, setDone] = useState(false);
  return (
    <li
      className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
        done
          ? "bg-gray-50 border-gray-200 opacity-60"
          : task.urgent
          ? "bg-orange-50 border-orange-200 hover:bg-orange-100"
          : "bg-white border-gray-200 hover:bg-gray-50"
      }`}
      onClick={() => setDone(!done)}
    >
      {done ? (
        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
      ) : (
        <Circle
          className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
            task.urgent ? "text-orange-400" : "text-gray-300"
          }`}
        />
      )}
      <div className="flex-1">
        <span
          className={`text-sm ${
            done ? "line-through text-gray-400" : "text-gray-800"
          }`}
        >
          {task.text}
        </span>
        {task.urgent && !done && (
          <span className="ml-2 text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-md font-medium">
            Ưu tiên
          </span>
        )}
      </div>
    </li>
  );
}

function StageCard({ stage, isActive, isExpanded, onToggle, index }) {
  const colors = COLOR_MAP[stage.color];
  const Icon = stage.icon;

  return (
    <div className="relative flex gap-4 md:gap-6">
      {/* Timeline line & dot */}
      <div className="flex flex-col items-center">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ring-4 ${colors.ring} z-10 ${
            isActive ? `bg-gradient-to-br ${stage.gradient}` : "bg-white border-2 border-gray-200"
          }`}
        >
          <Icon
            className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-400"}`}
          />
        </div>
        {index < STAGES.length - 1 && (
          <div className={`w-0.5 flex-1 mt-2 ${isActive ? colors.connector : "bg-gray-200"}`} />
        )}
      </div>

      {/* Card */}
      <div className="flex-1 pb-8">
        {/* Stage header */}
        <button
          className={`w-full text-left rounded-2xl border-2 transition-all duration-200 overflow-hidden ${
            isExpanded
              ? `${stage.border} shadow-lg`
              : "border-gray-200 hover:border-gray-300 shadow-sm"
          }`}
          onClick={onToggle}
        >
          <div
            className={`flex items-center justify-between p-4 ${
              isExpanded ? `bg-gradient-to-r ${stage.gradient}` : "bg-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`text-xs font-bold px-2 py-1 rounded-lg ${
                  isExpanded
                    ? "bg-white/20 text-white"
                    : `${stage.badgeBg} ${stage.textColor}`
                }`}
              >
                {stage.sublabel}
              </span>
              <div>
                <h3
                  className={`font-bold ${isExpanded ? "text-white" : "text-gray-900"}`}
                >
                  {stage.label}
                </h3>
                <p
                  className={`text-xs ${isExpanded ? "text-white/80" : "text-gray-500"}`}
                >
                  ⏱ {stage.durationMonths}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isActive && (
                <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full font-medium hidden sm:inline">
                  Giai đoạn hiện tại
                </span>
              )}
              {isExpanded ? (
                <ChevronUp
                  className={`w-5 h-5 ${isExpanded ? "text-white" : "text-gray-400"}`}
                />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </div>
        </button>

        {/* Expanded content */}
        {isExpanded && (
          <div
            className={`mt-2 rounded-2xl border-2 ${stage.border} bg-white overflow-hidden`}
          >
            {/* Description */}
            <div className={`${stage.lightBg} px-5 py-4`}>
              <p className="text-sm text-gray-700">{stage.description}</p>
            </div>

            <div className="p-5 space-y-6">
              {/* Conditions */}
              <div>
                <h4 className="flex items-center gap-2 font-semibold text-gray-800 text-sm mb-3">
                  <CheckCheck className="w-4 h-4 text-emerald-500" />
                  Điều kiện cần đáp ứng
                </h4>
                <ul className="space-y-1.5">
                  {stage.conditions.map((c) => (
                    <li key={c} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tasks */}
              <div>
                <h4 className="flex items-center gap-2 font-semibold text-gray-800 text-sm mb-3">
                  <Target className="w-4 h-4 text-blue-500" />
                  Việc cần làm
                </h4>
                <ul className="space-y-2">
                  {stage.tasks.map((task) => (
                    <TaskItem key={task.text} task={task} stageColor={stage.color} />
                  ))}
                </ul>
              </div>

              {/* Documents */}
              <div>
                <h4 className="flex items-center gap-2 font-semibold text-gray-800 text-sm mb-3">
                  <FileText className="w-4 h-4 text-purple-500" />
                  Hồ sơ cần chuẩn bị
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {stage.documents.map((doc) => (
                    <div
                      key={doc.name}
                      className="flex items-center gap-2.5 bg-gray-50 rounded-xl p-3 border border-gray-200 text-sm"
                    >
                      <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-700 flex-1">{doc.name}</span>
                      {doc.form && (
                        <span className="text-xs bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded font-medium">
                          Form {doc.form}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div>
                <h4 className="flex items-center gap-2 font-semibold text-gray-800 text-sm mb-3">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  Mẹo & Lưu ý quan trọng
                </h4>
                <div className="space-y-2">
                  {stage.tips.map((tip) => (
                    <div
                      key={tip}
                      className="flex items-start gap-2.5 bg-amber-50 rounded-xl p-3 border border-amber-200"
                    >
                      <Star className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-900">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Official forms */}
              {stage.forms.length > 0 && (
                <div>
                  <h4 className="flex items-center gap-2 font-semibold text-gray-800 text-sm mb-3">
                    <BookOpen className="w-4 h-4 text-gray-500" />
                    Biểu mẫu chính thức
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {stage.forms.map((f) => (
                      <a
                        key={f.name}
                        href={f.url}
                        className="inline-flex items-center gap-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        {f.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ReminderBanner() {
  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 flex gap-4">
      <div className="p-2.5 bg-amber-100 rounded-xl flex-shrink-0">
        <Bell className="w-5 h-5 text-amber-600" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-amber-900 mb-1">Nhắc nhở thời gian</h3>
        <p className="text-sm text-amber-800">
          VisaPath AI sẽ tự động gửi thông báo nhắc nhở khi deadline đến gần:
          gia hạn visa, nộp hồ sơ, lịch khám sức khoẻ. Đăng nhập và cập nhật
          ngày visa trong Hồ Sơ để kích hoạt.
        </p>
      </div>
      <div className="flex-shrink-0">
        <a
          href="/profile"
          className="inline-flex items-center gap-1.5 text-sm bg-amber-500 text-white px-3 py-2 rounded-xl hover:bg-amber-600 transition-colors font-medium"
        >
          Cập nhật <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}

function ProgressBar({ completed, total }) {
  const pct = Math.round((completed / total) * 100);
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-emerald-500" />
          <span className="font-semibold text-gray-900">Tiến độ lộ trình</span>
        </div>
        <span className="text-sm font-bold text-emerald-600">{pct}%</span>
      </div>
      <div className="bg-gray-100 rounded-full h-3">
        <div
          className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-3 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-2">
        {completed} / {total} giai đoạn hoàn thành
      </p>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function Roadmap() {
  const [expanded, setExpanded] = useState("student");

  const toggle = (id) => setExpanded((prev) => (prev === id ? null : id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-10 text-center">
          <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <Award className="w-3.5 h-3.5" /> Lộ trình PR cá nhân hoá
          </span>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-3">
            6 Giai Đoạn Đến Thường Trú Nhân Úc
          </h1>
          <p className="text-gray-600">
            Từng bước rõ ràng – hồ sơ cần chuẩn bị – việc cần làm – nhắc nhở deadline.
            Follow đúng lộ trình này để đạt hiệu quả cao nhất.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Progress */}
        <ProgressBar completed={0} total={6} />

        {/* Reminder banner */}
        <ReminderBanner />

        {/* Quick summary */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Calendar, label: "Tổng thời gian", value: "5–10 năm", color: "text-blue-600 bg-blue-50" },
            { icon: FileText, label: "Tổng hồ sơ", value: "20+ tài liệu", color: "text-purple-600 bg-purple-50" },
            { icon: AlertTriangle, label: "Điểm EOI tối thiểu", value: "≥ 65 điểm", color: "text-amber-600 bg-amber-50" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
              <div className={`w-8 h-8 rounded-xl ${color} flex items-center justify-center mx-auto mb-2`}>
                <Icon className="w-4 h-4" />
              </div>
              <p className="text-xs text-gray-500 mb-0.5">{label}</p>
              <p className="font-bold text-gray-900 text-sm">{value}</p>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="space-y-0">
          {STAGES.map((stage, i) => (
            <StageCard
              key={stage.id}
              stage={stage}
              index={i}
              isActive={stage.id === "student"}
              isExpanded={expanded === stage.id}
              onToggle={() => toggle(stage.id)}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-2xl p-6 text-center text-white">
          <h3 className="font-bold text-lg mb-2">
            Muốn có lộ trình cá nhân hoá cho hoàn cảnh của bạn?
          </h3>
          <p className="text-white/80 text-sm mb-4">
            AI sẽ phân tích hồ sơ, điểm EOI và đề xuất lộ trình tối ưu riêng cho bạn.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/chat"
              className="inline-flex items-center justify-center gap-2 bg-white text-emerald-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-emerald-50 transition-colors"
            >
              Hỏi AI tư vấn <ChevronRight className="w-4 h-4" />
            </a>
            <a
              href="/my-plan"
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 text-white font-semibold px-5 py-2.5 rounded-xl border border-white/30 hover:bg-emerald-800 transition-colors"
            >
              Xem MyPlan của tôi <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}