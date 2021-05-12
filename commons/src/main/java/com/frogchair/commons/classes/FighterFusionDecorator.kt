import com.frogchair.commons.interfaces.Fighter
import com.frogchair.commons.interfaces.FighterFusion
import com.frogchair.commons.interfaces.FighterStats
import java.lang.Exception
import kotlin.math.exp
import kotlin.math.floor
import kotlin.math.ln
import kotlin.math.min
import kotlin.math.roundToInt

/**
 * Decorator for FighterFusion interface with calculations for both client and server
 * side functionalities related to Fuse Fighter screen.
 */
class FighterFusionDecorator(private val fighter: FighterFusion) {

    // Tier-based min/max level limits.
    private val tierLevels =
        fighter.fighter.tier.name.substring("tX_".length).split("_").map { it.toInt() }

    /**
     * Level progression formula, obtaining totalXp required for every level.
     */
    fun calculateLevelProgression(level: Int) =
        (0.07 + 100 * exp((level * (61 / 1250)).toDouble())).roundToInt()

    /**
     *  Reverse level progression formula, obtaining level from totalXp.
     */
    fun calculateLevelProgressionReverse(level: Int) =
        floor(ln((level - 0.07) / 100) / (61 / 1250)).toInt()


    /**
     * Return current max level based on unit's current SEF, Rarity & Tier.
     * @returns maxLevel for current fighter
     */
    fun currentMaxLevel(): Int {
        // Evolution step 0: consider tierLevels[0] and tierLevels[1]; 
        // evolution step 1: consider tierLevels[2] and tierLevels[3]...
        val minIndex = 2 * fighter.evolutionStep
        val maxIndex = 2 * fighter.evolutionStep + 1
        return tierLevels[minIndex] + (fighter.currentSef) * ((this.tierLevels[maxIndex] - this.tierLevels[minIndex]) / fighter.fighter.maxSef)
    }

    /**
     * Calculates xp requirements.
     * @param level for which retrieve the xp requirement
     * @returns levelUpXp required for level
     */
    fun xpForLevel(level: Int): Int {
        if (level > currentMaxLevel() || level < 0) throw Exception("Invalid level for current Fighter")
        // It can be linked later to some fighter characteristic such as Rarity or Tier.
        // Right now, levelProgression is always the same formula.
        return calculateLevelProgression(level)
    }

    /**
     * Estimates the expected level if certain ammount of fodderXp was added to the current fighter.
     * It considers the current fighter level in estimation.
     * @param fodderXp total xp selected for fusion.
     * @returns level which can be equal or higher than current fighter level
     */
    fun levelForXp(fodderXp: Int): Int {
        // It can be linked later to some fighter characteristic such as Rarity or Tier.
        // Right now, levelProgressionReverse is the reverse of a same formula.
        return min(
            calculateLevelProgressionReverse(fighter.totalXp + fodderXp),
            currentMaxLevel()
        )
    }

    /**
     * Calculates levelUp increments for Fighter.
     * It is currently linear, independant of previous level, and numbers are not rounded.
     * @returns Stats diff to be applied at every level
     */
    fun levelUpIncrements(): FighterStats {
        var steps = currentMaxLevel()
        return FighterStats(
            hp = (fighter.fighter.maxStats.hp - fighter.fighter.minStats.hp) / steps,
            atk = (fighter.fighter.maxStats.atk - fighter.fighter.minStats.atk) / steps,
            def = (fighter.fighter.maxStats.def - fighter.fighter.minStats.def) / steps,
            wis = (fighter.fighter.maxStats.wis - fighter.fighter.minStats.wis) / steps,
            agi = (fighter.fighter.maxStats.agi - fighter.fighter.minStats.agi) / steps
        )
    }

    /**
     * Stats for current fighter at the informed level.
     * @param level for which calculate the stats
     * @returns Stats for fighter at level
     */
    fun levelStats(level: Int): FighterStats {
        if (level > this.currentMaxLevel() || level < 0) throw Exception("Invalid level for current Fighter");
        var increments = this.levelUpIncrements()
        return FighterStats(
            hp = (fighter.fighter.minStats.hp + (increments.hp * level).toDouble().roundToInt()),
            atk = (fighter.fighter.minStats.atk + (increments.atk * level).toDouble().roundToInt()),
            def = (fighter.fighter.minStats.def + (increments.def * level).toDouble().roundToInt()),
            wis = (fighter.fighter.minStats.wis + (increments.wis * level).toDouble().roundToInt()),
            agi = (fighter.fighter.minStats.agi + (increments.agi * level).toDouble().roundToInt()),
        )
    }

}