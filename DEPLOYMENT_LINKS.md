# Tenant Mobile App - Deployment Links

## 📱 Current Builds (Latest)

### Android
- **APK (Direct Install)**: https://expo.dev/artifacts/eas/6Q69ciNrUxjSNXNPk2mxwF.apk
- **AAB (Google Play)**: https://expo.dev/artifacts/eas/bCL9wbXXp5HG36jFpNiKgY.aab

### iOS
- **IPA (App Store/TestFlight)**: https://expo.dev/artifacts/eas/dG3c2npnmLTXTQiFQCdeeF.ipa

## 🔗 Build Dashboard
View all builds: https://expo.dev/accounts/twice_coder/projects/utleieskade-mobile/builds

## 📥 Deployment Options

### Option 1: Direct Android Distribution (APK)
**Best for:** Quick distribution, testing, internal use

1. **Download the APK**: https://expo.dev/artifacts/eas/6Q69ciNrUxjSNXNPk2mxwF.apk
2. **Share the link** or upload to:
   - Google Drive
   - Dropbox
   - Your website
   - Firebase App Distribution

**Installation Instructions for Users:**
```
1. Download the APK file
2. On Android: Settings → Security → Enable "Install from unknown sources"
3. Open the downloaded APK file
4. Follow installation prompts
```

### Option 2: Google Play Store
**Best for:** Public distribution, official app store presence

**Requirements:**
- Google Play Developer account ($25 one-time fee)
- Play Console setup

**Deploy Command:**
```bash
eas submit --platform android
```

### Option 3: Apple App Store / TestFlight
**Best for:** iOS distribution, official app store presence

**Requirements:**
- Apple Developer account ($99/year)
- App Store Connect setup

**Deploy Command:**
```bash
eas submit --platform ios
```

**For TestFlight (Internal Testing):**
1. Submit using the command above
2. Invite testers via TestFlight app
3. Testers can install via TestFlight link

## 🚀 Quick Deploy Commands

```bash
# Submit Android to Google Play
eas submit --platform android

# Submit iOS to App Store/TestFlight
eas submit --platform ios

# View build status
eas build:list --platform all --limit 5
```

## 📋 App Information

- **App Name**: utleieskade-mobile
- **Version**: 1.0.0
- **Package (Android)**: com.twice_coder.utleieskademobile
- **Bundle ID (iOS)**: com.utleieskade.tenant
- **API URL**: https://utleieskade-api2-production-2915.up.railway.app

## ✅ Next Steps

1. **For Direct Distribution (Android APK):**
   - Download the APK from the link above
   - Share with users or upload to your preferred hosting

2. **For App Store Distribution:**
   - Run `eas submit --platform android` for Google Play
   - Run `eas submit --platform ios` for App Store
   - Follow the prompts to complete submission

3. **For Updates:**
   - JavaScript-only updates: `eas update --branch production`
   - Native updates: Rebuild with `eas build --platform all --profile production`

## 📞 Support

- **Expo Dashboard**: https://expo.dev/accounts/twice_coder/projects/utleieskade-mobile
- **Build Logs**: Available in the build dashboard
- **EAS Documentation**: https://docs.expo.dev/build/introduction/


