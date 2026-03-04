import { useState } from 'react';
import { ChevronDown, ChevronUp, Zap, Target, AlertCircle, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import RecommendedResources from './RecommendedResources';

const visaColors = {
  '189': 'from-blue-500 to-cyan-500',
  '190': 'from-emerald-500 to-teal-500',
  '485': 'from-purple-500 to-pink-500',
  '482': 'from-orange-500 to-amber-500',
  '858': 'from-rose-500 to-red-500',
};

const probabilityColors = {
  'Rất cao': 'bg-emerald-50 border-emerald-200 text-emerald-900',
  'Cao': 'bg-cyan-50 border-cyan-200 text-cyan-900',
  'Trung bình': 'bg-amber-50 border-amber-200 text-amber-900',
  'Thấp': 'bg-orange-50 border-orange-200 text-orange-900',
};

function VisaCard({ visa, index }) {
  const [expanded, setExpanded] = useState(index === 0);
  const gradientColor = visaColors[visa.visa_code] || 'from-blue-500 to-cyan-500';

  return (
    <div className="border-2 border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all">
      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-full p-5 bg-gradient-to-r ${gradientColor} text-white flex items-start gap-4 hover:opacity-90 transition-opacity`}
      >
        <div className="flex-1 text-left">
          <div className="font-bold text-lg">{visa.visa_code} - {visa.visa_name}</div>
          <div className="text-sm text-white/90 mt-1">Phù hợp: {visa.suitability_score}%</div>
        </div>
        {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>

      {expanded && (
        <div className="p-6 space-y-4 bg-white">
          {/* Success Probability */}
          <div>
            <div className="font-bold text-gray-900 mb-2">📊 Xác suất thành công</div>
            <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border ${probabilityColors[visa.success_probability] || 'bg-gray-50'}`}>
              {visa.success_probability}
            </div>
          </div>

          {/* Timeline */}
          <div>
            <div className="font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Timeline ước tính
            </div>
            <p className="text-gray-700">{visa.estimated_timeline}</p>
          </div>

          {/* Key Requirements */}
          <div>
            <div className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Yêu cầu chính
            </div>
            <ul className="space-y-2">
              {visa.key_requirements?.map((req, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-700">
                  <span className="text-blue-600 font-bold mt-0.5">✓</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PersonalizedPathway({ pathway, loading }) {
  const [expandedPhase, setExpandedPhase] = useState('immediate');

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 flex items-center justify-center gap-3">
        <div className="w-5 h-5 bg-blue-600 rounded-full animate-bounce"></div>
        <span className="text-gray-600 font-medium">AI đang phân tích CV và tạo lộ trình cá nhân...</span>
      </div>
    );
  }

  if (!pathway) return null;

  return (
    <div className="space-y-8">
      {/* Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6">
        <div className="font-bold text-[#0a1628] text-lg mb-2">🎯 Lộ trình đề xuất</div>
        <p className="text-gray-900 leading-relaxed">{pathway.recommendation_summary}</p>
      </div>

      {/* EOI Points */}
      <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
        <div className="font-bold text-[#0a1628] text-lg mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-600" /> Ước tính điểm EOI SkillSelect
        </div>

        <div className="mb-6 p-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl">
          <div className="text-5xl font-black">{pathway.eoi_estimate?.estimated_points || 0}</div>
          <div className="text-sm text-white/80 mt-2">
            {pathway.eoi_estimate?.estimated_points >= 65 ? '✓ Đủ điểm để nộp EOI' : '⚠️ Cần cải thiện để đạt 65 điểm'}
          </div>
        </div>

        <div className="space-y-3">
          {pathway.eoi_estimate?.breakdown?.map((item, i) => (
            <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700 font-medium">{item.factor}</span>
              <span className="text-lg font-bold text-blue-600">+{item.points}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Suitable Visas */}
      <div className="space-y-4">
        <div className="font-bold text-[#0a1628] text-lg flex items-center gap-2">
          🛂 Visa phù hợp
        </div>
        <div className="space-y-4">
          {pathway.suitable_visas?.map((visa, i) => (
            <VisaCard key={i} visa={visa} index={i} />
          ))}
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6">
          <div className="font-bold text-emerald-900 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" /> Điểm mạnh của bạn
          </div>
          <ul className="space-y-2">
            {pathway.strengths?.map((strength, i) => (
              <li key={i} className="flex items-start gap-2 text-emerald-900">
                <span className="text-lg mt-0.5">⭐</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6">
          <div className="font-bold text-amber-900 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" /> Điểm cần cải thiện
          </div>
          <ul className="space-y-2">
            {pathway.weaknesses?.map((weakness, i) => (
              <li key={i} className="flex items-start gap-2 text-amber-900">
                <span className="text-lg mt-0.5">⚠️</span>
                <span>{weakness}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Immediate Actions */}
      {pathway.roadmap?.immediate_actions && pathway.roadmap.immediate_actions.length > 0 && (
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
          <div className="font-bold text-red-900 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5" /> Hành động ngay lập tức
          </div>
          <div className="space-y-3">
            {pathway.roadmap.immediate_actions.map((action, i) => (
              <div
                key={i}
                className={`p-4 rounded-lg border-l-4 ${
                  action.importance === 'critical'
                    ? 'bg-red-100 border-red-500 text-red-900'
                    : 'bg-orange-100 border-orange-500 text-orange-900'
                }`}
              >
                <div className="font-semibold">{action.action}</div>
                <div className="text-sm mt-1 opacity-75">Thời gian: {action.timeline}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Roadmap Phases */}
      <div className="space-y-4">
        <div className="font-bold text-[#0a1628] text-lg">📍 Lộ trình chi tiết</div>

        {/* Phase 1 */}
        {pathway.roadmap?.phase_1 && (
          <div className="border-2 border-blue-200 rounded-2xl overflow-hidden">
            <button
              onClick={() => setExpandedPhase(expandedPhase === 'phase_1' ? '' : 'phase_1')}
              className="w-full p-5 bg-blue-100 text-blue-900 flex items-center justify-between font-bold hover:bg-blue-200 transition-colors"
            >
              <span>1️⃣ {pathway.roadmap.phase_1.title}</span>
              {expandedPhase === 'phase_1' ? <ChevronUp /> : <ChevronDown />}
            </button>
            {expandedPhase === 'phase_1' && (
              <div className="p-5 bg-white space-y-3">
                {pathway.roadmap.phase_1.steps?.map((step, i) => (
                  <div key={i} className="flex gap-3 text-gray-700">
                    <span className="font-bold text-blue-600">{i + 1}.</span>
                    <span>{step}</span>
                  </div>
                ))}
                <RecommendedResources 
                  articles={pathway.roadmap.phase_1.recommended_articles}
                  documents={pathway.roadmap.phase_1.recommended_documents}
                />
              </div>
            )}
          </div>
        )}

        {/* Phase 2 */}
        {pathway.roadmap?.phase_2 && (
          <div className="border-2 border-purple-200 rounded-2xl overflow-hidden">
            <button
              onClick={() => setExpandedPhase(expandedPhase === 'phase_2' ? '' : 'phase_2')}
              className="w-full p-5 bg-purple-100 text-purple-900 flex items-center justify-between font-bold hover:bg-purple-200 transition-colors"
            >
              <span>2️⃣ {pathway.roadmap.phase_2.title}</span>
              {expandedPhase === 'phase_2' ? <ChevronUp /> : <ChevronDown />}
            </button>
            {expandedPhase === 'phase_2' && (
              <div className="p-5 bg-white space-y-3">
                {pathway.roadmap.phase_2.steps?.map((step, i) => (
                  <div key={i} className="flex gap-3 text-gray-700">
                    <span className="font-bold text-purple-600">{i + 1}.</span>
                    <span>{step}</span>
                  </div>
                ))}
                <RecommendedResources 
                  articles={pathway.roadmap.phase_2.recommended_articles}
                  documents={pathway.roadmap.phase_2.recommended_documents}
                />
              </div>
            )}
          </div>
        )}

        {/* Phase 3 */}
        {pathway.roadmap?.phase_3 && (
          <div className="border-2 border-emerald-200 rounded-2xl overflow-hidden">
            <button
              onClick={() => setExpandedPhase(expandedPhase === 'phase_3' ? '' : 'phase_3')}
              className="w-full p-5 bg-emerald-100 text-emerald-900 flex items-center justify-between font-bold hover:bg-emerald-200 transition-colors"
            >
              <span>3️⃣ {pathway.roadmap.phase_3.title}</span>
              {expandedPhase === 'phase_3' ? <ChevronUp /> : <ChevronDown />}
            </button>
            {expandedPhase === 'phase_3' && (
              <div className="p-5 bg-white space-y-3">
                {pathway.roadmap.phase_3.steps?.map((step, i) => (
                  <div key={i} className="flex gap-3 text-gray-700">
                    <span className="font-bold text-emerald-600">{i + 1}.</span>
                    <span>{step}</span>
                  </div>
                ))}
                <RecommendedResources 
                  articles={pathway.roadmap.phase_3.recommended_articles}
                  documents={pathway.roadmap.phase_3.recommended_documents}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Personalized Tips */}
      {pathway.personalized_tips && pathway.personalized_tips.length > 0 && (
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-2xl p-6">
          <div className="font-bold text-[#0a1628] mb-4">💡 Mẹo cá nhân hóa</div>
          <ul className="space-y-2">
            {pathway.personalized_tips.map((tip, i) => (
              <li key={i} className="flex gap-2 text-gray-900">
                <span className="text-cyan-600 font-bold">→</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Questions to Clarify */}
      {pathway.questions_to_clarify && pathway.questions_to_clarify.length > 0 && (
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
          <div className="font-bold text-gray-900 mb-4">❓ Câu hỏi để làm rõ hơn</div>
          <p className="text-gray-600 text-sm mb-3">Trả lời những câu hỏi này sẽ giúp tôi tư vấn chính xác hơn:</p>
          <ul className="space-y-2">
            {pathway.questions_to_clarify.map((q, i) => (
              <li key={i} className="flex gap-2 text-gray-700">
                <span className="text-gray-400">•</span>
                <span>{q}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4">
        <p className="text-sm text-yellow-900">
          <strong>⚠️ Lưu ý:</strong> Những khuyến nghị trên dựa trên phân tích CV và mang tính tham khảo. Vui lòng tham vấn MARA agent được đăng ký để nhận tư vấn chính thức trước khi nộp hồ sơ.
        </p>
      </div>
    </div>
  );
}