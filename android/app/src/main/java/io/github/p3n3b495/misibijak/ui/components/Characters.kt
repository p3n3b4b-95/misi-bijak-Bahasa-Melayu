package io.github.p3n3b495.misibijak.ui.components

import androidx.annotation.DrawableRes
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.drawWithContent
import androidx.compose.ui.graphics.BlendMode
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.CompositingStrategy
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import io.github.p3n3b495.misibijak.R

/*
 * Original character illustrations (docs/android/design/ui-01b/asset-spec.md). They are decorative,
 * so TalkBack skips them; screens describe themselves with text instead.
 */

@Composable
private fun CharacterImage(@DrawableRes id: Int, widthToHeight: Float, modifier: Modifier) {
    Image(
        painter = painterResource(id),
        contentDescription = null,
        modifier = modifier.aspectRatio(widthToHeight),
        contentScale = ContentScale.Fit,
    )
}

/** Amir, the boy: cap, backpack, waving and pointing. Torso-up, 800 x 880. */
@Composable
fun AmirMascot(modifier: Modifier = Modifier) =
    CharacterImage(R.drawable.amir_wave, 800f / 880f, modifier.fadeBottom(0.2f))

/** Aina, the girl in a pink hijab. Portrait, 800 x 880. Used from UI-02 (character selection). */
@Composable
fun AinaPortrait(modifier: Modifier = Modifier) = CharacterImage(R.drawable.aina_portrait, 800f / 880f, modifier)

/** The orange-and-white cat, sitting and winking, paws at the bottom edge. 800 x 640. */
@Composable
fun CatMascot(modifier: Modifier = Modifier) = CharacterImage(R.drawable.cat_sit, 800f / 640f, modifier)

/** Fades the lowest [fraction] of the content to transparent, so a cropped figure melts into the ground. */
private fun Modifier.fadeBottom(fraction: Float): Modifier = this
    .graphicsLayer { compositingStrategy = CompositingStrategy.Offscreen }
    .drawWithContent {
        drawContent()
        drawRect(
            brush = Brush.verticalGradient(0f to Color.Black, (1f - fraction) to Color.Black, 1f to Color.Transparent),
            blendMode = BlendMode.DstIn,
        )
    }
