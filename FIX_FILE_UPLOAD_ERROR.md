# Fix: File Upload Error

## Problem
```
Failed to upload file: [TypeError: Cannot convert undefined value to object]
```

## Root Cause
There were **two `casesApi` definitions**:
1. `tenant/slice/cases/index.service.ts` - Main cases API
2. `tenant/slice/files/index.service.ts` - Was also using `casesApi` (conflict!)

This caused RTK Query to have conflicts when calculating tags, leading to the "Cannot convert undefined value to object" error.

## Solution Applied ✅

1. **Created separate `filesApi`**:
   - Changed `files/index.service.ts` to use `filesApi` instead of `casesApi`
   - Added proper `tagTypes: ["files"]`
   - Set `invalidatesTags: []` for uploadFile to prevent tag calculation errors

2. **Updated Redux Store**:
   - Added `filesApi.reducerPath` to store reducers
   - Added `filesApi.middleware` to store middleware

## Files Changed

1. ✅ `tenant/slice/files/index.service.ts`
   - Changed from `casesApi` to `filesApi`
   - Added `tagTypes: ["files"]`
   - Added `invalidatesTags: []` to uploadFile mutation

2. ✅ `tenant/store/store.ts`
   - Added `filesApi` import
   - Added `filesApi.reducerPath` to reducers
   - Added `filesApi.middleware` to middleware

## Test Now

1. **Reload the app** (shake phone → Reload)

2. **Test file upload**:
   - Go to Report Damage screen
   - Try uploading a photo
   - Should upload without errors

## Expected Behavior

- ✅ File upload works without errors
- ✅ No more "Cannot convert undefined value to object" error
- ✅ Photos upload successfully
- ✅ Upload response handled correctly

The file upload error should now be resolved! 🎉



