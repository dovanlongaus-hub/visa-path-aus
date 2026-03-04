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
          <div
            className="border-2 border-dashed border-gray-200 rounded-2xl bg-white p-10 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all"
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
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-blue-600" />
            </div>
            {file ? (
              <div>
                <div className="flex items-center justify-center gap-2 text-[#0a1628] font-semibold mb-1">
                  <FileText className="w-5 h-5 text-blue-600" />
                  {file.name}
                </div>
                <p className="text-sm text-gray-400">{(file.size / 1024).toFixed(0)} KB</p>
              </div>
            ) : (
              <div>
                <p className="font-semibold text-[#0a1628] mb-1">Kéo thả hoặc click để chọn file</p>
                <p className="text-sm text-gray-400">Hỗ trợ: PDF, Word, JPG, PNG, TXT</p>
              </div>
            )}
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
          <div className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0" />
              <div>
                <div className="font-semibold text-emerald-800">Trích xuất thành công!</div>
                <div className="text-sm text-emerald-600">AI đã phân tích CV và điền thông tin vào hồ sơ</div>
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

            <div className="grid md:grid-cols-3 gap-3 pt-2">
              <button
                onClick={saveProfile}
                disabled={savedProfile}
                className="bg-[#0f2347] text-white py-3 rounded-xl font-medium hover:bg-[#1a3a6e] disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
              >
                {savedProfile ? <CheckCircle className="w-4 h-4" /> : <User className="w-4 h-4" />}
                {savedProfile ? "Đã lưu hồ sơ!" : "Lưu vào hồ sơ"}
              </button>
              <button
                onClick={exportForms}
                className="border border-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> Xuất file TXT
              </button>
              <Link
                to={createPageUrl("Forms")}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-center"
              >
                <FileText className="w-4 h-4" /> Mở & điền form
              </Link>
            </div>

            <button
              onClick={() => { setFile(null); setExtracted(null); setSavedProfile(false); }}
              className="w-full text-sm text-gray-400 hover:text-gray-600 transition-colors pt-2"
            >
              Upload CV khác
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
    blue: { bg: "bg-blue-50", border: "border-blue-100", icon: "bg-blue-100 text-blue-600" },
    violet: { bg: "bg-violet-50", border: "border-violet-100", icon: "bg-violet-100 text-violet-600" },
    amber: { bg: "bg-amber-50", border: "border-amber-100", icon: "bg-amber-100 text-amber-600" },
  };
  const c = colorMap[color];
  const hasData = fields.some((f) => f.val);
  if (!hasData) return null;

  return (
    <div className={`${c.bg} border ${c.border} rounded-2xl p-5`}>
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-8 h-8 rounded-lg ${c.icon} flex items-center justify-center`}>
          <Icon className="w-4 h-4" />
        </div>
        <span className="font-semibold text-[#0a1628]">{title}</span>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        {fields.filter((f) => f.val).map((f, i) => (
          <div key={i}>
            <div className="text-xs text-gray-500 mb-0.5">{f.label}</div>
            <div className="text-sm text-gray-800 font-medium break-words">{f.val}</div>
          </div>
        ))}
      </div>
    </div>
  );
}