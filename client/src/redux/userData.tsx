import { createSlice } from "@reduxjs/toolkit";

export const userDataSlice = createSlice({
  name: "userData",
  initialState: {
    value: undefined,
  },
  reducers: {
    setUserData: (state, action) => {
      state.value = action.payload;
    },
    removeUserData: (state) => {
      state.value = undefined;
    },
  },
});

// Action creators are generated for each case reducer function
export const { removeUserData, setUserData } = userDataSlice.actions;

export default userDataSlice.reducer;
