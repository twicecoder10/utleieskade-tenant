# Tenant App Production Deployment Guide

This guide covers deploying the Utleieskade Tenant mobile app to production.

## Prerequisites

1. **Expo Account**: Sign up at https://expo.dev
2. **EAS CLI**: Install globally
   ```bash
   npm install -g eas-cli
   ```
3. **Expo Account Login**:
   ```bash
   eas login
   ```

## Production API Configuration

The tenant app is now configured to use the production API:
- **Production API URL**: `https://utleieskade-api2-production-2915.up.railway.app`

The app will automatically use this URL unless you override it with `EXPO_PUBLIC_API_URL` environment variable.

## Deployment Options

### Option 1: EAS Build (Recommended for Production)

EAS Build creates native builds that can be distributed via app stores or direct download.

#### Step 1: Configure EAS

```bash
cd tenant
eas build:configure
```

This will create/update `eas.json` (already exists in this project).

#### Step 2: Build for Production

**For Android:**
```bash
eas build --platform android --profile production
```

**For iOS:**
```bash
eas build --platform ios --profile production
```

**For Both Platforms:**
```bash
eas build --platform all --profile production
```

#### Step 3: Monitor Build Progress

EAS will provide a build URL. You can monitor progress at:
- https://expo.dev/accounts/[your-account]/builds

#### Step 4: Download Builds

Once complete, download the builds:
- **Android**: `.apk` or `.aab` file
- **iOS**: `.ipa` file (requires Apple Developer account)

### Option 2: Expo Go (For Testing/Development)

Expo Go allows quick testing without building native apps.

#### Step 1: Start Development Server

```bash
cd tenant
npx expo start
```

#### Step 2: Share Development Build

1. Press `s` to share
2. Scan QR code with Expo Go app (iOS/Android)
3. Or share the link: `exp://[your-ip]:8081`

**Note**: Expo Go has limitations and may not support all native features.

### Option 3: Internal Distribution (Preview Builds)

For internal testing before app store release:

```bash
eas build --platform android --profile preview
eas build --platform ios --profile preview
```

## Sharing the App

### Method 1: Direct Download Links (Android)

After building with EAS:

1. Go to https://expo.dev/accounts/[your-account]/builds
2. Find your production build
3. Click "Download" to get the `.apk` file
4. Share the `.apk` file directly or upload to:
   - Google Drive
   - Dropbox
   - Your own server
   - Firebase App Distribution

**Share Link Format:**
```
Download the Utleieskade Tenant App:
[Your download link]

Install on Android:
1. Download the .apk file
2. Enable "Install from unknown sources" in Android settings
3. Open the downloaded .apk file
4. Follow installation prompts
```

### Method 2: App Store Distribution (iOS)

For iOS, you need to submit to the App Store:

```bash
eas submit --platform ios
```

**Requirements:**
- Apple Developer account ($99/year)
- App Store Connect setup
- App review process (1-7 days)

### Method 3: TestFlight (iOS Internal Testing)

For iOS internal testing:

```bash
eas build --platform ios --profile production
eas submit --platform ios
```

Then invite testers via TestFlight.

### Method 4: Google Play Store (Android)

For Android public distribution:

```bash
eas build --platform android --profile production
eas submit --platform android
```

**Requirements:**
- Google Play Developer account ($25 one-time)
- Play Console setup
- App review process (1-3 days)

## Environment Variables

If you need to override the API URL for different environments:

### Development
```bash
EXPO_PUBLIC_API_URL=http://localhost:3000 npx expo start
```

### Staging
```bash
EXPO_PUBLIC_API_URL=https://staging-api.example.com eas build --profile preview
```

### Production
```bash
# Uses default: https://utleieskade-api2-production-2915.up.railway.app
eas build --profile production
```

## Production Build Checklist

Before building for production:

- [x] API URL updated to production endpoint
- [ ] App version updated in `app.json`
- [ ] App icon and splash screen configured
- [ ] App name and description updated
- [ ] Privacy policy and terms of service links (if required)
- [ ] Test the app thoroughly with production API
- [ ] Verify all features work correctly
- [ ] Check app store guidelines compliance

## Updating App Version

Edit `tenant/app.json`:

```json
{
  "expo": {
    "version": "1.0.1",  // Update version number
    ...
  }
}
```

EAS will auto-increment build numbers if `autoIncrement: true` is set in `eas.json`.

## Monitoring and Updates

### Over-the-Air (OTA) Updates

For JavaScript-only updates (no native changes):

```bash
eas update --branch production --message "Bug fixes and improvements"
```

Users will receive updates automatically without reinstalling.

### Viewing Builds

Check all builds at:
- https://expo.dev/accounts/[your-account]/builds

### Viewing Updates

Check OTA updates at:
- https://expo.dev/accounts/[your-account]/updates

## Troubleshooting

### Build Fails

1. Check EAS build logs at expo.dev
2. Verify all dependencies are in `package.json`
3. Check for native module compatibility issues
4. Ensure `eas.json` is properly configured

### App Can't Connect to API

1. Verify API is running: `https://utleieskade-api2-production-2915.up.railway.app`
2. Check CORS configuration (mobile apps don't have origin, should work)
3. Verify network permissions in app manifest
4. Test API endpoint with curl/Postman

### Installation Issues (Android)

1. Ensure "Install from unknown sources" is enabled
2. Check Android version compatibility
3. Verify APK signature

## Quick Start Commands

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure project
cd tenant
eas build:configure

# Build for production
eas build --platform all --profile production

# Submit to app stores (after build completes)
eas submit --platform ios
eas submit --platform android
```

## Support Links

- **Expo Documentation**: https://docs.expo.dev
- **EAS Build Docs**: https://docs.expo.dev/build/introduction/
- **EAS Submit Docs**: https://docs.expo.dev/submit/introduction/
- **Expo Discord**: https://chat.expo.dev

## Production API Information

- **API URL**: `https://utleieskade-api2-production-2915.up.railway.app`
- **API Documentation**: `https://utleieskade-api2-production-2915.up.railway.app/api-docs`
- **Health Check**: `https://utleieskade-api2-production-2915.up.railway.app/`

