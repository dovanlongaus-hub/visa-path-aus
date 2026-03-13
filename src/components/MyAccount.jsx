/**
 * MyAccount.jsx — User Account Panel
 * Shows plan type, premium status, EOI calculation history, chat history
 * Data sourced from localStorage (token-based, no DB required)
 */

import { useState, useEffect } from "react";
import { Crown, User, Calculator, MessageSquare, LogOut, CheckCircle, Clock, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const ACCOUNT_KEY = "visapath_account";
const EOI_HISTORY_KEY = "visapath_eoi_history";
const CHAT_HISTORY_KEY = "visapath_chat_history";

const PLAN_LABELS = {
  free: { name: "Miễn phí", color: "gray", colorClass: "text-gray-600 bg-gray-100" },
  basic: { name: "Basic", color: "blue", colorClass: "text-blue-700 bg-blue-100" },
  premium: { name: "Premium", color: "violet", colorClass: "text-violet-700 bg-violet-100" },
  professional: { name: "Chuyên nghiệp", color: "amber", colorClass: "text-amber-700 bg-amber-100" },
};

export default function MyAccount() {
  const [account, setAccount] = useState(null);
  const [eoiHistory, setEoiHistory] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Load account
    try {
      const raw = localStorage.getItem(ACCOUNT_KEY);
      if (raw) setAccount(JSON.parse(raw));
    } catch { /* ignore */ }

    // Load EOI history
    try {
      const raw = localStorage.getItem(EOI_HISTORY_KEY);
      if (raw) setEoiHistory(JSON.parse(raw).slice(0, 10));
    } catch { /* ignore */ }

    // Load chat history (last 5 messages)
    try {
      const raw = localStorage.getItem(CHAT_HISTORY_KEY);
      if (raw) {
        const msgs = JSON.parse(raw);
        setChatHistory(msgs.filter(m => m.role === "user").slice(-5).reverse());
      }
    } catch { /* ignore */ }
  }, []);

  const handleLogout = () => {
    if (window.confirm("Xoá dữ liệu tài khoản local?")) {
      localStorage.removeItem(ACCOUNT_KEY);
      setAccount(null);
    }
  };

  const clearChatHistory = () => {
    if (window.confirm("Xoá toàn bộ lịch sử chat?")) {
      localStorage.removeItem(CHAT_HISTORY_KEY);
      setChatHistory([]);
    }
  };

  const planId = account?.planId || "free";
  const plan = PLAN_LABELS[planId] || PLAN_LABELS.free;
  const isPremium = account?.premium === true;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0f2347] to-[#1a3a6e] px-6 py-5 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-lg">Tài khoản của tôi</div>
              {account?.email && (
                <div className="text-white/70 text-sm">{account.email}</div>
              )}
            </div>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold ${plan.colorClass}`}>
            {isPremium && <Crown className="w-3.5 h-3.5" />}
            {plan.name}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        {[
          { id: "overview", label: "Tổng quan", icon: User },
          { id: "eoi", label: "Lịch sử EOI", icon: Calculator },
          { id: "chat", label: "Chat gần đây", icon: MessageSquare },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Overview tab */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            {!account ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 mb-4">Bạn chưa có tài khoản Premium</p>
                <Link
                  to={createPageUrl("Pricing")}
                  className="inline-flex items-center gap-2 bg-[#0f2347] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#1a3a6e] transition-colors"
                >
                  <Crown className="w-4 h-4" />
                  Nâng cấp ngay
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="text-xs text-gray-500 mb-1">Gói hiện tại</div>
                    <div className={`font-bold text-sm flex items-center gap-1.5 ${plan.colorClass.split(" ")[0]}`}>
                      <Crown className="w-3.5 h-3.5" />
                      {plan.name}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="text-xs text-gray-500 mb-1">Trạng thái</div>
                    <div className="font-bold text-sm text-emerald-600 flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Đã kích hoạt
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="text-xs text-gray-500 mb-1">Kích hoạt lúc</div>
                    <div className="font-medium text-sm text-gray-700">
                      {account.activatedAt
                        ? new Date(account.activatedAt).toLocaleDateString("vi-VN")
                        : "—"}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="text-xs text-gray-500 mb-1">Token</div>
                    <div className="font-mono text-xs text-gray-400">
                      {account.token?.slice(0, 8)}…
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm text-red-400 hover:text-red-600 transition-colors mt-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Xoá dữ liệu local
                </button>
              </>
            )}
          </div>
        )}

        {/* EOI History tab */}
        {activeTab === "eoi" && (
          <div>
            {eoiHistory.length === 0 ? (
              <div className="text-center py-8">
                <Calculator className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Chưa có lịch sử tính điểm EOI</p>
                <Link
                  to={createPageUrl("EOICalculator")}
                  className="inline-flex items-center gap-1.5 mt-3 text-blue-600 text-sm font-medium hover:underline"
                >
                  Tính điểm EOI ngay
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {eoiHistory.map((item, i) => (
                  <div key={i} className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                    <div>
                      <div className="font-semibold text-[#0a1628] text-sm">{item.totalPoints} điểm</div>
                      <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {item.savedAt ? new Date(item.savedAt).toLocaleDateString("vi-VN") : "—"}
                      </div>
                    </div>
                    <div className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      item.totalPoints >= 80
                        ? "bg-green-100 text-green-700"
                        : item.totalPoints >= 65
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-500"
                    }`}>
                      {item.totalPoints >= 80 ? "Xuất sắc" : item.totalPoints >= 65 ? "Đủ điều kiện" : "Cần cải thiện"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Chat History tab */}
        {activeTab === "chat" && (
          <div>
            {chatHistory.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Chưa có lịch sử chat</p>
                <Link
                  to={createPageUrl("Chat")}
                  className="inline-flex items-center gap-1.5 mt-3 text-blue-600 text-sm font-medium hover:underline"
                >
                  Bắt đầu hỏi AI
                </Link>
              </div>
            ) : (
              <div>
                <div className="space-y-2 mb-4">
                  {chatHistory.map((msg, i) => (
                    <div key={i} className="bg-gray-50 rounded-xl p-3 text-sm text-gray-700 line-clamp-2">
                      {msg.content}
                    </div>
                  ))}
                </div>
                <button
                  onClick={clearChatHistory}
                  className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  Xoá lịch sử chat
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
