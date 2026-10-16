package io.github.p3n3b495.misibijak.ui.components

import androidx.annotation.DrawableRes
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import io.github.p3n3b495.misibijak.R

/*
 * Original character illustrations (docs/android/design/ui-01c/asset-manifest.md). They are decorative,
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

/** Amir, the boy: black cap, yellow shirt, blue backpack; full body, waving and pointing. 800 x 1120. */
@Composable
fun AmirMascot(modifier: Modifier = Modifier) = CharacterImage(R.drawable.amir_full, 800f / 1120f, modifier)

/** Aina, the girl in a pink hijab. Portrait, 800 x 880. Used from UI-02 (character selection). */
@Composable
fun AinaPortrait(modifier: Modifier = Modifier) = CharacterImage(R.drawable.aina_portrait, 800f / 880f, modifier)

/** Fraction of the cat image's height at which the button's top edge sits (just above the paws' middle). */
private const val CAT_BUTTON_TOP = 0.905f

/** Top of the paws overlay within the cat image (cat_paws is the cat canvas from y 760 to 900 of 900). */
private const val CAT_PAWS_TOP = 760f / 900f

/**
 * The orange-and-white cat leaning on the main button, as on the board: the cat's body is drawn
 * behind [button] and its front paws on top of it. [catWidthFraction] is relative to this
 * composable's width; [button] receives the modifier that places it.
 */
@Composable
fun CatOverButton(
    modifier: Modifier = Modifier,
    catWidthFraction: Float = 0.74f,
    button: @Composable (Modifier) -> Unit,
) {
    BoxWithConstraints(modifier.fillMaxWidth()) {
        val catWidth = maxWidth * catWidthFraction
        val catHeight = catWidth * (720f / 800f)
        Box(Modifier.fillMaxWidth()) {
            Image(
                painter = painterResource(R.drawable.cat_peek),
                contentDescription = null,
                modifier = Modifier.align(Alignment.TopCenter).size(catWidth, catHeight),
                contentScale = ContentScale.FillBounds,
            )
            Box(Modifier.fillMaxWidth().padding(top = catHeight * CAT_BUTTON_TOP), contentAlignment = Alignment.TopCenter) {
                button(Modifier)
            }
            Image(
                painter = painterResource(R.drawable.cat_paws),
                contentDescription = null,
                modifier = Modifier
                    .align(Alignment.TopCenter)
                    .offset(y = catHeight * CAT_PAWS_TOP)
                    .size(catWidth, catWidth * (112f / 800f)),
                contentScale = ContentScale.FillBounds,
            )
        }
    }
}
