package io.github.p3n3b495.misibijak

import androidx.compose.ui.semantics.SemanticsProperties
import androidx.compose.ui.test.assertIsDisplayed
import androidx.compose.ui.test.junit4.createComposeRule
import androidx.compose.ui.test.onNodeWithContentDescription
import androidx.compose.ui.test.onNodeWithText
import io.github.p3n3b495.misibijak.feature.splash.SplashScreen
import io.github.p3n3b495.misibijak.ui.theme.MisiBijakTheme
import org.junit.Assert.assertEquals
import org.junit.Rule
import org.junit.Test

class SplashScreenTest {
    @get:Rule
    val rule = createComposeRule()

    @Test
    fun showsTitleLoadingTextAndProgress() {
        rule.setContent { MisiBijakTheme { SplashScreen(progress = 0.35f) } }
        rule.onNodeWithContentDescription("Misi Bijak Bahasa Melayu").assertIsDisplayed()
        rule.onNodeWithText("Memuatkan pengembaraan…").assertIsDisplayed()
        val bar = rule.onNodeWithContentDescription("Memuatkan pengembaraan").assertIsDisplayed()
        val info = bar.fetchSemanticsNode().config[SemanticsProperties.ProgressBarRangeInfo]
        assertEquals(0.35f, info.current, 0.001f)
    }
}
