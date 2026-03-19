# Entry Detail UX Refresh Build Plan

## Goal

Ship the entry-page refresh in reviewable slices while keeping homepage behavior stable.

## Fixed Decisions

- entry detail gets its own derived data shape instead of depending only on a raw homepage row
- rank context appears in the summary layer
- picks are grouped into `Live now`, `Still alive`, and `Out`
- pick order remains visible within each section
- live picks receive the highest-emphasis layout
- non-live picks use compact rows instead of large cards
- freshness is visible in the summary layer
- detail page must distinguish unavailable live data from a true no-live-teams state
- grouped sections keep original pick-position ordering inside each section

## Work Sequence

### Step 1: Lock the Entry Detail Data Contract

Files:

- `lib/pick10/scoring.ts`
- `lib/pick10/scoring.test.ts`

Tasks:

- introduce an entry-detail-specific data shape
- add grouped team arrays and summary counts
- expose `lastSyncedAt` and `liveDataStatus`
- preserve stable pick ordering within grouped sections
- add `getEntryDetailView()` while keeping `getEntryDetail()` stable for `/admin`
- cover grouping and summary counts with tests

Checkpoint:

- the page component can render summary and grouped sections without re-deriving team state
- `/admin` edit view still works with any `getEntryDetail()` signature/type changes

### Step 2: Rebuild the Summary Layer

Files:

- `app/entry/[id]/page.tsx`
- `components/pick10-sync-freshness.tsx` if reused

Tasks:

- remove the generic paragraph-heavy header
- add compact summary metadata including rank and freshness
- keep back navigation visible

Checkpoint:

- users can see the entry’s standing and current status immediately

### Step 3: Add the Live Picks Section

Files:

- `app/entry/[id]/page.tsx`
- `lib/pick10/presentation.ts`

Tasks:

- add a dedicated `Live now` section
- render live rows with opponent, score, and game detail
- ensure live rows outrank non-live rows visually
- render deterministic fallback text when live scores are unavailable and when live status fetch fails

Checkpoint:

- live picks are immediately obvious when present

### Step 4: Replace the Remaining Card Grid

Files:

- `app/entry/[id]/page.tsx`
- `lib/pick10/presentation.ts`

Tasks:

- replace the current two-column card grid with grouped compact rows
- surface wins, points, projected max, and remaining upside inline
- reduce the visual weight of eliminated picks

Checkpoint:

- the page is shorter and easier to scan on mobile

### Step 5: Responsive and Verification Pass

Files:

- `app/entry/[id]/page.tsx`
- `lib/pick10/presentation.ts`

Tasks:

- verify layout under long names and multiple live picks
- verify color is not the only status signal
- verify back navigation and freshness states
- smoke-test homepage after shared-helper changes

Checkpoint:

- the entry page works across quiet and live states without homepage regressions

## Review Gates

1. After Step 1: data contract and tests
2. After Step 2: compact summary layer
3. After Step 3: live picks section
4. After Step 4: grouped compact rows
5. After Step 5: responsive and verification polish

## Verification

Required commands:

- `npm run test`
- `npm run build`
- run targeted eslint on touched files if repository-wide lint remains noisy

Required manual checks:

- entry with no live teams
- entry with live picks
- entry with all picks eliminated
- entry with long team names
- entry with null sync state
- homepage smoke test after shared scoring changes
- entry route with unknown id (`notFound`) still behaves correctly
- rank tie display consistency with homepage semantics

## Explicit Non-Goals

- redesigning homepage again
- building comparison mode between entries
- adding modal or accordion interactions for team rows
- changing scoring logic
