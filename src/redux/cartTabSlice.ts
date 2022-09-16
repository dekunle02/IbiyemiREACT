import { CartItem } from "../api/interfaces";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";

// Define a type for the slice state
interface CartTabState {
  cartTab2DArr: CartItem[][];
  activeCartIdx: number;
}

// Define the initial state using that type
const initialState: CartTabState = {
  cartTab2DArr: [[]],
  activeCartIdx: 0,
};

export const cartTabSlice = createSlice({
  name: "cartTab2DArr",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setCartTabState: (
      state: CartTabState,
      action: PayloadAction<CartItem[][]>
    ) => {
      state.cartTab2DArr = action.payload;
    },
    clearCartTabState: (state: CartTabState) => {
      state.cartTab2DArr = [[]];
      state.activeCartIdx = 0;
    },
    setActiveCartIdx: (state: CartTabState, action: PayloadAction<number>) => {
      state.activeCartIdx = action.payload;
    },
  },
});

export const { setCartTabState, clearCartTabState, setActiveCartIdx } =
  cartTabSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectUser = (state: RootState) => state;

export default cartTabSlice.reducer;
