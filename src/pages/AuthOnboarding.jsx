import React, { useState } from "react";

export default function AuthOnboarding() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [goal, setGoal] = useState("");
  const [verified, setVerified] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (step === 1 && email) {
      // TODO: trigger email verification
      setStep(2);
    } else if (step === 2 && goal) {
      setStep(3);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 mt-12 mb-24">
        <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">Đăng ký & Onboarding</h2>
        {step === 1 && (
          <form onSubmit={handleSubmit}>
            <label className="block mb-2 font-semibold text-blue-800">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:border-blue-400"
              placeholder="Nhập email của bạn"
              required
            />
            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-lg mt-2">Tiếp tục</button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleSubmit}>
            <label className="block mb-2 font-semibold text-blue-800">Mục tiêu của bạn</label>
            <select
              value={goal}
              onChange={e => setGoal(e.target.value)}
              className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:border-blue-400"
              required
            >
              <option value="">Chọn mục tiêu...</option>
              <option value="study">Du học Úc</option>
              <option value="work">Ở lại làm việc</option>
              <option value="pr">Định cư (PR)</option>
              <option value="family">Bảo lãnh gia đình</option>
            </select>
            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-lg mt-2">Tiếp tục</button>
          </form>
        )}
        {step === 3 && (
          <div className="text-center">
            <h3 className="text-xl font-bold text-green-700 mb-4">Đăng ký thành công!</h3>
            <p className="text-blue-800 mb-6">Bạn đã hoàn thành bước onboarding. Hãy tiếp tục với checklist nhập môn.</p>
            <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold text-lg" onClick={() => window.location.href = "/dashboard"}>Vào Dashboard</button>
          </div>
        )}
      </div>
      <div className="fixed bottom-0 left-0 w-full bg-blue-900 text-white text-center py-3 text-sm font-semibold shadow-lg z-50">
        Phiên bản mới: Đăng ký & Onboarding (AuthOnboarding.jsx)
      </div>
    </div>
  );
}
