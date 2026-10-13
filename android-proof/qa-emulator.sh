#!/usr/bin/env bash
set -euo pipefail
echo "Survive60 Android offline emulator smoke, no real ads or purchases"
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
  if adb install --no-streaming -r /tmp/s60apk/app-debug.apk; then
    installed=1
    break
  fi
  echo "APK installation retry $attempt"
  adb reconnect || true
  sleep 8
done
if [ "$installed" -ne 1 ]; then echo "APP_INSTALL_FAILED"; exit 1; fi

# Fully offline gameplay test. The game bundle is local and not an external URL.
adb shell svc wifi disable || true
adb shell svc data disable || true
adb shell am start -n com.deokseol.survive60/.MainActivity
sleep 22

mkdir -p android-proof
adb shell screencap -p /sdcard/s60-game.png
adb pull /sdcard/s60-game.png android-proof/emu_game.png
adb shell dumpsys activity activities > android-proof/emu_activity.txt || true
timeout 25 adb shell uiautomator dump /sdcard/s60-ui.xml || true
adb pull /sdcard/s60-ui.xml android-proof/emu_window.xml || true
adb logcat -d -b crash > android-proof/emu_crash.log || true

if grep -q 'FATAL EXCEPTION.*com.deokseol.survive60\|Process: com.deokseol.survive60' android-proof/emu_crash.log; then
  echo 'APP_CRASH_DETECTED'
  exit 1
fi
if ! grep -q 'com.deokseol.survive60' android-proof/emu_activity.txt; then
  echo 'APP_NOT_IN_ACTIVITY_DUMP'
  exit 1
fi
echo 'OFFLINE_EMULATOR_SMOKE_PASS'
