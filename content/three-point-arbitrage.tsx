import StatGrid from '@/components/StatGrid';
import BarChart from '@/components/BarChart';
import Callout from '@/components/Callout';
import DataTable from '@/components/DataTable';
import Section from '@/components/Section';
import Divider from '@/components/Divider';

function FindingNum({ n }: { n: number }) {
  return (
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-nora-black text-white text-sm font-bold mr-2">
      {n}
    </span>
  );
}

export default function ThreePointArbitrage() {
  return (
    <>
      <Callout>
        <p className="mb-4 text-base">
          <strong>The Setup:</strong> A three-pointer is worth 50% more than a two-pointer. If you can shoot threes at two-thirds the accuracy of twos, the expected value is identical. Anything better than that ratio and three-pointers are free money. For two decades, college basketball has been running this experiment in real time — and the market is finally approaching efficiency.
        </p>
      </Callout>

      {/* Finding 1 */}
      <h2 className="text-2xl font-bold mt-12 mb-4 text-nora-black border-b-2 border-nora-border-light pb-2">
        <FindingNum n={1} /> The Arbitrage Window: 2003-2025
      </h2>

      <p className="mb-4 text-base">
        For most of the data window, three-point attempts have been an objectively better investment per possession than two-point attempts. But the gap is closing fast.
      </p>

      {/* Era Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
        <div className="bg-white border border-nora-border-light rounded-lg p-4 text-center">
          <div className="font-bold text-lg mb-2 text-nora-black">2003-2009</div>
          <div className="text-sm my-1">3PA/game: <strong>18.4</strong></div>
          <div className="text-sm my-1">3P%: <strong>34.7%</strong></div>
          <div className="text-sm my-1">2P%: <strong>48.2%</strong></div>
          <div className="text-sm my-1">3PT share: <strong>33.3%</strong></div>
          <div className="text-sm mt-2 font-bold text-accent-green">EV gap: +0.077</div>
        </div>
        <div className="bg-white border border-nora-border-light rounded-lg p-4 text-center">
          <div className="font-bold text-lg mb-2 text-nora-black">2010-2016</div>
          <div className="text-sm my-1">3PA/game: <strong>18.5</strong></div>
          <div className="text-sm my-1">3P%: <strong>34.3%</strong></div>
          <div className="text-sm my-1">2P%: <strong>48.0%</strong></div>
          <div className="text-sm my-1">3PT share: <strong>33.4%</strong></div>
          <div className="text-sm mt-2 font-bold text-amber-600">EV gap: +0.071</div>
        </div>
        <div className="bg-white border border-nora-border-light rounded-lg p-4 text-center">
          <div className="font-bold text-lg mb-2 text-nora-black">2017-2024</div>
          <div className="text-sm my-1">3PA/game: <strong>21.6</strong></div>
          <div className="text-sm my-1">3P%: <strong>34.2%</strong></div>
          <div className="text-sm my-1">2P%: <strong>49.8%</strong></div>
          <div className="text-sm my-1">3PT share: <strong>37.5%</strong></div>
          <div className="text-sm mt-2 font-bold text-accent-red">EV gap: +0.028</div>
        </div>
      </div>

      <p className="mb-4 text-base">
        The expected value of a three-point attempt (3P% x 3) vs a two-point attempt (2P% x 2) tells the story. In the early era, every three you shot was worth about 8 cents more per dollar than a two. Teams were leaving money on the table by not shooting more threes. By 2025, the gap has essentially closed to zero.
      </p>

      <Callout variant="blue">
        <p className="mb-4 text-base">
          <strong>2025: The gap inverts.</strong> For the first time in the dataset, the 2025 regular season shows two-point attempts with <em>higher</em> expected value than three-point attempts (1.019 vs 1.014). The three-point share has hit 39% — the highest ever — but accuracy has stayed flat at 33.8%. Meanwhile, two-point efficiency has climbed to 51.0% as defenses stretch to cover the arc. The arbitrage has been fully exploited.
        </p>
      </Callout>

      {/* Finding 2 */}
      <h2 className="text-2xl font-bold mt-12 mb-4 text-nora-black border-b-2 border-nora-border-light pb-2">
        <FindingNum n={2} /> The Expected Value Math
      </h2>

      <p className="mb-4 text-base">
        Here's the simple economics. Each shot is an investment with a known probability of payoff:
      </p>

      {/* EV Comparison Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-5">
        <div className="bg-white border border-nora-border-light rounded-lg p-5 text-center">
          <div className="text-xl font-bold text-accent-blue mb-1">Three-Point Attempt</div>
          <div className="text-sm text-nora-grey font-mono">34.2% x 3 points =</div>
          <div className="text-3xl font-bold text-accent-blue mt-2">1.025 pts</div>
          <div className="text-xs text-nora-grey mt-1">per attempt (2017-2024)</div>
        </div>
        <div className="bg-white border border-nora-border-light rounded-lg p-5 text-center">
          <div className="text-xl font-bold text-orange-500 mb-1">Two-Point Attempt</div>
          <div className="text-sm text-nora-grey font-mono">49.8% x 2 points =</div>
          <div className="text-3xl font-bold text-orange-500 mt-2">0.997 pts</div>
          <div className="text-xs text-nora-grey mt-1">per attempt (2017-2024)</div>
        </div>
      </div>

      <p className="mb-4 text-base">
        A three-pointer needs to be made at only 33.3% to break even with a 50% two-point shooter. College basketball has hovered right around that breakeven point for 20 years — which means the market has been in a slow-motion correction the entire time. Teams that figured this out early (like Villanova, who rode threes to two titles) were exploiting an obvious mispricing.
      </p>

      <h3 className="text-lg font-bold mt-7 mb-3 text-nora-black">The Year-by-Year EV Convergence</h3>

      {/* Year-by-Year Table with Mini Bar Charts */}
      <div className="bg-white border border-nora-border-light rounded-lg p-5 my-5 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-nora-black text-white">
              <th className="p-2 text-left font-semibold">Season</th>
              <th className="p-2 text-left font-semibold">3PA/game</th>
              <th className="p-2 text-left font-semibold">3PT Share</th>
              <th className="p-2 text-left font-semibold">3P EV</th>
              <th className="p-2 text-left font-semibold">2P EV</th>
              <th className="p-2 text-left font-semibold">Gap</th>
              <th className="p-2 text-left font-semibold">Visual</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-nora-border-light hover:bg-gray-50">
              <td className="p-2">2003</td>
              <td className="p-2">18.0</td>
              <td className="p-2">32.2%</td>
              <td className="p-2">1.040</td>
              <td className="p-2">0.963</td>
              <td className="p-2 text-accent-green font-semibold">+0.078</td>
              <td className="p-2">
                <div className="flex gap-0.5">
                  <div className="h-3.5 rounded-sm bg-accent-blue" style={{ width: '104px' }} />
                  <div className="h-3.5 rounded-sm bg-orange-500" style={{ width: '96px' }} />
                </div>
              </td>
            </tr>
            <tr className="border-b border-nora-border-light hover:bg-gray-50">
              <td className="p-2">2008</td>
              <td className="p-2">19.0</td>
              <td className="p-2">34.4%</td>
              <td className="p-2">1.052</td>
              <td className="p-2">0.967</td>
              <td className="p-2 text-accent-green font-semibold">+0.085</td>
              <td className="p-2">
                <div className="flex gap-0.5">
                  <div className="h-3.5 rounded-sm bg-accent-blue" style={{ width: '105px' }} />
                  <div className="h-3.5 rounded-sm bg-orange-500" style={{ width: '97px' }} />
                </div>
              </td>
            </tr>
            <tr className="border-b border-nora-border-light hover:bg-gray-50">
              <td className="p-2">2013</td>
              <td className="p-2">18.1</td>
              <td className="p-2">33.0%</td>
              <td className="p-2">1.017</td>
              <td className="p-2">0.950</td>
              <td className="p-2 text-accent-green font-semibold">+0.067</td>
              <td className="p-2">
                <div className="flex gap-0.5">
                  <div className="h-3.5 rounded-sm bg-accent-blue" style={{ width: '102px' }} />
                  <div className="h-3.5 rounded-sm bg-orange-500" style={{ width: '95px' }} />
                </div>
              </td>
            </tr>
            <tr className="border-b border-nora-border-light hover:bg-gray-50">
              <td className="p-2">2016</td>
              <td className="p-2">20.4</td>
              <td className="p-2">35.4%</td>
              <td className="p-2">1.040</td>
              <td className="p-2">0.973</td>
              <td className="p-2 text-accent-green font-semibold">+0.067</td>
              <td className="p-2">
                <div className="flex gap-0.5">
                  <div className="h-3.5 rounded-sm bg-accent-blue" style={{ width: '104px' }} />
                  <div className="h-3.5 rounded-sm bg-orange-500" style={{ width: '97px' }} />
                </div>
              </td>
            </tr>
            <tr className="border-b border-nora-border-light hover:bg-gray-50">
              <td className="p-2">2019</td>
              <td className="p-2">22.3</td>
              <td className="p-2">38.7%</td>
              <td className="p-2">1.032</td>
              <td className="p-2">1.002</td>
              <td className="p-2 text-accent-green font-semibold">+0.030</td>
              <td className="p-2">
                <div className="flex gap-0.5">
                  <div className="h-3.5 rounded-sm bg-accent-blue" style={{ width: '103px' }} />
                  <div className="h-3.5 rounded-sm bg-orange-500" style={{ width: '100px' }} />
                </div>
              </td>
            </tr>
            <tr className="border-b border-nora-border-light hover:bg-gray-50">
              <td className="p-2">2022</td>
              <td className="p-2">21.7</td>
              <td className="p-2">37.7%</td>
              <td className="p-2">1.010</td>
              <td className="p-2">0.995</td>
              <td className="p-2 text-accent-green font-semibold">+0.015</td>
              <td className="p-2">
                <div className="flex gap-0.5">
                  <div className="h-3.5 rounded-sm bg-accent-blue" style={{ width: '101px' }} />
                  <div className="h-3.5 rounded-sm bg-orange-500" style={{ width: '99px' }} />
                </div>
              </td>
            </tr>
            <tr className="border-b border-nora-border-light hover:bg-gray-50">
              <td className="p-2">2024</td>
              <td className="p-2">21.7</td>
              <td className="p-2">37.3%</td>
              <td className="p-2">1.015</td>
              <td className="p-2">1.006</td>
              <td className="p-2 text-accent-green font-semibold">+0.009</td>
              <td className="p-2">
                <div className="flex gap-0.5">
                  <div className="h-3.5 rounded-sm bg-accent-blue" style={{ width: '101px' }} />
                  <div className="h-3.5 rounded-sm bg-orange-500" style={{ width: '101px' }} />
                </div>
              </td>
            </tr>
            <tr className="bg-red-50 border-b border-nora-border-light">
              <td className="p-2 font-bold">2025</td>
              <td className="p-2 font-bold">22.6</td>
              <td className="p-2 font-bold">39.0%</td>
              <td className="p-2 font-bold">1.014</td>
              <td className="p-2 font-bold">1.019</td>
              <td className="p-2 text-accent-red font-bold">-0.005</td>
              <td className="p-2">
                <div className="flex gap-0.5">
                  <div className="h-3.5 rounded-sm bg-accent-blue" style={{ width: '101px' }} />
                  <div className="h-3.5 rounded-sm bg-orange-500" style={{ width: '102px' }} />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mb-4 text-base">
        The blue bars (3P EV) and orange bars (2P EV) are converging. In 2025, they crossed. The market has corrected.
      </p>

      {/* Finding 3 */}
      <h2 className="text-2xl font-bold mt-12 mb-4 text-nora-black border-b-2 border-nora-border-light pb-2">
        <FindingNum n={3} /> Why the Gap Closed: A Two-Sided Story
      </h2>

      <p className="mb-4 text-base">
        The convergence isn't just about teams shooting more threes. It's a two-sided equilibrium shift:
      </p>

      <p className="mb-4 text-base">
        <strong>Supply side (offense):</strong> Three-point attempts per game rose from 18.0 in 2003 to 22.6 in 2025 — a 26% increase. The share of all field goals that are threes went from 32% to 39%. But three-point accuracy has barely budged: 34.7% in 2003, 33.8% in 2025. Teams are taking more threes, but not <em>better</em> threes. The marginal three-pointer being added to the shot diet is a contested, lower-quality look.
      </p>

      <p className="mb-4 text-base">
        <strong>Demand side (defense):</strong> Two-point accuracy has climbed from 48.1% in 2003 to 51.0% in 2025. As defenses spread out to contest three-point shooters, they've left more room inside. The two-point shot has gotten <em>easier</em> because the defense is now optimized against the three. The defensive response to the three-point revolution has made twos more valuable.
      </p>

      <Callout variant="amber">
        <p className="mb-4 text-base">
          <strong>The economics:</strong> This is classic arbitrage correction. When an asset is underpriced (the three-pointer), rational actors exploit it (teams shoot more threes). This drives up "demand" for three-point defense, which drives down the "price" (accuracy) of threes while simultaneously making the substitute good (twos) cheaper. Eventually, the expected values converge and the arbitrage disappears. College basketball took about 20 years to reach approximate market efficiency.
        </p>
      </Callout>

      {/* Finding 4 */}
      <h2 className="text-2xl font-bold mt-12 mb-4 text-nora-black border-b-2 border-nora-border-light pb-2">
        <FindingNum n={4} /> The Three-Pointer Is a Variance Weapon
      </h2>

      <p className="mb-4 text-base">
        Even as the raw EV converges, there's a deeper reason teams — especially underdogs — should keep shooting threes. It's not about the average. It's about the variance.
      </p>

      <StatGrid
        stats={[
          { value: '44%', label: 'Coefficient of Variation\nPoints from 3s', color: 'amber' },
          { value: '26%', label: 'Coefficient of Variation\nPoints from 2s', color: 'blue' },
          { value: '1.7x', label: 'Three-point scoring is\n1.7x more volatile', color: 'default' },
        ]}
      />

      <p className="mb-4 text-base">
        Three-point scoring has 1.7 times the relative variance of two-point scoring. On any given night, your three-point output swings wildly — you might hit 4 of 20 or 12 of 20 from the same looks. Two-point shooting is far more predictable.
      </p>

      <p className="mb-4 text-base">
        This matters enormously for underdogs. In a single-elimination tournament, the favorite wants low variance (play your game, let talent win). The underdog wants <em>high</em> variance — they need something unusual to happen. The three-pointer is that something.
      </p>

      {/* Finding 5 */}
      <h2 className="text-2xl font-bold mt-12 mb-4 text-nora-black border-b-2 border-nora-border-light pb-2">
        <FindingNum n={5} /> Proof: How Upsets Are Built
      </h2>

      <p className="mb-4 text-base">
        The data is unambiguous about how three-point shooting drives upsets.
      </p>

      <StatGrid
        stats={[
          { value: '40%', label: "Three-point differential's share\nof the scoring margin in upsets", color: 'green' },
          { value: '17%', label: "Three-point differential's share\nof the scoring margin in non-upsets", color: 'blue' },
        ]}
      />

      <DataTable
        headers={['', 'Avg Margin', 'From 3PT Diff', 'From 2PT Diff', 'From FT Diff']}
        rows={[
          [
            <strong key="u">Upsets (381 games)</strong>,
            '8.6 pts',
            <span key="u3" className="text-accent-green font-semibold">3.5 pts (40%)</span>,
            '2.3 pts (26%)',
            '2.9 pts (34%)',
          ],
          [
            <strong key="n">Non-Upsets (1,001 games)</strong>,
            '12.8 pts',
            '2.1 pts (17%)',
            <span key="n2" className="text-accent-green font-semibold">6.6 pts (51%)</span>,
            '4.2 pts (32%)',
          ],
        ]}
      />

      <p className="mb-4 text-base">
        When favorites win, they win on two-point shooting — the reliable, skill-based part of the game where talent advantages show up. When underdogs pull upsets, <strong>40% of the scoring margin comes from the three-point line</strong>. The three-pointer is the single biggest factor in March Madness upsets, contributing nearly as much to upset margins as two-pointers and free throws combined.
      </p>

      {/* Finding 6 */}
      <h2 className="text-2xl font-bold mt-12 mb-4 text-nora-black border-b-2 border-nora-border-light pb-2">
        <FindingNum n={6} /> The Hot Hand Economy
      </h2>

      <p className="mb-4 text-base">
        What does a team look like when the threes are falling?
      </p>

      <StatGrid
        stats={[
          { value: '72.7%', label: 'Win rate when shooting\n40%+ from 3 (min 8 att.)', color: 'green' },
          { value: '26.1%', label: 'Win rate when shooting\nsub-25% from 3 (min 8 att.)', color: 'red' },
        ]}
      />

      <p className="mb-4 text-base">
        Shoot 40% or better from three in a tournament game and you win nearly three-quarters of the time — regardless of seed. Shoot below 25% and you're a 3-to-1 underdog. The three-point line creates a binary state: when it's on, you're nearly unbeatable; when it's off, you're nearly doomed. This is the mechanism behind "any given night" — and why March is mad.
      </p>

      <h3 className="text-lg font-bold mt-7 mb-3 text-nora-black">The Upset 3PT Profile</h3>

      <p className="mb-4 text-base">
        When an underdog pulls off an upset, the three-point line is almost always the story:
      </p>

      <DataTable
        headers={['', '3P%', '3PA/game', '3PM/game']}
        rows={[
          [
            <strong key="uw">Upset winners</strong>,
            <span key="uw3" className="text-accent-green font-semibold">39.3%</span>,
            '18.7',
            '7.4',
          ],
          [
            <strong key="ul">Upset losers (the favorite)</strong>,
            <span key="ul3" className="text-accent-red font-semibold">29.4%</span>,
            '21.0',
            '6.2',
          ],
          [
            <strong key="g">Gap</strong>,
            <strong key="g3">+9.9 pct pts</strong>,
            '-2.3',
            '+1.2',
          ],
        ]}
      />

      <p className="mb-4 text-base">
        Notice something counterintuitive: upset winners actually <em>attempt fewer</em> threes than the favorites they beat (18.7 vs 21.0). They just make them at a dramatically higher rate — 39.3% vs 29.4%, a nearly 10 percentage point gap. The upset isn't about jacking up threes hoping to get lucky. It's about one team getting hot while the other goes cold. The variance swings both ways in the same game.
      </p>

      {/* Finding 7 */}
      <h2 className="text-2xl font-bold mt-12 mb-4 text-nora-black border-b-2 border-nora-border-light pb-2">
        <FindingNum n={7} /> The Paradox of the Deep Run
      </h2>

      <p className="mb-4 text-base">
        Here's the twist: while the three-pointer fuels upsets and Cinderella runs, the teams that ultimately <em>win</em> the tournament don't rely on threes more than average.
      </p>

      <StatGrid
        stats={[
          { value: '33.9%', label: '3PA share of Championship\nGame teams (n=44)', color: 'default' },
          { value: '34.1%', label: '3PA share of Final Four\nteams (n=84)', color: 'default' },
          { value: '34.5%', label: '3PA share of all\ntournament teams', color: 'default' },
        ]}
      />

      <p className="mb-4 text-base">
        Teams that reach the Final Four and Championship Game have a <em>slightly lower</em> three-point attempt rate than the tournament average. The teams that go all the way are well-rounded — they can win on nights when the three isn't falling because they have elite two-point offense, defense, and rebounding to fall back on.
      </p>

      <Callout variant="purple">
        <p className="mb-4 text-base">
          <strong>The investment parallel:</strong> Three-point shooting in the tournament is like leverage. In the short term (a single game), it can turn a 12-seed into a giant-killer. Over a six-game gauntlet, the variance that helps you in Round 1 will eventually betray you. Champions have diversified portfolios — they don't need the three to win, but they can use it when the opportunity is there. It's the difference between a speculator and a value investor.
        </p>
      </Callout>

      {/* Finding 8 */}
      <h2 className="text-2xl font-bold mt-12 mb-4 text-nora-black border-b-2 border-nora-border-light pb-2">
        <FindingNum n={8} /> The Closing of the Frontier
      </h2>

      <p className="mb-4 text-base">
        The biggest story in this data is the long-term convergence. Here's the trajectory:
      </p>

      <BarChart
        title="Three-Point Attempt Share of All Field Goals"
        rows={[
          { label: '2003', value: '32.2%', width: 54, color: 'blue' },
          { label: '2005', value: '33.0%', width: 55, color: 'blue' },
          { label: '2008', value: '34.4%', width: 57, color: 'blue' },
          { label: '2011', value: '32.9%', width: 55, color: 'blue' },
          { label: '2014', value: '32.9%', width: 55, color: 'blue' },
          { label: '2016', value: '35.4%', width: 59, color: 'orange' },
          { label: '2018', value: '37.5%', width: 63, color: 'orange' },
          { label: '2020', value: '37.5%', width: 63, color: 'orange' },
          { label: '2022', value: '37.7%', width: 63, color: 'orange' },
          { label: '2024', value: '37.3%', width: 62, color: 'red' },
          { label: '2025', value: '39.0%', width: 65, color: 'red' },
        ]}
      />

      <p className="mb-4 text-base">
        For a decade (2003-2014), the three-point share held remarkably steady around 33%. Then something changed around 2015-2016. The share jumped to 35%+ and has climbed to 39% by 2025. The Steph Curry effect — the idea that three-point shooting is a market inefficiency — went from analytics insight to mainstream coaching philosophy.
      </p>

      <p className="mb-4 text-base">
        But here's what makes this a complete economic story: the three-point percentage has barely moved. Teams shot 34.7% from three in 2003 and 33.8% in 2025. Volume up 26%, accuracy flat. Every additional three-pointer being hoisted is a <em>worse</em> shot than the ones already being taken. The marginal three has declining returns.
      </p>

      <p className="mb-4 text-base">
        Meanwhile, the two-point shot has quietly gotten much better: 48.1% in 2003 to 51.0% in 2025. As defenses stretch to guard the three-point line, the paint has opened up. The market has responded on both sides of the equation until equilibrium was reached.
      </p>

      <Callout>
        <p className="mb-4 text-base font-semibold">
          The three-point revolution in college basketball is a textbook case of market correction. An underpriced asset (the three-pointer) was exploited by rational actors (coaches who read analytics), the increased demand drove down returns (accuracy flat despite rising volume), the substitute good rose in value (two-point efficiency climbing), and the market reached approximate efficiency (EV gap ~ 0 by 2025). The whole cycle took roughly 20 years — slower than financial markets, faster than most institutional behavior changes.
        </p>
      </Callout>

      {/* Finding 9 */}
      <h2 className="text-2xl font-bold mt-12 mb-4 text-nora-black border-b-2 border-nora-border-light pb-2">
        <FindingNum n={9} /> What This Means for March 2025
      </h2>

      <p className="mb-4 text-base">
        If we're entering a post-arbitrage era for the three-pointer, the implications for this year's tournament are significant:
      </p>

      <p className="mb-4 text-base">
        <strong>The variance weapon still works.</strong> Even with the EV converged, the three-pointer retains its upset-generating power because the variance is structural — it's baked into the geometry of the shot. A team can always get hot from three for 40 minutes. That hasn't changed.
      </p>

      <p className="mb-4 text-base">
        <strong>But teams that live by the three will die by it more often.</strong> When the three had a clear EV advantage, shooting lots of threes was both a good strategy <em>and</em> a good gamble. Now it's only a gamble. Teams with balanced scoring profiles have a structural advantage over the course of a six-game tournament.
      </p>

      <p className="mb-4 text-base">
        <strong>The new inefficiency may be inside the arc.</strong> With defenses still optimized against the three, teams that can exploit two-point efficiency — through pick-and-roll, post play, cutting, and driving — may be the new "underpriced asset." The 51% two-point shooting in 2025 is the highest in the dataset. Someone is benefiting from the defensive overreaction to the three-point era.
      </p>

      <Divider />

      <p className="text-sm text-nora-grey mt-10">
        <strong>Data:</strong> Kaggle March Machine Learning Mania dataset. Regular season detailed results: 2003-2025 (~118,000 games). Tournament detailed results: 2003-2024 (1,382 games). Expected value calculated as shooting percentage x point value. Three-point share = 3PA / FGA. All statistics calculated per team per game.
      </p>
    </>
  );
}
