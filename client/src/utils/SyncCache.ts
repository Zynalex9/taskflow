import { myApi } from "@/store/myApi";
import { AppDispatch } from "@/store/store";
import { ICard } from "@/types/functionalites.types";

export const syncBoardtoCard = async (
  dispatch: AppDispatch,
  cardId: string,
  boardId: string,
  updatedCardData: Partial<ICard>
) => {
  dispatch(
    myApi.util.updateQueryData("getSingleBoard", boardId, (draft) => {
      for (const list of draft.data.lists) {
        const card = list.cards.find((card) => card._id === cardId);
        if (card) {
          Object.assign(card, updatedCardData);
        }
      }
    })
  );
};
