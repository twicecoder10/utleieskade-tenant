# Network Timeout Fix

## ✅ Fix Applied

Added **30-second timeout** to API requests to prevent "Network request timed out" errors.

## 🔧 Changes Made

### Updated `tenant/store/index.ts`:

```typescript
const baseQuery = fetchBaseQuery({
  baseUrl: apiUrl,
  timeout: 30000, // 30 seconds timeout (was default ~10 seconds)
  // ... rest of config
});
```

## 📝 Test Credentials

**Email**: `Brianne.Hauck@yahoo.com`  
**Password**: `password123`

## ⚠️ Current Status

**API Response**: "User with the provided email does not exist"

This means:
- ✅ API is working and responding
- ✅ API URL is correct
- ❌ User account doesn't exist yet

## 🔄 Solutions

### Option 1: Register the User First

1. Go to **Sign Up** screen in the app
2. Register with:
   - Email: `Brianne.Hauck@yahoo.com`
   - Password: `password123`
   - Fill in other required fields
3. Then try logging in

### Option 2: Use Existing Account

If you have an existing account:
- Use that email and password
- Make sure it's a **tenant** type account

### Option 3: Check Database

If the user should exist:
- Verify user exists in database
- Check user type is "tenant"
- Verify password is correct

## 🧪 Testing

### Test Login Endpoint:
```bash
curl -X POST https://utleieskade-api2-production-2915.up.railway.app/users/login/tenant \
  -H "Content-Type: application/json" \
  -d '{"userEmail":"Brianne.Hauck@yahoo.com","userPassword":"password123"}'
```

**Expected Response:**
```json
{
  "status": "error",
  "message": "User with the provided email does not exist"
}
```

This confirms the API is working - you just need to register first.

## ✅ Next Steps

1. **Restart the app** to load the new timeout configuration
2. **Register the user** if they don't exist
3. **Try login again** - should work with 30-second timeout

## 📊 Timeout Configuration

- **Previous**: Default timeout (~10 seconds)
- **New**: 30 seconds timeout
- **Reason**: Railway API can be slow on first request (cold start)

## 🔍 If Still Timing Out

1. **Check Internet Connection**
   - Try on WiFi
   - Try on mobile data
   - Check signal strength

2. **Check API Status**
   - Visit: https://utleieskade-api2-production-2915.up.railway.app
   - Should show API docs

3. **Increase Timeout Further** (if needed)
   - Can increase to 60 seconds if API is very slow

---

**Last Updated**: December 6, 2025  
**Status**: ✅ Timeout increased to 30 seconds, ready for testing

