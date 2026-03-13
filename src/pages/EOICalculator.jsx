/**
 * EOICalculator.jsx — SkillSelect EOI Points Calculator
 * Tính điểm PR 189/190/491 theo đúng bảng điểm Home Affairs
 * Features: real-time score, what-if scenarios, invite history, save to Supabase
 */

import { useState, useEffect } from 'react';
import { supabase, entities } from '@/api/supabaseClient';
import { Calculator, TrendingUp, Info, Save, Star, ChevronDown, ChevronUp, Award, Clock } from 'lucide-react';

// ─── Points tables (official Home Affairs) ─────────────────

const AGE_POINTS = [
  { label: '18–24', min: 18, max: 24, points: 25 },
  { label: '25–32', min: 25, max: 32, points: 30 },
  { label: '33–39', min: 33, max: 39, points: 25 },
  { label: '40–44', min: 40, max: 44, points: 15 },
  { label: '45+',   min: 45, max: 99, points: 0  },
];

const ENGLISH_POINTS = [
  { value: 'competent',  label: 'Competent (IELTS 6.0 / PTE 50)',  points: 0  },
  { value: 'proficient', label: 'Proficient (IELTS 7.0 / PTE 65)', points: 10 },
  { value: 'superior',   label: 'Superior (IELTS 8.0+ / PTE 79+)', points: 20 },
];

const OVERSEAS_EXP_POINTS = [
  { value: '0',  label: 'Under 3 years',  points: 0  },
  { value: '3',  label: '3–4 years',      points: 5  },
  { value: '5',  label: '5–7 years',      points: 10 },
  { value: '8',  label: '8+ years',       points: 15 },
];

const AUS_EXP_POINTS = [
  { value: '0',  label: 'Under 1 year',  points: 0  },
  { value: '1',  label: '1–2 years',     points: 5  },
  { value: '3',  label: '3–4 years',     points: 10 },
  { value: '5',  label: '5–7 years',     points: 15 },
  { value: '8',  label: '8+ years',      points: 20 },
];

const EDUCATION_POINTS = [
  { value: 'none',      label: 'Không có bằng / Bằng trung học',         points: 0  },
  { value: 'diploma',   label: 'Diploma / Trade Certificate',              points: 10 },
  { value: 'bachelor',  label: 'Bachelor',                                 points: 15 },
  { value: 'phd',       label: 'Doctorate (PhD)',                          points: 20 },
];

// ─── Invite history (latest cutoff scores) ─────────────────

const INVITE_HISTORY = [
  { round: 'Apr 2025', visa189: 85, visa190: 75, visa491: 65 },
  { round: 'Mar 2025', visa189: 90, visa190: 80, visa491: 70 },
  { round: 'Feb 2025', visa189: 85, visa190: 75, visa491: 65 },
  { round: 'Jan 2025', visa189: 90, visa190: 80, visa491: 65 },
  { round: 'Dec 2024', visa189: 95, visa190: 80, visa491: 70 },
];

// ─── Calculator component ──────────────────────────────────

