/**
 * DocumentTracker.jsx — Document Hub
 * - localStorage-only (key: doc_hub_v2)
 * - Upload simulation (base64 via FileReader)
 * - AI Review (invokeLLMSmart)
 * - Expiry tracker with color warnings
 * - Summary stats panel
 */

import { useState, useEffect, useRef } from 'react';
import { FileText, AlertTriangle, CheckCircle, Clock, Upload, Calendar, Sparkles, X, Loader2, ExternalLink } from 'lucide-react';
import { invokeLLMSmart } from '@/api/aiClient';

const STORAGE_KEY = 'doc_hub_v2';

const DOC_TYPES = [
  { key: 'passport',       label: 'Hộ chiếu',               icon: '🛂', hasExpiry: true,  required: true  },
  { key: 'ielts',          label: 'IELTS / PTE',             icon: '📝', hasExpiry: true,  required: true  },
  { key: 'skills_assess',  label: 'Skills Assessment',       icon: '🎓', hasExpiry: true,  required: true  },
  { key: 'health_exam',    label: 'Khám sức khỏe (HAP)',     icon: '🏥', hasExpiry: true,  required: true  },
  { key: 'police_check',   label: 'Police Check',            icon: '🚔', hasExpiry: true,  required: true  },
  { key: 'employment_ref', label: 'Thư xác nhận việc làm',   icon: '💼', hasExpiry: false, required: true  },
  { key: 'qualification',  label: 'Bằng cấp / Transcript',   icon: '📜', hasExpiry: false, required: true  },
  { key: 'birth_cert',     label: 'Giấy khai sinh',          icon: '👶', hasExpiry: false, required: false },
  { key: 'marriage_cert',  label: 'Giấy đăng ký kết hôn',   icon: '💍', hasExpiry: false, required: false },
  { key: 'visa_grant',     label: 'Visa Grant Notice',       icon: '✈️',  hasExpiry: true,  required: false },
];

