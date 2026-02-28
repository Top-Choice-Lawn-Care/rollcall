-- RollCall BJJ Gym Management
-- Supabase/PostgreSQL schema

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Gyms (multi-tenant ready)
create table if not exists gyms (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  owner_id uuid,
  stripe_customer_id text,
  plan_tier text default 'starter',
  created_at timestamptz default now()
);

-- Users / Auth profiles
create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  gym_id uuid references gyms(id),
  name text not null,
  email text not null,
  role text not null check (role in ('admin', 'instructor', 'student')),
  belt text check (belt in ('white', 'blue', 'purple', 'brown', 'black')),
  stripes int default 0 check (stripes >= 0 and stripes <= 4),
  join_date date,
  status text default 'active' check (status in ('active', 'inactive', 'trial', 'at-risk', 'on-hold')),
  monthly_fee int default 0,
  created_at timestamptz default now()
);

-- Class definitions
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

-- Class sessions (specific occurrences)
create table if not exists class_sessions (
  id uuid primary key default uuid_generate_v4(),
  class_definition_id uuid references class_definitions(id) not null,
  gym_id uuid references gyms(id) not null,
  session_date date not null,
  cancelled boolean default false,
  notes text,
  created_at timestamptz default now(),
  unique(class_definition_id, session_date)
);

-- Registrations (advance sign-up)
create table if not exists registrations (
  id uuid primary key default uuid_generate_v4(),
  class_session_id uuid references class_sessions(id) not null,
  member_id uuid references profiles(id) not null,
  registered_at timestamptz default now(),
  unique(class_session_id, member_id)
);

-- Attendance / Check-ins (physically present)
create table if not exists attendance (
  id uuid primary key default uuid_generate_v4(),
  class_session_id uuid references class_sessions(id) not null,
  member_id uuid references profiles(id) not null,
  checked_in_at timestamptz default now(),
  checked_in_by uuid references profiles(id),
  unique(class_session_id, member_id)
);

-- Belt promotions
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
  notes text,
  created_at timestamptz default now()
);

-- Membership plans
create table if not exists membership_plans (
  id uuid primary key default uuid_generate_v4(),
  gym_id uuid references gyms(id) not null,
  name text not null,
  price_cents int not null,
  billing_cycle text default 'monthly' check (billing_cycle in ('monthly', 'quarterly', 'annual')),
  stripe_price_id text,
  active boolean default true,
  created_at timestamptz default now()
);

-- Member subscriptions
create table if not exists member_subscriptions (
  id uuid primary key default uuid_generate_v4(),
  member_id uuid references profiles(id) not null,
  plan_id uuid references membership_plans(id) not null,
  stripe_subscription_id text,
  status text check (status in ('active', 'past_due', 'canceled', 'on_hold')),
  start_date date not null,
  end_date date,
  created_at timestamptz default now()
);

-- RLS (Row Level Security) — gym data isolation
alter table gyms enable row level security;
alter table profiles enable row level security;
alter table class_definitions enable row level security;
alter table class_sessions enable row level security;
alter table registrations enable row level security;
alter table attendance enable row level security;
alter table belt_promotions enable row level security;
alter table membership_plans enable row level security;
alter table member_subscriptions enable row level security;

-- Basic RLS policies (expand as needed)
create policy "Users can view their own gym data" on profiles
  for select using (gym_id = (select gym_id from profiles where id = auth.uid()));

create policy "Admins can manage their gym" on profiles
  for all using (
    gym_id = (select gym_id from profiles where id = auth.uid())
    and (select role from profiles where id = auth.uid()) in ('admin', 'instructor')
  );
