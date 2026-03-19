# Homepage UX Refresh Build Plan

## Goal

Ship the homepage UX refresh in small, reviewable slices without breaking the entry detail or admin flows that share the same scoring and presentation helpers.

## Fixed Decisions

These decisions are locked before implementation starts:

- displayed rank ties on `totalPoints` only
- `projectedMax` orders equal-score rows but does not change displayed rank
- leader treatment is singular only when the top score is unique
- live content is grouped by game, not by entry
- live cards use a horizontal strip on mobile
- compact chips use `#assignedNumber TeamName`
- rows remain full links to entry detail
- no row expansion or chip interactivity in v1
- scheduled or "up next" treatment is deferred
- homepage remains `force-dynamic` for this pass
- the refresh must not add extra ESPN requests beyond the existing homepage live-data fetch path

## Work Sequence

### Step 1: Lock the Data Contract

Files:

- `lib/pick10/espn.ts`
- `lib/pick10/scoring.ts`
- `lib/pick10/presentation.ts`
- `lib/pick10/scoring.test.ts`
- `lib/pick10/presentation.test.ts` if needed

Tasks:

- extend live game data with a unique game identifier
- define snapshot-level live game output for the homepage
- define an explicit `liveDataStatus` contract so `unavailable` is distinct from `no live games`
- add per-entry `hasLiveGame`
- extract or codify rank-display logic so it is testable
- add compact chip-label and accessible-label helpers
- add or update unit tests for rank semantics and helper output
- add tests that cover both `liveDataStatus` and rank semantics

Checkpoint:

- `LeaderboardSnapshot` exposes the homepage data shape needed for later steps
- rank and leader semantics are test-covered before UI work starts
- `/entry/[id]` and `/admin` have been smoke-tested before UI work proceeds

### Step 2: Rebuild the Top of the Page

Files:

- `app/page.tsx`
- `components/pick10-sync-freshness.tsx` or similar new client component

Tasks:

- remove the large hero paragraph
- remove the standalone top-three cards in the same change
- add a compact header/status strip
- keep admin access as a low-emphasis text link
- add a small client freshness component for relative sync time, with the absolute timestamp preserved in accessible text

Checkpoint:

- leaderboard starts significantly higher on mobile
- there is only one standings surface on the homepage

### Step 3: Add the Live Games Strip

Files:

- `app/page.tsx`
- `lib/pick10/scoring.ts`

Tasks:

- render one compact card per live game
- make the strip horizontally scrollable on mobile
- show team, opponent, score, and clock/detail
- show at most two impacted entry names, then collapse the remainder into `+N more`
- add unavailable-state handling for live-data fetch failures
- add a concise `aria-live="polite"` status node for live-strip updates instead of making the entire strip chatty

Checkpoint:

- live games are discoverable without scanning leaderboard rows
- the strip handles multiple simultaneous games without pushing the leaderboard away

### Step 4: Replace the Leaderboard Rows

Files:

- `app/page.tsx`
- `lib/pick10/presentation.ts`

Tasks:

- convert stacked cards into dense rows
- surface score, projected max, and alive count inline
- replace current badges with compact chips in pick order
- dim eliminated chips and emphasize live chips
- remove the old color legend
- apply unique-leader or shared-top styling based on Step 1 semantics
- never render a singular `Leader` token when the top score is tied

Checkpoint:

- rows are materially shorter on mobile
- picks are still identifiable from the homepage

### Step 5: Responsive and Accessibility Pass

Files:

- `app/page.tsx`
- `lib/pick10/presentation.ts`
- any new homepage components

Tasks:

- verify meaning does not depend on color alone
- replace hover-only detail reliance with visible text plus `aria-label`
- test long names, empty state, fully eliminated entries, and many live games
- smoke-test `/entry/[id]` and `/admin`

Checkpoint:

- the homepage works in empty, quiet, and busy live-game states
- shared helper changes have not regressed adjacent pages

## Review Gates

Review the work after these slices:

1. After Step 1: data contracts, rank logic, and shared-page smoke tests
2. After Step 2: compact header plus top-three removal
3. After Step 3: live data visible in the new strip
4. After Step 4: dense rows and chips
5. After Step 5: final responsive and accessibility polish

## Verification

Required commands:

- `npm run test`
- `npm run lint`
- `npm run build`

Required manual checks:

- `/` empty state
- `/` normal state with no live games
- `/` live state with at least one live game
- `/` busy live state with many games
- `/` tie on points with different projected max values
- `/` tie for the top score
- `/` compact header with `lastSyncedAt = null`
- `/entry/[id]` smoke test
- `/admin` smoke test

## Explicit Non-Goals

- redesigning the entry detail page
- redesigning the admin page
- adding expandable leaderboard rows
- adding chip tooltips, popovers, or modal detail
- adding scheduled or "up next" modules
- changing the homepage data-fetching strategy
