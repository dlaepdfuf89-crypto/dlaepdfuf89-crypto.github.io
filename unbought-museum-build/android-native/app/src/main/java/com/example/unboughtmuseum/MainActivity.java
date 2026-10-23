package com.example.unboughtmuseum;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.Build;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.MimeTypeMap;
import android.view.WindowInsets;
import android.window.OnBackInvokedDispatcher;
import android.widget.Toast;
import android.util.Base64;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

/**
 * Offline, first-party-only native wrapper for the Unbought Museum.
 * Does not connect to an arbitrary host, request INTERNET permission, or
 * inject personal data into analytics. The appassets domain is virtual.
 * NOTE: package name is an internal placeholder, NOT a store identity.
 */
public final class MainActivity extends Activity {
    private static final String ORIGIN = "https://appassets.androidplatform.net";
    private static final String ASSET_ROOT = "site/";
    private static final int REQUEST_OPEN_JSON = 1811;
    private static final int REQUEST_SAVE_JSON = 1812;
    private static final int REQUEST_SAVE_IMAGE = 1813;
    private static final int MAX_IMAGE_BASE64 = 15_000_000;
    private static final int MAX_EXPORT_LENGTH = 5_000_000;

    private WebView browser;
    private android.webkit.ValueCallback<Uri[]> pendingImport;
    private String pendingExport;
    private String exportName;
    private String pendingImage;

    @SuppressLint("SetJavaScriptEnabled")
    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        browser = new WebView(this);
        browser.setBackgroundColor(android.graphics.Color.rgb(246,241,231));
        browser.getSettings().setJavaScriptEnabled(true);
        browser.getSettings().setDomStorageEnabled(true);
        browser.getSettings().setAllowFileAccess(false);
        browser.getSettings().setAllowContentAccess(true); // OS document picker URI
        browser.getSettings().setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        browser.getSettings().setJavaScriptCanOpenWindowsAutomatically(false);
        browser.getSettings().setSupportMultipleWindows(false);
        browser.getSettings().setCacheMode(WebSettings.LOAD_DEFAULT);
        WebView.setWebContentsDebuggingEnabled((getApplicationInfo().flags & android.content.pm.ApplicationInfo.FLAG_DEBUGGABLE)!=0);

