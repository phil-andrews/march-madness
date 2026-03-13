import StatGrid from '@/components/StatGrid';
import BarChart from '@/components/BarChart';
import Callout from '@/components/Callout';
import DataTable from '@/components/DataTable';
import Section from '@/components/Section';
import Divider from '@/components/Divider';

export default function CoachingMeetsSeedingContent() {
  return (
    <>
      <StatGrid
        stats={[
          { value: '+0.20', label: 'Wins above seed expectation for coaches with 15+ prior tournament apps', color: 'green' },
          { value: '37.6%', label: 'Upset rate when the underdog has the more experienced coach', color: 'green' },
          { value: '26.1%', label: 'Upset rate when the underdog does NOT have the coaching edge', color: 'red' },
          { value: '+11.5 pts', label: 'The coaching experience "bump" to upset probability', color: 'blue' },
        ]}
      />

      <Divider />

      {/* FINDING 1 */}
      <Section
        title="Finding 1: The Committee Doesn't Fully Price In Coaching Experience"
        tagline="Veteran coaches consistently outperform their seeds — meaning the committee systematically undervalues their impact"
      >
        <p>If the committee properly accounted for coaching experience in their seedings, experienced coaches should perform roughly in line with their seed — not better, not worse. Instead, veteran coaches consistently beat their expected win total:</p>

        <DataTable
          headers={['Coach Experience', 'Count', 'Avg Seed', 'Expected Wins (for seed)', 'Actual Wins', 'Over/Under Seed']}
          alignments={['left', 'right', 'right', 'right', 'right', 'right']}
          highlightRows={[3, 4]}
          rows={[
            ['First-timers', '634', '11.7', '0.53', '0.52', '-0.01'],
            ['2-4 prior apps', '1,093', '9.1', '0.87', '0.86', '-0.01'],
            ['5-9 prior apps', '468', '6.3', '1.34', '1.27', '-0.07'],
            [<strong key="e1">10-14 prior apps</strong>, '203', '5.4', '1.50', <strong key="v1">1.60</strong>, <span key="o1" className="text-accent-green font-bold">+0.10</span>],
            [<strong key="e2">15+ prior apps</strong>, '159', '4.4', '1.86', <strong key="v2">2.06</strong>, <span key="o2" className="text-accent-green font-bold">+0.19</span>],
          ]}
        />

        <p>The pattern is clear: coaches with 10+ prior tournament appearances outperform their seed by a meaningful margin. The 15+ group exceeds expectations by nearly a fifth of a win per tournament. That might sound small, but across 159 entries, it represents a consistent, systematic gap between the committee&apos;s assessment and reality.</p>

        <Callout>
          <strong>What this means:</strong> The committee looks at a team&apos;s record, their conference, their key wins and losses, and metrics like NET and KenPom — but coaching experience appears to carry additional predictive value that isn&apos;t captured in the seed. A 4-seed coached by Tom Izzo is not the same as a 4-seed coached by a first-timer, but the committee prices them identically.
        </Callout>
      </Section>

      {/* FINDING 2 */}
      <Section
        title="Finding 2: The Effect Holds After Controlling for Seed"
        tagline="Even among teams with the SAME seed, veteran coaches outperform first-timers"
      >
        <p>The obvious pushback is that experienced coaches simply coach at better programs and therefore get better seeds. So we controlled for it — looking at performance within each seed tier:</p>

        <DataTable
          headers={['Coach Experience', 'Count', 'Avg Seed', 'Actual Wins', 'Over/Under Seed']}
          headerColor="Seeds 1-4 (the committee's top picks)"
          alignments={['left', 'right', 'right', 'right', 'right']}
          highlightRows={[4]}
          rows={[
            ['First-timers', '45', '2.8', '1.84', <span key="s14a" className="text-accent-red">-0.23</span>],
            ['2-4 prior apps', '204', '2.7', '2.10', '-0.06'],
            ['5-9 prior apps', '182', '2.5', '2.23', '-0.04'],
            ['10-14 prior apps', '91', '2.4', '2.42', <span key="s14b" className="text-accent-green">+0.10</span>],
            [<strong key="s14c">15+ prior apps</strong>, '102', '2.2', <strong key="s14d">2.66</strong>, <span key="s14e" className="text-accent-green font-bold">+0.20</span>],
          ]}
        />

        <p className="mt-4">Among 1-4 seeds specifically, first-time coaches <strong>underperform</strong> their seed by -0.23 wins, while 15+ veterans <strong>outperform</strong> by +0.20 wins. The gap between a first-timer and a veteran with identical seedings is 0.43 wins — nearly half a game. Over a tournament, that&apos;s the difference between an Elite 8 exit and a Final Four.</p>

        <DataTable
          headers={['Coach Experience', 'Count', 'Actual Wins', 'Over/Under Seed']}
          headerColor="Seeds 9-12 (the upset zone)"
          alignments={['left', 'right', 'right', 'right']}
          highlightRows={[2, 3]}
          rows={[
            ['First-timers', '169', '0.66', '+0.06'],
            ['2-4 prior apps', '306', '0.55', '-0.06'],
            [<strong key="uz1">10-14 prior apps</strong>, '35', <strong key="uz2">0.83</strong>, <span key="uz3" className="text-accent-green font-bold">+0.20</span>],
            [<strong key="uz4">15+ prior apps</strong>, '23', <strong key="uz5">0.87</strong>, <span key="uz6" className="text-accent-green font-bold">+0.22</span>],
          ]}
        />

        <p className="mt-4">The effect is even stronger in the upset zone. A 9-12 seed with a veteran coach (15+ apps) wins nearly twice as many games as a typical 9-12 seed. The committee treats them identically.</p>
      </Section>

      {/* FINDING 3 */}
      <Section
        title="Finding 3: Coaching Experience Is Worth 11.5 Points of Upset Probability"
        tagline="When the underdog has the more experienced coach, the upset rate jumps from 26% to 38%"
      >
        <p>This is perhaps the most actionable finding. When the lower-seeded team (the &quot;underdog&quot; in the committee&apos;s eyes) has the coaching experience advantage:</p>

        <BarChart
          rows={[
            { label: 'Underdog has coaching edge', value: '37.6% upset rate', width: 37.6, color: 'green' },
            { label: 'Underdog has no coaching edge', value: '26.1% upset rate', width: 26.1 },
          ]}
        />

        <p>That 11.5-point gap is enormous. The baseline upset rate in the tournament is about 27%. When the underdog has the coaching edge, it jumps to nearly 38% — meaning the game is closer to a toss-up than a safe pick for the higher seed.</p>

        <p>When the underdog&apos;s experience edge is large (5+ more prior appearances), the numbers get even more dramatic:</p>

        <BarChart
          rows={[
            { label: '5-9 more apps than opponent', value: '44.8% upset rate', width: 44.8, color: 'green' },
            { label: '10+ more apps than opponent', value: '44.0% upset rate', width: 44.0, color: 'green' },
          ]}
        />

        <p>When the underdog has 5+ more prior tournament appearances than the favored team, the upset rate is essentially a coin flip at 44-45%. The committee&apos;s seeding says one team is better. The coaching experience data says it&apos;s nearly even.</p>

        <Callout variant="red">
          <strong>The pricing error:</strong> The committee&apos;s seed implies the higher-seeded team should win ~73% of first-round games. But when the lower seed has a significant coaching experience edge, that drops to about 55%. That&apos;s an 18-point gap between the implied probability and the actual probability — a massive mispricing by any standard.
        </Callout>
      </Section>

      {/* FINDING 4 */}
      <Section
        title="Finding 4: The Committee's Greatest Coaching Misses"
        tagline="Experienced coaches seeded 7th or worse who made deep runs the committee didn't see coming"
      >
        <DataTable
          headers={['Year', 'Team', 'Coach', 'Seed', 'Prior Apps', 'Result']}
          alignments={['left', 'left', 'left', 'right', 'right', 'left']}
          highlightRows={[0, 1]}
          rows={[
            ['2014', 'Kentucky', 'John Calipari', '#8', '14', 'Title Game'],
            ['2021', 'UCLA', 'Mick Cronin', '#11', '11', 'Title Game'],
            ['2015', 'Michigan St', 'Tom Izzo', '#7', '17', 'Final Four'],
            ['2016', 'Syracuse', 'Jim Boeheim', '#10', '25', 'Final Four'],
            ['2013', 'Wichita St', 'Gregg Marshall', '#9', '8', 'Final Four'],
            ['2022', 'Miami FL', 'Jim Larranaga', '#10', '9', 'Elite 8'],
            ['2018', 'Syracuse', 'Jim Boeheim', '#11', '26', 'Elite 8'],
            ['2012', 'Florida', 'Billy Donovan', '#7', '11', 'Elite 8'],
          ]}
        />

        <p>The 2016 Syracuse story is the perfect illustration: Jim Boeheim had been to 25 tournaments, more than almost anyone in history. The committee gave him a 10-seed. He took that team to the Final Four. A 10-seed coached by a first-timer reaching the Final Four would be a miracle. A 10-seed coached by Boeheim? The data says it was more likely than the committee priced it.</p>
      </Section>

      {/* FINDING 5 */}
      <Section
        title="Finding 5: The Committee DOES Give Better Seeds to Experienced Coaches — Just Not Enough"
        tagline="Experienced coaches average a 4.4 seed vs 11.7 for first-timers. But they still outperform it."
      >
        <p>It&apos;s not that the committee completely ignores coaching. Experienced coaches tend to be at better programs, win more games, and therefore earn better seeds organically. The committee does give veterans better seeds on average:</p>

        <BarChart
          rows={[
            { label: 'First-timers', value: 'Avg seed: 11.7', width: 73 },
            { label: '2-4 prior apps', value: 'Avg seed: 9.1', width: 57, color: 'blue' },
            { label: '5-9 prior apps', value: 'Avg seed: 6.3', width: 39, color: 'blue' },
            { label: '10-14 prior apps', value: 'Avg seed: 5.4', width: 34, color: 'blue' },
            { label: '15+ prior apps', value: 'Avg seed: 4.4', width: 28, color: 'green' },
          ]}
        />

        <p>But the seeds don&apos;t go far enough. Veteran coaches consistently outperform even these better seeds, meaning there&apos;s residual coaching value the committee isn&apos;t capturing. The committee is essentially saying &quot;this team deserves a 4-seed based on their resume&quot; when the coaching factor would justify a 3-seed.</p>
      </Section>

      {/* BOTTOM LINE */}
      <div className="bg-nora-atlas text-white rounded-xl p-8 mt-10">
        <h2 className="text-2xl font-bold mb-3">The Combined Story</h2>
        <p className="opacity-90 mb-3">When we layer coaching experience on top of the seeding analysis, a clear picture emerges:</p>
        <p className="opacity-90 mb-3"><strong>The committee seeds based on team resumes, not coaching resumes.</strong> They look at wins, losses, strength of schedule, and metrics. Coaching experience is correlated with these inputs (good coaches build good programs), so it&apos;s partially captured. But there&apos;s a residual coaching effect — worth about +0.20 wins for veterans — that the committee consistently misses.</p>
        <p className="opacity-90 mb-3"><strong>This creates a systematic, exploitable edge.</strong> When you see a low-seeded team coached by a veteran, the committee&apos;s seed is underpricing their chances. The upset rate in these situations jumps from 26% to 38%. That&apos;s not a marginal edge — it&apos;s the difference between a safe pick and a near coin flip.</p>
        <p className="opacity-90"><strong>For your bracket:</strong> Look for experienced coaches on low seeds and bet on them more than the seed implies you should. Look for first-time coaches on high seeds and fade them slightly. The committee treats all teams within a seed as equal. The data says coaching experience breaks that tie decisively.</p>
      </div>
    </>
  );
}
