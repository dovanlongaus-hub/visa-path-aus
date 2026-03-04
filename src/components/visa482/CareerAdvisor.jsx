import { useState } from "react";
import { CheckCircle, AlertCircle, ExternalLink, ChevronDown, ChevronUp, GraduationCap, Briefcase, DollarSign, Star } from "lucide-react";

// ─── DATA: Ngành học → Vị trí phù hợp (chỉ các vị trí APPROVED trên CSOL/186 TRT) ─────

const TSMIT_2025 = 76515;
const TSMIT_2026 = 79499; // từ 1/7/2026
const SSIT_2025 = 141210;
const SSIT_2026 = 146717;

// Visa eligibility flags: csol = có trong CSOL (482 Core), trt186 = eligible TRT Visa 186, v190 = có trong 190/491 SOL
const studyFields = [
  {
    id: "it_software",
    label: "Công nghệ thông tin – Lập trình / Phần mềm",
    keywords: ["IT", "computer science", "software engineering", "information technology", "computing", "lập trình", "phần mềm"],
    color: "blue",
    occupations: [
      {
        title: "Software Engineer (Programmer)",
        anzsco: "261313",
        csol: true, trt186: true, v190: true, v491: true,
        tsmit: TSMIT_2025,
        marketSalary: "90,000–130,000",
        englishReq: "IELTS 6.0 (mỗi kỹ năng 5.0+) cho 482; IELTS 6.0 cho 186 TRT",
        skillsAssess: "ACS – Australian Computer Society",
        notes: "Một trong những vị trí IT được cấp visa nhiều nhất. Phải nộp ACS Skills Assessment trước khi xin visa.",
        visaEligible: ["482 Core (CSOL)", "482 Specialist (lương ≥$141,210)", "186 TRT", "190/491"],
      },
      {
        title: "ICT Business Analyst",
        anzsco: "261111",
        csol: true, trt186: true, v190: true, v491: true,
        tsmit: TSMIT_2025,
        marketSalary: "85,000–120,000",
        englishReq: "IELTS 6.0 (mỗi kỹ năng 5.0+)",
        skillsAssess: "ACS – Australian Computer Society",
        notes: "Lưu ý: Vị trí Business Analyst KHÔNG IT (ANZSCO 224711) cần Skills Assessment qua VETASSESS, không phải ACS.",
        visaEligible: ["482 Core (CSOL)", "186 TRT", "190/491"],
      },
      {
        title: "ICT Applications Developer / Programmer",
        anzsco: "261312",
        csol: true, trt186: true, v190: true, v491: true,
        tsmit: TSMIT_2025,
        marketSalary: "88,000–125,000",
        englishReq: "IELTS 6.0 (mỗi kỹ năng 5.0+)",
        skillsAssess: "ACS – Australian Computer Society",
        notes: "Bao gồm mobile app developer, web application developer. ANZSCO 261312 được CSOL chấp thuận đầy đủ.",
        visaEligible: ["482 Core (CSOL)", "482 Specialist (lương ≥$141,210)", "186 TRT", "190/491"],
      },
      {
        title: "Data Scientist / Machine Learning Engineer",
        anzsco: "262114",
        csol: true, trt186: true, v190: true, v491: true,
        tsmit: TSMIT_2025,
        marketSalary: "95,000–140,000",
        englishReq: "IELTS 6.0 (mỗi kỹ năng 5.0+)",
        skillsAssess: "ACS – Australian Computer Society",
        notes: "Nhu cầu rất cao, đặc biệt trong fintech, healthcare AI. Thường lương trên TSMIT dễ dàng.",
        visaEligible: ["482 Core (CSOL)", "482 Specialist (lương ≥$141,210)", "186 TRT", "190/491"],
      },
      {
        title: "Cybersecurity Analyst",
        anzsco: "262112",
        csol: true, trt186: true, v190: true, v491: true,
        tsmit: TSMIT_2025,
        marketSalary: "90,000–135,000",
        englishReq: "IELTS 6.0 (mỗi kỹ năng 5.0+)",
        skillsAssess: "ACS – Australian Computer Society",
        notes: "Thiếu hụt nhân lực nghiêm trọng tại Úc. Ưu tiên cao trong 190/491.",
        visaEligible: ["482 Core (CSOL)", "482 Specialist (lương ≥$141,210)", "186 TRT", "190/491"],
      },
      {
        title: "Network Engineer",
        anzsco: "263112",
        csol: true, trt186: true, v190: true, v491: true,
        tsmit: TSMIT_2025,
        marketSalary: "80,000–115,000",
        englishReq: "IELTS 6.0 (mỗi kỹ năng 5.0+)",
        skillsAssess: "ACS – Australian Computer Society",
        notes: "Bao gồm cloud networking, DevOps. Phổ biến ở các công ty telecom và cloud providers.",
        visaEligible: ["482 Core (CSOL)", "186 TRT", "190/491"],
      },
      {
        title: "Database Administrator",
        anzsco: "262111",
        csol: true, trt186: true, v190: true, v491: true,
        tsmit: TSMIT_2025,
        marketSalary: "85,000–120,000",
        englishReq: "IELTS 6.0 (mỗi kỹ năng 5.0+)",
        skillsAssess: "ACS – Australian Computer Society",
        notes: "DBA, data engineer, ETL developer đều thuộc nhóm này.",
        visaEligible: ["482 Core (CSOL)", "186 TRT", "190/491"],
      },
    ],
  },
  {
    id: "it_network",
    label: "Công nghệ thông tin – Network / Systems",
    keywords: ["networking", "network", "systems", "telecommunications", "hệ thống mạng"],
    color: "sky",
    occupations: [
      {
        title: "ICT Systems Administrator",
        anzsco: "262113",
        csol: true, trt186: true, v190: true, v491: true,
        tsmit: TSMIT_2025,
        marketSalary: "78,000–110,000",
        englishReq: "IELTS 6.0 (mỗi kỹ năng 5.0+)",
        skillsAssess: "ACS – Australian Computer Society",
        notes: "Sysadmin, Linux admin, Windows admin đều phù hợp.",
        visaEligible: ["482 Core (CSOL)", "186 TRT", "190/491"],
      },
      {
        title: "Network Engineer",
        anzsco: "263112",
        csol: true, trt186: true, v190: true, v491: true,
        tsmit: TSMIT_2025,
        marketSalary: "80,000–115,000",
        englishReq: "IELTS 6.0 (mỗi kỹ năng 5.0+)",
        skillsAssess: "ACS – Australian Computer Society",
        notes: "Cloud networking (AWS, Azure) được đánh giá cao.",
        visaEligible: ["482 Core (CSOL)", "186 TRT", "190/491"],
      },
    ],
  },
  {
    id: "accounting",
    label: "Kế toán / Tài chính / Kiểm toán",
    keywords: ["accounting", "finance", "kế toán", "tài chính", "kiểm toán", "commerce", "business", "thương mại"],
    color: "emerald",
    occupations: [
      {
        title: "Accountant (General)",
        anzsco: "221111",
        csol: true, trt186: true, v190: true, v491: true,
        tsmit: TSMIT_2025,
        marketSalary: "68,000–95,000",
        englishReq: "IELTS 7.0 (mỗi kỹ năng 6.5+) qua Skills Assessment",
        skillsAssess: "CPA Australia / CAANZ / IPA",
        notes: "⚠️ Lương thị trường đầu nghề (~$68K) gần sát TSMIT. Phải đảm bảo lương offer ≥ AUD 76,515. Skills assessment bắt buộc qua CPA/CAANZ.",
        visaEligible: ["482 Core (CSOL)", "186 TRT", "190/491"],
      },
      {
        title: "Management Accountant",
        anzsco: "221112",
        csol: true, trt186: true, v190: true, v491: true,
        tsmit: TSMIT_2025,
        marketSalary: "80,000–110,000",
        englishReq: "IELTS 7.0 (mỗi kỹ năng 6.5+)",
        skillsAssess: "CPA Australia / CAANZ / IPA",
        notes: "Vị trí cấp cao hơn Accountant General, lương thường đạt TSMIT dễ dàng hơn.",
        visaEligible: ["482 Core (CSOL)", "186 TRT", "190/491"],
      },
      {
        title: "Tax Accountant",
        anzsco: "221113",
        csol: true, trt186: true, v190: true, v491: true,
        tsmit: TSMIT_2025,
        marketSalary: "75,000–105,000",
        englishReq: "IELTS 7.0 (mỗi kỹ năng 6.5+)",
        skillsAssess: "CPA Australia / CAANZ / IPA",
        notes: "Phổ biến ở các accounting firm nhỏ và Big 4. Cần CA/CPA qualification để thăng tiến.",
        visaEligible: ["482 Core (CSOL)", "186 TRT", "190/491"],
      },
      {
        title: "Auditor",
        anzsco: "221214",
        csol: true, trt186: true, v190: true, v491: true,
        tsmit: TSMIT_2025,
        marketSalary: "80,000–115,000",
        englishReq: "IELTS 7.0 (mỗi kỹ năng 6.5+)",
        skillsAssess: "CPA Australia / CAANZ",
        notes: "External và internal auditor đều thuộc nhóm này.",
        visaEligible: ["482 Core (CSOL)", "186 TRT", "190/491"],
      },
      {
        title: "Financial Analyst",
        anzsco: "222199",
        csol: true, trt186: true, v190: true, v491: false,
        tsmit: TSMIT_2025,
        marketSalary: "85,000–125,000",
        englishReq: "IELTS 7.0 (mỗi kỹ năng 6.5+)",
        skillsAssess: "VETASSESS",
        notes: "Bao gồm investment analyst, equity analyst, credit analyst.",
        visaEligible: ["482 Core (CSOL)", "186 TRT"],
      },
    ],
  },
  {
    id: "engineering_civil",
    label: "Kỹ thuật Xây dựng / Dân dụng (Civil Engineering)",
    keywords: ["civil engineering", "structural engineering", "kỹ thuật xây dựng", "xây dựng", "construction"],
    color: "amber",
    occupations: [
      {
        title: "Civil Engineer",
        anzsco: "233211",
        csol: true, trt186: true, v190: true, v491: true,
        tsmit: TSMIT_2025,
        marketSalary: "90,000–135,000",
        englishReq: "IELTS 6.0 (mỗi kỹ năng 6.0+) qua EA CDR",
        skillsAssess: "Engineers Australia (EA) – CDR required",
        notes: "Thiếu hụt nghiêm trọng tại Úc. CDR (Competency Demonstration Report) là tài liệu quan trọng nhất khi nộp ACS.",
        visaEligible: ["482 Core (CSOL)", "482 Specialist (lương ≥$141,210)", "186 TRT", "190/491"],
      },
      {
        title: "Structural Engineer",
        anzsco: "233214",
        csol: true, trt186: true, v190: true, v491: true,
        tsmit: TSMIT_2025,
        marketSalary: "92,000–135,000",
        englishReq: "IELTS 6.0 (mỗi kỹ năng 6.0+) qua EA CDR",
        skillsAssess: "Engineers Australia (EA)",
        notes: "Rất cần ở các bang có dự án hạ tầng lớn: NSW, VIC, QLD.",
        visaEligible: ["482 Core (CSOL)", "482 Specialist", "186 TRT", "190/491"],
      },
      {
        title: "Construction Project Manager",
        anzsco: "133111",
        csol: true, trt186: true, v190: true, v491: true,
        tsmit: TSMIT_2025,
        marketSalary: "100,000–150,000",
        englishReq: "IELTS 6.0 (mỗi kỹ năng 6.0+)",
        skillsAssess: "Engineers Australia hoặc AIPM",
        notes: "Cần ít nhất 3–5 năm kinh nghiệm quản lý dự án. Lương thường dễ đạt Specialist Stream.",
        visaEligible: ["482 Core (CSOL)", "482 Specialist", "186 TRT", "190/491"],
      },
    ],
  },
  {
    id: "engineering_electrical",
    label: "Kỹ thuật Điện / Điện tử",
    keywords: ["electrical engineering", "electronics", "kỹ thuật điện", "điện tử", "mechatronics"],
    color: "yellow",
    occupations: [
      {
        title: "Electrical Engineer",
        anzsco: "233311",
        csol: true, trt186: true, v190: true, v491: true,
        tsmit: TSMIT_2025,
        marketSalary: "90,000–140,000",
        englishReq: "IELTS 6.0 (mỗi kỹ năng 6.0+) qua EA CDR",
        skillsAssess: "Engineers Australia (EA)",
        notes: "Cực kỳ thiếu hụt. Ưu tiên cao nhất trong 190/491 ở SA, WA, QLD.",
        visaEligible: ["482 Core (CSOL)", "482 Specialist", "186 TRT", "190/491"],
      },
      {
        title: "Electronics Engineer",
        anzsco: "233411",
        csol: true, trt186: true, v190: true, v491: true,
        tsmit: TSMIT_2025,
        marketSalary: "85,000–125,000",
        englishReq: "IELTS 6.0 (mỗi kỹ năng 6.0+) qua EA CDR",
        skillsAssess: "Engineers Australia (EA)",
        notes: "Bao gồm embedded systems, hardware engineer.",
        visaEligible: ["482 Core (CSOL)", "186 TRT", "190/491"],
      },
    ],
  },
  {
    id: "engineering_mech",
    label: "Kỹ thuật Cơ khí / Chế tạo",
    keywords: ["mechanical engineering", "manufacturing", "kỹ thuật cơ khí", "cơ khí"],
    color: "orange",
    occupations: [
      {
        title: "Mechanical Engineer",
        anzsco: "233512",
        csol: true, trt186: true, v190: true, v491: true,
        tsmit: TSMIT_2025,
        marketSalary: "85,000–130,000",
        englishReq: "IELTS 6.0 (mỗi kỹ năng 6.0+) qua EA CDR",
        skillsAssess: "Engineers Australia (EA)",
        notes: "Manufacturing, automotive, mining sectors đều tuyển dụng nhiều.",
        visaEligible: ["482 Core (CSOL)", "482 Specialist", "186 TRT", "190/491"],
      },
    ],
  },
  {
    id: "nursing",
    label: "Điều dưỡng / Y tế",
    keywords: ["nursing", "midwifery", "healthcare", "điều dưỡng", "y tế", "hộ sinh"],
    color: "rose",
    occupations: [
      {
        title: "Registered Nurse (General)",
        anzsco: "254411",
        csol: true, trt186: true, v190: true, v491: true,
        tsmit: TSMIT_2025,
        marketSalary: "72,000–98,000",
        englishReq: "IELTS 7.0 (mỗi kỹ năng 7.0+) hoặc OET grade B",
        skillsAssess: "ANMAC (Australian Nursing & Midwifery Accreditation Council)",
        notes: "⚠️ Lương khởi điểm (~$72K) gần TSMIT. Cần thương lượng đạt ≥$76,515. AHPRA registration bắt buộc.",
        visaEligible: ["482 Core (CSOL)", "186 TRT", "190/491"],
      },
      {
        title: "Mental Health Nurse",
        anzsco: "254422",
        csol: true, trt186: true, v190: true, v491: true,
        tsmit: TSMIT_2025,
        marketSalary: "78,000–105,000",
        englishReq: "IELTS 7.0 (mỗi kỹ năng 7.0+) hoặc OET grade B",
        skillsAssess: "ANMAC",
        notes: "Nhu cầu rất cao sau COVID. Ưu tiên ở QLD, SA, WA.",
        visaEligible: ["482 Core (CSOL)", "186 TRT", "190/491"],
      },
    ],
  },
  {
    id: "education",
    label: "Giáo dục / Sư phạm",
    keywords: ["education", "teaching", "giáo dục", "sư phạm", "teacher"],
    color: "sky",
    occupations: [
      {
        title: "Secondary School Teacher",
        anzsco: "241411",
        csol: true, trt186: true, v190: true, v491: true,
        tsmit: TSMIT_2025,
        marketSalary: "72,000–100,000",
        englishReq: "IELTS 7.5 (mỗi kỹ năng 7.5+)",
        skillsAssess: "AITSL (Australian Institute for Teaching and School Leadership)",
        notes: "Cần đăng ký Teaching Registration tại bang làm việc. Môn STEM (toán, khoa học) ưu tiên cao nhất.",
        visaEligible: ["482 Core (CSOL)", "186 TRT", "190/491"],
      },
      {
        title: "Early Childhood Teacher",
        anzsco: "241111",
        csol: true, trt186: true, v190: true, v491: true,
        tsmit: TSMIT_2025,
        marketSalary: "65,000–85,000",
        englishReq: "IELTS 7.5 (mỗi kỹ năng 7.5+)",
        skillsAssess: "AITSL",
        notes: "⚠️ Lương thấp hơn nhiều ngành khác, có thể gần hoặc dưới TSMIT $76,515 ở một số trường. Cần kiểm tra kỹ khi nhận offer.",
        visaEligible: ["482 Core (CSOL)", "186 TRT", "190/491"],
      },
    ],
  },
  {
    id: "data_analytics",
    label: "Data Analytics / Business Intelligence",
    keywords: ["data analytics", "business intelligence", "data science", "statistics", "phân tích dữ liệu"],
    color: "violet",
    occupations: [
      {
        title: "ICT Business Analyst",
        anzsco: "261111",
        csol: true, trt186: true, v190: true, v491: true,
        tsmit: TSMIT_2025,
        marketSalary: "85,000–120,000",
        englishReq: "IELTS 6.0 (mỗi kỹ năng 5.0+)",
        skillsAssess: "ACS – Australian Computer Society",
        notes: "BA có background data/analytics – nộp qua ACS.",
        visaEligible: ["482 Core (CSOL)", "186 TRT", "190/491"],
      },
      {
        title: "Data Scientist",
        anzsco: "262114",
        csol: true, trt186: true, v190: true, v491: true,
        tsmit: TSMIT_2025,
        marketSalary: "95,000–140,000",
        englishReq: "IELTS 6.0 (mỗi kỹ năng 5.0+)",
        skillsAssess: "ACS – Australian Computer Society",
        notes: "Một trong những ngành hot nhất hiện tại. Skills assessment qua ACS.",
        visaEligible: ["482 Core (CSOL)", "482 Specialist", "186 TRT", "190/491"],
      },
    ],
  },
];

