package com.saborrr.museumathome

import android.service.dreams.DreamService
import android.webkit.WebView

class ArtDreamService : DreamService() {
    private var webView: WebView? = null

    override fun onAttachedToWindow() {
        super.onAttachedToWindow()
        isFullscreen = true
        isScreenBright = false
        isInteractive = false

        webView = WebView(this).also { view ->
            configureMuseumWebView(view)
            setContentView(view)
        }
    }

    override fun onDreamingStarted() {
        super.onDreamingStarted()
        webView?.onResume()
    }

    override fun onDreamingStopped() {
        webView?.onPause()
        super.onDreamingStopped()
    }

    override fun onDetachedFromWindow() {
        webView?.destroy()
        webView = null
        super.onDetachedFromWindow()
    }
}
