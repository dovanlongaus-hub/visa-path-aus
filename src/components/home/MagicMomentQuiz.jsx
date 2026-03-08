import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2, MapPin, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createPageUrl } from "@/utils";

// ── Static recommendations engine ─────────────────────────────────────────────
// Derives a quick visa recommendation from the user's inputs without a backend
// call, so the "magic moment" is felt instantly.

const EDUCATION_SCORES = {
  doctorate: 20,
  masters: 15,
  bachelors: 15,
  diploma: 10,
  other: 0,
};

const EXPERIENCE_SCORES = {
  "8+": 20,
  "5-7": 15,
  "3-4": 10,
  "1-2": 5,
  "0": 0,
};

const ENGLISH_SCORES = {
  superior: 20,
  proficient: 10,
  competent: 0,
  basic: -10,
};

const STATE_OPENINGS = {
  IT: ["Victoria (VIC)", "New South Wales (NSW)", "Queensland (QLD)", "Western Australia (WA)"],
  Engineering: ["Victoria (VIC)", "Western Australia (WA)", "South Australia (SA)", "Queensland (QLD)"],
  Healthcare: ["All states — high demand", "Northern Territory (NT) — critical shortage"],
  Accounting: ["Victoria (VIC)", "New South Wales (NSW)", "South Australia (SA)"],
  Teaching: ["All states — critical shortage", "Regional areas — bonus 5 pts EOI"],
  Construction: ["Victoria (VIC)", "Queensland (QLD)", "Western Australia (WA)"],
  Other: ["Check immi.homeaffairs.gov.au for your occupation"],
};

function buildRecommendations(education, experience, english, occupation) {
  const score =
    (EDUCATION_SCORES[education] ?? 0) +
    (EXPERIENCE_SCORES[experience] ?? 0) +
    (ENGLISH_SCORES[english] ?? 0);

  const states = STATE_OPENINGS[occupation] ?? STATE_OPENINGS["Other"];

  const visas = [];

  if (score >= 35) {
    visas.push({
      code: "189",
      name: "Visa 189 — Skilled Independent",
      desc: "Không cần employer sponsor hay bang bảo lãnh. Thẳng tiến đến PR.",
      chance: "Cao",
      color: "bg-green-50 border-green-200",
      badgeColor: "bg-green-100 text-green-800",
    });
  }

  if (score >= 25) {
    visas.push({
      code: "190",
      name: "Visa 190 — Skilled Nominated",
      desc: "Được bang bảo lãnh, cộng 5 điểm EOI. Lộ trình phổ biến và ổn định.",
      chance: "Cao",
      color: "bg-blue-50 border-blue-200",
      badgeColor: "bg-blue-100 text-blue-800",
    });
  }

  if (score >= 15) {
    visas.push({
      code: "491",
      name: "Visa 491 — Skilled Regional",
      desc: "Sống & làm việc ở vùng regional 3 năm để đổi sang PR vĩnh viễn (visa 191).",
      chance: "Trung bình",
      color: "bg-yellow-50 border-yellow-200",
      badgeColor: "bg-yellow-100 text-yellow-800",
    });
  }

  visas.push({
    code: "482",
    name: "Visa 482 — Employer Sponsored",
    desc: "Được nhà tuyển dụng Úc bảo lãnh. Con đường thực tế cho nhiều ngành nghề.",
    chance: "Tùy ngành",
    color: "bg-gray-50 border-gray-200",
    badgeColor: "bg-gray-100 text-gray-800",
  });

  return { score, visas, states };
}

// ── Component ──────────────────────────────────────────────────────────────────

