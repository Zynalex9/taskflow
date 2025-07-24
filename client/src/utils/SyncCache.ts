import { myApi } from "@/store/myApi";
import { AppDispatch } from "@/store/store";
import { ICard, ILabel } from "@/types/functionalites.types";

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
export const syncBoardtoLabels = async (
  dispatch: AppDispatch,
  cardId: string,
  boardId: string,
  updatedCardData: Partial<ILabel>[]
) => {
  dispatch(
    myApi.util.updateQueryData("getSingleBoard", boardId, (draft) => {
      draft.data.lists.forEach((list) => {
        list.cards.forEach((card) => {
          if (card._id === cardId) {
            card.labels.forEach((label) => {
              const updatedLabel = updatedCardData.find(
                (l) => l._id === label._id
              );
              if (updatedLabel) {
                Object.assign(label, updatedLabel);
              }
            });
          }
        });
      });
    })
  );
};
