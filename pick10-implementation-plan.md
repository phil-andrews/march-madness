# Pick-10 March Madness Tracker — Implementation Plan

## Overview

A Next.js web app where you and your friends can enter your 10 picks, then watch a live leaderboard update automatically as March Madness games complete. Scoring follows Andy Nelson's Pick-10 rules: **points = seed × wins**, with **+20 bonus for champion** and **+10 for runner-up**.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router, TypeScript) |
| Database | Neon (Postgres serverless) |
| ORM | Drizzle ORM |
| UI | shadcn/ui |
| Scores Data | ESPN Unofficial API (free, no key) |
| Hosting | Vercel |
| Auth | Simple passcode per entry (no OAuth needed for a friend group) |

---

## Scoring Rules (encoded from the rules doc)

```typescript
function calcScore(seed: number, wins: number, isChampion: boolean, isRunnerUp: boolean): number {
  const basePoints = seed * wins;
  const championBonus = isChampion ? 20 : 0;
  const runnerUpBonus = isRunnerUp ? 10 : 0;
  return basePoints + championBonus + runnerUpBonus;
}
```

Note: First Four wins (Tuesday/Wednesday games, March 17-18) do **not** count toward scoring. Scoring starts Thursday, March 19.

---

## Database Schema (Neon / Drizzle)

```sql
-- All 64 tournament teams with their assigned numbers and seeds
CREATE TABLE teams (
  id SERIAL PRIMARY KEY,
  assigned_number INTEGER UNIQUE NOT NULL,  -- Andy's 1-64 numbering
  name TEXT NOT NULL,
  seed INTEGER NOT NULL,
  espn_team_id TEXT,                        -- for matching ESPN API results
  is_first_four BOOLEAN DEFAULT false,
  first_four_opponent TEXT                  -- e.g. "SMU/Miami OH" 
);

-- Each person's entry (one row per entry, up to 10 teams)
CREATE TABLE entries (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  passcode TEXT NOT NULL,                   -- simple 4-digit pin to "own" your entry
  team_ids INTEGER[] NOT NULL,              -- array of 10 assigned_numbers
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cached game results from ESPN API (refreshed via cron or on-demand)
CREATE TABLE game_results (
  id SERIAL PRIMARY KEY,
  espn_game_id TEXT UNIQUE NOT NULL,
  round INTEGER NOT NULL,                   -- 1=First Round, 2=Second Round, etc.
  winner_espn_id TEXT NOT NULL,
  loser_espn_id TEXT NOT NULL,
  is_championship BOOLEAN DEFAULT false,
  played_at TIMESTAMPTZ,
  fetched_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Team Data (pre-seeded from the spreadsheet)

The full 2026 team list is already known. Seed it on first deploy:

```typescript
// seeds/teams.ts
export const TEAMS_2026 = [
  { assigned_number: 1,  name: "Arizona",         seed: 1 },
  { assigned_number: 2,  name: "Duke",             seed: 1 },
  { assigned_number: 3,  name: "Florida",          seed: 1 },
  { assigned_number: 4,  name: "Michigan",         seed: 1 },
  { assigned_number: 5,  name: "Houston",          seed: 2 },
  { assigned_number: 6,  name: "Iowa State",       seed: 2 },
  { assigned_number: 7,  name: "Purdue",           seed: 2 },
  { assigned_number: 8,  name: "UConn",            seed: 2 },
  { assigned_number: 9,  name: "Gonzaga",          seed: 3 },
  { assigned_number: 10, name: "Illinois",         seed: 3 },
  { assigned_number: 11, name: "Michigan State",   seed: 3 },
  { assigned_number: 12, name: "Virginia",         seed: 3 },
  { assigned_number: 13, name: "Alabama",          seed: 4 },
  { assigned_number: 14, name: "Arkansas",         seed: 4 },
  { assigned_number: 15, name: "Kansas",           seed: 4 },
  { assigned_number: 16, name: "Nebraska",         seed: 4 },
  { assigned_number: 17, name: "St. John's",       seed: 5 },
  { assigned_number: 18, name: "Texas Tech",       seed: 5 },
  { assigned_number: 19, name: "Vanderbilt",       seed: 5 },
  { assigned_number: 20, name: "Wisconsin",        seed: 5 },
  { assigned_number: 21, name: "BYU",              seed: 6 },
  { assigned_number: 22, name: "Louisville",       seed: 6 },
  { assigned_number: 23, name: "North Carolina",   seed: 6 },
  { assigned_number: 24, name: "Tennessee",        seed: 6 },
  { assigned_number: 25, name: "UCLA",             seed: 7 },
  { assigned_number: 26, name: "Kentucky",         seed: 7 },
  { assigned_number: 27, name: "Miami",            seed: 7 },
  { assigned_number: 28, name: "St. Mary's",       seed: 7 },
  { assigned_number: 29, name: "Ohio State",       seed: 8 },
  { assigned_number: 30, name: "Clemson",          seed: 8 },
  { assigned_number: 31, name: "Georgia",          seed: 8 },
  { assigned_number: 32, name: "Villanova",        seed: 8 },
  { assigned_number: 33, name: "TCU",              seed: 9 },
  { assigned_number: 34, name: "Iowa",             seed: 9 },
  { assigned_number: 35, name: "St. Louis",        seed: 9 },
  { assigned_number: 36, name: "Utah State",       seed: 9 },
  { assigned_number: 37, name: "UCF",              seed: 10 },
  { assigned_number: 38, name: "Missouri",         seed: 10 },
  { assigned_number: 39, name: "Santa Clara",      seed: 10 },
  { assigned_number: 40, name: "Texas A&M",        seed: 10 },
  { assigned_number: 41, name: "South Florida",    seed: 11 },
  { assigned_number: 42, name: "VCU",              seed: 11 },
  { assigned_number: 43, name: "NC State",         seed: 11, is_first_four: true, first_four_opponent: "Texas" },
  { assigned_number: 44, name: "Miami (OH)",       seed: 11, is_first_four: true, first_four_opponent: "SMU" },
  { assigned_number: 45, name: "Akron",            seed: 12 },
  { assigned_number: 46, name: "High Point",       seed: 12 },
  { assigned_number: 47, name: "McNeese",          seed: 12 },
  { assigned_number: 48, name: "Northern Iowa",    seed: 12 },
  { assigned_number: 49, name: "Cal Baptist",      seed: 13 },
  { assigned_number: 50, name: "Hawaii",           seed: 13 },
  { assigned_number: 51, name: "Hofstra",          seed: 13 },
  { assigned_number: 52, name: "Troy",             seed: 13 },
  { assigned_number: 53, name: "Kennesaw St.",     seed: 14 },
  { assigned_number: 54, name: "North Dakota St.", seed: 14 },
  { assigned_number: 55, name: "Penn",             seed: 14 },
  { assigned_number: 56, name: "Wright State",     seed: 14 },
  { assigned_number: 57, name: "Furman",           seed: 15 },
  { assigned_number: 58, name: "Idaho",            seed: 15 },
  { assigned_number: 59, name: "Queens",           seed: 15 },
  { assigned_number: 60, name: "Tennessee State",  seed: 15 },
  { assigned_number: 61, name: "Long Island",      seed: 16 },
  { assigned_number: 62, name: "Siena",            seed: 16 },
  { assigned_number: 63, name: "Howard",           seed: 16, is_first_four: true, first_four_opponent: "UMBC" },
  { assigned_number: 64, name: "Prairie View",     seed: 16, is_first_four: true, first_four_opponent: "Lehigh" },
];
```

> **Note on First Four (43, 44, 63, 64):** The First Four game winners have already been decided (March 17-18). Miami (OH) beat SMU, Prairie View beat Lehigh, Howard beat UMBC, and NC State beat Texas. The database should store the **winner** as the active team for those slots — those wins don't earn points, but any wins from Thursday onward do.

---

## ESPN API Integration

### Fetching Today's / Tournament Scores

```typescript
// lib/espn.ts

