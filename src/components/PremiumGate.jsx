import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Crown, Lock, Loader2, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

/**
 * Wraps premium-only content.
 * - Not logged in → prompt login
 * - Logged in but not premium → show upgrade wall
 * - Premium → render children
 */
export default function PremiumGate({ children, featureName = "tính năng này" }) {
  const [user, setUser] = useState(undefined); // undefined = loading
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const u = await base44.auth.me().catch(() => null);
      setUser(u);
      if (u) {
        const profiles = await base44.entities.UserProfile.list("-created_date", 1).catch(() => []);
        setIsPremium(profiles[0]?.is_premium === true);
      }
      setLoading(false);
    };
    init();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
    </div>
  );

  // Not logged in
  if (!user) return (
    <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 max-w-sm w-full p-8 text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <LogIn className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-[#0a1628] mb-2">Đăng nhập để tiếp tục</h2>
        <p className="text-gray-500 text-sm mb-6">Bạn cần đăng nhập để dùng {featureName}.</p>
        <button
          onClick={() => base44.auth.redirectToLogin(window.location.pathname)}
          className="w-full bg-[#0f2347] text-white py-3 rounded-xl font-semibold hover:bg-[#1a3a6e] transition-colors flex items-center justify-center gap-2"
        >
          <LogIn className="w-4 h-4" /> Đăng nhập / Đăng ký
        </button>
      </div>
    </div>
  );

  // Logged in but not premium
  if (!isPremium) return (
    <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 max-w-sm w-full p-8 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Crown className="w-8 h-8 text-violet-600" />
        </div>
        <div className="inline-flex items-center gap-1.5 bg-violet-50 border border-violet-200 rounded-full px-3 py-1 text-xs font-semibold text-violet-700 mb-3">
          <Lock className="w-3 h-3" /> Tính năng Premium
        </div>
        <h2 className="text-xl font-bold text-[#0a1628] mb-2">Nâng cấp để dùng {featureName}</h2>
        <p className="text-gray-500 text-sm mb-6">
          Gói trả phí mở khóa toàn bộ công cụ AI chuyên sâu: EOI Generator, MyPlan, CV tự động, biểu mẫu đầy đủ và nhiều hơn nữa.
        </p>
        <Link
          to={createPageUrl("Pricing")}
          className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2 mb-3"
        >
          <Crown className="w-4 h-4" /> Xem gói dịch vụ
        </Link>
        <Link to={createPageUrl("Chat")} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          Dùng AI tư vấn miễn phí →
        </Link>
      </div>
    </div>
  );

  // Premium – render content
  return children;
}