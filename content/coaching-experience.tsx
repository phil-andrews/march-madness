import StatGrid from '@/components/StatGrid'
import BarChart from '@/components/BarChart'
import Callout from '@/components/Callout'
import DataTable from '@/components/DataTable'
import Section from '@/components/Section'
import Divider from '@/components/Divider'
import VsBlock from '@/components/VsBlock'
import CinderellaCard from '@/components/CinderellaCard'

export default function CoachingExperienceContent() {
  return (
    <>
      {/* KEY STATS */}
      <StatGrid
        stats={[
          { value: '65.8%', label: 'Win rate for the more experienced coach in head-to-head matchups' },
          { value: '4.3x', label: 'Veterans (15+ apps) reach the Sweet 16 at 4.3x the rate of first-timers' },
          { value: '2.22', label: 'Avg tournament wins for 15-19 app coaches vs 0.52 for first-timers' },
          { value: '~50%', label: 'of the experience effect persists even after controlling for seed' },
        ]}
      />

      <Divider />

      {/* FINDING 1 */}
      <Section
        title="Finding 1: Raw Experience Strongly Predicts Success"
        tagline="Coaches with 15-19 prior tournament appearances average 4x the wins of first-timers"
      >
        <p>The raw numbers are striking. A coach making their first NCAA Tournament appearance averages just 0.52 wins and only reaches the Sweet 16 about 4% of the time. That climbs steadily with experience, peaking at the 15-19 appearance bracket where coaches average 2.22 wins and reach the Sweet 16 nearly 40% of the time.</p>

        <BarChart
          rows={[
            { label: 'First appearance', value: '0.52 wins', width: 23, color: 'blue' },
            { label: '2-4 prior apps', value: '0.86 wins', width: 39, color: 'blue' },
            { label: '5-9 prior apps', value: '1.27 wins', width: 57, color: 'blue' },
            { label: '10-14 prior apps', value: '1.60 wins', width: 72, color: 'blue' },
            { label: '15-19 prior apps', value: '2.22 wins', width: 100, color: 'green' },
            { label: '20+ prior apps', value: '1.86 wins', width: 84, color: 'blue' },
          ]}
        />

        <Callout variant="amber">
          <strong>Diminishing returns after 20+ appearances?</strong> The 20+ group dips slightly to 1.86 wins. Possible explanations: aging coaches past their peak, smaller sample (n=71), or regression to the mean. But 20+ coaches still massively outperform first-timers.
        </Callout>
      </Section>

      {/* FINDING 2 */}
      <Section
        title="Finding 2: Experience Still Matters After Controlling for Seed"
        tagline="Among top 4 seeds, veteran coaches reach the Sweet 16 at 49% vs 31% for first-timers"
      >
        <p>The obvious objection is that experienced coaches simply have better teams (lower seeds). So we controlled for that. Among seeds 1-4 specifically, the effect persists clearly:</p>

        <DataTable
          headers={['Experience (Seeds 1-4 only)', 'Count', 'Avg Wins', 'Win 1+ Game', 'Sweet 16+']}
          alignments={['left', 'right', 'right', 'right', 'right']}
          rows={[
            ['First-timers', '45', '1.84', '84%', '31%'],
            ['2-5 prior apps', '204', '2.10', '88%', '34%'],
            ['5-14 prior apps', '273', '2.29', '89%', '38%'],
            [<strong key="exp">15+ apps (veterans)</strong>, <strong key="count">102</strong>, <strong key="wins">2.66</strong>, <strong key="w1">92%</strong>, <strong key="s16">49%</strong>],
          ]}
          highlightRows={[3]}
        />

        <p>Even when the seed is the same, veteran coaches squeeze out roughly half a win more on average. This suggests experience provides an independent edge beyond just talent — likely through game preparation, timeout management, halftime adjustments, and handling pressure moments.</p>

        <Callout variant="blue">
          <strong>The mid-seed plateau:</strong> Interestingly, for seeds 5-8 and 9-12, the experience effect is weaker and noisier. The biggest edge shows up at the extremes — top seeds where veterans maximize their advantage, and the 15+ veteran underdogs in the 9-12 range who reach the Sweet 16 at 13% vs 5% for first-timers.
        </Callout>
      </Section>

      {/* FINDING 3 */}
      <Section
        title="Finding 3: Head-to-Head, the More Experienced Coach Usually Wins"
        tagline="The coach with more tournament appearances wins 65.8% of matchups"
      >
        <VsBlock
          left={{ value: '65.8%', label: 'More experienced coach wins\n(1,444 games)', color: 'green' }}
          right={{ value: '34.2%', label: 'Less experienced coach wins\n(752 games)', color: 'red' }}
        />

        <p>Across 2,196 tournament games where the two coaches had different experience levels, the more experienced coach won nearly two-thirds of the time. This is a large sample and a large effect — though it&apos;s partially confounded by seed (experienced coaches tend to have better-seeded teams).</p>
      </Section>

      {/* FINDING 4 */}
      <Section
        title="Finding 4: Prior Wins Matter More Than Prior Appearances"
        tagline="Coaches with 30+ prior tournament wins reach the Sweet 16 at 40% vs 4% for those with zero"
      >
        <p>Simply showing up to the tournament isn&apos;t the whole story. Coaches who have actually <em>won</em> tournament games perform dramatically better. This makes intuitive sense — winning in March requires specific skills (adjusting to unfamiliar opponents, managing single-elimination pressure) that only come from doing it successfully.</p>

        <BarChart
          rows={[
            { label: '0 prior wins', value: '4.3%', width: 10.7, color: 'red' },
            { label: '1-5 prior wins', value: '11.0%', width: 27.3, color: 'orange' },
            { label: '6-15 prior wins', value: '19.6%', width: 48.6, color: 'blue' },
            { label: '16-30 prior wins', value: '27.0%', width: 67, color: 'blue' },
            { label: '30+ prior wins', value: '40.3%', width: 100, color: 'green' },
          ]}
          caption="Sweet 16 appearance rate by coach's prior tournament win total"
        />
      </Section>

      {/* FINDING 5 */}
      <Section
        title="Finding 5: Cinderella Runs CAN Happen with First-Time Coaches"
        tagline="Some of the most memorable runs came from coaches in their first or second tournament"
      >
        <p>While experience helps on average, the exceptions are some of March Madness&apos;s greatest stories. These coaches made deep runs as low seeds with little or no prior tournament experience:</p>

        <CinderellaCard seed={11} team="VCU (2011) — Shaka Smart" detail="First tournament appearance as head coach" result="Final Four" />
        <CinderellaCard seed={9} team="Florida Atlantic (2023) — Dusty May" detail="First tournament appearance as head coach" result="Final Four" />
        <CinderellaCard seed={11} team="George Mason (2006) — Jim Larranaga" detail="2 prior tournament appearances" result="Final Four" />
        <CinderellaCard seed={11} team="Loyola Chicago (2018) — Porter Moser" detail="First tournament appearance as head coach" result="Final Four" />
        <CinderellaCard seed={15} team="St. Peter's (2022) — Shaheen Holloway" detail="First tournament appearance as head coach" result="Elite Eight" />
        <CinderellaCard seed={10} team="Gonzaga (1999) — Dan Monson" detail="First tournament appearance as head coach" result="Elite Eight" />

        <Callout>
          <strong>The pattern:</strong> Cinderella coaches tend to be young, hungry, and have nothing to lose. They often get hired away to bigger programs immediately after their run (Shaka Smart to Texas, Dusty May to Michigan, Shaheen Holloway to Seton Hall). The lack of experience may actually help — opponents have less film and scouting data on their systems.
        </Callout>
      </Section>

      {/* FINDING 6 */}
      <Section
        title="The Mount Rushmore of March"
        tagline="Top 15 coaches by total tournament appearances, 1985-2024"
      >
        <DataTable
          headers={['Coach', 'Appearances', 'Tournament Wins', 'Championships', 'Win Rate']}
          alignments={['left', 'right', 'right', 'right', 'right']}
          rows={[
            ['Mike Krzyzewski', '35', '101', '5', '2.89/app'],
            ['Roy Williams', '30', '79', '3', '2.63/app'],
            ['Jim Boeheim', '29', '57', '1', '1.97/app'],
            ['Rick Barnes', '28', '30', '0', '1.07/app'],
            ['Tom Izzo', '26', '56', '1', '2.15/app'],
            ['Bob Huggins', '26', '34', '0', '1.31/app'],
            ['Bill Self', '25', '57', '2', '2.28/app'],
            ['Mark Few', '24', '43', '0', '1.79/app'],
            ['Lute Olson', '23', '39', '1', '1.70/app'],
            ['John Calipari', '23', '57', '1', '2.48/app'],
            ['Rick Pitino', '22', '54', '2', '2.45/app'],
            ['Jim Calhoun', '20', '48', '3', '2.40/app'],
            ['Lon Kruger', '20', '22', '0', '1.10/app'],
            ['Bob Knight', '19', '24', '1', '1.26/app'],
            ['Kelvin Sampson', '19', '26', '0', '1.37/app'],
          ]}
        />
        <p className="text-sm text-nora-grey text-center">Coach K&apos;s 101 tournament wins across 35 appearances is absurd — nearly 3 wins per trip, meaning his <em>average</em> tournament ended in the Sweet 16.</p>
      </Section>

      {/* BOTTOM LINE */}
      <div className="rounded-xl p-8 mt-10 text-white" style={{ background: 'linear-gradient(135deg, #1B365D, #2E5090)' }}>
        <h2 className="text-2xl font-bold mb-3">The Bottom Line for Our Model</h2>
        <p className="opacity-90 mb-3"><strong>Coach tournament experience should be a feature in our predictive model.</strong> Prior tournament wins and prior tournament appearances both show meaningful signal, even after controlling for seed. The effect is strongest for top seeds (where the gap between a veteran and first-timer is about half a win per tournament) and weakest for mid-seeds.</p>
        <p className="opacity-90 mb-3">Recommended features to include: prior tournament appearances, prior tournament wins, prior deep runs (Sweet 16+), and whether the coach has ever won a championship. Prior wins appear more predictive than raw appearances.</p>
        <p className="opacity-90">One caveat: coach experience is likely correlated with program strength and recruiting, so its independent contribution in a multivariate model may be smaller than these bivariate numbers suggest. We&apos;ll test that in the next phase.</p>
      </div>
    </>
  )
}
