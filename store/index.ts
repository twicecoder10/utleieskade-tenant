import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiUrl = process.env.EXPO_PUBLIC_API_URL || "https://utleieskade-api2-production-2915.up.railway.app";

// Log API URL for debugging (remove in production)
console.log("🌐 API URL:", apiUrl);

const baseQuery = fetchBaseQuery({
  baseUrl: apiUrl,
  timeout: 30000, // 30 seconds timeout
  prepareHeaders: async (headers, { getState, extra, endpoint, type, forced }) => {
    try {
      // Check both token keys for compatibility
      const token = await AsyncStorage.getItem("token") || await AsyncStorage.getItem("userToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    } catch (error) {
      console.error("Error fetching token:", error);
    }

    // RTK Query automatically handles FormData - don't set Content-Type for it
    // Only set Accept for non-FormData requests
    if (!(headers.get("Content-Type")?.includes("multipart/form-data"))) {
      headers.set("Accept", "application/json");
      headers.set("Content-Type", "application/json");
    }
  },
  credentials: "include",
});

// Enhanced error handling wrapper
const baseQueryWithErrorHandling = async (args: any, api: any, extraOptions: any) => {
  try {
    const result = await baseQuery(args, api, extraOptions);
    
    // Log fetch errors for debugging
    if (result.error) {
      console.error("🌐 API Error Details:", {
        status: (result.error as any).status,
        data: (result.error as any).data,
        error: (result.error as any).error,
        endpoint: args?.url,
        baseUrl: apiUrl,
      });
    }
    
    return result;
  } catch (error: any) {
    console.error("🌐 Fetch Error:", {
      message: error?.message,
      stack: error?.stack,
      endpoint: args?.url,
      baseUrl: apiUrl,
    });
    return {
      error: {
        status: "FETCH_ERROR",
        data: error?.message || "Network request failed",
        error: "Unable to connect to server. Please check your internet connection.",
      },
    };
  }
};

// Export with the name expected by other files
const baseQueryWithType = baseQueryWithErrorHandling;
export default baseQueryWithType;
