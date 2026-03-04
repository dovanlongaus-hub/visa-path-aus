import { useState } from "react";
import { CheckCircle, XCircle, AlertCircle, ChevronDown, ChevronUp, ExternalLink, Star, Zap, Award, Lightbulb, Globe, Microscope, Music, Trophy, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

// ──────────────────────────────────────────────
// DATA
// ──────────────────────────────────────────────

const SECTORS = [
  { icon: Microscope, label: "Nghiên cứu học thuật", color: "blue", examples: ["Giáo sư, tiến sĩ với công bố quốc tế", "Nhà nghiên cứu tại trường đại học", "Nhà khoa học được trích dẫn quốc tế"] },
  { icon: Zap, label: "Công nghệ & Đổi mới sáng tạo", color: "violet", examples: ["Founder startup tech được đầu tư", "Kỹ sư AI/ML hàng đầu", "Nhà phát minh có patent quốc tế"] },
  { icon: Globe, label: "Doanh nhân & Nhà đầu tư", color: "emerald", examples: ["CEO/Co-founder công ty tăng trưởng nhanh", "Nhà đầu tư có portfolio đáng kể", "Doanh nhân xã hội uy tín"] },
  { icon: Trophy, label: "Thể thao", color: "amber", examples: ["VĐV thi đấu quốc tế", "Huấn luyện viên đội tuyển quốc gia", "Đã thi đấu tại Olympic / World Championship"] },
  { icon: Music, label: "Nghệ thuật & Sáng tạo", color: "rose", examples: ["Nghệ sĩ/nhạc sĩ được ghi nhận quốc tế", "Đạo diễn phim/nhà văn giải thưởng quốc tế", "Kiến trúc sư/nhà thiết kế uy tín"] },
  { icon: Award, label: "Nghề nghiệp nổi bật", color: "sky", examples: ["Luật sư, bác sĩ, kỹ sư đầu ngành", "Lãnh đạo cấp cao (C-suite) công ty lớn", "Chuyên gia được ghi nhận tầm quốc gia/quốc tế"] },
];

const colorMap = {
  blue: { bg: "bg-blue-50", border: "border-blue-200", icon: "text-blue-600", badge: "bg-blue-100 text-blue-700" },
  violet: { bg: "bg-violet-50", border: "border-violet-200", icon: "text-violet-600", badge: "bg-violet-100 text-violet-700" },
  emerald: { bg: "bg-emerald-50", border: "border-emerald-200", icon: "text-emerald-600", badge: "bg-emerald-100 text-emerald-700" },
  amber: { bg: "bg-amber-50", border: "border-amber-200", icon: "text-amber-600", badge: "bg-amber-100 text-amber-700" },
  rose: { bg: "bg-rose-50", border: "border-rose-200", icon: "text-rose-600", badge: "bg-rose-100 text-rose-700" },
  sky: { bg: "bg-sky-50", border: "border-sky-200", icon: "text-sky-600", badge: "bg-sky-100 text-sky-700" },
};

const ELIGIBILITY_QUESTIONS = [
  {
    id: "talent_area",
    question: "Lĩnh vực thành tích của bạn thuộc nhóm nào?",
    options: [
      { value: "profession", label: "Nghề nghiệp xuất sắc (kỹ thuật, y tế, luật, tài chính...)" },
      { value: "sport", label: "Thể thao (thi đấu cấp quốc gia / quốc tế)" },
      { value: "arts", label: "Nghệ thuật (nhạc, điện ảnh, văn học, thiết kế...)" },
      { value: "research", label: "Học thuật & Nghiên cứu (giảng dạy, công bố quốc tế...)" },
      { value: "none", label: "Không thuộc nhóm nào" },
    ],
  },
  {
    id: "recognition",
    question: "Bạn có bằng chứng ghi nhận quốc tế nào không?",
    options: [
      { value: "strong", label: "Có nhiều: giải thưởng quốc tế, báo chí đưa tin, bằng sáng chế, index Scopus/WoS..." },
      { value: "some", label: "Có một số: được trích dẫn, xuất bản sách, giải thưởng cấp quốc gia..." },
      { value: "local", label: "Chủ yếu ghi nhận trong nước / địa phương" },
      { value: "none", label: "Chưa có bằng chứng ghi nhận rõ ràng" },
    ],
  },
  {
    id: "nominator",
    question: "Bạn có người đề cử (nominator) tại Úc không?",
    options: [
      { value: "yes_org", label: "Có – tổ chức/trường đại học/doanh nghiệp Úc đã đồng ý đề cử" },
      { value: "yes_person", label: "Có – công dân/PR Úc uy tín trong lĩnh vực của tôi" },
      { value: "seeking", label: "Chưa có nhưng đang tìm kiếm" },
      { value: "no", label: "Chưa có và chưa biết tìm ai" },
    ],
  },
  {
    id: "australia_link",
    question: "Bạn có liên hệ với Úc không?",
    options: [
      { value: "strong", label: "Có – đang học/làm việc tại Úc, hoặc đã cộng tác với tổ chức Úc" },
      { value: "some", label: "Có một số – đã đến Úc, biết tổ chức/người tại Úc" },
      { value: "none", label: "Chưa có liên hệ cụ thể nào" },
    ],
  },
  {
    id: "health_character",
    question: "Bạn có đáp ứng sức khỏe và lý lịch tư pháp không?",
    options: [
      { value: "yes", label: "Có – không có tiền sử bệnh nghiêm trọng, không có án hình sự" },
      { value: "maybe", label: "Có vấn đề sức khỏe / pháp lý nhỏ (cần kiểm tra thêm)" },
      { value: "no", label: "Có vấn đề nghiêm trọng" },
    ],
  },
];

function calcEligibility(answers) {
  let score = 0;
  const gaps = [];
  const positives = [];

  // talent_area
  if (answers.talent_area === "none") { gaps.push({ label: "Chưa thuộc lĩnh vực được chấp nhận", action: "Kiểm tra lại xem thành tích của bạn có thể được phân loại vào 4 nhóm (nghề, thể thao, nghệ thuật, học thuật) không. Tham khảo MARA agent." }); }
  else { score += 25; positives.push("Lĩnh vực của bạn phù hợp với yêu cầu NIV 858"); }

  // recognition
  if (answers.recognition === "strong") { score += 35; positives.push("Bằng chứng ghi nhận quốc tế mạnh – lợi thế lớn"); }
  else if (answers.recognition === "some") { score += 20; gaps.push({ label: "Bằng chứng ghi nhận cần bổ sung", action: "Tập trung xây dựng thêm: đăng bài báo quốc tế (Scopus), xin tham gia hội đồng chuyên môn, nhận giải thưởng cấp quốc tế, được truyền thông quốc tế đưa tin." }); }
  else if (answers.recognition === "local") { score += 5; gaps.push({ label: "Ghi nhận chủ yếu trong nước, chưa đủ", action: "Cần nâng tầm quốc tế: tham gia hội thảo quốc tế, cộng tác với tổ chức nước ngoài, nộp bài báo vào tạp chí indexed quốc tế, tìm cơ hội có báo chí quốc tế đưa tin." }); }
  else { gaps.push({ label: "Thiếu bằng chứng ghi nhận – điểm yếu nhất", action: "Đây là yêu cầu cốt lõi của NIV 858. Cần xây dựng hồ sơ từ đầu: tham gia giải thưởng quốc tế, được trích dẫn, được mời làm diễn giả quốc tế, xuất bản quốc tế..." }); }

  // nominator
  if (answers.nominator === "yes_org" || answers.nominator === "yes_person") { score += 25; positives.push("Đã có người đề cử phù hợp tại Úc"); }
  else if (answers.nominator === "seeking") { score += 5; gaps.push({ label: "Chưa có nominator", action: "Cách tìm nominator: liên hệ trường đại học Úc nơi bạn muốn cộng tác, tham gia hội nghị quốc tế có người Úc tham dự, kết nối qua LinkedIn với chuyên gia Úc trong ngành, liên hệ trực tiếp hiệp hội ngành nghề Úc." }); }
  else { gaps.push({ label: "Chưa có nominator – bước đầu cần làm ngay", action: "Nominator là điều kiện bắt buộc. Bắt đầu networking ngay: alumni network, LinkedIn, hội nghị chuyên ngành quốc tế, tổ chức cộng đồng người Việt tại Úc có uy tín." }); }

  // australia_link
  if (answers.australia_link === "strong") { score += 10; positives.push("Liên hệ với Úc tốt, tăng khả năng được chấp nhận"); }
  else if (answers.australia_link === "some") { score += 5; gaps.push({ label: "Liên hệ với Úc còn hạn chế", action: "Tham gia các chương trình trao đổi, học bổng, hội nghị tại Úc. Cộng tác nghiên cứu với tổ chức Úc. Tham gia cộng đồng chuyên môn người Việt tại Úc." }); }
  else { gaps.push({ label: "Chưa có liên hệ với Úc", action: "Xây dựng liên hệ: đăng ký chương trình trao đổi học thuật, tham dự hội nghị quốc tế tại Úc, tìm học bổng chính phủ Úc (Australia Awards), kết nối với tổ chức Úc trong ngành của bạn." }); }

  // health_character
  if (answers.health_character === "yes") { score += 5; positives.push("Đáp ứng yêu cầu sức khỏe và lý lịch"); }
  else if (answers.health_character === "maybe") { gaps.push({ label: "Cần kiểm tra sức khỏe / lý lịch tư pháp", action: "Tham khảo bác sĩ được DIBP chỉ định để kiểm tra trước. Với lý lịch tư pháp, tham vấn MARA agent để đánh giá mức độ ảnh hưởng." }); }
  else { gaps.push({ label: "Vấn đề sức khỏe / lý lịch nghiêm trọng", action: "Đây là rào cản lớn. Cần tham vấn MARA agent ngay để đánh giá cụ thể tình huống của bạn." }); score -= 10; }

  let level, color, text;
  if (score >= 85) { level = "Rất có tiềm năng"; color = "emerald"; text = "Hồ sơ của bạn có nhiều điểm mạnh phù hợp với NIV 858. Nên tiến hành EOI và tham vấn MARA agent."; }
  else if (score >= 55) { level = "Cần bổ sung thêm"; color = "amber"; text = "Bạn có cơ sở ban đầu nhưng cần cải thiện một số điểm trước khi nộp EOI."; }
  else if (score >= 25) { level = "Cần chuẩn bị nhiều hơn"; color = "orange"; text = "Hồ sơ cần được xây dựng thêm đáng kể. Bắt đầu từ các điểm còn thiếu bên dưới."; }
  else { level = "Chưa sẵn sàng"; color = "rose"; text = "Visa 858 yêu cầu thành tích nổi bật quốc tế. Cần đầu tư thời gian xây dựng hồ sơ trước khi apply."; }

  return { score, level, color, positives, gaps, text };
}

// ──────────────────────────────────────────────
// Components
// ──────────────────────────────────────────────

function EligibilityChecker() {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [step, setStep] = useState(0);

  const currentQ = ELIGIBILITY_QUESTIONS[step];
  const totalSteps = ELIGIBILITY_QUESTIONS.length;
  const allAnswered = Object.keys(answers).length === totalSteps;

  const handleAnswer = (qid, val) => {
    const newAnswers = { ...answers, [qid]: val };
    setAnswers(newAnswers);
    if (step < totalSteps - 1) {
      setTimeout(() => setStep(s => s + 1), 300);
    } else {
      setResult(calcEligibility(newAnswers));
    }
  };

  const reset = () => { setAnswers({}); setResult(null); setStep(0); };

  const resultColors = {
    emerald: { bg: "bg-emerald-50", border: "border-emerald-300", title: "text-emerald-700", bar: "bg-emerald-500" },
    amber: { bg: "bg-amber-50", border: "border-amber-300", title: "text-amber-700", bar: "bg-amber-500" },
    orange: { bg: "bg-orange-50", border: "border-orange-300", title: "text-orange-700", bar: "bg-orange-500" },
    rose: { bg: "bg-rose-50", border: "border-rose-300", title: "text-rose-700", bar: "bg-rose-500" },
  };

  if (result) {
    const rc = resultColors[result.color];
    return (
      <div className="space-y-4">
        <div className={`rounded-2xl border-2 p-5 ${rc.bg} ${rc.border}`}>
          <div className="flex items-center justify-between mb-3">
            <div className={`text-xl font-bold ${rc.title}`}>{result.level}</div>
            <div className={`text-sm font-bold px-3 py-1 rounded-full ${rc.bg} ${rc.title} border ${rc.border}`}>Điểm: {result.score}/100</div>
          </div>
          <div className="w-full bg-white/60 rounded-full h-2.5 mb-3">
            <div className={`h-2.5 rounded-full ${rc.bar} transition-all`} style={{ width: `${Math.max(result.score, 5)}%` }} />
          </div>
          <p className="text-sm text-gray-700">{result.text}</p>
        </div>

        {result.positives.length > 0 && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
            <div className="font-semibold text-emerald-800 mb-2 text-sm">✅ Điểm mạnh của bạn</div>
            <ul className="space-y-1.5">
              {result.positives.map((p, i) => <li key={i} className="text-sm text-emerald-700 flex items-start gap-2"><CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />{p}</li>)}
            </ul>
          </div>
        )}

        {result.gaps.length > 0 && (
          <div className="space-y-3">
            <div className="font-semibold text-gray-700 text-sm">🎯 Cần bổ sung / cải thiện</div>
            {result.gaps.map((g, i) => (
              <div key={i} className="bg-white border border-amber-200 rounded-2xl p-4">
                <div className="flex items-start gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span className="font-semibold text-amber-800 text-sm">{g.label}</span>
                </div>
                <p className="text-xs text-gray-600 pl-6">👉 {g.action}</p>
              </div>
            ))}
          </div>
        )}

        <div className="bg-[#0f2347] rounded-2xl p-4 text-white text-sm">
          <div className="font-semibold mb-2">📩 Bước tiếp theo được khuyến nghị</div>
          <ol className="space-y-1.5 text-blue-200 list-decimal list-inside">
            <li>Nộp <strong className="text-white">Expression of Interest (EOI)</strong> qua ImmiAccount (miễn phí)</li>
            <li>Chuẩn bị tài liệu bằng chứng thành tích nổi bật</li>
            <li>Tìm nominator phù hợp tại Úc</li>
            <li>Tham vấn <strong className="text-white">MARA agent</strong> được đăng ký trước khi nộp chính thức</li>
          </ol>
        </div>

        <button onClick={reset} className="w-full py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors">
          ← Làm lại kiểm tra
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 bg-gray-100 rounded-full h-2">
          <div className="h-2 bg-[#0f2347] rounded-full transition-all" style={{ width: `${((step) / totalSteps) * 100}%` }} />
        </div>
        <span className="text-xs text-gray-500 flex-shrink-0">{step + 1}/{totalSteps}</span>
      </div>

      <div className="bg-[#0f2347] rounded-2xl p-5">
        <div className="text-xs text-blue-300 mb-2">Câu {step + 1} / {totalSteps}</div>
        <div className="font-semibold text-white text-base mb-4">{currentQ.question}</div>
        <div className="space-y-2">
          {currentQ.options.map(opt => (
            <button
              key={opt.value}
              onClick={() => handleAnswer(currentQ.id, opt.value)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all border ${
                answers[currentQ.id] === opt.value
                  ? "bg-white text-[#0f2347] font-semibold border-white"
                  : "bg-white/10 text-blue-100 border-white/20 hover:bg-white/20"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {step > 0 && (
        <button onClick={() => setStep(s => s - 1)} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          ← Câu trước
        </button>
      )}
    </div>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button className="w-full text-left px-5 py-4 flex items-start justify-between gap-3 hover:bg-gray-50 transition-colors" onClick={() => setOpen(!open)}>
        <span className="font-medium text-[#0a1628] text-sm">{q}</span>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
      </button>
      {open && <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100">{a}</div>}
    </div>
  );
}

// ──────────────────────────────────────────────
// MAIN PAGE
// ──────────────────────────────────────────────

const TABS = [
  { id: "overview", label: "Tổng quan" },
  { id: "checker", label: "🎯 Kiểm tra điều kiện" },
  { id: "process", label: "Quy trình nộp" },
  { id: "faq", label: "FAQ" },
];

export default function Visa858() {
  const [tab, setTab] = useState("overview");

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0a1628] via-[#0f2347] to-[#1a3a6e] text-white">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="inline-flex items-center gap-2 bg-yellow-400/20 border border-yellow-400/40 text-yellow-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <Star className="w-3.5 h-3.5" /> Visa ưu tiên đặc biệt – Thay thế Global Talent Visa từ 6/12/2024
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Visa 858 – National Innovation Visa (NIV)</h1>
          <p className="text-blue-200 max-w-2xl leading-relaxed">
            Visa định cư vĩnh viễn (PR) dành cho những cá nhân có thành tích nổi bật được công nhận quốc tế trong lĩnh vực nghề nghiệp, thể thao, nghệ thuật hoặc nghiên cứu học thuật.
          </p>

          <div className="flex flex-wrap gap-4 mt-6">
            {[
              { label: "Thời hạn lưu trú", value: "Vĩnh viễn (PR)" },
              { label: "Chi phí nộp", value: "từ AUD 4,985" },
              { label: "Nộp EOI", value: "Miễn phí" },
              { label: "Yêu cầu tuổi", value: "Không giới hạn" },
            ].map(s => (
              <div key={s.label} className="bg-white/10 border border-white/20 rounded-xl px-4 py-3">
                <div className="text-xs text-blue-300 mb-0.5">{s.label}</div>
                <div className="font-bold text-white">{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-gray-200 rounded-2xl p-1.5 mb-8 overflow-x-auto">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 min-w-fit px-4 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${tab === t.id ? "bg-[#0f2347] text-white" : "text-gray-500 hover:text-gray-700"}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB: OVERVIEW */}
        {tab === "overview" && (
          <div className="space-y-6">
            <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <strong>Cập nhật quan trọng:</strong> Global Talent Visa đã đóng từ ngày <strong>6/12/2024</strong>. National Innovation Visa (NIV) subclass 858 là visa thay thế chính thức dành cho nhân tài quốc tế.
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#0a1628] mb-4">Các lĩnh vực được chấp nhận</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {SECTORS.map((s, i) => {
                  const Icon = s.icon;
                  const c = colorMap[s.color];
                  return (
                    <div key={i} className={`rounded-2xl border p-4 ${c.bg} ${c.border}`}>
                      <div className="flex items-center gap-2 mb-3">
                        <Icon className={`w-5 h-5 ${c.icon}`} />
                        <span className="font-semibold text-[#0a1628] text-sm">{s.label}</span>
                      </div>
                      <ul className="space-y-1">
                        {s.examples.map((ex, j) => <li key={j} className="text-xs text-gray-600 flex items-start gap-1.5"><span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0" />{ex}</li>)}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h2 className="text-lg font-bold text-[#0a1628] mb-4">Điều kiện bắt buộc (Tóm tắt)</h2>
              <div className="space-y-3">
                {[
                  { ok: true, text: "Được mời nộp sau khi nộp EOI thành công (trong 60 ngày sau khi nhận invitation)" },
                  { ok: true, text: "Có thành tích nổi bật được công nhận quốc tế trong 1 trong 4 lĩnh vực (nghề, thể thao, nghệ thuật, nghiên cứu)" },
                  { ok: true, text: "Có nominator: công dân Úc, PR, NZ citizen đủ điều kiện, hoặc tổ chức Úc có uy tín trong lĩnh vực của bạn" },
                  { ok: true, text: "Đáp ứng yêu cầu sức khỏe và lý lịch tư pháp" },
                  { ok: false, text: "KHÔNG yêu cầu skills assessment chính thức (khác với 482/189/190)" },
                  { ok: false, text: "KHÔNG giới hạn tuổi (khác với EOI 45 tuổi)" },
                  { ok: false, text: "KHÔNG yêu cầu điểm EOI (khác với visa 189/190/491)" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    {item.ok ? <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" /> : <XCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />}
                    <span className={`text-sm ${item.ok ? "text-gray-700" : "text-blue-600"}`}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h2 className="text-lg font-bold text-[#0a1628] mb-3">Quyền lợi khi được cấp Visa 858</h2>
              <div className="grid md:grid-cols-2 gap-2">
                {[
                  "Thường trú nhân (PR) ngay từ đầu – không cần chờ qua visa tạm thời",
                  "Làm việc & học tập tự do tại Úc, không ràng buộc employer",
                  "Đăng ký Medicare (bảo hiểm y tế công)",
                  "Bảo lãnh thành viên gia đình sang Úc",
                  "Đi lại tự do 5 năm đầu, sau đó xin RRV",
                  "Đủ điều kiện xin quốc tịch Úc sau 4 năm (trong đó 1 năm PR)",
                ].map((b, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{b}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <button onClick={() => setTab("checker")} className="inline-flex items-center gap-2 bg-[#0f2347] text-white font-semibold px-8 py-3 rounded-2xl hover:bg-[#1a3a6e] transition-colors">
                🎯 Kiểm tra điều kiện của tôi <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* TAB: CHECKER */}
        {tab === "checker" && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-[#0a1628] mb-2">Kiểm tra điều kiện Visa 858</h2>
              <p className="text-gray-500 text-sm">Trả lời 5 câu hỏi để đánh giá hồ sơ và biết cần bổ sung gì</p>
            </div>
            <EligibilityChecker />
          </div>
        )}

        {/* TAB: PROCESS */}
        {tab === "process" && (
          <div className="space-y-4 max-w-3xl mx-auto">
            <h2 className="text-xl font-bold text-[#0a1628] mb-4">Quy trình nộp Visa 858 từng bước</h2>
            {[
              {
                step: "1", title: "Nộp Expression of Interest (EOI)", color: "blue",
                desc: "Nộp EOI miễn phí qua ImmiAccount. Điền thông tin thành tích, lĩnh vực và nominator dự kiến.",
                tips: ["Không có phí nộp EOI", "EOI có thể được cập nhật bất cứ lúc nào", "Cần cung cấp thông tin nominator từ sớm"],
                time: "Không có deadline",
              },
              {
                step: "2", title: "Được mời nộp (Invitation)", color: "violet",
                desc: "Nếu EOI đáp ứng tiêu chí, DIBP sẽ gửi invitation qua email. Bạn có 60 ngày để nộp đơn chính thức.",
                tips: ["Thời gian chờ invitation: trung bình 1–6 tháng", "Phụ thuộc vào lĩnh vực và mức độ thành tích", "Không có công thức cố định – EOI mạnh được ưu tiên"],
                time: "60 ngày sau invitation",
              },
              {
                step: "3", title: "Chuẩn bị hồ sơ chứng minh", color: "emerald",
                desc: "Thu thập bằng chứng thành tích nổi bật. Đây là phần quyết định nhất của đơn.",
                tips: ["Giải thưởng quốc tế, bằng sáng chế, công bố Scopus/WoS", "Báo chí quốc tế đưa tin về bạn", "Thư giới thiệu từ chuyên gia uy tín trong ngành", "Thư đề cử từ nominator (cá nhân hoặc tổ chức Úc)"],
                time: "Chuẩn bị song song với EOI",
              },
              {
                step: "4", title: "Khám sức khỏe & Lý lịch tư pháp", color: "amber",
                desc: "Đặt lịch khám tại bác sĩ được DIBP chỉ định. Xin lý lịch tư pháp từ các nước đã sinh sống.",
                tips: ["Sức khỏe: thường khám tại panel physician được DIBP chỉ định", "Lý lịch: cần từ tất cả nước đã sống ≥12 tháng từ 16 tuổi", "Bắt đầu sớm vì có thể mất nhiều tuần"],
                time: "Trong 60 ngày sau invitation",
              },
              {
                step: "5", title: "Nộp đơn chính thức & Nộp phí", color: "rose",
                desc: "Nộp qua ImmiAccount. Phí từ AUD 4,985 cho người nộp chính.",
                tips: ["Phí thành viên gia đình: cộng thêm cho mỗi người", "Phí người ≥18 tuổi không thông thạo tiếng Anh: thêm AUD 4,890 (second instalment)", "Đảm bảo tất cả tài liệu đầy đủ trước khi nộp"],
                time: "Trong 60 ngày sau invitation",
              },
              {
                step: "6", title: "Chờ quyết định & Cấp visa", color: "sky",
                desc: "DIBP xử lý hồ sơ. Thời gian xử lý thay đổi tùy trường hợp.",
                tips: ["PR được cấp ngay khi được chấp thuận", "Có thể được yêu cầu cung cấp thêm tài liệu", "Theo dõi ImmiAccount thường xuyên"],
                time: "Trung bình vài tháng",
              },
            ].map((s, i) => {
              const c = colorMap[s.color];
              return (
                <div key={i} className={`bg-white rounded-2xl border p-5 shadow-sm`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl ${c.badge} flex items-center justify-center font-bold text-sm flex-shrink-0`}>
                      {s.step}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-bold text-[#0a1628]">{s.title}</div>
                        <span className={`text-xs px-2 py-1 rounded-full ${c.badge}`}>{s.time}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{s.desc}</p>
                      <ul className="space-y-1">
                        {s.tips.map((t, j) => <li key={j} className="text-xs text-gray-500 flex items-start gap-1.5"><span className="w-1 h-1 bg-gray-300 rounded-full mt-2 flex-shrink-0" />{t}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="bg-[#0f2347] rounded-2xl p-5 text-white text-sm">
              <div className="font-semibold mb-2">🔗 Tài liệu chính thức</div>
              <a href="https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/national-innovation-visa-858" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-blue-300 hover:text-blue-200 underline">
                Trang chính thức DIBP – NIV 858 <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}

        {/* TAB: FAQ */}
        {tab === "faq" && (
          <div className="max-w-3xl mx-auto space-y-3">
            <h2 className="text-xl font-bold text-[#0a1628] mb-4">Câu hỏi thường gặp về NIV 858</h2>
            {[
              { q: "NIV 858 có khác gì với Global Talent Visa 858 trước đây không?", a: "NIV 858 thay thế Global Talent Visa từ 6/12/2024. Về cơ bản các yêu cầu tương tự nhưng NIV tập trung nhiều hơn vào các lĩnh vực đổi mới sáng tạo và có tiêu chí đánh giá chặt chẽ hơn." },
              { q: "Sinh viên quốc tế đang học tại Úc có thể nộp visa 858 không?", a: "Có thể, nếu đáp ứng điều kiện thành tích nổi bật quốc tế. Tuy nhiên sinh viên đại học thông thường thường chưa đủ hồ sơ. Học sinh tiến sĩ (PhD) với công bố quốc tế xuất sắc và giải thưởng học thuật là nhóm có cơ hội nhất trong số sinh viên." },
              { q: "Nominator (người đề cử) cần có tiêu chí gì?", a: "Nominator phải là: (1) Công dân Úc, (2) Thường trú nhân Úc, (3) New Zealand citizen đủ điều kiện, hoặc (4) Tổ chức Úc. Quan trọng nhất là nominator cần có danh tiếng quốc gia trong lĩnh vực của bạn. Ví dụ: giáo sư đại học Úc, CEO công ty Úc, hiệp hội nghề nghiệp Úc..." },
              { q: "EOI thường mất bao lâu để được invited?", a: "Không có con số chính xác. Tùy thuộc vào lĩnh vực và chất lượng EOI. Thông thường từ vài tuần đến 6 tháng. Lĩnh vực ưu tiên (tech, AI, healthcare) thường được xét sớm hơn." },
              { q: "Cần tiếng Anh ở mức nào?", a: "Yêu cầu tiếng Anh 'competent' (tương đương IELTS 6.0 tổng). Nếu tiếng Anh dưới 'functional' (IELTS 4.5 tổng) sẽ phải nộp thêm second instalment AUD 4,890." },
              { q: "Thạc sĩ, tiến sĩ có thể nộp visa này không?", a: "Thạc sĩ thường khó hơn trừ khi có thành tích nghiên cứu nổi bật. Tiến sĩ (PhD) với nhiều công bố Scopus/WoS, h-index cao, giải thưởng học thuật quốc tế là đối tượng phù hợp nhất trong nhóm học thuật & nghiên cứu." },
              { q: "Có thể bao gồm vợ/chồng và con cái không?", a: "Có. Bạn có thể đưa thành viên gia đình vào đơn. Họ cũng cần đáp ứng yêu cầu sức khỏe và lý lịch. Có thêm phí visa cho mỗi thành viên gia đình." },
            ].map((item, i) => <FAQItem key={i} q={item.q} a={item.a} />)}
          </div>
        )}
      </div>
    </div>
  );
}