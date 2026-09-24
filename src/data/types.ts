export interface TeamResult {
  id: number;
  name: string;
  members: string[];
  lockedIndices?: number[];
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
