package io.github.p3n3b495.misibijak

import android.app.Application

class MisiBijakApp : Application() {
    lateinit var container: AppContainer
        private set

    override fun onCreate() {
        super.onCreate()
        container = AppContainer()
    }
}
