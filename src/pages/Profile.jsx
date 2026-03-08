import { useState, useEffect } from "react";
import {
  User, GraduationCap, Briefcase, Globe, Save,
  Calculator, ChevronDown, ChevronUp, CheckCircle2,
  AlertCircle, RefreshCw, Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User as UserEntity, UserProfile } from "@/api/entities";

// ── EOI Points Tables ──────────────────────────────────────────────────────────
const AGE_POINTS = [
  { label: "18–24", points: 25 },
  { label: "25–32", points: 30 },
  { label: "33–39", points: 25 },
  { label: "40–44", points: 15 },
  { label: "45–49", points: 0 },
  { label: "50+",   points: 0 },
];
const ENGLISH_POINTS = [
  { label: "Competent (IELTS 6.0)",     points: 0 },
  { label: "Proficient (IELTS 7.0+)",   points: 10 },
  { label: "Superior (IELTS 8.0+)",     points: 20 },
];
const EDU_POINTS = [
  { label: "Tiến sĩ (PhD)",                               points: 20 },
  { label: "Cử nhân/Thạc sĩ liên quan đến ngành",         points: 15 },
  { label: "Cử nhân/Thạc sĩ không liên quan",             points: 10 },
  { label: "Thương mại hoặc công nhận nghề nghiệp Úc",     points: 10 },
  { label: "Không có bằng cấp sau THPT",                   points: 0 },
];
const AUS_EXP_POINTS = [
  { label: "Chưa có",     points: 0 },
  { label: "1–2 năm",     points: 5 },
  { label: "3–4 năm",     points: 10 },
  { label: "5–7 năm",     points: 15 },
  { label: "8+ năm",      points: 20 },
];
const OVERSEAS_EXP_POINTS = [
  { label: "Chưa có",     points: 0 },
  { label: "3–4 năm",     points: 5 },
  { label: "5–7 năm",     points: 10 },
  { label: "8+ năm",      points: 15 },
];
const REGIONAL_POINTS   = { label: "Học tại vùng nông thôn Úc", points: 5 };
const NAATI_POINTS      = { label: "Chứng chỉ NAATI CCL",       points: 5 };
const COMMUNITY_POINTS  = { label: "Tiếng Anh cộng đồng (IELTS 6.0 toàn gia đình)", points: 5 };
const SPOUSE_ENGLISH_POINTS = { label: "Vợ/chồng Proficient English", points: 5 };
const PROF_YEAR_POINTS  = { label: "Professional Year tại Úc", points: 5 };

function calcEOI(form) {
  let pts = 0;
  // Age
  const age = parseInt(form.age);
  if (age >= 18 && age <= 24) pts += 25;
  else if (age >= 25 && age <= 32) pts += 30;
  else if (age >= 33 && age <= 39) pts += 25;
  else if (age >= 40 && age <= 44) pts += 15;
  // English
  pts += parseInt(form.english_points || 0);
  // Education
  pts += parseInt(form.education_points || 0);
  // Australian experience
  pts += parseInt(form.aus_work_years_points || 0);
  // Overseas experience
  pts += parseInt(form.overseas_exp_points || 0);
  // Bonuses
  if (form.regional_study) pts += 5;
  if (form.naati) pts += 5;
  if (form.community_language) pts += 5;
  if (form.spouse_english) pts += 5;
  if (form.professional_year) pts += 5;
  return pts;
}

const EMPTY = {
  full_name: "", date_of_birth: "", nationality: "Vietnam",
  passport_number: "", age: "",
  ielts_overall: "", english_level: "0", english_points: "0",
  highest_education: "", education_points: "10",
  occupation: "", anzsco_code: "",
  current_visa: "", target_visa: "",
  aus_work_years: "0", aus_work_years_points: "0",
  overseas_exp_years: "0", overseas_exp_points: "0",
  regional_study: false, naati: false, community_language: false,
  spouse_english: false, professional_year: false,
};

