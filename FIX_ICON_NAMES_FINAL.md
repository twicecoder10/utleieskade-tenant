# Fix: Icon Names - Final Solution

## Problem
AntDesign icon names `"pluscircle"` and `"minuscircle"` are invalid.

## Solution ✅
Changed to use simple icon names:
- `"pluscircle"` → `"plus"`
- `"minuscircle"` → `"minus"`

These are standard AntDesign icons that definitely exist.

## Why This Works
- `"plus"` and `"minus"` are core AntDesign icons
- They're simpler and more reliable than circle variants
- Still provide clear visual indication for expand/collapse

## Alternative Options (if needed)
If you want circle variants, you could also try:
- Using Ionicons instead: `"add-circle"` / `"remove-circle"`
- Or use custom icons/images

## Files Changed
- ✅ `tenant/app/(tabs)/index.tsx` - Changed to "plus" and "minus"

## Test Now
1. **Reload the app** (shake phone → Reload)
2. **Check FAQ section** - Icons should display correctly

The icon warnings should now be completely resolved! 🎉

