-- Enable pgvector for semantic matching
create extension if not exists vector;

-- Users (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  display_name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- AI chat messages
create table public.messages (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz default now()
);

-- Semantic embeddings per user (updated periodically from chat history)
create table public.user_embeddings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null unique,
  embedding vector(1536),
  summary text, -- human-readable summary of user's "soul"
  updated_at timestamptz default now()
);

-- Spark matches
create table public.sparks (
  id uuid default gen_random_uuid() primary key,
  user_a uuid references public.profiles(id) on delete cascade not null,
  user_b uuid references public.profiles(id) on delete cascade not null,
  reason text not null, -- why they were matched, shown to both
  status text default 'pending' check (status in ('pending', 'accepted', 'declined', 'expired')),
  created_at timestamptz default now(),
  expires_at timestamptz default (now() + interval '48 hours')
);

-- Spark thread messages (human-to-human)
create table public.spark_messages (
  id uuid default gen_random_uuid() primary key,
  spark_id uuid references public.sparks(id) on delete cascade not null,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamptz default now()
);

-- RLS policies
alter table public.profiles enable row level security;
alter table public.messages enable row level security;
alter table public.user_embeddings enable row level security;
alter table public.sparks enable row level security;
alter table public.spark_messages enable row level security;

-- Profiles: users can read/update their own
create policy "users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Messages: users can only see their own
create policy "users can view own messages" on public.messages for select using (auth.uid() = user_id);
create policy "users can insert own messages" on public.messages for insert with check (auth.uid() = user_id);

-- Sparks: users can see sparks they're part of
create policy "users can view own sparks" on public.sparks for select using (auth.uid() = user_a or auth.uid() = user_b);
create policy "users can update own sparks" on public.sparks for update using (auth.uid() = user_a or auth.uid() = user_b);

-- Spark messages: users can see messages in their sparks
create policy "users can view spark messages" on public.spark_messages for select
  using (exists (
    select 1 from public.sparks
    where sparks.id = spark_messages.spark_id
    and (sparks.user_a = auth.uid() or sparks.user_b = auth.uid())
  ));
create policy "users can insert spark messages" on public.spark_messages for insert
  with check (
    auth.uid() = sender_id and
    exists (
      select 1 from public.sparks
      where sparks.id = spark_messages.spark_id
      and (sparks.user_a = auth.uid() or sparks.user_b = auth.uid())
      and sparks.status = 'accepted'
    )
  );

-- Function: match users by embedding similarity
create or replace function match_users(
  query_embedding vector(1536),
  exclude_user_id uuid,
  match_count int default 5
)
returns table (
  user_id uuid,
  display_name text,
  similarity float,
  summary text
)
language sql stable
as $$
  select
    p.id as user_id,
    p.display_name,
    1 - (ue.embedding <=> query_embedding) as similarity,
    ue.summary
  from public.user_embeddings ue
  join public.profiles p on p.id = ue.user_id
  where ue.user_id != exclude_user_id
    and ue.embedding is not null
  order by ue.embedding <=> query_embedding
  limit match_count;
$$;

-- Trigger: auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, split_part(new.email, '@', 1));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
