import { useState, useRef, useMemo } from 'react';
import { createFileRoute, Link, useNavigate, useSearch } from '@tanstack/react-router';
import { Container } from '../components/layout/Container';
import { RosterInput } from '../components/divider/RosterInput';
import { DividerControls } from '../components/divider/DividerControls';
import { DividedTeamsGrid } from '../components/divider/DividedTeamsGrid';
import { DividerActions } from '../components/divider/DividerActions';
import { Showcase, ScenarioPreset } from '../components/divider/Showcase';
import { HowToSection } from '../components/seo/HowToSection';
import { FaqSection } from '../components/seo/FaqSection';
import { EditorialContent } from '../components/seo/EditorialContent';
import { SchemaScript } from '../components/seo/SchemaScript';
import { InternalLinkHub } from '../components/seo/InternalLinkHub';
import { divideTeams, parseTiersInput } from '../lib/team-divider';
import { DividerMode, TeamResult, PlayerTier } from '../data/types';
import { Trophy, ShieldCheck, Zap, Lock, Layers } from 'lucide-react';

const DEFAULT_SAMPLE_NAMES = [
  'Alex', 'Blake', 'Chris', 'Dana', 'Evan',
  'Frank', 'Grace', 'Henry', 'Ivy', 'Jack'
];

const HOME_FAQ_ITEMS = [
  {
    question: 'How does the random team generator ensure complete fairness?',
    answer: 'We utilize the unbiased Fisher-Yates (Knuth) shuffling algorithm. Each participant has an equal mathematical likelihood of being assigned to any group, removing human favoritism and selection bias entirely.',
  },
  {
    question: 'What happens if participant numbers do not divide evenly?',
    answer: 'Our algorithm utilizes balanced round-robin remainder assignment. For instance, dividing 10 individuals into 3 teams produces squads of 4, 3, and 3 members. You will never encounter an uneven split like 4, 4, 2.',
  },
  {
    question: 'Can I balance teams based on player skill levels?',
    answer: 'Yes! Click "Add Tier" to create multiple skill levels (e.g., Tier 1 Captains, Tier 2 Intermediates, Tier 3 Beginners). When generated, our algorithm shuffles each tier independently and distributes players evenly across squads, ensuring every team gets a fair share of top talent.',
  },
  {
    question: 'Can I lock a captain or specific player to a team across reshuffles?',
    answer: 'Yes! Hover over any player in a generated team and click the Lock icon to pin them. When you click "Rerun", pinned players stay locked in their designated team and slot, while unpinned players are reshuffled randomly.',
  },
  {
    question: 'Can I manually drag and adjust players after generating teams?',
    answer: 'Yes. You can drag and drop players between teams or reorder their position within a team. You can also drag unassigned players directly from your roster into any squad.',
  },
  {
    question: 'Is there a limit on how many names I can enter?',
    answer: 'No practical limit! Our client-side algorithm can easily process rosters ranging from 4 friends up to 1,000+ tournament or conference participants in milliseconds without performance loss.',
  },
  {
    question: 'Can I save or share my team split results?',
    answer: 'Yes! You can instantly copy formatted text to paste into Discord or Slack, copy a persistent shareable URL, or export a formatted PNG image card with a single click.',
  },
  {
    question: 'Does this random team generator work offline and on mobile?',
    answer: 'Absolutely. The web application is 100% responsive for iOS and Android smartphones, and since all calculations execute inside your browser, it continues working even with weak or offline network connections.',
  },
  {
    question: 'Is my roster list stored or sent to an external server?',
    answer: 'No. All parsing and shuffling algorithms execute 100% locally in your web browser. No names are uploaded or stored on any server, ensuring complete confidentiality.',
  },
];

interface IndexSearchParams {
  names?: string;
  mode?: DividerMode;
  val?: number;
}

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>): IndexSearchParams => {
    return {
      names: typeof search.names === 'string' ? search.names : undefined,
      mode: search.mode === 'by-size' ? 'by-size' : undefined,
      val: typeof search.val === 'number' ? search.val : undefined,
    };
  },
  component: IndexPage,
});

