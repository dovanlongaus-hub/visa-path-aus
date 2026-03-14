// EligibilityWizard.jsx — 5-step eligibility check, no login required
// Steps: current_visa → occupation → english → experience → state
// Result: show eligible visas, estimated EOI score, CTA to signup

import { useState } from "react";
import { ChevronRight, ChevronLeft, CheckCircle, ArrowRight, Sparkles, Target, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

// Occupation list (top 20 most common for Vietnamese in AU)
const OCCUPATIONS = [
  { code: "261313", label: "Software Engineer / Developer" },
  { code: "261111", label: "ICT Business Analyst" },
  { code: "261112", label: "Systems Analyst" },
  { code: "261314", label: "Web Developer" },
  { code: "233512", label: "Mechanical Engineer" },
  { code: "233211", label: "Civil Engineer" },
  { code: "234611", label: "Registered Nurse" },
  { code: "241111", label: "Giáo viên Tiểu học" },
  { code: "221111", label: "Accountant" },
  { code: "221112", label: "Management Accountant" },
  { code: "132111", label: "ICT Project Manager" },
  { code: "261311", label: "Analyst Programmer" },
  { code: "234213", label: "Pharmacist" },
  { code: "252511", label: "Occupational Therapist" },
  { code: "253111", label: "General Practitioner" },
  { code: "224111", label: "Information & Org Professional" },
  { code: "135111", label: "ICT Manager" },
  { code: "233111", label: "Chemical Engineer" },
  { code: "232111", label: "Architect" },
  { code: "225113", label: "Marketing Specialist" },
];

const STATES = [
  { code: "NSW", label: "New South Wales", bonus: 5 },
  { code: "VIC", label: "Victoria", bonus: 5 },
  { code: "QLD", label: "Queensland", bonus: 5 },
  { code: "SA", label: "South Australia", bonus: 5 },
  { code: "WA", label: "Western Australia", bonus: 5 },
  { code: "TAS", label: "Tasmania", bonus: 5 },
  { code: "ACT", label: "Australian Capital Territory", bonus: 5 },
  { code: "NT", label: "Northern Territory", bonus: 5 },
];

// Simple EOI score estimator (not full calculator, just estimate)
function estimateEOI(data) {
  let score = 0;
  const age = parseInt(data.age) || 30;
  if (age >= 18 && age <= 24) score += 25;
  else if (age >= 25 && age <= 32) score += 30;
  else if (age >= 33 && age <= 39) score += 25;
  else if (age >= 40 && age <= 44) score += 15;

  if (data.english === "superior") score += 20;
  else if (data.english === "proficient") score += 10;
  else score += 0;

  const exp = parseInt(data.experience) || 0;
  if (exp >= 8) score += 15;
  else if (exp >= 5) score += 10;
  else if (exp >= 3) score += 5;

  // Skills assessment done (assume yes for estimate)
  score += 0; // base, no extra

  // Education (assume bachelor = 0 bonus in basic estimate)
  score += 0;

  // Nomination bonus
  const wantNomination = data.state && data.state !== "none";
  if (wantNomination) score += 5;

  return { score, wantNomination };
}

function getEligibleVisas(data) {
  const { score, wantNomination } = estimateEOI(data);
  const visas = [];

  if (score >= 65) visas.push({ code: "189", label: "Skilled Independent", minScore: 65, likely: score >= 75 });
  if (score >= 60 && wantNomination) visas.push({ code: "190", label: "Skilled Nominated", minScore: 60, likely: score >= 65 });
  if (score >= 55 && data.state && !["NSW","VIC"].includes(data.state)) visas.push({ code: "491", label: "Skilled Regional", minScore: 55, likely: score >= 60 });
  if (visas.length === 0) visas.push({ code: "none", label: "Cần nâng điểm EOI thêm", minScore: 0, likely: false });

  return { visas, score };
}

const STEPS = [
  { id: "visa", title: "Visa hiện tại", subtitle: "Bạn đang ở visa nào?" },
  { id: "occupation", title: "Nghề nghiệp", subtitle: "Ngành nghề chính của bạn?" },
  { id: "english", title: "Tiếng Anh", subtitle: "Trình độ IELTS / PTE của bạn?" },
  { id: "experience", title: "Kinh nghiệm", subtitle: "Bao nhiêu năm kinh nghiệm?" },
  { id: "state", title: "Bang / Territory", subtitle: "Bạn đang sống ở đâu?" },
];

export default function EligibilityWizard() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ visa: "", occupation: "", age: "28", english: "", experience: "", state: "" });
  const [showResult, setShowResult] = useState(false);

  const update = (key, val) => setData(d => ({ ...d, [key]: val }));

  const canNext = () => {
    if (step === 0) return !!data.visa;
    if (step === 1) return !!data.occupation;
    if (step === 2) return !!data.english;
    if (step === 3) return !!data.experience;
    if (step === 4) return !!data.state;
    return false;
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep(s => s + 1);
    else setShowResult(true);
  };

  if (showResult) {
    const { visas, score } = getEligibleVisas(data);
    const primaryVisa = visas[0];
    const eligible = primaryVisa.code !== "none";

    return (
      <div className="bg-gradient-to-br from-[#0f2347] to-[#1a3a6b] rounded-2xl p-6 md:p-8 text-white">
        <div className="text-center mb-6">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${eligible ? "bg-emerald-500" : "bg-amber-500"}`}>
            {eligible ? <CheckCircle className="w-8 h-8" /> : <Target className="w-8 h-8" />}
          </div>
          <h3 className="text-2xl font-bold mb-2">
            {eligible ? "🎉 Bạn có thể đủ điều kiện!" : "📈 Cần nâng điểm thêm"}
          </h3>
          <p className="text-white/70 text-sm">Dựa trên thông tin bạn cung cấp</p>
        </div>

        <div className="bg-white/10 rounded-xl p-4 mb-4 text-center">
          <p className="text-white/60 text-sm mb-1">Điểm EOI ước tính</p>
          <p className="text-4xl font-black">{score}<span className="text-lg font-normal text-white/60"> điểm</span></p>
        </div>

        {eligible && (
          <div className="space-y-2 mb-6">
            {visas.map(v => (
              <div key={v.code} className={`flex items-center gap-3 p-3 rounded-xl ${v.likely ? "bg-emerald-500/20 border border-emerald-400/30" : "bg-white/10"}`}>
                <CheckCircle className={`w-5 h-5 flex-shrink-0 ${v.likely ? "text-emerald-400" : "text-white/40"}`} />
                <div>
                  <p className="font-semibold text-sm">Visa {v.code} — {v.label}</p>
                  <p className="text-xs text-white/60">{v.likely ? "Khả năng cao" : "Có thể đủ điều kiện"}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-5">
          <div className="flex items-start gap-2">
            <Lock className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold mb-1">Xem phân tích đầy đủ</p>
              <p className="text-xs text-white/60">Tạo tài khoản miễn phí để lưu kết quả, xem breakdown chi tiết từng điểm, và nhận lộ trình cá nhân hóa.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Link to={createPageUrl("Profile")} className="bg-white text-[#0f2347] font-bold text-center py-3 rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
            Lưu kết quả & Tạo lộ trình <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to={createPageUrl("EOICalculator")} className="bg-white/10 text-white font-semibold text-center py-3 rounded-xl hover:bg-white/20 transition-colors text-sm">
            Tính điểm chi tiết →
          </Link>
          <button onClick={() => { setShowResult(false); setStep(0); setData({ visa: "", occupation: "", age: "28", english: "", experience: "", state: "" }); }} className="text-white/50 text-sm hover:text-white/80 transition-colors py-1">
            Làm lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#0f2347] to-[#1a3a6b] rounded-2xl p-6 md:p-8">
      {/* Progress */}
      <div className="flex gap-1.5 mb-6">
        {STEPS.map((s, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= step ? "bg-blue-400" : "bg-white/20"}`} />
        ))}
      </div>

      {/* Step header */}
      <div className="mb-5">
        <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-1">Bước {step + 1}/{STEPS.length}</p>
        <h3 className="text-xl font-bold text-white">{STEPS[step].title}</h3>
        <p className="text-white/60 text-sm">{STEPS[step].subtitle}</p>
      </div>

      {/* Step content */}
      <div className="space-y-2 mb-6 min-h-[180px]">
        {step === 0 && (
          [
            { val: "500", label: "🎓 Visa 500 — Du học sinh" },
            { val: "485", label: "🏫 Visa 485 — Tốt nghiệp" },
            { val: "482", label: "💼 Visa 482 — Employer Sponsored" },
            { val: "other", label: "🗂 Visa khác" },
          ].map(opt => (
            <button key={opt.val} onClick={() => update("visa", opt.val)} className={`w-full text-left p-3.5 rounded-xl border transition-all ${data.visa === opt.val ? "bg-blue-500 border-blue-400 text-white font-semibold" : "bg-white/10 border-white/20 text-white hover:bg-white/20"}`}>
              {opt.label}
            </button>
          ))
        )}
        {step === 1 && (
          <div className="space-y-2">
            <select value={data.occupation} onChange={e => update("occupation", e.target.value)} className="w-full bg-white/10 border border-white/20 text-white rounded-xl p-3.5 text-sm focus:outline-none focus:border-blue-400">
              <option value="" className="text-gray-900">Chọn nghề nghiệp...</option>
              {OCCUPATIONS.map(o => (
                <option key={o.code} value={o.code} className="text-gray-900">{o.label} ({o.code})</option>
              ))}
            </select>
            <input type="number" placeholder="Tuổi của bạn" value={data.age} onChange={e => update("age", e.target.value)} className="w-full bg-white/10 border border-white/20 text-white rounded-xl p-3.5 text-sm placeholder-white/40 focus:outline-none focus:border-blue-400" min="18" max="55" />
          </div>
        )}
        {step === 2 && (
          [
            { val: "competent", label: "Competent — IELTS 6.0 / PTE 50" },
            { val: "proficient", label: "Proficient — IELTS 7.0 / PTE 65 (+10 điểm)" },
            { val: "superior", label: "Superior — IELTS 8.0+ / PTE 79+ (+20 điểm)" },
          ].map(opt => (
            <button key={opt.val} onClick={() => update("english", opt.val)} className={`w-full text-left p-3.5 rounded-xl border transition-all ${data.english === opt.val ? "bg-blue-500 border-blue-400 text-white font-semibold" : "bg-white/10 border-white/20 text-white hover:bg-white/20"}`}>
              {opt.label}
            </button>
          ))
        )}
        {step === 3 && (
          [
            { val: "1", label: "1-2 năm" },
            { val: "3", label: "3-4 năm (+5 điểm)" },
            { val: "5", label: "5-7 năm (+10 điểm)" },
            { val: "8", label: "8+ năm (+15 điểm)" },
          ].map(opt => (
            <button key={opt.val} onClick={() => update("experience", opt.val)} className={`w-full text-left p-3.5 rounded-xl border transition-all ${data.experience === opt.val ? "bg-blue-500 border-blue-400 text-white font-semibold" : "bg-white/10 border-white/20 text-white hover:bg-white/20"}`}>
              {opt.label}
            </button>
          ))
        )}
        {step === 4 && (
          <div className="grid grid-cols-2 gap-2">
            {STATES.map(s => (
              <button key={s.code} onClick={() => update("state", s.code)} className={`text-left p-3 rounded-xl border transition-all ${data.state === s.code ? "bg-blue-500 border-blue-400 text-white font-semibold" : "bg-white/10 border-white/20 text-white hover:bg-white/20"}`}>
                <span className="font-bold text-sm">{s.code}</span>
                <p className="text-xs text-white/60 mt-0.5">{s.label.split(" ")[0]}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Nav buttons */}
      <div className="flex gap-3">
        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 text-white text-sm hover:bg-white/20 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Quay lại
          </button>
        )}
        <button onClick={handleNext} disabled={!canNext()} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all ${canNext() ? "bg-blue-500 text-white hover:bg-blue-400" : "bg-white/10 text-white/30 cursor-not-allowed"}`}>
          {step < STEPS.length - 1 ? (<>Tiếp theo <ChevronRight className="w-4 h-4" /></>) : (<><Sparkles className="w-4 h-4" /> Xem kết quả</>)}
        </button>
      </div>
    </div>
  );
}
