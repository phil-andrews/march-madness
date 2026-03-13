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

export default function HiddenCostOfMiss() {
  return (
    <>
      <Callout>
        <p className="mb-4 text-base">
          <strong>The Question:</strong> Does the amount of time the ball is in the air matter to three-point strategy? We can't measure flight time directly from box scores. But we can measure what flight time <em>causes</em> — a fundamentally different rebound when the shot misses. A three-pointer travels farther, hits the rim at a different angle, and produces a longer, more chaotic rebound. That physics reality shows up clearly in the data, and it changes the economics of the three-pointer significantly.
        </p>
      </Callout>

      {/* Finding 1 */}
      <h2 className="text-2xl font-bold mt-12 mb-4 text-nora-black border-b-2 border-nora-border-light pb-2">
        <FindingNum n={1} /> The Relationship Is Unmistakable
      </h2>

      <p className="mb-4 text-base">
        We split every team-game performance in the dataset (~237,000 data points across 23 seasons) into quintiles by how three-point heavy the team was in that game. The relationship between three-point volume and offensive rebounding is stark and monotonic:
      </p>

      <DataTable
        headers={['3PA Share Quintile', 'Avg 3PA Share', 'Offensive Rebounds per Miss', 'Avg OReb per Game']}
        rows={[
          [
            'Q1 — Fewest threes',
            '21.9%',
            <span key="q1" className="text-accent-green font-semibold">0.363</span>,
            '11.3',
          ],
          ['Q2', '29.6%', '0.342', '10.9'],
          ['Q3', '34.8%', '0.328', '10.5'],
          ['Q4', '40.1%', '0.313', '10.0'],
          [
            'Q5 — Most threes',
            '49.3%',
            <span key="q5" className="text-accent-red font-semibold">0.290</span>,
            '9.3',
          ],
        ]}
      />

      <p className="mb-4 text-base">
        Teams in the bottom quintile of three-point usage recover 36.3% of their misses as offensive rebounds. Teams in the top quintile recover just 29.0%. That's a 20% drop in offensive rebound efficiency — a gap of 2 full offensive rebounds per game. The Pearson correlation is -0.24, which is strong for a single-variable relationship in a noisy game-level dataset.
      </p>

      <Callout variant="blue">
        <p className="mb-4 text-base">
          <strong>Why this happens (the physics):</strong> A three-pointer travels roughly 22-24 feet to the basket. A two from the paint travels 4-8 feet. The longer flight distance means a higher arc and more energy at impact. Missed threes bounce harder and farther off the rim — they tend to ricochet out to the perimeter where defenders, not offensive players, are positioned. A missed layup or mid-range jumper produces a shorter, softer rebound that stays near the basket where offensive rebounders can grab it. The ball's time in the air is the root cause; the rebound geography is the economic consequence.
        </p>
      </Callout>

      {/* Finding 2 */}
      <h2 className="text-2xl font-bold mt-12 mb-4 text-nora-black border-b-2 border-nora-border-light pb-2">
        <FindingNum n={2} /> The Same Pattern Holds in Tournament Games
      </h2>

      <p className="mb-4 text-base">
        This isn't just a regular season phenomenon. In 1,382 tournament games (2003-2024):
      </p>

      <DataTable
        headers={['3PA Share Quartile', 'Avg 3PA Share', 'OReb per Miss', 'Avg OReb / Game']}
        rows={[
          [
            'Q1 — Fewest threes',
            '22.7%',
            <span key="tq1" className="text-accent-green font-semibold">0.357</span>,
            '11.3',
          ],
          ['Q2', '31.3%', '0.330', '10.7'],
          ['Q3', '37.6%', '0.313', '10.0'],
          [
            'Q4 — Most threes',
            '47.2%',
            <span key="tq4" className="text-accent-red font-semibold">0.299</span>,
            '9.8',
          ],
        ]}
      />

      <p className="mb-4 text-base">
        The gradient is nearly identical. From lowest to highest three-point quartile, offensive rebound recovery drops from 35.7% to 29.9% — a loss of about 1.5 offensive rebounds per game. In March Madness, where games are decided by an average of 11.7 points, 1.5 extra possessions is meaningful.
      </p>

      {/* Finding 3 */}
      <h2 className="text-2xl font-bold mt-12 mb-4 text-nora-black border-b-2 border-nora-border-light pb-2">
        <FindingNum n={3} /> The Corrected Expected Value
      </h2>

      <p className="mb-4 text-base">
        This is where it gets interesting for the economic story. The standard EV calculation everyone uses is simple:
      </p>

      {/* Standard EV Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-5">
        <div className="bg-white border border-nora-border-light rounded-lg p-5 text-center">
          <div className="text-xl font-bold text-accent-blue mb-1">Standard EV (Three)</div>
          <div className="text-sm text-nora-grey font-mono">3P% x 3</div>
          <div className="text-sm text-nora-grey font-mono">34.2% x 3</div>
          <div className="text-3xl font-bold text-accent-blue mt-2">1.025</div>
        </div>
        <div className="bg-white border border-nora-border-light rounded-lg p-5 text-center">
          <div className="text-xl font-bold text-orange-500 mb-1">Standard EV (Two)</div>
          <div className="text-sm text-nora-grey font-mono">2P% x 2</div>
          <div className="text-sm text-nora-grey font-mono">49.8% x 2</div>
          <div className="text-3xl font-bold text-orange-500 mt-2">0.997</div>
        </div>
      </div>

      <p className="mb-4 text-base text-center text-nora-grey italic -mt-2">
        Standard calculation shows a +0.028 advantage for the three (2017-2024 era)
      </p>

      <p className="mb-4 text-base">
        But this calculation treats a miss as a dead ball — worth zero. In reality, a miss produces a rebound, and some percentage of the time, you get that rebound back. The value of that second chance depends on what kind of shot you missed.
      </p>

      <p className="mb-4 text-base">
        Using a linear regression on 237,000+ game observations, we estimate that a missed two-pointer has roughly a 34.1% chance of becoming an offensive rebound, while a missed three-pointer has roughly an 18.6% chance. At approximately 1.0 points per possession in college basketball, the <strong>rebound-adjusted</strong> EV looks very different:
      </p>

      {/* Adjusted EV Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-5">
        <div className="bg-white border-2 border-accent-red rounded-lg p-5 text-center">
          <div className="text-xl font-bold text-accent-blue mb-1">Adjusted EV (Three)</div>
          <div className="text-sm text-nora-grey font-mono">3P% x 3 + miss% x OR_rate x PPP</div>
          <div className="text-sm text-nora-grey font-mono">34.2% x 3 + 65.8% x 18.6% x 1.0</div>
          <div className="text-3xl font-bold text-accent-blue mt-2">1.147</div>
        </div>
        <div className="bg-white border-2 border-accent-green rounded-lg p-5 text-center">
          <div className="text-xl font-bold text-orange-500 mb-1">Adjusted EV (Two)</div>
          <div className="text-sm text-nora-grey font-mono">2P% x 2 + miss% x OR_rate x PPP</div>
          <div className="text-sm text-nora-grey font-mono">49.8% x 2 + 50.2% x 34.1% x 1.0</div>
          <div className="text-3xl font-bold text-orange-500 mt-2">1.168</div>
        </div>
      </div>

      <p className="mb-4 text-base text-center text-nora-grey italic -mt-2">
        Rebound-adjusted calculation shows a <strong>-0.021</strong> advantage for the <em>two</em>
      </p>

      <Callout variant="red">
        <p className="mb-2 text-base font-semibold">
          The rebound adjustment swings the EV gap by 0.049 points against the three.
        </p>
        <p className="mb-4 text-base">
          What the standard calculation shows as a +0.028 advantage for the three-pointer becomes a -0.021 advantage for the two-pointer once you account for the different rebound economics. The three-pointer's "free money" was never as free as the simple math suggested — every miss carries a hidden cost in lost second-chance opportunities.
        </p>
      </Callout>

      {/* Finding 4 */}
      <h2 className="text-2xl font-bold mt-12 mb-4 text-nora-black border-b-2 border-nora-border-light pb-2">
        <FindingNum n={4} /> 2025: The Gap Is Even Wider Than It Looks
      </h2>

      <p className="mb-4 text-base">
        Our previous report showed that 2025 is the first year the <em>simple</em> EV inverted (threes became less efficient than twos). The rebound adjustment makes it worse:
      </p>

      <StatGrid
        stats={[
          { value: '-0.005', label: '2025 EV gap\n(standard calculation)', color: 'default' },
          { value: '-0.049', label: '2025 EV gap\n(rebound-adjusted)', color: 'red' },
        ]}
      />

      <p className="mb-4 text-base">
        The standard calculation says the three-pointer is barely negative in 2025 — a rounding error. The rebound-adjusted calculation says it's nearly 5 cents per shot worse. Over the course of a game with 23 three-point attempts, that's roughly 1.1 hidden points of expected value being left on the table per game — on top of the points already lost from the raw efficiency gap.
      </p>

      {/* Finding 5 */}
      <h2 className="text-2xl font-bold mt-12 mb-4 text-nora-black border-b-2 border-nora-border-light pb-2">
        <FindingNum n={5} /> The Offensive Rebound Collapse of 2021
      </h2>

      <p className="mb-4 text-base">
        The year-over-year data reveals a second story hiding in the rebound numbers — one that has nothing to do with three-pointers.
      </p>

      <BarChart
        title="Offensive Rebounds per Miss, by Season"
        rows={[
          { label: '2003', value: '0.373', width: 93, color: 'green' },
          { label: '2006', value: '0.375', width: 94, color: 'green' },
          { label: '2009', value: '0.362', width: 91, color: 'green' },
          { label: '2012', value: '0.354', width: 89, color: 'blue' },
          { label: '2015', value: '0.343', width: 86, color: 'blue' },
          { label: '2018', value: '0.312', width: 78, color: 'orange' },
          { label: '2019', value: '0.308', width: 77, color: 'orange' },
          { label: '2021', value: '0.257', width: 64, color: 'red' },
          { label: '2022', value: '0.257', width: 64, color: 'red' },
          { label: '2023', value: '0.260', width: 65, color: 'red' },
          { label: '2024', value: '0.264', width: 66, color: 'red' },
          { label: '2025', value: '0.270', width: 68, color: 'red' },
        ]}
      />

      <p className="mb-4 text-base">
        There are two distinct eras in the data. From 2003 to 2019, offensive rebounding declined gradually from 0.373 to 0.308 — a decline largely explained by the rising three-point share. Then in 2021, it fell off a cliff to 0.257 and has barely recovered.
      </p>

      <p className="mb-4 text-base">
        When we build a regression model on 2003-2019 data (predicting OR/miss from 3PA share), the 2021-2025 seasons show residuals of -0.055 to -0.060. That means roughly half the post-2020 decline is <em>not</em> explained by three-point volume — something structural changed.
      </p>

      <Callout variant="amber">
        <p className="mb-4 text-base">
          <strong>The likely culprit: rule changes.</strong> The NCAA has made several adjustments to discourage offensive rebounding and speed up play, including changes to the shot clock reset rules after offensive rebounds (resetting to 20 seconds instead of a full 30). This reduces the incentive to crash the offensive glass, since you have less time to run a quality set after getting the rebound. The decline in total rebounds per game (from ~35 to ~31.5) confirms this isn't just about three-pointers — it's a game-wide structural shift.
        </p>
        <p className="mb-4 text-base">
          From an economics lens, this is a <strong>regulatory intervention</strong> in the market. The NCAA changed the rules (the regulatory environment), which changed the incentive structure (less reward for offensive rebounding), which changed behavior (fewer offensive rebounds), which inadvertently affected the three-point calculus (the rebound penalty for shooting threes is smaller when nobody is offensive rebounding anyway).
        </p>
      </Callout>

      {/* Finding 6 */}
      <h2 className="text-2xl font-bold mt-12 mb-4 text-nora-black border-b-2 border-nora-border-light pb-2">
        <FindingNum n={6} /> What This Means for the Three-Point Story
      </h2>

      <p className="mb-4 text-base">
        This rebound analysis adds three dimensions to our previous three-point economics report:
      </p>

      <p className="mb-4 text-base">
        <strong>First, the arbitrage was never as large as the simple math suggested.</strong> For 20 years, analysts and coaches have used 3P% x 3 vs 2P% x 2 to argue that teams should shoot more threes. That calculation ignores the rebound externality. When you miss a three, you're not just scoring zero — you're also less likely to get the ball back. The "free money" on the three-point line always had a hidden transaction cost.
      </p>

      <p className="mb-4 text-base">
        <strong>Second, the correction happened faster than the simple numbers show.</strong> If the rebound-adjusted EV has favored two-pointers for most of the dataset period (or at least been much closer to neutral), then the market wasn't slowly correcting toward efficiency — it was <em>overshooting</em>. Teams were piling into threes based on incomplete math while the true edge was already gone.
      </p>

      <p className="mb-4 text-base">
        <strong>Third, the rebound cost partially explains why three-point reliance doesn't predict deep tournament runs.</strong> Our previous report showed that Final Four and Championship teams actually have <em>below-average</em> three-point attempt rates. The rebound cost is one mechanism: over a six-game tournament gauntlet, the 1.5 offensive rebounds per game you forfeit by being three-heavy compounds into 9 lost second-chance opportunities. That's 9 possessions over the tournament that a more balanced team would have had.
      </p>

      <Callout variant="purple">
        <p className="mb-4 text-base">
          <strong>The complete economic picture:</strong> The three-pointer in college basketball is an asset with three distinct properties that the standard analysis conflates:
        </p>
        <p className="mb-2 text-base">
          1. <strong>The expected value</strong> (3P% x 3 vs 2P% x 2) — which has converged to roughly neutral and inverted in 2025.
        </p>
        <p className="mb-2 text-base">
          2. <strong>The rebound externality</strong> — which makes threes about 0.05 points per attempt worse than the standard calculation suggests.
        </p>
        <p className="mb-2 text-base">
          3. <strong>The variance premium</strong> — which makes threes uniquely valuable for underdogs in single-elimination play, independent of the EV.
        </p>
        <p className="mb-4 text-base">
          A complete strategy has to weigh all three. The three-pointer is a high-variance, negative-externality asset that still has strategic value in the right context — much like an out-of-the-money option that's slightly overpriced but worth buying for portfolio insurance.
        </p>
      </Callout>

      <h3 className="text-lg font-bold mt-7 mb-3 text-nora-black">A Note on Methodology</h3>

      <p className="mb-4 text-base">
        We can't directly observe which rebounds come from which shot types in box score data — that would require play-by-play tracking. Instead, we estimate the relationship through the natural variation in team shooting profiles. Teams that take more threes in a given game systematically recover fewer of their misses, controlling for nothing else. The regression coefficient (-0.154 offensive rebounds per miss for every unit increase in 3PA share) is our best estimate of the marginal rebound cost of a three-point attempt. The true number may differ somewhat from this estimate, but the direction and approximate magnitude are robust across regular season and tournament data, across eras, and across different analytical approaches.
      </p>

      <Divider />

      <p className="text-sm text-nora-grey mt-10">
        <strong>Data:</strong> Kaggle March Machine Learning Mania dataset. Regular season detailed results: 2003-2025 (~118,800 games, ~237,600 team-game observations). Tournament detailed results: 2003-2024 (1,382 games). Offensive rebound rate = OR / (FGA - FGM). 3PA share = FGA3 / FGA. Linear regression: OR_rate = 0.341 - 0.154 x 3PA_share (fitted on 2017-2025 data). Points per possession assumed at 1.0 based on D1 averages.
      </p>
    </>
  );
}
