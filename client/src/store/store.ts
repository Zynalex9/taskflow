import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./ThemeSlice";
import authReducer from "./AuthSlice";
import workspaceReducer from "./workspaceSlice";
import workspacesReducer from "./workspacesSlice";
import cardReducer from "./CardSlice";
import navbarReducer from "./NavBarSlice";
import forgetReducer from "./ForgetSlice";
import BoardBackgroundReducer from "./BoardBGSlice";
import CardModalReducer from "./CardModalStatesSlice";
import { boardsReducer, boardReducer } from "./BoardSlice";
import { myApi } from "./myApi";
import { cardApi } from "./cardApi";

const store = configureStore({
  reducer: {
    cardModalState: CardModalReducer,
    theme: themeReducer,
    auth: authReducer,
    workspace: workspaceReducer,
    workspaces: workspacesReducer,
    boards: boardsReducer,
    board: boardReducer,
    card: cardReducer,
    navControl: navbarReducer,
    resetPassword: forgetReducer,
    boardModalControll: BoardBackgroundReducer,
    [myApi.reducerPath]: myApi.reducer,
    [cardApi.reducerPath]: cardApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(myApi.middleware, cardApi.middleware),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
