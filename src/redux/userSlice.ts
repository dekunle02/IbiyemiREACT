import { User, Token, BusinessInfo } from "../api/interfaces";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";

// Define a type for the slice state
interface UserState {
  user: User;
  token: Token;
  businessInfo: BusinessInfo;
}

// Define the initial state using that type
const initialState: UserState = {
  user: { id: 0, username: "", type: "" },
  token: { access: "", refresh: "" },
  businessInfo: {
    address:
      "Opposite Osogbo City Hall, Beside UBA building Olonkoro Igbona Osogbo",
    phone_numbers: "08038866656, 08032199732",
    receipt_message: "Thank you for shopping with us!",
  },
};

export const userSlice = createSlice({
  name: "user",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    signOut: (state: UserState) => {
      state.user = initialState.user;
      state.token = initialState.token;
      state.businessInfo = initialState.businessInfo;
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    setUserAndToken: (
      state: UserState,
      action: PayloadAction<{ user: User; token: Token }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setUser: (state: UserState, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setBusinessInfo: (
      state: UserState,
      action: PayloadAction<BusinessInfo>
    ) => {
      state.businessInfo = action.payload;
    },
  },
});

export const { signOut, setUserAndToken, setUser, setBusinessInfo } =
  userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectUser = (state: RootState) => state;

export default userSlice.reducer;
