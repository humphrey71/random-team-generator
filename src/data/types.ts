export interface PlayerTier {
  id: string;
  name: string;
  names: string[];
}

export interface TeamResult {
  id: number;
  name: string;
  members: string[];
  lockedIndices?: number[];
  memberTiers?: Record<string, string>; // memberName -> tierName
}

export type DividerMode = 'by-teams' | 'by-size';

export interface SportsTeam {
  id: string;
  name: string;
  shortName: string;
  city: string;
  league: 'nfl' | 'nba' | 'mlb';
  conference: string;
  division: string;
  primaryColor: string;
  secondaryColor: string;
  logoPath: string;
}

export type PickerMode = 'single' | 'draft';
