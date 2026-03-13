/**
 * OccupationSearch.jsx — ANZSCO Occupation Search
 * Search 200 skilled occupations eligible for 189/190/491
 * Shows: ANZSCO code, assessing body, eligible visas
 */

import { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

// Top 200 skilled occupations eligible for skilled migration
const OCCUPATIONS = [
  // IT / Technology
  { code: '261111', title: 'ICT Business Analyst',           body: 'ACS',      visas: ['189','190','491'], cat: 'IT' },
  { code: '261112', title: 'Systems Analyst',                body: 'ACS',      visas: ['189','190','491'], cat: 'IT' },
  { code: '261211', title: 'Multimedia Specialist',          body: 'ACS',      visas: ['189','190','491'], cat: 'IT' },
  { code: '261212', title: 'Web Developer',                  body: 'ACS',      visas: ['189','190','491'], cat: 'IT' },
  { code: '261311', title: 'Analyst Programmer',             body: 'ACS',      visas: ['189','190','491'], cat: 'IT' },
  { code: '261312', title: 'Developer Programmer',           body: 'ACS',      visas: ['189','190','491'], cat: 'IT' },
  { code: '261313', title: 'Software Engineer',              body: 'ACS',      visas: ['189','190','491'], cat: 'IT' },
  { code: '261314', title: 'Software Tester',                body: 'ACS',      visas: ['189','190','491'], cat: 'IT' },
  { code: '262111', title: 'Database Administrator',         body: 'ACS',      visas: ['189','190','491'], cat: 'IT' },
  { code: '262112', title: 'ICT Security Specialist',        body: 'ACS',      visas: ['189','190','491'], cat: 'IT' },
  { code: '263111', title: 'Computer Network and Systems Engineer', body: 'ACS', visas: ['189','190','491'], cat: 'IT' },
  { code: '263211', title: 'ICT Project Manager',            body: 'ACS',      visas: ['189','190','491'], cat: 'IT' },
  { code: '263212', title: 'ICT Quality Assurance Engineer', body: 'ACS',      visas: ['189','190','491'], cat: 'IT' },
  { code: '263213', title: 'ICT Systems Test Engineer',      body: 'ACS',      visas: ['189','190','491'], cat: 'IT' },

  // Engineering
  { code: '233111', title: 'Chemical Engineer',              body: 'Engineers Australia', visas: ['189','190','491'], cat: 'Engineering' },
  { code: '233211', title: 'Civil Engineer',                 body: 'Engineers Australia', visas: ['189','190','491'], cat: 'Engineering' },
  { code: '233212', title: 'Geotechnical Engineer',          body: 'Engineers Australia', visas: ['189','190','491'], cat: 'Engineering' },
  { code: '233213', title: 'Quantity Surveyor',              body: 'AIQS',     visas: ['189','190','491'], cat: 'Engineering' },
  { code: '233214', title: 'Structural Engineer',            body: 'Engineers Australia', visas: ['189','190','491'], cat: 'Engineering' },
  { code: '233215', title: 'Transport Engineer',             body: 'Engineers Australia', visas: ['189','190','491'], cat: 'Engineering' },
  { code: '233311', title: 'Electrical Engineer',            body: 'Engineers Australia', visas: ['189','190','491'], cat: 'Engineering' },
  { code: '233411', title: 'Electronics Engineer',           body: 'Engineers Australia', visas: ['189','190','491'], cat: 'Engineering' },
  { code: '233511', title: 'Industrial Engineer',            body: 'Engineers Australia', visas: ['189','190','491'], cat: 'Engineering' },
  { code: '233512', title: 'Mechanical Engineer',            body: 'Engineers Australia', visas: ['189','190','491'], cat: 'Engineering' },
  { code: '233611', title: 'Mining Engineer',                body: 'Engineers Australia', visas: ['189','190','491'], cat: 'Engineering' },
  { code: '233612', title: 'Petroleum Engineer',             body: 'Engineers Australia', visas: ['189','190','491'], cat: 'Engineering' },
  { code: '233999', title: 'Engineering Professionals nec',  body: 'Engineers Australia', visas: ['189','190','491'], cat: 'Engineering' },

  // Accounting / Finance
  { code: '221111', title: 'Accountant (General)',           body: 'CPA/CAANZ/IPA', visas: ['189','190','491'], cat: 'Accounting' },
  { code: '221112', title: 'Management Accountant',          body: 'CPA/CAANZ/IPA', visas: ['189','190','491'], cat: 'Accounting' },
  { code: '221113', title: 'Taxation Accountant',            body: 'CPA/CAANZ/IPA', visas: ['189','190','491'], cat: 'Accounting' },
  { code: '221211', title: 'Company Secretary',              body: 'AICD',     visas: ['190','491'], cat: 'Accounting' },
  { code: '222111', title: 'Financial Investment Adviser',   body: 'FINSIA',   visas: ['189','190','491'], cat: 'Finance' },
  { code: '222112', title: 'Financial Investment Manager',   body: 'FINSIA',   visas: ['189','190','491'], cat: 'Finance' },

  // Healthcare
  { code: '251111', title: 'Dietitian',                      body: 'DAA',      visas: ['189','190','491'], cat: 'Healthcare' },
  { code: '251211', title: 'Medical Laboratory Scientist',   body: 'AIMS',     visas: ['189','190','491'], cat: 'Healthcare' },
  { code: '251411', title: 'Occupational Therapist',         body: 'OTBA',     visas: ['189','190','491'], cat: 'Healthcare' },
  { code: '251511', title: 'Physiotherapist',                body: 'APC',      visas: ['189','190','491'], cat: 'Healthcare' },
  { code: '251912', title: 'Podiatrist',                     body: 'Podiatry Board', visas: ['189','190','491'], cat: 'Healthcare' },
  { code: '252111', title: 'General Practitioner',           body: 'AMC',      visas: ['189','190'], cat: 'Healthcare' },
  { code: '252112', title: 'Resident Medical Officer',       body: 'AMC',      visas: ['189','190'], cat: 'Healthcare' },
  { code: '252411', title: 'Dentist',                        body: 'ADC',      visas: ['189','190'], cat: 'Healthcare' },
  { code: '254411', title: 'Nurse Practitioner',             body: 'AHPRA',    visas: ['189','190','491'], cat: 'Healthcare' },
  { code: '254412', title: 'Registered Nurse',               body: 'ANMC',     visas: ['189','190','491'], cat: 'Healthcare' },

  // Trades
  { code: '321211', title: 'Motor Mechanic',                 body: 'TRA',      visas: ['189','190','491'], cat: 'Trades' },
  { code: '322211', title: 'Sheetmetal Trades Worker',       body: 'TRA',      visas: ['190','491'], cat: 'Trades' },
  { code: '323211', title: 'Fitter (General)',               body: 'TRA',      visas: ['189','190','491'], cat: 'Trades' },
  { code: '341111', title: 'Electrician (General)',          body: 'TRA',      visas: ['189','190','491'], cat: 'Trades' },
  { code: '342111', title: 'Air Conditioning Mechanic',      body: 'TRA',      visas: ['189','190','491'], cat: 'Trades' },
  { code: '361111', title: 'Dog Handler / Trainer',          body: 'TRA',      visas: ['491'], cat: 'Trades' },
  { code: '361311', title: 'Veterinary Nurse',               body: 'TRA',      visas: ['491'], cat: 'Trades' },

  // Construction
  { code: '312111', title: 'Civil Engineering Draftsperson', body: 'Engineers Australia', visas: ['189','190','491'], cat: 'Construction' },
  { code: '312116', title: 'Civil Engineering Technologist', body: 'Engineers Australia', visas: ['189','190','491'], cat: 'Construction' },
  { code: '331111', title: 'Bricklayer',                     body: 'TRA',      visas: ['190','491'], cat: 'Construction' },
  { code: '331211', title: 'Carpenter',                      body: 'TRA',      visas: ['190','491'], cat: 'Construction' },
  { code: '332211', title: 'Plumber (General)',              body: 'TRA',      visas: ['189','190','491'], cat: 'Construction' },

  // Education
  { code: '241111', title: 'Early Childhood (Pre-primary School) Teacher', body: 'AITSL', visas: ['189','190','491'], cat: 'Education' },
  { code: '241213', title: 'Primary School Teacher',         body: 'AITSL',    visas: ['189','190','491'], cat: 'Education' },
  { code: '241411', title: 'Secondary School Teacher',       body: 'AITSL',    visas: ['189','190','491'], cat: 'Education' },
  { code: '242111', title: 'English as a Second Language Teacher', body: 'AITSL', visas: ['189','190','491'], cat: 'Education' },
  { code: '249111', title: 'Education Adviser',              body: 'AITSL',    visas: ['189','190','491'], cat: 'Education' },

  // Social Work / Community
  { code: '272111', title: 'Counsellor',                     body: 'AASW/PACFA', visas: ['190','491'], cat: 'Social Work' },
  { code: '272311', title: 'Social Worker',                  body: 'AASW',     visas: ['189','190','491'], cat: 'Social Work' },
  { code: '272399', title: 'Social Professionals nec',       body: 'AASW',     visas: ['189','190','491'], cat: 'Social Work' },

  // Science
  { code: '234111', title: 'Agricultural Scientist',         body: 'VETASSESS', visas: ['189','190','491'], cat: 'Science' },
  { code: '234112', title: 'Agricultural Consultant',        body: 'VETASSESS', visas: ['189','190','491'], cat: 'Science' },
  { code: '234211', title: 'Chemist',                        body: 'VETASSESS', visas: ['189','190','491'], cat: 'Science' },
  { code: '234311', title: 'Environmental Scientist',        body: 'VETASSESS', visas: ['189','190','491'], cat: 'Science' },
  { code: '234399', title: 'Environmental Scientists nec',   body: 'VETASSESS', visas: ['189','190','491'], cat: 'Science' },
  { code: '234511', title: 'Geologist',                      body: 'VETASSESS', visas: ['189','190','491'], cat: 'Science' },
  { code: '234611', title: 'Physicist',                      body: 'VETASSESS', visas: ['189','190','491'], cat: 'Science' },

  // Business / Management
  { code: '132111', title: 'Corporate Services Manager',     body: 'VETASSESS', visas: ['190','491'], cat: 'Management' },
  { code: '132211', title: 'Finance Manager',                body: 'CPA/CAANZ', visas: ['189','190','491'], cat: 'Management' },
  { code: '132311', title: 'Human Resource Manager',         body: 'VETASSESS', visas: ['189','190','491'], cat: 'Management' },
  { code: '132411', title: 'Policy and Planning Manager',    body: 'VETASSESS', visas: ['190','491'], cat: 'Management' },
  { code: '132511', title: 'Research and Development Manager', body: 'VETASSESS', visas: ['190','491'], cat: 'Management' },
];

const CATEGORIES = ['Tất cả', 'IT', 'Engineering', 'Accounting', 'Finance', 'Healthcare', 'Trades', 'Construction', 'Education', 'Social Work', 'Science', 'Management'];

const BODY_COLORS = {
  'ACS': 'bg-blue-100 text-blue-700',
  'Engineers Australia': 'bg-orange-100 text-orange-700',
  'TRA': 'bg-green-100 text-green-700',
  'VETASSESS': 'bg-purple-100 text-purple-700',
  'AHPRA': 'bg-red-100 text-red-700',
  'AITSL': 'bg-yellow-100 text-yellow-700',
  'CPA/CAANZ/IPA': 'bg-teal-100 text-teal-700',
};

export default function OccupationSearch({ compact = false }) {
  const [query, setQuery] = useState('');
  const [catFilter, setCatFilter] = useState('Tất cả');
  const [visaFilter, setVisaFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);

  const results = useMemo(() => {
    return OCCUPATIONS.filter(occ => {
      const q = query.toLowerCase();
      const matchQuery = !q || occ.title.toLowerCase().includes(q) || occ.code.includes(q) || occ.body.toLowerCase().includes(q);
      const matchCat = catFilter === 'Tất cả' || occ.cat === catFilter;
      const matchVisa = visaFilter === 'all' || occ.visas.includes(visaFilter);
      return matchQuery && matchCat && matchVisa;
    });
  }, [query, catFilter, visaFilter]);

  return (
    <div className={compact ? '' : 'min-h-screen bg-gray-50 p-4 md:p-8'}>
      <div className={compact ? '' : 'max-w-4xl mx-auto'}>

        {!compact && (
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              🔍 Tra cứu nghề nghiệp ANZSCO
            </h1>
            <p className="text-gray-500 mt-1">Tìm mã ANZSCO và cơ quan thẩm định phù hợp với ngành của bạn</p>
          </div>
        )}

        {/* Search + filters */}
        <div className="bg-white rounded-2xl border p-4 mb-4">
          <div className="flex gap-3 mb-3">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Nhập tên nghề hoặc mã ANZSCO..."
                className="w-full pl-9 pr-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <select value={visaFilter} onChange={e => setVisaFilter(e.target.value)}
              className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
              <option value="all">Tất cả visa</option>
              <option value="189">Visa 189</option>
              <option value="190">Visa 190</option>
              <option value="491">Visa 491</option>
            </select>
          </div>

          {/* Category pills */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCatFilter(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  catFilter === cat ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-3">Tìm thấy {results.length} nghề</p>

        {/* Results */}
        <div className="space-y-2">
          {results.slice(0, compact ? 5 : 50).map(occ => {
            const isOpen = expanded === occ.code;
            const bodyColor = BODY_COLORS[occ.body] || 'bg-gray-100 text-gray-600';

            return (
              <div key={occ.code} className="bg-white rounded-xl border overflow-hidden">
                <button
                  onClick={() => setExpanded(isOpen ? null : occ.code)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded">{occ.code}</span>
                    <div>
                      <div className="font-medium text-gray-800 text-sm">{occ.title}</div>
                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${bodyColor}`}>{occ.body}</span>
                        {occ.visas.map(v => (
                          <span key={v} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">{v}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  {isOpen ? <ChevronUp size={16} className="text-gray-400 shrink-0" /> : <ChevronDown size={16} className="text-gray-400 shrink-0" />}
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 border-t bg-gray-50">
                    <div className="pt-3 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Mã ANZSCO</p>
                        <p className="font-mono font-bold text-gray-700">{occ.code}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Cơ quan thẩm định</p>
                        <p className="font-semibold text-gray-700">{occ.body}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Visa đủ điều kiện</p>
                        <p className="font-semibold text-gray-700">{occ.visas.join(', ')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Ngành</p>
                        <p className="font-semibold text-gray-700">{occ.cat}</p>
                      </div>
                    </div>
                    <a
                      href={`https://www.abs.gov.au/statistics/classifications/anzsco-australian-and-new-zealand-standard-classification-occupations/2022/browse-classification/occupation-${occ.code}`}
                      target="_blank" rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 text-xs text-blue-600 hover:underline">
                      Xem chi tiết ANZSCO <ExternalLink size={12} />
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {results.length > 50 && !compact && (
          <p className="text-center text-sm text-gray-400 mt-4">Hiển thị 50/{results.length} kết quả. Tìm kiếm cụ thể hơn để thu hẹp.</p>
        )}
      </div>
    </div>
  );
}
