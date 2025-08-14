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
  newLabels: ILabel[]
) => {
  dispatch(
    myApi.util.updateQueryData("getSingleBoard", boardId, (draft) => {
      for (const list of draft.data.lists) {
        const card = list.cards.find((card) => card._id === cardId);
        if (card) {
          card.labels = [...card.labels, ...newLabels];
        }
      }
    })
  );
};
export const syncBoardtoRemovedLabels = async (
  dispatch: AppDispatch,
  cardId: string,
  boardId: string,
  labelColor: string
) => {
  dispatch(
    myApi.util.updateQueryData("getSingleBoard", boardId, (draft) => {
      for (const list of draft.data.lists) {
        const card = list.cards.find((card) => card._id === cardId);
        if (card) {
          card.labels = card.labels.filter(
            (label) => label.color !== labelColor
          );
        }
      }
    })
  );
};
export const syncBoardToDeletedCards = async (
  dispatch: AppDispatch,
  cardId: string,
  boardId: string
) => {
  dispatch(
    myApi.util.updateQueryData("getSingleBoard", boardId, (draft) => {
      for (const list of draft.data.lists) {
        list.cards = list.cards.filter((card) => card._id !== cardId);
      }
    })
  );
};
