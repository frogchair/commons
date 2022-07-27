export enum StatsType {
  hp = 'hp',
  atk = 'atk',
  def = 'def',
  wis = 'wis',
  agi = 'agi',
}
export enum SkillLevel {
  novice = "novice",
  adept = "adept",
  elite = "elite",
}

export enum SkillRank {
  novice = 1,
  adept = 2,
  elite = 3,
}

export enum SkillType {
  natural = "natural",
  magical = "magical",
  random = "random",
  support = "support",
  double = "double",
  special = "special",
  // worth considering changing natural/magical to atk/wis and adding agi dmg one?
}

export interface Skill {
  stat: StatsType,
  name: string,
  level: SkillLevel,
  description: string,
  cooldown: number,
  rank: SkillRank,
  type: SkillType,
  // more todo
}

export interface LeaderSkill {
  // todo
}
