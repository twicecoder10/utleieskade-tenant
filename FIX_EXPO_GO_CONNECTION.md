# Fix: Expo Go Connection Issues on iPhone

## Error
```
Opening project
this is taking much longer than it should. 
you might want to check your internet connectivity.
```

## Common Causes

1. **Phone and computer not on same WiFi network**
2. **API URL using localhost** (doesn't work on physical devices)
3. **Firewall blocking Metro bundler port**
4. **Metro bundler not accessible from phone**

## Quick Fixes

### Step 1: Check Network Connection

**Ensure your iPhone and computer are on the SAME WiFi network:**

1. iPhone: Settings → WiFi → Check network name
2. Computer: Check WiFi network name
3. **They must match!**

### Step 2: Find Your Computer's IP Address

**Windows:**
```powershell
ipconfig
# Look for "IPv4 Address" under your WiFi adapter
# Example: 192.168.1.100
```

**Mac:**
```bash
ifconfig | grep "inet "
# Look for IP starting with 192.168.x.x or 10.x.x.x
```

**Linux:**
```bash
hostname -I
# or
ip addr show
```

### Step 3: Update API URL

Create or update `tenant/.env` file:

```env
# Replace YOUR_IP with your computer's IP address from Step 2
EXPO_PUBLIC_API_URL=http://192.168.1.XXX:3000
```

**Example:**
```env
EXPO_PUBLIC_API_URL=http://192.168.1.100:3000
```

### Step 4: Restart Metro Bundler

```bash
cd tenant

# Stop current server (Ctrl+C)

# Clear cache and restart
npx expo start --clear

# Or use tunnel mode (works across networks)
npx expo start --tunnel
```

### Step 5: Check Firewall

**Windows:**
1. Windows Security → Firewall & network protection
2. Allow an app through firewall
3. Allow Node.js and npm through firewall

**Mac:**
1. System Preferences → Security & Privacy → Firewall
2. Allow Node.js if prompted

### Step 6: Use Tunnel Mode (Alternative)

If same network doesn't work, use Expo's tunnel:

```bash
cd tenant
npx expo start --tunnel
```

This creates a public URL that works from anywhere (slower but more reliable).

## Step-by-Step Solution

### Option A: Same Network (Faster)

1. **Connect both devices to same WiFi**
2. **Find computer IP:**
   ```powershell
   # Windows PowerShell
   ipconfig
   ```
3. **Update `.env` file:**
   ```env
   EXPO_PUBLIC_API_URL=http://YOUR_IP:3000
   ```
4. **Restart Metro:**
   ```bash
   npx expo start --clear
   ```
5. **Scan QR code again**

### Option B: Tunnel Mode (Works Anywhere)

```bash
cd tenant
npx expo start --tunnel --clear
```

This creates a public URL - works even on different networks (but slower).

## Verify Connection

### Check Metro Bundler is Running

You should see in terminal:
```
Metro waiting on exp://192.168.1.XXX:8081
```

### Test Connection from Phone

1. Open Safari on iPhone
2. Go to: `http://YOUR_IP:8081`
3. Should see Metro bundler status page

If this doesn't work, firewall is blocking.

## Troubleshooting

### Issue: Still Can't Connect

**Try these:**

1. **Disable VPN** on both devices
2. **Restart WiFi** on iPhone
3. **Use tunnel mode:**
   ```bash
   npx expo start --tunnel
   ```
4. **Check Expo Go app version** - update if needed
5. **Try different network** (mobile hotspot)

### Issue: "Unable to connect to Metro"

1. **Check port 8081 is not blocked**
2. **Try different port:**
   ```bash
   npx expo start --port 8082
   ```
3. **Use tunnel mode** (bypasses port issues)

### Issue: App loads but API calls fail

**This means Expo Go connected, but API URL is wrong:**

1. Check `.env` file has correct IP
2. Restart Metro bundler after changing `.env`
3. Verify backend is running on port 3000
4. Test API from phone browser: `http://YOUR_IP:3000`

## Quick Checklist

- [ ] iPhone and computer on same WiFi
- [ ] Found computer's IP address
- [ ] Updated `.env` with IP (not localhost)
- [ ] Restarted Metro with `--clear`
- [ ] Firewall allows Node.js
- [ ] Backend API running on port 3000
- [ ] Expo Go app is updated

## Alternative: Use Development Build

If Expo Go keeps having issues, consider creating a development build:

```bash
cd tenant
npx expo install expo-dev-client
eas build --profile development --platform ios
```

This creates a custom build with better debugging.

## Still Not Working?

1. **Check Expo Go logs:**
   - Shake device in Expo Go
   - Check "Show Dev Menu" → "Show Error Screen"

2. **Check Metro bundler logs:**
   - Look for errors in terminal
   - Check for port conflicts

3. **Try tunnel mode:**
   ```bash
   npx expo start --tunnel
   ```

4. **Contact support** with:
   - Your IP address
   - Network setup
   - Error messages from Metro bundler

