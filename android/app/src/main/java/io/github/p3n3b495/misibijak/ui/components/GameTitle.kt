package io.github.p3n3b495.misibijak.ui.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.semantics
import io.github.p3n3b495.misibijak.R

enum class TitleVariant { Splash, Menu }

/**
 * The two-line logo wordmark as an image (Nunito Black lettering with outline and gloss, original
 * artwork). It is one heading for TalkBack and never scales with the system font size.
 */
@Composable
fun GameTitle(variant: TitleVariant, modifier: Modifier = Modifier) {
    val id = if (variant == TitleVariant.Splash) R.drawable.logo_splash else R.drawable.logo_menu
    Image(
        painter = painterResource(id),
        contentDescription = stringResource(R.string.title_full),
        modifier = modifier.aspectRatio(1600f / 480f).semantics { heading() },
        contentScale = ContentScale.Fit,
    )
}
