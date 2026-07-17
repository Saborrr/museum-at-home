package com.saborrr.museumathome

import android.annotation.SuppressLint
import android.graphics.Color
import android.os.Build
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebSettings
import android.webkit.WebView
import androidx.webkit.WebViewAssetLoader
import androidx.webkit.WebViewClientCompat

internal const val MUSEUM_URL = "https://appassets.androidplatform.net/assets/index.html"

internal class MuseumWebViewClient(
    private val assetLoader: WebViewAssetLoader
) : WebViewClientCompat() {
    override fun shouldInterceptRequest(
        view: WebView,
        request: WebResourceRequest
    ): WebResourceResponse? = assetLoader.shouldInterceptRequest(request.url)

    @Deprecated("Compatibility callback for old Android WebView versions")
    override fun shouldInterceptRequest(view: WebView, url: String): WebResourceResponse? =
        assetLoader.shouldInterceptRequest(android.net.Uri.parse(url))
}

@SuppressLint("SetJavaScriptEnabled")
internal fun configureMuseumWebView(webView: WebView) {
    val assetLoader = WebViewAssetLoader.Builder()
        .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(webView.context))
        .build()

    webView.setBackgroundColor(Color.BLACK)
    webView.settings.apply {
        javaScriptEnabled = true
        domStorageEnabled = true
        allowFileAccess = false
        allowContentAccess = false
        cacheMode = WebSettings.LOAD_DEFAULT
        setSupportZoom(false)
        displayZoomControls = false
        useWideViewPort = true
        loadWithOverviewMode = true
        mediaPlaybackRequiresUserGesture = false
        mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            safeBrowsingEnabled = true
        }
    }
    webView.webViewClient = MuseumWebViewClient(assetLoader)
    webView.loadUrl(MUSEUM_URL)
}
