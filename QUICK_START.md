# Quick Start - Testing the Mobile App

## 🚀 Fast Setup (5 minutes)

### Step 1: Install Dependencies

```bash
cd tenant
npm install
```

### Step 2: Configure API URL

Create a `.env` file in the `tenant` directory:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
```

**For Physical Device Testing:**
Replace `localhost` with your computer's IP address:
```env
EXPO_PUBLIC_API_URL=http://192.168.0.227:3000
```

**Note:** Your IP address is `192.168.0.227`. If it changes, find it again with:
- Windows: `ipconfig` (look for IPv4 Address)
- Mac/Linux: `ifconfig` (look for inet)

To find your IP:
- Windows: Run `ipconfig` and look for IPv4 Address
- Mac/Linux: Run `ifconfig` and look for inet

### Step 3: Start Backend Server

Make sure your backend API is running:

```bash
cd api
npm run dev
# Backend should be running on http://localhost:3000
```

### Step 4: Start Mobile App

```bash
cd tenant
npm start
# or
npx expo start
```

### Step 5: Connect Your Device

**Option A: Physical Device (Recommended)**
1. Install **Expo Go** app from App Store (iOS) or Google Play (Android)
2. Scan the QR code shown in terminal
3. App will load on your device

**Option B: Simulator/Emulator**
- Press `i` for iOS Simulator (Mac only)
- Press `a` for Android Emulator
- Press `w` for web browser

## 📱 Testing the Payment Flow

### Quick Test Steps:

1. **Login/Register**
   - Create account or login
   - Accept Terms of Service

2. **Create a Case**
   - Click "Create New Case"
   - Fill in property address
   - Add at least one room/damage
   - Upload a photo
   - Select assessment level
   - Click "Continue"

3. **Review & Pay**
   - Review case preview
   - Click "Proceed to Payment"
   - Click "Pay Now"

4. **Test Payment**
   - Use test card: `4242 4242 4242 4242`
   - Expiry: `12/34`
   - CVC: `123`
   - ZIP: `12345`
   - Complete payment

5. **Verify Success**
   - Should see success message
   - Case appears in dashboard
   - Receipt is generated

## 🔧 Troubleshooting

### App Won't Connect to Backend

**For Physical Device:**
1. Find your computer's IP address:
   - Windows: `ipconfig` (look for IPv4)
   - Mac/Linux: `ifconfig` (look for inet)
2. Update API URL in code or `.env`:
   ```env
   EXPO_PUBLIC_API_URL=http://YOUR_IP:5000
   ```
3. Restart the app

### Payment Sheet Not Opening

- Check console for errors
- Verify Stripe key is correct
- Ensure StripeProvider is in `_layout.tsx`

### Clear Cache

```bash
npx expo start --clear
```

## 📋 Test Checklist

- [ ] App starts without errors
- [ ] Can login/register
- [ ] Dashboard loads
- [ ] Can create a case
- [ ] Can upload photos
- [ ] Payment flow works
- [ ] Case appears after payment
- [ ] Receipt is generated

## 🎯 Common Commands

```bash
# Start app
npm start

# Clear cache and start
npx expo start --clear

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web
```

## 📚 Full Testing Guide

For comprehensive testing instructions, see [TESTING_GUIDE.md](./TESTING_GUIDE.md)

