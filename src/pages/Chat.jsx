import { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Send, Bot, User, Loader2, MessageCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";

const SYSTEM_PROMPT = `Bạn là chuyên gia tư vấn luật di trú Úc, chuyên hỗ trợ sinh viên Việt Nam đang học tại Úc. 
Bạn có kiến thức chuyên sâu về:
- Visa sinh viên 500, visa tốt nghiệp 485
- Các visa skilled: 189 (Independent), 190 (State Nominated), 491 (Regional)
- Visa 191 (Permanent Residence from Regional - từ 491)
- Hệ thống tính điểm EOI SkillSelect
- Skills Assessment (Đánh giá kỹ năng): Engineers Australia, ACS, VETASSESS, AITSL, etc.
- ANZSCO occupation codes và Skilled Occupation Lists
- Điều kiện tiếng Anh (IELTS, PTE) cho từng visa
- Quy trình nộp hồ sơ, biểu mẫu, phí visa
- Điều kiện tiểu bang bảo lãnh (Victoria, NSW, Queensland, SA, WA, Tasmania, ACT, NT)
- Bảo hiểm OSHC, khám sức khỏe diện di trú
- Regional study bonus, Partner skills bonus

Hãy trả lời bằng tiếng Việt, rõ ràng, cụ thể và thực tế. Khi không chắc chắn, hãy khuyên người dùng tham khảo MARA agent (đại lý di trú được đăng ký tại Úc). Luôn trích dẫn số form hoặc visa code khi liên quan.`;

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Xin chào! Tôi là trợ lý tư vấn di trú Úc. Tôi có thể giúp bạn giải đáp các thắc mắc về:\n\n• **Visa sinh viên (500)** và các yêu cầu\n• **Visa tốt nghiệp (485)** sau khi hoàn thành học\n• **Lộ trình đến PR** qua visa 189, 190, 491\n• **Hệ thống tính điểm EOI** SkillSelect\n• **Skills Assessment** theo từng ngành\n• **Điều kiện tiểu bang bảo lãnh**\n\nBạn muốn hỏi về vấn đề gì?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const quickQuestions = [
    "Điểm EOI tối thiểu để nộp visa 189 là bao nhiêu?",
    "Làm sao tính điểm EOI của tôi?",
    "Visa 485 yêu cầu những gì?",
    "Tiểu bang nào dễ xin bảo lãnh nhất?",
    "Skills Assessment mất bao lâu?",
  ];

  const sendMessage = async (text) => {
    const userMsg = text || input.trim();
    if (!userMsg) return;

    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setInput("");
    setLoading(true);

    const history = messages
      .slice(-10)
      .map((m) => `${m.role === "user" ? "Người dùng" : "Tư vấn viên"}: ${m.content}`)
      .join("\n\n");

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `${SYSTEM_PROMPT}\n\nLịch sử hội thoại:\n${history}\n\nNgười dùng hỏi: ${userMsg}\n\nTrả lời chi tiết, thực tế bằng tiếng Việt:`,
    });

    setMessages((prev) => [...prev, { role: "assistant", content: result }]);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-[#0a1628]">AI Tư vấn Di trú Úc</div>
            <div className="text-xs text-emerald-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              Đang hoạt động
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
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
          ))}

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
      {messages.length <= 1 && (
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
      </div>
    </div>
  );
}