import { useState, useRef, useEffect } from "react";
import {
  Send, Bot, User, Zap, AlertCircle, X, MessageCircle,
  Lock, ChevronRight, Sparkles, RefreshCw, CreditCard,
  Info, CheckCircle2
} from "lucide-react";

// ─── Constants ──────────────────────────────────────────────────────────────
const FREE_LIMIT = 5; // questions per day for guests
const MOCK_RESPONSE_DELAY_MS = 1200; // simulated AI thinking delay

const QUICK_QUESTIONS = [
  "Tôi đang học tại Úc, bước tiếp theo để xin PR là gì?",
  "Cần bao nhiêu điểm EOI để xin visa 189?",
  "Skills Assessment của ngành IT nộp ở đâu?",
  "Visa 485 cho phép ở lại bao lâu sau tốt nghiệp?",
  "Làm thế nào để tăng điểm IELTS lên 8.0?",
  "Visa 190 và 491 khác nhau như thế nào?",
];

const INITIAL_MESSAGES = [
  {
    id: 0,
    role: "assistant",
    content:
      "Xin chào! 👋 Tôi là VisaPath AI – trợ lý tư vấn di trú Úc của bạn.\n\nBạn có thể hỏi tôi về:\n• Lộ trình PR (189, 190, 491, 858)\n• Điểm EOI & Skills Assessment\n• Hồ sơ cần chuẩn bị\n• Biểu mẫu di trú\n• Deadline & nhắc nhở\n\nMỗi câu hỏi tiêu thụ **1 tín dụng**. Hôm nay bạn còn **5 câu hỏi miễn phí**.",
  },
];

const MOCK_RESPONSES = {
  default:
    "Cảm ơn câu hỏi của bạn! Đây là thông tin chi tiết:\n\nDựa trên hồ sơ di trú Úc, tôi khuyên bạn nên:\n\n**1. Kiểm tra điều kiện cụ thể**\nMỗi trường hợp có yêu cầu riêng dựa trên nghề nghiệp, trình độ và kinh nghiệm.\n\n**2. Chuẩn bị hồ sơ đầy đủ**\nBao gồm Skills Assessment, IELTS, và các giấy tờ liên quan.\n\n**3. Theo dõi SkillSelect**\nĐể nắm được điểm cutoff và thời điểm invite.\n\nBạn muốn tôi phân tích chi tiết hơn về trường hợp cụ thể của bạn không?",
};

// ─── Sub-components ──────────────────────────────────────────────────────────
function CreditIndicator({ remaining, total = 5 }) {
  const pct = (remaining / total) * 100;
  const color = remaining > 2 ? "bg-emerald-500" : remaining > 0 ? "bg-amber-500" : "bg-rose-500";
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-2 w-4 rounded-full ${
              i < remaining ? color : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-gray-500 font-medium">{remaining}/{total} miễn phí</span>
    </div>
  );
}

function LoginGateModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
        <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Lock className="w-7 h-7 text-amber-600" />
        </div>
        <h2 className="font-bold text-xl text-gray-900 mb-2">Hết lượt miễn phí</h2>
        <p className="text-gray-600 text-sm mb-6">
          Bạn đã dùng hết 5 câu hỏi miễn phí hôm nay. Đăng nhập hoặc mua tín dụng để tiếp tục tư vấn không giới hạn.
        </p>
        <div className="space-y-3">
          <button className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-700 transition-colors">
            Đăng nhập / Đăng ký
          </button>
          <a
            href="/pricing"
            className="w-full py-3 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
          >
            <CreditCard className="w-4 h-4" />
            Mua tín dụng từ 29,000₫
          </a>
          <button
            onClick={onClose}
            className="w-full py-2.5 text-gray-500 text-sm hover:text-gray-700"
          >
            Để sau
          </button>
        </div>
      </div>
    </div>
  );
}

function UpgradeBanner() {
  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-3 flex items-center gap-3">
      <Sparkles className="w-5 h-5 text-indigo-500 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-indigo-900">
          Mua tín dụng để tư vấn không giới hạn
        </p>
        <p className="text-xs text-indigo-700">
          Từ 29,000₫ · Phân tích lộ trình · MyPlan · EOI chi tiết
        </p>
      </div>
      <a
        href="/pricing"
        className="flex-shrink-0 text-xs bg-indigo-500 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-indigo-600 transition-colors flex items-center gap-1"
      >
        Nạp <ChevronRight className="w-3.5 h-3.5" />
      </a>
    </div>
  );
}

function MessageBubble({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
          isUser ? "bg-gray-900" : "bg-gradient-to-br from-emerald-400 to-emerald-600"
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "bg-gray-900 text-white rounded-tr-sm"
            : "bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm"
        }`}
      >
        {msg.content.split("\n").map((line, i) => {
          if (line.match(/\*\*(.*?)\*\*/)) {
            return (
              <p key={i} className="mb-1">
                {line.split(/(\*\*.*?\*\*)/).map((part, j) =>
                  part.startsWith("**") && part.endsWith("**") ? (
                    <strong key={j}>{part.slice(2, -2)}</strong>
                  ) : (
                    part
                  )
                )}
              </p>
            );
          }
          if (line.trim() === "") return <br key={i} />;
          if (line.startsWith("•")) {
            return <p key={i} className="pl-2 mb-0.5">{line}</p>;
          }
          return <p key={i} className="mb-1">{line}</p>;
        })}
        {msg.credits && (
          <div className="flex items-center gap-1 mt-2 text-xs text-gray-400 border-t border-gray-100 pt-2">
            <Zap className="w-3 h-3" />
            -{msg.credits} tín dụng
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function Chat() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [freeRemaining, setFreeRemaining] = useState(FREE_LIMIT);
  const [showLoginGate, setShowLoginGate] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed) return;

    if (freeRemaining <= 0) {
      setShowLoginGate(true);
      return;
    }

    const userMsg = { id: Date.now(), role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setFreeRemaining((prev) => Math.max(0, prev - 1));

    // Simulate AI response
    await new Promise((r) => setTimeout(r, MOCK_RESPONSE_DELAY_MS));
    const aiMsg = {
      id: Date.now() + 1,
      role: "assistant",
      content: MOCK_RESPONSES.default,
      credits: 1,
    };
    setMessages((prev) => [...prev, aiMsg]);
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearHistory = () => {
    setMessages(INITIAL_MESSAGES);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 flex-shrink-0">
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h1 className="font-bold text-gray-900">VisaPath AI</h1>
          <p className="text-xs text-emerald-600">● Đang hoạt động</p>
        </div>
        <CreditIndicator remaining={freeRemaining} />
        <button
          onClick={clearHistory}
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          title="Xoá lịch sử"
        >
          <RefreshCw className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Upgrade banner */}
      <div className="px-4 pt-3 flex-shrink-0">
        <UpgradeBanner />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick questions */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2 flex-shrink-0">
          <p className="text-xs text-gray-500 mb-2 font-medium">Câu hỏi thường gặp:</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {QUICK_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="flex-shrink-0 text-xs bg-white border border-gray-200 text-gray-700 px-3 py-2 rounded-xl hover:border-emerald-300 hover:text-emerald-700 transition-colors max-w-[200px] text-left"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Credit info */}
      {freeRemaining <= 2 && freeRemaining > 0 && (
        <div className="px-4 pb-2 flex-shrink-0">
          <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>
              Còn <strong>{freeRemaining} câu hỏi miễn phí</strong>. Mua tín dụng để tư vấn thêm.
            </span>
            <a href="/pricing" className="font-semibold underline whitespace-nowrap">
              Nạp ngay
            </a>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="bg-white border-t border-gray-200 px-4 py-3 flex-shrink-0">
        <div className="flex gap-2 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Hỏi về visa, lộ trình PR, điểm EOI..."
            className="flex-1 resize-none rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 max-h-32 min-h-[44px]"
            rows={1}
            disabled={loading || freeRemaining <= 0}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading || freeRemaining <= 0}
            className="w-11 h-11 bg-emerald-500 text-white rounded-xl flex items-center justify-center hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1.5 text-center">
          1 câu hỏi = 1 tín dụng · Miễn phí {FREE_LIMIT} câu/ngày
        </p>
      </div>

      {/* Login gate modal */}
      {showLoginGate && <LoginGateModal onClose={() => setShowLoginGate(false)} />}
    </div>
  );
}