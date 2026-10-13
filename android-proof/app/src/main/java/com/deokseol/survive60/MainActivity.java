package com.deokseol.survive60;

import android.app.Activity;
import android.graphics.Color;
import android.os.Bundle;
import android.view.View;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.TextView;
import android.view.Gravity;
import android.content.Intent;
import android.net.Uri;

/**
 * Survive 60 free debug build: loads the same first-party HTML5 game as ONEplay.
 * No embedded purchases, tracking, push, or unapproved third-party ads.
 * Production needs a separately signed release APK and actual-device QA.
 */
public final class MainActivity extends Activity {
    private static final String GAME_URL = "https://dlaepdfuf89-crypto.github.io/survive60/";
    private WebView game;
    private TextView errorView;

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        getWindow().setFlags(1024, 1024); // portrait full-screen, gameplay remains visible
        getWindow().setNavigationBarColor(Color.rgb(7, 19, 33));
        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(Color.rgb(7, 19, 33));
        game = new WebView(this);
        game.setBackgroundColor(Color.rgb(7, 19, 33));
        game.getSettings().setJavaScriptEnabled(true);
        game.getSettings().setDomStorageEnabled(true);
        game.getSettings().setAllowFileAccess(false);
        game.getSettings().setAllowContentAccess(false);
        game.getSettings().setMixedContentMode(android.webkit.WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        game.getSettings().setMediaPlaybackRequiresUserGesture(true);
        game.setOverScrollMode(View.OVER_SCROLL_NEVER);
        game.setWebChromeClient(new WebChromeClient());
        game.setWebViewClient(new WebViewClient() {
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri url = request.getUrl();
                if (url.toString().startsWith(GAME_URL)) return false;
                // Keep the game inside the app: do not redirect to a competing store.
                return request.isForMainFrame();
            }

            @Override public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                if (request.isForMainFrame()) {
                    errorView.setText("인터넷 연결을 확인한 뒤 화면을 누르면 다시 실행됩니다.");
                    errorView.setVisibility(View.VISIBLE);
                }
            }
            @Override public void onPageFinished(WebView view, String url) {
                if (url.startsWith(GAME_URL)) errorView.setVisibility(View.GONE);
            }
        });
        root.addView(game, new FrameLayout.LayoutParams(-1, -1));
        errorView = new TextView(this);
        errorView.setTextColor(Color.WHITE);
        errorView.setBackgroundColor(Color.rgb(7, 19, 33));
        errorView.setTextSize(18);
        errorView.setGravity(Gravity.CENTER);
        errorView.setPadding(30, 30, 30, 30);
        errorView.setVisibility(View.GONE);
        errorView.setOnClickListener(v -> {
            errorView.setVisibility(View.GONE);
            game.loadUrl(GAME_URL);
        });
        root.addView(errorView, new FrameLayout.LayoutParams(-1, -1));
        setContentView(root);
        game.loadUrl(GAME_URL);
    }

    @Override public void onBackPressed() {
        if (game != null && game.canGoBack()) game.goBack();
        else super.onBackPressed();
    }

    @Override protected void onDestroy() {
        if (game != null) {
            game.stopLoading();
            game.destroy();
            game = null;
        }
        super.onDestroy();
    }
}
