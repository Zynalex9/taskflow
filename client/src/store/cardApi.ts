import {
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
  }),
});
export const { useGetSingleCardQuery, useAddCommentMutation } = cardApi;
