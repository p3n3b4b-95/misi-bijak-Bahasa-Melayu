package io.github.p3n3b495.misibijak.feature.menu

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawing
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import io.github.p3n3b495.misibijak.R
import io.github.p3n3b495.misibijak.ui.components.CatOverButton
import io.github.p3n3b495.misibijak.ui.components.ComingSoonDialog
import io.github.p3n3b495.misibijak.ui.components.GameTitle
import io.github.p3n3b495.misibijak.ui.components.PillButton
import io.github.p3n3b495.misibijak.ui.components.RoundIconButton
import io.github.p3n3b495.misibijak.ui.components.SceneBackground
import io.github.p3n3b495.misibijak.ui.components.SceneVariant
import io.github.p3n3b495.misibijak.ui.components.TitleVariant
import io.github.p3n3b495.misibijak.ui.theme.Dimens
import io.github.p3n3b495.misibijak.ui.theme.MisiBijakTheme
import io.github.p3n3b495.misibijak.ui.theme.Palette

/**
 * Stateful wrapper. Play, Settings and Profile belong to later modules (UI-02+), so for now they
 * show a "coming soon" dialog. Exit really closes the app.
 */
@Composable
fun MainMenuRoute(onExit: () -> Unit) {
    var showComingSoon by rememberSaveable { mutableStateOf(false) }
    MainMenuScreen(
        onPlay = { showComingSoon = true },
        onSettings = { showComingSoon = true },
        onProfile = { showComingSoon = true },
        onExit = onExit,
    )
    if (showComingSoon) ComingSoonDialog(onDismiss = { showComingSoon = false })
}

/** Board screen 2 ("Skrin Utama"). Stateless. */
@Composable
fun MainMenuScreen(
    onPlay: () -> Unit,
    onSettings: () -> Unit,
    onProfile: () -> Unit,
    onExit: () -> Unit,
    modifier: Modifier = Modifier,
) {
    Box(modifier.fillMaxSize()) {
        SceneBackground(SceneVariant.Menu)
        BoxWithConstraints(Modifier.fillMaxSize().windowInsetsPadding(WindowInsets.safeDrawing)) {
            val landscape = maxWidth > maxHeight * 1.15f
            val contentHeight = maxOf(maxHeight, if (landscape) 320.dp else 560.dp)
            Box(
                Modifier.fillMaxSize().verticalScroll(rememberScrollState()),
                contentAlignment = Alignment.TopCenter,
            ) {
                if (landscape) {
                    Row(
                        Modifier.fillMaxWidth().height(contentHeight).padding(Dimens.Space24),
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Column(Modifier.weight(1f), horizontalAlignment = Alignment.CenterHorizontally) {
                            GameTitle(variant = TitleVariant.Menu, modifier = Modifier.fillMaxWidth(0.94f))
                        }
                        Column(Modifier.weight(1f), horizontalAlignment = Alignment.CenterHorizontally) {
                            // Panel keeps captions off the scenery (trees sit behind this column in landscape).
                            Column(
                                Modifier
                                    .widthIn(max = 480.dp)
                                    .background(Color.White.copy(alpha = 0.8f), RoundedCornerShape(32.dp))
                                    .padding(Dimens.Space24),
                                horizontalAlignment = Alignment.CenterHorizontally,
                            ) { Actions(onPlay, onSettings, onProfile, onExit, catWidthFraction = 0.56f) }
                        }
                    }
                } else {
                    Column(
                        Modifier.widthIn(max = Dimens.MaxContentWidth).fillMaxWidth().height(contentHeight)
                            .padding(horizontal = Dimens.Space24),
                        horizontalAlignment = Alignment.CenterHorizontally,
                    ) {
                        Spacer(Modifier.height(contentHeight * 0.13f))
                        GameTitle(variant = TitleVariant.Menu, modifier = Modifier.fillMaxWidth(0.94f))
                        Spacer(Modifier.weight(1f))
                        Actions(onPlay, onSettings, onProfile, onExit, catWidthFraction = 0.74f)
                        Spacer(Modifier.height(contentHeight * 0.07f))
                    }
                }
            }
        }
    }
}

@Composable
private fun Actions(
    onPlay: () -> Unit,
    onSettings: () -> Unit,
    onProfile: () -> Unit,
    onExit: () -> Unit,
    catWidthFraction: Float,
) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        // The cat leans on MULA: body behind the button, paws in front (board screen 2).
        CatOverButton(catWidthFraction = catWidthFraction) { placement ->
            PillButton(
                label = stringResource(R.string.menu_play),
                contentDescription = stringResource(R.string.menu_play_description),
                onClick = onPlay,
                modifier = placement.fillMaxWidth(0.82f),
            )
        }
        Spacer(Modifier.height(Dimens.Space24))
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceEvenly, verticalAlignment = Alignment.Top) {
            RoundIconButton(R.drawable.icon_settings, stringResource(R.string.menu_settings), onSettings)
            RoundIconButton(R.drawable.icon_profile, stringResource(R.string.menu_profile), onProfile)
            RoundIconButton(R.drawable.icon_exit, stringResource(R.string.menu_exit), onExit)
        }
    }
}

@Preview(showBackground = true, widthDp = 411, heightDp = 891)
@Composable
private fun MainMenuPreview() {
    MisiBijakTheme { MainMenuScreen(onPlay = {}, onSettings = {}, onProfile = {}, onExit = {}) }
}
