package io.github.p3n3b495.misibijak

import androidx.compose.ui.test.SemanticsNodeInteractionsProvider
import androidx.compose.ui.test.onAllNodesWithContentDescription

fun SemanticsNodeInteractionsProvider.onAllNodesWithContentDescriptionCount(description: String): Int =
    onAllNodesWithContentDescription(description).fetchSemanticsNodes().size
