package io.github.p3n3b495.misibijak.ui.components

import androidx.compose.foundation.layout.Box
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.TextUnit
import io.github.p3n3b495.misibijak.ui.theme.Nunito

/**
 * Sticker-style lettering used for the logo: a stroked copy of the text under a filled copy.
 * Purely visual; callers provide the accessibility description on a parent.
 */
@Composable
fun OutlinedText(
    text: String,
    fontSize: TextUnit,
    fillColor: Color,
    outlineColor: Color,
    outlineWidth: Dp,
    modifier: Modifier = Modifier,
) {
    val outlinePx = with(LocalDensity.current) { outlineWidth.toPx() * 2f }
    val base = TextStyle(
        fontFamily = Nunito,
        fontWeight = FontWeight.Black,
        fontSize = fontSize,
        lineHeight = fontSize * 1.1f,
        textAlign = TextAlign.Center,
    )
    Box(modifier.clearAndSetSemantics { }) {
        Text(
            text = text,
            color = outlineColor,
            style = base.copy(drawStyle = Stroke(width = outlinePx, join = StrokeJoin.Round)),
            maxLines = 1,
            softWrap = false,
        )
        Text(text = text, color = fillColor, style = base, maxLines = 1, softWrap = false)
    }
}
