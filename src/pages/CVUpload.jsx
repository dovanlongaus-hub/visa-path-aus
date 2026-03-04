import { useState, useRef } from "react";
import PremiumGate from "@/components/PremiumGate";
import { base44 } from "@/api/base44Client";
import { Upload, FileText, Loader2, CheckCircle, User, Briefcase, GraduationCap, Globe, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const EXTRACT_SCHEMA = {
  type: "object",
  properties: {
    full_name: { type: "string" },
    email: { type: "string" },
    phone: { type: "string" },
    date_of_birth: { type: "string" },
    nationality: { type: "string" },
    passport_number: { type: "string" },
    university: { type: "string" },
    course: { type: "string" },
    graduation_year: { type: "string" },
    english_test_type: { type: "string" },
    english_score: { type: "string" },
    occupation_code: { type: "string" },
    occupation_title: { type: "string" },
    employment_history: { type: "string" },
    education_history: { type: "string" },
    skills: { type: "string" },
    address: { type: "string" },
  },
};

export default function CVUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [extracted, setExtracted] = useState(null);
  const [savedProfile, setSavedProfile] = useState(false);
  const fileRef = useRef();

  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
    setExtracted(null);
    setSavedProfile(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const processCV = async () => {
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setUploading(false);
    setExtracting(true);

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Bạn là chuyên gia di trú Úc. Từ CV hoặc tài liệu này, hãy trích xuất thông tin cá nhân, học vấn, kinh nghiệm làm việc và kỹ năng để điền vào hồ sơ di trú Úc. Hãy điền đầy đủ mọi trường bạn tìm thấy. Đối với các trường không có thông tin, để trống. Trả về JSON theo schema yêu cầu.`,
      file_urls: [file_url],
      response_json_schema: EXTRACT_SCHEMA,
    });

    setExtracted({ ...result, cv_url: file_url });
    setExtracting(false);
  };

  const saveProfile = async () => {
    if (!extracted) return;
    await base44.entities.UserProfile.create(extracted);
    setSavedProfile(true);
  };

  const exportForms = () => {
    if (!extracted) return;
    const lines = [
      "=== THÔNG TIN TRÍCH XUẤT TỪ CV ===",
      `Họ tên: ${extracted.full_name || ""}`,
      `Email: ${extracted.email || ""}`,
      `Điện thoại: ${extracted.phone || ""}`,
      `Ngày sinh: ${extracted.date_of_birth || ""}`,
      `Quốc tịch: ${extracted.nationality || ""}`,
      `Số hộ chiếu: ${extracted.passport_number || ""}`,
      "",
      "=== HỌC VẤN ===",
      `Trường: ${extracted.university || ""}`,
      `Ngành học: ${extracted.course || ""}`,
      `Năm tốt nghiệp: ${extracted.graduation_year || ""}`,
      `Loại bằng tiếng Anh: ${extracted.english_test_type || ""}`,
      `Điểm tiếng Anh: ${extracted.english_score || ""}`,
      "",
      "=== NGHỀ NGHIỆP ===",
      `ANZSCO Code: ${extracted.occupation_code || ""}`,
      `Chức danh: ${extracted.occupation_title || ""}`,
      "",
      "=== KINH NGHIỆM LÀM VIỆC ===",
      extracted.employment_history || "",
      "",
      "=== KỸ NĂNG ===",
      extracted.skills || "",
      "",
      `*Trích xuất bởi Úc Di Trú AI – ${new Date().toLocaleDateString("vi-VN")}*`,
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ho_so_dieu_kien_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
  };

  return (
    <PremiumGate featureName="Upload CV">
      <div className="min-h-screen bg-[#f8f9fc]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 text-white py-16">
        <div className="absolute inset-0 opacity-10">
          <img src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&q=80" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-4">Upload CV & Nhận Tư Vấn Chuyên Sâu</h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">AI phân tích CV → Trích xuất thông tin → Đề xuất tạo lại CV phù hợp visa pathway của bạn</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-10"></div>

        {/* Upload Zone */}
         {!extracted && (
          <div className="bg-white rounded-3xl border-2 border-gray-100 p-8 md:p-12 shadow-lg">
            <div
              className="border-3 border-dashed border-blue-200 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-12 text-center cursor-pointer hover:border-blue-400 hover:from-blue-100 hover:to-indigo-100 transition-all"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileRef.current.click()}
            >
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => handleFile(e.target.files[0])}
              />
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                <Upload className="w-10 h-10 text-white" />
              </div>
              {file ? (
                <div>
                  <div className="flex items-center justify-center gap-2 text-[#0a1628] font-bold text-lg mb-2">
                    <FileText className="w-6 h-6 text-blue-600" />
                    {file.name}
                  </div>
                  <p className="text-sm text-gray-400">📁 {(file.size / 1024).toFixed(0)} KB • Sẵn sàng phân tích</p>
                </div>
              ) : (
                <div>
                  <p className="font-bold text-[#0a1628] text-lg mb-2">📄 Kéo thả hoặc click để chọn CV</p>
                  <p className="text-sm text-gray-500">Hỗ trợ PDF, Word, JPG, PNG, TXT</p>
                </div>
              )}
            </div>
          </div>
        )}

        {file && !extracted && (
          <button
            onClick={processCV}
            disabled={uploading || extracting}
            className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-semibold text-lg hover:opacity-90 disabled:opacity-60 transition-all flex items-center justify-center gap-3"
          >
            {uploading || extracting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {uploading ? "Đang tải file..." : "AI đang phân tích CV..."}
              </>
            ) : (
              <>✨ Phân tích CV & Trích xuất thông tin</>
            )}
          </button>
        )}

        {/* Results */}
         {extracted && (
          <div className="space-y-5">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-emerald-800 text-lg">✨ Trích xuất thành công!</div>
                <div className="text-sm text-emerald-600">AI đã phân tích CV. Bạn có thể lưu, xuất hoặc tạo lại CV tối ưu cho di trú Úc.</div>
              </div>
            </div>

            {/* Personal Info */}
            <InfoSection
              icon={User}
              title="Thông tin cá nhân"
              color="blue"
              fields={[
                { label: "Họ tên", val: extracted.full_name },
                { label: "Email", val: extracted.email },
                { label: "Điện thoại", val: extracted.phone },
                { label: "Ngày sinh", val: extracted.date_of_birth },
                { label: "Quốc tịch", val: extracted.nationality },
                { label: "Số hộ chiếu", val: extracted.passport_number },
                { label: "Địa chỉ", val: extracted.address },
              ]}
            />

            <InfoSection
              icon={GraduationCap}
              title="Học vấn & Tiếng Anh"
              color="violet"
              fields={[
                { label: "Trường", val: extracted.university },
                { label: "Ngành học", val: extracted.course },
                { label: "Năm tốt nghiệp", val: extracted.graduation_year },
                { label: "Loại bằng tiếng Anh", val: extracted.english_test_type },
                { label: "Điểm", val: extracted.english_score },
              ]}
            />

            <InfoSection
              icon={Briefcase}
              title="Nghề nghiệp & Kinh nghiệm"
              color="amber"
              fields={[
                { label: "ANZSCO Code", val: extracted.occupation_code },
                { label: "Chức danh", val: extracted.occupation_title },
                { label: "Kinh nghiệm", val: extracted.employment_history },
                { label: "Kỹ năng", val: extracted.skills },
              ]}
            />

            <div className="grid md:grid-cols-3 gap-3 pt-6 border-t border-gray-100">
              <button
                onClick={saveProfile}
                disabled={savedProfile}
                className="bg-gradient-to-r from-[#0f2347] to-[#1a3a6e] text-white py-3 rounded-xl font-semibold hover:shadow-lg disabled:opacity-60 transition-all flex items-center justify-center gap-2"
              >
                {savedProfile ? <CheckCircle className="w-5 h-5" /> : <User className="w-5 h-5" />}
                {savedProfile ? "✓ Đã lưu hồ sơ" : "Lưu vào hồ sơ"}
              </button>
              <button
                onClick={exportForms}
                className="border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:border-blue-300 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" /> Xuất TXT
              </button>
              <Link
                to={createPageUrl("Forms")}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 text-center"
              >
                <FileText className="w-5 h-5" /> Mở biểu mẫu
              </Link>
            </div>

            <button
              onClick={() => { setFile(null); setExtracted(null); setSavedProfile(false); }}
              className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors pt-4"
            >
              ↺ Upload CV khác để phân tích
            </button>
          </div>
        )}
      </div>
      </div>
    </PremiumGate>
  );
}

function InfoSection({ icon: Icon, title, color, fields }) {
  const colorMap = {
    blue: { bg: "bg-gradient-to-br from-blue-50 to-cyan-50", border: "border-blue-200", icon: "bg-blue-100 text-blue-600", titleColor: "text-blue-800" },
    violet: { bg: "bg-gradient-to-br from-violet-50 to-purple-50", border: "border-violet-200", icon: "bg-violet-100 text-violet-600", titleColor: "text-violet-800" },
    amber: { bg: "bg-gradient-to-br from-amber-50 to-orange-50", border: "border-amber-200", icon: "bg-amber-100 text-amber-600", titleColor: "text-amber-800" },
  };
  const c = colorMap[color];
  const hasData = fields.some((f) => f.val);
  if (!hasData) return null;

  return (
    <div className={`${c.bg} border-2 ${c.border} rounded-2xl p-6 shadow-sm`}>
      <div className="flex items-center gap-3 mb-5">
        <div className={`w-10 h-10 rounded-xl ${c.icon} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className={`font-bold text-lg ${c.titleColor}`}>{title}</span>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {fields.filter((f) => f.val).map((f, i) => (
          <div key={i}>
            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">{f.label}</div>
            <div className="text-sm text-gray-900 font-medium break-words leading-relaxed">{f.val}</div>
          </div>
        ))}
      </div>
    </div>
  );
}