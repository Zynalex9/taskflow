import { ISingleCardResponse } from "@/types/functionalites.types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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
      providesTags: (_, __, { cardId }) => [
        { type: "singleCard", id: cardId },
      ],
    }),
  }),
});
export const {
  useGetSingleCardQuery,
} = cardApi;