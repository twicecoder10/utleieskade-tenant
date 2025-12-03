# Fix: Web MIME Type Error

## Error
```
Refused to execute script from 'http://localhost:8081/node_modules%5Cexpo-router%5C_error.bundle?platform=web&dev=true&hot=false&transform.engine=hermes&transform.routerRoot=app&unstable_transformProfile=hermes-stable' because its MIME type ('application/json') is not executable
```

## Quick Fix

### Option 1: Clear Cache and Restart (Recommended)

```bash
cd tenant

# Stop the current server (Ctrl+C)

# Clear all caches
npx expo start --clear --web
```

### Option 2: Use Mobile Platforms Instead

This is a **mobile app** - web support is limited. Use:

```bash
# For iOS Simulator
npx expo start --ios

# For Android Emulator  
npx expo start --android

# For Physical Device (scan QR code)
npx expo start
```

### Option 3: Fix Metro Config

Update `metro.config.js`:

```javascript
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Add web support
config.resolver.sourceExts.push("web.js", "web.jsx", "web.ts", "web.tsx");

module.exports = withNativeWind(config, { input: "./global.css" });
```

## Why This Happens

1. **Web is not the primary platform** - This is a React Native mobile app
2. **Metro bundler cache** - Stale cache causing MIME type issues
3. **Expo Router error handling** - Error bundles sometimes return JSON instead of JS

## Recommended Solution

**Don't use web for this mobile app.** Instead:

1. **Use Expo Go on your phone:**
   ```bash
   npx expo start
   # Scan QR code with Expo Go app
   ```

2. **Use iOS Simulator (Mac only):**
   ```bash
   npx expo start --ios
   ```

3. **Use Android Emulator:**
   ```bash
   npx expo start --android
   ```

## If You Must Use Web

1. Clear cache:
   ```bash
   npx expo start --clear --web
   ```

2. Check browser console for actual errors

3. Some features won't work on web:
   - Stripe payment (mobile only)
   - Camera/photo picker
   - Native modules

## Best Practice

For a mobile app like this, **always test on mobile devices or simulators**, not web browsers.

