import { Gear } from "./gear.interface";
import { LeaderSkill, Skill } from "./skill.interface";

export interface Stats {
  hp: number;
  atk: number;
  def: number;
  wis: number;
  agi: number;
}

export enum Tribe {
  hemi = "hemi",
  theri = "theri",
  xana = "xana",
}

export enum Sign {
  air = "air",
  earth = "earth",
  fire = "fire",
  lightning = "lightning",
  water = "water",
}

export enum Class {
  champ = "champ",
  guru = "guru",
  rogue = "rogue",
  scout = "scout",
  warlock = "warlcok",
}

export enum Rarity {
  common = "common",
  uncommon = "uncommon",
  rare = "rare",
  epic = "epic",
  legendary = "legendary",
}

export enum SkillLevel {
  novice = "novice",
  adept = "adept",
  elite = "elite",
}

export enum Tier {
  t1_10_18_20_36_30_60  = "t1_10_18_20_36_30_60",
  t2_20_36_30_54_40_80  = "t2_20_36_30_54_40_80",
  t2_30_54_40_72_50_100 = "t2_30_54_40_72_50_100", 
  t3_30_54_40_72_60_84  = "t3_30_54_40_72_60_84",   // 0/2
  t3_40_72_50_90_70_98  = "t3_40_72_50_90_70_98",   // 0/2
  t3_30_54_40_72_60_96  = "t3_30_54_40_72_60_96",   // 0/3
  t3_30_54_40_72_60_108 = "t3_30_54_40_72_60_108",  // 0/4
  t3_40_72_50_90_70_112 = "t3_40_72_50_90_70_112",  // 0/3
  t3_40_72_50_90_70_126 = "t3_40_72_50_90_70_126",  // 0/4
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
  baseStats: Stats;
  tribe: Tribe;
  class: Class;
  edgeStats?: Stats;
  edgeBonus?: number;
  lore: string;
  skill: Skill;
  cd: number;
  leaderSkill: LeaderSkill;
}

// battle view
export interface BattleFighter extends Fighter {
  skill: Skill;
  battleStats: Stats;
  battleCd: number;
}
