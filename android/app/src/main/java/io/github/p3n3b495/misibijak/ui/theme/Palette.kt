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
    const val MOUNTAIN_FAR: Long = 0xFFBCC9F2
    const val MOUNTAIN_MID: Long = 0xFF93A5E8
    const val MOUNTAIN_NEAR: Long = 0xFF7C93DD
    const val HILL_LIGHT: Long = 0xFF9BDB3A
    const val HILL: Long = 0xFF74CB27
    const val HILL_DARK: Long = 0xFF4FB02F
    const val TREE_LIGHT: Long = 0xFF7ED957
    const val TREE: Long = 0xFF58BC3B
    const val TREE_DARK: Long = 0xFF2FA04A
    const val TRUNK: Long = 0xFF8B5A2B
    const val SAND: Long = 0xFFF3C96B
    const val SAND_DARK: Long = 0xFFE5AB45
    const val LOADING_FILL_TOP: Long = 0xFF5BD2FF
    const val LOADING_FILL_BOTTOM: Long = 0xFF35B0F5
    const val LOADING_TRACK: Long = 0xFF3A4658
    const val ICON_SETTINGS: Long = 0xFF1F6FE0
    const val ICON_PROFILE: Long = 0xFF1F8A34
    const val ICON_EXIT: Long = 0xFF5B6FC4

    // Mascot placeholder art
    const val SKIN: Long = 0xFFFFD3AA
    const val SHIRT: Long = 0xFFFFC93C
    const val STRAP: Long = 0xFF3B6FD8
    const val CAP: Long = 0xFF2B2B35
    const val CHEEK: Long = 0xFFFF9AA8
    const val MOUTH: Long = 0xFF7A1F2B
    const val TONGUE: Long = 0xFFFF7A8A
    const val CAT: Long = 0xFFF6A02D
    const val CAT_DARK: Long = 0xFFE07B12
    const val CAT_WHITE: Long = 0xFFFFF6E8
    const val EAR_PINK: Long = 0xFFFFB3B8
}
