package com.frogchair.android

import FighterFusionDecorator
import com.frogchair.commons.interfaces.Class
import com.frogchair.commons.interfaces.Fighter
import com.frogchair.commons.interfaces.FighterFusion
import com.frogchair.commons.interfaces.FighterStats
import com.frogchair.commons.interfaces.Rarity
import com.frogchair.commons.interfaces.Sign
import com.frogchair.commons.interfaces.Tier
import com.frogchair.commons.interfaces.Tribe
import org.junit.Assert
import org.junit.Assert.assertEquals
import org.junit.Test

class FighterFusionDecoratorTest {

    @Test
    fun test() {
        val fighterFusion = FighterFusion(
            fighter = Fighter(
                catalogId = "1",
                name = "name",

                fighterClass = Class.champ,
                rarity = Rarity.common,
                tribe = Tribe.hemi,
                sign = Sign.air,
                tier = Tier.t1_10_18_20_36_30_60,

                minStats = FighterStats(59, 62, 33, 52, 49),
                maxStats = FighterStats(208, 220, 108, 180, 168),
                maxSef = 4,

                lore = "Something something"
            ),
            totalXp = 100,
            currentSef = 0,
            evolutionStep = 0
        )
        val decorator = FighterFusionDecorator(fighterFusion)

        assertEquals(10, decorator.currentMaxLevel())

        assertEquals(decorator.levelStats(0), fighterFusion.fighter.minStats)
        assertEquals(decorator.levelStats(18), fighterFusion.fighter.maxStats)
    }
}