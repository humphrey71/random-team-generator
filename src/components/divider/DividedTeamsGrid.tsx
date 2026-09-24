import React from 'react';
import { TeamResult } from '../../data/types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Users } from 'lucide-react';

export interface DividedTeamsGridProps {
  teams: TeamResult[];
  containerRef?: React.RefObject<HTMLDivElement>;
}

const TEAM_COLOR_THEMES = [
  { border: 'border-blue-200', bg: 'bg-blue-50/50', badge: 'text-blue-700 bg-blue-100', dot: 'bg-blue-500' },
  { border: 'border-emerald-200', bg: 'bg-emerald-50/50', badge: 'text-emerald-700 bg-emerald-100', dot: 'bg-emerald-500' },
  { border: 'border-amber-200', bg: 'bg-amber-50/50', badge: 'text-amber-700 bg-amber-100', dot: 'bg-amber-500' },
  { border: 'border-purple-200', bg: 'bg-purple-50/50', badge: 'text-purple-700 bg-purple-100', dot: 'bg-purple-500' },
  { border: 'border-rose-200', bg: 'bg-rose-50/50', badge: 'text-rose-700 bg-rose-100', dot: 'bg-rose-500' },
  { border: 'border-cyan-200', bg: 'bg-cyan-50/50', badge: 'text-cyan-700 bg-cyan-100', dot: 'bg-cyan-500' },
  { border: 'border-indigo-200', bg: 'bg-indigo-50/50', badge: 'text-indigo-700 bg-indigo-100', dot: 'bg-indigo-500' },
  { border: 'border-orange-200', bg: 'bg-orange-50/50', badge: 'text-orange-700 bg-orange-100', dot: 'bg-orange-500' },
];

export const DividedTeamsGrid: React.FC<DividedTeamsGridProps> = ({
  teams,
  containerRef,
}) => {
  if (teams.length === 0) {
    return (
      <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-12 text-center">
        <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <h3 className="text-sm font-semibold text-slate-700">No Teams Generated Yet</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          Enter names in the box above and click "Generate Random Teams" to see your balanced groups.
        </p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {teams.map((team, idx) => {
          const theme = TEAM_COLOR_THEMES[idx % TEAM_COLOR_THEMES.length];
          return (
            <Card
              key={team.id}
              className={`border ${theme.border} transition-all duration-200 hover:shadow-md`}
            >
              {/* Team Header */}
              <div className={`px-4 py-3 border-b ${theme.border} ${theme.bg} flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${theme.dot}`} />
                  <span className="font-bold text-sm text-slate-800 tracking-tight">
                    {team.name}
                  </span>
                </div>
                <Badge variant="default" className={theme.badge}>
                  {team.members.length} {team.members.length === 1 ? 'member' : 'members'}
                </Badge>
              </div>

              {/* Members List */}
              <div className="p-3">
                <ol className="divide-y divide-slate-100">
                  {team.members.map((member, mIdx) => (
                    <li
                      key={mIdx}
                      className="py-2 px-2 flex items-center justify-between text-sm text-slate-700 hover:bg-slate-50 rounded"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 text-[11px] font-bold flex items-center justify-center">
                          {mIdx + 1}
                        </span>
                        <span className="font-medium">{member}</span>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
