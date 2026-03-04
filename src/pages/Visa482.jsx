import { useState } from "react";
import { CheckCircle, ChevronDown, ChevronUp, ArrowRight, Building2, DollarSign, Briefcase, GraduationCap, AlertCircle, Star, Clock, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import CareerAdvisor from "../components/visa482/CareerAdvisor";

// ─── DATA ────────────────────────────────────────────────────────────────────

const streams = [
  {
    id: "core",
    name: "Core Skills Stream",
    badge: "Phổ biến nhất",
    color: "blue",
    salary: "AUD 76,515+/năm",
    salaryNote: "Phải đạt TSMIT (Temporary Skilled Migration Income Threshold)",
    duration: "Tối đa 4 năm",
    prPathway: "2 năm với cùng sponsor → Visa 186 ENS",
    summary: "Dành cho hầu hết các ngành nghề phổ biến trong danh sách CSOL (Core Skills Occupation List). Đây là con đường phổ biến nhất cho sinh viên Việt tốt nghiệp tại Úc.",
    conditions: [
      "Nghề nghiệp phải có trong Core Skills Occupation List (CSOL)",
      "Lương tối thiểu AUD 76,515/năm (cộng superannuation 11%)",
      "1 năm kinh nghiệm làm việc liên quan đến ngành nghề",
      "IELTS 5.0 tổng thể (mỗi kỹ năng không dưới 4.5) hoặc PTE 36+",
      "Được sponsor bởi doanh nghiệp được phê duyệt Standard Business Sponsor (SBS)",
      "Employer phải có Labour Market Testing (LMT) trước khi đề cử",
      "Phí visa: AUD 3,210",
    ],
  },
  {
    id: "specialist",
    name: "Specialist Skills Stream",
    badge: "Lương cao",
    color: "violet",
    salary: "AUD 141,210+/năm",
    salaryNote: "Không yêu cầu danh sách ngành nghề cụ thể",
    duration: "Tối đa 4 năm",
    prPathway: "3 năm với cùng sponsor → Visa 186 ENS",
    summary: "Không bị giới hạn bởi danh sách CSOL. Dành cho chuyên gia cao cấp như senior engineer, data scientist, senior developer, bác sĩ chuyên khoa, giám đốc điều hành.",
    conditions: [
      "Lương đề cử từ AUD 141,210/năm trở lên",
      "Không cần có trong CSOL – áp dụng cho ANZSCO nhóm 1,2,4,5,6",
      "1 năm kinh nghiệm làm việc liên quan",
      "IELTS 5.0 tổng thể hoặc tương đương",
      "Được sponsor bởi doanh nghiệp được phê duyệt",
      "Phí visa: AUD 3,210",
    ],
  },
  {
    id: "labour",
    name: "Labour Agreement Stream",
    badge: "Đặc biệt",
    color: "amber",
    salary: "Theo Labour Agreement",
    salaryNote: "Thoả thuận riêng giữa chính phủ và employer",
    duration: "Theo điều khoản agreement (tối đa 4 năm)",
    prPathway: "Tùy theo điều khoản Labour Agreement",
    summary: "Dành cho employer đã có Labour Agreement với chính phủ Úc. Thường dùng cho các ngành đặc thù như nông nghiệp vùng sâu, nhà hàng, hoặc ngành thiếu hụt đặc biệt.",
    conditions: [
      "Employer phải có Labour Agreement đang hiệu lực với chính phủ Úc",
      "Lương và điều kiện theo điều khoản trong agreement",
      "Có thể có yêu cầu riêng về kỹ năng và tiếng Anh theo từng agreement",
      "Phí visa: AUD 3,210",
    ],
  },
];

const occupationsByField = [
  {
    field: "Công nghệ thông tin (IT)",
    icon: "💻",
    color: "blue",
    anzscoGroup: "ANZSCO 2613–2619",
    occupations: [
      { name: "Software Engineer / Developer", anzsco: "261313", salary: "90,000–140,000", demand: "Rất cao", stream: "Core/Specialist" },
      { name: "ICT Business Analyst", anzsco: "261111", salary: "85,000–120,000", demand: "Cao", stream: "Core" },
      { name: "Data Scientist / Analyst", anzsco: "224711", salary: "90,000–130,000", demand: "Rất cao", stream: "Core/Specialist" },
      { name: "Cybersecurity Analyst", anzsco: "262112", salary: "90,000–135,000", demand: "Rất cao", stream: "Core/Specialist" },
      { name: "Network Engineer", anzsco: "263112", salary: "80,000–115,000", demand: "Cao", stream: "Core" },
      { name: "Database Administrator", anzsco: "262111", salary: "85,000–120,000", demand: "Cao", stream: "Core" },
      { name: "Cloud Engineer / DevOps", anzsco: "261312", salary: "100,000–150,000", demand: "Rất cao", stream: "Core/Specialist" },
      { name: "UX/UI Designer", anzsco: "232413", salary: "75,000–110,000", demand: "Trung bình", stream: "Core" },
    ],
    assessingBody: "ACS (Australian Computer Society)",
    englishReq: "IELTS 6.0 trung bình (mỗi kỹ năng 5.0+)",
  },
  {
    field: "Kế toán & Tài chính",
    icon: "💼",
    color: "emerald",
    anzscoGroup: "ANZSCO 2211–2212",
    occupations: [
      { name: "Accountant (General)", anzsco: "221111", salary: "65,000–95,000", demand: "Cao", stream: "Core" },
      { name: "Management Accountant", anzsco: "221112", salary: "75,000–105,000", demand: "Cao", stream: "Core" },
      { name: "Tax Accountant", anzsco: "221113", salary: "70,000–100,000", demand: "Cao", stream: "Core" },
      { name: "Auditor", anzsco: "221214", salary: "75,000–110,000", demand: "Cao", stream: "Core" },
      { name: "Financial Analyst", anzsco: "222199", salary: "80,000–120,000", demand: "Cao", stream: "Core" },
      { name: "Financial Advisor", anzsco: "222312", salary: "75,000–115,000", demand: "Trung bình", stream: "Core" },
    ],
    assessingBody: "CPA Australia / CAANZ / IPA",
    englishReq: "IELTS 7.0 (mỗi kỹ năng 6.5+) qua Skills Assessment",
  },
  {
    field: "Kỹ thuật (Engineering)",
    icon: "⚙️",
    color: "amber",
    anzscoGroup: "ANZSCO 2330–2399",
    occupations: [
      { name: "Civil Engineer", anzsco: "233211", salary: "85,000–130,000", demand: "Rất cao", stream: "Core/Specialist" },
      { name: "Structural Engineer", anzsco: "233214", salary: "90,000–130,000", demand: "Rất cao", stream: "Core/Specialist" },
      { name: "Electrical Engineer", anzsco: "233311", salary: "90,000–135,000", demand: "Rất cao", stream: "Core/Specialist" },
      { name: "Mechanical Engineer", anzsco: "233512", salary: "85,000–125,000", demand: "Cao", stream: "Core/Specialist" },
      { name: "Chemical Engineer", anzsco: "233111", salary: "90,000–135,000", demand: "Cao", stream: "Core/Specialist" },
      { name: "Environmental Engineer", anzsco: "233915", salary: "80,000–115,000", demand: "Cao", stream: "Core" },
      { name: "Construction Project Manager", anzsco: "133111", salary: "100,000–145,000", demand: "Rất cao", stream: "Core/Specialist" },
    ],
    assessingBody: "Engineers Australia (EA)",
    englishReq: "IELTS 6.0 (mỗi kỹ năng 6.0) qua EA CDR",
  },
  {
    field: "Y tế & Điều dưỡng",
    icon: "🏥",
    color: "rose",
    anzscoGroup: "ANZSCO 2540–2544",
    occupations: [
      { name: "Registered Nurse", anzsco: "254411", salary: "70,000–95,000", demand: "Rất cao", stream: "Core" },
      { name: "Aged Care Nurse", anzsco: "411411", salary: "65,000–85,000", demand: "Rất cao", stream: "Core" },
      { name: "Mental Health Nurse", anzsco: "254422", salary: "75,000–100,000", demand: "Rất cao", stream: "Core" },
      { name: "Physiotherapist", anzsco: "252511", salary: "75,000–105,000", demand: "Cao", stream: "Core" },
      { name: "Occupational Therapist", anzsco: "252411", salary: "75,000–105,000", demand: "Cao", stream: "Core" },
      { name: "Pharmacist", anzsco: "251511", salary: "80,000–115,000", demand: "Cao", stream: "Core" },
    ],
    assessingBody: "AHPRA / ANMAC",
    englishReq: "IELTS 7.0 (mỗi kỹ năng 7.0) hoặc OET grade B",
  },
  {
    field: "Giáo dục",
    icon: "📚",
    color: "sky",
    anzscoGroup: "ANZSCO 2410–2419",
    occupations: [
      { name: "Secondary School Teacher", anzsco: "241411", salary: "70,000–100,000", demand: "Cao", stream: "Core" },
      { name: "Special Needs Teacher", anzsco: "241511", salary: "72,000–100,000", demand: "Rất cao", stream: "Core" },
      { name: "Early Childhood Teacher", anzsco: "241111", salary: "65,000–85,000", demand: "Rất cao", stream: "Core" },
      { name: "University Lecturer", anzsco: "242111", salary: "90,000–130,000", demand: "Trung bình", stream: "Core/Specialist" },
    ],
    assessingBody: "AITSL",
    englishReq: "IELTS 7.5 (mỗi kỹ năng 7.5) theo bang đăng ký giáo viên",
  },
  {
    field: "Thương mại & Xây dựng",
    icon: "🏗️",
    color: "orange",
    anzscoGroup: "ANZSCO 3210–3299",
    occupations: [
      { name: "Electrician", anzsco: "341111", salary: "80,000–110,000", demand: "Rất cao", stream: "Core" },
      { name: "Plumber", anzsco: "334111", salary: "80,000–110,000", demand: "Rất cao", stream: "Core" },
      { name: "Carpenter / Joiner", anzsco: "331212", salary: "70,000–100,000", demand: "Cao", stream: "Core" },
      { name: "Welder", anzsco: "322313", salary: "70,000–95,000", demand: "Cao", stream: "Core" },
    ],
    assessingBody: "TRA (Trades Recognition Australia)",
    englishReq: "IELTS 5.0 (mỗi kỹ năng 4.5+)",
  },
];

const sponsorRequirements = [
  {
    title: "Điều kiện trở thành Standard Business Sponsor (SBS)",
    icon: Building2,
    color: "blue",
    items: [
      "Đang hoạt động hợp pháp tại Úc và có ABN (Australian Business Number)",
      "Chứng minh có nhu cầu thực sự tuyển dụng vị trí (genuine need)",
      "Không có vi phạm luật lao động hoặc di trú nghiêm trọng",
      "Không nợ thuế hay vi phạm nghĩa vụ tài chính với chính phủ Úc",
      "Phê duyệt SBS có hiệu lực 5 năm, phí AUD 420",
    ],
  },
  {
    title: "Nghĩa vụ của Sponsor sau khi được phê duyệt",
    icon: CheckCircle,
    color: "emerald",
    items: [
      "Trả mức lương thị trường (market salary rate) – không được trả thấp hơn người Úc cùng vị trí",
      "Phải trả lương tối thiểu TSMIT: AUD 76,515/năm (2025)",
      "Đóng Skilling Australians Fund (SAF) Levy: AUD 1,800/năm (doanh nghiệp lớn) hoặc AUD 1,200/năm (SME doanh thu dưới AUD 10 triệu)",
      "Không được buộc nhân viên trả lại chi phí visa hoặc levy",
      "Phải thực hiện Labour Market Testing (LMT) để chứng minh không tìm được người Úc phù hợp",
      "Cung cấp điều kiện làm việc tương đương với nhân viên địa phương",
      "Thông báo cho DOHA nếu người được sponsor nghỉ việc trong 28 ngày",
      "Hỗ trợ chi phí hồi hương nếu người sponsored phải rời Úc",
    ],
  },
  {
    title: "Labour Market Testing (LMT) – Kiểm tra thị trường lao động",
    icon: Briefcase,
    color: "amber",
    items: [
      "Quảng cáo tuyển dụng trong vòng 4 tháng trước khi nộp đơn đề cử",
      "Quảng cáo trên ít nhất 2 nền tảng phù hợp (Seek, LinkedIn, Indeed,…)",
      "Quảng cáo phải chạy ít nhất 4 tuần",
      "Ghi lại lý do tại sao các ứng viên Úc không phù hợp",
      "Không cần LMT nếu: lương trên AUD 141,210, hoặc có nghĩa vụ quốc tế (FTA)",
    ],
  },
  {
    title: "Quy trình Sponsor đề cử (Nomination)",
    icon: ArrowRight,
    color: "rose",
    items: [
      "Bước 1: Employer nộp đơn xin SBS nếu chưa được phê duyệt (xử lý 1–4 tháng)",
      "Bước 2: Employer nộp Nomination – đề cử vị trí và ứng viên cụ thể",
      "Bước 3: Employer trả SAF Levy tại thời điểm nộp Nomination",
      "Bước 4: Sau khi Nomination được chấp thuận, ứng viên nộp đơn Visa 482",
      "Phí Nomination: AUD 330",
      "Thời gian xử lý nomination: 1–3 tháng",
    ],
  },
];

const prPathway = [
  { step: 1, title: "Được sponsor Visa 482", desc: "Employer nộp SBS + Nomination. Bạn nộp đơn Visa 482 (Core Skills Stream).", time: "1–4 tháng" },
  { step: 2, title: "Làm việc 2 năm tại Úc", desc: "Làm việc với sponsor trong ngành nghề được đề cử. Có thể đổi employer (trong cùng ngành) sau thời gian chờ.", time: "24 tháng" },
  { step: 3, title: "Employer đề cử Visa 186 (ENS)", desc: "Sau 2 năm, employer đề cử bạn qua Temporary Residence Transition (TRT) stream của Visa 186.", time: "Sau 24 tháng" },
  { step: 4, title: "Nộp đơn Visa 186 ENS", desc: "Nộp hồ sơ Visa Thường Trú (Employer Nomination Scheme 186). Phí AUD 4,770.", time: "Xử lý 6–18 tháng" },
  { step: 5, title: "Nhận PR", desc: "Được cấp Visa 186 → Thường Trú Nhân tại Úc!", time: "🎉" },
];

const colorMap = {
  blue: { bg: "bg-blue-50", border: "border-blue-200", badge: "bg-blue-100 text-blue-700", icon: "text-blue-600", dot: "bg-blue-500" },
  violet: { bg: "bg-violet-50", border: "border-violet-200", badge: "bg-violet-100 text-violet-700", icon: "text-violet-600", dot: "bg-violet-500" },
  amber: { bg: "bg-amber-50", border: "border-amber-200", badge: "bg-amber-100 text-amber-700", icon: "text-amber-600", dot: "bg-amber-500" },
  emerald: { bg: "bg-emerald-50", border: "border-emerald-200", badge: "bg-emerald-100 text-emerald-700", icon: "text-emerald-600", dot: "bg-emerald-500" },
  rose: { bg: "bg-rose-50", border: "border-rose-200", badge: "bg-rose-100 text-rose-700", icon: "text-rose-600", dot: "bg-rose-500" },
  sky: { bg: "bg-sky-50", border: "border-sky-200", badge: "bg-sky-100 text-sky-700", icon: "text-sky-600", dot: "bg-sky-500" },
  orange: { bg: "bg-orange-50", border: "border-orange-200", badge: "bg-orange-100 text-orange-700", icon: "text-orange-600", dot: "bg-orange-500" },
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
            <span className="flex items-center gap-1 text-gray-600"><DollarSign className="w-4 h-4 text-emerald-500" />{stream.salary}</span>
            <span className="flex items-center gap-1 text-gray-600"><Clock className="w-4 h-4 text-gray-400" />{stream.duration}</span>
          </div>
        </div>
        {open ? <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-5 py-4 bg-white border-t border-gray-100">
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">{stream.summary}</p>
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5 mb-4 text-sm text-emerald-700">
            <span className="font-semibold">🎯 Con đường đến PR:</span> {stream.prPathway}
          </div>
          <h4 className="font-semibold text-[#0a1628] mb-2 text-sm">✅ Điều kiện</h4>
          <div className="space-y-2">
            {stream.conditions.map((c2, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${c.icon}`} />
                <span className="text-gray-700">{c2}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3 italic">* {stream.salaryNote}</p>
        </div>
      )}
    </div>
  );
}

function OccupationTable({ group }) {
  const [open, setOpen] = useState(false);
  const c = colorMap[group.color] || colorMap.blue;
  return (
    <div className={`rounded-2xl border ${c.border} overflow-hidden shadow-sm`}>
      <button className={`w-full px-5 py-4 flex items-center justify-between ${c.bg} text-left`} onClick={() => setOpen(!open)}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{group.icon}</span>
          <div>
            <div className="font-bold text-[#0a1628]">{group.field}</div>
            <div className="text-xs text-gray-500">{group.anzscoGroup} • {group.occupations.length} vị trí phổ biến</div>
          </div>
        </div>
        {open ? <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />}
      </button>
      {open && (
        <div className="p-4 bg-white border-t border-gray-100">
          <div className="flex flex-wrap gap-3 mb-4 text-sm">
            <div className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
              <span className="font-medium text-gray-700">Cơ quan đánh giá kỹ năng:</span> <span className="text-[#0a1628] font-semibold">{group.assessingBody}</span>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
              <span className="font-medium text-gray-700">Yêu cầu tiếng Anh:</span> <span className="text-[#0a1628] font-semibold">{group.englishReq}</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 px-2 text-xs font-semibold text-gray-500 uppercase">Vị trí</th>
                  <th className="text-left py-2 px-2 text-xs font-semibold text-gray-500 uppercase">ANZSCO</th>
                  <th className="text-left py-2 px-2 text-xs font-semibold text-gray-500 uppercase">Lương (AUD/năm)</th>
                  <th className="text-left py-2 px-2 text-xs font-semibold text-gray-500 uppercase">Nhu cầu</th>
                  <th className="text-left py-2 px-2 text-xs font-semibold text-gray-500 uppercase">Stream</th>
                </tr>
              </thead>
              <tbody>
                {group.occupations.map((occ, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2.5 px-2 font-medium text-[#0a1628]">{occ.name}</td>
                    <td className="py-2.5 px-2 text-gray-500 font-mono text-xs">{occ.anzsco}</td>
                    <td className="py-2.5 px-2 text-gray-700">{occ.salary}</td>
                    <td className={`py-2.5 px-2 ${demandColor[occ.demand]}`}>{occ.demand}</td>
                    <td className="py-2.5 px-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${c.badge}`}>{occ.stream}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function SponsorSection({ req }) {
  const Icon = req.icon;
  const c = colorMap[req.color];
  return (
    <div className={`rounded-2xl border ${c.border} p-5 bg-white shadow-sm`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-9 h-9 ${c.bg} rounded-xl flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${c.icon}`} />
        </div>
        <h3 className="font-bold text-[#0a1628] text-sm leading-tight">{req.title}</h3>
      </div>
      <div className="space-y-2">
        {req.items.map((item, i) => (
          <div key={i} className="flex items-start gap-2 text-sm">
            <span className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.dot}`} />
            <span className="text-gray-700">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function Visa482() {
  const [activeTab, setActiveTab] = useState("advisor");

  const tabs = [
    { id: "advisor", label: "🎓 Tư vấn theo ngành học" },
    { id: "streams", label: "3 Luồng Visa" },
    { id: "occupations", label: "Ngành nghề & Lương" },
    { id: "sponsor", label: "Yêu cầu Sponsor" },
    { id: "pr", label: "Lộ trình đến PR" },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-[#0f2347] text-white text-sm font-bold px-3 py-1 rounded-full">Visa 482</span>
            <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-2 py-1 rounded-full">Skills in Demand (SID)</span>
          </div>
          <h1 className="text-3xl font-bold text-[#0a1628] mb-2">Visa 482 – Employer Sponsored</h1>
          <p className="text-gray-500 leading-relaxed">
            Visa tạm trú do employer bảo lãnh – con đường thực tế nhất cho sinh viên Việt tốt nghiệp tại Úc chưa đủ điểm EOI để xin PR trực tiếp. Sau 2 năm làm việc, có thể xin Visa 186 (Permanent Residency).
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
            {[
              { label: "Thời gian lưu trú", value: "Tối đa 4 năm", color: "blue" },
              { label: "Lương tối thiểu (2025)", value: "AUD 76,515", color: "emerald" },
              { label: "Phí visa", value: "AUD 3,210", color: "violet" },
              { label: "Con đường PR", value: "Visa 186 ENS", color: "rose" },
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
            <span className="font-semibold">Lưu ý quan trọng (2025):</span> Visa TSS 482 đã được đổi tên thành <strong>Skills in Demand (SID)</strong> từ tháng 12/2024 với các cải tiến mới: cho phép đổi employer linh hoạt hơn, 180 ngày tìm employer mới nếu mất việc, và tất cả các stream đều có lộ trình đến PR. Mức lương TSMIT tăng lên <strong>AUD 76,515</strong> từ 1/7/2025.
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
        {activeTab === "advisor" && <CareerAdvisor />}

        {activeTab === "streams" && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 mb-2">Visa 482 có 3 luồng. Phần lớn sinh viên Việt tốt nghiệp tại Úc sẽ đi theo <strong>Core Skills Stream</strong>.</p>
            {streams.map(s => <StreamCard key={s.id} stream={s} />)}
          </div>
        )}

        {activeTab === "occupations" && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 mb-2">Danh sách vị trí phổ biến theo ngành học, lương thị trường và mức nhu cầu tại Úc (nguồn: DIBP, SEEK, Labour Market Insights 2025).</p>
            {occupationsByField.map(g => <OccupationTable key={g.field} group={g} />)}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-xs text-gray-500 mt-2">
              * Mức lương là ước tính thị trường, có thể thay đổi theo kinh nghiệm và vị trí địa lý. Kiểm tra danh sách CSOL đầy đủ tại{" "}
              <a href="https://immi.homeaffairs.gov.au/visas/working-in-australia/skill-occupation-list" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline inline-flex items-center gap-1">
                immi.homeaffairs.gov.au <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}

        {activeTab === "sponsor" && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 mb-2">Hiểu rõ yêu cầu và nghĩa vụ của employer giúp bạn chủ động hơn khi thương lượng với nhà tuyển dụng.</p>
            {sponsorRequirements.map((req, i) => <SponsorSection key={i} req={req} />)}
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-rose-700">
                <strong>Bất hợp pháp:</strong> Employer yêu cầu bạn trả lại chi phí visa hoặc SAF Levy là vi phạm pháp luật. Phạt tối đa AUD 63,000 với doanh nghiệp. Báo cáo lên Fair Work Ombudsman nếu gặp trường hợp này.
              </p>
            </div>
          </div>
        )}

        {activeTab === "pr" && (
          <div>
            <p className="text-sm text-gray-500 mb-6">Lộ trình từ Visa 482 (Core Skills) đến Thường Trú Nhân qua Visa 186 ENS – Temporary Residence Transition stream.</p>
            <div className="relative">
              {prPathway.map((step, idx) => (
                <div key={step.step} className="relative flex gap-5 mb-4">
                  {idx < prPathway.length - 1 && (
                    <div className="absolute left-5 top-12 w-0.5 h-[calc(100%+8px)] bg-blue-200" />
                  )}
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow ${idx === prPathway.length - 1 ? "bg-emerald-500 text-white" : "bg-[#0f2347] text-white"}`}>
                      {idx === prPathway.length - 1 ? "✓" : step.step}
                    </div>
                  </div>
                  <div className={`flex-1 rounded-2xl border p-4 shadow-sm ${idx === prPathway.length - 1 ? "bg-emerald-50 border-emerald-200" : "bg-white border-gray-200"}`}>
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
              <div className="font-semibold text-lg mb-3">📊 So sánh: 482 → PR vs. 485 → EOI → PR</div>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="font-bold text-blue-200 mb-2">Con đường 482 → 186</div>
                  <div className="space-y-1 text-blue-100">
                    <div>✓ Không cần điểm EOI cao</div>
                    <div>✓ Chắc chắn hơn (employer đề cử)</div>
                    <div>✓ Lương thị trường đảm bảo</div>
                    <div>✗ Phụ thuộc vào employer</div>
                    <div>✗ Tốn 2–3 năm trước khi xin PR</div>
                  </div>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="font-bold text-blue-200 mb-2">Con đường 485 → EOI → 189/190</div>
                  <div className="space-y-1 text-blue-100">
                    <div>✓ Độc lập, không cần employer</div>
                    <div>✓ Visa 189 cho phép làm bất cứ đâu</div>
                    <div>✗ Cần 65+ điểm EOI</div>
                    <div>✗ Cạnh tranh cao, chờ đợi lâu</div>
                    <div>✗ Không chắc chắn về invite date</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-8 grid md:grid-cols-2 gap-4">
          <Link to={createPageUrl("Chat")} className="bg-[#0f2347] text-white rounded-2xl p-5 hover:bg-[#1a3a6e] transition-colors flex items-start gap-3">
            <Star className="w-6 h-6 text-yellow-300 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold">Hỏi AI về Visa 482</div>
              <div className="text-blue-300 text-sm mt-1">Giải đáp thắc mắc cụ thể về ngành của bạn</div>
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
          Thông tin cập nhật theo dữ liệu DIBP tháng 3/2025. Luôn tham vấn MARA agent trước khi nộp hồ sơ thực tế.
        </p>
      </div>
    </div>
  );
}