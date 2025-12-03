# Fix Steps for Module Resolution Error

## ✅ Step 1: Dependencies Reinstalled
Dependencies have been reinstalled. Now follow these steps:

## Step 2: Clear Metro Bundler Cache

**Option A: Using Expo CLI (Recommended)**
```bash
cd tenant
npx expo start --clear
```

**Option B: Manual Cache Clear**
```bash
cd tenant

# Clear Metro cache
rm -rf .expo
rm -rf node_modules/.cache

# Then start
npx expo start --clear
```

## Step 3: If Still Not Working

### Check Expo SDK Compatibility
```bash
cd tenant
npx expo-doctor
```

### Fix Version Mismatches
```bash
cd tenant
npx expo install --check
npx expo install --fix
```

### Complete Reset (Last Resort)
```bash
cd tenant

# Stop any running Metro bundler (Ctrl+C)

# Clear everything
rm -rf node_modules
rm -rf .expo
rm package-lock.json

# Reinstall
npm install

# Start fresh
npx expo start --clear
```

## Common Causes

1. **Metro bundler cache** - Most common cause
2. **Version mismatches** - React Native/Expo versions don't match
3. **Corrupted node_modules** - Fixed by reinstalling
4. **File system locks** - Some files locked by other processes

## Quick Test

After clearing cache, try:
```bash
npx expo start --clear
```

Then scan the QR code or press `i` (iOS) / `a` (Android) to test.

