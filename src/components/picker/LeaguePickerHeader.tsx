import React from 'react';
import { Badge } from '../ui/Badge';
import clsx from 'clsx';

export interface LeaguePickerHeaderProps {
  leagueTitle: string;
  leagueShortName: string;
  totalTeams: number;
  filteredCount: number;
  conferences: string[];
  selectedConference: string;
  onSelectConference: (conf: string) => void;
}

export const LeaguePickerHeader: React.FC<LeaguePickerHeaderProps> = ({
  leagueTitle,
  leagueShortName,
  totalTeams,
  filteredCount,
  conferences,
  selectedConference,
  onSelectConference,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {leagueTitle}
            </h2>
            <Badge variant="brand" className="text-xs">
              {totalTeams} Teams
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Filter by conference ({filteredCount} of {totalTeams} shown) or draw from the entire {leagueShortName} franchise pool.
          </p>
        </div>

        {/* Conference Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg self-start sm:self-auto">
          <button
            type="button"
            onClick={() => onSelectConference('all')}
            className={clsx(
              'px-3 py-1.5 text-xs font-semibold rounded-md transition-all',
              selectedConference === 'all'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            All ({totalTeams})
          </button>
          {conferences.map(conf => (
            <button
              key={conf}
              type="button"
              onClick={() => onSelectConference(conf)}
              className={clsx(
                'px-3 py-1.5 text-xs font-semibold rounded-md transition-all',
                selectedConference === conf
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              {conf}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
