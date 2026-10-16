package io.github.p3n3b495.misibijak.ui.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import io.github.p3n3b495.misibijak.ui.theme.Dimens
import io.github.p3n3b495.misibijak.ui.theme.Nunito
import io.github.p3n3b495.misibijak.ui.theme.Palette

/**
 * The large "3D" call-to-action (board: MULA). Height grows with the label if the user raises the
 * system font size, so text is never clipped. The whole box is the touch target.
 */
@Composable
fun PillButton(
    label: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    contentDescription: String = label,
    faceTop: Color = Color(Palette.MULA_TOP),
    faceBottom: Color = Color(Palette.MULA_BOTTOM),
    edge: Color = Color(Palette.MULA_EDGE),
    labelColor: Color = Color(Palette.INK),
) {
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    val depth = Dimens.PrimaryButtonDepth
    Box(
        modifier = modifier
            .semantics(mergeDescendants = true) { this.contentDescription = contentDescription }
            .clickable(interactionSource = interaction, indication = null, role = Role.Button, onClick = onClick),
    ) {
        Box(
            Modifier
                .matchParentSize()
                .padding(top = depth)
                .background(edge, CircleShape),
        )
        Box(
            Modifier
                .fillMaxWidth()
                .padding(bottom = depth)
                .offset(y = if (pressed) depth else 0.dp)
                .defaultMinSize(minHeight = Dimens.PrimaryButtonMinHeight)
                .clip(CircleShape)
                .background(Brush.verticalGradient(listOf(faceTop, faceBottom)), CircleShape)
                .border(BorderStroke(3.dp, edge), CircleShape),
            contentAlignment = Alignment.Center,
        ) {
            Text(
                text = label,
                color = labelColor,
                fontFamily = Nunito,
                fontWeight = FontWeight.Black,
                fontSize = 36.sp,
                modifier = Modifier.padding(horizontal = Dimens.Space16, vertical = Dimens.Space8),
            )
        }
    }
}
