# Fix: Redux Provider Error

## Error
```
[Error: could not find react-redux context value; please ensure the component is wrapped in a <Provider>]
```

## Cause
With React 19 and Expo Router 6, the Redux Provider needs to be set up correctly. The issue is that components are trying to use Redux hooks before the Provider is available.

## Solution Applied

✅ Simplified `StoreProvider` to remove `useRef` (not needed with React 19)
✅ Verified Provider wraps the entire app structure

## What Was Changed

1. **StoreProvider.tsx**: Removed `useRef` wrapper - directly use the store
2. **App structure**: Provider wraps everything correctly

## Next Steps

Restart Metro bundler:

```bash
cd tenant
npx expo start --clear
```

## Verification

The Provider structure is:
```
App
  └─ StoreProvider (Redux Provider)
      └─ StripeProvider
          └─ RootLayout
              └─ All screens (including HomeScreen)
```

This should provide Redux context to all components.

## If Still Getting Errors

1. **Check React Redux version compatibility:**
   ```bash
   npm list react-redux
   ```

2. **Update react-redux if needed:**
   ```bash
   npm install react-redux@latest --legacy-peer-deps
   ```

3. **Clear all caches:**
   ```bash
   rm -rf node_modules/.cache .expo
   npx expo start --clear
   ```

