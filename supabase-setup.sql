-- 专升本单词记忆：Supabase 云存档初始化脚本
-- 使用方法：复制本文件全部内容，到 Supabase SQL Editor 里运行一次。

create table if not exists public.word_memory_cloud_profiles (
  slug text primary key,
  display_name text,
  pin_hash text not null,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.word_memory_cloud_words (
  slug text not null references public.word_memory_cloud_profiles(slug) on delete cascade,
  record_id text not null,
  record jsonb not null,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (slug, record_id)
);

alter table public.word_memory_cloud_profiles enable row level security;
alter table public.word_memory_cloud_words enable row level security;

drop policy if exists "word_memory_public_profiles_read" on public.word_memory_cloud_profiles;
drop policy if exists "word_memory_public_words_read" on public.word_memory_cloud_words;

create policy "word_memory_public_profiles_read"
on public.word_memory_cloud_profiles
for select
to anon, authenticated
using (is_public = true);

create policy "word_memory_public_words_read"
on public.word_memory_cloud_words
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.word_memory_cloud_profiles p
    where p.slug = word_memory_cloud_words.slug
      and p.is_public = true
  )
);

create or replace function public.save_word_memory_cloud(
  p_slug text,
  p_pin text,
  p_words jsonb,
  p_display_name text default null,
  p_is_public boolean default true
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  clean_slug text := lower(regexp_replace(coalesce(p_slug, ''), '[^a-zA-Z0-9_-]', '', 'g'));
  existing_hash text;
  item jsonb;
  idx integer := 0;
  saved_at timestamptz := now();
begin
  if clean_slug = '' or length(clean_slug) > 32 then
    raise exception '公开编号只能使用 1-32 位英文、数字、下划线或短横线';
  end if;

  if length(coalesce(p_pin, '')) < 4 then
    raise exception '编辑密码至少 4 位';
  end if;

  if p_words is null or jsonb_typeof(p_words) <> 'array' then
    raise exception '词库数据格式不正确';
  end if;

  select pin_hash into existing_hash
  from public.word_memory_cloud_profiles
  where slug = clean_slug;

  if existing_hash is not null and existing_hash <> md5(p_pin) then
    raise exception '编辑密码不正确';
  end if;

  insert into public.word_memory_cloud_profiles (slug, display_name, pin_hash, is_public, created_at, updated_at)
  values (clean_slug, coalesce(p_display_name, clean_slug), md5(p_pin), coalesce(p_is_public, true), saved_at, saved_at)
  on conflict (slug) do update set
    display_name = coalesce(excluded.display_name, public.word_memory_cloud_profiles.display_name),
    pin_hash = excluded.pin_hash,
    is_public = excluded.is_public,
    updated_at = excluded.updated_at;

  delete from public.word_memory_cloud_words
  where slug = clean_slug;

  for item in select value from jsonb_array_elements(p_words)
  loop
    idx := idx + 1;
    insert into public.word_memory_cloud_words (slug, record_id, record, sort_order, updated_at)
    values (
      clean_slug,
      coalesce(nullif(item->>'id', ''), 'word') || '-' || idx::text,
      item,
      idx,
      saved_at
    );
  end loop;

  return jsonb_build_object(
    'ok', true,
    'slug', clean_slug,
    'count', idx,
    'updated_at', saved_at
  );
end;
$$;

create or replace function public.verify_word_memory_cloud_pin(
  p_slug text,
  p_pin text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  clean_slug text := lower(regexp_replace(coalesce(p_slug, ''), '[^a-zA-Z0-9_-]', '', 'g'));
  matched boolean;
begin
  select exists (
    select 1
    from public.word_memory_cloud_profiles
    where slug = clean_slug
      and pin_hash = md5(coalesce(p_pin, ''))
  ) into matched;

  if not matched then
    raise exception '编辑密码不正确';
  end if;

  return jsonb_build_object('ok', true, 'slug', clean_slug);
end;
$$;

create or replace function public.load_word_memory_cloud(
  p_slug text,
  p_pin text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  clean_slug text := lower(regexp_replace(coalesce(p_slug, ''), '[^a-zA-Z0-9_-]', '', 'g'));
  profile public.word_memory_cloud_profiles%rowtype;
  words jsonb;
begin
  select * into profile
  from public.word_memory_cloud_profiles
  where slug = clean_slug;

  if not found then
    raise exception '没有找到这个云端词库';
  end if;

  if profile.is_public is not true and (p_pin is null or profile.pin_hash <> md5(coalesce(p_pin, ''))) then
    raise exception '这个词库需要正确编辑密码才能加载';
  end if;

  select coalesce(jsonb_agg(record order by sort_order), '[]'::jsonb)
  into words
  from public.word_memory_cloud_words
  where slug = clean_slug;

  return jsonb_build_object(
    'slug', profile.slug,
    'display_name', profile.display_name,
    'is_public', profile.is_public,
    'updated_at', profile.updated_at,
    'words', words
  );
end;
$$;

grant execute on function public.save_word_memory_cloud(text, text, jsonb, text, boolean) to anon, authenticated;
grant execute on function public.verify_word_memory_cloud_pin(text, text) to anon, authenticated;
grant execute on function public.load_word_memory_cloud(text, text) to anon, authenticated;
