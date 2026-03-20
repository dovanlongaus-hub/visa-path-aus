import React from "react";

const checklist = [
  { step: 1, label: "Mở tài khoản ngân hàng Úc", desc: "Đăng ký trong 6 tuần đầu để được miễn yêu cầu nhân thân." },
  { step: 2, label: "Đăng ký Tax File Number (TFN)", desc: "Bắt buộc khi đi làm, đăng ký online trên myGov." },
  { step: 3, label: "Tạo tài khoản myGov", desc: "Liên kết với ATO, Medicare, Centrelink." },
  { step: 4, label: "Cập nhật địa chỉ trong ImmiAccount, ngân hàng, Medicare", desc: "Đảm bảo thông tin luôn chính xác." },
  { step: 5, label: "Tham gia câu lạc bộ hội thoại tiếng Anh miễn phí", desc: "Tăng kỹ năng giao tiếp, kết nối cộng đồng." },
];

export default function ChecklistOnboarding() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 mt-12 mb-24">
        <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">Checklist Nhập Môn Sinh Viên Úc</h2>
        <ul className="space-y-6">
          {checklist.map(item => (
            <li key={item.step} className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">{item.step}</span>
                <span className="font-semibold text-blue-900 text-lg">{item.label}</span>
              </div>
              <p className="text-sm text-blue-800">{item.desc}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="fixed bottom-0 left-0 w-full bg-blue-900 text-white text-center py-3 text-sm font-semibold shadow-lg z-50">
        Phiên bản mới: Checklist nhập môn sinh viên (ChecklistOnboarding.jsx)
      </div>
    </div>
  );
}
