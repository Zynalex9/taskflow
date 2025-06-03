import {
  IChecklist,
  IChecklistItemResponse,
  IChecklistItems,
  IChecklistResponse,
  IComment,
  ICommentResponse,
  ISingleCardResponse,
} from "@/types/functionalites.types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "./store";

export const cardApi = createApi({
  reducerPath: "cardAPIs",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    credentials: "include",
  }),
  tagTypes: ["singleCard"],

  endpoints: (builder) => ({
    getSingleCard: builder.query<ISingleCardResponse, { cardId: string }>({
      query: ({ cardId }) => `/api/card/single-card/${cardId}`,
      providesTags: (_, __, { cardId }) => [{ type: "singleCard", id: cardId }],
    }),
    addComment: builder.mutation<
      ICommentResponse,
      { comment: string; cardId: string }
    >({
      query: (newComment) => ({
        url: "/api/card/add-comment",
        method: "POST",
        body: newComment,
      }),
      invalidatesTags: (_, __, { cardId }) => [
        { type: "singleCard", id: cardId },
      ],
      async onQueryStarted(newComment, { dispatch, queryFulfilled, getState }) {
        const tempId = `temp-comment-id-${Date.now()}`;
        const state = getState() as RootState;
        const user = state.auth.user;
        if (user) {
          const tempComment: IComment = {
            _id: tempId,
            comment: newComment.comment,
            author: user,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          const patchResult = dispatch(
            cardApi.util.updateQueryData(
              "getSingleCard",
              { cardId: newComment.cardId },
              (draft) => {
                draft.data.comments.push(tempComment);
              }
            )
          );
          try {
            const { data } = await queryFulfilled;
            const actualComment = data.newComment;
            dispatch(
              cardApi.util.updateQueryData(
                "getSingleCard",
                {
                  cardId: newComment.cardId,
                },
                (draft) => {
                  const tempIdx = draft.data.comments.findIndex(
                    (c) => c._id === tempId
                  );
                  if (tempIdx !== -1) {
                    draft.data.comments[tempIdx] = actualComment;
                  }
                }
              )
            );
          } catch (error) {
            patchResult.undo();
          }
        }
      },
    }),
    addChecklist: builder.mutation<
      IChecklistResponse,
      { title: string; cardId: string }
    >({
      query: (checklistData) => ({
        url: "/api/card/add-checklist",
        method: "POST",
        body: checklistData,
      }),
      async onQueryStarted(
        checklistData,
        { dispatch, queryFulfilled, getState }
      ) {
        const tempId = `temp-checklist-id-${Date.now()}`;
        const state = getState() as RootState;
        const user = state.auth.user;
        if (!user) return;
        const tempCheckList: IChecklist = {
          _id: tempId,
          card: checklistData.cardId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          items: [],
          createdBy: user._id || "",
          title: checklistData.title,
        };
        const patchResult = dispatch(
          cardApi.util.updateQueryData(
            "getSingleCard",
            { cardId: checklistData.cardId },
            (draft) => {
              draft.data.checklist.push(tempCheckList);
            }
          )
        );
        try {
          const { data } = await queryFulfilled;
          const newChecklist = data.newChecklist;
          dispatch(
            cardApi.util.updateQueryData(
              "getSingleCard",
              {
                cardId: newChecklist.card,
              },
              (draft) => {
                const tempIdx = draft.data.checklist.findIndex(
                  (c) => c._id === tempId
                );
                if (tempIdx !== -1) {
                  draft.data.checklist[tempIdx] = newChecklist;
                }
              }
            )
          );
        } catch (error) {
          patchResult.undo();
        }
      },
    }),
    addItemToCheckList: builder.mutation<
      IChecklistItemResponse,
      { title: string; checkListId: string; cardId: string }
    >({
      query: (item) => ({
        url: `/api/card/checklist/${item.checkListId}/add-items`,
        method: "POST",
        body: item,
      }),
      async onQueryStarted(item, { dispatch, queryFulfilled, getState }) {
        const tempId = `temp-item-id-${Date.now()}`;
        const state = getState() as RootState;
        const user = state.auth.user;
        if (!user) return;
        const tempItem: IChecklistItems = {
          _id: tempId,
          assignedTo: [],
          completed: false,
          createdBy: user._id,
          title: item.title,
        };
        const patchResult = dispatch(
          cardApi.util.updateQueryData(
            "getSingleCard",
            { cardId: item.cardId },
            (draft) => {
              const checklist = draft.data.checklist.find(
                (c) => c._id === item.checkListId
              );
              if (checklist) {
                checklist.items.push(tempItem);
              }
            }
          )
        );
        try {
          const { data } = await queryFulfilled;
          const newItem = data.checkList.items[data.checkList.items.length - 1];
          dispatch(
            cardApi.util.updateQueryData(
              "getSingleCard",
              { cardId: item.cardId },
              (draft) => {
                const checklist = draft.data.checklist.find(
                  (c) => c._id === item.checkListId
                );
                if (checklist) {
                  const tempIdx = checklist.items.findIndex(
                    (i) => i._id === tempId
                  );
                  if (tempIdx !== -1) {
                    checklist.items[tempIdx] = newItem;
                  }
                }
              }
            )
          );
        } catch (error) {
          console.log(error)
          patchResult.undo();
        }
      },
    }),
  }),
});
export const {
  useGetSingleCardQuery,
  useAddCommentMutation,
  useAddChecklistMutation,
  useAddItemToCheckListMutation,
} = cardApi;
