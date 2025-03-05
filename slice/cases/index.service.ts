import baseQueryWithType from "@/store";
import { createApi } from "@reduxjs/toolkit/query/react";

export const casesApi = createApi({
  reducerPath: "casesApi",
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: true,
  baseQuery: baseQueryWithType,
  endpoints: (builder) => ({
    reportCases: builder.mutation({
      query: (body) => ({
        url: "/cases/report",
        method: "POST",
        body,
      }),
    }),

    getCaseDetails: builder.query({
      query: (caseId) => ({
        url: `/cases/getCase/${caseId}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useReportCasesMutation, useGetCaseDetailsQuery } = casesApi;
