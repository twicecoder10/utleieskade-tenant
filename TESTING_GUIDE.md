# Mobile App Testing Guide

## Prerequisites

### 1. Install Dependencies

```bash
cd tenant
npm install
```

### 2. Install Expo CLI (if not already installed)

```bash
npm install -g expo-cli
```

Or use npx:
```bash
npx expo start
```

### 3. Install Mobile App

- **iOS**: Install Expo Go from App Store
- **Android**: Install Expo Go from Google Play Store

## Environment Setup

### Create `.env` file (optional, or use hardcoded values)

Create `tenant/.env`:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_WVWA7jPmzISjavPB62KpTAs400mFLVsnk1
```

**Note**: Currently, Stripe key is hardcoded in `app/reports/assessment-payment.tsx` and `app/_layout.tsx`. You can move it to `.env` if preferred.

## Running the App

### Start Development Server

```bash
cd tenant
npm start
# or
npx expo start
```

This will:
- Start the Metro bundler
- Show a QR code in terminal
- Open Expo DevTools in browser

### Connect to App

**Option 1: Scan QR Code**
- Open Expo Go app on your phone
- Scan the QR code from terminal (iOS) or browser (Android)

**Option 2: Use Simulator/Emulator**
- Press `i` for iOS Simulator (Mac only)
- Press `a` for Android Emulator
- Press `w` for web browser

### Development Options

- `r` - Reload app
- `m` - Toggle menu
- `j` - Open debugger
- `c` - Clear cache

## Testing Checklist

### 1. Authentication Flow

#### Registration
- [ ] Navigate to signup screen
- [ ] Enter full name
- [ ] Enter phone number
- [ ] Select role (Tenant/Landlord)
- [ ] Accept Terms of Service
- [ ] Complete registration
- [ ] Verify redirect to dashboard

#### Login
- [ ] Enter email and password
- [ ] Verify successful login
- [ ] Check token is stored in AsyncStorage

#### Language Toggle
- [ ] Go to Settings
- [ ] Switch between Norwegian and English
- [ ] Verify language persists after app restart

### 2. Dashboard

- [ ] View all submitted cases
- [ ] Check case status indicators
- [ ] Click "Create New Case" button
- [ ] Click "Download Receipts" button
- [ ] Click "Send us a mail" support button
- [ ] Expand/collapse FAQ section

### 3. Case Creation Flow

#### Basic Information
- [ ] Enter property address
- [ ] Enter building number
- [ ] Verify required field validation

#### Add Rooms/Damages
- [ ] Click "Add Room" button
- [ ] Select damage area (Bathroom, Kitchen, etc.)
- [ ] Select damage type
- [ ] Select cause of damage
- [ ] Enter description (max 150 characters)
- [ ] Verify character counter
- [ ] Select date when damage was noticed
- [ ] Add multiple rooms
- [ ] Remove a room

#### Photo Upload
- [ ] Click "Add Photo" for each room
- [ ] Select from camera or gallery
- [ ] Upload up to 10 photos per room
- [ ] Add description for each photo
- [ ] Verify photos are displayed

#### Assessment Options
- [ ] Select assessment level (Standard/Detailed)
- [ ] Toggle urgent flag
- [ ] Enter optional tenant name
- [ ] Enter optional landlord name

#### Pricing
- [ ] Verify base price calculation
- [ ] Check discount for 2 rooms (10%)
- [ ] Check discount for 3+ rooms (15%)
- [ ] Verify detailed assessment fee (+200 NOK)
- [ ] Verify urgent fee (+50 NOK)
- [ ] Check total price breakdown

#### Save Draft
- [ ] Click "Save Draft" button
- [ ] Verify draft is saved
- [ ] Go to "Saved Drafts" screen
- [ ] Load draft and continue editing
- [ ] Delete a draft

#### Report Preview
- [ ] Click "Continue" to preview
- [ ] Verify all case data is displayed
- [ ] Check all rooms are shown
- [ ] Verify photos are displayed
- [ ] Check pricing breakdown
- [ ] Click "Edit" to go back
- [ ] Click "Proceed to Payment"

### 4. Payment Flow

#### Payment Screen
- [ ] Verify case summary is displayed
- [ ] Check total amount is correct
- [ ] Click "Pay Now" button

#### Stripe Payment Sheet
- [ ] Verify payment sheet opens
- [ ] Enter test card: `4242 4242 4242 4242`
- [ ] Enter expiry: `12/34`
- [ ] Enter CVC: `123`
- [ ] Enter ZIP: `12345`
- [ ] Complete payment
- [ ] Verify payment success

#### Payment Success
- [ ] Check success alert appears
- [ ] Verify redirect to dashboard
- [ ] Check case appears in "All Cases"
- [ ] Verify receipt is generated

### 5. Case Management

#### View All Cases
- [ ] Navigate to "All Cases" screen
- [ ] Verify all submitted cases are listed
- [ ] Check case status (Under Review, Completed, etc.)
- [ ] Click on a case to view details

#### Case Details
- [ ] Verify property information
- [ ] Check all damage details
- [ ] View all photos
- [ ] Check inspector information (if assigned)
- [ ] Verify submission date

### 6. Receipts

#### View Receipts
- [ ] Navigate to "Receipts" screen
- [ ] Verify all receipts are listed
- [ ] Check receipt details (amount, date, status)

#### Download Receipt
- [ ] Click download button
- [ ] Verify PDF is downloaded (or opens in browser)

### 7. Settings

#### Update Profile
- [ ] Go to Settings
- [ ] Update name
- [ ] Update phone number
- [ ] Verify changes are saved

#### Account Deletion
- [ ] Click "Delete Account" button
- [ ] Verify confirmation dialog appears
- [ ] Check 30-day notice message
- [ ] Cancel deletion
- [ ] (Optional) Complete deletion

## Testing Payment with Stripe

### Test Cards

Use these test cards in Stripe payment sheet:

**Success Cards:**
- `4242 4242 4242 4242` - Visa (always succeeds)
- `5555 5555 5555 4444` - Mastercard
- `3782 822463 10005` - American Express

**Decline Cards:**
- `4000 0000 0000 0002` - Card declined
- `4000 0000 0000 9995` - Insufficient funds

**Requires Authentication:**
- `4000 0025 0000 3155` - Requires 3D Secure

**Test Details:**
- Expiry: Any future date (e.g., `12/34`)
- CVC: Any 3 digits (e.g., `123`)
- ZIP: Any 5 digits (e.g., `12345`)

### Payment Flow Testing

1. **Create a case** with multiple rooms
2. **Proceed to payment** screen
3. **Click "Pay Now"**
4. **Enter test card** in payment sheet
5. **Complete payment**
6. **Verify**:
   - Payment success alert
   - Case created in backend
   - Receipt generated
   - Redirect to dashboard

## Common Issues & Troubleshooting

### App Won't Start

**Issue**: Metro bundler errors
```bash
# Clear cache and restart
npx expo start --clear
```

**Issue**: Module not found
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### Payment Sheet Not Opening

**Issue**: Stripe not initialized
- Check `app/_layout.tsx` has `StripeProvider`
- Verify publishable key is correct
- Check console for errors

**Solution**: 
```typescript
// Ensure StripeProvider wraps the app
<StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
  <RootLayout />
