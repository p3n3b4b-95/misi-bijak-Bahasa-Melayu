package io.github.p3n3b495.misibijak

import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.asAndroidBitmap
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.test.captureToImage
import androidx.compose.ui.test.junit4.createComposeRule
import androidx.compose.ui.test.onRoot
import androidx.compose.ui.unit.Density
import androidx.test.core.app.ActivityScenario
import androidx.test.platform.app.InstrumentationRegistry
import androidx.test.uiautomator.By
import androidx.test.uiautomator.UiDevice
import androidx.test.uiautomator.Until
import java.io.File
import io.github.p3n3b495.misibijak.feature.menu.MainMenuScreen
import io.github.p3n3b495.misibijak.feature.splash.SplashScreen
import io.github.p3n3b495.misibijak.ui.theme.MisiBijakTheme
import org.junit.Assert.assertTrue
import org.junit.Rule
import org.junit.Test

/**
 * Evidence capture for UI-01 review. These are real renders on an emulator, written to the app's
 * files dir and pulled by tools/android-instrument.sh. They are not golden-image assertions.
 */
class ScreenshotTest {
    @get:Rule
    val rule = createComposeRule()

    @Test
    fun captureSplashAtBoardProgress() {
        rule.setContent { MisiBijakTheme { SplashScreen(progress = 0.35f, modifier = Modifier.fillMaxSize()) } }
        rule.waitForIdle()
        Shots.save(rule.onRoot().captureToImage().asAndroidBitmap(), "01-splash")
    }

    @Test
    fun captureMainMenu() {
        rule.setContent { MisiBijakTheme { MainMenuScreen({}, {}, {}, {}) } }
        rule.waitForIdle()
        Shots.save(rule.onRoot().captureToImage().asAndroidBitmap(), "02-main-menu")
    }

    @Test
    fun captureMainMenuAtLargestFontScale() {
        rule.setContent {
            val density = LocalDensity.current
            CompositionLocalProvider(LocalDensity provides Density(density.density, fontScale = 2f)) {
                MisiBijakTheme { MainMenuScreen({}, {}, {}, {}) }
            }
        }
        rule.waitForIdle()
        Shots.save(rule.onRoot().captureToImage().asAndroidBitmap(), "03-main-menu-fontscale-2")
    }

    @Test
    fun captureSplashAtLargestFontScale() {
        rule.setContent {
            val density = LocalDensity.current
            CompositionLocalProvider(LocalDensity provides Density(density.density, fontScale = 2f)) {
                MisiBijakTheme { SplashScreen(progress = 0.35f) }
            }
        }
        rule.waitForIdle()
        Shots.save(rule.onRoot().captureToImage().asAndroidBitmap(), "04-splash-fontscale-2")
    }
}

/**
 * Full-device screenshots (status bar included) of the real, running app. Uses UiAutomator rather
 * than the Compose test rule, because the rule waits for the splash animation to finish and would
 * only ever see the menu.
 */
class DeviceScreenshotTest {
    @Test
    fun captureRealAppSplashThenMenu() {
        val device = UiDevice.getInstance(InstrumentationRegistry.getInstrumentation())
        device.pressHome()
        ActivityScenario.launch(MainActivity::class.java).use {
            val splashSeen = device.wait(Until.hasObject(By.desc("Memuatkan pengembaraan")), 8_000)
            if (splashSeen) assertTrue(device.takeScreenshot(File(Shots.dir(), "10-device-splash.png")))
            assertTrue(device.wait(Until.hasObject(By.desc("Mula bermain")), 10_000))
            Thread.sleep(400)
            assertTrue(device.takeScreenshot(File(Shots.dir(), "11-device-menu.png")))
        }
    }
}
