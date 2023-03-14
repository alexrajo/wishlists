import { configureStore } from "@reduxjs/toolkit";
import userDataReducer from "./userData";
import authReducer from "./auth";

export const store = configureStore({
  reducer: {
    userData: userDataReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
