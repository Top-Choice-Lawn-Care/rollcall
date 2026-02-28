-- ============================================================
-- RollCall BJJ Gym Management — Full Schema
-- Version 2.0 — Multi-tenant, family accounts, import pipeline
-- ============================================================

create extension if not exists "uuid-ossp";

-- ============================================================
-- TIER 1: ROLLCALL COMPANY (super_admin)
-- The platform itself. Provisions gyms, manages platform billing.
-- ============================================================

create table if not exists rollcall_admins (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text unique not null,
  -- References auth.users when Supabase Auth is live
  auth_user_id uuid unique,
  created_at timestamptz default now()
);

-- ============================================================
-- TIER 2: GYMS
-- One row per gym. Provisioned by RollCall super_admin.
-- ============================================================

create table if not exists gyms (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,           -- e.g. "gbdrip" → gbdrip.rollcall.app
  owner_id uuid,                       -- references profiles(id) after creation
  email text,
  phone text,
  address text,
  city text,
  state text,
  zip text,
  timezone text default 'America/Chicago',

  -- Platform subscription (what the gym pays RollCall)
  plan_tier text default 'starter' check (plan_tier in ('starter', 'growth', 'pro', 'enterprise')),
  plan_status text default 'trial' check (plan_status in ('trial', 'active', 'past_due', 'canceled')),
  trial_ends_at timestamptz,
  rollcall_stripe_customer_id text,    -- gym's billing with RollCall (platform fee)
  rollcall_stripe_subscription_id text,

  -- Member payment processing (gym collects from their members via Stripe Connect)
  stripe_connect_account_id text,      -- gym's Stripe Connect account
  stripe_connect_onboarded boolean default false,

  -- Flags
  active boolean default true,
  created_by uuid references rollcall_admins(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- TIER 3: FAMILY GROUPS
-- One family = one billing unit. Primary member pays for all.
-- Create this BEFORE profiles so profiles can reference it.
-- ============================================================

create table if not exists family_groups (
  id uuid primary key default uuid_generate_v4(),
  gym_id uuid references gyms(id) not null,
  name text not null,                  -- e.g. "The Johnson Family"
  primary_member_id uuid,              -- set after creating the primary profile (FK added below)
  stripe_customer_id text,             -- ALL family billing goes through this single customer
  stripe_payment_method_id text,       -- default payment method for the family
  created_at timestamptz default now()
);

-- ============================================================
-- TIER 3: PROFILES (gym members, instructors, admins)
-- gym_id = null only for rollcall_admins (handled separately)
-- ============================================================

create table if not exists profiles (
  id uuid primary key default uuid_generate_v4(),
  auth_user_id uuid unique,            -- references auth.users when live

  gym_id uuid references gyms(id),

  -- Family
  family_group_id uuid references family_groups(id),
  is_primary_account boolean default false,  -- true = the adult who controls billing
  guardian_id uuid references profiles(id),   -- for minors: who is responsible

  -- Identity
  name text not null,
  email text,
  phone text,
  date_of_birth date,
  is_minor boolean generated always as (
    date_of_birth is not null and date_of_birth > current_date - interval '18 years'
  ) stored,
  photo_url text,

  -- Role within gym
  role text not null check (role in ('super_admin', 'admin', 'instructor', 'student')),

  -- BJJ progression
  belt text default 'white' check (belt in ('white', 'blue', 'purple', 'brown', 'black')),
  stripes int default 0 check (stripes >= 0 and stripes <= 4),
  gi_rank_date date,                   -- date of current belt promotion
  total_classes int default 0,         -- denormalized for fast AI scoring

  -- Membership
  status text default 'trial' check (status in ('active', 'trial', 'inactive', 'on-hold', 'at-risk', 'canceled')),
  join_date date,
  last_attended date,

  -- Payment (individual — only used when NOT in a family group)
  stripe_customer_id text,             -- individual Stripe customer (null if family billing)

  -- Import tracking
  imported_from text,                  -- 'zen_planner', 'mindbody', 'csv', null=native
  external_id text,                    -- original ID in the source system
  import_batch_id uuid,                -- references import_batches(id)

  -- Notes
  notes text,
  emergency_contact_name text,
  emergency_contact_phone text,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Now add the FK from family_groups back to profiles (circular ref resolved)
alter table family_groups
  add constraint fk_primary_member
  foreign key (primary_member_id) references profiles(id);

-- Also add owner_id FK on gyms
alter table gyms
  add constraint fk_gym_owner
  foreign key (owner_id) references profiles(id);

-- ============================================================
-- PAYMENT MIGRATION TRACKING
-- Track the Zen Planner → Stripe card migration process
-- ============================================================

create table if not exists payment_migrations (
  id uuid primary key default uuid_generate_v4(),
  gym_id uuid references gyms(id) not null,

  -- Source processor info
  source_processor text not null,      -- 'zen_planner', 'mindbody', 'cardpointe', etc.
  source_account_id text,              -- the gym's account ID at the old processor

  -- Migration state
  status text default 'pending' check (status in (
    'pending',          -- migration requested, not started
    'pan_requested',    -- PAN export requested from CardPointe/Fiserv
    'pan_received',     -- Encrypted PAN file received
    'stripe_submitted', -- File submitted to Stripe migration team
    'stripe_processing',-- Stripe is processing
    'stripe_complete',  -- Stripe created Customer objects
    'matching',         -- Matching Stripe customers to profiles by email
    'complete',         -- All done
    'partial',          -- Some matched, some need manual follow-up
    'failed'
  )),

  -- Counts
  total_cards int,
  cards_migrated int default 0,
  cards_failed int default 0,
  members_without_email int default 0, -- can't migrate without email

  -- Timeline
  pan_request_date date,
  pan_received_date date,
  stripe_submit_date date,
  stripe_complete_date date,

  -- Notes / error log
  notes text,
  stripe_migration_ticket text,        -- Stripe support ticket ID

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Per-card migration records
create table if not exists migrated_payment_methods (
  id uuid primary key default uuid_generate_v4(),
  migration_id uuid references payment_migrations(id) not null,
  gym_id uuid references gyms(id) not null,

  -- Old processor data
  old_customer_id text,
  cardholder_name text,
  last_four text,
  card_brand text,                     -- visa, mastercard, amex, discover
  expiry_month int,
  expiry_year int,
  old_email text,                      -- email from old processor — key for matching

  -- Match result
  matched_profile_id uuid references profiles(id),
  match_method text,                   -- 'email', 'name_fuzzy', 'manual', 'unmatched'

  -- Stripe result
  stripe_customer_id text,
  stripe_payment_method_id text,
  migrated_at timestamptz,

  status text default 'pending' check (status in ('pending', 'matched', 'migrated', 'failed', 'unmatched'))
);

-- ============================================================
-- IMPORT BATCHES
-- Track CSV/API imports from Zen Planner or other systems
-- ============================================================

create table if not exists import_batches (
  id uuid primary key default uuid_generate_v4(),
  gym_id uuid references gyms(id) not null,
  source text not null,                -- 'zen_planner_csv', 'mindbody_csv', 'manual_csv'
  filename text,
  total_rows int,
  imported int default 0,
  skipped int default 0,
  errors int default 0,
  error_log jsonb,                     -- array of {row, field, message}
  status text default 'pending' check (status in ('pending', 'processing', 'complete', 'failed')),
  imported_by uuid references profiles(id),
  created_at timestamptz default now()
);

-- ============================================================
-- CLASS DEFINITIONS & SESSIONS
-- ============================================================

create table if not exists class_definitions (
  id uuid primary key default uuid_generate_v4(),
  gym_id uuid references gyms(id) not null,
  name text not null,
  type text not null,
  days text[] not null,
  start_time time not null,
  duration_minutes int not null default 60,
  instructor_id uuid references profiles(id),
  max_capacity int not null default 20,
  color text,
  style text check (style in ('gi', 'nogi', 'both')),
  age_group text,
  description text,
  active boolean default true,
  created_at timestamptz default now()
);

create table if not exists class_sessions (
  id uuid primary key default uuid_generate_v4(),
  class_definition_id uuid references class_definitions(id) not null,
  gym_id uuid references gyms(id) not null,
  session_date date not null,
  override_instructor_id uuid references profiles(id),  -- sub instructor
  cancelled boolean default false,
  cancel_reason text,
  notes text,
  created_at timestamptz default now(),
  unique(class_definition_id, session_date)
);

-- ============================================================
-- REGISTRATIONS & ATTENDANCE
-- ============================================================

create table if not exists registrations (
  id uuid primary key default uuid_generate_v4(),
  class_session_id uuid references class_sessions(id) not null,
  gym_id uuid references gyms(id) not null,
  member_id uuid references profiles(id) not null,
  registered_at timestamptz default now(),
  waitlisted boolean default false,    -- true if registered after capacity hit
  waitlist_position int,
  unique(class_session_id, member_id)
);

create table if not exists attendance (
  id uuid primary key default uuid_generate_v4(),
  class_session_id uuid references class_sessions(id) not null,
  gym_id uuid references gyms(id) not null,
  member_id uuid references profiles(id) not null,
  checked_in_at timestamptz default now(),
  checked_in_by uuid references profiles(id),
  check_in_method text check (check_in_method in ('instructor', 'kiosk', 'app', 'walk_in')),
  unique(class_session_id, member_id)
);

-- ============================================================
-- BELT PROMOTIONS
-- ============================================================

create table if not exists belt_promotions (
  id uuid primary key default uuid_generate_v4(),
  member_id uuid references profiles(id) not null,
  gym_id uuid references gyms(id) not null,
  old_belt text,
  new_belt text not null,
  old_stripes int,
  new_stripes int not null,
  promoted_by uuid references profiles(id),
  promotion_date date not null,
  classes_at_old_belt int,             -- attendance count since last promotion
  ai_score_at_promotion int,           -- what the AI score was when promoted
  notes text,
  created_at timestamptz default now()
);

-- ============================================================
-- MEMBERSHIP PLANS & SUBSCRIPTIONS
-- ============================================================

create table if not exists membership_plans (
  id uuid primary key default uuid_generate_v4(),
  gym_id uuid references gyms(id) not null,
  name text not null,
  price_cents int not null,
  billing_cycle text default 'monthly' check (billing_cycle in ('monthly', 'quarterly', 'annual')),
  stripe_price_id text,                -- ready to wire; populate when Stripe Connect is live
  max_classes_per_week int,            -- null = unlimited
  allows_gi boolean default true,
  allows_nogi boolean default true,
  allows_kids boolean default false,
  active boolean default true,
  created_at timestamptz default now()
);

create table if not exists member_subscriptions (
  id uuid primary key default uuid_generate_v4(),
  -- Billing can be on the individual OR the family primary account
  member_id uuid references profiles(id) not null,
  billed_to_profile_id uuid references profiles(id), -- may differ (family billing)
  plan_id uuid references membership_plans(id) not null,
  gym_id uuid references gyms(id) not null,
  stripe_subscription_id text,         -- ready to wire
  status text check (status in ('active', 'past_due', 'canceled', 'on_hold', 'trial')),
  start_date date not null,
  end_date date,
  trial_end_date date,
  pause_start date,
  pause_end date,
  created_at timestamptz default now()
);

-- ============================================================
-- DIGITAL WAIVERS
-- ============================================================

create table if not exists waiver_templates (
  id uuid primary key default uuid_generate_v4(),
  gym_id uuid references gyms(id) not null,
  name text not null,
  content text not null,               -- HTML or markdown
  version int default 1,
  active boolean default true,
  requires_guardian_for_minors boolean default true,
  created_at timestamptz default now()
);

create table if not exists signed_waivers (
  id uuid primary key default uuid_generate_v4(),
  waiver_template_id uuid references waiver_templates(id) not null,
  member_id uuid references profiles(id) not null,
  gym_id uuid references gyms(id) not null,
  signed_by_profile_id uuid references profiles(id), -- may be guardian for a minor
  signed_at timestamptz default now(),
  ip_address inet,
  signature_data text,                 -- base64 drawn signature or typed name
  waiver_version int not null
);

-- ============================================================
-- COMMUNICATIONS
-- ============================================================

create table if not exists email_automations (
  id uuid primary key default uuid_generate_v4(),
  gym_id uuid references gyms(id) not null,
  name text not null,
  trigger_event text not null,         -- 'new_member', 'failed_payment', 'absent_14d', etc.
  subject text not null,
  body text not null,
  active boolean default true,
  send_delay_hours int default 0,
  created_at timestamptz default now()
);

create table if not exists sent_communications (
  id uuid primary key default uuid_generate_v4(),
  gym_id uuid references gyms(id) not null,
  member_id uuid references profiles(id),
  automation_id uuid references email_automations(id),
  channel text check (channel in ('email', 'sms', 'push')),
  subject text,
  body text,
  sent_at timestamptz default now(),
  status text check (status in ('sent', 'delivered', 'failed', 'bounced'))
);

-- ============================================================
-- GYM PROVISIONING (super_admin view)
-- Track onboarding state for each gym
-- ============================================================

create table if not exists gym_onboarding (
  id uuid primary key default uuid_generate_v4(),
  gym_id uuid references gyms(id) unique not null,
  step_profile_complete boolean default false,      -- gym info filled out
  step_plan_created boolean default false,          -- at least 1 membership plan
  step_class_created boolean default false,         -- at least 1 class definition
  step_admin_invited boolean default false,         -- gym admin user created
  step_stripe_connected boolean default false,      -- Stripe Connect onboarded
  step_first_member boolean default false,          -- first member added
  step_waiver_created boolean default false,        -- waiver template created
  completed_at timestamptz,
  notes text,                                       -- RollCall internal notes on this gym
  provisioned_by uuid references rollcall_admins(id),
  created_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all tables
do $$ declare t text; begin
  for t in select tablename from pg_tables where schemaname = 'public' loop
    execute format('alter table %I enable row level security', t);
  end loop;
end $$;

-- Helper: get current user's gym_id
create or replace function current_gym_id() returns uuid as $$
  select gym_id from profiles where auth_user_id = auth.uid() limit 1;
$$ language sql stable security definer;

-- Helper: get current user's role
create or replace function current_role_in_gym() returns text as $$
  select role from profiles where auth_user_id = auth.uid() limit 1;
$$ language sql stable security definer;

-- Helper: is current user a super_admin (RollCall company)?
create or replace function is_super_admin() returns boolean as $$
  select exists(select 1 from rollcall_admins where auth_user_id = auth.uid());
$$ language sql stable security definer;

-- GYMS: super_admins see all; gym admins/instructors/students see only their gym
create policy "super_admin sees all gyms" on gyms
  for all using (is_super_admin());

create policy "gym members see own gym" on gyms
  for select using (id = current_gym_id());

-- PROFILES: gym-scoped; super_admin sees all
create policy "super_admin sees all profiles" on profiles
  for all using (is_super_admin());

create policy "gym members see their gym" on profiles
  for select using (gym_id = current_gym_id());

create policy "admins manage profiles in their gym" on profiles
  for all using (
    gym_id = current_gym_id()
    and current_role_in_gym() in ('admin', 'instructor')
  );

create policy "students see only their own profile" on profiles
  for select using (auth_user_id = auth.uid());

-- CLASS SESSIONS / REGISTRATIONS / ATTENDANCE: gym-scoped
create policy "gym-scoped class_sessions" on class_sessions
  for all using (gym_id = current_gym_id() or is_super_admin());

create policy "gym-scoped registrations" on registrations
  for all using (gym_id = current_gym_id() or is_super_admin());

create policy "gym-scoped attendance" on attendance
  for all using (gym_id = current_gym_id() or is_super_admin());

-- PAYMENT MIGRATION: admin+ only
create policy "payment migrations admin only" on payment_migrations
  for all using (
    (gym_id = current_gym_id() and current_role_in_gym() = 'admin')
    or is_super_admin()
  );

-- ============================================================
-- INDEXES (performance)
-- ============================================================

create index if not exists idx_profiles_gym_id on profiles(gym_id);
create index if not exists idx_profiles_auth_user_id on profiles(auth_user_id);
create index if not exists idx_profiles_email on profiles(email);
create index if not exists idx_profiles_family_group on profiles(family_group_id);
create index if not exists idx_profiles_status on profiles(status);
create index if not exists idx_class_sessions_date on class_sessions(session_date);
create index if not exists idx_class_sessions_gym on class_sessions(gym_id);
create index if not exists idx_registrations_session on registrations(class_session_id);
create index if not exists idx_registrations_member on registrations(member_id);
create index if not exists idx_attendance_session on attendance(class_session_id);
create index if not exists idx_attendance_member on attendance(member_id);
create index if not exists idx_migrated_pm_old_email on migrated_payment_methods(old_email);
create index if not exists idx_migrated_pm_migration on migrated_payment_methods(migration_id);

-- ============================================================
-- NOTES FOR IMPLEMENTATION
-- ============================================================
--
-- STRIPE INTEGRATION (when ready):
--   - Each gym gets a Stripe Connect account (stripe_connect_account_id on gyms)
--   - RollCall charges gyms the platform fee via rollcall_stripe_subscription_id
--   - Gyms charge members via their Connect account
--   - stripe_price_id on membership_plans = Stripe Price object (create via API)
--   - stripe_subscription_id on member_subscriptions = Stripe Subscription
--   - For family billing: bill primary_member's stripe_customer_id,
--     subscription covers all family members
--
-- ZEN PLANNER IMPORT FLOW:
--   1. Gym admin uploads ZP member CSV → import_batches record created
--   2. Server maps CSV columns → profiles rows (name, email, belt, join_date)
--   3. Flag members missing email → members_without_email count on payment_migrations
--   4. Gym admin requests payment migration → payment_migrations row created
--   5. RollCall contacts CardPointe/Fiserv for PAN export on behalf of gym
--   6. PAN file submitted to Stripe migration team
--   7. Stripe returns Customer mapping → migrated_payment_methods rows updated
--   8. Match by email: migrated_payment_methods.old_email → profiles.email
--   9. Set profiles.stripe_customer_id = stripe_customer_id from migration
--   10. Gym is live on Stripe. No card re-entry needed for matched members.
--
-- FAMILY ACCOUNTS:
--   - Create family_groups row first
--   - Set primary_member_id to the adult profile
--   - Add stripe_customer_id to family_groups (not child profiles)
--   - Child profiles have is_minor = true (auto-computed from DOB)
--   - Waivers for minors: signed_waivers.signed_by_profile_id = guardian's profile
--   - member_subscriptions.billed_to_profile_id = primary account
--
