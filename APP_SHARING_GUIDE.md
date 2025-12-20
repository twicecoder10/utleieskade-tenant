# App Sharing Guide - Utleieskade Tenant App

Complete guide for sharing your app with users after builds complete.

## 📱 Build Status

### Android Build
- **Build ID**: `31cd266c-0a65-4879-b460-a5921ed2ac84`
- **Format**: APK (direct installation)
- **Monitor**: https://expo.dev/accounts/twice_coder/projects/utleieskade-mobile/builds/31cd266c-0a65-4879-b460-a5921ed2ac84

### iOS Build
- **Status**: Needs rebuild with latest updates
- **Format**: IPA (App Store/TestFlight)

---

## 🤖 Android App Sharing (APK)

### Step 1: Download the APK

1. Go to build dashboard: https://expo.dev/accounts/twice_coder/projects/utleieskade-mobile/builds
2. Find your Android build (ID: `31cd266c-0a65-4879-b460-a5921ed2ac84`)
3. Click **"Download"** button
4. Save the `.apk` file to your computer

### Step 2: Upload APK to Sharing Platform

Choose one of these options:

#### Option A: Google Drive (Recommended - Easy)

1. Upload `.apk` to Google Drive
2. Right-click file → **"Get link"**
3. Set sharing to **"Anyone with the link"**
4. Copy the link
5. Share the link with users

**Share Message:**
```
Download the Utleieskade Tenant App:

[Your Google Drive link]

Install Instructions:
1. Download the .apk file
2. On Android: Settings → Security → Enable "Install from unknown sources"
3. Open the downloaded file
4. Follow installation prompts
```

#### Option B: Dropbox

1. Upload `.apk` to Dropbox
2. Right-click → **"Copy link"**
3. Change link ending from `?dl=0` to `?dl=1` (for direct download)
4. Share the link

#### Option C: Firebase App Distribution (Professional)

1. Go to: https://console.firebase.google.com
2. Create/select project
3. Go to **App Distribution**
4. Upload `.apk` file
5. Add testers by email
6. Testers receive invitation email

#### Option D: Your Website

1. Upload `.apk` to your web server
2. Create download page
3. Share the download link

### Step 3: Share with Users

**For Direct Download:**
```
Download the Utleieskade Tenant App:

[Your download link]

Install Instructions:
1. Download the .apk file on your Android device
2. Go to Settings → Security → Enable "Install from unknown sources"
3. Open the downloaded .apk file
4. Tap "Install"
5. Open the app and login
```

**For Email Distribution:**
- Attach `.apk` file to email
- Include installation instructions
- Note: Some email providers block `.apk` files

---

## 🍎 iOS App Sharing

### Option 1: TestFlight (Internal Testing)

**Step 1: Build iOS App**
```bash
eas build --platform ios --profile production
```

**Step 2: Submit to TestFlight**
```bash
eas submit --platform ios
```

**Step 3: Add Testers**
1. Go to: https://appstoreconnect.apple.com/apps/6756213906/testflight/ios
2. Click **"Internal Testing"**
3. Click **"+"** to add testers
4. Enter tester email addresses
5. Testers receive invitation email

**Step 4: Testers Install**
1. Install **TestFlight** app from App Store
2. Open invitation email
3. Tap **"View in TestFlight"**
4. Install your app

### Option 2: App Store (Public Release)

**Step 1: Complete App Store Listing**
1. Go to: https://appstoreconnect.apple.com/apps/6756213906
2. Complete required information:
   - App name and description
   - Screenshots (required)
   - App icon (1024x1024px)
   - Privacy policy URL
   - Category and keywords
   - Pricing

**Step 2: Submit for Review**
1. Build and submit iOS app:
   ```bash
   eas build --platform ios --profile production
   eas submit --platform ios
   ```
2. In App Store Connect, click **"Submit for Review"**
3. Answer export compliance questions
4. Submit

**Step 3: Wait for Approval**
- Review time: 24-48 hours
- You'll receive email notifications
- Once approved, app goes live

**Step 4: Share App Store Link**
```
Download the Utleieskade Tenant App from the App Store:

[Your App Store link]

Available for iPhone and iPad.
```

