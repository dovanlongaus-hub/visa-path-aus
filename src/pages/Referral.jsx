import { useState, useEffect } from "react";
import { Share2, Copy, Gift, Users, Check, Star } from "lucide-react";

export default function Referral() {
  const [referralCode, setReferralCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [eoiScore, setEoiScore] = useState(null);
  const [referralCount, setReferralCount] = useState(0);
  const [referralMonths, setReferralMonths] = useState(0);

  useEffect(() => {
    // Generate or retrieve referral code
    let code = localStorage.getItem("referral_code");
    if (!code) {
      code = "VISA" + Math.random().toString(36).substring(2, 7).toUpperCase();
      localStorage.setItem("referral_code", code);
    }
    setReferralCode(code);

    // Get EOI score from wizard
    try {
      const wizardResult = JSON.parse(localStorage.getItem("eligibility_wizard_result") || "{}");
      if (wizardResult.totalScore) setEoiScore(wizardResult.totalScore);

      const myPlanData = JSON.parse(localStorage.getItem("my_plan") || "{}");
      if (myPlanData.eoiScore && !wizardResult.totalScore) setEoiScore(myPlanData.eoiScore);
    } catch {}

    // Referral stats
    const count = parseInt(localStorage.getItem("referral_count") || "0");
    setReferralCount(count);
    setReferralMonths(Math.floor(count / 1));
  }, []);

  const referralLink = `https://visa-path-aus.longcare.au/?ref=${referralCode}`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareEoiCard = () => {
    const text = eoiScore
      ? `🇦🇺 EOI Score của tôi: ${eoiScore} điểm!\nĐang trên hành trình định cư Úc diện tay nghề.\nKiểm tra điểm của bạn tại: ${referralLink}`
      : `🇦🇺 Tôi đang chuẩn bị định cư Úc diện tay nghề!\nTìm hiểu và kiểm tra điều kiện tại: ${referralLink}`;

    if (navigator.share) {
      navigator.share({ title: "Visa Path Aus - Định cư Úc diện tay nghề", text, url: referralLink });
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] pb-16 px-4 py-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Gift className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#0a1628] mb-2">Giới thiệu bạn bè</h1>
          <p className="text-gray-500 text-sm">Mỗi người bạn giới thiệu thành công → cả 2 nhận 1 tháng Basic miễn phí</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Users className="w-4 h-4 text-indigo-500" />
              <span className="text-2xl font-black text-[#0a1628]">{referralCount}</span>
            </div>
            <p className="text-xs text-gray-400">Đã giới thiệu</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Star className="w-4 h-4 text-amber-500" />
              <span className="text-2xl font-black text-[#0a1628]">{referralMonths}</span>
            </div>
            <p className="text-xs text-gray-400">Tháng miễn phí</p>
          </div>
        </div>

        {/* Referral link */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
          <p className="text-sm font-semibold text-gray-700 mb-3">Link giới thiệu của bạn</p>
          <div className="flex gap-2">
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-500 truncate font-mono">
              {referralLink}
            </div>
            <button onClick={copyLink}
              className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all ${copied ? "bg-green-500 text-white" : "bg-indigo-600 text-white hover:bg-indigo-500"}`}>
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Đã copy!" : "Copy"}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">Code: <span className="font-mono font-bold text-indigo-600">{referralCode}</span></p>
        </div>

        {/* EOI Score Share Card */}
        <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-5 mb-4 text-white">
          <p className="text-sm font-semibold mb-3 opacity-80">📊 Chia sẻ điểm EOI của bạn</p>
          {eoiScore ? (
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <span className="text-2xl font-black">{eoiScore}</span>
              </div>
              <div>
                <p className="font-bold text-lg">EOI Score</p>
                <p className="text-white/70 text-sm">
                  {eoiScore >= 85 ? "🔥 Xuất sắc! Visa 189 trong tầm tay" :
                   eoiScore >= 75 ? "💪 Rất tốt! Khả năng cao nhận ITA" :
                   eoiScore >= 65 ? "👍 Đủ điều kiện nộp EOI" :
                   "📈 Cần cải thiện thêm"}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-white/70 text-sm mb-4">Làm Eligibility Wizard để biết điểm EOI của bạn</p>
          )}
          <button onClick={shareEoiCard}
            className="w-full bg-white text-indigo-600 font-bold py-3 rounded-xl hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2">
            <Share2 className="w-4 h-4" />
            {eoiScore ? `Chia sẻ điểm ${eoiScore} điểm của tôi` : "Chia sẻ với bạn bè"}
          </button>
        </div>

        {/* How it works */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="font-semibold text-gray-800 mb-4">Cách thức hoạt động</p>
          <div className="space-y-3">
            {[
              { step: "1", title: "Chia sẻ link", desc: "Gửi link giới thiệu cho bạn bè đang tìm hiểu visa Úc" },
              { step: "2", title: "Bạn đăng ký", desc: "Họ đăng ký qua link của bạn" },
              { step: "3", title: "Cả 2 nhận thưởng", desc: "Bạn và bạn bè đều nhận 1 tháng Basic miễn phí" },
            ].map(item => (
              <div key={item.step} className="flex gap-3">
                <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-800">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
