import { Action, createSlice, PayloadAction } from "@reduxjs/toolkit";

type AuthState = {
  loggedIn: boolean;
  authToken?: string;
};

const initialState: AuthState = {
  loggedIn: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.loggedIn = action.payload;
    },

    setAuthToken: (state, action: PayloadAction<string | undefined>) => {
      state.authToken = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setLoggedIn: setLoggedInReducer, setAuthToken: setAuthTokenReducer } = authSlice.actions;

export default authSlice.reducer;
