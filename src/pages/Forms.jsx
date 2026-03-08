import { useState, useEffect } from "react";
import {
  FileText, Save, X, ChevronDown, ChevronUp,
  RefreshCw, Download, CheckCircle2, User, ExternalLink
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User as UserEntity, UserProfile } from "@/api/entities";

// ── Form Definitions ──────────────────────────────────────────────────────────
const FORM_GROUPS = [
  {
    id: "visa500",
    visa: "500",
    label: "Visa Sinh Viên (500)",
    color: "bg-blue-50 border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    forms: [
      {
        id: "157a",
        name: "Biểu mẫu 157A",
        title: "Request for Further Information",
        url: "https://immi.homeaffairs.gov.au/form-listing/forms/0157a.pdf",
        fields: [
          { id: "full_name",       label: "Họ và tên",         type: "text",  profileKey: "full_name" },
          { id: "date_of_birth",   label: "Ngày sinh",          type: "date",  profileKey: "date_of_birth" },
          { id: "passport_number", label: "Số hộ chiếu",        type: "text",  profileKey: "passport_number" },
          { id: "nationality",     label: "Quốc tịch",          type: "text",  profileKey: "nationality" },
        ],
      },
      {
        id: "1221",
        name: "Biểu mẫu 1221",
        title: "Additional Personal Particulars",
        url: "https://immi.homeaffairs.gov.au/form-listing/forms/1221.pdf",
        fields: [
          { id: "full_name",       label: "Họ và tên",     type: "text",  profileKey: "full_name" },
          { id: "date_of_birth",   label: "Ngày sinh",      type: "date",  profileKey: "date_of_birth" },
          { id: "nationality",     label: "Quốc tịch",      type: "text",  profileKey: "nationality" },
          { id: "occupation",      label: "Nghề nghiệp",    type: "text",  profileKey: "occupation" },
        ],
      },
    ],
  },
  {
    id: "visa485",
    visa: "485",
    label: "Visa Tốt Nghiệp (485)",
    color: "bg-violet-50 border-violet-200",
    badge: "bg-violet-100 text-violet-700",
    forms: [
      {
        id: "1276",
        name: "Biểu mẫu 1276",
        title: "Sponsorship for a Temporary Stay",
        url: "https://immi.homeaffairs.gov.au/form-listing/forms/1276.pdf",
        fields: [
          { id: "full_name",       label: "Họ và tên ứng viên",  type: "text",  profileKey: "full_name" },
          { id: "date_of_birth",   label: "Ngày sinh",            type: "date",  profileKey: "date_of_birth" },
          { id: "passport_number", label: "Số hộ chiếu",          type: "text",  profileKey: "passport_number" },
          { id: "anzsco_code",     label: "Mã ANZSCO",             type: "text",  profileKey: "anzsco_code" },
        ],
      },
    ],
  },
  {
    id: "visaPR",
    visa: "189",
    label: "Visa PR Kỹ Năng (189/190/491)",
    color: "bg-emerald-50 border-emerald-200",
    badge: "bg-emerald-100 text-emerald-700",
    forms: [
      {
        id: "47sk",
        name: "Biểu mẫu 47SK",
        title: "Sponsoring a Skilled Worker",
        url: "https://immi.homeaffairs.gov.au/form-listing/forms/0047sk.pdf",
        fields: [
          { id: "full_name",       label: "Họ và tên",      type: "text",  profileKey: "full_name" },
          { id: "date_of_birth",   label: "Ngày sinh",       type: "date",  profileKey: "date_of_birth" },
          { id: "occupation",      label: "Nghề nghiệp",     type: "text",  profileKey: "occupation" },
          { id: "anzsco_code",     label: "Mã ANZSCO",        type: "text",  profileKey: "anzsco_code" },
        ],
      },
      {
        id: "80",
        name: "Biểu mẫu 80",
        title: "Personal Particulars for Assessment",
        url: "https://immi.homeaffairs.gov.au/form-listing/forms/0080.pdf",
        fields: [
          { id: "full_name",       label: "Họ và tên",        type: "text",  profileKey: "full_name" },
          { id: "date_of_birth",   label: "Ngày sinh",         type: "date",  profileKey: "date_of_birth" },
          { id: "nationality",     label: "Quốc tịch",         type: "text",  profileKey: "nationality" },
          { id: "passport_number", label: "Số hộ chiếu",       type: "text",  profileKey: "passport_number" },
          { id: "occupation",      label: "Nghề nghiệp",       type: "text",  profileKey: "occupation" },
          { id: "anzsco_code",     label: "Mã ANZSCO",          type: "text",  profileKey: "anzsco_code" },
        ],
      },
    ],
  },
];

const inputCls = "w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition";

