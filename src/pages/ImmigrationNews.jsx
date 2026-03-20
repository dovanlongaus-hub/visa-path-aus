import React, { useEffect, useState } from "react";

export default function ImmigrationNews() {
  const [news, setNews] = useState([
    { title: "Visa 485 tăng thời gian đáng kể từ 1/7/2024", summary: "Chính phủ Úc tăng thời hạn Visa 485 lên gần gấp đôi từ 1/7/2024 theo Migration Strategy mới.", date: "01/07/2024" },
    { title: "Global Talent Visa đóng cửa – National Innovation Visa (858) chính thức thay thế", summary: "Bộ Di trú Úc chính thức đóng cửa Global Talent Visa từ ngày 6/12/2024.", date: "06/12/2024" },
    { title: "Bộ Di trú sẽ công bố revised Core Skills Occupation List (CSOL) mới", summary: "Danh sách ngành nghề CSOL cập nhật vào tháng 3/2026, ảnh hưởng trực tiếp đến các visa 482, 186 và 190/491.", date: "03/2026" },
  ]);

  // TODO: Tích hợp API lấy tin tức di trú mới nhất

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 mt-12 mb-24">
        <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">Tin tức Di trú Úc mới nhất</h2>
        <ul className="space-y-6">
          {news.map((item, idx) => (
            <li key={idx} className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-semibold text-blue-900 text-lg">{item.title}</span>
                <span className="text-xs text-blue-600 ml-auto">{item.date}</span>
              </div>
              <p className="text-sm text-blue-800">{item.summary}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="fixed bottom-0 left-0 w-full bg-blue-900 text-white text-center py-3 text-sm font-semibold shadow-lg z-50">
        Phiên bản mới: Tin tức di trú Úc (ImmigrationNews.jsx)
      </div>
    </div>
  );
}
