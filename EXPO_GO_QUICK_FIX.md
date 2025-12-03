# Quick Fix: Expo Go Connection on iPhone

## Your Computer's IP Address
**192.168.0.227**

## Quick Steps

### 1. Check Same WiFi Network
- ✅ iPhone and computer must be on the **SAME WiFi network**
- Check: iPhone Settings → WiFi → Network name
- Check: Computer WiFi → Network name
- **They must match!**

### 2. Environment File Created
I've created `tenant/.env` with your IP address:
```env
EXPO_PUBLIC_API_URL=http://192.168.0.227:3000
```

### 3. Restart Metro Bundler

```bash
cd tenant

# Stop current server (Ctrl+C if running)

# Clear cache and restart
npx expo start --clear
```

### 4. Scan QR Code Again
- Open Expo Go app on iPhone
- Scan the QR code from terminal
- Should connect now!

## If Still Not Working

### Option A: Use Tunnel Mode
```bash
cd tenant
npx expo start --tunnel --clear
```
This works even on different networks (slower but more reliable).

### Option B: Check Firewall
**Windows:**
1. Windows Security → Firewall & network protection
2. Allow an app through firewall
3. Allow Node.js through firewall

### Option C: Verify Backend is Running
Make sure your backend API is running:
```bash
cd api
npm run dev
# Should see: Server running on http://localhost:3000
```

## Common Issues

### "Unable to connect to Metro"
- **Solution:** Use tunnel mode: `npx expo start --tunnel`

### "Network request failed" in app
- **Solution:** Check `.env` file has correct IP (192.168.0.227:3000)
- **Solution:** Verify backend is running on port 3000

### App loads but API calls fail
- **Solution:** Backend might not be running
- **Solution:** Check API URL in `.env` matches your IP

## Quick Checklist

- [ ] iPhone and computer on same WiFi
- [ ] `.env` file created with IP: 192.168.0.227:3000
- [ ] Metro restarted with `--clear`
- [ ] Backend API running on port 3000
- [ ] Firewall allows Node.js
- [ ] Scan QR code again

## Still Having Issues?

Try tunnel mode - it's slower but works from anywhere:
```bash
npx expo start --tunnel --clear
```

