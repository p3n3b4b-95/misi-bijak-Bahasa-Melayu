package io.github.p3n3b495.misibijak

import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

/**
 * Manual dependency container (decision P3). In M0 there is nothing to initialise, so [ready] is
 * already true. Later milestones add the content repository and the database here and flip
 * [ready] when they have loaded; the splash screen already waits for it.
 */
class AppContainer {
    private val _ready = MutableStateFlow(true)
    val ready: StateFlow<Boolean> = _ready.asStateFlow()
}
