import { CheckCircle, Home, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-black text-[#0a1628] mb-3">
            Thanh toán thành công!
          </h1>

          {/* Message */}
          <p className="text-gray-600 mb-6">
            Cảm ơn bạn! Tài khoản sẽ được kích hoạt trong 2-4 giờ.
          </p>

          {/* Details Card */}
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6">
            <p className="text-sm text-green-800">
              Chúng tôi đã nhận được thanh toán của bạn. Hệ thống đang xử lý và sẽ gửi email xác nhận khi tài khoản được kích hoạt.
            </p>
          </div>

          {/* Support Info */}
          <div className="text-sm text-gray-500 mb-6">
            <p>Có câu hỏi? Liên hệ:</p>
            <a href="mailto:admin@blockID.au" className="text-blue-600 font-medium hover:underline">
              admin@blockID.au
            </a>
          </div>

          {/* Back Button */}
          <Link
            to={createPageUrl("Home")}
            className="inline-flex items-center justify-center gap-2 w-full py-3 px-6 bg-[#0f2347] text-white font-semibold rounded-xl hover:bg-[#1a3a6e] transition-all"
          >
            <Home className="w-4 h-4" />
            Về trang chủ
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Cảm ơn bạn đã tin tưởng Visa Path Australia
        </p>
      </div>
    </div>
  );
}
