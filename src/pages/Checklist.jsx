import { useState, useEffect } from "react";
import { CheckSquare, Square, ChevronDown, ChevronUp, Zap, User } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useUserProfile } from "../components/useUserProfile";
import { entities } from '@/api/supabaseClient';
import ImmiStudentPage from "@/components/templates/ImmiStudentPage";

const defaultStages = [
  {
    id: "visa500",
    title: "Giai đoạn 1: Visa Sinh viên (500)",
    color: "blue",
    items: [
      "Nhận thư nhập học (CoE) từ trường CRICOS",
      "Chuẩn bị tài chính (học phí + AUD 21,041 sinh hoạt phí)",
      "Thi IELTS / PTE đạt yêu cầu (IELTS 5.5+)",
      "Mua bảo hiểm OSHC",
      "Khám sức khỏe diện di trú",
      "Làm lý lịch tư pháp",
      "Nộp đơn visa 500 online qua ImmiAccount",
      "Đóng phí visa AUD 650",
      "Nhận visa và chuẩn bị sang Úc",
    ],
  },
  {
    id: "studying",
    title: "Giai đoạn 2: Trong thời gian học",
    color: "violet",
    items: [
      "Đăng ký Tax File Number (TFN)",
      "Mở tài khoản ngân hàng tại Úc",
      "Đăng ký Medicare (nếu có hiệp định)",
      "Tìm hiểu nghề nghiệp và ANZSCO code phù hợp",
      "Lên kế hoạch cải thiện điểm IELTS/PTE lên 7.0+",
      "Tích lũy kinh nghiệm làm việc liên quan (part-time)",
      "Theo dõi danh sách nghề MLTSSL và STSOL",
      "Tham gia cộng đồng di trú, hỏi thêm kinh nghiệm",
      "Lưu giữ tất cả tài liệu: bảng điểm, thư xác nhận việc làm, payslip",
    ],
  },
  {
    id: "visa485",
    title: "Giai đoạn 3: Sau tốt nghiệp – Visa 485",
    color: "amber",
    items: [
      "Hoàn thành bằng cấp (tốt nghiệp)",
      "Xin thư xác nhận tốt nghiệp chính thức từ trường",
      "Thi lại IELTS/PTE nếu chưa đạt 6.0 (mỗi kỹ năng 5.0+)",
      "Nộp đơn visa 485 trong 6 tháng sau tốt nghiệp",
      "Chuẩn bị health exam mới nếu cần",
      "Đóng phí visa AUD 4,600",
      "Trong khi chờ 485: tiếp tục tích lũy kinh nghiệm",
    ],
  },
  {
    id: "skills",
    title: "Giai đoạn 4: Đánh giá kỹ năng (Skills Assessment)",
    color: "emerald",
    items: [
      "Xác định ANZSCO code và cơ quan đánh giá phù hợp",
      "Chuẩn bị bằng cấp, bảng điểm, kinh nghiệm làm việc",
      "Dịch công chứng toàn bộ tài liệu sang tiếng Anh",
      "Nộp hồ sơ Skills Assessment (ACS, Engineers Australia, VETASSESS,...)",
      "Đóng phí đánh giá kỹ năng (~AUD 500-1,500)",
      "Chờ kết quả Positive Skills Assessment (3-6 tháng)",
      "Nhận thư kết quả Skills Assessment",
    ],
  },
  {
    id: "eoi",
    title: "Giai đoạn 5: Nộp EOI & SkillSelect",
    color: "sky",
    items: [
      "Tạo tài khoản SkillSelect trên immigration.gov.au",
      "Tính điểm EOI (Points Calculator chính thức)",
      "Điền đầy đủ thông tin EOI (ngành nghề, bằng cấp, kinh nghiệm, tiếng Anh)",
      "Submit EOI và chờ được mời (ITA)",
      "Cập nhật EOI khi có thay đổi điểm (IELTS mới, kinh nghiệm tăng)",
      "Theo dõi các đợt invitation hàng tháng",
      "Nếu điểm thấp: xem xét nộp bảo lãnh tiểu bang 190/491",
    ],
  },
  {
    id: "state",
    title: "Giai đoạn 6: Bảo lãnh Tiểu bang (190/491)",
    color: "sky",
    items: [
      "Chọn tiểu bang phù hợp với ngành nghề và nơi cư trú",
      "Đảm bảo nghề nghiệp nằm trong danh sách nghề của tiểu bang đó",
      "Chuẩn bị bằng chứng liên kết tiểu bang (học/làm/định cư tại bang)",
      "Nộp đơn bảo lãnh tiểu bang (190/491)",
      "Chuẩn bị điểm EOI base và hồ sơ supporting cho nomination",
      "Nếu chọn Visa 491: cam kết sống & làm việc vùng 3 năm",
    ],
  },
  {
    id: "pr",
    title: "Giai đoạn 7: Nộp hồ sơ PR",
    color: "rose",
    items: [
      "Nhận Invitation to Apply (ITA)",
      "Chuẩn bị toàn bộ hồ sơ trong 60 ngày",
      "Khám sức khỏe tại panel doctor được chỉ định",
      "Xin lý lịch tư pháp tất cả quốc gia từng sống 12 tháng+",
      "Thu thập tài liệu kinh nghiệm làm việc đầy đủ",
      "Điền Form 47SK và các biểu mẫu liên quan",
      "Nộp hồ sơ online qua ImmiAccount",
      "Đóng phí visa (AUD 4,640 + thành viên gia đình)",
      "Chờ xử lý và nhận visa PR",
    ],
  },
];

