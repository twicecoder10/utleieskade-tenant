import baseQueryWithType from "@/store";
import { createApi } from "@reduxjs/toolkit/query/react";

export const filesApi = createApi({
  reducerPath: "filesApi",
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: true,
  baseQuery: baseQueryWithType,
  tagTypes: ["files"],
  endpoints: (builder) => ({
    // uploadFile: builder.mutation({
    //   query: (body) => ({
    //     url: "/files/upload",
    //     method: "POST",
    //     body: { file: body.file }, 
    //   }),
    // }),
    uploadFile: builder.mutation({
      query: (formData) => ({
        url: "/files/upload",
        method: "POST",
        body: formData,
      }),
      transformResponse: (response: any) => {
        return response?.data || response;
      },
      // Explicitly set invalidatesTags to empty array to prevent tag calculation errors
      invalidatesTags: [],
    }),
    

    retrieveFile: builder.query({
      query: (caseId) => ({
        url: `/cases/getCase/${caseId}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useUploadFileMutation, useRetrieveFileQuery } = filesApi;
