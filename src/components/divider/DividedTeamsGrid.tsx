import React, { useState } from 'react';
import { TeamResult } from '../../data/types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Users, Copy, Check, Lock, Unlock, GripVertical } from 'lucide-react';

export interface DividedTeamsGridProps {
  teams: TeamResult[];
  onTeamsChange?: (teams: TeamResult[]) => void;
  onToggleLock?: (teamIndex: number, memberIndex: number) => void;
  containerRef?: React.RefObject<HTMLDivElement>;
}

const TEAM_COLOR_THEMES = [
  { border: 'border-blue-200', bg: 'bg-blue-50/60', badge: 'text-blue-700 bg-blue-100', dot: 'bg-blue-500', dropRing: 'ring-blue-400' },
  { border: 'border-emerald-200', bg: 'bg-emerald-50/60', badge: 'text-emerald-700 bg-emerald-100', dot: 'bg-emerald-500', dropRing: 'ring-emerald-400' },
  { border: 'border-amber-200', bg: 'bg-amber-50/60', badge: 'text-amber-700 bg-amber-100', dot: 'bg-amber-500', dropRing: 'ring-amber-400' },
  { border: 'border-purple-200', bg: 'bg-purple-50/60', badge: 'text-purple-700 bg-purple-100', dot: 'bg-purple-500', dropRing: 'ring-purple-400' },
  { border: 'border-rose-200', bg: 'bg-rose-50/60', badge: 'text-rose-700 bg-rose-100', dot: 'bg-rose-500', dropRing: 'ring-rose-400' },
  { border: 'border-cyan-200', bg: 'bg-cyan-50/60', badge: 'text-cyan-700 bg-cyan-100', dot: 'bg-cyan-500', dropRing: 'ring-cyan-400' },
  { border: 'border-indigo-200', bg: 'bg-indigo-50/60', badge: 'text-indigo-700 bg-indigo-100', dot: 'bg-indigo-500', dropRing: 'ring-indigo-400' },
  { border: 'border-orange-200', bg: 'bg-orange-50/60', badge: 'text-orange-700 bg-orange-100', dot: 'bg-orange-500', dropRing: 'ring-orange-400' },
];

export const DividedTeamsGrid: React.FC<DividedTeamsGridProps> = ({
  teams,
  onTeamsChange,
  onToggleLock,
  containerRef,
}) => {
  const [copiedTeamId, setCopiedTeamId] = useState<number | null>(null);
  const [activeDropTeamIndex, setActiveDropTeamIndex] = useState<number | null>(null);
  const [draggedItem, setDraggedItem] = useState<{
    teamIndex: number;
    memberIndex: number;
    name: string;
  } | null>(null);

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

  // Drag & Drop Handlers
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
    // Only reset if leaving the card entirely
    const related = e.relatedTarget as HTMLElement | null;
    if (!related || !related.closest(`[data-team-card]`)) {
      setActiveDropTeamIndex(null);
    }
  };

  // Move or reorder logic
  const executeMove = (
    targetTeamIndex: number,
    targetSlotIndex: number | null,
    e: React.DragEvent
  ) => {
    e.preventDefault();
    setActiveDropTeamIndex(null);
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
          sourceTeam.lockedIndices = sourceTeam.lockedIndices.map(idx => {
            if (idx === sourceIdx) return destination;
            if (sourceIdx < destination && idx > sourceIdx && idx <= destination) return idx - 1;
            if (sourceIdx > destination && idx >= destination && idx < sourceIdx) return idx + 1;
            return idx;
          }).sort((a, b) => a - b);
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
          targetTeam.lockedIndices = [...(targetTeam.lockedIndices || []), destination].sort(
            (a, b) => a - b
          );
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

          return (
            <Card
              key={team.id}
              data-team-card
              onDragOver={e => handleTeamDragOver(e, tIdx)}
              onDragLeave={handleTeamDragLeave}
              onDrop={e => executeMove(tIdx, null, e)}
              className={`border ${theme.border} transition-all duration-200 hover:shadow-md bg-white flex flex-col justify-between overflow-hidden relative ${
                isDragOver
                  ? `ring-3 ${theme.dropRing} bg-slate-50/50 shadow-lg scale-[1.01]`
                  : ''
              }`}
            >
              <div>
                {/* Team Header */}
                <div
                  className={`px-5 py-3.5 border-b ${theme.border} ${theme.bg} flex items-center justify-between`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-3 h-3 rounded-full ${theme.dot} shadow-sm shrink-0`} />
                    <span className="font-bold text-base text-slate-900 tracking-tight">
                      {team.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
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

                {/* Members List with Drag & Drop and Pinning */}
                <div className="p-4 sm:p-5">
                  {team.members.length === 0 ? (
                    <div className="py-8 text-center border border-dashed border-slate-200 rounded-lg bg-slate-50/50">
                      <p className="text-xs text-slate-400">Empty team.</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Drag players here from other teams or roster cards.
                      </p>
                    </div>
                  ) : (
                    <ol className="space-y-1.5">
                      {team.members.map((member, mIdx) => {
                        const isLocked = Boolean(team.lockedIndices?.includes(mIdx));

                        return (
                          <li
                            key={`${member}-${mIdx}`}
                            draggable
                            onDragStart={e =>
                              handleMemberDragStart(e, tIdx, mIdx, member)
                            }
                            onDragOver={e => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            onDrop={e => {
                              e.stopPropagation();
                              executeMove(tIdx, mIdx, e);
                            }}
                            className={`group relative py-2.5 px-3 rounded-lg border transition-all flex items-center justify-between select-none cursor-grab active:cursor-grabbing ${
                              isLocked
                                ? 'bg-amber-50/80 border-amber-300/80 shadow-xs'
                                : 'bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50/70 shadow-2xs'
                            }`}
                            title="Drag to reorder within team or move to another team"
                          >
                            {/* Member Left Info */}
                            <div className="flex items-center gap-2.5 min-w-0">
                              <GripVertical className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 transition-colors shrink-0" />
                              <span
                                className={`w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center shrink-0 ${
                                  isLocked
                                    ? 'bg-amber-200 text-amber-900'
                                    : 'bg-slate-100 text-slate-500'
                                }`}
                              >
                                {mIdx + 1}
                              </span>
                              <span
                                className={`font-medium text-sm truncate ${
                                  isLocked ? 'text-amber-950 font-semibold' : 'text-slate-900'
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
                                    : 'text-slate-300 hover:text-slate-600 hover:bg-slate-100 opacity-60 group-hover:opacity-100'
                                }`}
                                title={
                                  isLocked
                                    ? 'Locked: will NOT change position on next shuffle. Click to unlock.'
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
                    : 'Drag & drop names freely'}
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