---

## 📧 Email Templates

### Android APK Sharing Email

**Subject:** Download Utleieskade Tenant App

```
Hi,

You can now download the Utleieskade Tenant App for Android.

Download Link: [Your download link]

Installation Instructions:
1. Download the .apk file on your Android device
2. Go to Settings → Security → Enable "Install from unknown sources"
3. Open the downloaded file and tap "Install"
4. Open the app and login with your credentials

If you have any issues, please contact support.

Best regards,
[Your name]
```

### iOS TestFlight Invitation

**Subject:** Invitation to Test Utleieskade Tenant App

```
Hi,

You've been invited to test the Utleieskade Tenant App via TestFlight.

To get started:
1. Install the TestFlight app from the App Store
2. Open this email on your iPhone/iPad
3. Tap "View in TestFlight"
4. Install the Utleieskade Tenant App
5. Open the app and login

TestFlight allows you to test the app before it's released publicly.

If you have any questions, please contact support.

Best regards,
[Your name]
```

---

## 🔗 Quick Links

### Build Management
- **All Builds**: https://expo.dev/accounts/twice_coder/projects/utleieskade-mobile/builds
- **Android Build**: https://expo.dev/accounts/twice_coder/projects/utleieskade-mobile/builds/31cd266c-0a65-4879-b460-a5921ed2ac84

### App Store Connect
- **Dashboard**: https://appstoreconnect.apple.com/apps/6756213906
- **TestFlight**: https://appstoreconnect.apple.com/apps/6756213906/testflight/ios

### Production API
- **API URL**: `https://utleieskade-api2-production-2915.up.railway.app`
- **API Docs**: `https://utleieskade-api2-production-2915.up.railway.app/api-docs`

---

## 📋 Sharing Checklist

### Before Sharing:
- [ ] Android build completed
- [ ] APK file downloaded
- [ ] APK uploaded to sharing platform
- [ ] Download link tested
- [ ] Installation instructions prepared
- [ ] User credentials ready (if needed)

### For iOS:
- [ ] iOS build completed
- [ ] Submitted to TestFlight/App Store
- [ ] Testers added (if TestFlight)
- [ ] App Store listing completed (if public release)
- [ ] App approved (if App Store)

---

## 🆘 Troubleshooting

### Android Installation Issues

**Problem**: "Install blocked"
- **Solution**: Enable "Install from unknown sources" in Android settings

**Problem**: "App not installing"
- **Solution**: Check Android version compatibility (requires Android 5.0+)

**Problem**: "Download failed"
- **Solution**: Check internet connection, try different browser

### iOS TestFlight Issues

**Problem**: "Invitation not received"
- **Solution**: Check spam folder, verify email address

**Problem**: "Can't install from TestFlight"
- **Solution**: Ensure TestFlight app is installed, check iOS version

**Problem**: "Build not available"
- **Solution**: Wait for Apple processing (5-10 minutes after submission)

---

## 📊 Distribution Methods Comparison

| Method | Pros | Cons | Best For |
|--------|------|------|----------|
| **Google Drive** | Free, Easy, Fast | Manual sharing | Small groups |
| **Dropbox** | Free, Easy | Manual sharing | Small groups |
| **Firebase** | Professional, Automated | Setup required | Beta testing |
| **Website** | Full control | Requires hosting | Public distribution |
| **TestFlight** | Official, Easy | iOS only | iOS testing |
| **App Store** | Official, Public | Review process | Public release |

---

## ✅ What's Included in This Build

- ✅ Production API URL: `https://utleieskade-api2-production-2915.up.railway.app`
- ✅ 30-second timeout (prevents timeouts)
- ✅ Enhanced error handling
- ✅ All local IPs removed
- ✅ Latest bug fixes

---

## 📝 Notes

- **Android APK**: Can be shared directly, no review needed
- **iOS**: Requires TestFlight (testing) or App Store (public)
- **Updates**: Users need to download new APK for updates (Android) or update via App Store (iOS)
- **Version**: Current version is 1.0.0

---

**Last Updated**: December 6, 2025  
**Status**: Ready for sharing after builds complete