</StripeProvider>
```

### API Connection Issues

**Issue**: Cannot connect to backend
- Verify backend is running on `http://localhost:3000`
- Check `EXPO_PUBLIC_API_URL` in `.env`
- For physical device, use your computer's IP address:
  ```env
  EXPO_PUBLIC_API_URL=http://192.168.1.XXX:5000
  ```

### Photos Not Uploading

**Issue**: Photos not saving
- Check camera/gallery permissions
- Verify `expo-image-picker` is installed
- Check AsyncStorage permissions

### Draft Not Saving

**Issue**: Drafts not persisting
- Check AsyncStorage is working
- Verify `@react-native-async-storage/async-storage` is installed
- Check console for storage errors

## Debugging

### Enable Debug Mode

1. Shake device (or press `Cmd+D` on iOS, `Cmd+M` on Android)
2. Select "Debug Remote JS"
3. Open Chrome DevTools at `chrome://inspect`

### View Logs

```bash
# View all logs
npx expo start --dev-client

# View specific logs
npx react-native log-android  # Android
npx react-native log-ios      # iOS
```

### Network Debugging

Use React Native Debugger or Flipper:
- Install React Native Debugger
- Enable network inspection
- Monitor API calls

## Testing on Physical Devices

### iOS (iPhone/iPad)

1. Connect device via USB
2. Trust computer on device
3. Run: `npx expo start --ios`
4. Or scan QR code with Camera app

### Android

1. Enable USB debugging on device
2. Connect device via USB
3. Run: `npx expo start --android`
4. Or scan QR code with Expo Go app

### Network Configuration

For physical devices, update API URL:

```env
# Find your computer's IP address
# Windows: ipconfig
# Mac/Linux: ifconfig

EXPO_PUBLIC_API_URL=http://YOUR_IP_ADDRESS:3000
```

## Performance Testing

### Test Scenarios

1. **Large Photo Upload**
   - Upload 10 photos per room
   - Test with 3+ rooms
   - Verify app doesn't crash

2. **Offline Functionality**
   - Turn off WiFi/mobile data
   - Create draft
   - Verify draft saves locally
   - Turn on connection
   - Verify draft syncs

3. **Multiple Cases**
   - Create 5+ cases
   - Verify dashboard performance
   - Check case list scrolling

## Security Testing

- [ ] Verify tokens are stored securely
- [ ] Check API calls use HTTPS
- [ ] Verify sensitive data is encrypted
- [ ] Test logout clears all data
- [ ] Verify account deletion removes all data

## Accessibility Testing

- [ ] Test with screen reader (VoiceOver/TalkBack)
- [ ] Verify all buttons are accessible
- [ ] Check color contrast
- [ ] Test with different font sizes

## Next Steps

After testing:

1. **Fix any bugs** found during testing
2. **Update documentation** with findings
3. **Prepare for production**:
   - Update Stripe keys to live keys
   - Update API URL to production
   - Test with real payment methods
   - Submit to App Store/Play Store

## Quick Test Commands

```bash
# Start app
cd tenant && npm start

# Clear cache
npx expo start --clear

# Run on iOS simulator
npx expo start --ios

# Run on Android emulator
npx expo start --android

# Check for updates
npx expo install --check

# Update dependencies
npm update
```

