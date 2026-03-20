import React, { useState } from "react";

const reminders = [
  { id: 1, label: "Gia hạn visa 491", date: "01/03/2027", desc: "Nhắc nhở 12 tháng trước ngày hết hạn." },
  { id: 2, label: "Nộp hồ sơ PR", date: "15/09/2026", desc: "Nhắc nhở deadline nộp hồ sơ PR qua ImmiAccount." },
  { id: 3, label: "Bổ sung giấy tờ thẩm định nghề", date: "30/06/2026", desc: "Nhắc nhở bổ sung giấy tờ cho skills assessment." },
];

export default function DeadlineReminder() {
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? reminders : reminders.slice(0, 2);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 mt-12 mb-24">
        <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">Nhắc nhở deadline quan trọng</h2>
        <ul className="space-y-6">
          {displayed.map(item => (
            <li key={item.id} className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-semibold text-blue-900 text-lg">{item.label}</span>
                <span className="text-xs text-blue-600 ml-auto">{item.date}</span>
              </div>
              <p className="text-sm text-blue-800">{item.desc}</p>
            </li>
          ))}
        </ul>
        <button className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-xl font-bold text-lg" onClick={() => setShowAll(!showAll)}>
          {showAll ? "Ẩn bớt" : "Xem tất cả"}
        </button>
      </div>
      <div className="fixed bottom-0 left-0 w-full bg-blue-900 text-white text-center py-3 text-sm font-semibold shadow-lg z-50">
        Phiên bản mới: Nhắc nhở deadline quan trọng (DeadlineReminder.jsx)
      </div>
    </div>
  );
}
