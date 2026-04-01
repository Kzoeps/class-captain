-- Monitors registry
create table if not exists monitors (
  id text primary key,
  name text not null,
  description text,
  created_at timestamptz default now()
);

-- Seed monitors
insert into monitors (id, name, description) values
  ('bumicerts',   'Bumicerts',       'GainForest/atproto-packages E2E'),
  ('hyperboards', 'Hyperboards',     'hypercerts-org/hyperboards + lexicon validation'),
  ('hyperindex',  'Hyperindex',      'Hyperindex GraphQL API health'),
  ('certified',   'Certified',       'hypercerts-org/certified-app UI health'),
  ('digest',      'Morning Digest',  'Daily 7:30am BTT digest')
on conflict (id) do nothing;

-- Status logs (one row per check-in)
create table if not exists status_logs (
  id                  uuid default gen_random_uuid() primary key,
  monitor_id          text references monitors(id) not null,
  status              text not null check (status in ('ok', 'failing', 'skipped', 'error')),
  last_check          timestamptz not null,
  last_run            timestamptz,
  last_run_outcome    text check (last_run_outcome in ('passed', 'failed', 'skipped')),
  last_commit_sha     text,
  last_commit_message text,
  last_commit_repo    text,
  checks_total        integer,
  checks_passed       integer,
  checks_failed       integer,
  linear_issues_filed text[],
  notes               text,
  created_at          timestamptz default now()
);

-- Fast latest-per-monitor queries
create index if not exists status_logs_monitor_created
  on status_logs (monitor_id, created_at desc);

-- RLS: public read, service role writes
alter table monitors enable row level security;
alter table status_logs enable row level security;

create policy "public read monitors"
  on monitors for select using (true);

create policy "public read status_logs"
  on status_logs for select using (true);
