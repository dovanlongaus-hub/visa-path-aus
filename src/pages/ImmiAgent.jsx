import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Bot, Sparkles, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";

const CHAT_AGENT_KEY = "visapath_chat_agent";
const CHAT_HISTORY_KEY = "visapath_chat_history";
// Quick-start intake overrides (used by Chat + Checklist even before Profile is completed)
const IMMI_VISA_OVERRIDE_KEY = "visapath_immi_visa_type_override";
const IMMI_STAGE_OVERRIDE_KEY = "visapath_immi_stage_override";
const IMMI_INTAKE_OVERRIDE_KEY = "visapath_immi_intake_override";

function Section({ title, badge, icon, children, cta }) {
  return (
    <section className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-[#0a1628]">{title}</h2>
              {badge && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">{badge}</span>}
            </div>
          </div>
        </div>
        {cta}
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

export default function ImmiAgent() {
  const navigate = useNavigate();

  const [visaType, setVisaType] = useState(() => localStorage.getItem(IMMI_VISA_OVERRIDE_KEY) || "500");
  const [visaStage, setVisaStage] = useState(() => localStorage.getItem(IMMI_STAGE_OVERRIDE_KEY) || "studying");
  const [englishTestType, setEnglishTestType] = useState(() => "IELTS");
  const [englishScore, setEnglishScore] = useState("");
  const [occupationCode, setOccupationCode] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(IMMI_INTAKE_OVERRIDE_KEY);
      if (!raw) return;
      const intake = JSON.parse(raw);
      if (intake?.english_test_type) setEnglishTestType(String(intake.english_test_type));
      if (intake?.english_score) setEnglishScore(String(intake.english_score));
      if (intake?.occupation_code) setOccupationCode(String(intake.occupation_code));
      if (intake?.visa_type) setVisaType(String(intake.visa_type));
      if (intake?.stage_override) setVisaStage(String(intake.stage_override));
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stageOptions = useMemo(() => {
    if (visaType === "500") {
      return [
        { id: "studying", label: "Trong thời gian học (tích lũy hồ sơ)" },
        { id: "student", label: "Sắp tốt nghiệp (< 6 tháng)" },
      ];
    }
    // visaType === "485"
    return [
      { id: "skills", label: "Chưa có Skills Assessment" },
      { id: "eoi", label: "Đã có Skills Assessment (chuẩn bị EOI)" },
      { id: "state", label: "Đang làm State Nomination (190/491)" },
      { id: "pr", label: "Chuẩn bị nộp PR (sau ITA)" },
    ];
  }, [visaType]);

  const openImmiChat = (next = {}) => {
    const nextVisaType = next.visaType ?? visaType;
    const nextVisaStage = next.visaStage ?? visaStage;
    const nextEnglishTestType = next.englishTestType ?? englishTestType;
    const nextEnglishScore = next.englishScore ?? englishScore;
    const nextOccupationCode = next.occupationCode ?? occupationCode;

    // Reset chat so the user immediately gets a fresh Immi Agent greeting.
    localStorage.setItem(CHAT_AGENT_KEY, "immi");
    localStorage.removeItem(CHAT_HISTORY_KEY);

    // Save quick intake for Chat/Checklist personalization.
    localStorage.setItem(IMMI_VISA_OVERRIDE_KEY, String(nextVisaType));
    localStorage.setItem(IMMI_STAGE_OVERRIDE_KEY, String(nextVisaStage));
    localStorage.setItem(
      IMMI_INTAKE_OVERRIDE_KEY,
      JSON.stringify({
        english_test_type: nextEnglishTestType,
        english_score: nextEnglishScore || null,
        occupation_code: nextOccupationCode || null,
        skills_assessment_done:
          nextVisaStage === "eoi" || nextVisaStage === "state" || nextVisaStage === "pr"
            ? true
            : nextVisaStage === "skills"
              ? false
              : undefined,
        visa_type: nextVisaType,
        stage_override: nextVisaStage,
      })
    );

    navigate(createPageUrl("Chat"));
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-[#0a1628]">Immi Agent (Sinh viên → PR)</h1>
              <p className="text-gray-600 mt-1">
                Một “knowledge pack” ngắn để bạn hỏi đúng câu, đúng stage khi trò chuyện.
              </p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-4 text-white flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              Trình tự cốt lõi: <b>Visa 500 → Visa 485 → Skills Assessment → EOI → State Nomination (190/491) → PR</b>.
              Bấm nút bên dưới để mở chat với persona chuyên cho sinh viên.
            </div>
          </div>
        </div>

        <div className="mb-6 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-[#0a1628]">Bắt đầu nhanh (30 giây)</h2>
              <p className="text-sm text-gray-600 mt-1">
                Trả lời 3 câu để Immi Agent “bắt đúng stage” trước khi chat.
              </p>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              openImmiChat();
            }}
            className="space-y-4"
          >
            {/* Q1 */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                1) Bạn đang ở Visa nào?
              </label>
              <select
                value={visaType}
                onChange={(e) => {
                  const v = e.target.value;
                  setVisaType(v);
                  setVisaStage(v === "500" ? "studying" : "skills");
                }}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
              >
                <option value="500">500 - Sinh viên</option>
                <option value="485">485 - Tốt nghiệp</option>
              </select>
            </div>

            {/* Q2 */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                2) Giai đoạn hiện tại?
              </label>
              <select
                value={visaStage}
                onChange={(e) => setVisaStage(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
              >
                {stageOptions.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Q3 */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                3) IELTS hay PTE?
              </label>
              <div className="grid grid-cols-3 gap-3">
                <select
                  value={englishTestType}
                  onChange={(e) => setEnglishTestType(e.target.value)}
                  className="col-span-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
                >
                  <option value="IELTS">IELTS</option>
                  <option value="PTE">PTE</option>
                </select>
                <input
                  value={englishScore}
                  onChange={(e) => setEnglishScore(e.target.value)}
                  inputMode="decimal"
                  placeholder={englishTestType === "IELTS" ? "VD: 6.5" : "VD: 65"}
                  className="col-span-2 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
                />
              </div>
            </div>

            {/* Optional */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                ANZSCO / Ngành dự định (tùy chọn)
              </label>
              <input
                value={occupationCode}
                onChange={(e) => setOccupationCode(e.target.value)}
                placeholder="VD: 261313 (Software Engineer) hoặc ngành học/công việc"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#0f2347] text-white rounded-2xl p-5 hover:bg-[#1a3a6e] transition-colors font-semibold flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Mở Chat Immi Agent theo đúng stage
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-xs text-gray-500">
              Dữ liệu nhập nhanh chỉ để cá nhân hoá gợi ý. Quyết định di trú vẫn nên xác minh tại MARA agent.
            </p>
          </form>
        </div>

        {/* Stage 500 */}
        <Section
          title="Stage 1: Student Visa (500)"
          badge="CoE + OSHC + IELTS"
          icon={<CheckCircle2 className="w-5 h-5" />}
        >
          <div className="text-sm text-gray-700">
            Nếu bạn đang ở Visa 500, Immi Agent sẽ giúp bạn tối ưu theo mục tiêu: <b>đủ điều kiện chuyển sang 485</b> nhanh và ít rủi ro.
          </div>
          <ul className="space-y-2 text-sm text-gray-700 list-disc ml-5">
            <li>CoE (CRICOS) + chứng minh tài chính + OSHC trong suốt thời gian học</li>
            <li>Health Examination + Police Clearance</li>
            <li>Form 157A (hoặc nộp online qua ImmiAccount), Form 1221</li>
            <li>Phí visa: ~AUD 650; mục tiêu English: IELTS 5.5+ (hoặc tương đương)</li>
          </ul>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => openImmiChat({ visaType: "500", visaStage: "student" })} className="text-sm font-semibold text-[#0f2347] hover:underline">
              Hỏi: “Tôi cần làm gì để đủ điều kiện 485?”
            </button>
          </div>
        </Section>

        {/* Stage studying */}
        <div className="h-4" />
        <Section
          title="Stage 1.5: Trong thời gian học"
          badge="TFN · IELTS · kinh nghiệm"
          icon={<CheckCircle2 className="w-5 h-5" />}
        >
          <ul className="space-y-2 text-sm text-gray-700 list-disc ml-5">
            <li>Lên kế hoạch cải thiện IELTS/PTE lên mức phù hợp cho 485</li>
            <li>Tích lũy kinh nghiệm liên quan (part-time/trainee/working rights đúng mục tiêu)</li>
            <li>Nghiên cứu nghề nghiệp + chuẩn bị ANZSCO code sớm để tránh mismatch</li>
            <li>Giữ nền chứng minh: học + làm + cộng đồng (tài liệu/payslip/ thư xác nhận)</li>
          </ul>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => openImmiChat({ visaType: "500", visaStage: "studying" })} className="text-sm font-semibold text-[#0f2347] hover:underline">
              Hỏi: “Trong thời gian học tôi nên ưu tiên gì nhất?”
            </button>
          </div>
        </Section>

        {/* Stage 485 */}
        <div className="h-4" />
        <Section
          title="Stage 2: Graduate Visa (485)"
          badge="trong 6 tháng sau tốt nghiệp"
          icon={<CheckCircle2 className="w-5 h-5" />}
        >
          <ul className="space-y-2 text-sm text-gray-700 list-disc ml-5">
            <li>Tốt nghiệp trong 6 tháng gần nhất, học tối thiểu 2 năm tại Úc (đạt chuẩn thực học)</li>
            <li>Tuổi &lt; 50 (tại thời điểm nộp) + IELTS 6.0 (mỗi kỹ năng không dưới 5.0) hoặc PTE 50+</li>
            <li>Còn trong hạn visa sinh viên khi nộp; Health exam nếu cần</li>
            <li>Form 1276; phí visa: ~AUD 4,600</li>
          </ul>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => openImmiChat({ visaType: "485", visaStage: "skills" })} className="text-sm font-semibold text-[#0f2347] hover:underline">
              Hỏi: “Timeline 485 của tôi nên bắt đầu từ khi nào?”
            </button>
          </div>
        </Section>

        {/* Skills */}
        <div className="h-4" />
        <Section
          title="Stage 3: Skills Assessment"
          badge="ANZSCO + đúng authority"
          icon={<CheckCircle2 className="w-5 h-5" />}
        >
          <ul className="space-y-2 text-sm text-gray-700 list-disc ml-5">
            <li>Xác định ANZSCO code và cơ quan đánh giá phù hợp (EA/ACS/VETASSESS/AITSL...)</li>
            <li>Chuẩn bị bằng cấp, bảng điểm, kinh nghiệm làm việc liên quan; dịch công chứng tiếng Anh</li>
            <li>Mục tiêu: nhận kết quả <b>Positive Skills Assessment</b></li>
          </ul>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => openImmiChat({ visaType: "485", visaStage: "skills" })} className="text-sm font-semibold text-[#0f2347] hover:underline">
              Hỏi: “Ngành của tôi ANZSCO code gì và authority nào?”
            </button>
          </div>
        </Section>

        {/* EOI */}
        <div className="h-4" />
        <Section
          title="Stage 4: EOI SkillSelect"
          badge="tăng điểm để lấy ITA"
          icon={<CheckCircle2 className="w-5 h-5" />}
        >
          <ul className="space-y-2 text-sm text-gray-700 list-disc ml-5">
            <li>Mục tiêu điểm thường ≥ 65 để có cửa nộp</li>
            <li>English: Competent/Proficient/Superior (IELTS 7.0+ / PTE 65+ / IELTS 8.0+ / PTE 79+)</li>
            <li>Học cách cập nhật EOI khi IELTS/experience thay đổi</li>
          </ul>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => openImmiChat({ visaType: "485", visaStage: "eoi" })} className="text-sm font-semibold text-[#0f2347] hover:underline">
              Hỏi: “Nên tối ưu EOI theo hướng nào trước?”
            </button>
          </div>
        </Section>

        {/* State nomination */}
        <div className="h-4" />
        <Section
          title="Stage 5: State Nomination (190/491)"
          badge="cần bằng chứng liên kết"
          icon={<CheckCircle2 className="w-5 h-5" />}
        >
          <ul className="space-y-2 text-sm text-gray-700 list-disc ml-5">
            <li>Chọn tiểu bang theo nghề + nơi cư trú/định cư (và tiêu chí nomination của tiểu bang)</li>
            <li>Chuẩn bị supporting evidence (học/làm/sống liên quan)</li>
            <li>Visa 491 thường yêu cầu sống & làm việc vùng 3 năm trước giai đoạn PR</li>
          </ul>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => openImmiChat({ visaType: "485", visaStage: "state" })} className="text-sm font-semibold text-[#0f2347] hover:underline">
              Hỏi: “Nên chọn 190 hay 491, và bang nào hợp nhất?”
            </button>
          </div>
        </Section>

        {/* PR */}
        <div className="h-4" />
        <Section
          title="Stage 6: PR (sau khi có ITA)"
          badge="chuẩn bị trong 60 ngày"
          icon={<CheckCircle2 className="w-5 h-5" />}
        >
          <ul className="space-y-2 text-sm text-gray-700 list-disc ml-5">
            <li>Nhận ITA rồi chuẩn bị hồ sơ trong “cửa sổ” thời gian (thường ~60 ngày)</li>
            <li>Khám sức khỏe tại panel doctor + Police Check đủ điều kiện</li>
            <li>Điền form và nộp online qua ImmiAccount</li>
          </ul>
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-700 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-800">
              Lưu ý: đây là hướng dẫn theo kiến thức phổ biến; quyết định di trú cần xác minh tại MARA agent.
            </p>
          </div>
        </Section>

        {/* Bottom links */}
        <div className="mt-8 grid md:grid-cols-2 gap-4">
          <Link to={createPageUrl("Checklist")} className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-sm transition-all font-semibold text-[#0f2347] text-center">
            Xem checklist Lộ trình PR
          </Link>
          <Link to={createPageUrl("Roadmap")} className="bg-[#0f2347] text-white rounded-2xl p-5 hover:bg-[#1a3a6e] transition-colors font-semibold text-center">
            Mở Lộ trình Student → PR
          </Link>
        </div>
      </div>
    </div>
  );
}

