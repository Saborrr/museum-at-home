package com.saborrr.museumathome

import android.service.dreams.DreamService
import android.view.ViewGroup
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
        webView?.evaluateJavascript("window.MuseumAppResume && window.MuseumAppResume()", null)
    }

    override fun onDreamingStopped() {
        webView?.evaluateJavascript("window.MuseumAppPause && window.MuseumAppPause()", null)
        webView?.onPause()
        super.onDreamingStopped()
    }

    override fun onDetachedFromWindow() {
        webView?.let { view ->
            (view.parent as? ViewGroup)?.removeView(view)
            view.stopLoading()
            view.destroy()
        }
        webView = null
        super.onDetachedFromWindow()
    }
}
