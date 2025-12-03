# Fix for Tenant Cases Loading Issues

## Problems Fixed

### 1. ✅ Backend Query Issue - GROUP BY Problem
**Problem**: The `getTenantCases` query used `group: ["Case.caseId"]` which caused issues with `findAndCountAll` in Sequelize. The count was incorrect and the query structure was problematic.

**Solution**:
- Removed the `GROUP BY` clause
- Used `distinct: true` instead for accurate counting with includes
- Transformed the data structure to match frontend expectations
- Fixed photo count calculation (now counts actual photos, not damage IDs)

**Files Changed**:
- `api/src/services/tenantService.js` - Complete rewrite of `getTenantCases` function

### 2. ✅ Case Status Not Set on Creation
**Problem**: New cases might not have been created with "open" status explicitly, causing them not to show in active cases.

**Solution**:
- Explicitly set `caseStatus: "open"` when creating cases
- This ensures new cases immediately appear in the active cases count

**Files Changed**:
- `api/src/services/caseService.js` - Added explicit `caseStatus: "open"` to case creation

### 3. ✅ Data Structure Mismatch
**Problem**: Backend returned data with different field names than frontend expected (e.g., `caseID` vs `caseId`, `caseTitle` vs `caseDescription`).

**Solution**:
- Added data transformation in backend to provide both field names
- Frontend now handles multiple data structures
- Added proper mapping for all required fields

**Files Changed**:
- `api/src/services/tenantService.js` - Added data transformation
- `tenant/app/(tabs)/index.tsx` - Improved data extraction
- `tenant/app/reports/all-cases.tsx` - Improved data extraction

### 4. ✅ Error Handling and Debugging
**Problem**: Errors weren't being displayed clearly, making debugging difficult.

**Solution**:
- Added detailed error messages in UI
- Added console logging for debugging
- Better error display in both dashboard and all-cases screens

**Files Changed**:
- `tenant/app/(tabs)/index.tsx` - Enhanced error display
- `tenant/app/reports/all-cases.tsx` - Enhanced error display and logging

## Data Structure Changes

### Backend Response (Before):
```javascript
{
  cases: [
    {
      caseID: "...",
      caseTitle: "...",
      status: "...",
      // ...
    }
  ]
}
```

### Backend Response (After):
```javascript
{
  cases: [
    {
      caseId: "...",      // Original field
      caseID: "...",      // Alias for compatibility
      caseTitle: "...",   // From caseDescription
      caseDescription: "...", // Original
      status: "...",      // From caseStatus
      urgency: "...",     // From caseUrgencyLevel
      urgencyLevel: "...", // Alias
      reportedDate: "...", // From createdAt
      createdAt: "...",   // Original
      numPhotos: 5,       // Calculated total
      damages: [...],      // Full damage data with photos
      property: {...}      // Property data
    }
  ]
}
```

## Testing Checklist

After these fixes, test:

1. **Create New Case**:
   - ✅ Submit a new case with payment
   - ✅ Verify case appears in "Active Cases" count immediately
   - ✅ Verify case appears in "Submitted Cases" list
   - ✅ Verify case appears in "All Cases" screen

2. **View Cases**:
   - ✅ Dashboard shows correct active cases count
   - ✅ "Submitted Cases" section shows cases
   - ✅ "All Cases" screen loads without errors
   - ✅ Case details display correctly

3. **Error Handling**:
   - ✅ If API fails, error message is displayed
   - ✅ Console shows detailed error information
   - ✅ App doesn't crash on API errors

## Key Changes Summary

1. **Backend Query Fix**: Removed problematic GROUP BY, added proper data transformation
2. **Case Creation**: Explicitly set status to "open"
3. **Data Mapping**: Added aliases for field name compatibility
4. **Photo Count**: Fixed calculation to count actual photos
5. **Error Display**: Enhanced error messages for debugging

## Notes

- The query now uses `distinct: true` instead of `GROUP BY` for better Sequelize compatibility
- All case data is transformed to include both original and aliased field names
- Photo counts are calculated correctly from actual photo records
- New cases are guaranteed to have "open" status and appear in active cases immediately

