package io.github.p3n3b495.misibijak.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.FilterQuality
import androidx.compose.ui.graphics.ImageBitmap
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.withTransform
import androidx.compose.ui.res.imageResource
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.IntSize
import io.github.p3n3b495.misibijak.R
import io.github.p3n3b495.misibijak.ui.theme.Palette
import kotlin.math.ceil
import kotlin.math.max
import kotlin.math.min
import kotlin.math.roundToInt

enum class SceneVariant { Splash, Menu }

/**
 * The adventure meadow: sky, clouds, snow-capped mountains, rolling hills with a winding path,
 * trees, bushes and rocks. Built from the original sprite set in `res/drawable-nodpi`
 * (see docs/android/design/ui-01b/asset-spec.md) and laid out relative to the canvas, so it
 * adapts to phones, tablets and landscape. Decorative: hidden from TalkBack.
 */
@Composable
fun SceneBackground(variant: SceneVariant, modifier: Modifier = Modifier) {
    val mountains = ImageBitmap.imageResource(R.drawable.mountains)
    val ground = ImageBitmap.imageResource(R.drawable.ground)
    val treeA = ImageBitmap.imageResource(R.drawable.tree_a)
    val treeB = ImageBitmap.imageResource(R.drawable.tree_b)
    val treeC = ImageBitmap.imageResource(R.drawable.tree_c)
    val bushA = ImageBitmap.imageResource(R.drawable.bush_a)
    val bushB = ImageBitmap.imageResource(R.drawable.bush_b)
    val cloudA = ImageBitmap.imageResource(R.drawable.cloud_a)
    val cloudB = ImageBitmap.imageResource(R.drawable.cloud_b)
    val cloudC = ImageBitmap.imageResource(R.drawable.cloud_c)
    val rocks = ImageBitmap.imageResource(R.drawable.rocks)

    Canvas(modifier.fillMaxSize().clearAndSetSemantics { }) {
        val w = size.width
        val h = size.height
        val horizon = h * if (variant == SceneVariant.Splash) 0.46f else 0.44f
        // Sprite sizes follow this unit so landscape tablets do not get giant trees.
        val unit = min(w, h * 0.5f)

        drawRect(
            brush = Brush.verticalGradient(
                colors = listOf(Color(Palette.SKY_TOP), Color(Palette.SKY_HORIZON)),
                startY = 0f,
                endY = horizon + 0.04f * h,
            ),
        )

        sprite(cloudA, left = 0.08f * w, top = 0.05f * h, width = 0.30f * unit)
        sprite(cloudB, left = 0.62f * w, top = 0.04f * h, width = 0.26f * unit)
        sprite(cloudC, left = 0.56f * w, top = 0.25f * h, width = 0.20f * unit)

        // Mountains: mirrored tiles so wide screens never show a seam or a gap.
        val mScale = 0.17f * h / mountains.height
        val tileW = mountains.width * mScale
        val tileH = mountains.height * mScale
        val mTop = horizon - tileH + 0.03f * h
        val half = ceil(w / tileW / 2f).toInt() + 1
        for (i in -half..half) {
            val x = (w - tileW) / 2f + i * tileW
            if (i % 2 == 0) {
                drawFit(mountains, x, mTop, tileW, tileH)
            } else {
                withTransform({ scale(scaleX = -1f, scaleY = 1f, pivot = Offset(x + tileW / 2f, 0f)) }) {
                    drawFit(mountains, x, mTop, tileW, tileH)
                }
            }
        }

        // Ground: covers the width and everything below the horizon, centred so the path stays central.
        val gTop = horizon - 0.035f * h
        val gScale = max(w / ground.width, (h - gTop) / ground.height)
        drawFit(ground, (w - ground.width * gScale) / 2f, gTop, ground.width * gScale, ground.height * gScale)

        // Trees, back to front, then rocks and bushes.
        base(treeB, 0.30f * w, horizon + 0.12f * h, 0.19f * unit)
        base(treeB, 0.80f * w, horizon + 0.115f * h, 0.18f * unit)
        base(treeA, 0.12f * w, horizon + 0.19f * h, 0.31f * unit)
        base(treeC, 0.88f * w, horizon + 0.17f * h, 0.36f * unit)
        base(rocks, 0.70f * w, horizon + 0.33f * h, 0.14f * unit)
        base(bushA, 0.07f * w, h * 1.0f, 0.28f * unit)
        base(bushB, 0.95f * w, h * 1.0f, 0.31f * unit)
    }
}

private fun DrawScope.drawFit(image: ImageBitmap, left: Float, top: Float, width: Float, height: Float) {
    drawImage(
        image = image,
        dstOffset = IntOffset(left.roundToInt(), top.roundToInt()),
        dstSize = IntSize(width.roundToInt(), height.roundToInt()),
        filterQuality = FilterQuality.Medium,
    )
}

/** Draws [image] with its top-left at ([left], [top]) scaled to [width], keeping its aspect ratio. */
private fun DrawScope.sprite(image: ImageBitmap, left: Float, top: Float, width: Float) {
    drawFit(image, left, top, width, width * image.height / image.width)
}

/** Draws [image] standing on [baseY], horizontally centred on [centerX]. */
private fun DrawScope.base(image: ImageBitmap, centerX: Float, baseY: Float, width: Float) {
    val height = width * image.height / image.width
    drawFit(image, centerX - width / 2f, baseY - height, width, height)
}
