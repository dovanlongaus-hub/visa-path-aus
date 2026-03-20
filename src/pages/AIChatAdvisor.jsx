import React, { useState } from "react";

export default function AIChatAdvisor() {
  const [messages, setMessages] = useState([
    { role: "system", content: "Xin chào! Tôi là trợ lý AI tư vấn di trú Úc. Hãy đặt câu hỏi về visa, lộ trình định cư, checklist, hồ sơ..." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (!input.trim()) return;
    setLoading(true);
    setMessages([...messages, { role: "user", content: input }]);
    try {
      // Gọi API AI tư vấn di trú
      const { invokeLLMSmart } = await import("../api/aiClient");
      const aiReply = await invokeLLMSmart(input, { history: messages.filter(m => m.role !== "system") });
      setMessages(msgs => [...msgs, { role: "assistant", content: aiReply }]);
    } catch (err) {
      setMessages(msgs => [...msgs, { role: "assistant", content: "Xin lỗi, hệ thống AI đang bảo trì. Vui lòng thử lại sau." }]);
    }
    setLoading(false);
    setInput("");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 mt-12 mb-24">
        <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">AI Chat Tư Vấn Di Trú Úc</h2>
        <div className="h-64 overflow-y-auto border border-blue-100 rounded-xl p-4 mb-4 bg-blue-50">
          {messages.map((msg, idx) => (
            <div key={idx} className={msg.role === "user" ? "text-right mb-2" : "text-left mb-2"}>
              <span className={msg.role === "user" ? "inline-block bg-indigo-100 text-indigo-800 rounded-xl px-3 py-2" : "inline-block bg-blue-100 text-blue-800 rounded-xl px-3 py-2"}>
                {msg.content}
              </span>
            </div>
          ))}
          {loading && <div className="text-center text-blue-600">Đang trả lời...</div>}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            className="flex-1 border-2 border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-400"
            placeholder="Nhập câu hỏi về di trú..."
          />
          <button
            className="bg-blue-600 text-white px-4 py-3 rounded-xl font-bold text-lg"
            onClick={handleSend}
            disabled={loading}
          >Gửi</button>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 w-full bg-blue-900 text-white text-center py-3 text-sm font-semibold shadow-lg z-50">
        Phiên bản mới: AI chat tư vấn di trú (AIChatAdvisor.jsx)
      </div>
    </div>
  );
}
