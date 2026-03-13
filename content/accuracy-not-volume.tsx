import { ReactNode } from 'react';
import StatGrid from '@/components/StatGrid';
import BarChart from '@/components/BarChart';
import Callout from '@/components/Callout';
import DataTable from '@/components/DataTable';
import Divider from '@/components/Divider';

function FindingNum({ n }: { n: number }) {
  return (
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-nora-black text-white text-sm font-bold mr-2">
      {n}
    </span>
  );
}

export default function AccuracyNotVolume() {
  return (
    <>
      <Callout>
        <p className="mb-4 text-base">
          <strong>The Headline:</strong> Shooting a lot of threes has essentially zero correlation with winning basketball games. Shooting threes <em>accurately</em> is one of the strongest predictors of success in the sport. And the single most predictive three-point stat isn't about your offense at all — it's about how well you prevent your opponent from shooting threes. These distinctions matter enormously, and they're usually conflated in popular analysis.
        </p>
      </Callout>

      {/* Finding 1 */}
      <h2 className="text-2xl font-bold mt-12 mb-4 text-nora-black border-b-2 border-nora-border-light pb-2">
        <FindingNum n={1} /> The Volume Trap
      </h2>

      <p className="mb-4 text-base">
        Across nearly 8,000 team-seasons of regular season data (2003-2025), here's how various three-point metrics correlate with winning percentage:
      </p>

      {/* Correlation Bar Chart - custom with gradient greens */}
      <div className="bg-white border border-nora-border-light rounded-lg p-5 my-5">
        <div className="flex items-center my-2">
          <div className="w-36 text-sm text-nora-grey text-right pr-3">3P% Differential</div>
          <div className="flex-1 h-6 bg-gray-100 rounded relative overflow-hidden">
            <div className="h-full rounded flex items-center justify-start pl-2 text-xs text-white font-semibold" style={{ width: '64%', backgroundColor: '#1a6b3c' }}>+0.638</div>
          </div>
        </div>
        <div className="flex items-center my-2">
          <div className="w-36 text-sm text-nora-grey text-right pr-3">Opp 3P% (inverted)</div>
          <div className="flex-1 h-6 bg-gray-100 rounded relative overflow-hidden">
            <div className="h-full rounded flex items-center justify-start pl-2 text-xs text-white font-semibold" style={{ width: '46%', backgroundColor: '#2e7d32' }}>+0.459</div>
          </div>
        </div>
        <div className="flex items-center my-2">
          <div className="w-36 text-sm text-nora-grey text-right pr-3">Own 3P%</div>
          <div className="flex-1 h-6 bg-gray-100 rounded relative overflow-hidden">
            <div className="h-full rounded flex items-center justify-start pl-2 text-xs text-white font-semibold" style={{ width: '45%', backgroundColor: '#27ae60' }}>+0.446</div>
          </div>
        </div>
        <div className="flex items-center my-2">
          <div className="w-36 text-sm text-nora-grey text-right pr-3">3PM per game</div>
          <div className="flex-1 h-6 bg-gray-100 rounded relative overflow-hidden">
            <div className="h-full rounded flex items-center justify-start pl-2 text-xs text-white font-semibold" style={{ width: '23%', backgroundColor: '#7dcea0' }}>+0.230</div>
          </div>
        </div>
        <div className="flex items-center my-2">
          <div className="w-36 text-sm text-nora-grey text-right pr-3">3PA per game</div>
          <div className="flex-1 h-6 bg-gray-100 rounded relative overflow-hidden">
            <div className="h-full rounded flex items-center justify-start pl-2 text-xs text-nora-grey font-semibold" style={{ width: '7%', backgroundColor: '#d5f5e3' }}>+0.065</div>
          </div>
        </div>
        <div className="flex items-center my-2">
          <div className="w-36 text-sm text-nora-grey text-right pr-3">3PA share of FGA</div>
          <div className="flex-1 h-6 bg-gray-100 rounded relative overflow-hidden">
            <div className="h-full rounded flex items-center justify-start pl-2 text-xs text-nora-grey font-semibold" style={{ width: '3%', backgroundColor: '#eafaf1' }}>+0.023</div>
          </div>
        </div>
      </div>

      <p className="mb-4 text-base">
        Read that bottom line again: <strong>three-point attempt share — the stat most associated with "modern basketball analytics" — has a correlation of +0.023 with winning.</strong> That's essentially zero. Teams that build their identity around shooting threes don't win more games than teams that don't.
      </p>

      <p className="mb-4 text-base">
        But three-point <em>percentage</em> (+0.446) and three-point percentage <em>differential</em> (+0.638) are among the strongest predictors of success in the sport, trailing only overall point differential (+0.944).
      </p>

      <Callout variant="blue">
        <p className="mb-4 text-base">
          <strong>The distinction:</strong> Shooting threes well matters enormously. Shooting lots of threes barely matters at all. This is the equivalent of saying "having good investments makes you wealthy" while "making lots of investments" tells you almost nothing about your returns. Quality over quantity.
        </p>
      </Callout>

      {/* Finding 2 */}
      <h2 className="text-2xl font-bold mt-12 mb-4 text-nora-black border-b-2 border-nora-border-light pb-2">
        <FindingNum n={2} /> The Quintile Staircase
      </h2>

      <p className="mb-4 text-base">
        Breaking teams into quintiles makes the pattern even clearer.
      </p>

      {/* Two-Column Quintile Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-5">
        <div className="bg-white border border-nora-border-light rounded-lg p-5">
          <h3 className="text-lg font-bold mb-3 text-nora-black">By 3P% (Accuracy)</h3>
          <DataTable
            headers={['Quintile', 'Avg 3P%', 'Win%']}
            rows={[
              ['Q1 (worst)', '30.3%', <span key="q1a" className="text-accent-red font-semibold">37.5%</span>],
              ['Q2', '32.7%', '44.4%'],
              ['Q3', '34.2%', '50.3%'],
              ['Q4', '35.7%', '54.0%'],
              ['Q5 (best)', '38.2%', <span key="q5a" className="text-accent-green font-semibold">60.8%</span>],
            ]}
          />
          <p className="text-sm text-nora-grey mt-2">
            23 percentage points of win rate separate top from bottom quintile.
          </p>
        </div>
        <div className="bg-white border border-nora-border-light rounded-lg p-5">
          <h3 className="text-lg font-bold mb-3 text-nora-black">By 3PA Share (Volume)</h3>
          <DataTable
            headers={['Quintile', 'Avg Share', 'Win%']}
            rows={[
              ['Q1 (fewest)', '27.3%', '48.5%'],
              ['Q2', '31.9%', '49.3%'],
              ['Q3', '34.9%', '49.4%'],
              ['Q4', '38.0%', '50.1%'],
              ['Q5 (most)', '43.4%', '49.8%'],
            ]}
          />
          <p className="text-sm text-nora-grey mt-2">
            1.3 percentage points separate top from bottom. Essentially flat.
          </p>
        </div>
      </div>

      <p className="mb-4 text-base">
        The accuracy quintiles show a clean, linear staircase: each step up in three-point shooting quality adds about 6 points of win percentage. The volume quintiles are a flat line — Q1 through Q5 all hover between 48.5% and 50.1%. <strong>How many threes you shoot simply doesn't predict whether you win.</strong>
      </p>

      {/* Finding 3 */}
      <h2 className="text-2xl font-bold mt-12 mb-4 text-nora-black border-b-2 border-nora-border-light pb-2">
        <FindingNum n={3} /> In Tournament Games: The Same Story at Higher Stakes
      </h2>

      <p className="mb-4 text-base">
        In 1,382 tournament games (2003-2024), we can look at this game by game:
      </p>

      <StatGrid
        stats={[
          { value: '70.5%', label: 'Team with higher 3P%\nwins the tournament game', color: 'green' },
          { value: '58.8%', label: 'Team with more 3PM\nwins the tournament game', color: 'blue' },
          { value: '38.8%', label: 'Team with more 3PA\nwins the tournament game', color: 'red' },
        ]}
      />

      <p className="mb-4 text-base">
        The team that shoots better from three wins 70.5% of tournament games — one of the most powerful single-game predictors available. But the team that <em>attempts</em> more threes actually <em>loses</em> 61.2% of the time. Volume isn't just uncorrelated with winning — in tournament games, it's negatively correlated.
      </p>

      <Callout variant="amber">
        <p className="mb-4 text-base">
          <strong>Why?</strong> Two reasons. First, trailing teams tend to jack up threes trying to catch up, inflating their attempt count in losses. Second, and more fundamentally, a team that takes a lot of threes is often a team that can't get good looks inside — they're being forced into difficult perimeter shots by a good defense. High three-point volume can be a symptom of offensive dysfunction, not a strategy choice.
        </p>
      </Callout>

      {/* Finding 4 */}
      <h2 className="text-2xl font-bold mt-12 mb-4 text-nora-black border-b-2 border-nora-border-light pb-2">
        <FindingNum n={4} /> The Full Stat Hierarchy in Tournament Games
      </h2>

      <p className="mb-4 text-base">
        How does three-point shooting compare to other stats in predicting tournament game margins?
      </p>

      <DataTable
        headers={['Stat Differential (Winner - Loser)', 'Correlation with Score Margin']}
        rows={[
          [<strong key="fg">Overall FG% gap</strong>, <span key="fgv" className="text-accent-green font-semibold">+0.620</span>],
          [<strong key="2p">2P% gap</strong>, <span key="2pv" className="text-accent-green font-semibold">+0.443</span>],
          [<strong key="rb">Total rebound gap</strong>, <span key="rbv" className="text-accent-green font-semibold">+0.413</span>],
          ['3P% gap', '+0.323'],
          ['3PM gap (made threes)', '+0.313'],
          ['Turnover gap', '+0.116'],
          ['Offensive rebound gap', '+0.111'],
        ]}
      />

      <p className="mb-4 text-base">
        Three-point percentage matters (+0.323), but in tournament games, <strong>two-point accuracy (+0.443) and rebounding (+0.413) are both more predictive of scoring margin than three-point shooting.</strong> Overall field goal percentage (+0.620) dominates everything — which makes sense, as it captures both two-point and three-point efficiency in a single number.
      </p>

      {/* Finding 5 */}
      <h2 className="text-2xl font-bold mt-12 mb-4 text-nora-black border-b-2 border-nora-border-light pb-2">
        <FindingNum n={5} /> Defense Wins Championships (From Three)
      </h2>

      <p className="mb-4 text-base">
        One of the strongest findings is that three-point <em>defense</em> correlates with winning almost as strongly as three-point offense — and may matter more in the tournament.
      </p>

      <DataTable
        headers={['Opponent 3P% Allowed (Quintile)', 'Avg Opp 3P%', 'Regular Season Win%']}
        rows={[
          [
            'Q1 — Best 3PT defense',
            '30.9%',
            <span key="d1" className="text-accent-green font-semibold">61.3%</span>,
          ],
          ['Q2', '33.1%', '54.6%'],
          ['Q3', '34.3%', '49.4%'],
          ['Q4', '35.6%', '45.1%'],
          [
            'Q5 — Worst 3PT defense',
            '37.8%',
            <span key="d5" className="text-accent-red font-semibold">36.8%</span>,
          ],
        ]}
      />

      <p className="mb-4 text-base">
        Teams that hold opponents to 30.9% from three win 61.3% of their games. Teams that allow 37.8% win only 36.8%. The 24.5 percentage point spread is actually <em>larger</em> than the spread from your own three-point accuracy (23.3 points). The correlation of opponent three-point percentage with winning (-0.459) is slightly higher in absolute value than your own three-point percentage (+0.446).
      </p>

      <Callout>
        <p className="mb-2 text-base font-semibold">
          Three-point defense is at least as important as three-point offense.
        </p>
        <p className="mb-4 text-base">
          This is the most underappreciated finding in the data. The conversation around three-pointers almost always focuses on the offensive side — how many should you shoot, who's your best shooter. But the defensive side of the equation is equally predictive of winning. A team that can suppress opponent three-point shooting has a larger competitive advantage than a team that shoots well from three itself.
        </p>
      </Callout>

      {/* Finding 6 */}
      <h2 className="text-2xl font-bold mt-12 mb-4 text-nora-black border-b-2 border-nora-border-light pb-2">
        <FindingNum n={6} /> The Tournament Paradox: 3PT Accuracy Matters Less for Underdogs
      </h2>

      <p className="mb-4 text-base">
        When we control for seed and look at how regular season three-point shooting predicts tournament success, a fascinating split emerges:
      </p>

      <DataTable
        headers={['Seed Tier', 'Above-Median 3P% Advantage', 'Above-Median 3P% Diff Advantage']}
        rows={[
          [
            <strong key="s1">1-4 seeds</strong>,
            <span key="s1a" className="text-accent-green font-semibold">+0.19 wins</span>,
            <span key="s1d" className="text-accent-green font-semibold">+0.24 wins</span>,
          ],
          [
            <strong key="s2">5-8 seeds</strong>,
            <span key="s2a" className="text-accent-green font-semibold">+0.23 wins</span>,
            <span key="s2d" className="text-nora-grey">-0.01 wins</span>,
          ],
          [
            <strong key="s3">9-12 seeds</strong>,
            <span key="s3a" className="text-nora-grey">-0.01 wins</span>,
            <span key="s3d" className="text-accent-red font-semibold">-0.14 wins</span>,
          ],
        ]}
      />

      <p className="mb-4 text-base">
        For top seeds (1-4), regular season three-point accuracy translates clearly into tournament success — the better shooters win about a quarter of a game more on average. But for lower seeds (9-12), three-point accuracy has <em>zero predictive value</em> for tournament wins. And three-point differential actually goes <em>negative</em> — lower seeds with the best three-point differentials actually win fewer tournament games.
      </p>

      <Callout variant="purple">
        <p className="mb-4 text-base">
          <strong>The economic explanation:</strong> For favorites, three-point accuracy is a <em>skill signal</em> — it reflects genuine shooting talent that translates across contexts. For underdogs, regular season three-point numbers are less reliable because they were compiled against weaker competition. An 11-seed that shoots 39% from three in the Mountain West may shoot 31% against a Big Ten defense. The "three-point accuracy premium" is, for underdogs, partially an artifact of schedule strength — it evaporates when the competition level rises in March.
        </p>
        <p className="mb-4 text-base">
          This connects back to our variance finding: underdogs don't win in March because they shoot threes <em>well</em>. They win because they shoot threes at all, creating variance that occasionally swings in their favor. Their regular season percentages don't predict which underdogs will get hot — because getting hot from three is largely random.
        </p>
      </Callout>

      {/* Finding 7 */}
      <h2 className="text-2xl font-bold mt-12 mb-4 text-nora-black border-b-2 border-nora-border-light pb-2">
        <FindingNum n={7} /> The Correlation Has Been Remarkably Stable
      </h2>

      <p className="mb-4 text-base">
        Has the relationship between three-point shooting and winning changed as the game has evolved?
      </p>

      <DataTable
        headers={['Era', '3P% <> Win%', '3PA Share <> Win%', '3P% Diff <> Win%']}
        rows={[
          [
            '2003-2009',
            '+0.471',
            <span key="e1v" className="text-nora-grey">+0.013</span>,
            '+0.628',
          ],
          [
            '2010-2016',
            '+0.444',
            <span key="e2v" className="text-nora-grey">+0.001</span>,
            '+0.634',
          ],
          [
            '2017-2025',
            '+0.432',
            <span key="e3v" className="text-nora-grey">+0.050</span>,
            '+0.650',
          ],
        ]}
      />

      <p className="mb-4 text-base">
        Three-point accuracy's correlation with winning has been stable around +0.44 to +0.47 for two decades. Three-point volume's non-correlation has been stable around zero for the same period. The three-point revolution hasn't changed <em>what</em> predicts winning — it's just changed how many threes everyone shoots while the fundamental relationship holds steady.
      </p>

      <p className="mb-4 text-base">
        If anything, the three-point percentage differential has gotten <em>slightly more</em> predictive over time (+0.628 to +0.650), suggesting that as every team shoots more threes, the ability to be better than your opponent from three has become marginally more important.
      </p>

      {/* Finding 8 */}
      <h2 className="text-2xl font-bold mt-12 mb-4 text-nora-black border-b-2 border-nora-border-light pb-2">
        <FindingNum n={8} /> The Complete Picture
      </h2>

      <Callout variant="blue">
        <p className="mb-4 text-base">
          <strong>The three-point paradox in one sentence:</strong> The basketball world spent 20 years convincing itself to shoot more threes, but the data says the teams that win are the ones that shoot threes <em>accurately</em> and, perhaps more importantly, <em>prevent their opponents from doing so</em> — regardless of how many they take.
        </p>
        <p className="mb-4 text-base">
          This maps to a recurring economics theme in our analysis: <strong>the market adopted the right general insight (threes are valuable) but implemented it with the wrong lever (volume instead of efficiency).</strong> It's like a firm that hears "innovation drives growth" and responds by filing more patents instead of filing <em>better</em> patents. The metric that matters was always quality, not quantity.
        </p>
      </Callout>

      <Divider />

      <p className="text-sm text-nora-grey mt-10">
        <strong>Data:</strong> Kaggle March Machine Learning Mania dataset. Regular season: 7,978 team-seasons (2003-2025, min 10 games per team-season). Tournament: 1,382 games with detailed box scores (2003-2024), 1,472 tournament team-seasons. Correlations are Pearson coefficients. Tournament wins = wins in the NCAA tournament field of 68 (0-6). Quintiles computed by sorting all team-season observations on the relevant metric and dividing into equal groups.
      </p>
    </>
  );
}
