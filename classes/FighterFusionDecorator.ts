import { BandFighter, Stats, Tier } from "../interfaces/fighter.interface";

/**
 * Decorator for BandFighter interface with calculations for both client and server 
 * side functionalities related to Fighter Fusion screen.
 */
export default class BandFighterDecorator {
    
    // Band fighter
    private bandFighter: BandFighter;

    // Tier-based min/max level limits.
    private tierLevels : number[];

    // Level progression formula, obtaining totalXp required for every level.
    private static levelProgression = (level : number) => { return Math.round( 0.07 + 100 * Math.exp( level * (61/1250) ) ) };
    
    // Reverse level progression formula, obtaining level from totalXp.
    private static levelProgressionReverse = (level : number) => { return Math.floor( Math.log( (level - 0.07) / 100 ) / (61/1250) ) };
        
    constructor(fighterFusion : BandFighter) {
        this.bandFighter = fighterFusion;      
        // Extracts the array of min/max limits per evolutionStep from enum in the form: "tX_min1_min2_min3_min4_min5_min6". 
        this.tierLevels = this.bandFighter.tier.substring("tX_".length).split("_").map(d => Number(d));
    }

    /**
     * Return current max level based on unit's current SEF, Rarity & Tier.
     * @returns maxLevel for current fighter
     */
    public currentMaxLevel() {
        // Evolution step 0: consider tierLevels[0] and tierLevels[1]; 
        // evolution step 1: consider tierLevels[2] and tierLevels[3]...
        var minIndex = 2 * this.bandFighter.evolutionStep;
        var maxIndex = 2 * this.bandFighter.evolutionStep + 1;
        return this.tierLevels[minIndex] + (this.bandFighter.currentSef) 
                * ( ( this.tierLevels[maxIndex] - this.tierLevels[minIndex] ) / this.bandFighter.maxSef );
    }

    /**
     * Return current level based on unit's Xp.
     * @returns level for current fighter
     */
    public currentLevel(): number {
        return this.levelReachedAdding(0); //fodderXp = 0
    }
    
    /**
     * Calculates xp requirements for certain level.
     * @param level for which retrieve the xp requirement
     * @returns levelUpXp required for level
     */
    public xpRequiredFor(level : number) {
        if( level > this.currentMaxLevel() || level < 0 ) throw new Error("Invalid level for current Fighter");
        // It can be linked later to some fighter characteristic such as Rarity or Tier.
        // Right now, levelProgression is always the same formula.
        return BandFighterDecorator.levelProgression(level);
    }

    /**
     * Estimates the expected level if certain ammount of fodderXp was added to the current fighter.
     * It considers the current fighter level in estimation.
     * @param fodderXp total xp selected for fusion.
     * @returns level which can be equal or higher than current fighter level
     */
    public levelReachedAdding(fodderXp : number) : number {
        // It can be linked later to some fighter characteristic such as Rarity or Tier.
        // Right now, levelProgressionReverse is just the reverse of levelProgression formula.
        return Math.min(
            BandFighterDecorator.levelProgressionReverse(this.bandFighter.totalXp + fodderXp), 
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
            hp : (this.bandFighter.maxStats.hp  - this.bandFighter.minStats.hp)  / steps,
            atk: (this.bandFighter.maxStats.atk - this.bandFighter.minStats.atk) / steps,
            def: (this.bandFighter.maxStats.def - this.bandFighter.minStats.def) / steps,
            wis: (this.bandFighter.maxStats.wis - this.bandFighter.minStats.wis) / steps,
            agi: (this.bandFighter.maxStats.agi - this.bandFighter.minStats.agi) / steps
        } as Stats;
    }

    /**
     * Stats for current fighter level.
     * @returns Stats for current fighter at level
     */
    public currentStats(): Stats {
        return this.levelStats(this.currentLevel());
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
            hp : this.bandFighter.minStats.hp  + Math.round(increments.hp  * level),
            atk: this.bandFighter.minStats.atk + Math.round(increments.atk * level),
            def: this.bandFighter.minStats.def + Math.round(increments.def * level),
            wis: this.bandFighter.minStats.wis + Math.round(increments.wis * level),
            agi: this.bandFighter.minStats.agi + Math.round(increments.agi * level),
        } as Stats;
    }
    
}

function _test() {
    var fighterFusion = {
        tier: Tier.t1_10_18_20_36_30_60,
        minStats: {"hp": 59, "atk": 62, "def": 33, "wis": 52, "agi": 49},
        maxStats: {"hp": 208, "atk": 220, "def": 108, "wis": 180, "agi": 168},
        maxSef: 4,        
        totalXp: 100,
        currentSef: 0,
        evolutionStep: 0
      } as BandFighter;
      
      console.log(new BandFighterDecorator(fighterFusion).currentMaxLevel());

      fighterFusion.currentSef = 4;
      
      console.log(new BandFighterDecorator(fighterFusion).currentMaxLevel());
      console.log(new BandFighterDecorator(fighterFusion).levelUpIncrements());
      
      //Should match:
      console.log(fighterFusion.minStats);
      console.log(new BandFighterDecorator(fighterFusion).levelStats(0));
      
      console.log(new BandFighterDecorator(fighterFusion).levelStats(1));
      console.log(new BandFighterDecorator(fighterFusion).levelStats(17));
      
      // Should match:
      console.log(new BandFighterDecorator(fighterFusion).levelStats(18));      
      console.log(fighterFusion.maxStats);

      // Changing evolutionStep for test purposes, other evolutionStep would have different 
      // min/max Stats, so don't test levelStats() and levelUpIncrements() from here.
      fighterFusion.evolutionStep = 2;
      fighterFusion.maxSef = 5;

      console.log(new BandFighterDecorator(fighterFusion).xpRequiredFor(15));
      console.log(new BandFighterDecorator(fighterFusion).currentMaxLevel());
      
      console.log(new BandFighterDecorator(fighterFusion).levelReachedAdding(107));
      console.log(new BandFighterDecorator(fighterFusion).levelReachedAdding(108));
      console.log(new BandFighterDecorator(fighterFusion).levelReachedAdding(109));
      
      fighterFusion.currentSef = 5;
      
      console.log(new BandFighterDecorator(fighterFusion).currentMaxLevel());
}
_test();
