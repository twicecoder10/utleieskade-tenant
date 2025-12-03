// API URL utility
// This matches the pattern used in inspector app

export const getApiUrl = (): string => {
  // Get API URL from environment variable
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  
  if (!apiUrl) {
    console.warn("API URL not found in environment variables");
    return "";
  }

  // Remove trailing slash if present
  return apiUrl.replace(/\/$/, "");
};

