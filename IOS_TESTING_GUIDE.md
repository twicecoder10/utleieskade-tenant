# iOS Testing Guide - Utleieskade Tenant App

This guide covers all methods to test your iOS app.

## 🚀 Quick Testing Options

### Option 1: iOS Simulator (Mac Only - Fastest)

If you have a Mac with Xcode installed:

```bash
cd tenant
npx expo start
```

Then press `i` to open in iOS Simulator, or:

```bash
npx expo run:ios
```

**Requirements:**
- macOS
- Xcode installed
- iOS Simulator available

**Pros:**
- Fastest method
- No physical device needed
- Easy debugging

**Cons:**
- Mac only
- Some features may behave differently than real device

---

### Option 2: Expo Go (Quick Testing - Recommended for Development)

**Step 1: Install Expo Go on your iPhone**
- Download "Expo Go" from the App Store
- Free app: https://apps.apple.com/app/expo-go/id982107779

**Step 2: Start the development server**
```bash
cd tenant
npx expo start
```

**Step 3: Connect your iPhone**
- Make sure your iPhone and computer are on the same WiFi network
- Scan the QR code with:
  - **iOS Camera app** (iOS 11+)
  - Or open Expo Go app and scan the QR code

**Pros:**
- No build needed
- Instant updates
- Works on any iPhone

**Cons:**
- Limited to Expo Go's capabilities
- Some native modules may not work

---

### Option 3: Development Build (Full Native Features)

For testing with all native features:

**Step 1: Build development version**
```bash
cd tenant
eas build --platform ios --profile development
```

**Step 2: Install on device**
- Download the `.ipa` file from the build dashboard
- Install via:
  - **TestFlight** (recommended)
  - **Xcode** (drag and drop to device)
  - **Apple Configurator 2**

**Step 3: Start development server**
```bash
npx expo start --dev-client
```

**Pros:**
- Full native features
- Custom native code support
- Production-like experience

**Cons:**
- Requires build time (15-20 minutes)
- More setup required

---

### Option 4: Preview Build (Internal Testing)

For internal testing before production:

**Step 1: Build preview version**
```bash
cd tenant
eas build --platform ios --profile preview
```

**Step 2: Distribute via TestFlight**
```bash
eas submit --platform ios
```

**Step 3: Invite testers**
- Go to App Store Connect
- Add testers to TestFlight
- They'll receive an email invitation

**Pros:**
- Production-like build
- Easy distribution
- Up to 10,000 testers

**Cons:**
- Requires Apple Developer account
- Build and review time

---

### Option 5: Production Build + TestFlight

For final testing before App Store release:

**Step 1: Build production version**
```bash
cd tenant
eas build --platform ios --profile production
```

**Step 2: Submit to TestFlight**
```bash
eas submit --platform ios
```

**Step 3: Test via TestFlight**
- Install TestFlight app on iPhone
- Accept invitation
- Install your app

**Pros:**
- Exact production build
- Real-world testing
- Beta testing with users

**Cons:**
- Longest process
- Requires App Store Connect setup

---

## 📱 Step-by-Step: Testing with Expo Go (Easiest)

### 1. Install Expo Go
- Open App Store on iPhone
- Search "Expo Go"
- Install the app

### 2. Start Development Server
```bash
cd tenant
npx expo start
```

### 3. Connect Your iPhone
- Ensure iPhone and computer are on same WiFi
- Open Camera app on iPhone
- Point at the QR code in terminal
- Tap the notification to open in Expo Go

### 4. Test the App
- App will load in Expo Go
- Changes auto-reload
- Shake device for developer menu

---

## 🖥️ Step-by-Step: Testing with iOS Simulator (Mac)

### 1. Install Xcode
- Download from Mac App Store
- Install Xcode Command Line Tools:
```bash
xcode-select --install
```

### 2. Start Simulator
```bash
cd tenant
npx expo start
```

### 3. Open Simulator
- Press `i` in the terminal, or
- Run: `npx expo run:ios`

### 4. Select Simulator
- Choose device (iPhone 15, iPhone 14, etc.)
- Simulator will launch automatically

---

## 🧪 Step-by-Step: Testing with TestFlight

### 1. Build for TestFlight
```bash
cd tenant
eas build --platform ios --profile production
```

### 2. Wait for Build (15-20 minutes)
- Monitor at: https://expo.dev/accounts/twice_coder/projects/utleieskade-mobile/builds

### 3. Submit to TestFlight
```bash
eas submit --platform ios
```

### 4. Set Up TestFlight
- Go to: https://appstoreconnect.apple.com
- Navigate to your app
- Go to TestFlight tab
- Add internal/external testers

### 5. Install on iPhone
- Install TestFlight app from App Store
- Accept tester invitation
- Install your app from TestFlight

---

## 🔧 Troubleshooting

### Issue: Can't connect to development server

**Solution:**
1. Ensure iPhone and computer are on same WiFi
2. Check firewall settings
3. Try using tunnel mode:
```bash
npx expo start --tunnel
```

### Issue: Expo Go doesn't support a feature

**Solution:**
- Use development build instead:
```bash
eas build --platform ios --profile development
```

### Issue: Simulator not opening

**Solution:**
1. Install Xcode completely
2. Open Xcode once to accept license
3. Run: `sudo xcode-select --switch /Applications/Xcode.app`

### Issue: Build fails

**Solution:**
1. Check build logs at expo.dev
2. Verify Apple Developer account is active
3. Check bundle identifier is available

---

## 📊 Comparison Table

| Method | Speed | Native Features | Setup Time | Best For |
|--------|-------|-----------------|------------|----------|
| iOS Simulator | ⚡⚡⚡ | ✅ Full | 5 min | Development |
| Expo Go | ⚡⚡⚡ | ⚠️ Limited | 2 min | Quick testing |
| Dev Build | ⚡⚡ | ✅ Full | 20 min | Full features |
| Preview Build | ⚡ | ✅ Full | 20 min | Internal testing |
| Production + TestFlight | ⚡ | ✅ Full | 30 min | Final testing |

---

## 🎯 Recommended Testing Flow

1. **Development**: Use iOS Simulator or Expo Go
2. **Feature Testing**: Use development build
3. **Internal Testing**: Use preview build + TestFlight
4. **Beta Testing**: Use production build + TestFlight
5. **Release**: Submit to App Store

---

## 🔗 Useful Links

- **Expo Dashboard**: https://expo.dev/accounts/twice_coder/projects/utleieskade-mobile
- **Build Dashboard**: https://expo.dev/accounts/twice_coder/projects/utleieskade-mobile/builds
- **App Store Connect**: https://appstoreconnect.apple.com
- **TestFlight**: https://developer.apple.com/testflight/

---

## ✅ Quick Commands Reference

```bash
# Start development server
npx expo start

# Open in iOS Simulator
npx expo run:ios

# Build development version
eas build --platform ios --profile development

# Build preview version
eas build --platform ios --profile preview

# Build production version
eas build --platform ios --profile production

# Submit to TestFlight
eas submit --platform ios

# Check build status
eas build:list --platform ios --limit 1
```

---

## 📝 Notes

- **Production API**: The app is configured to use `https://utleieskade-api2-production-2915.up.railway.app`
- **Bundle ID**: `com.utleieskade.tenant`
- **Version**: 1.0.0

For questions or issues, check the build logs at the Expo dashboard.

