package io.github.p3n3b495.misibijak

import androidx.compose.ui.test.assertHasClickAction
import androidx.compose.ui.test.assertIsDisplayed
import androidx.compose.ui.test.assertTouchHeightIsAtLeast
import androidx.compose.ui.test.assertTouchWidthIsAtLeast
import androidx.compose.ui.test.junit4.createComposeRule
import androidx.compose.ui.test.onNodeWithContentDescription
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.performClick
import androidx.compose.ui.unit.dp
import io.github.p3n3b495.misibijak.feature.menu.MainMenuRoute
import io.github.p3n3b495.misibijak.ui.theme.MisiBijakTheme
import org.junit.Assert.assertTrue
import org.junit.Rule
import org.junit.Test

class MainMenuTest {
    @get:Rule
    val rule = createComposeRule()

    private var exited = false

    private fun show() {
        exited = false
        rule.setContent { MisiBijakTheme { MainMenuRoute(onExit = { exited = true }) } }
    }

    @Test
    fun showsTitleAndAllFourActions() {
        show()
        rule.onNodeWithContentDescription("Misi Bijak Bahasa Melayu").assertIsDisplayed()
        rule.onNodeWithContentDescription("Mula bermain").assertIsDisplayed().assertHasClickAction()
        rule.onNodeWithText("Tetapan").assertIsDisplayed().assertHasClickAction()
        rule.onNodeWithText("Profil").assertIsDisplayed().assertHasClickAction()
        rule.onNodeWithText("Keluar").assertIsDisplayed().assertHasClickAction()
    }

    @Test
    fun touchTargetsAreLargeEnough() {
        show()
        rule.onNodeWithContentDescription("Mula bermain").assertTouchHeightIsAtLeast(64.dp).assertTouchWidthIsAtLeast(160.dp)
        listOf("Tetapan", "Profil", "Keluar").forEach {
            rule.onNodeWithText(it).assertTouchHeightIsAtLeast(48.dp).assertTouchWidthIsAtLeast(48.dp)
        }
    }

    @Test
    fun unfinishedDestinationsShowComingSoonDialog() {
        show()
        rule.onNodeWithText("Tetapan").performClick()
        rule.onNodeWithText("Akan datang").assertIsDisplayed()
        rule.onNodeWithText("Baik").performClick()
        rule.onNodeWithContentDescription("Mula bermain").performClick()
        rule.onNodeWithText("Akan datang").assertIsDisplayed()
    }

    @Test
    fun exitInvokesCallback() {
        show()
        rule.onNodeWithText("Keluar").performClick()
        assertTrue(exited)
    }
}
