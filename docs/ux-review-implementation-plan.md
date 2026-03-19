# Homepage UX Refresh Implementation Plan

## Purpose

Implement the homepage redesign described in `docs/ux-review-brief.md` while closing the key gaps identified in review:

- preserve recognizable pick visibility on the homepage
- make rank and tie behavior explicit before styling a leader state
- keep freshness and trust signaling in a compact form
- make live game context prominent without relying on color alone

## Scope

In scope:

- homepage layout and interaction changes
- homepage-specific derived data added to scoring helpers
- shared presentation helpers needed for compact labels and accessible state text

Out of scope:

- entry detail layout redesign
- admin layout redesign
- article pages
- database schema changes
- caching or revalidation strategy changes beyond minor UI-friendly formatting

Smoke tests required because of shared helpers:

- entry detail page
- admin page

## Resolved Product Decisions

1. The homepage stays standings-first, but picks remain recognizable through compact chips rather than unlabeled dots.
2. Compact pick chips use assigned number plus team name, e.g. `#4 Duke`. Chips stay in pick-order and eliminated teams recede visually.
3. Row order remains `totalPoints`, then `projectedMax`, then `name`.
4. Displayed rank ties on `totalPoints` only. `projectedMax` breaks visual order within a shared rank but does not create a different displayed rank.
5. A singular leader treatment is only allowed when one entry has the highest `totalPoints`. If multiple entries share the top score, use a shared-top treatment and no singular `Leader` label.
6. The separate top-three module is removed entirely. The leaderboard becomes the only standings surface.
7. Live context is grouped by game, not by entry. The homepage should reflect how people track live sports first, then show impacted entries as supporting context.
8. Live UI uses a snapshot-level `liveGames[]` list plus a per-entry `hasLiveGame` flag. Scheduled or "up next" treatments are deferred for this pass.
9. The live section uses compact horizontally scrollable cards on mobile so it does not consume the full first viewport during busy slates.
10. The compact header keeps freshness visible. A small client freshness component can render relative time while preserving the absolute timestamp for accessibility.
11. The sticky site nav stays as-is. The homepage keeps a low-emphasis admin text link inside the compact header rather than moving admin into site nav.
12. Leaderboard rows remain full links to `/entry/[id]`. Chips are non-interactive in v1, and row expansion is explicitly deferred.
13. The homepage continues using `force-dynamic` for this pass. Performance or caching changes are a separate follow-up if needed.

## UX Targets

1. On mobile, the start of the leaderboard should be visible in the first viewport in the normal no-live state.
2. Users should be able to identify an entry's picks without opening the detail page.
3. Users should be able to see which tracked games are live, the opponent, the score, and the clock/detail without scanning every leaderboard row.
4. Users should be able to tell whether the board is current from a compact freshness cue.
5. Dense rows should remain legible and comfortably tappable on small screens.
6. No critical state should depend on color alone or on hover-only `title` text.

## Implementation Approach

### Phase 1: Shared Data and Ranking Semantics

Files:

- `lib/pick10/espn.ts`
- `lib/pick10/scoring.ts`
- `lib/pick10/presentation.ts`
- `lib/pick10/scoring.test.ts`
- `lib/pick10/presentation.test.ts` if new presentation helpers are added

Changes:

- extend live game data with a unique game identifier so homepage live cards can be deduplicated at the game level
- add snapshot-level live game data for the homepage, including:
  - `liveGames[]`
  - a live-data status such as `available` or `unavailable`
- add per-entry homepage flags such as `hasLiveGame`
- codify the chosen display-rank semantics so shared scores produce shared displayed ranks
- add compact label helpers and accessible label helpers for team chips and state tokens
- keep existing admin and detail page label behavior compatible where practical

Acceptance criteria:

- the homepage can render live and non-live states without re-deriving game-level data in `app/page.tsx`
- rank numbers and leader styling cannot contradict each other
- the entry detail and admin pages still render correctly after shared type changes

### Phase 2: Top-of-Page Restructure

Files:

- `app/page.tsx`
- `components/pick10-sync-freshness.tsx` or similar new client component if relative time is implemented as a client island

Changes:

- remove the large hero paragraph and fold the top-three removal into the same refactor
- keep the page title compact and, if retained, hide secondary subtitle copy on mobile
- replace the current hero stats with a compact status strip containing:
  - entry count
  - completed games
  - freshness
  - admin link
