package io.github.p3n3b495.misibijak

import android.graphics.Color
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.SystemBarStyle
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import io.github.p3n3b495.misibijak.navigation.AppNavHost
import io.github.p3n3b495.misibijak.ui.theme.MisiBijakTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        installSplashScreen()
        super.onCreate(savedInstanceState)
        // The scenes are bright daytime illustrations, so system bar icons are always dark.
        enableEdgeToEdge(
            statusBarStyle = SystemBarStyle.light(Color.TRANSPARENT, Color.TRANSPARENT),
            navigationBarStyle = SystemBarStyle.light(Color.TRANSPARENT, Color.TRANSPARENT),
        )
        val container = (application as MisiBijakApp).container
        setContent {
            MisiBijakTheme {
                AppNavHost(container = container, onExit = { finish() })
            }
        }
    }
}
