import { ReactNode } from 'react'
import StatGrid from '@/components/StatGrid'
import BarChart from '@/components/BarChart'
import Callout from '@/components/Callout'
import DataTable from '@/components/DataTable'
import Section from '@/components/Section'
import Divider from '@/components/Divider'
import VsBlock from '@/components/VsBlock'

export default function ExpertsVsHeuristicsContent() {
  return (
    <>
      {/* KEY STATS */}
      <StatGrid
        stats={[
          { value: '71.4%', label: "Committee's accuracy (higher seed wins)" },
          { value: '64.7%', label: 'Simple win-loss record accuracy' },
          { value: '70.9%', label: 'Best computer algorithm (KenPom)' },
          { value: '87%', label: 'of computer systems scored WORSE than the committee' },
        ]}
      />

      <Divider />

      {/* THE LINEUP */}
      <Section
        title="The Contestants"
        tagline="We pitted the expert committee against five alternative approaches, from sophisticated algorithms to a coin flip"
      >
        <p>Here&apos;s what we tested, ranging from &quot;no information at all&quot; to &quot;team of experts with months of analysis&quot;:</p>

        <DataTable
          headers={['Model', 'What It Uses', 'Expert Knowledge?', 'Accuracy']}
          alignments={['left', 'left', 'left', 'right']}
          rows={[
            [<strong key="m1">Coin Flip</strong>, 'Nothing — pure random', 'None', '50.0%'],
            [<strong key="m2">Win-Loss Record</strong>, 'Just regular season wins', 'None — a child could do this', '64.7%'],
            [<strong key="m3">Point Differential</strong>, 'Average scoring margin per game', 'Minimal — basic arithmetic', '65.2%'],
            [<strong key="m4">Wins vs Tourney Teams</strong>, 'Wins against teams that made the tournament', 'Some — requires knowing the field', '69.1%'],
            [<strong key="m5">KenPom (best algorithm)</strong>, 'Adjusted efficiency ratings, tempo, SOS', 'Sophisticated math, no human bias', '70.9%'],
            [<strong key="m6">Selection Committee</strong>, 'Everything — stats, film, eye test, debate', 'Maximum — panel of experts', '71.4%'],
          ]}
          highlightRows={[4, 5]}
        />
      </Section>

      {/* THE BIG PICTURE */}
      <Section
        title="Finding 1: The Committee Beats Every Simple Rule — But Not by Much"
        tagline={`The experts' edge over "just pick the team with more wins" is 6.7 percentage points`}
      >
        <BarChart
          rows={[
            { label: 'Coin Flip', value: '50.0%', width: 50, color: 'purple' },
            { label: 'Win-Loss Record', value: '64.7%', width: 64.7, color: 'blue' },
            { label: 'Point Differential', value: '65.2%', width: 65.2, color: 'blue' },
            { label: 'Wins vs Tourney Teams', value: '69.1%', width: 69.1, color: 'green' },
            { label: 'Best Computer (KenPom)', value: '70.9%', width: 70.9, color: 'orange' },
            { label: 'Selection Committee', value: '71.4%', width: 71.4, color: 'purple' },
          ]}
        />

        <p>The committee is the best predictor — but the margins are thin. A simple win-loss count, something literally anyone can look up in 30 seconds, gets you to 64.7%. The committee&apos;s months of film study, debate, data analysis, and deliberation add just 6.7 points on top of that.</p>

        <p>Or to put it differently: <strong>about 90% of the committee&apos;s predictive power can be captured by counting wins.</strong> The remaining 10% is where their expertise lives.</p>

        <Callout>
          <strong>The economic framing:</strong> The committee is like an actively managed fund. It does outperform the &quot;index&quot; (simple rules), but the outperformance is modest relative to the cost and complexity. Most of the value comes from the &quot;market&quot; (basic win-loss data), not from expert stock-picking.
        </Callout>
      </Section>

      {/* COMPUTER RANKINGS */}
      <Section
        title="Finding 2: The Best Algorithm Essentially Ties the Committee"
        tagline="KenPom (70.9%) comes within 0.5% of the committee (71.4%) — with zero human judgment"
      >
        <p>We tested all 193 computer ranking systems in the Massey Ordinals database against the committee&apos;s seedings. The results:</p>

        <DataTable
          headers={['Category', 'Count', '% of Systems']}
          alignments={['left', 'right', 'right']}
          rows={[
            [<span key="beat">Systems that <strong>beat</strong> the committee</span>, '7', '13%'],
            [<span key="within">Systems <strong>within 1%</strong> of the committee</span>, '9', '17%'],
            [<span key="trail">Systems that <strong>trail</strong> by more than 1%</span>, '36', '70%'],
          ]}
        />

        <p>Only 7 out of 52 systems with sufficient data beat the committee — which means the committee does add value beyond any single algorithm. But the best algorithms come remarkably close:</p>

        <DataTable
          headers={['System', 'What It Is', 'Accuracy', 'vs Committee']}
          alignments={['left', 'left', 'right', 'right']}
          rows={[
            ['KenPom (POM)', 'Adjusted efficiency — the gold standard of analytics', '70.9%', <span key="pom" className="text-accent-green">+0.1%</span>],
            ['Massey (MOR)', 'Massey Ratings — pure mathematical ranking', '70.6%', '-0.2%'],
            ['Sagarin (SAG)', 'Jeff Sagarin\'s computer rankings', '70.5%', '-0.4%'],
            ['RPI', 'Rating Percentage Index — simple formula', '69.0%', '-1.8%'],
            ['Colley (COL)', 'Colley Matrix — linear algebra approach', '69.0%', '-1.8%'],
          ]}
        />

        <Callout variant="blue">
          <strong>What KenPom tells us:</strong> KenPom uses only two inputs — adjusted offensive efficiency and adjusted defensive efficiency, both corrected for strength of schedule and tempo. That&apos;s it. No film. No &quot;eye test.&quot; No committee debates. Just two numbers per team. And it matches a room full of experts within half a percentage point.
        </Callout>
      </Section>

      {/* THE MARGINAL VALUE OF EXPERTISE */}
      <Section
        title="Finding 3: Expertise Has Diminishing Returns"
        tagline="Going from zero information to basic stats gets you 65% of the way. Everything after that is marginal."
      >
        <p>Think of prediction accuracy as a staircase. Each step represents adding more information or sophistication:</p>

        <BarChart
          rows={[
            { label: 'Step 0: Coin flip', value: '50%', width: 50, color: 'purple' },
            { label: 'Step 1: Count wins (+14.7 pts)', value: '64.7%', width: 64.7, color: 'blue' },
            { label: 'Step 2: Look at margins (+0.5 pts)', value: '65.2%', width: 65.2, color: 'blue' },
            { label: 'Step 3: Consider opponents (+3.9 pts)', value: '69.1%', width: 69.1, color: 'green' },
            { label: 'Step 4: Sophisticated algo (+1.8 pts)', value: '70.9%', width: 70.9, color: 'orange' },
            { label: 'Step 5: Expert committee (+0.5 pts)', value: '71.4%', width: 71.4, color: 'purple' },
          ]}
        />

        <p>The biggest jump is from knowing nothing to counting wins: +14.7 points. After that, each additional layer of sophistication adds less. The jump from the best algorithm to the expert committee is just 0.5 points — the smallest increment on the entire staircase.</p>

        <Callout variant="red">
          <strong>The uncomfortable implication:</strong> If you&apos;re filling out a bracket and all you know is each team&apos;s win-loss record, you&apos;re already capturing about 69% of what the expert committee knows (14.7 of their 21.4-point edge over a coin flip). The last 31% of their edge requires exponentially more knowledge, data, and analysis to achieve.
        </Callout>
      </Section>

      {/* WHEN DO EXPERTS MATTER MOST? */}
      <Section
        title="Finding 4: The Committee's Edge Is Biggest in the First Round and Elite 8"
        tagline="Experts add the most value in rounds with the widest talent gaps"
      >
        <DataTable
          headers={['Round', 'Committee', 'Win-Loss', 'Point Diff', 'Committee Edge over Pt Diff']}
          alignments={['left', 'right', 'right', 'right', 'right']}
          rows={[
            ['Round of 64', '72.9%', '64.7%', '64.9%', <span key="r64" className="text-accent-green font-bold">+8.0%</span>],
            ['Round of 32', '69.3%', '65.5%', '65.2%', <span key="r32" className="text-accent-green">+4.1%</span>],
            ['Sweet 16', '68.9%', '61.5%', '68.0%', <span key="s16">+0.9%</span>],
            ['Elite 8', '71.1%', '61.7%', '59.2%', <span key="e8" className="text-accent-green font-bold">+11.9%</span>],
            ['Final Four', '71.4%', '66.7%', '90.0%', <span key="ff" className="text-accent-red">-18.6%</span>],
          ]}
        />

        <p>In the first round, where 1-seeds face 16-seeds and the talent disparity is obvious, the committee&apos;s seedings are 8 points better than point differential alone. The committee is good at identifying mismatches.</p>

        <p>But in the Final Four — where we&apos;d expect expert judgment to matter most — point differential actually flips and <em>beats</em> the committee. Small sample size caveat applies (only 10 games in the dataset with clear seed differences), but the direction is interesting: when the remaining teams are all elite, the experts&apos; subjective rankings may be less reliable than raw performance data.</p>
      </Section>

      {/* WHEN W-L DISAGREES WITH COMMITTEE */}
      <Section
        title="Finding 5: When Simple Disagrees with Expert, the Expert Usually Wins"
        tagline="But the simple rule is right a third of the time — far more than zero"
      >
        <p>There are 495 tournament games where the win-loss record would have picked a different team than the committee&apos;s seeding. In those contested cases:</p>

        <VsBlock
          left={{ value: '65.7%', label: 'Committee was right', color: 'blue' }}
          right={{ value: '34.3%', label: 'Win-loss record was right', color: 'red' }}
        />

        <p>The committee wins the tiebreaker about two-thirds of the time. This is where their expertise genuinely earns its keep — they&apos;re seeing something (strength of schedule, injuries, conference quality, late-season trends) that a raw win count misses. But a third of the time, the simple metric had it right and the experts were wrong. That&apos;s a meaningful error rate for &quot;the best judgment available.&quot;</p>
      </Section>

      {/* THE 193 SYSTEMS */}
      <Section
        title="Finding 6: Among 193 Computer Systems, Only 7 Beat the Committee"
        tagline="But the algorithms are pure math with no biases, no debates, and no cost"
      >
        <p>The committee outperforms 87% of the computer ranking systems. That&apos;s a legitimate feather in their cap. But consider the economics:</p>

        <Callout variant="green">
          <strong>The committee:</strong> 10 members, months of work, hundreds of hours of film, extensive travel, heated debates, occasional controversies, and exposure to every cognitive bias known to psychology (recency bias, conference brand bias, anchoring to preseason expectations).
        </Callout>

        <Callout variant="blue">
          <strong>KenPom:</strong> Two numbers per team. Runs in seconds. No bias, no fatigue, no politics. Gets within 0.5% of the committee&apos;s accuracy. Year after year.
        </Callout>

        <p>The 7 systems that beat the committee are interesting precisely because they suggest the committee&apos;s errors aren&apos;t random — they&apos;re systematic. A purely mathematical model that ignores brand names, conference prestige, and &quot;eye test&quot; narratives can match or exceed the experts. The committee&apos;s biases (which we documented in our seeding analysis — conference favoritism, the 11-seed anomaly, mid-seed noise) are exactly the kind of errors an algorithm wouldn&apos;t make.</p>
      </Section>

      {/* BOTTOM LINE */}
      <div className="rounded-xl p-8 mt-10 text-white" style={{ background: 'linear-gradient(135deg, #1a1a2e, #2d1b69)' }}>
        <h2 className="text-2xl font-bold mb-3">What Does This Mean?</h2>
        <p className="opacity-90 mb-3">The NCAA Selection Committee is a real-world laboratory for studying expert judgment. After 40 years and 2,518 games, the data tells a clear story:</p>
        <p className="opacity-90 mb-3"><strong>1. Expertise is real but its marginal value is small.</strong> The committee beats every simple rule and most computer systems. But the gap between &quot;count the wins&quot; (64.7%) and &quot;expert committee&quot; (71.4%) is just 6.7 points. Most of the predictive signal is in the basic data, not the expert analysis.</p>
        <p className="opacity-90 mb-3"><strong>2. Algorithms match experts at a fraction of the cost.</strong> KenPom hits 70.9% with two numbers and no human input. The committee&apos;s remaining 0.5% edge comes with enormous cost, complexity, and the introduction of human biases.</p>
        <p className="opacity-90 mb-3"><strong>3. The &quot;casual fan&quot; is closer to the expert than you&apos;d think.</strong> If your friend picks brackets by &quot;going with the team that won more games,&quot; they&apos;ll get about 65% right. The expert gets 71%. The gap is real but narrow — which is why office bracket pools are competitive and why your coworker who &quot;doesn&apos;t even watch basketball&quot; occasionally wins.</p>
        <p className="opacity-90"><strong>4. This mirrors findings across expert domains.</strong> From financial analysts to political forecasters to medical diagnosticians, the pattern repeats: experts outperform simple rules by small margins, algorithms match experts closely, and more information doesn&apos;t proportionally improve accuracy. The NCAA tournament is just a particularly clean dataset to prove it.</p>
      </div>
    </>
  )
}
