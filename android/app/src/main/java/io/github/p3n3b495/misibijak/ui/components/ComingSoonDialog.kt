package io.github.p3n3b495.misibijak.ui.components

import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.res.stringResource
import io.github.p3n3b495.misibijak.R

/** Placeholder for destinations that belong to later milestones (UI-02 and beyond). */
@Composable
fun ComingSoonDialog(onDismiss: () -> Unit) {
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text(stringResource(R.string.coming_soon_title)) },
        text = { Text(stringResource(R.string.coming_soon_body)) },
        confirmButton = { TextButton(onClick = onDismiss) { Text(stringResource(R.string.coming_soon_ok)) } },
    )
}
