import { ICartItem, ICartType } from '@/hooks/useCart';
import { createSlice } from '@reduxjs/toolkit';

interface IInitialState {
  cart: ICartType | null;
}

const initialState: IInitialState = {
  cart: null,
};

const cartSlice = createSlice({
  name: 'cartReducer',
  initialState,
  reducers: {
    setCart(state, { payload }) {
      state.cart = payload;
    },
    addToCart(state, { payload }: { payload: ICartItem }) {
      if (!state.cart) return

      const isExist = state.cart?.products.findIndex((item) =>
        item.product.id === payload.product.id &&

        // Check the product property
        item.product.application === payload.product.application &&
        item.product.color === payload.product.color
      )
      if (isExist && isExist >= 0) {
        state.cart.products[isExist].quantity += 1
      } else {
        state.cart.products = [...state.cart.products, payload]
      }
    },
  },
  extraReducers(builder) { },
});

export const { addToCart, setCart } = cartSlice.actions;
export default cartSlice;
