import { useState } from "react";
import { CheckCircle, ChevronDown, ChevronUp, AlertCircle, ArrowRight, Star, Clock, DollarSign, ExternalLink, BookOpen, Heart, Users, GraduationCap, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

// ─── DATA ────────────────────────────────────────────────────────────────────

const visaStreams = [
  {
    id: "psw",
    name: "Post-Study Work Stream",
    badge: "Phổ biến nhất",
    color: "blue",
    summary: "Dành cho sinh viên tốt nghiệp Cử nhân, Thạc sĩ, hoặc Tiến sĩ từ các trường đại học Úc. Đây là diện phổ biến nhất cho sinh viên Việt Nam sau khi tốt nghiệp.",
    requirements: [
      "Đã hoàn thành khóa học tối thiểu 2 năm CRICOS tại Úc (Bachelor, Master, hoặc PhD)",
      "Khóa học phải được học bằng tiếng Anh và hoàn thành ít nhất 16 tháng thực tế tại Úc",
      "Đã tốt nghiệp và nhận được bằng chính thức hoặc thư hoàn thành khóa học",
      "Đạt yêu cầu tiếng Anh: IELTS 6.5 (mỗi kỹ năng ≥ 5.5) hoặc PTE 55+ (Nghe 40, Đọc 42, Viết 41, Nói 39)",
      "Đáp ứng yêu cầu sức khỏe và lý lịch tư pháp",
      "Nộp đơn trong vòng 6 tháng kể từ ngày tốt nghiệp",
      "Đã từng giữ Visa 500 (Student Visa)",
    ],
    duration: "2 năm (Bachelor), 3 năm (Master by Coursework), 4 năm (Master by Research/PhD)",
    workRights: "Không giới hạn giờ làm việc – toàn thời gian",
    fee: "AUD 4,600",
    prPathway: "Có thể nộp EOI cho visa 189/190/491 sau khi hoàn thành Skills Assessment",
  },
  {
    id: "gw",
    name: "Graduate Work Stream",
    badge: "Ngành nghề đặc thù",
    color: "emerald",
    summary: "Dành cho sinh viên tốt nghiệp các ngành nghề có trong Skilled Occupation List (SOL). Thường áp dụng cho sinh viên VET hoặc ngành không thuộc university degree.",
    requirements: [
      "Ngành nghề tốt nghiệp phải có trong Skilled Occupation List (SOL)",
      "Đã hoàn thành khóa học tối thiểu 2 năm CRICOS tại Úc",
      "Đã hoàn thành Skills Assessment bởi cơ quan đánh giá liên quan trước khi nộp đơn",
      "Đạt yêu cầu tiếng Anh: IELTS 6.5 (mỗi kỹ năng ≥ 5.5) hoặc PTE 55+ (Nghe 40, Đọc 42, Viết 41, Nói 39)",
      "Nộp đơn trong vòng 6 tháng kể từ ngày tốt nghiệp",
      "Đáp ứng yêu cầu sức khỏe và lý lịch tư pháp",
    ],
    duration: "18 tháng (có thể gia hạn thêm ở regional areas)",
    workRights: "Không giới hạn giờ làm việc – toàn thời gian",
    fee: "AUD 4,600",
    prPathway: "Sau khi hoàn thành Skills Assessment, có thể nộp EOI cho visa 189/190/491",
  },
  {
    id: "ssw",
    name: "Second Post-Study Work Stream",
    badge: "Regional extension",
    color: "amber",
    summary: "Dành cho người đã có visa 485 Post-Study Work và muốn gia hạn thêm bằng cách sống và làm việc tại regional Australia. Áp dụng cho các khu vực Category 2 hoặc 3.",
    requirements: [
      "Đã từng giữ visa 485 Post-Study Work stream",
      "Đã sống và làm việc tại regional Australia (Category 2 hoặc 3) tối thiểu 2 năm",
      "Có thu nhập đạt taxable income threshold (ít nhất AUD 58,710/năm theo ATO)",
      "Chứng minh đã sống tại regional area qua bằng chứng địa chỉ, hóa đơn, hợp đồng lao động",
      "Nộp đơn trước khi visa 485 hiện tại hết hạn",
    ],
    duration: "Thêm 1-2 năm (tùy Category regional area)",
    workRights: "Không giới hạn giờ làm việc – toàn thời gian",
    fee: "AUD 1,810 (phí gia hạn)",
    prPathway: "Tích lũy thêm thời gian và kinh nghiệm để đủ điều kiện PR",
  },
];

const studyFields = [
  {
    field: "Công nghệ thông tin (IT)",
    icon: "💻",
    color: "blue",
    degree: "Bachelor/Master of IT, Data Science, Cyber Security",
    duration: "3-4 năm (Cử nhân), 1.5-2 năm (Thạc sĩ)",
    regionalBonus: "+5 điểm EOI nếu học regional + extension visa 485",
    avgSalary: "AUD 80,000–130,000/năm",
    assessingBody: "ACS (Australian Computer Society)",
    demand: "Rất cao",
    visa485Duration: "2-4 năm tùy bậc học",
    popularJobs: ["Software Engineer", "Data Scientist", "Cybersecurity Analyst", "DevOps Engineer"],
  },
  {
    field: "Kỹ thuật (Engineering)",
    icon: "⚙️",
    color: "amber",
    degree: "Bachelor/Master of Engineering (Civil, Electrical, Mechanical)",
    duration: "4 năm (Cử nhân), 2 năm (Thạc sĩ)",
    regionalBonus: "+5 điểm EOI nếu học regional + extension visa 485",
    avgSalary: "AUD 85,000–135,000/năm",
    assessingBody: "Engineers Australia (EA)",
    demand: "Rất cao",
    visa485Duration: "3-6 năm tùy bậc học",
    popularJobs: ["Civil Engineer", "Electrical Engineer", "Structural Engineer", "Project Manager"],
  },
  {
    field: "Y tế & Điều dưỡng",
    icon: "🏥",
    color: "rose",
    degree: "Bachelor/Master of Nursing, Physiotherapy, Public Health",
    duration: "3 năm (Cử nhân), 2 năm (Thạc sĩ)",
    regionalBonus: "+5 điểm EOI nếu học regional + extension visa 485",
    avgSalary: "AUD 70,000–105,000/năm",
    assessingBody: "AHPRA / ANMAC",
    demand: "Rất cao",
    visa485Duration: "3-6 năm tùy bậc học",
    popularJobs: ["Registered Nurse", "Aged Care Nurse", "Physiotherapist", "Mental Health Nurse"],
  },
  {
    field: "Kế toán & Tài chính",
    icon: "💼",
    color: "emerald",
    degree: "Bachelor/Master of Accounting, Finance, Commerce",
    duration: "3 năm (Cử nhân), 1.5-2 năm (Thạc sĩ)",
    regionalBonus: "+5 điểm EOI nếu học regional + extension visa 485",
    avgSalary: "AUD 65,000–100,000/năm",
    assessingBody: "CPA Australia / CA ANZ / IPA",
    demand: "Cao",
    visa485Duration: "2-3 năm tùy bậc học",
    popularJobs: ["Accountant", "Auditor", "Financial Analyst", "Tax Consultant"],
  },
  {
    field: "Giáo dục (Education)",
    icon: "📚",
    color: "sky",
    degree: "Bachelor/Master of Education, Teaching",
    duration: "4 năm (Cử nhân), 1.5-2 năm (Thạc sĩ)",
    regionalBonus: "+5 điểm EOI nếu học regional + extension visa 485",
    avgSalary: "AUD 70,000–100,000/năm",
    assessingBody: "AITSL",
    demand: "Rất cao",
    visa485Duration: "3-6 năm tùy bậc học",
    popularJobs: ["Secondary Teacher", "Early Childhood Teacher", "Special Needs Teacher"],
  },
  {
    field: "Thương mại & Xây dựng (Trades)",
    icon: "🏗️",
    color: "violet",
    degree: "Certificate III/IV, Diploma in Trades (Electrician, Plumber, Carpenter)",
    duration: "2-4 năm (bao gồm apprenticeship)",
    regionalBonus: "+5 điểm EOI nếu học regional + extension visa 485",
    avgSalary: "AUD 70,000–110,000/năm",
    assessingBody: "TRA (Trades Recognition Australia)",
    demand: "Rất cao",
    visa485Duration: "18 tháng (Graduate Work Stream)",
    popularJobs: ["Electrician", "Plumber", "Carpenter", "Chef"],
  },
];

const prPathwaySteps = [
  { step: 1, title: "Tốt nghiệp tại Úc", desc: "Hoàn thành khóa học tối thiểu 2 năm CRICOS. Nhận bằng chính thức và thư hoàn thành khóa học.", time: "2-4 năm" },
  { step: 2, title: "Xin Visa 485 (Post-Study Work)", desc: "Nộp đơn trong vòng 6 tháng sau tốt nghiệp. Đạt yêu cầu tiếng Anh (IELTS 6.5/PTE 55).", time: "2-4 tháng xử lý" },
  { step: 3, title: "Skills Assessment + Kinh nghiệm", desc: "Hoàn tất đánh giá kỹ năng bởi cơ quan liên quan (ACS/EA/CPA...). Tích lũy kinh nghiệm làm việc tại Úc.", time: "6-12 tháng" },
  { step: 4, title: "Thi tiếng Anh + EOI", desc: "Thi PTE/IELTS đạt điểm cao. Tính điểm EOI và nộp Expression of Interest cho visa 189/190/491.", time: "Sau khi đủ 65+ điểm" },
  { step: 5, title: "Nhận mời & PR 🎉", desc: "Được mời nộp visa và hoàn tất hồ sơ. Nhận visa thường trú!", time: "6-18 tháng sau invite" },
];

const englishRequirements = [
  {
    test: "IELTS Academic/General",
    color: "blue",
    psw: "Tổng 6.5, mỗi kỹ năng ≥ 5.5",
    gw: "Tổng 6.5, mỗi kỹ năng ≥ 5.5",
    validity: "Kết quả có hiệu lực trong 3 năm",
    tips: "Nên thi tại IDP hoặc British Council. Chuẩn bị ít nhất 2-3 tháng trước khi thi.",
  },
  {
    test: "PTE Academic",
    color: "emerald",
    psw: "Tổng 55, Nghe 40, Đọc 42, Viết 41, Nói 39",
    gw: "Tổng 55, Nghe 40, Đọc 42, Viết 41, Nói 39",
    validity: "Kết quả có hiệu lực trong 3 năm",
    tips: "PTE thường được cho là dễ đạt điểm cao hơn IELTS. Có nhiều lịch thi hơn, kết quả nhanh (2-5 ngày). Áp dụng từ 7/8/2025.",
  },
  {
    test: "TOEFL iBT",
    color: "amber",
    psw: "Tổng 81, Nghe 12, Đọc 12, Viết 14, Nói 17",
    gw: "Tổng 81, Nghe 12, Đọc 12, Viết 14, Nói 17",
    validity: "Kết quả có hiệu lực trong 3 năm",
    tips: "Ít phổ biến hơn PTE/IELTS cho visa 485. Áp dụng từ 7/8/2025.",
  },
  {
    test: "OET",
    color: "violet",
    psw: "Tổng 1310, mỗi kỹ năng ≥ 260",
    gw: "Tổng 1310, mỗi kỹ năng ≥ 260",
    validity: "Kết quả có hiệu lực trong 3 năm",
    tips: "Phù hợp cho chuyên gia y tế. Được chấp nhận cho visa 485.",
  },
];

const regionalCategories = [
  {
    category: "Category 2 – Cities and Major Regional Areas",
    color: "amber",
    examples: ["Perth", "Gold Coast", "Sunshine Coast", "Melbourne", "Brisbane", "Adelaide", "Canberra"],
    bonus: "+5 điểm EOI cho regional study",
    extension: "+1 năm visa 485 (Second Post-Study Work stream)",
    desc: "Các thành phố lớn nhưng không phải Sydney/Melbourne/Brisbane (theo định nghĩa mới). Nhiều cơ hội việc làm và chất lượng sống cao.",
  },
  {
    category: "Category 3 – Regional Areas",
    color: "emerald",
    examples: ["Ballarat", "Geelong", "Cairns", "Townsville", "Darwin", "Hobart", "Wollongong"],
    bonus: "+5 điểm EOI cho regional study",
    extension: "+2 năm visa 485 (Second Post-Study Work stream)",
    desc: "Các khu vực nhỏ hơn, ít cạnh tranh hơn. Ưu tiên cho skilled migration và có nhiều bang bảo lãnh hơn.",
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

          {stream.prPathway && (
            <div className="bg-violet-50 border border-violet-200 rounded-xl px-4 py-3 mb-4 text-sm">
              <span className="font-semibold text-violet-700">🎯 Con đường PR:</span>
              <span className="text-violet-600 ml-1">{stream.prPathway}</span>
            </div>
          )}

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
              <span className={`px-2 py-0.5 rounded-full ${c.badge}`}>Lương: {group.avgSalary}</span>
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
              <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Bằng cấp & Khóa học</div>
              <p className="text-sm text-gray-700">{group.degree}</p>
              <div className="mt-2 text-xs font-semibold text-gray-500 uppercase mb-1">Thời gian học</div>
              <p className="text-sm text-gray-700">{group.duration}</p>
              <div className="mt-2 text-xs font-semibold text-gray-500 uppercase mb-1">Visa 485</div>
              <p className="text-sm text-gray-700">{group.visa485Duration}</p>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Cơ quan đánh giá kỹ năng</div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 mb-3">
                <span className="text-[#0a1628] font-semibold">{group.assessingBody}</span>
              </div>
              <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Vị trí phổ biến sau tốt nghiệp</div>
              <ul className="space-y-1">
                {group.popularJobs.map((job, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-start gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                    {job}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 text-sm">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
              <span className="font-medium text-emerald-600">💰 Lương kỳ vọng: </span>
              <span className="text-emerald-700 font-medium">{group.avgSalary}</span>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
              <span className="font-medium text-amber-600">📍 Regional bonus: </span>
              <span className="text-amber-700 font-medium">{group.regionalBonus}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EnglishCard({ req }) {
  const [open, setOpen] = useState(false);
  const c = colorMap[req.color];
  return (
    <div className={`rounded-2xl border ${c.border} overflow-hidden shadow-sm`}>
      <button className={`w-full px-5 py-4 flex items-start justify-between gap-3 ${c.bg} text-left`} onClick={() => setOpen(!open)}>
        <div className="flex-1">
          <div className="font-bold text-[#0a1628] mb-1">{req.test}</div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className={`px-2 py-0.5 rounded-full ${c.badge}`}>PSW/GW: {req.psw}</span>
          </div>
        </div>
        {open ? <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-5 py-4 bg-white border-t border-gray-100 space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm">
              <span className="font-semibold text-blue-700">Post-Study Work:</span>
              <span className="text-blue-600 ml-1">{req.psw}</span>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm">
              <span className="font-semibold text-emerald-700">Graduate Work:</span>
              <span className="text-emerald-600 ml-1">{req.gw}</span>
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm">
            <span className="font-semibold text-gray-600">⏱️ Hiệu lực: </span>
            <span className="text-gray-700">{req.validity}</span>
          </div>
          <div className="bg-violet-50 border border-violet-200 rounded-xl px-4 py-3 text-sm">
            <span className="font-semibold text-violet-700">💡 Mẹo: </span>
            <span className="text-violet-600 ml-1">{req.tips}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function RegionalCard({ cat }) {
  const [open, setOpen] = useState(false);
  const c = colorMap[cat.color];
  return (
    <div className={`rounded-2xl border ${c.border} overflow-hidden shadow-sm`}>
      <button className={`w-full px-5 py-4 flex items-start justify-between gap-3 ${c.bg} text-left`} onClick={() => setOpen(!open)}>
        <div className="flex-1">
          <div className="font-bold text-[#0a1628] mb-2">{cat.category}</div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className={`px-2 py-0.5 rounded-full ${c.badge}`}>{cat.bonus}</span>
            <span className={`px-2 py-0.5 rounded-full ${c.badge}`}>{cat.extension}</span>
          </div>
        </div>
        {open ? <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-5 py-4 bg-white border-t border-gray-100 space-y-3">
          <p className="text-sm text-gray-600">{cat.desc}</p>
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Ví dụ thành phố/khu vực</div>
            <div className="flex flex-wrap gap-2">
              {cat.examples.map((city, i) => (
                <span key={i} className={`text-xs px-3 py-1 rounded-full ${c.badge}`}>{city}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function Visa485() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "📋 Tổng quan" },
    { id: "streams", label: "3 Stream Visa" },
    { id: "fields", label: "🎓 Ngành học" },
    { id: "english", label: "📝 Yêu cầu tiếng Anh" },
    { id: "regional", label: "📍 Regional Bonus" },
    { id: "pathway", label: "Lộ trình đến PR" },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-[#0f2347] text-white text-sm font-bold px-3 py-1 rounded-full">Visa 485</span>
            <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full">Temporary Graduate Visa</span>
          </div>
          <h1 className="text-3xl font-bold text-[#0a1628] mb-2">Visa 485 – Visa Tốt Nghiệp Tạm Trú</h1>
          <p className="text-gray-500 leading-relaxed">
            Visa tạm trú dành cho sinh viên quốc tế đã tốt nghiệp từ các tổ chức giáo dục Úc. Cho phép bạn sống, học và làm việc toàn thời gian tại Úc trong 2-6 năm sau tốt nghiệp – cầu nối quan trọng đến Thường Trú Nhân (PR).
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
            {[
              { label: "Phí visa", value: "AUD 4,600", color: "blue" },
              { label: "Thời hạn visa", value: "2-6 năm", color: "emerald" },
              { label: "Yêu cầu tiếng Anh", value: "IELTS 6.5 / PTE 55", color: "violet" },
              { label: "Quyền làm việc", value: "Toàn thời gian", color: "rose" },
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
            <span className="font-semibold">Cập nhật quan trọng (2025):</span> Phí visa 485 hiện tại là <strong>AUD 4,600</strong>. Yêu cầu tiếng Anh: <strong>IELTS 6.5 (mỗi kỹ năng ≥ 5.5)</strong> hoặc <strong>PTE 55+</strong> (Nghe 40, Đọc 42, Viết 41, Nói 39). Áp dụng từ 7/8/2025. Các khóa học tại Melbourne sẽ không còn được tính là regional từ 2025 – chỉ còn các khu vực Category 2 & 3.
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
              <h2 className="text-lg font-bold text-[#0a1628] mb-4">Visa 485 là gì?</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Visa 485 (Temporary Graduate visa) cho phép sinh viên quốc tế đã tốt nghiệp tại Úc <strong>sống, học tập và làm việc toàn thời gian</strong> trong 2-6 năm tùy stream và bậc học. Đây là bước chuyển tiếp quan trọng từ sinh viên quốc tế sang Thường Trú Nhân.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Visa 485 giúp bạn tích lũy kinh nghiệm làm việc tại Úc, hoàn thành Skills Assessment và nộp EOI cho visa thường trú 189/190/491. Trong thời gian visa 485, bạn có quyền làm việc <strong>không giới hạn giờ</strong>.
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" /> Quyền lợi
                  </div>
                  <ul className="space-y-1.5 text-sm text-blue-600">
                    <li>✓ Làm việc toàn thời gian không giới hạn</li>
                    <li>✓ Theo học thêm khóa học khác</li>
                    <li>✓ Du lịch không giới hạn trong thời gian visa</li>
                    <li>✓ Bảo lãnh người phụ thuộc (vợ/chồng, con dưới 18)</li>
                    <li>✓ Đăng ký Medicare tạm thời</li>
                  </ul>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <div className="font-semibold text-emerald-700 mb-2 flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" /> Con đường đến PR
                  </div>
                  <ul className="space-y-1.5 text-sm text-emerald-600">
                    <li>✓ Tích lũy kinh nghiệm làm việc tại Úc</li>
                    <li>✓ Hoàn thành Skills Assessment</li>
                    <li>✓ Thi tiếng Anh đạt điểm cao (PTE 79+ = 20 điểm EOI)</li>
                    <li>✓ Nộp EOI cho visa 189/190/491</li>
                    <li>✓ Nếu đủ điểm → được mời PR</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h2 className="text-lg font-bold text-[#0a1628] mb-4">Điều kiện tổng quát</h2>
              <div className="space-y-3">
                {[
                  { icon: BookOpen, text: "Đã hoàn thành khóa học tối thiểu 2 năm CRICOS tại Úc" },
                  { icon: GraduationCap, text: "Đã tốt nghiệp và nhận bằng chính thức (hoặc thư hoàn thành khóa học)" },
                  { icon: Heart, text: "Đáp ứng yêu cầu sức khỏe (khám theo panel physician)" },
                  { icon: DollarSign, text: "Chứng minh đủ tài chính để sinh hoạt tại Úc (nếu có người phụ thuộc)" },
                  { icon: Users, text: "Đã từng giữ Visa 500 (Student Visa) và tuân thủ điều kiện visa" },
                  { icon: Star, text: "Đạt yêu cầu tiếng Anh: IELTS 6.5 (mỗi kỹ năng ≥ 5.5) hoặc PTE 55+" },
                  { icon: Clock, text: "Nộp đơn trong vòng 6 tháng sau ngày tốt nghiệp" },
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
            <p className="text-sm text-gray-500 mb-2">Visa 485 có 3 stream. Phần lớn sinh viên tốt nghiệp đại học sẽ theo <strong>Post-Study Work Stream</strong>.</p>
            {visaStreams.map(s => <StreamCard key={s.id} stream={s} />)}
          </div>
        )}

        {activeTab === "fields" && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 mb-2">Top ngành học phổ biến cho visa 485, lương thị trường và cơ hội PR sau tốt nghiệp.</p>
            {studyFields.map(g => <FieldCard key={g.field} group={g} />)}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-xs text-gray-500 mt-2">
              * Mức lương là ước tính thị trường, có thể thay đổi theo kinh nghiệm và vị trí. Thời hạn visa 485 tùy thuộc vào bậc học và stream.{" "}
              Tham khảo{" "}
              <a href="https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/temporary-graduate-485" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline inline-flex items-center gap-1">
                immi.homeaffairs.gov.au <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}

        {activeTab === "english" && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <h3 className="font-bold text-blue-800 mb-1">📝 Yêu cầu tiếng Anh Visa 485 (2025)</h3>
              <p className="text-sm text-blue-700">
                Yêu cầu tiếng Anh hiện tại (từ 7/8/2025): <strong>IELTS 6.5 (mỗi kỹ năng ≥ 5.5)</strong> hoặc <strong>PTE 55</strong> (Nghe 40, Đọc 42, Viết 41, Nói 39).
                Có 4 loại bài thi được chấp nhận. PTE được nhiều sinh viên Việt lựa chọn do dễ đạt điểm cao hơn.
              </p>
            </div>

            {englishRequirements.map((req, i) => <EnglishCard key={i} req={req} />)}

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
              <h3 className="font-bold text-emerald-800 mb-2">💡 Chiến lược thi tiếng Anh cho Visa 485</h3>
              <ul className="space-y-1.5 text-sm text-emerald-700">
                <li>✓ <strong>PTE Academic</strong> là lựa chọn tốt nhất cho sinh viên Việt – format máy chấm, kết quả nhanh, dễ luyện đạt điểm cao</li>
                <li>✓ Nếu target PR, nên thi PTE <strong>79+ mỗi kỹ năng</strong> để đạt 20 điểm EOI (Superior English)</li>
                <li>✓ Chuẩn bị ít nhất <strong>2-3 tháng</strong> luyện thi trước khi đăng ký thi chính thức</li>
                <li>✓ Có thể thi nhiều lần – chỉ cần kết quả tốt nhất khi nộp đơn</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === "regional" && (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <h3 className="font-bold text-amber-800 mb-1">📍 Regional Study – Lợi ích kép cho PR</h3>
              <p className="text-sm text-amber-700">
                Học tại regional areas mang lại <strong>2 lợi ích lớn</strong>: +5 điểm EOI cho regional study và gia hạn thêm 1-2 năm visa 485 qua Second Post-Study Work stream.
              </p>
            </div>

            {regionalCategories.map((cat, i) => <RegionalCard key={i} cat={cat} />)}

            <div className="bg-violet-50 border border-violet-200 rounded-2xl p-4">
              <h3 className="font-bold text-violet-800 mb-2">🎯 Gợi ý chiến lược regional cho sinh viên Việt</h3>
              <ul className="space-y-1.5 text-sm text-violet-700">
                <li>✓ <strong>Adelaide (Category 2):</strong> Chất lượng sống cao, nhiều trường top, cơ hội việc làm trong kỹ thuật và IT</li>
                <li>✓ <strong>Perth (Category 2):</strong> Tây Úc – khai khoáng và engineering mạnh, lương cao, cuộc sống dễ chịu</li>
                <li>✓ <strong>Gold Coast / Sunshine Coast (Category 2):</strong> Khí hậu đẹp, trường tốt, nhiều cơ hội hospitality và health</li>
                <li>✓ <strong>Hobart / Darwin (Category 3):</strong> Extension 2 năm visa 485, ưu tiên bang bảo lãnh, ít cạnh tranh hơn</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <h3 className="font-bold text-blue-800 mb-2">📊 So sánh: Sydney/Melbourne vs Regional</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-2 text-xs font-semibold text-gray-500 uppercase">Tiêu chí</th>
                      <th className="text-left py-2 px-2 text-xs font-semibold text-gray-500 uppercase">Sydney/Melbourne</th>
                      <th className="text-left py-2 px-2 text-xs font-semibold text-gray-500 uppercase">Regional Area</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-50">
                      <td className="py-2.5 px-2 font-medium text-[#0a1628]">Điểm EOI regional</td>
                      <td className="py-2.5 px-2 text-gray-600">✗ 0 điểm</td>
                      <td className="py-2.5 px-2 text-emerald-600 font-medium">✓ +5 điểm</td>
                    </tr>
                    <tr className="border-b border-gray-50">
                      <td className="py-2.5 px-2 font-medium text-[#0a1628]">Extension visa 485</td>
                      <td className="py-2.5 px-2 text-gray-600">✗ Không</td>
                      <td className="py-2.5 px-2 text-emerald-600 font-medium">✓ +1-2 năm</td>
                    </tr>
                    <tr className="border-b border-gray-50">
                      <td className="py-2.5 px-2 font-medium text-[#0a1628]">Cơ hội bang bảo lãnh (190/491)</td>
                      <td className="py-2.5 px-2 text-gray-600">✗ Hạn chế</td>
                      <td className="py-2.5 px-2 text-emerald-600 font-medium">✓ Ưu tiên</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-2 font-medium text-[#0a1628]">Chi phí sinh hoạt</td>
                      <td className="py-2.5 px-2 text-gray-600">Cao hơn</td>
                      <td className="py-2.5 px-2 text-emerald-600 font-medium">Thấp hơn 10-20%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "pathway" && (
          <div>
            <p className="text-sm text-gray-500 mb-6">Lộ trình từ Visa 485 (Post-Study Work) đến Thường Trú Nhân qua EOI system.</p>
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
              <div className="font-semibold text-lg mb-3">📊 Điểm EOI – Cách tối đa hóa cơ hội mời</div>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="font-bold text-blue-200 mb-2">Điểm EOI cơ bản</div>
                  <div className="space-y-1.5 text-blue-100">
                    <div>• Tuổi 25-32: <strong>30 điểm</strong></div>
                    <div>• Bằng Cử nhân/Thạc sĩ: <strong>15 điểm</strong></div>
                    <div>• Kinh nghiệm Úc 1-3 năm: <strong>5-10 điểm</strong></div>
                    <div>• IELTS 7.0/PTE 65: <strong>10 điểm</strong></div>
                    <div>• Regional study: <strong>5 điểm</strong></div>
                    <div className="pt-1 border-t border-white/20">Tổng cơ bản: <strong>65-75 điểm</strong></div>
                  </div>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="font-bold text-emerald-200 mb-2">Tối đa hóa điểm</div>
                  <div className="space-y-1.5 text-emerald-100">
                    <div>• PTE 79+ mỗi kỹ năng: <strong>+20 điểm</strong></div>
                    <div>• Kinh nghiệm Úc 5-8 năm: <strong>+15 điểm</strong></div>
                    <div>• Bang bảo lãnh (190): <strong>+5 điểm</strong></div>
                    <div>• Học vùng xa (regional): <strong>+5 điểm</strong></div>
                    <div>• NAATI (dịch thuật): <strong>+5 điểm</strong></div>
                    <div className="pt-1 border-t border-white/20">Tổng tối ưu: <strong>90-100+ điểm</strong></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 bg-white border border-gray-200 rounded-2xl p-5">
              <h3 className="font-bold text-[#0a1628] mb-3">So sánh: Visa 485 vs Visa 482 – Con đường nào tốt hơn?</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-2 text-xs font-semibold text-gray-500 uppercase">Tiêu chí</th>
                      <th className="text-left py-2 px-2 text-xs font-semibold text-gray-500 uppercase">Visa 485</th>
                      <th className="text-left py-2 px-2 text-xs font-semibold text-gray-500 uppercase">Visa 482</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-50">
                      <td className="py-2.5 px-2 font-medium text-[#0a1628]">Điều kiện</td>
                      <td className="py-2.5 px-2 text-gray-600">Tốt nghiệp tại Úc</td>
                      <td className="py-2.5 px-2 text-gray-600">Employer sponsor</td>
                    </tr>
                    <tr className="border-b border-gray-50">
                      <td className="py-2.5 px-2 font-medium text-[#0a1628]">Độc lập</td>
                      <td className="py-2.5 px-2 text-emerald-600 font-medium">✓ Không cần employer</td>
                      <td className="py-2.5 px-2 text-gray-600">✗ Phụ thuộc employer</td>
                    </tr>
                    <tr className="border-b border-gray-50">
                      <td className="py-2.5 px-2 font-medium text-[#0a1628]">Quyền làm việc</td>
                      <td className="py-2.5 px-2 text-gray-600">Không giới hạn</td>
                      <td className="py-2.5 px-2 text-gray-600">Chỉ cho sponsor</td>
                    </tr>
                    <tr className="border-b border-gray-50">
                      <td className="py-2.5 px-2 font-medium text-[#0a1628]">Con đường PR</td>
                      <td className="py-2.5 px-2 text-gray-600">EOI 189/190/491 (cạnh tranh)</td>
                      <td className="py-2.5 px-2 text-gray-600">Visa 186 ENS (chắc chắn hơn)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-2 font-medium text-[#0a1628]">Lương tối thiểu</td>
                      <td className="py-2.5 px-2 text-gray-600">Không yêu cầu</td>
                      <td className="py-2.5 px-2 text-gray-600">TSMIT AUD 76,515+/năm</td>
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
              <div className="font-semibold">Hỏi AI về Visa 485</div>
              <div className="text-blue-300 text-sm mt-1">Giải đáp thắc mắc về ngành và stream phù hợp</div>
            </div>
          </Link>
          <Link to={createPageUrl("EOICalculator")} className="bg-white border border-gray-200 text-[#0a1628] rounded-2xl p-5 hover:shadow-md transition-all flex items-start gap-3">
            <MapPin className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold">Tính điểm EOI</div>
              <div className="text-gray-500 text-sm mt-1">Kiểm tra xem bạn đủ bao nhiêu điểm PR</div>
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