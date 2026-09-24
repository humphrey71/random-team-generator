import React, { useState } from 'react';
import { TeamResult } from '../../data/types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Users, Copy, Check, Lock, Unlock, GripVertical, Pencil } from 'lucide-react';

export interface DividedTeamsGridProps {
  teams: TeamResult[];
  onTeamsChange?: (teams: TeamResult[]) => void;
  onToggleLock?: (teamIndex: number, memberIndex: number) => void;
  containerRef?: React.RefObject<HTMLDivElement>;
}

const TEAM_COLOR_THEMES = [
  { border: 'border-blue-200', bg: 'bg-blue-50/60', badge: 'text-blue-700 bg-blue-100', dot: 'bg-blue-500' },
  { border: 'border-emerald-200', bg: 'bg-emerald-50/60', badge: 'text-emerald-700 bg-emerald-100', dot: 'bg-emerald-500' },
  { border: 'border-amber-200', bg: 'bg-amber-50/60', badge: 'text-amber-700 bg-amber-100', dot: 'bg-amber-500' },
  { border: 'border-purple-200', bg: 'bg-purple-50/60', badge: 'text-purple-700 bg-purple-100', dot: 'bg-purple-500' },
  { border: 'border-rose-200', bg: 'bg-rose-50/60', badge: 'text-rose-700 bg-rose-100', dot: 'bg-rose-500' },
  { border: 'border-cyan-200', bg: 'bg-cyan-50/60', badge: 'text-cyan-700 bg-cyan-100', dot: 'bg-cyan-500' },
  { border: 'border-indigo-200', bg: 'bg-indigo-50/60', badge: 'text-indigo-700 bg-indigo-100', dot: 'bg-indigo-500' },
  { border: 'border-orange-200', bg: 'bg-orange-50/60', badge: 'text-orange-700 bg-orange-100', dot: 'bg-orange-500' },
];

