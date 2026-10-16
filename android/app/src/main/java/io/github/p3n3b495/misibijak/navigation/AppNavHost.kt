package io.github.p3n3b495.misibijak.navigation

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import io.github.p3n3b495.misibijak.AppContainer
import io.github.p3n3b495.misibijak.feature.menu.MainMenuRoute
import io.github.p3n3b495.misibijak.feature.splash.SplashRoute

@Composable
fun AppNavHost(
    container: AppContainer,
    onExit: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val navController = rememberNavController()
    NavHost(navController = navController, startDestination = Splash, modifier = modifier) {
        composable<Splash> {
            SplashRoute(
                ready = container.ready,
                onFinished = {
                    // Back must never return to the splash screen (03-navigation-contracts §3).
                    navController.navigate(MainMenu) { popUpTo<Splash> { inclusive = true } }
                },
            )
        }
        composable<MainMenu> {
            MainMenuRoute(onExit = onExit)
        }
    }
}
