import React from 'react';
import { SportsTeam } from '../../data/types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Sparkles, RotateCcw, CheckCircle2, History } from 'lucide-react';

export interface TeamCardDrawProps {
  currentTeam: SportsTeam | null;
  onDraw: () => void;
  isEliminationMode: boolean;
  onToggleElimination: () => void;
  pickedHistory: SportsTeam[];
  onResetPool: () => void;
  remainingCount: number;
  totalCount: number;
}

export const TeamCardDraw: React.FC<TeamCardDrawProps> = ({
  currentTeam,
  onDraw,
  isEliminationMode,
  onToggleElimination,
  pickedHistory,
  onResetPool,
  remainingCount,
  totalCount,
}) => {
  const isPoolEmpty = isEliminationMode && remainingCount === 0;

  return (
    <div className="space-y-6">
      {/* Central Interactive Card */}
      <div className="relative overflow-hidden bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-10 text-center flex flex-col items-center justify-center min-h-[320px]">
        {/* Dynamic Background subtle gradient from team color */}
        {currentTeam && (
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              background: `radial-gradient(circle at center, ${currentTeam.primaryColor} 0%, transparent 70%)`,
            }}
          />
        )}

        {isPoolEmpty ? (
          <div className="space-y-4 py-8 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">
                All Teams Have Been Picked!
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                You've drawn all {totalCount} teams from the active pool.
              </p>
            </div>
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={onResetPool}
              className="mt-2"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Pool & Start Over
            </Button>
          </div>
        ) : currentTeam ? (
          <div className="space-y-5 animate-scale-up z-10 w-full max-w-md mx-auto">
            {/* Team Badges */}
            <div className="flex items-center justify-center gap-2">
              <Badge variant="brand" className="text-xs">
                {currentTeam.conference}
              </Badge>
              <Badge variant="default" className="text-xs">
                {currentTeam.division}
              </Badge>
            </div>

            {/* Team Crest / Logo Visual Element */}
            <div
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl mx-auto flex items-center justify-center shadow-lg border-2 border-white transition-transform duration-300 hover:scale-105"
              style={{
                backgroundColor: currentTeam.primaryColor,
                color: '#ffffff',
              }}
            >
              <span className="text-2xl sm:text-3xl font-black tracking-wider uppercase">
                {currentTeam.shortName.slice(0, 3)}
              </span>
            </div>

            {/* Team Title */}
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-slate-400 block">
                {currentTeam.city}
              </span>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                {currentTeam.name}
              </h3>
            </div>

            {/* Action CTA */}
            <div className="pt-2">
              <Button
                type="button"
                variant="primary"
                size="lg"
                onClick={onDraw}
                className="w-full sm:w-auto px-8 py-3.5 text-base shadow-md shadow-brand-500/20"
              >
                <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                Spin Another Team
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                Ready to Draw a Team?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Click below to randomly pick your team.
              </p>
            </div>
            <Button type="button" variant="primary" size="lg" onClick={onDraw}>
              Draw Random Team
            </Button>
          </div>
        )}
      </div>

      {/* Control Bar: Elimination Toggle & Stats */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-slate-100 rounded-xl text-xs">
        <label className="flex items-center gap-2.5 cursor-pointer font-medium text-slate-700 select-none">
          <input
            type="checkbox"
            checked={isEliminationMode}
            onChange={onToggleElimination}
            className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
          />
          <span>Exclude previously picked teams from pool (Elimination Mode)</span>
        </label>

        <div className="flex items-center gap-3 text-slate-500 font-semibold">
          <span>Remaining: {remainingCount} / {totalCount}</span>
          {pickedHistory.length > 0 && (
            <button
              type="button"
              onClick={onResetPool}
              className="text-brand-600 hover:text-brand-700 underline font-bold"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* History of Drawn Teams */}
      {pickedHistory.length > 0 && (
        <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <History className="w-4 h-4 text-slate-400" />
            <span>Draw History ({pickedHistory.length})</span>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {pickedHistory.map((team, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold bg-slate-50 border-slate-200 text-slate-700"
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: team.primaryColor }}
                />
                #{idx + 1} {team.shortName}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
