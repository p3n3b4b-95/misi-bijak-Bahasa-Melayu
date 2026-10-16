package io.github.p3n3b495.misibijak.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.drawscope.translate
import androidx.compose.ui.semantics.clearAndSetSemantics
import io.github.p3n3b495.misibijak.ui.theme.Palette

/*
 * PLACEHOLDER mascots. The design board's characters were supplied only as a flattened picture,
 * not as artwork files, so these are simple original vector drawings that mark where the real
 * characters will go. They are decorative (hidden from TalkBack). See docs/android/design/asset-manifest.md.
 */

/** Waving boy with a cap and backpack (board: splash screen). Aspect 100:125. */
@Composable
fun BoyMascot(modifier: Modifier = Modifier) {
    Canvas(modifier.clearAndSetSemantics { }) {
        val u = minOf(size.width / 100f, size.height / 125f)
        translate(left = (size.width - 100f * u) / 2f, top = (size.height - 125f * u) / 2f) {
        val ink = Color(Palette.INK)
        val skin = Color(Palette.SKIN)
        val sw = 2.4f * u
        fun o(x: Float, y: Float) = Offset(x * u, y * u)

        // Arms (outlined: dark line under a skin line).
        fun arm(x1: Float, y1: Float, x2: Float, y2: Float) {
            drawLine(ink, o(x1, y1), o(x2, y2), strokeWidth = 12f * u, cap = StrokeCap.Round)
            drawLine(skin, o(x1, y1), o(x2, y2), strokeWidth = 8f * u, cap = StrokeCap.Round)
        }
        arm(26f, 84f, 10f, 100f)
        arm(74f, 82f, 92f, 56f)

        // Body, shirt and backpack straps.
        drawRoundRect(Color(Palette.SHIRT), o(24f, 70f), Size(52f * u, 60f * u), CornerRadius(16f * u))
        drawRect(Color(Palette.STRAP), o(33f, 72f), Size(7f * u, 53f * u))
        drawRect(Color(Palette.STRAP), o(60f, 72f), Size(7f * u, 53f * u))
        drawRoundRect(ink, o(24f, 70f), Size(52f * u, 60f * u), CornerRadius(16f * u), style = Stroke(sw))

        // Ears, head.
        drawCircle(skin, 5f * u, o(20f, 46f)); drawCircle(ink, 5f * u, o(20f, 46f), style = Stroke(sw))
        drawCircle(skin, 5f * u, o(80f, 46f)); drawCircle(ink, 5f * u, o(80f, 46f), style = Stroke(sw))
        drawCircle(skin, 30f * u, o(50f, 44f))
        drawCircle(ink, 30f * u, o(50f, 44f), style = Stroke(sw))

        // Cap: dome over the top of the head plus a brim to the right.
        val cap = Path().apply {
            moveTo(20f * u, 42f * u)
            cubicTo(20f * u, 6f * u, 80f * u, 6f * u, 80f * u, 42f * u)
            lineTo(20f * u, 42f * u)
            close()
        }
        drawPath(cap, Color(Palette.CAP))
        drawRoundRect(Color(Palette.CAP), o(44f, 36f), Size(46f * u, 9f * u), CornerRadius(5f * u))
        drawRoundRect(ink, o(44f, 36f), Size(46f * u, 9f * u), CornerRadius(5f * u), style = Stroke(sw * 0.7f))

        // Face: eyes, cheeks, open smile.
        drawOval(ink, o(39f, 47f), Size(7f * u, 9f * u))
        drawOval(ink, o(55f, 47f), Size(7f * u, 9f * u))
        drawCircle(Color.White, 1.6f * u, o(41f, 49f))
        drawCircle(Color.White, 1.6f * u, o(57f, 49f))
        drawCircle(Color(Palette.CHEEK).copy(alpha = 0.6f), 4.5f * u, o(33f, 58f))
        drawCircle(Color(Palette.CHEEK).copy(alpha = 0.6f), 4.5f * u, o(67f, 58f))
        val mouth = Path().apply {
            moveTo(42f * u, 59f * u)
            quadraticTo(50f * u, 59f * u, 58f * u, 59f * u)
            quadraticTo(56f * u, 69f * u, 50f * u, 69f * u)
            quadraticTo(44f * u, 69f * u, 42f * u, 59f * u)
            close()
        }
        drawPath(mouth, Color(Palette.MOUTH))
        drawCircle(Color(Palette.TONGUE), 3.4f * u, o(50f, 66.5f))
        drawCircle(skin, 6.5f * u, o(92f, 53f)); drawCircle(ink, 6.5f * u, o(92f, 53f), style = Stroke(sw))
        }
    }
}

