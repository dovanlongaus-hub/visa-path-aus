-- ============================================================
-- visapath.au — Supabase Schema
-- ============================================================
create extension if not exists "uuid-ossp";

-- User profiles
create table if not exists public.user_profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  email text,
  full_name text,
  date_of_birth date,
  current_visa_type text,
  current_visa_expiry date,
  passport_expiry date,
  passport_nationality text,
  english_test_type text,
  english_score numeric(4,1),
  english_expiry date,
  occupation text,
  anzsco_code text,
  skills_assessment_body text,
  skills_assessment_expiry date,
  australia_work_years integer default 0,
  overseas_work_years integer default 0,
  highest_education text,
  australian_study boolean default false,
  specialist_study boolean default false,
  naati_accredited boolean default false,
  professional_year boolean default false,
  state_nomination text,
  partner_skills boolean default false,
  eoi_score integer,
  target_visa text,
  arrival_date date,
  settings jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Notifications
create table if not exists public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  message text,
  type text default 'info',
  read boolean default false,
  action_url text,
  created_at timestamptz default now()
);

-- Testimonials
create table if not exists public.testimonial_stories (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete set null,
  author_name text not null,
  author_avatar text,
  visa_type text,
  story text not null,
  approved boolean default false,
  rating integer check (rating between 1 and 5),
  created_at timestamptz default now()
);

-- Bookmarks
create table if not exists public.bookmarks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  resource_type text,
  resource_id text,
  title text,
  url text,
  created_at timestamptz default now(),
  unique(user_id, resource_id)
);

-- Saved articles
create table if not exists public.saved_articles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  article_id text,
  title text,
  url text,
  created_at timestamptz default now()
);

-- Checklist items (user progress)
create table if not exists public.checklist_items (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  item_key text not null,
  visa_type text,
  status text default 'pending',
  notes text,
  completed_at timestamptz,
  created_at timestamptz default now(),
  unique(user_id, item_key)
);

-- CV Analysis
create table if not exists public.cv_analyses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  filename text,
  analysis_result jsonb,
  score integer,
  suggestions jsonb,
  created_at timestamptz default now()
);

-- EOI Applications / Score History
create table if not exists public.eoi_applications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  visa_type text not null,
  score integer not null,
  score_breakdown jsonb,
  submitted_at timestamptz,
  status text default 'draft',
  notes text,
  created_at timestamptz default now()
);

-- Visa Documents tracker
create table if not exists public.visa_documents (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  doc_type text not null,
  doc_name text,
  status text default 'not_started',
  file_url text,
  issue_date date,
  expiry_date date,
  notes text,
  updated_at timestamptz default now(),
  created_at timestamptz default now(),
  unique(user_id, doc_type)
);

-- Feedback
create table if not exists public.feedbacks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete set null,
  email text,
  category text,
  title text not null,
  description text,
  status text default 'submitted',
  admin_note text,
  created_at timestamptz default now()
);

-- Admin guides
create table if not exists public.admin_guides (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  content text,
  category text,
  visa_type text,
  tags text[] default '{}',
  published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Subscriptions
create table if not exists public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  plan text default 'free',
  status text default 'active',
  stripe_subscription_id text,
  current_period_end timestamptz,
  created_at timestamptz default now()
);

-- EOI Score history (for "what-if" tracking)
create table if not exists public.eoi_score_history (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  score integer not null,
  visa_type text,
  breakdown jsonb,
  saved_at timestamptz default now()
);

-- Policy news alerts
create table if not exists public.policy_news (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  summary text,
  source_url text,
  category text,
  affects_visas text[] default '{}',
  published_at timestamptz,
  created_at timestamptz default now()
);

-- Occupation search cache
create table if not exists public.occupation_cache (
  anzsco_code text primary key,
  title text not null,
  alternative_titles text[],
  skill_level integer,
  assessing_body text,
  eligible_visas text[] default '{}',
  category text,
  updated_at timestamptz default now()
);

-- ── RLS ─────────────────────────────────────────────────────
alter table public.user_profiles enable row level security;
alter table public.notifications enable row level security;
alter table public.bookmarks enable row level security;
alter table public.saved_articles enable row level security;
alter table public.checklist_items enable row level security;
alter table public.cv_analyses enable row level security;
alter table public.eoi_applications enable row level security;
alter table public.visa_documents enable row level security;
alter table public.feedbacks enable row level security;
alter table public.subscriptions enable row level security;
alter table public.eoi_score_history enable row level security;

create policy "user_own" on public.user_profiles for all using (auth.uid() = user_id);
create policy "user_own" on public.notifications for all using (auth.uid() = user_id);
create policy "user_own" on public.bookmarks for all using (auth.uid() = user_id);
create policy "user_own" on public.saved_articles for all using (auth.uid() = user_id);
create policy "user_own" on public.checklist_items for all using (auth.uid() = user_id);
create policy "user_own" on public.cv_analyses for all using (auth.uid() = user_id);
create policy "user_own" on public.eoi_applications for all using (auth.uid() = user_id);
create policy "user_own" on public.visa_documents for all using (auth.uid() = user_id);
create policy "user_own" on public.feedbacks for all using (auth.uid() = user_id);
create policy "user_own" on public.subscriptions for all using (auth.uid() = user_id);
create policy "user_own" on public.eoi_score_history for all using (auth.uid() = user_id);

create policy "public_read_testimonials" on public.testimonial_stories for select using (approved = true);
create policy "public_read_guides" on public.admin_guides for select using (published = true);
create policy "public_read_news" on public.policy_news for select using (true);
create policy "public_read_occupations" on public.occupation_cache for select using (true);

-- ── Indexes ──────────────────────────────────────────────────
create index on public.notifications (user_id, created_at desc);
create index on public.checklist_items (user_id, visa_type);
create index on public.eoi_applications (user_id, created_at desc);
create index on public.visa_documents (user_id, expiry_date);
create index on public.eoi_score_history (user_id, saved_at desc);
create index on public.occupation_cache (anzsco_code, assessing_body);
