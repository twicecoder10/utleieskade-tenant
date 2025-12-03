import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

interface UserState {
  user: Record<string, any> | null;
  isLoggedIn: boolean;
}

const initialState: UserState = {
  user: null,
  isLoggedIn: false,
};

// Async thunk to check authentication
export const checkAuthAsync = createAsyncThunk("user/checkAuth", async (_, { dispatch }) => {
  // Check for token in both possible keys
  const token = await AsyncStorage.getItem("token") || await AsyncStorage.getItem("userToken");
  if (token) {
    dispatch(setLoggedIn(true));
    // Don't navigate here - let the useEffect in _layout.tsx handle navigation
  } else {
    dispatch(setLoggedIn(false));
    // Don't navigate here - let the useEffect in _layout.tsx handle navigation
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: any; token: string }>) => {
      state.user = action.payload.user;
      state.isLoggedIn = true;
      AsyncStorage.setItem("userToken", action.payload.token);
      router.replace("/(tabs)");
    },
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      AsyncStorage.removeItem("userToken");
      router.replace("/auth");
    },
    setLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },
    updateUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload; 
    },
  },
});

export const { login, logout, setLoggedIn, updateUser } = userSlice.actions;
export default userSlice;
