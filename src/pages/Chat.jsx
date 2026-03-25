import { useState, useEffect, useRef, useCallback } from "react";
import { Send, Bot, User, Loader2, Trash2, Lock, Crown, X, MessageSquarePlus, ChevronRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { entities, auth } from '@/api/supabaseClient';
import { invokeLLMStream, MODELS } from '@/api/aiClient';

const FREE_LIMIT = 3;
const BASIC_LIMIT = 999999;
const CHAT_HISTORY_KEY = "visapath_chat_history";
const CHAT_CONVERSATIONS_KEY = "visapath_conversations";

const PLANNING_SYSTEM_PROMPT = `Bạn là chuyên gia tư vấn luật di trú Úc, chuyên hỗ trợ sinh viên và người Việt Nam tại Úc.
Bạn có kiến thức chuyên sâu về:
- Visa sinh viên 500, visa tốt nghiệp 485
- Các visa skilled: 189 (Independent), 190 (State Nominated), 491 (Regional), 191 (Permanent from Regional)
- Visa 482 (Employer Sponsored), Visa 858 (National Innovation)
- Hệ thống tính điểm EOI SkillSelect
- Skills Assessment: Engineers Australia, ACS, VETASSESS, AITSL, etc.
- ANZSCO occupation codes và Skilled Occupation Lists (CSOL)
- Điều kiện tiếng Anh (IELTS, PTE) cho từng visa
- Quy trình nộp hồ sơ, biểu mẫu, phí visa
- Điều kiện tiểu bang bảo lãnh (VIC, NSW, QLD, SA, WA, TAS, ACT, NT)
- Bảo hiểm OSHC, khám sức khỏe diện di trú
- Regional study bonus, Partner skills bonus

Hãy trả lời bằng tiếng Việt, rõ ràng, cụ thể và thực tế. Khi không chắc chắn, khuyên tham khảo MARA agent. Trích dẫn số form hoặc visa code khi liên quan.`;

const PLANNING_GREETING = `Xin chào! Tôi là trợ lý tư vấn di trú Úc của **Visa Path Australia**.

Tôi có thể giúp bạn về:
- **Visa 500/485** — yêu cầu và quy trình
- **Lộ trình PR** qua visa 189, 190, 491
- **Điểm EOI SkillSelect** — cách tính và tối ưu
- **Skills Assessment** theo từng ngành
- **Visa 482** — employer sponsored
- **Visa 858** — National Innovation

Hãy hỏi bất kỳ câu hỏi nào về visa và di trú Úc!`;

const IMMI_SYSTEM_PROMPT = `Bạn là Immi Agent, chuyên tư vấn quy trình định cư Úc cho SINH VIÊN người Việt tại Úc theo lộ trình Student visa → PR.

Kiến thức cốt lõi bạn cần áp dụng (trả lời bằng tiếng Việt):
- Student Visa (Visa 500) → Graduate Visa (Visa 485) → Skills Assessment → EOI SkillSelect → State Nomination (190/491) → PR (191/hoặc visa PR tương ứng theo lộ trình).
- Visa 500 (Student): cần CoE từ trường CRICOS, chứng minh tài chính, OSHC trong suốt thời gian học, Health Examination, Police Clearance, nộp Form 157A (hoặc nộp online qua ImmiAccount), Form 1221 (Additional Personal Particulars), phí visa AUD 650; English mục tiêu IELTS 5.5+ (hoặc tương đương PTE 42+).
- Visa 485 (Graduate): tốt nghiệp trong 6 tháng gần nhất, học ít nhất 2 năm tại Úc (16 tháng học thực tế), tuổi < 50 tại thời điểm nộp (theo mô tả tổng quan), IELTS 6.0 trung bình và mỗi kỹ năng không dưới 5.0 (hoặc PTE 50+), còn trong hạn visa sinh viên khi nộp, Health exam nếu cần; nộp Form 1276; phí visa AUD 4,600.
- Skills Assessment: xác định ANZSCO code phù hợp và cơ quan đánh giá tương ứng (Engineers Australia, ACS, VETASSESS, AITSL, ...); chuẩn bị bằng cấp/bảng điểm/kinh nghiệm liên quan; dịch công chứng sang tiếng Anh; thời gian xử lý thường vài tháng; mục tiêu nhận kết quả Positive Skills Assessment.
- EOI SkillSelect: mục tiêu thường ≥ 65 điểm; English mục tiêu Competent/Proficient/Superior (IELTS 7.0+ / PTE 65+ / IELTS 8.0+ / PTE 79+ cho điểm cao hơn); tuổi 18–44; cập nhật EOI khi có thay đổi điểm (IELTS/kinh nghiệm); làm rõ bước “Submit EOI và chờ ITA (Invitation to Apply)”.
- State Nomination: đối với visa 190/491, thường cần chọn tiểu bang phù hợp, có bằng chứng liên kết và chuẩn bị hồ sơ supporting theo yêu cầu tiểu bang; cộng điểm nomination vào EOI; lưu ý visa 491 thường yêu cầu sống & làm việc vùng 3 năm trước giai đoạn PR.
- PR: khi nhận ITA, chuẩn bị toàn bộ hồ sơ trong “cửa sổ nộp” (ứng với checklist trong sản phẩm), khám sức khỏe tại panel doctor, Police Check (đủ thời gian cư trú), thu thập tài liệu kinh nghiệm làm việc, điền biểu mẫu (ví dụ các form trong checklist).

Quy tắc trả lời:
1. Luôn bắt đầu bằng việc xác định user đang ở visa 500/485 hay đã chuyển sang skilled/PR.
2. Đưa ra “Bước tiếp theo” ngay lập tức theo stage phù hợp và giải thích vì sao.
3. Trả lời dạng checklist + timeline ước tính (dùng mốc tổng quan), đồng thời nêu rủi ro phổ biến cần tránh.
4. Nếu thiếu dữ liệu quan trọng (ngày tốt nghiệp, OSHC expiry, kết quả IELTS, ANZSCO code/assessment authority, EOI điểm hiện tại, tiểu bang liên kết…), hãy hỏi 3 câu làm rõ.
5. Không cung cấp tư vấn pháp lý chính thức; luôn khuyên tham vấn MARA agent cho quyết định quan trọng.

Bạn phải trả lời rõ ràng, cụ thể, thực tế, ưu tiên người dùng là sinh viên ở Úc.`;

const IMMI_GREETING = `Xin chào! Tôi là Immi Agent — trợ lý chuyên tư vấn lộ trình định cư cho SINH VIÊN tại Úc.

Tôi có thể hướng dẫn:
- Student visa 500 → Graduate visa 485
- Skills Assessment + chọn ANZSCO đúng ngành
- EOI SkillSelect + chiến lược tăng điểm
- State nomination (190/491) → PR theo stage tương ứng

Hãy nói bạn đang ở visa nào (500/485/đang làm hồ sơ EOI) và ngành dự định (hoặc ANZSCO code) nhé!`;

const RESEARCH_SYSTEM_PROMPT = `Bạn là Research Agent tư vấn di trú và định cư Úc cho SINH VIÊN người Việt.
Mục tiêu của bạn là giúp người dùng hiểu đúng lộ trình và biết cần kiểm tra gì trên nguồn chính thức trước khi ra quyết định.

Quy tắc bắt buộc:
- Luôn trả lời bằng tiếng Việt.
- Không cung cấp tư vấn pháp lý chính thức; luôn khuyên tham vấn MARA agent cho quyết định quan trọng.
- Nếu thiếu dữ liệu quan trọng, hãy hỏi tối đa 3 câu làm rõ trước khi chốt “next step”.
- Trả lời theo cấu trúc (đúng thứ tự):
  1) Kết luận nhanh (2-3 gạch đầu dòng, tập trung bước tiếp theo)
  2) Những điều cần kiểm tra trên nguồn chính thức (3-6 mục, kèm link/đường dẫn gợi ý đến Home Affairs hoặc trang visa liên quan)
  3) Checklist hồ sơ cần chuẩn bị (theo stage phù hợp: Student 500 / Graduate 485 / Skills Assessment / EOI / State nomination / PR)
  4) Rủi ro phổ biến & cách tránh
  5) (Voice) Tóm tắt để đọc: 1-3 câu ngắn gọn, dễ nghe khi đọc bằng voice.

Bạn có thể đề xuất câu hỏi nên hỏi, thuật ngữ nên tìm kiếm, và cách tự kiểm tra thông tin. Không bịa “giá trị chắc chắn” nếu chưa đủ dữ liệu.`;

const RESEARCH_GREETING = `Xin chào! Tôi là Research Agent của Visa Path Australia.

Bạn cho tôi biết hiện bạn đang ở visa nào (500/485/đang làm EOI/PR dự kiến), ngành dự định và các mốc thời gian chính.
Tôi sẽ trả lời theo dạng “Kết luận nhanh + checklist + những thứ cần kiểm tra trên nguồn chính thức” để bạn chuẩn bị đúng và giảm rủi ro.`;

const CHAT_AGENT_KEY = "visapath_chat_agent";
// Immi Agent (Sinh viên -> PR) intake overrides (from ImmiAgent page)
const IMMI_VISA_OVERRIDE_KEY = "visapath_immi_visa_type_override";
const IMMI_STAGE_OVERRIDE_KEY = "visapath_immi_stage_override";
const IMMI_INTAKE_OVERRIDE_KEY = "visapath_immi_intake_override";

function getGreeting(profile, agentKey) {
  if (agentKey === "immi") {
    const storedVisa = typeof window !== "undefined" ? localStorage.getItem(IMMI_VISA_OVERRIDE_KEY) : null;
    const storedStage = typeof window !== "undefined" ? localStorage.getItem(IMMI_STAGE_OVERRIDE_KEY) : null;

    if (!profile) {
      if (!storedVisa && !storedStage) return IMMI_GREETING;
      const visaLabel = storedVisa ? ` đang ở Visa ${storedVisa}` : "";
      const stageLabel = storedStage ? ` (${storedStage})` : "";
      return `Xin chào! 👋 Tôi thấy bạn${visaLabel}${stageLabel}.

Hãy cùng tối ưu lộ trình từ Student → PR cho bạn theo bước tiếp theo phù hợp:
1) Điều kiện Visa 500/485 hoặc stage hiện tại
2) Checklist cần làm ngay trong 30 ngày
3) Mốc thời gian & rủi ro cần tránh

Bạn muốn hỏi phần nào trước?`;
    }

    const visaLabel = profile.current_visa_type ? ` đang ở ${profile.current_visa_type}` : "";
    return `Xin chào! 👋 Tôi thấy bạn${visaLabel}.

Hãy cùng tối ưu lộ trình từ Student → PR cho bạn theo bước tiếp theo phù hợp:
1) Điều kiện Visa 500/485 hoặc stage hiện tại
2) Checklist cần làm ngay trong 30 ngày
3) Mốc thời gian & rủi ro cần tránh

Bạn muốn hỏi phần nào trước?`;
  }

  if (agentKey === "research") {
    if (!profile) return RESEARCH_GREETING;
    const visaLabel = profile.current_visa_type ? ` đang ở ${profile.current_visa_type}` : "";
    const occLabel = profile.occupation_code ? ` (${profile.occupation_code})` : "";
    return `Xin chào trở lại! Tôi thấy hồ sơ của bạn${visaLabel}${occLabel}.

Bạn muốn mình “nghiên cứu & chỉ ra cần kiểm tra gì trên nguồn chính thức” cho stage nào trước?`;
  }

  if (!profile) return PLANNING_GREETING;
  const visaLabel = profile.current_visa_type ? ` đang ở ${profile.current_visa_type}` : "";
  const occupationLabel = profile.occupation_code ? ` (${profile.occupation_code})` : "";
  return `Xin chào trở lại! 👋

Tôi thấy hồ sơ của bạn${visaLabel}${occupationLabel}. Tôi sẵn sàng hỗ trợ bạn về:
- **Lộ trình PR phù hợp** với tình trạng visa và nghề nghiệp của bạn
- **Điểm EOI hiện tại** và cách tối ưu để đạt invitation
- **Bước tiếp theo** cụ thể bạn cần làm

Bạn muốn hỏi về điều gì?`;
}

const FREE_COUNT_KEY = "chat_free_count";
const FREE_COUNT_DATE_KEY = "chat_free_count_date";

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function getDailyFreeCount() {
  const storedDate = localStorage.getItem(FREE_COUNT_DATE_KEY);
  const today = getTodayKey();
  if (storedDate !== today) {
    localStorage.setItem(FREE_COUNT_DATE_KEY, today);
    localStorage.setItem(FREE_COUNT_KEY, "0");
    return 0;
  }
  return parseInt(localStorage.getItem(FREE_COUNT_KEY) || "0");
}

// Save/load conversations from localStorage
function saveConversation(messages) {
  try {
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
  } catch { /* quota exceeded */ }
}

function loadConversation() {
  try {
    const data = localStorage.getItem(CHAT_HISTORY_KEY);
    if (data) return JSON.parse(data);
  } catch { /* corrupted */ }
  return null;
}

// ── Suggested Questions Panel ──────────────────────────────
const SUGGESTED_QUESTIONS = [
  { category: "Điểm EOI", questions: [
    "Điểm EOI của tôi là bao nhiêu?",
    "Visa 189 cần bao nhiêu điểm?",
    "Làm sao tăng điểm EOI nhanh nhất?",
  ]},
  { category: "Visa phổ biến", questions: [
    "So sánh visa 189 và 190",
    "Visa 485 yêu cầu những gì?",
    "Visa 482 khác 189 như thế nào?",
  ]},
  { category: "Quy trình", questions: [
    "Skills Assessment mất bao lâu?",
    "Tiểu bang nào dễ xin bảo lãnh nhất?",
    "Chi phí toàn bộ quy trình PR là bao nhiêu?",
  ]},
];

const SUGGESTED_QUESTIONS_IMMI = [
  { category: "Lộ trình Student → PR", questions: [
    "Tôi nên làm gì ngay bây giờ để đi từ visa 500 lên PR?",
    "Timeline visa 500 → 485 → Skills Assessment → EOI → 190/491 → PR nên tính thế nào?",
    "Các mốc nào thường bị bỏ qua dẫn đến chậm PR?",
  ]},
  { category: "Visa 500 & 485", questions: [
    "Visa 500 cần chuẩn bị những tài liệu gì và lỗi hay gặp?",
    "Visa 485 yêu cầu IELTS bao nhiêu và điều kiện 'trong 6 tháng' hiểu thế nào?",
    "Nếu IELTS hiện tại chưa đủ thì nên nâng như thế nào để tối ưu?",
  ]},
  { category: "Skills Assessment & EOI", questions: [
    "Chọn ANZSCO code đúng có ảnh hưởng gì đến EOI/Skills Assessment?",
    "EOI tối ưu điểm ra sao nếu tôi đang nhắm 190 hay 491?",
    "Khi nào nên nộp EOI để tăng cơ hội ITA?",
  ]},
];

const SUGGESTED_QUESTIONS_RESEARCH = [
  { category: "Xác định stage", questions: [
    "Tôi đang ở stage nào (500/485/EOI/190/491) và next step là gì?",
    "Nếu thiếu thông tin, tôi cần thu thập gì để xác định đúng pathway?",
    "Tôi nên tập trung vào visa nào trước để tối ưu rủi ro/chậm trễ?",
  ]},
  { category: "Tra cứu nguồn chính thức", questions: [
    "Tôi nên kiểm tra những điều gì trên Home Affairs để tránh sai hồ sơ?",
    "Bạn gợi ý link/đường dẫn và từ khóa nên tra cho visa 500/485?",
    "Tôi cần kiểm tra gì về Skills Assessment & ANZSCO để không bị mismatch?",
  ]},
  { category: "Checklist & timeline", questions: [
    "Làm checklist 30 ngày cho stage hiện tại của tôi?",
    "Timeline chuẩn bị tài liệu từ hiện tại đến khi nộp EOI/ITA là gì?",
    "Các rủi ro phổ biến khiến hồ sơ bị chậm/bị trả lại?",
  ]},
];

// ── Upgrade Gate Modal ──────────────────────────────────────
function UpgradeGate({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-300 hover:text-gray-500">
          <X className="w-5 h-5" />
        </button>
        <div className="text-center mb-5">
          <div className="w-14 h-14 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Crown className="w-7 h-7 text-violet-600" />
          </div>
          <h2 className="text-xl font-bold text-[#0a1628]">Nâng cấp để tiếp tục</h2>
          <p className="text-sm text-gray-500 mt-2">
            Bạn đã dùng hết {FREE_LIMIT} câu hỏi miễn phí hôm nay. Nâng cấp để hỏi không giới hạn!
          </p>
        </div>
        <Link
          to={createPageUrl("Pricing")}
          className="w-full bg-violet-600 text-white py-3 rounded-xl font-semibold hover:bg-violet-700 transition-colors flex items-center justify-center gap-2"
        >
          <Crown className="w-4 h-4" /> Bắt đầu 7 ngày miễn phí
        </Link>
        <p className="text-xs text-center text-gray-400 mt-3">Từ $12 AUD/tháng · Hủy bất cứ lúc nào</p>
      </div>
    </div>
  );
}

// ── Typing Indicator ────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex gap-3 justify-start">
      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          <span className="text-sm text-gray-400 ml-2">Đang suy nghĩ...</span>
        </div>
      </div>
    </div>
  );
}

