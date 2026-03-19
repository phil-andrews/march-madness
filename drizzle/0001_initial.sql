create table if not exists teams (
  id integer generated always as identity primary key,
  assigned_number integer not null unique,
  name text not null,
  seed integer not null,
  espn_team_id text unique,
  slot_label text not null,
  is_first_four_slot boolean not null default false,
  first_four_opponent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists entries (
  id uuid primary key,
  name text not null,
  source text not null default 'admin',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists entry_teams (
  entry_id uuid not null references entries(id) on delete cascade,
  team_id integer not null references teams(id) on delete restrict,
  position smallint not null,
  created_at timestamptz not null default now(),
  primary key (entry_id, team_id),
  constraint entry_teams_position_check check (position between 1 and 10),
  constraint entry_teams_entry_position_unique unique (entry_id, position)
);

create table if not exists game_results (
  id bigserial primary key,
  espn_game_id text not null unique,
  round integer not null,
  winner_espn_team_id text not null,
  loser_espn_team_id text not null,
  winner_team_name text not null,
  loser_team_name text not null,
  is_championship boolean not null default false,
  played_at timestamptz not null,
  fetched_at timestamptz not null default now()
);

create index if not exists game_results_played_at_idx on game_results (played_at desc);
create index if not exists game_results_round_idx on game_results (round);