export const DividedTeamsGrid: React.FC<DividedTeamsGridProps> = ({
  teams,
  onTeamsChange,
  onToggleLock,
  containerRef,
}) => {
  const [copiedTeamId, setCopiedTeamId] = useState<number | null>(null);
  const [activeDropTeamIndex, setActiveDropTeamIndex] = useState<number | null>(null);
  const [dropSlotIndicator, setDropSlotIndicator] = useState<{
    teamIndex: number;
    memberIndex: number;
  } | null>(null);

  // Editable team names state
  const [editingTeamId, setEditingTeamId] = useState<number | null>(null);
  const [tempTeamName, setTempTeamName] = useState<string>('');

  const [draggedItem, setDraggedItem] = useState<{
    teamIndex: number;
    memberIndex: number;
    name: string;
  } | null>(null);

  const handleStartRename = (team: TeamResult) => {
    setEditingTeamId(team.id);
    setTempTeamName(team.name);
  };

  const handleSaveRename = (teamIndex: number) => {
    const trimmed = tempTeamName.trim();
    if (trimmed && onTeamsChange) {
      const updated = teams.map((t, idx) =>
        idx === teamIndex ? { ...t, name: trimmed } : t
      );
      onTeamsChange(updated);
    }
    setEditingTeamId(null);
  };

  const handleCopySingleTeam = async (team: TeamResult) => {
    const text =
      `${team.name} (${team.members.length} members):\n` +
      team.members.map((m, i) => `${i + 1}. ${m}`).join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTeamId(team.id);
      setTimeout(() => setCopiedTeamId(null), 2000);
    } catch {
      // fallback
    }
  };

  if (teams.length === 0) {
    return (
      <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-12 text-center">
        <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <h3 className="text-sm font-semibold text-slate-700">No Teams Generated Yet</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          Enter names in the box on the left and click "Generate Random Teams" to see your balanced groups.
        </p>
      </div>
    );
  }

  // Drag & Drop Handlers with theme highlight
  const handleMemberDragStart = (
    e: React.DragEvent,
    teamIndex: number,
    memberIndex: number,
    name: string
  ) => {
    setDraggedItem({ teamIndex, memberIndex, name });
    const payload = {
      type: 'team-member',
      sourceTeamIndex: teamIndex,
      sourceMemberIndex: memberIndex,
      name,
    };
    e.dataTransfer.setData('application/json', JSON.stringify(payload));
    e.dataTransfer.setData('text/plain', name);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleTeamDragOver = (e: React.DragEvent, teamIndex: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (activeDropTeamIndex !== teamIndex) {
      setActiveDropTeamIndex(teamIndex);
    }
  };

  const handleTeamDragLeave = (e: React.DragEvent) => {
    const related = e.relatedTarget as HTMLElement | null;
    if (!related || !related.closest(`[data-team-card]`)) {
      setActiveDropTeamIndex(null);
      setDropSlotIndicator(null);
    }
  };

  const handleMemberDragOver = (
    e: React.DragEvent,
    teamIndex: number,
    memberIndex: number
  ) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    setDropSlotIndicator({ teamIndex, memberIndex });
    setActiveDropTeamIndex(teamIndex);
  };

  // Move or reorder logic
  const executeMove = (
    targetTeamIndex: number,
    targetSlotIndex: number | null,
    e: React.DragEvent
  ) => {
    e.preventDefault();
    setActiveDropTeamIndex(null);
    setDropSlotIndicator(null);
    setDraggedItem(null);

    if (!onTeamsChange) return;

    let payload: {
      type: string;
      sourceTeamIndex?: number;
      sourceMemberIndex?: number;
      name: string;
    } | null = null;

    try {
      const json = e.dataTransfer.getData('application/json');
      if (json) {
        payload = JSON.parse(json);
      }
    } catch {
      // fallback
    }

    if (!payload && draggedItem) {
      payload = {
        type: 'team-member',
        sourceTeamIndex: draggedItem.teamIndex,
        sourceMemberIndex: draggedItem.memberIndex,
        name: draggedItem.name,
      };
    }

    if (!payload || !payload.name) return;

    const newTeams: TeamResult[] = teams.map(t => ({
      ...t,
      members: [...t.members],
      lockedIndices: t.lockedIndices ? [...t.lockedIndices] : [],
    }));

    const memberName = payload.name;

    // Case 1: Dragged from another team or within the same team
    if (
      payload.type === 'team-member' &&
      payload.sourceTeamIndex !== undefined &&
      payload.sourceMemberIndex !== undefined
    ) {
      const sourceTeam = newTeams[payload.sourceTeamIndex];
      const targetTeam = newTeams[targetTeamIndex];
      const sourceIdx = payload.sourceMemberIndex;

      // Same team reordering
      if (payload.sourceTeamIndex === targetTeamIndex) {
        if (targetSlotIndex === null || targetSlotIndex === sourceIdx) return;
        const [movedMember] = sourceTeam.members.splice(sourceIdx, 1);
        const destination =
          targetSlotIndex > sourceIdx ? targetSlotIndex - 1 : targetSlotIndex;
        sourceTeam.members.splice(destination, 0, movedMember);

        // Update lockedIndices positions if applicable
        if (sourceTeam.lockedIndices && sourceTeam.lockedIndices.length > 0) {
          sourceTeam.lockedIndices = sourceTeam.lockedIndices
            .map(idx => {
              if (idx === sourceIdx) return destination;
              if (sourceIdx < destination && idx > sourceIdx && idx <= destination)
                return idx - 1;
              if (sourceIdx > destination && idx >= destination && idx < sourceIdx)
                return idx + 1;
              return idx;
            })
            .sort((a, b) => a - b);
        }
      } else {
        // Cross-team move
        const wasLocked = sourceTeam.lockedIndices?.includes(sourceIdx);
        sourceTeam.members.splice(sourceIdx, 1);
        if (sourceTeam.lockedIndices) {
          sourceTeam.lockedIndices = sourceTeam.lockedIndices
            .filter(idx => idx !== sourceIdx)
            .map(idx => (idx > sourceIdx ? idx - 1 : idx));
        }

        const destination =
          targetSlotIndex !== null ? targetSlotIndex : targetTeam.members.length;
        targetTeam.members.splice(destination, 0, memberName);

        if (wasLocked) {
          targetTeam.lockedIndices = [
            ...(targetTeam.lockedIndices || []),
            destination,
          ].sort((a, b) => a - b);
        }
      }
    } else if (payload.type === 'roster-chip') {
      // Case 2: Dragged from parsed roster chips pool
      const targetTeam = newTeams[targetTeamIndex];
      const destination =
        targetSlotIndex !== null ? targetSlotIndex : targetTeam.members.length;
      targetTeam.members.splice(destination, 0, memberName);
    }

    onTeamsChange(newTeams);
  };

  const gridLayoutClass =
    teams.length === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2';

  return (
    <div ref={containerRef} className="space-y-4">
      <div className={`grid ${gridLayoutClass} gap-5`}>
        {teams.map((team, tIdx) => {
          const theme = TEAM_COLOR_THEMES[tIdx % TEAM_COLOR_THEMES.length];
          const isCopied = copiedTeamId === team.id;
          const isDragOver = activeDropTeamIndex === tIdx;
          const isEditingName = editingTeamId === team.id;

          return (
            <Card
              key={team.id}
              data-team-card
              onDragOver={e => handleTeamDragOver(e, tIdx)}
              onDragLeave={handleTeamDragLeave}
              onDrop={e => executeMove(tIdx, null, e)}
              className={`border transition-all duration-200 bg-white flex flex-col justify-between overflow-hidden relative ${
                isDragOver
                  ? 'border-brand-500 ring-4 ring-brand-500/25 bg-brand-50/20 shadow-xl scale-[1.01]'
                  : `${theme.border} hover:shadow-md`
              }`}
            >
              <div>
                {/* Team Header with Inline Editable Name */}
                <div
                  className={`px-5 py-3.5 border-b ${theme.border} ${theme.bg} flex items-center justify-between transition-colors`}
                >
                  <div className="flex items-center gap-2.5 flex-1 mr-2 min-w-0">
                    <span
                      className={`w-3 h-3 rounded-full ${theme.dot} shadow-sm shrink-0`}
                    />

                    {isEditingName ? (
                      <div className="flex items-center gap-1.5 flex-1">
                        <input
                          type="text"
                          value={tempTeamName}
                          onChange={e => setTempTeamName(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') handleSaveRename(tIdx);
                            if (e.key === 'Escape') setEditingTeamId(null);
                          }}
                          onBlur={() => handleSaveRename(tIdx)}
                          autoFocus
                          className="px-2 py-0.5 text-sm font-bold text-slate-900 bg-white rounded border border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 w-full"
                          placeholder="Team name..."
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveRename(tIdx)}
                          className="px-2 py-0.5 bg-brand-600 text-white rounded text-xs font-semibold hover:bg-brand-700"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => handleStartRename(team)}
                        className="group/name flex items-center gap-1.5 cursor-pointer rounded px-1.5 py-0.5 -ml-1.5 hover:bg-white/80 transition-colors truncate"
                        title="Click to edit team name"
                      >
                        <span className="font-bold text-base text-slate-900 tracking-tight truncate">
                          {team.name}
                        </span>
                        <Pencil className="w-3.5 h-3.5 text-slate-400 group-hover/name:text-brand-600 transition-colors shrink-0" />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      variant="default"
                      className={`${theme.badge} font-semibold text-xs px-2.5 py-0.5`}
                    >
                      {team.members.length}{' '}
                      {team.members.length === 1 ? 'member' : 'members'}
                    </Badge>
                    <button
                      type="button"
                      onClick={() => handleCopySingleTeam(team)}
                      className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-white/80 transition-colors"
                      title="Copy this team roster"
                    >
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Drop Zone Highlight Header Message */}
                {isDragOver && (
                  <div className="bg-brand-500 text-white text-xs font-bold text-center py-1 tracking-wide animate-pulse">
                    ✨ Drop here to assign to {team.name}
                  </div>
                )}

                {/* Members List with Theme-Colored Drag Handles & Insertion Line */}
                <div className="p-4 sm:p-5">
                  {team.members.length === 0 ? (
                    <div className="py-8 text-center border-2 border-dashed border-slate-200 rounded-lg bg-slate-50/50">
                      <p className="text-xs text-slate-500 font-medium">Empty team.</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Drag players here from other teams or roster cards.
                      </p>
                    </div>
                  ) : (
                    <ol className="space-y-1.5">
                      {team.members.map((member, mIdx) => {
                        const isLocked = Boolean(
                          team.lockedIndices?.includes(mIdx)
                        );
                        const isHoveredSlot =
                          dropSlotIndicator?.teamIndex === tIdx &&
                          dropSlotIndicator?.memberIndex === mIdx;

                        return (
                          <li
                            key={`${member}-${mIdx}`}
                            draggable
                            onDragStart={e =>
                              handleMemberDragStart(e, tIdx, mIdx, member)
                            }
                            onDragOver={e =>
                              handleMemberDragOver(e, tIdx, mIdx)
                            }
                            onDrop={e => {
                              e.stopPropagation();
                              executeMove(tIdx, mIdx, e);
                            }}
                            className={`group relative py-2.5 px-3 rounded-lg border transition-all flex items-center justify-between select-none cursor-grab active:cursor-grabbing ${
                              isHoveredSlot
                                ? 'border-t-3 border-t-brand-600 bg-brand-50/60 ring-2 ring-brand-500/20 shadow-md'
                                : isLocked
                                  ? 'bg-amber-50/80 border-amber-300/80 shadow-xs'
                                  : 'bg-white border-slate-200 hover:border-brand-400 hover:bg-brand-50/20 hover:shadow-sm'
                            }`}
                            title="Drag handle to reorder within team or move to another team"
                          >
                            {/* Member Left Info with Theme-colored Grip */}
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div
                                className="p-1 -ml-1 rounded text-brand-600 bg-brand-50/60 group-hover:bg-brand-100 group-hover:text-brand-700 transition-colors shrink-0"
                                title="Drag handle"
                              >
                                <GripVertical className="w-4 h-4 stroke-[2.5]" />
                              </div>
                              <span
                                className={`w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center shrink-0 ${
                                  isLocked
                                    ? 'bg-amber-200 text-amber-900'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {mIdx + 1}
                              </span>
                              <span
                                className={`font-medium text-sm truncate ${
                                  isLocked
                                    ? 'text-amber-950 font-semibold'
                                    : 'text-slate-900'
                                }`}
                              >
                                {member}
                              </span>
                            </div>

                            {/* Member Right Tools: Lock / Pin Button */}
                            <div className="flex items-center gap-1.5 shrink-0 ml-2">
                              {isLocked && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100/90 text-amber-800 border border-amber-300">
                                  <Lock className="w-2.5 h-2.5" />
                                  Pinned
                                </span>
                              )}

                              <button
                                type="button"
                                onClick={e => {
                                  e.stopPropagation();
                                  if (onToggleLock) {
                                    onToggleLock(tIdx, mIdx);
                                  }
                                }}
                                className={`p-1.5 rounded-md transition-all ${
                                  isLocked
                                    ? 'text-amber-700 hover:bg-amber-200/60'
                                    : 'text-slate-400 hover:text-brand-600 hover:bg-brand-50'
                                }`}
                                title={
                                  isLocked
                                    ? 'Position locked on shuffle. Click to unlock.'
                                    : 'Click to lock this person in this team & slot on next shuffle'
                                }
                              >
                                {isLocked ? (
                                  <Lock className="w-4 h-4 text-amber-600 fill-amber-600/30" />
                                ) : (
                                  <Unlock className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </li>
                        );
                      })}
                    </ol>
                  )}
                </div>
              </div>

              {/* Bottom Bar */}
              <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
                <span>
                  {team.lockedIndices && team.lockedIndices.length > 0
                    ? `${team.lockedIndices.length} position(s) pinned`
                    : 'Click name to rename • Drag to reorder'}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopySingleTeam(team)}
                  className="hover:text-brand-600 font-medium transition-colors"
                >
                  {isCopied ? 'Copied!' : 'Copy names'}
                </button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
