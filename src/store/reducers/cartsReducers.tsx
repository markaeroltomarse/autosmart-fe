import { createSlice } from '@reduxjs/toolkit';

interface IInitialState {
  cart: { productId: string; quantity: number }[];
}

const initialState: IInitialState = {
  cart: [],
};

const cartSlice = createSlice({
  name: 'productSlice',
  initialState,
  reducers: {
    tempSetCart(state, { payload }) {
      state.cart = payload;
    },
    tempAddToCart(state, { payload }) {
      if (!state.cart.some((item) => item.productId === payload.productId)) {
        state.cart = [...state.cart, payload];
      }
    },
  },
  extraReducers(builder) {},
});

export const { tempAddToCart, tempSetCart } = cartSlice.actions;
export default cartSlice;
