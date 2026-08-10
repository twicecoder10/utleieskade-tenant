# iOS Logging Guide for Mobile App

This guide explains how to check logs for the iOS mobile app, including TestFlight builds.

## Method 1: Expo CLI Logs (Development)

### View logs in terminal:
```bash
# Start Expo with iOS
npm start
# or
npx expo start --ios
```

Logs will appear in the terminal automatically when the app runs.

### View logs from device/simulator:
```bash
# View logs from connected iOS device
npx react-native log-ios

# Or use Expo CLI
npx expo start --ios
```

## Method 2: Xcode Console (Recommended for Production Builds)

### For Simulator:
1. Open Xcode
2. Go to **Window** → **Devices and Simulators**
3. Select your simulator
4. Click **Open Console** button
5. Filter by your app bundle ID: `com.utleieskade.tenant`

### For Physical Device:
1. Connect your iPhone via USB
2. Open Xcode
3. Go to **Window** → **Devices and Simulators**
4. Select your device
5. Click **Open Console** button
6. Filter by your app bundle ID: `com.utleieskade.tenant`

## Method 3: Console.app (macOS)

1. Open **Console.app** (Applications → Utilities → Console)
2. Select your device from the left sidebar
3. Filter by your app name or bundle ID: `com.utleieskade.tenant`
4. View real-time logs

## Method 4: React Native Debugger

### Install React Native Debugger:
```bash
# Install via Homebrew (macOS)
brew install --cask react-native-debugger

# Or download from: https://github.com/jhen0409/react-native-debugger/releases
```

### Use it:
1. Open React Native Debugger
2. In your app, shake device or press `Cmd+D` (iOS Simulator)
3. Select "Debug"
4. View console logs in the debugger

## Method 5: Device Logs via Terminal (macOS)

### View device logs:
```bash
# List connected devices
xcrun simctl list devices

# View logs from specific device
xcrun simctl spawn booted log stream --predicate 'processImagePath contains "utleieskade"'

# Or for physical device (requires device UDID)
idevicesyslog -u <DEVICE_UDID>
```

## Method 6: Metro Bundler Logs

When running `npm start` or `expo start`, Metro bundler shows:
- JavaScript errors
- Network requests
- Console.log statements
- Redux actions (if configured)

## Method 7: EAS Build Logs (Production)

For production builds via EAS:

```bash
# View build logs
eas build:list

# View specific build logs
eas build:view [BUILD_ID]

# Or check on Expo dashboard
# https://expo.dev/accounts/[your-account]/projects/utleieskade-mobile/builds
```

## Method 8: TestFlight App Logs ⭐

### Option A: Device Logs via Xcode (Most Reliable)

**For Physical Device:**
1. Connect the iPhone running TestFlight app via USB
2. Open **Xcode**
3. Go to **Window** → **Devices and Simulators** (or press `Cmd+Shift+2`)
4. Select your connected device from the left sidebar
5. Click **Open Console** button (or press `Cmd+Shift+C`)
6. In the console, filter by your app:
   - Type in search: `com.utleieskade.tenant`
   - Or use predicate: `processImagePath contains "utleieskade"`
7. Open the TestFlight app on your device
8. Logs will appear in real-time

**Note:** You may need to enable "Developer Mode" on the device:
- Settings → Privacy & Security → Developer Mode → Enable

### Option B: Console.app (macOS)

1. Open **Console.app** (Applications → Utilities → Console)
2. Select your connected device from the left sidebar
3. In the search box, type: `com.utleieskade.tenant`
4. Open the TestFlight app on your device
5. View logs in real-time

### Option C: Terminal Command (macOS)

```bash
# View device logs via terminal
idevicesyslog -u <DEVICE_UDID>

# To get device UDID:
idevice_id -l

# Or filter by app name
idevicesyslog | grep "utleieskade"
```

**Note:** Requires `libimobiledevice`:
```bash
brew install libimobiledevice
```

### Option D: TestFlight Crash Reports (App Store Connect)

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Navigate to **My Apps** → Select your app
3. Go to **TestFlight** tab
4. Click on **Crashes** section
5. View crash reports and logs from TestFlight users

**Limitations:**
- Only shows crashes, not regular logs
- Requires users to opt-in to share crash data
- May take time to appear

### Option E: Remote Logging Service (Recommended for TestFlight)

Since TestFlight apps are production builds, implement a remote logging service:

