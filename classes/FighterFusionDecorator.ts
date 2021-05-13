import { CatalogFighter, FighterFusion, Rarity, Stats, Tier } from "../interfaces/fighter.interface";

/**
 * Decorator for FighterFusion interface with calculations for both client and server 
 * side functionalities related to Fuse Fighter screen.
 */
export default class FighterFusionDecorator {

    // Fighter reference to be decorated.
    private fighter : CatalogFighter;
    
    // Fighter's current SEF.
    private currentSef : number;

    // Fighter's total XP since level 0.
    private totalXp : number;

    // Fighter's evolution step 0, 1 or 2.
    private evolutionStep: number;

    // Tier-based min/max level limits.
    private tierLevels : number[];

    // Level progression formula, obtaining totalXp required for every level.
    private static levelProgression = (level : number) => { return Math.round( 0.07 + 100 * Math.exp( level * (61/1250) ) ) };
    
    // Reverse level progression formula, obtaining level from totalXp.
    private static levelProgressionReverse = (level : number) => { return Math.floor( Math.log( (level - 0.07) / 100 ) / (61/1250) ) };


    constructor(fighterFusion : FighterFusion) {
        this.fighter = fighterFusion.fighter;
        this.currentSef = fighterFusion.currentSef;        
        this.totalXp = fighterFusion.totalXp;
        this.evolutionStep = fighterFusion.evolutionStep;        
        // Extracts the array of min/max limits per evolutionStep from enum in the form: "tX_min1_min2_min3_min4_min5_min6". 
        this.tierLevels = this.fighter.tier.substring("tX_".length).split("_").map(d => Number(d));
    }

    /**
     * Return current max level based on unit's current SEF, Rarity & Tier.
     * @returns maxLevel for current fighter
     */
    public currentMaxLevel() {
        // Evolution step 0: consider tierLevels[0] and tierLevels[1]; 
        // evolution step 1: consider tierLevels[2] and tierLevels[3]...
        var minIndex = 2 * this.evolutionStep;
        var maxIndex = 2 * this.evolutionStep + 1;
        return this.tierLevels[minIndex] + (this.currentSef) 
                * ( ( this.tierLevels[maxIndex] - this.tierLevels[minIndex] ) / this.fighter.maxSef );
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
        return FighterFusionDecorator.levelProgression(level);
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
            FighterFusionDecorator.levelProgressionReverse(this.totalXp + fodderXp), 
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
    var fighterFusion = {
        fighter: {
            tier: Tier.t1_10_18_20_36_30_60,
            minStats: {"hp": 59, "atk": 62, "def": 33, "wis": 52, "agi": 49},
            maxStats: {"hp": 208, "atk": 220, "def": 108, "wis": 180, "agi": 168},
            maxSef: 4
        },
        totalXp: 100,
        currentSef: 0,
        evolutionStep: 0
      } as FighterFusion;
      
      console.log(new FighterFusionDecorator(fighterFusion).currentMaxLevel());

      fighterFusion.currentSef = 4;
      
      console.log(new FighterFusionDecorator(fighterFusion).currentMaxLevel());
      console.log(new FighterFusionDecorator(fighterFusion).levelUpIncrements());
      
      //Should match:
      console.log(fighterFusion.fighter.minStats);
      console.log(new FighterFusionDecorator(fighterFusion).levelStats(0));
      
      console.log(new FighterFusionDecorator(fighterFusion).levelStats(1));
      console.log(new FighterFusionDecorator(fighterFusion).levelStats(17));
      
      // Should match:
      console.log(new FighterFusionDecorator(fighterFusion).levelStats(18));      
      console.log(fighterFusion.fighter.maxStats);

      // Changing evolutionStep for test purposes, other evolutionStep would have different 
      // min/max Stats, so don't test levelStats() and levelUpIncrements() from here.
      fighterFusion.evolutionStep = 2;
      fighterFusion.fighter.maxSef = 5;

      console.log(new FighterFusionDecorator(fighterFusion).xpForLevel(15));
      console.log(new FighterFusionDecorator(fighterFusion).currentMaxLevel());
      
      console.log(new FighterFusionDecorator(fighterFusion).levelForXp(107));
      console.log(new FighterFusionDecorator(fighterFusion).levelForXp(108));
      console.log(new FighterFusionDecorator(fighterFusion).levelForXp(109));
      
      fighterFusion.currentSef = 5;
      
      console.log(new FighterFusionDecorator(fighterFusion).currentMaxLevel());
}
_test();
