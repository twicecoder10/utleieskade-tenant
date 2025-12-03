import baseQueryWithType from "@/store";
import { createApi } from "@reduxjs/toolkit/query/react";

export const chatApi = createApi({
  reducerPath: "chatApi",
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: true,
  baseQuery: baseQueryWithType,
  tagTypes: ["chats", "messages"],
  endpoints: (builder) => ({
    fetchChats: builder.query({
      query: () => ({
        url: "/chats/fetch-chats",
        method: "GET",
      }),
      providesTags: ["chats"],
      // Poll every 5 seconds for real-time updates
      pollingInterval: 5000,
    }),

    fetchMessages: builder.query({
      query: (conversationId) => ({
        url: `/chats/get-messages/${conversationId}`,
        method: "GET",
      }),
      providesTags: (result, error, conversationId) => [
        { type: "messages", id: conversationId },
      ],
      // Poll every 3 seconds for real-time message updates
      pollingInterval: 3000,
    }),

    sendMessage: builder.mutation({
      query: (body) => ({
        url: "/chats/send-message",
        method: "POST",
        body,
      }),
      invalidatesTags: ["chats", "messages"],
    }),

    markAsRead: builder.mutation({
      query: (conversationId) => ({
        url: `/chats/mark-as-read/${conversationId}`,
        method: "PUT",
      }),
      invalidatesTags: ["chats", "messages"],
    }),
  }),
});

export const {
  useFetchChatsQuery,
  useFetchMessagesQuery,
  useSendMessageMutation,
  useMarkAsReadMutation,
} = chatApi;
