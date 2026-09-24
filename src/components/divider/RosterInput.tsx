import React, { useState } from 'react';
import { Users, RotateCcw, Trash2, AlertCircle, GripVertical, X, LayoutGrid, FileText } from 'lucide-react';
import { Button } from '../ui/Button';
import { parseNamesInput } from '../../lib/team-divider';

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
  const [activeTab, setActiveTab] = useState<'text' | 'chips'>('chips');
  const parsedNames = parseNamesInput(value);

  const handleRemoveChip = (indexToRemove: number) => {
    const updated = parsedNames.filter((_, idx) => idx !== indexToRemove);
    onChange(updated.join('\n'));
  };

  const handleChipDragStart = (e: React.DragEvent, name: string) => {
    e.dataTransfer.setData('text/plain', name);
    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({ type: 'roster-chip', name })
    );
    e.dataTransfer.effectAllowed = 'copyMove';
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-brand-600" />
          <span className="font-semibold text-slate-800 text-sm">
            Roster ({namesCount})
          </span>
          {duplicatesCount > 0 && (
            <span
              className="inline-flex items-center gap-1 text-[11px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-medium border border-amber-200"
              title="Duplicate names detected (each will be treated as a distinct person)"
            >
              <AlertCircle className="w-3 h-3" />
              {duplicatesCount} duplicate{duplicatesCount > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* View Switch & Actions */}
        <div className="flex items-center gap-1.5">
          <div className="bg-slate-100 p-0.5 rounded-lg flex items-center mr-1">
            <button
              type="button"
              onClick={() => setActiveTab('chips')}
              className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors ${
                activeTab === 'chips'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Card view: drag names directly"
            >
              <LayoutGrid className="w-3 h-3" />
              <span>Cards</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('text')}
              className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors ${
                activeTab === 'text'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Raw text view: paste bulk lists"
            >
              <FileText className="w-3 h-3" />
              <span>Text</span>
            </button>
          </div>

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

      {/* Mode 1: Interactive Name Chips / Cards */}
      {activeTab === 'chips' ? (
        <div className="flex-1 flex flex-col min-h-[180px]">
          <div className="flex-1 p-3 bg-slate-50/70 border border-slate-200 rounded-lg overflow-y-auto max-h-[220px]">
            {parsedNames.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <p className="text-xs text-slate-400">No names yet.</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Click 'Sample' or switch to 'Text' tab to paste names.
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {parsedNames.map((name, idx) => (
                  <div
                    key={`${name}-${idx}`}
                    draggable
                    onDragStart={e => handleChipDragStart(e, name)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 shadow-xs hover:border-brand-400 hover:shadow-sm cursor-grab active:cursor-grabbing transition-all select-none group"
                    title="Drag and drop this person into any team on the right"
                  >
                    <GripVertical className="w-3 h-3 text-slate-300 group-hover:text-brand-500 transition-colors" />
                    <span>{name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveChip(idx)}
                      className="ml-0.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-full p-0.5 transition-colors"
                      title="Remove name"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
            <span className="text-brand-600 font-medium">💡 Drag any card into a team on the right</span>
            <button
              type="button"
              onClick={() => setActiveTab('text')}
              className="text-slate-400 hover:text-slate-700 underline text-[11px]"
            >
              Edit in bulk
            </button>
          </div>
        </div>
      ) : (
        /* Mode 2: Bulk Textarea */
        <div className="flex-1 flex flex-col min-h-[180px]">
          <textarea
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="Paste or type names here (one per line, or separated by commas)..."
            rows={7}
            className="w-full flex-1 min-h-[150px] p-3 text-sm text-slate-800 placeholder-slate-400 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white resize-y leading-relaxed font-mono"
          />
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Separated by newlines, commas, or tabs</span>
            <button
              type="button"
              onClick={() => setActiveTab('chips')}
              className="text-brand-600 hover:text-brand-700 font-semibold"
            >
              Done editing → View cards
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
