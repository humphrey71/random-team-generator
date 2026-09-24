import React, { useState } from 'react';
import { TeamResult } from '../../data/types';
import { Button } from '../ui/Button';
import { Copy, Check, Download, RefreshCw, Trash2 } from 'lucide-react';
import { toPng } from 'html-to-image';

export interface DividerActionsProps {
  teams: TeamResult[];
  onRerun: () => void;
  onClear?: () => void;
  exportElementRef?: React.RefObject<HTMLDivElement>;
  memberTierMap?: Record<string, string>;
}

export const DividerActions: React.FC<DividerActionsProps> = ({
  teams,
  onRerun,
  onClear,
  exportElementRef,
  memberTierMap,
}) => {
  const [copiedText, setCopiedText] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const formatTeamsText = (): string => {
    return teams
      .map(team => {
        const memberList = team.members
          .map((m, i) => {
            const rawTier = memberTierMap?.[m] || team.memberTiers?.[m];
            const tier = rawTier && rawTier.trim() ? rawTier.trim() : null;
            return `  ${i + 1}. ${m}${tier ? ` (${tier})` : ''}`;
          })
          .join('\n');
        return `### ${team.name} (${team.members.length} members)\n${memberList}`;
      })
      .join('\n\n');
  };

  const handleCopyText = async () => {
    try {
      const text = formatTeamsText();
      await navigator.clipboard.writeText(text);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleDownloadImage = async () => {
    const node = exportElementRef?.current;
    if (!node) return;
    try {
      setDownloading(true);
      const dataUrl = await toPng(node, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#f8fafc',
      });
      const link = document.createElement('a');
      link.download = `teams-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error('Failed to export image', e);
    } finally {
      setDownloading(false);
    }
  };

  if (teams.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={onRerun}
          className="shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1" />
          Rerun Shuffle
        </Button>
        {onClear && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClear}
            className="text-xs text-slate-500 hover:text-rose-600 hover:border-rose-300"
            title="Clear all generated teams"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCopyText}
          title="Copy markdown formatted teams to clipboard"
        >
          {copiedText ? (
            <>
              <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              <span className="text-emerald-700">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 mr-1" />
              Copy Text
            </>
          )}
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleDownloadImage}
          disabled={downloading}
          title="Save results as a clean image"
        >
          <Download className="w-3.5 h-3.5 mr-1" />
          {downloading ? 'Exporting...' : 'Export PNG'}
        </Button>
      </div>
    </div>
  );
};
