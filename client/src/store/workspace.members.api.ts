import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const workspaceMembersApi = createApi({
  reducerPath: "workspaceMembersApi",
  tagTypes: ["workspaceMembers", "workspaceMember"],
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_URL}/api/workspace`,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getWorkspaceMembers: builder.query({
      query: (workspaceId) => `/get-members/${workspaceId}`,
      providesTags: () => [
        { type: "workspaceMembers" },
        { type: "workspaceMember" },
      ],
    }),
    addWorkspaceAdmin: builder.mutation({
      query: (body: { workspaceId: string; adminId: string }) => ({
        url: `/add-admin`,
        method: "PATCH",
        body,
        credentials: "include",
      }),
      invalidatesTags: () => [
        { type: "workspaceMembers" },
        { type: "workspaceMember" },
      ],
    }),
    addWorkspaceMember: builder.mutation({
      query: (body: { workspaceId: string; memberCredentials: string }) => ({
        url: `/add-member`,
        method: "PATCH",
        body,
        credentials: "include",
      }),
      invalidatesTags: () => [
        { type: "workspaceMembers" },
        { type: "workspaceMember" },
      ],
    }),
  }),
});
export const {
  useGetWorkspaceMembersQuery,
  useAddWorkspaceAdminMutation,
  useAddWorkspaceMemberMutation,
} = workspaceMembersApi;
