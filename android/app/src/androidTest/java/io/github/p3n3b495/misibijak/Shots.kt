package io.github.p3n3b495.misibijak

import android.graphics.Bitmap
import androidx.test.platform.app.InstrumentationRegistry
import java.io.File
import java.io.FileOutputStream

/** Screenshot output folder inside the app's private files dir; CI pulls it with `run-as`. */
object Shots {
    fun dir(): File {
        val context = InstrumentationRegistry.getInstrumentation().targetContext
        return File(context.filesDir, "screenshots").also { it.mkdirs() }
    }

    fun save(bitmap: Bitmap, name: String) {
        FileOutputStream(File(dir(), "$name.png")).use { bitmap.compress(Bitmap.CompressFormat.PNG, 100, it) }
    }
}
