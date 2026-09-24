import { describe, it, expect } from 'vitest';
import { divideTeams, parseNamesInput } from '../src/lib/team-divider';

describe('parseNamesInput', () => {
  it('should parse names separated by newlines, commas, and chinese commas', () => {
    const raw = `Alice, Bob\nCharlie，Dana\tEvan   Frank`;
    const names = parseNamesInput(raw);
    expect(names).toEqual(['Alice', 'Bob', 'Charlie', 'Dana', 'Evan', 'Frank']);
  });

  it('should ignore empty lines and whitespace', () => {
    const raw = `\n  Alice \n\n  \n Bob  \n`;
    const names = parseNamesInput(raw);
    expect(names).toEqual(['Alice', 'Bob']);
  });
});

describe('divideTeams', () => {
  const tenNames = [
    'Alex', 'Blake', 'Chris', 'Dana', 'Evan',
    'Frank', 'Grace', 'Henry', 'Ivy', 'Jack'
  ];

  it('should divide 10 people into 2 teams with 5 each', () => {
    const teams = divideTeams(tenNames, 'by-teams', 2);
    expect(teams).toHaveLength(2);
    expect(teams[0].members).toHaveLength(5);
    expect(teams[1].members).toHaveLength(5);

    // All original members must be present
    const allMembers = teams.flatMap(t => t.members);
    expect(allMembers).toHaveLength(10);
    expect(new Set(allMembers)).toEqual(new Set(tenNames));
  });

  it('should strictly balance remainders: 10 people into 3 teams must be 4, 3, 3 (not 4, 4, 2)', () => {
    const teams = divideTeams(tenNames, 'by-teams', 3);
    expect(teams).toHaveLength(3);
    const sizes = teams.map(t => t.members.length).sort((a, b) => b - a);
    expect(sizes).toEqual([4, 3, 3]);
  });

  it('should divide by team size correctly: 10 people with team size 3 yields 4 teams', () => {
    const teams = divideTeams(tenNames, 'by-size', 3);
    // 10 / 3 = 3.33 -> 4 teams
    expect(teams).toHaveLength(4);
    const totalMembers = teams.reduce((sum, t) => sum + t.members.length, 0);
    expect(totalMembers).toBe(10);
    const maxDiff = Math.max(...teams.map(t => t.members.length)) - Math.min(...teams.map(t => t.members.length));
    expect(maxDiff).toBeLessThanOrEqual(1);
  });

  it('should handle edge cases: empty names return empty array', () => {
    expect(divideTeams([], 'by-teams', 2)).toEqual([]);
  });

  it('should cap team count to number of members when members < team count', () => {
    const twoNames = ['Alice', 'Bob'];
    const teams = divideTeams(twoNames, 'by-teams', 5);
    expect(teams).toHaveLength(2);
    expect(teams[0].members).toHaveLength(1);
    expect(teams[1].members).toHaveLength(1);
  });

  it('should preserve locked members at exact team and slot on subsequent shuffles', () => {
    // Initial division: 10 people into 2 teams
    const initialTeams = divideTeams(tenNames, 'by-teams', 2);
    expect(initialTeams).toHaveLength(2);

    // Lock the first person in Team 1 and third person in Team 2
    const captain1 = initialTeams[0].members[0];
    const captain2 = initialTeams[1].members[2];
    initialTeams[0].lockedIndices = [0];
    initialTeams[1].lockedIndices = [2];

    // Run shuffle 10 times, captains must never move
    for (let i = 0; i < 10; i++) {
      const newTeams = divideTeams(tenNames, 'by-teams', 2, initialTeams);
      expect(newTeams[0].members[0]).toBe(captain1);
      expect(newTeams[0].lockedIndices).toContain(0);

      expect(newTeams[1].members[2]).toBe(captain2);
      expect(newTeams[1].lockedIndices).toContain(2);

      // Total members should always be 10, 5 per team
      expect(newTeams[0].members).toHaveLength(5);
      expect(newTeams[1].members).toHaveLength(5);
      const allMembers = newTeams.flatMap(t => t.members);
      expect(new Set(allMembers)).toEqual(new Set(tenNames));
    }
  });

  it('should balance multi-tier players evenly across teams (e.g., 1 captain per team)', () => {
    const tieredRoster = [
      { id: 't1', name: 'Captains', names: ['Captain A', 'Captain B'] },
      { id: 't2', name: 'Players', names: ['P1', 'P2', 'P3', 'P4'] },
    ];

    const teams = divideTeams(tieredRoster, 'by-teams', 2);
    expect(teams).toHaveLength(2);
    expect(teams[0].members).toHaveLength(3);
    expect(teams[1].members).toHaveLength(3);

    // Each team must have exactly 1 captain
    const captainsInTeam0 = teams[0].members.filter(m => m.startsWith('Captain'));
    const captainsInTeam1 = teams[1].members.filter(m => m.startsWith('Captain'));
    expect(captainsInTeam0).toHaveLength(1);
    expect(captainsInTeam1).toHaveLength(1);

    // memberTiers dictionary should map each person to their tier name
    expect(teams[0].memberTiers?.['Captain A']).toBe('Captains');
    expect(teams[0].memberTiers?.['P1']).toBe('Players');
  });
});


