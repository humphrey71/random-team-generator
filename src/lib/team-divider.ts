import { shuffleArray } from './shuffle';
import { TeamResult, DividerMode, PlayerTier } from '../data/types';

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
 * Parses multi-tier formatted text.
 * Syntax:
 * # Tier 1 (or === Tier 1 ===)
 * Name 1
 * Name 2
 *
 * If no tier headers are found, wraps all names in a default single tier.
 */
export function parseTiersInput(raw: string): PlayerTier[] {
  if (!raw || !raw.trim()) {
    return [{ id: 'tier-1', name: '', names: [] }];
  }

  const lines = raw.split(/\r?\n/);
  const tierHeaderRegex = /^(?:#+\s*|={2,}\s*|\[)(.*?)(?:\s*={2,}|\]|:)?$/;
  const tiers: PlayerTier[] = [];

  let hasHeaders = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('#') || trimmed.startsWith('==') || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
      hasHeaders = true;
      break;
    }
  }

  // If no tier headers exist, wrap all names in a default unnamed single tier
  if (!hasHeaders) {
    return [{ id: 'tier-1', name: '', names: parseNamesInput(raw) }];
  }

  let currentTierName: string | null = null;
  let currentNames: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const match = trimmed.match(tierHeaderRegex);
    if (match && (trimmed.startsWith('#') || trimmed.startsWith('=') || trimmed.startsWith('['))) {
      if (currentTierName !== null || currentNames.length > 0) {
        tiers.push({
          id: `tier-${tiers.length + 1}-${Date.now()}`,
          name: (currentTierName ?? '').trim(),
          names: currentNames,
        });
        currentNames = [];
      }
      currentTierName = match[1] ? match[1].trim() : '';
    } else {
      const parsed = parseNamesInput(trimmed);
      currentNames.push(...parsed);
    }
  }

  // Push final tier
  if (currentTierName !== null || currentNames.length > 0 || tiers.length === 0) {
    tiers.push({
      id: `tier-${tiers.length + 1}-${Date.now()}`,
      name: (currentTierName ?? '').trim(),
      names: currentNames,
    });
  }

  return tiers;
}

/**
 * Serializes PlayerTier[] back into text.
 * When there's only 1 tier with empty name, outputs clean newline-separated names.
 */
export function serializeTiersToText(tiers: PlayerTier[]): string {
  if (tiers.length === 0) return '';
  if (tiers.length === 1 && !tiers[0].name.trim()) {
    return tiers[0].names.join('\n');
  }

  return tiers
    .map((tier, idx) => {
      const header = tier.name.trim() ? `# ${tier.name}` : `# Tier ${idx + 1}`;
      return `${header}\n${tier.names.join('\n')}`;
    })
    .join('\n\n');
}

interface LockedSlot {
  name: string;
  teamIndex: number;
  slotIndex: number;
}

/**
 * Divides names or tiered rosters into balanced teams.
 * Guarantees fair remainder distribution via round-robin assignment.
 * When multiple tiers are provided, distributes players of each tier evenly across teams.
 * When previousTeams with lockedIndices is provided, locked positions are strictly preserved.
 */
