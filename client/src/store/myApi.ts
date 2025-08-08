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
  tagTypes: ["Board", "singleBoard"],
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
      providesTags: (__, _, workspaceId) => [
        { type: "singleBoard", id: workspaceId },
      ],
    }),
    addBoard: builder.mutation({
      query: (newBoard) => ({
        url: `/api/board/create-board`,
        method: "POST",
        body: newBoard,
      }),
      invalidatesTags: (_, __, newBoard) => [
        { type: "Board", id: newBoard.workspaceId },
      ],
      async onQueryStarted(newBoard, { dispatch, queryFulfilled }) {
        const tempId = `temp-${Date.now()}`;

        const patchResult = dispatch(
          myApi.util.updateQueryData(
            "getAllBoards",
            newBoard.workspaceId,
            (draft) => {
              draft.data.yourBoards.push({
                ...newBoard,
                _id: tempId,
                lists: [],
                favourite: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                __v: 0,
              } as IBoard);
            }
          )
        );

        try {
          const { data } = await queryFulfilled;
          const createdBoard = data.newBoard;

          dispatch(
            myApi.util.updateQueryData(
              "getAllBoards",
              newBoard.workspaceId,
              (draft) => {
                const tempIndex = draft.data.yourBoards.findIndex(
                  (b) => b._id === tempId
                );
                if (tempIndex !== -1) {
                  draft.data.yourBoards.splice(tempIndex, 1);
                }

                const exists = draft.data.yourBoards.some(
                  (b) => b._id === createdBoard._id
                );

                if (!exists) {
                  draft.data.yourBoards.push(createdBoard);
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
          let tempId = `list-id-${Date.now()}`;
          const patchResult = dispatch(
            myApi.util.updateQueryData(
              "getSingleBoard",
              newList.boardId,
              (draft) => {
                if (draft.data) {
                  draft.data.lists.push({
                    _id: tempId,
                    name: newList.name,
                    board: newList.boardId,
                    color: "",
                    cards: [] as ICard[],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    __v: 0,
                    position: 0,
                    createdBy: tempId,
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
                  const tempIndex = draft.data.lists.findIndex(
                    (l) => l._id === tempId
                  );
                  if (tempIndex !== -1) {
                    draft.data.lists.splice(tempIndex, 1);
                  }
                  const exists = draft.data.lists.some(
                    (l) => l._id === data.newList._id
                  );
                  if (!exists) {
                    draft.data.lists.push(data.newList);
                  }
                }
              )
            );
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
              const list = draft.data.lists.find(
                (l) => l._id === newCardParams.listId
              );
              if (list) {
                (list.cards as ICard[]).push({
                  _id: "temp-card-id",
                  name: newCardParams.name,
                  description: "",
                  startDate: new Date().toISOString(),
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
                const list = draft.data.lists.find(
                  (l) =>
                    l._id ===
                    (typeof newCard.list === "string"
                      ? newCard.list
                      : newCard.list._id)
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
    toggleFavourite: builder.mutation({
      query: (boardId) => ({
        url: "/api/board/toggle-favourite",
        method: "PATCH",
        body: { boardId },
      }),
      async onQueryStarted(boardId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          myApi.util.updateQueryData("getSingleBoard", boardId, (draft) => {
            draft.data.favourite = !draft.data.favourite;
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    updateVisibility: builder.mutation({
      query: ({ boardId, visibility }) => ({
        url: `/api/board/update-visibility/${boardId}`,
        method: "PATCH",
        body: { visibility },
      }),
      invalidatesTags: (_, __, { boardId }) => [{ type: "Board", id: boardId }],
    }),
    updateBoardCover: builder.mutation({
      query: ({ boardId, cover }) => {
        if (cover instanceof FormData) {
          return {
            url: `/api/board/update-cover/${boardId}`,
            method: "PATCH",
            body: cover,
          };
        }

        return {
          url: `/api/board/update-cover/${boardId}`,
          method: "PATCH",
          body: { cover },
          headers: {
            "Content-Type": "application/json",
          },
        };
      },

      invalidatesTags: (_, __, { boardId }) => [
        { type: "singleBoard", id: boardId },
      ],
    }),
    deleteBoard: builder.mutation({
      query: (boardId) => ({
        url: `/api/board/${boardId}/delete-board`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, { boardId }) => [
        { type: "Board", id: boardId },
        { type: "singleBoard", id: boardId },
      ],
      async onQueryStarted(boardId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          myApi.util.updateQueryData("getAllBoards", boardId, (draft) => {
            draft.data.yourBoards = draft.data.yourBoards.filter(
              (board) => board._id !== boardId
            );
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    addBoardDescription: builder.mutation({
      query: (body: { description: string; boardId: string }) => ({
        url: "/api/board/add-description",
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_, __, { boardId }) => [
        { type: "singleBoard", id: boardId },
      ],
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          myApi.util.updateQueryData(
            "getSingleBoard",
            body.boardId,
            (draft) => {
              draft.data = {
                ...draft.data,
                description: body.description,
              };
            }
          )
        );
        try {
          await queryFulfilled;
        } catch (error) {
          console.log(error);
          patchResult.undo();
        }
      },
    }),
    moveList: builder.mutation({
      query: (body: {
        currentBoardId: string;
        listId: string;
        targetedBoardId: string;
      }) => ({
        url: "/api/list/move-list",
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_, __, { currentBoardId }) => [
        { type: "singleBoard", id: currentBoardId },
      ],
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          myApi.util.updateQueryData(
            "getSingleBoard",
            body.currentBoardId,
            (draft) => {
              draft.data.lists = draft.data.lists.filter(
                (list) => list._id !== body.listId
              );
            }
          )
        );
        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
        }
      },
    }),
    deleteList: builder.mutation({
      query: (body: {
        listId: string;
        workspaceId: string;
        boardId: string;
      }) => ({
        url: `/api/list/${body.workspaceId}/${body.listId}/delete-list`,
        method: "DELETE",
        body: { listId: body.listId },
        credentials: "include",
      }),
      invalidatesTags: (_, __, { boardId }) => [
        { type: "singleBoard", id: boardId },
      ],
      async onQueryStarted({ listId, boardId }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          myApi.util.updateQueryData("getSingleBoard", boardId, (draft) => {
            draft.data.lists = draft.data.lists.filter(
              (list) => list._id !== listId
            );
          })
        );
        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
        }
      },
    }),
    copyListIntoNewList: builder.mutation({
      query: (body: { listId: string; boardId: string }) => ({
        url: `/api/list/copy-list-new`,
        method: "POST",
        credentials: "include",
        body,
      }),
      invalidatesTags: (_, __, { boardId }) => [
        { type: "singleBoard", id: boardId },
      ],
    }),
    addBoardMember: builder.mutation({
      query: (body: { boardId: string; targetedId: string,workspaceId:string }) => ({
        url: `/api/board/add-member`,
        body,
        method: "PATCH",
        credentials: "include",
      }),
      invalidatesTags: (_, __, { boardId }) => [
        { type: "singleBoard", id: boardId },
      ],
    }),

  }),
});

export const {
  useGetAllBoardsQuery,
  useGetSingleBoardQuery,
  useAddBoardMutation,
  useAddListMutation,
  useAddCardMutation,
  useToggleFavouriteMutation,
  useUpdateVisibilityMutation,
  useUpdateBoardCoverMutation,
  useDeleteBoardMutation,
  useAddBoardDescriptionMutation,
  useMoveListMutation,
  useDeleteListMutation,
  useCopyListIntoNewListMutation,
  useAddBoardMemberMutation
} = myApi;