#### Using Sentry (Recommended):

1. **Install Sentry:**
```bash
cd tenant
npm install @sentry/react-native
```

2. **Configure in your app:**
```typescript
// app/_layout.tsx or similar entry point
import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: __DEV__ ? "development" : "production",
  enableInExpoDevelopment: false,
  debug: false,
});

// Log errors
Sentry.captureException(error);

// Log messages
Sentry.captureMessage("Important event", "info");
```

3. **View logs:**
- Go to [sentry.io](https://sentry.io)
- View real-time logs, errors, and performance data

#### Using LogRocket:

```bash
npm install logrocket logrocket-react-native
```

#### Using Firebase Crashlytics:

```bash
npm install @react-native-firebase/app @react-native-firebase/crashlytics
```

### Option F: Custom Logging Endpoint

Create your own logging endpoint:

```typescript
// utils/logger.ts
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const logToServer = async (level: string, message: string, data?: any) => {
  try {
    await fetch(`${API_URL}/logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        level,
        message,
        data,
        timestamp: new Date().toISOString(),
        platform: 'ios',
        version: '1.0.0',
      }),
    });
  } catch (error) {
    console.error('Failed to log to server:', error);
  }
};

// Usage
logToServer('error', 'Payment failed', { paymentId: '123' });
```

## Method 9: Add Logging in Code

### Console Logging:
```typescript
// Basic logging
console.log('Debug message', data);
console.error('Error message', error);
console.warn('Warning message');

// React Native specific
import { Platform } from 'react-native';
console.log('Platform:', Platform.OS);
```

### Remote Logging (Recommended for Production):
Consider using a service like:
- Sentry (error tracking)
- LogRocket (session replay)
- Firebase Crashlytics
- Bugsnag

## Quick Commands Reference

```bash
# Start Expo with iOS and view logs
cd tenant
npm start

# View iOS simulator logs
npx react-native log-ios

# View device logs (requires Xcode)
# Open Xcode → Window → Devices and Simulators → Open Console

# View Metro bundler logs
# Already visible when running `npm start`

# View TestFlight device logs (requires libimobiledevice)
idevicesyslog | grep "utleieskade"
```

## Filtering Logs

### In Xcode Console:
- Filter by text: Type in search box
- Filter by process: `processImagePath contains "utleieskade"`
- Filter by level: Use log level dropdown

### In Terminal:
```bash
# Filter logs by keyword
npx react-native log-ios | grep "ERROR"

# Filter by app name
npx react-native log-ios | grep "utleieskade"
```

## Troubleshooting

### If logs don't appear:
1. Ensure device/simulator is connected
2. Check that app is running
3. Verify bundle ID matches: `com.utleieskade.tenant`
4. Try restarting Metro bundler: `npm start -- --reset-cache`

### For Production Builds:
- Use Xcode Console or Console.app
- Check EAS build logs
- Implement remote logging service

## Best Practices

1. **Development**: Use `console.log()` and view in Metro bundler
2. **Testing**: Use React Native Debugger for detailed debugging
3. **TestFlight/Production**: 
   - **Must use remote logging service** (Sentry, LogRocket, etc.)
   - Use Xcode Console for device logs when device is connected
   - Check App Store Connect for crash reports
4. **Critical Errors**: Always log to both console and remote service
5. **TestFlight Specific**: 
   - Implement remote logging before TestFlight release
   - Test logging in TestFlight builds
   - Monitor crash reports in App Store Connect

## TestFlight Logging Checklist

Before releasing to TestFlight:
- [ ] Set up remote logging service (Sentry/LogRocket/Firebase)
- [ ] Test logging in TestFlight build
- [ ] Configure error boundaries
- [ ] Set up crash reporting
- [ ] Test device log access via Xcode
- [ ] Document how to access logs for your team

## TestFlight-Specific Tips

1. **Enable Developer Mode on Device:**
   - Settings → Privacy & Security → Developer Mode → Enable
   - Device will restart

2. **Trust Computer:**
   - When connecting device, tap "Trust This Computer"

3. **View Logs in Real-Time:**
   - Keep Xcode Console open while using TestFlight app
   - Logs appear as you interact with the app

4. **Filter Logs:**
   - Use search: `com.utleieskade.tenant`
   - Use level filter: Error, Warning, Info, Debug

5. **Export Logs:**
   - In Xcode Console: File → Export Logs
   - Save for later analysis

