create table if not exists sync_status (
  key text primary key,
  last_successful_sync_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into sync_status (key, last_successful_sync_at)
select 'tournament_results', max(fetched_at)
from game_results
on conflict (key) do nothing;