const STATUS_CONFIG = {
  not_started: { label: 'Chưa bắt đầu', color: 'bg-gray-100 text-gray-600',     dot: 'bg-gray-400'   },
  in_progress:  { label: 'Đang xử lý',  color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
  uploaded:     { label: 'Đã tải lên',  color: 'bg-blue-100 text-blue-700',      dot: 'bg-blue-500'   },
  verified:     { label: 'Đã xác minh', color: 'bg-green-100 text-green-700',    dot: 'bg-green-500'  },
  expired:      { label: 'Đã hết hạn',  color: 'bg-red-100 text-red-700',        dot: 'bg-red-500'    },
};

function daysUntilExpiry(expiryDate) {
  if (!expiryDate) return null;
  return Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
}

function ExpiryBadge({ days }) {
  if (days === null) return null;
  if (days < 0)
    return <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">Hết hạn {Math.abs(days)}n trước</span>;
  if (days < 30)
    return <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full flex items-center gap-1"><AlertTriangle size={10} /> Còn {days} ngày</span>;
  if (days < 90)
    return <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">Còn {days} ngày</span>;
  return <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Còn {days} ngày</span>;
}

function formatBytes(bytes) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ── AI Review Modal ────────────────────────────────────────────
function AIReviewModal({ docLabel, docName, onClose }) {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState('');

  useEffect(() => {
    const prompt = `Người dùng đang chuẩn bị "${docLabel}" cho visa Úc (DHA). Document: ${docName || docLabel}. Hãy liệt kê 5 yêu cầu quan trọng nhất của loại document này theo DHA, và gợi ý những điểm cần kiểm tra.`;
    invokeLLMSmart(prompt)
      .then(res => setResult(typeof res === 'string' ? res : JSON.stringify(res)))
      .catch(() => setResult('Không thể tải kết quả AI. Vui lòng thử lại.'))
      .finally(() => setLoading(false));
  }, [docLabel, docName]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <div
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <div>
              <p className="font-bold text-white text-sm">AI Review</p>
              <p className="text-violet-200 text-xs">{docLabel}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex flex-col items-center gap-3 py-8 text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin text-violet-500" />
              <p className="text-sm">AI đang phân tích yêu cầu DHA...</p>
            </div>
          ) : (
            <div className="prose prose-sm max-w-none text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
              {result}
            </div>
          )}
        </div>

        <div className="p-4 border-t">
          <button onClick={onClose} className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm rounded-xl transition-colors">
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Edit Doc Form ──────────────────────────────────────────────
function EditDocForm({ docDef, initial, onSave, onCancel }) {
  const [form, setForm] = useState({
    status: initial.status || 'not_started',
    expiry_date: initial.expiry_date || '',
    issue_date: initial.issue_date || '',
    notes: initial.notes || '',
  });
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const isImage = file.type.startsWith('image/');
      set('uploadedFile', {
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
        dataUrl: isImage ? ev.target.result : null,
      });
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="mt-4 pt-4 border-t space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Trạng thái</label>
          <select
            value={form.status}
            onChange={e => set('status', e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {Object.entries(STATUS_CONFIG).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </div>
        {docDef.hasExpiry && (
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Ngày hết hạn</label>
            <input
              type="date"
              value={form.expiry_date}
              onChange={e => set('expiry_date', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        )}
      </div>

      <div>
        <label className="text-xs text-gray-500 mb-1 block">Ghi chú</label>
        <input
          type="text"
          value={form.notes}
          onChange={e => set('notes', e.target.value)}
          placeholder="VD: Đã nộp lên TRA ngày 1/3"
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>

      {/* File upload */}
      <div>
        <label className="text-xs text-gray-500 mb-1 block">Upload file (lưu cục bộ)</label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg transition-colors"
          >
            {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
            {uploading ? 'Đang tải...' : 'Chọn file'}
          </button>
          {form.uploadedFile && (
            <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 rounded-lg px-2 py-1.5">
              <FileText className="w-3 h-3 text-gray-400" />
              <span className="truncate max-w-[140px]">{form.uploadedFile.name}</span>
              <span className="text-gray-400">({formatBytes(form.uploadedFile.size)})</span>
              <button onClick={() => set('uploadedFile', null)} className="text-gray-400 hover:text-red-500 ml-1">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          {initial.uploadedFile && !form.uploadedFile && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span className="truncate max-w-[140px]">{initial.uploadedFile.name}</span>
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          onChange={handleFileChange}
        />
      </div>

      <div className="flex gap-2 justify-end">
        <button onClick={onCancel} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Hủy</button>
        <button
          onClick={() => onSave({
            ...form,
            uploadedFile: form.uploadedFile || initial.uploadedFile || null,
          })}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Lưu
        </button>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────
export default function DocumentTracker() {
  const [docs, setDocs] = useState({});
  const [editing, setEditing] = useState(null);
  const [aiReview, setAiReview] = useState(null); // { key, label, docName }

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setDocs(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  const persistDocs = (updated) => {
    // Remove dataUrl from storage to avoid quota issues (keep only metadata)
    const toStore = {};
    for (const [k, v] of Object.entries(updated)) {
      toStore[k] = {
        ...v,
        uploadedFile: v.uploadedFile
          ? { ...v.uploadedFile, dataUrl: null } // strip large base64 for storage
          : null,
      };
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    } catch (e) {
      console.warn('localStorage quota exceeded, skipping dataUrl', e);
    }
    setDocs(updated);
  };

  const saveDoc = (docType, data) => {
    const updated = { ...docs, [docType]: { ...docs[docType], ...data } };
    persistDocs(updated);
    setEditing(null);
  };

  // ── Summary stats ────────────────────────────────────────────
  const now = new Date();
  const totalDocs = DOC_TYPES.length;
  const uploadedCount = DOC_TYPES.filter(d => {
    const s = docs[d.key]?.status;
    return s === 'uploaded' || s === 'verified';
  }).length;
  const expiringSoon = DOC_TYPES.filter(d => {
    const days = daysUntilExpiry(docs[d.key]?.expiry_date);
    return days !== null && days >= 0 && days < 90;
  }).length;
  const expired = DOC_TYPES.filter(d => {
    const days = daysUntilExpiry(docs[d.key]?.expiry_date);
    return days !== null && days < 0;
  }).length;
  const missing = DOC_TYPES.filter(d => {
    const s = docs[d.key]?.status;
    return !s || s === 'not_started';
  }).length;

  const required = DOC_TYPES.filter(d => d.required);
  const verified = required.filter(d => docs[d.key]?.status === 'verified').length;
  const progress = required.length > 0 ? Math.round((verified / required.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="text-blue-600" size={32} />
            Document Hub
          </h1>
          <p className="text-gray-500 mt-1">Quản lý, theo dõi hạn và nhận đánh giá AI cho từng tài liệu visa</p>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-2xl border p-4 text-center">
            <div className="text-2xl font-black text-blue-600">{uploadedCount}/{totalDocs}</div>
            <div className="text-xs text-gray-500 mt-1">Đã có</div>
          </div>
          <div className="bg-white rounded-2xl border p-4 text-center">
            <div className={`text-2xl font-black ${expiringSoon > 0 ? 'text-orange-500' : 'text-green-600'}`}>
              {expiringSoon}
            </div>
            <div className="text-xs text-gray-500 mt-1">Sắp hết hạn</div>
          </div>
          <div className="bg-white rounded-2xl border p-4 text-center">
            <div className={`text-2xl font-black ${expired > 0 ? 'text-red-600' : 'text-gray-300'}`}>
              {expired}
            </div>
            <div className="text-xs text-gray-500 mt-1">Đã hết hạn</div>
          </div>
          <div className="bg-white rounded-2xl border p-4 text-center">
            <div className={`text-2xl font-black ${missing > 0 ? 'text-amber-500' : 'text-green-600'}`}>
              {missing}
            </div>
            <div className="text-xs text-gray-500 mt-1">Chưa có</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="bg-white rounded-2xl border p-4 mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Tiến độ hồ sơ (bắt buộc)</span>
            <span>{verified}/{required.length} đã xác minh</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-xs text-gray-400 mt-1 text-right">{progress}% hoàn thành</div>
        </div>

        {/* Document cards */}
        <div className="space-y-3">
          {DOC_TYPES.map(docDef => {
            const doc = docs[docDef.key] || {};
            const status = doc.status || 'not_started';
            const statusCfg = STATUS_CONFIG[status];
            const days = daysUntilExpiry(doc.expiry_date);
            const isEditing = editing === docDef.key;
            const hasFile = !!doc.uploadedFile;

            return (
              <div
                key={docDef.key}
                className={`bg-white rounded-2xl border p-4 transition-all ${
                  days !== null && days < 0
                    ? 'border-red-200'
                    : days !== null && days < 30
                    ? 'border-orange-200'
                    : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  {/* Left: icon + info */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <span className="text-2xl mt-0.5 flex-shrink-0">{docDef.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-800 flex items-center gap-2 flex-wrap">
                        {docDef.label}
                        {!docDef.required && (
                          <span className="text-xs text-gray-400 font-normal">(tùy chọn)</span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusCfg.color}`}>
                          {statusCfg.label}
                        </span>
                        {doc.expiry_date && <ExpiryBadge days={days} />}
                      </div>
                      {/* Uploaded file info */}
                      {hasFile && (
                        <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-500">
                          <FileText className="w-3 h-3 text-gray-400" />
                          <span className="truncate max-w-[160px]">{doc.uploadedFile.name}</span>
                          <span className="text-gray-400">({formatBytes(doc.uploadedFile.size)})</span>
                        </div>
                      )}
                      {doc.notes && (
                        <p className="text-xs text-gray-400 mt-1 truncate max-w-xs">{doc.notes}</p>
                      )}
                    </div>
                  </div>

                  {/* Right: action buttons */}
                  <div className="flex flex-col gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => setEditing(isEditing ? null : docDef.key)}
                      className="text-blue-600 text-xs hover:bg-blue-50 px-2.5 py-1.5 rounded-lg transition-colors font-medium"
                    >
                      {isEditing ? 'Đóng' : 'Cập nhật'}
                    </button>
                    <button
                      onClick={() => setAiReview({
                        key: docDef.key,
                        label: docDef.label,
                        docName: doc.uploadedFile?.name || docDef.label,
                      })}
                      className="flex items-center gap-1 text-violet-600 text-xs hover:bg-violet-50 px-2.5 py-1.5 rounded-lg transition-colors font-medium"
                    >
                      <Sparkles className="w-3 h-3" />
                      AI Review
                    </button>
                  </div>
                </div>

                {/* Edit form */}
                {isEditing && (
                  <EditDocForm
                    docDef={docDef}
                    initial={doc}
                    onSave={(data) => saveDoc(docDef.key, data)}
                    onCancel={() => setEditing(null)}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Info note */}
        <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-3">
          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-xs font-bold">i</span>
          </div>
          <p className="text-sm text-blue-700">
            Dữ liệu được lưu trên thiết bị của bạn. File upload chỉ lưu tên và kích thước (không upload lên server).
            Sử dụng AI Review để nhận hướng dẫn cụ thể theo yêu cầu DHA cho từng loại tài liệu.
          </p>
        </div>
      </div>

      {/* AI Review Modal */}
      {aiReview && (
        <AIReviewModal
          docLabel={aiReview.label}
          docName={aiReview.docName}
          onClose={() => setAiReview(null)}
        />
      )}
    </div>
  );
}
