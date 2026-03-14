import { useState, useEffect } from "react";
import { MessageCircle, ThumbsUp, Plus, X, TrendingUp, Star, HelpCircle, Newspaper, CheckCircle } from "lucide-react";

const STORAGE_KEY = "community_posts";
const CATEGORY_CONFIG = {
  tips:    { label: "Kinh nghiệm", icon: Star,          color: "bg-amber-100 text-amber-700 border-amber-200" },
  question:{ label: "Hỏi đáp",    icon: HelpCircle,    color: "bg-blue-100 text-blue-700 border-blue-200" },
  success: { label: "Thành công",  icon: TrendingUp,    color: "bg-green-100 text-green-700 border-green-200" },
  news:    { label: "Tin tức",     icon: Newspaper,     color: "bg-purple-100 text-purple-700 border-purple-200" },
};
const STATES = ["NSW", "VIC", "QLD", "SA", "WA", "TAS", "other"];
const VISAS = ["189", "190", "491", "482", "other"];

const SEED_POSTS = [
  {
    id: "seed1", authorName: "Minh Tuấn", authorInitials: "MT",
    category: "success", title: "🎉 Nhận visa 190 NSW sau 14 tháng!",
    content: "Sau 14 tháng chờ đợi, mình đã nhận được grant notice 190 NSW! Điểm EOI 85, nghề IT (Software Engineer). Cảm ơn cộng đồng đã support suốt thời gian qua. Ai có câu hỏi cứ hỏi mình!",
    state: "NSW", visa: "190", likes: 47, comments: [
      { id: "c1", authorName: "Lan Anh", content: "Chúc mừng anh! Anh dùng ACS hay Engineers Australia vậy?", createdAt: "2026-03-10T08:00:00Z" },
      { id: "c2", authorName: "Minh Tuấn", content: "ACS bạn ơi, mình làm software engineer. Mất khoảng 5 tuần.", createdAt: "2026-03-10T09:00:00Z" }
    ], createdAt: "2026-03-13T06:00:00Z", isPinned: true, isVerified: false
  },
  {
    id: "seed2", authorName: "Huyền Trang", authorInitials: "HT",
    category: "question", title: "NSW 190 round tháng 3 có mời không?",
    content: "Mình nộp EOI từ tháng 1, điểm 75, ngành Accounting. Mọi người ở NSW có ai nhận invitation tháng này chưa? Đang rất hồi hộp.",
    state: "NSW", visa: "190", likes: 12, comments: [
      { id: "c3", authorName: "Bảo Trung", content: "Tháng 2 NSW mời đến 70 điểm ngành accountant đó bạn, khả năng tháng 3 tương tự hoặc cao hơn.", createdAt: "2026-03-12T10:00:00Z" }
    ], createdAt: "2026-03-12T07:00:00Z", isPinned: false, isVerified: false
  },
  {
    id: "seed3", authorName: "Agent Migration Expert ✓", authorInitials: "AM",
    category: "tips", title: "📌 [Expert] Skills Assessment: 5 lỗi hay gặp nhất",
    content: "Sau hơn 200 hồ sơ, mình tổng hợp 5 lỗi phổ biến:\n1. Employment letter thiếu duties description cụ thể\n2. Thời gian làm việc không khớp payslip\n3. ACS reject vì không đủ 2 năm experience sau graduation\n4. Email domain không match tên công ty\n5. Thiếu statutory declaration khi reference không còn làm việc",
    state: "other", visa: "189", likes: 89, comments: [], createdAt: "2026-03-11T05:00:00Z", isPinned: true, isVerified: true
  },
  {
    id: "seed4", authorName: "Quốc Hùng", authorInitials: "QH",
    category: "tips", title: "Pool points 491 TAS tháng 3/2026 - cập nhật",
    content: "Vừa check SkillSelect: TAS 491 tháng này mời đến 60 điểm cho nhiều ngành. Ngành nursing và accounting được ưu tiên. Ai đang cân nhắc TAS thì đây là thời điểm tốt để apply state nomination.",
    state: "TAS", visa: "491", likes: 34, comments: [
      { id: "c4", authorName: "Mai Phương", content: "TAS có yêu cầu phải có job offer không bạn?", createdAt: "2026-03-11T11:00:00Z" },
      { id: "c5", authorName: "Quốc Hùng", content: "Không cần job offer bạn ơi, nhưng cần cam kết muốn sống ở TAS. Một số ngành cần.", createdAt: "2026-03-11T12:00:00Z" }
    ], createdAt: "2026-03-11T09:00:00Z", isPinned: false, isVerified: false
  },
  {
    id: "seed5", authorName: "Thu Hà", authorInitials: "TH",
    category: "success", title: "Đạt IELTS 8.0 sau 3 lần thi - kinh nghiệm chia sẻ",
    content: "Lần 1: 7.0 (Reading 8.5, Writing 6.5 - fail). Lần 2: 7.5 (Writing vẫn 6.5). Lần 3: 8.0 tất cả. Bí quyết Writing: luyện theo IELTS Advantage, viết 1 essay/ngày, nhờ native speaker check. Ai cần tips cụ thể cứ hỏi!",
    state: "VIC", visa: "189", likes: 56, comments: [], createdAt: "2026-03-10T07:00:00Z", isPinned: false, isVerified: false
  },
  {
    id: "seed6", authorName: "Đức Anh", authorInitials: "ĐA",
    category: "question", title: "Có ai làm health exam tại Sydney chưa? Recommend clinic?",
    content: "Mình cần đặt HAP health exam ở Sydney. Ai có kinh nghiệm recommend clinic nào tốt, đặt lịch dễ, không chờ lâu?",
    state: "NSW", visa: "190", likes: 8, comments: [
      { id: "c6", authorName: "Linh Chi", content: "Mình làm ở Migrant Health ở Parramatta, đặt online, 1 tuần là có kết quả! Recommend.", createdAt: "2026-03-09T14:00:00Z" }
    ], createdAt: "2026-03-09T13:00:00Z", isPinned: false, isVerified: false
  },
  {
    id: "seed7", authorName: "Thanh Bình", authorInitials: "TB",
    category: "news", title: "🔔 DHA thông báo tăng phí visa từ 1/7/2026",
    content: "DHA vừa announce tăng phí visa skilled từ 1/7/2026. Visa 189/190/491 sẽ tăng ~10-15%. Nếu đang chuẩn bị nộp hồ sơ, nên hoàn thành trước deadline này để tiết kiệm ~$500-700 AUD.",
    state: "other", visa: "189", likes: 67, comments: [], createdAt: "2026-03-08T05:00:00Z", isPinned: false, isVerified: false
  },
  {
    id: "seed8", authorName: "Phúc Nguyên", authorInitials: "PN",
    category: "tips", title: "EOI 85 điểm - breakdown chi tiết cách tính",
    content: "Chia sẻ breakdown EOI score của mình: Age (30-34): 25đ | Education (Bachelor): 15đ | English Proficient: 10đ | Experience Overseas (5yr): 10đ | Experience Aus (1yr): 5đ | State Nomination (190): 5đ | Partner skills: 5đ | Community language (Vietnamese): 5đ | Study in regional: 5đ = Tổng 85đ. Key: partner skills + community language + study regional là 15đ bonus dễ bị bỏ qua!",
    state: "NSW", visa: "190", likes: 103, comments: [], createdAt: "2026-03-07T06:00:00Z", isPinned: false, isVerified: false
  }
];

