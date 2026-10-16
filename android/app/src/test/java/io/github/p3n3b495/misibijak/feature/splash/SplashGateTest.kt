package io.github.p3n3b495.misibijak.feature.splash

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class SplashGateTest {
    @Test
    fun progressStartsAtZeroAndEndsAtOne() {
        assertEquals(0f, SplashGate.progressAt(0), 0f)
        assertEquals(1f, SplashGate.progressAt(SplashGate.MIN_DURATION_MS), 0f)
    }

    @Test
    fun progressIsLinearAndClamped() {
        assertEquals(0.5f, SplashGate.progressAt(SplashGate.MIN_DURATION_MS / 2), 0.001f)
        assertEquals(1f, SplashGate.progressAt(60_000), 0f)
        assertEquals(0f, SplashGate.progressAt(-5), 0f)
    }

    @Test
    fun splashLeavesOnlyWhenTimeElapsedAndInitReady() {
        assertTrue(SplashGate.canFinish(minTimeElapsed = true, initReady = true))
        assertFalse(SplashGate.canFinish(minTimeElapsed = true, initReady = false))
        assertFalse(SplashGate.canFinish(minTimeElapsed = false, initReady = true))
        assertFalse(SplashGate.canFinish(minTimeElapsed = false, initReady = false))
    }

    @Test
    fun minimumDurationIsShortEnoughForChildren() {
        assertTrue(SplashGate.MIN_DURATION_MS in 1000..3000)
    }
}
