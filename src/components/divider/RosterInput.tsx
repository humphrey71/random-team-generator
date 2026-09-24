import React from 'react';
import { Users, RotateCcw, Trash2, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';

export interface RosterInputProps {
  value: string;
  onChange: (val: string) => void;
  namesCount: number;
  onRestoreSample: () => void;
  onClear: () => void;
  duplicatesCount?: number;
}

export const RosterInput: React.FC<RosterInputProps> = ({
  value,
  onChange,
  namesCount,
  onRestoreSample,
  onClear,
  duplicatesCount = 0,
}) => {
  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-brand-600" />
          <span className="font-semibold text-slate-800 text-sm">
            Enter Names ({namesCount})
          </span>
          {duplicatesCount > 0 && (
            <span className="inline-flex items-center gap-1 text-[11px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-medium border border-amber-200" title="Duplicate names detected (each will be treated as a distinct person)">
              <AlertCircle className="w-3 h-3" />
              {duplicatesCount} duplicate{duplicatesCount > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRestoreSample}
            className="text-xs text-slate-500 hover:text-slate-800"
            title="Load sample 10 names"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Sample
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-xs text-slate-400 hover:text-red-600"
            title="Clear list"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            Clear
          </Button>
        </div>
      </div>

      {/* Textarea */}
      <div className="flex-1 relative">
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Paste or type names here (one per line, or separated by commas)..."
          rows={7}
          className="w-full h-full min-h-[160px] p-3 text-sm text-slate-800 placeholder-slate-400 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white resize-y leading-relaxed font-mono"
        />
      </div>

      <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
        <span>Separated by newlines, commas, or tabs</span>
        <span>{namesCount} item{namesCount === 1 ? '' : 's'}</span>
      </div>
    </div>
  );
};