const FIELDS = {
  education: {
    label: "Trình độ học vấn cao nhất",
    placeholder: "Chọn trình độ",
    options: [
      { value: "doctorate", label: "Tiến sĩ (PhD)" },
      { value: "masters", label: "Thạc sĩ" },
      { value: "bachelors", label: "Cử nhân / Kỹ sư" },
      { value: "diploma", label: "Cao đẳng / Diploma" },
      { value: "other", label: "Khác" },
    ],
  },
  experience: {
    label: "Kinh nghiệm làm việc (năm)",
    placeholder: "Chọn số năm",
    options: [
      { value: "0", label: "Chưa có kinh nghiệm" },
      { value: "1-2", label: "1–2 năm" },
      { value: "3-4", label: "3–4 năm" },
      { value: "5-7", label: "5–7 năm" },
      { value: "8+", label: "8 năm trở lên" },
    ],
  },
  english: {
    label: "Trình độ tiếng Anh (IELTS / PTE)",
    placeholder: "Chọn mức độ",
    options: [
      { value: "superior", label: "Superior (IELTS 8.0+ / PTE 79+)" },
      { value: "proficient", label: "Proficient (IELTS 7.0+ / PTE 65+)" },
      { value: "competent", label: "Competent (IELTS 6.0+ / PTE 50+)" },
      { value: "basic", label: "Dưới Competent" },
    ],
  },
  occupation: {
    label: "Ngành nghề",
    placeholder: "Chọn ngành",
    options: [
      { value: "IT", label: "Công nghệ thông tin (IT)" },
      { value: "Engineering", label: "Kỹ thuật / Xây dựng" },
      { value: "Healthcare", label: "Y tế / Điều dưỡng" },
      { value: "Accounting", label: "Kế toán / Tài chính" },
      { value: "Teaching", label: "Giáo dục / Giảng dạy" },
      { value: "Construction", label: "Xây dựng / Kiến trúc" },
      { value: "Other", label: "Ngành khác" },
    ],
  },
};

export default function MagicMomentQuiz({ user }) {
  const [form, setForm] = useState({
    education: "",
    experience: "",
    english: "",
    occupation: "",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const allFilled = Object.values(form).every(Boolean);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setResult(null);
  };

  const handleReset = () => {
    setResult(null);
    setForm({ education: "", experience: "", english: "", occupation: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!allFilled) return;
    setLoading(true);
    // Simulate a brief "thinking" delay for UX delight
    setTimeout(() => {
      setResult(buildRecommendations(form.education, form.experience, form.english, form.occupation));
      setLoading(false);
    }, 800);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
        {!result ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            {Object.entries(FIELDS).map(([key, field]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {field.label}
                </label>
                <select
                  value={form[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-white/30 appearance-none cursor-pointer"
                >
                  <option value="" disabled className="bg-gray-900 text-gray-400">
                    {field.placeholder}
                  </option>
                  {field.options.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-gray-900 text-white">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            <Button
              type="submit"
              disabled={!allFilled || loading}
              size="lg"
              className="w-full bg-white text-gray-900 hover:bg-gray-100 font-semibold mt-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang phân tích...
                </>
              ) : (
                <>
                  Xem Lộ Trình Của Tôi <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        ) : (
          <div className="space-y-6">
            {/* Result header */}
            <div className="text-center">
              <div className="text-4xl mb-3">🎉</div>
              <h3 className="text-xl font-bold text-white mb-1">
                Lộ trình của bạn đã sẵn sàng!
              </h3>
              <p className="text-gray-400 text-sm">
                Dựa trên hồ sơ của bạn, đây là các visa phù hợp nhất:
              </p>
            </div>

            {/* Visa recommendations */}
            <div className="space-y-3">
              {result.visas.map((visa) => (
                <div
                  key={visa.code}
                  className={`rounded-xl p-4 border ${visa.color}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-gray-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{visa.name}</p>
                        <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{visa.desc}</p>
                      </div>
                    </div>
                    <Badge className={`${visa.badgeColor} text-xs whitespace-nowrap flex-shrink-0`}>
                      {visa.chance}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            {/* States open for occupation */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-4 w-4 text-gray-300" />
                <p className="text-sm font-semibold text-white">
                  Các bang đang mở cửa cho ngành của bạn:
                </p>
              </div>
              <ul className="space-y-1">
                {result.states.map((state, i) => (
                  <li key={i} className="text-sm text-gray-300 flex items-center gap-2">
                    <span className="text-gray-500">•</span> {state}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              {user ? (
                <Link to={createPageUrl("Roadmap")} className="flex-1">
                  <Button className="w-full bg-white text-gray-900 hover:bg-gray-100 font-semibold">
                    Xem Lộ Trình Chi Tiết <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Link to={createPageUrl("Profile")} className="flex-1">
                  <Button className="w-full bg-white text-gray-900 hover:bg-gray-100 font-semibold">
                    Tạo Hồ Sơ Để Xem Đầy Đủ <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
              <Button
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
                onClick={handleReset}
              >
                Thử Lại
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
