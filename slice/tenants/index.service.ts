import baseQueryWithType from "@/store";
import { createApi } from "@reduxjs/toolkit/query/react";

export const tenantsApi = createApi({
  reducerPath: "tenantsApi",
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: true,
  baseQuery: baseQueryWithType,
  tagTypes: ["cases", "dashboard", "notifications"],
  endpoints: (builder) => ({
    getDashboardData: builder.query({
      query: () => ({
        url: "/tenants/dashboard",
        method: "GET",
      }),
      providesTags: ["dashboard"],
    }),

    getTenantCases: builder.query<any, { search?: string; status?: string; urgency?: string } | void>({
      query: (queryParams = {}) => {
        const { search, status, urgency } = queryParams || {};
        const urlParams = new URLSearchParams();
        if (search) urlParams.append("search", search);
        if (status) urlParams.append("status", status);
        if (urgency) urlParams.append("urgency", urgency);
        const queryString = urlParams.toString();
        return {
          url: `/tenants/getCases${queryString ? `?${queryString}` : ""}`,
          method: "GET",
        };
      },
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

    getNotifications: builder.query<any, { page?: number; limit?: number; isRead?: boolean } | void>({
      query: (queryParams = {}) => {
        const { page = 1, limit = 20, isRead } = queryParams || {};
        const urlParams = new URLSearchParams();
        urlParams.append("page", page.toString());
        urlParams.append("limit", limit.toString());
        if (isRead !== undefined) urlParams.append("isRead", isRead.toString());
        return {
          url: `/notifications?${urlParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["notifications"],
    }),

    getUnreadNotificationCount: builder.query({
      query: () => ({
        url: "/notifications/unread-count",
        method: "GET",
      }),
      providesTags: ["notifications"],
    }),

    markNotificationAsRead: builder.mutation({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["notifications"],
    }),

    getTenantPayments: builder.query({
      query: () => ({
        url: "/tenants/payments",
        method: "GET",
      }),
      providesTags: ["payments"],
    }),
  }),
});

export const { 
  useGetDashboardDataQuery, 
  useGetTenantCasesQuery, 
  useGetTenantSettingsQuery, 
  useUpdateTenantSettingsMutation,
  useGetNotificationsQuery,
  useGetUnreadNotificationCountQuery,
  useMarkNotificationAsReadMutation,
  useGetTenantPaymentsQuery,
} = tenantsApi;
