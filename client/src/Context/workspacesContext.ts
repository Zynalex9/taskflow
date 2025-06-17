import { IWorkspace } from "@/types/functionalites.types";
import { createContext, useContext } from "react";

type WorkspacesContextType = {
  workspaces: IWorkspace[];
  setWorkspaces: React.Dispatch<React.SetStateAction<IWorkspace[]>>;
};

const WorkspacesContext = createContext<WorkspacesContextType | undefined>(
  undefined
);

export const useWorkspaces = () => {
  const context = useContext(WorkspacesContext);
  if (!context) {
    throw new Error(
      "useWorkspaces must be used within WorkspacesContext.Provider"
    );
  }
  return context;
};

export default WorkspacesContext;
