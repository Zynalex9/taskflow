import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./ThemeSlice";
import authReducer from "./AuthSlice";
import workspaceReducer from "./workspaceSlice";
const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    workspace: workspaceReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