const colorMap = {
  blue: { header: "bg-blue-600", badge: "bg-blue-100 text-blue-700", check: "text-blue-500", border: "border-blue-200" },
  violet: { header: "bg-violet-600", badge: "bg-violet-100 text-violet-700", check: "text-violet-500", border: "border-violet-200" },
  amber: { header: "bg-amber-500", badge: "bg-amber-100 text-amber-700", check: "text-amber-500", border: "border-amber-200" },
  emerald: { header: "bg-emerald-600", badge: "bg-emerald-100 text-emerald-700", check: "text-emerald-500", border: "border-emerald-200" },
  sky: { header: "bg-sky-600", badge: "bg-sky-100 text-sky-700", check: "text-sky-500", border: "border-sky-200" },
  rose: { header: "bg-rose-600", badge: "bg-rose-100 text-rose-700", check: "text-rose-500", border: "border-rose-200" },
};

// Maps visa type → checklist stage id to auto-expand
const visaToChecklistStage = {
  "500": "visa500",
  "485": "visa485",
  "189": "eoi",
  "190": "state",
  "491": "state",
};

// Priority order per visa type - which stages are most relevant
const visaRelevantStages = {
  "500": ["visa500", "studying"],
  "485": ["visa485", "skills"],
  "189": ["eoi", "pr"],
  "190": ["state", "pr"],
  "491": ["state", "pr"],
};