const NCAAM_SCOREBOARD = 
  "https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard";

export async function fetchTournamentGames(dateStr?: string) {
  // dateStr format: YYYYMMDD — omit for today
  const url = dateStr 
    ? `${NCAAM_SCOREBOARD}?dates=${dateStr}&groups=100` // groups=100 = NCAA Tournament
    : `${NCAAM_SCOREBOARD}?groups=100`;
  
  const res = await fetch(url, { next: { revalidate: 60 } }); // cache 60s
  const data = await res.json();
  return data.events; // array of game objects
}

export async function fetchGameSummary(eventId: string) {
  const url = `https://site.web.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/summary?event=${eventId}`;
  const res = await fetch(url);
  return res.json();
}
```

### Mapping ESPN Teams → Our Database

ESPN uses its own team IDs. We match by name when seeding:

```typescript
// When fetching game results, match winner name → our teams table
// Store espn_team_id on teams table for fast future lookups
async function resolveEspnTeamId(espnName: string): Promise<number | null> {
  // fuzzy match against teams.name — handle "Miami (FL)" vs "Miami" etc.
}
```

### Syncing Results (Server Action or API Route)

```typescript
// app/api/sync/route.ts  (called by Vercel cron or manually)
export async function GET() {
  const games = await fetchTournamentGames();
  
  for (const event of games) {
    if (event.status.type.completed) {
      const winner = event.competitions[0].competitors.find(c => c.winner);
      const loser  = event.competitions[0].competitors.find(c => !c.winner);
      const round  = parseRound(event.season.slug); // "ncaa-tournament-round-of-64" etc.
      
      await db.insert(gameResults).values({
        espn_game_id: event.id,
        round,
        winner_espn_id: winner.team.id,
        loser_espn_id: loser.team.id,
        is_championship: round === 6,
        played_at: new Date(event.date),
      }).onConflictDoNothing();
    }
  }
  
  return Response.json({ synced: games.length });
}
```

Add to `vercel.json` for auto-refresh every 5 minutes during tournament:
```json
{
  "crons": [{ "path": "/api/sync", "schedule": "*/5 * * * *" }]
}
```

---

## Score Calculation (Server-Side)

```typescript
// lib/scoring.ts

