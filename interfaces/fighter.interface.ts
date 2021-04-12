import { Class, Rarity, Sign, Tribe } from "../enums/shared.enum";
import { Gear } from "./gear.interface";
import { LeaderSkill, Skill } from "./skill.interface";

export interface FighterStats {
  hp: number;
  atk: number;
  def: number;
  wis: number;
  agi: number;
}

// home view
export interface Fighter {
  id: number;
  imageUrl: string;
}

// band view
export interface BandFighter extends Fighter {
  edge: boolean;
  currentLevel: number;
  maxLevel: number;
  sign: Sign;
  rarity: Rarity;
  gear: Gear;
}

// details view
export interface DetailFighter extends BandFighter {
  name: string;
  currentXp: number;
  levelUpXp: number;
  locked: boolean;
  baseStats: FighterStats;
  tribe: Tribe;
  class: Class;
  edgeStats?: FighterStats;
  edgeBonus?: number;
  lore: string;
  skill: Skill;
  cd: number;
  leaderSkill: LeaderSkill;
}

// battle view
export interface BattleFighter extends Fighter {
  skill: Skill;
  battleStats: FighterStats;
  battleCd: number;
}
