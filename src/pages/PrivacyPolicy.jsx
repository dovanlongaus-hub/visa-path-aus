import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 mt-12 mb-24">
        <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">Chính sách bảo mật dữ liệu</h2>
        <div className="text-blue-800 text-sm">
          <p className="mb-4">Visa Path Australia cam kết bảo mật dữ liệu cá nhân của bạn theo luật pháp Úc. Dữ liệu hồ sơ, tài liệu, thông tin cá nhân đều được mã hóa và chỉ bạn mới có quyền truy cập.</p>
          <ul className="list-disc pl-5 mb-4">
            <li>Không chia sẻ dữ liệu cho bên thứ ba khi chưa có sự đồng ý.</li>
            <li>Mã hóa tài liệu và thông tin cá nhân.</li>
            <li>Phân quyền truy cập rõ ràng.</li>
            <li>Tuân thủ luật bảo vệ dữ liệu của Úc (Privacy Act 1988).</li>
          </ul>
          <p>Để biết thêm chi tiết, vui lòng liên hệ support@visa-path-aus.com.</p>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 w-full bg-blue-900 text-white text-center py-3 text-sm font-semibold shadow-lg z-50">
        Phiên bản mới: Chính sách bảo mật dữ liệu (PrivacyPolicy.jsx)
      </div>
    </div>
  );
}