- ensure the sticky site nav plus compact header still leave room for the leaderboard start in the first viewport

Acceptance criteria:

- the top section no longer dominates the first mobile viewport
- there is only one standings surface at the top of the page
- freshness remains visible without scrolling

### Phase 3: Live Games Strip

Files:

- `app/page.tsx`
- `lib/pick10/scoring.ts`

Changes:

- render a dedicated live section above the leaderboard when `liveGames[]` is non-empty
- group one card per unique live game
- use a horizontally scrollable compact layout on mobile rather than stacked cards
- each live card should show:
  - tracked team and opponent
  - current score
  - clock or short detail
  - impacted entry names when concise, otherwise an impacted-entry count
- distinguish `no live games` from `live data unavailable`
- make the live section an ARIA live region and use a subtle pulse treatment for the live indicator

Acceptance criteria:

- live games are visible without opening entry pages
- the live section does not overwhelm the first viewport during busy slates
- the page degrades gracefully when ESPN live data is unavailable

### Phase 4: Dense Leaderboard Rows

Files:

- `app/page.tsx`
- `lib/pick10/presentation.ts`

Changes:

- convert the current card stack into denser rows
- each row should surface:
  - rank
  - entry name
  - owner or notes if present
  - score
  - projected max
  - alive count
- compact chips should:
  - use `#assignedNumber TeamName`
  - stay in pick order
  - visually dim eliminated teams
  - use stronger emphasis for live teams
- remove the legend once state treatment is self-explanatory
- keep the entire row as the main link target to the detail page
- add a subtle visual accent for a unique leader, and a shared-top treatment when the top score is tied

Acceptance criteria:

- row height is materially smaller on mobile
- picks remain identifiable without opening the detail page
- state remains understandable without relying on the old legend

### Phase 5: Accessibility, Responsive Behavior, and Verification

Files:

- `app/page.tsx`
- `lib/pick10/presentation.ts`
- any new homepage-only components

Changes:

- ensure the live strip, chip labels, and row treatments do not communicate meaning by color alone
- replace hover-only `title` dependency with visible chip text plus `aria-label` support
- verify long entry names, long team names, and fully eliminated entries do not break layout
- verify empty state still reads cleanly after the top-of-page refactor
- smoke-test entry detail and admin pages after shared helper changes

Acceptance criteria:

- compact chips remain understandable on touch devices
- the homepage works in empty, quiet, and busy live-game states
- shared helper changes do not regress entry detail or admin rendering

## Manual Verification Checklist

- homepage empty state with no entries
- homepage with entries but no completed games
- homepage with live tracked games
- homepage with many live games in parallel
- homepage with no live games and successful live-data fetch
- homepage with live-data fetch unavailable fallback
- tie on points with different projected max values
- entry with all teams eliminated
- long entry names and long team names
- entry detail page after shared helper changes
- admin page after shared helper changes
- mobile viewport scan with sticky nav present

## Code Checks

- extend `lib/pick10/scoring.test.ts` for rank semantics
- add presentation-helper tests if new compact label or accessible-label helpers are introduced
- run `npm run test`
- run `npm run lint`

## Risks and Mitigations

- Over-compressing pick chips can hurt comprehension.
  Mitigation: keep visible `#number TeamName` chips and defer pure-dot treatments.
- Shared top scores can make a singular leader treatment misleading.
  Mitigation: use points-only shared ranks and shared-top styling when needed.
- The live section increases the visibility of ESPN latency or failures.
  Mitigation: expose a live-data status and render a graceful fallback instead of silently showing nothing.
- Shared scoring and presentation changes can regress entry detail or admin pages.
  Mitigation: smoke-test both pages and cover helper behavior with unit tests.
- `force-dynamic` plus DB and ESPN work on each request may still feel slow during peak traffic.
  Mitigation: keep fetch strategy unchanged for this pass and revisit performance separately if the refreshed UI exposes a real problem.

## Done When

- the top-three duplication is gone
- the homepage shows standings quickly on mobile
- live games have a dedicated, prominent surface
- rows are denser but still understandable
- pick ownership remains recognizable from the homepage
- rank display, live state, and freshness cues are internally consistent
- the empty state still works
- entry detail and admin pages still work after shared helper changes
- the live section degrades gracefully when live data is unavailable
