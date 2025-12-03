# ⚠️ CRITICAL: Restart Metro Bundler Now!

## Problem
The app is still using `localhost:3000` instead of your IP address because Metro bundler hasn't reloaded the `.env` file.

## Solution: Restart Metro with Clear Cache

**You MUST restart Metro bundler for the `.env` changes to take effect!**

### Steps:

1. **Stop the current Metro bundler** (if running):
   - Press `Ctrl+C` in the terminal where Metro is running

2. **Start Metro with clear cache**:
   ```bash
   cd tenant
   npx expo start --clear
   ```

3. **Wait for Metro to finish bundling** (you'll see a QR code)

4. **Reload the app on your phone**:
   - Shake your phone
   - Tap "Reload" in Expo Go
   - Or scan the QR code again

## Why This Is Needed

- `.env` files are read when Metro starts
- Environment variables are bundled into the app at build time
- Changing `.env` requires a restart with `--clear` to clear the cache

## Verification

After restarting, check the Metro logs. You should see:
```
🌐 API URL: http://192.168.0.227:3000
```

If you still see `localhost`, the `.env` file might not be loaded correctly.

## Current Configuration

- **`.env` file**: ✅ Updated to `http://192.168.0.227:3000`
- **Metro bundler**: ⚠️ Needs restart with `--clear`
- **App cache**: ⚠️ Needs clearing

## Quick Command

```bash
cd C:\Users\Cosonas\Documents\110011\Utleieskade\tenant
npx expo start --clear
```

**Then reload the app on your phone!**

