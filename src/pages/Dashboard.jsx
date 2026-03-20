import React from "react";

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 mt-12 mb-24">
        <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">Dashboard Trung Tâm</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-bold text-blue-900 mb-2">Trạng thái hồ sơ</h3>
            <p className="text-blue-800 text-sm">Chưa có hồ sơ. Hãy bắt đầu bằng checklist nhập môn hoặc upload tài liệu.</p>
          </div>
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
            <h3 className="font-bold text-indigo-900 mb-2">Checklist tiến trình</h3>
            <ul className="list-disc pl-5 text-indigo-800 text-sm">
              <li>Nhập môn sinh viên</li>
              <li>Chuẩn bị hồ sơ định cư</li>
              <li>Nộp hồ sơ & theo dõi tiến trình</li>
              <li>Checklist sau khi có PR</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 flex flex-col md:flex-row gap-4">
          <a href="/AIChatAdvisor" className="w-full md:w-auto bg-green-600 text-white py-3 rounded-xl font-bold text-lg text-center">AI Chat Tư Vấn Di Trú</a>
          <a href="/ChecklistOnboarding" className="w-full md:w-auto bg-blue-600 text-white py-3 rounded-xl font-bold text-lg text-center">Checklist nhập môn</a>
          <a href="/AuthOnboarding" className="w-full md:w-auto bg-indigo-600 text-white py-3 rounded-xl font-bold text-lg text-center">Đăng ký & Onboarding</a>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 w-full bg-blue-900 text-white text-center py-3 text-sm font-semibold shadow-lg z-50">
        Phiên bản mới: Dashboard trung tâm (Dashboard.jsx)
      </div>
    </div>
  );
}