const colorMap = {
  blue: { bg: "bg-blue-50", border: "border-blue-200", badge: "bg-blue-100 text-blue-700", icon: "text-blue-600", dot: "bg-blue-500" },
  emerald: { bg: "bg-emerald-50", border: "border-emerald-200", badge: "bg-emerald-100 text-emerald-700", icon: "text-emerald-600", dot: "bg-emerald-500" },
  amber: { bg: "bg-amber-50", border: "border-amber-200", badge: "bg-amber-100 text-amber-700", icon: "text-amber-600", dot: "bg-amber-500" },
  rose: { bg: "bg-rose-50", border: "border-rose-200", badge: "bg-rose-100 text-rose-700", icon: "text-rose-600", dot: "bg-rose-500" },
  sky: { bg: "bg-sky-50", border: "border-sky-200", badge: "bg-sky-100 text-sky-700", icon: "text-sky-600", dot: "bg-sky-500" },
  violet: { bg: "bg-violet-50", border: "border-violet-200", badge: "bg-violet-100 text-violet-700", icon: "text-violet-600", dot: "bg-violet-500" },
  orange: { bg: "bg-orange-50", border: "border-orange-200", badge: "bg-orange-100 text-orange-700", icon: "text-orange-600", dot: "bg-orange-500" },
  yellow: { bg: "bg-yellow-50", border: "border-yellow-200", badge: "bg-yellow-100 text-yellow-700", icon: "text-yellow-600", dot: "bg-yellow-500" },
};

