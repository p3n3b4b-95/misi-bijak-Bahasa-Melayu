package io.github.p3n3b495.misibijak.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.semantics.clearAndSetSemantics
import io.github.p3n3b495.misibijak.ui.theme.Palette

enum class SceneVariant { Splash, Menu }

/**
 * Original vector scenery (sky, clouds, mountains, hills, winding path, trees) drawn in code.
 * Stand-in for the board's illustrated backgrounds, which were not supplied as asset files.
 * Decorative: hidden from TalkBack.
 */
@Composable
fun SceneBackground(variant: SceneVariant, modifier: Modifier = Modifier) {
    Canvas(modifier.fillMaxSize().clearAndSetSemantics { }) {
        val w = size.width
        val h = size.height
        val horizon = if (variant == SceneVariant.Splash) 0.50f else 0.47f

        drawRect(
            brush = Brush.verticalGradient(
                colors = listOf(Color(Palette.SKY_TOP), Color(Palette.SKY_HORIZON)),
                startY = 0f,
                endY = h * (horizon + 0.04f),
            ),
            size = Size(w, h),
        )

        cloud(w * 0.18f, h * 0.10f, w * 0.10f)
        cloud(w * 0.82f, h * 0.07f, w * 0.085f)
        cloud(w * 0.70f, h * 0.30f, w * 0.07f)

        // Mountains, far to near.
        drawPath(
            smoothClosed(
                listOf(
                    Offset(-w * 0.1f, h * horizon + h * 0.02f), Offset(w * 0.08f, h * (horizon - 0.10f)),
                    Offset(w * 0.25f, h * (horizon - 0.02f)), Offset(w * 0.48f, h * (horizon - 0.15f)),
                    Offset(w * 0.72f, h * (horizon - 0.03f)), Offset(w * 0.92f, h * (horizon - 0.12f)),
                    Offset(w * 1.1f, h * horizon + h * 0.02f), Offset(w * 1.1f, h * (horizon + 0.10f)),
                    Offset(-w * 0.1f, h * (horizon + 0.10f)),
                ),
            ),
            color = Color(Palette.MOUNTAIN_FAR),
        )
        drawPath(
            smoothClosed(
                listOf(
                    Offset(-w * 0.1f, h * horizon + h * 0.04f), Offset(w * 0.14f, h * (horizon - 0.07f)),
                    Offset(w * 0.34f, h * (horizon + 0.01f)), Offset(w * 0.62f, h * (horizon - 0.09f)),
                    Offset(w * 0.85f, h * (horizon + 0.01f)), Offset(w * 1.1f, h * (horizon - 0.04f)),
                    Offset(w * 1.1f, h * (horizon + 0.12f)), Offset(-w * 0.1f, h * (horizon + 0.12f)),
                ),
            ),
            color = Color(Palette.MOUNTAIN_MID),
        )
        drawPath(
            smoothClosed(
                listOf(
                    Offset(-w * 0.1f, h * (horizon + 0.03f)), Offset(w * 0.2f, h * (horizon - 0.01f)),
                    Offset(w * 0.5f, h * (horizon + 0.04f)), Offset(w * 0.8f, h * (horizon - 0.01f)),
                    Offset(w * 1.1f, h * (horizon + 0.03f)), Offset(w * 1.1f, h * (horizon + 0.14f)),
                    Offset(-w * 0.1f, h * (horizon + 0.14f)),
                ),
            ),
            color = Color(Palette.MOUNTAIN_NEAR),
        )

        // Back hills and the meadow.
        drawPath(
            smoothClosed(
                listOf(
                    Offset(-w * 0.1f, h * (horizon + 0.06f)), Offset(w * 0.3f, h * (horizon + 0.035f)),
                    Offset(w * 0.7f, h * (horizon + 0.07f)), Offset(w * 1.1f, h * (horizon + 0.04f)),
                    Offset(w * 1.1f, h * 1.1f), Offset(-w * 0.1f, h * 1.1f),
                ),
            ),
            brush = Brush.verticalGradient(
                listOf(Color(Palette.HILL_LIGHT), Color(Palette.HILL)),
                startY = h * horizon,
                endY = h,
            ),
        )

        // Winding sand path: centre line plus half-width, widening towards the viewer.
        val centre = listOf(
            Offset(w * 0.50f, h * (horizon + 0.05f)), Offset(w * 0.44f, h * (horizon + 0.12f)),
            Offset(w * 0.60f, h * (horizon + 0.22f)), Offset(w * 0.42f, h * (horizon + 0.33f)),
            Offset(w * 0.46f, h * 1.02f),
        )
        val halfWidth = listOf(w * 0.012f, w * 0.03f, w * 0.07f, w * 0.13f, w * 0.30f)
        val left = centre.mapIndexed { i, c -> Offset(c.x - halfWidth[i], c.y) }
        val right = centre.mapIndexed { i, c -> Offset(c.x + halfWidth[i], c.y) }
        drawPath(smoothClosed(left + right.reversed()), color = Color(Palette.SAND_DARK))
        val innerLeft = centre.mapIndexed { i, c -> Offset(c.x - halfWidth[i] * 0.82f, c.y) }
        val innerRight = centre.mapIndexed { i, c -> Offset(c.x + halfWidth[i] * 0.82f, c.y) }
        drawPath(smoothClosed(innerLeft + innerRight.reversed()), color = Color(Palette.SAND))

        // Trees and bushes.
        tree(w * 0.12f, h * (horizon + 0.17f), w * 0.30f)
        tree(w * 0.88f, h * (horizon + 0.15f), w * 0.34f)
        tree(w * 0.26f, h * (horizon + 0.09f), w * 0.18f)
        tree(w * 0.76f, h * (horizon + 0.08f), w * 0.17f)
        bush(w * 0.05f, h * 0.96f, w * 0.22f)
        bush(w * 0.97f, h * 0.97f, w * 0.26f)
    }
}

