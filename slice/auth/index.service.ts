import baseQueryWithType from "@/store";
import { createApi } from "@reduxjs/toolkit/query/react";
import { updateUser } from "../userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const authApi = createApi({
  reducerPath: "authApi",
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: true,
  baseQuery: baseQueryWithType,
  tagTypes: ["profile", "settings"],
  endpoints: (builder) => ({
    // Login Endpoint
    login: builder.mutation({
      query: (body) => ({
        url: "/users/login",
        method: "POST",
        body,
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          const apiResponse = await queryFulfilled;
          const { token, role } = apiResponse?.data?.data;
          await AsyncStorage.setItem("token", token);
          await AsyncStorage.setItem("isLoggedIn", "true");
          await AsyncStorage.setItem("role", role);
          dispatch(updateUser(apiResponse?.data?.data));
        } catch (error) {
          console.error("Login Error:", error);
        }
      },
    }),

    // Register Endpoint
    register: builder.mutation({
      query: (body) => ({
        url: "/users/signup",
        method: "POST",
        body,
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          const apiResponse = await queryFulfilled;
          const { token, role } = apiResponse?.data?.data;
          await AsyncStorage.setItem("token", token);
          await AsyncStorage.setItem("isLoggedIn", "true");
          await AsyncStorage.setItem("role", role);
          dispatch(updateUser(apiResponse?.data?.data)); // Update user state
        } catch (error) {
          console.error("Register Error:", error);
        }
      },
      invalidatesTags: ["profile"],
    }),

    // Forgot Password Endpoint
    forgotPassword: builder.mutation({
      query: (body) => ({
        url: "/users/send-password-reset-email",
        method: "POST",
        body,
      }),
    }),

    // Reset Password Endpoint
    resetPassword: builder.mutation({
      query: ({ token, password }) => ({
        url: `/users/reset-password`,
        method: "PUT",
        body: { password, token },
      }),
    }),

    // Verify Password Reset Link Endpoint
    verifyResetPassword: builder.mutation({
      query: ({ token }) => ({
        url: `/users/verify-password-reset-link`,
        method: "GET",
        body: { token },
      }),
    }),

    // Get User Profile Endpoint
    GetUser: builder.query({
      query: () => ({
        url: "/users/fetchProfile",
        method: "GET",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          const apiResponse = await queryFulfilled;
          dispatch(updateUser(apiResponse?.data?.data)); // Update user state
          await AsyncStorage.setItem(
            "username",
            apiResponse?.data?.data?.handle
          );
        } catch (error) {
          console.error("GetUser Error:", error);
        }
      },
      providesTags: ["profile"],
    }),

    // Update User Profile Endpoint
    updateUser: builder.mutation({
      query: (body) => ({
        url: "/users/update",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["profile"],
    }),

    // Upload Image Endpoint
    uploadImage: builder.mutation({
      query: (body) => ({
        url: "/files/upload",
        method: "POST",
        body,
      }),
    }),

    // Request OTP Endpoint
    requestOtp: builder.mutation({
      query: () => ({
        url: "/otp/request",
        method: "POST",
      }),
    }),

    // Resend OTP Endpoint
    resendOtp: builder.mutation({
      query: () => ({
        url: "/otp/resend",
        method: "POST",
      }),
    }),

    // Verify OTP Endpoint
    verifyOtp: builder.mutation({
      query: () => ({
        url: "/otp/verify",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyResetPasswordMutation,
  useLazyGetUserQuery,
  useGetUserQuery,
  useUploadImageMutation,
  useUpdateUserMutation,
  useRequestOtpMutation,
  useResendOtpMutation,
  useVerifyOtpMutation,
} = authApi;
