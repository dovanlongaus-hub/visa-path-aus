/**
 * WorkflowEngine.jsx — Guided Visa Workflow Engine
 * Step-by-step conditional workflow with time estimates,
 * dependencies, and resources per step.
 * Data stored in localStorage key: "workflow_state"
 */

import { useState, useEffect } from "react";
import {
  CheckCircle, Lock, Clock, ChevronDown, ChevronUp,
  ExternalLink, Lightbulb, ArrowRight, Target, Zap, BookOpen
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const STORAGE_KEY = "workflow_state";

const PATHWAYS = {
  "189": {
    name: "Visa 189 — Skilled Independent",
    color: "blue",
    totalWeeks: 52,
    steps: [
      {
        id: "eng_test", title: "Thi IELTS/PTE", category: "Tiếng Anh", weeks: 8, icon: "📝",
        detail: "Đạt IELTS 7.0 mỗi kỹ năng (hoặc PTE 65) để đủ điều kiện Proficient English (+10 điểm EOI).",
        resources: [
          { label: "British Council IELTS", url: "https://www.britishcouncil.org.au/exam/ielts" },
          { label: "PTE Academic", url: "https://www.pearsonpte.com/" }
        ],
        tips: "Đặt lịch thi ít nhất 3 tháng trước deadline. IELTS Academic (không phải General) cho skilled visa.",
        requires: []
      },
      {
        id: "skills_assess", title: "Skills Assessment", category: "Kỹ năng", weeks: 12, icon: "🎓",
        detail: "Nộp hồ sơ đánh giá kỹ năng qua cơ quan phù hợp (ACS cho IT, Engineers Australia cho kỹ sư, CPA/CA cho kế toán...).",
        resources: [
          { label: "ACS (IT)", url: "https://www.acs.org.au/msa" },
          { label: "Engineers Australia", url: "https://www.engineersaustralia.org.au/skills-assessment" },
          { label: "CPA Australia", url: "https://www.cpaaustralia.com.au" }
        ],
        tips: "Thời gian xử lý: ACS ~4-6 tuần. Chuẩn bị employment reference letters chi tiết.",
        requires: []
      },
      {
        id: "eoi_submit", title: "Nộp EOI SkillSelect", category: "EOI", weeks: 1, icon: "📋",
        detail: "Tạo profile EOI trên SkillSelect với tất cả thông tin điểm số. Cần Skills Assessment + IELTS hoàn thành.",
        resources: [
          { label: "SkillSelect", url: "https://skillselect.gov.au" },
          { label: "EOI Guide (DHA)", url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-independent-189" }
        ],
        tips: "Kiểm tra điểm tối thiểu: 65. Invitation round thường mỗi 2 tuần.",
        requires: ["eng_test", "skills_assess"]
      },
      {
        id: "wait_ita", title: "Chờ Invitation to Apply (ITA)", category: "EOI", weeks: 24, icon: "⏳",
        detail: "Sau khi nộp EOI, chờ được mời nộp hồ sơ visa. Thời gian chờ phụ thuộc điểm số và occupation.",
        resources: [
          { label: "SkillSelect Reports", url: "https://immi.homeaffairs.gov.au/visas/working-in-australia/skillselect/invitation-rounds" }
        ],
        tips: "Điểm EOI càng cao → chờ càng ít. Theo dõi invitation rounds để estimate thời gian.",
        requires: ["eoi_submit"]
      },
      {
        id: "health_exam", title: "Khám sức khỏe (HAP)", category: "Hồ sơ", weeks: 2, icon: "🏥",
        detail: "Đặt lịch khám tại HAP-approved clinic. Kết quả có hiệu lực 12 tháng.",
        resources: [
          { label: "HAP ID Checker", url: "https://health.homeaffairs.gov.au" },
          { label: "Panel Clinics", url: "https://www.health.gov.au/topics/migrant-health/health-requirements/panel-physicians" }
        ],
        tips: "Đừng khám quá sớm — kết quả chỉ valid 12 tháng. Đặt lịch sau khi nhận ITA.",
        requires: ["wait_ita"]
      },
      {
        id: "police_check", title: "Police Check (PCC)", category: "Hồ sơ", weeks: 4, icon: "🚔",
        detail: "Xin Police Clearance Certificate từ tất cả nước đã sống >12 tháng từ năm 16 tuổi.",
        resources: [
          { label: "AFP Police Check (Úc)", url: "https://www.afp.gov.au/what-we-do/services/criminal-records/national-police-checks" },
          { label: "Cục Hồ sơ nghiệp vụ (VN)", url: "https://lylichtupháp.gov.vn" }
        ],
        tips: "AFP check ~5-10 ngày. VN police check: xin tại Sở Tư pháp, ~2-3 tuần.",
        requires: ["wait_ita"]
      },
      {
        id: "lodge_visa", title: "Nộp hồ sơ visa", category: "Nộp hồ sơ", weeks: 2, icon: "📮",
        detail: "Nộp online qua ImmiAccount sau khi nhận ITA. Có 60 ngày để hoàn tất từ ngày nhận ITA.",
        resources: [
          { label: "ImmiAccount", url: "https://online.immi.gov.au/lusc/login" },
          { label: "189 Checklist", url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-independent-189/points-tested" }
        ],
        tips: "Upload tất cả documents trong 1 lần. Application fee: ~$4,640 AUD chính và $2,320 mỗi người phụ.",
        requires: ["health_exam", "police_check"]
      },
      {
        id: "wait_grant", title: "Chờ visa được cấp", category: "Hoàn tất", weeks: 26, icon: "✈️",
        detail: "DHA đang xử lý hồ sơ. Thời gian xử lý hiện tại: ~6-12 tháng cho 189.",
        resources: [
          { label: "Visa Processing Times", url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-processing-times/global-visa-processing-times" }
        ],
        tips: "Kiểm tra ImmiAccount định kỳ. Trả lời yêu cầu bổ sung (if any) trong 28 ngày.",
        requires: ["lodge_visa"]
      },
    ]
  },
  "190": {
    name: "Visa 190 — Skilled Nominated (NSW)",
    color: "purple",
    totalWeeks: 60,
    steps: [
      {
        id: "eng_test", title: "Thi IELTS/PTE", category: "Tiếng Anh", weeks: 8, icon: "📝",
        detail: "Đạt IELTS 7.0+ (PTE 65+) để đủ Proficient English. 190 NSW yêu cầu minimum 6.0.",
        resources: [{ label: "British Council IELTS", url: "https://www.britishcouncil.org.au/exam/ielts" }],
        tips: "NSW ưu tiên Proficient English. Score >= 7.0 cho advantage khi apply state nomination.",
        requires: []
      },
      {
        id: "skills_assess", title: "Skills Assessment", category: "Kỹ năng", weeks: 12, icon: "🎓",
        detail: "Như 189 — cần skills assessment phù hợp với occupation code.",
        resources: [{ label: "ACS (IT)", url: "https://www.acs.org.au/msa" }],
        tips: "NSW Skills List: kiểm tra occupation có trong danh sách NSW không.",
        requires: []
      },
      {
        id: "nsw_nomination", title: "Apply NSW State Nomination", category: "Nomination", weeks: 8, icon: "🏛️",
        detail: "Nộp Expression of Interest cho NSW. NSW mở invitations theo đợt, thường mỗi tháng.",
        resources: [
          { label: "NSW Skilled Migration", url: "https://www.migration.nsw.gov.au" },
          { label: "NSW Skills List", url: "https://www.migration.nsw.gov.au/visas/skilled-migration/subclass-190/190-skilled-nominated/criteria" }
        ],
        tips: "NSW có requirements riêng: thường cần offer việc làm hoặc living/working in NSW.",
        requires: ["eng_test", "skills_assess"]
      },
      {
        id: "eoi_submit", title: "Nộp EOI SkillSelect (190)", category: "EOI", weeks: 1, icon: "📋",
        detail: "Tạo EOI trên SkillSelect, chọn state nomination. +5 điểm khi được NSW nominate.",
        resources: [{ label: "SkillSelect", url: "https://skillselect.gov.au" }],
        tips: "Đảm bảo EOI đã update để nhận invitation từ NSW.",
        requires: ["nsw_nomination"]
      },
      {
        id: "wait_ita", title: "Chờ ITA từ DHA", category: "EOI", weeks: 12, icon: "⏳",
        detail: "Sau NSW nomination + EOI, chờ DHA gửi Invitation to Apply.",
        resources: [],
        tips: "190 thường nhanh hơn 189 do nomination đã xác nhận.",
        requires: ["eoi_submit"]
      },
      {
        id: "health_exam", title: "Khám sức khỏe", category: "Hồ sơ", weeks: 2, icon: "🏥",
        detail: "Như 189 — khám tại HAP-approved clinic sau khi nhận ITA.",
        resources: [{ label: "HAP", url: "https://health.homeaffairs.gov.au" }],
        tips: "Valid 12 tháng. Đặt ngay sau ITA.",
        requires: ["wait_ita"]
      },
      {
        id: "police_check", title: "Police Check", category: "Hồ sơ", weeks: 4, icon: "🚔",
        detail: "PCC từ Úc (AFP) và Vietnam (Sở Tư pháp).",
        resources: [{ label: "AFP", url: "https://www.afp.gov.au" }],
        tips: "Làm song song với health exam để tiết kiệm thời gian.",
        requires: ["wait_ita"]
      },
      {
        id: "lodge_visa", title: "Nộp hồ sơ visa 190", category: "Nộp hồ sơ", weeks: 2, icon: "📮",
        detail: "Nộp online qua ImmiAccount trong 60 ngày từ ITA.",
        resources: [{ label: "ImmiAccount", url: "https://online.immi.gov.au/lusc/login" }],
        tips: "Application fee 190: ~$4,640 AUD.",
        requires: ["health_exam", "police_check"]
      },
      {
        id: "wait_grant", title: "Chờ visa được cấp", category: "Hoàn tất", weeks: 26, icon: "✈️",
        detail: "Processing time 190: hiện tại ~12-18 tháng.",
        resources: [{ label: "Processing Times", url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-processing-times" }],
        tips: "Maintain địa chỉ NSW trong quá trình xử lý.",
        requires: ["lodge_visa"]
      },
    ]
  },
  "491": {
    name: "Visa 491 — Skilled Regional",
    color: "green",
    totalWeeks: 48,
    steps: [
      {
        id: "eng_test", title: "Thi IELTS/PTE", category: "Tiếng Anh", weeks: 8, icon: "📝",
        detail: "Minimum Competent English (IELTS 6.0/PTE 50). Proficient English (+10 điểm) được khuyến khích.",
        resources: [{ label: "British Council IELTS", url: "https://www.britishcouncil.org.au/exam/ielts" }],
        tips: "491 dễ hơn 189/190 về English requirement.",
        requires: []
      },
      {
        id: "skills_assess", title: "Skills Assessment", category: "Kỹ năng", weeks: 12, icon: "🎓",
        detail: "Skills assessment cơ quan phù hợp. 491 có nhiều occupations hơn 189.",
        resources: [{ label: "ACS", url: "https://www.acs.org.au/msa" }],
        tips: "Check Regional Occupation List — rộng hơn MLTSSL của 189.",
        requires: []
      },
      {
        id: "state_nomination", title: "Apply State/Territory Nomination", category: "Nomination", weeks: 6, icon: "🏛️",
        detail: "491 có thể nominated bởi bất kỳ state/territory nào. TAS, SA, NT dễ hơn NSW/VIC.",
        resources: [
          { label: "Tasmania Skilled Migration", url: "https://www.migration.tas.gov.au" },
          { label: "SA Skilled Migration", url: "https://www.migration.sa.gov.au" }
        ],
        tips: "TAS và NT ít restrictive hơn. Xem xét relocate nếu NSW/VIC khó.",
        requires: ["eng_test", "skills_assess"]
      },
      {
        id: "eoi_submit", title: "Nộp EOI SkillSelect", category: "EOI", weeks: 1, icon: "📋",
        detail: "+15 điểm khi được nominated cho 491.",
        resources: [{ label: "SkillSelect", url: "https://skillselect.gov.au" }],
        tips: "15 điểm bonus + living in regional area bonus = tổng +20 điểm so với 189.",
        requires: ["state_nomination"]
      },
      {
        id: "wait_ita", title: "Chờ ITA", category: "EOI", weeks: 8, icon: "⏳",
        detail: "491 thường nhanh hơn 189 do điểm bonus.",
        resources: [],
        tips: "Invitation thường trong 2-4 tuần sau nomination.",
        requires: ["eoi_submit"]
      },
      {
        id: "lodge_visa", title: "Nộp hồ sơ visa 491", category: "Nộp hồ sơ", weeks: 2, icon: "📮",
        detail: "Nộp online qua ImmiAccount. Fee: ~$4,640 AUD.",
        resources: [{ label: "ImmiAccount", url: "https://online.immi.gov.au/lusc/login" }],
        tips: "Cam kết sống và làm việc ở regional area ít nhất 3 năm.",
        requires: ["wait_ita"]
      },
      {
        id: "wait_grant", title: "Chờ visa được cấp", category: "Hoàn tất", weeks: 16, icon: "✈️",
        detail: "491 xử lý nhanh hơn: ~6-12 tháng.",
        resources: [{ label: "Processing Times", url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-processing-times" }],
        tips: "Sau grant, cần thoả điều kiện regional để apply 191 (PR).",
        requires: ["lodge_visa"]
      },
      {
        id: "apply_191", title: "Apply Visa 191 (PR)", category: "PR", weeks: 4, icon: "🏆",
        detail: "Sau 3 năm 491 với income đủ, apply Visa 191 — Permanent Residence!",
        resources: [{ label: "Visa 191", url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/permanent-residence-191" }],
        tips: "Điều kiện: 3 năm regional, 3 tax years đủ income threshold.",
        requires: ["wait_grant"]
      },
    ]
  }
};

function getStepStatus(step, completedSteps) {
  if (completedSteps.includes(step.id)) return "done";
  const depsCompleted = step.requires.every(r => completedSteps.includes(r));
  if (!depsCompleted) return "locked";
  return "available";
}

const colorMap = {
  blue: "from-blue-500 to-indigo-600",
  purple: "from-purple-500 to-violet-600",
  green: "from-emerald-500 to-teal-600"
};

export default function WorkflowEngine() {
  const [state, setState] = useState({
    selectedVisa: null,
    completedSteps: [],
    startedAt: null,
    notes: {}
  });
  const [expanded, setExpanded] = useState(null);
  const [showVisaSelect, setShowVisaSelect] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setState(parsed);
        if (!parsed.selectedVisa) setShowVisaSelect(true);
      } else {
        setShowVisaSelect(true);
      }
    } catch {
      setShowVisaSelect(true);
    }
  }, []);

  const save = (newState) => {
    setState(newState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  };

  const selectVisa = (visaCode) => {
    save({
      selectedVisa: visaCode,
      completedSteps: [],
      startedAt: new Date().toISOString().split("T")[0],
      notes: {}
    });
    setShowVisaSelect(false);
  };

  const toggleStep = (stepId) => {
    const newCompleted = state.completedSteps.includes(stepId)
      ? state.completedSteps.filter(s => s !== stepId)
      : [...state.completedSteps, stepId];
    save({ ...state, completedSteps: newCompleted });
  };

  const pathway = state.selectedVisa ? PATHWAYS[state.selectedVisa] : null;
  const completedCount = pathway
    ? state.completedSteps.filter(s => pathway.steps.find(p => p.id === s)).length
    : 0;
  const totalSteps = pathway?.steps.length || 0;
  const progressPct = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;
  const nextStep = pathway?.steps.find(
    s => getStepStatus(s, state.completedSteps) === "available"
  );

  // ── Visa selection screen ──────────────────────────────────
  if (showVisaSelect || !pathway) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Target className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#0a1628] mb-2">Chọn lộ trình visa của bạn</h1>
            <p className="text-gray-500">Hệ thống sẽ tạo kế hoạch step-by-step phù hợp với visa bạn chọn</p>
          </div>

          <div className="space-y-3">
            {Object.entries(PATHWAYS).map(([code, p]) => (
              <button key={code} onClick={() => selectVisa(code)}
                className="w-full text-left p-5 bg-white rounded-2xl border border-gray-100 hover:border-blue-300 hover:shadow-md transition-all group">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl font-black text-[#0a1628]">Visa {code}</span>
                    </div>
                    <p className="font-semibold text-gray-700">{p.name.replace(`Visa ${code} — `, "")}</p>
                    <p className="text-sm text-gray-400 mt-1">{p.steps.length} bước · ~{Math.round(p.totalWeeks / 4)} tháng</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
                </div>
              </button>
            ))}
          </div>

          {state.selectedVisa && (
            <button
              onClick={() => setShowVisaSelect(false)}
              className="w-full mt-4 py-3 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← Quay lại lộ trình hiện tại
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── Main workflow view ─────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f8f9fc] pb-16">
      {/* Header */}
      <div className={`bg-gradient-to-br ${colorMap[pathway.color]} text-white px-4 py-6`}>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-1">Lộ trình của bạn</p>
              <h1 className="text-xl font-bold">{pathway.name}</h1>
            </div>
            <button
              onClick={() => setShowVisaSelect(true)}
              className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors"
            >
              Đổi visa
            </button>
          </div>
          <div className="flex items-center gap-4 mb-3">
            <div className="flex-1">
              <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
            <span className="text-sm font-bold">{progressPct}%</span>
          </div>
          <p className="text-white/70 text-sm">{completedCount}/{totalSteps} bước hoàn thành</p>
        </div>
      </div>

      {/* Next step banner */}
      {nextStep && (
        <div className="max-w-2xl mx-auto px-4 -mt-3">
          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-3 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400 font-semibold">Bước tiếp theo</p>
              <p className="text-sm font-bold text-gray-800 truncate">{nextStep.icon} {nextStep.title}</p>
            </div>
            <button
              onClick={() => setExpanded(nextStep.id)}
              className="text-xs bg-blue-50 text-blue-600 font-semibold px-3 py-1.5 rounded-lg flex-shrink-0"
            >
              Chi tiết
            </button>
          </div>
        </div>
      )}

      {/* Steps */}
      <div className="max-w-2xl mx-auto px-4 mt-4 space-y-2">
        {pathway.steps.map((step, idx) => {
          const status = getStepStatus(step, state.completedSteps);
          const isExpanded = expanded === step.id;

          return (
            <div
              key={step.id}
              className={`bg-white rounded-xl border transition-all ${
                status === "done"
                  ? "border-green-200 opacity-80"
                  : status === "locked"
                  ? "border-gray-100 opacity-60"
                  : "border-blue-100 shadow-sm"
              }`}
            >
              <div
                className="flex items-center gap-3 p-4 cursor-pointer"
                onClick={() => setExpanded(isExpanded ? null : step.id)}
              >
                {/* Status icon */}
                <div className="flex-shrink-0">
                  {status === "done" ? (
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                  ) : status === "locked" ? (
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <Lock className="w-4 h-4 text-gray-400" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-blue-50 border-2 border-blue-300 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-500">{idx + 1}</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{step.icon}</span>
                    <p className={`font-semibold text-sm ${status === "locked" ? "text-gray-400" : "text-gray-800"}`}>
                      {step.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-gray-400">{step.category}</span>
                    <span className="text-xs text-gray-300">·</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      ~{step.weeks < 4 ? `${step.weeks * 7} ngày` : `${Math.round(step.weeks / 4)} tháng`}
                    </span>
                  </div>
                </div>

                {isExpanded
                  ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                }
              </div>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-50 pt-3 space-y-3">
                  <p className="text-sm text-gray-600">{step.detail}</p>

                  {step.tips && (
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-700">{step.tips}</p>
                    </div>
                  )}

                  {step.resources.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Tài nguyên</p>
                      <div className="space-y-1">
                        {step.resources.map((r, i) => (
                          <a
                            key={i}
                            href={r.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                            {r.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {status !== "locked" && (
                    <button
                      onClick={() => toggleStep(step.id)}
                      className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all ${
                        status === "done"
                          ? "bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-600"
                          : "bg-green-500 text-white hover:bg-green-600"
                      }`}
                    >
                      {status === "done" ? "↩️ Đánh dấu chưa hoàn thành" : "✅ Đánh dấu hoàn thành"}
                    </button>
                  )}

                  {status === "locked" && (
                    <p className="text-xs text-gray-400 text-center">
                      🔒 Cần hoàn thành:{" "}
                      {step.requires
                        .map(r => pathway.steps.find(s => s.id === r)?.title)
                        .join(", ")}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer CTA */}
      <div className="max-w-2xl mx-auto px-4 mt-6">
        <Link
          to={createPageUrl("Chat")}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3.5 rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all"
        >
          <BookOpen className="w-4 h-4" /> Hỏi AI về bước tiếp theo
        </Link>
      </div>
    </div>
  );
}
