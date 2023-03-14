import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../config/types";

type UserDataState = User | undefined;

const initialState: UserDataState = undefined;

export const userDataSlice = createSlice({
  name: "userData",
  initialState: initialState as UserDataState,
  reducers: {
    setUserData: (state, action: PayloadAction<UserDataState>) => {
      state = action.payload;
    },

    clearUserData: (state) => {
      state = undefined;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUserData, clearUserData } = userDataSlice.actions;

export default userDataSlice.reducer;
