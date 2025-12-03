import { authApi } from "@/slice/auth/index.service";
import { casesApi } from "@/slice/cases/index.service";
import { chatApi } from "@/slice/chats/index.service";
import { tenantsApi } from "@/slice/tenants/index.service";
import { paymentsApi } from "@/slice/payments/index.service";
import { filesApi } from "@/slice/files/index.service";
import userSlice from "@/slice/userSlice";
import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [tenantsApi.reducerPath]: tenantsApi.reducer,
    [casesApi.reducerPath]: casesApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
    [paymentsApi.reducerPath]: paymentsApi.reducer,
    [filesApi.reducerPath]: filesApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      authApi.middleware,
      tenantsApi.middleware,
      casesApi.middleware,
      chatApi.middleware,
      paymentsApi.middleware,
      filesApi.middleware,
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
