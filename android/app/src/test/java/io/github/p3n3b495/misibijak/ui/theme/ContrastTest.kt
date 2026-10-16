package io.github.p3n3b495.misibijak.ui.theme

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * Gate G10 token test: every text/background pair used in UI-01 must meet WCAG AA
 * (4.5:1 for normal text, 3:1 for large text and graphical objects).
 */
class ContrastTest {
    private data class Pair(val name: String, val fg: Long, val bg: Long, val min: Double)

    private val used = listOf(
        Pair("MULA label on button top", Palette.INK, Palette.MULA_TOP, 4.5),
        Pair("MULA label on button bottom", Palette.INK, Palette.MULA_BOTTOM, 4.5),
        Pair("Icon caption on meadow", Palette.INK, Palette.HILL, 4.5),
        Pair("Icon caption on light meadow", Palette.INK, Palette.HILL_LIGHT, 4.5),
        Pair("Loading caption on sand", Palette.INK, Palette.SAND, 4.5),
        Pair("Loading caption on dark sand", Palette.INK, Palette.SAND_DARK, 4.5),
        Pair("Loading caption on meadow", Palette.INK, Palette.HILL, 4.5),
        Pair("Body text on cream card", Palette.INK, Palette.CREAM, 4.5),
        Pair("Title (white) against its outline", Palette.WHITE, Palette.INK, 3.0),
        Pair("Title line 1 (yellow) against its outline", Palette.TITLE_YELLOW, Palette.INK, 3.0),
        Pair("Title line 1 (orange) against its outline", Palette.TITLE_ORANGE, Palette.INK, 3.0),
        Pair("Settings glyph on button", Palette.WHITE, Palette.ICON_SETTINGS, 3.0),
        Pair("Profile glyph on button", Palette.WHITE, Palette.ICON_PROFILE, 3.0),
        Pair("Exit glyph on button", Palette.WHITE, Palette.ICON_EXIT, 3.0),
        Pair("Loading bar fill (top) against track", Palette.LOADING_FILL_TOP, Palette.LOADING_TRACK, 3.0),
        Pair("Loading bar fill (bottom) against track", Palette.LOADING_FILL_BOTTOM, Palette.LOADING_TRACK, 3.0),
    )

    @Test
    fun everyUsedPairMeetsItsMinimum() {
        val failures = used.filter { Contrast.ratio(it.fg, it.bg) < it.min }
            .map { "${it.name}: ${"%.2f".format(Contrast.ratio(it.fg, it.bg))} < ${it.min}" }
        assertTrue("Contrast failures: $failures", failures.isEmpty())
    }

    @Test
    fun ratioMatchesKnownValues() {
        assertEquals(21.0, Contrast.ratio(0xFF000000, 0xFFFFFFFF), 0.001)
        assertEquals(1.0, Contrast.ratio(0xFF808080, 0xFF808080), 0.001)
    }

    /** Documents why the board's white-on-pink buttons are not reproduced as drawn (spec wins). */
    @Test
    fun boardWhiteOnPinkFailsAa() {
        assertTrue(Contrast.ratio(Palette.WHITE, Palette.PINK) < 4.5)
        assertTrue(Contrast.ratio(Palette.INK, Palette.PINK) >= 4.5)
    }
}
