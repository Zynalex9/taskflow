import { IBoard } from "@/types/functionalites.types";
import { createContext, useContext } from "react";
type SingleBoardContextType = {
  board: IBoard;
};
export const SingleBoardContext = createContext<
  SingleBoardContextType | undefined
>(undefined);
export const useSingleBoardContext = () => {
  const context = useContext(SingleBoardContext);
  if (!context) {
    throw new Error(
      "useSingleBoardContext must be used within SingleBoardContext.Provider"
    );
  }
  return context;
};
