import { useEffect, useState } from "react";
import { CheckCircle, Home, Loader2, Crown, User } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { createPageUrl } from "@/utils";

const ACCOUNT_KEY = "visapath_account";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [activating, setActivating] = useState(false);
  const [activated, setActivated] = useState(false);
  const [account, setAccount] = useState(null);
  const [error, setError] = useState(null);

  const sessionId = searchParams.get("session_id");
  const planId = searchParams.get("plan");
  const isAnnual = searchParams.get("annual") === "1";

  useEffect(() => {
    // Check if already activated (prevents re-activation on page refresh)
    const existing = localStorage.getItem(ACCOUNT_KEY);
    if (existing) {
      try {
        const parsed = JSON.parse(existing);
        if (parsed.sessionId === sessionId) {
          setAccount(parsed);
          setActivated(true);
          return;
        }
      } catch { /* ignore */ }
    }

    if (!sessionId) {
      setActivated(true);
      return;
    }

    // Activate the account via API
    setActivating(true);
    fetch("/api/auth/activate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Activation failed");
        return data;
      })
      .then((data) => {
        const accountData = { ...data, sessionId };
        localStorage.setItem(ACCOUNT_KEY, JSON.stringify(accountData));
        setAccount(accountData);
        setActivated(true);
        setActivating(false);
      })
      .catch((err) => {
        console.error("Activation error:", err);
        // Still show success UI — user can contact support
        setError(err.message);
        setActivated(true);
        setActivating(false);
      });
  }, [sessionId]);

  const planLabels = {
    basic: { name: "Basic", color: "blue", price: isAnnual ? "$115/năm" : "$12/tháng" },
    premium: { name: "Premium", color: "violet", price: isAnnual ? "$240/năm" : "$25/tháng" },
    professional: { name: "Chuyên nghiệp", color: "amber", price: isAnnual ? "$432/năm" : "$45/tháng" },
  };
  const planInfo = planLabels[account?.planId || planId] || planLabels.basic;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
          {/* Icon */}
          <div className="mb-6">
            {activating ? (
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
              </div>
            ) : (
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl font-black text-[#0a1628] mb-3">
            {activating ? "Đang kích hoạt tài khoản..." : "Thanh toán thành công!"}
          </h1>

          {/* Message */}
          {activating ? (
            <p className="text-gray-500 mb-6">Vui lòng chờ trong giây lát...</p>
          ) : (
            <p className="text-gray-600 mb-6">
              Cảm ơn bạn! {account ? "Tài khoản đã được kích hoạt ngay lập tức." : "Tài khoản sẽ được kích hoạt sớm."}
            </p>
          )}

          {/* Account Info (after activation) */}
          {activated && account && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-5 text-left">
              <div className="flex items-center gap-2 mb-3">
                <Crown className="w-4 h-4 text-amber-500" />
                <span className="font-bold text-green-800 text-sm">Tài khoản đã kích hoạt</span>
              </div>
              <div className="space-y-1.5 text-xs text-green-700">
                <div className="flex justify-between">
                  <span className="text-green-600">Gói:</span>
                  <span className="font-semibold">{planInfo.name} — {planInfo.price}</span>
                </div>
                {account.email && (
                  <div className="flex justify-between">
                    <span className="text-green-600">Email:</span>
                    <span className="font-medium">{account.email}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-green-600">Token:</span>
                  <span className="font-mono text-[10px] text-green-500">{account.token?.slice(0, 8)}…</span>
                </div>
              </div>
            </div>
          )}

          {/* Error note (still show success, just flag for support) */}
          {error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-3 mb-5 text-left">
              <p className="text-xs text-yellow-700">
                Thanh toán thành công nhưng có lỗi kích hoạt tự động. Vui lòng liên hệ support với mã giao dịch của bạn.
              </p>
            </div>
          )}

          {/* No session (direct navigation) */}
          {!sessionId && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
              <p className="text-sm text-blue-800">
                Nếu bạn vừa thanh toán, tài khoản sẽ được kích hoạt trong 2-4 giờ.
              </p>
            </div>
          )}

          {/* Support */}
          <div className="text-sm text-gray-500 mb-6">
            <p>Có câu hỏi? Liên hệ:</p>
            <a href="mailto:admin@visa-path-aus.com" className="text-blue-600 font-medium hover:underline">
              admin@visa-path-aus.com
            </a>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              to={createPageUrl("Profile")}
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-6 bg-[#0f2347] text-white font-semibold rounded-xl hover:bg-[#1a3a6e] transition-all"
            >
              <User className="w-4 h-4" />
              Xem tài khoản của tôi
            </Link>
            <Link
              to={createPageUrl("Home")}
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-6 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
            >
              <Home className="w-4 h-4" />
              Về trang chủ
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Cảm ơn bạn đã tin tưởng Visa Path Australia
        </p>
      </div>
    </div>
  );
}
