/**
 * supabaseClient.js — Supabase client for VisaPath Australia
 * Drop-in replacement for base44Client.js
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(
  SUPABASE_URL || '',
  SUPABASE_ANON_KEY || '',
  { auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true } }
);

// ─── Auth helpers ──────────────────────────────────────────
export const auth = {
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
    const user = await this.me();
    if (!user) throw new Error('Not authenticated');
    const { error } = await supabase.auth.updateUser(data);
    if (error) throw error;
  },
  redirectToLogin(returnUrl = null) {
    window.location.href = returnUrl ? `/login?return=${encodeURIComponent(returnUrl)}` : '/login';
  },
  onAuthStateChange(cb) { return supabase.auth.onAuthStateChange(cb); },
};

// ─── Generic entity factory ────────────────────────────────
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
      const col = (orderArg || orderBy).replace('-', '') || orderBy;
      const { data, error } = await supabase
        .from(tableName).select('*')
        .order(col, { ascending: !desc }).limit(limitN);
      if (error) throw error;
      return data || [];
    },
    async filter(conditions = {}, orderArg = null, limitN = 100) {
      let q = supabase.from(tableName).select('*');
      Object.entries(conditions).forEach(([k, v]) => { q = q.eq(k, v); });
      if (orderArg) {
        const desc = orderArg.startsWith('-');
        q = q.order(orderArg.replace('-', ''), { ascending: !desc });
      }
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
      const { data: row, error } = await supabase
        .from(tableName).update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id).select().single();
      if (error) throw error;
      return row;
    },
    async upsert(data, conflictKey = 'id') {
      const payload = await withUser(data);
      const { data: row, error } = await supabase
        .from(tableName).upsert(payload, { onConflict: conflictKey }).select().single();
      if (error) throw error;
      return row;
    },
    async delete(id) {
      const { error } = await supabase.from(tableName).delete().eq('id', id);
      if (error) throw error;
    },
  };
}

// ─── Entity exports ────────────────────────────────────────
export const entities = {
  UserProfile:       makeEntity('user_profiles'),
  Notification:      makeEntity('notifications', { orderBy: 'created_at' }),
  TestimonialStory:  makeEntity('testimonial_stories', { orderBy: 'created_at' }),
  Bookmark:          makeEntity('bookmarks'),
  SavedArticle:      makeEntity('saved_articles'),
  ChecklistItem:     makeEntity('checklist_items'),
  CVAnalysis:        makeEntity('cv_analyses'),
  EOIApplication:    makeEntity('eoi_applications'),
  VisaDocument:      makeEntity('visa_documents', { orderBy: 'expiry_date' }),
  Feedback:          makeEntity('feedbacks'),
  AdminGuide:        makeEntity('admin_guides', { userField: null }),
  Subscription:      makeEntity('subscriptions'),
  EOIScoreHistory:   makeEntity('eoi_score_history', { orderBy: 'saved_at' }),
  PolicyNews:        makeEntity('policy_news', { userField: null, orderBy: 'published_at' }),
  OccupationCache:   makeEntity('occupation_cache', { userField: null }),
};

// ─── base44 drop-in export (for gradual migration) ─────────
export const base44Compatible = { auth, entities };
