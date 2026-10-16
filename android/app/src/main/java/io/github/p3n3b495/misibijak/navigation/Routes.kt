package io.github.p3n3b495.misibijak.navigation

import kotlinx.serialization.Serializable

/** Typed routes (docs/android/03-navigation-contracts.md). Only UI-01 destinations exist so far. */
@Serializable
data object Splash

@Serializable
data object MainMenu
