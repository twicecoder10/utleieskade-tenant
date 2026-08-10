import { Platform } from "react-native";
import * as Sentry from "./sentry";

type LogLevel = "debug" | "info" | "warn" | "error";

class Logger {
  private isDevelopment = __DEV__;

  private log(level: LogLevel, message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

    // Always log to console in development
    if (this.isDevelopment) {
      switch (level) {
        case "debug":
          console.log(logMessage, data || "");
          break;
        case "info":
          console.info(logMessage, data || "");
          break;
        case "warn":
          console.warn(logMessage, data || "");
          break;
        case "error":
          console.error(logMessage, data || "");
          break;
      }
    }

    // Send to Sentry in production or if explicitly requested
    if (!this.isDevelopment || process.env.EXPO_PUBLIC_SENTRY_ENABLE_IN_DEV === "true") {
      const context = data ? { data, platform: Platform.OS } : { platform: Platform.OS };

      switch (level) {
        case "error":
          Sentry.logError(message, context);
          break;
        case "warn":
          Sentry.logWarning(message, context);
          break;
        case "info":
          Sentry.logInfo(message, context);
          break;
        case "debug":
          // Debug messages don't go to Sentry by default
          break;
      }
    }
  }

  debug(message: string, data?: any) {
    this.log("debug", message, data);
  }

  info(message: string, data?: any) {
    this.log("info", message, data);
    Sentry.addBreadcrumb(message, "info", data);
  }

  warn(message: string, data?: any) {
    this.log("warn", message, data);
  }

  error(message: string, error?: Error | any, data?: any) {
    if (error instanceof Error) {
      this.log("error", message, { error: error.message, stack: error.stack, ...data });
      Sentry.logError(error, { message, ...data });
    } else {
      this.log("error", message, { error, ...data });
      Sentry.logError(message, { error, ...data });
    }
  }

  // Log API errors
  apiError(endpoint: string, error: any, requestData?: any) {
    const errorMessage = `API Error: ${endpoint}`;
    const context = {
      endpoint,
      requestData,
      error: error?.message || error,
      status: error?.status || error?.statusCode,
      response: error?.data || error?.response?.data,
    };

    this.error(errorMessage, error, context);
  }

  // Log user actions
  userAction(action: string, data?: any) {
    this.info(`User Action: ${action}`, data);
    Sentry.addBreadcrumb(action, "user", data);
  }

  // Log navigation
  navigation(route: string, params?: any) {
    this.debug(`Navigation: ${route}`, params);
    Sentry.addBreadcrumb(`Navigated to ${route}`, "navigation", params);
  }
}

export const logger = new Logger();
export default logger;


