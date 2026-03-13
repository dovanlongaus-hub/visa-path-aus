import { useState, useEffect } from "react";
import { User, Save, Loader2, CheckCircle, Calculator } from "lucide-react";
import { entities } from '@/api/supabaseClient';
import MyAccount from "@/components/MyAccount";

const POINTS_RULES = {
  age: [
    { label: "18-24", points: 25, check: (dob) => { const age = getAge(dob); return age >= 18 && age <= 24; } },
    { label: "25-32", points: 30, check: (dob) => { const age = getAge(dob); return age >= 25 && age <= 32; } },
    { label: "33-39", points: 25, check: (dob) => { const age = getAge(dob); return age >= 33 && age <= 39; } },
    { label: "40-44", points: 15, check: (dob) => { const age = getAge(dob); return age >= 40 && age <= 44; } },
    { label: "45+", points: 0, check: (dob) => getAge(dob) >= 45 },
  ],
  english: [
    { label: "Competent (IELTS 6.0)", points: 0, key: "competent" },
    { label: "Proficient (IELTS 7.0+)", points: 10, key: "proficient" },
    { label: "Superior (IELTS 8.0+)", points: 20, key: "superior" },
  ],
};

function getAge(dob) {
  if (!dob) return 0;
  const birth = new Date(dob);
  const now = new Date();
  return Math.floor((now - birth) / (365.25 * 24 * 60 * 60 * 1000));
}

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [points, setPoints] = useState(null);

  useEffect(() => {
    entities.UserProfile.list("-created_date", 1).then((list) => {
      if (list.length > 0) {
        setProfile(list[0]);
        setForm(list[0]);
      }
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    if (profile) {
      await entities.UserProfile.update(profile.id, form);
    } else {
      const created = await entities.UserProfile.create(form);
      setProfile(created);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const calcPoints = () => {
    let total = 0;
    const breakdown = [];

    // Age
    const age = getAge(form.date_of_birth);
    if (age >= 18 && age <= 24) { total += 25; breakdown.push({ label: "Tuổi (18-24)", pts: 25 }); }
    else if (age >= 25 && age <= 32) { total += 30; breakdown.push({ label: "Tuổi (25-32)", pts: 30 }); }
    else if (age >= 33 && age <= 39) { total += 25; breakdown.push({ label: "Tuổi (33-39)", pts: 25 }); }
    else if (age >= 40 && age <= 44) { total += 15; breakdown.push({ label: "Tuổi (40-44)", pts: 15 }); }

    // English
    const score = parseFloat(form.english_score) || 0;
    if (form.english_test_type === "IELTS") {
      if (score >= 8.0) { total += 20; breakdown.push({ label: "Tiếng Anh Superior (IELTS 8.0+)", pts: 20 }); }
      else if (score >= 7.0) { total += 10; breakdown.push({ label: "Tiếng Anh Proficient (IELTS 7.0+)", pts: 10 }); }
      else if (score >= 6.0) { total += 0; breakdown.push({ label: "Tiếng Anh Competent (IELTS 6.0)", pts: 0 }); }
    } else if (form.english_test_type === "PTE") {
      if (score >= 79) { total += 20; breakdown.push({ label: "Tiếng Anh Superior (PTE 79+)", pts: 20 }); }
      else if (score >= 65) { total += 10; breakdown.push({ label: "Tiếng Anh Proficient (PTE 65+)", pts: 10 }); }
    }

    // Education
    if (form.education_level === "doctorate") { total += 20; breakdown.push({ label: "Bằng Tiến sĩ tại Úc", pts: 20 }); }
    else if (form.education_level === "masters") { total += 15; breakdown.push({ label: "Bằng Thạc sĩ tại Úc", pts: 15 }); }
    else if (form.education_level === "bachelors") { total += 10; breakdown.push({ label: "Bằng Đại học tại Úc", pts: 10 }); }

    // Work exp in Australia
    const auExp = parseInt(form.australia_work_years) || 0;
    if (auExp >= 8) { total += 20; breakdown.push({ label: "Kinh nghiệm làm việc tại Úc 8+ năm", pts: 20 }); }
    else if (auExp >= 5) { total += 15; breakdown.push({ label: "Kinh nghiệm làm việc tại Úc 5-7 năm", pts: 15 }); }
    else if (auExp >= 3) { total += 10; breakdown.push({ label: "Kinh nghiệm làm việc tại Úc 3-4 năm", pts: 10 }); }
    else if (auExp >= 1) { total += 5; breakdown.push({ label: "Kinh nghiệm làm việc tại Úc 1-2 năm", pts: 5 }); }

    // Regional study
    if (form.regional_study === "yes") { total += 5; breakdown.push({ label: "Học tập tại vùng địa phương", pts: 5 }); }

    setPoints({ total, breakdown });
  };

  const field = (key, label, type = "text", options = null) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {options ? (
        <select
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 bg-white"
          value={form[key] || ""}
          onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
        >
          <option value="">-- Chọn --</option>
          {options.map((o) => <option key={o.val} value={o.val}>{o.label}</option>)}
        </select>
      ) : (
        <input
          type={type}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          value={form[key] || ""}
          onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
        />
      )}
    </div>
  );

  if (loading) return (
    <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0a1628] mb-2">Hồ sơ cá nhân</h1>
          <p className="text-gray-500">Lưu thông tin để tự động điền vào các biểu mẫu di trú</p>
        </div>

        {/* My Account section */}
        <div className="mb-8">
          <MyAccount />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left - Form */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <span className="font-semibold text-[#0a1628]">Thông tin cá nhân</span>
              </div>
              <div className="space-y-3">
                {field("full_name", "Họ và tên đầy đủ")}
                {field("email", "Email", "email")}
                {field("phone", "Số điện thoại")}
                {field("date_of_birth", "Ngày sinh", "date")}
                {field("nationality", "Quốc tịch")}
                {field("passport_number", "Số hộ chiếu")}
                {field("passport_expiry", "Hộ chiếu hết hạn", "date")}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="font-semibold text-[#0a1628] mb-3">Học vấn & Tiếng Anh</div>
              <div className="space-y-3">
                {field("university", "Trường đại học tại Úc")}
                {field("course", "Ngành học")}
                {field("graduation_year", "Năm tốt nghiệp")}
                {field("education_level", "Trình độ học vấn", "text", [
                  { val: "bachelors", label: "Đại học (Bachelor)" },
                  { val: "masters", label: "Thạc sĩ (Master)" },
                  { val: "doctorate", label: "Tiến sĩ (PhD)" },
                ])}
                {field("english_test_type", "Loại bằng tiếng Anh", "text", [
                  { val: "IELTS", label: "IELTS" },
                  { val: "PTE", label: "PTE Academic" },
                  { val: "TOEFL", label: "TOEFL iBT" },
                  { val: "OET", label: "OET" },
                ])}
                {field("english_score", "Điểm tổng thể")}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="font-semibold text-[#0a1628] mb-3">Nghề nghiệp & Di trú</div>
              <div className="space-y-3">
                {field("occupation_code", "ANZSCO Code")}
                {field("current_visa_type", "Visa hiện tại", "text", [
                  { val: "500", label: "Visa 500 – Sinh viên" },
                  { val: "485", label: "Visa 485 – Tốt nghiệp" },
                  { val: "189", label: "Visa 189 – Skilled Independent" },
                  { val: "190", label: "Visa 190 – State Nominated" },
                  { val: "491", label: "Visa 491 – Regional" },
                ])}
                {field("current_visa_expiry", "Visa hết hạn", "date")}
                {field("australia_work_years", "Năm kinh nghiệm làm việc tại Úc", "number")}
                {field("regional_study", "Học tại vùng địa phương?", "text", [
                  { val: "yes", label: "Có" },
                  { val: "no", label: "Không" },
                ])}
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-[#0f2347] text-white py-3 rounded-xl font-medium hover:bg-[#1a3a6e] disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saved ? "Đã lưu!" : saving ? "Đang lưu..." : "Lưu hồ sơ"}
            </button>
          </div>

          {/* Right - Points Calculator */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Calculator className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="font-semibold text-[#0a1628]">Tính điểm EOI</span>
              </div>
              <p className="text-sm text-gray-500 mb-4">Dựa trên thông tin hồ sơ, ước tính điểm EOI SkillSelect của bạn</p>
              <button
                onClick={calcPoints}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Calculator className="w-4 h-4" /> Tính điểm EOI
              </button>

              {points && (
                <div className="mt-4">
                  <div className={`text-center py-4 rounded-xl mb-4 ${points.total >= 65 ? "bg-emerald-50 border border-emerald-200" : "bg-amber-50 border border-amber-200"}`}>
                    <div className={`text-4xl font-bold ${points.total >= 65 ? "text-emerald-600" : "text-amber-600"}`}>{points.total}</div>
                    <div className={`text-sm font-medium mt-1 ${points.total >= 65 ? "text-emerald-700" : "text-amber-700"}`}>
                      {points.total >= 65 ? "✅ Đủ điểm nộp EOI!" : "⚠️ Chưa đủ 65 điểm tối thiểu"}
                    </div>
                  </div>
                  <div className="space-y-2">
                    {points.breakdown.map((b, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-gray-600">{b.label}</span>
                        <span className="font-semibold text-[#0a1628]">+{b.pts}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-3">* Đây là ước tính sơ bộ. Sử dụng Points Calculator chính thức của DIBP để tính chính xác.</p>
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="bg-[#0f2347] rounded-2xl p-5 text-white">
              <div className="font-semibold mb-3">📊 Thang điểm EOI</div>
              <div className="space-y-2 text-sm text-blue-200">
                <div className="flex justify-between"><span>Tuổi 25-32</span><span className="text-white font-semibold">30 điểm</span></div>
                <div className="flex justify-between"><span>IELTS 8.0+ (Superior)</span><span className="text-white font-semibold">20 điểm</span></div>
                <div className="flex justify-between"><span>Bằng PhD tại Úc</span><span className="text-white font-semibold">20 điểm</span></div>
                <div className="flex justify-between"><span>KN làm việc tại Úc 8+ năm</span><span className="text-white font-semibold">20 điểm</span></div>
                <div className="flex justify-between"><span>Tiểu bang bảo lãnh 190</span><span className="text-white font-semibold">+5 điểm</span></div>
                <div className="flex justify-between"><span>Tiểu bang bảo lãnh 491</span><span className="text-white font-semibold">+15 điểm</span></div>
                <div className="border-t border-white/20 pt-2 flex justify-between">
                  <span>Điểm tối thiểu để nộp EOI</span>
                  <span className="text-emerald-400 font-bold">65 điểm</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}