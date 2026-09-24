import React from 'react';
import { PickerMode } from '../../data/types';
import { Dices, ListOrdered } from 'lucide-react';
import clsx from 'clsx';

export interface PickerModeSwitchProps {
  mode: PickerMode;
  onChange: (mode: PickerMode) => void;
}

export const PickerModeSwitch: React.FC<PickerModeSwitchProps> = ({ mode, onChange }) => {
  return (
    <div className="flex items-center justify-center">
      <div className="inline-flex p-1 bg-slate-200/80 rounded-xl shadow-inner max-w-sm w-full sm:w-auto">
        <button
          type="button"
          onClick={() => onChange('single')}
          className={clsx(
            'flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all',
            mode === 'single'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          )}
        >
          <Dices className="w-4 h-4 text-brand-600" />
          <span>Pick Single Team</span>
        </button>
        <button
          type="button"
          onClick={() => onChange('draft')}
          className={clsx(
            'flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all',
            mode === 'draft'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          )}
        >
          <ListOrdered className="w-4 h-4 text-amber-500" />
          <span>Draft Order Board</span>
        </button>
      </div>
    </div>
  );
};
