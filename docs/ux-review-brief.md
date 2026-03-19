# UX Review Brief: Pick-10 Tracker Homepage

## Context

The Pick-10 tracker is a friend-group March Madness pool board. Users check it dozens of times a day during the tournament, primarily on mobile, often while games are in progress. The current homepage prioritizes chrome and layout over data density and glanceability.

<!--
Review comment:
- The framing is directionally right, but the brief should explicitly preserve one of the product's stated homepage jobs: visible picks.
- Freshness also matters here. Standings come from synced results while live game state is fetched separately at render time, so the redesign should compress trust signals, not remove them.
-->

## Core Problems

### 1. Hero section wastes the first viewport
Three full-width stat bars (entries, completed games, last sync) occupy ~300px of prime mobile real estate before a single name or score is visible. These are secondary metadata, not the reason anyone opens the page.

<!--
Review comment:
- Agree on compression.
- "Last sync" should not disappear entirely. It should move into a compact status strip or inline freshness label so users can still judge whether the board is current.
-->

### 2. Top-3 cards duplicate the leaderboard
The same three entries appear as standalone cards AND as the first three leaderboard rows. Same data rendered twice with no additional insight. On mobile this pushes the full leaderboard below the fold entirely.

<!--
Review comment:
- Agree on removal.
- Before adding a single "leader" treatment in the leaderboard, define tie behavior. Current ordering uses points, then projected max, but displayed rank only ties on points. The redesign should not visually imply a unique leader when rank semantics are ambiguous.
-->

### 3. Team badges are information-poor
Each entry renders 10 badges showing only `#number TeamName` with a status color. The data layer has seed, wins, points, projected max, and live game state for every team — none of it surfaces in the leaderboard row. The badges look busy but communicate almost nothing.

<!--
Review comment:
- This is mostly right, but the proposed fix should not overcorrect into unlabeled dots only.
- The homepage currently helps answer "who has who?" at a glance. A compact redesign still needs recognizable pick identifiers, ideally assigned number plus short name or abbreviation, not just color/state markers.
-->

### 4. Color legend is unnecessary
A full row explaining "yellow = not played, green = advanced, red = eliminated" describes conventions that are self-evident in any sports context. It adds visual noise without reducing confusion.

<!--
Review comment:
- Agree that the legend is expendable.
- The replacement cannot rely on color alone. The state model includes champion, runner-up, live, eliminated, upcoming, and awaiting tip, so the new row design needs a text or icon fallback for touch and accessibility.
-->

### 5. Live game data is buried
`LiveGameState` contains scores, opponent, and game clock — but on the homepage the only signal is a yellow badge color. No score, no opponent, no time. Users have to tap into an entry detail page to see any of it.

<!--
Review comment:
- This overstates the current gap. The homepage already appends live score and game detail to live badges.
- The real issue is prominence, scanability, and grouping. Live context should be surfaced above the leaderboard and in-row with stronger hierarchy, and should likely include scheduled-soon games as well.
-->

### 6. No density or compact view
Every entry row is a full card with stacked stat boxes and wrapping badge rows. A single entry can be 200px+ tall on mobile. With 15+ entries the page becomes an endless scroll with no way to get a quick read.

<!--
Review comment:
- Strong point.
- The implementation should still preserve a path to richer pick detail from the row itself, either through concise inline labels or a secondary expansion pattern, so density does not come at the cost of comprehension.
-->

## What We're Solving First

Redesign the homepage leaderboard with these goals:

1. **Compress the hero** into a single compact bar so standings are visible immediately on mobile
2. **Remove the top-3 card duplication** — let the leaderboard carry the full experience with a subtle rank highlight for the leader
3. **Redesign leaderboard rows for density** — compact rows with inline score, max, alive count, and small visual team indicators (colored dots) instead of full-text badges
4. **Surface live games prominently** — if any picked team is currently playing, show a live section at the top with score and game clock
5. **Replace the color legend with self-documenting visual language** — muted for eliminated, solid for alive, pulsing for live, gold for champion

<!--
Review comment:
- Add two explicit goals:
- Define ranking and tie semantics before styling the leader row.
- Preserve recognizable pick visibility and freshness signaling in the compact layout.
- I would also change goal 3 from "colored dots" to "compact but identifiable pick chips" so the homepage still communicates ownership, not just status.
-->

The entry detail page, admin panel, and articles are out of scope for this pass.

<!--
Review comment:
- Reasonable scope boundary.
- Shared scoring and presentation helpers will still need changes because homepage semantics, rank display, and state tokens are centralized there.
-->
