package com.artgallery.screensaver

import android.graphics.Color
import android.service.dreams.DreamService
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient

class ArtDreamService : DreamService() {

    private lateinit var webView: WebView

    override fun onAttachedToWindow() {
        super.onAttachedToWindow()
        isFullscreen = true
        isScreenBright = false
    }

    override fun onDreamingStarted() {
        super.onDreamingStarted()

        webView = WebView(this)
        webView.setBackgroundColor(Color.BLACK)

        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            allowFileAccess = true
            cacheMode = WebSettings.LOAD_DEFAULT
            setSupportZoom(false)
            useWideViewPort = true
            loadWithOverviewMode = true
        }

        webView.webViewClient = WebViewClient()
        webView.webChromeClient = WebChromeClient()

        setContentView(webView)
        webView.loadUrl("file:///android_asset/index.html")
    }

    override fun onDreamingStopped() {
        super.onDreamingStopped()
        if (::webView.isInitialized) {
            webView.destroy()
        }
    }
}
