import { useState, useMemo } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Container } from '../components/layout/Container';
import { LeaguePickerHeader } from '../components/picker/LeaguePickerHeader';
import { PickerModeSwitch } from '../components/picker/PickerModeSwitch';
import { TeamCardDraw } from '../components/picker/TeamCardDraw';
import { DraftOrderTable } from '../components/picker/DraftOrderTable';
import { SportsCaseShowcase } from '../components/picker/SportsCaseShowcase';
import { HowToSection } from '../components/seo/HowToSection';
import { FaqSection } from '../components/seo/FaqSection';
import { SchemaScript } from '../components/seo/SchemaScript';
import { InternalLinkHub } from '../components/seo/InternalLinkHub';
import { MLB_TEAMS } from '../data/mlb-teams';
import { shuffleArray } from '../lib/shuffle';
import { PickerMode, SportsTeam } from '../data/types';
import { ArrowLeft, Trophy, Users } from 'lucide-react';

export const Route = createFileRoute('/random-mlb-team-generator')({
  component: MlbPickerPage,
});

function MlbPickerPage() {
  const [selectedConference, setSelectedConference] = useState<string>('all');
  const [pickerMode, setPickerMode] = useState<PickerMode>('single');
  const [isEliminationMode, setIsEliminationMode] = useState<boolean>(false);
  const [pickedHistory, setPickedHistory] = useState<SportsTeam[]>([]);

  // Filter pool
  const activePool = useMemo(() => {
    if (selectedConference === 'all') return MLB_TEAMS;
    return MLB_TEAMS.filter(t => t.conference === selectedConference);
  }, [selectedConference]);

  const remainingCandidates = useMemo(() => {
    if (!isEliminationMode) return activePool;
    const pickedIds = new Set(pickedHistory.map(p => p.id));
    return activePool.filter(t => !pickedIds.has(t.id));
  }, [activePool, isEliminationMode, pickedHistory]);

  const [currentTeam, setCurrentTeam] = useState<SportsTeam | null>(() => {
    return MLB_TEAMS.find(t => t.id === 'new-york-yankees') || MLB_TEAMS[0];
  });

  const [draftOrder, setDraftOrder] = useState<SportsTeam[]>(() => shuffleArray(MLB_TEAMS));

  const handleDraw = () => {
    if (remainingCandidates.length === 0) return;
    const randomIndex = Math.floor(Math.random() * remainingCandidates.length);
    const picked = remainingCandidates[randomIndex];
    setCurrentTeam(picked);

    if (isEliminationMode) {
      setPickedHistory(prev => [...prev, picked]);
    }
  };

  const handleReshuffleDraft = () => {
    setDraftOrder(shuffleArray(activePool));
  };

  const handleResetPool = () => {
    setPickedHistory([]);
    if (activePool.length > 0) {
      setCurrentTeam(activePool[0]);
    }
  };

  const handleSelectConference = (conf: string) => {
    setSelectedConference(conf);
    setPickedHistory([]);
    const newPool = conf === 'all' ? MLB_TEAMS : MLB_TEAMS.filter(t => t.conference === conf);
    if (newPool.length > 0) {
      setCurrentTeam(newPool[0]);
    }
    setDraftOrder(shuffleArray(newPool));
  };

  return (
    <div className="py-8 sm:py-12">
      <Container size="lg" className="space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 font-medium hover:text-brand-600 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Random Team Generator</span>
          </Link>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-700">League:</span>
            <span className="px-2 py-0.5 rounded bg-brand-50 text-brand-700 font-bold">MLB Baseball</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-800 text-xs font-semibold">
            <Trophy className="w-3.5 h-3.5 text-red-600" />
            <span>Official 30 MLB Clubs</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Random MLB Team Generator
          </h1>
          <p className="text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Draw a random Major League Baseball franchise, filter by American or National League, or shuffle a full 30-team draft board.
          </p>
        </div>

        <PickerModeSwitch mode={pickerMode} onChange={setPickerMode} />

        <LeaguePickerHeader
          leagueTitle="Major League Baseball"
          leagueShortName="MLB"
          totalTeams={MLB_TEAMS.length}
          filteredCount={activePool.length}
          conferences={['AL', 'NL']}
          selectedConference={selectedConference}
          onSelectConference={handleSelectConference}
        />

        {pickerMode === 'single' ? (
          <TeamCardDraw
            currentTeam={currentTeam}
            onDraw={handleDraw}
            isEliminationMode={isEliminationMode}
            onToggleElimination={() => {
              setIsEliminationMode(!isEliminationMode);
              setPickedHistory([]);
            }}
            pickedHistory={pickedHistory}
            onResetPool={handleResetPool}
            remainingCount={remainingCandidates.length}
            totalCount={activePool.length}
          />
        ) : (
          <DraftOrderTable
            teams={draftOrder}
            onReshuffle={handleReshuffleDraft}
            leagueTitle="MLB Baseball"
          />
        )}

        {/* Cross-Link Back to Home */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Need to split your softball or baseball squad?
              </h4>
              <p className="text-xs text-slate-500">
                Use our Random Team Generator to automatically balance players into even batting orders and teams.
              </p>
            </div>
          </div>
          <Link
            to="/"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shrink-0 transition-colors"
          >
            Split Custom Names
          </Link>
        </div>

        {/* 精品页 2.0: SportsCaseShowcase */}
        <SportsCaseShowcase leagueName="MLB" sampleTeams={MLB_TEAMS} />

        {/* 精品页 2.0: How-to */}
        <HowToSection
          title="How to Use the Random MLB Team Generator"
          subtitle="Generate random baseball teams for MLB The Show matchups, fantasy drafts, and pennant races."
          steps={[
            {
              number: '1',
              title: 'Select League Filter',
              description: 'Filter by American League (AL) or National League (NL), or draw from the entire 30-club Major League Baseball pool.',
            },
            {
              number: '2',
              title: 'Draw Single Club or Full Board',
              description: 'Click to spin for a single team with official colors, or switch to the draft board to randomize 1 to 30 draft positions.',
            },
            {
              number: '3',
              title: 'Save and Export',
              description: 'Use the elimination toggle to prevent duplicate baseball team draws, or download your results as a clean image.',
            },
          ]}
        />

        {/* 精品页 2.0: FAQ */}
        <FaqSection
          title="MLB Team Picker FAQ"
          subtitle="Common questions about picking Major League Baseball teams and fantasy draft lottery setups."
          items={[
            {
              question: 'How does the random MLB team generator choose a team?',
              answer: 'It uses a cryptographically sound pseudo-random algorithm to pick one of the 30 active Major League Baseball franchises with equal mathematical probability.',
            },
            {
              question: 'Can I filter by American League or National League?',
              answer: 'Yes! Simply click the "AL" or "NL" tab above the card to restrict your candidate pool to the 15 clubs in that specific league.',
            },
            {
              question: 'How do I randomize fantasy baseball draft picks?',
              answer: 'Switch to the "Draft Order Board" view and click "Shuffle Order". You will immediately generate a clean 1st to 30th lottery sequence.',
            },
            {
              question: 'Are all 30 current MLB teams included?',
              answer: 'Yes, all 30 clubs across the AL East, AL Central, AL West, NL East, NL Central, and NL West are included with their official primary colors.',
            },
          ]}
        />

        <InternalLinkHub />

        <SchemaScript
          appName="Random MLB Team Generator - TeamGenerator"
          appDescription="Pick a random Major League Baseball team or generate an unbiased fantasy baseball draft order."
          appUrl="https://teamgenerator.org/random-mlb-team-generator"
          faqItems={[
            {
              question: 'How does the random MLB team generator choose a team?',
              answer: 'It uses a cryptographically sound pseudo-random algorithm to pick one of the 30 active Major League Baseball franchises with equal mathematical probability.',
            },
            {
              question: 'Can I filter by American League or National League?',
              answer: 'Yes! Simply click the "AL" or "NL" tab above the card to restrict your candidate pool to the 15 clubs in that specific league.',
            },
            {
              question: 'How do I randomize fantasy baseball draft picks?',
              answer: 'Switch to the "Draft Order Board" view and click "Shuffle Order". You will immediately generate a clean 1st to 30th lottery sequence.',
            },
            {
              question: 'Are all 30 current MLB teams included?',
              answer: 'Yes, all 30 clubs across the AL East, AL Central, AL West, NL East, NL Central, and NL West are included with their official primary colors.',
            },
          ]}
        />
      </Container>
    </div>
  );
}
