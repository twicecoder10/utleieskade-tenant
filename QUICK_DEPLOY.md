# Quick Deployment Guide - Tenant App

## 🚀 Quick Start: Deploy to Production

### Step 1: Install EAS CLI (if not already installed)
```bash
npm install -g eas-cli
```

### Step 2: Login to Expo
```bash
eas login
```

### Step 3: Navigate to Tenant Directory
```bash
cd tenant
```

### Step 4: Build for Production

**Build for Android:**
```bash
eas build --platform android --profile production
```

**Build for iOS:**
```bash
eas build --platform ios --profile production
```

**Build for Both:**
```bash
eas build --platform all --profile production
```

### Step 5: Share the App

After the build completes, you'll get:

1. **Build URL**: View at https://expo.dev/accounts/[your-account]/builds
2. **Download Links**: 
   - Android: Direct `.apk` download link
   - iOS: `.ipa` file (requires TestFlight or App Store)

## 📱 Sharing Options

### Option A: Direct Download (Android - Easiest)

1. After build completes, download the `.apk` file
2. Upload to:
   - Google Drive
   - Dropbox  
   - Your website
   - Firebase App Distribution
3. Share the download link

**Example Share Message:**
```
Download the Utleieskade Tenant App:

[Your download link here]

Install Instructions:
1. Download the .apk file
2. On Android: Settings → Security → Enable "Install from unknown sources"
3. Open the downloaded file
4. Follow installation prompts
```

### Option B: App Stores (Recommended for Public)

**Google Play Store:**
```bash
eas submit --platform android
```

**Apple App Store:**
```bash
eas submit --platform ios
```

### Option C: TestFlight (iOS Internal Testing)
```bash
eas build --platform ios --profile production
eas submit --platform ios
```
Then invite testers via TestFlight.

## 🔗 Production Links

- **API URL**: `https://utleieskade-api2-production-2915.up.railway.app`
- **API Docs**: `https://utleieskade-api2-production-2915.up.railway.app/api-docs`
- **Build Dashboard**: `https://expo.dev/accounts/[your-account]/builds`

## ⚡ Quick Commands Reference

```bash
# Build Android
eas build --platform android --profile production

# Build iOS  
eas build --platform ios --profile production

# Build Both
eas build --platform all --profile production

# Submit to App Stores
eas submit --platform android
eas submit --platform ios

# View builds
# Visit: https://expo.dev/accounts/[your-account]/builds
```

## ✅ Pre-Deployment Checklist

- [x] API URL set to production: `https://utleieskade-api2-production-2915.up.railway.app`
- [ ] Test app with production API
- [ ] Update app version in `app.json` if needed
- [ ] Verify app icon and splash screen
- [ ] Test all features

## 📝 Notes

- The app is already configured to use the production API
- Mobile apps don't have CORS restrictions (API allows no-origin requests)
- First build may take 10-20 minutes
- Subsequent builds are faster (5-10 minutes)

