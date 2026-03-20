import React, { useState } from "react";

const forms = [
  { id: "eoi", name: "Form EOI (Expression of Interest)", desc: "Điền thông tin EOI để nộp SkillSelect." },
  { id: "skills-assessment", name: "Form Thẩm định nghề nghiệp", desc: "Chuẩn bị hồ sơ thẩm định nghề cho từng ngành." },
  { id: "state-nomination", name: "Form Bảo lãnh tiểu bang", desc: "Nộp đơn xin bảo lãnh tiểu bang (190/491)." },
  { id: "pr-application", name: "Form Nộp hồ sơ PR", desc: "Điền thông tin nộp hồ sơ PR qua ImmiAccount." },
];

export default function FormLibrary() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 mt-12 mb-24">
        <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">Thư viện Form Mẫu Di Trú</h2>
        <ul className="space-y-6">
          {forms.map(form => (
            <li key={form.id} className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-semibold text-blue-900 text-lg">{form.name}</span>
                <button className="ml-auto bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold text-sm" onClick={() => setSelected(form.id)}>Điền form</button>
              </div>
              <p className="text-sm text-blue-800">{form.desc}</p>
            </li>
          ))}
        </ul>
        {selected && (
          <div className="mt-8 bg-indigo-50 border border-indigo-200 rounded-xl p-6">
            <h3 className="font-bold text-indigo-900 mb-2">{forms.find(f => f.id === selected).name}</h3>
            <p className="text-indigo-800 mb-4">(Demo) Form sẽ được tích hợp điền online, lưu nháp, xuất PDF.</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-sm" onClick={() => setSelected(null)}>Đóng</button>
          </div>
        )}
      </div>
      <div className="fixed bottom-0 left-0 w-full bg-blue-900 text-white text-center py-3 text-sm font-semibold shadow-lg z-50">
        Phiên bản mới: Thư viện form mẫu di trú (FormLibrary.jsx)
      </div>
    </div>
  );
}
