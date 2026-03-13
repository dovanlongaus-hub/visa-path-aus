/**
 * EOICalculator.jsx — SkillSelect EOI Points Calculator
 * Tính điểm PR 189/190/491 theo đúng bảng điểm Home Affairs
 * Features: real-time score, visual breakdown, what-if scenarios, invite history
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase, entities } from '@/api/supabaseClient';
import { Calculator, TrendingUp, Info, Save, Star, ChevronDown, ChevronUp, Award, Clock, CheckCircle2, AlertCircle, RotateCcw, Download, Share2 } from 'lucide-react';

const EOI_SAVED_KEY = "visapath_eoi_form";
const EOI_HISTORY_KEY = "visapath_eoi_history";

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

// ─── Load/Save functions ──────────────────────────────────

function loadSavedForm() {
  try {
    const saved = localStorage.getItem(EOI_SAVED_KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* corrupted */ }
  return null;
}

function saveFormToLocalStorage(form) {
  try {
    localStorage.setItem(EOI_SAVED_KEY, JSON.stringify(form));
  } catch { /* quota exceeded */ }
}

function loadHistory() {
  try {
    const saved = localStorage.getItem(EOI_HISTORY_KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* corrupted */ }
  return [];
}

function saveToHistory(form, score) {
  try {
    const history = loadHistory();
    const entry = {
      date: new Date().toISOString(),
      score,
      form: { ...form },
    };
    const updated = [entry, ...history].slice(0, 10); // keep last 10
    localStorage.setItem(EOI_HISTORY_KEY, JSON.stringify(updated));
  } catch { /* quota exceeded */ }
}

// ─── Calculator component ──────────────────────────────────

export default function EOICalculator() {
  const [form, setForm] = useState(() => {
    const saved = loadSavedForm();
    return saved || {
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
    };
  });

  const [showHistory, setShowHistory] = useState(false);
  const [showWhatIf, setShowWhatIf] = useState(false);
  const [saved, setSaved] = useState(false);
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [showWhatIfSlider, setShowWhatIfSlider] = useState(false);

  // What-if slider values
  const [whatIfAge, setWhatIfAge] = useState(null);
  const [whatIfEnglish, setWhatIfEnglish] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user || null));
    setHistory(loadHistory());
  }, []);

  // Auto-save to localStorage whenever form changes
  useEffect(() => {
    saveFormToLocalStorage(form);
  }, [form]);

  // What-if calculation with slider overrides
  const getWhatIfScore = useCallback(() => {
    const f = {
      ...form,
      age: whatIfAge !== null ? whatIfAge : form.age,
      english: whatIfEnglish !== null ? whatIfEnglish : form.english,
    };
    return calcScoreStatic(f);
  }, [form, whatIfAge, whatIfEnglish]);

  // ─── Static score calculation (used by what-if) ─────────────────

  const calcScoreStatic = (f) => {
    let pts = 0;
    const breakdown = {};

    const ageRow = AGE_POINTS.find(r => f.age >= r.min && f.age <= r.max);
    breakdown.age = ageRow?.points || 0;
    pts += breakdown.age;

    const engRow = ENGLISH_POINTS.find(r => r.value === f.english);
    breakdown.english = engRow?.points || 0;
    pts += breakdown.english;

    const osRow = OVERSEAS_EXP_POINTS.find(r => r.value === f.overseas_exp);
    breakdown.overseas_exp = osRow?.points || 0;
    pts += breakdown.overseas_exp;

    const ausRow = AUS_EXP_POINTS.find(r => r.value === f.aus_exp);
    breakdown.aus_exp = ausRow?.points || 0;
    pts += breakdown.aus_exp;

    const eduRow = EDUCATION_POINTS.find(r => r.value === f.education);
    breakdown.education = eduRow?.points || 0;
    pts += breakdown.education;

    breakdown.bonuses = 0;
    if (f.aus_study) breakdown.bonuses += 5;
    if (f.specialist_study) breakdown.bonuses += 10;
    if (f.naati) breakdown.bonuses += 5;
    if (f.professional_year) breakdown.bonuses += 5;
    if (f.partner_skills) breakdown.bonuses += 5;
    pts += breakdown.bonuses;

    breakdown.state_nomination = 0;
    if (f.state_nomination === '190') breakdown.state_nomination = 5;
    if (f.state_nomination === '491') breakdown.state_nomination = 15;
    pts += breakdown.state_nomination;

    return { total: pts, breakdown };
  };

  // ─── Main calcScore (uses form) ────────────────────────────

  const calcScore = (f = form) => calcScoreStatic(f);

  const { total: score, breakdown } = calcScore();
  const latest = INVITE_HISTORY[0];

  const getScoreColor = (s) => {
    if (s >= 90) return 'text-green-600';
    if (s >= 75) return 'text-blue-600';
    if (s >= 65) return 'text-yellow-600';
    return 'text-red-500';
  };

  const getScoreBg = (s) => {
    if (s >= 90) return 'bg-green-50 border-green-200';
    if (s >= 75) return 'bg-blue-50 border-blue-200';
    if (s >= 65) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getEligibleStatus = (cutoff) => {
    if (score >= cutoff) return { eligible: true, text: 'Đủ điều kiện', color: 'text-green-600' };
    return { eligible: false, text: `Còn thiếu ${cutoff - score} điểm`, color: 'text-red-500' };
  };

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  // ─── Score breakdown for chart ────────────────────────────

  const scoreCategories = [
    { label: 'Tuổi', value: breakdown.age, max: 30, color: 'bg-blue-500' },
    { label: 'Tiếng Anh', value: breakdown.english, max: 20, color: 'bg-emerald-500' },
    { label: 'Kinh nghiệm nước ngoài', value: breakdown.overseas_exp, max: 15, color: 'bg-violet-500' },
    { label: 'Kinh nghiệm tại Úc', value: breakdown.aus_exp, max: 20, color: 'bg-amber-500' },
    { label: 'Trình độ học vấn', value: breakdown.education, max: 20, color: 'bg-rose-500' },
    { label: 'Điểm thưởng', value: breakdown.bonuses, max: 30, color: 'bg-cyan-500' },
    { label: 'Đề cử tiểu bang', value: breakdown.state_nomination, max: 15, color: 'bg-indigo-500' },
  ];

  // ─── What-if: show how much each improvement adds ────────

  const whatIfScenarios = [
    { label: 'Nâng English lên Superior', delta: () => calcScore({ ...form, english: 'superior' }).total - score },
    { label: 'Thêm 3 năm kinh nghiệm tại Úc', delta: () => calcScore({ ...form, aus_exp: String(Math.min(8, parseInt(form.aus_exp) + 3)) }).total - score },
    { label: 'Hoàn thành Professional Year', delta: () => form.professional_year ? 0 : 5 },
    { label: 'NAATI accreditation', delta: () => form.naati ? 0 : 5 },
    { label: 'State Nomination 190', delta: () => form.state_nomination === '190' ? 0 : calcScore({ ...form, state_nomination: '190' }).total - score },
    { label: 'State Nomination 491', delta: () => form.state_nomination === '491' ? 0 : calcScore({ ...form, state_nomination: '491' }).total - score },
    { label: 'Partner Skills Assessment', delta: () => form.partner_skills ? 0 : 5 },
  ].filter(s => s.delta() > 0);

  // ─── Save to localStorage + Supabase ────────────────────────

  const handleSave = () => {
    // Always save to localStorage
    saveToHistory(form, score);
    setHistory(loadHistory());

    // Also try to save to Supabase if logged in
    if (user) {
      try {
        entities.EOIScoreHistory.create({
          user_id: user.id,
          score,
          visa_type: form.state_nomination !== 'none' ? form.state_nomination : '189',
          breakdown: form,
        }).catch(() => {});
      } catch (e) { console.error(e); }
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  // Load a saved history entry
  const loadFromHistory = (entry) => {
    setForm(entry.form);
    setShowHistory(false);
  };

  // Reset form
  const handleReset = () => {
    if (window.confirm("Đặt lại form về mặc định?")) {
      setForm({
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
      setWhatIfAge(null);
      setWhatIfEnglish(null);
    }
  };

  // ─── Render ──────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Calculator className="text-emerald-600" size={32} />
            Tính điểm EOI — SkillSelect
          </h1>
          <p className="text-gray-500 mt-1">Visa 189, 190, 491 — theo bảng điểm chính thức Home Affairs</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">

          {/* ── Score Display with Chart ── */}
          <div className="md:col-span-1">
            <div className="sticky top-4">
              {/* Main Score Card */}
              <div className={`rounded-2xl border p-6 text-center mb-4 ${getScoreBg(score)}`}>
                <div className={`text-6xl font-black mb-1 ${getScoreColor(score)}`}>{score}</div>
                <div className="text-gray-600 text-sm mb-4">điểm EOI của bạn</div>

                {/* Visual Bar */}
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-4">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${score >= 90 ? 'bg-green-500' : score >= 75 ? 'bg-blue-500' : score >= 65 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.min(100, (score / 100) * 100)}%` }}
                  />
                </div>

                {/* Visa eligibility with icons */}
                <div className="space-y-2 text-sm">
                  {[
                    { label: 'Visa 189', cutoff: latest.visa189, visa: '189' },
                    { label: 'Visa 190', cutoff: latest.visa190, visa: '190' },
                    { label: 'Visa 491', cutoff: latest.visa491, visa: '491' },
                  ].map(({ label, cutoff, visa }) => {
                    const status = getEligibleStatus(cutoff);
                    return (
                      <div key={visa} className="flex items-center justify-between p-2 rounded-lg bg-white/70">
                        <span className="font-semibold text-gray-700">{label}</span>
                        <span className={`flex items-center gap-1 font-bold ${status.color}`}>
                          {status.eligible ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                          {status.text}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Score Breakdown Chart */}
              <div className="bg-white rounded-2xl border p-4 mb-4">
                <h3 className="font-bold text-sm text-gray-700 mb-3">Phân bổ điểm</h3>
                <div className="space-y-2">
                  {scoreCategories.map(cat => (
                    <div key={cat.label} className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 w-28 truncate">{cat.label}</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${cat.color}`} style={{ width: `${(cat.value / cat.max) * 100}%` }} />
                      </div>
                      <span className="text-xs font-bold text-gray-700 w-6 text-right">{cat.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-2">
                <button
                  onClick={handleSave}
                  className="w-full bg-emerald-600 text-white rounded-xl py-3 font-semibold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors"
                >
                  <Save size={18} />
                  {saved ? '✓ Đã lưu!' : 'Lưu kết quả'}
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={handleReset}
                    className="flex-1 bg-gray-100 text-gray-600 rounded-xl py-2 font-medium flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors text-sm"
                  >
                    <RotateCcw size={16} /> Đặt lại
                  </button>
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="flex-1 bg-gray-100 text-gray-600 rounded-xl py-2 font-medium flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors text-sm"
                  >
                    <Clock size={16} /> Lịch sử
                  </button>
                </div>
              </div>

              {/* History dropdown */}
              {showHistory && history.length > 0 && (
                <div className="bg-white rounded-xl border p-3 mt-2">
                  <p className="text-xs font-semibold text-gray-500 mb-2">Các lần tính trước:</p>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {history.map((entry, i) => (
                      <button
                        key={i}
                        onClick={() => loadFromHistory(entry)}
                        className="w-full text-left text-sm p-2 rounded-lg hover:bg-gray-50 flex justify-between items-center"
                      >
                        <span className="text-gray-600">
                          {new Date(entry.date).toLocaleDateString('vi-VN')}
                        </span>
                        <span className="font-bold text-blue-600">{entry.score} điểm</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* What-If Simulator Toggle */}
              <button
                onClick={() => setShowWhatIfSlider(!showWhatIfSlider)}
                className="w-full bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200 text-violet-700 rounded-xl py-3 font-semibold flex items-center justify-center gap-2 hover:from-violet-100 hover:to-indigo-100 transition-colors"
              >
                <TrendingUp size={18} />
                {showWhatIfSlider ? 'Ẩn What-If' : 'What-If Simulator'}
              </button>

              {/* What-If Slider Panel */}
              {showWhatIfSlider && (
                <div className="bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-200 rounded-xl p-4 mt-2">
                  <h4 className="font-bold text-violet-800 text-sm mb-3">Thử nghiệm thay đổi</h4>

                  {/* Age Slider */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">Tuổi</span>
                      <span className="font-semibold text-violet-700">
                        {whatIfAge !== null ? `${whatIfAge} tuổi → ${getWhatIfScore().total} điểm` : 'Như hiện tại'}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="18"
                      max="50"
                      value={whatIfAge !== null ? whatIfAge : form.age}
                      onChange={(e) => setWhatIfAge(parseInt(e.target.value))}
                      className="w-full h-2 bg-violet-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <button
                      onClick={() => setWhatIfAge(null)}
                      className="text-xs text-violet-500 hover:text-violet-700 mt-1"
                    >
                      Khôi phục tuổi thực
                    </button>
                  </div>

                  {/* English Slider */}
                  <div className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">Trình độ tiếng Anh</span>
                      <span className="font-semibold text-violet-700">
                        {whatIfEnglish !== null
                          ? `${ENGLISH_POINTS.find(e => e.value === whatIfEnglish)?.label || whatIfEnglish} → ${getWhatIfScore().total} điểm`
                          : 'Như hiện tại'}
                      </span>
                    </div>
                    <select
                      value={whatIfEnglish !== null ? whatIfEnglish : form.english}
                      onChange={(e) => setWhatIfEnglish(e.target.value)}
                      className="w-full border border-violet-200 rounded-lg px-3 py-2 text-sm"
                    >
                      {ENGLISH_POINTS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label} (+{opt.points})</option>
                      ))}
                    </select>
                    <button
                      onClick={() => setWhatIfEnglish(null)}
                      className="text-xs text-violet-500 hover:text-violet-700 mt-1"
                    >
                      Khôi phục tiếng Anh thực
                    </button>
                  </div>
                </div>
              )}
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

            {/* What-if scenarios — always visible */}
            {whatIfScenarios.length > 0 && (
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <TrendingUp size={18} className="text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-emerald-800 text-sm">What-If: Cách tăng điểm</h3>
                    <p className="text-xs text-emerald-600">Xem bạn có thể tăng bao nhiêu điểm nếu cải thiện</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {whatIfScenarios.map(({ label, delta }) => {
                    const d = delta();
                    const newScore = score + d;
                    return (
                      <div key={label} className="flex justify-between items-center text-sm bg-white/60 rounded-xl px-3 py-2.5">
                        <span className="text-gray-700">{label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-600 font-bold">+{d}</span>
                          <span className="text-xs text-gray-400">= {newScore} pts</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
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
