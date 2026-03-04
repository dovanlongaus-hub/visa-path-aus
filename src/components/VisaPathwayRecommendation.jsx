import { useState } from 'react';
import { AlertCircle, CheckCircle2, Clock, Target, TrendingUp, ArrowRight, ChevronDown, ChevronUp, Lightbulb, Sparkles } from 'lucide-react';

const visaColors = {
  '189': 'emerald',
  '190': 'blue',
  '491': 'purple',
  '485': 'orange',
  '500': 'cyan',
  '482': 'pink',
  '858': 'violet',
};

const successRateConfig = {
  high: { label: '🟢 Cao', color: 'bg-emerald-100 text-emerald-800', badge: 'border-emerald-300 bg-emerald-50' },
  medium: { label: '🟡 Trung bình', color: 'bg-amber-100 text-amber-800', badge: 'border-amber-300 bg-amber-50' },
  low: { label: '🔴 Thấp', color: 'bg-red-100 text-red-800', badge: 'border-red-300 bg-red-50' },
};

function VisaCard({ visa, index, onOptimize }) {
  const [expanded, setExpanded] = useState(index === 0);
  const config = successRateConfig[visa.successRate] || successRateConfig.medium;

  return (
    <div className={`border-2 rounded-2xl overflow-hidden transition-all ${config.badge}`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-5 flex items-start gap-4 hover:opacity-90 transition-opacity"
      >
        <div className="flex-1 text-left">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-2xl font-black text-blue-700">Visa {visa.code}</div>
            <div className={`text-xs font-bold px-3 py-1 rounded-full ${config.color}`}>
              {config.label}
            </div>
          </div>
          <div className="text-sm text-gray-700 font-medium">{visa.visa}</div>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <div className="text-right text-xs">
            <div className="text-gray-600 font-semibold">{visa.timeline}</div>
          </div>
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-current/20 px-5 py-4 space-y-4">
          {/* Requirements */}
          {visa.requirements?.length > 0 && (
            <div>
              <div className="flex items-center gap-2 font-semibold text-sm text-gray-800 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Yêu cầu chính
              </div>
              <ul className="space-y-1.5 ml-6">
                {visa.requirements.map((req, i) => (
                  <li key={i} className="text-xs text-gray-700 list-disc">
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Gaps */}
          {visa.gaps?.length > 0 && (
            <div>
              <div className="flex items-center gap-2 font-semibold text-sm text-amber-800 mb-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Khoảng cách cần khắc phục
              </div>
              <ul className="space-y-1.5 ml-6">
                {visa.gaps.map((gap, i) => (
                  <li key={i} className="text-xs text-amber-700 list-disc">
                    {gap}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Next Steps */}
          {visa.nextSteps?.length > 0 && (
            <div>
              <div className="flex items-center gap-2 font-semibold text-sm text-blue-800 mb-2">
                <Target className="w-4 h-4 text-blue-600" />
                Bước tiếp theo
              </div>
              <ol className="space-y-1.5 ml-6">
                {visa.nextSteps.map((step, i) => (
                  <li key={i} className="text-xs text-blue-700">
                    <span className="font-bold">{i + 1}.</span> {step}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Notes */}
          {visa.notes && (
            <div className="bg-white/50 rounded-lg p-3 border border-current/10">
              <p className="text-xs text-gray-700">{visa.notes}</p>
            </div>
          )}

          {/* Optimize Button */}
          {onOptimize && (
            <button
              onClick={() => onOptimize(visa.code, visa.visa)}
              className="w-full mt-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              ✨ Tối ưu hóa CV cho Visa {visa.code}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function VisaPathwayRecommendation({ analysis, onOptimize }) {
  if (!analysis) return null;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-bold text-blue-900 mb-2">Phân tích & Đề xuất Visa Pathway</div>
            <p className="text-sm text-blue-800 leading-relaxed">{analysis.summary}</p>
          </div>
        </div>
      </div>

      {/* EOI Points */}
      {analysis.estimatedPoints && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-black text-xl">{analysis.estimatedPoints.match(/\d+/) || '?'}</span>
          </div>
          <div>
            <div className="font-bold text-emerald-900">Ước tính điểm EOI</div>
            <p className="text-sm text-emerald-700">{analysis.estimatedPoints}</p>
          </div>
        </div>
      )}

      {/* Immediate Actions */}
      {analysis.immediateActions?.length > 0 && (
        <div className="bg-white rounded-2xl border-2 border-amber-200 p-6">
          <div className="flex items-center gap-2 font-bold text-amber-900 mb-4">
            <Lightbulb className="w-5 h-5 text-amber-600" />
            Hành động ngay lập tức
          </div>
          <div className="space-y-2">
            {analysis.immediateActions.map((action, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                <div className="w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-amber-800">
                  {i + 1}
                </div>
                <p className="text-sm text-amber-900 leading-relaxed">{action}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Visa Recommendations */}
      {analysis.recommendations?.length > 0 && (
        <div>
          <div className="font-bold text-lg text-gray-800 mb-4">
            💼 Các loại visa phù hợp nhất
          </div>
          <div className="space-y-3">
            {analysis.recommendations.map((visa, i) => (
              <VisaCard key={i} visa={visa} index={i} onOptimize={onOptimize} />
            ))}
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-700">
        <p>
          💡 <strong>Lưu ý:</strong> Đây là phân tích sơ bộ dựa trên thông tin hồ sơ. 
          Luôn tham vấn <strong>MARA agent</strong> được đăng ký cho các quyết định di trú chính thức.
        </p>
      </div>
    </div>
  );
}