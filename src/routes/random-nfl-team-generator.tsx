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
import { NFL_TEAMS } from '../data/nfl-teams';
import { shuffleArray } from '../lib/shuffle';
import { PickerMode, SportsTeam } from '../data/types';
import { ArrowLeft, Trophy, Users } from 'lucide-react';

export const Route = createFileRoute('/random-nfl-team-generator')({
  component: NflPickerPage,
});

function NflPickerPage() {
  const [selectedConference, setSelectedConference] = useState<string>('all');
  const [pickerMode, setPickerMode] = useState<PickerMode>('single');
  const [isEliminationMode, setIsEliminationMode] = useState<boolean>(false);
  const [pickedHistory, setPickedHistory] = useState<SportsTeam[]>([]);

  // Filter pool
  const activePool = useMemo(() => {
    if (selectedConference === 'all') return NFL_TEAMS;
    return NFL_TEAMS.filter(t => t.conference === selectedConference);
  }, [selectedConference]);

  // Available candidate pool (respecting elimination mode)
  const remainingCandidates = useMemo(() => {
    if (!isEliminationMode) return activePool;
    const pickedIds = new Set(pickedHistory.map(p => p.id));
    return activePool.filter(t => !pickedIds.has(t.id));
  }, [activePool, isEliminationMode, pickedHistory]);

  // Pre-seed initial render with an initial team (Kansas City Chiefs or first team)
  const [currentTeam, setCurrentTeam] = useState<SportsTeam | null>(() => {
    return NFL_TEAMS.find(t => t.id === 'kansas-city-chiefs') || NFL_TEAMS[0];
  });

  // Draft order list state
  const [draftOrder, setDraftOrder] = useState<SportsTeam[]>(() => shuffleArray(NFL_TEAMS));

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
    const newPool = conf === 'all' ? NFL_TEAMS : NFL_TEAMS.filter(t => t.conference === conf);
    if (newPool.length > 0) {
      setCurrentTeam(newPool[0]);
    }
    setDraftOrder(shuffleArray(newPool));
  };

  return (
    <div className="py-8 sm:py-12">
      <Container size="lg" className="space-y-8">
        {/* Breadcrumb & Return to main generator */}
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
            <span className="px-2 py-0.5 rounded bg-brand-50 text-brand-700 font-bold">NFL Football</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
            <Trophy className="w-3.5 h-3.5 text-amber-600" />
            <span>Official 32 NFL Franchises</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Random NFL Team Generator
          </h1>
          <p className="text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Randomly draw an NFL franchise with official team colors, filter by AFC or NFC, or generate an unbiased fantasy football draft order.
          </p>
        </div>

        {/* Picker Mode Switch */}
        <PickerModeSwitch mode={pickerMode} onChange={setPickerMode} />

        {/* League Filter Header */}
        <LeaguePickerHeader
          leagueTitle="National Football League"
          leagueShortName="NFL"
          totalTeams={NFL_TEAMS.length}
          filteredCount={activePool.length}
          conferences={['AFC', 'NFC']}
          selectedConference={selectedConference}
          onSelectConference={handleSelectConference}
        />

        {/* Interactive Tool Area */}
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
            leagueTitle="NFL Football"
          />
        )}

        {/* Cross-Link Back to Home (Authority concentration) */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Need to split your own custom roster of names?
              </h4>
              <p className="text-xs text-slate-500">
                Use our free Random Team Generator to divide players, students, or colleagues into fair squads.
              </p>
            </div>
          </div>
          <Link
            to="/"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shrink-0 transition-colors"
          >
            Go to Name Divider
          </Link>
        </div>

        {/* Other Leagues Switcher */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs">
          <span className="text-slate-400 font-semibold">Other Leagues:</span>
          <Link
            to="/random-nba-team-generator"
            className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-brand-500 hover:text-brand-600 bg-white font-medium"
          >
            Random NBA Team Generator
          </Link>
          <Link
            to="/random-mlb-team-generator"
            className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-brand-500 hover:text-brand-600 bg-white font-medium"
          >
            Random MLB Team Generator
          </Link>
        </div>

        {/* 精品页 2.0: SportsCaseShowcase */}
        <SportsCaseShowcase leagueName="NFL" sampleTeams={NFL_TEAMS} />

        {/* 精品页 2.0: How-to */}
        <HowToSection
          title="How to Use the Random NFL Team Generator"
          subtitle="Generate fair NFL picks for fantasy leagues, video game matchups, or casual fandom."
          steps={[
            {
              number: '1',
              title: 'Choose Conference Filter',
              description: 'Select "All" to draw from all 32 NFL clubs, or filter exclusively by AFC or NFC to target your favorite conference.',
            },
            {
              number: '2',
              title: 'Select Pick or Draft Board',
              description: 'Use "Pick Single Team" for a spin animation, or switch to "Draft Order Board" to randomize full fantasy draft positions from 1 to 32.',
            },
            {
              number: '3',
              title: 'Copy or Share Results',
              description: 'Use the elimination toggle to prevent duplicate team picks, or export your draft order as a clean image for your league chat.',
            },
          ]}
        />

        {/* 精品页 2.0: FAQ */}
        <FaqSection
          title="NFL Team Picker FAQ"
          subtitle="Common questions about picking NFL teams and fantasy draft randomization."
          items={[
            {
              question: 'How does the random NFL team picker work?',
              answer: 'It selects an NFL franchise from all 32 active franchises using unbiased pseudo-random number generation. You can filter by AFC or NFC or use elimination mode to draw unique teams.',
            },
            {
              question: 'Can I use this for our fantasy football draft lottery?',
              answer: 'Yes! Simply switch to the "Draft Order Board" mode and hit "Shuffle Order" to generate an unbiased 1st through 32nd draft order. You can copy the text or download the PNG board.',
            },
            {
              question: 'Are all 32 current NFL franchises included?',
              answer: 'Yes, all 32 active NFL teams are included with their official primary colors, cities, and conference/division designations.',
            },
            {
              question: 'Can I prevent teams from repeating?',
              answer: 'Yes, toggle "Elimination Mode" on. When enabled, any team drawn is removed from the available pool until you reset.',
            },
          ]}
        />

        {/* 内部推荐聚合 */}
        <InternalLinkHub />

        <SchemaScript
          appName="Random NFL Team Generator - TeamGenerator"
          appDescription="Randomly pick an NFL football team or generate an unbiased fantasy football draft order from all 32 NFL franchises."
          appUrl="https://teamgenerator.org/random-nfl-team-generator"
          faqItems={[
            {
              question: 'How does the random NFL team picker work?',
              answer: 'It selects an NFL franchise from all 32 active franchises using unbiased pseudo-random number generation. You can filter by AFC or NFC or use elimination mode to draw unique teams.',
            },
            {
              question: 'Can I use this for our fantasy football draft lottery?',
              answer: 'Yes! Simply switch to the "Draft Order Board" mode and hit "Shuffle Order" to generate an unbiased 1st through 32nd draft order. You can copy the text or download the PNG board.',
            },
            {
              question: 'Are all 32 current NFL franchises included?',
              answer: 'Yes, all 32 active NFL teams are included with their official primary colors, cities, and conference/division designations.',
            },
            {
              question: 'Can I prevent teams from repeating?',
              answer: 'Yes, toggle "Elimination Mode" on. When enabled, any team drawn is removed from the available pool until you reset.',
            },
          ]}
        />
      </Container>
    </div>
  );
}
