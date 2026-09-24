import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { DividerMode } from '../../data/types';
import { Play, Sparkles, BookOpen, Smile, Trophy } from 'lucide-react';

export interface ScenarioPreset {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  category: string;
  mode: DividerMode;
  value: number;
  names: string[];
}

export const SCENARIO_PRESETS: ScenarioPreset[] = [
  {
    id: 'pickup-game',
    title: '5v5 Pickup Game (Basketball / Soccer)',
    icon: Trophy,
    category: 'Sports & Games',
    description: '10 players balanced into two equal 5-person squads for a fair pickup match.',
    mode: 'by-teams',
    value: 2,
    names: ['Liam', 'Noah', 'Oliver', 'James', 'Elijah', 'William', 'Henry', 'Lucas', 'Benjamin', 'Theodore'],
  },
  {
    id: 'classroom-groups',
    title: 'Classroom Study & Project Groups',
    icon: BookOpen,
    category: 'Education & Classroom',
    description: '16 students split into 4 balanced study cohorts of 4 students each.',
    mode: 'by-teams',
    value: 4,
    names: ['Emma', 'Olivia', 'Charlotte', 'Amelia', 'Sophia', 'Mia', 'Isabella', 'Harper', 'Evelyn', 'Gianna', 'Abigail', 'Luna', 'Ella', 'Avery', 'Sofia', 'Camila'],
  },
  {
    id: 'team-building',
    title: 'Workplace Team Building & Icebreaker',
    icon: Smile,
    category: 'Team Building',
    description: '12 colleagues divided into 3 vibrant squads for trivia, scavenger hunts, or hackathons.',
    mode: 'by-teams',
    value: 3,
    names: ['Alex M.', 'Sarah K.', 'David T.', 'Elena R.', 'Marcus B.', 'Chloe W.', 'Brian L.', 'Jessica P.', 'Kevin H.', 'Rachel S.', 'Tom N.', 'Megan D.'],
  },
  {
    id: 'trivia-night',
    title: 'Party Board Game & Trivia Night',
    icon: Sparkles,
    category: 'Parties & Fun',
    description: '8 friends quickly assigned to 2 competitive trivia teams of 4 players.',
    mode: 'by-teams',
    value: 2,
    names: ['Sam', 'Taylor', 'Jordan', 'Morgan', 'Casey', 'Riley', 'Avery', 'Quinn'],
  },
];

export interface ShowcaseProps {
  onApplyScenario: (scenario: ScenarioPreset) => void;
}

export const Showcase: React.FC<ShowcaseProps> = ({ onApplyScenario }) => {
  return (
    <section className="mt-14 space-y-6">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold border border-brand-200">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real-World Templates</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight sm:text-3xl">
          Popular Team Split Scenarios & Examples
        </h2>
        <p className="text-sm text-slate-600">
          Need inspiration? Explore pre-configured setups for classrooms, sports leagues, and casual game nights. Click to load any template instantly into the generator above.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {SCENARIO_PRESETS.map(scenario => {
          const Icon = scenario.icon;
          return (
            <Card
              key={scenario.id}
              hoverEffect
              className="flex flex-col justify-between p-5 bg-white border-slate-200"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <Badge variant="default" className="text-[10px] text-slate-500">
                    {scenario.category}
                  </Badge>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-sm leading-snug">
                    {scenario.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    {scenario.description}
                  </p>
                </div>

                {/* Preview sample tokens */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                    Preset: {scenario.names.length} people → {scenario.value} teams
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {scenario.names.slice(0, 4).map((name, i) => (
                      <span
                        key={i}
                        className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px]"
                      >
                        {name}
                      </span>
                    ))}
                    {scenario.names.length > 4 && (
                      <span className="text-[11px] text-slate-400 px-1 py-0.5">
                        +{scenario.names.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onApplyScenario(scenario)}
                  className="w-full text-xs font-semibold hover:border-brand-500 hover:text-brand-600"
                >
                  <Play className="w-3.5 h-3.5 mr-1 text-brand-600 fill-brand-600" />
                  Load & Shuffle
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

// 兼容别名
export type CaseShowcaseProps = ShowcaseProps;
export const CaseShowcase = Showcase;
