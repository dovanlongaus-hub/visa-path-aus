import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Crown, Search, CheckCircle, XCircle, Loader2, Shield, User } from "lucide-react";
import { entities, auth } from '@/api/supabaseClient';

export default function AdminActivate() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState([]);
  const [search, setSearch] = useState("");
  const [activating, setActivating] = useState(null);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    const init = async () => {
      const u = await auth.me().catch(() => null);
      setUser(u);
      if (u?.role === "admin") {
        const all = await entities.UserProfile.list("-created_date", 100).catch(() => []);
        setProfiles(all);
      }
      setLoading(false);
    };
    init();
  }, []);

  const activate = async (profile, planName) => {
    setActivating(profile.id);
    await entities.UserProfile.update(profile.id, {
      is_premium: true,
      premium_plan: planName,
      premium_activated_at: new Date().toISOString().slice(0, 10),
    });
    setProfiles(prev => prev.map(p => p.id === profile.id
      ? { ...p, is_premium: true, premium_plan: planName, premium_activated_at: new Date().toISOString().slice(0, 10) }
      : p
    ));
    setMsg(`✅ Đã kích hoạt Premium cho ${profile.full_name || profile.email}`);
    setActivating(null);
    setTimeout(() => setMsg(null), 4000);
  };

  const deactivate = async (profile) => {
    setActivating(profile.id);
    await entities.UserProfile.update(profile.id, { is_premium: false, premium_plan: null });
    setProfiles(prev => prev.map(p => p.id === profile.id ? { ...p, is_premium: false, premium_plan: null } : p));
    setMsg(`ℹ️ Đã thu hồi Premium của ${profile.full_name || profile.email}`);
    setActivating(null);
    setTimeout(() => setMsg(null), 4000);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
    </div>
  );

  if (!user || user.role !== "admin") return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Shield className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 font-medium">Chỉ Admin mới có quyền truy cập trang này.</p>
      </div>
    </div>
  );

  const filtered = profiles.filter(p =>
    !search || (p.full_name + p.email + p.created_by).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="mb-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
            <Crown className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#0a1628]">Kích hoạt Premium</h1>
            <p className="text-sm text-gray-500">Xác nhận thanh toán và mở khoá tài khoản người dùng</p>
          </div>
        </div>

        {msg && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm text-emerald-700 font-medium">
            {msg}
          </div>
        )}

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-blue-400"
            placeholder="Tìm theo tên, email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
            <div className="text-2xl font-bold text-[#0a1628]">{profiles.length}</div>
            <div className="text-xs text-gray-500">Tổng hồ sơ</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
            <div className="text-2xl font-bold text-violet-600">{profiles.filter(p => p.is_premium).length}</div>
            <div className="text-xs text-gray-500">Premium</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
            <div className="text-2xl font-bold text-gray-400">{profiles.filter(p => !p.is_premium).length}</div>
            <div className="text-xs text-gray-500">Miễn phí</div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <User className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Không tìm thấy hồ sơ nào</p>
            </div>
          ) : (
            filtered.map((profile, i) => (
              <div key={profile.id} className={`flex items-center gap-4 px-5 py-4 ${i < filtered.length - 1 ? "border-b border-gray-50" : ""}`}>
                <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-[#0a1628] text-sm truncate">{profile.full_name || "Chưa có tên"}</div>
                  <div className="text-xs text-gray-400 truncate">{profile.created_by || profile.email || "—"}</div>
                  {profile.is_premium && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-medium">
                        👑 Premium{profile.premium_plan ? ` · ${profile.premium_plan}` : ""}
                      </span>
                      {profile.premium_activated_at && (
                        <span className="text-xs text-gray-400">kích hoạt {profile.premium_activated_at}</span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {profile.is_premium ? (
                    <button
                      onClick={() => deactivate(profile)}
                      disabled={activating === profile.id}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      {activating === profile.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />}
                      Thu hồi
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => activate(profile, "monthly")}
                        disabled={activating === profile.id}
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {activating === profile.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
                        Cơ bản
                      </button>
                      <button
                        onClick={() => activate(profile, "oneoff")}
                        disabled={activating === profile.id}
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition-colors disabled:opacity-50"
                      >
                        {activating === profile.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Crown className="w-3 h-3" />}
                        Chuyên sâu
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}