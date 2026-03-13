import { ReactNode } from 'react'
import StatGrid from '@/components/StatGrid'
import BarChart from '@/components/BarChart'
import Callout from '@/components/Callout'
import DataTable from '@/components/DataTable'
import Section from '@/components/Section'
import Divider from '@/components/Divider'

export default function SeedingExpertFallibilityContent() {
  return (
    <>
      {/* KEY STATS */}
      <StatGrid
        stats={[
          { value: '27%', label: 'of first-round games are "upsets" where the lower seed wins' },
          { value: '~Flat', label: "Upset rate hasn't improved over 40 years — the committee isn't learning" },
          { value: '11 > 10 > 9', label: '11-seeds outperform both 9 and 10 seeds — a persistent mispricing' },
          { value: '3', label: '1-seeds have lost in the Round of 64 (should be near zero)', color: 'red' },
        ]}
      />

      <Divider />

      {/* FINDING 1: The Committee's Batting Average */}
      <Section
        title="Finding 1: The Committee Gets It Right About 73% of the Time"
        tagline="That sounds good until you realize the rate doesn't improve as the stakes get higher"
      >
        <p>In the first round, the higher-seeded team wins 72.9% of the time. You might expect that number to climb in later rounds — after all, the surviving teams have proven themselves, and the committee&apos;s best-seeded teams should separate from the pack. Instead, the upset rate stays remarkably flat:</p>

        <DataTable
          headers={['Round', 'Games', 'Higher Seed Wins', 'Upset Rate']}
          alignments={['left', 'right', 'right', 'right']}
          rows={[
            ['Round of 64', '1,453', '72.9%', '27.1%'],
            ['Round of 32', '828', '69.3%', '30.7%'],
            ['Sweet 16', '178', '68.9%', '31.1%'],
            ['Elite 8', '49', '71.1%', '28.9%'],
            ['Final Four', '10', '71.4%', '28.6%'],
          ]}
        />

        <p>This is a key economic insight: <strong>the seedings contain meaningful information, but roughly a quarter of it is wrong in any given game.</strong> If seeding were a financial forecast, you&apos;d say the model has a consistent ~27% error rate that it can&apos;t seem to reduce, regardless of the sample or the round.</p>

        <Callout>
          <strong>The economic framing:</strong> Think of each seed assignment as a &quot;price&quot; set by a committee of experts. A 1-seed is priced as a strong favorite; a 16-seed is priced as cannon fodder. The question is: are these prices well-calibrated? The answer is &quot;pretty good but with consistent, exploitable blind spots.&quot;
        </Callout>
      </Section>

      {/* FINDING 2: No Improvement Over Time */}
      <Section
        title="Finding 2: 40 Years of Data and the Committee Hasn't Gotten Better"
        tagline="The upset rate in the first round has been essentially flat since 1985"
      >
        <BarChart
          rows={[
            { label: '1985-94', value: '23.9%', width: 47.8, color: 'purple' },
            { label: '1995-04', value: '24.2%', width: 48.4, color: 'purple' },
            { label: '2005-14', value: '24.3%', width: 48.6, color: 'purple' },
            { label: '2015-24', value: '25.2%', width: 50.4, color: 'purple' },
          ]}
          caption="First-round upset rate by decade"
        />

        <p>If anything, the rate has drifted slightly upward — from 23.9% in the first decade to 25.2% in the most recent. The committee has access to more data, more analytics, and more computing power than ever before. Yet their hit rate hasn&apos;t budged. This is consistent with a well-known finding in forecasting research: <strong>expert judgment tends to plateau, and more information doesn&apos;t automatically translate into better predictions.</strong></p>

        <Callout variant="blue">
          <strong>Compare to other expert domains:</strong> Weather forecasting has dramatically improved over 40 years thanks to better models and data. Stock analyst forecasts have not. The Selection Committee falls into the latter category — a fundamentally uncertain system where more data doesn&apos;t create proportionally better outcomes.
        </Callout>
      </Section>

      {/* FINDING 3: The 11-Seed Anomaly */}
      <Section
        title={
          <>
            Finding 3: The 11-Seed Anomaly{' '}
            <span className="inline-block bg-accent-red text-white text-[0.45em] font-bold px-2 py-0.5 rounded-full align-middle ml-2">
              SYSTEMATIC MISPRICING
            </span>
          </>
        }
        tagline="11-seeds outperform 9 and 10 seeds — a persistent error the committee has never corrected"
      >
        <p>This is the single most striking pattern in the data and the clearest evidence of expert fallibility. If seeding were perfectly calibrated, performance should decline monotonically from seed 1 to seed 16. It doesn&apos;t. The 11-seed line is out of order:</p>

        <BarChart
          rows={[
            { label: '#8 seed', value: '0.71 avg wins', width: 71, color: 'blue' },
            { label: '#9 seed', value: '0.62 avg wins', width: 62, color: 'blue' },
            { label: '#10 seed', value: '0.61 avg wins', width: 61, color: 'blue' },
            { label: '#11 seed', value: '0.70 avg wins', width: 70, color: 'red' },
            { label: '#12 seed', value: '0.52 avg wins', width: 52, color: 'blue' },
          ]}
          caption='Red marker = where 11-seeds "should" be based on their seed number'
        />

        <p>The numbers get more dramatic the deeper you go:</p>

        {/* Seed Compare boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-4">
          <div className="bg-gray-50 rounded-[10px] p-5 text-center">
            <div className="text-[2.5em] font-bold text-accent-red">#11 seeds</div>
            <div className="text-[0.9em] text-nora-grey">Sweet 16 rate</div>
            <div className="text-[1.3em] font-bold">6.9%</div>
            <div className="text-[0.9em] text-nora-grey mt-1">Final Four appearances</div>
            <div className="text-[1.3em] font-bold text-accent-red">6</div>
            <div className="text-[0.8em] text-nora-grey mt-2">VCU &apos;11, UCLA &apos;21, George Mason &apos;06, Loyola Chicago &apos;18, NC State &apos;24, LSU &apos;86</div>
          </div>
          <div className="bg-gray-50 rounded-[10px] p-5 text-center">
            <div className="text-[2.5em] font-bold text-accent-blue">#9 + #10 seeds combined</div>
            <div className="text-[0.9em] text-nora-grey">Sweet 16 rate</div>
            <div className="text-[1.3em] font-bold">3.2% / 5.7%</div>
            <div className="text-[0.9em] text-nora-grey mt-1">Final Four appearances</div>
            <div className="text-[1.3em] font-bold">1 combined</div>
            <div className="text-[0.8em] text-nora-grey mt-2">9-seeds: 0 Final Fours. 10-seeds: 1 (Syracuse 2016)</div>
          </div>
        </div>

        <p><strong>11-seeds have made 6 Final Fours. 9-seeds and 10-seeds have made 1 combined.</strong> This isn&apos;t a fluke — it&apos;s a 40-year pattern across 174 11-seed entries. Several possible explanations:</p>

        <Callout>
          <strong>Hypothesis 1: The &quot;warm-up game&quot; effect.</strong> Since the tournament expanded, some 11-seeds play in the First Four (play-in round). Getting an extra competitive game before facing a 6-seed could provide a meaningful warm-up advantage — game-speed reps, travel logistics shakedown, and facing elimination pressure once before the &quot;real&quot; tournament starts.
        </Callout>

        <Callout>
          <strong>Hypothesis 2: The &quot;bubble team with upside&quot; profile.</strong> 11-seeds are often talented teams from major conferences that underperformed in the regular season, or mid-major teams that dominated weaker conferences. Both profiles contain hidden upside: major-conference teams have faced tougher competition, and dominant mid-majors may have a star player or system that gives fits to anyone. The committee sees &quot;uneven resume&quot; and assigns seed 11, but the talent ceiling is much higher.
        </Callout>

        <Callout variant="red">
          <strong>The economic parallel:</strong> This is functionally identical to a market mispricing. The &quot;market&quot; (the committee) consistently undervalues a specific asset class (11-seeds) relative to comparable assets (9 and 10 seeds). If you could bet on 11-seeds making the Sweet 16 at odds implied by their seed number, you&apos;d have a positive expected value bet — for 40 years running.
        </Callout>
      </Section>

      {/* FINDING 4: The 5-vs-12 Problem */}
      <Section
        title={`Finding 4: The 5-vs-12 Game Is Less of a "Lock" Than Advertised`}
        tagline="12-seeds win 35% of the time — and the rate was approaching coin-flip territory for a decade"
      >
        <p>The 5-vs-12 matchup is famous in bracket circles as the most common upset pick, and the data validates it:</p>

        <DataTable
          headers={['Era', '5-Seed Win %', '12-Seed Win %']}
          alignments={['left', 'right', 'right']}
          rows={[
            ['1985-1994', '72%', '28%'],
            ['1995-2004', '62%', '38%'],
            ['2005-2014', '55%', '45%'],
            ['2015-2024', '69%', '31%'],
          ]}
          highlightRows={[2]}
        />

        <p>From 2005-2014, 12-seeds won 45% of the time — almost a coin flip. The rate has pulled back recently, but the structural issue remains: the committee consistently assigns 5-seeds to teams that aren&apos;t meaningfully better than 12-seeds. The gap between a &quot;good but not great&quot; major-conference team (typical 5-seed) and a &quot;best team in a mid-major conference&quot; (typical 12-seed) is smaller than the committee prices it.</p>
      </Section>

      {/* FINDING 5: The 1-Seed Failures */}
      <Section
        title="Finding 5: When the Committee's Best Pick Loses Immediately"
        tagline="A 1-seed losing in the Round of 64 should be nearly impossible — it's happened 3 times"
      >
        <p>1-seeds are supposed to be the committee&apos;s four most confident selections. They get the easiest path — facing a 16-seed in round one, then an 8 or 9 seed. Yet:</p>

        <DataTable
          headers={['Year', '1-Seed', 'Lost To', 'Score', 'Context']}
          alignments={['left', 'left', 'left', 'left', 'left']}
          rows={[
            ['2018', 'Virginia', '#16 UMBC', '54-74', 'First 1-vs-16 upset in history. 20-point loss.'],
            ['2023', 'Purdue', '#16 Fairleigh Dickinson', '63-66', 'Second 1-vs-16 upset ever. Both in 5 years.'],
            ['-', <em key="note">Additional early exits: 6 different 1-seeds have been eliminated in the Round of 32 (2nd round loss)</em>, '', '', ''],
          ]}
          highlightRows={[0, 1]}
        />

        <p>The fact that both 1-vs-16 upsets happened in the last 6 years is noteworthy. Either the committee&apos;s top selections have gotten weaker, the 16-seed play-in game provides a warm-up advantage (similar to our 11-seed hypothesis), or random variance is clustering in a small sample.</p>

        <Callout>
          <strong>The &quot;overconfidence&quot; parallel:</strong> In behavioral economics, experts tend to be most miscalibrated at the extremes of their confidence range. The committee&apos;s most confident pick (1-seed) should almost never fail immediately — but the rate of catastrophic failure (1.3% in R64, 5.1% out by R32) is higher than the implied confidence of the seeding would suggest.
        </Callout>
      </Section>

      {/* FINDING 6: Conference Bias */}
      <Section
        title="Finding 6: The ACC Gets Favorable Seeding — Mountain West Gets Punished"
        tagline="Some conferences consistently outperform their seeds, others consistently underperform"
      >
        <p>If we compare each team&apos;s actual tournament wins to the expected wins for their seed, we can measure whether a conference&apos;s teams are systematically over- or under-seeded:</p>

        <DataTable
          headers={['Conference', 'Tourney Entries', 'Avg Seed', 'Actual Avg Wins', 'Expected for Seed', 'Over/Under']}
          alignments={['left', 'right', 'right', 'right', 'right', 'right']}
          rows={[
            ['ACC', '214', '4.9', '1.82', '1.63', <span key="acc" className="text-accent-green font-bold">+0.19</span>],
            ['SEC', '200', '5.9', '1.44', '1.33', <span key="sec" className="text-accent-green">+0.10</span>],
            ['Big East', '223', '5.6', '1.51', '1.45', <span key="be" className="text-accent-green">+0.06</span>],
            ['Big Ten', '236', '5.6', '1.43', '1.43', <span key="b10">+0.01</span>],
            ['Big 12', '159', '5.5', '1.36', '1.48', <span key="b12" className="text-accent-red">-0.11</span>],
            ['Pac-10 (old)', '110', '5.8', '1.28', '1.39', <span key="pac" className="text-accent-red">-0.11</span>],
            ['Mountain West', '65', '8.8', '0.48', '0.80', <span key="mw" className="text-accent-red font-bold">-0.33</span>],
          ]}
        />

        <p>The ACC consistently outperforms its seeding (+0.19 wins per entry), meaning the committee gives ACC teams slightly worse seeds than they deserve. Conversely, the Mountain West is the most &quot;overseeded&quot; conference — their teams win a third of a game less than their seeds would predict.</p>

        <Callout>
          <strong>The Big 12 and old Pac-10 underperform their seeds too.</strong> This suggests the committee may give slight favoritism to certain conferences in the seeding process — or that some conferences&apos; regular-season competition doesn&apos;t prepare teams as well for tournament-style play.
        </Callout>
      </Section>

      {/* FINDING 7: The Variance Story */}
      <Section
        title="Finding 7: The Committee's Uncertainty Grows Exponentially in the Middle"
        tagline="Seeds 5-12 have coefficient of variation over 100% — the committee is essentially guessing within this range"
      >
        <p>The coefficient of variation (standard deviation divided by mean) tells us how &quot;noisy&quot; each seed&apos;s performance is relative to expectations:</p>

        <BarChart
          rows={[
            { label: '#1 seed', value: '50% CV', width: 25, color: 'green' },
            { label: '#2 seed', value: '63% CV', width: 32, color: 'green' },
            { label: '#3 seed', value: '77% CV', width: 39, color: 'orange' },
            { label: '#4 seed', value: '82% CV', width: 41, color: 'orange' },
            { label: '#5 seed', value: '102% CV', width: 51, color: 'red' },
            { label: '#6 seed', value: '107% CV', width: 54, color: 'red' },
            { label: '#7 seed', value: '109% CV', width: 55, color: 'red' },
            { label: '#8 seed', value: '150% CV', width: 75, color: 'red' },
            { label: '#11 seed', value: '153% CV', width: 77, color: 'red' },
          ]}
          caption="Coefficient of variation by seed (higher = more unpredictable relative to expectation)"
        />

        <p>Seeds 1-2 are reasonably well-calibrated (CV around 50-63%). By seed 5, the CV crosses 100% — meaning the standard deviation is larger than the mean. The committee&apos;s predictions for seeds 5-12 contain more noise than signal. In economic terms, the &quot;price&quot; the committee assigns to these middle seeds is barely more informative than random assignment.</p>
      </Section>

      {/* FINDING 8: Biggest Misses */}
      <Section
        title="Finding 8: The Hall of Shame — The Committee's Biggest Misses"
        tagline="Champions who were seeded 6th or worse, and 1-seeds who went home immediately"
      >
        <p><strong>Champions the committee underrated:</strong></p>

        <DataTable
          headers={['Year', 'Champion', 'Seed', 'The Miss']}
          alignments={['left', 'left', 'right', 'left']}
          rows={[
            ['1985', 'Villanova', '#8', 'Won the title as an 8-seed. Still the lowest seed to ever win it all.'],
            ['2014', 'UConn', '#7', 'A 7-seed championship in the modern era. Committee badly mispriced them.'],
            ['1988', 'Kansas', '#6', 'Danny Manning carried a 6-seed to the title.'],
            ['1997', 'Arizona', '#4', 'Beat 3 number-1 seeds en route to the championship.'],
            ['2023', 'UConn', '#4', 'Won every game by double digits — a dominant 4-seed the committee undersold.'],
          ]}
          highlightRows={[0, 1]}
        />

        <p><strong>1-seeds that flamed out earliest:</strong></p>

        <DataTable
          headers={['Year', '1-Seed', 'Result', 'The Miss']}
          alignments={['left', 'left', 'left', 'left']}
          rows={[
            ['2018', 'Virginia', 'Lost in R64 to #16 UMBC', "The committee's #1 overall seed lost by 20 to a 16-seed. Maximum error."],
            ['2023', 'Purdue', 'Lost in R64 to #16 FDU', 'Second 1-vs-16 upset in 6 years. Pattern or fluke?'],
            ['2011', 'Pittsburgh', 'Lost in R32 to #8 Butler', 'Out by the second weekend despite #1 seed.'],
            ['2017', 'Villanova', 'Lost in R32 to #8 Wisconsin', 'Defending champion bounced early.'],
            ['2022', 'Baylor', 'Lost in R32 to #8 UNC', 'Defending champion also bounced early.'],
          ]}
          highlightRows={[0, 1]}
        />
      </Section>

      {/* BOTTOM LINE */}
      <div className="rounded-xl p-8 mt-10 text-white" style={{ background: 'linear-gradient(135deg, #2c1810, #5a2d0c)' }}>
        <h2 className="text-2xl font-bold mb-3">The Expert Fallibility Story</h2>
        <p className="opacity-90 mb-3">The NCAA Selection Committee is a fascinating case study in expert judgment. They get the broad strokes right — 1-seeds are genuinely much better than 16-seeds, and the top 4 seeds win the title 92% of the time. But within that framework, the data reveals persistent, exploitable patterns:</p>
        <p className="opacity-90 mb-3"><strong>1. The committee doesn&apos;t improve over time.</strong> Despite 40 years of feedback and increasingly sophisticated analytics, the first-round upset rate has been flat at ~24-25%. More data hasn&apos;t made the experts better.</p>
        <p className="opacity-90 mb-3"><strong>2. 11-seeds are systematically mispriced.</strong> They outperform 9 and 10 seeds by every measure — average wins, Sweet 16 rate, Final Four appearances. This has been true for 40 years and the committee hasn&apos;t corrected it.</p>
        <p className="opacity-90 mb-3"><strong>3. Mid-range seeds (5-12) are essentially noise.</strong> The coefficient of variation exceeds 100%, meaning the committee&apos;s signal is weaker than the randomness. The distinction between a 5-seed and an 8-seed is not very meaningful.</p>
        <p className="opacity-90 mb-3"><strong>4. Conference bias exists.</strong> ACC teams outperform their seeds; Mountain West and Big 12 teams underperform. The committee appears to apply a subtle brand premium to certain conferences.</p>
        <p className="opacity-90"><strong>The economic lesson:</strong> Expert committees — whether they&apos;re seeding basketball tournaments, rating bonds, or setting policy — tend to be well-calibrated at the extremes but noisy in the middle, prone to status-quo bias, and resistant to self-correction even when feedback is immediate and clear.</p>
      </div>
    </>
  )
}
