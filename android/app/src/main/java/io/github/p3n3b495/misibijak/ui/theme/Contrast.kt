package io.github.p3n3b495.misibijak.ui.theme

import kotlin.math.pow

/** WCAG 2.x relative luminance and contrast ratio for opaque ARGB colours. */
object Contrast {
    private fun channel(value: Int): Double {
        val c = value / 255.0
        return if (c <= 0.03928) c / 12.92 else ((c + 0.055) / 1.055).pow(2.4)
    }

    fun luminance(argb: Long): Double {
        val r = ((argb shr 16) and 0xFFL).toInt()
        val g = ((argb shr 8) and 0xFFL).toInt()
        val b = (argb and 0xFFL).toInt()
        return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
    }

    fun ratio(a: Long, b: Long): Double {
        val la = luminance(a)
        val lb = luminance(b)
        val lighter = maxOf(la, lb)
        val darker = minOf(la, lb)
        return (lighter + 0.05) / (darker + 0.05)
    }
}
