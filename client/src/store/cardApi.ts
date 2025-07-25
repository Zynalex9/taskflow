import {
  IAddDateResponse,
  IChecklist,
  IChecklistItemResponse,
  IChecklistItems,
  IChecklistResponse,
  IComment,
  ICommentResponse,
  ILabelsResponse,
  ISingleCardResponse,
} from "@/types/functionalites.types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "./store";
import { syncBoardtoCard, syncBoardtoLabels } from "@/utils/SyncCache";

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
          console.log(error);
          patchResult.undo();
        }
      },
    }),
    addAttachment: builder.mutation({
      query: ({
        uploadedFile,
        cardId,
      }: {
        uploadedFile: File;
        cardId: string;
      }) => {
        const formData = new FormData();
        formData.append("uploadedFile", uploadedFile);
        formData.append("cardId", cardId);

        return {
          url: "/api/card/add-attachment",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: (_, __, { cardId }) => [
        { type: "singleCard", id: cardId },
      ],
    }),
    addCardDate: builder.mutation<
      IAddDateResponse,
      {
        startDate?: string | undefined;
        endDate?: string | undefined;
        cardId: string;
      }
    >({
      query: (body) => ({
        url: "/api/card/add-date",
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_, __, { cardId }) => [
        { type: "singleCard", id: cardId },
      ],
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          cardApi.util.updateQueryData(
            "getSingleCard",
            { cardId: body.cardId },
            (draft) => {
              draft.data = {
                ...draft.data,
                startDate: body.startDate || draft.data.startDate,
                endDate: body.endDate || draft.data.endDate,
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
    addDescription: builder.mutation({
      query: (body: { description: string; cardId: string }) => ({
        url: "/api/card/add-description",
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_, __, { cardId }) => [
        { type: "singleCard", id: cardId },
      ],
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          cardApi.util.updateQueryData(
            "getSingleCard",
            { cardId: body.cardId },
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
    addLabels: builder.mutation<
      ILabelsResponse,
      {
        cardId: string;
        boardId: string;
        labels: { name?: string; color: string }[];
      }
    >({
      query: (body) => ({
        url: "/api/card/add-label",
        method: "POST",
        body,
      }),
      invalidatesTags: (_, __, { cardId }) => [
        { type: "singleCard", id: cardId },
      ],
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        const tempLabels = body.labels.map((label, index) => ({
          _id: `temp-id-${Date.now()}-${index}`,
          card: body.cardId,
          color: label.color,
          name: label.name || "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));

        const patchResult = dispatch(
          cardApi.util.updateQueryData(
            "getSingleCard",
            { cardId: body.cardId },
            (draft) => {
              draft.data.labels.push(...tempLabels);
            }
          )
        );

        syncBoardtoLabels(dispatch, body.cardId, body.boardId, tempLabels);

        try {
          const { data } = await queryFulfilled;
          const realLabels = data.labels;

          dispatch(
            cardApi.util.updateQueryData(
              "getSingleCard",
              { cardId: body.cardId },
              (draft) => {
                draft.data.labels = draft.data.labels.filter(
                  (label) => !label._id.startsWith("temp-id")
                );

                draft.data.labels.push(...realLabels);
              }
            )
          );
        } catch {
          patchResult.undo();
        }
      },
    }),
    ToggleComplete: builder.mutation({
      query: (body: {
        cardId: string;
        isComplete: boolean;
        boardId: string;
      }) => ({
        url: "/api/card/toggle-complete",
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_, __, { cardId }) => [
        { type: "singleCard", id: cardId },
      ],
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          cardApi.util.updateQueryData(
            "getSingleCard",
            { cardId: body.cardId },
            (draft) => {
              draft.data = {
                ...draft.data,
                checked: body.isComplete,
              };
            }
          )
        );
        syncBoardtoCard(dispatch, body.cardId, body.boardId, {
          checked: body.isComplete,
        });
        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
          syncBoardtoCard(dispatch, body.cardId, body.boardId, {
            checked: !body.isComplete,
          });
        }
      },
    }),
    ToggleCheckListItemComplete: builder.mutation({
      query: (body: {
        cardId: string;
        itemId: string;
        checklistId: string;
      }) => ({
        url: `/api/card/checklist/toggle/${body.checklistId}/${body.itemId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_, __, { cardId }) => [
        { type: "singleCard", id: cardId },
      ],
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          cardApi.util.updateQueryData(
            "getSingleCard",
            { cardId: body.cardId },
            (draft) => {
              const checklist = draft.data.checklist.find(
                (c) => c._id === body.checklistId
              );
              if (!checklist) return;
              const item = checklist.items.find((i) => i._id === body.itemId);
              if (item) {
                item.completed = !item.completed;
              }
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
    joinCard: builder.mutation({
      query: (body: { cardId: string; userId: string }) => ({
        url: "/api/card/join-card",
        method: "POST",
        credentials: "include",
        body,
      }),
      invalidatesTags: (_, __, { cardId }) => [
        { type: "singleCard", id: cardId },
      ],
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          cardApi.util.updateQueryData(
            "getSingleCard",
            { cardId: body.cardId },
            (draft) => {
              (draft.data.members as string[]).push(body.userId);
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
    leaveCard: builder.mutation({
      query: (body: { cardId: string; userId: string }) => ({
        url: "/api/card/leave-card",
        method: "POST",
        credentials: "include",
        body,
      }),
      invalidatesTags: (_, __, { cardId }) => [
        { type: "singleCard", id: cardId },
      ],
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          cardApi.util.updateQueryData(
            "getSingleCard",
            { cardId: body.cardId },
            (draft) => {
              (draft.data.members as string[]) = (
                draft.data.members as string[]
              ).filter((m) => m !== body.userId);
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
    deleteChecklist: builder.mutation({
      query: (body: { checkListId: string; cardId: string }) => ({
        url: "/api/card/delete-checklist",
        credentials: "include",
        body,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, { cardId }) => [
        { type: "singleCard", id: cardId },
      ],
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          cardApi.util.updateQueryData(
            "getSingleCard",
            { cardId: body.cardId },
            (draft) => {
              draft.data.checklist = draft.data.checklist.filter(
                (c) => c._id !== body.checkListId
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
    deleteItem: builder.mutation({
      query: (body: {
        checkListId: string;
        cardId: string;
        itemId: string;
      }) => ({
        url: "/api/card/delete-checklist-item",
        credentials: "include",
        body,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, { cardId }) => [
        { type: "singleCard", id: cardId },
      ],
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          cardApi.util.updateQueryData(
            "getSingleCard",
            { cardId: body.cardId },
            (draft) => {
              draft.data.checklist = draft.data.checklist.map((checklist) =>
                checklist._id === body.checkListId
                  ? {
                      ...checklist,
                      items: checklist.items.filter(
                        (item) => item._id !== body.itemId
                      ),
                    }
                  : checklist
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
  }),
});
export const {
  useGetSingleCardQuery,
  useAddCommentMutation,
  useAddChecklistMutation,
  useAddItemToCheckListMutation,
  useAddAttachmentMutation,
  useAddCardDateMutation,
  useAddDescriptionMutation,
  useAddLabelsMutation,
  useToggleCompleteMutation,
  useToggleCheckListItemCompleteMutation,
  useJoinCardMutation,
  useLeaveCardMutation,
  useDeleteChecklistMutation,
  useDeleteItemMutation,
} = cardApi;
