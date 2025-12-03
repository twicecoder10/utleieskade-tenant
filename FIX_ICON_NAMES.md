# Fix: Invalid Icon Names

## Problem
Icons `"pluscircle"` and `"minuscircle"` are not valid AntDesign icon names.

## Solution ✅
Changed to use hyphenated names:
- `"pluscircle"` → `"plus-circle"`
- `"minuscircle"` → `"minus-circle"`

## Valid AntDesign Icon Names
AntDesign icons use hyphens, not camelCase:
- ✅ `"plus-circle"` (correct)
- ✅ `"minus-circle"` (correct)
- ❌ `"pluscircle"` (invalid)
- ❌ `"minuscircle"` (invalid)

## Files Changed
- ✅ `tenant/app/(tabs)/index.tsx` - Fixed icon names in FAQ section

## Test Now
1. **Reload the app** (shake phone → Reload)
2. **Check FAQ section** - Icons should display correctly without warnings

The icon warnings should now be resolved! 🎉

