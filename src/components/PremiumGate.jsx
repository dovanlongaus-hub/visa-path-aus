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

  // Tạm thời cho phép tất cả truy cập không giới hạn
  return children;
}