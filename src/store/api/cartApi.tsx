import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';
import { read_cookie } from 'sfcookies';

interface ICheckOutInput {
  products: {
    productId: string;
    quantity: number;
  }[];
}

const getAccessToken = () => {
  if (typeof window !== 'undefined') {
    return read_cookie('token');
  } else {
    return null;
  }
};

export const cartsApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API}/api/carts`,
  }),
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  reducerPath: 'cartsApi',
  tagTypes: ['GetCart'],
  endpoints: (build) => ({
    getCart: build.query({
      query: (token?: string) => {
        return {
          url: ``,
          method: 'GET',
          headers: {
            authorization: `Bearer ${token || getAccessToken()}`, // pass the user token(authenticated identifier) to get his cart record
          },
        };
      },
      providesTags: ['GetCart'],
    }),

    checkOut: build.mutation({
      query: (checkOutInput: ICheckOutInput, token?: string) => {
        return {
          url: `/checkout`,
          method: 'POST',
          body: checkOutInput,
          headers: {
            authorization: `Bearer ${token || getAccessToken()}`,
          },
        };
      },
    }),
    // createProduct: build.mutation({
    //   query: (newProduct: INewProduct, token?: string) => {
    //     return {
    //       url: ``,
    //       method: 'POST',
    //       body: newProduct,
    //       headers: {
    //         authorization: `Bearer ${token || getAccessToken()}`,
    //       },
    //     };
    //   },
    // }),

    // updateProduct: build.mutation({
    //   query: (updateProduct: IUpdateProduct, token?: string) => {
    //     const id = updateProduct.id;
    //     return {
    //       url: `/${id}`,
    //       method: 'PUT',
    //       body: updateProduct,
    //       headers: {
    //         authorization: `Bearer ${token || getAccessToken()}`,
    //       },
    //     };
    //   },
    // }),
  }),
});

export const {
  useLazyGetCartQuery,
  useCheckOutMutation,
  util: { getRunningQueriesThunk, getRunningMutationsThunk },
} = cartsApi;
export const { getCart, checkOut } = cartsApi.endpoints;
