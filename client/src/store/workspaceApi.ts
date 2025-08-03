import { IWorkspaceResponse } from "@/types/functionalites.types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const workspaceApi = createApi({
  reducerPath: "workspaceApi",
  tagTypes: ["workspace"],
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getAllWorkspaces: builder.query<IWorkspaceResponse,void>({
      query: () => ({
        url: "/api/workspace/get-workspaces",
      }),
      providesTags: () => [{ type: "workspace" }],
    }),
    createWorkspace: builder.mutation<void, FormData>({
      query: (formData) => ({
        url: "/api/workspace/create-workspace",
        credentials: "include",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: () => [{ type: "workspace" }],
    }),
    deleteWorkspace: builder.mutation({
      query: (body: { workspaceId: string }) => ({
        url: "/api/workspace/delete-workspace",
        credentials: "include",
        method: "DELETE",
        body,
      }),
      invalidatesTags: () => [{ type: "workspace" }],
    }),
  }),
});
export const {
  useGetAllWorkspacesQuery,
  useCreateWorkspaceMutation,
  useDeleteWorkspaceMutation,
} = workspaceApi;
