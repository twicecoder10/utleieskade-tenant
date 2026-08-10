# Sentry Setup Guide

This guide explains how to set up and configure Sentry for remote logging in the mobile app.

## Prerequisites

1. A Sentry account (sign up at [sentry.io](https://sentry.io))
2. A Sentry project created for your app

## Step 1: Get Your Sentry DSN

1. Go to [sentry.io](https://sentry.io) and sign in
2. Create a new project or select an existing one
3. Select **React Native** as the platform
4. Copy your **DSN** (Data Source Name)
   - It looks like: `https://xxxxx@xxxxx.ingest.sentry.io/xxxxx`

## Step 2: Add DSN to Environment Variables

Create or update your `.env` file in the `tenant` directory:

```bash
EXPO_PUBLIC_SENTRY_DSN=https://your-dsn-here@your-org.ingest.sentry.io/your-project-id
EXPO_PUBLIC_SENTRY_ENABLE_IN_DEV=false  # Set to true to enable Sentry in development
```

**Important:** 
- The `.env` file should be in the `tenant` directory
- Add `.env` to `.gitignore` to keep your DSN private
- For EAS builds, you'll need to add these as secrets (see Step 5)

## Step 3: Install Dependencies

The Sentry package is already installed. If you need to reinstall:

```bash
cd tenant
npm install @sentry/react-native
```

## Step 4: Configure Sentry

Sentry is already configured in:
- `utils/sentry.ts` - Sentry initialization and utilities
- `utils/logger.ts` - Logger wrapper that sends logs to Sentry
- `app/_layout.tsx` - App initialization with Sentry
- `components/ErrorBoundary.tsx` - Error boundary component

## Step 5: Configure for EAS Builds

For production builds via EAS, you need to add the DSN as a secret:

```bash
# Add Sentry DSN as a secret
eas secret:create --scope project --name EXPO_PUBLIC_SENTRY_DSN --value "https://your-dsn-here@your-org.ingest.sentry.io/your-project-id"

# Verify secrets
eas secret:list
```

## Step 6: Test Sentry

### In Development:

1. Add a test error in your code:
```typescript
import logger from "@/utils/logger";

// Test error logging
logger.error("Test error from Sentry", new Error("This is a test error"));
```

2. Check your Sentry dashboard to see if the error appears

### In Production/TestFlight:

1. The app will automatically capture:
   - Unhandled errors
   - API errors
   - Navigation events
   - User actions (when logged)

2. View errors in your Sentry dashboard

## Usage Examples

### Basic Logging

```typescript
import logger from "@/utils/logger";

// Info log
logger.info("User logged in", { userId: "123" });

// Warning
logger.warn("API rate limit approaching", { remaining: 10 });

// Error
logger.error("Payment failed", error, { paymentId: "pay_123" });
```

### API Error Logging

```typescript
import logger from "@/utils/logger";

try {
  const response = await fetch("/api/endpoint");
  if (!response.ok) {
    throw new Error("API request failed");
  }
} catch (error) {
  logger.apiError("/api/endpoint", error, { requestData });
}
```

### User Action Logging

```typescript
import logger from "@/utils/logger";

const handleButtonPress = () => {
  logger.userAction("Button Pressed", { buttonName: "Submit" });
  // ... your code
};
```

### Navigation Logging

```typescript
import logger from "@/utils/logger";

useEffect(() => {
  logger.navigation(route.name, route.params);
}, [route]);
```

### Direct Sentry Usage

```typescript
import { logError, logInfo, setTag, setContext } from "@/utils/sentry";

// Set tags for filtering
setTag("environment", "production");
setTag("userType", "tenant");

// Set context
setContext("payment", {
  amount: 100,
  currency: "NOK",
});

// Log directly
logError("Critical error", { additionalData: "value" });
logInfo("Important event", { eventData: "value" });
```

## Viewing Logs in Sentry

1. Go to [sentry.io](https://sentry.io)
2. Select your project
3. Navigate to **Issues** to see errors
4. Navigate to **Performance** to see performance metrics
5. Navigate to **Releases** to see release information

## Features

### Automatic Error Tracking
- Unhandled JavaScript errors
- Unhandled promise rejections
- React component errors (via ErrorBoundary)

### User Context
- User ID, email, and username are automatically set when user logs in
- User context is cleared on logout

### Breadcrumbs
- Navigation events
- User actions
- API calls (when configured)

### Performance Monitoring
- App startup time
- Screen load times
- API response times

### Release Tracking
- Track which version of the app has errors
- See error trends per release

## Configuration Options

Edit `utils/sentry.ts` to customize:

- `tracesSampleRate`: Percentage of transactions to trace (0.0 to 1.0)
- `enableAutoSessionTracking`: Track user sessions
- `sessionTrackingIntervalMillis`: How often to track sessions
- `beforeSend`: Filter or modify events before sending

## Troubleshooting

### Logs not appearing in Sentry

1. Check that `EXPO_PUBLIC_SENTRY_DSN` is set correctly
2. Verify internet connection
3. Check Sentry dashboard for rate limits
4. Ensure you're not in Expo Go (Sentry is disabled in Expo Go)

### Too many events

1. Adjust `tracesSampleRate` in `utils/sentry.ts`
2. Filter events in `beforeSend` callback
3. Set up rate limiting in Sentry dashboard

### Missing user context

1. Ensure user is set in Redux store
2. Check that `setSentryUser` is called after login
3. Verify user object has `userId` or `userEmail`

## Best Practices

1. **Don't log sensitive data**: Passwords, tokens, etc. are automatically filtered
2. **Use appropriate log levels**: Use `error` for errors, `warn` for warnings, `info` for important events
3. **Add context**: Include relevant data with logs for easier debugging
4. **Test in development**: Use `EXPO_PUBLIC_SENTRY_ENABLE_IN_DEV=true` to test
5. **Monitor regularly**: Check Sentry dashboard regularly for new issues

## Support

For more information:
- [Sentry React Native Docs](https://docs.sentry.io/platforms/react-native/)
- [Sentry Dashboard](https://sentry.io)


