import { FuseFighter, Rarity, Stats, Tier } from "../interfaces/fighter.interface";

/**
 * Decorator for FuseFighter interface with calculations for both client and server 
 * side functionalities related to Fuse Fighter screen.
 */
export default class FuseFighterDecorator {

    // Fighter reference to be decorated.
    private fighter : FuseFighter;
    // Tier-based min/max level limits.
    private tierLevels : number[];
    // Level progression formula, obtaining totalXp required for every level.
    private static levelProgression = (level : number) => { return Math.round( 0.07 + 100 * Math.exp( level * (61/1250) ) ) };
    // Reverse level progression formula, obtaining level from totalXp.
    private static levelProgressionReverse = (level : number) => { return Math.floor( Math.log( (level - 0.07) / 100 ) / (61/1250) ) };

    constructor(fighter : FuseFighter) {
        this.fighter = fighter;
        // Extracts the array of min/max limits per rarity from enum in the form: "tX_min1_min2_min3_min4_min5_min6". 
        this.tierLevels = this.fighter.tier.substring("tX_".length).split("_").map(d => Number(d));
    }

    /**
     * Based on current Rarity and Tier, calculates tierLevels array indexes.
     * @returns minIndex in tierLevels for current fighter
     * @returns maxIndex in tierLevels for current fighter
     * @returns denominator for levelUp formulas
     */
    private tierLimits() {
        
        var secondRarity : Rarity = Rarity.uncommon;
        var finalRarity : Rarity = Rarity.rare;
        var minIndex = 0;
        var maxIndex = 1;
        var denominator = 4;

        if (this.fighter.tier.startsWith("t2")) {
            secondRarity = Rarity.rare;
            finalRarity = Rarity.epic;
        } else if (this.fighter.tier.startsWith("t3")) {
            secondRarity = Rarity.epic;
            finalRarity = Rarity.legendary;
        }

        if(this.fighter.rarity == secondRarity) {            
            minIndex = 2;
            maxIndex = 3;
        } else if(this.fighter.rarity == finalRarity) {
            minIndex = 4;
            maxIndex = 5;
            if(this.fighter.tier == Tier.t3_30_54_40_72_60_84 || this.fighter.tier == Tier.t3_40_72_50_90_70_98) {
                denominator = 2;
            } else if(this.fighter.tier == Tier.t3_30_54_40_72_60_96 || this.fighter.tier == Tier.t3_40_72_50_90_70_112) {
                denominator = 3;
            } else if(this.fighter.tier == Tier.t3_30_54_40_72_60_108 || this.fighter.tier == Tier.t3_40_72_50_90_70_126) {
                denominator = 4;
            } else {
                denominator = 5;
            }
        }
        return [ minIndex, maxIndex, denominator ];
    }

    /**
     * Return current max level based on unit's current SEF, Rarity & Tier.
     * @returns maxLevel for current fighter
     */
    public currentMaxLevel() {
        var [ minIndex, maxIndex, denominator ] = this.tierLimits();
        return this.tierLevels[minIndex] + (this.fighter.currentSef) * ( ( this.tierLevels[maxIndex] - this.tierLevels[minIndex] ) / denominator );
    }

    /**
     * Calculates xp requirements.
     * @param level for which retrieve the xp requirement
     * @returns levelUpXp required for level
     */
    public xpForLevel(level : number) {
        if( level > this.currentMaxLevel() || level < 0 ) throw new Error("Invalid level for current Fighter");
        // It can be linked later to some fighter characteristic such as Rarity or Tier.
        // Right now, levelProgression is always the same formula.
        return FuseFighterDecorator.levelProgression(level);
    }

    /**
     * Estimates the expected level if certain ammount of fodderXp was added to the current fighter.
     * It considers the current fighter level in estimation.
     * @param fodderXp total xp selected for fusion.
     * @returns level which can be equal or higher than current fighter level
     */
    public levelForXp(fodderXp : number) : number {
        // It can be linked later to some fighter characteristic such as Rarity or Tier.
        // Right now, levelProgressionReverse is the reverse of a same formula.
        return Math.min(
            FuseFighterDecorator.levelProgressionReverse(this.fighter.totalXp + fodderXp), 
            this.currentMaxLevel()
        );
    }

    /**
     * Calculates levelUp increments for Fighter.
     * It is currently linear, independant of previous level, and numbers are not rounded.
     * @returns Stats diff to be applied at every level
     */
    public levelUpIncrements() : Stats {
        var steps = this.currentMaxLevel();
        return { 
            hp : (this.fighter.maxStats.hp  - this.fighter.minStats.hp)  / steps,
            atk: (this.fighter.maxStats.atk - this.fighter.minStats.atk) / steps,
            def: (this.fighter.maxStats.def - this.fighter.minStats.def) / steps,
            wis: (this.fighter.maxStats.wis - this.fighter.minStats.wis) / steps,
            agi: (this.fighter.maxStats.agi - this.fighter.minStats.agi) / steps
        } as Stats;
    }
    
    /**
     * Stats for current fighter at the informed level.
     * @param level for which calculate the stats
     * @returns Stats for fighter at level
     */
    public levelStats(level : number) : Stats {
        if( level > this.currentMaxLevel() || level < 0 ) throw new Error("Invalid level for current Fighter");
        var increments = this.levelUpIncrements();
        return {
            hp : this.fighter.minStats.hp  + Math.round(increments.hp  * level),
            atk: this.fighter.minStats.atk + Math.round(increments.atk * level),
            def: this.fighter.minStats.def + Math.round(increments.def * level),
            wis: this.fighter.minStats.wis + Math.round(increments.wis * level),
            agi: this.fighter.minStats.agi + Math.round(increments.agi * level),
        } as Stats;
    }
    
}

function _test() {
    var fighter = {
        rarity: Rarity.common,
        tier: Tier.t1_10_18_20_36_30_60,
        minStats: {"hp": 59, "atk": 62, "def": 33, "wis": 52, "agi": 49},
        maxStats: {"hp": 208, "atk": 220, "def": 108, "wis": 180, "agi": 168},
        totalXp: 100,
        currentSef: 0
      } as FuseFighter;
      
      fighter.currentSef = 4;
      
      console.log(new FuseFighterDecorator(fighter).currentMaxLevel());
      console.log(new FuseFighterDecorator(fighter).levelUpIncrements());
      
      //Should match:
      console.log(fighter.minStats);
      console.log(new FuseFighterDecorator(fighter).levelStats(0));
      
      console.log(new FuseFighterDecorator(fighter).levelStats(1));
      console.log(new FuseFighterDecorator(fighter).levelStats(17));
      
      // Should match:
      console.log(new FuseFighterDecorator(fighter).levelStats(18));      
      console.log(fighter.maxStats);

      // Changing rarity for test purposes, other rarity would have different 
      // min/max Stats, so don't test levelStats() and levelUpIncrements() from here.
      fighter.rarity = Rarity.rare;
      
      console.log(new FuseFighterDecorator(fighter).xpForLevel(15));
      console.log(new FuseFighterDecorator(fighter).currentMaxLevel());
      
      console.log(new FuseFighterDecorator(fighter).levelForXp(107));
      console.log(new FuseFighterDecorator(fighter).levelForXp(108));
      console.log(new FuseFighterDecorator(fighter).levelForXp(109));
      
      fighter.currentSef = 5;
      
      console.log(new FuseFighterDecorator(fighter).currentMaxLevel());
}
_test();
