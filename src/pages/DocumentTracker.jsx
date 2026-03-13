/**
 * DocumentTracker.jsx — Visa Document Expiry Tracker
 * Track passport, IELTS, skills assessment, etc.
 * Alerts khi gần hết hạn
 */

import { useState, useEffect } from 'react';
import { supabase, entities } from '@/api/supabaseClient';
import { FileText, AlertTriangle, CheckCircle, Clock, Plus, X, Upload, Calendar } from 'lucide-react';

const DOC_TYPES = [
  { key: 'passport',         label: 'Hộ chiếu',               icon: '🛂', hasExpiry: true,  required: true  },
  { key: 'ielts',            label: 'IELTS / PTE',             icon: '📝', hasExpiry: true,  required: true  },
  { key: 'skills_assess',    label: 'Skills Assessment',       icon: '🎓', hasExpiry: true,  required: true  },
  { key: 'health_exam',      label: 'Khám sức khỏe (HAP)',     icon: '🏥', hasExpiry: true,  required: true  },
  { key: 'police_check',     label: 'Police Check',            icon: '🚔', hasExpiry: true,  required: true  },
  { key: 'employment_ref',   label: 'Thư xác nhận việc làm',   icon: '💼', hasExpiry: false, required: true  },
  { key: 'qualification',    label: 'Bằng cấp / Transcript',   icon: '📜', hasExpiry: false, required: true  },
  { key: 'birth_cert',       label: 'Giấy khai sinh',          icon: '👶', hasExpiry: false, required: false },
  { key: 'marriage_cert',    label: 'Giấy đăng ký kết hôn',   icon: '💍', hasExpiry: false, required: false },
  { key: 'visa_grant',       label: 'Visa Grant Notice',       icon: '✈️',  hasExpiry: true,  required: false },
];

