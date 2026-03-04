import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { FileText, Download, Eye, ChevronDown, ChevronUp, Loader2, CheckCircle, Zap, User } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useUserProfile } from "../components/useUserProfile";

const formGroups = [
  {
    category: "Visa Sinh viên (500)",
    color: "blue",
    forms: [
      {
        id: "157a",
        name: "Form 157A",
        title: "Student Visa Application",
        desc: "Đơn xin visa du học chính thức",
        fields: [
          { key: "full_name", label: "Họ và tên đầy đủ", type: "text", required: true },
          { key: "date_of_birth", label: "Ngày sinh", type: "date", required: true },
          { key: "nationality", label: "Quốc tịch", type: "text", required: true },
          { key: "passport_number", label: "Số hộ chiếu", type: "text", required: true },
          { key: "passport_expiry", label: "Ngày hết hạn hộ chiếu", type: "date", required: true },
          { key: "email", label: "Email", type: "email", required: true },
          { key: "phone", label: "Số điện thoại", type: "text" },
          { key: "university", label: "Tên trường đại học tại Úc", type: "text", required: true },
          { key: "course", label: "Tên khóa học", type: "text", required: true },
          { key: "coe_number", label: "Mã CoE (Confirmation of Enrolment)", type: "text", required: true },
          { key: "course_start", label: "Ngày bắt đầu khóa học", type: "date" },
          { key: "course_end", label: "Ngày kết thúc khóa học", type: "date" },
          { key: "english_test_type", label: "Loại bằng tiếng Anh", type: "select", options: ["IELTS", "PTE", "TOEFL", "OET"], required: true },
          { key: "english_score", label: "Điểm tiếng Anh", type: "text", required: true },
          { key: "funds_available", label: "Số tiền có sẵn (AUD)", type: "number" },
          { key: "sponsor_name", label: "Người bảo lãnh tài chính (nếu có)", type: "text" },
        ],
      },
      {
        id: "1221",
        name: "Form 1221",
        title: "Additional Personal Particulars",
        desc: "Thông tin cá nhân bổ sung bắt buộc",
        fields: [
          { key: "full_name", label: "Họ và tên", type: "text", required: true },
          { key: "date_of_birth", label: "Ngày sinh", type: "date", required: true },
          { key: "place_of_birth", label: "Nơi sinh", type: "text" },
          { key: "nationality", label: "Quốc tịch", type: "text", required: true },
          { key: "marital_status", label: "Tình trạng hôn nhân", type: "select", options: ["Độc thân", "Đã kết hôn", "Ly hôn", "Góa"] },
          { key: "address_home", label: "Địa chỉ thường trú tại Việt Nam", type: "textarea" },
          { key: "father_name", label: "Họ tên cha", type: "text" },
          { key: "mother_name", label: "Họ tên mẹ", type: "text" },
          { key: "employment_history", label: "Lịch sử làm việc (5 năm gần nhất)", type: "textarea" },
          { key: "education_history", label: "Lịch sử học vấn", type: "textarea" },
          { key: "military_service", label: "Đã từng phục vụ quân đội?", type: "select", options: ["Không", "Có"] },
        ],
      },
    ],
  },
  {
    category: "Visa Tốt nghiệp (485)",
    color: "violet",
    forms: [
      {
        id: "1276",
        name: "Form 1276",
        title: "Temporary Graduate Visa",
        desc: "Đơn xin visa tốt nghiệp sau khi hoàn thành học tại Úc",
        fields: [
          { key: "full_name", label: "Họ và tên", type: "text", required: true },
          { key: "date_of_birth", label: "Ngày sinh", type: "date", required: true },
          { key: "passport_number", label: "Số hộ chiếu", type: "text", required: true },
          { key: "passport_expiry", label: "Ngày hết hạn hộ chiếu", type: "date", required: true },
          { key: "university", label: "Trường tốt nghiệp tại Úc", type: "text", required: true },
          { key: "course", label: "Tên bằng cấp đã hoàn thành", type: "text", required: true },
          { key: "graduation_date", label: "Ngày tốt nghiệp", type: "date", required: true },
          { key: "english_test_type", label: "Loại bằng tiếng Anh", type: "select", options: ["IELTS", "PTE", "TOEFL", "OET"] },
          { key: "english_score", label: "Điểm tiếng Anh", type: "text" },
          { key: "address_australia", label: "Địa chỉ hiện tại tại Úc", type: "textarea" },
          { key: "years_in_australia", label: "Số năm học tại Úc", type: "number" },
        ],
      },
    ],
  },
  {
    category: "Visa PR (189/190/491)",
    color: "rose",
    forms: [
      {
        id: "47sk",
        name: "Form 47SK",
        title: "Skilled Migration Application",
        desc: "Đơn xin visa Skilled Independent / Nominated",
        fields: [
          { key: "full_name", label: "Họ và tên", type: "text", required: true },
          { key: "date_of_birth", label: "Ngày sinh", type: "date", required: true },
          { key: "nationality", label: "Quốc tịch", type: "text", required: true },
          { key: "passport_number", label: "Số hộ chiếu", type: "text", required: true },
          { key: "email", label: "Email", type: "email", required: true },
          { key: "phone", label: "Số điện thoại", type: "text" },
          { key: "address_australia", label: "Địa chỉ tại Úc", type: "textarea" },
          { key: "occupation_code", label: "ANZSCO Code", type: "text", required: true },
          { key: "occupation_title", label: "Chức danh nghề nghiệp", type: "text", required: true },
          { key: "skills_assessment_body", label: "Cơ quan đánh giá kỹ năng", type: "text", required: true },
          { key: "skills_assessment_ref", label: "Mã số kết quả Skills Assessment", type: "text" },
          { key: "english_test_type", label: "Loại bằng tiếng Anh", type: "select", options: ["IELTS", "PTE", "TOEFL", "OET"] },
          { key: "english_score", label: "Điểm tiếng Anh tổng thể", type: "text" },
          { key: "points_score", label: "Tổng điểm EOI", type: "number" },
          { key: "visa_type", label: "Loại visa xin", type: "select", options: ["189 - Skilled Independent", "190 - State Nominated", "491 - Regional"] },
          { key: "state_nomination", label: "Tiểu bang bảo lãnh (nếu có)", type: "text" },
        ],
      },
      {
        id: "80",
        name: "Form 80",
        title: "Personal Particulars",
        desc: "Thông tin cá nhân chi tiết cho hồ sơ PR",
        fields: [
          { key: "full_name", label: "Họ và tên", type: "text", required: true },
          { key: "date_of_birth", label: "Ngày sinh", type: "date", required: true },
          { key: "place_of_birth", label: "Nơi sinh", type: "text" },
          { key: "nationality", label: "Quốc tịch hiện tại", type: "text", required: true },
          { key: "marital_status", label: "Tình trạng hôn nhân", type: "select", options: ["Độc thân", "Đã kết hôn", "Ly hôn", "Góa"] },
          { key: "countries_lived", label: "Các nước đã sống trên 12 tháng (từ 16 tuổi)", type: "textarea" },
          { key: "employment_last10", label: "Lịch sử làm việc 10 năm gần nhất", type: "textarea" },
          { key: "education_history", label: "Toàn bộ lịch sử học vấn", type: "textarea" },
          { key: "criminal_record", label: "Đã từng bị kết án hình sự?", type: "select", options: ["Không", "Có"] },
          { key: "health_conditions", label: "Tình trạng sức khỏe đặc biệt (nếu có)", type: "textarea" },
        ],
      },
    ],
  },
];