private fun DrawScope.cloud(cx: Float, cy: Float, s: Float) {
    val c = Color.White.copy(alpha = 0.92f)
    drawCircle(c, 0.5f * s, Offset(cx - 0.55f * s, cy))
    drawCircle(c, 0.7f * s, Offset(cx, cy - 0.25f * s))
    drawCircle(c, 0.5f * s, Offset(cx + 0.6f * s, cy))
    drawRoundRect(c, Offset(cx - 1.05f * s, cy - 0.05f * s), Size(2.1f * s, 0.55f * s), CornerRadius(0.27f * s))
}

private fun DrawScope.tree(x: Float, baseY: Float, s: Float) {
    drawRoundRect(Color(Palette.TRUNK), Offset(x - 0.07f * s, baseY - 0.5f * s), Size(0.14f * s, 0.5f * s), CornerRadius(0.05f * s))
    drawCircle(Color(Palette.TREE_DARK), 0.36f * s, Offset(x, baseY - 0.78f * s))
    drawCircle(Color(Palette.TREE), 0.31f * s, Offset(x - 0.2f * s, baseY - 0.6f * s))
    drawCircle(Color(Palette.TREE), 0.31f * s, Offset(x + 0.2f * s, baseY - 0.6f * s))
    drawCircle(Color(Palette.TREE_LIGHT), 0.25f * s, Offset(x, baseY - 0.9f * s))
}

private fun DrawScope.bush(x: Float, y: Float, s: Float) {
    drawCircle(Color(Palette.HILL_DARK), 0.5f * s, Offset(x, y))
    drawCircle(Color(Palette.TREE), 0.42f * s, Offset(x - 0.35f * s, y + 0.1f * s))
    drawCircle(Color(Palette.TREE_LIGHT), 0.3f * s, Offset(x + 0.1f * s, y - 0.2f * s))
}

/** Closed smooth shape through the control points (quadratic curves between midpoints). */
private fun smoothClosed(points: List<Offset>): Path {
    fun mid(a: Offset, b: Offset) = Offset((a.x + b.x) / 2f, (a.y + b.y) / 2f)
    val path = Path()
    val start = mid(points.last(), points.first())
    path.moveTo(start.x, start.y)
    for (i in points.indices) {
        val p = points[i]
        val m = mid(p, points[(i + 1) % points.size])
        path.quadraticTo(p.x, p.y, m.x, m.y)
    }
    path.close()
    return path
}
