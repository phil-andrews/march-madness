import { ReactNode } from 'react'
import StatGrid from '@/components/StatGrid'
import Callout from '@/components/Callout'
import DataTable from '@/components/DataTable'
import Section from '@/components/Section'
import Divider from '@/components/Divider'

function CoachCard({
  seed,
  seedClass,
  name,
  team,
  stats,
  narrative,
}: {
  seed: string
  seedClass: string
  name: string
  team: string
  stats: string[]
  narrative: string
}) {
  const seedColorMap: Record<string, string> = {
    'seed-1': 'bg-[#1B365D]',
    'seed-2': 'bg-[#2E5090]',
    'seed-3': 'bg-[#3A6EA5]',
    'seed-low': 'bg-[#c44e22]',
    'seed-mid': 'bg-[#666]',
  }
  return (
    <div className="flex gap-4 p-4 bg-gray-50 rounded-[10px] mb-3 items-start">
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 ${seedColorMap[seedClass] || 'bg-gray-500'}`}
      >
        {seed}
      </div>
      <div className="flex-1">
        <div className="font-bold text-[#1B365D] text-[1.05em]">{name}</div>
        <div className="text-[#555] text-[0.9em]">{team}</div>
        <div className="flex gap-3 mt-1.5 text-[0.82em] text-[#777] flex-wrap">
          {stats.map((s, i) => (
            <span key={i} className="bg-[#e8ecf1] px-2 py-0.5 rounded">
              {s}
            </span>
          ))}
        </div>
        <div className="mt-2 text-[0.88em] text-[#444]">{narrative}</div>
      </div>
    </div>
  )
}

function Matchup({
  leftName,
  leftDetail,
  leftValue,
  leftSubDetail,
  rightName,
  rightDetail,
  rightValue,
  rightSubDetail,
}: {
  leftName: string
  leftDetail: string
  leftValue: string
  leftSubDetail: string
  rightName: string
  rightDetail: string
  rightValue: string
  rightSubDetail: string
}) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center my-4 p-4 bg-gray-50 rounded-[10px]">
      <div className="text-center">
        <div className="font-bold text-[#1B365D]">{leftName}</div>
        <div className="text-[0.82em] text-[#666]">{leftDetail}</div>
        <div className="text-3xl font-bold text-accent-green">{leftValue}</div>
        <div className="text-[0.82em] text-[#666]">{leftSubDetail}</div>
      </div>
      <div className="text-xl font-bold text-[#999]">vs</div>
      <div className="text-center">
        <div className="font-bold text-[#1B365D]">{rightName}</div>
        <div className="text-[0.82em] text-[#666]">{rightDetail}</div>
        <div className="text-3xl font-bold text-accent-green">{rightValue}</div>
        <div className="text-[0.82em] text-[#666]">{rightSubDetail}</div>
      </div>
    </div>
  )
}

export default function CoachingMap2025Content() {
  return (
    <>
      {/* Quick Context */}
      <StatGrid
        stats={[
          { value: '16', label: 'First-time tournament coaches in the 2025 field' },
          { value: '4', label: 'Top-4 seeds with 2 or fewer prior tournament apps' },
          { value: '57', label: 'Prior tourney wins each for Calipari & Self — most in the field' },
          { value: '6', label: 'Coaches at new schools vs. where they built their tournament resumes' },
        ]}
      />

      <Divider />

      {/* STORY 1: Vulnerable Top Seeds */}
      <Section
        title="The Inexperienced 1-Seeds"
        tagline="Two of the four 1-seeds have coaches with minimal tournament track records — history says that matters"
      >
        <p>Our historical analysis found that among 1-4 seeds, coaches with 15+ prior appearances reach the Sweet 16 at 49% compared to 31% for first-timers. This year, two 1-seeds fall squarely in the &quot;thin resume&quot; camp:</p>

        <CoachCard
          seed="#1"
          seedClass="seed-1"
          name="Todd Golden — Florida"
          team="South Region 1-seed"
          stats={['2 prior apps', '0 prior wins', '0 Sweet 16s']}
          narrative="Golden has taken Florida to the tournament twice before but has yet to win a game. He's a 1-seed with the experience profile of a 13-seed coach. Historically, first-time and near-first-time coaches as 1-seeds average 1.84 wins — over a full win less than veterans in the same position (2.66)."
        />

        <CoachCard
          seed="#1"
          seedClass="seed-1"
          name="Jon Scheyer — Duke"
          team="West Region 1-seed"
          stats={['2 prior apps', '4 prior wins', '1 Sweet 16']}
          narrative="Scheyer inherited the Duke throne from Coach K (101 tournament wins, 5 titles). He made a Sweet 16 in year one, so the 4 prior wins help. But he's still working with a fraction of the resume his predecessor carried. The question: is Duke's brand and recruiting machine enough to offset the experience gap?"
        />

        <p>Compare those to the other two 1-seeds:</p>

        <CoachCard
          seed="#1"
          seedClass="seed-1"
          name="Kelvin Sampson — Houston"
          team="East Region 1-seed"
          stats={['19 prior apps', '26 prior wins', '2 Final Fours']}
          narrative="Sampson is exactly the kind of coach our model loves. He's been to the tournament 19 times across Oklahoma, Indiana, and Houston. He knows how to prepare for single-elimination basketball. Our data shows coaches in his experience bracket (15-19 apps) average 2.22 wins per tournament."
        />

        <CoachCard
          seed="#1"
          seedClass="seed-1"
          name="Bruce Pearl — Auburn"
          team="South Region 1-seed"
          stats={['13 prior apps', '17 prior wins', '1 Final Four']}
          narrative="Pearl sits solidly in the 'experienced' tier. His 13 appearances span Milwaukee, Tennessee, and Auburn, with a Final Four on his resume. Strong profile for a 1-seed."
        />

        <Callout variant="red">
          <strong>The data says:</strong> If you&apos;re picking upsets among the 1-seeds, Florida (Golden, 0 prior wins) is the most historically vulnerable by coaching experience. Houston (Sampson) has the strongest coaching edge.
        </Callout>
      </Section>

      {/* STORY 2: The Legends on Lower Seeds */}
      <Section
        title="Hall of Famers Lurking as Low Seeds"
        tagline="Some of the most tournament-tested coaches in history are sitting on 7-10 seeds — our data says watch out"
      >
        <p>This might be the most fascinating angle in the entire bracket. Our analysis found that low seeds (9-12) with 15+ prior tournament appearances reach the Sweet 16 at 13% — nearly triple the rate of first-timers. This year, three coaches with 50+ career tournament wins are seeded 7th or lower:</p>

        <CoachCard
          seed="#10"
          seedClass="seed-low"
          name="John Calipari — Arkansas"
          team="Midwest Region 10-seed"
          stats={['23 prior apps', '57 prior wins', '6 Final Fours', '1 Title']}
          narrative="Calipari has the most prior tournament wins in the field, tied with Bill Self. But he's a 10-seed. A 10-seed coached by someone with 57 tournament wins and 6 Final Fours is historically unusual. He's at a new school (Arkansas, after decades at Kentucky), which adds uncertainty — but the man knows March. He'll face a 7-seed in round one (Kansas, coached by Self — see below)."
        />

        <CoachCard
          seed="#7"
          seedClass="seed-low"
          name="Bill Self — Kansas"
          team="Midwest Region 7-seed"
          stats={['25 prior apps', '57 prior wins', '4 Final Fours', '2 Titles']}
          narrative="Self is a 7-seed with 2 national championships. Kansas as a 7 is already strange, but Self's experience is off the charts. Our data shows coaches with 30+ prior wins reach the Sweet 16 at 40%. A 7-seed coached by a two-time champion is a bracket buster waiting to happen."
        />

        <Matchup
          leftName="Bill Self"
          leftDetail="Kansas, #7 seed"
          leftValue="57 wins"
          leftSubDetail="25 apps, 2 titles"
          rightName="John Calipari"
          rightDetail="Arkansas, #10 seed"
          rightValue="57 wins"
          rightSubDetail="23 apps, 1 title"
        />

        <Callout variant="amber">
          <strong>The marquee coaching matchup of the first round:</strong> Kansas (7) vs Arkansas (10) features a combined 114 prior tournament wins, 10 Final Fours, and 3 national championships between the two coaches. This is a coaching experience heavyweight bout disguised as a 7-vs-10 game.
        </Callout>

        <CoachCard
          seed="#2"
          seedClass="seed-2"
          name="Rick Pitino — St. John's"
          team="Midwest Region 2-seed"
          stats={['22 prior apps', '54 prior wins', '7 Final Fours', '2 Titles']}
          narrative="Pitino is technically a 2-seed, not a low seed — but what makes his entry remarkable is the school. St. John's hasn't been a tournament force in decades. Pitino brings 54 tournament wins and 7 Final Four appearances from Providence, Kentucky, Louisville, and Iona. This is the most experienced coach-at-a-new-program story since Calipari went to Kentucky."
        />

        <CoachCard
          seed="#8"
          seedClass="seed-low"
          name="Mark Few — Gonzaga"
          team="East Region 8-seed"
          stats={['24 prior apps', '43 prior wins', '2 Final Fours']}
          narrative="Few has taken Gonzaga to the tournament 24 times and racked up 43 wins. An 8-seed with this kind of coaching pedigree is dangerous. Our data shows that 8-vs-9 games are nearly 50/50 by seed, but coaching experience could be the tiebreaker."
        />
      </Section>

      {/* STORY 3: The New School Effect */}
      <Section
        title="The Transfer Portal — Coach Edition"
        tagline="Six experienced coaches are at new programs — does their experience travel?"
      >
        <p>One of the most interesting open questions: when a coach moves to a new school, does their tournament experience still provide an edge? Or is it tied to the program and players they built it with?</p>

        <DataTable
          headers={['Coach', 'Now At', 'Seed', 'Built Resume At', 'Prior Apps', 'Prior Wins']}
          alignments={['left', 'left', 'right', 'left', 'right', 'right']}
          rows={[
            [<strong key="c1">John Calipari</strong>, 'Arkansas', '#10', 'Kentucky, Memphis, UMass', '23', '57'],
            [<strong key="c2">Rick Pitino</strong>, 'St. John\'s', '#2', 'Kentucky, Louisville, Providence, Iona', '22', '54'],
            [<strong key="c3">Chris Beard</strong>, 'Mississippi', '#6', 'Texas Tech, Texas', '5', '11'],
            [<strong key="c4">Dusty May</strong>, 'Michigan', '#5', 'Florida Atlantic', '2', '4'],
            [<strong key="c5">Porter Moser</strong>, 'Oklahoma', '#9', 'Loyola Chicago', '2', '6'],
            [<strong key="c6">Mark Pope</strong>, 'Kentucky', '#3', 'BYU', '2', '0'],
          ]}
        />

        <p>Calipari and Pitino are the headliners. Both left blue-blood programs and took their resumes to new schools. Pitino&apos;s track record actually suggests his experience does travel — he&apos;s made deep runs at 5 different programs. Calipari is the inverse test: does the greatest Kentucky coach of the modern era still know how to win in March without Kentucky&apos;s talent pipeline?</p>

        <Callout variant="green">
          <strong>Dusty May watch:</strong> May took Florida Atlantic to the Final Four in 2023 as a first-time tournament coach. He fits the &quot;Cinderella coach&quot; profile from our analysis — young, hungry, and now at Michigan with better talent. Does that combination of Cinderella magic plus upgraded roster make Michigan dangerous?
        </Callout>
      </Section>

      {/* STORY 4: Dan Hurley */}
      <Section
        title="The Defending Champion"
        tagline="Dan Hurley has more recent titles than almost anyone — but he's an 8-seed"
      >
        <CoachCard
          seed="#8"
          seedClass="seed-low"
          name="Dan Hurley — UConn"
          team="Midwest Region 8-seed"
          stats={['6 prior apps', '14 prior wins', '2 Final Fours', '2 Titles (back-to-back)']}
          narrative="Hurley won back-to-back national championships in 2023 and 2024. His 14 prior wins in just 6 appearances translates to 2.33 wins per trip — one of the highest rates in the field. Only 6 total appearances means his raw count is lower than the legends, but his efficiency is elite. An 8-seed with 2 consecutive titles is almost unprecedented."
        />
      </Section>

      {/* STORY 5: Shaka Smart's Return */}
      <Section
        title="The Cinderella Who Became an Established Coach"
        tagline="Shaka Smart was the poster child for first-time coaches making deep runs — now he's a veteran"
      >
        <CoachCard
          seed="#7"
          seedClass="seed-mid"
          name="Shaka Smart — Marquette"
          team="South Region 7-seed"
          stats={['11 prior apps', '10 prior wins', '1 Final Four']}
          narrative="In 2011, Smart took VCU to the Final Four as an 11-seed in his first tournament appearance — one of the top Cinderella stories in our data. Now at Marquette with 11 tournament appearances, he's crossed into the 'experienced' tier. His career arc is the perfect illustration of how tournament experience compounds over time."
        />
      </Section>

      {/* STORY 6: Tom Izzo */}
      <Section
        title="Mr. March"
        tagline="Tom Izzo's tournament record may be the most remarkable in the field"
      >
        <CoachCard
          seed="#2"
          seedClass="seed-2"
          name="Tom Izzo — Michigan State"
          team="South Region 2-seed"
          stats={['26 prior apps', '56 prior wins', '8 Final Fours', '1 Title']}
          narrative="Izzo has taken Michigan State to 8 Final Fours — more than anyone in the 2025 field. His 56 prior wins across 26 appearances (2.15 per trip) is remarkably consistent. As a 2-seed with the most Final Four appearances in the bracket, our model gives him one of the strongest coaching edges in the tournament."
        />
      </Section>

      {/* BOTTOM LINE */}
      <div className="rounded-xl p-8 mt-10 text-white" style={{ background: 'linear-gradient(135deg, #1B365D, #2E5090)' }}>
        <h2 className="text-2xl font-bold mb-3">What This Means for Your Bracket</h2>
        <p className="opacity-90 mb-3"><strong>If coaching experience is a factor (and our data says it is), here are the actionable takeaways:</strong></p>
        <p className="opacity-90 mb-3"><strong>Fade Florida as a 1-seed.</strong> Todd Golden&apos;s 0 prior tournament wins makes this the most historically vulnerable 1-seed by coaching experience. Houston (Sampson, 26 wins) is the safest.</p>
        <p className="opacity-90 mb-3"><strong>Kansas-Arkansas is a trap game for everyone.</strong> Whoever wins the 7-vs-10 matchup between Self (57 wins) and Calipari (57 wins) could make a deep run — this isn&apos;t a normal low-seed first round game.</p>
        <p className="opacity-90 mb-3"><strong>Don&apos;t sleep on Gonzaga (Few), UConn (Hurley), or Baylor (Drew) as 8/9 seeds.</strong> All three coaches have prior Final Fours or titles. In what are essentially coin-flip games by seed, coaching experience could be the deciding edge.</p>
        <p className="opacity-90 mb-3"><strong>St. John&apos;s (Pitino) as a 2-seed with 54 prior wins is dangerous.</strong> Pitino&apos;s experience travels to new programs — he&apos;s proved it repeatedly.</p>
        <p className="opacity-90"><strong>Mark Pope at Kentucky (3-seed) is a question mark.</strong> He has 0 prior tournament wins and is at a new (very high-pressure) program. A 3-seed coached by someone with zero tournament wins is in the &quot;vulnerable&quot; zone.</p>
      </div>
    </>
  )
}
