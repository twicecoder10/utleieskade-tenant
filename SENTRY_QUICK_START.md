# Sentry Quick Start

## ✅ Setup Complete!

Sentry has been installed and configured. You just need to add your DSN.

## Step 1: Get Your Sentry DSN

1. Go to [sentry.io](https://sentry.io) and create an account (free tier available)
2. Create a new project → Select **React Native**
3. Copy your DSN (looks like: `https://xxxxx@xxxxx.ingest.sentry.io/xxxxx`)

## Step 2: Add DSN to Environment

Create a `.env` file in the `tenant` directory:

```bash
EXPO_PUBLIC_SENTRY_DSN=https://your-dsn-here@your-org.ingest.sentry.io/your-project-id
```

## Step 3: For EAS Builds (TestFlight/Production)

Add the DSN as a secret:

```bash
eas secret:create --scope project --name EXPO_PUBLIC_SENTRY_DSN --value "https://your-dsn-here@your-org.ingest.sentry.io/your-project-id"
```

## That's It! 🎉

Sentry will now automatically:
- ✅ Capture unhandled errors
- ✅ Track user sessions
- ✅ Log API errors
- ✅ Monitor performance
- ✅ Set user context on login

## View Logs

Go to [sentry.io](https://sentry.io) → Your Project → **Issues** to see errors and logs.

## Usage Examples

```typescript
import logger from "@/utils/logger";

// Log errors
logger.error("Payment failed", error, { paymentId: "123" });

// Log info
logger.info("User logged in", { userId: "123" });

// Log API errors
logger.apiError("/api/endpoint", error, { requestData });
```

See `SENTRY_SETUP.md` for full documentation.


