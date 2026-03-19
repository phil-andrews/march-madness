# Entry Detail UX Refresh Implementation Plan

## Purpose

Refresh the entry detail page so it answers three questions quickly:

1. Where does this entry stand right now?
2. Which picks matter right now?
3. Where is the remaining upside?

## Scope

In scope:

- entry detail page layout and information hierarchy
- entry-detail-specific derived data added to scoring helpers
- shared presentation helpers needed for compact team state and accessible labels

Out of scope:

- homepage redesign changes
- admin redesign
- scoring rules or database schema changes
- new client-side interactions beyond reusing the existing small freshness component

## Resolved Product Decisions

1. The entry page should show rank context at the top using the existing `displayRank`.
2. The page should keep the “back to leaderboard” path, but the header should also make the pool context visible without navigation.
3. Picks should be grouped by state:
   - `Live now`
   - `Still alive`
   - `Out`
   - `Live now`: `liveGame.state === "in_progress"`
   - `Still alive`: `isAlive === true` and not currently live
   - `Out`: `isAlive === false`
4. Pick order remains visible within each section through the `Pick N` label and assigned number.
5. The page should surface remaining upside explicitly via remaining possible wins or equivalent “wins left” language.
6. Live picks get the highest visual emphasis and should appear before all other picks.
7. Compact rows, not large cards, are the default treatment for non-live picks.
8. Champion and runner-up states stay visible through state tokens and labeling, but do not require their own dedicated page section in v1.
9. The page should show freshness in the summary layer by reusing the same relative-time component as the homepage.
10. The detail page must distinguish `liveDataStatus === "unavailable"` from a true no-live state.

## UX Targets

1. A user should be able to identify the entry’s current standing without scrolling.
2. If the entry has a live pick, that pick should be visible immediately near the top of the page.
3. Non-live picks should still be identifiable, but should not consume the same vertical weight as live picks.
4. Users should be able to understand both current output and remaining upside from the summary and team rows.
5. The page should remain comfortable to scan on mobile with all 10 picks present.

## Implementation Approach

### Phase 1: Extend Entry Detail Data

Files:

- `lib/pick10/scoring.ts`
- `lib/pick10/scoring.test.ts`

Changes:

- add `getEntryDetailView()` with an entry-detail-specific return shape instead of overloading the current `getEntryDetail()` contract that `/admin` already depends on
- add entry summary counts such as:
  - `liveTeamCount`
  - `eliminatedTeamCount`
  - `upcomingTeamCount`
- expose `lastSyncedAt` and `liveDataStatus` for the detail page
- build grouped arrays for:
  - `liveTeams`
  - `aliveTeams`
  - `eliminatedTeams`
- keep ordering stable within each section by original pick position

Acceptance criteria:

- the entry page can render ranked summary, grouped sections, and freshness without recomputing team state in the page component
- the homepage contract remains intact
- admin edit flow that reads `getEntryDetail()` remains intact
- `liveDataStatus === "unavailable"` produces a distinct detail-page state from a true zero-live-picks state

### Phase 2: Rebuild the Entry Summary Layer

Files:

- `app/entry/[id]/page.tsx`
- `components/pick10-sync-freshness.tsx`

Changes:

- replace the current oversized hero with a compact entry summary
- show:
  - entry name
  - owner if present
  - display rank
  - current score
  - projected max
  - alive count
  - live count when non-zero
  - freshness
- remove the generic explainer paragraph
- keep the back link visible but secondary

Acceptance criteria:

- the first viewport gives immediate entry context
- the page feels connected to the leaderboard, not detached from it

### Phase 3: Add a Live Picks Section

Files:

- `app/entry/[id]/page.tsx`
- `lib/pick10/presentation.ts`

Changes:

- add a dedicated `Live now` section when `liveTeamCount > 0`
- render live picks in a higher-emphasis format than the rest of the page
- each live row should show:
  - pick number
  - assigned number and team name
  - opponent
  - score
  - clock/detail
  - current points and projected max
- when `liveDataStatus === "unavailable"` and `liveTeamCount === 0`, render an explicit notice rather than silently presenting a no-live state

Acceptance criteria:

- live picks can be found without scanning all ten picks
- live rows visibly outrank non-live rows in the layout

### Phase 4: Replace the Uniform Card Grid

Files:

- `app/entry/[id]/page.tsx`
- `lib/pick10/presentation.ts`

Changes:

- replace the current 10-card grid with grouped, denser sections
- use a compact row treatment for `Still alive` and `Out`
- keep visible:
  - pick number
  - assigned number and team name
  - seed
  - status token
  - wins
  - points
  - projected max
  - remaining upside
- visually reduce the weight of eliminated teams

Acceptance criteria:

- the page is materially shorter on mobile
- all picks remain identifiable
- remaining upside is clearer than on the current page

### Phase 5: Accessibility and Responsive Pass

Files:

- `app/entry/[id]/page.tsx`
- `lib/pick10/presentation.ts`

Changes:

- ensure live, upcoming, and eliminated states do not rely on color alone
- add accessible labels to compact team rows
- verify long names and section counts do not break layout
- keep section labels and summary copy concise on mobile

Acceptance criteria:

- the entry page is scannable and accessible on touch devices
- layout remains stable across quiet and live-entry states

## Manual Verification Checklist

- entry with no live teams
- entry with one live team
- entry with multiple live teams
- entry with all teams eliminated
- entry with mostly upcoming teams
- entry with long team names
- entry with owner notes and without owner notes
- back-to-leaderboard navigation
- freshness when `lastSyncedAt` is null
- invalid entry id path returns the intended not-found UX
- rank tie case where points match but projected max differs

## Code Checks

- extend `lib/pick10/scoring.test.ts` for entry-detail grouping and counts
- add presentation-helper tests if new entry-row helpers are introduced
- run `npm run test`
- run targeted eslint for touched files if repository-wide lint is currently noisy
- run `npm run build`

## Risks and Mitigations

- Grouping by state can make pick order feel less obvious.
  Mitigation: preserve `Pick N` labeling within every section.
- Entry detail and homepage both depend on shared scoring helpers.
  Mitigation: use an entry-detail-specific shape rather than overloading the homepage row type further.
- Live sections can become noisy for entries with multiple active teams.
  Mitigation: keep live rows high-signal and compact rather than creating nested cards.

## Done When

- the top of the entry page shows rank context and freshness
- live picks are surfaced before non-live picks
- the page is denser and easier to scan on mobile
- remaining upside is more explicit
- navigation back to the leaderboard remains clear
