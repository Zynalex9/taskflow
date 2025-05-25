import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./ThemeSlice";
import authReducer from "./AuthSlice";
import workspaceReducer from "./workspaceSlice";
import cardReducer from "./CardSlice";
import navbarReducer from "./NavBarSlice";
import forgetReducer from "./ForgetSlice";
import BoardBackgroundReducer from "./BoardBGSlice";
import { boardsReducer, boardReducer } from "./BoardSlice";
const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    workspace: workspaceReducer,
    boards: boardsReducer,
    board: boardReducer,
    card: cardReducer,
    navControl: navbarReducer,
    resetPassword: forgetReducer,
    boardModalControll: BoardBackgroundReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
