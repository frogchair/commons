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

    // Level progression formula, obtaining xp requirements to progress to certain level from previous level.
    // Current level formula: y = a + b*e**(x*c)
    // see https://www.wolframalpha.com/input/?i=a+%2B+b*exp(x*c)
    private static levelProgression = (level : number) => { return Math.round( 0.07 + 100 * Math.exp( level * (61/1250) ) ) };
    
    // Cumulative level cumulative sum formula, obtaining totalXp required to a certain level.
    // Ladder function with ratio = level formula
    //private static levelCumulativeSum = (level : number) => { return Math.round( 0.07 * level + (100 / (61/1250)) * Math.exp( level * (61/1250) ) )};

    // Inverse level progression formula, checks if the current fodder xp ammount is enough for next level.
    // Inverse of level formula: x = log((y-a)/b) / c
    // Warning: requires xp > 100
    // see https://www.wolframalpha.com/input/?i=inverse+a+%2B+b*exp(x*c)
    private static levelProgressionInverse = (xp : number) => { return Math.floor( Math.log( (xp - 0.07) / 100 ) / (61/1250) ) };

    // Inverse level progression cumulative formula, obtaining fighter level from totalXp.
    // Integral of inverse formula: X = ((y-a)*log((y-a)/b) - y) / c
    // Warning: requires xp > 100
    // see https://www.wolframalpha.com/input/?i=integral%20log((y-a)/b)/c
    //private static levelProgressionInverseCumulative = (xp : number) => { return Math.floor( ( (xp - 0.07) * Math.log( (xp - 0.07) / 100 ) - xp) / (61/1250) ) };
        
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
     * Return max level at unit's max SEF based on fighter's Rarity & Tier.
     * @returns maxLevel at max SEF for current fighter evolution
     */
      public maxLevelAtMaxSEF() {
        // Evolution step 0: consider tierLevels[0] and tierLevels[1]; 
        // evolution step 1: consider tierLevels[2] and tierLevels[3]...
        var maxIndex = 2 * this.bandFighter.evolutionStep + 1;
        return this.tierLevels[maxIndex];
    }

    /**
     * Return current level based on unit's Xp.
     * @returns level for current fighter
     */
    public currentLevel(): number {
        return this.levelReachedByAdding(0); //fodderXp = 0
    }
    
    /**
     * Return fighter Xp progress from current level to next
     * Displayed in Fighter Fusion screen.
     * @returns xp for current fighter
     */
    public currentXp(): number {
        return this.bandFighter.totalXp - this.totalXpForLevel(this.currentLevel());
    }

    /**
     * Calculates the current xp requirements for next level.
     * Displayed in Fighter Fusion screen.
     * @param level for which retrieve the xp requirement
     * @returns levelUpXp required for level
     */
     public levelUpXp() {
        // It can be linked later to some fighter characteristic such as Rarity or Tier.
        // Right now, levelProgression is always the same formula.
        return BandFighterDecorator.levelProgression(this.currentLevel() + 1);
    }
    
    /**
     * Calculates the cumulative ammount of xp required for any level.
     * @param level for which retrieve the xp requirement
     * @returns levelUpXp required for level
     */
    public totalXpForLevel(level : number) {
        if( level > this.currentMaxLevel() || level < 0 ) throw new Error("Invalid level for current Fighter");
        // It can be linked later to some fighter characteristic such as Rarity or Tier.
        // Right now, levelProgression is always the same formula.
        //return BandFighterDecorator.levelCumulativeSum(level);
        var requirements = 0, currentLevel = 0;
        while(currentLevel++ < level) requirements += BandFighterDecorator.levelProgression(currentLevel);
        return requirements;
    }

    /**
     * Useless function for now. Used to check if reverse function is correct.
     * Warning: formula is not defined for xp <= 100
     * @param fodderXp total xp selected for fusion.
     * @returns true if next level is reached with selected XP
     */
    public IsXpEnoughForNextLevel(fodderXp : number) : boolean {
        if(fodderXp <= 100) return false;
        return BandFighterDecorator.levelProgressionInverse(fodderXp + 1) > this.currentLevel();
    }

    /**
     * Estimates the expected level if certain ammount of fodderXp was added to the current fighter.
     * It considers the current fighter level in estimation.
     * @param fodderXp total xp selected for fusion.
     * @returns level which can be equal or higher than current fighter level
     */
    public levelReachedByAdding(fodderXp : number) : number {
        var currentLevel = 0;
        var summedXp = this.bandFighter.totalXp + fodderXp;
        var requirements = BandFighterDecorator.levelProgression(currentLevel + 1);

        while(requirements <= summedXp) {
            currentLevel++;
            requirements += BandFighterDecorator.levelProgression(currentLevel + 1);
        }
        return Math.min(
            currentLevel,
            this.currentMaxLevel() 
        );
        /*
        return Math.min(
            BandFighterDecorator.levelProgressionInverseCumulative(summedXp), 
            this.currentMaxLevel() 
        ); */
    }

    /**
     * Calculates levelUp increments for Fighter.
     * It is currently linear, independant of previous level, and numbers are not rounded.
     * @returns Stats diff to be applied at every level
     */
    public levelUpIncrements() : Stats {
        var steps = this.maxLevelAtMaxSEF();
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
        return this.statsForLevel(this.currentLevel());
    }

    /**
     * Stats for current fighter at the informed level.
     * @param level for which calculate the stats
     * @returns Stats for fighter at level
     */
    public statsForLevel(level : number) : Stats {
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
        totalXp: 0,
        currentSef: 0,
        evolutionStep: 0
    } as BandFighter;
    
    console.log(new BandFighterDecorator(fighterFusion).currentXp());

    //Should match:
    console.log(new BandFighterDecorator(fighterFusion).totalXpForLevel(1));
    console.log(new BandFighterDecorator(fighterFusion).levelUpXp());
    console.log(new BandFighterDecorator(fighterFusion).IsXpEnoughForNextLevel(104));
    console.log(new BandFighterDecorator(fighterFusion).IsXpEnoughForNextLevel(105));
    console.log(new BandFighterDecorator(fighterFusion).IsXpEnoughForNextLevel(106));    

    console.log(new BandFighterDecorator(fighterFusion).currentLevel());
    fighterFusion.totalXp = 105;
    console.log(new BandFighterDecorator(fighterFusion).currentLevel());
    //should match:
    console.log(new BandFighterDecorator(fighterFusion).totalXpForLevel(2));
    console.log(new BandFighterDecorator(fighterFusion).totalXpForLevel(1)
                + new BandFighterDecorator(fighterFusion).levelUpXp());

    console.log(new BandFighterDecorator(fighterFusion).currentStats());

    console.log(new BandFighterDecorator(fighterFusion).currentMaxLevel());
    console.log(new BandFighterDecorator(fighterFusion).currentLevel());
    
    fighterFusion.currentSef = 4;
    
    console.log(new BandFighterDecorator(fighterFusion).currentMaxLevel());
    
    //should match:
    console.log(fighterFusion.minStats);
    console.log(new BandFighterDecorator(fighterFusion).statsForLevel(0));
    
    console.log(new BandFighterDecorator(fighterFusion).statsForLevel(1));
    console.log(new BandFighterDecorator(fighterFusion).statsForLevel(17));
    
    // Should match:
    console.log(new BandFighterDecorator(fighterFusion).statsForLevel(18));      
    console.log(fighterFusion.maxStats);

    // Changing evolutionStep for test purposes, other evolutionStep would have different 
    // min/max Stats, so don't test levelStats() and levelUpIncrements() from here.
    fighterFusion.evolutionStep = 2;
    fighterFusion.maxSef = 5;

    console.log(new BandFighterDecorator(fighterFusion).totalXpForLevel(15));
    console.log(new BandFighterDecorator(fighterFusion).currentMaxLevel());
    
    console.log(new BandFighterDecorator(fighterFusion).levelReachedByAdding(2267 - fighterFusion.totalXp));
    console.log(new BandFighterDecorator(fighterFusion).levelReachedByAdding(2268 - fighterFusion.totalXp));
    console.log(new BandFighterDecorator(fighterFusion).levelReachedByAdding(2269 - fighterFusion.totalXp));
    
    fighterFusion.currentSef = 5;
    
    console.log(new BandFighterDecorator(fighterFusion).currentMaxLevel()); 

    fighterFusion.totalXp = 2269;
    console.log(new BandFighterDecorator(fighterFusion).currentLevel());
    console.log(new BandFighterDecorator(fighterFusion).currentXp());
    console.log(new BandFighterDecorator(fighterFusion).levelUpXp());
}
//_test();
