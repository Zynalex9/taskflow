import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./ThemeSlice";
import authReducer from "./AuthSlice";
import workspaceReducer from "./workspaceSlice";
import {boardsReducer,boardReducer} from "./BoardSlice"; 
const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    workspace: workspaceReducer,
    boards:boardsReducer,
    board:boardReducer
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