export default function Chat() {
  const [agentKey, setAgentKey] = useState(() => localStorage.getItem(CHAT_AGENT_KEY) || "planning");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [user, setUser] = useState(undefined);
  const [profile, setProfile] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [showUpgradeGate, setShowUpgradeGate] = useState(false);
  const [freeCount, setFreeCount] = useState(0);

  // Voice chat (STT + TTS)
  const [voiceOutputEnabled] = useState(true);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscriptPreview, setVoiceTranscriptPreview] = useState("");

  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    setFreeCount(getDailyFreeCount());

    const init = async () => {
      const u = await auth.me().catch(() => null);
      setUser(u);

      let loadedProfile = null;
      if (u) {
        const profiles = await entities.UserProfile.list("-created_date", 1).catch(() => []);
        loadedProfile = profiles[0] || null;
        setProfile(loadedProfile);
      }

      // Load from localStorage
      const saved = loadConversation();
      if (saved && saved.length > 0) {
        setMessages(saved);
      } else {
        setMessages([{ role: "assistant", content: getGreeting(loadedProfile, agentKey) }]);
      }
      setLoadingHistory(false);
    };
    init();
  }, []);

  useEffect(() => {
    // SpeechRecognition varies by browser (Chrome uses window.SpeechRecognition, others may use webkitSpeechRecognition)
    const SpeechRecognitionCtor =
      typeof window !== "undefined" ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null;
    setVoiceSupported(Boolean(SpeechRecognitionCtor));
    setTtsSupported(typeof window !== "undefined" && "speechSynthesis" in window);

    return () => {
      try {
        recognitionRef.current?.stop?.();
      } catch { /* ignore */ }
    };
  }, []);

  const isPremium = profile?.is_premium === true;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  // Persist messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0 && !loadingHistory) {
      saveConversation(messages);
    }
  }, [messages, loadingHistory]);

  const getTextForTTS = (text) => {
    if (!text) return "";
    const voiceMatch = text.match(/Tóm tắt để đọc:\\s*([\\s\\S]{0,450})/i);
    const candidate = (voiceMatch?.[1] || text).trim();
    const cleaned = candidate
      .replace(/\[(.*?)\]\(.*?\)/g, "$1") // strip markdown links
      .replace(/[*#`>_\\-]/g, " ") // remove common markdown symbols
      .replace(/\\s+/g, " ")
      .trim();
    return cleaned.slice(0, 900);
  };

  const maybeSpeak = useCallback((text) => {
    if (!voiceOutputEnabled) return;
    if (typeof window === "undefined") return;
    if (!("speechSynthesis" in window)) return;
    try {
      const textForTTS = getTextForTTS(text);
      if (!textForTTS) return;

      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(textForTTS);
      utter.lang = "vi-VN";
      utter.rate = 1.02;
      utter.pitch = 1;
      window.speechSynthesis.speak(utter);
    } catch {
      // TTS is best-effort; ignore errors.
    }
  }, [voiceOutputEnabled]);

  const sendMessage = useCallback(async (text) => {
    const userMsg = text || input.trim();
    if (!userMsg || loading) return;

    // Gate: anonymous hits FREE_LIMIT
    if (!user && freeCount >= FREE_LIMIT) {
      setShowUpgradeGate(true);
      return;
    }

    const newMsg = { role: "user", content: userMsg };
    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);
    setStreamingContent("");

    // Track free count for anonymous
    if (!user) {
      const newCount = freeCount + 1;
      setFreeCount(newCount);
      localStorage.setItem(FREE_COUNT_KEY, String(newCount));
    }

    const profileContext = (() => {
      // Lấy thêm EOI score từ localStorage nếu có
      const storedEoi = localStorage.getItem("eoi_calc_result");
      let eoiData = null;
      try { eoiData = storedEoi ? JSON.parse(storedEoi) : null; } catch(e) {}

      const storedImmiVisa = localStorage.getItem(IMMI_VISA_OVERRIDE_KEY);
      const storedImmiStage = localStorage.getItem(IMMI_STAGE_OVERRIDE_KEY);
      let intake = null;
      try { intake = JSON.parse(localStorage.getItem(IMMI_INTAKE_OVERRIDE_KEY) || "null"); } catch { /* ignore */ }

      const effectiveVisa = profile?.current_visa_type || storedImmiVisa || "chưa rõ";
      const effectiveEnglishType = profile?.english_test_type || intake?.english_test_type || "";
      const effectiveEnglishScore = profile?.english_score || intake?.english_score || "";
      const effectiveOccupation = profile?.occupation_code || intake?.occupation_code || intake?.occupation || "chưa rõ";
      const effectiveWorkYears = profile?.australia_work_years || profile?.work_experience_years || "chưa rõ";

      const intakeSkillsDone = intake?.skills_assessment_done;
      const skillsAssessmentDone =
        profile?.skills_assessment_done !== undefined
          ? profile.skills_assessment_done
          : (intakeSkillsDone !== undefined
              ? intakeSkillsDone
              : (storedImmiStage
                  ? (storedImmiStage === "eoi" || storedImmiStage === "state" || storedImmiStage === "pr")
                  : undefined));

      const skillsAssessmentAuthority = profile?.skills_assessment_authority || intake?.skills_assessment_authority || "";
      const skillsText =
        skillsAssessmentDone === true
          ? `Đã hoàn thành${skillsAssessmentAuthority ? ` (${skillsAssessmentAuthority})` : ""}`
          : (skillsAssessmentDone === false ? "Chưa làm" : "Chưa rõ");

      return `
Thông tin người dùng:
- Visa hiện tại: ${effectiveVisa}, hết hạn: ${profile?.current_visa_expiry || "chưa rõ"}
${storedImmiStage ? `- Giai đoạn theo lựa chọn Immi Agent: ${storedImmiStage}` : ""}
- Trường/tổ chức: ${profile?.university || "chưa rõ"}, ngành: ${profile?.course || "chưa rõ"}
- Kết quả tiếng Anh: ${effectiveEnglishType} ${effectiveEnglishScore}
- Skills Assessment: ${skillsText}
- Mã nghề ANZSCO: ${effectiveOccupation}
- Kinh nghiệm làm việc: ${effectiveWorkYears} năm
- Quốc tịch: ${profile?.nationality || "Việt Nam"}
${eoiData ? `- Điểm EOI gần nhất: ${eoiData.totalPoints || ""} điểm (tính lần cuối: ${eoiData.calculatedAt || ""})` : ""}

Hãy cá nhân hoá câu trả lời dựa trên hồ sơ này. Nếu người dùng hỏi điều gì đó phù hợp với thông tin trên, hãy tham chiếu cụ thể. Nếu thông tin chưa đủ, hỏi thêm để tư vấn chính xác hơn.
`;
    })();

    // Build history for context (last 8 messages)
    const history = updatedMessages.slice(-8).map(m => ({
      role: m.role,
      content: m.content,
    }));

    try {
      let fullText = "";
      await invokeLLMStream(
        userMsg,
        (delta, accumulated) => {
          fullText = accumulated;
          setStreamingContent(accumulated);
        },
        {
          model: MODELS.balanced,
          systemPrompt:
            (agentKey === "immi"
              ? IMMI_SYSTEM_PROMPT
              : agentKey === "research"
                ? RESEARCH_SYSTEM_PROMPT
                : PLANNING_SYSTEM_PROMPT) + "\n" + profileContext,
          history: history.slice(0, -1), // exclude the current user message (it's the prompt)
        }
      );

      const assistantMsg = { role: "assistant", content: fullText };
      setMessages(prev => [...prev, assistantMsg]);
      maybeSpeak(fullText);
    } catch (err) {
      console.error("AI error:", err);
      const errorMsg = { role: "assistant", content: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau." };
      setMessages(prev => [...prev, errorMsg]);
    }

    setStreamingContent("");
    setLoading(false);
    inputRef.current?.focus();
  }, [input, loading, messages, user, freeCount, profile, agentKey, maybeSpeak]);

  const stopVoiceInput = useCallback(() => {
    try {
      recognitionRef.current?.stop?.();
    } catch { /* ignore */ }
    setIsListening(false);
    setVoiceTranscriptPreview("");
  }, []);

  const startVoiceInput = useCallback(() => {
    if (loading || isListening) return;
    if (!voiceSupported) return;

    const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) return;

    // Stop any ongoing voice output to reduce confusion.
    try {
      window.speechSynthesis?.cancel?.();
    } catch { /* ignore */ }

    const recognition = new SpeechRecognitionCtor();
    recognitionRef.current = recognition;

    recognition.lang = "vi-VN";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      const latest = (transcript || "").trim();
      setVoiceTranscriptPreview(latest);

      const lastResult = event.results[event.results.length - 1];
      const isFinal = Boolean(lastResult?.isFinal);
      if (isFinal && latest.length > 0) {
        stopVoiceInput();
        sendMessage(latest);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
      setVoiceTranscriptPreview("");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    setIsListening(true);
    setVoiceTranscriptPreview("");
    recognition.start();
  }, [loading, isListening, voiceSupported, stopVoiceInput, sendMessage]);

  const runVoiceDemo = useCallback(() => {
    if (loading || isListening) return;
    // Demo câu hỏi để test: AI trả lời + TTS tự đọc lại (không cần micro)
    const demoText =
      agentKey === "research"
        ? "Mình đang ở visa 500. Bạn hãy cho mình next step 30 ngày để hướng tới visa 485 và cho biết những gì cần kiểm tra trên Home Affairs."
        : "Mình đang ở visa 500. Mình nên làm gì trong 30 ngày tới để chuẩn bị lộ trình sang visa 485? Hãy đưa checklist và mốc thời gian ước tính.";
    sendMessage(demoText);
  }, [agentKey, loading, isListening, sendMessage]);

  const startNewConversation = (nextAgentKey = agentKey) => {
    setAgentKey(nextAgentKey);
    localStorage.setItem(CHAT_AGENT_KEY, nextAgentKey);
    setMessages([{ role: "assistant", content: getGreeting(profile, nextAgentKey) }]);
    localStorage.removeItem(CHAT_HISTORY_KEY);
  };

  const remaining = FREE_LIMIT - freeCount;
  const suggestedQuestions =
    agentKey === "immi"
      ? SUGGESTED_QUESTIONS_IMMI
      : agentKey === "research"
        ? SUGGESTED_QUESTIONS_RESEARCH
        : SUGGESTED_QUESTIONS;

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col">
      {showUpgradeGate && <UpgradeGate onClose={() => setShowUpgradeGate(false)} />}

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-[#0a1628]">AI Tư vấn Di trú Úc</div>
              <div className="mt-1 flex gap-2 flex-wrap">
                <button
                  onClick={() => startNewConversation("planning")}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                    agentKey === "planning"
                      ? "bg-[#0f2347] text-white border-[#0f2347]"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  Agent Planning
                </button>
                <button
                  onClick={() => startNewConversation("immi")}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                    agentKey === "immi"
                      ? "bg-[#0f2347] text-white border-[#0f2347]"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  Immi Agent (Sinh viên → PR)
                </button>
                <button
                  onClick={() => startNewConversation("research")}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                    agentKey === "research"
                      ? "bg-[#0f2347] text-white border-[#0f2347]"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  Research Agent (Voice)
                </button>
              </div>
              <div className="text-xs text-gray-400 flex items-center gap-2">
                <span className="flex items-center gap-1 text-emerald-600">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Đang hoạt động
                </span>
                {isPremium && (
                  <span className="text-violet-600 flex items-center gap-1">
                    <Crown className="w-3 h-3" /> Premium
                  </span>
                )}
                {!user && user !== undefined && (
                  <span className="text-amber-600 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> {remaining > 0 ? `${remaining}/${FREE_LIMIT} câu miễn phí` : "Hết lượt"}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* New Conversation Button */}
            <button
              onClick={startNewConversation}
              className="flex items-center gap-1.5 text-xs bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors"
              title="Cuộc trò chuyện mới"
            >
              <MessageSquarePlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mới</span>
            </button>
            {messages.length > 1 && (
              <button
                onClick={() => {
                  if (window.confirm("Xóa lịch sử trò chuyện?")) {
                    startNewConversation();
                  }
                }}
                className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                title="Xóa lịch sử"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {loadingHistory ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
            </div>
          ) : (
            <>
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#0f2347] text-white"
                      : "bg-white border border-gray-100 text-gray-800 shadow-sm"
                  }`}>
                    {msg.role === "assistant" ? (
                      <ReactMarkdown className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0">
                        {msg.content}
                      </ReactMarkdown>
                    ) : msg.content}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                  )}
                </div>
              ))}

              {/* Streaming content */}
              {streamingContent && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm">
                    <ReactMarkdown className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0">
                      {streamingContent}
                    </ReactMarkdown>
                    <span className="inline-block w-2 h-4 bg-blue-500 animate-pulse ml-0.5" />
                  </div>
                </div>
              )}

              {/* Typing indicator */}
              {loading && !streamingContent && <TypingIndicator />}
            </>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Upgrade Banner - shown when free limit reached */}
      {!user && freeCount >= FREE_LIMIT && (
        <div className="mx-4 mb-4 bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl p-5 text-white">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Crown className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-base mb-1">Bạn đã dùng hết 3 câu hỏi miễn phí hôm nay</p>
              <p className="text-white/80 text-sm mb-3">Nâng cấp Basic ($12/tháng) để hỏi không giới hạn + AI biết hồ sơ của bạn</p>
              <div className="flex gap-2 flex-wrap">
                <Link to={createPageUrl("Pricing")} className="bg-white text-blue-600 font-semibold text-sm px-4 py-2 rounded-xl hover:bg-blue-50 transition-colors">
                  Nâng cấp ngay →
                </Link>
                <Link to={createPageUrl("Profile")} className="bg-white/20 text-white font-semibold text-sm px-4 py-2 rounded-xl hover:bg-white/30 transition-colors">
                  Đăng ký miễn phí
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Suggested Questions Panel */}
      {messages.length <= 3 && !loadingHistory && (
        <div className="px-4 pb-2">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs text-gray-400 mb-2">Câu hỏi gợi ý:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.flatMap(cat =>
                cat.questions.map((q, i) => (
                  <button
                    key={`${cat.category}-${i}`}
                    onClick={() => sendMessage(q)}
                    disabled={loading}
                    className="text-xs bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                  >
                    {q}
                    <ChevronRight className="w-3 h-3" />
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="bg-white border-t border-gray-100 px-4 py-3">
        <div className="max-w-3xl mx-auto flex gap-3">
          <input
            ref={inputRef}
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            placeholder={!user && freeCount >= FREE_LIMIT ? "Đăng nhập để tiếp tục..." : "Hỏi về visa, EOI, lộ trình PR..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            disabled={loading}
          />
          <button
            onClick={() => (isListening ? stopVoiceInput() : startVoiceInput())}
            disabled={loading || !voiceSupported || (!isListening && !user && freeCount >= FREE_LIMIT)}
            className="bg-gray-50 border border-gray-200 text-gray-700 w-12 h-12 rounded-xl flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
            title={!voiceSupported ? "Trình duyệt không hỗ trợ SpeechRecognition (voice chat)" : (isListening ? "Dừng ghi" : "Nói vào đây")}
          >
            {isListening ? "Stop" : "Mic"}
          </button>
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="bg-[#0f2347] text-white w-12 h-12 rounded-xl flex items-center justify-center hover:bg-[#1a3a6e] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
        {isListening && (
          <div className="max-w-3xl mx-auto mt-2 text-xs text-center text-gray-400">
            {voiceTranscriptPreview ? `Bạn nói: ${voiceTranscriptPreview}` : "Đang nghe..."}
          </div>
        )}
        <div className="max-w-3xl mx-auto mt-2 text-[11px] text-center text-gray-400">
          Voice status: STT {voiceSupported ? "Có" : "Không"} · TTS {ttsSupported ? "Có" : "Không"}
        </div>
        <div className="max-w-3xl mx-auto mt-2 text-xs text-center">
          <button
            type="button"
            onClick={runVoiceDemo}
            disabled={loading || isListening}
            className="text-xs bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-full hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title="Test end-to-end: AI trả lời tự động + trình duyệt đọc lại (TTS) nếu bật"
          >
            Thử nhanh AI + TTS
          </button>
        </div>
        <p className="text-center text-[10px] text-gray-300 mt-2">
          Thông tin dựa trên hướng dẫn của DoHA. Xác minh tại{" "}
          <a href="https://homeaffairs.gov.au" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-400">homeaffairs.gov.au</a>
          {" "}· Tham vấn MARA agent cho quyết định quan trọng
        </p>
      </div>
    </div>
  );
}
