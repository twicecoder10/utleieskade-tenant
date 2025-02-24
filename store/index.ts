import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiUrl = process.env.EXPO_PUBLIC_API_URL; 

const baseQuery = fetchBaseQuery({
  baseUrl: apiUrl, 
  prepareHeaders: async (headers) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    } catch (error) {
      console.error("Error fetching token:", error);
    }

    headers.set("Accept", "application/json");
  },
  credentials: "include",
});

export default baseQuery;
