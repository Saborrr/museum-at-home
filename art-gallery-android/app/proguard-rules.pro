# WebView specific rules
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
-keep class com.artgallery.screensaver.** { *; }
