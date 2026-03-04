import { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Send, Bot, User, Loader2, Trash2, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

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

const GREETING = `Xin chào! Tôi là trợ lý tư vấn di trú Úc của **Úc Di Trú AI** – tạo bởi DVLong & Genetic AI.

Tôi có thể giúp bạn về:
• **Visa 500/485** – yêu cầu và quy trình
• **Lộ trình PR** qua visa 189, 190, 491
• **Điểm EOI SkillSelect** – cách tính và tối ưu
• **Skills Assessment** theo từng ngành
• **Visa 482** – employer sponsored
• **Visa 858** – National Innovation

Bạn muốn hỏi về vấn đề gì?`;

const SESSION_KEY = "chat_session_id";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const bottomRef = useRef(null);

  // Load user, profile, and chat history
  useEffect(() => {
    const init = async () => {
      // Get or create session ID
      let sid = localStorage.getItem(SESSION_KEY);
      if (!sid) {
        sid = `session_${Date.now()}_${Math.random().toString(36).slice(2)}`;
        localStorage.setItem(SESSION_KEY, sid);
      }
      setSessionId(sid);

      // Load user and profile
      const [u, profiles] = await Promise.all([
        base44.auth.me().catch(() => null),
        base44.entities.UserProfile.list("-created_date", 1).catch(() => []),
      ]);
      setUser(u);
      setProfile(profiles[0] || null);

      // Load previous messages for this session
      const history = await base44.entities.ChatMessage.filter(
        { session_id: sid },
        "created_date",
        50
      ).catch(() => []);

      if (history.length > 0) {
        setMessages(history.map(m => ({ role: m.role, content: m.content })));
      } else {
        setMessages([{ role: "assistant", content: GREETING }]);
      }
      setLoadingHistory(false);
    };
    init();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const quickQuestions = [
    "Điểm EOI tối thiểu để nộp visa 189 là bao nhiêu?",
    "Visa 485 yêu cầu những gì?",
    "Skills Assessment mất bao lâu và chi phí?",
    "Tiểu bang nào dễ xin bảo lãnh nhất?",
    "Visa 482 khác 189 như thế nào?",
  ];

  const sendMessage = async (text) => {
    const userMsg = text || input.trim();
    if (!userMsg) return;

    const newMsg = { role: "user", content: userMsg };
    setMessages(prev => [...prev, newMsg]);
    setInput("");
    setLoading(true);

    // Save user message to DB
    if (sessionId) {
      base44.entities.ChatMessage.create({
        role: "user",
        content: userMsg,
        session_id: sessionId,
      }).catch(() => {});
    }

    // Build context from profile if available
    const profileContext = profile ? `
Thông tin người dùng hiện tại:
- Visa: ${profile.current_visa_type || "chưa rõ"}, hết hạn: ${profile.current_visa_expiry || "chưa rõ"}
- Trường: ${profile.university || "chưa rõ"}, ngành: ${profile.course || "chưa rõ"}
- Tiếng Anh: ${profile.english_test_type || ""} ${profile.english_score || ""}
- Skills Assessment: ${profile.skills_assessment_done ? "Đã hoàn thành" : "Chưa làm"}
- ANZSCO: ${profile.occupation_code || "chưa rõ"}
Hãy cá nhân hoá câu trả lời dựa trên thông tin này khi phù hợp.
` : "";

    // Last 8 messages as context
    const allMessages = [...messages, newMsg];
    const history = allMessages
      .slice(-8)
      .map(m => `${m.role === "user" ? "Người dùng" : "Tư vấn viên"}: ${m.content}`)
      .join("\n\n");

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `${SYSTEM_PROMPT}\n\n${profileContext}\nLịch sử hội thoại:\n${history}\n\nNgười dùng hỏi: ${userMsg}\n\nTrả lời chi tiết, thực tế bằng tiếng Việt:`,
    });

    const assistantMsg = { role: "assistant", content: result };
    setMessages(prev => [...prev, assistantMsg]);

    // Save assistant reply to DB
    if (sessionId) {
      base44.entities.ChatMessage.create({
        role: "assistant",
        content: result,
        session_id: sessionId,
      }).catch(() => {});
    }

    setLoading(false);
  };

  const clearHistory = async () => {
    if (!sessionId) return;
    // Delete messages from DB for this session
    const existing = await base44.entities.ChatMessage.filter({ session_id: sessionId }).catch(() => []);
    await Promise.all(existing.map(m => base44.entities.ChatMessage.delete(m.id).catch(() => {})));
    // New session
    const newSid = `session_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(SESSION_KEY, newSid);
    setSessionId(newSid);
    setMessages([{ role: "assistant", content: GREETING }]);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4">
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
                {profile && (
                  <span className="text-violet-600 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Đã cá nhân hoá cho bạn
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!profile && (
              <Link to={createPageUrl("Profile")} className="text-xs bg-blue-50 border border-blue-200 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                + Điền hồ sơ để AI tư vấn cá nhân hoá
              </Link>
            )}
            {messages.length > 1 && (
              <button onClick={clearHistory} className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors" title="Xoá lịch sử">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {loadingHistory ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
            </div>
          ) : (
            messages.map((msg, i) => (
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
                  ) : (
                    msg.content
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                )}
              </div>
            ))
          )}

          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                <span className="text-sm text-gray-500">Đang tư vấn...</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Quick questions */}
      {messages.length <= 1 && !loadingHistory && (
        <div className="px-4 pb-2">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs text-gray-400 mb-2">Câu hỏi gợi ý:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  className="text-xs bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full hover:border-blue-300 hover:text-blue-600 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="bg-white border-t border-gray-100 px-4 py-4">
        <div className="max-w-3xl mx-auto flex gap-3">
          <input
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            placeholder="Nhập câu hỏi về visa, di trú, điểm EOI..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            disabled={loading}
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="bg-[#0f2347] text-white w-12 h-12 rounded-xl flex items-center justify-center hover:bg-[#1a3a6e] disabled:opacity-40 transition-colors flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-center text-[10px] text-gray-300 mt-2">Tạo bởi DVLong &amp; Genetic AI · Thông tin mang tính tham khảo</p>
      </div>
    </div>
  );
}