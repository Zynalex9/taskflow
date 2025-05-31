import {
  IBoard,
  IBoardResponse,
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
      { statusCode: number; newBoard: IBoard; message: string; success: boolean },
      Partial<IBoard> & { workspaceId: string }>({
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
  }),
});

export const {
  useGetAllBoardsQuery,
  useGetSingleBoardQuery,
  useAddBoardMutation,
} = myApi;