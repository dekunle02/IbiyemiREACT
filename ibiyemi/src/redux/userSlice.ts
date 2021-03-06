import { User, Token } from "../api/interfaces";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";

// Define a type for the slice state
interface UserState {
  user: User;
  token: Token;
}

// Define the initial state using that type
const initialState: UserState = {
  user: { id: 0, username: "", type: "" },
  token: { access: "", refresh: "" },
};

export const userSlice = createSlice({
  name: "user",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    signOut: (state: UserState) => {
      state.user = initialState.user;
      state.token = initialState.token;
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    setUserAndToken: (state: UserState, action: PayloadAction<UserState>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setUser: (state: UserState, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
});

export const { signOut, setUserAndToken, setUser } = userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectUser = (state: RootState) => state;

export default userSlice.reducer;
