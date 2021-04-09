export interface IPlayer {
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
  Gold,
  Silver,
  Bronze,
}
