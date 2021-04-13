import { Gear } from "./gear.interface";
import { LeaderSkill, Skill } from "./skill.interface";

export interface FighterStats {
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
