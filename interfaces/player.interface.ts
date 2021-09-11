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


export enum StepMessages{
  PLAYER_UNDEFINED = "Player cant be undefined !",
  NO_CURRENT_MISSION = "Choose a mission first !",
  NOT_ENOUGH_ENERGY = "Not enough energy !",
  ENERGY_REPLENISHED = "Energy replenished !",
  MISSION_IS_LOCKED = "Mission is locked !"
 }
  