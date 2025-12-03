# Fix: 500 Internal Server Error on Web

## Error
```
GET http://localhost:8081/ 500 (Internal Server Error)
GET http://localhost:8081/node_modules%5Cexpo-router%5C_error.bundle?platform=web... 500
```

## Root Cause

**Stripe React Native SDK doesn't support web platform.** When Metro bundler tries to bundle `@stripe/stripe-react-native` for web, it crashes with a 500 error.

## Solution Applied

I've updated `app/_layout.tsx` to conditionally load StripeProvider only on native platforms (iOS/Android), not web.

## Quick Fix

### Option 1: Use Mobile Platforms (Recommended)

**This is a mobile app - don't use web:**

```bash
cd tenant

# Stop current server (Ctrl+C)

# For iOS Simulator
npx expo start --ios

# For Android Emulator
npx expo start --android

# For Physical Device
npx expo start --clear
```

### Option 2: If You Must Test on Web

The code has been updated to skip Stripe on web. Now try:

```bash
cd tenant
npx expo start --clear --web
```

**Note**: Payment features won't work on web, but the app should load.

## What Was Changed

In `app/_layout.tsx`:
- StripeProvider now only loads on native platforms
- On web, it uses a simple wrapper component
- This prevents Metro from trying to bundle native-only code for web

## Why This Happens

1. **Stripe React Native** is a native module
2. It requires native iOS/Android code
3. Web browsers can't run native modules
4. Metro bundler crashes when trying to bundle it for web

## Best Practice

**Always test mobile apps on mobile platforms:**
- ✅ Physical device with Expo Go
- ✅ iOS Simulator (Mac)
- ✅ Android Emulator
- ❌ Web browser (limited support)

## Testing Payment

Payment features **only work on mobile**:
- Stripe payment sheet requires native code
- Camera/photo picker requires native code
- Many other features are mobile-only

## Verification

After the fix:
1. Web should load without 500 error (but features limited)
2. Mobile platforms work normally with full Stripe support
3. No more Metro bundler crashes

