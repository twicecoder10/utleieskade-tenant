import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiUrl = process.env.EXPO_PUBLIC_API_URL || "http://192.168.0.227:3000";

// Log API URL for debugging (remove in production)
console.log("🌐 API URL:", apiUrl);

const baseQuery = fetchBaseQuery({
  baseUrl: apiUrl, 
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
    }
  },
  credentials: "include",
});

export default baseQuery;
