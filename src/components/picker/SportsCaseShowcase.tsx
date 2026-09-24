import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Trophy, Gamepad2, Swords, Sparkles } from 'lucide-react';
import { SportsTeam } from '../../data/types';

export interface SportsCaseShowcaseProps {
  leagueName: string;
  sampleTeams: SportsTeam[];
}

export const SportsCaseShowcase: React.FC<SportsCaseShowcaseProps> = ({
  leagueName,
  sampleTeams,
}) => {
  const top4 = sampleTeams.slice(0, 4);
  const team1 = sampleTeams[0] || sampleTeams[0];
  const team2 = sampleTeams[1] || sampleTeams[0];

  return (
    <section className="mt-14 space-y-6">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real-World {leagueName} Use Cases</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight sm:text-3xl">
          Popular Ways to Use the {leagueName} Team Picker
        </h2>
        <p className="text-sm text-slate-600">
          From setting fair fantasy draft lottery orders to setting up console video game rivalry matches, see how fans utilize this tool.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Case 1: Fantasy Draft Lottery */}
        <Card hoverEffect className="p-5 flex flex-col justify-between bg-white border-slate-200">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Trophy className="w-5 h-5" />
              </div>
              <Badge variant="default" className="text-[10px]">Fantasy Sports</Badge>
            </div>
            <h3 className="font-bold text-slate-900 text-sm">
              Fantasy {leagueName} Draft Lottery
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Eliminate commissioner bias. Generate a clean, randomized snake draft order for 8, 10, or 12 fantasy league managers.
            </p>

            {/* Micro preview */}
            <div className="pt-2 border-t border-slate-100 space-y-1">
              {top4.map((t, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-0.5">
                  <span className="font-mono text-slate-400">Pick #{idx + 1}</span>
                  <span className="font-semibold text-slate-800">{t.name}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Case 2: 1v1 Console Game Challenge */}
        <Card hoverEffect className="p-5 flex flex-col justify-between bg-white border-slate-200">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <Badge variant="default" className="text-[10px]">Video Games</Badge>
            </div>
            <h3 className="font-bold text-slate-900 text-sm">
              Video Game Random Matchup
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Playing Madden or NBA 2K with friends? Spin once for Player 1 and once for Player 2 to force exciting, non-meta showdowns.
            </p>

            {/* Matchup preview */}
            {team1 && team2 && (
              <div className="pt-3 border-t border-slate-100 flex items-center justify-around py-2 bg-slate-50 rounded-lg">
                <div className="text-center">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">P1</span>
                  <span className="text-xs font-bold text-slate-800">{team1.shortName}</span>
                </div>
                <Swords className="w-4 h-4 text-slate-400" />
                <div className="text-center">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">P2</span>
                  <span className="text-xs font-bold text-slate-800">{team2.shortName}</span>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Case 3: Pick a New Team to Support */}
        <Card hoverEffect className="p-5 flex flex-col justify-between bg-white border-slate-200">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <Badge variant="default" className="text-[10px]">Fan Discovery</Badge>
            </div>
            <h3 className="font-bold text-slate-900 text-sm">
              Adopt a New Franchise
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              New to American sports? Let fate choose your new favorite team to follow throughout the regular season and playoffs.
            </p>
            <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-600 border border-slate-100">
              <p className="italic">"Hit spin and pledge allegiance to whatever helmet appears!"</p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};
