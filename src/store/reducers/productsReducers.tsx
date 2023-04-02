import { createSlice } from '@reduxjs/toolkit';
import { getProducts } from '../api/productsApi';


const initialState = {
  products: [],
};

const productSlice = createSlice({
  name: 'productSlice',
  initialState,
  reducers: {
    setProducts(state, { payload }) {
      state.products = payload;
    },
  },
  extraReducers(builder) {
    builder.addMatcher(getProducts.matchFulfilled, (state, { payload }) => {
      //state.getProducts = payload?.data?.data;
    });
  },
});

export const { setProducts } = productSlice.actions;
export default productSlice.reducer;
