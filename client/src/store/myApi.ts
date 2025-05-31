import {
  IBoard,
  IBoardResponse,
  ICard,
  ICardResponse,
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
    addList: builder.mutation<IListResponse, { boardId: string; name: string }>(
      {
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
                    cards: [] as ICard[],
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
            dispatch(
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
            ));
          } catch (error) {
            patchResult.undo();
          }
        },
      }
    ),
addCard: builder.mutation<
  ICardResponse,
  { boardId: string; listId: string; name: string }
>({
  query: (newCardParams) => ({
    url: "/api/workspace/create-card",
    method: "POST",
    body: newCardParams,
  }),

  async onQueryStarted(newCardParams, { dispatch, queryFulfilled }) {
    const patchResult = dispatch(
      myApi.util.updateQueryData(
        "getSingleBoard",
        newCardParams.boardId,
        (draft) => {
          const list = draft.data[0].lists.find(
            (l) => l._id === newCardParams.listId
          );
          if (list) {
            (list.cards as ICard[]).push({
              _id: "temp-card-id",
              name: newCardParams.name,
              description: "",
              endDate: new Date().toISOString(),
              createdBy: "6831e098d6f0ccbee9895831", 
              members: [],
              list: newCardParams.listId,
              comments: [],
              labels: [],
              cover: "#000000",
              priority: "",
              checklist: [],
              checked: false,
              attachments: [],
              position: list.cards.length, 
              __v: 0,
            });
          }
        }
      )
    );

    try {
      const { data } = await queryFulfilled;
      const newCard = data.newCard;

      dispatch(
        myApi.util.updateQueryData(
          "getSingleBoard",
          newCardParams.boardId,
          (draft) => {
            const list = draft.data[0].lists.find(
              (l) => l._id === (typeof newCard.list === "string" ? newCard.list : newCard.list._id)
            );
            if (list) {
              const tempIndex = (list.cards as ICard[]).findIndex(
                (c) => c._id === "temp-card-id"
              );
              if (tempIndex !== -1) {
                (list.cards as ICard[])[tempIndex] = newCard;
              } else {
                (list.cards as ICard[]).push(newCard);
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
  useAddListMutation,
  useAddCardMutation
} = myApi;
