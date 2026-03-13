import { useState, useEffect, useRef, useCallback } from "react";
import { Send, Bot, User, Loader2, Trash2, Sparkles, Lock, LogIn, Crown, X, MessageSquarePlus, ChevronRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { entities, auth } from '@/api/supabaseClient';
import { invokeLLMStream, MODELS } from '@/api/aiClient';

const FREE_LIMIT = 3;
const BASIC_LIMIT = 999999;
const CHAT_HISTORY_KEY = "visapath_chat_history";
const CHAT_CONVERSATIONS_KEY = "visapath_conversations";

const SYSTEM_PROMPT = `Bạn là chuyên gia tư vấn luật di trú Úc, chuyên hỗ trợ sinh viên và người Việt Nam tại Úc.
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

const GREETING = `Xin chào! Tôi là trợ lý tư vấn di trú Úc của **Visa Path Australia**.

Tôi có thể giúp bạn về:
- **Visa 500/485** — yêu cầu và quy trình
- **Lộ trình PR** qua visa 189, 190, 491
- **Điểm EOI SkillSelect** — cách tính và tối ưu
- **Skills Assessment** theo từng ngành
- **Visa 482** — employer sponsored
- **Visa 858** — National Innovation

Hãy hỏi bất kỳ câu hỏi nào về visa và di trú Úc!`;

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
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [user, setUser] = useState(undefined);
  const [profile, setProfile] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [showUpgradeGate, setShowUpgradeGate] = useState(false);
  const [freeCount, setFreeCount] = useState(0);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setFreeCount(getDailyFreeCount());

    const init = async () => {
      const u = await auth.me().catch(() => null);
      setUser(u);

      if (u) {
        const profiles = await entities.UserProfile.list("-created_date", 1).catch(() => []);
        setProfile(profiles[0] || null);
      }

      // Load from localStorage
      const saved = loadConversation();
      if (saved && saved.length > 0) {
        setMessages(saved);
      } else {
        setMessages([{ role: "assistant", content: GREETING }]);
      }
      setLoadingHistory(false);
    };
    init();
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

    const profileContext = profile ? `
Thông tin người dùng hiện tại:
- Visa: ${profile.current_visa_type || "chưa rõ"}, hết hạn: ${profile.current_visa_expiry || "chưa rõ"}
- Trường: ${profile.university || "chưa rõ"}, ngành: ${profile.course || "chưa rõ"}
- Tiếng Anh: ${profile.english_test_type || ""} ${profile.english_score || ""}
- Skills Assessment: ${profile.skills_assessment_done ? "Đã hoàn thành" : "Chưa làm"}
- ANZSCO: ${profile.occupation_code || "chưa rõ"}
Hãy cá nhân hoá câu trả lời dựa trên thông tin này khi phù hợp.
` : "";

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
          systemPrompt: SYSTEM_PROMPT + "\n" + profileContext,
          history: history.slice(0, -1), // exclude the current user message (it's the prompt)
        }
      );

      const assistantMsg = { role: "assistant", content: fullText };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error("AI error:", err);
      const errorMsg = { role: "assistant", content: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau." };
      setMessages(prev => [...prev, errorMsg]);
    }

    setStreamingContent("");
    setLoading(false);
    inputRef.current?.focus();
  }, [input, loading, messages, user, freeCount, profile]);

  const startNewConversation = () => {
    setMessages([{ role: "assistant", content: GREETING }]);
    localStorage.removeItem(CHAT_HISTORY_KEY);
  };

  const remaining = FREE_LIMIT - freeCount;

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

      {/* Suggested Questions Panel */}
      {messages.length <= 3 && !loadingHistory && (
        <div className="px-4 pb-2">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs text-gray-400 mb-2">Câu hỏi gợi ý:</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_QUESTIONS.flatMap(cat =>
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
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="bg-[#0f2347] text-white w-12 h-12 rounded-xl flex items-center justify-center hover:bg-[#1a3a6e] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
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
