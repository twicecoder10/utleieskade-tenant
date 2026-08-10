import * as Sentry from "@sentry/react-native";
import Constants from "expo-constants";

// Re-export Sentry for direct use
export { Sentry };

// Initialize Sentry
export const initSentry = () => {
  const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;

  if (!dsn) {
    console.warn("Sentry DSN not found. Remote logging disabled.");
    return;
  }

  Sentry.init({
    dsn,
    debug: __DEV__, // Enable debug mode in development
    environment: __DEV__ ? "development" : "production",
    enableInExpoDevelopment: false, // Disable in Expo Go
    tracesSampleRate: __DEV__ ? 1.0 : 0.1, // 100% in dev, 10% in production
    enableAutoSessionTracking: true,
    sessionTrackingIntervalMillis: 30000, // Track sessions every 30 seconds
    enableNativeCrashHandling: true,
    attachStacktrace: true,
    beforeSend(event, hint) {
      // Filter out sensitive data
      if (event.request) {
        // Remove sensitive headers
        if (event.request.headers) {
          delete event.request.headers.Authorization;
          delete event.request.headers["x-api-key"];
        }
        // Remove sensitive query params
        if (event.request.query_string) {
          const queryString = event.request.query_string;
          if (queryString.includes("password") || queryString.includes("token")) {
            event.request.query_string = "[Filtered]";
          }
        }
      }
      return event;
    },
    integrations: [
      new Sentry.ReactNativeTracing({
        enableNativeFramesTracking: !__DEV__,
        enableStallTracking: true,
        enableAppStartTracking: true,
      }),
    ],
  });

  // Set user context if available
  Sentry.setContext("app", {
    version: Constants.expoConfig?.version || "1.0.0",
    buildNumber: Constants.expoConfig?.ios?.buildNumber || "1",
    platform: "ios",
  });
};

// Set user information
export const setSentryUser = (user: {
  id?: string;
  email?: string;
  username?: string;
  [key: string]: any;
}) => {
  Sentry.setUser({
    id: user.id || user.userId,
    email: user.email || user.userEmail,
    username: user.username || `${user.userFirstName} ${user.userLastName}`,
  });
};

// Clear user information
export const clearSentryUser = () => {
  Sentry.setUser(null);
};

// Log an error
export const logError = (error: Error | string, context?: Record<string, any>) => {
  if (error instanceof Error) {
    Sentry.captureException(error, {
      extra: context,
    });
  } else {
    Sentry.captureMessage(error, {
      level: "error",
      extra: context,
    });
  }
};

// Log a warning
export const logWarning = (message: string, context?: Record<string, any>) => {
  Sentry.captureMessage(message, {
    level: "warning",
    extra: context,
  });
};

// Log an info message
export const logInfo = (message: string, context?: Record<string, any>) => {
  Sentry.captureMessage(message, {
    level: "info",
    extra: context,
  });
};

// Add breadcrumb
export const addBreadcrumb = (message: string, category?: string, data?: Record<string, any>) => {
  Sentry.addBreadcrumb({
    message,
    category: category || "default",
    level: "info",
    data,
    timestamp: Date.now() / 1000,
  });
};

// Set additional context
export const setContext = (key: string, context: Record<string, any>) => {
  Sentry.setContext(key, context);
};

// Set tags
export const setTag = (key: string, value: string) => {
  Sentry.setTag(key, value);
};

