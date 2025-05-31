import {
  IBoard,
  IBoardResponse,
  IListResponse,
  ISingleBoardResponse,
} from "@/types/functionalites.types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const myApi = createApi({
  reducerPath: "boardApis",
  tagTypes: ["Board"],
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getAllBoards: builder.query<IBoardResponse, string>({
      query: (workspaceId) => `/api/board/${workspaceId}/get-boards`,
      providesTags: (__, _, workspaceId) => [
        { type: "Board", id: workspaceId },
      ],
    }),
    getSingleBoard: builder.query<ISingleBoardResponse, string>({
      query: (boardId) => `/api/board/single/${boardId}`,
    }),
    addBoard: builder.mutation<
      {
        statusCode: number;
        newBoard: IBoard;
        message: string;
        success: boolean;
      },
      Partial<IBoard> & { workspaceId: string }
    >({
      query: (newBoard) => ({
        url: `/api/board/create-board`,
        method: "POST",
        body: newBoard,
      }),
      async onQueryStarted(newBoard, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          myApi.util.updateQueryData(
            "getAllBoards",
            newBoard.workspaceId,
            (draft) => {
              if (draft.data.yourBoards) {
                draft.data.yourBoards.push({
                  ...newBoard,
                  _id: "temp-id",
                  lists: [],
                  cover: newBoard.cover,
                  favourite: false,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  visibility: "private",
                  __v: 0,
                  members: [],
                } as IBoard);
              }
            }
          )
        );

        try {
          const response = await queryFulfilled;

          const createdBoard = response.data?.newBoard;

          dispatch(
            myApi.util.updateQueryData(
              "getAllBoards",
              newBoard.workspaceId,
              (draft) => {
                if (draft.data.yourBoards) {
                  const tempIndex = draft.data.yourBoards.findIndex(
                    (board) => board._id === "temp-id"
                  );

                  if (tempIndex !== -1) {
                    draft.data.yourBoards[tempIndex] = createdBoard;
                  } else {
                    draft.data.yourBoards.push(createdBoard);
                  }
                }
              }
            )
          );
        } catch (error) {
          patchResult.undo();
        }
      },
    }),
    addList: builder.mutation<
      IListResponse,
      { boardId: string; name: string }
    >({
      query: (newList) => ({
        url: "/api/list/create-list",
        method: "POST",
        body: newList,
      }),
      async onQueryStarted(newList, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          myApi.util.updateQueryData(
            "getSingleBoard",
            newList.boardId,
            (draft) => {
              if (draft.data[0]) {
                draft.data[0].lists.push({
                  _id: "temp-list-id",
                  name: newList.name,
                  board: newList.boardId,
                  color: "",
                  cards: [],
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  __v: 0,
                  position: 0,
                  createdBy: "temp-id",
                  isArchived: false,
                });
              }
            }
          )
        );
        try {
          const { data } = await queryFulfilled;
          myApi.util.updateQueryData(
            "getSingleBoard",
            newList.boardId,
            (draft) => {
              if (draft.data[0].lists) {
                const tempIndex = draft.data[0].lists.findIndex(
                  (l) => l._id === "temp-list-id"
                );
                if (tempIndex !== -1) {
                  draft.data[0].lists[tempIndex] = data.newList;
                } else {
                  draft.data[0].lists.push(data.newList);
                }
              }
            }
          );
        } catch (error) {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetAllBoardsQuery,
  useGetSingleBoardQuery,
  useAddBoardMutation,
  useAddListMutation
} = myApi;
