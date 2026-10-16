package io.github.p3n3b495.misibijak.ui.theme

/**
 * Colour tokens as ARGB Longs so contrast can be unit-tested on the JVM without Compose.
 *
 * "Board" values were sampled from docs/android/design/design-board-v1.png (the six swatches in
 * the "Warna & Gaya Visual" panel, plus pixels from screens 1 and 2). "Derived" values are
 * implementation choices where the board has no flat swatch (gradients, scenery) or where the
 * board colour fails WCAG contrast (see docs/android/05-screen-spec.md §3).
 */
object Palette {
    // Board swatches (sampled)
    const val BLUE: Long = 0xFF0179DC
    const val PINK: Long = 0xFFFB688E
    const val YELLOW: Long = 0xFFFCC328
    const val GREEN: Long = 0xFF86D842
    const val PURPLE: Long = 0xFFAD7FF1
    const val PEACH: Long = 0xFFFBDCC2

    // Board, sampled from screens 1-2
    const val MULA_TOP: Long = 0xFFFDDA21
    const val MULA_BOTTOM: Long = 0xFFFDC121
    const val TITLE_YELLOW: Long = 0xFFFCF002
    const val TITLE_ORANGE: Long = 0xFFFF9303
    const val CREAM: Long = 0xFFFEFCF6

    // Derived
    const val INK: Long = 0xFF10213D
    const val WHITE: Long = 0xFFFFFFFF
    const val MULA_EDGE: Long = 0xFFD98A0B
    const val SKY_TOP: Long = 0xFF59CBF3
    const val SKY_HORIZON: Long = 0xFFC9F0FB
    // Meadow tones used for caption-contrast checks (the scenery itself is bitmap artwork).
    const val HILL: Long = 0xFF74CB27
    const val HILL_LIGHT: Long = 0xFF9BDB3A
    const val SAND: Long = 0xFFF3C96B
    const val SAND_DARK: Long = 0xFFE5AB45
    const val LOADING_FILL_TOP: Long = 0xFF5BD2FF
    const val LOADING_FILL_BOTTOM: Long = 0xFF35B0F5
    const val LOADING_TRACK: Long = 0xFF3A4658
    // Mid-tone of each bitmap icon's gradient (where the white glyph sits); contrast-tested.
    const val ICON_SETTINGS: Long = 0xFF397AE1
    const val ICON_PROFILE: Long = 0xFF238F3C
    const val ICON_EXIT: Long = 0xFF5C6CDD
}
