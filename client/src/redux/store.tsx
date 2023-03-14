import { configureStore } from "@reduxjs/toolkit";
import userDataReducer from "./userData";
import authReducer from "./auth";

export default configureStore({
  reducer: {
    auth: authReducer,
    userData: userDataReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
