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

    getTenantCases: builder.query({
      query: ({ search, status, urgency } = {}) => {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (status) params.append("status", status);
        if (urgency) params.append("urgency", urgency);
        const queryString = params.toString();
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

    getNotifications: builder.query({
      query: ({ page = 1, limit = 20, isRead } = {}) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());
        if (isRead !== undefined) params.append("isRead", isRead.toString());
        return {
          url: `/notifications?${params.toString()}`,
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
} = tenantsApi;
