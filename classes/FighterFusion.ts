import { FuseFighter, Rarity, Tier } from "../interfaces/fighter.interface";

export default class FighterFusion {
    
    private fighter : FuseFighter;

    constructor(fighter : FuseFighter) {
        this.fighter = fighter;
    }

    public currentMaxLevel() {

        var tierLimits : string[] = this.fighter.tier.split("_");
        var initialRarity : Rarity = Rarity.common;
        var secondRarity : Rarity = Rarity.uncommon;

        if(tierLimits[0] == "t2") {
            initialRarity = Rarity.uncommon;
            secondRarity = Rarity.rare;
        } else if (tierLimits[0] == "t3") {
            initialRarity = Rarity.rare;
            secondRarity = Rarity.epic;
        }

        if(this.fighter.rarity == initialRarity) {
            return parseInt(tierLimits[1]) + (this.fighter.sef) * ( ( parseInt(tierLimits[2]) - parseInt(tierLimits[1]) ) / 4 );
        } else if (this.fighter.rarity == secondRarity) {
            return parseInt(tierLimits[3]) + (this.fighter.sef) * ( ( parseInt(tierLimits[4]) - parseInt(tierLimits[3]) ) / 4 );
        } else {
            //t1 & t2
            var denominator = 5;
            if(this.fighter.tier == Tier.t3_30_54_40_72_60_84 || this.fighter.tier == Tier.t3_40_72_50_90_70_98) {
                denominator = 2;
            } else if(this.fighter.tier == Tier.t3_30_54_40_72_60_96 || this.fighter.tier == Tier.t3_40_72_50_90_70_112) {
                denominator = 3;
            } else if(this.fighter.tier == Tier.t3_30_54_40_72_60_108 || this.fighter.tier == Tier.t3_40_72_50_90_70_126) {
                denominator = 4;
            }
            return parseInt(tierLimits[5]) + (this.fighter.sef) * ( ( parseInt(tierLimits[6]) - parseInt(tierLimits[5]) ) / denominator );
        }
    }

    public levelUpTo(fodderTotalXp : number) : number {
        return 0;
    }

    public levelUpIn(fodderTotalXp : number) : number {
        return 0;
    }
    
}

function _test() {
    var fighter = {
        rarity: Rarity.common,
        tier: Tier.t1_10_18_20_36_30_60,
        minStats: {"hp": 59, "atk": 62, "def": 33, "wis": 52, "agi": 49},
        maxStats: {"hp": 208, "atk": 220, "def": 108, "wis": 180, "agi": 168},
        totalXp: 10,
        sef: 0
      } as FuseFighter;
      
      console.log(new FighterFusion(fighter).currentMaxLevel());
      
      fighter.sef = 4;
      
      console.log(new FighterFusion(fighter).currentMaxLevel());
      
      fighter.rarity = Rarity.epic;
      
      console.log(new FighterFusion(fighter).currentMaxLevel());
      
      fighter.sef = 5;
      
      console.log(new FighterFusion(fighter).currentMaxLevel());
}
_test();
