import {  IBoardResponse, ISingleBoardResponse } from "@/types/functionalites.types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const myApi = createApi({
  reducerPath: "boardApis",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getAllBoards: builder.query<IBoardResponse, string>({
      query: (workspaceId) => `/api/board/${workspaceId}/get-boards`,
    }),
    getSingleBoard: builder.query<ISingleBoardResponse, string>({
      query: (boardId) => `/api/board/single/${boardId}`,
    }),
  }),
});
export const { useGetAllBoardsQuery, useGetSingleBoardQuery } = myApi;
