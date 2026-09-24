import React, { useState } from 'react';
import { SportsTeam } from '../../data/types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Copy, Check, RefreshCw, Trophy, Download } from 'lucide-react';
import { toPng } from 'html-to-image';

export interface DraftOrderTableProps {
  teams: SportsTeam[];
  onReshuffle: () => void;
  leagueTitle: string;
}

export const DraftOrderTable: React.FC<DraftOrderTableProps> = ({
  teams,
  onReshuffle,
  leagueTitle,
}) => {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const tableRef = React.useRef<HTMLDivElement>(null);

  const handleCopy = async () => {
    const text = teams
      .map((team, idx) => `${idx + 1}. ${team.name} (${team.conference})`)
      .join('\n');

    try {
      await navigator.clipboard.writeText(`${leagueTitle} Randomized Draft Order:\n\n${text}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleExport = async () => {
    if (!tableRef.current) return;
    try {
      setDownloading(true);
      const dataUrl = await toPng(tableRef.current, {
        backgroundColor: '#ffffff',
        cacheBust: true,
      });
      const link = document.createElement('a');
      link.download = `draft-order-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Action Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          <span className="font-bold text-sm text-slate-900">
            Randomized Draft Order ({teams.length} Picks)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={onReshuffle}
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" />
            Shuffle Order
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                <span className="text-emerald-700">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1" />
                Copy Order
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={downloading}
          >
            <Download className="w-3.5 h-3.5 mr-1" />
            {downloading ? 'Exporting...' : 'Export PNG'}
          </Button>
        </div>
      </div>

      {/* Table Container */}
      <div
        ref={tableRef}
        className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm p-4 sm:p-6"
      >
        <div className="mb-4 pb-3 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              {leagueTitle} Official Draft Board
            </h3>
            <p className="text-xs text-slate-500">
              Generated via fair random lottery order.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {new Date().toLocaleDateString()}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
          {teams.map((team, idx) => (
            <div
              key={team.id}
              className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-md bg-slate-200 text-slate-700 font-extrabold text-xs flex items-center justify-center font-mono">
                  {idx + 1}
                </span>

                <div
                  className="w-7 h-7 rounded-md flex items-center justify-center font-bold text-[10px] text-white shadow-xs"
                  style={{ backgroundColor: team.primaryColor }}
                >
                  {team.shortName.slice(0, 3).toUpperCase()}
                </div>

                <div>
                  <span className="font-semibold text-xs sm:text-sm text-slate-900 block leading-tight">
                    {team.name}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {team.city}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <Badge variant="default" className="text-[10px]">
                  {team.conference}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