const colorMap = {
  blue: { badge: "bg-blue-100 text-blue-700", border: "border-blue-200", header: "bg-blue-50" },
  violet: { badge: "bg-violet-100 text-violet-700", border: "border-violet-200", header: "bg-violet-50" },
  rose: { badge: "bg-rose-100 text-rose-700", border: "border-rose-200", header: "bg-rose-50" },
};

// Maps visa type → relevant form group category
const visaToFormGroup = {
  "500": "Visa Sinh viên (500)",
  "485": "Visa Tốt nghiệp (485)",
  "189": "Visa PR (189/190/491)",
  "190": "Visa PR (189/190/491)",
  "491": "Visa PR (189/190/491)",
};

function FormModal({ form, onClose, initialData = {} }) {
  const [data, setData] = useState(initialData);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await base44.entities.FormSubmission.create({
      form_type: form.id,
      form_data: data,
      status: "draft",
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExport = () => {
    let content = `=== ${form.name} – ${form.title} ===\n\n`;
    form.fields.forEach((f) => {
      content += `${f.label}: ${data[f.key] || "___________"}\n`;
    });
    content += `\n\n*Được tạo bởi Úc Di Trú AI – ${new Date().toLocaleDateString("vi-VN")}*`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${form.id}_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <div className="font-bold text-[#0a1628] text-lg">{form.name} – {form.title}</div>
            <div className="text-sm text-gray-500">{form.desc}</div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-light leading-none">×</button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-4">
            {form.fields.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label} {field.required && <span className="text-rose-500">*</span>}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none"
                    rows={3}
                    value={data[field.key] || ""}
                    onChange={(e) => setData((p) => ({ ...p, [field.key]: e.target.value }))}
                    placeholder={`Nhập ${field.label.toLowerCase()}...`}
                  />
                ) : field.type === "select" ? (
                  <select
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"
                    value={data[field.key] || ""}
                    onChange={(e) => setData((p) => ({ ...p, [field.key]: e.target.value }))}
                  >
                    <option value="">-- Chọn --</option>
                    {field.options.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    value={data[field.key] || ""}
                    onChange={(e) => setData((p) => ({ ...p, [field.key]: e.target.value }))}
                    placeholder={`Nhập ${field.label.toLowerCase()}...`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-[#0f2347] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-[#1a3a6e] transition-colors flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle className="w-4 h-4" /> : null}
            {saved ? "Đã lưu!" : "Lưu nháp"}
          </button>
          <button
            onClick={handleExport}
            className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" /> Xuất file
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Forms() {
  const [activeForm, setActiveForm] = useState(null);
  const [expandedGroup, setExpandedGroup] = useState("Visa Sinh viên (500)");

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      {activeForm && <FormModal form={activeForm} onClose={() => setActiveForm(null)} />}

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0a1628] mb-3">Biểu mẫu Di trú Úc</h1>
          <p className="text-gray-500">Các form chính thức của Bộ Nội vụ Úc. Điền trực tiếp tại đây hoặc upload CV để điền tự động.</p>

          <Link
            to={createPageUrl("CVUpload")}
            className="inline-flex items-center gap-2 mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
          >
            ✨ Upload CV để điền tự động
          </Link>
        </div>

        <div className="space-y-4">
          {formGroups.map((group) => {
            const c = colorMap[group.color];
            const isOpen = expandedGroup === group.category;
            return (
              <div key={group.category} className={`bg-white rounded-2xl border ${c.border} overflow-hidden shadow-sm`}>
                <button
                  className={`w-full px-6 py-4 flex items-center justify-between ${c.header}`}
                  onClick={() => setExpandedGroup(isOpen ? null : group.category)}
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${c.badge}`}>{group.forms.length} form</span>
                    <span className="font-semibold text-[#0a1628]">{group.category}</span>
                  </div>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </button>

                {isOpen && (
                  <div className="p-4 grid md:grid-cols-2 gap-4">
                    {group.forms.map((form) => (
                      <div key={form.id} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-3 mb-3">
                          <div className={`w-10 h-10 rounded-lg ${c.badge} flex items-center justify-center flex-shrink-0`}>
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-bold text-[#0a1628] text-sm">{form.name}</div>
                            <div className="text-xs text-gray-500">{form.title}</div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mb-3">{form.desc}</p>
                        <p className="text-xs text-gray-400 mb-3">{form.fields.length} trường thông tin</p>
                        <button
                          onClick={() => setActiveForm(form)}
                          className="w-full bg-[#0f2347] text-white py-2 rounded-lg text-xs font-medium hover:bg-[#1a3a6e] transition-colors flex items-center justify-center gap-1"
                        >
                          <Eye className="w-3 h-3" /> Mở & Điền form
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}