export async function calculateLeaderboard() {
  const entries = await db.select().from(entriesTable);
  const results = await db.select().from(gameResultsTable);
  const teams   = await db.select().from(teamsTable);

  // Build win map: espn_team_id → { wins, isChampion, isRunnerUp }
  const winMap = buildWinMap(results);

  return entries
    .map(entry => {
      let totalPoints = 0;
      const teamBreakdown = entry.team_ids.map(assignedNum => {
        const team = teams.find(t => t.assigned_number === assignedNum)!;
        const stats = winMap[team.espn_team_id] ?? { wins: 0, isChampion: false, isRunnerUp: false };
        const points = calcScore(team.seed, stats.wins, stats.isChampion, stats.isRunnerUp);
        totalPoints += points;
        return { team, points, ...stats };
      });
      return { entry, totalPoints, teamBreakdown };
    })
    .sort((a, b) => b.totalPoints - a.totalPoints);
}
```

---

## Pages & Routes

```
app/
├── page.tsx                  → Leaderboard (homepage)
├── entry/
│   ├── new/page.tsx          → Submit your 10 picks
│   └── [id]/page.tsx         → Your personal pick detail view
├── admin/
│   └── page.tsx              → Passcode-protected: add/edit entries (for you to manage)
└── api/
    ├── sync/route.ts         → ESPN sync endpoint (hit by cron)
    ├── entries/route.ts      → POST new entry
    └── leaderboard/route.ts  → GET computed standings
```

---

## UI Components (shadcn/ui)

| Page | Components |
|---|---|
| Leaderboard | `Table`, `Badge` (for rank), `Card`, `Progress` bar per entry |
| Entry submission | `Form`, `Combobox` (searchable team picker), `Badge` for selected teams |
| Entry detail | `Accordion` per team showing wins + points breakdown |
| Admin | `DataTable`, `Dialog` for adding entries |

### Leaderboard Card Design

Each row shows:
- Rank (#1, #2...)
- Name
- Total points
- Mini team pill list (green = still alive, gray = eliminated)
- Projected max possible points (for teams still in)

---

## Entry Flow

1. User goes to `/entry/new`
2. Sees searchable list of all 64 teams (with seed shown)
3. Selects exactly 10 teams — UI enforces the count
4. Enters their name + a 4-digit passcode (to edit later if needed)
5. Submits → stored in Neon

No email/OAuth needed for a friend group. The passcode is just so people can view their own detail page.

---

## Data Entry for Existing Picks

Since the deadline was **10am EDT today (March 19)** and you already have everyone's picks, the fastest path is a simple **admin import page** or a seed script:

```typescript
// scripts/seed-entries.ts — run once with your friends' picks
const ENTRIES = [
  { name: "Phil",    picks: [/* assigned numbers */] },
  { name: "Friend2", picks: [/* assigned numbers */] },
  // ...
];
```

You can also build a quick admin UI at `/admin` where you paste in each person's vertical list exactly as Andy's email format shows.

---

## Environment Variables

```bash
# .env.local
DATABASE_URL=postgresql://...  # Neon connection string
ADMIN_PASSCODE=yourpasscode     # protects /admin route
```

---

## Build Order (Recommended)

1. **Schema + seed** — Set up Neon, run Drizzle migrations, seed team data
2. **ESPN sync** — Build and test `/api/sync`, verify you can pull completed games
3. **Score engine** — Unit test `calculateLeaderboard()` with mock data
4. **Admin entry import** — Get all your friends' picks into the DB
5. **Leaderboard page** — The most important UI; get this polished first
6. **Entry detail page** — Per-person breakdown
7. **Public entry form** — Lower priority since picks are already in
8. **Cron + auto-refresh** — Wire up Vercel cron, add `revalidatePath` on sync

---

## Key Implementation Notes

- **First Four handling**: Teams 43, 44, 63, 64 were in play-in games. The winners (Miami OH, Prairie View, Howard, NC State) are now the active entrants. If someone picked assigned number 44 ("SMU/Miami OH"), they picked the slot — resolve it to Miami OH (the winner) since that's who's now in the tournament. No points for those play-in wins.
- **Score starts March 19**: Filter out any `game_results` with `round = 0` (First Four) from scoring.
- **ESPN group filter**: Use `?groups=100` on the ESPN scoreboard endpoint to filter to NCAA tournament games only and avoid regular season noise.
- **Projected max score**: A fun feature — for each entry, calculate `current points + (seed × remaining possible wins)` for each surviving team. Shows who still has upside.
