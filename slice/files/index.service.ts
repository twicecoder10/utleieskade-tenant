import baseQueryWithType from "@/store";
import { createApi } from "@reduxjs/toolkit/query/react";

export const casesApi = createApi({
  reducerPath: "casesApi",
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: true,
  baseQuery: baseQueryWithType,
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
        formData: true, 
      }),
    }),
    

    retrieveFile: builder.query({
      query: (caseId) => ({
        url: `/cases/getCase/${caseId}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useUploadFileMutation, useRetrieveFileQuery } = casesApi;
