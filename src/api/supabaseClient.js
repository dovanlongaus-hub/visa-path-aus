/**
 * supabaseClient.js — Auto-detect Supabase cloud or localStorage fallback
 */
import { createClient } from '@supabase/supabase-js';
import { localAuth, localEntities, localSupabase } from './localStorageClient';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const IS_LOCAL = import.meta.env.VITE_APP_MODE === 'local'
  || !SUPABASE_URL
  || SUPABASE_URL === 'http://localhost:54321'
  || SUPABASE_ANON_KEY === 'local';

// Export supabase client (real or mock)
export const supabase = IS_LOCAL
  ? localSupabase
  : createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true }
    });

// Export auth helpers
export const auth = IS_LOCAL ? localAuth : {
  async me() {
    const { data } = await supabase.auth.getUser();
    return data?.user || null;
  },
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data.user;
  },
  async signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data.user;
  },
  async signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    if (error) throw error;
  },
  async signOut() { await supabase.auth.signOut(); },
  async isAuthenticated() { return !!(await this.me()); },
  async updateMe(data) {
    const { error } = await supabase.auth.updateUser(data);
    if (error) throw error;
  },
  redirectToLogin(returnUrl = null) {
    window.location.href = returnUrl ? `/login?return=${encodeURIComponent(returnUrl)}` : '/login';
  },
  onAuthStateChange(cb) { return supabase.auth.onAuthStateChange(cb); },
};

// Entity factory (real Supabase)
function makeEntity(tableName, opts = {}) {
  const { orderBy = 'created_at', userField = 'user_id' } = opts;
  const withUser = async (data) => {
    if (!userField) return data;
    const user = (await supabase.auth.getUser()).data?.user;
    return user ? { ...data, [userField]: user.id } : data;
  };
  return {
    async list(orderArg = null, limitN = 100) {
      const desc = !orderArg || orderArg.startsWith('-');
      const col = (orderArg || orderBy).replace('-', '');
      const { data, error } = await supabase.from(tableName).select('*').order(col, { ascending: !desc }).limit(limitN);
      if (error) throw error;
      return data || [];
    },
    async filter(conditions = {}, orderArg = null, limitN = 100) {
      let q = supabase.from(tableName).select('*');
      Object.entries(conditions).forEach(([k, v]) => { q = q.eq(k, v); });
      if (orderArg) q = q.order(orderArg.replace('-', ''), { ascending: !orderArg.startsWith('-') });
      const { data, error } = await q.limit(limitN);
      if (error) throw error;
      return data || [];
    },
    async get(id) {
      const { data, error } = await supabase.from(tableName).select('*').eq('id', id).single();
      if (error) throw error;
      return data;
    },
    async create(data) {
      const payload = await withUser(data);
      const { data: row, error } = await supabase.from(tableName).insert(payload).select().single();
      if (error) throw error;
      return row;
    },
    async update(id, data) {
      const { data: row, error } = await supabase.from(tableName).update({ ...data, updated_at: new Date().toISOString() }).eq('id', id).select().single();
      if (error) throw error;
      return row;
    },
    async upsert(data, conflictKey = 'id') {
      const payload = await withUser(data);
      const { data: row, error } = await supabase.from(tableName).upsert(payload, { onConflict: conflictKey }).select().single();
      if (error) throw error;
      return row;
    },
    async delete(id) {
      const { error } = await supabase.from(tableName).delete().eq('id', id);
      if (error) throw error;
    },
  };
}

// Export entities — use local or real
export const entities = IS_LOCAL ? localEntities : {
  UserProfile:     makeEntity('user_profiles'),
  Notification:    makeEntity('notifications'),
  TestimonialStory: makeEntity('testimonial_stories'),
  Bookmark:        makeEntity('bookmarks'),
  SavedArticle:    makeEntity('saved_articles'),
  ChecklistItem:   makeEntity('checklist_items'),
  CVAnalysis:      makeEntity('cv_analyses'),
  EOIApplication:  makeEntity('eoi_applications'),
  VisaDocument:    makeEntity('visa_documents', { orderBy: 'expiry_date' }),
  Feedback:        makeEntity('feedbacks'),
  AdminGuide:      makeEntity('admin_guides', { userField: null }),
  Subscription:    makeEntity('subscriptions'),
  EOIScoreHistory: makeEntity('eoi_score_history', { orderBy: 'saved_at' }),
  PolicyNews:      makeEntity('policy_news', { userField: null, orderBy: 'published_at' }),
  OccupationCache: makeEntity('occupation_cache', { userField: null }),
};
