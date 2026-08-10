# iOS Build and Deploy Guide

## Quick Start

### Step 1: Navigate to Tenant Directory
```bash
cd tenant
```

### Step 2: Ensure You're Logged In
```bash
eas login
```

### Step 3: Build for iOS Production
```bash
eas build --platform ios --profile production
```

### Step 4: Submit to App Store Connect
```bash
eas submit --platform ios
```

---

## Detailed Steps

### Prerequisites

1. **EAS CLI Installed**
   ```bash
   npm install -g eas-cli
   ```

2. **Expo Account**
   - Sign up at https://expo.dev if you don't have one
   - Login: `eas login`

3. **Apple Developer Account**
   - Required for App Store submission
   - $99/year subscription
   - Configure credentials in EAS

### Build Configuration

Your `eas.json` is already configured with:
- **Production profile**: Auto-increments build numbers
- **Submit profile**: Ready for App Store submission

### Build Process

1. **Start the Build**
   ```bash
   cd tenant
   eas build --platform ios --profile production
   ```

2. **Monitor Build Progress**
   - EAS will provide a build URL
   - Monitor at: https://expo.dev/accounts/twice_coder/projects/utleieskade-mobile/builds
   - Build typically takes 15-30 minutes

3. **Build Options**
   - The build will ask if you want to submit automatically
   - You can choose to submit later with `eas submit`

### Submission Process

1. **Submit to App Store Connect**
   ```bash
   eas submit --platform ios
   ```

2. **Credentials**
   - EAS will handle credentials automatically
   - Or use existing App Store Connect API key
   - Or provide Apple ID credentials

3. **App Store Connect**
   - App ID: `6756213906`
   - Bundle ID: `com.utleieskade.tenant`
   - Check status: https://appstoreconnect.apple.com/apps/6756213906

### After Submission

1. **Apple Processing** (5-10 minutes)
   - Apple processes the binary
   - You'll receive an email when complete
   - Check: https://appstoreconnect.apple.com/apps/6756213906/testflight/ios

2. **TestFlight**
   - Build appears in TestFlight after processing
   - Invite internal testers immediately
   - External testers require beta review (24-48 hours)

3. **App Store Review**
   - Complete app listing information
   - Submit for review
   - Review typically takes 24-48 hours

---

## Important Information

### Current Configuration
- **Bundle ID**: `com.utleieskade.tenant`
- **App Name**: `utleieskade-mobile`
- **Version**: `1.0.0` (update in `app.json` if needed)
- **Project ID**: `d0056630-f09d-40b5-8715-856f85d523e8`

### App Store Connect Links
- **Dashboard**: https://appstoreconnect.apple.com/apps/6756213906
- **TestFlight**: https://appstoreconnect.apple.com/apps/6756213906/testflight/ios

### Build Profiles

**Production** (for App Store):
```json
{
  "production": {
    "autoIncrement": true
  }
}
```

**Preview** (for internal testing):
```json
{
  "preview": {
    "distribution": "internal"
  }
}
```

---

## Updating App Version

Before building a new version, update `app.json`:

```json
{
  "expo": {
    "version": "1.0.1",  // Increment version
    ...
  }
}
```

Build numbers are auto-incremented by EAS.

---

## Troubleshooting

### Build Fails
1. Check build logs at expo.dev
2. Verify all dependencies in `package.json`
3. Check for native module issues
4. Ensure Apple Developer account is active

### Submission Fails
1. Verify Apple Developer account credentials
2. Check App Store Connect API key (if using)
3. Ensure bundle ID matches App Store Connect
4. Check for missing app information

### Build Not Appearing in TestFlight
- Wait 5-10 minutes for Apple processing
- Check email for processing status
- Verify submission was successful

---

## Commands Summary

```bash
# Login
eas login

# Build iOS
cd tenant
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios

# Check builds
# Visit: https://expo.dev/accounts/twice_coder/projects/utleieskade-mobile/builds

# Check App Store Connect
# Visit: https://appstoreconnect.apple.com/apps/6756213906
```

---

## Next Steps After Deployment

1. ✅ Build completes successfully
2. ✅ Submit to App Store Connect
3. ⏳ Wait for Apple processing (5-10 min)
4. ⏳ Build appears in TestFlight
5. ⏳ Complete App Store listing
6. ⏳ Submit for App Review
7. ⏳ Wait for review (24-48 hours)
8. ✅ App goes live!

---

**Last Updated**: Based on current project configuration
**Status**: Ready to build and deploy