export default function EOICalculator() {
  const [form, setForm] = useState({
    age: 28,
    english: 'proficient',
    overseas_exp: '3',
    aus_exp: '1',
    education: 'bachelor',
    aus_study: false,
    specialist_study: false,
    naati: false,
    professional_year: false,
    partner_skills: false,
    state_nomination: 'none',
  });

  const [showHistory, setShowHistory] = useState(false);
  const [showWhatIf, setShowWhatIf] = useState(false);
  const [saved, setSaved] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user || null));
  }, []);

  // ─── Score calculation ───────────────────────────────────

  const calcScore = (f = form) => {
    let pts = 0;

    // Age
    const ageRow = AGE_POINTS.find(r => f.age >= r.min && f.age <= r.max);
    pts += ageRow?.points || 0;

    // English
    const engRow = ENGLISH_POINTS.find(r => r.value === f.english);
    pts += engRow?.points || 0;

    // Overseas experience
    const osRow = OVERSEAS_EXP_POINTS.find(r => r.value === f.overseas_exp);
    pts += osRow?.points || 0;

    // Australian experience
    const ausRow = AUS_EXP_POINTS.find(r => r.value === f.aus_exp);
    pts += ausRow?.points || 0;

    // Education
    const eduRow = EDUCATION_POINTS.find(r => r.value === f.education);
    pts += eduRow?.points || 0;

    // Bonuses
    if (f.aus_study) pts += 5;
    if (f.specialist_study) pts += 10;
    if (f.naati) pts += 5;
    if (f.professional_year) pts += 5;
    if (f.partner_skills) pts += 5;

    // State nomination
    if (f.state_nomination === '190') pts += 5;
    if (f.state_nomination === '491') pts += 15;

    return pts;
  };

  const score = calcScore();
  const latest = INVITE_HISTORY[0];

  const getScoreColor = (s) => {
    if (s >= 90) return 'text-green-600';
    if (s >= 75) return 'text-blue-600';
    if (s >= 65) return 'text-yellow-600';
    return 'text-red-500';
  };

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  // ─── What-if: show how much each improvement adds ────────

  const whatIfScenarios = [
    { label: 'Nâng English lên Superior', delta: () => calcScore({ ...form, english: 'superior' }) - score },
    { label: 'Thêm 3 năm kinh nghiệm tại Úc', delta: () => calcScore({ ...form, aus_exp: String(Math.min(8, parseInt(form.aus_exp) + 3)) }) - score },
    { label: 'Hoàn thành Professional Year', delta: () => form.professional_year ? 0 : 5 },
    { label: 'NAATI accreditation', delta: () => form.naati ? 0 : 5 },
    { label: 'State Nomination 190', delta: () => form.state_nomination === '190' ? 0 : calcScore({ ...form, state_nomination: '190' }) - score },
    { label: 'Partner Skills Assessment', delta: () => form.partner_skills ? 0 : 5 },
  ].filter(s => s.delta() > 0);

  // ─── Save to Supabase ────────────────────────────────────

  const handleSave = async () => {
    if (!user) { alert('Vui lòng đăng nhập để lưu kết quả'); return; }
    try {
      await entities.EOIScoreHistory.create({
        user_id: user.id,
        score,
        visa_type: form.state_nomination !== 'none' ? form.state_nomination : '189',
        breakdown: form,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) { console.error(e); }
  };

  // ─── Render ──────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Calculator className="text-blue-600" size={32} />
            Tính điểm EOI — SkillSelect
          </h1>
          <p className="text-gray-500 mt-1">Visa 189, 190, 491 — theo bảng điểm chính thức Home Affairs</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">

          {/* ── Score Display ── */}
          <div className="md:col-span-1">
            <div className="sticky top-4">
              <div className="bg-white rounded-2xl shadow-sm border p-6 text-center mb-4">
                <div className={`text-6xl font-black mb-1 ${getScoreColor(score)}`}>{score}</div>
                <div className="text-gray-500 text-sm mb-4">điểm EOI của bạn</div>

                {/* Visa eligibility */}
                <div className="space-y-2 text-sm">
                  {[
                    { label: 'Visa 189 (cần ~85)', cutoff: latest.visa189 },
                    { label: 'Visa 190 (cần ~75)', cutoff: latest.visa190 },
                    { label: 'Visa 491 (cần ~65)', cutoff: latest.visa491 },
                  ].map(({ label, cutoff }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-gray-600">{label}</span>
                      <span className={score >= cutoff ? 'text-green-600 font-semibold' : 'text-red-400'}>
                        {score >= cutoff ? '✓ Đủ' : `Còn thiếu ${cutoff - score} điểm`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Save button */}
              <button
                onClick={handleSave}
                className="w-full bg-blue-600 text-white rounded-xl py-3 font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
              >
                <Save size={18} />
                {saved ? '✓ Đã lưu!' : 'Lưu kết quả'}
              </button>
            </div>
          </div>

          {/* ── Form ── */}
          <div className="md:col-span-2 space-y-4">

            {/* Age */}
            <div className="bg-white rounded-2xl border p-5">
              <label className="block font-semibold text-gray-700 mb-3">Tuổi</label>
              <input
                type="number" min="18" max="65" value={form.age}
                onChange={e => set('age', parseInt(e.target.value) || 18)}
                className="w-full border rounded-lg px-4 py-2 text-lg font-bold text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <p className="text-xs text-gray-400 mt-1">
                {AGE_POINTS.find(r => form.age >= r.min && form.age <= r.max)?.points || 0} điểm
              </p>
            </div>

            {/* English */}
            <div className="bg-white rounded-2xl border p-5">
              <label className="block font-semibold text-gray-700 mb-3">Tiếng Anh</label>
              <div className="space-y-2">
                {ENGLISH_POINTS.map(opt => (
                  <label key={opt.value} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                    <input type="radio" name="english" value={opt.value} checked={form.english === opt.value}
                      onChange={() => set('english', opt.value)} className="accent-blue-600" />
                    <span className="text-sm text-gray-700">{opt.label}</span>
                    <span className="ml-auto text-blue-600 font-bold text-sm">{opt.points} pts</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className="bg-white rounded-2xl border p-5">
              <label className="block font-semibold text-gray-700 mb-3">Kinh nghiệm làm việc</label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-2">Tại nước ngoài (10 năm qua)</p>
                  <select value={form.overseas_exp} onChange={e => set('overseas_exp', e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
                    {OVERSEAS_EXP_POINTS.map(o => <option key={o.value} value={o.value}>{o.label} (+{o.points})</option>)}
                  </select>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2">Tại Úc (10 năm qua)</p>
                  <select value={form.aus_exp} onChange={e => set('aus_exp', e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
                    {AUS_EXP_POINTS.map(o => <option key={o.value} value={o.value}>{o.label} (+{o.points})</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="bg-white rounded-2xl border p-5">
              <label className="block font-semibold text-gray-700 mb-3">Trình độ học vấn</label>
              <select value={form.education} onChange={e => set('education', e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
                {EDUCATION_POINTS.map(o => <option key={o.value} value={o.value}>{o.label} (+{o.points})</option>)}
              </select>
            </div>

            {/* Bonuses */}
            <div className="bg-white rounded-2xl border p-5">
              <label className="block font-semibold text-gray-700 mb-3">Điểm thưởng</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'aus_study', label: 'Australian Study (+5)', pts: 5 },
                  { key: 'specialist_study', label: 'Masters/PhD Aus (+10)', pts: 10 },
                  { key: 'naati', label: 'NAATI Accreditation (+5)', pts: 5 },
                  { key: 'professional_year', label: 'Professional Year (+5)', pts: 5 },
                  { key: 'partner_skills', label: 'Partner Skills (+5)', pts: 5 },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                    <input type="checkbox" checked={form[key]} onChange={e => set(key, e.target.checked)}
                      className="accent-blue-600 w-4 h-4" />
                    <span className="text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* State nomination */}
            <div className="bg-white rounded-2xl border p-5">
              <label className="block font-semibold text-gray-700 mb-3">State Nomination</label>
              <div className="flex gap-3">
                {[
                  { value: 'none', label: 'Không có', pts: 0 },
                  { value: '190', label: 'Visa 190 (+5)', pts: 5 },
                  { value: '491', label: 'Visa 491 (+15)', pts: 15 },
                ].map(opt => (
                  <label key={opt.value} className={`flex-1 text-center p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    form.state_nomination === opt.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" name="state" value={opt.value} checked={form.state_nomination === opt.value}
                      onChange={() => set('state_nomination', opt.value)} className="hidden" />
                    <div className="text-sm font-semibold text-gray-700">{opt.label}</div>
                  </label>
                ))}
              </div>
            </div>

            {/* What-if scenarios */}
            {whatIfScenarios.length > 0 && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-5">
                <button onClick={() => setShowWhatIf(!showWhatIf)}
                  className="flex items-center justify-between w-full">
                  <span className="font-semibold text-blue-800 flex items-center gap-2">
                    <TrendingUp size={18} /> Cách tăng điểm
                  </span>
                  {showWhatIf ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {showWhatIf && (
                  <div className="mt-3 space-y-2">
                    {whatIfScenarios.map(({ label, delta }) => (
                      <div key={label} className="flex justify-between items-center text-sm">
                        <span className="text-gray-700">{label}</span>
                        <span className="text-green-600 font-bold">+{delta()} điểm → {score + delta()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Invite history */}
            <div className="bg-white rounded-2xl border p-5">
              <button onClick={() => setShowHistory(!showHistory)}
                className="flex items-center justify-between w-full">
                <span className="font-semibold text-gray-700 flex items-center gap-2">
                  <Clock size={18} /> Lịch sử điểm mời
                </span>
                {showHistory ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {showHistory && (
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 border-b">
                        <th className="pb-2">Round</th>
                        <th className="pb-2 text-center">189</th>
                        <th className="pb-2 text-center">190</th>
                        <th className="pb-2 text-center">491</th>
                      </tr>
                    </thead>
                    <tbody>
                      {INVITE_HISTORY.map(r => (
                        <tr key={r.round} className="border-b last:border-0">
                          <td className="py-2 text-gray-600">{r.round}</td>
                          <td className={`py-2 text-center font-semibold ${score >= r.visa189 ? 'text-green-600' : 'text-gray-400'}`}>{r.visa189}</td>
                          <td className={`py-2 text-center font-semibold ${score >= r.visa190 ? 'text-green-600' : 'text-gray-400'}`}>{r.visa190}</td>
                          <td className={`py-2 text-center font-semibold ${score >= r.visa491 ? 'text-green-600' : 'text-gray-400'}`}>{r.visa491}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