function FormModal({ formDef, profile, onClose }) {
  const init = {};
  formDef.fields.forEach((f) => {
    init[f.id] = profile?.[f.profileKey] || "";
  });
  const [values, setValues] = useState(init);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    try {
      const key = `form_draft_${formDef.id}`;
      localStorage.setItem(key, JSON.stringify(values));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {}
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
          <div>
            <p className="font-bold text-gray-900">{formDef.name}</p>
            <p className="text-xs text-gray-500">{formDef.title}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {/* Auto-fill notice */}
        <div className="mx-5 mt-4 flex items-center gap-2 text-xs text-blue-700 bg-blue-50 rounded-xl p-3">
          <User className="h-3.5 w-3.5 flex-shrink-0" />
          Các trường dưới đây đã được điền sẵn từ hồ sơ của bạn. Kiểm tra và chỉnh sửa nếu cần.
        </div>

        {/* Fields */}
        <div className="p-5 space-y-4">
          {formDef.fields.map((field) => (
            <div key={field.id}>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">{field.label}</label>
              <input
                className={inputCls}
                type={field.type || "text"}
                value={values[field.id] || ""}
                onChange={(e) => setValues((v) => ({ ...v, [field.id]: e.target.value }))}
              />
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="p-5 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
          <Button
            className="flex-1 bg-gray-900 hover:bg-gray-800 text-white"
            onClick={handleSave}
          >
            {saved ? <><CheckCircle2 className="h-4 w-4 mr-1.5" /> Đã lưu!</> : <><Save className="h-4 w-4 mr-1.5" /> Lưu bản nháp</>}
          </Button>
          <a href={formDef.url} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button variant="outline" className="w-full border-gray-200">
              <ExternalLink className="h-4 w-4 mr-1.5" /> Tải form gốc (PDF)
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Forms() {
  const [user, setUser]               = useState(null);
  const [profile, setProfile]         = useState(null);
  const [openGroup, setOpenGroup]     = useState("visaPR");
  const [openModal, setOpenModal]     = useState(null); // { groupId, formId }
  const [isLoading, setIsLoading]     = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const u = await UserEntity.me();
        setUser(u);
        const profiles = await UserProfile.filter({ user_id: u.id });
        if (profiles?.length) setProfile(profiles[0]);
        // Open the group matching the user's target visa
        if (profiles?.[0]?.target_visa) {
          const code = profiles[0].target_visa.match(/\d+/)?.[0];
          const match = FORM_GROUPS.find((g) => g.visa === code);
          if (match) setOpenGroup(match.id);
        }
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const activeModal = openModal
    ? FORM_GROUPS.flatMap((g) => g.forms.map((f) => ({ ...f, groupId: g.id }))).find(
        (f) => f.groupId === openModal.groupId && f.id === openModal.formId
      )
    : null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <div className="bg-gray-950 text-white px-4 py-6">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Biểu Mẫu Di Trú</h1>
            <p className="text-xs text-gray-400">
              Điền tự động từ hồ sơ · Tải form gốc từ DOHA
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Profile Auto-fill notice */}
        {profile ? (
          <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 rounded-xl p-4 border border-emerald-200">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
            Hồ sơ của bạn đã được tìm thấy. Các biểu mẫu sẽ được điền sẵn thông tin.
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 rounded-xl p-4 border border-amber-200">
            <User className="h-4 w-4 flex-shrink-0" />
            Hoàn thiện hồ sơ để các biểu mẫu được điền sẵn thông tin của bạn.
          </div>
        )}

        {/* Form Groups */}
        {FORM_GROUPS.map((group) => (
          <div key={group.id} className={`bg-white rounded-2xl border ${group.color} shadow-sm overflow-hidden`}>
            {/* Group Header */}
            <button
              className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50/50 transition-colors"
              onClick={() => setOpenGroup(openGroup === group.id ? null : group.id)}
            >
              <div className="flex items-center gap-3">
                <Badge className={`text-xs ${group.badge} border-0`}>Visa {group.visa}</Badge>
                <span className="font-semibold text-gray-900">{group.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">{group.forms.length} biểu mẫu</span>
                {openGroup === group.id
                  ? <ChevronUp className="h-4 w-4 text-gray-400" />
                  : <ChevronDown className="h-4 w-4 text-gray-400" />}
              </div>
            </button>

            {/* Forms List */}
            {openGroup === group.id && (
              <div className="border-t border-gray-100 divide-y divide-gray-50">
                {group.forms.map((form) => (
                  <div key={form.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                        <FileText className="h-3.5 w-3.5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{form.name}</p>
                        <p className="text-xs text-gray-500">{form.title}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs border-gray-200"
                        onClick={() => setOpenModal({ groupId: group.id, formId: form.id })}
                      >
                        Điền mẫu
                      </Button>
                      <a href={form.url} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="ghost" className="text-xs text-gray-500">
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        <p className="text-xs text-center text-gray-400 mt-4">
          Các biểu mẫu được cung cấp bởi DOHA · immi.homeaffairs.gov.au
        </p>
      </div>

      {/* Form Modal */}
      {activeModal && (
        <FormModal
          formDef={activeModal}
          profile={profile}
          onClose={() => setOpenModal(null)}
        />
      )}
    </div>
  );
}