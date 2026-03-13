import { XCircle, ArrowLeft, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function PaymentCancel() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
          {/* Cancel Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="w-12 h-12 text-gray-500" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-black text-[#0a1628] mb-3">
            Thanh toán bị huỷ
          </h1>

          {/* Message */}
          <p className="text-gray-600 mb-6">
            Thanh toán bị huỷ. Bạn có thể thử lại bất cứ lúc nào.
          </p>

          {/* Info Card */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 mb-6">
            <p className="text-sm text-gray-600">
              Bạn đã huỷ thanh toán Stripe. Thông tin thẻ của bạn không bị lưu. Hãy thử lại khi sẵn sàng!
            </p>
          </div>

          {/* Support Info */}
          <div className="text-sm text-gray-500 mb-6">
            <p>Hoặc chuyển khoản ngân hàng:</p>
            <a href="mailto:admin@blockID.au" className="text-blue-600 font-medium hover:underline">
              admin@blockID.au
            </a>
          </div>

          {/* Back to Pricing Button */}
          <Link
            to={createPageUrl("Pricing")}
            className="inline-flex items-center justify-center gap-2 w-full py-3 px-6 bg-[#0f2347] text-white font-semibold rounded-xl hover:bg-[#1a3a6e] transition-all mb-3"
          >
            <CreditCard className="w-4 h-4" />
            Thử lại thanh toán
          </Link>

          {/* Back to Home */}
          <Link
            to={createPageUrl("Home")}
            className="inline-flex items-center justify-center gap-2 w-full py-3 px-6 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Về trang chủ
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Cần hỗ trợ? Liên hệ admin@blockID.au
        </p>
      </div>
    </div>
  );
}
