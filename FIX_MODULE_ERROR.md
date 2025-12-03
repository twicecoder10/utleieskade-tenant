# Fix: Unable to resolve module Platform

This error occurs when React Native can't find internal modules. Here's how to fix it:

## Quick Fix (Recommended)

### Step 1: Clear All Caches

```bash
cd tenant

# Clear npm cache
npm cache clean --force

# Clear Metro bundler cache
npx expo start --clear

# Or manually clear watchman (if installed)
watchman watch-del-all
```

### Step 2: Reinstall Dependencies

```bash
# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Step 3: Restart Metro Bundler

```bash
# Start with cleared cache
npx expo start --clear
```

## Alternative Solutions

### Solution 1: Reset Metro Cache

```bash
cd tenant
npx expo start --clear
```

### Solution 2: Clean Install

```bash
cd tenant
rm -rf node_modules
rm -rf .expo
rm package-lock.json
npm install
npx expo start --clear
```

### Solution 3: Check React Native Version

The error might be due to a version mismatch. Verify your React Native version matches Expo SDK:

```bash
# Check versions
npx expo install --check

# Fix any version mismatches
npx expo install --fix
```

### Solution 4: Reset Watchman (Mac/Linux)

```bash
watchman watch-del-all
rm -rf node_modules
npm install
npx expo start --clear
```

### Solution 5: Clear All Caches (Windows)

```powershell
cd tenant

# Clear npm cache
npm cache clean --force

# Remove node_modules
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json

# Reinstall
npm install

# Start with cleared cache
npx expo start --clear
```

## Why This Happens

This error typically occurs due to:

1. **Corrupted node_modules**: Dependencies weren't installed correctly
2. **Metro bundler cache**: Old cached files causing conflicts
3. **Version mismatches**: React Native and Expo versions don't match
4. **Symlink issues**: Node modules have broken symlinks

## Prevention

1. Always use `npx expo install` instead of `npm install` for Expo packages
2. Clear cache when switching branches or after major updates
3. Keep Expo SDK and React Native versions in sync

## Still Not Working?

If the error persists:

1. **Check Expo SDK compatibility**:
   ```bash
   npx expo-doctor
   ```

2. **Update Expo CLI**:
   ```bash
   npm install -g expo-cli@latest
   ```

3. **Check for conflicting packages**:
   ```bash
   npm ls react-native
   ```

4. **Try a fresh Expo project** and migrate your code

## Related Issues

- Module resolution errors
- Metro bundler cache issues
- React Native version conflicts
- Expo SDK compatibility

