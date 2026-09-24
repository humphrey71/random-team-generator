import { SportsTeam } from './types';
import { NFL_TEAMS } from './nfl-teams';
import { NBA_TEAMS } from './nba-teams';
import { MLB_TEAMS } from './mlb-teams';

export function getTeamsByLeague(league: 'nfl' | 'nba' | 'mlb'): SportsTeam[] {
  switch (league) {
    case 'nfl':
      return NFL_TEAMS;
    case 'nba':
      return NBA_TEAMS;
    case 'mlb':
      return MLB_TEAMS;
    default:
      return [];
  }
}

export function getConferencesByLeague(league: 'nfl' | 'nba' | 'mlb'): string[] {
  switch (league) {
    case 'nfl':
      return ['AFC', 'NFC'];
    case 'nba':
      return ['Eastern', 'Western'];
    case 'mlb':
      return ['AL', 'NL'];
    default:
      return [];
  }
}