export function divideTeams(
  rawInput: string[] | PlayerTier[],
  mode: DividerMode,
  value: number,
  previousTeams?: TeamResult[],
  shouldShuffle: boolean = true
): TeamResult[] {
  // Normalize input into PlayerTier[]
  let tiers: PlayerTier[];
  if (rawInput.length > 0 && typeof rawInput[0] !== 'string') {
    tiers = rawInput as PlayerTier[];
  } else {
    tiers = [
      {
        id: 'tier-1',
        name: 'Tier 1',
        names: (rawInput as string[]).map(n => n.trim()).filter(Boolean),
      },
    ];
  }

  // Total cleaned names & memberTiers map
  const memberTiers: Record<string, string> = {};
  const cleaned: string[] = [];

  for (const tier of tiers) {
    const validNames = tier.names.map(n => n.trim()).filter(Boolean);
    for (const name of validNames) {
      cleaned.push(name);
      memberTiers[name] = tier.name;
    }
  }

  if (cleaned.length === 0) return [];

  let teamCount: number;
  if (mode === 'by-teams') {
    teamCount = Math.max(1, Math.min(value, cleaned.length));
  } else {
    const size = Math.max(1, value);
    teamCount = Math.max(1, Math.min(Math.ceil(cleaned.length / size), cleaned.length));
  }

  // Calculate target capacity for each team (e.g. 10 / 3 -> 4, 3, 3)
  const baseSize = Math.floor(cleaned.length / teamCount);
  const remainder = cleaned.length % teamCount;
  const targetSizes = Array.from(
    { length: teamCount },
    (_, i) => baseSize + (i < remainder ? 1 : 0)
  );

  // Extract valid locks from previousTeams
  const lockedSlots: LockedSlot[] = [];
  const cleanedNameCounts = new Map<string, number>();
  for (const name of cleaned) {
    cleanedNameCounts.set(name, (cleanedNameCounts.get(name) || 0) + 1);
  }

  if (previousTeams && previousTeams.length > 0) {
    previousTeams.forEach((prevTeam, tIdx) => {
      if (tIdx < teamCount && prevTeam.lockedIndices && prevTeam.lockedIndices.length > 0) {
        for (const slotIdx of prevTeam.lockedIndices) {
          const lockedMemberName = prevTeam.members[slotIdx];
          if (lockedMemberName && (cleanedNameCounts.get(lockedMemberName) || 0) > 0) {
            lockedSlots.push({
              name: lockedMemberName,
              teamIndex: tIdx,
              slotIndex: slotIdx,
            });
            cleanedNameCounts.set(lockedMemberName, cleanedNameCounts.get(lockedMemberName)! - 1);
          }
        }
      }
    });
  }

  // Prepare grid slots for each team
  const teamSlots: (string | null)[][] = targetSizes.map(size => Array(size).fill(null));
  const lockedIndicesPerTeam: number[][] = Array.from({ length: teamCount }, () => []);

  // Place locked members into designated slots
  for (const lock of lockedSlots) {
    const { teamIndex, slotIndex, name } = lock;
    const slots = teamSlots[teamIndex];
    if (slotIndex < slots.length && slots[slotIndex] === null) {
      slots[slotIndex] = name;
      lockedIndicesPerTeam[teamIndex].push(slotIndex);
    } else {
      const freeIdx = slots.indexOf(null);
      if (freeIdx !== -1) {
        slots[freeIdx] = name;
        lockedIndicesPerTeam[teamIndex].push(freeIdx);
      }
    }
  }

  // Track remaining lock counts to prevent re-assigning locked people
  const lockedNameToCount = new Map<string, number>();
  for (const lock of lockedSlots) {
    lockedNameToCount.set(lock.name, (lockedNameToCount.get(lock.name) || 0) + 1);
  }

  // Track how many members of each tier have been assigned to each team
  const tierCountsPerTeam: number[][] = Array.from({ length: teamCount }, () =>
    Array(tiers.length).fill(0)
  );

  // Distribute tier by tier to guarantee balanced skill distribution across teams
  tiers.forEach((tier, tierIdx) => {
    const tierUnlockedMembers: string[] = [];
    for (const name of tier.names.map(n => n.trim()).filter(Boolean)) {
      const remainingLocked = lockedNameToCount.get(name) || 0;
      if (remainingLocked > 0) {
        lockedNameToCount.set(name, remainingLocked - 1);
      } else {
        tierUnlockedMembers.push(name);
      }
    }

    // Shuffle members within this tier (or keep order for deterministic initial SSG rendering)
    const shuffledTier = shouldShuffle
      ? shuffleArray(tierUnlockedMembers)
      : [...tierUnlockedMembers];

    for (const member of shuffledTier) {
      // Find candidate teams that have empty slots
      const availableTeamIndices: number[] = [];
      for (let t = 0; t < teamCount; t++) {
        if (teamSlots[t].includes(null)) {
          availableTeamIndices.push(t);
        }
      }

      if (availableTeamIndices.length === 0) break;

      // Pick the team with the fewest members of this tier
      // Tie breaker: pick team with fewest total filled slots
      availableTeamIndices.sort((a, b) => {
        const diffTier = tierCountsPerTeam[a][tierIdx] - tierCountsPerTeam[b][tierIdx];
        if (diffTier !== 0) return diffTier;
        const filledA = teamSlots[a].filter(s => s !== null).length;
        const filledB = teamSlots[b].filter(s => s !== null).length;
        return filledA - filledB;
      });

      const bestTeamIdx = availableTeamIndices[0];
      const emptySlotIdx = teamSlots[bestTeamIdx].indexOf(null);
      if (emptySlotIdx !== -1) {
        teamSlots[bestTeamIdx][emptySlotIdx] = member;
        tierCountsPerTeam[bestTeamIdx][tierIdx]++;
      }
    }
  });

  return teamSlots.map((slots, i) => ({
    id: i + 1,
    name: previousTeams && previousTeams[i] ? previousTeams[i].name : `Team ${i + 1}`,
    members: slots.filter((s): s is string => s !== null),
    lockedIndices: lockedIndicesPerTeam[i].sort((a, b) => a - b),
    memberTiers,
  }));
}

