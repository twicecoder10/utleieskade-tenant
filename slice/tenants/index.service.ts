import baseQueryWithType from "@/store";
import { createApi } from "@reduxjs/toolkit/query/react";

export const tenantsApi = createApi({
  reducerPath: "tenantsApi",
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: true,
  baseQuery: baseQueryWithType,
  tagTypes: ["cases", "dashboard"],
  endpoints: (builder) => ({
    getDashboardData: builder.query({
      query: () => ({
        url: "/tenants/dashboard",
        method: "GET",
      }),
      providesTags: ["dashboard"],
    }),

    getTenantCases: builder.query({
      query: () => ({
        url: "/tenants/getCases",
        method: "GET",
      }),
      providesTags: ["cases"],
    }),

    getTenantSettings: builder.query({
      query: () => ({
        url: "/tenants/settings",
        method: "GET",
      }),
    }),

    updateTenantSettings: builder.mutation({
      query: () => ({
        url: "/tenants/settings",
        method: "PUT",
      }),
    }),
  }),
});

export const { useGetDashboardDataQuery, useGetTenantCasesQuery, useGetTenantSettingsQuery, useUpdateTenantSettingsMutation } = tenantsApi;
