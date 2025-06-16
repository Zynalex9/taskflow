import { IWorkspace } from "@/types/functionalites.types";
import { createContext, useContext } from "react";

type workspacesContextType = IWorkspace[] | undefined;
const WorkspacesContext = createContext<workspacesContextType>(undefined);
export const useWorkspaces = () => useContext(WorkspacesContext);
export default WorkspacesContext;