export default function Profile() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [showEOI, setShowEOI] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const u = await UserEntity.me();
        setUser(u);
        const profiles = await UserProfile.filter({ user_id: u.id });
        if (profiles?.length) {
          setForm({ ...EMPTY, ...profiles[0] });
        }
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSave = async () => {
    setIsSaving(true);
    setError("");
    setSaved(false);
    try {
      const payload = { ...form, user_id: user?.id };
      const profiles = await UserProfile.filter({ user_id: user?.id });
      if (profiles?.length) {
        await UserProfile.update(profiles[0].id, payload);
      } else {
        await UserProfile.create(payload);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setError("Lưu thất bại. Vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };

  const eoiScore = calcEOI(form);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <AlertCircle className="h-10 w-10 text-amber-500" />
        <p className="text-gray-700 font-medium">Bạn cần đăng nhập để xem hồ sơ.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <div className="bg-gray-950 text-white px-4 py-6">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Hồ Sơ Của Tôi</h1>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Personal Info */}
        <Section title="Thông Tin Cá Nhân" Icon={User}>
          <Field label="Họ và tên">
            <input className={input} value={form.full_name} onChange={(e) => set("full_name", e.target.value)} placeholder="Nguyễn Văn A" />
          </Field>
          <Field label="Ngày sinh">
            <input className={input} type="date" value={form.date_of_birth} onChange={(e) => set("date_of_birth", e.target.value)} />
          </Field>
          <Field label="Tuổi">
            <input className={input} type="number" min="18" max="80" value={form.age} onChange={(e) => set("age", e.target.value)} placeholder="28" />
          </Field>
          <Field label="Quốc tịch">
            <input className={input} value={form.nationality} onChange={(e) => set("nationality", e.target.value)} placeholder="Vietnam" />
          </Field>
          <Field label="Số hộ chiếu">
            <input className={input} value={form.passport_number} onChange={(e) => set("passport_number", e.target.value)} placeholder="B1234567" />
          </Field>
        </Section>

        {/* Education & English */}
        <Section title="Học Vấn & Tiếng Anh" Icon={GraduationCap}>
          <Field label="Trình độ học vấn cao nhất">
            <select className={input} value={form.highest_education} onChange={(e) => set("highest_education", e.target.value)}>
              <option value="">— Chọn —</option>
              {EDU_POINTS.map((e) => (
                <option key={e.label} value={e.label}>{e.label}</option>
              ))}
            </select>
          </Field>
          <Field label="Điểm EOI — Học vấn">
            <select className={input} value={form.education_points} onChange={(e) => set("education_points", e.target.value)}>
              {EDU_POINTS.map((e) => (
                <option key={e.points} value={e.points}>{e.points} điểm — {e.label}</option>
              ))}
            </select>
          </Field>
          <Field label="Điểm IELTS tổng thể">
            <input className={input} type="number" step="0.5" min="0" max="9" value={form.ielts_overall} onChange={(e) => set("ielts_overall", e.target.value)} placeholder="7.0" />
          </Field>
          <Field label="Mức tiếng Anh (EOI)">
            <select className={input} value={form.english_points} onChange={(e) => set("english_points", e.target.value)}>
              {ENGLISH_POINTS.map((e) => (
                <option key={e.points} value={e.points}>{e.points} điểm — {e.label}</option>
              ))}
            </select>
          </Field>
        </Section>

        {/* Occupation & Visa */}
        <Section title="Nghề Nghiệp & Visa" Icon={Briefcase}>
          <Field label="Nghề nghiệp">
            <input className={input} value={form.occupation} onChange={(e) => set("occupation", e.target.value)} placeholder="Software Engineer" />
          </Field>
          <Field label="Mã ANZSCO">
            <input className={input} value={form.anzsco_code} onChange={(e) => set("anzsco_code", e.target.value)} placeholder="261313" />
          </Field>
          <Field label="Visa hiện tại">
            <select className={input} value={form.current_visa} onChange={(e) => set("current_visa", e.target.value)}>
              <option value="">— Chọn —</option>
              {["500 (Sinh viên)", "485 (Tốt nghiệp)", "482 (Lao động)", "189 (PR kỹ năng)", "190 (PR bang)", "491 (Vùng)", "858 (Nhân tài)", "Khác"].map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </Field>
          <Field label="Visa mục tiêu">
            <select className={input} value={form.target_visa} onChange={(e) => set("target_visa", e.target.value)}>
              <option value="">— Chọn —</option>
              {["189 (PR kỹ năng độc lập)", "190 (PR bang bảo lãnh)", "491 (Vùng nông thôn)", "482 (Lao động tay nghề)", "858 (Nhân tài toàn cầu)"].map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </Field>
          <Field label="Năm kinh nghiệm tại Úc">
            <select className={input} value={form.aus_work_years_points} onChange={(e) => set("aus_work_years_points", e.target.value)}>
              {AUS_EXP_POINTS.map((e) => (
                <option key={e.points} value={e.points}>{e.points} điểm — {e.label}</option>
              ))}
            </select>
          </Field>
          <Field label="Năm kinh nghiệm ở nước ngoài">
            <select className={input} value={form.overseas_exp_points} onChange={(e) => set("overseas_exp_points", e.target.value)}>
              {OVERSEAS_EXP_POINTS.map((e) => (
                <option key={e.points} value={e.points}>{e.points} điểm — {e.label}</option>
              ))}
            </select>
          </Field>
        </Section>

        {/* Bonus Points */}
        <Section title="Điểm Cộng Thêm" Icon={Award}>
          <div className="grid grid-cols-1 gap-3">
            {[
              { key: "regional_study", label: "Học tại vùng nông thôn Úc (+5)", desc: "Học ít nhất 2 năm tại vùng regional của Úc" },
              { key: "naati",          label: "Chứng chỉ NAATI CCL (+5)",        desc: "Có chứng chỉ phiên dịch NAATI CCL hợp lệ" },
              { key: "professional_year", label: "Professional Year (+5)",       desc: "Hoàn thành chương trình Professional Year tại Úc" },
              { key: "community_language", label: "Ngôn ngữ cộng đồng (+5)",   desc: "Vợ/chồng đạt Competent English" },
              { key: "spouse_english", label: "Vợ/chồng Proficient English (+5)", desc: "Vợ/chồng đạt IELTS 7.0+" },
            ].map(({ key, label, desc }) => (
              <label key={key} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
                <input type="checkbox" checked={!!form[key]} onChange={(e) => set(key, e.target.checked)} className="mt-1 h-4 w-4 accent-gray-900" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{label}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              </label>
            ))}
          </div>
        </Section>

        {/* EOI Score Calculator */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <button
            className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
            onClick={() => setShowEOI(!showEOI)}
          >
            <div className="flex items-center gap-3">
              <Calculator className="h-5 w-5 text-gray-700" />
              <div>
                <p className="font-semibold text-gray-900">Điểm EOI Ước Tính</p>
                <p className="text-xs text-gray-500">Dựa trên thông tin bạn đã nhập</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={`text-lg font-bold px-4 py-1 ${eoiScore >= 90 ? "bg-emerald-100 text-emerald-800" : eoiScore >= 75 ? "bg-blue-100 text-blue-800" : "bg-amber-100 text-amber-800"}`}>
                {eoiScore} điểm
              </Badge>
              {showEOI ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
            </div>
          </button>
          {showEOI && (
            <div className="px-5 pb-5 border-t border-gray-100 pt-4">
              <div className="space-y-2 text-sm">
                {[
                  { label: "Tuổi", pts: (() => { const a = parseInt(form.age); if (a>=18&&a<=24) return 25; if (a>=25&&a<=32) return 30; if (a>=33&&a<=39) return 25; if (a>=40&&a<=44) return 15; return 0; })() },
                  { label: "Tiếng Anh", pts: parseInt(form.english_points || 0) },
                  { label: "Học vấn",   pts: parseInt(form.education_points || 0) },
                  { label: "KN tại Úc", pts: parseInt(form.aus_work_years_points || 0) },
                  { label: "KN nước ngoài", pts: parseInt(form.overseas_exp_points || 0) },
                  { label: "Học vùng rural", pts: form.regional_study ? 5 : 0 },
                  { label: "NAATI CCL", pts: form.naati ? 5 : 0 },
                  { label: "Professional Year", pts: form.professional_year ? 5 : 0 },
                  { label: "Ngôn ngữ cộng đồng", pts: form.community_language ? 5 : 0 },
                  { label: "Vợ/chồng English", pts: form.spouse_english ? 5 : 0 },
                ].map(({ label, pts }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-gray-600">{label}</span>
                    <span className={`font-semibold ${pts > 0 ? "text-emerald-600" : "text-gray-300"}`}>+{pts}</span>
                  </div>
                ))}
                <div className="border-t border-gray-100 pt-2 flex items-center justify-between font-bold text-gray-900 text-base">
                  <span>Tổng EOI</span>
                  <span>{eoiScore} điểm</span>
                </div>
              </div>
              {eoiScore >= 90 && (
                <p className="mt-3 text-xs text-emerald-700 bg-emerald-50 rounded-xl p-3">
                  🎉 Điểm EOI của bạn rất cao! Bạn có cơ hội lớn được mời qua SkillSelect.
                </p>
              )}
              {eoiScore >= 65 && eoiScore < 90 && (
                <p className="mt-3 text-xs text-blue-700 bg-blue-50 rounded-xl p-3">
                  ✅ Điểm EOI khá tốt. Hãy tập trung cải thiện tiếng Anh hoặc kinh nghiệm để tăng điểm.
                </p>
              )}
              {eoiScore < 65 && (
                <p className="mt-3 text-xs text-amber-700 bg-amber-50 rounded-xl p-3">
                  ⚠️ Điểm EOI chưa đủ cao. Hãy cải thiện tiếng Anh (IELTS 8+) hoặc tích lũy thêm kinh nghiệm làm việc tại Úc.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Save */}
        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 rounded-xl p-3">
            <AlertCircle className="h-4 w-4 flex-shrink-0" /> {error}
          </div>
        )}
        {saved && (
          <div className="flex items-center gap-2 text-emerald-700 text-sm bg-emerald-50 rounded-xl p-3">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" /> Hồ sơ đã được lưu thành công!
          </div>
        )}
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white h-12 text-base font-semibold"
        >
          {isSaving ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          {isSaving ? "Đang lưu..." : "Lưu Hồ Sơ"}
        </Button>
      </div>
    </div>
  );
}

// ── Helper sub-components ─────────────────────────────────────────────────────
const input = "w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition";

function Section({ title, Icon, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="h-5 w-5 text-gray-700" />
        <h2 className="font-semibold text-gray-900">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
      {children}
    </div>
  );
}