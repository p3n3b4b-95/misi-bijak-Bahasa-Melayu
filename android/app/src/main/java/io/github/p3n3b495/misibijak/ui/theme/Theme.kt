package io.github.p3n3b495.misibijak.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val LightColors = lightColorScheme(
    primary = Color(Palette.BLUE),
    onPrimary = Color(Palette.WHITE),
    secondary = Color(Palette.PINK),
    onSecondary = Color(Palette.INK),
    tertiary = Color(Palette.GREEN),
    onTertiary = Color(Palette.INK),
    background = Color(Palette.CREAM),
    onBackground = Color(Palette.INK),
    surface = Color(Palette.CREAM),
    onSurface = Color(Palette.INK),
)

/** Light theme only: the game is a bright daytime world and there is no dark-mode design. */
@Composable
fun MisiBijakTheme(content: @Composable () -> Unit) {
    MaterialTheme(colorScheme = LightColors, typography = AppTypography, content = content)
}
