# Login Troubleshooting Guide

## Common Login Issues

### Issue: "Invalid Password" or Login Not Working

#### Possible Causes:

1. **User doesn't exist in database**
   - You need to register first or have an admin create your account
   - Check if you're using the correct email

2. **Wrong password**
   - Passwords are case-sensitive
   - Check for extra spaces
   - If you registered, use the password you set during registration

3. **User type mismatch**
   - Make sure you're logging in as "tenant" if your account is a tenant
   - The app uses `/users/login/tenant` endpoint

4. **Account not verified**
   - Some accounts require email verification
   - Check your email for verification link

5. **API connection issue**
   - Verify the API is running: `https://utleieskade-api2-production-2915.up.railway.app`
   - Check your internet connection

---

## Test Credentials (If Database is Seeded)

If the database was seeded with test data, you can try:

**Tenant Account:**
- Email: `johndoe@mail.com`
- Password: `password123`

**Note:** These only work if the database was seeded. If not, you need to register first.

---

## How to Fix

### Option 1: Register a New Account

1. Open the app
2. Go to "Sign Up" or "Register"
3. Fill in your details:
   - First Name
   - Last Name
   - Email
   - Password
   - Phone (optional)
   - Address details
4. Submit registration
5. Try logging in with your new credentials

### Option 2: Reset Password

1. Click "Forgot Password" on the login screen
2. Enter your email
3. Check your email for OTP code
4. Enter OTP and set new password
5. Try logging in with new password

### Option 3: Check API Connection

Test if the API is accessible:

```bash
curl https://utleieskade-api2-production-2915.up.railway.app/
```

Should return the API documentation page.

### Option 4: Verify User Exists

If you have database access, check if your user exists:

```sql
SELECT "userEmail", "userType", "userStatus", "isVerified" 
FROM "User" 
WHERE "userEmail" = 'your-email@example.com';
```

---

## Debugging Steps

### 1. Check App Logs

In the app, check the console/logs for:
- Network errors
- API response errors
- Authentication errors

### 2. Test API Directly

You can test the login endpoint directly:

```bash
curl -X POST https://utleieskade-api2-production-2915.up.railway.app/users/login/tenant \
  -H "Content-Type: application/json" \
  -d '{
    "userEmail": "your-email@example.com",
    "userPassword": "your-password"
  }'
```

**Expected Success Response:**
```json
{
  "status": "success",
  "message": "User logged in successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1...",
    "userType": "tenant",
    "isVerified": true
  }
}
```

**Expected Error Response:**
```json
{
  "status": "error",
  "message": "Invalid Password"
}
```

### 3. Verify Request Format

The app should send:
- **URL**: `https://utleieskade-api2-production-2915.up.railway.app/users/login/tenant`
- **Method**: POST
- **Headers**: `Content-Type: application/json`
- **Body**:
  ```json
  {
    "userEmail": "user@example.com",
    "userPassword": "password"
  }
  ```

---

## Common Error Messages

| Error Message | Meaning | Solution |
|--------------|---------|----------|
| "User with the provided email does not exist" | Email not found | Register first or check email spelling |
| "Invalid Password" | Wrong password | Check password, try reset |
| "Unauthorized access, X cannot login as tenant" | Wrong user type | Use correct login endpoint for your user type |
| "Password reset required" | Default password | Reset your password |
| "Inspector account is inactive" | Account suspended | Contact support |
| Network error | API unreachable | Check internet, verify API URL |

---

## Quick Fix Checklist

- [ ] Verify email is correct (case-sensitive)
- [ ] Verify password is correct (case-sensitive, no extra spaces)
- [ ] Try registering a new account
- [ ] Check internet connection
- [ ] Verify API is running: https://utleieskade-api2-production-2915.up.railway.app
- [ ] Check app logs for specific error messages
- [ ] Try resetting password via "Forgot Password"
- [ ] Verify you're using the tenant login (not admin/inspector)

---

## Still Not Working?

1. **Check API Status**
   - Visit: https://utleieskade-api2-production-2915.up.railway.app/api-docs
   - Should show Swagger documentation

2. **Check Database**
   - Verify user exists in database
   - Check if password is hashed correctly

3. **Contact Support**
   - Provide error message from app
   - Provide email you're trying to use
   - Check Railway logs for API errors

---

## Registration Flow

If login doesn't work, register a new account:

1. Open app
2. Tap "Sign Up" or "Register"
3. Fill required fields:
   - First Name
   - Last Name  
   - Email (must be unique)
   - Password (min 6 characters recommended)
   - Phone (optional)
   - Address (optional)
4. Submit
5. You'll be automatically logged in after registration
6. Save your credentials for future logins

---

## API Endpoint Details

**Login Endpoint:**
- URL: `POST /users/login/tenant`
- Base URL: `https://utleieskade-api2-production-2915.up.railway.app`
- Full URL: `https://utleieskade-api2-production-2915.up.railway.app/users/login/tenant`

**Request Body:**
```json
{
  "userEmail": "user@example.com",
  "userPassword": "your-password"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "User logged in successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userType": "tenant",
    "isVerified": true
  }
}
```

**Error Response (401/400):**
```json
{
  "status": "error",
  "message": "Invalid Password"
}
```

---

Last Updated: December 6, 2025

