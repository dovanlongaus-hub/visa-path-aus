import React from "react";

const checklist = [
  { step: 1, label: "Nhập môn sinh viên", done: false },
  { step: 2, label: "Chuẩn bị hồ sơ định cư", done: false },
  { step: 3, label: "Nộp hồ sơ & theo dõi tiến trình", done: false },
  { step: 4, label: "Checklist sau khi có PR", done: false },
];

export default function ProgressChecklist() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 mt-12 mb-24">
        <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">Checklist Tiến Trình Định Cư</h2>
        <ul className="space-y-6">
          {checklist.map(item => (
            <li key={item.step} className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">{item.step}</span>
              <span className="font-semibold text-blue-900 text-lg">{item.label}</span>
              <span className="ml-auto text-green-600 font-bold">{item.done ? "✓" : ""}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="fixed bottom-0 left-0 w-full bg-blue-900 text-white text-center py-3 text-sm font-semibold shadow-lg z-50">
        Phiên bản mới: Checklist tiến trình định cư (ProgressChecklist.jsx)
      </div>
    </div>
  );
}
