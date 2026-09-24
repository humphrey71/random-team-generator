import React from 'react';
import { DividerMode } from '../../data/types';
import { Button } from '../ui/Button';
import { Dices, Minus, Plus } from 'lucide-react';
import clsx from 'clsx';

export interface DividerControlsProps {
  mode: DividerMode;
  onModeChange: (mode: DividerMode) => void;
  value: number;
  onValueChange: (val: number) => void;
  onGenerate: () => void;
  maxTeams?: number;
}

export const DividerControls: React.FC<DividerControlsProps> = ({
  mode,
  onModeChange,
  value,
  onValueChange,
  onGenerate,
  maxTeams = 30,
}) => {
  const handleDecrement = () => {
    if (value > 1) onValueChange(value - 1);
  };

  const handleIncrement = () => {
    if (value < maxTeams) onValueChange(value + 1);
  };

  const presets = mode === 'by-teams' ? [2, 3, 4, 5] : [2, 3, 4, 5];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-5">
      {/* Mode Switch Tabs */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
          Split Method
        </label>
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-lg">
          <button
            type="button"
            onClick={() => onModeChange('by-teams')}
            className={clsx(
              'py-2 text-xs sm:text-sm font-semibold rounded-md transition-all',
              mode === 'by-teams'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            Number of Teams
          </button>
          <button
            type="button"
            onClick={() => onModeChange('by-size')}
            className={clsx(
              'py-2 text-xs sm:text-sm font-semibold rounded-md transition-all',
              mode === 'by-size'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            Members Per Team
          </button>
        </div>
      </div>

      {/* Stepper Control */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {mode === 'by-teams' ? 'Total Teams Needed' : 'Target Team Size'}
          </label>
          <div className="flex items-center gap-1">
            {presets.map(p => (
              <button
                key={p}
                type="button"
                onClick={() => onValueChange(p)}
                className={clsx(
                  'px-2 py-0.5 text-xs rounded border font-medium transition-colors',
                  value === p
                    ? 'bg-brand-50 border-brand-300 text-brand-700 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 bg-slate-50 border border-slate-200 rounded-lg p-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDecrement}
            disabled={value <= 1}
            className="w-10 h-10 p-0 rounded-md"
            aria-label="Decrease"
          >
            <Minus className="w-4 h-4" />
          </Button>

          <div className="flex-1 text-center">
            <span className="text-2xl font-extrabold text-slate-900 block leading-tight">
              {value}
            </span>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
              {mode === 'by-teams' ? 'Teams' : 'Members / Team'}
            </span>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleIncrement}
            disabled={value >= maxTeams}
            className="w-10 h-10 p-0 rounded-md"
            aria-label="Increase"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Primary Action Button */}
      <Button
        type="button"
        variant="primary"
        size="lg"
        onClick={onGenerate}
        className="w-full text-base py-3.5 shadow-md shadow-brand-500/20"
      >
        <Dices className="w-5 h-5 mr-2 animate-bounce" />
        Generate Random Teams
      </Button>
    </div>
  );
};