export default function Checklist() {
  const { profile, loading: profileLoading } = useUserProfile();
  const localVisaType =
    typeof window !== "undefined" ? localStorage.getItem("visapath_immi_visa_type_override") : null;
  const localStageOverride =
    typeof window !== "undefined" ? localStorage.getItem("visapath_immi_stage_override") : null;
  const effectiveVisaType = profile?.current_visa_type || localVisaType || null;

  const [checked, setChecked] = useState({});
  const [expanded, setExpanded] = useState({ visa500: true });

  useEffect(() => {
    if (!effectiveVisaType) return;

    if (effectiveVisaType === "500") {
      // Show both the generic 500 prep and the in-study tasks.
      setExpanded({ visa500: true, studying: true });
      return;
    }

    if (effectiveVisaType === "485") {
      if (localStageOverride === "skills") setExpanded({ visa485: true, skills: true });
      else if (localStageOverride === "eoi") setExpanded({ visa485: true, eoi: true });
      else if (localStageOverride === "state") setExpanded({ visa485: true, state: true });
      else if (localStageOverride === "pr") setExpanded({ visa485: true, pr: true });
      else setExpanded({ visa485: true, skills: true });
      return;
    }

    const stage = visaToChecklistStage[effectiveVisaType];
    if (stage) setExpanded({ [stage]: true });
  }, [effectiveVisaType, localStageOverride]);

  useEffect(() => {
    entities.ChecklistItem.list().then((records) => {
      const state = {};
      records.forEach((r) => {
        state[`${r.stage}__${r.item}`] = r.completed;
      });
      setChecked(state);
    }).catch(() => {});
  }, []);

  const toggle = async (stageId, item) => {
    const key = `${stageId}__${item}`;
    const newVal = !checked[key];
    setChecked((prev) => ({ ...prev, [key]: newVal }));

    // Upsert to entity
    const existing = await entities.ChecklistItem.filter({ stage: stageId, item });
    if (existing.length > 0) {
      await entities.ChecklistItem.update(existing[0].id, { completed: newVal });
    } else {
      await entities.ChecklistItem.create({ stage: stageId, item, completed: newVal });
    }
  };

  const getProgress = (stage) => {
    const total = stage.items.length;
    const done = stage.items.filter((item) => checked[`${stage.id}__${item}`]).length;
    return { done, total, pct: Math.round((done / total) * 100) };
  };

  const totalProgress = () => {
    let done = 0, total = 0;
    defaultStages.forEach((s) => {
      s.items.forEach((item) => {
        total++;
        if (checked[`${s.id}__${item}`]) done++;
      });
    });
    return { done, total, pct: Math.round((done / total) * 100) };
  };

  const overall = totalProgress();
  const relevantStageIds = effectiveVisaType ? (visaRelevantStages[effectiveVisaType] || []) : [];

  // Sort stages: relevant first, then the rest
  const sortedStages = [...defaultStages].sort((a, b) => {
    const aRelevant = relevantStageIds.includes(a.id);
    const bRelevant = relevantStageIds.includes(b.id);
    if (aRelevant && !bRelevant) return -1;
    if (!aRelevant && bRelevant) return 1;
    return 0;
  });

  return (
    <ImmiStudentPage
      title="Checklist Lộ trình PR"
      subtitle="Theo dõi tiến trình của bạn từng bước một"
      maxWidthClass="max-w-3xl"
    >
        {/* Personalized hint */}
        {effectiveVisaType ? (
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-4 mb-6 text-white flex items-center gap-3">
            <Zap className="w-5 h-5 text-yellow-300 flex-shrink-0" />
            <div className="text-sm">
              <span className="font-semibold">Cá nhân hóa theo Visa {effectiveVisaType}:</span>{" "}
              Các giai đoạn quan trọng nhất với bạn hiện tại được hiển thị đầu tiên.
            </div>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <User className="w-5 h-5 text-blue-500 flex-shrink-0" />
            <p className="text-sm text-blue-700">
              <Link to={createPageUrl("Profile")} className="font-semibold underline">Điền hồ sơ cá nhân</Link> để checklist được sắp xếp theo visa và giai đoạn của bạn.
            </p>
          </div>
        )}

        {/* Overall progress */}
        <div className="bg-[#0f2347] rounded-2xl p-6 mb-8 text-white">
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold">Tiến trình tổng thể</span>
            <span className="text-2xl font-bold" aria-live="polite" aria-atomic="true">
              {overall.pct}%
            </span>
          </div>
          <div
            className="w-full bg-white/20 rounded-full h-3 mb-2"
            role="progressbar"
            aria-label="Tiến trình tổng thể"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={overall.pct}
          >
            <div
              className="bg-gradient-to-r from-blue-400 to-emerald-400 h-3 rounded-full transition-all duration-500"
              style={{ width: `${overall.pct}%` }}
            />
          </div>
          <p className="text-blue-200 text-sm">{overall.done} / {overall.total} mục đã hoàn thành</p>
        </div>

        {/* Stages */}
        <div className="space-y-4">
          {sortedStages.map((stage) => {
            const c = colorMap[stage.color];
            const { done, total, pct } = getProgress(stage);
            const isOpen = expanded[stage.id];
            const isRelevant = relevantStageIds.includes(stage.id);

            const panelId = `checklist-stage-${stage.id}`;
            const stageTitleId = `checklist-stage-title-${stage.id}`;

            return (
              <div key={stage.id} className={`rounded-2xl border overflow-hidden shadow-sm ${isRelevant ? `bg-white ${c.border} ring-2 ring-offset-1` : "bg-white border-gray-200 opacity-80"}`} style={isRelevant ? { "--tw-ring-color": "rgba(59,130,246,0.2)" } : {}}>
                <button
                  type="button"
                  className="w-full px-5 py-4 flex items-center gap-4 text-left"
                  onClick={() => setExpanded((p) => ({ ...p, [stage.id]: !p[stage.id] }))}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  aria-labelledby={stageTitleId}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.badge}`}>
                        {done}/{total}
                      </span>
                      {isRelevant && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">⭐ Ưu tiên</span>}
                      {done === total && <span className="text-xs text-emerald-600 font-medium">✓ Hoàn thành</span>}
                    </div>
                    <div id={stageTitleId} className="font-semibold text-[#0a1628] text-sm">{stage.title}</div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                      <div
                        className={`${c.header} h-1.5 rounded-full transition-all duration-300`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </button>

                {isOpen && (
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={stageTitleId}
                    className="px-5 pb-5 border-t border-gray-50"
                  >
                    <div className="space-y-2 mt-3">
                      {stage.items.map((item, i) => {
                        const key = `${stage.id}__${item}`;
                        const isDone = checked[key];
                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => toggle(stage.id, item)}
                            aria-pressed={isDone}
                            className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-colors ${
                              isDone ? "bg-emerald-50" : "hover:bg-gray-50"
                            }`}
                          >
                            {isDone ? (
                              <CheckSquare className={`w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-500`} />
                            ) : (
                              <Square className="w-5 h-5 flex-shrink-0 mt-0.5 text-gray-300" />
                            )}
                            <span className={`text-sm ${isDone ? "line-through text-gray-400" : "text-gray-700"}`}>
                              {item}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
    </ImmiStudentPage>
  );
}