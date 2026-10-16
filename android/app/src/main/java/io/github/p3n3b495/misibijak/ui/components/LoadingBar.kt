package io.github.p3n3b495.misibijak.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.ProgressBarRangeInfo
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.progressBarRangeInfo
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import io.github.p3n3b495.misibijak.ui.theme.Palette

/** Determinate progress bar (board: splash "Memuatkan pengembaraan…"). */
@Composable
fun LoadingBar(progress: Float, description: String, modifier: Modifier = Modifier) {
    val clamped = progress.coerceIn(0f, 1f)
    Box(
        modifier = modifier
            .height(22.dp)
            .semantics {
                contentDescription = description
                progressBarRangeInfo = ProgressBarRangeInfo(clamped, 0f..1f)
            }
            .clip(CircleShape)
            .background(Color(Palette.LOADING_TRACK))
            .border(3.dp, Color.White, CircleShape)
            .padding(3.dp),
    ) {
        Box(
            Modifier
                .fillMaxHeight()
                .fillMaxWidth(clamped)
                .clip(CircleShape)
                .background(Brush.verticalGradient(listOf(Color(Palette.LOADING_FILL_TOP), Color(Palette.LOADING_FILL_BOTTOM)))),
        )
    }
}
