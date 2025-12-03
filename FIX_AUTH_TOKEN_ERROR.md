# Fix: Authentication Token Error

## Problem
```
GetUser Error: "User not authorized, no token provided. Kindly login to continue"
```

## Root Cause
There was a **token storage mismatch**:
- Login was saving token as `"userToken"` in some places and `"token"` in others
- `baseQuery` was looking for `"token"` in AsyncStorage
- `checkAuthAsync` was looking for `"userToken"`
- `GetUser` query was being called even when not logged in

## Solutions Applied ✅

### 1. **Standardized Token Storage**
- Now stores token in **both** `"token"` and `"userToken"` keys for compatibility
- `baseQuery` uses `"token"` (primary)
- `checkAuthAsync` checks both keys

### 2. **Fixed Login Response Handling**
- Added fallback for different API response structures
- Handles both `response?.data?.data` and `response?.data`

### 3. **Skip GetUser Query When Not Logged In**
- Added `skip: !isLoggedIn` to `useGetUserQuery` in:
  - `app/(tabs)/index.tsx` (HomeScreen)
  - `app/(tabs)/settings.tsx` (Settings)

### 4. **Improved checkAuthAsync**
- Removed navigation logic (handled by `_layout.tsx` useEffect)
- Checks both token keys

## Files Changed

1. ✅ `tenant/app/auth/index.tsx` - Store token in both keys
2. ✅ `tenant/slice/auth/index.service.ts` - Store token in both keys, handle response structure
3. ✅ `tenant/slice/userSlice.ts` - Check both token keys
4. ✅ `tenant/app/(tabs)/index.tsx` - Skip GetUser query when not logged in
5. ✅ `tenant/app/(tabs)/settings.tsx` - Skip GetUser query when not logged in

## Next Steps

1. **Restart Metro** (if not already):
   ```bash
   cd tenant
   npx expo start --clear
   ```

2. **Test Login**:
   - Try logging in with test credentials
   - Token should now be stored correctly
   - GetUser query should only run after successful login

3. **Verify**:
   - Login should work
   - No more "no token provided" errors
   - Dashboard should load user data after login

## Current Token Flow

1. **Login** → Stores token in both `"token"` and `"userToken"`
2. **baseQuery** → Reads `"token"` for API requests
3. **checkAuthAsync** → Checks both keys on app startup
4. **GetUser Query** → Only runs when `isLoggedIn === true`

The authentication error should now be resolved! 🎉

