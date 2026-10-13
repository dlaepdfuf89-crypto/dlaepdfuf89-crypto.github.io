package com.deokseol.survive60;

import android.app.Activity;
import android.graphics.Color;
import android.os.Bundle;
import android.util.Base64;
import android.view.Gravity;
import android.view.View;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.TextView;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Locale;

/**
 * Offline-only Survive 60 Android distribution candidate.
 * The exact 11 verified ONEplay game chunks are bundled as app assets.
 * No network access, no billing, no analytics, no unapproved third-party ads.
 * Must pass independent device QA and ONEstore review before public release.
 */
public final class MainActivity extends Activity {
    private static final String ASSET_ORIGIN = "https://appassets.androidplatform.net/";
    private static final int PART_COUNT = 11;
    private static final int BACKGROUND = Color.rgb(7, 19, 33);
    private WebView game;
    private Survive60AdMaxRewardBridge adManager;
    private TextView status;

    @Override public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().setFlags(1024, 1024);
        getWindow().setNavigationBarColor(BACKGROUND);

        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(BACKGROUND);
        game = new WebView(this);
        game.setBackgroundColor(BACKGROUND);
        game.setOverScrollMode(View.OVER_SCROLL_NEVER);
        game.getSettings().setJavaScriptEnabled(true);
        game.getSettings().setDomStorageEnabled(true);
        game.getSettings().setAllowFileAccess(false);
        game.getSettings().setAllowContentAccess(false);
        game.getSettings().setAllowFileAccessFromFileURLs(false);
        game.getSettings().setAllowUniversalAccessFromFileURLs(false);
        game.getSettings().setBlockNetworkLoads(true);
        game.getSettings().setMediaPlaybackRequiresUserGesture(true);
        game.setWebChromeClient(new WebChromeClient());
        game.setWebViewClient(new WebViewClient() {
            @Override public boolean shouldOverrideUrlLoading(WebView view, android.webkit.WebResourceRequest request) {
                // Do not navigate outside the bundled first-party game.
                return request.isForMainFrame();
            }
            @Override public void onPageFinished(WebView view, String url) {
                if (url.startsWith(ASSET_ORIGIN)) status.setVisibility(View.GONE);
            }
        });
        root.addView(game, new FrameLayout.LayoutParams(-1, -1));
        status = new TextView(this);
        status.setText("게임을 준비하고 있습니다…");
        status.setTextColor(Color.WHITE);
        status.setTextSize(17);
        status.setBackgroundColor(BACKGROUND);
        status.setGravity(Gravity.CENTER);
        status.setPadding(28, 28, 28, 28);
        root.addView(status, new FrameLayout.LayoutParams(-1, -1));
        setContentView(root);
        // No ad requests without a real approved media key + placement ID.
        adManager = new Survive60AdMaxRewardBridge(this, rewardSlot -> {
            if (game != null) {
                // Java emits a verified completion signal only. The game must
                // explicitly map it to one-time rewards in a later audited build.
                game.evaluateJavascript("window.dispatchEvent(new CustomEvent('s60-native-reward',{detail:{slot:'" + rewardSlot + "'}}))", null);
            }
        });
        adManager.initializeIfConfigured();
        startBundledGame();
    }

    private byte[] readAsset(String path) throws Exception {
        try (InputStream stream = getAssets().open(path);
             ByteArrayOutputStream bytes = new ByteArrayOutputStream()) {
            byte[] buf = new byte[8192];
            int count;
            while ((count = stream.read(buf)) != -1) {
                bytes.write(buf, 0, count);
            }
            return bytes.toByteArray();
        }
    }

    private void startBundledGame() {
        try (ByteArrayOutputStream html = new ByteArrayOutputStream(4073600)) {
            for (int i = 0; i < PART_COUNT; i++) {
                String file = String.format(Locale.ROOT, "chunks/%03d.txt", i);
                String encoded = new String(readAsset(file), StandardCharsets.UTF_8).trim();
                byte[] decoded = Base64.decode(encoded, Base64.DEFAULT);
                html.write(decoded, 0, decoded.length);
            }
            // Synthetic secure origin supports game localStorage, without remote requests.
            game.loadDataWithBaseURL(ASSET_ORIGIN,
                    new String(html.toByteArray(), StandardCharsets.UTF_8),
                    "text/html", "UTF-8", null);
        } catch (Exception error) {
            status.setText("게임 데이터 오류가 발생했습니다. 앱을 다시 실행해 주세요.");
            status.setVisibility(View.VISIBLE);
        }
    }

    @Override protected void onPause() {
        if (adManager != null) adManager.onPause();
        if (game != null) game.onPause();
        super.onPause();
    }
    @Override protected void onResume() {
        super.onResume();
        if (adManager != null) adManager.onResume();
        if (game != null) game.onResume();
    }
    @Override protected void onDestroy() {
        if (adManager != null) { adManager.destroy(); adManager = null; }
        if (game != null) {
            game.stopLoading();
            game.destroy();
            game = null;
        }
        super.onDestroy();
    }
}
