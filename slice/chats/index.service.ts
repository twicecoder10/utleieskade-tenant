import baseQueryWithType from "@/store";
import { createApi } from "@reduxjs/toolkit/query/react";

export const chatApi = createApi({
  reducerPath: "chatApi",
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: true,
  baseQuery: baseQueryWithType,
  endpoints: (builder) => ({
    fetchChats: builder.query({
      query: () => ({
        url: "/chats/fetch-chats",
        method: "GET",
      }),
    }),

    fetchMessages: builder.query({
      query: (conversationId) => ({
        url: `/chats/get-messages/${conversationId}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useFetchChatsQuery, useFetchMessagesQuery } = chatApi;
