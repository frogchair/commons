package com.frogchair.commons.interfaces

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

@Parcelize
data class Mission(
    val id: Int,
    val code: String,
    val title: String,
    val status: String = "",

    //missions of chapter
    val background: String? = null,
    val missions: List<Mission>? = null,

    //submissions
    val steps: Int? = null,
    val rewardPreview: String? = null,
) : Parcelable {

    fun isCompleted() = status == "completed"
    fun isLocked() = status == "locked"

}