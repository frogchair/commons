package com.frogchair.commons.interfaces

import android.content.Context
import android.content.res.Resources
import android.os.Parcelable
import com.frogchair.commons.R
import com.google.gson.annotations.SerializedName
import kotlinx.parcelize.Parcelize

@Parcelize
data class FighterStats(
    val hp: Int,
    val atk: Int,
    val def: Int,
    val wis: Int,
    val agi: Int
) : Parcelable

//lowercase needed for gson serialization
enum class Tribe(val resId: Int, val colorId: Int) {
    hemi(R.drawable.ic_tribe_hemi, R.color.fighter_stats_hemi),
    theri(R.drawable.ic_tribe_theri, R.color.fighter_stats_theri),
    xana(R.drawable.ic_tribe_xana, R.color.fighter_stats_xana)
}

enum class Sign(val resId: Int, val colorId: Int) {
    air(R.drawable.ic_sign_air, R.color.fighter_stats_air),
    earth(R.drawable.ic_sign_earth, R.color.fighter_stats_earth),
    fire(R.drawable.ic_sign_fire, R.color.fighter_stats_fire),
    lightning(R.drawable.ic_sign_lightning, R.color.fighter_stats_lightning),
    water(R.drawable.ic_sign_water, R.color.fighter_stats_water)
}

enum class Class(val resId: Int) {
    champ(R.drawable.ic_class_champ),
    guru(R.drawable.ic_class_guru),
    rogue(R.drawable.ic_class_rogue),
    scout(R.drawable.ic_class_scout),
    warlock(R.drawable.ic_class_warlock)
}

enum class Rarity(val resId: Int, val resIdBig: Int) {
    common(R.drawable.ic_rarity_common, R.drawable.ic_rarity_common_big),
    uncommon(R.drawable.ic_rarity_uncommon, R.drawable.ic_rarity_uncommon_big),
    rare(R.drawable.ic_rarity_rare, R.drawable.ic_rarity_rare_big),
    epic(R.drawable.ic_rarity_epic, R.drawable.ic_rarity_epic_big),
    legendary(R.drawable.ic_rarity_legend, R.drawable.ic_rarity_legend_big)
}

enum class SkillLevel {
    novice,
    adept,
    elite
}

enum class Tier(val text: String) {
    t1_10_18_20_36_30_60("t1_10_18_20_36_30_60"),
    t2_20_36_30_54_40_80("t2_20_36_30_54_40_80"),
    t2_30_54_40_72_50_100("t2_30_54_40_72_50_100"),
    t3_30_54_40_72_60_84("t3_30_54_40_72_60_84"), // 0/2
    t3_40_72_50_90_70_98("t3_40_72_50_90_70_98"), // 0/2
    t3_30_54_40_72_60_96("t3_30_54_40_72_60_96"), // 0/3
    t3_30_54_40_72_60_108("t3_30_54_40_72_60_108"), // 0/4
    t3_40_72_50_90_70_112("t3_40_72_50_90_70_112"), // 0/3
    t3_40_72_50_90_70_126("t3_40_72_50_90_70_126"), // 0/4
}

// catalog view
@Parcelize
data class Fighter(
    val catalogId: String,
    val name: String,

    @SerializedName("class") val fighterClass: Class,
    val rarity: Rarity,
    val tribe: Tribe,
    val sign: Sign,
    val tier: Tier,

    val minStats: FighterStats,
    val maxStats: FighterStats,
    val maxSef : Int,

    val lore: String
) : Parcelable {

    private fun buildImageName() = "fighter_${catalogId}_image"
    fun findImageId(res: Resources, context: Context) =
        res.getIdentifier(buildImageName(), "drawable", context.packageName)

    private fun buildIconName() = "fighter_${catalogId}_icon"
    fun findIconId(res: Resources, context: Context) =
        res.getIdentifier(buildIconName(), "drawable", context.packageName)

    private fun buildPedestralName(rarity: Rarity, tribe: Tribe) =
        "img_pedestal_" + tribe.name + "_" + rarity.name[0]

    fun findPedestralId(res: Resources, context: Context, rarity: Rarity, tribe: Tribe) =
        res.getIdentifier(buildPedestralName(rarity, tribe), "drawable", context.packageName)

}

//fuse fighter view
class FighterFusion(
    val fighter: Fighter,
    val currentSef: Int,
    val totalXp: Int,
    val evolutionStep: Int
)