function VisaBadge({ label, approved }) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${approved ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-400 line-through"}`}>
      {approved ? "✓" : "✗"} {label}
    </span>
  );
}

function OccupationCard({ occ, color }) {
  const [open, setOpen] = useState(false);
  const c = colorMap[color] || colorMap.blue;
  const isSalaryRisk = parseInt(occ.marketSalary.split("–")[0].replace(",", "")) < TSMIT_2025;

  return (
    <div className={`rounded-xl border ${open ? c.border : "border-gray-200"} bg-white shadow-sm overflow-hidden`}>
      <button className="w-full px-4 py-3.5 flex items-start justify-between gap-3 text-left" onClick={() => setOpen(!open)}>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-semibold text-[#0a1628] text-sm">{occ.title}</span>
            {isSalaryRisk && (
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">⚠️ Lương sát TSMIT</span>
            )}
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-gray-500">
            <span className="font-mono">ANZSCO {occ.anzsco}</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-700 font-medium">
              <DollarSign className="w-3 h-3" />AUD {occ.marketSalary}/năm
            </span>
          </div>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />}
      </button>

      {open && (
        <div className={`px-4 pb-4 border-t ${c.border} ${c.bg}`}>
          {/* TSMIT box */}
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
            <div className="bg-white rounded-xl border border-emerald-200 p-3">
              <div className="text-xs text-gray-500 mb-0.5">TSMIT tối thiểu (Visa 482 – 2025)</div>
              <div className="font-bold text-emerald-700 text-base">AUD {TSMIT_2025.toLocaleString()}/năm</div>
              <div className="text-xs text-gray-400">+ Super 11% = AUD {Math.round(TSMIT_2025 * 1.11).toLocaleString()}</div>
            </div>
            <div className="bg-white rounded-xl border border-blue-200 p-3">
              <div className="text-xs text-gray-500 mb-0.5">TSMIT từ 1/7/2026</div>
              <div className="font-bold text-blue-700 text-base">AUD {TSMIT_2026.toLocaleString()}/năm</div>
              <div className="text-xs text-gray-400">+ Super = AUD {Math.round(TSMIT_2026 * 1.11).toLocaleString()}</div>
            </div>
          </div>

          {/* Visa eligibility */}
          <div className="mb-3">
            <div className="text-xs font-semibold text-gray-500 uppercase mb-1.5">Visa được phê duyệt bởi DIBP</div>
            <div className="flex flex-wrap gap-1.5">
              {["482 Core (CSOL)", "482 Specialist", "186 TRT", "190/491"].map(v => (
                <VisaBadge key={v} label={v} approved={occ.visaEligible.includes(v)} />
              ))}
            </div>
          </div>

          {/* TRT 186 detail */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-3 text-xs text-blue-800">
            <span className="font-semibold">186 TRT:</span> Làm việc <strong>2 năm</strong> với cùng employer trên Visa 482 → Employer đề cử Visa 186 ENS (TRT stream) → PR. Cùng ANZSCO occupation. Phí 186: AUD 4,770.
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${c.icon}`} />
              <span><span className="font-medium text-gray-700">Cơ quan đánh giá:</span> <span className="text-[#0a1628]">{occ.skillsAssess}</span></span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${c.icon}`} />
              <span><span className="font-medium text-gray-700">Yêu cầu tiếng Anh:</span> <span className="text-[#0a1628]">{occ.englishReq}</span></span>
            </div>
            {occ.notes && (
              <div className="bg-white/80 rounded-xl p-3 border border-amber-200 mt-2">
                <p className="text-xs text-amber-800"><span className="font-semibold">💡 Lưu ý:</span> {occ.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CareerAdvisor() {
  const [course, setCourse] = useState("");
  const [university, setUniversity] = useState("");
  const [results, setResults] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    if (!course.trim()) return;
    const query = course.toLowerCase();
    const matched = studyFields.filter(field =>
      field.keywords.some(kw => query.includes(kw.toLowerCase()) || kw.toLowerCase().includes(query))
    );
    setResults(matched);
    setSearched(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="space-y-5">
      {/* Input section */}
      <div className="bg-gradient-to-br from-[#0f2347] to-[#1a3a6e] rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-yellow-300" />
          </div>
          <div>
            <div className="font-bold text-lg">Tư vấn nghề nghiệp theo ngành học</div>
            <div className="text-blue-200 text-sm">Nhập ngành học để xem vị trí phù hợp, TSMIT và các visa được approve</div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <label className="block text-xs text-blue-200 mb-1.5 font-medium">Ngành/Chương trình học *</label>
            <input
              type="text"
              placeholder="VD: Software Engineering, Accounting, Civil Engineering, Nursing..."
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-blue-300 text-sm focus:outline-none focus:border-white/50 focus:bg-white/20"
              value={course}
              onChange={e => setCourse(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div>
            <label className="block text-xs text-blue-200 mb-1.5 font-medium">Trường đang học (tuỳ chọn)</label>
            <input
              type="text"
              placeholder="VD: RMIT, Monash, UTS..."
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-blue-300 text-sm focus:outline-none focus:border-white/50 focus:bg-white/20"
              value={university}
              onChange={e => setUniversity(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={handleSearch}
          className="mt-4 bg-white text-[#0f2347] font-bold px-6 py-3 rounded-xl text-sm hover:bg-blue-50 transition-colors flex items-center gap-2"
        >
          <Briefcase className="w-4 h-4" />
          Xem vị trí phù hợp & yêu cầu visa
        </button>

        {/* Quick shortcuts */}
        <div className="mt-4 flex flex-wrap gap-2">
          {["Software Engineering", "Accounting", "Civil Engineering", "Nursing", "Data Analytics"].map(s => (
            <button
              key={s}
              onClick={() => { setCourse(s); setTimeout(() => { const q = s.toLowerCase(); const m = studyFields.filter(f => f.keywords.some(k => q.includes(k.toLowerCase()) || k.toLowerCase().includes(q))); setResults(m); setSearched(true); }, 50); }}
              className="text-xs bg-white/10 hover:bg-white/20 border border-white/20 text-blue-100 px-3 py-1.5 rounded-full transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {searched && (
        <div>
          {results && results.length > 0 ? (
            <div className="space-y-6">
              {/* TSMIT/TRT Summary Banner */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                <div className="font-semibold text-emerald-800 mb-2">📋 Các mốc lương quan trọng theo quy định chính phủ Úc (DIBP)</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div className="bg-white rounded-xl p-3 border border-emerald-100">
                    <div className="text-xs text-gray-500 mb-0.5">TSMIT – Visa 482 Core Skills (2025–2026)</div>
                    <div className="font-bold text-emerald-700">AUD 76,515/năm</div>
                    <div className="text-xs text-gray-400">Tăng lên $79,499 từ 1/7/2026</div>
                  </div>
                  <div className="bg-white rounded-xl p-3 border border-violet-100">
                    <div className="text-xs text-gray-500 mb-0.5">SSIT – Visa 482 Specialist Skills (2025–2026)</div>
                    <div className="font-bold text-violet-700">AUD 141,210/năm</div>
                    <div className="text-xs text-gray-400">Tăng lên $146,717 từ 1/7/2026</div>
                  </div>
                  <div className="bg-white rounded-xl p-3 border border-blue-100">
                    <div className="text-xs text-gray-500 mb-0.5">Visa 186 TRT (ENS) – PR sau 482</div>
                    <div className="font-bold text-blue-700">2 năm làm việc</div>
                    <div className="text-xs text-gray-400">Cùng employer + cùng ANZSCO occupation</div>
                  </div>
                </div>
              </div>

              {university && (
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3 text-sm text-blue-700 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 flex-shrink-0" />
                  <span>Kết quả tư vấn cho sinh viên <strong>{university}</strong> ngành <strong>{course}</strong></span>
                </div>
              )}

              {results.map(field => {
                const c = colorMap[field.color] || colorMap.blue;
                return (
                  <div key={field.id}>
                    <div className={`flex items-center gap-2 mb-3 px-3 py-2 rounded-xl ${c.bg} border ${c.border}`}>
                      <Star className={`w-4 h-4 ${c.icon}`} />
                      <span className="font-bold text-[#0a1628]">{field.label}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${c.badge}`}>{field.occupations.length} vị trí phù hợp</span>
                    </div>
                    <div className="space-y-2 pl-2">
                      {field.occupations.map((occ, i) => (
                        <OccupationCard key={i} occ={occ} color={field.color} />
                      ))}
                    </div>
                  </div>
                );
              })}

              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-xs text-gray-500">
                <p className="font-semibold text-gray-600 mb-1">⚖️ Nguồn & Lưu ý pháp lý</p>
                <p>Thông tin dựa trên Core Skills Occupation List (CSOL) và Subclass 186 TRT eligibility list của DIBP, cập nhật tháng 3/2026. Kiểm tra CSOL chính thức tại{" "}
                  <a href="https://immi.homeaffairs.gov.au/visas/working-in-australia/skill-occupation-list" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline inline-flex items-center gap-0.5">
                    immi.homeaffairs.gov.au <ExternalLink className="w-3 h-3" />
                  </a>. Luôn tham vấn MARA agent trước khi nộp hồ sơ.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
              <AlertCircle className="w-8 h-8 text-amber-400 mx-auto mb-3" />
              <div className="font-semibold text-amber-800 mb-2">Không tìm thấy kết quả cho "{course}"</div>
              <p className="text-sm text-amber-700 mb-4">Thử các từ khoá bằng tiếng Anh như: <em>accounting, civil engineering, nursing, software engineering, data analytics...</em></p>
              <div className="flex flex-wrap gap-2 justify-center">
                {studyFields.map(f => (
                  <button key={f.id} onClick={() => { setCourse(f.keywords[0]); setResults([f]); }}
                    className="text-xs bg-white border border-amber-200 text-amber-700 px-3 py-1.5 rounded-full hover:bg-amber-100">
                    {f.label.split(" – ")[0]}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}