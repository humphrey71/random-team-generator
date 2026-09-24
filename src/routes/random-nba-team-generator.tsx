import React, { useState, useMemo } from 'react';
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
import { NBA_TEAMS } from '../data/nba-teams';
import { shuffleArray } from '../lib/shuffle';
import { PickerMode, SportsTeam } from '../data/types';
import { ArrowLeft, Trophy, Users } from 'lucide-react';

export const Route = createFileRoute('/random-nba-team-generator')({
  component: NbaPickerPage,
});

function NbaPickerPage() {
  const [selectedConference, setSelectedConference] = useState<string>('all');
  const [pickerMode, setPickerMode] = useState<PickerMode>('single');
  const [isEliminationMode, setIsEliminationMode] = useState<boolean>(false);
  const [pickedHistory, setPickedHistory] = useState<SportsTeam[]>([]);

  // Filter pool
  const activePool = useMemo(() => {
    if (selectedConference === 'all') return NBA_TEAMS;
    return NBA_TEAMS.filter(t => t.conference === selectedConference);
  }, [selectedConference]);

  const remainingCandidates = useMemo(() => {
    if (!isEliminationMode) return activePool;
    const pickedIds = new Set(pickedHistory.map(p => p.id));
    return activePool.filter(t => !pickedIds.has(t.id));
  }, [activePool, isEliminationMode, pickedHistory]);

  const [currentTeam, setCurrentTeam] = useState<SportsTeam | null>(() => {
    return NBA_TEAMS.find(t => t.id === 'los-angeles-lakers') || NBA_TEAMS[0];
  });

  const [draftOrder, setDraftOrder] = useState<SportsTeam[]>(() => shuffleArray(NBA_TEAMS));

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
    const newPool = conf === 'all' ? NBA_TEAMS : NBA_TEAMS.filter(t => t.conference === conf);
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
            <span className="px-2 py-0.5 rounded bg-brand-50 text-brand-700 font-bold">NBA Basketball</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold">
            <Trophy className="w-3.5 h-3.5 text-blue-600" />
            <span>Official 30 NBA Teams</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Random NBA Team Generator
          </h1>
          <p className="text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Spin for a random NBA basketball franchise, filter between Eastern and Western Conferences, or shuffle draft orders for 2K play and fantasy hoops.
          </p>
        </div>

        <PickerModeSwitch mode={pickerMode} onChange={setPickerMode} />

        <LeaguePickerHeader
          leagueTitle="National Basketball Association"
          leagueShortName="NBA"
          totalTeams={NBA_TEAMS.length}
          filteredCount={activePool.length}
          conferences={['Eastern', 'Western']}
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
            leagueTitle="NBA Basketball"
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
                Want to divide your own local pickup basketball roster?
              </h4>
              <p className="text-xs text-slate-500">
                Use our Random Team Generator to automatically balance 10 players into two 5v5 teams.
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
        <SportsCaseShowcase leagueName="NBA" sampleTeams={NBA_TEAMS} />

        {/* 精品页 2.0: How-to */}
        <HowToSection
          title="How to Use the Random NBA Team Picker"
          subtitle="Generate random NBA basketball teams for NBA 2K matches, fantasy leagues, and casual fandom."
          steps={[
            {
              number: '1',
              title: 'Select Conference Filter',
              description: 'Choose "All" to draw from all 30 NBA clubs, or filter by Eastern or Western Conference.',
            },
            {
              number: '2',
              title: 'Pick Team or View Draft Table',
              description: 'Spin for an individual basketball team card, or switch to the draft table to generate 1 to 30 randomized draft positions.',
            },
            {
              number: '3',
              title: 'Copy, Share or Download',
              description: 'Enable elimination mode for multi-player selections, or download your draft board as an image card.',
            },
          ]}
        />

        {/* 精品页 2.0: FAQ */}
        <FaqSection
          title="NBA Team Picker FAQ"
          subtitle="Frequently asked questions about NBA team selection and fantasy basketball drafts."
          items={[
            {
              question: 'How does the random NBA team picker choose a team?',
              answer: 'It uses a uniform pseudo-random number generator to select a team from the 30 active NBA franchises with equal statistical probability.',
            },
            {
              question: 'Can I use this for NBA 2K video game play with friends?',
              answer: 'Yes! It is popular for NBA 2K random team challenges. Each player spins once, and you must play with whatever team fate decides.',
            },
            {
              question: 'How do I randomize an NBA fantasy draft order?',
              answer: 'Switch to the "Draft Order Board" view and click "Shuffle Order". You will immediately get a randomized 1st to 30th lottery sequence.',
            },
            {
              question: 'Are all 30 current NBA teams supported?',
              answer: 'Yes, all 30 NBA teams across the Atlantic, Central, Southeast, Northwest, Pacific, and Southwest divisions are included.',
            },
          ]}
        />

        <InternalLinkHub />

        <SchemaScript
          appName="Random NBA Team Generator - RollSquad"
          appDescription="Pick a random NBA basketball team or generate an unbiased fantasy basketball draft lottery order."
          appUrl="https://rollsquad.com/random-nba-team-generator"
          faqItems={[
            {
              question: 'How does the random NBA team picker choose a team?',
              answer: 'It uses a uniform pseudo-random number generator to select a team from the 30 active NBA franchises with equal statistical probability.',
            },
            {
              question: 'Can I use this for NBA 2K video game play with friends?',
              answer: 'Yes! It is popular for NBA 2K random team challenges. Each player spins once, and you must play with whatever team fate decides.',
            },
            {
              question: 'How do I randomize an NBA fantasy draft order?',
              answer: 'Switch to the "Draft Order Board" view and click "Shuffle Order". You will immediately get a randomized 1st to 30th lottery sequence.',
            },
            {
              question: 'Are all 30 current NBA teams supported?',
              answer: 'Yes, all 30 NBA teams across the Atlantic, Central, Southeast, Northwest, Pacific, and Southwest divisions are included.',
            },
          ]}
        />
      </Container>
    </div>
  );
}
