import { shuffleArray } from './shuffle';
import { TeamResult, DividerMode } from '../data/types';

/**
 * Parses raw string input into clean name tokens.
 * Supports delimiters: newlines, commas (English/Chinese), tabs, multiple spaces.
 */
export function parseNamesInput(raw: string): string[] {
  if (!raw || !raw.trim()) return [];

  // Split by newlines, English/Chinese commas, tabs
  return raw
    .split(/[\r\n,\t，]+/)
    .flatMap(part => part.split(/\s{2,}/))
    .map(name => name.trim())
    .filter(Boolean);
}

/**
 * Divides names into balanced teams.
 * Guarantees fair remainder distribution via round-robin assignment.
 */
export function divideTeams(
  rawNames: string[],
  mode: DividerMode,
  value: number
): TeamResult[] {
  const cleaned = rawNames.map(n => n.trim()).filter(Boolean);
  if (cleaned.length === 0) return [];

  const shuffled = shuffleArray(cleaned);

  let teamCount: number;
  if (mode === 'by-teams') {
    teamCount = Math.max(1, Math.min(value, shuffled.length));
  } else {
    const size = Math.max(1, value);
    teamCount = Math.max(1, Math.min(Math.ceil(shuffled.length / size), shuffled.length));
  }

  const teams: TeamResult[] = Array.from({ length: teamCount }, (_, i) => ({
    id: i + 1,
    name: `Team ${i + 1}`,
    members: [],
  }));

  // Distribute via round-robin to ensure optimal balance (e.g. 10 / 3 -> 4, 3, 3)
  shuffled.forEach((member, index) => {
    teams[index % teamCount].members.push(member);
  });

  return teams;
}
