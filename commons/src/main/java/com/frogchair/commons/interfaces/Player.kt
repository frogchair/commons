package com.frogchair.commons.interfaces

class Player(
    val id: Int,
    val name: String,
    val jwtToken: String,
    val currentXp: Int,
    val classUpXp: Int,
    val bpCountdown: Int, // milliseconds to full
    val enCountdown: Int,
    val crowns: List<Crown>,
    val pfpUrl: String
)

class Crown(
    val type: CrownType,
    val amount: Int
)

enum class CrownType {
    gold,
    silver,
    bronze,
}