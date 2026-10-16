package io.github.p3n3b495.misibijak

import androidx.compose.ui.test.assertIsDisplayed
import androidx.compose.ui.test.junit4.createAndroidComposeRule
import androidx.compose.ui.test.onNodeWithContentDescription
import androidx.compose.ui.test.onNodeWithText
import org.junit.Rule
import org.junit.Test

/** End-to-end: the real activity shows the splash, then the main menu, without any interaction. */
class AppFlowTest {
    @get:Rule
    val rule = createAndroidComposeRule<MainActivity>()

    @Test
    fun splashLeadsToMainMenu() {
        rule.waitUntil(timeoutMillis = 10_000) {
            rule.onAllNodesWithContentDescriptionCount("Mula bermain") > 0
        }
        rule.onNodeWithContentDescription("Mula bermain").assertIsDisplayed()
        rule.onNodeWithText("Tetapan").assertIsDisplayed()
    }
}
