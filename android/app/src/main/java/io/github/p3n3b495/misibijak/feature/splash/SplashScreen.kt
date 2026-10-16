package io.github.p3n3b495.misibijak.feature.splash

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxHeight
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
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.runtime.withFrameMillis
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import io.github.p3n3b495.misibijak.R
import io.github.p3n3b495.misibijak.ui.components.BoyMascot
import io.github.p3n3b495.misibijak.ui.components.GameTitle
import io.github.p3n3b495.misibijak.ui.components.LoadingBar
import io.github.p3n3b495.misibijak.ui.components.SceneBackground
import io.github.p3n3b495.misibijak.ui.components.SceneVariant
import io.github.p3n3b495.misibijak.ui.theme.Dimens
import io.github.p3n3b495.misibijak.ui.theme.MisiBijakTheme
import io.github.p3n3b495.misibijak.ui.theme.Nunito
import io.github.p3n3b495.misibijak.ui.theme.Palette
import kotlinx.coroutines.flow.StateFlow

/** Stateful wrapper: runs the timed progress and calls [onFinished] once when it may leave. */
@Composable
fun SplashRoute(ready: StateFlow<Boolean>, onFinished: () -> Unit) {
    val initReady by ready.collectAsStateWithLifecycle()
    var progress by remember { mutableFloatStateOf(0f) }
    var minTimeElapsed by remember { mutableStateOf(false) }
    val finish by rememberUpdatedState(onFinished)

    LaunchedEffect(Unit) {
        val start = withFrameMillis { it }
        while (!minTimeElapsed) {
            val elapsed = withFrameMillis { it } - start
            progress = SplashGate.progressAt(elapsed)
            if (elapsed >= SplashGate.MIN_DURATION_MS) minTimeElapsed = true
        }
    }
    LaunchedEffect(minTimeElapsed, initReady) {
        if (SplashGate.canFinish(minTimeElapsed, initReady)) finish()
    }

    SplashScreen(progress = progress)
}

/** Board screen 1 ("Splash Screen"). Stateless so tests and previews can fix the progress. */
@Composable
fun SplashScreen(progress: Float, modifier: Modifier = Modifier) {
    Box(modifier.fillMaxSize()) {
        SceneBackground(SceneVariant.Splash)
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
                            GameTitle(line1Color = Color(Palette.TITLE_YELLOW), modifier = Modifier.fillMaxWidth(0.9f))
                            Spacer(Modifier.height(Dimens.Space24))
                            LoadingBlock(
                                progress,
                                Modifier.fillMaxWidth(0.75f)
                                    .background(Color.White.copy(alpha = 0.8f), RoundedCornerShape(24.dp))
                                    .padding(Dimens.Space16),
                            )
                        }
                        BoyMascot(Modifier.weight(1f).fillMaxHeight(0.85f))
                    }
                } else {
                    Column(
                        Modifier.widthIn(max = Dimens.MaxContentWidth).fillMaxWidth().height(contentHeight)
                            .padding(horizontal = Dimens.Space24),
                        horizontalAlignment = Alignment.CenterHorizontally,
                    ) {
                        Spacer(Modifier.height(contentHeight * 0.14f))
                        GameTitle(line1Color = Color(Palette.TITLE_YELLOW), modifier = Modifier.fillMaxWidth(0.92f))
                        Spacer(Modifier.weight(1f))
                        BoyMascot(Modifier.fillMaxWidth(0.62f).aspectRatio(100f / 125f))
                        Spacer(Modifier.weight(0.35f))
                        LoadingBlock(progress, Modifier.fillMaxWidth(0.66f))
                        Spacer(Modifier.height(contentHeight * 0.05f))
                    }
                }
            }
        }
    }
}

@Composable
private fun LoadingBlock(progress: Float, modifier: Modifier = Modifier) {
    Column(modifier, horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.spacedBy(Dimens.Space8)) {
        LoadingBar(progress = progress, description = stringResource(R.string.splash_progress_description), modifier = Modifier.fillMaxWidth())
        Text(
            text = stringResource(R.string.splash_loading),
            color = Color(Palette.INK),
            fontFamily = Nunito,
            fontWeight = FontWeight.ExtraBold,
            fontSize = 16.sp,
            textAlign = TextAlign.Center,
        )
    }
}

@Preview(showBackground = true, widthDp = 411, heightDp = 891)
@Composable
private fun SplashPreview() {
    MisiBijakTheme { SplashScreen(progress = 0.35f) }
}
