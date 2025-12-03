# Fix: Network Request Failed Error

## Problem
```
Login Error: {"error": "TypeError: Network request failed", "status": "FETCH_ERROR"}
```

## Root Cause
The `.env` file was using `localhost:3000`, which doesn't work on physical devices. When testing on iPhone with Expo Go, `localhost` refers to the phone itself, not your development machine.

## Solution Applied ✅

Updated `.env` file to use your local IP address:
```
EXPO_PUBLIC_API_URL=http://192.168.0.227:3000
```

## Next Steps

1. **Restart Metro bundler** (if it's running):
   ```bash
   cd tenant
   npx expo start --clear
   ```

2. **Verify backend is running** on port 3000:
   ```bash
   cd api
   npm start
   ```

3. **Ensure both devices are on the same WiFi network**:
   - Your computer (running backend)
   - Your iPhone (running Expo Go)

4. **Test the login again** in the mobile app

## If Still Not Working

### Check Your Local IP Address
If `192.168.0.227` doesn't work, find your current IP:

**Windows:**
```powershell
ipconfig | findstr IPv4
```

**Mac/Linux:**
```bash
ifconfig | grep "inet "
```

Then update `.env` with your current IP:
```
EXPO_PUBLIC_API_URL=http://YOUR_IP:3000
```

### Alternative: Use Tunnel Mode
If local network doesn't work, use Expo tunnel:

```bash
cd tenant
npx expo start --tunnel --clear
```

This creates a public URL that works from anywhere (slower but more reliable).

## Verification Checklist

- [ ] `.env` file has correct IP address (not localhost)
- [ ] Backend is running on port 3000
- [ ] Both devices on same WiFi
- [ ] Metro bundler restarted with `--clear`
- [ ] Try login again

## Current Configuration

- **API URL**: `http://192.168.0.227:3000`
- **Backend Status**: ✅ Running
- **Network**: Same WiFi required

The network error should now be resolved! 🎉

