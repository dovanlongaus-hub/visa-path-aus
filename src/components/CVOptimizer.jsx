import { useState } from 'react';
import { ChevronDown, ChevronUp, Check, AlertCircle, Sparkles, Copy } from 'lucide-react';

const fieldLabels = {
  employment_history: 'Kinh nghiệm làm việc',
  skills: 'Kỹ năng',
  course: 'Bằng cấp',
  occupation_title: 'Chức danh',
};

function SuggestionCard({ suggestion, onApply, applied }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border-2 border-blue-200 bg-blue-50 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-start gap-3 hover:bg-blue-100 transition-colors"
      >
        <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">
          {suggestion.keywordsToAdd?.length || 0}
        </div>
        <div className="flex-1 text-left">
          <div className="font-semibold text-blue-900 text-sm">{suggestion.title}</div>
          <div className="text-xs text-blue-700 mt-1 font-medium">{fieldLabels[suggestion.field]}</div>
        </div>
        <div className="flex items-center gap-2">
          {applied && <Check className="w-4 h-4 text-emerald-600" />}
          {expanded ? <ChevronUp className="w-5 h-5 text-blue-600" /> : <ChevronDown className="w-5 h-5 text-blue-600" />}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-blue-200 p-4 space-y-4 bg-white">
          {/* Reason */}
          <div>
            <div className="text-xs font-bold text-blue-800 mb-2 uppercase">💡 Lý do thay đổi</div>
            <p className="text-sm text-gray-700 leading-relaxed">{suggestion.reason}</p>
          </div>

          {/* Original */}
          <div>
            <div className="text-xs font-bold text-gray-700 mb-2">📝 Nội dung hiện tại</div>
            <div className="bg-gray-100 rounded-lg p-3 text-sm text-gray-800 border border-gray-200 relative group">
              <p className="whitespace-pre-wrap">{suggestion.original}</p>
              <button
                onClick={() => copyText(suggestion.original)}
                className="absolute top-2 right-2 p-1.5 bg-white rounded border border-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Sao chép"
              >
                <Copy className="w-3 h-3 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Optimized */}
          <div>
            <div className="text-xs font-bold text-emerald-700 mb-2">✨ Nội dung tối ưu hóa</div>
            <div className="bg-emerald-50 rounded-lg p-3 text-sm text-gray-900 border border-emerald-200 relative group">
              <p className="whitespace-pre-wrap">{suggestion.optimized}</p>
              <button
                onClick={() => copyText(suggestion.optimized)}
                className="absolute top-2 right-2 p-1.5 bg-white rounded border border-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Sao chép"
              >
                <Copy className="w-3 h-3 text-emerald-600" />
              </button>
            </div>
          </div>

          {/* Keywords */}
          {suggestion.keywordsToAdd?.length > 0 && (
            <div>
              <div className="text-xs font-bold text-purple-700 mb-2">🔑 Từ khóa được thêm</div>
              <div className="flex flex-wrap gap-2">
                {suggestion.keywordsToAdd.map((keyword, i) => (
                  <span key={i} className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action */}
          {!applied && (
            <button
              onClick={() => onApply(suggestion)}
              className="w-full bg-emerald-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              Áp dụng thay đổi này
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function CVOptimizer({ cvData, optimization, visaCode, visaName, onSave }) {
  const [editedData, setEditedData] = useState(cvData);
  const [appliedSuggestions, setAppliedSuggestions] = useState(new Set());

  const applySuggestion = (suggestion) => {
    setEditedData(prev => ({
      ...prev,
      [suggestion.field]: suggestion.optimized,
    }));
    setAppliedSuggestions(prev => new Set(prev).add(suggestion.title));
  };

  const resetToOriginal = () => {
    setEditedData(cvData);
    setAppliedSuggestions(new Set());
  };

  const handleSave = () => {
    onSave(editedData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-50 to-purple-50 border-2 border-violet-200 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-violet-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="font-bold text-violet-900 mb-1">Tối ưu hóa CV cho Visa {visaCode}</div>
            <p className="text-sm text-violet-700 leading-relaxed">{optimization.summary}</p>
          </div>
        </div>
      </div>

      {/* Priority Actions */}
      {optimization.priorityActions?.length > 0 && (
        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5">
          <div className="font-bold text-amber-900 mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Ưu tiên làm ngay
          </div>
          <ol className="space-y-2">
            {optimization.priorityActions.map((action, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-amber-900">
                <span className="font-bold w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                <span>{action}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Suggestions */}
      <div>
        <div className="font-bold text-lg text-gray-800 mb-4">
          💼 Đề xuất chỉnh sửa ({optimization.suggestions?.length || 0})
        </div>
        <div className="space-y-3">
          {optimization.suggestions?.map((suggestion, i) => (
            <SuggestionCard
              key={i}
              suggestion={suggestion}
              onApply={applySuggestion}
              applied={appliedSuggestions.has(suggestion.title)}
            />
          ))}
        </div>
      </div>

      {/* Keywords */}
      {optimization.keywords?.length > 0 && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-5">
          <div className="font-bold text-blue-900 mb-3">🔍 Từ khóa quan trọng cho Visa {visaCode}</div>
          <div className="flex flex-wrap gap-2">
            {optimization.keywords.map((keyword, i) => (
              <span key={i} className="px-4 py-2 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Preview & Save */}
      <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
        <div className="font-bold text-gray-900 mb-4">📋 Nội dung đã chỉnh sửa</div>
        <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
          {Object.entries(editedData)
            .filter(([key, val]) => val && ['employment_history', 'skills', 'course', 'occupation_title'].includes(key))
            .map(([key, val]) => (
              <div key={key} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <label className="text-xs font-bold text-gray-600 uppercase block mb-2">
                  {fieldLabels[key]}
                </label>
                <textarea
                  value={val}
                  onChange={(e) => setEditedData(prev => ({ ...prev, [key]: e.target.value }))}
                  className="w-full text-sm p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none"
                  rows="4"
                />
              </div>
            ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={resetToOriginal}
            className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            ↺ Reset về ban đầu
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" />
            Lưu CV đã tối ưu
          </button>
        </div>
      </div>

      <div className="text-xs text-gray-500 text-center p-3 bg-gray-50 rounded-lg">
        💡 Những thay đổi này giúp CV phù hợp hơn với yêu cầu của Visa {visaCode}
      </div>
    </div>
  );
}