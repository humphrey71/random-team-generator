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
  const safeMax = Math.max(10, maxTeams);

  const handleDecrement = () => {
    if (value > 1) onValueChange(value - 1);
  };

  const handleIncrement = () => {
    if (value < safeMax) onValueChange(value + 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    if (rawVal === '') {
      onValueChange(1);
      return;
    }
    const parsed = parseInt(rawVal, 10);
    if (!isNaN(parsed)) {
      const bounded = Math.max(1, Math.min(safeMax, parsed));
      onValueChange(bounded);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseInt(e.target.value, 10);
    if (!isNaN(parsed)) {
      onValueChange(Math.max(1, Math.min(safeMax, parsed)));
    }
  };

  const presets = mode === 'by-teams' ? [2, 3, 4, 5, 8] : [2, 3, 4, 5, 10];

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

      {/* Stepper + Direct Input + Slider Control */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
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

        {/* Number Box with Steppers & Editable Input */}
        <div className="flex items-center justify-between gap-3 bg-slate-50 border border-slate-200 rounded-xl p-2 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 transition-all">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDecrement}
            disabled={value <= 1}
            className="w-10 h-10 p-0 rounded-lg shrink-0 text-slate-700 hover:bg-white hover:text-brand-600"
            aria-label="Decrease"
          >
            <Minus className="w-4 h-4" />
          </Button>

          <div className="flex-1 text-center flex flex-col items-center justify-center">
            <div className="flex items-center justify-center">
              <input
                type="number"
                min={1}
                max={safeMax}
                value={value}
                onChange={handleInputChange}
                className="w-20 text-center text-3xl font-extrabold text-slate-900 bg-transparent border-b-2 border-transparent focus:border-brand-500 focus:outline-none p-0 leading-tight [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none cursor-text selection:bg-brand-100"
                title="Click to type a custom number"
              />
            </div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
              {mode === 'by-teams' ? 'Teams' : 'Members / Team'} (Type or slide)
            </span>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleIncrement}
            disabled={value >= safeMax}
            className="w-10 h-10 p-0 rounded-lg shrink-0 text-slate-700 hover:bg-white hover:text-brand-600"
            aria-label="Increase"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Range Slider for Smooth Adjustments */}
        <div className="pt-1 px-1">
          <input
            type="range"
            min={1}
            max={safeMax}
            value={value}
            onChange={handleSliderChange}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600 hover:accent-brand-700 focus:outline-none transition-all"
            aria-label="Slider adjustment"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-medium mt-1">
            <span>1</span>
            <span>{Math.round(safeMax / 2)}</span>
            <span>{safeMax} max</span>
          </div>
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
