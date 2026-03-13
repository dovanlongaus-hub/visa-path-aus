import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import {
  CheckSquare, Square, ChevronDown, ChevronUp, Loader2,
  Plane, Home, FileText, Briefcase, Heart, ShoppingBag, Smartphone,
  DollarSign, Car, BookOpen, AlertCircle, Sparkles, RefreshCw
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { entities } from '@/api/supabaseClient';
import { invokeLLMSmart } from '@/api/aiClient';

const STAGE_ICONS = {
  before_depart: Plane,
  accommodation: Home,
  documents: FileText,
  finance: DollarSign,
  health: Heart,
  work: Briefcase,
  daily: ShoppingBag,
  phone_internet: Smartphone,
  transport: Car,
  study_english: BookOpen,
};

const STAGE_COLORS = {
  before_depart: { bg: "bg-blue-600", light: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", badge: "bg-blue-100 text-blue-700" },
  accommodation:  { bg: "bg-violet-600", light: "bg-violet-50", text: "text-violet-700", border: "border-violet-200", badge: "bg-violet-100 text-violet-700" },
  documents:      { bg: "bg-amber-500", light: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", badge: "bg-amber-100 text-amber-700" },
  finance:        { bg: "bg-emerald-600", light: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", badge: "bg-emerald-100 text-emerald-700" },
  health:         { bg: "bg-rose-600", light: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", badge: "bg-rose-100 text-rose-700" },
  work:           { bg: "bg-indigo-600", light: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200", badge: "bg-indigo-100 text-indigo-700" },
  daily:          { bg: "bg-orange-500", light: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", badge: "bg-orange-100 text-orange-700" },
  phone_internet: { bg: "bg-cyan-600", light: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-200", badge: "bg-cyan-100 text-cyan-700" },
  transport:      { bg: "bg-teal-600", light: "bg-teal-50", text: "text-teal-700", border: "border-teal-200", badge: "bg-teal-100 text-teal-700" },
  study_english:  { bg: "bg-pink-600", light: "bg-pink-50", text: "text-pink-700", border: "border-pink-200", badge: "bg-pink-100 text-pink-700" },
};

// Base checklist - always shown
const BASE_STAGES = [
  {
    id: "before_depart",
    title: "Trước khi lên đường",
    emoji: "✈️",
    tip: "Chuẩn bị kỹ càng trước khi rời Việt Nam sẽ giúp bạn ổn định nhanh hơn tại Úc.",
    items: [
      { text: "Công chứng & dịch thuật tiếng Anh: bằng cấp, hộ chiếu, CMND, giấy khai sinh, lý lịch tư pháp", priority: "high" },
      { text: "Hộ chiếu còn hạn ít nhất 6 tháng, in visa grant letter", priority: "high" },
      { text: "Mua bảo hiểm OSHC (sinh viên) hoặc travel insurance", priority: "high" },
      { text: "Đặt chỗ ở tạm thời tuần đầu (hostel, homestay, Airbnb)", priority: "high" },
      { text: "Đổi một ít tiền AUD mang theo (khoảng AUD 500-1,000)", priority: "medium" },
      { text: "Cài ứng dụng: Google Maps, Opal/Myki (giao thông công cộng), Seek (việc làm)", priority: "medium" },
      { text: "Tải bản sao lưu tất cả tài liệu quan trọng lên Google Drive / iCloud", priority: "medium" },
      { text: "Thông báo ngân hàng Việt Nam về việc dùng thẻ ở nước ngoài", priority: "low" },
      { text: "Mang theo quần áo phù hợp thời tiết Úc (mùa hè/đông tùy thời điểm)", priority: "low" },
    ],
  },
  {
    id: "accommodation",
    title: "Tìm chỗ ở",
    emoji: "🏠",
    tip: "Ưu tiên tìm chỗ ở dài hạn trong tháng đầu để tiết kiệm chi phí.",
    items: [
      { text: "Tìm phòng dài hạn: Facebook Groups (Vietnamese in Sydney/Melbourne), Flatmates.com.au, Domain.com.au", priority: "high" },
      { text: "Hiểu hợp đồng thuê nhà (Tenancy Agreement) trước khi ký", priority: "high" },
      { text: "Thanh toán bond (tiền đặt cọc, thường 4 tuần tiền thuê) và nhận biên lai", priority: "high" },
      { text: "Kiểm tra điện, nước, internet trước khi chuyển vào", priority: "medium" },
      { text: "Đăng ký địa chỉ mới với bưu điện / AusPost Mail Redirection nếu cần", priority: "medium" },
      { text: "Cập nhật địa chỉ trong ImmiAccount, ngân hàng, Medicare", priority: "medium" },
    ],
  },
  {
    id: "finance",
    title: "Tài chính & Ngân hàng",
    emoji: "💰",
    tip: "Mở tài khoản ngân hàng Úc trong 6 tuần đầu để được miễn yêu cầu nhân thân.",
    items: [
      { text: "Mở tài khoản ngân hàng Úc (Commonwealth, ANZ, Westpac, NAB hoặc Wise) trong 6 tuần đầu", priority: "high" },
      { text: "Đăng ký Tax File Number (TFN) trên mygov.au – bắt buộc khi đi làm", priority: "high" },
      { text: "Tạo tài khoản myGov và liên kết với ATO, Medicare, Centrelink", priority: "high" },
      { text: "Hiểu hệ thống thuế Úc: tax bracket, tax return hàng năm", priority: "medium" },
      { text: "Mở Superannuation (quỹ hưu trí) nếu đi làm", priority: "medium" },
      { text: "Tìm hiểu ứng dụng ngân hàng, chuyển khoản, thanh toán hóa đơn", priority: "low" },
    ],
  },
  {
    id: "documents",
    title: "Giấy tờ & Hồ sơ cá nhân",
    emoji: "📄",
    tip: "Đây là bước nhiều người hay bỏ qua nhưng rất quan trọng để sống và làm việc tại Úc.",
    items: [
      { text: "Dịch công chứng bằng cấp, bảng điểm sang tiếng Anh (NAATI translator)", priority: "high" },
      { text: "Xin Statement of Attainment (xác nhận bằng cấp) từ trường tại Úc nếu tốt nghiệp", priority: "high" },
      { text: "Lưu trữ tất cả tài liệu gốc và bản sao đúng quy định", priority: "high" },
      { text: "Xin lý lịch tư pháp tại Úc (National Police Check – $42) nếu cần cho việc làm", priority: "medium" },
      { text: "Xin Working with Children Check (WWC) nếu làm việc với trẻ em", priority: "medium" },
      { text: "Đăng ký nhận thư tại địa chỉ mới (update với immigration)", priority: "medium" },
    ],
  },
  {
    id: "health",
    title: "Sức khỏe & Medicare",
    emoji: "🏥",
    tip: "Đăng ký Medicare ngay nếu đủ điều kiện – miễn phí và rất cần thiết.",
    items: [
      { text: "Đăng ký Medicare card (nếu có diện hiệp định y tế với Việt Nam hoặc PR)", priority: "high" },
      { text: "Tìm bác sĩ gia đình (GP) gần nhà để khám tổng quát", priority: "high" },
      { text: "Mua bảo hiểm tư nhân (Private Health Insurance) nếu cần", priority: "medium" },
      { text: "Mang đủ thuốc kê đơn trong tối thiểu 3 tháng, xin toa bác sĩ quốc tế", priority: "medium" },
      { text: "Đặt lịch hẹn nha sĩ trong 3 tháng đầu", priority: "low" },
      { text: "Tìm hiểu dịch vụ tâm lý miễn phí cho sinh viên/cộng đồng", priority: "low" },
    ],
  },
  {
    id: "phone_internet",
    title: "Điện thoại & Internet",
    emoji: "📱",
    tip: "Số điện thoại Úc rất quan trọng cho xác minh tài khoản ngân hàng, Medicare.",
    items: [
      { text: "Mua SIM card Úc ngay khi đến nơi (Optus, Telstra, Woolworths Mobile)", priority: "high" },
      { text: "Đăng ký gói cước phù hợp (prepaid hay postpaid)", priority: "high" },
      { text: "Đăng ký internet nhà (NBN) – so sánh giá trên Canstar/WhistleOut", priority: "medium" },
      { text: "Cập nhật số điện thoại Úc với tất cả tài khoản quan trọng", priority: "medium" },
    ],
  },
  {
    id: "daily",
    title: "Vật dụng sinh hoạt",
    emoji: "🛒",
    tip: "Mua đồ tại các cửa hàng secondhand (Facebook Marketplace, Gumtree) để tiết kiệm.",
    items: [
      { text: "Mua hoặc thuê nội thất cơ bản (giường, bàn, tủ) – xem Gumtree, Facebook Marketplace", priority: "high" },
      { text: "Mua đồ bếp cơ bản, nồi chảo, dao dĩa", priority: "high" },
      { text: "Mua chăn màn, gối, drap phù hợp thời tiết", priority: "high" },
      { text: "Đăng ký thẻ thành viên siêu thị (Woolworths Everyday Rewards, Coles flybuys)", priority: "medium" },
      { text: "Tìm hiểu chợ Việt Nam, Asian grocery gần nhà", priority: "medium" },
      { text: "Mua adapter điện (Úc dùng Type I, 240V)", priority: "low" },
    ],
  },
  {
    id: "transport",
    title: "Di chuyển & Giao thông",
    emoji: "🚌",
    tip: "Sử dụng public transport kết hợp với xe đạp để tiết kiệm chi phí.",
    items: [
      { text: "Mua thẻ giao thông công cộng: Opal Card (NSW), Myki (VIC), Go Card (QLD)", priority: "high" },
      { text: "Tải ứng dụng: TripView, Transit hoặc Google Maps để tra tuyến xe", priority: "high" },
      { text: "Chuyển đổi bằng lái xe Việt Nam sang bằng Úc nếu cần lái xe", priority: "medium" },
      { text: "Tìm hiểu quy tắc giao thông Úc (lái xe bên trái)", priority: "medium" },
      { text: "Cân nhắc mua xe đạp hoặc scooter cho di chuyển gần", priority: "low" },
    ],
  },
  {
    id: "work",
    title: "Xin việc làm",
    emoji: "💼",
    tip: "Resume Úc khác với CV Việt Nam – ngắn gọn, không ảnh, không tuổi tác.",
    items: [
      { text: "Viết lại Resume theo chuẩn Úc (1-2 trang, không ảnh, không CMND)", priority: "high" },
      { text: "Tạo tài khoản LinkedIn, Seek.com.au, Indeed.com.au", priority: "high" },
      { text: "Chuẩn bị cover letter mẫu và chỉnh sửa theo từng vị trí", priority: "high" },
      { text: "Xin Reference Letter từ giảng viên hoặc sếp cũ (tiếng Anh)", priority: "high" },
      { text: "Xác nhận quyền làm việc trên visa hiện tại (Visa Entitlement Verification Online – VEVO)", priority: "medium" },
      { text: "Luyện tập phỏng vấn tiếng Anh (star method, behavioral questions)", priority: "medium" },
      { text: "Tìm hiểu mức lương thị trường cho nghề của bạn (PayScale, Glassdoor)", priority: "low" },
    ],
  },
  {
    id: "study_english",
    title: "Tiếng Anh thực tế & Hội nhập",
    emoji: "🗣️",
    tip: "Tiếng Anh giao tiếp tại Úc khác với học thuật – hãy thực hành mỗi ngày.",
    items: [
      { text: "Tham gia câu lạc bộ hội thoại tiếng Anh miễn phí tại thư viện", priority: "high" },
      { text: "Theo dõi ABC News, podcast tiếng Anh Úc hàng ngày", priority: "medium" },
      { text: "Tham gia cộng đồng Việt Nam địa phương để hỗ trợ lẫn nhau", priority: "medium" },
      { text: "Tìm hiểu các chương trình AMEP (lớp tiếng Anh miễn phí cho người mới đến Úc)", priority: "medium" },
      { text: "Đăng ký các sự kiện giao lưu văn hóa địa phương", priority: "low" },
    ],
  },
];

// Extra items shown only for specific visa types
const VISA_EXTRA_ITEMS = {
  "500": {
    work: [
      { text: "Kiểm tra giới hạn giờ làm trên visa 500 (48 giờ/2 tuần trong học kỳ)", priority: "high" },
    ],
    finance: [
      { text: "Hiểu cách hoạt động của học bổng, bảng điểm, giảm học phí (nếu có)", priority: "medium" },
    ],
  },
  "485": {
    work: [
      { text: "Visa 485 cho phép làm việc không giới hạn – xác nhận trên VEVO", priority: "high" },
      { text: "Bắt đầu tích lũy kinh nghiệm làm việc có liên quan cho Skills Assessment", priority: "high" },
    ],
  },
  "482": {
    work: [
      { text: "Xác nhận điều kiện làm việc trong hợp đồng với nhà tuyển dụng bảo lãnh", priority: "high" },
      { text: "Hiểu quyền lợi và nghĩa vụ của visa 482 – không thể tự ý đổi công ty", priority: "high" },
    ],
  },
};

const PRIORITY_COLORS = {
  high: "bg-red-100 text-red-700",
  medium: "bg-yellow-100 text-yellow-700",
  low: "bg-gray-100 text-gray-500",
};

const PRIORITY_LABELS = { high: "Ưu tiên cao", medium: "Quan trọng", low: "Tùy chọn" };

const ENTITY_PREFIX = "arrival__";

export default function ArrivalGuide() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState({});
  const [expanded, setExpanded] = useState({ before_depart: true });
  const [aiTips, setAiTips] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    const init = async () => {
      const profiles = await entities.UserProfile.list("-created_date", 1).catch(() => []);
      const p = profiles[0] || null;
      setProfile(p);

      const records = await entities.Checklist.filter({ stage: { $regex: "^arrival__" } }).catch(() => []);
      const state = {};
      records.forEach((r) => { state[`${r.stage}__${r.item}`] = r.completed; });
      setChecked(state);
      setLoading(false);
    };
    init();
  }, []);

  const getStages = () => {
    if (!profile?.current_visa_type) return BASE_STAGES;
    const extras = VISA_EXTRA_ITEMS[profile.current_visa_type] || {};
    return BASE_STAGES.map((stage) => {
      const extra = extras[stage.id] || [];
      return extra.length > 0 ? { ...stage, items: [...stage.items, ...extra] } : stage;
    });
  };

  const stages = getStages();

  const toggle = async (stageId, itemText) => {
    const key = `${stageId}__${itemText}`;
    const newVal = !checked[key];
    setChecked((prev) => ({ ...prev, [key]: newVal }));
    const fullStageId = `${ENTITY_PREFIX}${stageId}`;
    const existing = await entities.Checklist.filter({ stage: fullStageId, item: itemText }).catch(() => []);
    if (existing.length > 0) {
      entities.Checklist.update(existing[0].id, { completed: newVal }).catch(() => {});
    } else {
      entities.Checklist.create({ stage: fullStageId, item: itemText, completed: newVal }).catch(() => {});
    }
  };

  const getProgress = (stage) => {
    const total = stage.items.length;
    const done = stage.items.filter((i) => checked[`${stage.id}__${i.text}`]).length;
    return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
  };

  const overall = (() => {
    let done = 0, total = 0;
    stages.forEach((s) => s.items.forEach((i) => { total++; if (checked[`${s.id}__${i.text}`]) done++; }));
    return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
  })();

  const loadAITips = async () => {
    setLoadingAI(true);
    const context = profile ? `Người dùng có Visa ${profile.current_visa_type || "không rõ"}, học tại ${profile.university || "Úc"}, ngành ${profile.course || "không rõ"}, tiếng Anh ${profile.english_test_type || ""} ${profile.english_score || ""}.` : "Người dùng chưa có hồ sơ.";
    const result = await invokeLLMSmart(prompt, {
      prompt: `Bạn là chuyên gia hỗ trợ người Việt Nam mới sang Úc định cư. ${context}
Hãy đưa ra 5 lời khuyên thực tế và quan trọng nhất cho người này khi mới đến Úc, đặc biệt về: giấy tờ cần dịch thuật, cách tìm việc, những lỗi phổ biến cần tránh, và bí quyết hội nhập nhanh. Trả lời bằng tiếng Việt, ngắn gọn và thực tế.`,
    });
    setAiTips(result);
    setLoadingAI(false);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-md">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#0a1628]">Chuẩn bị cho hành trình qua Úc</h1>
              <p className="text-gray-500 text-sm">Có visa chỉ là bắt đầu – đây là mọi thứ bạn cần làm khi đến Úc</p>
            </div>
          </div>
        </div>

        {/* Personalized banner */}
        {profile ? (
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-4 mb-6 text-white flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <span className="font-semibold">Cá nhân hoá theo hồ sơ của bạn (Visa {profile.current_visa_type || "?"}):</span>{" "}
              Checklist đã được bổ sung thêm các bước đặc thù cho loại visa của bạn.
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <p className="text-sm text-amber-700">
              <Link to={createPageUrl("Profile")} className="font-semibold underline">Điền hồ sơ cá nhân</Link> để checklist được cá nhân hoá theo visa của bạn.
            </p>
          </div>
        )}

        {/* Overall progress */}
        <div className="bg-[#0f2347] rounded-2xl p-6 mb-6 text-white">
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold">Tiến trình chuẩn bị</span>
            <span className="text-2xl font-bold">{overall.pct}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3 mb-2">
            <div
              className="bg-gradient-to-r from-blue-400 to-emerald-400 h-3 rounded-full transition-all duration-500"
              style={{ width: `${overall.pct}%` }}
            />
          </div>
          <p className="text-blue-200 text-sm">{overall.done} / {overall.total} việc đã hoàn thành</p>
        </div>

        {/* AI Tips */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-violet-600" />
              <span className="font-semibold text-[#0a1628]">Lời khuyên AI cá nhân hoá</span>
            </div>
            <button
              onClick={loadAITips}
              disabled={loadingAI}
              className="flex items-center gap-1.5 text-xs bg-violet-600 text-white px-3 py-1.5 rounded-lg hover:bg-violet-700 disabled:opacity-60 transition-colors"
            >
              {loadingAI ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
              {aiTips ? "Làm mới" : "Nhận tư vấn AI"}
            </button>
          </div>
          {aiTips ? (
            <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{aiTips}</div>
          ) : (
            <p className="text-sm text-gray-400">Nhấn nút để nhận lời khuyên cá nhân hoá từ AI dựa trên hồ sơ của bạn.</p>
          )}
        </div>

        {/* Stages */}
        <div className="space-y-4">
          {stages.map((stage) => {
            const c = STAGE_COLORS[stage.id] || STAGE_COLORS.documents;
            const Icon = STAGE_ICONS[stage.id] || FileText;
            const { done, total, pct } = getProgress(stage);
            const isOpen = expanded[stage.id];

            return (
              <div key={stage.id} className={`rounded-2xl border overflow-hidden shadow-sm bg-white ${c.border}`}>
                <button
                  className="w-full px-5 py-4 flex items-center gap-4 text-left hover:bg-gray-50 transition-colors"
                  onClick={() => setExpanded((p) => ({ ...p, [stage.id]: !p[stage.id] }))}
                >
                  <div className={`w-10 h-10 ${c.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-semibold text-[#0a1628] text-sm">{stage.emoji} {stage.title}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.badge}`}>{done}/{total}</span>
                      {done === total && total > 0 && <span className="text-xs text-emerald-600 font-medium">✓ Xong</span>}
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div className={`${c.bg} h-1.5 rounded-full transition-all duration-300`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 border-t border-gray-50">
                    {stage.tip && (
                      <div className={`${c.light} ${c.text} text-xs rounded-xl px-3 py-2 mt-3 mb-3 flex items-start gap-2`}>
                        <span className="flex-shrink-0">💡</span> {stage.tip}
                      </div>
                    )}
                    <div className="space-y-2">
                      {stage.items.map((item, i) => {
                        const key = `${stage.id}__${item.text}`;
                        const isDone = checked[key];
                        return (
                          <button
                            key={i}
                            onClick={() => toggle(stage.id, item.text)}
                            className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-colors ${isDone ? "bg-emerald-50" : "hover:bg-gray-50"}`}
                          >
                            {isDone ? (
                              <CheckSquare className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-500" />
                            ) : (
                              <Square className="w-5 h-5 flex-shrink-0 mt-0.5 text-gray-300" />
                            )}
                            <div className="flex-1 min-w-0">
                              <span className={`text-sm block ${isDone ? "line-through text-gray-400" : "text-gray-700"}`}>
                                {item.text}
                              </span>
                              {!isDone && (
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full mt-1 inline-block font-medium ${PRIORITY_COLORS[item.priority]}`}>
                                  {PRIORITY_LABELS[item.priority]}
                                </span>
                              )}
                            </div>
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

        {/* Bottom CTA */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white text-center">
          <h3 className="font-bold text-lg mb-2">Cần tư vấn thêm?</h3>
          <p className="text-blue-200 text-sm mb-4">Chat với AI chuyên gia di trú để được giải đáp mọi thắc mắc cụ thể của bạn.</p>
          <Link
            to={createPageUrl("Chat")}
            className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-colors"
          >
            <Sparkles className="w-4 h-4" /> Tư vấn AI ngay
          </Link>
        </div>
      </div>
    </div>
  );
}