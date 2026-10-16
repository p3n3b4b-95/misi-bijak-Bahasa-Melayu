# Release shrinking rules. Compose, AndroidX and kotlinx.serialization ship their own consumer rules.
# Keep line numbers for readable stack traces in local debugging (no crash reporting exists by design).
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile
