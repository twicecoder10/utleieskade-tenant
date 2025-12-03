# Fix: Multiple Errors - Summary

## Errors Fixed ✅

### 1. **Missing Alert Import** - FIXED
**Error**: `[ReferenceError: Property 'Alert' doesn't exist]`

**Solution**: Added `Alert` to React Native imports in `app/(tabs)/index.tsx`

### 2. **Invalid Icon Names** - FIXED
**Error**: `"pluscircleo" is not a valid icon name for family "anticon"`

**Solution**: Changed icon names from:
- `"pluscircleo"` → `"pluscircle"`
- `"minuscircleo"` → `"minuscircle"`

### 3. **Redux Non-Serializable Value** - FIXED
**Error**: `A non-serializable value was detected in the state` (Blob object)

**Solution**: Added `keepUnusedDataFor: 0` to `downloadReceipt` queries to prevent caching blob responses in Redux state.

## Files Changed

1. ✅ `tenant/app/(tabs)/index.tsx`
   - Added `Alert` import
   - Fixed icon names

2. ✅ `tenant/slice/cases/index.service.ts`
   - Added `keepUnusedDataFor: 0` to `downloadReceipt` query

3. ✅ `tenant/slice/payments/index.service.ts`
   - Added `keepUnusedDataFor: 0` to `downloadReceipt` query

## Why These Fixes Work

### Alert Import
- `Alert` is a React Native component that must be imported
- Used for showing alert dialogs to users

### Icon Names
- AntDesign icon names don't have "o" suffix for circle icons
- Correct names are `pluscircle` and `minuscircle`

### Redux Serialization
- Blob objects cannot be serialized (required for Redux state)
- By setting `keepUnusedDataFor: 0`, we prevent caching
- Blob is still returned to the component, just not stored in Redux

## Test Now

1. **Reload the app** (shake phone → Reload)

2. **Test the fixes**:
   - ✅ No more Alert error when clicking support button
   - ✅ FAQ icons display correctly
   - ✅ No more Redux serialization warnings
   - ✅ Receipt downloads should work without errors

## Expected Behavior

- ✅ Support button shows alert without errors
- ✅ FAQ expand/collapse icons work correctly
- ✅ Receipt downloads work (blob not cached in Redux)
- ✅ No Redux serialization warnings in console

All errors should now be resolved! 🎉

