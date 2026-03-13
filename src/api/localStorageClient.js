/**
 * localStorageClient.js — localStorage fallback khi không có Supabase
 * Dùng cho self-hosted deploy, không cần database server
 */

const PREFIX = 'visapath_';

function getKey(table, userId) {
  return `${PREFIX}${table}_${userId || 'guest'}`;
}

function readAll(table, userId) {
  try {
    return JSON.parse(localStorage.getItem(getKey(table, userId)) || '[]');
  } catch { return []; }
}

function writeAll(table, userId, rows) {
  localStorage.setItem(getKey(table, userId), JSON.stringify(rows));
}

function uuid() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function makeLocalEntity(tableName) {
  return {
    async list() {
      const uid = localStorage.getItem(`${PREFIX}user_id`) || 'guest';
      return readAll(tableName, uid);
    },
    async filter(conditions = {}) {
      const uid = localStorage.getItem(`${PREFIX}user_id`) || 'guest';
      let rows = readAll(tableName, uid);
      Object.entries(conditions).forEach(([k, v]) => {
        if (k !== 'user_id') rows = rows.filter(r => r[k] === v);
      });
      return rows;
    },
    async get(id) {
      const uid = localStorage.getItem(`${PREFIX}user_id`) || 'guest';
      return readAll(tableName, uid).find(r => r.id === id) || null;
    },
    async create(data) {
      const uid = localStorage.getItem(`${PREFIX}user_id`) || 'guest';
      const rows = readAll(tableName, uid);
      const row = { ...data, id: uuid(), user_id: uid, created_at: new Date().toISOString() };
      rows.push(row);
      writeAll(tableName, uid, rows);
      return row;
    },
    async update(id, data) {
      const uid = localStorage.getItem(`${PREFIX}user_id`) || 'guest';
      const rows = readAll(tableName, uid).map(r =>
        r.id === id ? { ...r, ...data, updated_at: new Date().toISOString() } : r
      );
      writeAll(tableName, uid, rows);
      return rows.find(r => r.id === id);
    },
    async upsert(data, conflictKey = 'id') {
      const uid = localStorage.getItem(`${PREFIX}user_id`) || 'guest';
      let rows = readAll(tableName, uid);
      const existing = rows.find(r => r[conflictKey] === data[conflictKey]);
      if (existing) {
        return this.update(existing.id, data);
      }
      return this.create(data);
    },
    async delete(id) {
      const uid = localStorage.getItem(`${PREFIX}user_id`) || 'guest';
      writeAll(tableName, uid, readAll(tableName, uid).filter(r => r.id !== id));
    },
  };
}

// Simple session auth using localStorage
export const localAuth = {
  async me() {
    const stored = localStorage.getItem(`${PREFIX}user`);
    return stored ? JSON.parse(stored) : null;
  },
  async isAuthenticated() {
    return !!(await this.me());
  },
  async signIn(email, _password) {
    const user = { id: btoa(email).replace(/=/g, ''), email, name: email.split('@')[0] };
    localStorage.setItem(`${PREFIX}user`, JSON.stringify(user));
    localStorage.setItem(`${PREFIX}user_id`, user.id);
    window.dispatchEvent(new Event('auth-change'));
    return user;
  },
  async signUp(email, password) {
    return this.signIn(email, password);
  },
  async signOut() {
    localStorage.removeItem(`${PREFIX}user`);
    localStorage.removeItem(`${PREFIX}user_id`);
    window.dispatchEvent(new Event('auth-change'));
  },
  async updateMe(data) {
    const user = await this.me();
    if (user) {
      const updated = { ...user, ...data };
      localStorage.setItem(`${PREFIX}user`, JSON.stringify(updated));
    }
  },
  redirectToLogin() {
    window.location.href = '/login';
  },
  onAuthStateChange(cb) {
    const handler = () => this.me().then(u => cb('SIGNED_' + (u ? 'IN' : 'OUT'), { user: u }));
    window.addEventListener('auth-change', handler);
    return { data: { subscription: { unsubscribe: () => window.removeEventListener('auth-change', handler) } } };
  },
};

export const localEntities = {
  UserProfile:     makeLocalEntity('user_profiles'),
  Notification:    makeLocalEntity('notifications'),
  TestimonialStory: makeLocalEntity('testimonial_stories'),
  Bookmark:        makeLocalEntity('bookmarks'),
  SavedArticle:    makeLocalEntity('saved_articles'),
  ChecklistItem:   makeLocalEntity('checklist_items'),
  CVAnalysis:      makeLocalEntity('cv_analyses'),
  EOIApplication:  makeLocalEntity('eoi_applications'),
  VisaDocument:    makeLocalEntity('visa_documents'),
  Feedback:        makeLocalEntity('feedbacks'),
  AdminGuide:      makeLocalEntity('admin_guides'),
  Subscription:    makeLocalEntity('subscriptions'),
  EOIScoreHistory: makeLocalEntity('eoi_score_history'),
  PolicyNews:      makeLocalEntity('policy_news'),
  OccupationCache: makeLocalEntity('occupation_cache'),
};

export const localSupabase = {
  auth: {
    getUser: async () => ({ data: { user: await localAuth.me() } }),
    onAuthStateChange: localAuth.onAuthStateChange.bind(localAuth),
    signInWithPassword: async ({ email, password }) => ({ data: { user: await localAuth.signIn(email, password) }, error: null }),
    signUp: async ({ email, password }) => ({ data: { user: await localAuth.signUp(email, password) }, error: null }),
    signOut: async () => { await localAuth.signOut(); return { error: null }; },
    updateUser: async (data) => { await localAuth.updateMe(data); return { error: null }; },
    signInWithOAuth: async () => {
      alert('OAuth không khả dụng trong chế độ offline. Vui lòng dùng email/password.');
      return { error: null };
    },
  },
  from: (table) => ({
    select: () => ({ data: [], error: null }),
    insert: () => ({ select: () => ({ single: () => ({ data: null, error: null }) }) }),
    update: () => ({ eq: () => ({ select: () => ({ single: () => ({ data: null, error: null }) }) }) }),
    delete: () => ({ eq: () => ({ error: null }) }),
    upsert: () => ({ select: () => ({ single: () => ({ data: null, error: null }) }) }),
    eq: () => ({ single: () => ({ data: null, error: null }) }),
  }),
  storage: {
    from: () => ({ upload: async () => ({ data: { path: `local_${Date.now()}` } }) }),
  },
};