function getInitialPosts() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const savedPosts = saved ? JSON.parse(saved) : [];
    const seedIds = SEED_POSTS.map(p => p.id);
    const userPosts = savedPosts.filter(p => !seedIds.includes(p.id));
    return [...SEED_POSTS, ...userPosts];
  } catch { return SEED_POSTS; }
}

function savePosts(posts) {
  const seedIds = SEED_POSTS.map(p => p.id);
  const userPosts = posts.filter(p => !seedIds.includes(p.id));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(userPosts));
}

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [showNewPost, setShowNewPost] = useState(false);
  const [expandedPost, setExpandedPost] = useState(null);
  const [newPost, setNewPost] = useState({ authorName: "", title: "", content: "", category: "question", state: "NSW", visa: "190" });
  const [newComment, setNewComment] = useState({});
  const [likedIds, setLikedIds] = useState(new Set());

  useEffect(() => {
    setPosts(getInitialPosts());
    try {
      const liked = JSON.parse(localStorage.getItem("community_liked") || "[]");
      setLikedIds(new Set(liked));
    } catch {}
  }, []);

  const handleLike = (postId) => {
    if (likedIds.has(postId)) return;
    const newLiked = new Set([...likedIds, postId]);
    setLikedIds(newLiked);
    localStorage.setItem("community_liked", JSON.stringify([...newLiked]));
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
  };

  const handleSubmitPost = () => {
    if (!newPost.title.trim() || !newPost.content.trim() || !newPost.authorName.trim()) return;
    const post = {
      ...newPost,
      id: `user_${Date.now()}`,
      authorInitials: newPost.authorName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase(),
      likes: 0, comments: [], createdAt: new Date().toISOString(), isPinned: false, isVerified: false
    };
    const updated = [post, ...posts];
    setPosts(updated);
    savePosts(updated);
    setShowNewPost(false);
    setNewPost({ authorName: "", title: "", content: "", category: "question", state: "NSW", visa: "190" });
  };

  const handleAddComment = (postId) => {
    const text = newComment[postId];
    if (!text?.trim()) return;
    const comment = { id: `c_${Date.now()}`, authorName: "Bạn", content: text, createdAt: new Date().toISOString() };
    const updated = posts.map(p => p.id === postId ? { ...p, comments: [...p.comments, comment] } : p);
    setPosts(updated);
    savePosts(updated);
    setNewComment(prev => ({ ...prev, [postId]: "" }));
  };

  const filtered = posts
    .filter(p => filter === "all" || p.category === filter)
    .filter(p => stateFilter === "all" || p.state === stateFilter)
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const timeAgo = (dateStr) => {
    const diff = (new Date() - new Date(dateStr)) / 1000;
    if (diff < 3600) return `${Math.floor(diff/60)}p trước`;
    if (diff < 86400) return `${Math.floor(diff/3600)}h trước`;
    return `${Math.floor(diff/86400)}d trước`;
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] pb-16">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">🇻🇳 Cộng đồng Visa Úc</h1>
              <p className="text-white/70 text-sm mt-1">Hỏi đáp · Kinh nghiệm · Tin tức · Ăn mừng</p>
            </div>
            <button onClick={() => setShowNewPost(true)}
              className="flex items-center gap-1.5 bg-white text-indigo-600 font-semibold text-sm px-4 py-2 rounded-xl shadow-sm hover:bg-indigo-50 transition-colors">
              <Plus className="w-4 h-4" /> Đăng bài
            </button>
          </div>
          {/* Stats */}
          <div className="flex gap-4 mt-4">
            <div className="text-center">
              <p className="text-xl font-black">{posts.length}+</p>
              <p className="text-white/60 text-xs">Bài đăng</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-black">{posts.reduce((sum, p) => sum + p.likes, 0)}+</p>
              <p className="text-white/60 text-xs">Lượt thích</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-black">{posts.filter(p => p.category === "success").length}</p>
              <p className="text-white/60 text-xs">Visa granted</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-0 bg-white border-b border-gray-100 z-10">
        <div className="max-w-2xl mx-auto px-4 py-2 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            <button onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filter === "all" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              Tất cả
            </button>
            {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
              <button key={key} onClick={() => setFilter(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filter === key ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                {cfg.label}
              </button>
            ))}
            <div className="w-px bg-gray-200 self-stretch mx-1" />
            <select value={stateFilter} onChange={e => setStateFilter(e.target.value)}
              className="px-2 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 text-gray-600 border-0 outline-none">
              <option value="all">Tất cả tiểu bang</option>
              {STATES.map(s => <option key={s} value={s}>{s === "other" ? "Khác" : s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="max-w-2xl mx-auto px-4 mt-3 space-y-3">
        {filtered.map(post => {
          const isExpanded = expandedPost === post.id;
          return (
            <div key={post.id} className={`bg-white rounded-2xl border transition-all ${post.isPinned ? "border-amber-200 shadow-sm" : "border-gray-100"}`}>
              <div className="p-4">
                {/* Author row */}
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${post.isVerified ? "bg-blue-500 text-white" : "bg-indigo-100 text-indigo-600"}`}>
                    {post.authorInitials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-sm font-semibold text-gray-800">{post.authorName}</span>
                      {post.isVerified && <CheckCircle className="w-3.5 h-3.5 text-blue-500" />}
                      {post.isPinned && <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">📌 Ghim</span>}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${CATEGORY_CONFIG[post.category]?.color}`}>
                        {CATEGORY_CONFIG[post.category]?.label}
                      </span>
                      {post.state !== "other" && <span className="text-xs text-gray-400">{post.state}</span>}
                      <span className="text-xs text-gray-400">· {timeAgo(post.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <h3 className="font-bold text-gray-800 text-sm mb-2">{post.title}</h3>
                <p className={`text-sm text-gray-600 leading-relaxed whitespace-pre-wrap ${!isExpanded && post.content.length > 200 ? "line-clamp-3" : ""}`}>
                  {post.content}
                </p>
                {post.content.length > 200 && (
                  <button onClick={() => setExpandedPost(isExpanded ? null : post.id)}
                    className="text-xs text-indigo-500 font-semibold mt-1">
                    {isExpanded ? "Thu gọn ▲" : "Xem thêm ▼"}
                  </button>
                )}

                {/* Actions */}
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-50">
                  <button onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${likedIds.has(post.id) ? "text-red-500" : "text-gray-400 hover:text-red-400"}`}>
                    <ThumbsUp className="w-3.5 h-3.5" /> {post.likes}
                  </button>
                  <button onClick={() => setExpandedPost(isExpanded ? null : post.id)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-indigo-500 transition-colors">
                    <MessageCircle className="w-3.5 h-3.5" /> {post.comments.length} bình luận
                  </button>
                  <span className="text-xs text-gray-300">Visa {post.visa}</span>
                </div>

                {/* Comments (expanded) */}
                {isExpanded && (
                  <div className="mt-3 space-y-2">
                    {post.comments.map(c => (
                      <div key={c.id} className="bg-gray-50 rounded-xl px-3 py-2">
                        <p className="text-xs font-semibold text-gray-700">{c.authorName}</p>
                        <p className="text-xs text-gray-600 mt-0.5">{c.content}</p>
                      </div>
                    ))}
                    <div className="flex gap-2 mt-2">
                      <input
                        value={newComment[post.id] || ""}
                        onChange={e => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
                        placeholder="Thêm bình luận..."
                        className="flex-1 text-xs border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-indigo-300"
                        onKeyDown={e => e.key === "Enter" && handleAddComment(post.id)}
                      />
                      <button onClick={() => handleAddComment(post.id)}
                        className="bg-indigo-500 text-white text-xs font-semibold px-3 py-2 rounded-xl hover:bg-indigo-600 transition-colors">
                        Gửi
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Post Modal */}
      {showNewPost && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white rounded-t-3xl w-full max-h-[90vh] overflow-y-auto p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">Đăng bài mới</h3>
              <button onClick={() => setShowNewPost(false)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <div className="space-y-3">
              <input value={newPost.authorName} onChange={e => setNewPost(p => ({ ...p, authorName: e.target.value }))}
                placeholder="Tên của bạn *" className="w-full text-sm border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-300" />
              <div className="flex gap-2">
                <select value={newPost.category} onChange={e => setNewPost(p => ({ ...p, category: e.target.value }))}
                  className="flex-1 text-sm border border-gray-200 rounded-xl px-3 py-3 outline-none focus:border-indigo-300 bg-white">
                  {Object.entries(CATEGORY_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
                <select value={newPost.state} onChange={e => setNewPost(p => ({ ...p, state: e.target.value }))}
                  className="flex-1 text-sm border border-gray-200 rounded-xl px-3 py-3 outline-none focus:border-indigo-300 bg-white">
                  {STATES.map(s => <option key={s} value={s}>{s === "other" ? "Tiểu bang khác" : s}</option>)}
                </select>
              </div>
              <input value={newPost.title} onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))}
                placeholder="Tiêu đề *" className="w-full text-sm border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-300" />
              <textarea value={newPost.content} onChange={e => setNewPost(p => ({ ...p, content: e.target.value }))}
                placeholder="Nội dung chi tiết *" rows={4}
                className="w-full text-sm border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-300 resize-none" />
              <button onClick={handleSubmitPost}
                className="w-full bg-indigo-600 text-white font-semibold py-3.5 rounded-xl hover:bg-indigo-500 transition-colors">
                Đăng bài
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
