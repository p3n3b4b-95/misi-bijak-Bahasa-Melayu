package io.github.p3n3b495.misibijak.feature.splash

/**
 * Timing rules of the splash screen (board screen 1: "animasi ringkas dan logo"). Kept free of
 * Android and Compose so it can be unit-tested on the JVM.
 *
 * The bar is a timed animation: in M0 there is no real loading work. [canFinish] already waits
 * for initialisation, so later milestones (content, database) extend the gate without UI changes.
 */
object SplashGate {
    const val MIN_DURATION_MS: Long = 1800

    fun progressAt(elapsedMs: Long): Float =
        (elapsedMs.toFloat() / MIN_DURATION_MS).coerceIn(0f, 1f)

    fun canFinish(minTimeElapsed: Boolean, initReady: Boolean): Boolean = minTimeElapsed && initReady
}
