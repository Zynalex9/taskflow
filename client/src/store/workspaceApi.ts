import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const workspaceApi = createApi({
  reducerPath: "workspaceApi",
  tagTypes: ["workspace"],
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getAllWorkspaces: builder.query({
      query: () => ({
        url: "/api/workspace/get-workspaces",
      }),
      providesTags: () => [{ type: "workspace" }],
    }),
  }),
});
export const { useGetAllWorkspacesQuery } = workspaceApi;
