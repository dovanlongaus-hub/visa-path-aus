import { useState } from "react";
import { CheckCircle, Clock, FileText, Users, ChevronRight, ChevronDown, Info, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

// Visa types with their processing stages
const VISA_TYPES = [
  {
    id: "189",
    name: "189 Skilled Independent",
    subtitle: "Visa độc lập tay nghề",
    color: "blue",
    description: "Dành cho skilled workers không cần bảo lãnh từ người thân hoặc tiểu bang.",
    points: "65-100 điểm",
    processingTime: "6-12 tháng",
    stages: [
      {
        id: "skills-assessment",
        name: "Skills Assessment",
        duration: "2-4 tháng",
        description: "Đánh giá kỹ năng nghề nghiệp qua authorities (Engineers Australia, ACS, VETASSESS, etc.)",
        documents: [
          "Bằng cấp & bảng điểm",
          "Thư xác nhận kinh nghiệm làm việc",
          "CV chi tiết",
          "Chứng chỉ tiếng Anh (IELTS/PTE)",
        ],
      },
      {
        id: "english-test",
        name: "English Language Test",
        duration: "1-2 tuần",
        description: "Nộp chứng chỉ tiếng Anh đạt yêu cầu (IELTS 6.0+, PTE 50+)",
        documents: [
          "Giấy chứng nhận IELTS/PTE/CAE",
          "Đơn đăng ký thi (nếu chưa có)",
        ],
      },
      {
        id: "eoi-submission",
        name: "EOI Submission",
        duration: "2-4 tuần",
        description: "Nộp Expression of Interest lên SkillSelect với điểm số cao nhất có thể",
        documents: [
          "Thông tin EOI đầy đủ",
          "Điểm số tiếng Anh",
          "Kết quả Skills Assessment",
          "Thông tin gia đình (nếu có)",
        ],
      },
      {
        id: "invitation",
        name: "Invitation Received",
        duration: "1-4 tuần",
        description: "Nhận lời mời nộp hồ sơ từ Bộ Nội vụ Úc",
        documents: [
          "Thư mời (Invitation Letter)",
        ],
      },
      {
        id: "visa-application",
        name: "Visa Application",
        duration: "4-8 tháng",
        description: "Nộp hồ sơ visa chính thức sau khi nhận lời mời",
        documents: [
          "Đơn Form 80/1221",
          "Hộ chiếu",
          "Giấy khai sinh",
          "Khám sức khỏe",
          "Chứng nhận lý lịch tư pháp",
          "Bằng chứng tài chính",
          "Bảo hiểm OSHC",
        ],
      },
      {
        id: "grant",
        name: "Visa Granted",
        duration: "–",
        description: "Visa được cấp, có thể nhập cảnh Úc",
        documents: [
          "Grant Letter",
          "Visa Grant Notice",
        ],
      },
    ],
  },
  {
    id: "190",
    name: "190 Nominated Visa",
    subtitle: "Visa bảo lãnh tiểu bang",
    color: "violet",
    description: "Dành cho skilled workers được bảo lãnh bởi tiểu bang hoặc vùng lãnh thổ Úc.",
    points: "60-100 điểm",
    processingTime: "8-14 tháng",
    stages: [
      {
        id: "skills-assessment",
        name: "Skills Assessment",
        duration: "2-4 tháng",
        description: "Đánh giá kỹ năng nghề nghiệp qua authorities được công nhận",
        documents: [
          "Bằng cấp & bảng điểm",
          "Thư xác nhận kinh nghiệm",
          "CV chi tiết",
          "Chứng chỉ tiếng Anh",
        ],
      },
      {
        id: "state-nomination",
        name: "State Nomination",
        duration: "2-8 tuần",
        description: "Nộp đơn xin bảo lãnh tiểu bang, mỗi tiểu bang có criteria riêng",
        documents: [
          "Đơn xin bảo lãnh",
          "Kết quả Skills Assessment",
          "Điểm EOI",
          "Kế hoạch việc làm tại tiểu bang",
        ],
      },
      {
        id: "eoi-submission",
        name: "EOI Submission",
        duration: "2-4 tuần",
        description: "Nộp EOI với tối thiểu 60 điểm (cộng 5 điểm từ nomination)",
        documents: [
          "Thông tin EOI đầy đủ",
          "Điểm số tiếng Anh",
          "Kết quả Skills Assessment",
        ],
      },
      {
        id: "invitation",
        name: "Invitation Received",
        duration: "1-4 tuần",
        description: "Nhận lời mời nộp hồ sơ từ Bộ Nội vụ",
        documents: [
          "Thư mời (Invitation Letter)",
        ],
      },
      {
        id: "visa-application",
        name: "Visa Application",
        duration: "6-10 tháng",
        description: "Nộp hồ sơ visa chính thức",
        documents: [
          "Form 190 chính thức",
          "Hộ chiếu",
          "Giấy khai sinh",
          "Khám sức khỏe",
          "Lý lịch tư pháp",
          "Bảo hiểm OSHC",
        ],
      },
      {
        id: "grant",
        name: "Visa Granted",
        duration: "–",
        description: "Visa được cấp, yêu cầu cư trú 2 năm tại tiểu bang bảo lãnh",
        documents: [
          "Grant Letter",
          "Visa Grant Notice",
        ],
      },
    ],
  },
  {
    id: "491",
    name: "491 Regional Visa",
    subtitle: "Visa vùng regional",
    color: "emerald",
    description: "Dành cho skilled workers được bảo lãnh bởi tiểu bang hoặc người thân tại vùng regional Úc.",
    points: "50-95 điểm",
    processingTime: "9-15 tháng",
    stages: [
      {
        id: "skills-assessment",
        name: "Skills Assessment",
        duration: "2-4 tháng",
        description: "Đánh giá kỹ năng nghề nghiệp",
        documents: [
          "Bằng cấp & bảng điểm",
          "Thư xác nhận kinh nghiệp",
          "CV",
          "Chứng chỉ tiếng Anh",
        ],
      },
      {
        id: "regional-nomination",
        name: "Regional Nomination",
        duration: "2-6 tuần",
        description: "Xin bảo lãnh từ tiểu bang HOẶC nomination từ người thân (relative sponsorship)",
        documents: [
          "Đơn xin bảo lãnh",
          "Kết quả Skills Assessment",
          "EOI points",
          "Thư mời từ relative (nếu có)",
        ],
      },
      {
        id: "eoi-submission",
        name: "EOI Submission",
        duration: "2-4 tuần",
        description: "Nộp EOI với tối thiểu 50 điểm (cộng 15 điểm từ nomination)",
        documents: [
          "EOI form",
          "Điểm số tiếng Anh",
          "Skills Assessment",
        ],
      },
      {
        id: "invitation",
        name: "Invitation Received",
        duration: "1-4 tuần",
        description: "Nhận lời mời nộp hồ sơ",
        documents: [
          "Invitation Letter",
        ],
      },
      {
        id: "visa-application",
        name: "Visa Application",
        duration: "6-12 tháng",
        description: "Nộp hồ sơ visa 491",
        documents: [
          "Form 491",
          "Hộ chiếu",
          "Giấy khai sinh",
          "Khám sức khỏe",
          "Lý lịch tư pháp",
          "Bằng chứng tài chính",
        ],
      },
      {
        id: "grant",
        name: "Visa Granted",
        duration: "–",
        description: "Visa 5 năm, yêu cầu cư trú 3 năm tại vùng regional",
        documents: [
          "Grant Letter",
          "Visa Grant Notice",
        ],
      },
    ],
  },
];

// Stage icon component
function StageIcon({ index, isCompleted, isCurrent, color }) {
  const colors = {
    blue: "bg-blue-500 border-blue-600",
    violet: "bg-violet-500 border-violet-600",
    emerald: "bg-emerald-500 border-emerald-600",
  };

  return (
    <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 text-white text-sm font-bold ${
      isCompleted ? "bg-emerald-500 border-emerald-600" :
      isCurrent ? colors[color] : "bg-gray-300 border-gray-400"
    }`}>
      {isCompleted ? <CheckCircle className="w-5 h-5" /> : index + 1}
    </div>
  );
}

export default function VisaTimeline() {
  const [selectedVisa, setSelectedVisa] = useState(VISA_TYPES[0]);
  const [currentStage, setCurrentStage] = useState(null);
  const [expandedStage, setExpandedStage] = useState(null);

  const colorClasses = {
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-700",
      accent: "text-blue-600",
      badge: "bg-blue-100 text-blue-700",
    },
    violet: {
      bg: "bg-violet-50",
      border: "border-violet-200",
      text: "text-violet-700",
      accent: "text-violet-600",
      badge: "bg-violet-100 text-violet-700",
    },
    emerald: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      text: "text-emerald-700",
      accent: "text-emerald-600",
      badge: "bg-emerald-100 text-emerald-700",
    },
  };

  const c = colorClasses[selectedVisa.color];

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-2 text-sm text-emerald-700 mb-4">
            <TrendingUp className="w-4 h-4" /> Miễn phí
          </div>
          <h1 className="text-3xl font-black text-[#0a1628] mb-2">Tiến trình Visa 189/190/491</h1>
          <p className="text-gray-500">Theo dõi từng bước trong hồ sơ visa của bạn</p>
        </div>

        {/* Processing Times Info */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-blue-800 mb-2">Thời gian xử lý (ước tính)</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="bg-white/70 rounded-lg p-3 text-center">
                  <div className="font-bold text-blue-700 text-lg">6-12 tháng</div>
                  <div className="text-blue-600">Visa 189</div>
                </div>
                <div className="bg-white/70 rounded-lg p-3 text-center">
                  <div className="font-bold text-violet-700 text-lg">8-14 tháng</div>
                  <div className="text-violet-600">Visa 190</div>
                </div>
                <div className="bg-white/70 rounded-lg p-3 text-center">
                  <div className="font-bold text-emerald-700 text-lg">9-15 tháng</div>
                  <div className="text-emerald-600">Visa 491</div>
                </div>
              </div>
              <p className="text-xs text-blue-600 mt-3">
                * Thời gian xử lý mang tính tham khảo, có thể thay đổi tùy theo tình trạng hồ sơ và workload của Bộ Nội vụ Úc.
              </p>
            </div>
          </div>
        </div>

        {/* Visa Type Selector */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {VISA_TYPES.map((visa) => (
            <button
              key={visa.id}
              onClick={() => { setSelectedVisa(visa); setCurrentStage(null); setExpandedStage(null); }}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${
                selectedVisa.id === visa.id
                  ? `border-${visa.color}-400 bg-white shadow-md`
                  : "border-gray-100 bg-white hover:border-gray-200"
              }`}
            >
              <div className="font-bold text-[#0a1628] mb-1">{visa.name}</div>
              <div className="text-xs text-gray-500 mb-2">{visa.subtitle}</div>
              <div className="flex items-center gap-2 text-xs">
                <span className={`px-2 py-0.5 rounded-full ${colorClasses[visa.color].badge}`}>
                  {visa.points}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Visa Info */}
        <div className={`${c.bg} rounded-2xl border ${c.border} p-6 mb-8`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="font-bold text-xl text-[#0a1628] mb-1">{selectedVisa.name}</h2>
              <p className="text-gray-600 text-sm">{selectedVisa.description}</p>
            </div>
            <div className="flex gap-4 text-sm">
              <div className="text-center">
                <div className={`font-bold ${c.accent}`}>{selectedVisa.points}</div>
                <div className="text-gray-500 text-xs">Điểm tối thiểu</div>
              </div>
              <div className="text-center">
                <div className={`font-bold ${c.accent}`}>{selectedVisa.processingTime}</div>
                <div className="text-gray-500 text-xs">Thời gian xử lý</div>
              </div>
            </div>
          </div>
        </div>

        {/* Mark Current Stage */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6">
          <h3 className="font-bold text-[#0a1628] mb-3">Bạn đang ở giai đoạn nào?</h3>
          <div className="flex flex-wrap gap-2">
            {selectedVisa.stages.map((stage, index) => (
              <button
                key={stage.id}
                onClick={() => setCurrentStage(stage.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  currentStage === stage.id
                    ? `${c.accent} bg-white border-2 ${c.border}`
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {index + 1}. {stage.name}
              </button>
            ))}
          </div>
          {currentStage && (
            <div className={`mt-3 p-3 ${c.bg} rounded-lg text-sm ${c.accent}`}>
              Giai đoạn hiện tại: <strong>{selectedVisa.stages.find(s => s.id === currentStage)?.name}</strong>
            </div>
          )}
        </div>

        {/* Timeline */}
        <div className="space-y-0">
          {selectedVisa.stages.map((stage, index) => {
            const isCompleted = currentStage && selectedVisa.stages.findIndex(s => s.id === currentStage) > index;
            const isCurrent = currentStage === stage.id;
            const isExpanded = expandedStage === stage.id;

            return (
              <div key={stage.id} className="relative">
                {/* Connector line */}
                {index < selectedVisa.stages.length - 1 && (
                  <div className={`absolute left-4 top-10 bottom-0 w-0.5 ${
                    isCompleted ? "bg-emerald-400" : "bg-gray-200"
                  }`} style={{ zIndex: 0 }} />
                )}

                <div
                  className={`relative bg-white rounded-2xl border-2 mb-4 transition-all ${
                    isCurrent ? `${c.border} shadow-md` :
                    isCompleted ? "border-emerald-200" : "border-gray-100"
                  }`}
                >
                  {/* Header */}
                  <button
                    onClick={() => setExpandedStage(isExpanded ? null : stage.id)}
                    className="w-full p-4 flex items-start gap-4 text-left"
                  >
                    <StageIcon
                      index={index}
                      isCompleted={isCompleted}
                      isCurrent={isCurrent}
                      color={selectedVisa.color}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-bold ${isCurrent ? c.accent : "text-[#0a1628]"}`}>
                          {stage.name}
                        </h3>
                        {isCurrent && (
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.badge}`}>
                            Hiện tại
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{stage.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">
                        {stage.duration}
                      </span>
                      <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    </div>
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 p-4 pt-0">
                      <div className="mt-4">
                        <h4 className="font-bold text-sm text-[#0a1628] mb-3 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-500" />
                          Tài liệu cần chuẩn bị
                        </h4>
                        <ul className="space-y-2">
                          {stage.documents.map((doc, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                              {doc}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Progress indicator */}
                      <div className="mt-4 flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${isCompleted ? "bg-emerald-500" : isCurrent ? c.accent.replace("text-", "bg-") : "bg-gray-200"}`}
                            style={{ width: isCompleted ? "100%" : isCurrent ? "50%" : "0%" }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">
                          {isCompleted ? "Hoàn thành" : isCurrent ? "Đang thực hiện" : "Chưa bắt đầu"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Help Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-8">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700">
              <strong>Lưu ý:</strong> Thời gian xử lý mang tính tham khảo và có thể thay đổi tùy theo tình trạng hồ sơ và workload của Bộ Nội vụ Úc. Liên hệ MARA agent để được tư vấn cụ thể cho trường hợp của bạn.
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <Link
            to={createPageUrl("Chat")}
            className="inline-flex items-center gap-2 bg-[#0f2347] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#1a3a6e] transition-colors"
          >
            Hỏi AI về tiến trình visa của bạn
          </Link>
        </div>
      </div>
    </div>
  );
}
