import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';
import { read_cookie } from 'sfcookies';

interface ICheckOutInput {
  serialNumber: string;
  products: {
    productId: string;
    quantity: number;
  }[];
}

interface IAddToCartInput {
  productId: string;
  quantity: number;
  color?: string;
  application?: string;
  id?: string
}

interface IGCashPayment {
  externalId: string;
  amount: number;
  phoneNumber: string;
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

    addToCart: build.mutation({
      query: (checkOutInput: IAddToCartInput, token?: string) => {
        return {
          url: ``,
          method: 'POST',
          body: checkOutInput,
          headers: {
            authorization: `Bearer ${token || getAccessToken()}`,
          },
        };
      },
    }),

    removeCartItems: build.mutation({
      query: ({ cartId, productCartRecordIds }: { cartId: string, productCartRecordIds: string[] }, token?: string) => {
        return {
          url: `/${cartId}/delete-multiple`,
          method: 'DELETE',
          body: { productCartRecordIds },
          headers: {
            authorization: `Bearer ${token || getAccessToken()}`,
          },
        };
      },
    }),

    gcashPayment: build.mutation({
      query: (gCashPaymentInput: IGCashPayment, token?: string) => {
        return {
          url: `/payment`,
          method: 'POST',
          body: gCashPaymentInput,
          headers: {
            authorization: `Bearer ${token || getAccessToken()}`,
          },
        };
      },
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
    updateCartItemQuantity: build.mutation({
      query: (updateCartItem: IAddToCartInput, token?: string) => {
        return {
          url: `/`,
          method: 'PUT',
          body: updateCartItem,
          headers: {
            authorization: `Bearer ${token || getAccessToken()}`,
          },
        };
      },
    }),
  }),
});

export const {
  useLazyGetCartQuery,
  useCheckOutMutation,
  useAddToCartMutation,
  useUpdateCartItemQuantityMutation,
  useGcashPaymentMutation,
  useRemoveCartItemsMutation,
  util: { getRunningQueriesThunk, getRunningMutationsThunk },
} = cartsApi;
export const {
  getCart,
  checkOut,
  addToCart,
  updateCartItemQuantity,
  gcashPayment,
  removeCartItems
} = cartsApi.endpoints;