function IndexPage() {
  const search = (useSearch({ strict: false }) || {}) as IndexSearchParams;
  const navigate = useNavigate();

  const initialRawText = useMemo(() => {
    if (search.names) {
      return search.names.replace(/,/g, '\n');
    }
    return DEFAULT_SAMPLE_NAMES.join('\n');
  }, [search.names]);

  const [rawText, setRawText] = useState(initialRawText);
  const [tiers, setTiers] = useState<PlayerTier[]>(() => {
    return parseTiersInput(initialRawText);
  });
  const [mode, setMode] = useState<DividerMode>(search.mode || 'by-teams');
  const [val, setVal] = useState<number>(search.val || 2);

  // Pre-seed initial render with balanced teams
  const [teams, setTeams] = useState<TeamResult[]>(() => {
    const initialTiers = parseTiersInput(initialRawText);
    return divideTeams(initialTiers, search.mode || 'by-teams', search.val || 2);
  });

  const parsedNames = useMemo(() => {
    return tiers.flatMap(t => t.names);
  }, [tiers]);

  const memberTierMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const t of tiers) {
      for (const n of t.names) {
        map[n] = t.name;
      }
    }
    return map;
  }, [tiers]);

  const handleTiersChange = (newTiers: PlayerTier[]) => {
    setTiers(newTiers);
    const newMap: Record<string, string> = {};
    for (const t of newTiers) {
      for (const n of t.names) {
        newMap[n] = t.name;
      }
    }
    setTeams(prevTeams =>
      prevTeams.map(team => ({
        ...team,
        memberTiers: {
          ...(team.memberTiers || {}),
          ...newMap,
        },
      }))
    );
  };

  const handleRawTextChange = (text: string) => {
    setRawText(text);
  };

  // Count duplicate names
  const duplicatesCount = useMemo(() => {
    const seen = new Set<string>();
    let dupes = 0;
    for (const name of parsedNames) {
      const lower = name.toLowerCase();
      if (seen.has(lower)) dupes++;
      else seen.add(lower);
    }
    return dupes;
  }, [parsedNames]);

  // Calculate how many times each name has been assigned to teams
  const assignedCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const team of teams) {
      for (const member of team.members) {
        counts.set(member, (counts.get(member) || 0) + 1);
      }
    }
    return counts;
  }, [teams]);

  const generatorTopRef = useRef<HTMLDivElement>(null);
  const gridExportRef = useRef<HTMLDivElement>(null);

  const handleToggleLock = (teamIndex: number, slotIndex: number) => {
    setTeams(prevTeams => {
      return prevTeams.map((team, tIdx) => {
        if (tIdx !== teamIndex) return team;
        const currentLocks = team.lockedIndices ? [...team.lockedIndices] : [];
        const isLocked = currentLocks.includes(slotIndex);
        const updatedLocks = isLocked
          ? currentLocks.filter(idx => idx !== slotIndex)
          : [...currentLocks, slotIndex].sort((a, b) => a - b);
        return {
          ...team,
          lockedIndices: updatedLocks,
        };
      });
    });
  };

  const handleTeamsChange = (updatedTeams: TeamResult[]) => {
    setTeams(updatedTeams);
  };

  const handleGenerate = () => {
    if (parsedNames.length === 0) {
      setTeams([]);
      return;
    }
    // Pass current teams to preserve pinned/locked member positions and tiers
    const result = divideTeams(tiers, mode, val, teams);
    setTeams(result);

    // Update URL Search params for shareability
    navigate({
      search: {
        names: parsedNames.slice(0, 30).join(','),
        mode,
        val,
      } as any,
      replace: true,
    });
  };

  const handleApplyScenario = (scenario: ScenarioPreset) => {
    const newTiers: PlayerTier[] = [
      { id: 'tier-1', name: '', names: scenario.names },
    ];
    setTiers(newTiers);
    setRawText(scenario.names.join('\n'));
    setMode(scenario.mode);
    setVal(scenario.value);
    const result = divideTeams(newTiers, scenario.mode, scenario.value);
    setTeams(result);

    // Smooth scroll to top
    generatorTopRef.current?.scrollIntoView({ behavior: 'smooth' });

    navigate({
      search: {
        names: scenario.names.slice(0, 30).join(','),
        mode: scenario.mode,
        val: scenario.value,
      } as any,
      replace: true,
    });
  };

  const handleRestoreSample = () => {
    const sampleTiers: PlayerTier[] = [
      { id: 'tier-1', name: '', names: DEFAULT_SAMPLE_NAMES },
    ];
    setTiers(sampleTiers);
    setRawText(DEFAULT_SAMPLE_NAMES.join('\n'));
    setMode('by-teams');
    setVal(2);
    setTeams(divideTeams(sampleTiers, 'by-teams', 2));
  };

  const handleClear = () => {
    const emptyTiers: PlayerTier[] = [{ id: 'tier-1', name: '', names: [] }];
    setTiers(emptyTiers);
    setRawText('');
    setTeams([]);
  };

  return (
    <div className="py-8 sm:py-12" ref={generatorTopRef}>
      <Container size="lg" className="space-y-10">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5" />
            <span>Fair, Instant & 100% Free</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Random Team Generator
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Split any list of names into completely balanced, randomized teams in milliseconds. Designed for classrooms, sports leagues, board games, and group projects.
          </p>
        </div>

        {/* Core Tool Workspace: Stacked on small screens, Side-by-Side (Left Controls, Right Results) on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (Desktop 5 cols, XL 4 cols): Inputs & Controls */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            <RosterInput
              tiers={tiers}
              onTiersChange={handleTiersChange}
              rawText={rawText}
              onRawTextChange={handleRawTextChange}
              namesCount={parsedNames.length}
              onRestoreSample={handleRestoreSample}
              onClear={handleClear}
              duplicatesCount={duplicatesCount}
              assignedCounts={assignedCounts}
            />

            <DividerControls
              mode={mode}
              onModeChange={setMode}
              value={val}
              onValueChange={setVal}
              onGenerate={handleGenerate}
            />
          </div>

          {/* Right Column (Desktop 7 cols, XL 8 cols): Live Generated Teams & Export Bar */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center justify-between pb-2 border-b border-slate-200 gap-2">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  Generated Teams ({teams.length})
                </h2>
                <span className="text-xs text-slate-500 font-medium">
                  • {teams.reduce((s, t) => s + t.members.length, 0)} total participants
                </span>
                {teams.reduce((sum, t) => sum + (t.lockedIndices?.length || 0), 0) > 0 && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                    🔒 {teams.reduce((sum, t) => sum + (t.lockedIndices?.length || 0), 0)} pinned
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                Drag to reorder/move • Click 🔓 to pin position
              </span>
            </div>

            <DividerActions
              teams={teams}
              onRerun={handleGenerate}
              onClear={() => setTeams([])}
              exportElementRef={gridExportRef}
              memberTierMap={memberTierMap}
            />

            <DividedTeamsGrid
              teams={teams}
              onTeamsChange={handleTeamsChange}
              onToggleLock={handleToggleLock}
              containerRef={gridExportRef}
              memberTierMap={memberTierMap}
            />
          </div>
        </div>

        {/* Feature Highlights Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-slate-200">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Cryptographically Fair</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Every member has equal probability of placement using Fisher-Yates shuffle.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-slate-200">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Skill-Tier Balancing</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Group players by experience (Captains, Novices) to guarantee balanced talent.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-slate-200">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Pin &amp; Lock Anchors</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Lock team captains in place while freely reshuffling remaining squad spots.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-slate-200">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Instant Export</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Copy markdown tables or download high-res PNG cards for Discord and Slack.
              </p>
            </div>
          </div>
        </div>

        {/* Sports Pickers Network Links Banner */}
        <div className="p-6 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-1 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs text-brand-400 font-semibold uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5" />
              <span>Sports Randomizer Hub</span>
            </div>
            <h3 className="text-xl font-bold tracking-tight">
              Looking to pick a random sports franchise?
            </h3>
            <p className="text-sm text-slate-300">
              Spin for an NFL, NBA, or MLB team or randomize your fantasy draft order in seconds.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to="/random-nfl-team-generator"
              className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
            >
              NFL Picker (32)
            </Link>
            <Link
              to="/random-nba-team-generator"
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-bold transition-colors"
            >
              NBA Picker (30)
            </Link>
            <Link
              to="/random-mlb-team-generator"
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-bold transition-colors"
            >
              MLB Picker (30)
            </Link>
          </div>
        </div>

        {/* 精品页 2.0: Showcase 场景案例库 */}
        <Showcase onApplyScenario={handleApplyScenario} />

        {/* 精品页 2.0: How-To 图文指南 */}
        <HowToSection
          title="How to Split Names into Random Teams"
          subtitle="Three simple steps to generate fair, balanced teams for classrooms, sports, or games."
          steps={[
            {
              number: '1',
              title: 'Paste Names or Add Skill Tiers',
              description: 'Type or paste names directly, or click "Add Tier" to categorize players by skill (e.g. Captains, Beginners) for balanced rosters.',
            },
            {
              number: '2',
              title: 'Select Grouping Method',
              description: 'Choose whether you want a specific number of teams or a squad size, then click "Generate Teams" for an instant, mathematically fair distribution.',
            },
            {
              number: '3',
              title: 'Fine-Tune, Lock & Export',
              description: 'Drag players between teams to adjust, click the lock icon to pin key anchors across reshuffles, and export clean PNG image cards.',
            },
          ]}
        />

        {/* 精品页 2.0: 深度指南长文 (800~1200 词，3% 关键词密度) */}
        <EditorialContent />

        {/* 精品页 2.0: PAA FAQ 问答与结构化数据 */}
        <FaqSection
          title="Frequently Asked Questions (FAQ)"
          subtitle="Everything you need to know about our free random team generator tool."
          items={HOME_FAQ_ITEMS}
        />

        {/* 网状内链模块 */}
        <InternalLinkHub />

        {/* JSON-LD Schema 微数据注入 */}
        <SchemaScript
          appName="Random Team Generator - TeamGenerator"
          appDescription="Free online random team generator and balanced group divider. Split names into groups by team count or group size instantly."
          appUrl="https://teamgenerator.org/"
          faqItems={HOME_FAQ_ITEMS}
        />

      </Container>
    </div>
  );
}
