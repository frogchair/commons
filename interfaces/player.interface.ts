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

export interface Step {
  enCountdown: number;
  currentProgress: number;
  encounterType: EncounterType;
  currentMission?: number;
}

export interface EncounterTypePercentages{
  percentages: number,
  encounterType: string
}

export enum EncounterType{
  empty = "empty",
  serendipity = "serendipity" ,  
  battle = "battle",
  end = "end"
}
  
export enum EncounterPercentages{
  empty = 48,
  serendipity = 2 ,  
  battle = 50,
  end = 0
}

  