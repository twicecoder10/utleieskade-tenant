import baseQueryWithType from "@/store";
import { createApi } from "@reduxjs/toolkit/query/react";

export const paymentsApi = createApi({
  reducerPath: "paymentsApi",
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: true,
  baseQuery: baseQueryWithType,
  tagTypes: ["payments", "receipts", "cases", "dashboard"],
  endpoints: (builder) => ({
    createPaymentIntent: builder.mutation({
      query: (body) => ({
        url: "/payments/create-intent",
        method: "POST",
        body,
      }),
    }),

    confirmPayment: builder.mutation({
      query: (body) => ({
        url: "/payments/confirm",
        method: "POST",
        body,
      }),
      invalidatesTags: ["payments", "receipts", "cases", "dashboard"],
    }),

    getPaymentHistory: builder.query({
      query: ({ page = 1, limit = 20 }) => ({
        url: `/payments/history?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["payments"],
    }),

    getReceipts: builder.query({
      query: () => ({
        url: "/tenants/receipts",
        method: "GET",
      }),
      providesTags: ["receipts"],
    }),

    downloadReceipt: builder.query({
      query: (receiptId) => ({
        url: `/tenants/receipts/${receiptId}/download`,
        method: "GET",
        responseHandler: async (response) => {
          // In React Native, we'll return the URL instead of the blob
          // The actual download will be handled by Linking.openURL
          const apiUrl = process.env.EXPO_PUBLIC_API_URL || "https://utleieskade-api2-production-2915.up.railway.app";
          return `${apiUrl}/tenants/receipts/${receiptId}/download`;
        },
      }),
      // Don't cache blob responses - they're not serializable
      keepUnusedDataFor: 0,
    }),
  }),
});

export const {
  useCreatePaymentIntentMutation,
  useConfirmPaymentMutation,
  useGetPaymentHistoryQuery,
  useGetReceiptsQuery,
  useLazyDownloadReceiptQuery,
} = paymentsApi;

