export interface Player {
  id: number;
  name: string;
  jwtToken: string;
  class: number;
  currentXp: number;
  classUpXp: number;
  bpCountdown: number; // milliseconds to full
  enCountdown: number;
  crowns: Crown[];
  pfpUrl: string;
}

export interface Crown {
  type: CrownType;
  amount: number;
}

export enum CrownType {
  gold = "gold",
  silver = "silver",
  bronze = "bronze",
}