const STATUS_CONFIG = {
  not_started: { label: 'Chưa bắt đầu', color: 'bg-gray-100 text-gray-600',    dot: 'bg-gray-400'  },
  in_progress:  { label: 'Đang xử lý',  color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
  uploaded:     { label: 'Đã tải lên',  color: 'bg-blue-100 text-blue-700',     dot: 'bg-blue-500'  },
  verified:     { label: 'Đã xác minh', color: 'bg-green-100 text-green-700',   dot: 'bg-green-500' },
  expired:      { label: 'Đã hết hạn',  color: 'bg-red-100 text-red-700',       dot: 'bg-red-500'   },
};

function daysUntilExpiry(expiryDate) {
  if (!expiryDate) return null;
  return Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
}

function ExpiryBadge({ days }) {
  if (days === null) return null;
  if (days < 0)   return <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">Hết hạn {Math.abs(days)}n trước</span>;
  if (days < 30)  return <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full flex items-center gap-1"><AlertTriangle size={10} /> Còn {days} ngày</span>;
  if (days < 90)  return <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">Còn {days} ngày</span>;
  return <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Còn {days} ngày</span>;
}

export default function DocumentTracker() {
  const [docs, setDocs] = useState({});
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const u = data?.user;
      setUser(u);
      if (u) loadDocs(u.id);
      else setLoading(false);
    });
  }, []);

  const loadDocs = async (userId) => {
    try {
      const rows = await entities.VisaDocument.filter({ user_id: userId });
      const map = {};
      rows.forEach(r => { map[r.doc_type] = r; });
      setDocs(map);
    } finally { setLoading(false); }
  };

  const saveDoc = async (docType, data) => {
    if (!user) return;
    try {
      const existing = docs[docType];
      let updated;
      if (existing?.id) {
        updated = await entities.VisaDocument.update(existing.id, data);
      } else {
        updated = await entities.VisaDocument.create({ user_id: user.id, doc_type: docType, ...data });
      }
      setDocs(prev => ({ ...prev, [docType]: updated }));
      setEditing(null);
    } catch (e) { console.error(e); }
  };

  // Summary stats
  const required = DOC_TYPES.filter(d => d.required);
  const verified = required.filter(d => docs[d.key]?.status === 'verified').length;
  const urgent = DOC_TYPES.filter(d => {
    const exp = docs[d.key]?.expiry_date;
    const days = daysUntilExpiry(exp);
    return days !== null && days < 30;
  });

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
    </div>
  );

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <FileText size={48} className="text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600">Vui lòng đăng nhập để theo dõi hồ sơ</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="text-blue-600" size={32} />
            Theo dõi hồ sơ visa
          </h1>
          <p className="text-gray-500 mt-1">Cập nhật trạng thái và ngày hết hạn từng tài liệu</p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl border p-4 text-center">
            <div className="text-3xl font-black text-blue-600">{verified}/{required.length}</div>
            <div className="text-xs text-gray-500 mt-1">Tài liệu đã xác minh</div>
          </div>
          <div className="bg-white rounded-2xl border p-4 text-center">
            <div className={`text-3xl font-black ${urgent.length > 0 ? 'text-red-500' : 'text-green-600'}`}>
              {urgent.length}
            </div>
            <div className="text-xs text-gray-500 mt-1">Sắp hết hạn</div>
          </div>
          <div className="bg-white rounded-2xl border p-4 text-center">
            <div className="text-3xl font-black text-purple-600">
              {Math.round((verified / required.length) * 100)}%
            </div>
            <div className="text-xs text-gray-500 mt-1">Hoàn thành</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="bg-white rounded-2xl border p-4 mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Tiến độ hồ sơ</span>
            <span>{verified}/{required.length} tài liệu bắt buộc</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${(verified / required.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Document list */}
        <div className="space-y-3">
          {DOC_TYPES.map(docDef => {
            const doc = docs[docDef.key] || {};
            const status = doc.status || 'not_started';
            const statusCfg = STATUS_CONFIG[status];
            const days = daysUntilExpiry(doc.expiry_date);
            const isEditing = editing === docDef.key;

            return (
              <div key={docDef.key} className={`bg-white rounded-2xl border p-4 transition-all ${
                days !== null && days < 30 ? 'border-red-200' : ''}`}>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{docDef.icon}</span>
                    <div>
                      <div className="font-semibold text-gray-800 flex items-center gap-2">
                        {docDef.label}
                        {!docDef.required && <span className="text-xs text-gray-400">(tùy chọn)</span>}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusCfg.color}`}>
                          {statusCfg.label}
                        </span>
                        {doc.expiry_date && <ExpiryBadge days={days} />}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditing(isEditing ? null : docDef.key)}
                    className="text-blue-600 text-sm hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    {isEditing ? 'Đóng' : 'Cập nhật'}
                  </button>
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
      </div>
    </div>
  );
}

function EditDocForm({ docDef, initial, onSave, onCancel }) {
  const [form, setForm] = useState({
    status: initial.status || 'not_started',
    expiry_date: initial.expiry_date || '',
    issue_date: initial.issue_date || '',
    notes: initial.notes || '',
  });

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  return (
    <div className="mt-4 pt-4 border-t space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Trạng thái</label>
          <select value={form.status} onChange={e => set('status', e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
            {Object.entries(STATUS_CONFIG).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </div>
        {docDef.hasExpiry && (
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Ngày hết hạn</label>
            <input type="date" value={form.expiry_date} onChange={e => set('expiry_date', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
          </div>
        )}
      </div>
      <div>
        <label className="text-xs text-gray-500 mb-1 block">Ghi chú</label>
        <input type="text" value={form.notes} onChange={e => set('notes', e.target.value)}
          placeholder="VD: Đã nộp lên TRA ngày 1/3"
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
      </div>
      <div className="flex gap-2 justify-end">
        <button onClick={onCancel} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Hủy</button>
        <button onClick={() => onSave(form)} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">Lưu</button>
      </div>
    </div>
  );
}
