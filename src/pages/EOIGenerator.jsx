import { useState, useEffect } from "react";
import PremiumGate from "@/components/PremiumGate";
import { base44 } from "@/api/base44Client";
import { Loader2, CheckCircle, Download, RefreshCw, User, Sparkles, Briefcase, Globe, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { entities } from '@/api/supabaseClient';
import { invokeLLMSmart } from '@/api/aiClient';

// ─── Helpers ───────────────────────────────────────────────────

function calcEOIPoints(profile) {
  let total = 0;
  const items = [];
  const now = new Date();

  // Age
  if (profile.date_of_birth) {
    const age = Math.floor((now - new Date(profile.date_of_birth)) / (365.25 * 24 * 3600 * 1000));
    if (age >= 18 && age <= 24) { total += 25; items.push({ label: "Tuổi 18–24", pts: 25 }); }
    else if (age >= 25 && age <= 32) { total += 30; items.push({ label: "Tuổi 25–32", pts: 30 }); }
    else if (age >= 33 && age <= 39) { total += 25; items.push({ label: "Tuổi 33–39", pts: 25 }); }
    else if (age >= 40 && age <= 44) { total += 15; items.push({ label: "Tuổi 40–44", pts: 15 }); }
  }

  // English
  const score = parseFloat(profile.english_score) || 0;
  if (profile.english_test_type === "IELTS") {
    if (score >= 8.0) { total += 20; items.push({ label: "IELTS ≥8.0 (Superior)", pts: 20 }); }
    else if (score >= 7.0) { total += 10; items.push({ label: "IELTS ≥7.0 (Proficient)", pts: 10 }); }
    else if (score >= 6.0) { items.push({ label: "IELTS ≥6.0 (Competent)", pts: 0 }); }
  } else if (profile.english_test_type === "PTE") {
    if (score >= 79) { total += 20; items.push({ label: "PTE ≥79 (Superior)", pts: 20 }); }
    else if (score >= 65) { total += 10; items.push({ label: "PTE ≥65 (Proficient)", pts: 10 }); }
  }

  // Education
  if (profile.education_level === "doctorate") { total += 20; items.push({ label: "Tiến sĩ tại Úc", pts: 20 }); }
  else if (profile.education_level === "masters") { total += 15; items.push({ label: "Thạc sĩ tại Úc", pts: 15 }); }
  else if (profile.education_level === "bachelors") { total += 10; items.push({ label: "Đại học tại Úc", pts: 10 }); }

  // Aus work experience
  const auExp = parseInt(profile.australia_work_years) || 0;
  if (auExp >= 8) { total += 20; items.push({ label: "KN làm việc tại Úc ≥8 năm", pts: 20 }); }
  else if (auExp >= 5) { total += 15; items.push({ label: "KN làm việc tại Úc 5–7 năm", pts: 15 }); }
  else if (auExp >= 3) { total += 10; items.push({ label: "KN làm việc tại Úc 3–4 năm", pts: 10 }); }
  else if (auExp >= 1) { total += 5; items.push({ label: "KN làm việc tại Úc 1–2 năm", pts: 5 }); }

  // Regional study
  if (profile.regional_study === "yes") { total += 5; items.push({ label: "Học tập vùng địa phương", pts: 5 }); }

  // Skills assessment
  if (profile.skills_assessment_done) { items.push({ label: "Skills Assessment hoàn thành ✓", pts: 0, note: true }); }

  return { total, items };
}

// ─── EOIGenerator ──────────────────────────────────────────────

export default function EOIGenerator() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [mode, setMode] = useState("eoi"); // "eoi" | "cv"
  const [result, setResult] = useState(null);

  useEffect(() => {
    entities.UserProfile.list("-created_date", 1).then(list => {
      setProfile(list[0] || null);
      setLoading(false);
    });
  }, []);

  const generate = async () => {
    if (!profile) return;
    setGenerating(true);
    setResult(null);

    const profileText = `
Họ tên: ${profile.full_name || "N/A"}
Ngày sinh: ${profile.date_of_birth || "N/A"}
Quốc tịch: ${profile.nationality || "N/A"}
Visa hiện tại: ${profile.current_visa_type || "N/A"}
Trường học: ${profile.university || "N/A"}
Ngành học: ${profile.course || "N/A"}
Năm tốt nghiệp: ${profile.graduation_year || "N/A"}
Trình độ: ${profile.education_level || "N/A"}
Tiếng Anh: ${profile.english_test_type || ""} ${profile.english_score || "N/A"}
ANZSCO Code: ${profile.occupation_code || "N/A"}
KN làm việc tại Úc: ${profile.australia_work_years || 0} năm
Học vùng địa phương: ${profile.regional_study || "no"}
Skills Assessment: ${profile.skills_assessment_done ? "Đã hoàn thành" : "Chưa làm"}
Ghi chú: ${profile.notes || ""}
    `.trim();

    const { total, items } = calcEOIPoints(profile);

    if (mode === "eoi") {
      const res = await invokeLLMSmart(prompt, {
        prompt: `Bạn là chuyên gia di trú Úc. Dựa trên hồ sơ bên dưới, hãy tạo một bản EOI (Expression of Interest) hoàn chỉnh và chuyên nghiệp để nộp lên hệ thống SkillSelect cho visa PR (189/190/491).

Hồ sơ ứng viên:
${profileText}

Điểm EOI tính được: ${total} điểm
Chi tiết điểm: ${items.map(i => `${i.label}: +${i.pts || 0}`).join(", ")}

Yêu cầu:
1. Viết bằng tiếng Việt với các tiêu đề rõ ràng
2. Bao gồm: Thông tin cá nhân, Trình độ học vấn, Kinh nghiệm làm việc tại Úc, Kỹ năng ngôn ngữ, Bảng điểm EOI chi tiết, Lý do muốn định cư tại Úc (professional statement 200-300 từ), Khuyến nghị bước tiếp theo
3. Ghi rõ các điểm thiếu và cần bổ sung
4. Định dạng rõ ràng với các section headers`,
      });
      setResult({ type: "eoi", content: res, points: total, items });
    } else {
      const res = await invokeLLMSmart(prompt, {
        prompt: `Bạn là chuyên gia tư vấn nghề nghiệp và di trú Úc. Dựa trên hồ sơ bên dưới, hãy tạo một bản CV chuyên nghiệp chuẩn Úc (Australian-style CV) phù hợp cho mục đích xin việc và hỗ trợ hồ sơ di trú skilled.

Hồ sơ ứng viên:
${profileText}

Yêu cầu:
1. Format chuẩn CV Úc (tên, contact, professional summary, skills, education, experience, references)
2. Professional Summary 3-4 câu nêu bật điểm mạnh di trú
3. Làm nổi bật kinh nghiệm làm việc tại Úc
4. Bao gồm ANZSCO code và Skills Assessment status (quan trọng cho di trú)
5. Viết bằng tiếng Anh (CV chuẩn Úc)
6. Thêm phần "Immigration Status" để rõ ràng với nhà tuyển dụng sponsor`,
      });
      setResult({ type: "cv", content: res, points: total, items });
    }

    setGenerating(false);
  };

  const downloadResult = () => {
    if (!result) return;
    const blob = new Blob([result.content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = result.type === "eoi"
      ? `EOI_${profile?.full_name || "applicant"}_${new Date().toISOString().slice(0,10)}.txt`
      : `CV_${profile?.full_name || "applicant"}_${new Date().toISOString().slice(0,10)}.txt`;
    a.click();
  };

  if (loading) return (
    <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  );

  const { total, items } = profile ? calcEOIPoints(profile) : { total: 0, items: [] };

  return (
    <PremiumGate featureName="EOI & CV Generator">
      <div className="min-h-screen bg-[#f8f9fc]">
      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-[#0a1628]">Tạo EOI & CV tự động</h1>
          </div>
          <p className="text-gray-500">AI tự động tạo EOI hoặc CV chuyên nghiệp dựa trên hồ sơ của bạn – không cần nhập lại thông tin.</p>
        </div>

        {!profile ? (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
            <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
            <h3 className="font-bold text-[#0a1628] mb-2">Cần điền hồ sơ trước</h3>
            <p className="text-gray-500 text-sm mb-4">Bạn cần điền thông tin hồ sơ cá nhân để AI có thể tạo EOI/CV tự động.</p>
            <div className="flex gap-3 justify-center">
              <Link to={createPageUrl("Profile")} className="bg-[#0f2347] text-white px-6 py-2.5 rounded-xl font-medium hover:bg-[#1a3a6e] transition-colors">
                Điền hồ sơ ngay
              </Link>
              <Link to={createPageUrl("CVUpload")} className="border border-gray-200 text-gray-700 px-6 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                Upload CV
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">

            {/* Left – Profile summary + points */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-[#0a1628] text-sm">Hồ sơ hiện tại</span>
                </div>
                <div className="space-y-2 text-sm">
                  {[
                    { label: "Họ tên", val: profile.full_name },
                    { label: "Visa", val: profile.current_visa_type ? `Visa ${profile.current_visa_type}` : null },
                    { label: "Trường", val: profile.university },
                    { label: "Tiếng Anh", val: profile.english_test_type && profile.english_score ? `${profile.english_test_type} ${profile.english_score}` : null },
                    { label: "ANZSCO", val: profile.occupation_code },
                    { label: "KN tại Úc", val: profile.australia_work_years ? `${profile.australia_work_years} năm` : null },
                  ].filter(f => f.val).map((f, i) => (
                    <div key={i} className="flex justify-between gap-2">
                      <span className="text-gray-500">{f.label}</span>
                      <span className="font-medium text-[#0a1628] text-right">{f.val}</span>
                    </div>
                  ))}
                </div>
                <Link to={createPageUrl("Profile")} className="mt-4 block text-xs text-blue-600 hover:underline text-center">
                  Cập nhật hồ sơ →
                </Link>
              </div>

              {/* EOI Score */}
              <div className={`rounded-2xl border p-5 ${total >= 65 ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"}`}>
                <div className="text-center mb-3">
                  <div className={`text-4xl font-bold ${total >= 65 ? "text-emerald-600" : "text-amber-600"}`}>{total}</div>
                  <div className={`text-xs font-semibold mt-1 ${total >= 65 ? "text-emerald-700" : "text-amber-700"}`}>
                    {total >= 65 ? "✅ Đủ điểm nộp EOI" : "⚠️ Chưa đủ 65 điểm"}
                  </div>
                </div>
                <div className="space-y-1">
                  {items.map((item, i) => (
                    <div key={i} className="flex justify-between text-xs">
                      <span className="text-gray-600">{item.label}</span>
                      {!item.note && <span className="font-bold">{item.pts > 0 ? `+${item.pts}` : "0"}</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right – Generator */}
            <div className="md:col-span-2 space-y-4">

              {/* Mode selector */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <div className="font-semibold text-[#0a1628] mb-4">Chọn loại tài liệu cần tạo</div>
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <button
                    onClick={() => { setMode("eoi"); setResult(null); }}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${mode === "eoi" ? "border-violet-500 bg-violet-50" : "border-gray-200 hover:border-gray-300"}`}
                  >
                    <Globe className={`w-6 h-6 mb-2 ${mode === "eoi" ? "text-violet-600" : "text-gray-400"}`} />
                    <div className={`font-semibold text-sm ${mode === "eoi" ? "text-violet-700" : "text-gray-700"}`}>EOI SkillSelect</div>
                    <div className="text-xs text-gray-500 mt-1">Expression of Interest cho visa 189/190/491 – bao gồm bảng điểm, professional statement</div>
                  </button>
                  <button
                    onClick={() => { setMode("cv"); setResult(null); }}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${mode === "cv" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}
                  >
                    <Briefcase className={`w-6 h-6 mb-2 ${mode === "cv" ? "text-blue-600" : "text-gray-400"}`} />
                    <div className={`font-semibold text-sm ${mode === "cv" ? "text-blue-700" : "text-gray-700"}`}>CV Chuẩn Úc</div>
                    <div className="text-xs text-gray-500 mt-1">Australian-style CV có ANZSCO, Skills Assessment & Immigration Status rõ ràng</div>
                  </button>
                </div>

                <button
                  onClick={generate}
                  disabled={generating}
                  className={`w-full py-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 ${
                    mode === "eoi"
                      ? "bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90"
                      : "bg-gradient-to-r from-blue-600 to-sky-600 hover:opacity-90"
                  } disabled:opacity-60`}
                >
                  {generating ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> AI đang soạn thảo...</>
                  ) : (
                    <><Sparkles className="w-5 h-5" /> Tạo {mode === "eoi" ? "EOI" : "CV"} tự động</>
                  )}
                </button>
              </div>

              {/* Result */}
              {result && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                      <span className="font-semibold text-[#0a1628]">
                        {result.type === "eoi" ? "EOI đã được tạo" : "CV đã được tạo"}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={generate} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button onClick={downloadResult} className="flex items-center gap-1.5 text-sm bg-[#0f2347] text-white px-3 py-1.5 rounded-lg hover:bg-[#1a3a6e] transition-colors">
                        <Download className="w-3.5 h-3.5" /> Tải về
                      </button>
                    </div>
                  </div>
                  <div className="px-5 py-4 max-h-[500px] overflow-y-auto">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">{result.content}</pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      </div>
    </PremiumGate>
  );
}