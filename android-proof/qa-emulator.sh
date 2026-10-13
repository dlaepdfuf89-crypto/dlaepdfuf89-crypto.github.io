#!/usr/bin/env bash
set -euo pipefail
echo "Survive60 Android offline emulator smoke + delayed visual evidence. No live ads, payments, or publishing."
adb wait-for-device
ready=0
for attempt in $(seq 1 18); do
  if adb shell pm path android >/dev/null 2>&1; then ready=1; break; fi
  echo "Waiting for Android package manager: $attempt"
  sleep 5
done
if [ "$ready" -ne 1 ]; then echo "PACKAGE_MANAGER_NOT_READY"; exit 1; fi

installed=0
for attempt in 1 2 3; do
  if adb install --no-streaming -r /tmp/s60apk/app-debug.apk; then installed=1; break; fi
  echo "APK installation retry $attempt"
  adb reconnect || true
  sleep 8
done
if [ "$installed" -ne 1 ]; then echo "APP_INSTALL_FAILED"; exit 1; fi

# Game HTML is bundled; both wifi and cellular data must be disabled.
adb shell svc wifi disable || true
adb shell svc data disable || true
# Prevent the resource-constrained emulator's Quickstep launcher from obstructing game rendering.
adb shell am force-stop com.android.launcher3 || true
adb shell am force-stop com.google.android.apps.nexuslauncher || true
sleep 8
adb shell am start -n com.deokseol.survive60/.MainActivity
mkdir -p android-proof

# The prior 38370148128 screenshot at +22 seconds still showed "Preparing game..."
# so it does NOT prove WebView actually rendered the lobby.
sleep 22
adb shell screencap -p /sdcard/s60-initial.png
adb pull /sdcard/s60-initial.png android-proof/emu_game_initial.png

# Wait for slow software-rendered WebView startup before QA evidence.
sleep 55
adb shell screencap -p /sdcard/s60-final.png
adb pull /sdcard/s60-final.png android-proof/emu_game.png
adb shell dumpsys activity activities > android-proof/emu_activity.txt || true
timeout 25 adb shell uiautomator dump /sdcard/s60-ui.xml || true
adb pull /sdcard/s60-ui.xml android-proof/emu_window.xml || true
adb logcat -d -b crash > android-proof/emu_crash.log || true
adb logcat -d -v brief | grep -Ei 'chromium|WebView|javascript|console|ANR|Quickstep' | tail -n 250 > android-proof/emu_webview.log || true

if grep -q "Quickstep isn't responding" android-proof/emu_window.xml; then
  echo 'EMULATOR_SYSTEM_QUICKSTEP_ANR'; exit 1
fi
if grep -q 'FATAL EXCEPTION.*com.deokseol.survive60\|Process: com.deokseol.survive60' android-proof/emu_crash.log; then
  echo 'APP_CRASH_DETECTED'; exit 1
fi
if ! grep -q 'com.deokseol.survive60' android-proof/emu_activity.txt; then
  echo 'APP_NOT_IN_ACTIVITY_DUMP'; exit 1
fi
if [ ! -s android-proof/emu_game.png ]; then echo "MISSING_FINAL_SCREENSHOT"; exit 1; fi

initial=$(wc -c < android-proof/emu_game_initial.png)
final=$(wc -c < android-proof/emu_game.png)
echo "Screenshot byte sizes: initial=$initial final=$final"
if cmp -s android-proof/emu_game_initial.png android-proof/emu_game.png; then
  echo "SCREENSHOT_UNCHANGED: possible loading hang. Render QA MUST be manually checked."
  exit 1
fi
echo "OFFLINE_EMULATOR_BOOT_AND_SCREEN_CHANGE_PASS; do NOT infer 60s gameplay, live ads, IAP, real phone QA or storefront approval."
