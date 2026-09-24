import React, { useState } from 'react';
import {
  Users,
  RotateCcw,
  Trash2,
  AlertCircle,
  GripVertical,
  X,
  LayoutGrid,
  FileText,
  Check,
  Plus,
  Pencil,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { PlayerTier } from '../../data/types';
import { parseTiersInput, serializeTiersToText, parseNamesInput } from '../../lib/team-divider';
import { setCustomDragGhost } from '../../lib/drag-helper';

export interface RosterInputProps {
  tiers: PlayerTier[];
  onTiersChange: (tiers: PlayerTier[]) => void;
  rawText: string;
  onRawTextChange: (val: string) => void;
  namesCount: number;
  onRestoreSample: () => void;
  onClear: () => void;
  duplicatesCount?: number;
  assignedCounts?: Map<string, number>;
}

const TIER_COLORS = [
  { bg: 'bg-brand-50', border: 'border-brand-200', text: 'text-brand-700', badge: 'bg-brand-100 text-brand-800' },
  { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', badge: 'bg-amber-100 text-amber-900' },
  { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-800' },
  { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', badge: 'bg-purple-100 text-purple-800' },
  { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', badge: 'bg-rose-100 text-rose-800' },
];

export const RosterInput: React.FC<RosterInputProps> = ({
  tiers,
  onTiersChange,
  rawText,
  onRawTextChange,
  namesCount,
  onRestoreSample,
  onClear,
  duplicatesCount = 0,
  assignedCounts,
}) => {
  const [activeTab, setActiveTab] = useState<'text' | 'chips'>('chips');
  const [editingTierId, setEditingTierId] = useState<string | null>(null);
  const [editingTierName, setEditingTierName] = useState<string>('');
  const [tierInputTexts, setTierInputTexts] = useState<Record<string, string>>({});

  // Add a new tier
  const handleAddTier = () => {
    const newTierNumber = tiers.length + 1;
    const newTier: PlayerTier = {
      id: `tier-${Date.now()}`,
      name: `Tier ${newTierNumber}`,
      names: [],
    };
    const updated = [...tiers, newTier];
    onTiersChange(updated);
    onRawTextChange(serializeTiersToText(updated));
  };

  // Remove a tier
  const handleRemoveTier = (tierIndex: number) => {
    if (tiers.length <= 1) return;
    const tierToRemove = tiers[tierIndex];
    // Merge names into first tier or previous tier
    const updated = tiers.filter((_, idx) => idx !== tierIndex);
    if (tierToRemove.names.length > 0 && updated.length > 0) {
      updated[0] = {
        ...updated[0],
        names: [...updated[0].names, ...tierToRemove.names],
      };
    }
    onTiersChange(updated);
    onRawTextChange(serializeTiersToText(updated));
  };

  // Start editing tier name
  const handleStartRename = (tier: PlayerTier) => {
    setEditingTierId(tier.id);
    setEditingTierName(tier.name);
  };

  // Save tier name
  const handleSaveRename = (tierIndex: number) => {
    if (editingTierId === null) return;
    const trimmed = editingTierName.trim() || `Tier ${tierIndex + 1}`;
    const updated = tiers.map((t, idx) =>
      idx === tierIndex ? { ...t, name: trimmed } : t
    );
    setEditingTierId(null);
    onTiersChange(updated);
    onRawTextChange(serializeTiersToText(updated));
  };

  // Quick add player to specific tier
  const handleQuickAddPlayer = (tierIndex: number) => {
    const tier = tiers[tierIndex];
    const text = tierInputTexts[tier.id] || '';
    const newNames = parseNamesInput(text);
    if (newNames.length === 0) return;

    const updated = tiers.map((t, idx) =>
      idx === tierIndex ? { ...t, names: [...t.names, ...newNames] } : t
    );
    setTierInputTexts(prev => ({ ...prev, [tier.id]: '' }));
    onTiersChange(updated);
    onRawTextChange(serializeTiersToText(updated));
  };

  // Remove a name chip from a specific tier
  const handleRemoveChip = (tierIndex: number, chipIndex: number) => {
    const updated = tiers.map((t, idx) => {
      if (idx !== tierIndex) return t;
      return {
        ...t,
        names: t.names.filter((_, i) => i !== chipIndex),
      };
    });
    onTiersChange(updated);
    onRawTextChange(serializeTiersToText(updated));
  };

  // Chip drag start
  const handleChipDragStart = (e: React.DragEvent, name: string) => {
    e.dataTransfer.setData('text/plain', name);
    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({ type: 'roster-chip', name })
    );
    e.dataTransfer.effectAllowed = 'copyMove';

    // Set high-visibility custom drag ghost image
    setCustomDragGhost(e, name, 'Assigning');
  };

  // Switch to cards tab: sync rawText -> tiers
  const handleSwitchToCards = () => {
    const parsed = parseTiersInput(rawText);
    onTiersChange(parsed);
    setActiveTab('chips');
  };

  // Switch to text tab: sync tiers -> rawText
  const handleSwitchToText = () => {
    const text = serializeTiersToText(tiers);
    onRawTextChange(text);
    setActiveTab('text');
  };

  // Handle textarea edit
  const handleTextareaChange = (val: string) => {
    onRawTextChange(val);
    const parsed = parseTiersInput(val);
    onTiersChange(parsed);
  };

  // Track assigned count usage for chips across tiers
  const consumedCounts = new Map<string, number>();

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
              onClick={handleSwitchToCards}
              className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors ${
                activeTab === 'chips'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Card view: manage skill tiers and drag names directly"
            >
              <LayoutGrid className="w-3 h-3" />
              <span>Cards</span>
            </button>
            <button
              type="button"
              onClick={handleSwitchToText}
              className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors ${
                activeTab === 'text'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Raw text view: paste bulk lists with # Tier headers"
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
            title="Load sample roster"
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

      {/* Mode 1: Interactive Tiered Cards View */}
      {activeTab === 'chips' ? (
        <div className="flex-1 flex flex-col min-h-[220px]">
          <div className="flex-1 space-y-3.5 overflow-y-auto max-h-[380px] pr-1">
            {tiers.map((tier, tIdx) => {
              const theme = TIER_COLORS[tIdx % TIER_COLORS.length];
              const isEditing = editingTierId === tier.id;

              return (
                <div
                  key={tier.id}
                  className="rounded-xl border border-slate-200/90 bg-slate-50/50 p-3.5 shadow-2xs transition-all"
                >
                  {/* Tier Header with Title & Editable Input */}
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/70 mb-2.5">
                    <div className="flex items-center gap-2">
                      {isEditing ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={editingTierName}
                            onChange={e => setEditingTierName(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') handleSaveRename(tIdx);
                              if (e.key === 'Escape') setEditingTierId(null);
                            }}
                            onBlur={() => handleSaveRename(tIdx)}
                            autoFocus
                            className="px-2 py-0.5 text-xs font-bold text-slate-900 bg-white rounded border border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 w-32"
                            placeholder="Tier name..."
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveRename(tIdx)}
                            className="px-2 py-0.5 bg-brand-600 text-white rounded text-[11px] font-semibold hover:bg-brand-700"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => handleStartRename(tier)}
                          className="group/name flex items-center gap-1.5 cursor-pointer rounded px-1.5 py-0.5 -ml-1.5 hover:bg-white transition-colors"
                          title="Click to rename this tier"
                        >
                          <span className={`font-bold text-sm tracking-tight ${theme.text}`}>
                            {tier.name}
                          </span>
                          <Pencil className="w-3 h-3 text-slate-400 group-hover/name:text-brand-600 transition-colors" />
                        </div>
                      )}

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${theme.badge}`}>
                        {tier.names.length} {tier.names.length === 1 ? 'player' : 'players'}
                      </span>
                    </div>

                    {tiers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTier(tIdx)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition-colors"
                        title="Delete this tier (merges players into Tier 1)"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Tier Names Chips */}
                  {tier.names.length === 0 ? (
                    <div className="py-3 text-center border border-dashed border-slate-200 rounded-lg bg-white">
                      <p className="text-xs text-slate-400">No players in this tier yet.</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Add players below or paste in 'Text' mode.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2 mb-2.5">
                      {tier.names.map((name, idx) => {
                        const totalAssigned = assignedCounts?.get(name) || 0;
                        const alreadyConsumed = consumedCounts.get(name) || 0;
                        const isAssigned = alreadyConsumed < totalAssigned;
                        if (isAssigned) {
                          consumedCounts.set(name, alreadyConsumed + 1);
                        }

                        return (
                          <div
                            key={`${tier.id}-${name}-${idx}`}
                            draggable={!isAssigned}
                            onDragStart={e => {
                              if (!isAssigned) {
                                handleChipDragStart(e, name);
                              }
                            }}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all select-none group bg-white border border-slate-200 shadow-xs ${
                              isAssigned
                                ? 'cursor-default'
                                : 'hover:border-brand-500 hover:ring-2 hover:ring-brand-500/20 hover:bg-brand-50/40 cursor-grab active:cursor-grabbing'
                            }`}
                            title={
                              isAssigned
                                ? 'Assigned to a team. Cannot drag from here. Move or reorder directly in team card.'
                                : 'Drag and drop this person into any team on the right'
                            }
                          >
                            {isAssigned ? (
                              <div
                                className="p-0.5 rounded bg-emerald-50 text-emerald-600 shrink-0"
                                title="Assigned to a team"
                              >
                                <Check className="w-3 h-3 stroke-[2.5]" />
                              </div>
                            ) : (
                              <div className="p-0.5 rounded text-brand-600 bg-brand-50 group-hover:bg-brand-100 transition-colors shrink-0">
                                <GripVertical className="w-3 h-3 stroke-[2.5]" />
                              </div>
                            )}

                            <span className="font-semibold text-slate-900">
                              {name}
                            </span>

                            <button
                              type="button"
                              onClick={() => handleRemoveChip(tIdx, idx)}
                              className="ml-0.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-full p-0.5 transition-colors"
                              title="Remove name from this tier"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Quick Add Input to this Tier */}
                  <div className="flex items-center gap-1.5 mt-2">
                    <input
                      type="text"
                      value={tierInputTexts[tier.id] || ''}
                      onChange={e =>
                        setTierInputTexts(prev => ({
                          ...prev,
                          [tier.id]: e.target.value,
                        }))
                      }
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleQuickAddPlayer(tIdx);
                        }
                      }}
                      placeholder={`+ Add player to ${tier.name} (press Enter)...`}
                      className="flex-1 px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => handleQuickAddPlayer(tIdx)}
                      className="px-2.5 py-1 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors shrink-0"
                    >
                      Add
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Prominent "+ Add Tier" Button exactly as requested */}
            <button
              type="button"
              onClick={handleAddTier}
              className="w-full py-2.5 px-4 border-2 border-dashed border-brand-300 hover:border-brand-500 rounded-xl bg-brand-50/40 hover:bg-brand-50 text-brand-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs hover:shadow-sm"
              title="Add another skill tier (e.g. Captains, Intermediates, Novices)"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              + Add Tier
            </button>
          </div>

          <div className="mt-3 text-[11px] text-slate-500 flex items-center justify-between">
            <span className="text-brand-600 font-medium">
              💡 Players of each tier are distributed evenly across squads
            </span>
            <button
              type="button"
              onClick={handleSwitchToText}
              className="text-slate-400 hover:text-slate-700 underline text-[11px]"
            >
              Edit in bulk
            </button>
          </div>
        </div>
      ) : (
        /* Mode 2: Bulk Textarea */
        <div className="flex-1 flex flex-col min-h-[220px]">
          <textarea
            value={rawText}
            onChange={e => handleTextareaChange(e.target.value)}
            placeholder={`# Tier 1\nAlex\nBlake\n\n# Tier 2\nChris\nDana`}
            rows={8}
            className="w-full flex-1 min-h-[170px] p-3 text-sm text-slate-800 placeholder-slate-400 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white resize-y leading-relaxed font-mono"
          />
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Use '# Tier Name' to define tiers, or plain names for 1 tier</span>
            <button
              type="button"
              onClick={handleSwitchToCards}
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