/** Sitting ginger cat (board: main menu mascot, sits on top of the MULA button). Aspect 100:78. */
@Composable
fun CatMascot(modifier: Modifier = Modifier) {
    Canvas(modifier.clearAndSetSemantics { }) {
        val u = minOf(size.width / 100f, size.height / 78f)
        translate(left = (size.width - 100f * u) / 2f, top = (size.height - 78f * u) / 2f) {
        val ink = Color(Palette.INK)
        val orange = Color(Palette.CAT)
        val sw = 2.2f * u
        fun o(x: Float, y: Float) = Offset(x * u, y * u)

        // Tail curling up on the right.
        val tail = Path().apply {
            moveTo(74f * u, 74f * u)
            cubicTo(100f * u, 74f * u, 100f * u, 40f * u, 88f * u, 34f * u)
        }
        drawPath(tail, ink, style = Stroke(width = 12f * u, cap = StrokeCap.Round))
        drawPath(tail, orange, style = Stroke(width = 8f * u, cap = StrokeCap.Round))
        drawPath(tail, Color(Palette.CAT_DARK), style = Stroke(width = 2.5f * u, cap = StrokeCap.Butt))

        // Body and paws.
        drawOval(orange, o(22f, 50f), Size(56f * u, 44f * u))
        drawOval(ink, o(22f, 50f), Size(56f * u, 44f * u), style = Stroke(sw))
        drawOval(Color(Palette.CAT_WHITE), o(30f, 70f), Size(18f * u, 12f * u))
        drawOval(ink, o(30f, 70f), Size(18f * u, 12f * u), style = Stroke(sw * 0.8f))
        drawOval(Color(Palette.CAT_WHITE), o(52f, 70f), Size(18f * u, 12f * u))
        drawOval(ink, o(52f, 70f), Size(18f * u, 12f * u), style = Stroke(sw * 0.8f))

        // Ears.
        fun ear(x1: Float, y1: Float, x2: Float, y2: Float, x3: Float, y3: Float) {
            val p = Path().apply { moveTo(x1 * u, y1 * u); lineTo(x2 * u, y2 * u); lineTo(x3 * u, y3 * u); close() }
            drawPath(p, orange)
            drawPath(p, ink, style = Stroke(sw))
        }
        ear(24f, 34f, 27f, 6f, 46f, 20f)
        ear(76f, 34f, 73f, 6f, 54f, 20f)
        val innerL = Path().apply { moveTo(29f * u, 24f * u); lineTo(30f * u, 14f * u); lineTo(38f * u, 21f * u); close() }
        val innerR = Path().apply { moveTo(71f * u, 24f * u); lineTo(70f * u, 14f * u); lineTo(62f * u, 21f * u); close() }
        drawPath(innerL, Color(Palette.EAR_PINK)); drawPath(innerR, Color(Palette.EAR_PINK))

        // Head.
        drawOval(orange, o(20f, 14f), Size(60f * u, 50f * u))
        drawOval(ink, o(20f, 14f), Size(60f * u, 50f * u), style = Stroke(sw))
        for (dx in listOf(-5f, 0f, 5f)) {
            drawLine(Color(Palette.CAT_DARK), o(50f + dx, 16f), o(50f + dx * 0.8f, 24f), strokeWidth = 2.2f * u, cap = StrokeCap.Round)
        }
        drawOval(Color(Palette.CAT_WHITE), o(33f, 42f), Size(34f * u, 20f * u))

        // Face.
        drawOval(ink, o(33f, 28f), Size(9f * u, 12f * u))
        drawOval(ink, o(58f, 28f), Size(9f * u, 12f * u))
        drawCircle(Color.White, 2f * u, o(36f, 31f))
        drawCircle(Color.White, 2f * u, o(61f, 31f))
        val nose = Path().apply { moveTo(46f * u, 43f * u); lineTo(54f * u, 43f * u); lineTo(50f * u, 48f * u); close() }
        drawPath(nose, Color(Palette.EAR_PINK))
        drawPath(nose, ink, style = Stroke(sw * 0.7f))
        val smile = Path().apply {
            moveTo(50f * u, 48f * u); lineTo(50f * u, 51f * u)
            moveTo(44f * u, 51f * u); quadraticTo(47f * u, 55f * u, 50f * u, 51f * u)
            quadraticTo(53f * u, 55f * u, 56f * u, 51f * u)
        }
        drawPath(smile, ink, style = Stroke(width = 1.8f * u, cap = StrokeCap.Round))
        val whisker = ink.copy(alpha = 0.55f)
        for (dy in listOf(-2f, 2f, 6f)) {
            drawLine(whisker, o(34f, 48f + dy * 0.5f), o(22f, 46f + dy), strokeWidth = 1.2f * u, cap = StrokeCap.Round)
            drawLine(whisker, o(66f, 48f + dy * 0.5f), o(78f, 46f + dy), strokeWidth = 1.2f * u, cap = StrokeCap.Round)
        }
        }
    }
}
