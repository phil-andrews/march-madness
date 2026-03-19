# Pick-10 Tracker

Small-group March Madness tracker for Andy Nelson style Pick-10 scoring:

- points = `seed × wins`
- champion bonus = `+20`
- runner-up bonus = `+10`
- First Four wins do not count

The app is built with Next.js App Router, Neon Postgres, Drizzle, and a shadcn preset.

## Local setup

Create `.env.local` with either:

```bash
DATABASE_URL=postgresql://...
```

or the Postgres parts:

```bash
PGHOST=...
PGDATABASE=...
PGUSER=...
PGPASSWORD=...
PGSSLMODE=require
PGCHANNELBINDING=require
```

Add these for app control:

```bash
ADMIN_PASSCODE=your-admin-passcode
CRON_SECRET=your-cron-secret
```

## Commands

```bash
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

The local dev server runs on `http://localhost:3004`.

Useful extras:

```bash
npm run test
npm run build
npm run db:import -- ./path/to/entries.txt
npm run db:import-2026
```

## Import formats

The admin page accepts either:

1. JSON:

```json
[
  { "name": "Phil", "picks": [1, 5, 17, 24, 28, 33, 40, 47, 55, 63] }
]
```

2. Plain text blocks:

```text
Phil
1
5
17
24
28
33
40
47
55
63
```

## Routes

- `/` leaderboard
- `/articles` article archive
- `/entry/[id]` entry detail
- `/admin` admin import and sync tools
- `/api/sync` cron/manual sync endpoint guarded by `CRON_SECRET`

## Notes

- `vercel.json` schedules `/api/sync` every 5 minutes.
- The sync logic uses ESPN's tournament scoreboard endpoint with `groups=100`.
- The homepage serves the tracker, and the long-form article archive lives at `/articles`.
