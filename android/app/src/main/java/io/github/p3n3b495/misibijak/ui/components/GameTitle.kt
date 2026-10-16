package io.github.p3n3b495.misibijak.ui.components

import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import io.github.p3n3b495.misibijak.R
import io.github.p3n3b495.misibijak.ui.theme.Palette

/**
 * The two-line logo wordmark. Its size follows the available width (not the system font scale)
 * because it is a logo, and it is exposed to TalkBack as one heading.
 */
@Composable
fun GameTitle(line1Color: Color, modifier: Modifier = Modifier) {
    val description = stringResource(R.string.title_full)
    BoxWithConstraints(
        modifier.semantics(mergeDescendants = true) {
            heading()
            contentDescription = description
        },
    ) {
        val unit = (maxWidth.value / 8.4f).coerceIn(24f, 60f)
        Column(
            modifier = Modifier.fillMaxWidth().clearAndSetSemantics { },
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            OutlinedText(
                text = stringResource(R.string.title_line1),
                fontSize = (unit * 0.86f).sp,
                fillColor = line1Color,
                outlineColor = Color(Palette.INK),
                outlineWidth = (unit * 0.11f).dp,
            )
            OutlinedText(
                text = stringResource(R.string.title_line2),
                fontSize = unit.sp,
                fillColor = Color.White,
                outlineColor = Color(Palette.INK),
                outlineWidth = (unit * 0.11f).dp,
            )
        }
    }
}
