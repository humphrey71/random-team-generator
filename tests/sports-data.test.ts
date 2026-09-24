import { describe, it, expect } from 'vitest';
import { NFL_TEAMS } from '../src/data/nfl-teams';
import { NBA_TEAMS } from '../src/data/nba-teams';
import { MLB_TEAMS } from '../src/data/mlb-teams';
import { SportsTeam } from '../src/data/types';

function validateTeams(teams: SportsTeam[], expectedCount: number, league: string) {
  expect(teams).toHaveLength(expectedCount);

  const ids = new Set<string>();
  for (const team of teams) {
    expect(team.id).toBeTruthy();
    expect(team.name).toBeTruthy();
    expect(team.shortName).toBeTruthy();
    expect(team.city).toBeTruthy();
    expect(team.league).toBe(league);
    expect(team.conference).toBeTruthy();
    expect(team.division).toBeTruthy();
    expect(team.primaryColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
    expect(team.logoPath).toBeTruthy();

    expect(ids.has(team.id)).toBe(false);
    ids.add(team.id);
  }
}

describe('Sports metadata integrity', () => {
  it('should have 32 valid NFL teams divided evenly into AFC and NFC (16 each)', () => {
    validateTeams(NFL_TEAMS, 32, 'nfl');
    const afc = NFL_TEAMS.filter(t => t.conference === 'AFC');
    const nfc = NFL_TEAMS.filter(t => t.conference === 'NFC');
    expect(afc).toHaveLength(16);
    expect(nfc).toHaveLength(16);
  });

  it('should have 30 valid NBA teams divided evenly into Eastern and Western (15 each)', () => {
    validateTeams(NBA_TEAMS, 30, 'nba');
    const east = NBA_TEAMS.filter(t => t.conference === 'Eastern');
    const west = NBA_TEAMS.filter(t => t.conference === 'Western');
    expect(east).toHaveLength(15);
    expect(west).toHaveLength(15);
  });

  it('should have 30 valid MLB teams divided evenly into AL and NL (15 each)', () => {
    validateTeams(MLB_TEAMS, 30, 'mlb');
    const al = MLB_TEAMS.filter(t => t.conference === 'AL');
    const nl = MLB_TEAMS.filter(t => t.conference === 'NL');
    expect(al).toHaveLength(15);
    expect(nl).toHaveLength(15);
  });
});
