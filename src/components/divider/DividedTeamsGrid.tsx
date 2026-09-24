import React, { useState } from 'react';
import { TeamResult } from '../../data/types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Users, Copy, Check } from 'lucide-react';

export interface DividedTeamsGridProps {
  teams: TeamResult[];
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
  containerRef,
}) => {
  const [copiedTeamId, setCopiedTeamId] = useState<number | null>(null);

  const handleCopySingleTeam = async (team: TeamResult) => {
    const text = `${team.name} (${team.members.length} members):\n` + team.members.map((m, i) => `${i + 1}. ${m}`).join('\n');
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

  // 宽卡片布局策略：单队占满整行，多队每行最多2列（保持卡片宽裕、名单排版大气，绝不挤压）
  const gridLayoutClass = teams.length === 1
    ? 'grid-cols-1'
    : 'grid-cols-1 sm:grid-cols-2';

  return (
    <div ref={containerRef} className="space-y-4">
      <div className={`grid ${gridLayoutClass} gap-5`}>
        {teams.map((team, idx) => {
          const theme = TEAM_COLOR_THEMES[idx % TEAM_COLOR_THEMES.length];
          const isCopied = copiedTeamId === team.id;

          return (
            <Card
              key={team.id}
              className={`border ${theme.border} transition-all duration-200 hover:shadow-md bg-white flex flex-col justify-between overflow-hidden`}
            >
              <div>
                {/* Team Header - 宽版舒展 */}
                <div className={`px-5 py-3.5 border-b ${theme.border} ${theme.bg} flex items-center justify-between`}>
                  <div className="flex items-center gap-2.5">
                    <span className={`w-3 h-3 rounded-full ${theme.dot} shadow-sm shrink-0`} />
                    <span className="font-bold text-base text-slate-900 tracking-tight">
                      {team.name}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className={`${theme.badge} font-semibold text-xs px-2.5 py-0.5`}>
                      {team.members.length} {team.members.length === 1 ? 'member' : 'members'}
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

                {/* Members List - 宽卡片单项更饱满 */}
                <div className="p-4 sm:p-5">
                  <ol className="divide-y divide-slate-100">
                    {team.members.map((member, mIdx) => (
                      <li
                        key={mIdx}
                        className="py-2.5 px-3 flex items-center justify-between text-sm text-slate-700 hover:bg-slate-50/80 rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs font-bold flex items-center justify-center shrink-0">
                            {mIdx + 1}
                          </span>
                          <span className="font-medium text-slate-900">{member}</span>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Bottom Subtle Bar */}
              <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
                <span>{team.name} Roster</span>
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
