import baseQueryWithType from "@/store";
import { createApi } from "@reduxjs/toolkit/query/react";

export const casesApi = createApi({
  reducerPath: "casesApi",
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: true,
  baseQuery: baseQueryWithType,
  tagTypes: ["cases", "receipts", "dashboard"],
  endpoints: (builder) => ({
    reportCases: builder.mutation({
      query: (body) => ({
        url: "/cases/report",
        method: "POST",
        body,
      }),
      invalidatesTags: ["cases"],
    }),

    getCaseDetails: builder.query({
      query: (caseId) => ({
        url: `/cases/getCase/${caseId}`,
        method: "GET",
      }),
      providesTags: (result, error, caseId) => [{ type: "cases", id: caseId }],
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
        responseHandler: async (response: any) => {
          // In React Native, we'll return the URL instead of the blob
          // The actual download will be handled by Linking.openURL
          const apiUrl = process.env.EXPO_PUBLIC_API_URL || "https://utleieskade-api2-production-2915.up.railway.app";
          return `${apiUrl}/tenants/receipts/${receiptId}/download`;
        },
      }),
      // Don't cache blob responses - they're not serializable
      keepUnusedDataFor: 0,
    }),

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
      invalidatesTags: ["cases", "receipts", "dashboard"],
    }),
  }),
});

export const {
  useReportCasesMutation,
  useGetCaseDetailsQuery,
  useGetReceiptsQuery,
  useLazyDownloadReceiptQuery,
  useCreatePaymentIntentMutation,
  useConfirmPaymentMutation,
} = casesApi;
