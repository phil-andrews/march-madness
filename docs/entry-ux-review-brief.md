# UX Review Brief: Entry Detail Page

## Context

The entry detail page is the place a user lands after tapping an entry from the homepage. During the tournament, especially on mobile, the job of this page is simple: show how one entry is doing right now, which picks matter most, and where the remaining upside lives.

The current page reads more like a static report than a live game-day board. It contains the right raw data, but the layout gives every team equal weight and makes live context too hard to find.
The current implementation also gets entry detail from a shared scoring path derived from homepage snapshot data, so entry-page changes carry real coupling risk with homepage and admin flows.

## Core Problems

### 1. The header lacks leaderboard context
The page header shows the entry name, owner, and a generic explainer paragraph, but it never tells the user where this entry stands in the pool. Current rank, shared-rank state, and freshness are all missing from the top of the page.
Rank semantics should stay consistent with the homepage: displayed rank ties on current points only, while projected max orders entries within a shared rank.

### 2. The summary stats are incomplete and oversized
The three large stat cards show current score, projected max, and alive teams, but omit high-signal summary state such as live picks, eliminated picks, and overall standing. They also consume too much vertical space before the actual team-level information begins.

### 3. Live picks are buried inside uniform cards
If an entry has one or more live teams, the page does not elevate them. The only signal is a small status badge and a muted line of text inside a team card. Users still have to scan all ten picks to find what is happening right now.

### 4. Every team card has the same visual weight
Live teams, upcoming teams, champions, and eliminated teams all render as similarly sized cards in the same grid. This makes the page feel flat. The layout does not prioritize what matters now.

### 5. The team card design is too tall for a 10-pick page
Each team card contains a heading block, a status badge, and a three-box stat grid. Ten cards of that size turn the page into a long scroll, especially on mobile, even when only one or two picks matter in the moment.

### 6. Important computed data is missing from the UI
The data model already includes remaining possible wins, projected max, live opponent details, and more nuanced state, but the page only surfaces a narrow subset of that information. It shows points and projected max, but not the shape of the remaining path.

### 7. The page does not organize picks by state
All picks are displayed in a single undifferentiated grid. There is no “live now”, “still alive”, or “out” structure. That forces users to parse status from each card instead of benefiting from layout-level grouping.
For this pass, those groups should be mutually exclusive: `Live now` for in-progress teams, `Still alive` for alive teams that are not currently live, and `Out` for eliminated teams.

### 8. Navigation is functional but not integrated into the page hierarchy
The back-to-leaderboard button works, but the page does not otherwise reinforce that this entry exists inside a ranked board. Once a user lands here, the pool context largely disappears.

## What We’re Solving First

1. **Add entry-level context** at the top of the page: rank, current score, projected max, alive count, and freshness.
2. **Surface live picks first** with a dedicated “live now” section whenever any tracked team is in progress.
3. **Reduce vertical weight** by replacing the current all-cards-all-the-way layout with denser sections and more compact team treatments.
4. **Expose remaining upside more clearly** so users can see not just points earned, but what each team can still do.
5. **Group picks by state** so the page structure itself communicates priority.
6. **Keep pick order legible** even if the page groups by state rather than presenting one flat list.
7. **Handle live-data failure explicitly** so “no live picks” and “live status unavailable” do not look the same during active game windows.

## Explicit Non-Goals For This Pass

- changing scoring logic
- redesigning the homepage again
- redesigning the admin page
- adding team-level modals or drill-down interactions
- adding comparison views between multiple entries
