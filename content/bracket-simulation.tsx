import StatGrid from '@/components/StatGrid';
import BarChart from '@/components/BarChart';
import Callout from '@/components/Callout';
import DataTable from '@/components/DataTable';
import Section from '@/components/Section';
import Divider from '@/components/Divider';

export default function BracketSimulationContent() {
  return (
    <>
      <StatGrid
        stats={[
          { value: '387', label: 'Avg score: Chalk (always pick higher seed)' },
          { value: '306', label: 'Avg score: Pure coaching experience' },
          { value: '369', label: 'Avg score: Hybrid (seeds + coaching flips)' },
          { value: '4 of 21', label: 'Seasons coaching beats chalk', color: 'red' },
        ]}
      />

      <Divider />

      {/* THE THREE STRATEGIES */}
      <Section
        title="The Three Strategies We Tested"
        tagline="From &quot;trust the committee&quot; to &quot;trust the coach&quot; to a blend of both"
      >
        <DataTable
          headers={['Strategy', 'How It Picks Every Game']}
          rows={[
            [<strong key="s1">Chalk</strong>, 'Always pick the higher seed. Pure committee trust. No thinking required.'],
            [<strong key="s2">Coaching Experience</strong>, "Always pick the team whose coach has more prior tournament wins. Tiebreak: more prior appearances. Then: higher seed."],
            [<strong key="s3">Hybrid</strong>, "Default to higher seed, but flip to the underdog when their coach has 5+ more prior tournament appearances and the seed gap is 5 or fewer seed lines."],
          ]}
        />
      </Section>

      {/* THE VERDICT */}
      <Section
        title="The Verdict: Chalk Wins — and It's Not Close"
        tagline="Pure coaching experience as a bracket strategy loses to &quot;just pick the higher seed&quot; in 17 of 21 seasons"
      >
        <BarChart
          rows={[
            { label: 'Chalk (seeds)', value: '387 avg pts \u2022 Won 13 seasons', width: 77, color: 'blue' },
            { label: 'Hybrid', value: '369 avg pts \u2022 Won 5 seasons', width: 74, color: 'purple' },
            { label: 'Coaching only', value: '306 avg pts \u2022 Won 3 seasons', width: 61, color: 'orange' },
          ]}
        />

        <p>The pure coaching strategy averages 306 points per tournament versus 387 for chalk — an 81-point deficit. Even the hybrid approach, which only flips a handful of games, trails chalk by 18 points per season.</p>

        <Callout variant="red">
          <strong>2007 was the worst year for coaching:</strong> Chalk scored 700 points, coaching scored 280. That&apos;s a 420-point gap. In a standard office pool, the coaching bracket would finish dead last.
        </Callout>
      </Section>

      {/* WHY IT FAILS */}
      <Section
        title="Why Coaching Experience Fails as a Bracket Strategy"
        tagline="The insight is real. The implementation breaks down because of bracket math."
      >
        <p>This might seem contradictory — we proved coaching experience predicts upsets, so why doesn&apos;t it win brackets? Three reasons:</p>

        <p><strong>1. Bracket scoring is exponential, not linear.</strong> Championship = 320 points. Round of 64 = 10. A correct championship pick is worth 32 first-round games. The coaching strategy picks more first-round upsets correctly, but the chalk strategy picks more later-round games correctly because favorites who advance keep earning points. One correct Final Four pick is worth more than getting 16 first-round upset calls right.</p>

        <DataTable
          headers={['Round', 'Chalk (avg correct)', 'Coaching (avg correct)', 'Points per correct pick']}
          alignments={['left', 'right', 'right', 'right']}
          rows={[
            ['Round of 64', '12.3 of 32 (39%)', '12.2 of 32 (38%)', '10'],
            ['Round of 32', '7.8 of 16 (49%)', '6.2 of 16 (39%)', '20'],
            ['Sweet 16', '1.9 of 8 (23%)', '1.2 of 8 (15%)', '40'],
            ['Elite 8', '0.4 of 4 (11%)', '0.1 of 4 (4%)', '80'],
            ['Final Four', '0.0 of 2', '0.0 of 2', '160'],
            ['Championship', '0.0 of 1', '0.0 of 1', '320'],
          ]}
        />

        <p>Notice: chalk&apos;s edge grows in later rounds where the points are worth exponentially more. The coaching strategy bleeds points in the Sweet 16 and beyond.</p>

        <p><strong>2. Coaching experience picks cascade incorrectly.</strong> When you pick an underdog in round 1, that pick carries forward. If the coaching strategy picks a 10-seed over a 7-seed and gets it right, great — 10 points. But now that 10-seed faces a 2-seed in round 2. The coaching strategy might still pick the 10-seed (their coach is more experienced), but they&apos;ll probably lose. So the correct round-1 upset call actually <em>hurts</em> you in round 2 because your bracket now has the wrong team advancing.</p>

        <p><strong>3. The coaching edge is real but narrow.</strong> We showed coaching experience bumps upset probability from 26% to 38%. That&apos;s meaningful for analysis, but 38% is still a losing bet in any individual game. A strategy built entirely on 38% calls will be wrong more often than right, and bracket scoring punishes cascading errors.</p>

        <Callout variant="green">
          <strong>The investment analogy:</strong> This is exactly like finding a stock that&apos;s undervalued by 10%. The analysis is correct. But if you put 100% of your portfolio into that one trade, you take on massive concentration risk. The coaching insight is an edge, not a strategy. It needs to be blended into a diversified approach — which is what the hybrid attempts.
        </Callout>
      </Section>

      {/* THE HYBRID */}
      <Section
        title="The Hybrid: Better, But Still Not Enough"
        tagline="Selectively flipping 3-5 games per bracket based on coaching edges narrows the gap but doesn't close it"
      >
        <p>The hybrid strategy (default to seeds, flip only when the underdog has 5+ more prior appearances and the seed gap is 5 or fewer) averaged 369 points — closer to chalk&apos;s 387 but still 18 points behind on average. It won 6 out of 21 seasons and tied 3.</p>

        <p>The hybrid tells us something important: the coaching insight has value as a <em>modifier</em> to a seed-based strategy, but the specific threshold we tested (5+ apps, seed gap ≤ 5) is too aggressive. A more conservative version — perhaps flipping only 1-2 games per bracket where the coaching edge is extreme and the seed gap is small (like a 7-vs-10) — might actually outperform chalk in certain pool formats.</p>
      </Section>

      {/* WHERE COACHING WINS */}
      <Section
        title="When Coaching DID Beat Chalk"
        tagline="In 4 seasons, the coaching eye saw what the committee missed"
      >
        <DataTable
          headers={['Year', 'Coaching Score', 'Chalk Score', 'Edge', 'What Happened']}
          alignments={['left', 'right', 'right', 'right', 'left']}
          highlightRows={[0, 1]}
          rows={[
            ['2003', '500', '440', <span key="e1" className="text-accent-green font-bold">+60</span>, 'Syracuse (Boeheim, 21 apps as a 3-seed) won it all. Coaching spotted the experienced coach with a deep run.'],
            ['2022', '310', '250', <span key="e2" className="text-accent-green font-bold">+60</span>, 'Chaotic year — many top seeds fell. Coaching correctly identified several experienced coaches on lower seeds who advanced.'],
            ['2018', '280', '260', <span key="e3" className="text-accent-green font-bold">+20</span>, 'Virginia (1-seed) lost in R64 to UMBC. Chalk strategy had them going deep. Coaching avoided some of these traps.'],
            ['2016', '250', '240', <span key="e4" className="text-accent-green font-bold">+10</span>, 'Villanova won as a 2-seed. Syracuse (Boeheim, #10) made the Final Four. Coaching experience aligned with upsets.'],
          ]}
        />

        <p>The pattern: coaching wins in <strong>chaotic years</strong> when top seeds flame out. In orderly years (2007, 2009) where favorites advance, chalk dominates. This makes coaching experience a contrarian signal — it&apos;s most valuable precisely when the conventional wisdom (seeds) is wrong.</p>
      </Section>

      {/* THE REAL LESSON */}
      <Section
        title="The Bigger Lesson: Knowing ≠ Profiting"
        tagline="A pattern can be statistically real and still not be profitable as a pure strategy"
      >
        <p>This simulation reveals a fundamental tension that shows up across economics and investing:</p>

        <p><strong>The coaching effect is real.</strong> We proved it with 40 years of data across multiple analyses. Experienced coaches genuinely outperform their seeds. The upset rate genuinely jumps 11.5 points when the underdog has the coaching edge.</p>

        <p><strong>But &quot;real&quot; doesn&apos;t mean &quot;sufficient.&quot;</strong> A 38% upset probability is better than 26%, but it&apos;s still less than 50%. Bracket scoring rewards correct favorites far more than correct upsets because of compounding. And a strategy needs to survive the structure of the competition (cascading brackets), not just be right on individual games.</p>

        <Callout variant="blue">
          <strong>The market parallel:</strong> Value stocks are systematically underpriced — this is one of the most robust findings in finance. But a portfolio that only holds deep-value stocks still underperforms the broad market in many years because concentration risk, timing, and structural factors overwhelm the valuation edge. Coaching experience in brackets works the same way: real edge, wrong vehicle.
        </Callout>

        <p>The right way to use coaching data isn&apos;t to build a bracket around it. It&apos;s to use it as a tiebreaker within a seed-based framework — and to recognize the handful of games each year where the coaching mismatch is extreme enough to justify overriding the committee&apos;s seeding. That&apos;s the hybrid approach, refined with better thresholds.</p>
      </Section>

      {/* BOTTOM LINE */}
      <div className="bg-nora-atlas text-white rounded-xl p-8 mt-10">
        <h2 className="text-2xl font-bold mb-3">Bracket Pool Takeaway</h2>
        <p className="opacity-90 mb-3"><strong>Don&apos;t fill out your bracket purely based on coaching experience.</strong> You&apos;ll lose to the person who just circled all the higher seeds. The math of exponential scoring in later rounds kills any upset-heavy strategy.</p>
        <p className="opacity-90 mb-3"><strong>Do use coaching experience as a selective tiebreaker.</strong> When you see a 7-vs-10 or 8-vs-9 game where the underdog&apos;s coach has deep tournament experience and the favorite&apos;s coach is a first-timer, that&apos;s where the coaching data earns its keep. Pick 2-3 of those per bracket, not 15.</p>
        <p className="opacity-90"><strong>The economic lesson stands:</strong> The committee underprices coaching. But exploiting a mispricing requires matching the edge to the right instrument. In brackets, that means surgical application, not wholesale adoption.</p>
      </div>
    </>
  );
}
