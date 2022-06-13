import { CartItem, Product } from "../api/interfaces";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";

// Define a type for the slice state
interface CartState {
  cartItemArr: CartItem[];
}

// Define the initial state using that type
const initialState: CartState = {
  cartItemArr: [],
};

export const cartSlice = createSlice({
  name: "cartItemArr",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setCartItemArr: (state: CartState, action: PayloadAction<CartItem[]>) => {
      state.cartItemArr = action.payload;
    },
    clearCartItemArr: (state: CartState) => {
      state.cartItemArr = [];
    },
  },
});

export const { setCartItemArr, clearCartItemArr } = cartSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectUser = (state: RootState) => state;

export default cartSlice.reducer;
