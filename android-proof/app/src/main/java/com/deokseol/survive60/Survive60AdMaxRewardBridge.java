package com.deokseol.survive60;

import android.app.Activity;
import android.content.Context;
import com.oneadmax.global.ONEAdMax;
import com.oneadmax.global.OAMRewardVideo;
import com.oneadmax.global.OAMError;
import com.oneadmax.global.listener.IOAMInitListener;
import com.oneadmax.global.listener.IOAMRewardVideoEventListener;
import java.util.Set;
import java.util.HashSet;

/**
 * Internal Android ONE AdMax rewarded adapter (STAGING ONLY, not deployed).
 * Preconditions: approved real publisher/media key, rewarded placement ID,
 * store compliance, privacy/consent and WebView reward entitlement QA.
 *
 * The Java reward completion callback is NOT payment proof by itself.
 * The game may only grant ONE requested benefit for an actual completed ad.
 */
final class Survive60AdMaxRewardBridge implements IOAMRewardVideoEventListener {
    interface RewardSink { void onRewardCompleted(String rewardSlot); }

    private static final String UNCONFIGURED = "UNCONFIGURED";
    private static final Set<String> ALLOWED_SLOTS = new HashSet<>();
    static {
        ALLOWED_SLOTS.add("attackBoost");
        ALLOWED_SLOTS.add("defenseShield");
        ALLOWED_SLOTS.add("dailyChest");
        ALLOWED_SLOTS.add("revive");
        ALLOWED_SLOTS.add("transcend");
        ALLOWED_SLOTS.add("resultBonus");
    }

    private final Activity activity;
    private final RewardSink sink;
    private OAMRewardVideo video;
    private String activeSlot;
    private boolean completed;
    private boolean awaiting;
    private boolean destroyed;

    Survive60AdMaxRewardBridge(Activity activity, RewardSink sink) {
        this.activity = activity;
        this.sink = sink;
    }

    boolean hasApprovedConfiguration() {
        final String key = activity.getString(R.string.oneadmax_app_key);
        final String placement = activity.getString(R.string.oneadmax_reward_placement);
        return !key.isBlank() && !placement.isBlank()
            && !UNCONFIGURED.equals(key) && !UNCONFIGURED.equals(placement);
    }

    void initializeIfConfigured() {
        if (!hasApprovedConfiguration()) return; // no fake ads or network requests
        if (!ONEAdMax.isInit(activity)) {
            ONEAdMax.init(activity, new IOAMInitListener() {
                @Override public void onInitialized() {
                    if (!destroyed) setupRewarded();
                }
            });
        } else setupRewarded();
    }

    private void setupRewarded() {
        if (destroyed || video != null) return;
        video = new OAMRewardVideo(activity);
        video.setPlacementId(activity.getString(R.string.oneadmax_reward_placement));
        video.setEventListener(this);
        video.setNetworkScheduleTimeout(10);
        video.load(); // one initial load, no aggressive retry loop
    }

    boolean isReady() {
        return !destroyed && !awaiting && video != null && video.isLoaded();
    }

    boolean request(String slot) {
        if (!ALLOWED_SLOTS.contains(slot) || !isReady()) return false;
        // This method must be invoked only after a user's explicit CTA.
        awaiting = true;
        completed = false;
        activeSlot = slot;
        video.setCurrentActivity(activity);
        video.show();
        return true;
    }

    @Override public void onLoaded() {}
    @Override public void onLoadFailed(OAMError error) {}
    @Override public void onOpened() {}
    @Override public void onOpenFailed(OAMError error) {
        awaiting = false;
        activeSlot = null;
    }

    @Override public void onCompleted(int adNetworkNo, boolean adCompleted) {
        if (!adCompleted || completed || !awaiting || activeSlot == null) return;
        completed = true; // settles before calling game; prevents duplicate completions
        sink.onRewardCompleted(activeSlot);
    }

    @Override public void onClosed() {
        awaiting = false;
        activeSlot = null;
        completed = false;
        if (video != null && !destroyed) video.load(); // at most once per displayed ad
    }

    @Override public void onClicked() {}

    void onPause() { if (video != null) video.onPause(); }
    void onResume() { if (video != null) video.onResume(); }

    void destroy() {
        destroyed = true;
        if (video != null) { video.destroy(); video = null; }
        ONEAdMax.unInit();
    }
}
