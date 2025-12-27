
export interface Participant {
  id: string;
  name: string;
}

export interface Group {
  id: string;
  name: string;
  members: string[];
}

export enum AppMode {
  SETUP = 'setup',
  LUCKY_DRAW = 'lucky_draw',
  GROUPING = 'grouping'
}