        // Scope native backup access to our bundled, trusted assets only.
        browser.addJavascriptInterface(new BackupBridge(), "AndroidMuseum");
        browser.setWebViewClient(new WebViewClient() {
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri u = request.getUrl();
                return !isBundledOrigin(u);
            }

            @Override public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                Uri u = request.getUrl();
                if (!isBundledOrigin(u)) return forbidden();
                if (!"GET".equalsIgnoreCase(request.getMethod())) return forbidden();
                String path = u.getEncodedPath();
                if (path == null || path.equals("/")) path = "/index.html";
                if (!path.startsWith("/") || path.indexOf('%') >= 0 || path.indexOf('\\') >= 0 ||
                    path.contains("..") || path.indexOf(':') >= 0) return forbidden();
                String relative = path.substring(1);
                if (relative.isEmpty()) relative = "index.html";
                try {
                    InputStream stream = getAssets().open(ASSET_ROOT + relative);
                    String mime = MimeTypeMap.getSingleton().getMimeTypeFromExtension(
                        MimeTypeMap.getFileExtensionFromUrl(relative));
                    if (relative.endsWith(".js")) mime = "text/javascript";
                    if (relative.endsWith(".svg")) mime = "image/svg+xml";
                    if (relative.endsWith(".webmanifest")) mime = "application/manifest+json";
                    if (relative.endsWith(".json")) mime = "application/json";
                    if (mime == null) mime = "application/octet-stream";
                    return new WebResourceResponse(mime, "UTF-8", stream);
                } catch (Exception e) {
                    return new WebResourceResponse("text/plain", "UTF-8", 404,
                        "Not Found", java.util.Collections.emptyMap(),
                        new java.io.ByteArrayInputStream(new byte[0]));
                }
            }
        });
        browser.setWebChromeClient(new WebChromeClient() {
            @Override public boolean onShowFileChooser(WebView view,
                    android.webkit.ValueCallback<Uri[]> callback, FileChooserParams params) {
                if (pendingImport != null) pendingImport.onReceiveValue(null);
                pendingImport = callback;
                Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
                intent.addCategory(Intent.CATEGORY_OPENABLE);
                intent.setType("*/*");
                intent.putExtra(Intent.EXTRA_MIME_TYPES,new String[]{
                    "application/json","text/plain","application/octet-stream"});
                try { startActivityForResult(intent, REQUEST_OPEN_JSON); return true; }
                catch (ActivityNotFoundException e) {
                    pendingImport.onReceiveValue(null); pendingImport = null; return false;
                }
            }
        });
        if (Build.VERSION.SDK_INT >= 35) {
            browser.setOnApplyWindowInsetsListener((view, insets) -> {
                android.graphics.Insets bars=insets.getInsets(WindowInsets.Type.systemBars() |
                        WindowInsets.Type.displayCutout());
                view.setPadding(bars.left,bars.top,bars.right,bars.bottom);
                return insets;
            });
        }
        setContentView(browser);
        if (Build.VERSION.SDK_INT >= 33) {
            getOnBackInvokedDispatcher().registerOnBackInvokedCallback(
                    OnBackInvokedDispatcher.PRIORITY_DEFAULT, this::handleMuseumBack);
        }
        browser.loadUrl(ORIGIN + "/index.html");
    }

    private boolean isBundledOrigin(Uri u) {
        return "https".equalsIgnoreCase(u.getScheme()) &&
                "appassets.androidplatform.net".equalsIgnoreCase(u.getHost()) &&
                u.getPort() == -1 && u.getUserInfo() == null;
    }

    private static WebResourceResponse forbidden() {
        return new WebResourceResponse("text/plain", "UTF-8", 403,
            "Forbidden", java.util.Collections.emptyMap(),
            new java.io.ByteArrayInputStream(new byte[0]));
    }

    public final class BackupBridge {
        @JavascriptInterface public void saveImage(String filename, String base64Png) {
            if (base64Png == null || base64Png.isEmpty() || base64Png.length() > MAX_IMAGE_BASE64 ||
                !base64Png.matches("[A-Za-z0-9+/=]+")) {
                runOnUiThread(() -> notifyUser("이미지 크기 또는 형식이 올바르지 않습니다."));
                return;
            }
            runOnUiThread(() -> {
                if (pendingImage != null || pendingExport != null) {
                    notifyUser("진행 중인 파일 저장을 완료해 주세요.");return;
                }
                pendingImage=base64Png;
                String safe=filename==null ? "" : filename.replaceAll("[^a-zA-Z0-9_.-]","_");
                String file=safe.endsWith(".png") && safe.length()<140 ? safe : "museum-postcard.png";
                Intent intent=new Intent(Intent.ACTION_CREATE_DOCUMENT);
                intent.addCategory(Intent.CATEGORY_OPENABLE);
                intent.setType("image/png");
                intent.putExtra(Intent.EXTRA_TITLE,file);
                try {startActivityForResult(intent,REQUEST_SAVE_IMAGE);}
                catch (ActivityNotFoundException ex) {
                    pendingImage=null;notifyUser("이 기기에서는 PNG 저장 기능을 찾지 못했습니다.");
                }
            });
        }
        @JavascriptInterface public void saveBackup(String filename, String content) {
            if (content == null || content.isEmpty() || content.length() > MAX_EXPORT_LENGTH) {
                runOnUiThread(() -> notifyUser("백업이 너무 크거나 비어 있습니다."));
                return;
            }
            runOnUiThread(() -> {
                if (pendingExport != null || pendingImage != null) {
                    notifyUser("이미 진행 중인 백업 저장을 완료해 주세요.");
                    return;
                }
                pendingExport=content;
                String safe=filename == null ? "" : filename.replaceAll("[^a-zA-Z0-9_.-]", "_");
                exportName=safe.endsWith(".json") && safe.length()<140 ? safe : "museum-backup.json";
                Intent intent=new Intent(Intent.ACTION_CREATE_DOCUMENT);
                intent.addCategory(Intent.CATEGORY_OPENABLE);
                intent.setType("application/json");
                intent.putExtra(Intent.EXTRA_TITLE,exportName);
                try {startActivityForResult(intent,REQUEST_SAVE_JSON);}
                catch (ActivityNotFoundException ex) {
                    pendingExport=null;notifyUser("이 기기에서는 문서 저장 기능을 찾지 못했습니다.");
                }
            });
        }
    }

    @Override protected void onActivityResult(int requestCode,int resultCode,Intent data) {
        super.onActivityResult(requestCode,resultCode,data);
        if (requestCode==REQUEST_OPEN_JSON) {
            if (pendingImport != null) {
                Uri selected=resultCode==RESULT_OK && data!=null ? data.getData():null;
                pendingImport.onReceiveValue(selected==null ? null : new Uri[]{selected});
                pendingImport=null;
            }
            return;
        }
        if(requestCode==REQUEST_SAVE_IMAGE) {
            final String encoded=pendingImage;
            pendingImage=null;
            if(resultCode==RESULT_OK && data!=null && data.getData()!=null && encoded!=null) {
                final Uri uri=data.getData();
                new Thread(() -> {
                    try {
                        byte[] png=Base64.decode(encoded,Base64.DEFAULT);
                        if(png.length<8 || png.length>11_000_000 ||
                            (png[0]&255)!=137 || (png[1]&255)!=80 || (png[2]&255)!=78 ||
                            (png[3]&255)!=71 || (png[4]&255)!=13 || (png[5]&255)!=10 ||
                            (png[6]&255)!=26 || (png[7]&255)!=10)throw new IllegalArgumentException("Invalid PNG");
                        try(OutputStream out=getContentResolver().openOutputStream(uri,"w")) {
                            if(out==null)throw new IllegalStateException("No output image");
                            out.write(png);out.flush();
                        }
                        runOnUiThread(() -> notifyUser("전시 카드 PNG 저장이 완료됐습니다."));
                    }catch(Exception ex) {
                        runOnUiThread(() -> notifyUser("이미지 저장 실패: 다른 위치를 선택해 주세요."));
                    }
                },"museum-png-export").start();
            }else notifyUser("이미지 저장을 취소했습니다.");
            return;
        }
        if(requestCode==REQUEST_SAVE_JSON) {
            final String snapshot=pendingExport;
            pendingExport=null;
            if(resultCode==RESULT_OK && data!=null && data.getData()!=null && snapshot!=null) {
                final Uri uri=data.getData();
                new Thread(() -> {
                    try(OutputStream out=getContentResolver().openOutputStream(uri,"w")) {
                        if(out==null)throw new IllegalStateException("No output document");
                        out.write(snapshot.getBytes(StandardCharsets.UTF_8));
                        out.flush();
                        runOnUiThread(() -> notifyUser("JSON 백업 파일 저장이 완료됐습니다."));
                    }catch(Exception e) {
                        runOnUiThread(() -> notifyUser("백업 저장에 실패했습니다. 다른 위치를 선택해 주세요."));
                    }
                },"museum-export").start();
            } else notifyUser("백업 저장을 취소했습니다.");
        }
    }

    private void notifyUser(String message) {
        Toast.makeText(this,message,Toast.LENGTH_SHORT).show();
    }

    @Override public void onBackPressed() { handleMuseumBack(); }

    private void handleMuseumBack() {
        if(browser==null){finish();return;}
        browser.evaluateJavascript("(function(){var m=document.querySelector('#modal');"+
                "if(m&&m.open){document.querySelector('#modal-close')?.click();return 'handled'}"+
                "var a=document.querySelector('[data-view=home]');"+
                "if(a&&!a.classList.contains('active')){a.click();return 'handled'}"+
                "return 'exit'})()",result -> {
            if ("\"handled\"".equals(result))return;
            if(browser.canGoBack())browser.goBack();
            else finish(); // Exit directly: avoids reinvoking the API 33+ registered back dispatcher.
        });
    }

    @Override protected void onDestroy() {
        pendingExport=null;
        pendingImage=null;
        if(pendingImport != null)pendingImport.onReceiveValue(null);
        if(browser != null){
            browser.removeJavascriptInterface("AndroidMuseum");
            if (browser.getParent() instanceof android.view.ViewGroup) {
                ((android.view.ViewGroup) browser.getParent()).removeView(browser);
            }
            browser.stopLoading();
            browser.destroy();
            browser = null;
        }
        super.onDestroy();
    }
}
