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

interface LockedSlot {
  name: string;
  teamIndex: number;
  slotIndex: number;
}

/**
 * Divides names into balanced teams.
 * Guarantees fair remainder distribution via round-robin assignment.
 * When previousTeams with lockedIndices is provided, locked positions are strictly preserved.
 */
export function divideTeams(
  rawNames: string[],
  mode: DividerMode,
  value: number,
  previousTeams?: TeamResult[]
): TeamResult[] {
  const cleaned = rawNames.map(n => n.trim()).filter(Boolean);
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
  const lockedNamesSet = new Set<string>();

  // Place locked members into designated slots
  for (const lock of lockedSlots) {
    const { teamIndex, slotIndex, name } = lock;
    const slots = teamSlots[teamIndex];
    if (slotIndex < slots.length && slots[slotIndex] === null) {
      slots[slotIndex] = name;
      lockedIndicesPerTeam[teamIndex].push(slotIndex);
      lockedNamesSet.add(name);
    } else {
      // If designated index is occupied or out of bounds, find first free slot in this team
      const freeIdx = slots.indexOf(null);
      if (freeIdx !== -1) {
        slots[freeIdx] = name;
        lockedIndicesPerTeam[teamIndex].push(freeIdx);
        lockedNamesSet.add(name);
      }
    }
  }

  // Collect unlocked members
  // Account for duplicate names properly
  const lockedNameToCount = new Map<string, number>();
  for (const lock of lockedSlots) {
    lockedNameToCount.set(lock.name, (lockedNameToCount.get(lock.name) || 0) + 1);
  }

  const unlockedMembers: string[] = [];
  for (const name of cleaned) {
    const remainingLockedCount = lockedNameToCount.get(name) || 0;
    if (remainingLockedCount > 0) {
      lockedNameToCount.set(name, remainingLockedCount - 1);
    } else {
      unlockedMembers.push(name);
    }
  }

  // Shuffle unlocked members
  const shuffledUnlocked = shuffleArray(unlockedMembers);
  let unlockedPointer = 0;

  // Fill empty slots across teams
  for (let t = 0; t < teamCount; t++) {
    for (let s = 0; s < teamSlots[t].length; s++) {
      if (teamSlots[t][s] === null && unlockedPointer < shuffledUnlocked.length) {
        teamSlots[t][s] = shuffledUnlocked[unlockedPointer++];
      }
    }
  }

  return teamSlots.map((slots, i) => ({
    id: i + 1,
    name: previousTeams && previousTeams[i] ? previousTeams[i].name : `Team ${i + 1}`,
    members: slots.filter((s): s is string => s !== null),
    lockedIndices: lockedIndicesPerTeam[i].sort((a, b) => a - b),
  }));
}
