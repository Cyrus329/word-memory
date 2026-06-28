-- 专升本单词记忆 v40：Supabase 三表云同步初始化脚本
-- 用法：复制本文件全部内容，到 Supabase SQL Editor 里运行一次。
-- 新结构：word_cloud_decks / word_cloud_items / word_cloud_progress

create table if not exists public.word_cloud_decks (
  slug text primary key,
  display_name text,
  pin_hash text not null,
  is_public boolean not null default true,
  schema_version integer not null default 2,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.word_cloud_items (
  slug text not null references public.word_cloud_decks(slug) on delete cascade,
  item_id text not null,
  term text not null default '',
  phonetic text not null default '',
  meaning text not null default '',
  phrase text not null default '',
  note text not null default '',
  tag text not null default '',
  source text not null default '',
  sources jsonb not null default '[]'::jsonb,
  forms jsonb not null default '{}'::jsonb,
  word jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (slug, item_id)
);

create table if not exists public.word_cloud_progress (
  slug text not null references public.word_cloud_decks(slug) on delete cascade,
  item_id text not null,
  term text not null default '',
  progress jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (slug, item_id)
);

create index if not exists word_cloud_items_slug_sort_idx on public.word_cloud_items(slug, sort_order, item_id);
create index if not exists word_cloud_progress_slug_updated_idx on public.word_cloud_progress(slug, updated_at desc);

alter table public.word_cloud_decks enable row level security;
alter table public.word_cloud_items enable row level security;
alter table public.word_cloud_progress enable row level security;

drop policy if exists "word_cloud_public_decks_read" on public.word_cloud_decks;
drop policy if exists "word_cloud_public_items_read" on public.word_cloud_items;
drop policy if exists "word_cloud_public_progress_read" on public.word_cloud_progress;

create policy "word_cloud_public_decks_read"
on public.word_cloud_decks
for select
to anon, authenticated
using (is_public = true);

create policy "word_cloud_public_items_read"
on public.word_cloud_items
for select
to anon, authenticated
using (
  exists (
    select 1 from public.word_cloud_decks d
    where d.slug = word_cloud_items.slug and d.is_public = true
  )
);

create policy "word_cloud_public_progress_read"
on public.word_cloud_progress
for select
to anon, authenticated
using (
  exists (
    select 1 from public.word_cloud_decks d
    where d.slug = word_cloud_progress.slug and d.is_public = true
  )
);

create or replace function public.word_cloud_normalize_slug(p_slug text)
returns text
language sql
immutable
as $$
  select lower(regexp_replace(coalesce(p_slug, ''), '[^a-zA-Z0-9_-]', '', 'g'));
$$;

create or replace function public.word_cloud_require_editor(p_slug text, p_pin text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  clean_slug text := public.word_cloud_normalize_slug(p_slug);
  existing_hash text;
begin
  if clean_slug = '' or length(clean_slug) > 32 then
    raise exception '公开编号只能使用 1-32 位英文、数字、下划线或短横线';
  end if;
  if length(coalesce(p_pin, '')) < 4 then
    raise exception '编辑密码至少 4 位';
  end if;

  select pin_hash into existing_hash
  from public.word_cloud_decks
  where slug = clean_slug;

  if existing_hash is null then
    raise exception '没有找到这个云端词库，请先点保存并开启同步';
  end if;
  if existing_hash <> md5(p_pin) then
    raise exception '编辑密码不正确';
  end if;
  return clean_slug;
end;
$$;

create or replace function public.save_word_cloud_deck(
  p_slug text,
  p_pin text,
  p_display_name text default null,
  p_is_public boolean default true,
  p_schema_version integer default 2
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  clean_slug text := public.word_cloud_normalize_slug(p_slug);
  existing_hash text;
  saved_at timestamptz := now();
begin
  if clean_slug = '' or length(clean_slug) > 32 then
    raise exception '公开编号只能使用 1-32 位英文、数字、下划线或短横线';
  end if;
  if length(coalesce(p_pin, '')) < 4 then
    raise exception '编辑密码至少 4 位';
  end if;

  select pin_hash into existing_hash
  from public.word_cloud_decks
  where slug = clean_slug;

  if existing_hash is not null and existing_hash <> md5(p_pin) then
    raise exception '编辑密码不正确';
  end if;

  insert into public.word_cloud_decks (slug, display_name, pin_hash, is_public, schema_version, created_at, updated_at)
  values (clean_slug, coalesce(nullif(p_display_name, ''), clean_slug), md5(p_pin), coalesce(p_is_public, true), coalesce(p_schema_version, 2), saved_at, saved_at)
  on conflict (slug) do update set
    display_name = coalesce(nullif(excluded.display_name, ''), public.word_cloud_decks.display_name),
    pin_hash = excluded.pin_hash,
    is_public = excluded.is_public,
    schema_version = greatest(public.word_cloud_decks.schema_version, excluded.schema_version),
    updated_at = excluded.updated_at;

  return jsonb_build_object('ok', true, 'slug', clean_slug, 'schema_version', coalesce(p_schema_version, 2), 'updated_at', saved_at);
end;
$$;

create or replace function public.save_word_cloud_items(
  p_slug text,
  p_pin text,
  p_items jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  clean_slug text := public.word_cloud_require_editor(p_slug, p_pin);
  item jsonb;
  body jsonb;
  item_id text;
  idx integer := 0;
  sort_value integer;
  saved_at timestamptz := now();
begin
  if p_items is null or jsonb_typeof(p_items) <> 'array' then
    raise exception '词条数据格式不正确';
  end if;

  for item in select value from jsonb_array_elements(p_items)
  loop
    idx := idx + 1;
    body := coalesce(item->'word', item);
    item_id := coalesce(nullif(item->>'item_id', ''), nullif(item->>'id', ''), nullif(body->>'id', ''));
    if item_id is null then
      item_id := 'word-' || idx::text;
    end if;
    sort_value := case when coalesce(item->>'sort_order', '') ~ '^[0-9]+$' then (item->>'sort_order')::integer else idx end;

    insert into public.word_cloud_items (
      slug, item_id, term, phonetic, meaning, phrase, note, tag, source, sources, forms, word, sort_order, created_at, updated_at
    ) values (
      clean_slug,
      item_id,
      coalesce(nullif(item->>'term', ''), nullif(body->>'term', ''), ''),
      coalesce(nullif(item->>'phonetic', ''), nullif(item->>'note', ''), nullif(body->>'note', ''), ''),
      coalesce(nullif(item->>'meaning', ''), nullif(body->>'meaning', ''), ''),
      coalesce(nullif(item->>'phrase', ''), nullif(body->>'phrase', ''), ''),
      coalesce(nullif(item->>'note', ''), nullif(body->>'note', ''), ''),
      coalesce(nullif(item->>'tag', ''), nullif(body->>'tag', ''), ''),
      coalesce(nullif(item->>'source', ''), nullif(body->>'source', ''), ''),
      coalesce(item->'sources', body->'sources', '[]'::jsonb),
      coalesce(item->'forms', body->'forms', '{}'::jsonb),
      body,
      sort_value,
      saved_at,
      saved_at
    )
    on conflict (slug, item_id) do update set
      term = excluded.term,
      phonetic = excluded.phonetic,
      meaning = excluded.meaning,
      phrase = excluded.phrase,
      note = excluded.note,
      tag = excluded.tag,
      source = excluded.source,
      sources = excluded.sources,
      forms = excluded.forms,
      word = excluded.word,
      sort_order = excluded.sort_order,
      updated_at = excluded.updated_at;
  end loop;

  update public.word_cloud_decks set updated_at = saved_at where slug = clean_slug;
  return jsonb_build_object('ok', true, 'slug', clean_slug, 'count', idx, 'updated_at', saved_at);
end;
$$;

create or replace function public.save_word_cloud_progress(
  p_slug text,
  p_pin text,
  p_progress jsonb,
  p_study_time jsonb default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  clean_slug text := public.word_cloud_require_editor(p_slug, p_pin);
  item jsonb;
  item_id text;
  idx integer := 0;
  saved_at timestamptz := now();
begin
  if p_progress is null or jsonb_typeof(p_progress) <> 'array' then
    raise exception '学习进度格式不正确';
  end if;

  for item in select value from jsonb_array_elements(p_progress)
  loop
    idx := idx + 1;
    item_id := coalesce(nullif(item->>'item_id', ''), nullif(item->>'id', ''));
    if item_id is null then
      continue;
    end if;

    insert into public.word_cloud_progress (slug, item_id, term, progress, created_at, updated_at)
    values (
      clean_slug,
      item_id,
      coalesce(item->>'term', ''),
      item,
      saved_at,
      saved_at
    )
    on conflict (slug, item_id) do update set
      term = excluded.term,
      progress = excluded.progress,
      updated_at = excluded.updated_at;
  end loop;

  if p_study_time is not null then
    insert into public.word_cloud_progress (slug, item_id, term, progress, created_at, updated_at)
    values (
      clean_slug,
      '__word_memory_study_time_meta__',
      '__study_time__',
      jsonb_build_object('type', 'study_time', 'studyTime', p_study_time),
      saved_at,
      saved_at
    )
    on conflict (slug, item_id) do update set
      progress = excluded.progress,
      updated_at = excluded.updated_at;
  end if;

  update public.word_cloud_decks set updated_at = saved_at where slug = clean_slug;
  return jsonb_build_object('ok', true, 'slug', clean_slug, 'count', idx, 'updated_at', saved_at);
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
  clean_slug text := public.word_cloud_normalize_slug(p_slug);
  matched boolean;
begin
  select exists (
    select 1 from public.word_cloud_decks
    where slug = clean_slug and pin_hash = md5(coalesce(p_pin, ''))
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
  clean_slug text := public.word_cloud_normalize_slug(p_slug);
  deck public.word_cloud_decks%rowtype;
  items jsonb;
  progresses jsonb;
  study_time jsonb;
begin
  select * into deck
  from public.word_cloud_decks
  where slug = clean_slug;

  if not found then
    raise exception '没有找到这个云端词库';
  end if;

  if deck.is_public is not true and (p_pin is null or deck.pin_hash <> md5(coalesce(p_pin, ''))) then
    raise exception '这个词库需要正确编辑密码才能加载';
  end if;

  select coalesce(jsonb_agg(
    jsonb_build_object(
      'item_id', item_id,
      'id', item_id,
      'term', term,
      'phonetic', phonetic,
      'meaning', meaning,
      'phrase', phrase,
      'note', note,
      'tag', tag,
      'source', source,
      'sources', sources,
      'forms', forms,
      'word', word,
      'sort_order', sort_order,
      'updated_at', updated_at
    ) order by sort_order, item_id
  ), '[]'::jsonb)
  into items
  from public.word_cloud_items
  where slug = clean_slug;

  select coalesce(jsonb_agg(
    progress || jsonb_build_object('item_id', item_id, 'id', item_id)
    order by updated_at, item_id
  ), '[]'::jsonb)
  into progresses
  from public.word_cloud_progress
  where slug = clean_slug and item_id <> '__word_memory_study_time_meta__';

  select progress->'studyTime'
  into study_time
  from public.word_cloud_progress
  where slug = clean_slug and item_id = '__word_memory_study_time_meta__';

  return jsonb_build_object(
    'cloud_v2', true,
    'slug', deck.slug,
    'display_name', deck.display_name,
    'is_public', deck.is_public,
    'schema_version', deck.schema_version,
    'updated_at', deck.updated_at,
    'items', items,
    'progress', progresses,
    'study_time', coalesce(study_time, '{}'::jsonb)
  );
end;
$$;

-- 兼容旧版网页：旧版如果还在调用 save_word_memory_cloud，也会写入三表。
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
  first_item jsonb;
  compact_data jsonb;
  saved jsonb;
  item_count integer := 0;
  progress_count integer := 0;
begin
  perform public.save_word_cloud_deck(p_slug, p_pin, p_display_name, p_is_public, 2);

  if p_words is null or jsonb_typeof(p_words) <> 'array' then
    raise exception '词库数据格式不正确';
  end if;

  first_item := p_words->0;
  if first_item is not null and first_item->>'id' = '__word_memory_compact_payload__' then
    compact_data := first_item->'data';
    if compact_data is not null then
      saved := public.save_word_cloud_items(p_slug, p_pin, coalesce(compact_data->'customWords', '[]'::jsonb));
      item_count := coalesce((saved->>'count')::integer, 0);
      saved := public.save_word_cloud_progress(p_slug, p_pin, coalesce(compact_data->'progress', '[]'::jsonb), first_item->'studyTime');
      progress_count := coalesce((saved->>'count')::integer, 0);
    end if;
  else
    saved := public.save_word_cloud_items(p_slug, p_pin, p_words);
    item_count := coalesce((saved->>'count')::integer, 0);
    saved := public.save_word_cloud_progress(p_slug, p_pin, p_words, null);
    progress_count := coalesce((saved->>'count')::integer, 0);
  end if;

  return jsonb_build_object('ok', true, 'slug', public.word_cloud_normalize_slug(p_slug), 'items', item_count, 'progress', progress_count);
end;
$$;

grant execute on function public.word_cloud_normalize_slug(text) to anon, authenticated;
grant execute on function public.word_cloud_require_editor(text, text) to anon, authenticated;
grant execute on function public.save_word_cloud_deck(text, text, text, boolean, integer) to anon, authenticated;
grant execute on function public.save_word_cloud_items(text, text, jsonb) to anon, authenticated;
grant execute on function public.save_word_cloud_progress(text, text, jsonb, jsonb) to anon, authenticated;
grant execute on function public.verify_word_memory_cloud_pin(text, text) to anon, authenticated;
grant execute on function public.load_word_memory_cloud(text, text) to anon, authenticated;
grant execute on function public.save_word_memory_cloud(text, text, jsonb, text, boolean) to anon, authenticated;

-- 让 Supabase API 尽快刷新函数列表，避免 “Could not find the function ... in the schema cache”。
notify pgrst, 'reload schema';
