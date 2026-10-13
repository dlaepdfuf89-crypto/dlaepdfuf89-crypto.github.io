# Survive 60 Android OFFLINE store candidate (NOT RELEASED)

Android WebView runs the same self-contained verified HTML game as ONEplay, but bundled locally in 11 independently Base64-encoded assets under app/src/main/assets/chunks/.

- Works without internet. No INTERNET permission, IAP, advertising, trackers, or network calls.
- Secure synthetic WebView base URL enables localStorage; block network loads and external navigation.
- Keeps ONEstore approved app icon and separate original Toss RC54 unchanged.
- MUST complete Android device gameplay tests, game age-rating linkage, metadata, release signing, and ONEstore verification before product submission.
- NEVER put release private signing keys or passwords in repository.
- This is a free fallback if ONEplay's app-only deep link cannot be reviewed by Toss.
