import { FuseFighter, Rarity, Tier } from "../interfaces/fighter.interface";

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
        return this.tierLevels[minIndex] + (this.fighter.sef) * ( ( this.tierLevels[maxIndex] - this.tierLevels[minIndex] ) / denominator );
    }

    /**
     * Calculates xp requirements.
     * @param level for which retrieve the xp requirement
     * @returns levelUpXp required for level
     */
    public xpForLevel(level : number) {
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
        return FuseFighterDecorator.levelProgressionReverse(this.fighter.totalXp + fodderXp);
    }
    
}

function _test() {
    var fighter = {
        rarity: Rarity.common,
        tier: Tier.t1_10_18_20_36_30_60,
        minStats: {"hp": 59, "atk": 62, "def": 33, "wis": 52, "agi": 49},
        maxStats: {"hp": 208, "atk": 220, "def": 108, "wis": 180, "agi": 168},
        totalXp: 100,
        sef: 0
      } as FuseFighter;
      
      fighter.sef = 4;
      
      console.log(new FuseFighterDecorator(fighter).currentMaxLevel());
      
      fighter.rarity = Rarity.rare;
      
      console.log(new FuseFighterDecorator(fighter).xpForLevel(15));
      console.log(new FuseFighterDecorator(fighter).currentMaxLevel());
      
      console.log(new FuseFighterDecorator(fighter).levelForXp(107));
      console.log(new FuseFighterDecorator(fighter).levelForXp(108));
      console.log(new FuseFighterDecorator(fighter).levelForXp(109));
      
      fighter.sef = 5;
      
      console.log(new FuseFighterDecorator(fighter).currentMaxLevel());
}
_test();
